import { useEffect, useRef, useState } from 'react';
import './protected-image.css';
export function ProtectedImage({ image, load }) {
  const [url,setURL] = useState(''), [busy,setBusy] = useState(false), [error,setError] = useState('');
  const current = useRef(''), epoch = useRef(0);
  useEffect(() => { setURL(''); setError(''); setBusy(false); return () => { epoch.current++; if (current.current) URL.revokeObjectURL(current.current); current.current = ''; }; }, [image.id,image.version,load]);
  async function show() {
    const request = ++epoch.current; setBusy(true); setError('');
    try { const blob = await load(image.id); if (request !== epoch.current) return; const next = URL.createObjectURL(blob); if (current.current) URL.revokeObjectURL(current.current); current.current = next; setURL(next); }
    catch(e) { if (request === epoch.current) setError(e.message); }
    finally { if (request === epoch.current) setBusy(false); }
  }
  return <figure className="cw-protected-image" aria-label={image.title || 'Lesson illustration'}>
    {url ? <img src={url} alt={image.altText || 'Draft image: alternative text needs review'} width={image.width} height={image.height} onError={() => { URL.revokeObjectURL(current.current); current.current = ''; setURL(''); setError('The image could not be displayed. Retry or refresh this lesson.'); }} /> : <><p>{image.altText || 'Alternative text needs review.'}</p><button type="button" disabled={busy} onClick={show}>{busy ? 'Loading illustration…' : error ? 'Retry illustration' : 'View illustration'}</button><small>{image.width} × {image.height} · {Math.ceil(image.byteLength/1024)} KiB</small></>}
    {error && <p role="alert">{error}</p>}<figcaption>{image.caption || 'Caption needs review.'}<small>{image.attribution || image.creator || 'Source attribution needs review.'}</small></figcaption>
  </figure>;
}
