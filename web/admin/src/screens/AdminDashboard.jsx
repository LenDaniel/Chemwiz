import { LazyRecordPanel } from '../components/LazyRecordPanel.jsx';
import {PrivacyAdmin} from '../components/PrivacyAdmin.jsx';
import { useState } from "react";

import { AdminSidebar } from "../components/AdminSidebar.jsx";
import { StatsGrid } from "../components/StatsGrid.jsx";
import { LazyUsersPanel } from "../components/LazyUsersPanel.jsx";
import { UserDetailsModal } from "../components/UserDetailsModal.jsx";
import { AdminLogsPanel } from "../components/AdminLogsPanel.jsx";

export function AdminDashboard({
  admin,
  token,
  recordsVersion,
  onRecordsChanged,
  handleTrashUser,
  busy,
  error,
  stats,
  users,
  usersOpen,
  usersStatus,
  usersError,
  onUsersToggle,
  logs,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  tierFilter,
  setTierFilter,
  subStatusFilter,
  setSubStatusFilter,
  accountStatusFilter,
  setAccountStatusFilter,
  pagination,
  page,
  handleRefresh,
  handleLogout,
  handleSearch,
  handleClearFilters,
  handleRoleChange,
  handleSubscriptionChange,
  handleAccountStatusChange,
  goToPage,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersActivated, setUsersActivated] = useState(false);

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#admin-main-content">Skip to dashboard</a>
      <AdminSidebar
        admin={admin}
        busy={busy}
        handleRefresh={handleRefresh}
        handleLogout={handleLogout}
      />

      <main id="admin-main-content" tabIndex={-1} className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CONTROL CENTER</p>
            <h1>Dashboard</h1>
          </div>

          <div className="status-pill">
            {busy ? "Working..." : "System active"}
          </div>
        </header>

        {error && <div className="error-box wide" role="alert">{error}</div>}

        <StatsGrid stats={stats} />
        <PrivacyAdmin token={token}/>

        <section className="panel users-section" aria-label="Users and subscriptions administration">
          <h2 className="users-section-heading"><button type="button" className="users-section-toggle"
            aria-expanded={usersOpen} aria-controls="admin-users-content" onClick={() => {
              if (!usersOpen) setUsersActivated(true);
              onUsersToggle(!usersOpen);
            }}>
            <span>Users &amp; Subscriptions</span><span aria-hidden="true">{usersOpen ? '▾' : '▸'}</span>
          </button></h2>
          {!usersActivated && <p className="users-section-hint">Open to load accounts, filters and subscription controls.</p>}
          <div id="admin-users-content" hidden={!usersOpen}>
        {usersActivated && <LazyUsersPanel
          users={users}
          handleTrashUser={handleTrashUser}
          status={usersStatus}
          visible={usersOpen}
          error={usersError}
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
          handleSearch={handleSearch}
          handleClearFilters={handleClearFilters}
          busy={busy || usersStatus === 'loading'}
          handleRoleChange={handleRoleChange}
          handleSubscriptionChange={handleSubscriptionChange}
          handleAccountStatusChange={handleAccountStatusChange}
          pagination={pagination}
          page={page}
          goToPage={goToPage}
          onViewUser={setSelectedUser}
          currentAdminId={admin?.id}
        />}
          </div>
        </section>

        <RecordSection title="Recycle bin" kind="bin" token={token} version={recordsVersion} onChanged={onRecordsChanged} />
        <RecordSection title="Content & Sources" kind="content" token={token} version={recordsVersion} onChanged={onRecordsChanged} />
        <AdminLogsPanel logs={logs || []} />
      </main>

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

function RecordSection({ title, kind, token, version, onChanged }) {
  const [open, setOpen] = useState(false), [activated, setActivated] = useState(false);
  return <section className="panel record-section"><h2 className="users-section-heading"><button type="button" className="users-section-toggle" aria-expanded={open} aria-controls={'admin-records-' + kind} onClick={() => {setOpen(!open);setActivated(true);}}><span>{title}</span><span aria-hidden="true">{open?'▾':'▸'}</span></button></h2>
    <div id={'admin-records-' + kind} hidden={!open}>{activated && <LazyRecordPanel kind={kind} token={token} visible={open} version={version} onChanged={onChanged} />}</div>
  </section>;
}
