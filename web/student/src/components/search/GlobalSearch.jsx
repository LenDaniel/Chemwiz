import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDialog, clickedBackdrop } from '../../../../../shared/useDialog.js';


const KIND_LABEL = {
  topic: 'TOPIC',
  chapter: 'CHAPTER',
  section: 'SECTION',
  paragraph: 'PARAGRAPH',
  diagram: 'DIAGRAM',
  tool: 'TOOL',
};

export function GlobalSearch({ t, open, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  useDialog(dialogRef, open);
  const [engine, setEngine] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const results = useMemo(() => engine ? engine(query) : [], [engine, query]);
  useEffect(() => {
    if (!open || engine) return undefined;
    let active = true;
    setLoadError(false);
    import('../../search/searchEngine.js').then((module) => {
      if (active) setEngine(() => module.searchChemWiz);
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [open, engine, attempt]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Enter' && event.target === inputRef.current && results[0]) {
        event.preventDefault();
        onSelect(results[0]);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, onSelect, results]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  return (
    <div className="cw-search-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <dialog ref={dialogRef} className="cw-search-panel" aria-label="Search ChemWiz"
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onClick={(event) => { if (clickedBackdrop(event)) onClose(); }}>
        <div className="cw-search-input-wrap">
          <span className="cw-search-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            className="cw-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics, sections, paragraphs, reagents…"
            aria-label="Search all ChemWiz content"
          />
          <button className="cw-search-close" type="button" onClick={onClose} aria-label="Close search">ESC</button>
        </div>

        <div className="cw-search-help">Search the full lesson library and QA tools. Press Enter to open the best match.</div>

        <div className="cw-search-results">
          {!engine && <div className="cw-search-empty" role="status">
            {loadError ? <>Search could not load. <button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></> : 'Loading search…'}
          </div>}
          {!query.trim() && (
            <div className="cw-search-empty">
              Try <strong>Haber</strong>, <strong>electrophilic addition</strong>, <strong>Ksp</strong>, <strong>2,4-DNPH</strong>, or <strong>bromine water</strong>.
            </div>
          )}

          {engine && query.trim() && results.length === 0 && (
            <div className="cw-search-empty">No matching lesson section or tool entry was found.</div>
          )}

          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              className="cw-search-result"
              onClick={() => {
                onSelect(result);
                onClose();
              }}
            >
              <span className="cw-search-result-kind">{KIND_LABEL[result.kind] || result.kind.toUpperCase()}</span>
              <span className="cw-search-result-copy">
                <strong>{result.title}</strong>
                <small className="cw-search-result-path">{result.path}</small>
                {result.snippet && <small className="cw-search-result-snippet">{result.snippet}</small>}
              </span>
              <span className="cw-search-result-arrow" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
}
