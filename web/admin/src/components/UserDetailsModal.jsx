import { useRef } from 'react';
import { useDialog, clickedBackdrop } from '../../../../shared/useDialog.js';

export function UserDetailsModal({ user, onClose }) {
  const ref = useRef(null);
  useDialog(ref, Boolean(user));
  if (!user) return null;

  const formatDate = (value) => {
    if (!value) return "Not set";
    return new Date(value).toLocaleString();
  };

  return (
      <dialog ref={ref} className="user-modal" aria-labelledby="admin-user-title"
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onClick={(event) => { if (clickedBackdrop(event)) onClose(); }}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">USER DETAILS</p>
            <h2 id="admin-user-title">{user.name}</h2>
            <p className="muted">{user.email}</p>
          </div>

          <button className="ghost-mini" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="details-grid">
          <Detail label="User ID" value={user.id} />
          <Detail label="Role" value={user.role} />
          <Detail label="Level" value={user.level || "A-Level Chemistry"} />
          <Detail label="Subscription Tier" value={user.subscriptionTier || "free"} />
          <Detail label="Subscription Status" value={user.subscriptionStatus || "active"} />
          <Detail label="Subscription Expiry" value={formatDate(user.subscriptionExpiresAt)} />
          <Detail label="Account Status" value={user.accountStatus || "active"} />
          <Detail label="Joined" value={formatDate(user.createdAt)} />
          <Detail label="Last Updated" value={formatDate(user.updatedAt)} />
        </div>

        <div className="modal-note">
          More details will appear here later: quiz history, topic progress, payment history,
          tutor usage, and admin action logs.
        </div>
      </dialog>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value || "Not set"}</strong>
    </div>
  );
}
