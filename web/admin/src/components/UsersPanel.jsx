import { RecordConfirmDialog } from './RecordConfirmDialog.jsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
export function UsersPanel({
  users,
  handleTrashUser,
  status,
  visible,
  error,
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
  handleSearch,
  handleClearFilters,
  busy,
  handleRoleChange,
  handleSubscriptionChange,
  handleAccountStatusChange,
  pagination,
  page,
  goToPage,
  onViewUser,
  currentAdminId,
}) {
  const [deleteAction, setDeleteAction] = useState(null);
  const tableRef = useRef(null);
  const lastScroll = useRef(0), visibleRef = useRef(visible);
  visibleRef.current = visible;
  const [scroll, setScroll] = useState({ left: 0, max: 0 });
  useLayoutEffect(() => { if (visible && tableRef.current) tableRef.current.scrollLeft = lastScroll.current; }, [visible]);
  useEffect(() => {
    const region = tableRef.current;
    if (!region) return undefined;
    const measure = () => {
      if (!visibleRef.current || !region.clientWidth) return;
      lastScroll.current = region.scrollLeft;
      setScroll({ left: region.scrollLeft, max: Math.max(0, region.scrollWidth - region.clientWidth) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(region); observer.observe(region.querySelector('table'));
    region.addEventListener('scroll', measure, { passive: true }); measure();
    return () => { observer.disconnect(); region.removeEventListener('scroll', measure); };
  }, []);
  const moveTable = value => { if (tableRef.current) tableRef.current.scrollLeft = value; };
  const confirmRoleChange = (user, role) => {
    if (user.id === currentAdminId && role !== "admin") {
      window.alert("You cannot remove your own admin role.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm role change?\n\nUser: ${user.email}\nNew role: ${role}`
    );

    if (!confirmed) return;

    handleRoleChange(user.id, role);
  };

  const confirmSubscriptionChange = (user, payload) => {
    let changeLabel = "subscription";

    if (payload.subscriptionTier !== undefined) {
      changeLabel = `subscription tier to "${payload.subscriptionTier}"`;
    }

    if (payload.subscriptionStatus !== undefined) {
      changeLabel = `subscription status to "${payload.subscriptionStatus}"`;
    }

    if (payload.subscriptionExpiresAt !== undefined) {
      changeLabel = payload.subscriptionExpiresAt
        ? `subscription expiry to "${payload.subscriptionExpiresAt}"`
        : "subscription expiry to no expiry";
    }

    const confirmed = window.confirm(
      `Confirm change for ${user.email}?\n\nChange ${changeLabel}.`
    );

    if (!confirmed) return;

    handleSubscriptionChange(user.id, payload);
  };

  const confirmAccountStatusChange = (user, accountStatus) => {
    if (user.id === currentAdminId && accountStatus !== "active") {
      window.alert("You cannot suspend or disable your own admin account.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm account status change?\n\nUser: ${user.email}\nNew status: ${accountStatus}`
    );

    if (!confirmed) return;

    handleAccountStatusChange(user.id, accountStatus);
  };

  return (
    <div className="users-panel-body">
      <div className="panel-header">
        <div>
          <p className="eyebrow">CLIENTS</p>
          <h3>Accounts and subscription controls</h3>
        </div>

        <form className="search-row" onSubmit={handleSearch}>
          <input
            aria-label="Search users by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
          />
          <button disabled={busy} type="submit">
            Apply
          </button>
        </form>
      </div>

      <div className="filters-row">
        <select aria-label="Filter users by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="student">students</option>
          <option value="teacher">teachers</option>
          <option value="admin">admins</option>
        </select>

        <select aria-label="Filter users by subscription tier" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
          <option value="">All tiers</option>
          <option value="free">free</option>
          <option value="premium">premium</option>
          <option value="teacher">teacher</option>
          <option value="admin">admin</option>
        </select>

        <select
          aria-label="Filter users by subscription status" value={subStatusFilter}
          onChange={(e) => setSubStatusFilter(e.target.value)}
        >
          <option value="">All subscriptions</option>
          <option value="active">active</option>
          <option value="trial">trial</option>
          <option value="expired">expired</option>
          <option value="cancelled">cancelled</option>
        </select>

        <select
          aria-label="Filter users by account status" value={accountStatusFilter}
          onChange={(e) => setAccountStatusFilter(e.target.value)}
        >
          <option value="">All accounts</option>
          <option value="active">active</option>
          <option value="suspended">suspended</option>
          <option value="disabled">inactive (disabled)</option>
        </select>

        <button disabled={busy} type="button" onClick={handleSearch}>
          Filter
        </button>

        <button
          disabled={busy}
          type="button"
          className="ghost-mini"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </div>

      {status === 'loading' && <p className="users-load-status" role="status">Loading users…</p>}
      {error && <div className="users-load-status" role="alert"><p>{error}</p><button type="button" disabled={busy || status === 'loading'} onClick={handleSearch}>Retry users</button></div>}
      <div className="users-scroll-tools">
        <label htmlFor="admin-users-scroll">Table navigation</label>
        <input id="admin-users-scroll" type="range" min="0" max={scroll.max} step="1"
          value={Math.min(scroll.left, scroll.max)} disabled={scroll.max === 0}
          aria-label="Scroll users table horizontally" aria-controls="admin-users-table"
          aria-valuetext={scroll.max ? `${Math.round(scroll.left / scroll.max * 100)} percent across the table` : 'All columns visible'}
          onChange={event => moveTable(Number(event.target.value))}
          onKeyDown={event => {
            const positions = { ArrowLeft: scroll.left - 80, ArrowRight: scroll.left + 80,
              Home: 0, End: scroll.max, PageUp: scroll.left - 400, PageDown: scroll.left + 400 };
            if (event.key in positions) { event.preventDefault(); moveTable(Math.max(0, Math.min(scroll.max, positions[event.key]))); }
          }}/>
        <small>{scroll.max ? 'Drag the bar or use arrow keys. Home / End jump to the first / last columns.' : 'All columns are visible.'}</small>
      </div>
      <div ref={tableRef} id="admin-users-table" className="table-wrap" role="region" tabIndex={0} aria-label="Users and subscriptions; scroll horizontally for all columns" aria-busy={status === 'loading'}>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Tier</th>
              <th>Sub Status</th>
              <th>Expiry</th>
              <th>Account</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isCurrentAdmin = user.id === currentAdminId;

              return (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.name}
                      {isCurrentAdmin ? " (You)" : ""}
                    </strong>
                    <small>{user.email}</small>
                  </td>

                  <td>
                    <select
                      aria-label={`Role for ${user.email}`} value={user.role || "student"}
                      disabled={busy}
                      onChange={(e) => confirmRoleChange(user, e.target.value)}
                    >
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td>
                    <select
                      aria-label={`Subscription tier for ${user.email}`} value={user.subscriptionTier || "free"}
                      disabled={busy}
                      onChange={(e) =>
                        confirmSubscriptionChange(user, {
                          subscriptionTier: e.target.value,
                        })
                      }
                    >
                      <option value="free">free</option>
                      <option value="premium">premium</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td>
                    <select
                      aria-label={`Subscription status for ${user.email}`} value={user.subscriptionStatus || "active"}
                      disabled={busy}
                      onChange={(e) =>
                        confirmSubscriptionChange(user, {
                          subscriptionStatus: e.target.value,
                        })
                      }
                    >
                      <option value="active">active</option>
                      <option value="trial">trial</option>
                      <option value="expired">expired</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>

                  <td>
                    <input
                      aria-label={`Subscription expiry for ${user.email}`} type="date"
                      disabled={busy}
                      value={
                        user.subscriptionExpiresAt
                          ? String(user.subscriptionExpiresAt).slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        confirmSubscriptionChange(user, {
                          subscriptionExpiresAt: e.target.value || null,
                        })
                      }
                    />
                  </td>

                  <td>
                    <select
                      aria-label={`Account status for ${user.email}`} value={user.accountStatus || "active"}
                      disabled={busy || isCurrentAdmin}
                      title={
                        isCurrentAdmin
                          ? "You cannot change your own admin account status here."
                          : ""
                      }
                      onChange={(e) =>
                        confirmAccountStatusChange(user, e.target.value)
                      }
                    >
                      <option value="active">active</option>
                      <option value="suspended">suspended</option>
                      <option value="disabled">inactive (disabled)</option>
                    </select>
                  </td>

                  <td>
                    <small>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </small>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ghost-mini"
                      onClick={() => onViewUser(user)}
                    >
                      View
                    </button>
                    <button type="button" className="record-danger" disabled={busy || user.role === 'admin' || !['suspended','disabled'].includes(user.accountStatus)}
                      title="Suspend or set a non-admin account to inactive before deleting it" onClick={() => setDeleteAction({ title:'Delete account', description:'This account and its saved records move to the recycle bin for at least 90 days. Sessions and school memberships are revoked. Permanent deletion is a separate action after the retention period.', confirmation:user.email, reasonRequired:true, destructive:true, button:'Move to recycle bin', run:body=>handleTrashUser(user.id,body) })}>Delete account</button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && status !== 'loading' && !error && (
              <tr>
                <td colSpan="8" className="empty-cell">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteAction && <RecordConfirmDialog action={deleteAction} onClose={() => setDeleteAction(null)} />}
      <div className="pagination">
        <button
          disabled={busy || page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination?.page || page} of {pagination?.pages || 1}
        </span>

        <button
          disabled={busy || page >= (pagination?.pages || 1)}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
