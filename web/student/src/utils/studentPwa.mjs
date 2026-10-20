const listeners = new Set();
let snapshot = { supported: false, ready: false, waiting: false, installed: false, prompt: false, updating: false, error: '', message: '' };
let registration, deferredPrompt, starting, updateRequested = false;
const publish = patch => { snapshot = { ...snapshot, ...patch }; for (const listener of listeners) listener(snapshot); };
export function pwaSnapshot() { return snapshot; }
export function subscribePwa(listener) { listeners.add(listener); return () => listeners.delete(listener); }

if (typeof window !== 'undefined') {
  const display = window.matchMedia('(display-mode: standalone)');
  const installed = () => publish({ installed: display.matches || Boolean(navigator.standalone) });
  installed(); display.addEventListener?.('change', installed);
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredPrompt = event; publish({ prompt: true }); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; publish({ installed: true, prompt: false, message: 'ChemWiz is installed.' }); });
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    publish({ waiting: Boolean(registration?.waiting), ready: true });
    if (updateRequested) window.location.reload();
  });
}

export function startStudentPwa() {
  if (!import.meta.env.PROD || typeof window === 'undefined') return Promise.resolve(null);
  if (!window.isSecureContext || !('serviceWorker' in navigator)) {
    publish({ supported: false }); return Promise.resolve(null);
  }
  publish({ supported: true });
  if (starting) return starting;
  starting = navigator.serviceWorker.register('/student/sw.js', { scope: '/student/', updateViaCache: 'none' })
    .then(value => {
      registration = value;
      const inspect = () => publish({ ready: Boolean(value.active), waiting: Boolean(value.waiting), error: '' });
      inspect();
      value.addEventListener('updatefound', () => {
        value.installing?.addEventListener('statechange', () => { inspect(); setTimeout(inspect, 0); });
      });
      return value;
    }).catch(() => {
      starting = null;
      publish({ error: 'Offline recovery could not be prepared. Check your connection and try again.', ready: false });
      return null;
    });
  return starting;
}

export async function installStudentPwa() {
  if (!deferredPrompt) return;
  const prompt = deferredPrompt;
  deferredPrompt = null; publish({ prompt: false });
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    publish({ message: choice.outcome === 'accepted' ? 'Installation requested. Follow your browser’s instructions.' : 'You can install ChemWiz later from your browser menu.' });
  } catch { publish({ error: 'Installation could not start. Use your browser’s Install app menu.' }); }
}

export async function checkPwaUpdate() {
  publish({ error: '', message: '' });
  const active = await startStudentPwa();
  if (!active) return;
  try {
    await active.update();
    publish({ waiting: Boolean(active.waiting), message: active.waiting || active.installing ? 'Checking the new app files…' : 'Your app files are up to date.' });
  } catch { publish({ error: 'Could not check for updates. Check your connection and try again.' }); }
}

function activateWaitingWorker(worker) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Update request timed out. Reopen ChemWiz online and try again.')); }, 10000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    worker.postMessage({ type: 'ACTIVATE_UPDATE' }, [channel.port2]);
  });
}
export async function applyPwaUpdate(flush) {
  if (!registration?.waiting || snapshot.updating) return;
  publish({ error: '', message: '', updating: true });
  try {
    if (flush && !await flush()) {
      publish({ error: 'Update paused because your learning changes are still waiting to save. Reconnect and retry.' }); return;
    }
    updateRequested = true;
    const reply = await activateWaitingWorker(registration.waiting);
    if (reply.status !== 'ACTIVATING') {
      updateRequested = false;
      publish({ error: 'Close other ChemWiz learner tabs, then retry the update.' });
    }
  } catch (error) { updateRequested = false; publish({ error: error.message || 'Could not apply the update.' }); }
  finally { if (!updateRequested) publish({ updating: false }); }
}

export async function clearPwaFiles() {
  publish({ error: '', message: '' });
  try {
    if (registration) await registration.unregister();
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('chemwiz-student-recovery-')).map(name => caches.delete(name)));
    registration = null; starting = null;
    publish({ ready: false, waiting: false, message: 'Offline recovery files cleared. Your sign-in and learning data are unchanged. Reopen ChemWiz online to prepare recovery again.' });
  } catch { publish({ error: 'Could not clear the recovery files. Try again.' }); }
}
