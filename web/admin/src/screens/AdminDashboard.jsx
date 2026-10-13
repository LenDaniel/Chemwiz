import { useState } from "react";

import { AdminSidebar } from "../components/AdminSidebar.jsx";
import { StatsGrid } from "../components/StatsGrid.jsx";
import { UsersPanel } from "../components/UsersPanel.jsx";
import { UserDetailsModal } from "../components/UserDetailsModal.jsx";
import { AdminLogsPanel } from "../components/AdminLogsPanel.jsx";

export function AdminDashboard({
  admin,
  busy,
  error,
  stats,
  users,
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

  return (
    <div className="admin-shell">
      <AdminSidebar
        admin={admin}
        busy={busy}
        handleRefresh={handleRefresh}
        handleLogout={handleLogout}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CONTROL CENTER</p>
            <h1>Dashboard</h1>
          </div>

          <div className="status-pill">
            {busy ? "Working..." : "System active"}
          </div>
        </header>

        {error && <div className="error-box wide">{error}</div>}

        <StatsGrid stats={stats} />

        <UsersPanel
          users={users}
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
          busy={busy}
          handleRoleChange={handleRoleChange}
          handleSubscriptionChange={handleSubscriptionChange}
          handleAccountStatusChange={handleAccountStatusChange}
          pagination={pagination}
          page={page}
          goToPage={goToPage}
          onViewUser={setSelectedUser}
          currentAdminId={admin?.id}
        />

        <AdminLogsPanel logs={logs || []} />
      </main>

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}