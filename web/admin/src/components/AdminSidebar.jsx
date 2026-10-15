import { ChemWizBrand } from './ChemWizBrand.jsx';

export function AdminSidebar({ admin, busy, handleRefresh, handleLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <ChemWizBrand />

<p>Admin Dashboard</p>
      </div>

      <div className="admin-mini-card">
        <span>Logged in as</span>
        <strong>{admin?.name || "Admin"}</strong>
        <small>{admin?.email}</small>
      </div>

      <button className="ghost-button" onClick={handleRefresh} disabled={busy}>
        Refresh
      </button>
      <a className="ghost-button workspace-link" href="/">ChemWiz home</a>
      <a className="ghost-button workspace-link" href="/student/">Student workspace</a>

      <button className="danger-button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
