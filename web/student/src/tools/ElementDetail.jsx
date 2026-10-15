import React from 'react';
import { CATEGORIES } from './elementsData.js';
import { electronConfig, CONFIG_EXCEPTION_IDS } from '../utils/helpers.js';
import { Pill } from '../components/Primitives.jsx';

export function ElementDetail({ element, t, onExit }) {
  const [z, sym, name, mass, cat, grp, per] = element;
  const c = CATEGORIES[cat];
  const config = electronConfig(z);
  const block = (() => {
    if ([1, 2].includes(grp)) return 's';
    if (grp >= 13 && grp <= 18) return 'p';
    if (cat === 'ln' || cat === 'ac') return 'f';
    return 'd';
  })();
  const displayPer = cat === 'ln' ? 6 : cat === 'ac' ? 7 : per;
  const displayGrp = (cat === 'ln' || cat === 'ac') ? '—' : grp;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 24, background: `${c.color}20`, border: `2px solid ${c.color}`, borderRadius: 12, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: c.color, fontFamily: 'monospace', fontWeight: 700 }}>{z}</div>
        <div style={{ fontSize: 64, fontWeight: 800, color: t.text, lineHeight: 1, margin: '6px 0' }}>{sym}</div>
        <div style={{ fontSize: 18, color: t.text, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4, fontFamily: 'monospace' }}>{typeof mass === 'number' ? mass.toFixed(2) : mass} g·mol⁻¹</div>
      </div>

      <div style={{ padding: 14, background: t.panel, borderRadius: 8, marginBottom: 10 }}>
        {[
          ['CATEGORY', <Pill key="c" color={c.color} t={t}>{c.label.toUpperCase()}</Pill>],
          ['GROUP', displayGrp],
          ['PERIOD', displayPer],
          ['BLOCK', `${block}-block`],
        ].map(([label, val], i) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 3 ? 10 : 0 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>{label}</span>
            {typeof val === 'object' ? val : <span style={{ fontSize: 12, color: t.text, fontFamily: 'monospace', fontWeight: 700 }}>{val}</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: 14, background: t.panel, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace', marginBottom: 8 }}>ELECTRON CONFIGURATION</div>
        <div style={{ fontSize: 14, color: c.color, fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-word' }}>{config}</div>
        {CONFIG_EXCEPTION_IDS.has(z) && <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontStyle: 'italic' }}>Anomalous — half- or full-filled subshell stability</div>}
      </div>

      <button onClick={onExit} style={{ width: '100%', padding: 12, background: t.accent, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.25em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer', marginTop: 8 }}>‹ BACK TO TABLE</button>
    </div>
  );
}
