import React from 'react';
import { Pill } from '../components/Primitives.jsx';

const TOOLS = [
  { key: 'periodic', icon: '⊞', name: 'PERIODIC TABLE',    desc: 'All 118 elements · electron configs',   color: '#00d4ff' },
  { key: 'balancer', icon: '⚖', name: 'EQUATION BALANCER', desc: 'Exact linear-algebra solver',           color: '#06a06e' },
  { key: 'qa',       icon: '⊗', name: 'QA TABLE',          desc: 'Cation / anion / gas / functional-group tests',             color: '#ffbe0b' },
  { key: 'mole',     icon: 'Σ', name: 'MOLE CALCULATOR',   desc: 'n=m/M · PV=nRT · c=n/V · dilution',      color: '#c77dff' },
];

export function ToolsMenu({ t, onOpen }) {
  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>UTILITIES · 4 LIVE</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 16 }}>Tools</div>
      <div className="cw-tools-grid">
      {TOOLS.map(tool => (
        <button className="cw-tool-tile" key={tool.key} onClick={() => onOpen(tool.key)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 14, marginBottom: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div style={{ width: 44, height: 44, background: `${tool.color}20`, color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginRight: 12, borderRadius: 8 }}>{tool.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.text, fontWeight: 700 }}>{tool.name}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{tool.desc}</div>
          </div>
          <Pill color={tool.color} t={t}>● LIVE</Pill>
        </button>
      ))}
      </div>
    </div>
  );
}
