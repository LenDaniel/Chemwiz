import { useEffect, useRef, useState } from 'react';
import defaults from '../../../../shared/learning-defaults.json';
import { getJSON, setItem } from '../utils/storage.js';
import { LearningSync } from '../utils/learningSync.mjs';
import { getLearningState, putLearningState } from '../config/api.js';

export function useLearningState(user, token) {
  const sync = useRef(null);
  const [snapshot, setSnapshot] = useState({ state: defaults, status: 'loading', ready: false });
  useEffect(() => {
    if (!user?.id || !token) {
      setSnapshot({ state: defaults, status: 'loading', ready: false });
      return undefined;
    }
    const key = `cw.learning.${user.id}`;
    const controller = new LearningSync({
      defaults,
      load: () => getLearningState(token),
      save: (revision, state, options) => putLearningState(token, revision, state, options),
      readCache: () => getJSON(key, null),
      writeCache: (data) => setItem(key, data),
      onChange: setSnapshot,
    });
    sync.current = controller;
    controller.init().then(() => {
      if (!controller.ready || controller.disposed) return;
      const previous = controller.state.streak;
      const today = new Date().toDateString();
      if (previous.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const current = previous.lastDate === yesterday ? previous.current + 1 : 1;
        controller.change({ streak: { current, longest: Math.max(current, previous.longest), lastDate: today } });
      }
    });
    const retry = () => controller.retry();
    const saveBeforeLeaving = () => controller.flush({ keepalive: true });
    const onVisibility = () => { if (document.visibilityState === 'hidden') saveBeforeLeaving(); };
    const onStorage = (event) => {
      if (event.key === key && !controller.dirty && !controller.inflight) controller.init();
    };
    window.addEventListener('online', retry);
    window.addEventListener('pagehide', saveBeforeLeaving);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('online', retry);
      window.removeEventListener('pagehide', saveBeforeLeaving);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
      controller.dispose();
      if (sync.current === controller) sync.current = null;
    };
  }, [user?.id, token]);
  return {
    ...snapshot,
    change: (patch) => sync.current?.change(patch),
    flush: async () => {
      const active = sync.current;
      if (!active) return false;
      do { if (!await active.flush()) return false; } while (active.dirty);
      return true;
    },
    retry: () => sync.current?.retry(),
    resolve: (useServer) => sync.current?.resolveConflict(useServer),
    reset: () => sync.current?.change(JSON.parse(JSON.stringify(defaults))),
  };
}
