import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import documents from '../../shared/legal-documents.json';
import {PrivacyLinks} from '../../shared/PrivacyLinks.jsx';
import {getPublicPrivacy} from '../student/src/config/api.js';
import '../../shared/privacy.css';
function Legal(){
  const [config,setConfig]=useState(null),[error,setError]=useState('');
  const slug=location.pathname.split('/').filter(Boolean)[1] || 'privacy',doc=documents[slug];
  async function load(){try{setError('');setConfig(await getPublicPrivacy());}catch{setError('The operator details could not be loaded. Please retry or contact the WhatsApp helpline.');}}
  useEffect(()=>{load();},[]);
  return <div className="cw-privacy-root"><main className="cw-privacy-page"><a className="cw-privacy-title" href="/">Chem<span>Wiz</span></a><PrivacyLinks/><article className="cw-privacy">
    <a href="/">‹ ChemWiz home</a>
    <h1>{doc?.title || 'Policy page not found'}</h1>
    {!config?.published&&<p className="cw-privacy-notice">These policy pages are awaiting operator publication. New learner activation is paused until the operator details and review are complete. Existing accounts can sign in to reach account choices and help.</p>}
    {error&&<p role="alert">{error} <button onClick={load}>Retry details</button></p>}
    {doc&&<><p>{doc.intro}</p><small>Policy version {config?.version || '2026-10-16.1'} · Updated 16 October 2026</small>{doc.sections.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</>}
    <section aria-label="Operator details"><h2>Operator and privacy contact</h2>{config?.operator?<><p><strong>{config.operator}</strong><br/>{config.address}</p><p>{config.privacyContactName}<br/><a href={'mailto:'+config.privacyEmail}>{config.privacyEmail}</a></p></>:<p>The operator’s legal name, service address and monitored privacy contact are awaiting publication.</p>}<p><a href="https://wa.me/263718645362" rel="noopener noreferrer" target="_blank">WhatsApp helpline: +263 718 645 362</a>. Ask for a private contact before sending sensitive documents.</p></section>
    {config?.hostingDetails&&<section><h2>Hosting and overseas processing</h2><p style={{whiteSpace:'pre-wrap'}}>{config.hostingDetails}</p><h2>Provider retention and backups</h2><p style={{whiteSpace:'pre-wrap'}}>{config.providerRetention}</p><p>Operator’s configured backup retention: {config.backupRetentionDays} days. Requests are assessed for applicable retention exceptions.</p></section>}
    <section><h2>Further information</h2><p><a href="/legal/learners">Learner privacy summary</a> · <a href="/legal/schools">School subscriptions</a> · <a href="https://www.potraz.gov.zw/" target="_blank" rel="noopener noreferrer">POTRAZ</a></p></section>
    <footer><p>© ChemWiz 2026. All rights reserved.<br/>System developed by D’ineiru Microsystems, a subsidiary of D’ineiru Enterprises Pvt Ltd.</p></footer>
  </article></main></div>;
}
createRoot(document.getElementById('root')).render(<Legal/>);
