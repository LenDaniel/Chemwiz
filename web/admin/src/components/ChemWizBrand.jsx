import React from 'react';
import logo from '../assets/brand/chemwiz-logo.png';
import emblem from '../assets/brand/wiz-emblem.png';
import './ChemWizBrand.css';

// Keep the approved artwork intact. A light plate preserves wordmark contrast
// across light and dark themes; the standalone emblem retains transparency.
export function ChemWizBrand({ className = '' }) {
  return <span className={`cw-official-brand ${className}`}>
    <img src={logo} alt="ChemWiz — Learn, Explore, Master" width="2172" height="724" />
  </span>;
}

export function WizEmblem({ size = 44, label = '' }) {
  return <img className="cw-wiz-emblem" src={emblem} alt={label}
    width={size} height={size} style={{ width: size, height: size }} />;
}
