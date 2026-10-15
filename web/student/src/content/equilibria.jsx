// Equilibria — PC-07 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.1 — Topic 7
// Syllabus coverage:
//   Form 5: Chemical equilibria, Kc, Kp, Le Chatelier, Bronsted-Lowry,
//           pH, pOH, Ka, pKa, Kb, pKb, Kw, pKw, indicators, titration curves
//   Form 6: Buffer solutions, solubility products (Ksp), common ion effect

/* ============================================================
   Diagram specs (Phase K3.4 migration)
   Unused legacy JSX removed in K-Cleanup; active specs are unchanged.
   ============================================================ */
const equilibriaDynamicSpec = {
  "title": "DYNAMIC EQUILIBRIUM",
  "blocks": [
    {
      "type": "raw",
      "height": 120,
      "primitives": [
        {
          "p": "line",
          "x1": 40,
          "y1": 95,
          "x2": 290,
          "y2": 95,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 20,
          "x2": 40,
          "y2": 95,
          "color": "dim",
          "width": 1
        },
        {
          "p": "path",
          "d": "M45 28 C85 45 115 58 150 64 C190 70 230 70 285 70",
          "color": "primary",
          "width": 2
        },
        {
          "p": "path",
          "d": "M45 92 C85 82 115 74 150 70 C190 70 230 70 285 70",
          "color": "accent",
          "width": 2
        },
        {
          "p": "text",
          "x": 85,
          "y": 42,
          "text": "forward rate",
          "color": "primary",
          "size": 8
        },
        {
          "p": "text",
          "x": 92,
          "y": 88,
          "text": "reverse rate",
          "color": "accent",
          "size": 8
        },
        {
          "p": "text",
          "x": 245,
          "y": 62,
          "text": "equal rates",
          "color": "text",
          "size": 8,
          "bold": true
        }
      ]
    },
    {
      "type": "note",
      "text": "At equilibrium: forward rate = reverse rate; both continue.",
      "emphasis": true
    }
  ]
};

const equilibriaKcExpressionSpec = {
  "title": "EQUILIBRIUM CONSTANT Kc",
  "blocks": [
    {
      "type": "equation",
      "text": "aA + bB ⇌ cC + dD"
    },
    {
      "type": "equation",
      "text": "Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ",
      "big": true
    },
    {
      "type": "panel",
      "title": "Rules",
      "color": "primary",
      "body": [
        "use equilibrium concentrations in mol dm⁻³",
        "products over reactants; powers are stoichiometric coefficients",
        "omit pure solids and pure liquids",
        "Kc changes only when temperature changes"
      ]
    }
  ]
};

const equilibriaKpExpressionSpec = {
  "title": "EQUILIBRIUM CONSTANT Kp",
  "blocks": [
    {
      "type": "equation",
      "text": "aA(g) + bB(g) ⇌ cC(g) + dD(g)"
    },
    {
      "type": "equation",
      "text": "Kp = (pC)ᶜ(pD)ᵈ / (pA)ᵃ(pB)ᵇ",
      "big": true
    },
    {
      "type": "panel",
      "title": "Partial pressure",
      "color": "cyan",
      "body": [
        "pX = mole fraction of X × total pressure",
        "mole fraction = moles X / total gas moles",
        "units of Kp depend on Δn; if Δn = 0 it is dimensionless"
      ]
    }
  ]
};

const equilibriaLeChatelierSpec = {
  "title": "LE CHATELIER'S PRINCIPLE",
  "subtitle": "the equilibrium position shifts to oppose an imposed change",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "change",
        "response"
      ],
      "colWidths": [
        115,
        175
      ],
      "rowH": 21,
      "rows": [
        [
          "↑ concentration A",
          "away from A · uses it up"
        ],
        [
          "↓ concentration A",
          "towards A · replaces it"
        ],
        [
          "↑ pressure",
          "side with fewer gas moles"
        ],
        [
          "↓ pressure",
          "side with more gas moles"
        ],
        [
          "↑T · forward exothermic",
          "shifts to reverse / endothermic"
        ],
        [
          "↑T · forward endothermic",
          "shifts to forward / endothermic"
        ],
        [
          "add catalyst",
          "no shift · both rates increase"
        ]
      ]
    },
    {
      "type": "note",
      "text": "Catalyst speeds equilibrium; it does not change position or K.",
      "emphasis": true
    }
  ]
};

const equilibriaPHScaleSpec = {
  "title": "THE pH SCALE",
  "blocks": [
    {
      "type": "scaleBar",
      "ticks": [
        {
          "x": 0,
          "label": "0",
          "sublabel": "acidic"
        },
        {
          "x": 0.5,
          "label": "7",
          "sublabel": "neutral"
        },
        {
          "x": 1,
          "label": "14",
          "sublabel": "basic"
        }
      ],
      "highlight": {
        "from": 0,
        "to": 0.5,
        "label": "[H⁺] decreases as pH rises",
        "color": "primary"
      }
    },
    {
      "type": "equation",
      "text": "pH = −log₁₀[H⁺]     ·     [H⁺] = 10⁻ᵖᴴ"
    },
    {
      "type": "equation",
      "text": "at 298 K: pH + pOH = 14     ·     pOH = −log₁₀[OH⁻]"
    }
  ]
};

const equilibriaTitrationCurvesSpec = {
  "title": "ACID–BASE TITRATION CURVES · BASE ADDED",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "system",
        "equivalence region",
        "key feature"
      ],
      "colWidths": [
        75,
        95,
        120
      ],
      "rowH": 24,
      "rows": [
        [
          "SA + SB",
          "pH ≈ 7",
          "very sharp vertical jump"
        ],
        [
          "WA + SB",
          "pH > 7",
          "buffer region before endpoint"
        ],
        [
          "SA + WB",
          "pH < 7",
          "smaller vertical jump"
        ],
        [
          "WA + WB",
          "depends on Ka/Kb",
          "no sharp jump"
        ]
      ]
    },
    {
      "type": "note",
      "text": "Indicator range must lie within the steep equivalence region.",
      "emphasis": true
    }
  ]
};

const equilibriaIndicatorSpec = {
  "title": "CHOOSING AN INDICATOR",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "indicator",
        "transition pH",
        "best use"
      ],
      "colWidths": [
        105,
        70,
        115
      ],
      "rowH": 24,
      "rows": [
        [
          "methyl orange",
          "3.1–4.4",
          "strong acid + weak base"
        ],
        [
          "bromothymol blue",
          "6.0–7.6",
          "strong acid + strong base"
        ],
        [
          "phenolphthalein",
          "8.3–10.0",
          "weak acid + strong base"
        ]
      ]
    },
    {
      "type": "note",
      "text": "Choose a transition range inside the steep curve region.",
      "emphasis": true
    }
  ]
};

const equilibriaBufferSpec = {
  "title": "HOW AN ACIDIC BUFFER WORKS",
  "subtitle": "weak acid HA + conjugate base A⁻",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "H⁺ ADDED",
        "color": "red",
        "body": [
          "A⁻ + H⁺ → HA",
          "conjugate base removes added H⁺",
          "pH changes only slightly"
        ]
      },
      "right": {
        "title": "OH⁻ ADDED",
        "color": "cyan",
        "body": [
          "HA + OH⁻ → A⁻ + H₂O",
          "weak acid removes added OH⁻",
          "pH changes only slightly"
        ]
      }
    },
    {
      "type": "equation",
      "text": "pH = pKa + log([A⁻]/[HA])",
      "big": true
    },
    {
      "type": "note",
      "text": "At [A⁻] = [HA], pH = pKa (half-equivalence point)."
    }
  ]
};

const equilibriaKspSpec = {
  "title": "SOLUBILITY PRODUCT Ksp",
  "blocks": [
    {
      "type": "equation",
      "text": "AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)"
    },
    {
      "type": "equation",
      "text": "Ksp = [Ag⁺][Cl⁻]",
      "big": true
    },
    {
      "type": "equation",
      "text": "For MₐXᵦ: Ksp = [Mⁿ⁺]ᵃ[Xᵐ⁻]ᵝ"
    },
    {
      "type": "cards",
      "cards": [
        {
          "title": "IP < Ksp",
          "color": "green",
          "body": [
            "unsaturated",
            "no precipitate"
          ]
        },
        {
          "title": "IP = Ksp",
          "color": "amber",
          "body": [
            "saturated",
            "at equilibrium"
          ]
        },
        {
          "title": "IP > Ksp",
          "color": "red",
          "body": [
            "supersaturated",
            "precipitate forms"
          ]
        }
      ]
    },
    {
      "type": "note",
      "text": "Ksp applies to sparingly soluble salts at a fixed temperature."
    }
  ]
};

const equilibriaCommonIonSpec = {
  "title": "COMMON ION EFFECT · AgCl",
  "blocks": [
    {
      "type": "equation",
      "text": "AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)"
    },
    {
      "type": "steps",
      "items": [
        {
          "number": "1",
          "color": "primary",
          "body": "in pure water, some AgCl dissolves"
        },
        {
          "number": "2",
          "color": "red",
          "body": "add NaCl(aq) → [Cl⁻] increases"
        },
        {
          "number": "3",
          "color": "amber",
          "body": "equilibrium shifts left to consume added Cl⁻"
        },
        {
          "number": "4",
          "color": "green",
          "body": "AgCl solubility decreases"
        }
      ]
    },
    {
      "type": "note",
      "text": "At fixed temperature Ksp stays constant as ion levels adjust.",
      "emphasis": true
    }
  ]
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  // CH.1 — Reversible reactions and dynamic equilibrium
  { id: 'eq1', title: 'Reversible Reactions & Dynamic Equilibrium', minutes: 8, blocks: [
    { type: 'p', text: 'Many reactions do not go to completion. Instead, the forward reaction produces products while the reverse reaction simultaneously converts products back to reactants. When these two rates become EQUAL, the system reaches DYNAMIC EQUILIBRIUM: the concentrations of all species stop changing, even though both reactions continue.' },
    { type: 'd', spec: equilibriaDynamicSpec, caption: 'Rate vs time: equilibrium is reached when forward rate = reverse rate' },
    { type: 'h', text: 'Characteristics of dynamic equilibrium' },
    { type: 'ul', items: [
      'The reaction has NOT stopped — both forward and reverse reactions continue at equal rates.',
      'Macroscopic properties (concentrations, colour, pressure) remain CONSTANT.',
      'It can only be established in a CLOSED SYSTEM (nothing enters or leaves).',
      'The position of equilibrium may favour products or reactants — the equilibrium constant tells you which.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Dynamic equilibrium', body: 'A state in which the rate of the forward reaction equals the rate of the reverse reaction, so that the concentrations of reactants and products remain constant. The system must be closed.' },
    { type: 'h', text: 'Open vs closed systems' },
    { type: 'p', text: 'An open system allows matter to enter or leave (e.g. an open beaker where gas escapes). Equilibrium cannot be established because products are continually removed. A closed system (sealed container) keeps everything in, allowing equilibrium to develop.' },
    { type: 'takeaway', items: [
      'Dynamic equilibrium: rate forward = rate reverse in a closed system.',
      'Concentrations stay constant but reactions continue.',
      'Position can favour products or reactants.',
    ]},
  ]},

  // CH.2 — Kc
  { id: 'eq2', title: 'The Equilibrium Constant Kc', minutes: 10, blocks: [
    { type: 'p', text: 'For the general equilibrium aA + bB ⇌ cC + dD, the equilibrium constant in terms of concentrations is Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ, where each concentration is the value AT EQUILIBRIUM.' },
    { type: 'd', spec: equilibriaKcExpressionSpec, caption: 'The Kc expression' },
    { type: 'h', text: 'Key rules' },
    { type: 'ul', items: [
      'Products on top, reactants on bottom — always.',
      'Each concentration is raised to the power of its stoichiometric coefficient.',
      'PURE SOLIDS and PURE LIQUIDS are omitted (their activity = 1). Water is omitted when it is the solvent.',
      'Kc has units that depend on the overall change in moles. Work them out from the expression.',
      'Kc changes ONLY when TEMPERATURE changes. Changing concentration, pressure or adding a catalyst does NOT change Kc.',
    ]},
    { type: 'h', text: 'What Kc tells you' },
    { type: 'ul', items: [
      'Kc >> 1: equilibrium lies far to the RIGHT (products dominate).',
      'Kc << 1: equilibrium lies far to the LEFT (reactants dominate).',
      'Kc ≈ 1: significant amounts of both present.',
    ]},
    { type: 'h', text: 'Calculating Kc — the ICE table method' },
    { type: 'p', text: 'Set up a table with rows for Initial concentration, Change, and Equilibrium concentration. Use stoichiometry to express the changes in terms of a single variable x. Substitute the equilibrium values into the Kc expression and solve.' },
    { type: 'callout', kind: 'key', title: 'Units of Kc', body: 'If Δn = (c + d) − (a + b) = 0, Kc has no units. If Δn = 1, units are mol dm⁻³. If Δn = −1, units are mol⁻¹ dm³. Always work out units explicitly from the expression.' },
    { type: 'takeaway', items: [
      'Kc = products over reactants, each raised to its coefficient.',
      'Omit pure solids and liquids.',
      'Kc changes only with temperature.',
      'Large Kc = products favoured; small Kc = reactants favoured.',
    ]},
  ]},

  // CH.3 — Kp
  { id: 'eq3', title: 'The Equilibrium Constant Kp', minutes: 10, blocks: [
    { type: 'p', text: 'For equilibria involving gases, we often express the equilibrium constant in terms of PARTIAL PRESSURES rather than concentrations. This is Kp.' },
    { type: 'd', spec: equilibriaKpExpressionSpec, caption: 'The Kp expression' },
    { type: 'h', text: 'Partial pressures' },
    { type: 'ul', items: [
      'The partial pressure of gas X = (mole fraction of X) × (total pressure).',
      'Mole fraction of X = moles of X / total moles of gas at equilibrium.',
      'The sum of all partial pressures = total pressure (Dalton\'s Law).',
    ]},
    { type: 'h', text: 'Calculating Kp — example' },
    { type: 'p', text: 'Consider: N₂(g) + 3H₂(g) ⇌ 2NH₃(g). At equilibrium in a sealed vessel at 500 K and 200 atm, the mole fractions are: N₂ = 0.20, H₂ = 0.60, NH₃ = 0.20.' },
    { type: 'ul', items: [
      'Partial pressures: pN₂ = 0.20 × 200 = 40 atm, pH₂ = 0.60 × 200 = 120 atm, pNH₃ = 0.20 × 200 = 40 atm.',
      'Kp = (pNH₃)² / [(pN₂)(pH₂)³] = (40)² / [(40)(120)³] = 1600 / (40 × 1 728 000) = 1600 / 69 120 000 = 2.31 × 10⁻⁵ atm⁻².',
      'Δn = 2 − (1 + 3) = −2, so units are atm⁻² (or Pa⁻² if using pascals).',
    ]},
    { type: 'callout', kind: 'warning', title: 'Kp vs Kc', body: 'Kp uses partial pressures (gases only). Kc uses molar concentrations. They are related by Kp = Kc(RT)^Δn but you rarely need to convert between them at ZIMSEC level — just use whichever the question specifies.' },
    { type: 'takeaway', items: [
      'Kp applies to gaseous equilibria using partial pressures.',
      'pX = mole fraction × total pressure.',
      'Units of Kp depend on Δn.',
      'Kp changes only with temperature.',
    ]},
  ]},

  // CH.4 — Le Chatelier's principle
  { id: 'eq4', title: 'Le Chatelier\'s Principle', minutes: 9, blocks: [
    { type: 'p', text: 'Le Chatelier\'s Principle states: when a system at equilibrium is subjected to a change in concentration, temperature or pressure, the equilibrium shifts in the direction that tends to OPPOSE the change.' },
    { type: 'd', spec: equilibriaLeChatelierSpec, caption: 'Summary of Le Chatelier\'s responses' },
    { type: 'h', text: 'Concentration changes' },
    { type: 'ul', items: [
      'Adding more of a reactant: equilibrium shifts RIGHT to use it up. More product is formed.',
      'Removing a product (e.g. condensing it out): equilibrium shifts RIGHT to replace it.',
      'These changes alter the POSITION of equilibrium but NOT the value of Kc (temperature unchanged).',
    ]},
    { type: 'h', text: 'Pressure changes (gaseous systems only)' },
    { type: 'ul', items: [
      'Increasing pressure: equilibrium shifts towards the side with FEWER moles of gas.',
      'Decreasing pressure: shifts towards the side with MORE moles of gas.',
      'If both sides have the same number of gas moles (e.g. H₂ + I₂ ⇌ 2HI), pressure changes have NO effect on position.',
      'Adding an INERT GAS at constant volume does NOT change partial pressures of reactants or products, so NO shift.',
    ]},
    { type: 'h', text: 'Temperature changes' },
    { type: 'ul', items: [
      'Increasing temperature favours the ENDOTHERMIC direction (the system absorbs the extra heat).',
      'For an exothermic forward reaction: ↑T shifts equilibrium LEFT (Kc decreases).',
      'For an endothermic forward reaction: ↑T shifts equilibrium RIGHT (Kc increases).',
      'Temperature is the ONLY factor that changes the VALUE of K.',
    ]},
    { type: 'h', text: 'Catalysts' },
    { type: 'p', text: 'A catalyst speeds up both the forward AND reverse reactions equally. It does NOT change the position of equilibrium or the value of K. It only makes equilibrium reached FASTER.' },
    { type: 'takeaway', items: [
      'System opposes the imposed change.',
      'Concentration/pressure changes shift position but NOT K.',
      'Temperature changes shift position AND change K.',
      'Catalyst: faster equilibrium, no shift, no K change.',
    ]},
  ]},

  // CH.5 — Bronsted-Lowry theory
  { id: 'eq5', title: 'Brønsted-Lowry Acids & Bases', minutes: 9, blocks: [
    { type: 'p', text: 'The Brønsted-Lowry definition is broader than the Arrhenius one. A Brønsted-Lowry ACID is a proton (H⁺) DONOR. A Brønsted-Lowry BASE is a proton ACCEPTOR. Every acid-base reaction involves the transfer of a proton from the acid to the base.' },
    { type: 'h', text: 'Conjugate acid-base pairs' },
    { type: 'ul', items: [
      'When an acid HA donates a proton, it forms its conjugate base A⁻: HA → H⁺ + A⁻.',
      'When a base B accepts a proton, it forms its conjugate acid BH⁺: B + H⁺ → BH⁺.',
      'Every acid-base reaction has TWO conjugate pairs. For HCl + NH₃ → NH₄⁺ + Cl⁻: pair 1 is HCl/Cl⁻, pair 2 is NH₄⁺/NH₃.',
      'Water is AMPHOTERIC — it can act as both acid (donating H⁺ to form OH⁻) and base (accepting H⁺ to form H₃O⁺).',
    ]},
    { type: 'h', text: 'Strong vs weak acids and bases' },
    { type: 'ul', items: [
      'A STRONG acid is completely dissociated in aqueous solution: HCl(aq) → H⁺(aq) + Cl⁻(aq) (100%). Examples: HCl, HNO₃, H₂SO₄.',
      'A WEAK acid is partially dissociated: CH₃COOH(aq) ⇌ H⁺(aq) + CH₃COO⁻(aq) (equilibrium, typically < 5% dissociated). Example: ethanoic acid.',
      'A STRONG base is completely dissociated: NaOH(aq) → Na⁺(aq) + OH⁻(aq).',
      'A WEAK base is partially protonated: NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq).',
      'Strong ≠ concentrated. Concentrated refers to amount per volume; strong refers to degree of dissociation.',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam favourite', body: '"Strong" means fully dissociated (all molecules donate/accept H⁺). "Weak" means only partially dissociated (equilibrium lies to the left). "Concentrated" means high molarity. A DILUTE STRONG acid (e.g. 0.001 mol dm⁻³ HCl) is still 100% dissociated.' },
    { type: 'takeaway', items: [
      'Acid = H⁺ donor; Base = H⁺ acceptor (Brønsted-Lowry).',
      'Conjugate pairs differ by one H⁺.',
      'Strong = fully dissociated; Weak = partially dissociated.',
      'Strong ≠ concentrated.',
    ]},
  ]},

  // CH.6 — pH, pOH, Kw
  { id: 'eq6', title: 'pH, pOH and the Ionic Product of Water', minutes: 11, blocks: [
    { type: 'p', text: 'pH is a logarithmic scale that measures the concentration of hydrogen ions in solution. The lower the pH, the more acidic the solution.' },
    { type: 'd', spec: equilibriaPHScaleSpec, caption: 'The pH scale and key formulas' },
    { type: 'h', text: 'Key relationships' },
    { type: 'ul', items: [
      'pH = −log₁₀[H⁺]. So [H⁺] = 10⁻ᵖᴴ.',
      'pOH = −log₁₀[OH⁻]. So [OH⁻] = 10⁻ᵖᴼᴴ.',
      'The ionic product of water: Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴ mol² dm⁻⁶ at 298 K.',
      'pKw = pH + pOH = 14.0 at 298 K.',
    ]},
    { type: 'h', text: 'pH of strong acids' },
    { type: 'ul', items: [
      'Monobasic strong acid (e.g. HCl): [H⁺] = concentration of the acid. pH = −log[acid].',
      'Dibasic strong acid (e.g. H₂SO₄): [H⁺] = 2 × concentration. pH = −log(2 × [acid]).',
      'Example: 0.010 mol dm⁻³ HCl → [H⁺] = 0.010 → pH = −log(0.010) = 2.0.',
    ]},
    { type: 'h', text: 'pH of strong bases' },
    { type: 'ul', items: [
      'Strong base (e.g. NaOH): [OH⁻] = concentration. Find [H⁺] = Kw/[OH⁻], then pH = −log[H⁺].',
      'Or find pOH first, then pH = 14 − pOH.',
      'Example: 0.010 mol dm⁻³ NaOH → [OH⁻] = 0.010 → pOH = 2.0 → pH = 12.0.',
    ]},
    { type: 'callout', kind: 'key', title: 'Temperature dependence of Kw', body: 'Kw increases with temperature because the dissociation of water is endothermic. At higher temperatures, [H⁺] and [OH⁻] are both larger, so pH of pure water falls below 7. But the water is still neutral because [H⁺] = [OH⁻].' },
    { type: 'takeaway', items: [
      'pH = −log[H⁺]; pOH = −log[OH⁻]; pH + pOH = 14 at 298 K.',
      'Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 298 K.',
      'Strong acid: [H⁺] = acid concentration directly.',
      'Strong base: find [OH⁻] first, then [H⁺] = Kw/[OH⁻].',
    ]},
  ]},

  // CH.7 — Ka, pKa, Kb, pKb
  { id: 'eq7', title: 'Ka, pKa, Kb, pKb — Weak Acid & Base Calculations', minutes: 12, blocks: [
    { type: 'p', text: 'Weak acids and bases establish an equilibrium in solution. The extent of their dissociation is quantified by the acid dissociation constant Ka (for acids) or the base dissociation constant Kb (for bases).' },
    { type: 'h', text: 'Ka — acid dissociation constant' },
    { type: 'ul', items: [
      'For a weak acid HA ⇌ H⁺ + A⁻: Ka = [H⁺][A⁻] / [HA].',
      'pKa = −log₁₀Ka. A smaller pKa means a STRONGER weak acid (more dissociated).',
      'Assumption for calculations: since dissociation is small, [HA]_equilibrium ≈ [HA]_initial. This simplifies the algebra.',
      'From Ka and [HA]: [H⁺] = √(Ka × [HA]). Then pH = −log[H⁺].',
    ]},
    { type: 'h', text: 'Example: pH of 0.100 mol dm⁻³ CH₃COOH (Ka = 1.74 × 10⁻⁵)' },
    { type: 'ul', items: [
      '[H⁺] = √(1.74 × 10⁻⁵ × 0.100) = √(1.74 × 10⁻⁶) = 1.32 × 10⁻³ mol dm⁻³.',
      'pH = −log(1.32 × 10⁻³) = 2.88.',
      'Check assumption: % dissociation = (1.32 × 10⁻³ / 0.100) × 100 = 1.3%. This is < 5%, so the approximation is valid.',
    ]},
    { type: 'h', text: 'Kb — base dissociation constant' },
    { type: 'ul', items: [
      'For a weak base B + H₂O ⇌ BH⁺ + OH⁻: Kb = [BH⁺][OH⁻] / [B].',
      'pKb = −log₁₀Kb. Smaller pKb = stronger weak base.',
      '[OH⁻] = √(Kb × [B]). Then pOH = −log[OH⁻], and pH = 14 − pOH.',
    ]},
    { type: 'h', text: 'Relationship between Ka, Kb and Kw' },
    { type: 'p', text: 'For a conjugate acid-base pair: Ka × Kb = Kw = 1.0 × 10⁻¹⁴ at 298 K. Equivalently: pKa + pKb = pKw = 14.0. This means a strong acid has a weak conjugate base, and vice versa.' },
    { type: 'callout', kind: 'key', title: 'The √(Ka·c) shortcut', body: 'For a weak acid of concentration c: [H⁺] ≈ √(Ka × c), provided c/Ka > 100 (so that the % dissociation is small enough for the approximation). If this condition fails, solve the quadratic exactly.' },
    { type: 'takeaway', items: [
      'Ka = [H⁺][A⁻]/[HA]; pKa = −logKa.',
      'Weak acid pH: [H⁺] ≈ √(Ka × c).',
      'Kb = [BH⁺][OH⁻]/[B]; pKb = −logKb.',
      'Ka × Kb = Kw; pKa + pKb = 14.',
    ]},
  ]},

  // CH.8 — Titration curves
  { id: 'eq8', title: 'Titration Curves', minutes: 10, blocks: [
    { type: 'p', text: 'A titration curve plots pH against volume of titrant added. The shape of the curve tells you the strengths of the acid and base involved, and it determines which indicator is suitable.' },
    { type: 'd', spec: equilibriaTitrationCurvesSpec, caption: 'The four types of acid-base titration curve' },
    { type: 'h', text: 'Reading the curves' },
    { type: 'ul', items: [
      'Strong acid + strong base: starts low (pH ≈ 1), very steep vertical jump at equivalence through pH 7, finishes high (pH ≈ 13). The equivalence point is at pH 7.',
      'Weak acid + strong base: starts higher (pH ≈ 3–4 for a typical weak acid), has a BUFFER REGION before the equivalence point, steep jump at equivalence above pH 7 (pH ≈ 8–10). Equivalence point is ABOVE 7 because the conjugate base A⁻ hydrolyses.',
      'Strong acid + weak base: starts low, steep jump at equivalence below pH 7 (pH ≈ 4–6). The conjugate acid BH⁺ is slightly acidic.',
      'Weak acid + weak base: very gradual change, no sharp vertical section. No suitable simple indicator exists — use a different method (e.g. conductimetric or potentiometric titration).',
    ]},
    { type: 'h', text: 'Half-equivalence point' },
    { type: 'p', text: 'At the half-equivalence point, exactly HALF the acid has been neutralised. At this point [HA] = [A⁻], so the Henderson-Hasselbalch equation gives pH = pKa. This is a quick way to read pKa from a titration curve — find the pH at half the equivalence volume.' },
    { type: 'callout', kind: 'key', title: 'Buffer region', body: 'On the weak acid + strong base curve, the relatively flat region BEFORE the equivalence point is a buffer region. Here, both HA and A⁻ are present in comparable amounts, and the pH resists change. The half-equivalence point is in the middle of this region, where pH = pKa.' },
    { type: 'takeaway', items: [
      'SA+SB: equivalence at pH 7; sharp jump; any indicator works.',
      'WA+SB: equivalence above pH 7; phenolphthalein.',
      'SA+WB: equivalence below pH 7; methyl orange.',
      'WA+WB: no sharp jump; no simple indicator.',
      'Half-equivalence: pH = pKa.',
    ]},
  ]},

  // CH.9 — Choice of indicators
  { id: 'eq9', title: 'Choice of Indicators', minutes: 7, blocks: [
    { type: 'p', text: 'An acid-base indicator is itself a weak acid (HIn) whose conjugate base (In⁻) has a DIFFERENT COLOUR. The indicator changes colour over a narrow pH range (about 2 pH units) centred on its pKin.' },
    { type: 'd', spec: equilibriaIndicatorSpec, caption: 'Indicator pH ranges' },
    { type: 'h', text: 'How indicators work' },
    { type: 'ul', items: [
      'HIn(aq) ⇌ H⁺(aq) + In⁻(aq). HIn has colour A; In⁻ has colour B.',
      'In acid (excess H⁺), equilibrium lies LEFT → mostly HIn → colour A dominates.',
      'In base (low H⁺), equilibrium lies RIGHT → mostly In⁻ → colour B dominates.',
      'The colour change occurs over a pH range of approximately pKin ± 1.',
    ]},
    { type: 'h', text: 'Matching indicator to titration' },
    { type: 'ul', items: [
      'The indicator\'s colour-change range must fall within the STEEP (vertical) part of the titration curve.',
      'Strong acid + strong base: the steep section spans pH ≈ 3–11. Almost any indicator works.',
      'Weak acid + strong base: steep section is pH ≈ 7–11. Use phenolphthalein (range 8.3–10.0).',
      'Strong acid + weak base: steep section is pH ≈ 3–7. Use methyl orange (range 3.1–4.4).',
      'Weak acid + weak base: no steep section → no simple indicator works.',
    ]},
    { type: 'takeaway', items: [
      'Indicator = weak acid with differently coloured conjugate base.',
      'Change occurs at pH ≈ pKin ± 1.',
      'Match the indicator\'s range to the steep part of the titration curve.',
    ]},
  ]},

  // CH.10 — Buffer solutions
  { id: 'eq10', title: 'Buffer Solutions', minutes: 11, blocks: [
    { type: 'p', text: 'A buffer solution resists changes in pH when small amounts of acid or base are added. It consists of a WEAK ACID and its CONJUGATE BASE (acidic buffer) or a WEAK BASE and its CONJUGATE ACID (basic buffer), both present in significant amounts.' },
    { type: 'd', spec: equilibriaBufferSpec, caption: 'How an acidic buffer resists pH change' },
    { type: 'h', text: 'Making an acidic buffer' },
    { type: 'ul', items: [
      'Mix a weak acid with a salt of its conjugate base. Example: CH₃COOH + CH₃COONa gives a buffer at pH ≈ 4.7.',
      'Alternatively, partially neutralise a weak acid with a strong base: some HA is converted to A⁻, leaving a mixture of both.',
      'The large reservoir of HA can neutralise added OH⁻. The large reservoir of A⁻ can neutralise added H⁺.',
    ]},
    { type: 'h', text: 'Calculating buffer pH' },
    { type: 'ul', items: [
      'Henderson-Hasselbalch equation: pH = pKa + log₁₀([A⁻]/[HA]).',
      'When [A⁻] = [HA], pH = pKa. This is the optimal buffer point (maximum buffering capacity).',
      'A buffer works effectively within about 1 pH unit either side of pKa.',
      'To use the equation: find the moles of HA and A⁻ present, then substitute.',
    ]},
    { type: 'h', text: 'Buffer in biological systems' },
    { type: 'ul', items: [
      'Blood is buffered at pH 7.4 by the carbonic acid / hydrogencarbonate system: H₂CO₃ / HCO₃⁻.',
      'Soil pH is buffered by various organic acid / conjugate base systems — critical for plant growth.',
      'Enzyme activity depends on pH; buffers maintain the narrow range where enzymes function optimally.',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam approach', body: 'Buffer pH calculation: (1) Find moles of HA and A⁻ after mixing. (2) Substitute into pH = pKa + log([A⁻]/[HA]). Note: because the ratio is moles divided by moles, volumes cancel — you can use moles directly.' },
    { type: 'takeaway', items: [
      'Buffer = weak acid + conjugate base (or weak base + conjugate acid).',
      'pH = pKa + log([A⁻]/[HA]).',
      'At [A⁻] = [HA], pH = pKa (maximum buffer capacity).',
      'Blood buffered at pH 7.4 by H₂CO₃/HCO₃⁻.',
    ]},
  ]},

  // CH.11 — Solubility product
  { id: 'eq11', title: 'Solubility Product Ksp', minutes: 10, blocks: [
    { type: 'p', text: 'For sparingly soluble salts, the equilibrium between the solid and its dissolved ions is described by the solubility product, Ksp. It applies only to salts that are SLIGHTLY soluble — not to highly soluble salts like NaCl.' },
    { type: 'd', spec: equilibriaKspSpec, caption: 'Ksp and the precipitation rule' },
    { type: 'h', text: 'Writing Ksp expressions' },
    { type: 'ul', items: [
      'AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq): Ksp = [Ag⁺][Cl⁻].',
      'PbI₂(s) ⇌ Pb²⁺(aq) + 2I⁻(aq): Ksp = [Pb²⁺][I⁻]².',
      'Ca₃(PO₄)₂(s) ⇌ 3Ca²⁺(aq) + 2PO₄³⁻(aq): Ksp = [Ca²⁺]³[PO₄³⁻]².',
      'The solid is omitted (activity = 1).',
    ]},
    { type: 'h', text: 'Calculating solubility from Ksp' },
    { type: 'ul', items: [
      'Let solubility = s mol dm⁻³. For AgCl: [Ag⁺] = s, [Cl⁻] = s. So Ksp = s², giving s = √Ksp.',
      'For PbI₂: [Pb²⁺] = s, [I⁻] = 2s. So Ksp = s × (2s)² = 4s³, giving s = ∛(Ksp/4).',
      'Always define s clearly and link each ion\'s concentration to s using the stoichiometry.',
    ]},
    { type: 'h', text: 'Predicting precipitation' },
    { type: 'ul', items: [
      'Calculate the ionic product (IP) by substituting the actual ion concentrations (not equilibrium).',
      'If IP > Ksp: solution is supersaturated → precipitation occurs until IP = Ksp.',
      'If IP < Ksp: unsaturated → no precipitate; more solid could dissolve.',
      'If IP = Ksp: saturated → system is at equilibrium.',
    ]},
    { type: 'takeaway', items: [
      'Ksp = product of ion concentrations raised to stoichiometric powers.',
      'Solubility s relates to Ksp via stoichiometry.',
      'IP > Ksp → precipitate forms; IP < Ksp → no precipitate.',
    ]},
  ]},

  // CH.12 — Common ion effect
  { id: 'eq12', title: 'The Common Ion Effect', minutes: 7, blocks: [
    { type: 'p', text: 'The common ion effect describes how the solubility of a sparingly soluble salt DECREASES when a common ion (one already present in the equilibrium) is added from an external source.' },
    { type: 'd', spec: equilibriaCommonIonSpec, caption: 'Common ion effect on AgCl solubility' },
    { type: 'h', text: 'How it works' },
    { type: 'ul', items: [
      'AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), Ksp = 1.8 × 10⁻¹⁰.',
      'In pure water: s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ mol dm⁻³.',
      'Now dissolve AgCl in 0.10 mol dm⁻³ NaCl. The NaCl provides a large concentration of Cl⁻.',
      'Ksp = [Ag⁺] × [Cl⁻] still = 1.8 × 10⁻¹⁰. But [Cl⁻] ≈ 0.10 (from NaCl, much larger than s).',
      'So [Ag⁺] = Ksp / [Cl⁻] = 1.8 × 10⁻¹⁰ / 0.10 = 1.8 × 10⁻⁹ mol dm⁻³.',
      'Solubility has dropped from 1.34 × 10⁻⁵ to 1.8 × 10⁻⁹ — roughly 7500× less soluble.',
    ]},
    { type: 'h', text: 'Application' },
    { type: 'ul', items: [
      'Common ion effect is used in qualitative analysis: adding HCl to precipitate AgCl from a solution of Ag⁺.',
      'Also used to suppress dissociation of weak acids: adding NaCH₃COO to CH₃COOH reduces [H⁺] (and this is how a buffer works — the common ion A⁻ suppresses dissociation of HA).',
    ]},
    { type: 'takeaway', items: [
      'Adding a common ion decreases solubility of a sparingly soluble salt.',
      'Ksp does NOT change — it is a constant at a given temperature.',
      'The equilibrium shifts left (Le Chatelier) to maintain Ksp.',
    ]},
  ]},

  // CH.13 — Calculations practice
  { id: 'eq13', title: 'Putting It All Together — Calculations', minutes: 9, blocks: [
    { type: 'p', text: 'Equilibria calculations at A-level fall into clear patterns. Here is a summary of the main types and the approach for each.' },
    { type: 'h', text: 'Type 1: Find Kc from equilibrium data' },
    { type: 'ul', items: [
      'You are given initial amounts and the equilibrium amount of one species.',
      'Use stoichiometry to find the equilibrium amounts of all species.',
      'Divide by volume to get concentrations (if needed).',
      'Substitute into the Kc expression.',
    ]},
    { type: 'h', text: 'Type 2: Find equilibrium amounts from Kc' },
    { type: 'ul', items: [
      'Set up an ICE table with x as the unknown change.',
      'Substitute equilibrium expressions into Kc = ... and solve for x.',
      'Often gives a quadratic equation; use the formula or trial-and-improvement.',
    ]},
    { type: 'h', text: 'Type 3: pH of weak acid/base' },
    { type: 'ul', items: [
      'Weak acid: [H⁺] = √(Ka × c). Then pH = −log[H⁺].',
      'Weak base: [OH⁻] = √(Kb × c). Then pOH = −log[OH⁻]; pH = 14 − pOH.',
      'Always check: % dissociation < 5% for the approximation to hold.',
    ]},
    { type: 'h', text: 'Type 4: Buffer pH' },
    { type: 'ul', items: [
      'Find moles of HA and A⁻ after any reaction.',
      'pH = pKa + log([A⁻]/[HA]). Volumes cancel so use moles directly.',
    ]},
    { type: 'h', text: 'Type 5: Ksp and solubility' },
    { type: 'ul', items: [
      'Define s, express each ion in terms of s, substitute into Ksp.',
      'With common ion: one ion concentration comes from the external source; s is only the contribution from the sparingly soluble salt.',
    ]},
    { type: 'takeaway', items: [
      'ICE tables for Kc; √(Ka·c) for weak acid pH; Henderson-Hasselbalch for buffers.',
      'Define variables clearly and show units.',
      'Always check approximations are valid.',
    ]},
  ]},

  // CH.14 — Exam technique
  { id: 'eq14', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Equilibria is one of the highest-weighted topics in the exam. Here are the common traps and how to avoid them.' },
    { type: 'h', text: 'Definition traps' },
    { type: 'ul', items: [
      'Strong ≠ concentrated. The question "distinguish between strong and concentrated" appears regularly — define both precisely.',
      'Dynamic equilibrium must state "rates are equal" AND "in a closed system". Both are required for the mark.',
      'Le Chatelier: say "the equilibrium shifts to ..." not "the reaction speeds up". Shifts describe position, not rate.',
    ]},
    { type: 'h', text: 'Calculation traps' },
    { type: 'ul', items: [
      'Units of Kc: always work them out. Examiners often give a value with units and ask you to verify the expression.',
      'Kp: remember to convert moles to mole fractions FIRST, then to partial pressures.',
      'pH: for strong bases, find pOH first. For weak acids, use Ka. Do NOT use Ka for strong acids.',
      'Buffer: after adding strong acid/base, recalculate moles of HA and A⁻ (some will have reacted). Then apply Henderson-Hasselbalch.',
    ]},
    { type: 'h', text: 'Le Chatelier traps' },
    { type: 'ul', items: [
      'Adding a catalyst does NOT shift equilibrium — this is one of the most common wrong answers.',
      'Adding inert gas at constant VOLUME does not shift equilibrium (partial pressures unchanged). At constant PRESSURE it would increase volume and decrease partial pressures.',
      'Temperature is the ONLY thing that changes K.',
    ]},
    { type: 'callout', kind: 'key', title: 'High-value exam tip', body: 'When explaining buffer action, always describe BOTH cases: what happens when H⁺ is added AND what happens when OH⁻ is added. The mark scheme almost always requires both.' },
    { type: 'takeaway', items: [
      'Strong ≠ concentrated. Dynamic = equal rates in closed system.',
      'Catalyst changes rate, NOT position or K.',
      'Buffer: show both H⁺ and OH⁻ scenarios.',
      'Always state units of Kc and Kp.',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 35 MCQs
   ============================================================ */
const quizzes = [
  { q: 'Dynamic equilibrium can only be established in:', opts: ['An open system', 'A closed system', 'An isolated system', 'Any system'], ans: 1, hint: 'If matter can escape, equilibrium cannot be maintained.' },
  { q: 'At equilibrium, which statement is true?', opts: ['All reactions have stopped', 'Forward rate equals reverse rate', 'Concentrations are zero', 'Only the forward reaction occurs'], ans: 1, hint: '"Dynamic" means both reactions continue.' },
  { q: 'In the Kc expression, pure solids are:', opts: ['Included with concentration 1', 'Omitted', 'Raised to the power 2', 'Included as their density'], ans: 1, hint: 'Activity of a pure solid = 1, so it drops out.' },
  { q: 'If Kc >> 1, the equilibrium:', opts: ['Lies to the left', 'Is at the starting point', 'Lies to the right', 'Cannot be determined'], ans: 2, hint: 'Products dominate when Kc is large.' },
  { q: 'Which factor changes the VALUE of Kc?', opts: ['Concentration', 'Pressure', 'Temperature', 'Catalyst'], ans: 2, hint: 'Only temperature changes K; everything else changes position only.' },
  { q: 'For N₂ + 3H₂ ⇌ 2NH₃ (exo), increasing temperature:', opts: ['Increases Kc', 'Decreases Kc', 'No effect on Kc', 'Increases the forward rate only'], ans: 1, hint: 'Exothermic forward: raising T favours the reverse, so Kc decreases.' },
  { q: 'For N₂ + 3H₂ ⇌ 2NH₃, increasing pressure:', opts: ['Shifts equilibrium left', 'Shifts equilibrium right', 'No effect', 'Changes Kc'], ans: 1, hint: '4 moles gas → 2 moles gas; higher pressure favours fewer moles (right).' },
  { q: 'A catalyst:', opts: ['Shifts equilibrium right', 'Shifts equilibrium left', 'Increases both rates equally', 'Changes the value of Kc'], ans: 2, hint: 'Catalyst speeds up both directions equally; no shift, no K change.' },
  { q: 'A Brønsted-Lowry acid is a:', opts: ['Proton acceptor', 'Proton donor', 'Electron donor', 'Electron acceptor'], ans: 1, hint: 'Acid = H⁺ donor in Brønsted-Lowry theory.' },
  { q: 'The conjugate base of H₂O is:', opts: ['H₃O⁺', 'OH⁻', 'H₂', 'O²⁻'], ans: 1, hint: 'Remove one H⁺ from H₂O → OH⁻.' },
  { q: 'A strong acid is one that is:', opts: ['Highly concentrated', 'Fully dissociated in water', 'Very corrosive', 'Always dangerous'], ans: 1, hint: 'Strong = complete dissociation, regardless of concentration.' },
  { q: 'pH of 0.001 mol dm⁻³ HCl is:', opts: ['1', '2', '3', '4'], ans: 2, hint: 'Strong acid: [H⁺] = 0.001 = 10⁻³, pH = 3.' },
  { q: 'pH of 0.10 mol dm⁻³ NaOH is:', opts: ['1', '11', '12', '13'], ans: 3, hint: 'pOH = −log(0.10) = 1; pH = 14 − 1 = 13.' },
  { q: 'Kw at 298 K equals:', opts: ['1.0 × 10⁻⁷', '1.0 × 10⁻¹⁴', '14', '7'], ans: 1, hint: 'Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 298 K.' },
  { q: 'If Ka of acid A is larger than Ka of acid B, then:', opts: ['A is weaker', 'A is stronger', 'Both are equally strong', 'A has a higher pKa'], ans: 1, hint: 'Larger Ka = more dissociated = stronger acid.' },
  { q: 'For a weak acid, [H⁺] is approximately:', opts: ['Equal to the acid concentration', '√(Ka × c)', 'Ka / c', 'c / Ka'], ans: 1, hint: 'The standard approximation for weak acid pH.' },
  { q: 'Ka × Kb for a conjugate pair equals:', opts: ['1', 'Kw', '14', '10⁻⁷'], ans: 1, hint: 'Ka × Kb = Kw = 1.0 × 10⁻¹⁴.' },
  { q: 'pKa + pKb equals:', opts: ['7', '14', '1', 'Kw'], ans: 1, hint: 'pKa + pKb = pKw = 14 at 298 K.' },
  { q: 'At the half-equivalence point of a weak acid titration:', opts: ['pH = 7', 'pH = pKa', 'pH = pKb', 'pH = 14'], ans: 1, hint: '[HA] = [A⁻], so pH = pKa + log(1) = pKa.' },
  { q: 'For strong acid + strong base, the equivalence point pH is:', opts: ['Above 7', 'Below 7', 'Exactly 7', 'Variable'], ans: 2, hint: 'Neither ion hydrolyses; only H₂O is formed, which is neutral.' },
  { q: 'For weak acid + strong base, the equivalence point pH is:', opts: ['Below 7', 'Exactly 7', 'Above 7', 'At pKa'], ans: 2, hint: 'The conjugate base A⁻ hydrolyses to produce OH⁻, making pH > 7.' },
  { q: 'Which indicator suits weak acid + strong base?', opts: ['Methyl orange', 'Phenolphthalein', 'Litmus', 'Universal indicator'], ans: 1, hint: 'Equivalence is above pH 7; phenolphthalein changes at 8.3–10.0.' },
  { q: 'A buffer solution contains:', opts: ['Strong acid + strong base', 'Weak acid + its conjugate base', 'Two strong acids', 'Pure water + salt'], ans: 1, hint: 'Buffer = weak acid + conjugate base (or weak base + conjugate acid).' },
  { q: 'In the Henderson-Hasselbalch equation, when [A⁻] = [HA]:', opts: ['pH = 0', 'pH = 7', 'pH = pKa', 'pH = 14'], ans: 2, hint: 'log(1) = 0, so pH = pKa + 0 = pKa.' },
  { q: 'Adding HCl to an acidic buffer (HA/A⁻) causes:', opts: ['A⁻ to react with the H⁺', 'HA to dissociate more', 'pH to drop dramatically', 'The buffer to become basic'], ans: 0, hint: 'The conjugate base A⁻ neutralises the added H⁺: A⁻ + H⁺ → HA.' },
  { q: 'Ksp applies to:', opts: ['Highly soluble salts', 'Sparingly soluble salts', 'All salts', 'Gases only'], ans: 1, hint: 'Ksp is meaningful only for slightly soluble salts.' },
  { q: 'For PbI₂(s) ⇌ Pb²⁺ + 2I⁻, Ksp =', opts: ['[Pb²⁺][I⁻]', '[Pb²⁺][I⁻]²', '[Pb²⁺]²[I⁻]', '[Pb²⁺]²[I⁻]²'], ans: 1, hint: 'Each ion raised to its stoichiometric coefficient: 1 for Pb²⁺, 2 for I⁻.' },
  { q: 'If solubility of AgCl = s, then Ksp =', opts: ['s', 's²', '2s²', '4s³'], ans: 1, hint: '[Ag⁺] = s, [Cl⁻] = s, Ksp = s × s = s².' },
  { q: 'Adding NaCl to a saturated AgCl solution will:', opts: ['Increase solubility of AgCl', 'Decrease solubility of AgCl', 'Have no effect', 'Change Ksp'], ans: 1, hint: 'Common ion (Cl⁻) shifts equilibrium left → less AgCl dissolves.' },
  { q: 'If IP > Ksp:', opts: ['No precipitate forms', 'The solution is unsaturated', 'A precipitate forms', 'More solid dissolves'], ans: 2, hint: 'Supersaturated → ions must come out of solution as precipitate.' },
  { q: 'Kp uses:', opts: ['Molar concentrations', 'Partial pressures', 'Mass fractions', 'Volume ratios'], ans: 1, hint: 'Kp is specifically for partial pressures of gaseous species.' },
  { q: 'Mole fraction of A = ?', opts: ['moles of A × total moles', 'moles of A / total moles', 'total moles / moles of A', 'moles of A − total moles'], ans: 1, hint: 'Mole fraction = part / whole.' },
  { q: 'If Kw increases with temperature, pure water at 50°C has pH:', opts: ['Equal to 7', 'Greater than 7', 'Less than 7', 'Equal to 14'], ans: 2, hint: 'Higher Kw means more H⁺ and OH⁻. pH < 7 but water is still neutral.' },
  { q: 'In the expression Kp = Kc(RT)^Δn, Δn is:', opts: ['Total moles of products', 'Total moles of reactants', 'Moles of gas products − moles of gas reactants', 'Total moles of gas'], ans: 2, hint: 'Δn = (gas moles products) − (gas moles reactants).' },
  { q: 'Which is NOT true about Le Chatelier\'s principle?', opts: ['Adding reactant shifts right', 'Catalyst shifts right', 'Increasing T for exo shifts left', 'Increasing P shifts to fewer gas moles'], ans: 1, hint: 'Catalyst does NOT shift position — it only speeds up equilibrium attainment.' },
];

/* ============================================================
   Structured questions — 7
   ============================================================ */
const structured = [
  { title: 'Kc calculation', marks: 8, q: '1.00 mol of ethanoic acid and 1.00 mol of ethanol are mixed in a sealed flask at 25 °C. At equilibrium, 0.67 mol of ester is present. Total volume = 500 cm³. CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O.', parts: [
    { q: '(a) Calculate the equilibrium moles of each species.', marks: 2, ans: 'Change = 0.67 mol (same for all, 1:1:1:1 stoichiometry). Acid: 1.00 − 0.67 = 0.33. Ethanol: 1.00 − 0.67 = 0.33. Ester: 0.67. Water: 0.67.' },
    { q: '(b) Calculate Kc.', marks: 3, ans: '[acid] = 0.33/0.500 = 0.66, [ethanol] = 0.66, [ester] = 0.67/0.500 = 1.34, [water] = 1.34. Kc = (1.34 × 1.34)/(0.66 × 0.66) = 1.796/0.436 = 4.12. Since Δn = 0, Kc has no units.' },
    { q: '(c) State the effect on Kc of adding more ethanol.', marks: 1, ans: 'No effect on Kc. Kc only changes with temperature. The position shifts right (more ester formed) but K remains 4.12.' },
    { q: '(d) State the effect on Kc if a catalyst is added.', marks: 1, ans: 'No effect on Kc. A catalyst speeds up the attainment of equilibrium but does not change its position or the value of K.' },
    { q: '(e) At a higher temperature, the equilibrium yield of ester decreases. Is the forward reaction exothermic or endothermic?', marks: 1, ans: 'Exothermic. Increasing temperature shifts the equilibrium away from ester (left), which is the endothermic direction. Therefore the forward reaction (ester formation) is exothermic.' },
  ]},
  { title: 'pH calculations', marks: 9, q: 'Calculate the pH of the following solutions at 298 K.', parts: [
    { q: '(a) 0.050 mol dm⁻³ HNO₃.', marks: 1, ans: 'HNO₃ is a strong acid: [H⁺] = 0.050. pH = −log(0.050) = 1.30.' },
    { q: '(b) 0.020 mol dm⁻³ Ba(OH)₂.', marks: 2, ans: 'Ba(OH)₂ gives 2OH⁻: [OH⁻] = 2 × 0.020 = 0.040 mol dm⁻³. pOH = −log(0.040) = 1.40. pH = 14.00 − 1.40 = 12.60.' },
    { q: '(c) 0.100 mol dm⁻³ CH₃COOH (Ka = 1.74 × 10⁻⁵).', marks: 3, ans: '[H⁺] = √(Ka × c) = √(1.74 × 10⁻⁵ × 0.100) = √(1.74 × 10⁻⁶) = 1.32 × 10⁻³. pH = −log(1.32 × 10⁻³) = 2.88. Check: % dissociation = 1.32% < 5%, so approximation valid.' },
    { q: '(d) A buffer made by mixing 50 cm³ of 0.200 mol dm⁻³ CH₃COOH with 50 cm³ of 0.100 mol dm⁻³ NaOH. (Ka = 1.74 × 10⁻⁵, pKa = 4.76.)', marks: 3, ans: 'Moles CH₃COOH = 0.050 × 0.200 = 0.0100. Moles NaOH = 0.050 × 0.100 = 0.0050. NaOH converts HA → A⁻: moles HA remaining = 0.0100 − 0.0050 = 0.0050. Moles A⁻ formed = 0.0050. pH = pKa + log(0.0050/0.0050) = 4.76 + log(1) = 4.76.' },
  ]},
  { title: 'Le Chatelier applied to Haber process', marks: 8, q: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ mol⁻¹.', parts: [
    { q: '(a) Predict the effect on the yield of NH₃ of increasing the temperature.', marks: 2, ans: 'Forward reaction is exothermic. Increasing temperature shifts equilibrium in the endothermic direction (LEFT). Yield of NH₃ DECREASES. Kc also decreases.' },
    { q: '(b) Predict the effect of increasing pressure.', marks: 2, ans: '4 moles of gas on the left, 2 on the right. Increasing pressure shifts equilibrium to the side with fewer gas moles (RIGHT). Yield of NH₃ INCREASES.' },
    { q: '(c) Explain why in industry a temperature of 450 °C is used despite (a).', marks: 2, ans: 'At lower temperatures, the yield of NH₃ would be higher, but the rate of reaction would be too slow for the process to be economically viable. 450 °C is a compromise: high enough for a reasonable rate (and to activate the iron catalyst) but not so high that yield drops drastically.' },
    { q: '(d) State the effect of adding an iron catalyst on (i) the rate and (ii) the value of Kc.', marks: 2, ans: '(i) The iron catalyst increases the rate of both forward and reverse reactions equally, so equilibrium is reached FASTER. (ii) Kc is NOT affected — a catalyst does not change the position of equilibrium or the value of K.' },
  ]},
  { title: 'Ksp and common ion', marks: 8, q: 'Ksp of PbCl₂ = 1.70 × 10⁻⁵ mol³ dm⁻⁹ at 298 K.', parts: [
    { q: '(a) Write the Ksp expression for PbCl₂.', marks: 1, ans: 'PbCl₂(s) ⇌ Pb²⁺(aq) + 2Cl⁻(aq). Ksp = [Pb²⁺][Cl⁻]².' },
    { q: '(b) Calculate the solubility of PbCl₂ in pure water.', marks: 3, ans: 'Let solubility = s. [Pb²⁺] = s, [Cl⁻] = 2s. Ksp = s(2s)² = 4s³. 4s³ = 1.70 × 10⁻⁵. s³ = 4.25 × 10⁻⁶. s = ∛(4.25 × 10⁻⁶) = 1.62 × 10⁻² mol dm⁻³.' },
    { q: '(c) Calculate the solubility of PbCl₂ in 0.10 mol dm⁻³ NaCl.', marks: 3, ans: 'Common ion: [Cl⁻] ≈ 0.10 (NaCl provides this, >> contribution from PbCl₂). Ksp = [Pb²⁺](0.10)² = 1.70 × 10⁻⁵. [Pb²⁺] = 1.70 × 10⁻⁵ / 0.010 = 1.70 × 10⁻³ mol dm⁻³. Solubility = 1.70 × 10⁻³ mol dm⁻³.' },
    { q: '(d) Explain why the solubility in (c) is less than in (b).', marks: 1, ans: 'The high [Cl⁻] from NaCl shifts the equilibrium LEFT (Le Chatelier — common ion effect), so less PbCl₂ dissolves. Ksp remains constant.' },
  ]},
  { title: 'Buffer action', marks: 8, q: 'A buffer is prepared by mixing 200 cm³ of 0.10 mol dm⁻³ CH₃COOH with 100 cm³ of 0.10 mol dm⁻³ CH₃COONa. Ka = 1.74 × 10⁻⁵; pKa = 4.76.', parts: [
    { q: '(a) Calculate the pH of the buffer.', marks: 2, ans: 'Moles HA = 0.200 × 0.10 = 0.020. Moles A⁻ = 0.100 × 0.10 = 0.010. pH = pKa + log(0.010/0.020) = 4.76 + log(0.5) = 4.76 − 0.30 = 4.46.' },
    { q: '(b) Explain, with equations, what happens when a small amount of HCl is added.', marks: 3, ans: 'HCl provides H⁺. The conjugate base CH₃COO⁻ reacts with it: CH₃COO⁻ + H⁺ → CH₃COOH. This converts some A⁻ to HA, consuming the added H⁺. The ratio [A⁻]/[HA] decreases slightly, so pH decreases slightly but does not change dramatically because the buffer resists the change.' },
    { q: '(c) Explain what happens when a small amount of NaOH is added.', marks: 3, ans: 'NaOH provides OH⁻. The weak acid CH₃COOH reacts with it: CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O. This converts some HA to A⁻, consuming the added OH⁻. The ratio [A⁻]/[HA] increases slightly, so pH increases slightly but the buffer resists a large change.' },
  ]},
  { title: 'Titration curve interpretation', marks: 7, q: 'A titration curve is obtained by adding 0.10 mol dm⁻³ NaOH to 25.0 cm³ of 0.10 mol dm⁻³ CH₃COOH.', parts: [
    { q: '(a) Sketch the titration curve, labelling the axes, initial pH, equivalence point pH, and half-equivalence point.', marks: 3, ans: 'x-axis: volume of NaOH (cm³). y-axis: pH. Initial pH ≈ 2.9 (weak acid). Gradual rise through a buffer region. Half-equivalence at 12.5 cm³ (pH = pKa ≈ 4.76). Steep rise at equivalence point (25.0 cm³), pH ≈ 8.7 (above 7 because conjugate base A⁻ hydrolyses). Then levels off at high pH.' },
    { q: '(b) Explain why the equivalence point is above pH 7.', marks: 2, ans: 'At equivalence, all CH₃COOH has been converted to CH₃COO⁻ (a weak base). CH₃COO⁻ hydrolyses: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻, producing OH⁻, making the solution slightly basic (pH > 7).' },
    { q: '(c) Name a suitable indicator and justify.', marks: 2, ans: 'Phenolphthalein (range 8.3–10.0). The steep part of the curve spans approximately pH 7–11, and phenolphthalein\'s range falls within this vertical section. Methyl orange (3.1–4.4) would change colour before the equivalence point and would give an inaccurate endpoint.' },
  ]},
  { title: 'Kp calculation', marks: 8, q: 'In the equilibrium 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), a mixture at equilibrium at 700 K and 1.00 atm total pressure contains 0.40 mol SO₂, 0.20 mol O₂ and 0.40 mol SO₃.', parts: [
    { q: '(a) Calculate the mole fraction of each gas.', marks: 2, ans: 'Total moles = 0.40 + 0.20 + 0.40 = 1.00. χ(SO₂) = 0.40/1.00 = 0.40. χ(O₂) = 0.20/1.00 = 0.20. χ(SO₃) = 0.40/1.00 = 0.40.' },
    { q: '(b) Calculate the partial pressure of each gas.', marks: 1, ans: 'p = χ × P_total. p(SO₂) = 0.40 × 1.00 = 0.40 atm. p(O₂) = 0.20 × 1.00 = 0.20 atm. p(SO₃) = 0.40 × 1.00 = 0.40 atm.' },
    { q: '(c) Calculate Kp and state its units.', marks: 3, ans: 'Kp = (pSO₃)² / [(pSO₂)²(pO₂)] = (0.40)² / [(0.40)²(0.20)] = 0.16 / (0.16 × 0.20) = 0.16 / 0.032 = 5.0. Δn = 2 − (2+1) = −1. Units: atm⁻¹.' },
    { q: '(d) If the pressure is increased at constant temperature, predict the effect on the equilibrium position and on Kp.', marks: 2, ans: 'Position shifts RIGHT (towards fewer gas moles: 3 on left, 2 on right). More SO₃ formed. Kp does NOT change (temperature unchanged).' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Kc from equilibrium data', diff: 'medium', q: '0.50 mol H₂ and 0.50 mol I₂ are placed in a 1.0 dm³ flask at 700 K. At equilibrium, [HI] = 0.78 mol dm⁻³. Find Kc. H₂ + I₂ ⇌ 2HI.', steps: [
    { label: 'STEP 1', text: 'Change: HI formed = 0.78 mol. By stoichiometry, H₂ used = I₂ used = 0.78/2 = 0.39 mol.' },
    { label: 'STEP 2', text: 'Equilibrium: [H₂] = 0.50 − 0.39 = 0.11, [I₂] = 0.50 − 0.39 = 0.11, [HI] = 0.78 (all mol dm⁻³ since V = 1.0 dm³).' },
    { label: 'STEP 3', text: 'Kc = [HI]²/([H₂][I₂]) = (0.78)²/(0.11 × 0.11) = 0.6084/0.0121 = 50.3.' },
    { label: 'STEP 4', text: 'Δn = 2 − 2 = 0, so Kc has no units.' },
  ], ans: 'Kc = 50.3 (dimensionless) at 700 K.' },

  { title: 'pH of a strong acid', diff: 'easy', q: 'Calculate the pH of 0.0050 mol dm⁻³ H₂SO₄ (assume full dissociation of both protons).', steps: [
    { label: 'STEP 1', text: 'H₂SO₄ is diprotic: each molecule releases 2H⁺.' },
    { label: 'STEP 2', text: '[H⁺] = 2 × 0.0050 = 0.010 mol dm⁻³.' },
    { label: 'STEP 3', text: 'pH = −log(0.010) = 2.00.' },
  ], ans: 'pH = 2.00.' },

  { title: 'pH of a weak acid', diff: 'medium', q: 'Find the pH of 0.200 mol dm⁻³ propanoic acid (Ka = 1.34 × 10⁻⁵).', steps: [
    { label: 'STEP 1', text: '[H⁺] = √(Ka × c) = √(1.34 × 10⁻⁵ × 0.200).' },
    { label: 'STEP 2', text: '= √(2.68 × 10⁻⁶) = 1.637 × 10⁻³ mol dm⁻³.' },
    { label: 'STEP 3', text: 'pH = −log(1.637 × 10⁻³) = 2.79.' },
    { label: 'STEP 4', text: 'Check: % diss = (1.637 × 10⁻³ / 0.200) × 100 = 0.82%. This is < 5%, so valid.' },
  ], ans: 'pH = 2.79.' },

  { title: 'Buffer pH', diff: 'medium', q: 'A buffer contains 0.15 mol CH₃COOH and 0.25 mol CH₃COONa in 500 cm³. Ka = 1.74 × 10⁻⁵, pKa = 4.76. Find the pH.', steps: [
    { label: 'STEP 1', text: 'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).' },
    { label: 'STEP 2', text: 'Volumes cancel: ratio = moles A⁻ / moles HA = 0.25/0.15 = 1.667.' },
    { label: 'STEP 3', text: 'pH = 4.76 + log(1.667) = 4.76 + 0.22 = 4.98.' },
  ], ans: 'pH = 4.98.' },

  { title: 'Ksp to solubility', diff: 'medium', q: 'Ksp of Ca(OH)₂ = 5.5 × 10⁻⁶ mol³ dm⁻⁹. Find the solubility in mol dm⁻³.', steps: [
    { label: 'STEP 1', text: 'Ca(OH)₂(s) ⇌ Ca²⁺(aq) + 2OH⁻(aq). Let solubility = s.' },
    { label: 'STEP 2', text: '[Ca²⁺] = s, [OH⁻] = 2s. Ksp = s(2s)² = 4s³.' },
    { label: 'STEP 3', text: '4s³ = 5.5 × 10⁻⁶. s³ = 1.375 × 10⁻⁶. s = ∛(1.375 × 10⁻⁶) = 1.11 × 10⁻² mol dm⁻³.' },
  ], ans: 'Solubility of Ca(OH)₂ = 0.0111 mol dm⁻³.' },

  { title: 'Common ion — AgCl in NaCl', diff: 'hard', q: 'Ksp(AgCl) = 1.8 × 10⁻¹⁰. Find the solubility of AgCl in 0.050 mol dm⁻³ NaCl.', steps: [
    { label: 'STEP 1', text: 'AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq). In NaCl, [Cl⁻] ≈ 0.050 (>> contribution from AgCl).' },
    { label: 'STEP 2', text: 'Ksp = [Ag⁺] × 0.050 = 1.8 × 10⁻¹⁰.' },
    { label: 'STEP 3', text: '[Ag⁺] = 1.8 × 10⁻¹⁰ / 0.050 = 3.6 × 10⁻⁹ mol dm⁻³.' },
    { label: 'STEP 4', text: 'In pure water: s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵. So solubility drops by a factor of ~3700.' },
  ], ans: 'Solubility = 3.6 × 10⁻⁹ mol dm⁻³ (compared to 1.34 × 10⁻⁵ in pure water).' },

  { title: 'Kp calculation', diff: 'hard', q: 'For PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), 0.50 mol PCl₅ is heated in a 10 dm³ vessel at 500 K. At equilibrium, 0.20 mol Cl₂ is present. Total pressure = 1.5 atm. Find Kp.', steps: [
    { label: 'STEP 1', text: 'Change: 0.20 mol PCl₅ decomposes. Equilibrium moles: PCl₅ = 0.50−0.20 = 0.30, PCl₃ = 0.20, Cl₂ = 0.20.' },
    { label: 'STEP 2', text: 'Total moles = 0.30 + 0.20 + 0.20 = 0.70.' },
    { label: 'STEP 3', text: 'Mole fractions: PCl₅ = 0.30/0.70 = 0.4286, PCl₃ = 0.20/0.70 = 0.2857, Cl₂ = 0.2857.' },
    { label: 'STEP 4', text: 'Partial pressures: p(PCl₅) = 0.4286 × 1.5 = 0.643 atm, p(PCl₃) = 0.2857 × 1.5 = 0.429, p(Cl₂) = 0.429.' },
    { label: 'STEP 5', text: 'Kp = (0.429 × 0.429)/0.643 = 0.184/0.643 = 0.286 atm. Δn = 2−1 = 1, units = atm.' },
  ], ans: 'Kp = 0.286 atm.' },

  { title: 'Reading pKa from a titration curve', diff: 'easy', q: 'A weak acid is titrated with NaOH. The equivalence volume is 20.0 cm³. At 10.0 cm³ of NaOH added, the pH is 4.52. Find pKa and Ka.', steps: [
    { label: 'STEP 1', text: 'Half-equivalence volume = 20.0/2 = 10.0 cm³.' },
    { label: 'STEP 2', text: 'At the half-equivalence point, [HA] = [A⁻], so pH = pKa.' },
    { label: 'STEP 3', text: 'Therefore pKa = 4.52.' },
    { label: 'STEP 4', text: 'Ka = 10⁻⁴·⁵² = 3.02 × 10⁻⁵.' },
  ], ans: 'pKa = 4.52, Ka = 3.02 × 10⁻⁵.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const EQUILIBRIA = {
  id: 'equilibria',
  objectives: [
    'Explain reversible reactions and dynamic equilibrium in a closed system',
    'Deduce Kc and Kp expressions and calculate their values from equilibrium data',
    'Apply Le Chatelier\'s principle to predict the effect of changes in concentration, pressure and temperature',
    'Define acids and bases using the Brønsted-Lowry theory; distinguish strong from weak',
    'Calculate pH and pOH for strong and weak acids/bases using Ka, Kb and Kw',
    'Describe and interpret titration curves for all four acid-base combinations',
    'Choose appropriate indicators based on titration curve shape and pKin',
    'Explain buffer action and calculate buffer pH using Henderson-Hasselbalch',
    'Apply solubility product (Ksp) to calculate solubility and predict precipitation',
    'Explain the common ion effect on solubility',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through an ICE table for a Kc problem',
    'Why is the equivalence point above pH 7 for weak acid + strong base?',
    'Give me a tricky Kp calculation with mole fractions',
    'Explain how blood is buffered at pH 7.4',
    'Calculate the solubility of PbI₂ in a solution already containing KI',
  ],
};
