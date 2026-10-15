import { WizEmblem } from './ChemWizBrand.jsx';
import React from 'react';

function contextCopy(context) {
  if (!context) return 'Open a topic or feature first';
  if (context.featureTitle) return `${context.featureLabel}: ${context.featureTitle}`;
  return context.featureLabel || 'Current chemistry context';
}

export function WizFab({ t, context, onOpen }) {
  if (!context) return null;

  const scope = contextCopy(context);
  const label = `Open Wiz for ${scope}`;

  return (
    <button
      className="cw-wiz-fab"
      type="button"
      onClick={onOpen}
      aria-label={label}
      title={label}
      data-testid="wiz-fab"
      style={{
        '--cw-wiz-color': context.topicColor || t.accent,
        '--cw-wiz-ink': t.bg,
      }}
    >
      <WizEmblem size={44} />
      <span className="cw-wiz-fab-copy">
        <strong>WIZ</strong>
        <small>{context.topicTitle || 'Chemistry'}</small>
      </span>
      <span className="cw-wiz-fab-spark" aria-hidden="true">✦</span>
    </button>
  );
}
