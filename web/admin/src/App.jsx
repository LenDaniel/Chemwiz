import { ChemWizBrand } from './components/ChemWizBrand.jsx';
import { useEffect, useState } from "react";
import "./styles/admin.css";

import {
  checkAdmin,
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
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [admin, setAdmin] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [roleFilter, setRoleFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");

  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadStats(activeToken) {
    const data = await getAdminStats(activeToken);
    setStats(data.stats || null);
  }

  async function loadUsers(activeToken, overrides = {}) {
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

    setUsers(data.users || []);
    setPagination(data.pagination || null);
  }

  async function loadLogs(activeToken) {
    const data = await getAdminLogs(activeToken);
    setLogs(data.logs || []);
  }

  async function bootstrap(activeToken) {
    setLoading(true);
    setError("");

    try {
      const test = await checkAdmin(activeToken);
      setAdmin(test.admin);

      await Promise.all([
        loadStats(activeToken),
        loadUsers(activeToken, { page: 1 }),
        loadLogs(activeToken),
      ]);
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY);

      setToken("");
      setAdmin(null);
      setStats(null);
      setUsers([]);
      setLogs([]);
      setPagination(null);

      setError(err.message || "Admin session failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const [test, statsData, usersData, logsData] = await Promise.all([
          checkAdmin(savedToken),
          getAdminStats(savedToken),
          getAdminUsers(savedToken, { page: 1, limit: 20 }),
          getAdminLogs(savedToken),
        ]);

        if (cancelled) return;

        setAdmin(test.admin);
        setStats(statsData.stats || null);
        setUsers(usersData.users || []);
        setPagination(usersData.pagination || null);
        setLogs(logsData.logs || []);
        setError("");
      } catch (err) {
        if (cancelled) return;

        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAdmin(null);
        setStats(null);
        setUsers([]);
        setLogs([]);
        setPagination(null);
        setError(err.message || "Admin session failed.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const data = await loginAdmin({ email, password });

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);

      await bootstrap(data.token);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);

    setToken("");
    setAdmin(null);
    setStats(null);
    setUsers([]);
    setLogs([]);
    setPagination(null);

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

    try {
      await Promise.all([
        loadStats(token),
        loadUsers(token),
        loadLogs(token),
      ]);
    } catch (err) {
      setError(err.message || "Could not refresh dashboard.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubscriptionChange(userId, payload) {
    if (!token) return;

    setBusy(true);
    setError("");

    try {
      await updateUserSubscription(token, userId, payload);

      await Promise.all([
        loadStats(token),
        loadUsers(token),
        loadLogs(token),
      ]);
    } catch (err) {
      setError(err.message || "Could not update subscription.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAccountStatusChange(userId, accountStatus) {
    if (!token) return;

    setBusy(true);
    setError("");

    try {
      await updateUserStatus(token, userId, { accountStatus });

      await Promise.all([
        loadStats(token),
        loadUsers(token),
        loadLogs(token),
      ]);
    } catch (err) {
      setError(err.message || "Could not update account status.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRoleChange(userId, role) {
  if (!token) return;

  setBusy(true);
  setError("");

  try {
    await updateUserRole(token, userId, { role });

    await Promise.all([
      loadStats(token),
      loadUsers(token),
      loadLogs(token),
    ]);
  } catch (err) {
    setError(err.message || "Could not update user role.");
  } finally {
    setBusy(false);
  }
}

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
      />
    );
  }

  return (
    <AdminDashboard
      admin={admin}
      busy={busy}
      error={error}
      stats={stats}
      users={users}
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