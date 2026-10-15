const test = require('node:test');
const assert = require('node:assert/strict');
const defaults = require('../shared/learning-defaults.json');
const clone = (value) => JSON.parse(JSON.stringify(value));
async function make(options = {}) {
  const { LearningSync } = await import('../web/student/src/utils/learningSync.mjs');
  let cache = options.cache || null;
  let remote = { state: clone(defaults), revision: 0 };
  const controller = new LearningSync({ defaults, delay: 100000,
    readCache: async () => cache,
    writeCache: (value) => { cache = clone(value); return true; },
    load: options.load || (async () => clone(remote)),
    save: options.save || (async (revision, state) => {
      assert.equal(revision, remote.revision);
      remote = { state: clone(state), revision: revision + 1 }; return clone(remote);
    }),
    onChange: () => {},
  });
  await controller.init();
  return { controller, cache: () => cache, remote: () => remote };
}
test('learner edits are cached immediately and a successful save clears the pending flag', async () => {
  const { controller, cache, remote } = await make();
  controller.change({ settings: { ...defaults.settings, theme: 'light' } });
  assert.equal(cache().dirty, true);
  assert.equal(cache().state.settings.theme, 'light');
  assert.equal(await controller.flush(), true);
  assert.equal(cache().dirty, false);
  assert.equal(remote().state.settings.theme, 'light');
  controller.dispose();
});
test('offline edits survive a reload and retry sends the account cache', async () => {
  const initial = await make({ save: async () => { throw new Error('Offline'); } });
  initial.controller.change({ settings: { ...defaults.settings, sound: 'off' } });
  assert.equal(await initial.controller.flush(), false);
  assert.equal(initial.cache().dirty, true);
  const resumed = await make({ cache: initial.cache() });
  assert.equal(resumed.controller.state.settings.sound, 'off');
  assert.equal(await resumed.controller.flush(), true);
  assert.equal(resumed.remote().state.settings.sound, 'off');
  initial.controller.dispose(); resumed.controller.dispose();
});
test('edits during an in-flight save remain pending and use the next revision', async () => {
  let release;
  const writes = [];
  const { controller } = await make({ save: (revision, state) => {
    writes.push({ revision, state: clone(state) });
    if (writes.length === 1) return new Promise((resolve) => { release = () => resolve({ revision: 1, state }); });
    return Promise.resolve({ revision: 2, state });
  } });
  controller.change({ settings: { ...defaults.settings, theme: 'light' } });
  const first = controller.flush();
  controller.change({ settings: { ...defaults.settings, theme: 'light', sound: 'off' } });
  release(); await first;
  assert.equal(controller.dirty, true);
  await controller.flush();
  assert.equal(writes[1].revision, 1);
  assert.equal(writes[1].state.settings.sound, 'off');
  assert.equal(controller.dirty, false);
  controller.dispose();
});
test('a changed remote revision requires an explicit conflict choice and preserves the device copy', async () => {
  const local = clone(defaults); local.settings.theme = 'light';
  const remote = { state: clone(defaults), revision: 4 };
  let writes = 0;
  const { controller } = await make({ cache: { state: local, revision: 1, dirty: true }, load: async () => remote,
    save: async (revision, state) => { writes += 1; assert.equal(revision, 4); return { revision: 5, state }; } });
  assert.equal(controller.status, 'conflict');
  assert.equal(controller.state.settings.theme, 'light');
  assert.equal(await controller.flush(), false);
  assert.equal(writes, 0);
  await controller.resolveConflict(false);
  assert.equal(writes, 1);
  assert.equal(controller.status, 'saved');
  controller.dispose();
});
test('choosing the server copy clears an old pending cache without writing', async () => {
  const local = clone(defaults); local.settings.theme = 'light';
  const { controller, cache } = await make({ cache: { state: local, revision: 1, dirty: true },
    load: async () => ({ state: clone(defaults), revision: 2 }), save: async () => { throw new Error('No write expected'); } });
  await controller.resolveConflict(true);
  assert.equal(controller.state.settings.theme, 'dark');
  assert.equal(cache().dirty, false);
  controller.dispose();
});
