import React, { useState, useMemo } from 'react';
import { TOPIC_META, STRANDS } from '../config/topics.js';
import { Pill } from '../components/Primitives.jsx';

export function Home({ t, progress, streak, mistakesCount, onTopicTap, settings, onOpenPublished }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return TOPIC_META.map(tp => {
      const haystack = [tp.title, tp.code, tp.tagline, ...(tp.keywords || [])].join(' ').toLowerCase();
      // token match: every whitespace-separated word in the query must appear somewhere
      const tokens = q.split(/\s+/);
      const hit = tokens.every(tok => haystack.includes(tok));
      // score: exact title match > keyword match > tagline match
      let score = 0;
      if (hit) {
        if (tp.title.toLowerCase().includes(q)) score += 100;
        if ((tp.keywords || []).some(k => k.toLowerCase().includes(q))) score += 50;
        if (tp.tagline.toLowerCase().includes(q)) score += 20;
        if (tp.code.toLowerCase().includes(q)) score += 30;
        score += 1; // baseline for matching at all
      }
      return { tp, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  }, [query]);

  const grouped = STRANDS.map(s => ({ ...s, topics: TOPIC_META.filter(tp => tp.strand === s.id) }));

  const TopicTile = ({ tp }) => {
    const tpProg = progress[tp.id]?.percent || 0;
    return (
      <button className="cw-topic-tile" key={tp.id} onClick={() => onTopicTap(tp)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 12, marginBottom: 8, background: t.panel, border: `1px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, textAlign: 'left' }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: `${tp.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: tp.color, marginRight: 12 }}>{tp.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>{tp.code}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tp.title}</div>
        </div>
        {tp.built ? <Pill color={tp.color} t={t}>● {tpProg ? `${tpProg}%` : 'READY'}</Pill> : <span style={{ fontSize: 16, color: t.textDim }}>🔒</span>}
      </button>
    );
  };

  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontWeight: 700, fontFamily: 'monospace' }}>CHEMWIZ · A-LEVEL</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: t.text, marginTop: 4 }}>Pick a topic</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{settings.syllabus} · 24 topics · full syllabus coverage</div>
      </div>

      <button type="button" onClick={onOpenPublished} style={{padding:'12px 16px',marginBottom:16,borderRadius:8,border:`1px solid ${t.border}`,background:t.panelHi,color:t.text,font:'inherit',cursor:'pointer'}}>Published lessons</button>
      {/* Quick topic filter. Full-text search is available globally from the app header (Ctrl/Cmd+K). */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter topic cards…"
          style={{
            width: '100%', padding: '10px 34px 10px 34px', background: t.panel,
            border: `1px solid ${t.border}`, color: t.text, fontSize: 13,
            fontFamily: 'inherit', outline: 'none', borderRadius: 8, boxSizing: 'border-box',
          }}
        />
        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: t.textDim, pointerEvents: 'none' }}>⌕</div>
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: t.textMuted, fontSize: 14, cursor: 'pointer', padding: 4 }}>✕</button>
        )}
      </div>

      {/* Search results */}
      {results !== null && (
        <div style={{ marginBottom: 18 }}>
          {results.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: t.textDim, fontSize: 12 }}>
              No matches for “{query}”. Try “alkene”, “complex ion”, “Haber”, “electrolysis”…
            </div>
          ) : (
            <>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.accent, fontWeight: 700, marginBottom: 10, fontFamily: 'monospace' }}>SEARCH · {results.length} MATCH{results.length === 1 ? '' : 'ES'}</div>
              <div className="cw-topic-grid">{results.map(({ tp }) => <TopicTile key={tp.id} tp={tp} />)}</div>
            </>
          )}
        </div>
      )}

      {/* Stats strip (hide during search) */}
      {results === null && (
        <>
          <div className="cw-stats-strip" style={{ display: 'flex', gap: 10, marginBottom: 20, padding: 12, background: t.panel, borderRadius: 8 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>STREAK</div><div style={{ fontSize: 22, color: t.text, fontWeight: 700 }}>🔥 {streak.current}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>MISTAKES</div><div style={{ fontSize: 22, color: t.text, fontWeight: 700 }}>{mistakesCount}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, fontFamily: 'monospace' }}>BEST</div><div style={{ fontSize: 22, color: t.text, fontWeight: 700 }}>{streak.longest}</div></div>
          </div>
          {grouped.map(s => (
            <div key={s.id} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: s.color, fontWeight: 700, marginBottom: 10, fontFamily: 'monospace' }}>{s.label} · {s.topics.length}</div>
              <div className="cw-topic-grid">{s.topics.map(tp => <TopicTile key={tp.id} tp={tp} />)}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
