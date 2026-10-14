
export function UsersPanel({
  users,
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
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">CLIENTS</p>
          <h2>Users & Subscriptions</h2>
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
          <option value="disabled">disabled</option>
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

      <div className="table-wrap" role="region" tabIndex={0} aria-label="Users and subscriptions; scroll horizontally for all columns">
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
                      <option value="disabled">disabled</option>
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
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-cell">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </section>
  );
}
