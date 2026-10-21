import { useState } from 'react';
import { getMediaLibrary } from '../config/api.js';
export function MediaAttachments({ token, value, onChange }) {
  const [data,setData] = useState(null), [error,setError] = useState(''), [search,setSearch] = useState(''), [busy,setBusy] = useState(false);
  async function load(page = 1) { setBusy(true); setError(''); try { setData(await getMediaLibrary(token,{page,search})); } catch(e) { setError(e.message); } finally { setBusy(false); } }
  return <fieldset><legend>Lesson illustrations ({value.length}/6)</legend><p>Select up to six images, totalling at most 4 MiB. Saving binds the current image reviews to this exact draft. Re-save after any image review changes.</p>
    {value.map(id=><div className="record-actions" key={id}><code>{id}</code><button type="button" onClick={()=>onChange(value.filter(item=>item!==id))}>Remove selected image {id}</button></div>)}
    <button type="button" disabled={busy} onClick={()=>load()}>Choose or refresh lesson images</button>
    {data && <><div className="record-actions"><input aria-label="Find lesson images" value={search} onChange={e=>setSearch(e.target.value)}/><button type="button" disabled={busy} onClick={()=>load()}>Find images</button></div>{data.items.map(item=><label key={item.id}><input type="checkbox" checked={value.includes(item.id)} disabled={busy || !value.includes(item.id) && value.length>=6} onChange={e=>onChange(e.target.checked?[...value,item.id]:value.filter(id=>id!==item.id))}/>{item.title} · {item.eligible?'reviewed':'needs review'} · {Math.ceil(item.byteLength/1024)} KiB</label>)}<div className="record-actions"><button type="button" disabled={busy || data.pagination.page<=1} onClick={()=>load(data.pagination.page-1)}>Earlier image choices</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button type="button" disabled={busy || data.pagination.page>=data.pagination.pages} onClick={()=>load(data.pagination.page+1)}>More image choices</button></div></>}
    {error && <p role="alert">{error}</p>}
  </fieldset>;
}
