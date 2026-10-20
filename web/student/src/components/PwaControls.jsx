import React, { useEffect, useState } from 'react';
import { pwaSnapshot, subscribePwa, installStudentPwa, checkPwaUpdate, applyPwaUpdate, clearPwaFiles } from '../utils/studentPwa.mjs';

function usePwa() {
  const [state, setState] = useState(pwaSnapshot);
  useEffect(() => { const unsubscribe = subscribePwa(setState); setState(pwaSnapshot()); return unsubscribe; }, []);
  return state;
}
export function PwaUpdateNotice({ learning, canUpdate }) {
  const state = usePwa();
  const [busy, setBusy] = useState(false);
  if (!state.waiting) return null;
  return <section className="cw-pwa-notice" aria-label="App update">
    <p>A ChemWiz update is ready. Save your changes and update when you are ready.</p>
    {!canUpdate && <p role="status">Finish your activity, then open Home or Profile to apply the update.</p>}
    <button type="button" disabled={busy || state.updating || !canUpdate} onClick={async () => { setBusy(true); try { await applyPwaUpdate(learning.flush); } finally { setBusy(false); } }}>Save and update app</button>
    {state.error && <p role="alert">{state.error}</p>}
  </section>;
}
export function PwaControls({ learning }) {
  const state = usePwa();
  const [busy, setBusy] = useState(false);
  const run = async action => { if (state.updating) return; setBusy(true); try { await action(); } finally { setBusy(false); } };
  return <section className="cw-pwa-card" aria-labelledby="cw-pwa-heading">
    <h2 id="cw-pwa-heading">Install ChemWiz</h2>
    <p>{state.installed ? 'ChemWiz is running as an installed app.' : 'Keep ChemWiz on your home screen or desktop for quick access.'}</p>
    {state.prompt && !state.installed ? <button type="button" disabled={busy || state.updating} onClick={() => run(installStudentPwa)}>Install app</button> :
      !state.installed && <p>Use your browser’s Install app or Add to Home Screen menu. On iPhone or iPad, use Share → Add to Home Screen. Availability depends on your browser.</p>}
    <p>Lessons, account checks and Wiz need a connection. Offline recovery helps you reconnect; downloadable lesson packs will follow in a later update.</p>
    {state.supported && <>
      <p role="status">{state.ready ? 'Offline recovery is ready.' : 'Offline recovery is not prepared yet.'}</p>
      <div className="cw-pwa-actions"><button type="button" disabled={busy || state.updating} onClick={() => run(checkPwaUpdate)}>Check for app updates</button>
        {state.waiting && <button type="button" disabled={busy || state.updating} onClick={() => run(() => applyPwaUpdate(learning.flush))}>Save and update app</button>}
        <button type="button" disabled={busy || state.updating} onClick={() => run(clearPwaFiles)}>Clear offline recovery files</button></div>
    </>}
    {state.error && <p role="alert">{state.error}</p>}
    {state.message && <p role="status">{state.message}</p>}
  </section>;
}
