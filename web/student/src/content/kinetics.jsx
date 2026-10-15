// Reaction Kinetics — PC-08 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.1 — Topic 8
// Syllabus coverage:
//   Form 5: Rate equations, order, rate constant, half-life, activation energy,
//           Boltzmann distribution, factors affecting rate, mechanisms,
//           initial rate method, concentration-time graphs
//   Form 6: Catalysis (homogeneous, heterogeneous), Haber process Fe catalyst,
//           I⁻/S₂O₈²⁻ with Fe²⁺, NOₓ in atmospheric SO₂ oxidation

/* ============================================================
   Diagram specs (Phase K3.3 migration)
   ============================================================ */

const kineticsRateEquationSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 160,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "RATE EQUATION",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "rect",
          "x": 40,
          "y": 32,
          "w": 240,
          "h": 40,
          "color": "primary",
          "stroke": 1.5,
          "fill": "primary",
          "rx": 6,
          "fillAlpha": 0.06
        },
        {
          "p": "text",
          "x": 160,
          "y": 57,
          "text": "rate = k[A]ᵐ[B]ⁿ",
          "color": "text",
          "size": 16,
          "bold": true
        },
        {
          "p": "text",
          "x": 70,
          "y": 90,
          "text": "k",
          "color": "accent",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 70,
          "y": 104,
          "text": "rate constant",
          "color": "dim",
          "size": 8
        },
        {
          "p": "text",
          "x": 160,
          "y": 90,
          "text": "m, n",
          "color": "accent",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 104,
          "text": "orders (0, 1 or 2)",
          "color": "dim",
          "size": 8
        },
        {
          "p": "text",
          "x": 250,
          "y": 90,
          "text": "m + n",
          "color": "accent",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 250,
          "y": 104,
          "text": "overall order",
          "color": "dim",
          "size": 8
        },
        {
          "p": "text",
          "x": 160,
          "y": 125,
          "text": "order is found by EXPERIMENT, NOT from the equation",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 160,
          "y": 142,
          "text": "k depends on temperature (Arrhenius equation)",
          "color": "dim",
          "size": 8
        },
        {
          "p": "text",
          "x": 160,
          "y": 156,
          "text": "units of k depend on overall order",
          "color": "dim",
          "size": 8
        }
      ]
    }
  ]
};
const kineticsInitialRateSpec = {
  "title": "INITIAL RATE METHOD",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "Expt",
        "[A]/M",
        "[B]/M",
        "Rate/M s⁻¹"
      ],
      "rows": [
        [
          "1",
          "0.10",
          "0.10",
          "2.0 × 10⁻³"
        ],
        [
          "2",
          "0.20",
          "0.10",
          "8.0 × 10⁻³"
        ],
        [
          "3",
          "0.10",
          "0.20",
          "4.0 × 10⁻³"
        ]
      ],
      "colWidths": [
        55,
        70,
        70,
        95
      ]
    },
    {
      "type": "note",
      "text": "Expt 1→2: [A] doubles, rate ×4 → order in A = 2"
    },
    {
      "type": "note",
      "text": "Expt 1→3: [B] doubles, rate ×2 → order in B = 1"
    },
    {
      "type": "equation",
      "text": "rate = k[A]²[B]",
      "big": true
    },
    {
      "type": "note",
      "text": "overall order = 2 + 1 = 3",
      "emphasis": true
    }
  ]
};
const kineticsOrderGraphsSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "[A] vs TIME · DIFFERENT ORDERS",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 55,
          "y": 40,
          "text": "Zero order",
          "color": "accent",
          "size": 8,
          "bold": true
        },
        {
          "p": "line",
          "x1": 25,
          "y1": 140,
          "x2": 100,
          "y2": 140,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "line",
          "x1": 25,
          "y1": 140,
          "x2": 25,
          "y2": 50,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "line",
          "x1": 28,
          "y1": 55,
          "x2": 90,
          "y2": 135,
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 62,
          "y": 155,
          "text": "linear decrease",
          "color": "dim",
          "size": 7
        },
        {
          "p": "text",
          "x": 20,
          "y": 85,
          "text": "[A]",
          "color": "text",
          "size": 6
        },
        {
          "p": "text",
          "x": 155,
          "y": 40,
          "text": "First order",
          "color": "accent",
          "size": 8,
          "bold": true
        },
        {
          "p": "line",
          "x1": 125,
          "y1": 140,
          "x2": 200,
          "y2": 140,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "line",
          "x1": 125,
          "y1": 140,
          "x2": 125,
          "y2": 50,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "path",
          "d": "M128 55 Q145 70 160 95 Q175 115 190 125 Q200 130 205 133",
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 162,
          "y": 155,
          "text": "exponential decay",
          "color": "dim",
          "size": 7
        },
        {
          "p": "line",
          "x1": 145,
          "y1": 92,
          "x2": 145,
          "y2": 140,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "line",
          "x1": 168,
          "y1": 112,
          "x2": 168,
          "y2": 140,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 156,
          "y": 145,
          "text": "equal t½",
          "color": "accent",
          "size": 5
        },
        {
          "p": "text",
          "x": 255,
          "y": 40,
          "text": "Second order",
          "color": "accent",
          "size": 8,
          "bold": true
        },
        {
          "p": "line",
          "x1": 225,
          "y1": 140,
          "x2": 300,
          "y2": 140,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "line",
          "x1": 225,
          "y1": 140,
          "x2": 225,
          "y2": 50,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "path",
          "d": "M228 55 Q235 75 242 95 Q255 115 270 125 Q285 132 305 136",
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 262,
          "y": 155,
          "text": "1/[A] is linear",
          "color": "dim",
          "size": 7
        },
        {
          "p": "text",
          "x": 160,
          "y": 175,
          "text": "KEY DIAGNOSTIC:",
          "color": "text",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 192,
          "text": "1st order: constant half-life (each t½ is the same)",
          "color": "text",
          "size": 8
        },
        {
          "p": "text",
          "x": 160,
          "y": 206,
          "text": "0th order: [A] vs t is linear",
          "color": "text",
          "size": 8
        },
        {
          "p": "text",
          "x": 160,
          "y": 220,
          "text": "2nd order: 1/[A] vs t is linear",
          "color": "text",
          "size": 8
        }
      ]
    }
  ]
};
const kineticsHalfLifeSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "FIRST ORDER · CONSTANT HALF-LIFE",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 170,
          "x2": 300,
          "y2": 170,
          "color": "text",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 170,
          "x2": 40,
          "y2": 25,
          "color": "text",
          "width": 1
        },
        {
          "p": "text",
          "x": 170,
          "y": 190,
          "text": "Time / s",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 25,
          "y": 90,
          "text": "[A]",
          "color": "text",
          "size": 7
        },
        {
          "p": "path",
          "d": "M43 35 Q60 45 80 60 Q110 85 140 110 Q170 130 210 148 Q250 160 295 165",
          "color": "primary",
          "width": 2
        },
        {
          "p": "line",
          "x1": 43,
          "y1": 35,
          "x2": 295,
          "y2": 35,
          "color": "dim",
          "width": 0.3,
          "dash": true
        },
        {
          "p": "text",
          "x": 38,
          "y": 33,
          "text": "[A]₀",
          "color": "text",
          "size": 7,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 43,
          "y1": 100,
          "x2": 110,
          "y2": 100,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "line",
          "x1": 110,
          "y1": 100,
          "x2": 110,
          "y2": 170,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 38,
          "y": 98,
          "text": "½",
          "color": "text",
          "size": 6,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 77,
          "y": 178,
          "text": "t½",
          "color": "accent",
          "size": 7
        },
        {
          "p": "line",
          "x1": 110,
          "y1": 132,
          "x2": 175,
          "y2": 132,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "line",
          "x1": 175,
          "y1": 132,
          "x2": 175,
          "y2": 170,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 38,
          "y": 130,
          "text": "¼",
          "color": "text",
          "size": 6,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 142,
          "y": 178,
          "text": "t½",
          "color": "accent",
          "size": 7
        },
        {
          "p": "line",
          "x1": 175,
          "y1": 150,
          "x2": 240,
          "y2": 150,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "line",
          "x1": 240,
          "y1": 150,
          "x2": 240,
          "y2": 170,
          "color": "accent",
          "width": 0.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 38,
          "y": 148,
          "text": "⅛",
          "color": "text",
          "size": 6,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 207,
          "y": 178,
          "text": "t½",
          "color": "accent",
          "size": 7
        },
        {
          "p": "text",
          "x": 160,
          "y": 200,
          "text": "t½ = ln2 / k = 0.693 / k",
          "color": "text",
          "size": 10,
          "bold": true
        }
      ]
    }
  ]
};
const kineticsBoltzmannSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 230,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "BOLTZMANN DISTRIBUTION",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 180,
          "x2": 300,
          "y2": 180,
          "color": "text",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 180,
          "x2": 40,
          "y2": 30,
          "color": "text",
          "width": 1
        },
        {
          "p": "text",
          "x": 170,
          "y": 200,
          "text": "Kinetic energy →",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 20,
          "y": 100,
          "text": "Number",
          "color": "text",
          "size": 7
        },
        {
          "p": "text",
          "x": 20,
          "y": 112,
          "text": "of",
          "color": "text",
          "size": 7
        },
        {
          "p": "text",
          "x": 20,
          "y": 124,
          "text": "molecules",
          "color": "text",
          "size": 7
        },
        {
          "p": "path",
          "d": "M45 178 Q80 170 100 130 Q120 70 140 50 Q160 40 180 55 Q210 90 240 130 Q260 155 290 172",
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 145,
          "y": 38,
          "text": "T₁",
          "color": "primary",
          "size": 8,
          "bold": true
        },
        {
          "p": "path",
          "d": "M45 178 Q90 172 120 155 Q150 120 170 95 Q200 70 230 80 Q260 105 280 140 Q295 165 305 172",
          "color": "pink",
          "width": 2,
          "dash": true
        },
        {
          "p": "text",
          "x": 210,
          "y": 60,
          "text": "T₂ > T₁",
          "color": "pink",
          "size": 8,
          "bold": true
        },
        {
          "p": "line",
          "x1": 220,
          "y1": 30,
          "x2": 220,
          "y2": 180,
          "color": "accent",
          "width": 1.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 225,
          "y": 28,
          "text": "Ea",
          "color": "accent",
          "size": 9,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "path",
          "d": "M220 130 Q240 155 260 165 Q280 172 295 175 L295 180 L220 180 Z",
          "color": "primary",
          "width": 0.5,
          "fill": "#ff006e25"
        },
        {
          "p": "text",
          "x": 260,
          "y": 210,
          "text": "molecules ≥ Ea",
          "color": "primary",
          "size": 7
        },
        {
          "p": "path",
          "d": "M220 80 Q240 100 260 120 Q280 145 300 165 L305 172 L305 180 L220 180 Z",
          "color": "pink",
          "width": 0.5,
          "fill": "#f7258515"
        },
        {
          "p": "text",
          "x": 275,
          "y": 222,
          "text": "MORE at T₂",
          "color": "pink",
          "size": 7
        }
      ]
    }
  ]
};
const kineticsCatalystProfileSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 210,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "CATALYST · LOWER Ea ROUTE",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 30,
          "y1": 180,
          "x2": 300,
          "y2": 180,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "line",
          "x1": 30,
          "y1": 180,
          "x2": 30,
          "y2": 20,
          "color": "text",
          "width": 0.5
        },
        {
          "p": "text",
          "x": 170,
          "y": 198,
          "text": "Reaction progress",
          "color": "text",
          "size": 8
        },
        {
          "p": "text",
          "x": 15,
          "y": 95,
          "text": "Energy",
          "color": "text",
          "size": 7
        },
        {
          "p": "line",
          "x1": 35,
          "y1": 100,
          "x2": 80,
          "y2": 100,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 57,
          "y": 95,
          "text": "R",
          "color": "text",
          "size": 8
        },
        {
          "p": "line",
          "x1": 240,
          "y1": 140,
          "x2": 290,
          "y2": 140,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 265,
          "y": 135,
          "text": "P",
          "color": "text",
          "size": 8
        },
        {
          "p": "path",
          "d": "M80 100 Q130 20 160 30 Q190 20 240 140",
          "color": "dim",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 160,
          "y": 22,
          "text": "without catalyst",
          "color": "dim",
          "size": 8
        },
        {
          "p": "line",
          "x1": 85,
          "y1": 100,
          "x2": 85,
          "y2": 32,
          "color": "dim",
          "width": 1,
          "dash": true
        },
        {
          "p": "text",
          "x": 75,
          "y": 65,
          "text": "Ea",
          "color": "dim",
          "size": 7,
          "anchor": "end"
        },
        {
          "p": "path",
          "d": "M80 100 Q120 55 160 60 Q200 55 240 140",
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 190,
          "y": 50,
          "text": "with catalyst",
          "color": "primary",
          "size": 8,
          "bold": true
        },
        {
          "p": "line",
          "x1": 90,
          "y1": 100,
          "x2": 90,
          "y2": 62,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "text",
          "x": 100,
          "y": 78,
          "text": "Ea'",
          "color": "primary",
          "size": 7,
          "anchor": "start"
        },
        {
          "p": "line",
          "x1": 280,
          "y1": 100,
          "x2": 280,
          "y2": 140,
          "color": "pink",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 295,
          "y": 122,
          "text": "ΔH",
          "color": "pink",
          "size": 7
        },
        {
          "p": "text",
          "x": 295,
          "y": 134,
          "text": "(same)",
          "color": "pink",
          "size": 7
        },
        {
          "p": "text",
          "x": 160,
          "y": 207,
          "text": "catalyst provides alternative pathway with LOWER Ea; ΔH unchanged",
          "color": "dim",
          "size": 8
        }
      ]
    }
  ]
};
const kineticsMechanismSpec = {
  "title": "MECHANISM & RATE-DETERMINING STEP",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "STEP 1 (slow)",
        "body": [
          "NO₂ + NO₂ → NO₃ + NO"
        ],
        "color": "pink"
      },
      "right": {
        "title": "STEP 2 (fast)",
        "body": [
          "NO₃ + CO → NO₂ + CO₂"
        ],
        "color": "primary"
      }
    },
    {
      "type": "equation",
      "text": "Overall: NO₂ + CO → NO + CO₂",
      "big": true
    },
    {
      "type": "note",
      "text": "Rate equation matches the SLOW step:"
    },
    {
      "type": "equation",
      "text": "rate = k[NO₂]²",
      "big": true
    },
    {
      "type": "note",
      "text": "CO does not appear because it is in the fast step"
    },
    {
      "type": "note",
      "text": "NO₃ is an intermediate — formed then consumed"
    },
    {
      "type": "note",
      "text": "rate-determining step = slowest step = bottleneck",
      "emphasis": true
    }
  ]
};
const kineticsCatalysisTypesSpec = {
  "title": "HOMOGENEOUS vs HETEROGENEOUS CATALYSIS",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "HOMOGENEOUS",
        "body": [
          "catalyst in SAME phase",
          "as reactants",
          "Fe²⁺(aq): I⁻ + S₂O₈²⁻",
          "forms intermediate",
          "then regenerated"
        ],
        "color": "primary"
      },
      "right": {
        "title": "HETEROGENEOUS",
        "body": [
          "catalyst in DIFFERENT",
          "phase from reactants",
          "Fe(s) in Haber process",
          "reactants adsorb → react",
          "products desorb"
        ],
        "color": "accent"
      }
    },
    {
      "type": "note",
      "text": "Both: lower Ea, same ΔH, same K",
      "emphasis": true
    },
    {
      "type": "note",
      "text": "catalyst is regenerated — not consumed"
    },
    {
      "type": "note",
      "text": "catalyst may appear in rate equation (homogeneous)"
    }
  ]
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  // CH.1 — What is rate?
  { id: 'rk1', title: 'Measuring Reaction Rates', minutes: 8, blocks: [
    { type: 'p', text: 'The rate of a reaction is the change in concentration of a reactant or product per unit time. A fast reaction has a large rate; a slow reaction has a small rate. Rate is always positive — if we track a reactant (whose concentration decreases), we include a negative sign in the definition to keep the value positive: rate = −d[A]/dt.' },
    { type: 'h', text: 'Experimental techniques' },
    { type: 'ul', items: [
      'Gas collection: measure the volume of gas produced over time. Suitable for reactions producing CO₂, H₂, O₂.',
      'Mass loss: place the reaction on a balance and record mass at intervals. Gas escapes, so mass decreases.',
      'Colorimetry: measure the absorbance or transmission of light through the solution. Useful when a coloured reactant/product is involved (e.g. MnO₄⁻ decolourises).',
      'Titration (quenching): withdraw samples at intervals, quench the reaction (e.g. by cooling or adding a stopping reagent), and titrate to find the concentration at that moment.',
      'Clock reactions: measure the time to a fixed visual change (e.g. a cross disappearing). Rate ∝ 1/time.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Rate of reaction', body: 'Rate = change in concentration / time = −d[reactant]/dt = +d[product]/dt. Units: mol dm⁻³ s⁻¹.' },
    { type: 'h', text: 'Initial rate' },
    { type: 'p', text: 'The initial rate is the rate at the very start of the reaction (t = 0), before any significant amount of reactant is consumed. It is found from the tangent to the concentration-time curve at t = 0. Initial rates are used in the "initial rate method" to determine order.' },
    { type: 'takeaway', items: [
      'Rate = −d[A]/dt, units mol dm⁻³ s⁻¹.',
      'Measured by gas volume, mass loss, colorimetry, titration, or clock methods.',
      'Initial rate = tangent gradient at t = 0.',
    ]},
  ]},

  // CH.2 — Rate equations and order
  { id: 'rk2', title: 'Rate Equations & Order of Reaction', minutes: 11, blocks: [
    { type: 'p', text: 'The rate equation links the rate of reaction to the concentrations of the reactants. It takes the form: rate = k[A]ᵐ[B]ⁿ, where k is the rate constant, m is the order with respect to A, and n is the order with respect to B. The OVERALL ORDER is m + n.' },
    { type: 'd', spec: kineticsRateEquationSpec, caption: 'The general rate equation' },
    { type: 'h', text: 'What is order?' },
    { type: 'ul', items: [
      'Order with respect to A: the power to which [A] is raised in the rate equation.',
      'Zero order in A: rate is independent of [A]. Doubling [A] has no effect on rate.',
      'First order in A: rate is directly proportional to [A]. Doubling [A] doubles the rate.',
      'Second order in A: rate ∝ [A]². Doubling [A] quadruples the rate.',
    ]},
    { type: 'h', text: 'Order is determined by experiment' },
    { type: 'p', text: 'You CANNOT deduce order from the balanced equation. The balanced equation shows the OVERALL stoichiometry, but the rate equation reflects the MECHANISM — specifically, the species involved in the rate-determining step. These are often different.' },
    { type: 'h', text: 'The rate constant k' },
    { type: 'ul', items: [
      'k is constant at a given temperature. It increases with temperature (Arrhenius).',
      'Units of k depend on the overall order. For overall order n: units = mol¹⁻ⁿ dm³⁽ⁿ⁻¹⁾ s⁻¹.',
      'Zero order: k in mol dm⁻³ s⁻¹. First order: k in s⁻¹. Second order: k in mol⁻¹ dm³ s⁻¹.',
    ]},
    { type: 'callout', kind: 'warning', title: 'Key misconception', body: 'The stoichiometric coefficients in the balanced equation do NOT give the orders. For example, 2NO₂ + F₂ → 2NO₂F has experimental rate = k[NO₂][F₂] (both first order), not k[NO₂]²[F₂].' },
    { type: 'takeaway', items: [
      'rate = k[A]ᵐ[B]ⁿ where m, n are found by experiment.',
      'Zero order: rate unaffected. First: rate ∝ [A]. Second: rate ∝ [A]².',
      'Order ≠ coefficient from the balanced equation.',
      'k units depend on overall order.',
    ]},
  ]},

  // CH.3 — Determining order
  { id: 'rk3', title: 'Finding Order: Initial Rate & Graphical Methods', minutes: 11, blocks: [
    { type: 'p', text: 'There are two main methods for determining order: the initial rate method (from tabulated data) and the graphical method (from concentration-time curves).' },
    { type: 'd', spec: kineticsInitialRateSpec, caption: 'Initial rate method — systematic comparison' },
    { type: 'h', text: 'Initial rate method' },
    { type: 'ul', items: [
      'Set up experiments where only ONE concentration changes at a time (others held constant).',
      'Compare the factor by which rate changes when a concentration is changed by a known factor.',
      'If [A] doubles and rate doubles → first order in A. If rate quadruples → second order. If rate unchanged → zero order.',
      'Mathematically: if [A] changes by factor x and rate changes by factor xᵐ, then m = log(rate factor) / log(concentration factor).',
    ]},
    { type: 'h', text: 'Graphical method — concentration vs time' },
    { type: 'd', spec: kineticsOrderGraphsSpec, caption: 'Shapes of [A]-time curves for different orders' },
    { type: 'ul', items: [
      'Zero order: [A] vs t is a straight line (constant rate of decrease).',
      'First order: [A] vs t is an exponential decay curve with CONSTANT half-life.',
      'Second order: [A] vs t is a curve, but 1/[A] vs t is a straight line.',
    ]},
    { type: 'h', text: 'The half-life test for first order' },
    { type: 'p', text: 'Measure successive half-lives from the [A]-time graph. If each half-life is the SAME (within experimental error), the reaction is first order. If t½ increases as [A] drops, it is second order. If t½ decreases as [A] drops, it is zero order.' },
    { type: 'takeaway', items: [
      'Initial rate method: compare experiments where one variable changes.',
      'Graphical: [A] vs t straight → zero; exponential with constant t½ → first; 1/[A] linear → second.',
      'Constant half-life is the diagnostic for first order.',
    ]},
  ]},

  // CH.4 — Half-life
  { id: 'rk4', title: 'Half-Life & First-Order Kinetics', minutes: 9, blocks: [
    { type: 'p', text: 'The half-life (t½) is the time taken for the concentration of a reactant to fall to HALF its initial value. For a first-order reaction, t½ is CONSTANT — independent of concentration. This is a unique and diagnostic property of first-order kinetics.' },
    { type: 'd', spec: kineticsHalfLifeSpec, caption: 'First-order decay: each successive t½ is the same' },
    { type: 'h', text: 'First-order half-life formula' },
    { type: 'ul', items: [
      't½ = ln2 / k = 0.693 / k. This relates half-life to the rate constant k.',
      'Rearranging: k = 0.693 / t½. If you know the half-life, you can find k.',
      'Note: this formula applies ONLY to first-order reactions.',
    ]},
    { type: 'h', text: 'Using half-lives to find concentration' },
    { type: 'ul', items: [
      'After 1 half-life: [A] = [A]₀ / 2.',
      'After 2 half-lives: [A] = [A]₀ / 4.',
      'After 3 half-lives: [A] = [A]₀ / 8.',
      'After n half-lives: [A] = [A]₀ / 2ⁿ.',
      'Example: radioactive decay follows first-order kinetics. If t½ = 5730 years (C-14), after 11460 years (2 half-lives), ¼ of the original C-14 remains.',
    ]},
    { type: 'callout', kind: 'key', title: 'Half-life for other orders', body: 'For zero order: t½ = [A]₀ / 2k (depends on initial concentration, gets shorter). For second order: t½ = 1 / (k[A]₀) (also depends on [A]₀, gets longer as [A] drops). Only first order has constant t½.' },
    { type: 'takeaway', items: [
      'First order: t½ = 0.693 / k (constant, independent of concentration).',
      'After n half-lives: [A] = [A]₀ / 2ⁿ.',
      'Constant t½ is the hallmark of first-order kinetics.',
    ]},
  ]},

  // CH.5 — Collision theory and factors
  { id: 'rk5', title: 'Collision Theory & Factors Affecting Rate', minutes: 10, blocks: [
    { type: 'p', text: 'For a reaction to occur, reactant particles must COLLIDE with sufficient ENERGY (≥ activation energy, Ea) and correct ORIENTATION. Anything that increases the frequency of effective collisions increases the rate.' },
    { type: 'h', text: 'Factors affecting rate' },
    { type: 'ul', items: [
      'CONCENTRATION: higher concentration → more particles per unit volume → more frequent collisions → higher rate.',
      'PRESSURE (gases): increasing pressure is equivalent to increasing concentration for gases.',
      'TEMPERATURE: higher temperature → particles move faster → (1) more frequent collisions AND (2) a greater fraction have energy ≥ Ea. The second effect is more important.',
      'SURFACE AREA: for heterogeneous reactions, smaller particles (powder vs lump) expose more surface → more collisions at the interface.',
      'CATALYST: provides an alternative pathway with lower Ea → more particles can overcome the energy barrier.',
    ]},
    { type: 'h', text: 'The Boltzmann distribution' },
    { type: 'd', spec: kineticsBoltzmannSpec, caption: 'Effect of temperature on the distribution of molecular energies' },
    { type: 'ul', items: [
      'The Boltzmann distribution shows the number of molecules at each energy level.',
      'At higher temperature, the curve flattens and shifts RIGHT — the peak is lower and the area under the curve to the RIGHT of Ea increases.',
      'This means MORE molecules have energy ≥ Ea, so the rate increases.',
      'A catalyst LOWERS Ea (moves the Ea line to the LEFT) — same effect: more molecules can now react.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why temperature is so powerful', body: 'A 10 °C rise in temperature roughly doubles the rate for many reactions. This is because even a small shift in the Boltzmann distribution greatly increases the fraction of molecules above Ea — the effect is exponential (Arrhenius).' },
    { type: 'takeaway', items: [
      'Effective collision = sufficient energy + correct orientation.',
      'Concentration, pressure, temperature, surface area, catalyst all increase rate.',
      'Temperature: more molecules above Ea (Boltzmann shift).',
      'Catalyst: lowers Ea without changing ΔH or K.',
    ]},
  ]},

  // CH.6 — Activation energy and catalyst effect
  { id: 'rk6', title: 'Activation Energy & Catalysts', minutes: 9, blocks: [
    { type: 'p', text: 'Activation energy (Ea) is the minimum energy that colliding particles must possess for a reaction to occur. It is the "energy barrier" between reactants and products. A catalyst provides an ALTERNATIVE PATHWAY with a LOWER Ea.' },
    { type: 'd', spec: kineticsCatalystProfileSpec, caption: 'Energy profile: catalyst provides a lower Ea route' },
    { type: 'h', text: 'Key points about catalysts' },
    { type: 'ul', items: [
      'A catalyst speeds up the reaction by lowering Ea — more molecules have enough energy to react.',
      'The catalyst is NOT consumed — it is regenerated at the end of the catalytic cycle.',
      'A catalyst does NOT change ΔH (the enthalpy change of the reaction is the same).',
      'A catalyst does NOT change the equilibrium position or the value of K — it only speeds up the attainment of equilibrium.',
      'A catalyst provides a DIFFERENT MECHANISM — the reaction goes via a different set of steps, with a lower maximum energy barrier.',
    ]},
    { type: 'h', text: 'The Arrhenius equation (awareness)' },
    { type: 'p', text: 'The rate constant k depends on temperature according to k = Ae^(−Ea/RT), where A is the pre-exponential factor (related to collision frequency and orientation), Ea is the activation energy, R is the gas constant, and T is temperature in Kelvin. This equation explains why rate increases exponentially with temperature.' },
    { type: 'takeaway', items: [
      'Ea = minimum collision energy for reaction.',
      'Catalyst lowers Ea via an alternative mechanism.',
      'Catalyst: unchanged by reaction; does not change ΔH or K.',
      'k = Ae^(−Ea/RT) — rate increases exponentially with T.',
    ]},
  ]},

  // CH.7 — Mechanisms
  { id: 'rk7', title: 'Reaction Mechanisms', minutes: 10, blocks: [
    { type: 'p', text: 'A mechanism is a step-by-step description of how a reaction actually occurs at the molecular level. Most reactions do not happen in a single step — instead, they proceed through a series of elementary steps, each involving the collision of a small number of species.' },
    { type: 'd', spec: kineticsMechanismSpec, caption: 'Two-step mechanism for NO₂ + CO' },
    { type: 'h', text: 'The rate-determining step (RDS)' },
    { type: 'ul', items: [
      'The RDS is the SLOWEST step in the mechanism. It controls the overall rate, like a bottleneck in a production line.',
      'The rate equation reflects only the species involved in the RDS (and any earlier equilibria).',
      'Species that appear AFTER the RDS do not appear in the rate equation.',
    ]},
    { type: 'h', text: 'Deducing mechanism from rate equation' },
    { type: 'ul', items: [
      'If rate = k[A][B], the RDS involves one molecule of A and one of B colliding.',
      'If rate = k[A]², the RDS involves two molecules of A colliding (or A appears twice in steps up to and including the RDS).',
      'If rate = k[A] (B absent), then B is not involved until AFTER the RDS.',
    ]},
    { type: 'h', text: 'Intermediates' },
    { type: 'ul', items: [
      'An intermediate is a species that is FORMED in one step and CONSUMED in a subsequent step. It does not appear in the overall equation.',
      'Example: in the NO₂ + CO mechanism, NO₃ is an intermediate (formed in step 1, consumed in step 2).',
      'Intermediates are often unstable and short-lived, which is why the slow step matters.',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam approach', body: 'Given a rate equation, propose a mechanism: (1) the RDS must involve the species in the rate equation with the correct molecularity. (2) The steps must add up to the overall equation. (3) Any extra species are intermediates.' },
    { type: 'takeaway', items: [
      'Mechanism = set of elementary steps that sum to the overall equation.',
      'Rate-determining step (slowest) controls the rate equation.',
      'Species in the rate equation are those in or before the RDS.',
      'Intermediates: formed in one step, consumed in another.',
    ]},
  ]},

  // CH.8 — Catalysis: homogeneous and heterogeneous
  { id: 'rk8', title: 'Homogeneous & Heterogeneous Catalysis', minutes: 12, blocks: [
    { type: 'p', text: 'The ZIMSEC syllabus requires detailed knowledge of two types of catalysis, with specific industrial and environmental examples.' },
    { type: 'd', spec: kineticsCatalysisTypesSpec, caption: 'Comparing homogeneous and heterogeneous catalysis' },
    { type: 'h', text: 'Heterogeneous catalysis' },
    { type: 'ul', items: [
      'Catalyst is in a DIFFERENT phase from the reactants (usually solid catalyst + gas or liquid reactants).',
      'Mechanism: (1) Reactant molecules ADSORB onto the catalyst surface (bonds weaken). (2) Reaction occurs on the surface (lower Ea). (3) Products DESORB from the surface.',
      'Example 1: Fe(s) catalyst in the Haber process (N₂ + 3H₂ → 2NH₃). N₂ and H₂ adsorb onto Fe, N≡N bond is weakened, facilitating reaction.',
      'Example 2: catalytic converter in car exhausts — Pt/Pd/Rh catalyse the removal of NOₓ: 2NO → N₂ + O₂, and the oxidation of CO: 2CO + O₂ → 2CO₂.',
      'Catalyst poisoning: impurities (e.g. lead, sulphur) adsorb onto active sites and block them. This is why leaded petrol damages catalytic converters.',
    ]},
    { type: 'h', text: 'Homogeneous catalysis' },
    { type: 'ul', items: [
      'Catalyst is in the SAME phase as the reactants (all in solution, or all gaseous).',
      'The catalyst reacts with one reactant to form an INTERMEDIATE, which then reacts with the second reactant, regenerating the catalyst.',
      'Example 1: Fe²⁺(aq) catalyses the reaction between I⁻(aq) and S₂O₈²⁻(aq). Step 1: 2Fe²⁺ + S₂O₈²⁻ → 2Fe³⁺ + 2SO₄²⁻ (Fe²⁺ oxidised). Step 2: 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂ (Fe²⁺ regenerated). Fe²⁺ acts as an electron-transfer agent.',
      'Example 2: NOₓ in the atmosphere catalyses the oxidation of SO₂: NO₂ + SO₂ → NO + SO₃; then NO + ½O₂ → NO₂ (regenerated). This contributes to acid rain.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why Fe²⁺ works as a catalyst', body: 'The direct reaction I⁻ + S₂O₈²⁻ requires collision of two negative ions — they repel each other, giving a high Ea. Fe²⁺ provides a pathway where each step involves ions of opposite charge colliding (lower Ea). The overall Ea is reduced, so the reaction is faster.' },
    { type: 'takeaway', items: [
      'Heterogeneous: different phase; adsorb → react → desorb.',
      'Homogeneous: same phase; catalyst forms intermediate, then regenerated.',
      'Fe(s) in Haber, Pt in catalytic converters (heterogeneous).',
      'Fe²⁺ in I⁻/S₂O₈²⁻, NOₓ in SO₂ oxidation (homogeneous).',
    ]},
  ]},

  // CH.9 — Calculating k and using rate equations
  { id: 'rk9', title: 'Calculating k & Using Rate Equations', minutes: 9, blocks: [
    { type: 'p', text: 'Once you know the order, you can calculate k from experimental data and use the rate equation to predict rates at different concentrations.' },
    { type: 'h', text: 'Finding k from initial rate data' },
    { type: 'ul', items: [
      'Step 1: Determine the orders (initial rate method or graphical method).',
      'Step 2: Write the rate equation: rate = k[A]ᵐ[B]ⁿ.',
      'Step 3: Substitute data from ANY experiment into the rate equation and solve for k.',
      'Example: rate = k[A]²[B]. Using experiment 1: 2.0 × 10⁻³ = k(0.10)²(0.10). k = 2.0 × 10⁻³ / (0.010 × 0.10) = 2.0 mol⁻² dm⁶ s⁻¹.',
    ]},
    { type: 'h', text: 'Finding k from half-life (first order)' },
    { type: 'ul', items: [
      'k = 0.693 / t½.',
      'Example: if t½ = 346 s, then k = 0.693 / 346 = 2.00 × 10⁻³ s⁻¹.',
    ]},
    { type: 'h', text: 'Predicting rate at a new concentration' },
    { type: 'p', text: 'Once k is known, substitute any new set of concentrations into rate = k[A]ᵐ[B]ⁿ to predict the rate. This is a common exam calculation — straightforward once orders and k are established.' },
    { type: 'callout', kind: 'key', title: 'Units of k', body: 'Overall order 0: mol dm⁻³ s⁻¹. Order 1: s⁻¹. Order 2: mol⁻¹ dm³ s⁻¹. Order 3: mol⁻² dm⁶ s⁻¹. Always derive units from the rate equation.' },
    { type: 'takeaway', items: [
      'Find k by substituting known data into the rate equation.',
      'First order: k = 0.693 / t½.',
      'Use k to predict rates at new concentrations.',
      'Always state units of k.',
    ]},
  ]},

  // CH.10 — Drawing and interpreting graphs
  { id: 'rk10', title: 'Graphical Analysis in Kinetics', minutes: 8, blocks: [
    { type: 'p', text: 'Exam questions frequently ask you to sketch or interpret concentration-time and rate-concentration graphs. Here is a systematic approach.' },
    { type: 'h', text: '[A] vs time' },
    { type: 'ul', items: [
      'Zero order: straight line going down. Gradient = −k.',
      'First order: exponential decay. Successive half-lives are equal.',
      'Second order: curve that levels off more slowly than first order. Plot 1/[A] vs t for a straight line.',
    ]},
    { type: 'h', text: 'Rate vs [A]' },
    { type: 'ul', items: [
      'Zero order: horizontal line (rate constant regardless of [A]).',
      'First order: straight line through the origin (rate ∝ [A]).',
      'Second order: upward curve (parabola through origin, rate ∝ [A]²).',
    ]},
    { type: 'h', text: 'Rate vs time' },
    { type: 'ul', items: [
      'For all orders, rate generally decreases over time as reactants are consumed.',
      'Zero order: rate stays constant until [A] reaches zero, then drops to zero abruptly.',
      'First order: rate decreases exponentially (same shape as [A] vs t).',
    ]},
    { type: 'callout', kind: 'key', title: 'Gradient = initial rate', body: 'The tangent to the [A]-time curve at any point gives the instantaneous rate at that moment. At t = 0, this tangent gives the initial rate. Practice drawing tangents accurately — a ruler and pencil are essential in the exam.' },
    { type: 'takeaway', items: [
      'Zero: [A]-t linear. First: [A]-t exponential (constant t½). Second: 1/[A]-t linear.',
      'Rate vs [A]: horizontal (0th), linear (1st), parabolic (2nd).',
      'Tangent to [A]-t curve = instantaneous rate.',
    ]},
  ]},

  // CH.11 — Exam technique
  { id: 'rk11', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Kinetics questions combine graphical interpretation, calculation, and mechanistic reasoning. Here are the key patterns.' },
    { type: 'h', text: 'Order determination from data tables' },
    { type: 'ul', items: [
      'Always isolate ONE variable at a time. Find two experiments where only [A] changes.',
      'Calculate the ratio of rates and the ratio of concentrations. If rate ratio = (conc ratio)ᵐ, then m is the order.',
      'If the ratios are not clean multiples (e.g. rate × 2.9 when [A] × 1.7), use m = log(rate ratio) / log(conc ratio).',
    ]},
    { type: 'h', text: 'Mechanism questions' },
    { type: 'ul', items: [
      'If asked to "suggest a mechanism consistent with the rate equation": make the RDS involve the species in the rate equation with the correct powers.',
      'All steps must add up to the overall equation.',
      'Mark any species that appears in one step and disappears in another as an INTERMEDIATE.',
    ]},
    { type: 'h', text: 'Common mistakes' },
    { type: 'ul', items: [
      'Confusing order with stoichiometric coefficient — they are NOT the same.',
      'Forgetting to convert time to seconds when calculating k.',
      'Not stating units of k (always required).',
      'Saying a catalyst "gives the molecules more energy" — WRONG. A catalyst lowers Ea; it does not increase molecular energy.',
      'Claiming a catalyst shifts equilibrium — it does NOT.',
    ]},
    { type: 'callout', kind: 'warning', title: 'The catalyst myth', body: 'A catalyst does NOT give molecules more energy. It does NOT shift equilibrium. It provides an alternative pathway with lower Ea. It speeds up both forward and reverse reactions equally. State these precisely in the exam.' },
    { type: 'takeaway', items: [
      'Isolate variables when finding order from data.',
      'Mechanism RDS must match the rate equation.',
      'Catalyst: lowers Ea, alternative pathway, does NOT shift equilibrium.',
      'Always state units of k.',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 32 MCQs
   ============================================================ */
const quizzes = [
  { q: 'The rate of a reaction is measured in:', opts: ['mol dm⁻³', 'mol dm⁻³ s⁻¹', 's⁻¹', 'kJ mol⁻¹'], ans: 1, hint: 'Rate = change in concentration per unit time.' },
  { q: 'If doubling [A] has no effect on the rate, the order with respect to A is:', opts: ['0', '1', '2', '3'], ans: 0, hint: 'Zero order means rate is independent of [A].' },
  { q: 'If doubling [A] quadruples the rate, the order is:', opts: ['0', '1', '2', '3'], ans: 2, hint: '2² = 4, so second order.' },
  { q: 'The overall order of rate = k[A]²[B] is:', opts: ['1', '2', '3', '4'], ans: 2, hint: 'Sum of individual orders: 2 + 1 = 3.' },
  { q: 'The units of k for a first-order reaction are:', opts: ['mol dm⁻³ s⁻¹', 's⁻¹', 'mol⁻¹ dm³ s⁻¹', 'mol⁻² dm⁶ s⁻¹'], ans: 1, hint: 'rate (mol dm⁻³ s⁻¹) = k × [A] (mol dm⁻³). So k = s⁻¹.' },
  { q: 'Order of reaction can be determined from:', opts: ['The balanced equation', 'The enthalpy change', 'Experimental data', 'The periodic table'], ans: 2, hint: 'Order is ALWAYS determined experimentally.' },
  { q: 'A first-order reaction has a constant:', opts: ['Rate', 'Concentration', 'Half-life', 'Temperature'], ans: 2, hint: 'The unique feature of first order: t½ does not depend on [A].' },
  { q: 'The half-life of a first-order reaction with k = 0.0100 s⁻¹ is:', opts: ['69.3 s', '6.93 s', '100 s', '0.693 s'], ans: 0, hint: 't½ = 0.693 / k = 0.693 / 0.0100.' },
  { q: 'After 3 half-lives, what fraction of a first-order reactant remains?', opts: ['½', '¼', '⅛', '1/16'], ans: 2, hint: '[A] = [A]₀ / 2³ = [A]₀ / 8.' },
  { q: 'Activation energy is:', opts: ['The energy of the products', 'The minimum energy for a successful collision', 'The enthalpy change', 'The energy lost by the catalyst'], ans: 1, hint: 'Ea = energy barrier that must be overcome.' },
  { q: 'On a Boltzmann distribution, raising the temperature:', opts: ['Lowers the curve and shifts it left', 'Lowers the peak and shifts it right', 'Raises the peak', 'Has no effect'], ans: 1, hint: 'Higher T = flatter curve, shifted to higher energies.' },
  { q: 'A catalyst works by:', opts: ['Increasing the enthalpy change', 'Lowering the activation energy', 'Increasing the concentration', 'Shifting the equilibrium'], ans: 1, hint: 'Alternative pathway, lower Ea.' },
  { q: 'A catalyst changes:', opts: ['ΔH', 'K', 'Ea', 'The stoichiometry'], ans: 2, hint: 'Ea is lowered; ΔH and K are unchanged.' },
  { q: 'The rate-determining step is:', opts: ['The fastest step', 'The slowest step', 'The last step', 'The most exothermic step'], ans: 1, hint: 'The bottleneck controls the overall rate.' },
  { q: 'An intermediate in a mechanism is:', opts: ['A catalyst', 'Formed in one step and consumed in another', 'Always a gas', 'Present in the overall equation'], ans: 1, hint: 'Intermediates appear and disappear within the mechanism.' },
  { q: 'If rate = k[X]²[Y] and [X] is tripled while [Y] is halved, the rate changes by:', opts: ['×4.5', '×9', '×3', '×1.5'], ans: 0, hint: 'Factor = 3² × 0.5 = 9 × 0.5 = 4.5.' },
  { q: 'In heterogeneous catalysis, the catalyst is:', opts: ['In the same phase as reactants', 'In a different phase', 'Always a gas', 'Always a liquid'], ans: 1, hint: 'Hetero = different.' },
  { q: 'In the Haber process, the catalyst is:', opts: ['Platinum', 'Iron', 'Vanadium(V) oxide', 'Manganese dioxide'], ans: 1, hint: 'Fe(s) is the heterogeneous catalyst for N₂ + 3H₂ ⇌ 2NH₃.' },
  { q: 'Fe²⁺ catalyses the I⁻/S₂O₈²⁻ reaction. This is an example of:', opts: ['Heterogeneous catalysis', 'Homogeneous catalysis', 'Autocatalysis', 'Enzyme catalysis'], ans: 1, hint: 'All reactants and catalyst are in aqueous solution — same phase.' },
  { q: 'In homogeneous catalysis, the catalyst:', opts: ['Adsorbs reactants on its surface', 'Forms an intermediate compound', 'Changes the ΔH', 'Is permanently consumed'], ans: 1, hint: 'Catalyst reacts to form intermediate, then is regenerated.' },
  { q: 'Catalyst poisoning occurs when:', opts: ['The catalyst is heated too much', 'Impurities block the active sites', 'The products are removed', 'The pressure is too high'], ans: 1, hint: 'e.g. lead poisons the Pt catalyst in a catalytic converter.' },
  { q: 'Which graph is linear for a first-order reaction?', opts: ['[A] vs t', 'ln[A] vs t', '1/[A] vs t', 'Rate vs [A]²'], ans: 1, hint: 'For first order, ln[A] = ln[A]₀ − kt gives a straight line.' },
  { q: 'Which graph is linear for a second-order reaction?', opts: ['[A] vs t', 'ln[A] vs t', '1/[A] vs t', 'Rate vs t'], ans: 2, hint: '1/[A] = 1/[A]₀ + kt gives a straight line for second order.' },
  { q: 'The initial rate of a reaction is found by:', opts: ['Measuring the final concentration', 'Drawing a tangent to the curve at t = 0', 'Dividing total change by total time', 'Using the equilibrium constant'], ans: 1, hint: 'The tangent gradient at the start of the curve gives the initial rate.' },
  { q: 'Rate = k[A][B]. If [A] and [B] are both doubled, the rate increases by:', opts: ['×2', '×3', '×4', '×8'], ans: 2, hint: '2¹ × 2¹ = 4.' },
  { q: 'For a zero-order reaction, the graph of [A] vs t is:', opts: ['Exponential decay', 'A straight line with negative gradient', 'A horizontal line', 'A parabola'], ans: 1, hint: 'Rate is constant, so [A] decreases linearly.' },
  { q: 'NOₓ catalyses the oxidation of SO₂ in the atmosphere. This is:', opts: ['Heterogeneous catalysis', 'Homogeneous catalysis', 'Enzyme catalysis', 'Autocatalysis'], ans: 1, hint: 'Both NOₓ and SO₂ are gases — same phase.' },
  { q: 'In a catalytic converter, the catalyst is:', opts: ['Fe', 'Pt/Pd/Rh', 'V₂O₅', 'MnO₂'], ans: 1, hint: 'Platinum group metals catalyse exhaust gas reactions.' },
  { q: 'A catalytic converter removes:', opts: ['CO₂ and H₂O', 'CO and NOₓ', 'N₂ and O₂', 'SO₂ and CH₄'], ans: 1, hint: 'Converts toxic CO to CO₂ and reduces NOₓ to N₂.' },
  { q: 'If t½ = 100 s for a first-order reaction, what is k?', opts: ['0.00693 s⁻¹', '0.0693 s⁻¹', '6.93 s⁻¹', '0.693 s⁻¹'], ans: 0, hint: 'k = 0.693 / t½ = 0.693 / 100.' },
  { q: 'The Arrhenius equation shows that k increases with:', opts: ['Decreasing Ea', 'Increasing temperature', 'Both decreasing Ea and increasing T', 'Neither'], ans: 2, hint: 'k = Ae^(−Ea/RT): lower Ea or higher T both increase k.' },
  { q: 'In a clock reaction, rate is proportional to:', opts: ['Time', '1/time', 'Time²', 'Temperature'], ans: 1, hint: 'Shorter time = faster reaction. Rate ∝ 1/t.' },
];

/* ============================================================
   Structured questions — 6
   ============================================================ */
const structured = [
  { title: 'Initial rate method', marks: 9, q: 'The reaction A + 2B → C was studied. Data: Expt 1: [A]=0.10, [B]=0.10, rate=3.0×10⁻⁴. Expt 2: [A]=0.20, [B]=0.10, rate=6.0×10⁻⁴. Expt 3: [A]=0.10, [B]=0.30, rate=2.7×10⁻³. All concentrations in mol dm⁻³, rates in mol dm⁻³ s⁻¹.', parts: [
    { q: '(a) Determine the order with respect to A.', marks: 2, ans: 'Compare expts 1 and 2: [A] doubles (×2), [B] constant. Rate doubles (6.0/3.0 = 2). 2¹ = 2, so order in A = 1.' },
    { q: '(b) Determine the order with respect to B.', marks: 2, ans: 'Compare expts 1 and 3: [B] triples (×3), [A] constant. Rate increases by 2.7×10⁻³/3.0×10⁻⁴ = 9. 3² = 9, so order in B = 2.' },
    { q: '(c) Write the rate equation and state the overall order.', marks: 1, ans: 'rate = k[A][B]². Overall order = 1 + 2 = 3.' },
    { q: '(d) Calculate the value of k and state its units.', marks: 2, ans: 'Using expt 1: 3.0×10⁻⁴ = k(0.10)(0.10)². k = 3.0×10⁻⁴ / (0.10 × 0.010) = 3.0×10⁻⁴ / 1.0×10⁻³ = 0.30 mol⁻² dm⁶ s⁻¹.' },
    { q: '(e) Predict the rate when [A] = 0.30 and [B] = 0.20.', marks: 2, ans: 'rate = 0.30 × 0.30 × (0.20)² = 0.30 × 0.30 × 0.040 = 3.6 × 10⁻³ mol dm⁻³ s⁻¹.' },
  ]},
  { title: 'Half-life and first order', marks: 7, q: 'The decomposition of N₂O₅ is first order with t½ = 24.0 minutes at 45 °C.', parts: [
    { q: '(a) Calculate the rate constant k.', marks: 2, ans: 'k = 0.693 / t½ = 0.693 / (24.0 × 60) = 0.693 / 1440 = 4.81 × 10⁻⁴ s⁻¹.' },
    { q: '(b) If [N₂O₅]₀ = 0.160 mol dm⁻³, calculate [N₂O₅] after 72.0 minutes.', marks: 2, ans: '72.0 min = 3 half-lives (72/24 = 3). [N₂O₅] = 0.160 / 2³ = 0.160 / 8 = 0.0200 mol dm⁻³.' },
    { q: '(c) How would you confirm experimentally that this reaction is first order?', marks: 3, ans: 'Plot [N₂O₅] against time and measure successive half-lives from the graph. If each half-life is the same (within experimental error), the reaction is first order. Alternatively, plot ln[N₂O₅] vs t — if the graph is a straight line with gradient −k, the reaction is first order.' },
  ]},
  { title: 'Mechanism from rate equation', marks: 8, q: 'The overall reaction is: 2NO(g) + O₂(g) → 2NO₂(g). The experimental rate equation is: rate = k[NO]²[O₂].', parts: [
    { q: '(a) What is the overall order of the reaction?', marks: 1, ans: '2 + 1 = 3 (third order).' },
    { q: '(b) Explain why the rate equation cannot be deduced from the balanced equation alone.', marks: 2, ans: 'The balanced equation shows the overall stoichiometry, not the mechanism. The rate equation depends on the species involved in the rate-determining step, which is determined experimentally. Different mechanisms can give different rate equations for the same overall reaction.' },
    { q: '(c) One proposed mechanism is: Step 1 (fast equilibrium): 2NO ⇌ N₂O₂. Step 2 (slow): N₂O₂ + O₂ → 2NO₂. Show that this is consistent with the rate equation.', marks: 3, ans: 'Step 2 (slow/RDS): rate = k₂[N₂O₂][O₂]. From step 1 equilibrium: K₁ = [N₂O₂]/[NO]², so [N₂O₂] = K₁[NO]². Substituting: rate = k₂K₁[NO]²[O₂] = k[NO]²[O₂] where k = k₂K₁. This matches the experimental rate equation.' },
    { q: '(d) Identify the intermediate in this mechanism.', marks: 1, ans: 'N₂O₂ is the intermediate — formed in step 1 and consumed in step 2.' },
    { q: '(e) What would happen to the rate if the concentration of NO were halved?', marks: 1, ans: 'Rate would decrease by a factor of (½)² = ¼. The rate would become one quarter of its original value.' },
  ]},
  { title: 'Boltzmann and catalysts', marks: 7, q: 'Consider the reaction between zinc and hydrochloric acid.', parts: [
    { q: '(a) Sketch a Boltzmann distribution curve at temperature T. Label the axes, the peak, and mark the activation energy Ea.', marks: 2, ans: 'x-axis: kinetic energy. y-axis: number of molecules. Curve starts at origin, rises to a peak (most probable energy), then tails off to the right. Ea is marked as a vertical line to the right of the peak. The shaded area to the right of Ea represents molecules with enough energy to react.' },
    { q: '(b) On the same diagram, sketch the curve at a higher temperature T₂. Describe the key differences.', marks: 2, ans: 'The T₂ curve has a LOWER peak (fewer molecules at the most probable energy) and is shifted to the RIGHT (more molecules at higher energies). The area under both curves is the same (same total number of molecules). The area to the right of Ea is LARGER for T₂ — more molecules have sufficient energy to react.' },
    { q: '(c) Explain, using the Boltzmann distribution, how a catalyst increases the rate without changing the temperature.', marks: 3, ans: 'A catalyst provides an alternative reaction pathway with a LOWER activation energy Ea\'. On the Boltzmann distribution, moving the Ea line to the LEFT increases the proportion of molecules with energy ≥ Ea\'. More molecules can now undergo successful collisions, so the rate increases. The distribution itself does not change — only the position of the energy barrier.' },
  ]},
  { title: 'Heterogeneous catalysis', marks: 8, q: 'Iron is used as a catalyst in the Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g).', parts: [
    { q: '(a) State the type of catalysis and justify your answer.', marks: 2, ans: 'Heterogeneous catalysis. The catalyst (Fe) is a solid while the reactants (N₂ and H₂) are gases — they are in different phases.' },
    { q: '(b) Describe the mechanism of heterogeneous catalysis at the molecular level.', marks: 3, ans: '(1) N₂ and H₂ molecules ADSORB onto the iron surface. The bonds within the molecules (especially the strong N≡N triple bond) are WEAKENED by interaction with the metal surface. (2) The adsorbed atoms migrate across the surface and REACT to form N–H bonds, producing NH₃. (3) NH₃ molecules DESORB from the surface, freeing up active sites for more reactant molecules.' },
    { q: '(c) State the effect of the iron catalyst on (i) the rate of attainment of equilibrium and (ii) the position of equilibrium.', marks: 2, ans: '(i) The rate of attainment of equilibrium INCREASES — both forward and reverse reactions are sped up equally. (ii) The position of equilibrium is NOT affected — the yield of NH₃ at equilibrium is the same with or without the catalyst.' },
    { q: '(d) Explain what is meant by catalyst poisoning and give one example.', marks: 1, ans: 'Catalyst poisoning occurs when impurities adsorb onto the active sites of the catalyst, blocking them and reducing its effectiveness. Example: sulphur compounds in the feed gas can poison the iron catalyst in the Haber process.' },
  ]},
  { title: 'Graphical analysis', marks: 7, q: 'The decomposition of a compound A was monitored. The following data were obtained: t(s): 0, 100, 200, 300, 400, 500. [A](mol dm⁻³): 0.80, 0.40, 0.20, 0.10, 0.050, 0.025.', parts: [
    { q: '(a) Determine the order of the reaction with respect to A.', marks: 2, ans: 'Check half-lives: 0.80→0.40 in 100 s, 0.40→0.20 in 100 s, 0.20→0.10 in 100 s. Each half-life is constant at 100 s. Therefore the reaction is FIRST ORDER.' },
    { q: '(b) Calculate the rate constant k.', marks: 2, ans: 'k = 0.693 / t½ = 0.693 / 100 = 6.93 × 10⁻³ s⁻¹.' },
    { q: '(c) Calculate the initial rate of the reaction.', marks: 2, ans: 'For first order: rate = k[A]. At t = 0: rate = 6.93 × 10⁻³ × 0.80 = 5.54 × 10⁻³ mol dm⁻³ s⁻¹.' },
    { q: '(d) Predict [A] after 600 s.', marks: 1, ans: '600 s = 6 half-lives. [A] = 0.80 / 2⁶ = 0.80 / 64 = 0.0125 mol dm⁻³.' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Find order from data', diff: 'medium', q: 'Expt 1: [P]=0.10, [Q]=0.10, rate=5.0×10⁻⁴. Expt 2: [P]=0.10, [Q]=0.20, rate=5.0×10⁻⁴. Expt 3: [P]=0.30, [Q]=0.10, rate=4.5×10⁻³. Find orders and write the rate equation.', steps: [
    { label: 'STEP 1', text: 'Order in Q: expts 1→2, [Q] doubles, [P] constant. Rate unchanged (5.0×10⁻⁴ both times). Order in Q = 0.' },
    { label: 'STEP 2', text: 'Order in P: expts 1→3, [P] triples (0.10→0.30), [Q] constant. Rate ratio = 4.5×10⁻³/5.0×10⁻⁴ = 9. 3ᵐ = 9, m = 2.' },
    { label: 'STEP 3', text: 'Rate equation: rate = k[P]². Overall order = 2.' },
    { label: 'STEP 4', text: 'k = 5.0×10⁻⁴ / (0.10)² = 5.0×10⁻⁴ / 0.010 = 0.050 mol⁻¹ dm³ s⁻¹.' },
  ], ans: 'rate = k[P]², k = 0.050 mol⁻¹ dm³ s⁻¹. Q is zero order.' },

  { title: 'Half-life calculation', diff: 'easy', q: 'A first-order reaction has k = 2.50 × 10⁻³ s⁻¹. Find the half-life.', steps: [
    { label: 'STEP 1', text: 't½ = 0.693 / k = 0.693 / 2.50 × 10⁻³.' },
    { label: 'STEP 2', text: 't½ = 277 s (or 4.62 minutes).' },
  ], ans: 't½ = 277 s.' },

  { title: 'Using half-lives', diff: 'easy', q: 'A radioactive isotope has t½ = 8.0 days. Starting with 120 mg, how much remains after 32 days?', steps: [
    { label: 'STEP 1', text: 'Number of half-lives = 32 / 8.0 = 4.' },
    { label: 'STEP 2', text: 'Amount remaining = 120 / 2⁴ = 120 / 16 = 7.5 mg.' },
  ], ans: '7.5 mg remains after 32 days.' },

  { title: 'Calculate k from initial rates', diff: 'medium', q: 'For rate = k[A]²[B], experiment gives rate = 1.2 × 10⁻² mol dm⁻³ s⁻¹ when [A] = 0.20 and [B] = 0.30. Find k.', steps: [
    { label: 'STEP 1', text: '1.2 × 10⁻² = k × (0.20)² × (0.30).' },
    { label: 'STEP 2', text: '1.2 × 10⁻² = k × 0.040 × 0.30 = k × 0.012.' },
    { label: 'STEP 3', text: 'k = 1.2 × 10⁻² / 0.012 = 1.0 mol⁻² dm⁶ s⁻¹.' },
  ], ans: 'k = 1.0 mol⁻² dm⁶ s⁻¹.' },

  { title: 'Mechanism and rate equation', diff: 'hard', q: 'The rate equation for 2A + B → C is rate = k[A][B]. Propose a two-step mechanism.', steps: [
    { label: 'STEP 1', text: 'The RDS must involve 1 molecule of A and 1 molecule of B (matching the rate equation).' },
    { label: 'STEP 2', text: 'Step 1 (slow): A + B → X (intermediate). This gives rate = k₁[A][B].' },
    { label: 'STEP 3', text: 'Step 2 (fast): X + A → C. This uses the second A.' },
    { label: 'STEP 4', text: 'Overall: A + B + A → C, i.e. 2A + B → C. ✓ Matches the overall equation.' },
  ], ans: 'Step 1 (slow): A + B → X. Step 2 (fast): X + A → C. X is the intermediate.' },

  { title: 'Effect of changes on rate', diff: 'medium', q: 'rate = k[X]²[Y]. The initial rate is 4.0 × 10⁻³ mol dm⁻³ s⁻¹. What is the rate if [X] is halved and [Y] is tripled?', steps: [
    { label: 'STEP 1', text: 'Factor for [X]: (½)² = ¼.' },
    { label: 'STEP 2', text: 'Factor for [Y]: (3)¹ = 3.' },
    { label: 'STEP 3', text: 'Combined factor: ¼ × 3 = ¾.' },
    { label: 'STEP 4', text: 'New rate = 4.0 × 10⁻³ × 0.75 = 3.0 × 10⁻³ mol dm⁻³ s⁻¹.' },
  ], ans: 'New rate = 3.0 × 10⁻³ mol dm⁻³ s⁻¹.' },

  { title: 'Order from concentration-time data', diff: 'medium', q: '[A] halves from 0.40 to 0.20 in 50 s, and from 0.20 to 0.10 in 50 s. Determine the order and calculate k.', steps: [
    { label: 'STEP 1', text: 'Both half-lives are 50 s. Constant half-life → first order.' },
    { label: 'STEP 2', text: 'k = 0.693 / 50 = 0.0139 s⁻¹.' },
  ], ans: 'First order, k = 0.0139 s⁻¹.' },

  { title: 'Fe²⁺ catalysis explanation', diff: 'hard', q: 'Explain how Fe²⁺ catalyses the reaction S₂O₈²⁻ + 2I⁻ → 2SO₄²⁻ + I₂.', steps: [
    { label: 'STEP 1', text: 'Without catalyst: the direct reaction requires two negative ions (S₂O₈²⁻ and I⁻) to collide. They repel each other → high Ea.' },
    { label: 'STEP 2', text: 'Step 1 of catalysed mechanism: S₂O₈²⁻ + 2Fe²⁺ → 2SO₄²⁻ + 2Fe³⁺. The negative S₂O₈²⁻ collides with positive Fe²⁺ → lower Ea.' },
    { label: 'STEP 3', text: 'Step 2: 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂. Again, positive Fe³⁺ attracts negative I⁻ → lower Ea.' },
    { label: 'STEP 4', text: 'Fe²⁺ is regenerated, confirming it is a catalyst. Each step involves opposite-charge ions colliding, lowering the overall Ea.' },
  ], ans: 'Fe²⁺ acts as an electron-transfer catalyst. It provides a two-step pathway where each step involves attraction (not repulsion) between reactant ions, lowering Ea. Fe²⁺ is regenerated.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const KINETICS = {
  id: 'kinetics',
  objectives: [
    'Describe methods of measuring reaction rate (gas collection, mass loss, colorimetry, titration, clock)',
    'Define rate of reaction, order, rate constant, half-life, activation energy, rate-determining step',
    'Construct rate equations of the form rate = k[A]ᵐ[B]ⁿ for m, n = 0, 1, or 2',
    'Determine order using the initial rate method and concentration-time graphs',
    'Show graphically that first-order half-life is constant; calculate k from t½',
    'Explain effects of concentration, temperature and catalysts using collision theory and Boltzmann distributions',
    'Explain that a catalyst provides a different mechanism with lower activation energy',
    'Deduce reaction mechanisms from rate equations and identify rate-determining steps',
    'Describe homogeneous catalysis (Fe²⁺ in I⁻/S₂O₈²⁻, NOₓ in SO₂ oxidation) and heterogeneous catalysis (Fe in Haber, Pt in catalytic converters)',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through finding orders from a data table step by step',
    'Explain the Boltzmann distribution and what happens when temperature changes',
    'Give me a challenging mechanism question where I have to use the rate equation',
    'Why does Fe²⁺ make the I⁻/S₂O₈²⁻ reaction faster?',
    'How do I tell the difference between first and second order from a graph?',
  ],
};
