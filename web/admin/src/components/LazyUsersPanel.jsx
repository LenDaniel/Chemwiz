import { useEffect, useState } from 'react';

export function LazyUsersPanel(props) {
  const [Panel, setPanel] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    import('./UsersPanel.jsx').then(module => { if (active) setPanel(() => module.UsersPanel); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (Panel) return <Panel {...props} />;
  return <div className="users-load-status" role={failed ? 'alert' : 'status'}>
    {failed ? <><p>Could not load the users controls. Check your connection and retry. After an app update, reload the page if retry still fails.</p>
      <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry users controls</button></> : 'Loading users controls…'}
  </div>;
}
