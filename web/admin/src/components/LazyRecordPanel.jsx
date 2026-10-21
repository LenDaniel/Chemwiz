import { useEffect, useState } from 'react';
export function LazyRecordPanel(props) {
  const [Panel, setPanel] = useState(null), [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; setFailed(false); (props.kind === 'media' ? import('./MediaLibrary.jsx').then(module => module.MediaLibrary) : import('./RecordPanels.jsx').then(module => module.RecordPanel)).then(component => { if (active) setPanel(() => component); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, [attempt,props.kind]);
  if (Panel) return <Panel {...props} />;
  return <p className="users-load-status" role={failed ? 'alert' : 'status'}>{failed ? <><span>Could not load these controls. Retry, or reload Admin after an update. </span><button type="button" onClick={() => setAttempt(value => value + 1)}>Retry controls</button></> : 'Loading controls…'}</p>;
}
