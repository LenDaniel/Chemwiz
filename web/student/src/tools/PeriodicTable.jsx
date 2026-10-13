import React, { useState } from 'react';
import { ELEMENTS, CATEGORIES } from './elementsData.js';

export function PeriodicTable({ t, onElementTap }) {
  const [filter, setFilter] = useState('all');

  const cellFor = (p, g) => {
    const el = ELEMENTS.find(e => e[5] === g && e[6] === p);
    if (!el) return null;
    const cat = CATEGORIES[el[4]];
    const dim = filter !== 'all' && filter !== el[4];
    return (
      <button className="cw-element-cell" key={`${p}-${g}`} onClick={() => onElementTap(el)} style={{
        width: 18, height: 22, padding: 0,
        background: dim ? t.panel : cat.color, border: `0.5px solid ${t.border}`,
        color: dim ? t.textDim : '#000', fontFamily: 'monospace', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: dim ? 0.35 : 1, borderRadius: 2,
      }}>
        <div style={{ fontSize: 6, lineHeight: 1, fontWeight: 600 }}>{el[0]}</div>
        <div style={{ fontSize: 8, lineHeight: 1.1, fontWeight: 800 }}>{el[1]}</div>
      </button>
    );
  };

  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>TOOL · 01</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 4 }}>Periodic Table</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Tap any element for details</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
        <button onClick={() => setFilter('all')} style={{ padding: '4px 8px', fontSize: 9, letterSpacing: '0.1em', fontFamily: 'monospace', background: filter === 'all' ? t.accent : 'transparent', color: filter === 'all' ? '#000' : t.text, border: `1px solid ${filter === 'all' ? t.accent : t.border}`, cursor: 'pointer', fontWeight: 700 }}>ALL</button>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '4px 8px', fontSize: 9, letterSpacing: '0.1em', fontFamily: 'monospace', background: filter === k ? v.color : 'transparent', color: filter === k ? '#000' : v.color, border: `1px solid ${v.color}`, cursor: 'pointer', fontWeight: 700 }}>{v.label.toUpperCase()}</button>
        ))}
      </div>

      <div className="cw-table-scroll" tabIndex={0} role="region" aria-label="Periodic table; scroll horizontally to see all elements">
      <div className="cw-periodic-grid">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 1, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5, 6, 7].map(p =>
          Array.from({ length: 18 }, (_, i) => cellFor(p, i + 1) || <div key={`empty-${p}-${i + 1}`} className="cw-element-placeholder" style={{ width: 18, height: 22 }} />))}
      </div>
      <div style={{ height: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 1, marginBottom: 1 }}>
        <div style={{ gridColumn: '1 / 4' }} />
        {Array.from({ length: 15 }, (_, i) => cellFor(9, i + 3) || <div key={`empty-9-${i + 3}`} className="cw-element-placeholder" style={{ width: 18, height: 22 }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 1 }}>
        <div style={{ gridColumn: '1 / 4' }} />
        {Array.from({ length: 15 }, (_, i) => cellFor(10, i + 3) || <div key={`empty-10-${i + 3}`} className="cw-element-placeholder" style={{ width: 18, height: 22 }} />)}
      </div>

      </div>
      </div>

      <div style={{ marginTop: 20, padding: 12, background: t.panel, borderRadius: 8 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace', marginBottom: 8 }}>LEGEND</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: t.text }}>
              <div style={{ width: 10, height: 10, background: v.color, borderRadius: 2 }} />
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
