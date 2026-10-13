import { useReadAloud } from '../hooks/useReadAloud.js';
import { ReadAloudControls } from '../components/ReadAloudControls.jsx';
import { chapterSpeechText, chapterSections, sectionSpeechText, selectedSectionsText } from '../utils/speech.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Block } from '../components/Primitives.jsx';

export function Chapters({ topic, content, progress, t, onOpenChapter }) {
  const tpProg = progress[topic.id] || { chaptersRead: [] };
  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>{topic.code} · CHAPTERS</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 16 }}>{topic.title}</div>
      <div className="cw-chapter-grid">
      {content.chapters.map((ch, i) => {
        const read = tpProg.chaptersRead.includes(ch.id);
        return (
          <button className="cw-chapter-tile" key={ch.id} onClick={() => onOpenChapter(ch)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 14, marginBottom: 8, background: t.panel, border: `1px solid ${read ? topic.color + '60' : t.border}`, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, textAlign: 'left' }}>
            <div style={{ width: 32, height: 32, background: read ? topic.color : `${topic.color}20`, color: read ? '#000' : topic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'monospace', marginRight: 12, borderRadius: 6 }}>{read ? '✓' : i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{ch.title}</div>
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 2, fontFamily: 'monospace' }}>{ch.minutes} min read</div>
            </div>
            <div style={{ color: topic.color, fontSize: 18 }}>›</div>
          </button>
        );
      })}
      </div>
    </div>
  );
}

export function Reader({ topic, content, chapter, t, settings, onMarkRead, onBack, onNext, onPrev, targetBlockIndex = null }) {
  const speech = useReadAloud();
  const sections = useMemo(() => chapterSections(chapter), [chapter]);
  const [selectedSections, setSelectedSections] = useState([]);
  useEffect(() => { speech.stop(); setSelectedSections([]); }, [chapter.id]);
  const toggleSection = (id) => setSelectedSections((previous) => previous.includes(id)
    ? previous.filter((value) => value !== id) : [...previous, id]);
  useEffect(() => { onMarkRead(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [chapter.id]);

  useEffect(() => {
    if (!Number.isInteger(targetBlockIndex)) return undefined;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`cw-block-${topic.id}-${chapter.id}-${targetBlockIndex}`);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('cw-search-hit');
      window.setTimeout(() => target.classList.remove('cw-search-hit'), 1800);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [chapter.id, targetBlockIndex, topic.id]);
  const fs = settings.fontSize === 'small' ? 0.9 : settings.fontSize === 'large' ? 1.1 : 1;
  const idx = content.chapters.findIndex(c => c.id === chapter.id);
  const prev = idx > 0 ? content.chapters[idx - 1] : null;
  const next = content.chapters[idx + 1];

  return (
    <div className="cw-page cw-reader-page" style={{ padding: 16, fontSize: `${fs}em` }}>
      <div style={{ fontSize: 9, letterSpacing: '0.3em', color: topic.color, fontFamily: 'monospace', fontWeight: 700 }}>{topic.code} · CH.{chapter.id.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 8 }}>{chapter.title}</div>
      <div style={{ fontSize: 10, color: t.textDim, marginBottom: 16, letterSpacing: '0.1em', fontFamily: 'monospace' }}>{chapter.minutes} MIN · ✓ AUTO-TRACKED · CH {idx + 1} OF {content.chapters.length}</div>
      <div className="cw-reading-panel" style={{ padding: 12, border: `1px solid ${t.border}`, borderRadius: 8, marginBottom: 16 }}>
        <button type="button" disabled={!speech.supported} onClick={() => speech.speak(chapterSpeechText(chapter))} style={{ background: t.panel, color: t.text, border: `1px solid ${t.border}`, padding: 8, borderRadius: 5 }}>Listen to chapter text</button>
        <details className="cw-section-picker">
          <summary>Choose sections to read</summary>
          <fieldset>
            <legend>Chapter sections</legend>
            <div className="cw-reading-actions">
              <button type="button" onClick={() => setSelectedSections(sections.map((section) => section.id))}>Select all</button>
              <button type="button" onClick={() => setSelectedSections([])}>Clear selection</button>
            </div>
            {sections.map((section) => <label key={section.id} className="cw-section-choice">
              <input type="checkbox" checked={selectedSections.includes(section.id)} onChange={() => toggleSection(section.id)} />
              <span>{section.title}</span>
            </label>)}
            <button type="button" disabled={!speech.supported || !selectedSections.length}
              onClick={() => speech.speak(selectedSectionsText(sections, selectedSections))}>
              Read selected sections ({selectedSections.length})
            </button>
          </fieldset>
        </details>
        <ReadAloudControls speech={speech} t={t} />
      </div>
      <div className="cw-reader-body">
        {sections.map((section) => <section key={section.id} className="cw-reading-section" aria-label={section.title}>
          <div className="cw-section-heading">
            {section.blocks[0]?.type === 'h'
              ? <div id={`cw-block-${topic.id}-${chapter.id}-${section.start}`} className="cw-reader-block-anchor"><Block block={section.blocks[0]} color={topic.color} t={t} /></div>
              : <span>{section.title}</span>}
            <button type="button" disabled={!speech.supported} aria-label={`Listen to section: ${section.title}`}
              onClick={() => speech.speak(sectionSpeechText(section))}>Listen to this section</button>
          </div>
          {section.blocks.map((block, offset) => offset === 0 && block.type === 'h' ? null : (
            <div key={section.start + offset} id={`cw-block-${topic.id}-${chapter.id}-${section.start + offset}`} className="cw-reader-block-anchor">
              <Block block={block} color={topic.color} t={t} />
            </div>
          ))}
        </section>)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${t.border}`, color: t.text, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', cursor: 'pointer' }}>≡ LIST</button>
        {prev && <button onClick={() => onPrev(prev)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${topic.color}`, color: topic.color, fontSize: 10, letterSpacing: '0.2em', fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer' }}>← PREV</button>}
        {next && <button onClick={() => onNext(next)} style={{ flex: 1, padding: '12px', background: topic.color, border: 'none', color: '#000', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>NEXT →</button>}
      </div>
    </div>
  );
}
