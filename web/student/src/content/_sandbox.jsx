// K1 SANDBOX — exercises every diagram block type
// Used during Phase K1 to verify the renderer end-to-end.
// Not registered as a real topic; imported by a dev route.

export const SANDBOX = {
  id: 'sandbox',
  objectives: ['Verify Diagram renderer covers every block type'],
  chapters: [
    { id: 'sb1', title: 'Renderer Sandbox', minutes: 5, blocks: [
      { type: 'p', text: 'Each diagram below exercises one block type. If they all render cleanly, K1 is done.' },

      { type: 'd', caption: 'panel', spec: {
        title: 'PANEL — single card with title + body',
        blocks: [
          { type: 'panel', title: 'EXAMPLE PANEL', body: [
            'A panel is the most common block.',
            'It has an optional title in the topic colour,',
            'a list of body lines, and an optional grey hint.',
          ], hint: 'this is the hint', color: 'primary' },
        ],
      }},

      { type: 'd', caption: 'cards (3-up)', spec: {
        title: 'CARDS — 3 cards side-by-side',
        blocks: [
          { type: 'cards', cards: [
            { title: 'PRIMARY', body: ['topic colour'], color: 'primary' },
            { title: 'ACCENT', body: ['theme accent'], color: 'accent' },
            { title: 'PINK', body: ['palette pink'], color: 'pink' },
          ]},
        ],
      }},

      { type: 'd', caption: 'compare (2-up)', spec: {
        title: 'COMPARE — left vs right',
        blocks: [
          { type: 'compare',
            left:  { title: 'BEFORE', body: ['old way', 'JSX SVG', '~30 lines each'], color: 'primary' },
            right: { title: 'AFTER',  body: ['new way', 'JSON spec', '~10 lines each'], color: 'green' },
          },
        ],
      }},

      { type: 'd', caption: 'steps', spec: {
        title: 'STEPS — numbered list of panels',
        blocks: [
          { type: 'steps', items: [
            { body: 'Identify the linkage type', color: 'primary' },
            { body: 'Cut the linkages, restore atoms', color: 'accent' },
            { body: 'Verify by re-polymerising', color: 'pink' },
          ]},
        ],
      }},

      { type: 'd', caption: 'table', spec: {
        title: 'TABLE — headers + rows',
        blocks: [
          { type: 'table',
            headers: ['CATION', 'NaOH', 'NH₃'],
            rowColors: ['primary', 'accent', 'pink', 'green'],
            rows: [
              ['Al³⁺',  'white ppt sol. xs',     'white ppt insol. xs'],
              ['Cu²⁺',  'blue ppt insol. xs',    'pale blue → deep blue sol. xs'],
              ['Fe²⁺',  'green ppt insol. xs',   'green ppt insol. xs'],
              ['Fe³⁺',  'red-brown ppt insol.',  'red-brown ppt insol.'],
            ],
          },
        ],
      }},

      { type: 'd', caption: 'equation', spec: {
        title: 'EQUATION',
        blocks: [
          { type: 'equation', text: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂', big: true },
          { type: 'arrow' },
          { type: 'equation', text: 'CaCl₂(aq) + H₂CO₃(aq)' },
        ],
      }},

      { type: 'd', caption: 'note', spec: {
        title: 'NOTE',
        blocks: [
          { type: 'note', text: 'Plain dim note — usage caveat or footnote.' },
          { type: 'note', text: 'Emphasised note — main takeaway of the diagram.', emphasis: true },
        ],
      }},

      { type: 'd', caption: 'scaleBar', spec: {
        title: 'SCALE BAR — orders of magnitude',
        blocks: [
          { type: 'scaleBar',
            ticks: [
              { x: 0.0,  label: '0.1 nm', sublabel: 'atom' },
              { x: 0.25, label: '1 nm',   sublabel: 'molecule' },
              { x: 0.5,  label: '10 nm',  sublabel: 'protein' },
              { x: 0.75, label: '100 nm', sublabel: 'virus' },
              { x: 1.0,  label: '1 µm',   sublabel: 'bacterium' },
            ],
            highlight: { from: 0.25, to: 0.75, label: 'NANOSCALE 1–100 nm', color: 'primary' },
          },
        ],
      }},

      { type: 'd', caption: 'bars', spec: {
        title: 'BARS — relative basicity',
        blocks: [
          { type: 'bars', items: [
            { label: 'CH₃NH₂',  value: 110, valueLabel: 'pKb 3.27', color: 'primary' },
            { label: 'NH₃',     value: 75,  valueLabel: 'pKb 4.75', color: 'accent', sublabel: 'baseline' },
            { label: 'C₆H₅NH₂', value: 25,  valueLabel: 'pKb 9.42', color: 'pink', sublabel: 'aryl' },
          ]},
        ],
      }},

      { type: 'd', caption: 'pyramid', spec: {
        title: 'PYRAMID — waste hierarchy',
        blocks: [
          { type: 'pyramid', tiers: [
            { label: 'REDUCE',     width: 0.30, color: 'green',   note: 'best — fewer materials used' },
            { label: 'REUSE',      width: 0.45, color: 'primary', note: 'reuse same item many times' },
            { label: 'RECYCLE',    width: 0.65, color: 'accent',  note: 'reprocess into new item' },
            { label: 'INCINERATE', width: 0.85, color: 'pink',    note: 'energy recovery, but emissions' },
            { label: 'LANDFILL',   width: 1.00, color: 'grey',    note: 'last resort — slow decay' },
          ]},
        ],
      }},

      { type: 'd', caption: 'raw — escape hatch for custom geometry', spec: {
        title: 'RAW PRIMITIVES — Born-Haber-style',
        blocks: [
          { type: 'raw', height: 180, primitives: [
            // four energy levels
            { p: 'line', x1: 30, y1: 150, x2: 150, y2: 150, color: 'text', width: 1 },
            { p: 'text', x: 90, y: 145, text: 'Na(s) + ½Cl₂(g)', size: 8 },
            { p: 'line', x1: 30, y1: 110, x2: 150, y2: 110, color: 'text', width: 1 },
            { p: 'text', x: 90, y: 105, text: 'Na(g) + Cl(g)', size: 8 },
            { p: 'line', x1: 30, y1: 70, x2: 150, y2: 70, color: 'text', width: 1 },
            { p: 'text', x: 90, y: 65, text: 'Na⁺(g) + Cl⁻(g)', size: 8 },
            { p: 'line', x1: 200, y1: 165, x2: 290, y2: 165, color: 'text', width: 1 },
            { p: 'text', x: 245, y: 178, text: 'NaCl(s)', size: 8 },
            // up arrows
            { p: 'line', x1: 70, y1: 148, x2: 70, y2: 112, color: 'green', width: 1 },
            { p: 'text', x: 60, y: 132, text: 'ΔHat', size: 7, color: 'green', anchor: 'end' },
            { p: 'line', x1: 90, y1: 108, x2: 90, y2: 72, color: 'pink', width: 1 },
            { p: 'text', x: 80, y: 92, text: 'IE₁', size: 7, color: 'pink', anchor: 'end' },
            // dashed across to NaCl
            { p: 'line', x1: 90, y1: 70, x2: 245, y2: 70, color: 'dim', width: 0.5, dash: true },
            { p: 'line', x1: 245, y1: 70, x2: 245, y2: 162, color: 'amber', width: 1.5 },
            { p: 'text', x: 260, y: 116, text: 'ΔHlatt', size: 8, color: 'amber', anchor: 'start' },
            // formation diagonal
            { p: 'line', x1: 150, y1: 152, x2: 200, y2: 165, color: 'primary', width: 1.5, dash: true },
            { p: 'text', x: 175, y: 170, text: 'ΔHf°', size: 8, bold: true, color: 'primary' },
          ]},
        ],
      }},
    ]},
  ],
  quizzes: [],
  multi: [],
  structured: [],
  worked: [],
  tutorPrompts: [],
};
