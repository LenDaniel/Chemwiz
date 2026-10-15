# Diagram Spec — Phase K

Replaces hand-coded JSX SVG diagrams with a JSON spec rendered by a single
shared component. Goals:

- Smaller bundle (one renderer instead of 220 closures)
- Easier editing (data, not code)
- Migrate-friendly: the chapter `'d'` block now accepts `spec` OR `component`
  so old and new diagrams coexist during migration

## Top level

```js
{
  title?: string,        // optional title bar at top
  subtitle?: string,
  width?: number,        // viewBox width (default 320)
  blocks: Block[],       // vertical-flow blocks
}
```

The viewBox height is auto-computed from the sum of block heights.

## Color refs

Anywhere a `color` is accepted, you can use:

- `'primary'` — the topic color (default if omitted)
- `'accent'` — `t.accent`
- `'text'`, `'dim'`, `'border'`, `'panel'` — theme refs
- `'pink'` `'green'` `'amber'` `'cyan'` `'red'` `'grey'` — palette
- any hex string `'#abcdef'`

## Block types

### `panel`
Single tinted card with title and body lines.
```js
{ type: 'panel', title?, body: string[], hint?, color? }
```

### `cards`
2 or 3 panels side by side.
```js
{ type: 'cards', cards: [{ title?, body: string[], color? }, ...] }
```

### `compare`
Convenience for 2 cards side by side.
```js
{ type: 'compare', left: { title, body, color? }, right: {...} }
```

### `steps`
Numbered vertical list.
```js
{ type: 'steps', items: [{ body, color?, number? }, ...] }
```

### `table`
Header row + data rows.
```js
{ type: 'table', headers: [...], rows: [[...], ...], rowColors?: [...] }
```

### `equation`
Centred chemical equation.
```js
{ type: 'equation', text, big? }
```

### `note`
Small dim line, or emphasised conclusion.
```js
{ type: 'note', text, emphasis? }
```

### `arrow`
Centred down-arrow with optional label.
```js
{ type: 'arrow', text? }   // defaults to '↓'
```

### `scaleBar`
Horizontal scale with labelled ticks.
```js
{ type: 'scaleBar',
  ticks: [{ x: 0..1, label, sublabel? }],
  highlight?: { from: 0..1, to: 0..1, label, color? }
}
```

### `bars`
Vertical bar chart.
```js
{ type: 'bars',
  yMax?: number,
  items: [{ label, value, color?, sublabel?, valueLabel? }],
}
```

### `pyramid`
Stacked bars of varying width (e.g. waste hierarchy).
```js
{ type: 'pyramid',
  tiers: [{ label, width: 0..1, color?, note? }, ...]
}
```

### `raw`
Escape hatch for diagrams that don't fit any of the above. Pass low-level
primitives at absolute coordinates within an explicit height.
```js
{ type: 'raw', height: number, primitives: [
  { p: 'text',   x, y, text, color?, size?, bold?, anchor? },
  { p: 'line',   x1, y1, x2, y2, color?, width?, dash? },
  { p: 'rect',   x, y, w, h, fill?, stroke?, rx? },
  { p: 'circle', cx, cy, r, fill?, stroke? },
  { p: 'path',   d, fill?, stroke?, width?, dash? },
]}
```

## Migration pattern

Before:
```js
const DAcidRain = ({ t, color }) => (
  <svg viewBox="0 0 320 160">
    <T x={160} y={16} c={color} fw={700}>ACID RAIN</T>
    <rect x={15} y={28} ... />
    ...
  </svg>
);
{ type: 'd', component: DAcidRain, caption: '...' }
```

After:
```js
{ type: 'd', spec: {
  title: 'ACID RAIN',
  blocks: [
    { type: 'panel', title: 'SULPHURIC PATH', body: [
      'SO₂ + H₂O → H₂SO₃',
      '2SO₂ + O₂ → 2SO₃',
    ], color: 'primary' },
    { type: 'panel', title: 'NITRIC PATH', body: [...], color: 'accent' },
    { type: 'note', text: 'Both contribute to acid rain', emphasis: true },
  ],
}, caption: '...' }
```

Both forms coexist — migrate topic by topic in K2/K3.
