import React, { useState } from 'react';
import { Diagram } from './Diagram.jsx';
import { diagramText } from '../utils/diagramLayout.mjs';

export function Ring({ pct, color, t, size = 60 }) {
  const r = size / 2 - 4, c = 2 * Math.PI * r;
  return (
    <svg role="img" aria-label={`${pct}% complete`} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.border} strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />
      <text x={size/2} y={size/2+4} textAnchor="middle" fill={t.text} fontSize={size > 50 ? 12 : 10} fontFamily="monospace" fontWeight="700">{pct}%</text>
    </svg>
  );
}

export function Pill({ children, color, t }) {
  return <span className="cw-pill" style={{ display:'inline-block', padding:'2px 8px', fontSize:9, letterSpacing:'0.15em', border:`1px solid ${color}80`, color, borderRadius:3, fontWeight:600, fontFamily:'monospace' }}>{children}</span>;
}

/**
 * Block — renders one content block of a chapter.
 * Block types supported:
 *   { type: 'p',     text }                         — paragraph
 *   { type: 'h',     text }                         — inline sub-heading
 *   { type: 'ul',    items: [] }                    — unordered list
 *   { type: 'd',     spec, caption }                — shared diagram spec
 *   { type: 'callout', kind: 'definition'|'key'|'warning', title, body }
 *   { type: 'takeaway', items: [] }                 — green key-takeaway box
 */
export function Block({ block, color, t }) {
  if (block.type === 'p') {
    return <p style={{ fontSize:14, lineHeight:1.65, color:t.text, margin:'0 0 12px' }}>{block.text}</p>;
  }
  if (block.type === 'h') {
    return <h4 style={{ fontSize:11, letterSpacing:'0.2em', color, margin:'16px 0 8px', fontWeight:700 }}>{block.text.toUpperCase()}</h4>;
  }
  if (block.type === 'ul') {
    return (
      <ul style={{ margin:'0 0 12px', paddingLeft:18 }}>
        {block.items.map((it, i) => <li key={i} style={{ fontSize:13, lineHeight:1.6, color:t.text, marginBottom:4 }}>{it}</li>)}
      </ul>
    );
  }
  if (block.type === 'd') {
    return <DiagramBlock block={block} color={color} t={t} />;
  }
  if (block.type === 'callout') {
    const palette = { definition:'#00d4ff', key:'#ffbe0b', warning:'#e63946' };
    const c = palette[block.kind] || color;
    return (
      <div style={{ margin:'12px 0', padding:'12px 14px', background:`${c}10`, borderLeft:`3px solid ${c}`, borderRadius:4 }}>
        <div style={{ fontSize:10, letterSpacing:'0.15em', color:c, fontWeight:700, marginBottom:4 }}>{block.kind.toUpperCase()} · {block.title}</div>
        <div style={{ fontSize:13, lineHeight:1.5, color:t.text }}>{block.body}</div>
      </div>
    );
  }
  if (block.type === 'takeaway') {
    return (
      <div style={{ margin:'16px 0 8px', padding:14, background:`${color}0d`, border:`1px solid ${color}40`, borderRadius:8 }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', color, fontWeight:700, marginBottom:8 }}>✦ KEY TAKEAWAYS</div>
        <ul style={{ margin:0, paddingLeft:16 }}>
          {block.items.map((it, i) => <li key={i} style={{ fontSize:12, lineHeight:1.55, color:t.text, marginBottom:4 }}>{it}</li>)}
        </ul>
      </div>
    );
  }
  return null;
}

function DiagramBlock({block,color,t}) {
  const [enlarged,setEnlarged]=useState(false);
  return <figure className="cw-diagram-figure" style={{margin:'12px 0 16px',padding:12,background:t.panel,border:`1px solid ${t.border}`,borderRadius:8}}>
    {block.spec && <div className="cw-diagram-actions">
      <button type="button" aria-pressed={enlarged} onClick={()=>setEnlarged(value=>!value)}>{enlarged?'Normal diagram size':'Enlarge diagram'}</button>
      <span>Scroll sideways when needed</span>
    </div>}
    <div className="cw-diagram-scroll" role="group" tabIndex={0} aria-label={block.caption || block.spec?.title || 'Chemistry diagram'}>
      {block.spec ? <Diagram spec={block.spec} color={color} t={t} scale={enlarged?1.75:1}/> : '[Diagram]'}
    </div>
    {block.caption && <figcaption>{block.caption}</figcaption>}
    {block.spec && <details className="cw-diagram-description"><summary>Read diagram text</summary><ul>{diagramText(block.spec).map((text,i)=><li key={i}>{text}</li>)}</ul></details>}
  </figure>;
}
