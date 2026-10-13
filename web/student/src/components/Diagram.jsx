// Diagram renderer — Phase K1
// Takes a JSON spec, returns an SVG. Replaces hand-coded JSX SVG diagrams.
// See SPEC.md (sibling file) for the full spec format.
import React from 'react';

/* ----- color resolution ----- */
const PALETTE = {
  pink:   '#f72585',
  green:  '#06a06e',
  amber:  '#ffbe0b',
  cyan:   '#4cc9f0',
  red:    '#e63946',
  grey:   '#888888',
};

function resolveColor(c, color, t) {
  if (!c) return color;
  if (c === 'primary') return color;
  if (c === 'accent')  return t.accent;
  if (c === 'text')    return t.text;
  if (c === 'dim')     return t.textDim;
  if (c === 'border')  return t.border;
  if (c === 'panel')   return t.panel;
  if (PALETTE[c])      return PALETTE[c];
  return c; // literal hex
}

/* ----- text helper (re-implemented inline so the renderer is self-contained) ----- */
const TX = ({ x, y, c, s = 11, anchor = 'middle', fw = 400, children }) => (
  <text x={x} y={y} fill={c} fontSize={s} fontFamily="monospace"
        textAnchor={anchor} fontWeight={fw}>{children}</text>
);

/* ============================================================
   Block renderers — each returns { node, height }
   Width is taken from ctx.W (default 320). y starts at ctx.y.
   ============================================================ */

const PANEL_PAD_X = 15;

function renderPanel(b, ctx) {
  const c = resolveColor(b.color, ctx.color, ctx.t);
  const lines = b.body || [];
  const titleH = b.title ? 16 : 0;
  const lineH = 12;
  const hintH = b.hint ? 12 : 0;
  const padTop = b.title ? 12 : 8;
  const padBot = 8;
  const h = b.height || (padTop + titleH + lines.length * lineH + hintH + padBot);
  const W = ctx.W;
  return {
    height: h + 4,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <rect x={PANEL_PAD_X} y={0} width={W - 2*PANEL_PAD_X} height={h} rx={5}
              fill={`${c}10`} stroke={c} strokeWidth={0.7} />
        {b.title && <TX x={W/2} y={padTop + 4} c={c} fw={700} s={9}>{b.title}</TX>}
        {lines.map((line, i) => (
          <TX key={i} x={W/2} y={padTop + titleH + i * lineH + 8}
              c={ctx.t.text} s={8}>{line}</TX>
        ))}
        {b.hint && <TX x={W/2} y={h - 6} c={ctx.t.textDim} s={7}>{b.hint}</TX>}
      </g>
    ),
  };
}

function renderCards(b, ctx) {
  const W = ctx.W;
  const cards = b.cards || [];
  const n = cards.length;
  const gap = 6;
  const totalW = W - 2*PANEL_PAD_X;
  const cardW = (totalW - (n - 1) * gap) / n;
  // Determine row height by tallest card
  const lineH = 12;
  const cardHs = cards.map(card => {
    const lines = card.body || [];
    const titleH = card.title ? 14 : 0;
    return 8 + titleH + lines.length * lineH + 6;
  });
  const h = Math.max(...cardHs);
  return {
    height: h + 6,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        {cards.map((card, i) => {
          const c = resolveColor(card.color, ctx.color, ctx.t);
          const x = PANEL_PAD_X + i * (cardW + gap);
          const lines = card.body || [];
          return (
            <g key={i}>
              <rect x={x} y={0} width={cardW} height={h} rx={5}
                    fill={`${c}10`} stroke={c} strokeWidth={0.7} />
              {card.title && (
                <TX x={x + cardW/2} y={14} c={c} fw={700} s={9}>{card.title}</TX>
              )}
              {lines.map((line, j) => (
                <TX key={j} x={x + cardW/2} y={(card.title ? 28 : 16) + j * lineH}
                    c={ctx.t.text} s={8}>{line}</TX>
              ))}
            </g>
          );
        })}
      </g>
    ),
  };
}

function renderSteps(b, ctx) {
  const W = ctx.W;
  const items = b.items || [];
  const stepH = b.stepH || 30;
  const total = items.length * (stepH + 4);
  return {
    height: total + 4,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        {items.map((item, i) => {
          const c = resolveColor(item.color, ctx.color, ctx.t);
          const y = i * (stepH + 4);
          const numStr = item.number || `${i+1}`;
          return (
            <g key={i}>
              <rect x={PANEL_PAD_X} y={y} width={W - 2*PANEL_PAD_X} height={stepH}
                    rx={5} fill={`${c}10`} stroke={c} strokeWidth={0.7} />
              <TX x={45} y={y + stepH/2 + 4} c={c} fw={700} s={10}>{numStr}.</TX>
              <TX x={W/2 + 20} y={y + stepH/2 + 4} c={ctx.t.text} s={9}>
                {item.body}
              </TX>
            </g>
          );
        })}
      </g>
    ),
  };
}

function renderTable(b, ctx) {
  const W = ctx.W;
  const headers = b.headers || [];
  const rows = b.rows || [];
  const rowH = b.rowH || 20;
  const headerH = 24;
  const total = headerH + rows.length * rowH + 4;
  // even column distribution unless colWidths given
  const usable = W - 2*PANEL_PAD_X;
  const widths = b.colWidths || headers.map(() => usable / headers.length);
  const cumX = widths.reduce((acc, w, i) => {
    acc.push((acc[i] || PANEL_PAD_X) + (i === 0 ? 0 : widths[i-1]));
    return acc;
  }, []);
  cumX[0] = PANEL_PAD_X;
  for (let i = 1; i < widths.length; i++) cumX[i] = cumX[i-1] + widths[i-1];
  const colCenter = i => cumX[i] + widths[i] / 2;
  return {
    height: total + 4,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <line x1={PANEL_PAD_X} y1={2} x2={W - PANEL_PAD_X} y2={2}
              stroke={ctx.t.text} strokeWidth={0.4} />
        {headers.map((h, i) => (
          <TX key={i} x={colCenter(i)} y={14} c={ctx.t.accent} fw={700} s={7}>{h}</TX>
        ))}
        <line x1={PANEL_PAD_X} y1={20} x2={W - PANEL_PAD_X} y2={20}
              stroke={ctx.t.text} strokeWidth={0.4} />
        {rows.map((row, ri) => {
          const y = headerH + ri * rowH + 12;
          const rowColor = b.rowColors && b.rowColors[ri]
            ? resolveColor(b.rowColors[ri], ctx.color, ctx.t)
            : ctx.t.text;
          return (
            <g key={ri}>
              {row.map((cell, ci) => (
                <TX key={ci} x={colCenter(ci)} y={y} c={ci === 0 ? rowColor : ctx.t.text}
                    fw={ci === 0 ? 700 : 400} s={7}>{cell}</TX>
              ))}
              <line x1={PANEL_PAD_X} y1={y + 6} x2={W - PANEL_PAD_X} y2={y + 6}
                    stroke={ctx.t.border} strokeWidth={0.2} />
            </g>
          );
        })}
      </g>
    ),
  };
}

function renderCompare(b, ctx) {
  // Same as cards with exactly 2 entries — just a convenience name
  return renderCards({ type: 'cards', cards: [b.left, b.right] }, ctx);
}

function renderEquation(b, ctx) {
  const size = b.big ? 12 : 10;
  return {
    height: 28,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <TX x={ctx.W/2} y={18} c={ctx.t.text} fw={700} s={size}>{b.text}</TX>
      </g>
    ),
  };
}

function renderNote(b, ctx) {
  const c = b.emphasis ? resolveColor('primary', ctx.color, ctx.t) : ctx.t.textDim;
  const s = b.emphasis ? 9 : 7;
  const fw = b.emphasis ? 700 : 400;
  return {
    height: 16,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <TX x={ctx.W/2} y={10} c={c} fw={fw} s={s}>{b.text}</TX>
      </g>
    ),
  };
}

function renderArrow(b, ctx) {
  const text = b.text || '↓';
  return {
    height: 18,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <TX x={ctx.W/2} y={14} c={ctx.t.textDim} s={9}>{text}</TX>
      </g>
    ),
  };
}

function renderScaleBar(b, ctx) {
  const W = ctx.W;
  const ticks = b.ticks || [];
  const x0 = 30, x1 = W - 30;
  const y = 30;
  // Optional highlight band
  const hi = b.highlight;
  return {
    height: 100,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke={ctx.t.text} strokeWidth={1} />
        {ticks.map((tick, i) => {
          const tx = x0 + tick.x * (x1 - x0);
          return (
            <g key={i}>
              <line x1={tx} y1={y - 3} x2={tx} y2={y + 5} stroke={ctx.t.text} strokeWidth={0.6} />
              <TX x={tx} y={y + 16} c={ctx.t.text} fw={700} s={7}>{tick.label}</TX>
              {tick.sublabel && <TX x={tx} y={y + 26} c={ctx.t.textDim} s={6}>{tick.sublabel}</TX>}
            </g>
          );
        })}
        {hi && (() => {
          const c = resolveColor(hi.color || 'primary', ctx.color, ctx.t);
          const a = x0 + hi.from * (x1 - x0);
          const b2 = x0 + hi.to * (x1 - x0);
          return (
            <g>
              <line x1={a} y1={y + 50} x2={b2} y2={y + 50} stroke={c} strokeWidth={2} />
              <line x1={a} y1={y + 46} x2={a} y2={y + 54} stroke={c} strokeWidth={2} />
              <line x1={b2} y1={y + 46} x2={b2} y2={y + 54} stroke={c} strokeWidth={2} />
              <TX x={(a + b2)/2} y={y + 68} c={c} fw={700} s={9}>{hi.label}</TX>
            </g>
          );
        })()}
      </g>
    ),
  };
}

function renderBars(b, ctx) {
  const W = ctx.W;
  const items = b.items || [];
  const yMax = b.yMax || Math.max(...items.map(it => it.value));
  const x0 = PANEL_PAD_X + 5;
  const usable = W - 2 * PANEL_PAD_X - 10;
  const n = items.length;
  const gap = 4;
  const barW = (usable - (n - 1) * gap) / n;
  const chartH = 130;
  const baseY = chartH;
  return {
    height: chartH + 30,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        <line x1={x0} y1={baseY} x2={x0 + usable} y2={baseY} stroke={ctx.t.text} strokeWidth={0.5} />
        {items.map((item, i) => {
          const c = resolveColor(item.color, ctx.color, ctx.t);
          const h = (item.value / yMax) * (chartH - 30);
          const x = x0 + i * (barW + gap);
          return (
            <g key={i}>
              <rect x={x} y={baseY - h} width={barW} height={h} rx={3}
                    fill={c} opacity={0.6} stroke={c} strokeWidth={0.5} />
              <TX x={x + barW/2} y={baseY - h - 4} c={c} fw={700} s={7}>
                {item.valueLabel || item.value}
              </TX>
              <TX x={x + barW/2} y={baseY + 14} c={ctx.t.text} fw={700} s={7}>{item.label}</TX>
              {item.sublabel && <TX x={x + barW/2} y={baseY + 24} c={ctx.t.textDim} s={6}>{item.sublabel}</TX>}
            </g>
          );
        })}
      </g>
    ),
  };
}

function renderPyramid(b, ctx) {
  const W = ctx.W;
  const tiers = b.tiers || [];
  const tierH = 30;
  return {
    height: tiers.length * (tierH + 4) + 4,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        {tiers.map((tier, i) => {
          const c = resolveColor(tier.color, ctx.color, ctx.t);
          const w = tier.width * (W - 2 * PANEL_PAD_X);
          const x = (W - w) / 2;
          const y = i * (tierH + 4);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={tierH} rx={4}
                    fill={`${c}30`} stroke={c} strokeWidth={1} />
              <TX x={W/2} y={y + 14} c={c} fw={700} s={10}>{tier.label}</TX>
              {tier.note && <TX x={W/2} y={y + 26} c={ctx.t.textDim} s={7}>{tier.note}</TX>}
            </g>
          );
        })}
      </g>
    ),
  };
}

function renderRaw(b, ctx) {
  // Escape hatch — pass through low-level primitives
  const h = b.height || 100;
  return {
    height: h + 4,
    node: (
      <g transform={`translate(0,${ctx.y})`}>
        {(b.primitives || []).map((p, i) => renderPrimitive(p, i, ctx))}
      </g>
    ),
  };
}

function renderPrimitive(p, key, ctx) {
  const c = resolveColor(p.color, ctx.color, ctx.t);
  switch (p.p) {
    case 'text':
      return <TX key={key} x={p.x} y={p.y} c={c}
                 s={p.size || 9} anchor={p.anchor || 'middle'}
                 fw={p.bold ? 700 : 400}>{p.text}</TX>;
    case 'line':
      return <line key={key} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                   stroke={c} strokeWidth={p.width || 0.7}
                   strokeDasharray={p.dash ? '3 2' : undefined} />;
    case 'rect':
      return <rect key={key} x={p.x} y={p.y} width={p.w} height={p.h}
                   rx={p.rx || 0}
                   fill={p.fill ? resolveColor(p.fill, ctx.color, ctx.t) : 'none'}
                   fillOpacity={p.fillAlpha != null ? p.fillAlpha : 1}
                   stroke={c} strokeWidth={p.stroke || 0.7} />;
    case 'circle':
      return <circle key={key} cx={p.cx} cy={p.cy} r={p.r}
                     fill={p.fill ? resolveColor(p.fill, ctx.color, ctx.t) : 'none'}
                     fillOpacity={p.fillAlpha != null ? p.fillAlpha : 1}
                     stroke={c} strokeWidth={p.stroke || 0.7} />;
    case 'path':
      return <path key={key} d={p.d}
                   fill={p.fill ? resolveColor(p.fill, ctx.color, ctx.t) : 'none'}
                   stroke={c} strokeWidth={p.width || 1}
                   strokeDasharray={p.dash ? '3 2' : undefined} />;
    default:
      return null;
  }
}

const BLOCK_RENDERERS = {
  panel:    renderPanel,
  cards:    renderCards,
  steps:    renderSteps,
  table:    renderTable,
  compare:  renderCompare,
  equation: renderEquation,
  note:     renderNote,
  arrow:    renderArrow,
  scaleBar: renderScaleBar,
  bars:     renderBars,
  pyramid:  renderPyramid,
  raw:      renderRaw,
};

/* ============================================================
   Top-level Diagram component
   ============================================================ */

export function Diagram({ spec, color, t }) {
  if (!spec || !spec.blocks) return null;
  const W = spec.width || 320;
  const ctx = { W, color, t, y: 0 };

  let y = 0;
  const nodes = [];

  // Title bar
  if (spec.title) {
    nodes.push(
      <TX key="title" x={W/2} y={y + 14} c={color} fw={700} s={11}>{spec.title}</TX>
    );
    y += 18;
  }
  if (spec.subtitle) {
    nodes.push(
      <TX key="subtitle" x={W/2} y={y + 8} c={t.textDim} s={8}>{spec.subtitle}</TX>
    );
    y += 12;
  }
  if (spec.title || spec.subtitle) y += 4; // breathing room

  // Each block
  for (let i = 0; i < spec.blocks.length; i++) {
    const block = spec.blocks[i];
    const renderer = BLOCK_RENDERERS[block.type];
    if (!renderer) {
      console.warn(`[Diagram] unknown block type: ${block.type}`);
      continue;
    }
    const result = renderer(block, { ...ctx, y });
    nodes.push(<g key={`b${i}`}>{result.node}</g>);
    y += result.height;
  }

  const totalH = y + 4;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" height={totalH}>
      {nodes}
    </svg>
  );
}

export default Diagram;
