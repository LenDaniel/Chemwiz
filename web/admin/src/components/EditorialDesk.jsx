import { useCallback, useEffect, useRef, useState } from 'react';
import { getContentHistory, publishContentDraft, unpublishContentDraft, rollbackContentDraft, getAdminMediaFile } from '../config/api.js';
import { ProtectedImage } from '../../../shared/ProtectedImage.jsx';
import { RecordConfirmDialog } from './RecordConfirmDialog.jsx';
export function EditorialDesk({ entry, token, onChanged, onClose }) {
  const [data, setData] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [action,setAction] = useState(null);
  const [reviewed,setReviewed] = useState(false), [theme,setTheme] = useState('light'), [width,setWidth] = useState('phone'), [message,setMessage] = useState('');
  const loadImage = useCallback(id=>getAdminMediaFile(token,id),[token]);
  const epoch = useRef(0), heading = useRef(null);
  async function load(page = 1) {
    const request = ++epoch.current; setBusy(true); setError(''); setReviewed(false);
    try { const result = await getContentHistory(token,entry.id,{page}); if (request === epoch.current) setData(result); }
    catch(e) { if (request === epoch.current) { setError(e.message); setData(null); } }
    finally { if (request === epoch.current) setBusy(false); }
  }
  useEffect(() => { load(); heading.current?.focus(); return () => { epoch.current++; }; }, [entry.id,token]);
  const run = (kind,version) => {
    const publishing = kind === 'publish', restoring = kind === 'rollback';
    setAction({ title: publishing ? 'Publish reviewed material' : restoring ? 'Restore earlier version as draft' : 'Withdraw published material',
      description: publishing ? 'Publish the saved preview below after your chemistry and rights review. Future edits remain drafts until published.' : restoring ? 'Create a new editable draft from this version. It needs a fresh rights review before publishing. The current live version stays unchanged.' : 'Remove this material from learner results. Open readers check again on refresh, return to the page or their next online check.',
      confirmation: data.current.title, confirmationLabel: 'Material title confirmation', reasonRequired: true, reasonLabel: 'Editorial note',
      button: publishing ? 'Publish to learners' : restoring ? 'Restore as draft' : 'Withdraw publication', destructive: !publishing && !restoring,
      run: async body => {
        const fn = publishing ? publishContentDraft : restoring ? rollbackContentDraft : unpublishContentDraft;
        const result = await fn(token,entry.id,{...body,revision:data.revision,confirmChemistryReview:publishing && reviewed,...(restoring ? {version} : {})});
        setMessage(result.message); await load(); await onChanged(result);
      } });
  };
  return <section className="editorial-desk" aria-label="Publication and version controls">
    <div className="record-actions"><h3 ref={heading} tabIndex={-1}>Preview, publish & history</h3><button type="button" onClick={onClose}>Close publication controls</button><button type="button" disabled={busy} onClick={() => load()}>Refresh saved preview</button></div>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}{busy && <p role="status">Loading saved versions…</p>}
    {data && <><p>Saved revision {data.revision}. Publication: {data.publication?.status || 'Not published'}{data.publication?.version ? ` · version ${data.publication.version}` : ''}.</p>
      <div className="record-actions"><label>Preview size<select aria-label="Preview size" value={width} onChange={e=>setWidth(e.target.value)}><option value="phone">Phone</option><option value="desktop">Desktop</option></select></label><label>Preview theme<select aria-label="Preview theme" value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label></div>
      <article aria-label="Saved material preview" className={`editorial-preview editorial-preview-${theme}`} style={{maxWidth:width === 'phone' ? 360 : 900}}>
        <p>{data.current.topicId || 'Choose a topic before publishing'} · {data.current.audience || 'premium'}</p><h2>{data.current.title}</h2><div className="editorial-text">{data.current.body}</div>{(data.images || []).map(image=><div key={image.id}>{(!image.matchesSavedReview || !image.eligible) && <p role="alert">This image changed or needs review. Re-save and review this lesson before publishing.</p>}<ProtectedImage image={image} load={loadImage}/></div>)}<p>{data.current.attribution || 'Complete source attribution before publication'}</p><small>{data.current.creator} · {data.current.licenseName}</small>
      </article>
      <label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} disabled={busy || data.recycled} />I checked this saved version for chemistry accuracy, syllabus alignment and clear source attribution.</label>
      <p>Publication also requires a current cleared rights review for commercial web use, a topic and learner access. Restored versions require a fresh review. Permission expiry and changed inventory assets hide publications automatically.</p>
      <div className="record-actions"><button type="button" disabled={busy || !reviewed || data.recycled} onClick={()=>run('publish')}>Publish reviewed material</button><button type="button" disabled={busy || data.publication?.status !== 'published' || data.recycled} onClick={()=>run('unpublish')}>Withdraw publication</button></div>
      <h4>Saved version history</h4>{!data.items.length && <p>No version snapshots yet. Saving this material creates its first snapshot.</p>}
      {data.items.map(version=><details key={version.version} className="record-card"><summary>Version {version.version} · {version.event} · {new Date(version.recordedAt).toLocaleString()}</summary><p>{version.note}</p><h4>{version.snapshot.title}</h4><div className="editorial-text">{version.snapshot.body}</div><p>{version.snapshot.attribution}</p><button type="button" disabled={busy || data.recycled} onClick={()=>run('rollback',version.version)}>Restore version {version.version} as draft</button></details>)}
      <div className="record-actions"><button type="button" disabled={busy || data.pagination.page<=1} onClick={()=>load(data.pagination.page-1)}>Newer versions</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button type="button" disabled={busy || data.pagination.page>=data.pagination.pages} onClick={()=>load(data.pagination.page+1)}>Older versions</button></div>
    </>}
    {action && <RecordConfirmDialog action={action} onClose={()=>setAction(null)} />}
  </section>;
}
