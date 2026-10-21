import { useCallback, useEffect, useRef, useState } from 'react';
import { getPublishedMaterials, getPublishedMaterial, getPublishedCredits, getPublishedMedia } from '../config/api.js';
import { ProtectedImage } from '../../../shared/ProtectedImage.jsx';
import { TOPIC_META, topicById } from '../config/topics.js';
import { useReadAloud } from '../hooks/useReadAloud.js';
import { ReadAloudControls } from '../components/ReadAloudControls.jsx';
import './published-lessons.css';
function SourceCredit({ material }) {
  return <aside className="cw-managed-source" aria-label="Material source credit"><strong>Source & attribution</strong><p>{material.attribution}</p><p>{material.creator} · {material.licenseName}</p>
    <div className="cw-managed-actions">{material.sourceURL && <a href={material.sourceURL} target="_blank" rel="noopener noreferrer">Original source</a>}{material.licenseURL && <a href={material.licenseURL} target="_blank" rel="noopener noreferrer">License details</a>}</div>
    {material.validUntil && <p>Permission valid through {material.validUntil}.</p>}
    {material.images?.map(image=><div key={image.id}><h3>Illustration: {image.title}</h3><SourceCredit material={image}/></div>)}
  </aside>;
}
export default function PublishedLessons({ token, initialTopic = '', onAskWiz }) {
  const [data,setData] = useState({items:[],pagination:{page:1,pages:1}}), [material,setMaterial] = useState(null), [selected,setSelected] = useState(null);
  const [input,setInput] = useState(''), [query,setQuery] = useState(''), [topic,setTopic] = useState(initialTopic), [page,setPage] = useState(1), [credits,setCredits] = useState(false);
  const [error,setError] = useState(''), [notice,setNotice] = useState(''), [busy,setBusy] = useState(false);
  const loadImage = useCallback(id=>getPublishedMedia(token,material.id,id),[token,material?.id,material?.version]);
  const epoch = useRef(0), heading = useRef(null), textRef = useRef(null), speech = useReadAloud();
  const refresh = useCallback(async () => {
    const request = ++epoch.current; setBusy(true); setError('');
    try {
      const result = await (credits ? getPublishedCredits : getPublishedMaterials)(token,{search:query,topicId:topic,page});
      let current = null;
      if (selected && !credits) current = (await getPublishedMaterial(token,selected)).material;
      if (request !== epoch.current) return;
      setData(result); setMaterial(current);
      if (current) setNotice('');
    } catch(e) {
      if (request === epoch.current) {
        setMaterial(null); setData({items:[],pagination:{page:1,pages:1}});
        if (selected && e.status === 404) { setSelected(null); setNotice(e.message); }
        else setError(e.message);
      }
    } finally { if (request === epoch.current) setBusy(false); }
  },[token,credits,query,topic,page,selected]);
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh,60000);
    const resume = () => { if (document.visibilityState === 'visible') refresh(); };
    const offline = () => { epoch.current++; setBusy(false); setMaterial(null); setData({items:[],pagination:{page:1,pages:1}}); setError('Reconnect to check the current publications. Published lessons are not saved for offline use.'); };
    window.addEventListener('focus',resume); document.addEventListener('visibilitychange',resume); window.addEventListener('online',refresh); window.addEventListener('offline',offline);
    return () => { epoch.current++; clearInterval(timer); window.removeEventListener('focus',resume); document.removeEventListener('visibilitychange',resume); window.removeEventListener('online',refresh); window.removeEventListener('offline',offline); };
  },[refresh]);
  useEffect(() => { speech.stop(); },[material?.id,material?.version,Boolean(material)]);
  useEffect(() => { if (material) heading.current?.focus({preventScroll:true}); },[material?.id,material?.version,Boolean(material)]);
  useEffect(() => {
    const expiryDates = [material?.validUntil,...(material?.images || []).map(image=>image.validUntil)].filter(Boolean).map(value=>Date.parse(value)+86400000);
    if (!expiryDates.length) return;
    const expires = Math.min(...expiryDates);
    const remaining = expires-Date.now();
    const expire = () => { setMaterial(null); setSelected(null); setNotice('This publication permission has expired. Refresh to check for a reviewed replacement.'); refresh(); };
    if (remaining <= 0) { expire(); return; }
    let timer;
    const check = () => { const left=expires-Date.now(); if(left<=0)expire(); else timer=setTimeout(check,Math.min(left,2147483647)); };
    check();
    return () => clearTimeout(timer);
  },[material?.id,material?.version,material?.validUntil,JSON.stringify(material?.images?.map(image=>image.validUntil)),refresh]);
  function selectedText() {
    const selection = window.getSelection();
    if (selection && textRef.current?.contains(selection.anchorNode) && textRef.current?.contains(selection.focusNode) && selection.toString().trim()) speech.speak(selection.toString());
    else setNotice('Select text inside this lesson before choosing Listen to selection.');
  }
  return <section className="cw-page cw-managed" aria-label="Published lesson library">
    <header><p className="cw-managed-eyebrow">CHEMWIZ · REVIEWED MATERIAL</p><h1>{credits ? 'Credits & sources' : 'Published lessons'}</h1><p>Additional chemistry material published by your educators. Your existing topic notes remain available from Home.</p></header>
    <div className="cw-managed-actions"><button type="button" aria-pressed={!credits} onClick={()=>{setCredits(false);setSelected(null);setMaterial(null);setPage(1);}}>Lessons</button><button type="button" aria-pressed={credits} onClick={()=>{setCredits(true);setSelected(null);setMaterial(null);setPage(1);}}>Credits & sources</button><button type="button" disabled={busy} onClick={refresh}>Refresh lessons</button></div>
    <form className="cw-managed-filters" onSubmit={e=>{e.preventDefault();setQuery(input);setSelected(null);setMaterial(null);setPage(1);}}>
      <label>Search published material<input aria-label="Search published material" value={input} onChange={e=>setInput(e.target.value)} maxLength={200}/></label>
      <label>Topic<select aria-label="Published material topic" value={topic} onChange={e=>{setTopic(e.target.value);setSelected(null);setMaterial(null);setPage(1);}}><option value="">All topics</option>{TOPIC_META.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label><button>Search lessons</button>
    </form>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}{busy && <p role="status">Checking current publications…</p>}
    {!busy && !error && !data.items.length && <p>No published materials match this view. Return to Home for your existing topic notes.</p>}
    {material && <article className="cw-managed-reader" aria-label="Published material reader"><button type="button" onClick={()=>{setSelected(null);setMaterial(null);}}>Back to lesson list</button>
      <p>{topicById(material.topicId)?.title} · version {material.version}</p><h2 tabIndex={-1} ref={heading}>{material.title}</h2>
      <div className="cw-managed-actions"><button type="button" disabled={!speech.supported} onClick={()=>speech.speak(material.title+'\n\n'+material.body+'\n\n'+(material.images || []).map(image=>image.altText+' '+image.caption).join('\n'))}>Listen to lesson</button><button type="button" disabled={!speech.supported} onClick={selectedText}>Listen to selection</button><button type="button" onClick={()=>onAskWiz(material)}>Ask Wiz about this lesson</button></div><ReadAloudControls speech={speech} t={{panel:'var(--cw-panel)',text:'var(--cw-text)',border:'var(--cw-border)',textMuted:'var(--cw-muted)'}} />
      <div ref={textRef} className="cw-managed-text">{material.body}</div>{(material.images || []).map(image=><ProtectedImage key={image.id} image={image} load={loadImage}/>)}<SourceCredit material={material}/><small>Published {new Date(material.publishedAt).toLocaleString()}. Checked online; publication changes are checked every minute and when you return.</small>
    </article>}
    {!material && <div className="cw-managed-grid">{data.items.map(item=><article className="cw-managed-card" key={item.id}><p>{topicById(item.topicId)?.title} · {item.audience === 'free' ? 'All learners' : 'Premium / school access'}</p><h2>{item.title}</h2>{credits ? <SourceCredit material={item}/> : <p>{item.creator} · version {item.version}</p>}<button type="button" onClick={()=>{setCredits(false);setSelected(item.id);setMaterial(null);setError('');}}>Read {item.title}</button></article>)}</div>}
    <div className="cw-managed-actions"><button type="button" disabled={busy || page<=1} onClick={()=>{setPage(page-1);setSelected(null);setMaterial(null);}}>Previous lessons</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button type="button" disabled={busy || page>=data.pagination.pages} onClick={()=>{setPage(page+1);setSelected(null);setMaterial(null);}}>Next lessons</button></div><p className="cw-managed-note">{data.notice}</p>
  </section>;
}
