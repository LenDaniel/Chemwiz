import React, { useRef, useState } from 'react';
import { validateLearningImport } from '../config/api.js';

export function LearningDataTransfer({ learning, user, token }) {
  const input = useRef(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const exportData = () => {
    const payload = { format: 'chemwiz-learning-export-v1', ownerEmail: user.email, state: learning.state };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'ChemWiz-Learning-Backup.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importData = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true); setMessage('');
    try {
      if (file.size > 750000) throw new Error('This learning backup is too large.');
      const payload = JSON.parse(await file.text());
      if (payload.format !== 'chemwiz-learning-export-v1' || String(payload.ownerEmail).toLowerCase() !== user.email.toLowerCase()) {
        throw new Error('Choose a ChemWiz learning backup belonging to this email address.');
      }
      const validated = await validateLearningImport(token, payload.state);
      if (!window.confirm('Replace this account’s progress, settings, streak and mistakes with the selected backup?')) return;
      learning.change(validated.state);
      const saved = await learning.flush();
      setMessage(saved ? 'Your learning backup has been imported and saved.' : 'Imported on this device. Use Retry to finish saving.');
    } catch (error) { setMessage(error.message || 'This backup could not be imported.'); }
    finally { setBusy(false); }
  };
  return <div className="cw-learning-transfer">
    <strong>Learning backup</strong>
    <p>Bring your progress from the previous ChemWiz app, or download a personal backup.</p>
    <input ref={input} type="file" accept=".json,application/json" hidden onChange={importData} />
    <button type="button" disabled={busy} onClick={() => input.current.click()}>Import learning data</button>
    <button type="button" disabled={busy} onClick={exportData}>Download learning backup</button>
    {message && <p role="status">{message}</p>}
  </div>;
}
