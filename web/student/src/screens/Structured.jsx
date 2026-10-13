import React, { useState } from 'react';
import { Pill } from '../components/Primitives.jsx';

export function Structured({ topic, bank, t, onExit }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState({});
  const q = bank[i];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>P2 · {i + 1}/{bank.length}</div>
        <Pill color={topic.color} t={t}>{q.marks} MARKS</Pill>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8 }}>{q.title}</div>
      <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.55, marginBottom: 16 }}>{q.q}</div>
      {q.parts.map((p, idx) => (
        <div key={idx} style={{ marginBottom: 16, padding: 12, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6 }}>
          <div className="cw-question-part-heading" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{p.q}</div>
            <Pill color={topic.color} t={t}>{p.marks}m</Pill>
          </div>
          <button onClick={() => setRevealed({ ...revealed, [idx]: !revealed[idx] })} style={{ width: '100%', padding: '8px', background: 'transparent', border: `1px dashed ${topic.color}60`, color: topic.color, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: 'pointer', marginTop: 6 }}>{revealed[idx] ? 'HIDE MODEL' : 'REVEAL MODEL'}</button>
          {revealed[idx] && <div style={{ marginTop: 10, padding: 10, background: `${topic.color}0d`, borderRadius: 4, fontSize: 12, color: t.text, lineHeight: 1.55 }}>{p.ans}</div>}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => { if (i > 0) { setI(i - 1); setRevealed({}); } }} disabled={i === 0} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${t.border}`, color: i === 0 ? t.textDim : t.text, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: i === 0 ? 'default' : 'pointer' }}>← PREV</button>
        <button onClick={() => { if (i < bank.length - 1) { setI(i + 1); setRevealed({}); } else { onExit(); } }} style={{ flex: 1, padding: '10px', background: topic.color, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>{i < bank.length - 1 ? 'NEXT →' : 'FINISH'}</button>
      </div>
    </div>
  );
}

export function Worked({ topic, bank, t, onExit }) {
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const ex = bank[i];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>EXAMPLE {i + 1}/{bank.length}</div>
        <Pill color={ex.diff === 'easy' ? '#06a06e' : ex.diff === 'medium' ? '#ffbe0b' : '#e63946'} t={t}>{ex.diff.toUpperCase()}</Pill>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 8 }}>{ex.title}</div>
      <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.55, marginBottom: 16, padding: 12, background: t.panel, borderRadius: 6 }}>{ex.q}</div>
      {ex.steps.slice(0, step + 1).map((s, idx) => (
        <div key={idx} style={{ marginBottom: 10, padding: 12, background: t.panel, borderLeft: `3px solid ${topic.color}`, borderRadius: 4 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', color: topic.color, fontWeight: 700, marginBottom: 5 }}>{s.label}</div>
          <div style={{ fontSize: 13, color: t.text, lineHeight: 1.55 }}>{s.text}</div>
        </div>
      ))}
      {step < ex.steps.length - 1 && (
        <button onClick={() => setStep(step + 1)} style={{ width: '100%', padding: '10px', background: 'transparent', border: `1px dashed ${topic.color}`, color: topic.color, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: 'pointer', marginBottom: 10 }}>+ NEXT STEP</button>
      )}
      {step >= ex.steps.length - 1 && !showAns && (
        <button onClick={() => setShowAns(true)} style={{ width: '100%', padding: '10px', background: topic.color, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer', marginBottom: 10 }}>SHOW FINAL ANSWER</button>
      )}
      {showAns && <div style={{ padding: 14, background: `${topic.color}15`, border: `1px solid ${topic.color}`, borderRadius: 6, fontSize: 13, color: t.text, marginBottom: 10 }}><div style={{ fontSize: 10, color: topic.color, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 6 }}>✓ ANSWER</div>{ex.ans}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => { if (i > 0) { setI(i - 1); setStep(0); setShowAns(false); } }} disabled={i === 0} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${t.border}`, color: i === 0 ? t.textDim : t.text, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: i === 0 ? 'default' : 'pointer' }}>← PREV</button>
        <button onClick={() => { if (i < bank.length - 1) { setI(i + 1); setStep(0); setShowAns(false); } else { onExit(); } }} style={{ flex: 1, padding: '10px', background: topic.color, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>{i < bank.length - 1 ? 'NEXT →' : 'DONE'}</button>
      </div>
    </div>
  );
}
