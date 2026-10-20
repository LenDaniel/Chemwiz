import { useRef, useState } from 'react';
import { useDialog } from '../../../../shared/useDialog.js';
export function RecordConfirmDialog({ action, onClose }) {
  const ref = useRef(null), [confirmation, setConfirmation] = useState(''), [reason, setReason] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useDialog(ref, true);
  return <dialog ref={ref} className="user-modal record-confirm" aria-labelledby="record-confirm-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <h2 id="record-confirm-title">{action.title}</h2><p>{action.description}</p>
    <form onSubmit={async event => { event.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await action.run({ confirmation, ...(action.reasonRequired ? { reason } : {}) }); onClose(); } catch (e) { setError(e.message); } finally { setBusy(false); } }}>
      {action.reasonRequired && <label>Deletion reason<textarea aria-label="Deletion reason" required minLength={8} maxLength={400} value={reason} onChange={event => setReason(event.target.value)} disabled={busy} /></label>}
      <label>Type {action.confirmation} to confirm<input aria-label="Deletion confirmation" required autoComplete="off" value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={busy} /></label>
      {error && <p role="alert">{error}</p>}<div className="record-actions"><button type="button" onClick={onClose} disabled={busy}>Cancel</button><button className={action.destructive ? 'record-danger' : ''} type="submit" disabled={busy || confirmation !== action.confirmation}>{busy ? 'Working…' : action.button}</button></div>
    </form>
  </dialog>;
}
