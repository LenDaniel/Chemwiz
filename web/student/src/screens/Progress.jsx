import React from 'react';
import { TOPIC_META } from '../config/topics.js';
import { Ring } from '../components/Primitives.jsx';

export function Progress({ t, progress, streak, mistakes }) {
  const built = TOPIC_META.filter(tp => tp.built);
  const totalChapters = built.reduce((acc, tp) => acc + (progress[tp.id]?.chaptersRead.length || 0), 0);
  const totalQuizzes = built.reduce((acc, tp) => acc + (progress[tp.id]?.quizzesTaken || 0), 0);
  const avgPct = built.length ? Math.round(built.reduce((a, tp) => a + (progress[tp.id]?.percent || 0), 0) / built.length) : 0;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>YOUR STATS</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 16 }}>Progress</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: t.panel, borderRadius: 12, marginBottom: 16 }}>
        <Ring pct={avgPct} color={t.accent} t={t} size={80} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: '0.1em' }}>AVERAGE MASTERY</div>
          <div style={{ fontSize: 26, color: t.text, fontWeight: 700 }}>{avgPct}%</div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Across {built.length} built topic{built.length === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[['🔥', streak.current, 'STREAK'], ['📖', totalChapters, 'CHAPTERS'], ['✓', totalQuizzes, 'QUIZZES']].map(([ic, v, l], i) => (
          <div key={i} style={{ padding: 12, background: t.panel, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{ic}</div>
            <div style={{ fontSize: 22, color: t.text, fontWeight: 700, marginTop: 3 }}>{v}</div>
            <div style={{ fontSize: 9, color: t.textDim, letterSpacing: '0.2em', marginTop: 2, fontFamily: 'monospace' }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, marginBottom: 10, fontFamily: 'monospace' }}>BY TOPIC</div>
      {TOPIC_META.filter(tp => tp.built).map(tp => {
        const tpProg = progress[tp.id] || { percent: 0, chaptersRead: [] };
        return (
          <div key={tp.id} style={{ padding: 12, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Ring pct={tpProg.percent} color={tp.color} t={t} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{tp.title}</div>
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>{tpProg.chaptersRead.length} chapters read · last score {tpProg.lastScore ?? '—'}%</div>
            </div>
          </div>
        );
      })}

      {mistakes.length > 0 && (
        <>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, margin: '20px 0 10px', fontFamily: 'monospace' }}>MISTAKES NOTEBOOK · {mistakes.length}</div>
          {mistakes.slice(-5).reverse().map((m, i) => (
            <div key={i} style={{ padding: 10, background: t.panel, borderRadius: 4, marginBottom: 6, fontSize: 11, color: t.textMuted }}>{m.q.slice(0, 80)}{m.q.length > 80 ? '…' : ''}</div>
          ))}
        </>
      )}
    </div>
  );
}
