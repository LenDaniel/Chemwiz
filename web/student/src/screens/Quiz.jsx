import React, { useEffect, useRef, useState } from 'react';
import { Ring } from '../components/Primitives.jsx';

export function Quiz({ topic, bank, t, onExit, onComplete }) {
  const [i, setI] = useState(0);
  const questionRef = useRef(null);
  useEffect(() => { questionRef.current?.focus({ preventScroll: true }); }, [i]);
  const [picks, setPicks] = useState(Array(bank.length).fill(null)); // remembered per question
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const q = bank[i];
  const pick = picks[i];

  const setPick = (idx) => {
    const next = picks.slice();
    next[i] = idx;
    setPicks(next);
  };

  const finish = () => {
    let score = 0;
    const mistakes = [];
    bank.forEach((qq, k) => {
      if (picks[k] === qq.ans) score++;
      else if (picks[k] !== null) mistakes.push({ ...qq, picked: picks[k] });
    });
    setDone(true);
    onComplete?.(score, bank.length, mistakes);
  };

  const goNext = () => {
    if (pick === null) return;
    setShowHint(false);
    if (i + 1 >= bank.length) finish();
    else setI(i + 1);
  };

  const goPrev = () => {
    if (i === 0) return;
    setShowHint(false);
    setI(i - 1);
  };

  if (done) {
    let score = 0;
    const mistakes = [];
    bank.forEach((qq, k) => {
      if (picks[k] === qq.ans) score++;
      else if (picks[k] !== null) mistakes.push({ ...qq, picked: picks[k] });
    });
    const pct = Math.round((score / bank.length) * 100);
    return (
      <div style={{ padding: 16 }}>
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <Ring pct={pct} color={topic.color} t={t} size={110} />
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: topic.color, marginTop: 16, fontWeight: 700 }}>QUIZ COMPLETE</div>
          <div style={{ fontSize: 22, color: t.text, margin: '8px 0 4px', fontFamily: 'monospace' }}>{score}/{bank.length}</div>
          <div style={{ fontSize: 11, color: t.textDim, letterSpacing: '0.1em' }}>{pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'GOOD' : pct >= 40 ? 'KEEP PRACTISING' : 'REVIEW CHAPTERS'}</div>
        </div>
        {mistakes.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, marginBottom: 10, fontWeight: 700 }}>✗ MISTAKES ({mistakes.length})</div>
            {mistakes.map((m, idx) => (
              <div key={idx} style={{ padding: 12, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: t.text, marginBottom: 6 }}>{m.q}</div>
                <div style={{ fontSize: 11, color: '#e63946' }}>Your answer: {m.opts[m.picked]}</div>
                <div style={{ fontSize: 11, color: '#06a06e' }}>Correct: {m.opts[m.ans]}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={() => { setI(0); setPicks(Array(bank.length).fill(null)); setDone(false); setShowHint(false); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${topic.color}`, color: topic.color, fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>RETRY</button>
          <button onClick={onExit} style={{ flex: 1, padding: '12px', background: topic.color, border: 'none', color: '#000', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>DONE</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>Q{i + 1} / {bank.length}</div>
        <div className="cw-quiz-progress" style={{ display: 'flex', gap: 3 }}>
          {bank.map((_, idx) => (
            <div key={idx} style={{ width: 6, height: 6, borderRadius: '50%', background: picks[idx] !== null ? topic.color : (idx === i ? `${topic.color}80` : t.border) }} />
          ))}
        </div>
      </div>
      <div ref={questionRef} tabIndex={-1} role="heading" aria-level={2} className="cw-question-stem" style={{ fontSize: 14, lineHeight: 1.55, color: t.text, marginBottom: 16 }}>{q.q}</div>
      {q.opts.map((opt, idx) => (
        <button key={idx} aria-pressed={pick === idx} onClick={() => setPick(idx)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', marginBottom: 8, background: pick === idx ? `${topic.color}20` : t.panel, border: `1px solid ${pick === idx ? topic.color : t.border}`, color: t.text, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', borderRadius: 6 }}>
          <span style={{ color: topic.color, fontWeight: 700, marginRight: 10, fontFamily: 'monospace' }}>[{String.fromCharCode(65 + idx)}]</span>{opt}
        </button>
      ))}
      {showHint && q.hint && (
        <div style={{ margin: '12px 0', padding: 12, background: `${topic.color}0d`, border: `1px dashed ${topic.color}60`, borderRadius: 6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', color: topic.color, fontWeight: 700, marginBottom: 4 }}>✨ TUTOR HINT</div>
          <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>{q.hint}</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <button onClick={goPrev} disabled={i === 0} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${i === 0 ? t.border : topic.color}`, color: i === 0 ? t.textDim : topic.color, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', fontWeight: 700, cursor: i === 0 ? 'default' : 'pointer' }}>← PREV</button>
        {q.hint && <button onClick={() => setShowHint(!showHint)} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: 'pointer' }}>{showHint ? 'HIDE' : 'HINT'}</button>}
        <button onClick={goNext} disabled={pick === null} style={{ flex: 2, padding: '10px', background: pick === null ? t.border : topic.color, border: 'none', color: pick === null ? t.textDim : '#000', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: pick === null ? 'default' : 'pointer' }}>{i + 1 >= bank.length ? 'FINISH' : 'NEXT →'}</button>
      </div>
    </div>
  );
}
