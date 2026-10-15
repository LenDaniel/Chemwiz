import React, { useEffect, useId, useState } from 'react';
import { CATIONS, ANIONS, GASES, FUNCTIONAL_GROUPS } from './qaData.js';

export function QATable({ t, initialTab = 'cations', initialOpen = null }) {
  const id = useId();
  const [tab, setTab] = useState(initialTab);
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setTab(initialTab);
    setOpen(initialOpen);
  }, [initialTab, initialOpen]);

  const IonSection = ({ items }) => items.map((item, i) => {
    const key = `${tab}-${i}`;
    const isOpen = open === key;
    return (
      <div key={key} className="cw-qa-card" style={{ marginBottom: 6, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <button aria-expanded={isOpen} aria-controls={`${id}-${key}`} onClick={() => setOpen(isOpen ? null : key)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 12, background: 'transparent', border: 'none', color: t.text, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.accent, fontFamily: 'monospace' }}>{item.ion}</div>
            {item.name && <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>{item.name}</div>}
          </div>
          <div style={{ color: t.textMuted, fontSize: 14 }}>{isOpen ? '▾' : '▸'}</div>
        </button>
        {isOpen && (
          <div id={`${id}-${key}`} style={{ padding: '4px 12px 12px', borderTop: `1px solid ${t.border}` }}>
            {item.tests.map((test, j) => (
              <div key={j} style={{ padding: '8px 0', borderBottom: j < item.tests.length - 1 ? `1px dashed ${t.border}` : 'none' }}>
                <Label t={t}>REAGENT</Label>
                <Value t={t}>{test.reagent}</Value>
                <Label t={t}>OBSERVATION</Label>
                <Value t={t}>{test.obs}</Value>
                {test.eq && test.eq !== '—' && (
                  <>
                    <Label t={t}>EQUATION</Label>
                    <div style={{ fontSize: 12, color: t.accent, fontFamily: 'monospace', wordBreak: 'break-word' }}>{test.eq}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });

  const GasSection = () => GASES.map((item, i) => {
    const key = `gases-${i}`;
    const isOpen = open === key;
    return (
      <div key={key} className="cw-qa-card" style={{ marginBottom: 6, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <button aria-expanded={isOpen} aria-controls={`${id}-${key}`} onClick={() => setOpen(isOpen ? null : key)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 12, background: 'transparent', border: 'none', color: t.text, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.accent, fontFamily: 'monospace' }}>{item.gas}</div>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Gas identification</div>
          </div>
          <div style={{ color: t.textMuted, fontSize: 14 }}>{isOpen ? '▾' : '▸'}</div>
        </button>
        {isOpen && (
          <div id={`${id}-${key}`} style={{ padding: '12px', borderTop: `1px solid ${t.border}` }}>
            <Label t={t}>TEST</Label>
            <Value t={t}>{item.test}</Value>
            <Label t={t}>POSITIVE RESULT</Label>
            <Value t={t}>{item.result}</Value>
          </div>
        )}
      </div>
    );
  });

  const FunctionalSection = () => FUNCTIONAL_GROUPS.map((item, i) => {
    const key = `functional-${i}`;
    const isOpen = open === key;
    return (
      <div key={key} className="cw-qa-card" style={{ marginBottom: 6, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <button aria-expanded={isOpen} aria-controls={`${id}-${key}`} onClick={() => setOpen(isOpen ? null : key)} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: 12, background: 'transparent', border: 'none', color: t.text, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.accent, fontFamily: 'monospace' }}>{item.group}</div>
            <div style={{ fontSize: 11, color: t.text, marginTop: 3 }}>{item.name}</div>
          </div>
          <div style={{ color: t.textMuted, fontSize: 14 }}>{isOpen ? '▾' : '▸'}</div>
        </button>
        {isOpen && (
          <div id={`${id}-${key}`} style={{ padding: '4px 12px 12px', borderTop: `1px solid ${t.border}` }}>
            {item.tests.map((test, j) => (
              <div key={j} style={{ padding: '10px 0', borderBottom: j < item.tests.length - 1 ? `1px dashed ${t.border}` : 'none' }}>
                <Label t={t}>REAGENT / TEST</Label>
                <Value t={t}>{test.reagent}</Value>
                <Label t={t}>CONFIRMATION / POSITIVE</Label>
                <div className="cw-qa-positive" style={{ fontSize: 12, color: t.text, marginBottom: 8 }}>{test.confirm}</div>
                <Label t={t}>ABSENCE / NEGATIVE</Label>
                <div className="cw-qa-negative" style={{ fontSize: 12, color: t.textMuted, marginBottom: test.note ? 8 : 0 }}>{test.absent}</div>
                {test.note && (
                  <div style={{ marginTop: 8, padding: 10, background: `${t.accent}0d`, borderLeft: `2px solid ${t.accent}`, color: t.textMuted, fontSize: 11, lineHeight: 1.5 }}>
                    {test.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });

  const tabs = [
    ['cations', `CATIONS · ${CATIONS.length}`],
    ['anions', `ANIONS · ${ANIONS.length}`],
    ['gases', `GASES · ${GASES.length}`],
    ['functional', `ORGANIC · ${FUNCTIONAL_GROUPS.length}`],
  ];

  return (
    <div className="cw-page" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.3em', color: t.textDim, fontFamily: 'monospace' }}>TOOL · 03</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginTop: 4, marginBottom: 4 }}>QA Table</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Qualitative analysis — inorganic ions, gases and organic functional-group tests</div>

      <div className="cw-qa-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6, marginBottom: 12 }}>
        {tabs.map(([k, label]) => (
          <button key={k} aria-pressed={tab === k} onClick={() => { setTab(k); setOpen(null); }} style={{ padding: '8px 4px', fontSize: 9, letterSpacing: '0.08em', fontFamily: 'monospace', fontWeight: 700, background: tab === k ? t.accent : 'transparent', color: tab === k ? '#000' : t.text, border: `1px solid ${tab === k ? t.accent : t.border}`, cursor: 'pointer', borderRadius: 4 }}>{label}</button>
        ))}
      </div>

      <div className="cw-qa-list">
        {tab === 'cations' && <IonSection items={CATIONS} />}
        {tab === 'anions' && <IonSection items={ANIONS} />}
        {tab === 'gases' && <GasSection />}
        {tab === 'functional' && <FunctionalSection />}
      </div>

      {tab === 'functional' && (
        <div style={{ marginTop: 12, padding: 12, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textDim, fontSize: 10, lineHeight: 1.55 }}>
          Use these as A-Level qualitative-analysis revision cues. In practical work, follow the reagent concentrations, quantities and safety instructions supplied by your teacher or examination paper.
        </div>
      )}
    </div>
  );
}

function Label({ t, children }) {
  return <div style={{ fontSize: 9, letterSpacing: '0.15em', color: t.textDim, fontFamily: 'monospace', marginBottom: 3 }}>{children}</div>;
}

function Value({ t, children }) {
  return <div style={{ fontSize: 12, color: t.text, marginBottom: 8, lineHeight: 1.5 }}>{children}</div>;
}
