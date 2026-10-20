import { recoveryToken } from '../../../shared/AccountRecovery.jsx';
import { ChemWizBrand } from './components/ChemWizBrand.jsx';
import { useEffect, useRef, useState } from "react";
import "./styles/admin.css";
import { adminLoginMessage, isAdminAuthError } from './config/session.mjs';

import {
  checkAdmin,
  trashUserAccount,
  getAdminLogs,
  getAdminStats,
  getAdminUsers,
  loginAdmin,
  updateUserRole,
  updateUserStatus,
  updateUserSubscription,
} from "./config/api";

import { AdminLogin } from "./screens/AdminLogin.jsx";
import { AdminDashboard } from "./screens/AdminDashboard.jsx";

const TOKEN_KEY = "chemwiz.admin.token";

export default function App() {
  const sessionEpoch = useRef(0);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [admin, setAdmin] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [stats, setStats] = useState(null);
  const [recordsVersion, setRecordsVersion] = useState(0);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [usersOpen, setUsersOpen] = useState(false);
  const [usersStatus, setUsersStatus] = useState('idle');
  const [usersError, setUsersError] = useState('');
  const usersExpanded = useRef(false);
  const usersState = useRef('idle');
  const usersRequest = useRef(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [roleFilter, setRoleFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");

  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [upgradeToken,setUpgradeToken] = useState("");

  async function loadStats(activeToken, epoch = sessionEpoch.current) {
    const data = await getAdminStats(activeToken);
    if (epoch === sessionEpoch.current) setStats(data.stats || null);
  }

  async function loadUsers(activeToken, overrides = {}, epoch = sessionEpoch.current) {
    const request = ++usersRequest.current;
    usersState.current = 'loading'; setUsersStatus('loading'); setUsersError('');
    try {
      const data = await getAdminUsers(activeToken, {
      search,
      role: roleFilter,
      subscriptionTier: tierFilter,
      subscriptionStatus: subStatusFilter,
      accountStatus: accountStatusFilter,
      page,
      limit: 20,
      ...overrides,
    });

    if (epoch === sessionEpoch.current && request === usersRequest.current) {
      setUsers(data.users || []);
      setPagination(data.pagination || null);
      usersState.current = 'loaded'; setUsersStatus('loaded');
    }
    } catch (error) {
      if (epoch === sessionEpoch.current && request === usersRequest.current) {
        usersState.current = 'error'; setUsersStatus('error'); setUsersError(error.message || 'Could not load users.');
      }
      throw error;
    }
  }

  function toggleUsers(open) {
    usersExpanded.current = open; setUsersOpen(open);
    if (open && ['idle', 'error'].includes(usersState.current)) {
      const epoch = sessionEpoch.current;
      loadUsers(token, {}, epoch).catch(error => {
        if (epoch === sessionEpoch.current && isAdminAuthError(error)) setError(adminLoginMessage(error));
      });
    }
  }

  async function loadLogs(activeToken, epoch = sessionEpoch.current) {
    const data = await getAdminLogs(activeToken);
    if (epoch === sessionEpoch.current) setLogs(data.logs || []);
  }

  async function loadDashboard(activeToken, initial = false, epoch = sessionEpoch.current) {
    const panels = [['statistics', () => loadStats(activeToken, epoch)], ['audit logs', () => loadLogs(activeToken, epoch)]];
    if (usersExpanded.current) panels.push(['users', () => loadUsers(activeToken, initial ? { page: 1 } : {}, epoch)]);
    const results = await Promise.allSettled(panels.map(([, load]) => load()));
    if (epoch !== sessionEpoch.current) return;
    const denied = results.find(result => result.status === 'rejected' && isAdminAuthError(result.reason));
    if (denied) throw denied.reason;
    const names = panels.map(([name]) => name);
    const missing = results.flatMap((result,index) => result.status === 'rejected' ? [names[index]] : []);
    setError(missing.length ? `You are signed in. Could not load ${missing.join(', ')}. Use Refresh to retry.` : '');
  }

  async function bootstrap(activeToken) {
    const epoch = ++sessionEpoch.current;
    setLoading(true);
    setError('');
    try {
      // Establish admin authority independently of optional dashboard panels.
      const test = await checkAdmin(activeToken);
      if (epoch !== sessionEpoch.current) return;
      setAdmin(test.admin); setPage(1);
      usersExpanded.current = false; setUsersOpen(false);
      usersState.current = 'idle'; setUsersStatus('idle'); setUsersError('');
      usersRequest.current++; setUsers([]); setPagination(null);
      await loadDashboard(activeToken, true, epoch);
    } catch (err) {
      if (epoch !== sessionEpoch.current) return;
      if (isAdminAuthError(err)) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(''); setAdmin(null); setStats(null); setUsers([]); setLogs([]); setPagination(null);
      }
      setError(adminLoginMessage(err));
    } finally { if (epoch === sessionEpoch.current) setLoading(false); }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if(recoveryToken()) {setLoading(false);return;}
    if (savedToken) bootstrap(savedToken);
    return () => { sessionEpoch.current++; };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const data = await loginAdmin({ email, password });
      if (!data.token || !data.user) throw new Error('The login response is incomplete. Check the deployed application version.');
      if (data.user.role !== 'admin') throw new Error('This account does not have admin privileges. Open the Student workspace or use an existing admin account.');
      setPassword('');

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);

      await bootstrap(data.token);
    } catch (err) {
      if(err.data?.code === 'PASSWORD_UPGRADE_REQUIRED') {setUpgradeToken(err.data.upgradeToken);setPassword('');setError('');}
      else setError(adminLoginMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    sessionEpoch.current++;
    localStorage.removeItem(TOKEN_KEY);

    setToken("");
    setAdmin(null);
    setStats(null);
    setUsers([]);
    setLogs([]);
    setPagination(null);
    usersExpanded.current = false; setUsersOpen(false);
    usersState.current = 'idle'; setUsersStatus('idle'); setUsersError(''); usersRequest.current++;

    setSearch("");
    setRoleFilter("");
    setTierFilter("");
    setSubStatusFilter("");
    setAccountStatusFilter("");
    setPage(1);

    setError("");
  }

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!token) return;

    setBusy(true);
    setError("");

    try {
      setPage(1);
      await loadUsers(token, { page: 1 });
    } catch (err) {
      setError(err.message || "Could not search users.");
    } finally {
      setBusy(false);
    }
  }

  async function handleClearFilters() {
    if (!token) return;

    setSearch("");
    setRoleFilter("");
    setTierFilter("");
    setSubStatusFilter("");
    setAccountStatusFilter("");
    setPage(1);

    setBusy(true);
    setError("");

    try {
      await loadUsers(token, {
        search: "",
        role: "",
        subscriptionTier: "",
        subscriptionStatus: "",
        accountStatus: "",
        page: 1,
      });
    } catch (err) {
      setError(err.message || "Could not clear filters.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    if (!token) return;

    setBusy(true);
    setError("");
    if (!usersExpanded.current) {
      usersRequest.current++; usersState.current = 'idle'; setUsersStatus('idle');
    }

    try {
      await loadDashboard(token);
    } catch (err) {
      setError(err.message || "Could not refresh dashboard.");
    } finally {
      setBusy(false);
    }
  }

  async function mutateUser(action, message) {
    if (!token) return;
    const epoch = sessionEpoch.current;
    setBusy(true); setError('');
    try {
      await action();
      if (epoch !== sessionEpoch.current) return;
      await Promise.all([
        loadStats(token, epoch), loadLogs(token, epoch),
        ...(usersExpanded.current ? [loadUsers(token, {}, epoch)] : []),
      ]);
      if (!usersExpanded.current) { usersState.current = 'idle'; setUsersStatus('idle'); }
    } catch (error) {
      if (epoch === sessionEpoch.current) setError(error.message || message);
    } finally { if (epoch === sessionEpoch.current) setBusy(false); }
  }
  const handleSubscriptionChange = (userId, payload) => mutateUser(
    () => updateUserSubscription(token, userId, payload), 'Could not update subscription.');
  const handleAccountStatusChange = (userId, status) => mutateUser(
    () => updateUserStatus(token, userId, { accountStatus: status }), 'Could not update account status.');
  const handleRoleChange = (userId, role) => mutateUser(
    () => updateUserRole(token, userId, { role }), 'Could not update user role.');

  async function handleTrashUser(userId, payload) {
    const epoch = sessionEpoch.current; setBusy(true); setError('');
    try {
      const result = await trashUserAccount(token, userId, payload);
      if (epoch === sessionEpoch.current) { await loadDashboard(token, false, epoch); setRecordsVersion(value => value + 1); }
      return result;
    } finally { if (epoch === sessionEpoch.current) setBusy(false); }
  }
  function handleRecordsChanged() { setRecordsVersion(value => value + 1); handleRefresh(); }

  async function goToPage(nextPage) {
    if (!token || nextPage < 1) return;

    setBusy(true);
    setError("");

    try {
      setPage(nextPage);
      await loadUsers(token, { page: nextPage });
    } catch (err) {
      setError(err.message || "Could not load page.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-shell center">
        <div className="loader-card">
          <ChemWizBrand />
          <h1>Loading ChemWiz Admin…</h1>
        </div>
      </div>
    );
  }

  if (!token || !admin) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        busy={busy}
        error={error}
        handleLogin={handleLogin}
        upgradeToken={upgradeToken}
        clearUpgrade={()=>{setUpgradeToken('');setPassword('');setError('');}}
        onRecoveryDone={()=>{setToken('');setAdmin(null);}}
        retrySession={token ? () => bootstrap(token) : null}
      />
    );
  }

  return (
    <AdminDashboard
      admin={admin}
      token={token}
      recordsVersion={recordsVersion}
      onRecordsChanged={handleRecordsChanged}
      handleTrashUser={handleTrashUser}
      busy={busy}
      error={error}
      stats={stats}
      users={users}
      usersOpen={usersOpen}
      usersStatus={usersStatus}
      usersError={usersError}
      onUsersToggle={toggleUsers}
      logs={logs}
      search={search}
      setSearch={setSearch}
      roleFilter={roleFilter}
      setRoleFilter={setRoleFilter}
      tierFilter={tierFilter}
      setTierFilter={setTierFilter}
      subStatusFilter={subStatusFilter}
      setSubStatusFilter={setSubStatusFilter}
      accountStatusFilter={accountStatusFilter}
      setAccountStatusFilter={setAccountStatusFilter}
      pagination={pagination}
      page={page}
      handleRefresh={handleRefresh}
      handleLogout={handleLogout}
      handleSearch={handleSearch}
      handleClearFilters={handleClearFilters}
      handleRoleChange={handleRoleChange}
      handleSubscriptionChange={handleSubscriptionChange}
      handleAccountStatusChange={handleAccountStatusChange}
      goToPage={goToPage}
    />
  );
}
