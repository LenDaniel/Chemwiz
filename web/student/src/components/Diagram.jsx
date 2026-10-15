// Diagram renderer — Phase K1
// Takes a JSON spec, returns an SVG. Replaces hand-coded JSX SVG diagrams.
// See SPEC.md (sibling file) for the full spec format.
import React, { useEffect, useId, useRef, useState } from 'react';
import { wrapDiagramText, fitDiagramBounds, diagramText } from '../utils/diagramLayout.mjs';

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
  const c = resolveColor(b.color, ctx.color, ctx.t), W = ctx.W;
  const title = b.title ? wrapDiagramText(b.title, W - 44, 9) : [];
  const lines = (b.body || []).flatMap(line => wrapDiagramText(line, W - 44, 8));
  const hints = b.hint ? wrapDiagramText(b.hint, W - 44, 7) : [];
  const padTop = title.length ? 12 : 8;
  const h = Math.max(b.height || 0, padTop + title.length * 13 + lines.length * 12 + hints.length * 11 + 8);
  return { height: h + 4, node: <g transform={`translate(0,${ctx.y})`}>
    <rect x={PANEL_PAD_X} y={0} width={W - 2*PANEL_PAD_X} height={h} rx={5} fill={`${c}10`} stroke={c} strokeWidth={0.7} />
    {title.map((line,i) => <TX key={`t${i}`} x={W/2} y={padTop + 4 + i*13} c={c} fw={700} s={9}>{line}</TX>)}
    {lines.map((line,i) => <TX key={`b${i}`} x={W/2} y={padTop + title.length*13 + i*12 + 8} c={ctx.t.text} s={8}>{line}</TX>)}
    {hints.map((line,i) => <TX key={`h${i}`} x={W/2} y={h - 6 - (hints.length-1-i)*11} c={ctx.t.textDim} s={7}>{line}</TX>)}
  </g> };
}

function renderCards(b, ctx) {
  const W = ctx.W, gap = 6, cards = b.cards || [];
  if (!cards.length) return { height: 0, node: null };
  const cardW = (W - 2*PANEL_PAD_X - (cards.length-1)*gap) / cards.length;
  const layouts = cards.map(card => ({ card, title: card.title ? wrapDiagramText(card.title, cardW-12, 9) : [],
    lines: (card.body || []).flatMap(line => wrapDiagramText(line, cardW-12, 8)) }));
  const h = Math.max(...layouts.map(item => 8 + item.title.length*13 + item.lines.length*12 + 8));
  return { height: h + 6, node: <g transform={`translate(0,${ctx.y})`}>
    {layouts.map(({card,title,lines},i) => {
      const c=resolveColor(card.color,ctx.color,ctx.t), x=PANEL_PAD_X+i*(cardW+gap);
      return <g key={i}>
        <rect x={x} y={0} width={cardW} height={h} rx={5} fill={`${c}10`} stroke={c} strokeWidth={0.7}/>
        {title.map((line,j)=><TX key={`t${j}`} x={x+cardW/2} y={14+j*13} c={c} fw={700} s={9}>{line}</TX>)}
        {lines.map((line,j)=><TX key={`b${j}`} x={x+cardW/2} y={16+title.length*13+j*12} c={ctx.t.text} s={8}>{line}</TX>)}
      </g>;
    })}
  </g> };
}

function renderSteps(b,ctx) {
  let y=0;
  const nodes=(b.items || []).map((item,i)=>{
    const lines=wrapDiagramText(item.body,ctx.W-100,9), h=Math.max(b.stepH || 30,lines.length*13+14);
    const c=resolveColor(item.color,ctx.color,ctx.t), top=y; y+=h+4;
    return <g key={i} transform={`translate(0,${top})`}>
      <rect x={PANEL_PAD_X} y={0} width={ctx.W-2*PANEL_PAD_X} height={h} rx={5} fill={`${c}10`} stroke={c} strokeWidth={0.7}/>
      <TX x={45} y={h/2+4} c={c} fw={700} s={10}>{item.number || i+1}.</TX>
      {lines.map((line,j)=><TX key={j} x={ctx.W/2+20} y={h/2+4+(j-(lines.length-1)/2)*13} c={ctx.t.text} s={9}>{line}</TX>)}
    </g>;
  });
  return { height:y+4,node:<g transform={`translate(0,${ctx.y})`}>{nodes}</g> };
}

function renderTable(b,ctx) {
  const W=ctx.W, headers=b.headers || [], usable=W-2*PANEL_PAD_X;
  const widths=b.colWidths || headers.map(()=>usable/headers.length);
  const positions=widths.map((width,i)=>PANEL_PAD_X+widths.slice(0,i).reduce((sum,w)=>sum+w,0)+width/2);
  const head=headers.map((text,i)=>wrapDiagramText(text,widths[i]-10,7));
  const headerH=Math.max(24,...head.map(lines=>lines.length*11+12));
  let y=headerH;
  const rows=(b.rows || []).map((row,ri)=>{
    const cells=row.map((text,ci)=>wrapDiagramText(text,widths[ci]-10,7));
    const h=Math.max(b.rowH || 20,...cells.map(lines=>lines.length*11+10)), top=y; y+=h;
    const c=b.rowColors?.[ri] ? resolveColor(b.rowColors[ri],ctx.color,ctx.t) : ctx.t.text;
    return <g key={ri}>
      {cells.map((lines,ci)=>lines.map((text,j)=><TX key={`${ci}-${j}`} x={positions[ci]} y={top+12+j*11} c={ci===0?c:ctx.t.text} fw={ci===0?700:400} s={7}>{text}</TX>))}
      <line x1={PANEL_PAD_X} y1={top+h-2} x2={W-PANEL_PAD_X} y2={top+h-2} stroke={ctx.t.border} strokeWidth={0.2}/>
    </g>;
  });
  return { height:y+8,node:<g transform={`translate(0,${ctx.y})`}>
    <line x1={PANEL_PAD_X} y1={2} x2={W-PANEL_PAD_X} y2={2} stroke={ctx.t.text} strokeWidth={0.4}/>
    {head.map((lines,i)=>lines.map((text,j)=><TX key={`${i}-${j}`} x={positions[i]} y={14+j*11} c={ctx.t.accent} fw={700} s={7}>{text}</TX>))}
    <line x1={PANEL_PAD_X} y1={headerH-4} x2={W-PANEL_PAD_X} y2={headerH-4} stroke={ctx.t.text} strokeWidth={0.4}/>
    {rows}
  </g> };
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

function renderNote(b,ctx) {
  const c=b.emphasis ? ctx.color : ctx.t.textDim, size=b.emphasis ? 9 : 7;
  const lines=wrapDiagramText(b.text,ctx.W-30,size);
  return { height:lines.length*12+4,node:<g transform={`translate(0,${ctx.y})`}>
    {lines.map((text,i)=><TX key={i} x={ctx.W/2} y={10+i*12} c={c} fw={b.emphasis?700:400} s={size}>{text}</TX>)}
  </g> };
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

export function Diagram({ spec, color, t, scale = 1 }) {
  if (!spec || !spec.blocks) return null;
  const W = spec.width || 320;
  const ctx = { W, color, t, y: 0 };

  let y = 0;
  const nodes = [];

  // Titles wrap independently of chemistry structures/equations.
  for (const [text,size,fill,weight] of [[spec.title,11,color,700],[spec.subtitle,8,t.textDim,400]]) {
    if (!text) continue;
    for (const [i,line] of wrapDiagramText(text,W-20,size).entries()) {
      nodes.push(<TX key={`heading-${size}-${i}`} x={W/2} y={y+size+3} c={fill} fw={weight} s={size}>{line}</TX>);
      y+=size+6;
    }
  }
  if (spec.title || spec.subtitle) y+=4;

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
    <FittedDiagram spec={spec} width={W} height={totalH} scale={scale}>{nodes}</FittedDiagram>
  );
}

function FittedDiagram({spec,width,height,scale,children}) {
  const content=useRef(null), id=useId();
  const [measured,setMeasured]=useState(null);
  const bounds=measured?.spec===spec ? measured.bounds : {x:0,y:0,width,height};
  useEffect(()=>{
    let active=true;
    const measure=()=>{
      if (!active || !content.current) return;
      const next=fitDiagramBounds(content.current.getBBox(),width,height);
      setMeasured({spec,bounds:next});
    };
    measure();
    document.fonts?.ready.then(measure);
    return ()=>{active=false;};
  },[spec,width,height]);
  return <svg className="cw-diagram" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
    data-fitted={measured?.spec===spec ? 'true' : 'false'}
    viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`} width="100%" height={bounds.height}
    style={{minWidth:Math.max(320,bounds.width)*scale,maxWidth:Math.max(720,bounds.width)*scale}}>
    <title id={`${id}-title`}>{spec.title || 'Chemistry diagram'}</title>
    <desc id={`${id}-description`}>{diagramText(spec).join('. ')}</desc>
    <g ref={content} aria-hidden="true">{children}</g>
  </svg>;
}

export default Diagram;
