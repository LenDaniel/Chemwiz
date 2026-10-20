import { useEffect, useState } from 'react';
export function LazyRecordPanel(props) {
  const [Panel, setPanel] = useState(null), [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; setFailed(false); import('./RecordPanels.jsx').then(module => { if (active) setPanel(() => module.RecordPanel); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, [attempt]);
  if (Panel) return <Panel {...props} />;
  return <p className="users-load-status" role={failed ? 'alert' : 'status'}>{failed ? <><span>Could not load these controls. Retry, or reload Admin after an update. </span><button type="button" onClick={() => setAttempt(value => value + 1)}>Retry controls</button></> : 'Loading controls…'}</p>;
}
