import React, { useId } from 'react';
export function ReadAloudControls({ speech, t }) {
  const id = useId();
  const button = { background: t.panel, color: t.text, border: `1px solid ${t.border}`, borderRadius: 5, padding: '6px 8px', cursor: 'pointer' };
  return <div style={{ marginTop: 8, fontSize: 12 }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <label htmlFor={id}>Reading speed</label>
      <select id={id} value={speech.rate} disabled={speech.active} onChange={(event) => speech.setRate(Number(event.target.value))} style={button}>
        <option value={0.75}>Slower</option><option value={0.95}>Normal</option><option value={1.15}>Faster</option><option value={1.35}>Fastest</option>
      </select>
      {speech.active && <>
        <button type="button" onClick={speech.togglePause} style={button}>{speech.paused ? 'Resume reading' : 'Pause reading'}</button>
        <button type="button" onClick={speech.stop} style={button}>Stop reading</button>
      </>}
    </div>
    <div role="status" aria-live="polite" style={{ marginTop: 6, color: t.textMuted }}>{speech.error || speech.voiceLabel}</div>
  </div>;
}
