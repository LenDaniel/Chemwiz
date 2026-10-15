// Account-specific cache and ordered saves. Revisions prevent silent overwrites
// when two devices or tabs edit the same learner's record.
const clone = (value) => JSON.parse(JSON.stringify(value));
export class LearningSync {
  constructor({ defaults, load, save, readCache, writeCache, onChange, delay = 700 }) {
    Object.assign(this, { defaults, load, save, readCache, writeCache, onChange, delay });
    this.state = clone(defaults);
    this.revision = null;
    this.dirty = false;
    this.ready = false;
    this.status = 'loading';
    this.generation = 0;
    this.timer = null;
    this.inflight = null;
    this.conflict = null;
    this.disposed = false;
  }
  notify() {
    if (!this.disposed) this.onChange({ state: this.state, ready: this.ready, status: this.status, error: this.error || '' });
  }
  cache() {
    return this.writeCache({ state: this.state, revision: this.revision, dirty: this.dirty });
  }
  async init() {
    let cached;
    try { cached = await this.readCache(); } catch { cached = null; }
    try {
      const remote = await this.load();
      if (this.disposed) return;
      if (cached?.dirty && JSON.stringify(cached.state) !== JSON.stringify(remote.state)) {
        this.state = cached.state;
        this.revision = cached.revision;
        this.dirty = true;
        if (cached.revision !== remote.revision) {
          this.conflict = remote;
          this.status = 'conflict';
        } else this.status = 'pending';
      } else {
        this.state = remote.state;
        this.revision = remote.revision;
        this.dirty = false;
        this.error = '';
        this.status = 'saved';
      }
      this.ready = true;
      await this.cache();
      this.notify();
      if (this.dirty && this.status !== 'conflict') this.schedule();
    } catch (error) {
      if (this.disposed) return;
      if (cached?.state && Number.isInteger(cached.revision)) {
        this.state = cached.state;
        this.revision = cached.revision;
        this.dirty = Boolean(cached.dirty);
        this.ready = true;
        this.status = 'pending';
      } else this.status = 'load-error';
      this.error = error.message;
      this.notify();
    }
  }
  change(patch) {
    if (this.disposed || !this.ready) return;
    this.state = { ...this.state, ...patch };
    this.generation += 1;
    this.dirty = true;
    if (this.status !== 'conflict') this.status = 'pending';
    // Cache writes start immediately, before debounce or navigation.
    Promise.resolve(this.cache()).catch(() => {});
    this.notify();
    if (this.status !== 'conflict') this.schedule();
  }
  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.delay);
  }
  async flush({ keepalive = false } = {}) {
    clearTimeout(this.timer);
    if (this.disposed || !this.ready || this.status === 'conflict') return false;
    if (this.inflight) return this.inflight;
    if (!this.dirty) return true;
    const generation = this.generation;
    const snapshot = clone(this.state);
    this.status = 'saving';
    this.notify();
    this.inflight = (async () => {
      try {
        const remote = await this.save(this.revision, snapshot, { keepalive });
        if (this.disposed) return false;
        this.revision = remote.revision;
        this.dirty = generation !== this.generation;
        this.error = '';
        this.status = this.dirty ? 'pending' : 'saved';
        await this.cache();
        this.notify();
        return true;
      } catch (error) {
        if (this.disposed) return false;
        this.error = error.message;
        if (error.status === 409 && error.data?.state) {
          this.conflict = error.data;
          this.status = 'conflict';
        } else this.status = 'pending';
        this.notify();
        return false;
      } finally {
        this.inflight = null;
        if (!this.disposed && this.dirty && !this.error && this.status !== 'conflict') this.schedule();
      }
    })();
    return this.inflight;
  }
  async retry() {
    this.error = '';
    if (!this.ready || !this.dirty) return this.init();
    return this.flush();
  }
  async resolveConflict(useServer) {
    if (!this.conflict) return;
    this.revision = this.conflict.revision;
    if (useServer) {
      this.state = this.conflict.state;
      this.dirty = false;
    }
    this.conflict = null;
    this.error = '';
    this.status = this.dirty ? 'pending' : 'saved';
    await this.cache();
    this.notify();
    if (this.dirty) await this.flush();
  }
  dispose() {
    this.disposed = true;
    clearTimeout(this.timer);
  }
}
