import { useCallback, useEffect, useRef, useState } from 'react';
import { getMediaLibrary, uploadMedia, updateMedia, trashMedia, getAdminMediaFile } from '../config/api.js';
import { RecordConfirmDialog } from './RecordConfirmDialog.jsx';
import { ProtectedImage } from '../../../shared/ProtectedImage.jsx';
export function MediaLibrary({ token, visible, version, onChanged }) {
  const [data,setData] = useState({items:[],pagination:{page:1,pages:1}}), [search,setSearch] = useState(''), [page,setPage] = useState(1);
  const [selected,setSelected] = useState(null), [form,setForm] = useState(null), [busy,setBusy] = useState(false), [error,setError] = useState(''), [message,setMessage] = useState(''), [action,setAction] = useState(null);
  const epoch = useRef(0), editor = useRef(null);
  const loadImage = useCallback(id => getAdminMediaFile(token,id),[token]);
  function edit(media) { setSelected(media); setForm({...media,confirmRightsReview:false,confirmImageReview:false}); }
  async function load(next = page) {
    const request = ++epoch.current; setBusy(true); setError('');
    try { const result = await getMediaLibrary(token,{search,page:next}); if (request === epoch.current) { setData(result); setPage(next); } }
    catch(e) { if (request === epoch.current) setError(e.message); }
    finally { if (request === epoch.current) setBusy(false); }
  }
  useEffect(() => { if (visible) load(1); return () => { epoch.current++; }; },[token,visible,version]);
  const change = (key,value) => setForm({...form,[key]:value,confirmRightsReview:false,confirmImageReview:false});
  const field = (key,label,max = 200,multi = false) => <label key={key}>{label}{multi ? <textarea aria-label={label} maxLength={max} value={form[key] || ''} onChange={e=>change(key,e.target.value)}/> : <input aria-label={label} maxLength={max} value={form[key] || ''} onChange={e=>change(key,e.target.value)}/>}</label>;
  return <div className="record-panel" aria-label="Media library controls">
    <p>Upload PNG or JPEG illustrations: maximum 2 MiB, two million pixels and 4,096 pixels per side. Standard non-interlaced PNG only. Images are decoded and re-encoded to remove embedded metadata. Review the result, chemistry, alternative text and rights before attaching it to a published lesson.</p>
    {data.storage && <p aria-label="Media storage">Storage: {(data.storage.bytes/1048576).toFixed(2)} / {data.storage.maxBytes/1048576} MiB · {data.storage.files} / {data.storage.maxFiles} images, including the recycle bin.</p>}
    <label className="record-import">Upload illustration<input type="file" aria-label="Upload illustration" accept="image/png,image/jpeg" disabled={busy} onChange={async event => {
      const input = event.currentTarget, file = input.files?.[0]; if (!file) return; setBusy(true); setError('');
      try { if (!['image/png','image/jpeg'].includes(file.type) || file.size > 2097152 || !file.size) throw new Error('Choose a PNG or JPEG no larger than 2 MiB.');
        const result = await uploadMedia(token,file); edit(result.media); setMessage(result.message); await load(1); onChanged();
      } catch(e) { setError(e.message); } finally { input.value = ''; setBusy(false); }
    }}/></label>
    <form className="record-actions" onSubmit={e=>{e.preventDefault();load(1);}}><input aria-label="Search media library" value={search} placeholder="Search images…" maxLength={200} onChange={e=>setSearch(e.target.value)}/><button disabled={busy}>Search images</button><button type="button" disabled={busy} onClick={()=>load()}>Refresh images</button></form>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}{busy && <p role="status">Loading media…</p>}
    {data.items.map(item=><article key={item.id} className="record-card"><h3>{item.title}</h3><p>{item.status} · revision {item.revision} · {item.width} × {item.height} · {Math.ceil(item.byteLength/1024)} KiB</p><p>{item.eligible ? 'Reviewed for commercial web use' : 'Needs a current review before publication'}</p><div className="record-actions"><button type="button" disabled={busy} onClick={()=>{edit(item);setTimeout(()=>editor.current?.focus(),0);}}>Review image</button><button type="button" className="record-danger" disabled={busy} onClick={()=>setAction({title:'Delete image',description:'Recycle this image for at least 90 days. All lessons using its current review become unavailable. Saved material versions keep a reference hold until those materials are purged.',confirmation:item.title,reasonRequired:true,button:'Move image to recycle bin',run:async body=>{const result=await trashMedia(token,item.id,{...body,revision:item.revision});setMessage(result.message);if(selected?.id===item.id){setSelected(null);setForm(null);}await load();onChanged();}})}>Delete image</button></div></article>)}
    {!busy && !data.items.length && <p>No images found.</p>}
    <div className="record-actions"><button type="button" disabled={busy || page<=1} onClick={()=>load(page-1)}>Previous images</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button type="button" disabled={busy || page>=data.pagination.pages} onClick={()=>load(page+1)}>Next images</button></div>
    {form && <section aria-label="Image review editor"><h3 ref={editor} tabIndex={-1}>Review uploaded image</h3><ProtectedImage image={{...selected,version:selected.revision}} load={loadImage}/><p>This preview shows the stored image. Editing any image metadata starts a new review generation. Re-save and review attached lessons before publishing them again.</p>
      <form className="record-editor" onSubmit={async event=>{event.preventDefault();setBusy(true);setError('');try{const result=await updateMedia(token,selected.id,{...form,revision:selected.revision});edit(result.media);setMessage(result.message);await load();onChanged();}catch(e){setError(e.message);}finally{setBusy(false);}}}>
        {field('title','Image title')}{field('altText','Image alternative text',600,true)}{field('caption','Image caption',1000,true)}{field('creator','Image creator or rights holder')}{field('licenseName','Image license or ownership description')}{field('sourceURL','Image original source URL',1000)}{field('licenseURL','Image license URL',1000)}{field('attribution','Image attribution text',1500,true)}{field('permissionReference','Image permission or ownership evidence reference',400)}
        <label>Image permission expiry (optional)<input type="date" aria-label="Image permission expiry (optional)" value={form.validUntil || ''} onChange={e=>change('validUntil',e.target.value)}/></label>
        <label>Image review status<select aria-label="Image review status" value={form.status} onChange={e=>change('status',e.target.value)}><option value="draft">Draft</option><option value="review">Awaiting review</option><option value="cleared">Cleared by operator review</option></select></label>
        <label><input type="checkbox" checked={form.commercialUseAllowed} onChange={e=>change('commercialUseAllowed',e.target.checked)}/>Image commercial redistribution is permitted</label><label><input type="checkbox" checked={form.offlineRedistributionAllowed} onChange={e=>change('offlineRedistributionAllowed',e.target.checked)}/>Image offline redistribution is permitted</label>
        <fieldset><legend>Image permitted platforms</legend>{['web','android','windows'].map(platform=><label key={platform}><input type="checkbox" checked={form.platforms.includes(platform)} onChange={e=>change('platforms',e.target.checked?[...form.platforms,platform]:form.platforms.filter(p=>p!==platform))}/>{platform}</label>)}</fieldset>
        {form.status==='cleared' && <><label><input type="checkbox" checked={form.confirmRightsReview} onChange={e=>setForm({...form,confirmRightsReview:e.target.checked})}/>I checked this image's ownership evidence, attribution and permitted scope.</label><label><input type="checkbox" checked={form.confirmImageReview} onChange={e=>setForm({...form,confirmImageReview:e.target.checked})}/>I viewed the stored image and checked chemistry accuracy, caption and alternative text.</label></>}
        <div className="record-actions"><button disabled={busy}>Save image review</button><button type="button" onClick={()=>{setSelected(null);setForm(null);}}>Close image editor</button></div>
      </form>
    </section>}
    <p>{data.notice}</p>{action && <RecordConfirmDialog action={action} onClose={()=>setAction(null)}/>}
  </div>;
}
