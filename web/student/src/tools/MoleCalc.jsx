import React, { useState } from 'react';

const MODES = {
  nm:  { label: 'n = m/M',     title: 'Mass ↔ Moles',     vars: ['n','m','M'],       units: { n:'mol', m:'g', M:'g·mol⁻¹' } },
  pv:  { label: 'PV = nRT',    title: 'Ideal Gas',         vars: ['P','V','n','T'],   units: { P:'kPa', V:'dm³', n:'mol', T:'K' } },
  cv:  { label: 'c = n/V',     title: 'Concentration',     vars: ['c','n','V'],       units: { c:'mol·dm⁻³', n:'mol', V:'dm³' } },
  dil: { label: 'C₁V₁ = C₂V₂', title: 'Dilution',          vars: ['C1','V1','C2','V2'], units: { C1:'mol·dm⁻³', V1:'dm³', C2:'mol·dm⁻³', V2:'dm³' } },
};
const R = 8.314;

const subify = (k) => ({ C1:'C₁', V1:'V₁', C2:'C₂', V2:'V₂' }[k] || k);

function calculate(mode, sf, p) {
  if (mode === 'nm') {
    if (sf === 'n') return { val: p.m / p.M, unit: 'mol', eq: `n = m / M = ${p.m} / ${p.M}` };
    if (sf === 'm') return { val: p.n * p.M, unit: 'g', eq: `m = n × M = ${p.n} × ${p.M}` };
    if (sf === 'M') return { val: p.m / p.n, unit: 'g·mol⁻¹', eq: `M = m / n = ${p.m} / ${p.n}` };
  }
  if (mode === 'pv') {
    if (sf === 'P') return { val: (p.n * R * p.T) / p.V, unit: 'kPa', eq: `P = nRT/V` };
    if (sf === 'V') return { val: (p.n * R * p.T) / p.P, unit: 'dm³', eq: `V = nRT/P` };
    if (sf === 'n') return { val: (p.P * p.V) / (R * p.T), unit: 'mol', eq: `n = PV/RT` };
    if (sf === 'T') return { val: (p.P * p.V) / (p.n * R), unit: 'K', eq: `T = PV/nR` };
  }
  if (mode === 'cv') {
    if (sf === 'c') return { val: p.n / p.V, unit: 'mol·dm⁻³', eq: `c = n/V` };
    if (sf === 'n') return { val: p.c * p.V, unit: 'mol', eq: `n = c × V` };
    if (sf === 'V') return { val: p.n / p.c, unit: 'dm³', eq: `V = n/c` };
  }
  if (mode === 'dil') {
    if (sf === 'C1') return { val: (p.C2 * p.V2) / p.V1, unit: 'mol·dm⁻³', eq: `C₁ = C₂V₂/V₁` };
    if (sf === 'V1') return { val: (p.C2 * p.V2) / p.C1, unit: 'dm³', eq: `V₁ = C₂V₂/C₁` };
    if (sf === 'C2') return { val: (p.C1 * p.V1) / p.V2, unit: 'mol·dm⁻³', eq: `C₂ = C₁V₁/V₂` };
    if (sf === 'V2') return { val: (p.C1 * p.V1) / p.C2, unit: 'dm³', eq: `V₂ = C₁V₁/C₂` };
  }
  return null;
}

export function MoleCalc({ t }) {
  const [mode, setMode] = useState('nm');
  const [solveFor, setSolveFor] = useState('');
  const [vals, setVals] = useState({});
  const cur = MODES[mode];
  const sf = solveFor || cur.vars[0];

  const hasInputs = cur.vars.filter(v => v !== sf).every(k => vals[k] !== undefined && vals[k] !== '' && !isNaN(parseFloat(vals[k])));
  let result = null;
  if (hasInputs) {
    const p = {};
    cur.vars.filter(v => v !== sf).forEach(k => { p[k] = parseFloat(vals[k]); });
    result = calculate(mode, sf, p);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>TOOL · 04</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 4 }}>Mole Calculator</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Four modes · solve for any variable</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
        {Object.entries(MODES).map(([k, m]) => (
          <button key={k} aria-pressed={mode === k} onClick={() => { setMode(k); setSolveFor(''); setVals({}); }} style={{ padding: '10px 6px', background: mode === k ? t.accent : t.panel, color: mode === k ? '#000' : t.text, border: `1px solid ${mode === k ? t.accent : t.border}`, fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4, textAlign: 'center' }}>
            <div>{m.label}</div>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', marginTop: 4, opacity: 0.8 }}>{m.title.toUpperCase()}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: 12, background: t.panel, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace', marginBottom: 8 }}>SOLVE FOR</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cur.vars.map(v => (
            <button key={v} aria-pressed={sf === v} onClick={() => setSolveFor(v)} style={{ padding: '6px 14px', background: sf === v ? t.accent : 'transparent', color: sf === v ? '#000' : t.text, border: `1px solid ${sf === v ? t.accent : t.border}`, fontSize: 12, fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer', borderRadius: 4 }}>{subify(v)}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, background: t.panel, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace', marginBottom: 8 }}>INPUTS</div>
        {cur.vars.filter(v => v !== sf).map(k => (
          <div key={k} style={{ marginBottom: 8 }}>
            <label htmlFor={`cw-mole-${k}`} style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 3 }}>{subify(k)} <span style={{ color: t.textDim, fontSize: 10 }}>({cur.units[k]})</span></label>
            <input id={`cw-mole-${k}`} type="number" step="any" value={vals[k] ?? ''} onChange={e => setVals({ ...vals, [k]: e.target.value })} placeholder="0" style={{ width: '100%', padding: '8px 10px', background: t.bg, border: `1px solid ${t.border}`, color: t.text, fontFamily: 'monospace', fontSize: 13, outline: 'none', borderRadius: 4, boxSizing: 'border-box' }} />
          </div>
        ))}
      </div>

      {result && Number.isFinite(result.val) && (
        <div style={{ padding: 16, background: `${t.accent}15`, border: `1px solid ${t.accent}`, borderRadius: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: t.accent, fontWeight: 700, marginBottom: 6, fontFamily: 'monospace' }}>✓ RESULT</div>
          <div style={{ fontSize: 24, color: t.text, fontFamily: 'monospace', fontWeight: 700 }}>
            {subify(sf)} = {(Math.abs(result.val) < 0.01 || Math.abs(result.val) > 1e5) ? result.val.toExponential(4) : parseFloat(result.val.toFixed(4))} <span style={{ fontSize: 13, color: t.textMuted }}>{result.unit}</span>
          </div>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: 'monospace', marginTop: 8 }}>{result.eq}</div>
        </div>
      )}

      {mode === 'pv' && (
        <div style={{ marginTop: 16, padding: 12, background: t.panel, borderRadius: 8, fontSize: 10, color: t.textDim, lineHeight: 1.5 }}>
          <strong style={{ color: t.text }}>Units:</strong> P in kPa, V in dm³, T in K, R = 8.314 J·K⁻¹·mol⁻¹. Convert °C → K by adding 273.15.
        </div>
      )}
    </div>
  );
}
