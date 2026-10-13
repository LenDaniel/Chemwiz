
export function AdminLogsPanel({ logs }) {
  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const formatAction = (action) => {
    if (!action) return "Unknown action";
    return action.replaceAll("_", " ").toLowerCase();
  };

  return (
    <section className="panel logs-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">AUDIT TRAIL</p>
          <h2>Admin Action Logs</h2>
        </div>
      </div>

      <div className="logs-list">
        {logs.map((log) => (
          <div className="log-card" key={log._id}>
            <div className="log-top">
              <div>
                <strong>{formatAction(log.action)}</strong>
                <small>{formatDate(log.createdAt)}</small>
              </div>

              <span className="tag">{log.admin?.role || "admin"}</span>
            </div>

            <div className="log-meta">
              <div>
                <span>Admin</span>
                <strong>
                  {log.admin?.name || "Unknown"} · {log.admin?.email || "No email"}
                </strong>
              </div>

              <div>
                <span>Target User</span>
                <strong>
                  {log.targetUser?.name || "Unknown"} ·{" "}
                  {log.targetUser?.email || log.details?.targetEmail || "No email"}
                </strong>
              </div>
            </div>

            {log.details?.before && log.details?.after && (
              <div className="log-change-grid">
                <div>
                  <span>Before</span>
                  <pre>{JSON.stringify(log.details.before, null, 2)}</pre>
                </div>

                <div>
                  <span>After</span>
                  <pre>{JSON.stringify(log.details.after, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="empty-logs">
            No admin logs yet. Changes to subscriptions or account status will appear here.
          </div>
        )}
      </div>
    </section>
  );
}