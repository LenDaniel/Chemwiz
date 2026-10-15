import { WizEmblem } from '../components/ChemWizBrand.jsx';
import React from 'react';
import { Ring, Pill } from '../components/Primitives.jsx';

export function TopicView({ topic, content, progress, t, onAction }) {
  if (!topic.built) {
    return (
      <div className="cw-page" style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>{topic.code}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.text, marginTop: 4 }}>{topic.title}</div>
        <div style={{ fontSize: 12, color: topic.color, marginTop: 4, letterSpacing: '0.15em' }}>{topic.tagline}</div>
        <div style={{ textAlign: 'center', padding: 40, marginTop: 20, background: t.panel, borderRadius: 8 }}>
          <div style={{ fontSize: 40 }}>🔒</div>
          <div style={{ fontSize: 14, color: t.text, marginTop: 12, fontWeight: 600 }}>Coming soon</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>This topic will be available in a future release.</div>
        </div>
      </div>
    );
  }

  // Built but content not ported yet
  if (!content) {
    return (
      <div className="cw-page" style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>{topic.code}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.text, marginTop: 4 }}>{topic.title}</div>
        <div style={{ fontSize: 12, color: topic.color, marginTop: 4, letterSpacing: '0.15em' }}>{topic.tagline}</div>
        <div style={{ padding: 16, marginTop: 16, background: `${topic.color}10`, border: `1px solid ${topic.color}40`, borderRadius: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: topic.color, fontWeight: 700, marginBottom: 8 }}>✓ BUILT · MIGRATION PENDING</div>
          <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>
            This flagship was fully built in an earlier prototype phase. Its content module hasn&apos;t been ported into the refactored architecture yet — that happens in the next phase.
          </div>
        </div>
      </div>
    );
  }

  // Fully built with content
  const tpProg = progress[topic.id] || { chaptersRead: [], quizzesTaken: 0, percent: 0 };
  const questionCount = (content.quizzes?.length || 0) + (content.multi?.length || 0) + (content.structured?.length || 0) + (content.worked?.length || 0);

  const rows = [
    { icon: '≡', label: 'CHAPTERS',            count: `${tpProg.chaptersRead.length}/${content.chapters.length}`, action: 'chapters' },
    { icon: '?', label: 'PAPER 1 · MCQ',       count: `${content.quizzes?.length || 0} questions`,                action: 'quiz' },
    { icon: '§', label: 'PAPER 2 · STRUCTURED',count: `${content.structured?.length || 0} long-form`,             action: 'structured' },
    { icon: '✎', label: 'WORKED EXAMPLES',     count: `${content.worked?.length || 0} problems`,                  action: 'worked' },
    { icon: <WizEmblem size={36} />, label: 'WIZ · AI TUTOR',      count: 'ask this topic',                                           action: 'tutor' },
  ];

  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>{topic.code}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: t.text, marginTop: 4 }}>{topic.title}</div>
      <div style={{ fontSize: 12, color: topic.color, marginTop: 4, letterSpacing: '0.15em' }}>{topic.tagline}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, marginTop: 16, background: `${topic.color}10`, border: `1px solid ${topic.color}40`, borderRadius: 12 }}>
        <Ring pct={tpProg.percent || 0} color={topic.color} t={t} size={70} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: topic.color, fontWeight: 700 }}>● LIVE FLAGSHIP</div>
          <div style={{ fontSize: 13, color: t.text, marginTop: 4 }}>{content.chapters.length} chapters · {questionCount} questions</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Last score: {tpProg.lastScore != null ? tpProg.lastScore + '%' : '—'}</div>
        </div>
      </div>

      <div className="cw-action-grid" style={{ marginTop: 16 }}>
        {rows.map((r, i) => (
          <button className="cw-action-tile" key={i} onClick={() => onAction(r.action)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 14, marginBottom: 8, background: t.panel, border: `1px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, background: `${topic.color}20`, color: topic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 12, borderRadius: 6 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>{r.label}</div>
              <div style={{ fontSize: 12, color: t.text, marginTop: 2 }}>{r.count}</div>
            </div>
            <div style={{ color: topic.color, fontSize: 18 }}>›</div>
          </button>
        ))}
      </div>

      {content.objectives && (
        <div style={{ padding: 14, marginTop: 12, background: t.panel, borderRadius: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontWeight: 700, fontFamily: 'monospace', marginBottom: 8 }}>LEARNING OBJECTIVES</div>
          {content.objectives.slice(0, 5).map((o, i) => <div key={i} style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5, marginBottom: 3 }}>· {o}</div>)}
          {content.objectives.length > 5 && <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>+ {content.objectives.length - 5} more</div>}
        </div>
      )}
    </div>
  );
}
