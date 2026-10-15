import React, { useState } from 'react';
import { balance } from './balancerEngine.js';
import { toSub } from '../utils/helpers.js';

export function Balancer({ t }) {
  const [input, setInput] = useState('C6H14 + O2 = CO2 + H2O');
  const [result, setResult] = useState(null);

  const prettyFormula = (f) => f.replace(/(\d+)/g, (_, d) => toSub(d));

  const handleBalance = () => {
    const clean = input.replace(/[₀-₉]/g, c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/→|⟶|=>/g, '=').trim();
    const parts = clean.split(/->|=/);
    if (parts.length !== 2) {
      setResult({ error: 'Use = or → to separate sides. E.g. "H2 + O2 = H2O"' });
      return;
    }
    const leftStrs = parts[0].split('+').map(s => s.trim()).filter(Boolean);
    const rightStrs = parts[1].split('+').map(s => s.trim()).filter(Boolean);
    if (!leftStrs.length || !rightStrs.length) {
      setResult({ error: 'Need reactants and products' });
      return;
    }
    try {
      const coefs = balance(leftStrs, rightStrs);
      if (!coefs) { setResult({ error: 'No unique balance — check formulas or equation structure' }); return; }
      setResult({ leftStrs, rightStrs, coefs });
    } catch {
      setResult({ error: 'Parse error — check element symbols' });
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>TOOL · 02</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 4 }}>Equation Balancer</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Exact linear-algebra solver · any reaction type · nested brackets OK</div>

      <div style={{ padding: 12, background: t.panel, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, marginBottom: 6, fontFamily: 'monospace' }}>UNBALANCED EQUATION</div>
        <textarea aria-label="Unbalanced chemical equation" value={input} onChange={e => { setInput(e.target.value); setResult(null); }} placeholder="e.g. H2 + O2 = H2O" style={{ width: '100%', minHeight: 50, padding: 10, background: t.bg, border: `1px solid ${t.border}`, color: t.text, fontFamily: 'monospace', fontSize: 13, outline: 'none', resize: 'vertical', borderRadius: 4, boxSizing: 'border-box' }} />
        <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>Tip: write digits inline — H2, CO2, Ca(OH)2. Separate with + and = (or →)</div>
      </div>

      <button onClick={handleBalance} style={{ width: '100%', padding: 12, background: t.accent, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.25em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer', marginBottom: 10 }}>▶ BALANCE</button>

      {result?.error && (
        <div style={{ padding: 14, background: '#e6394620', border: '1px solid #e63946', borderRadius: 6, color: '#e63946', fontSize: 12, lineHeight: 1.5 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 4 }}>✗ ERROR</div>
          {result.error}
        </div>
      )}
      {result?.coefs && (
        <div style={{ padding: 16, background: `${t.accent}15`, border: `1px solid ${t.accent}`, borderRadius: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: t.accent, fontWeight: 700, marginBottom: 10, fontFamily: 'monospace' }}>✓ BALANCED</div>
          <div style={{ fontSize: 17, color: t.text, fontFamily: 'monospace', lineHeight: 1.6, wordBreak: 'break-word' }}>
            {result.leftStrs.map((f, i) => (
              <span key={`l-${i}`}>
                {i > 0 && <span style={{ color: t.textMuted }}> + </span>}
                {result.coefs[i] > 1 && <span style={{ color: t.accent, fontWeight: 700 }}>{result.coefs[i]}</span>}
                <span>{prettyFormula(f)}</span>
              </span>
            ))}
            <span style={{ color: t.accent, margin: '0 8px' }}> → </span>
            {result.rightStrs.map((f, i) => (
              <span key={`r-${i}`}>
                {i > 0 && <span style={{ color: t.textMuted }}> + </span>}
                {result.coefs[result.leftStrs.length + i] > 1 && <span style={{ color: t.accent, fontWeight: 700 }}>{result.coefs[result.leftStrs.length + i]}</span>}
                <span>{prettyFormula(f)}</span>
              </span>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: t.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            COEFFICIENTS: [{result.coefs.join(', ')}]
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, padding: 12, background: t.panel, borderRadius: 8 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, marginBottom: 8, fontFamily: 'monospace' }}>TRY THESE</div>
        {['H2 + O2 = H2O', 'C6H14 + O2 = CO2 + H2O', 'C8H18 + O2 = CO2 + H2O', 'Ca(OH)2 + HCl = CaCl2 + H2O', 'KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2', 'K4[Fe(CN)6] + H2SO4 + H2O = K2SO4 + FeSO4 + (NH4)2SO4 + CO'].map((ex, i) => (
          <button key={i} onClick={() => { setInput(ex); setResult(null); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', marginBottom: 3, background: 'transparent', border: `1px dashed ${t.border}`, color: t.textMuted, fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', borderRadius: 3 }}>{ex}</button>
        ))}
      </div>
    </div>
  );
}
