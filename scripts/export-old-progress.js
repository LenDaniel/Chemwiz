// Run this in the DevTools Console of the OLD signed-in student app.
// It downloads only learning data; no session token or provider key is exported.
(async () => {
  const ownerEmail = window.prompt('Email address belonging to the progress shown in this old app:');
  if (!ownerEmail) return;
  async function read(key, fallback) {
    const raw = window.storage ? (await window.storage.get(key))?.value : localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  }
  const state = {
    settings: await read('cw.settings', { theme: 'dark', fontSize: 'medium', syllabus: 'ZIMSEC', sound: 'on' }),
    progress: await read('cw.progress', {}),
    streak: await read('cw.streak', { current: 0, longest: 0, lastDate: null }),
    mistakes: (await read('cw.mistakes', [])).slice(-1000),
  };
  const payload = { format: 'chemwiz-learning-export-v1', ownerEmail: ownerEmail.trim().toLowerCase(), state };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'ChemWiz-Old-Learning-Backup.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  console.log('Learning backup downloaded. Import it from Profile in the combined ChemWiz app.');
})();
