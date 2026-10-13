// Group II — IC-10 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.2 — Topic 10
// Syllabus coverage:
//   Trends in physical properties
//   Reactions of elements with oxygen and water
//   Behaviour of oxides with water
//   Thermal decomposition of carbonates and nitrates
//   Variation in solubility of sulphates
//   Properties and uses of Group II compounds

/* ============================================================
   Diagram specs (Phase K3 migration)
   ============================================================ */

const physicalTrendsSpec = {
  title: 'GROUP II PHYSICAL PROPERTY TRENDS',
  blocks: [
    { type: 'table',
      headers: ['Element', 'r / pm', 'IE₁ / kJ', 'M.P. / °C', 'Reactivity'],
      rows: [
        ['Be', '112', '900', '1287', 'low'],
        ['Mg', '160', '738', '650',  'moderate'],
        ['Ca', '197', '590', '842',  'high'],
        ['Sr', '215', '550', '777',  'higher'],
        ['Ba', '222', '503', '727',  'highest'],
      ],
    },
    { type: 'note', text: '↑ atomic radius → ↓ IE → easier to lose 2e⁻ → ↑ reactivity', emphasis: true },
    { type: 'note', text: 'm.p. trend is irregular; not a simple trend question' },
  ],
};

const waterReactionsSpec = {
  title: 'GROUP II ELEMENTS + WATER',
  blocks: [
    { type: 'table',
      headers: ['Element', 'Reaction with cold water'],
      colWidths: [55, 235],
      rows: [
        ['Be', 'No reaction'],
        ['Mg', 'Very slow: Mg + 2H₂O → Mg(OH)₂ + H₂'],
        ['Ca', 'Steady: Ca + 2H₂O → Ca(OH)₂ + H₂'],
        ['Sr', 'Vigorous: Sr + 2H₂O → Sr(OH)₂ + H₂'],
        ['Ba', 'Very vigorous: Ba + 2H₂O → Ba(OH)₂ + H₂'],
      ],
    },
    { type: 'note', text: 'Reactivity INCREASES down the group', emphasis: true },
    { type: 'note', text: 'Mg reacts faster with steam: Mg + H₂O(g) → MgO + H₂' },
  ],
};

const thermalCarbSpec = {
  title: 'THERMAL DECOMPOSITION OF CARBONATES',
  subtitle: 'MCO₃ → MO + CO₂',
  blocks: [
    { type: 'bars',
      yMax: 1500,
      items: [
        { label: 'BeCO₃', value:  100, valueLabel:  '100°C', color: 'pink' },
        { label: 'MgCO₃', value:  540, valueLabel:  '540°C', color: 'pink' },
        { label: 'CaCO₃', value:  900, valueLabel:  '900°C', color: 'primary' },
        { label: 'SrCO₃', value: 1290, valueLabel: '1290°C', color: 'primary' },
        { label: 'BaCO₃', value: 1360, valueLabel: '1360°C', color: 'primary' },
      ],
    },
    { type: 'note', text: 'Temperature INCREASES down group', emphasis: true },
    { type: 'note', text: 'larger cation → less polarising → harder to decompose CO₃²⁻' },
  ],
};

const sulphateSolSpec = {
  title: 'SOLUBILITY OF GROUP II SULPHATES',
  blocks: [
    { type: 'bars',
      yMax: 110,
      items: [
        { label: 'MgSO₄', value: 100, valueLabel: 'high', color: 'primary',  sublabel: 'very sol.' },
        { label: 'CaSO₄', value:  25, valueLabel: 'low',  color: 'primary',  sublabel: 'slight' },
        { label: 'SrSO₄', value:   6, valueLabel: 'tiny', color: 'primary',  sublabel: 'sparing' },
        { label: 'BaSO₄', value:   1, valueLabel: '~0',   color: 'primary',  sublabel: 'insol.' },
      ],
    },
    { type: 'note', text: 'Solubility DECREASES down the group', emphasis: true },
    { type: 'note', text: 'BaSO₄ is so insoluble it is used as a test for SO₄²⁻ ions' },
  ],
};

const hydroxideSolSpec = {
  title: 'SOLUBILITY OF GROUP II HYDROXIDES',
  blocks: [
    { type: 'bars',
      yMax: 100,
      items: [
        { label: 'Mg(OH)₂', value: 10, valueLabel: 'low',  color: 'accent', sublabel: 'slight' },
        { label: 'Ca(OH)₂', value: 30, valueLabel: 'mid',  color: 'accent', sublabel: 'sparing' },
        { label: 'Sr(OH)₂', value: 60, valueLabel: 'high', color: 'accent', sublabel: 'sol.' },
        { label: 'Ba(OH)₂', value: 95, valueLabel: 'v.hi', color: 'accent', sublabel: 'very sol.' },
      ],
    },
    { type: 'note', text: 'Solubility INCREASES down the group', emphasis: true },
    { type: 'note', text: 'opposite trend to sulphates!' },
  ],
};

const usesSpec = {
  title: 'USES OF GROUP II COMPOUNDS',
  blocks: [
    { type: 'table',
      headers: ['Compound', 'Use'],
      colWidths: [125, 165],
      rows: [
        ['MgO',                    'refractory lining, antacid'],
        ['Mg(OH)₂',                'antacid (milk of magnesia)'],
        ['Mg trisilicate',         'antacid (MMT)'],
        ['CaO (quicklime)',        'neutralise acidic soil, cement'],
        ['Ca(OH)₂ (slaked lime)',  'neutralise acidic soil/water'],
        ['CaCO₃ (limestone)',      'building material, cement, glass'],
        ['CaSO₄ (gypsum)',         'plaster of Paris, cement'],
        ['MgSO₄ (Epsom salt)',     'medicine (laxative), bath salts'],
        ['BaSO₄',                  'barium meal (X-ray contrast)'],
      ],
    },
  ],
};

const chargeDensityDecompSpec = {
  title: 'WHY DECOMPOSITION TEMPERATURE INCREASES',
  blocks: [
    { type: 'raw', height: 110, primitives: [
      // Small Be²⁺
      { p: 'circle', cx: 80, cy: 50, r: 18, fill: 'pink', fillAlpha: 0.3, stroke: 1.5, color: 'pink' },
      { p: 'text', x: 80, y: 54, text: 'Be²⁺', size: 10, bold: true, color: 'text' },
      { p: 'text', x: 80, y: 78, text: 'small radius', size: 7, color: 'text' },
      { p: 'text', x: 80, y: 90, text: 'HIGH polarising', size: 8, bold: true, color: 'pink' },
      { p: 'text', x: 80, y: 102, text: 'power', size: 8, bold: true, color: 'pink' },
      // Large Ba²⁺
      { p: 'circle', cx: 240, cy: 50, r: 32, fill: 'primary', fillAlpha: 0.2, stroke: 1.5, color: 'primary' },
      { p: 'text', x: 240, y: 54, text: 'Ba²⁺', size: 10, bold: true, color: 'text' },
      { p: 'text', x: 240, y: 90, text: 'large radius', size: 7, color: 'text' },
      { p: 'text', x: 240, y: 102, text: 'LOW polarising', size: 8, bold: true, color: 'primary' },
    ]},
    { type: 'note', text: 'Small cation POLARISES CO₃²⁻ → weakens C-O bonds', emphasis: true },
    { type: 'note', text: '→ easier decomposition → LOWER temperature needed' },
    { type: 'note', text: 'same argument applies to nitrates' },
  ],
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  // CH.1 — Introduction
  { id: 'g21', title: 'The Alkaline Earth Metals', minutes: 7, blocks: [
    { type: 'p', text: 'Group II contains beryllium (Be), magnesium (Mg), calcium (Ca), strontium (Sr) and barium (Ba). They are called the alkaline earth metals because their oxides and hydroxides are alkaline (basic) and many of their compounds are found in the earth\'s crust. All Group II elements have the electron configuration [noble gas] ns², meaning they have TWO electrons in their outer shell and form 2+ ions.' },
    { type: 'h', text: 'Common features' },
    { type: 'ul', items: [
      'All are metals — silvery, relatively soft, good conductors.',
      'All form M²⁺ ions by losing their two outer s electrons.',
      'All have relatively low densities compared to transition metals.',
      'Reactivity INCREASES down the group (Be is least reactive, Ba most reactive).',
      'Their compounds are often white solids.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Alkaline earth metals', body: 'Group II elements: Be, Mg, Ca, Sr, Ba. Configuration: ns². Form M²⁺ ions. Called "alkaline earth" because their oxides are basic and naturally abundant in the earth.' },
    { type: 'takeaway', items: [
      'Group II: Be, Mg, Ca, Sr, Ba — all form M²⁺.',
      'Reactivity increases down the group.',
      'Compounds are typically white ionic solids.',
    ]},
  ]},

  // CH.2 — Physical property trends
  { id: 'g22', title: 'Trends in Physical Properties', minutes: 9, blocks: [
    { type: 'p', text: 'As you go down Group II, the atoms get larger, the ionisation energy decreases, and the elements become more reactive. The melting point trend is less regular.' },
    { type: 'd', spec: physicalTrendsSpec, caption: 'Key physical properties of Group II elements' },
    { type: 'h', text: 'Atomic radius increases' },
    { type: 'p', text: 'Each successive element has one more electron shell. The extra shielding from inner electrons outweighs the increase in nuclear charge, so the outer electrons are held less tightly and the atom is larger.' },
    { type: 'h', text: 'Ionisation energy decreases' },
    { type: 'ul', items: [
      'Going down: the outer electrons are further from the nucleus AND more shielded by inner shells.',
      'Both factors reduce the effective nuclear charge felt by the outer electrons.',
      'It becomes easier to remove the two outer electrons → IE₁ and IE₂ both decrease.',
      'This is why reactivity increases: it\'s easier to form M²⁺.',
    ]},
    { type: 'h', text: 'Melting point' },
    { type: 'p', text: 'The melting point trend is NOT regular across Group II. It generally decreases (Ba < Sr < Ca) but with exceptions. This is because the m.p. depends on the balance between ionic radius (affecting inter-ionic distance), charge (constant at +2) and the crystal structure, which varies. The exam usually does not ask you to explain the m.p. trend in detail — focus on atomic radius and IE.' },
    { type: 'takeaway', items: [
      'Atomic radius increases down Group II (more shells, more shielding).',
      'IE₁ decreases (outer electrons further from nucleus and more shielded).',
      'Reactivity increases because M²⁺ formation becomes easier.',
    ]},
  ]},

  // CH.3 — Reactions with oxygen
  { id: 'g23', title: 'Reactions with Oxygen', minutes: 7, blocks: [
    { type: 'p', text: 'All Group II elements burn in oxygen to form white ionic oxides with the formula MO, where M is the Group II metal. The reaction becomes more vigorous down the group.' },
    { type: 'h', text: 'Equations and observations' },
    { type: 'ul', items: [
      '2Mg + O₂ → 2MgO. Burns with a brilliant WHITE flame. Product is a white powder.',
      '2Ca + O₂ → 2CaO. Burns with a BRICK RED flame.',
      '2Sr + O₂ → 2SrO. Burns with a RED flame.',
      '2Ba + O₂ → 2BaO (also forms BaO₂ peroxide in excess O₂). Burns with a GREEN flame.',
      'Be reacts only at high temperatures (oxide layer protects it, like Al).',
    ]},
    { type: 'h', text: 'Flame colours' },
    { type: 'p', text: 'The characteristic flame colours of Group II metals are used in flame tests: Mg — no distinctive colour (white/silver), Ca — brick red, Sr — crimson red, Ba — apple green. These colours arise from electronic transitions when the metal ions are heated in the flame.' },
    { type: 'takeaway', items: [
      'All form MO oxides (white ionic solids).',
      'Vigour increases: Be < Mg < Ca < Sr < Ba.',
      'Flame colours: Ca red, Sr crimson, Ba green.',
    ]},
  ]},

  // CH.4 — Reactions with water
  { id: 'g24', title: 'Reactions with Water', minutes: 9, blocks: [
    { type: 'p', text: 'Group II metals react with water to form hydroxides and hydrogen gas. The vigour increases down the group — from no reaction (Be) to very vigorous effervescence (Ba).' },
    { type: 'd', spec: waterReactionsSpec, caption: 'Reactivity with water increases down Group II' },
    { type: 'h', text: 'General equation' },
    { type: 'p', text: 'M(s) + 2H₂O(l) → M(OH)₂(aq) + H₂(g). The hydroxide dissolves (to varying extents) and the solution is alkaline.' },
    { type: 'h', text: 'Details for each element' },
    { type: 'ul', items: [
      'Be: no reaction with cold water or steam. Its oxide layer is very resistant.',
      'Mg: very slow with cold water — a few tiny bubbles of H₂ over hours. Faster with hot water. Vigorous with STEAM: Mg + H₂O(g) → MgO + H₂ (note: oxide formed with steam, hydroxide with liquid water).',
      'Ca: steady reaction with cold water. Ca sinks, hydrogen bubbles off steadily. Solution turns milky (Ca(OH)₂ is sparingly soluble — limewater).',
      'Sr: more vigorous than Ca. Fizzes readily.',
      'Ba: very vigorous effervescence. Ba(OH)₂ is quite soluble → strongly alkaline solution.',
    ]},
    { type: 'h', text: 'Why does reactivity increase?' },
    { type: 'p', text: 'Going down the group, IE₁ and IE₂ decrease because the outer electrons are further from the nucleus and more shielded. It becomes progressively easier for the metal to lose its two outer electrons and form M²⁺, so the reaction with water becomes more vigorous.' },
    { type: 'takeaway', items: [
      'M + 2H₂O → M(OH)₂ + H₂ (general equation).',
      'Mg: steam gives MgO; cold water very slow.',
      'Ca: steady with cold water. Ba: vigorous.',
      'Reactivity ↑ because IE ↓ down the group.',
    ]},
  ]},

  // CH.5 — Oxides with water
  { id: 'g25', title: 'Oxides with Water', minutes: 7, blocks: [
    { type: 'p', text: 'Group II oxides are BASIC — they react with water to form alkaline hydroxide solutions. The strength of the base increases down the group because the hydroxides become more soluble.' },
    { type: 'h', text: 'Equations' },
    { type: 'ul', items: [
      'MgO + H₂O → Mg(OH)₂. Mg(OH)₂ is only SLIGHTLY soluble — suspension is milky. pH ≈ 9–10.',
      'CaO + H₂O → Ca(OH)₂. Ca(OH)₂ is SPARINGLY soluble — cloudy/milky solution. pH ≈ 12–13.',
      'SrO + H₂O → Sr(OH)₂. More soluble → higher pH.',
      'BaO + H₂O → Ba(OH)₂. Most soluble → strongly alkaline. pH ≈ 13–14.',
    ]},
    { type: 'h', text: 'The trend in basicity' },
    { type: 'p', text: 'All Group II oxides are basic, but the alkalinity of the resulting solution INCREASES down the group because the hydroxides become MORE SOLUBLE. More dissolved OH⁻ → higher pH → stronger base in practice.' },
    { type: 'callout', kind: 'key', title: 'Hydroxide solubility trend', body: 'Mg(OH)₂ < Ca(OH)₂ < Sr(OH)₂ < Ba(OH)₂ in terms of solubility. This is the OPPOSITE of the sulphate solubility trend. Both trends are commonly examined together.' },
    { type: 'd', spec: hydroxideSolSpec, caption: 'Hydroxide solubility increases down Group II' },
    { type: 'takeaway', items: [
      'All Group II oxides are basic: MO + H₂O → M(OH)₂.',
      'Basicity of solution increases down group (hydroxides more soluble).',
      'Hydroxide solubility: Mg(OH)₂ < Ca(OH)₂ < Ba(OH)₂.',
    ]},
  ]},

  // CH.6 — Thermal decomposition of carbonates and nitrates
  { id: 'g26', title: 'Thermal Decomposition of Carbonates & Nitrates', minutes: 11, blocks: [
    { type: 'p', text: 'Group II carbonates decompose on heating to give the oxide and CO₂. Group II nitrates decompose to give the oxide, NO₂ (brown gas) and O₂. The temperature required for decomposition INCREASES down the group.' },
    { type: 'h', text: 'Carbonates: MCO₃ → MO + CO₂' },
    { type: 'd', spec: thermalCarbSpec, caption: 'Decomposition temperatures increase down the group' },
    { type: 'ul', items: [
      'BeCO₃ decomposes at ~100 °C (very easy).',
      'MgCO₃ at ~540 °C.',
      'CaCO₃ at ~900 °C (lime kiln temperature).',
      'SrCO₃ at ~1290 °C.',
      'BaCO₃ at ~1360 °C (very difficult).',
    ]},
    { type: 'h', text: 'Nitrates: 2M(NO₃)₂ → 2MO + 4NO₂ + O₂' },
    { type: 'ul', items: [
      'The same trend applies: Be(NO₃)₂ decomposes at the lowest temperature, Ba(NO₃)₂ at the highest.',
      'Products: metal oxide + brown NO₂ gas + O₂.',
      'Test for NO₂: brown gas, turns damp blue litmus red.',
      'Test for CO₂: bubbles through limewater → milky.',
    ]},
    { type: 'h', text: 'Why the trend?' },
    { type: 'd', spec: chargeDensityDecompSpec, caption: 'Polarising power explains the decomposition trend' },
    { type: 'ul', items: [
      'Small cations (Be²⁺, Mg²⁺) have HIGH charge density (high polarising power).',
      'They strongly POLARISE the large, easily distorted CO₃²⁻ (or NO₃⁻) anion.',
      'Polarisation weakens the C–O bonds (or N–O bonds) in the anion, making decomposition easier.',
      'Large cations (Ba²⁺) have LOW charge density → less polarisation → harder to decompose → higher temperature needed.',
    ]},
    { type: 'callout', kind: 'key', title: 'The polarisation argument', body: 'Charge density of the cation = charge/radius². Smaller cation → higher charge density → more polarisation of the anion → weaker bonds in the anion → lower decomposition temperature. This is the core argument for both carbonates AND nitrates.' },
    { type: 'takeaway', items: [
      'MCO₃ → MO + CO₂; decomposition T increases down the group.',
      '2M(NO₃)₂ → 2MO + 4NO₂ + O₂; same trend.',
      'Explanation: smaller cation → higher polarising power → easier decomposition.',
    ]},
  ]},

  // CH.7 — Sulphate solubility
  { id: 'g27', title: 'Solubility of Group II Sulphates', minutes: 8, blocks: [
    { type: 'p', text: 'The solubility of Group II sulphates DECREASES down the group. MgSO₄ is very soluble; BaSO₄ is virtually insoluble. This is the OPPOSITE of the hydroxide trend.' },
    { type: 'd', spec: sulphateSolSpec, caption: 'Sulphate solubility decreases down Group II' },
    { type: 'h', text: 'The data' },
    { type: 'ul', items: [
      'MgSO₄: very soluble (35.7 g per 100 cm³ water) — sold as Epsom salts.',
      'CaSO₄: slightly soluble (0.20 g per 100 cm³) — gypsum.',
      'SrSO₄: sparingly soluble.',
      'BaSO₄: insoluble (0.00024 g per 100 cm³) — used in barium meals.',
    ]},
    { type: 'h', text: 'Application: testing for sulphate ions' },
    { type: 'ul', items: [
      'To test for SO₄²⁻: add dilute HCl (to remove any CO₃²⁻ that would give a false positive), then add BaCl₂(aq).',
      'If SO₄²⁻ is present: a white precipitate of BaSO₄ forms. Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).',
      'The precipitate is insoluble in excess HCl, confirming it is BaSO₄ (not BaCO₃, which would dissolve).',
    ]},
    { type: 'callout', kind: 'key', title: 'Why opposite trends?', body: 'Dissolving involves breaking the lattice (endothermic) and hydrating the ions (exothermic). For hydroxides, the hydration enthalpy dominates down the group → more soluble. For sulphates, the lattice enthalpy changes less steeply than hydration → less soluble. The exam rarely asks you to explain WHY the trends are opposite — just know the trends.' },
    { type: 'takeaway', items: [
      'Sulphate solubility: MgSO₄ > CaSO₄ > SrSO₄ > BaSO₄.',
      'Hydroxide solubility: opposite (increases down group).',
      'Test for SO₄²⁻: add HCl then BaCl₂ → white ppt of BaSO₄.',
    ]},
  ]},

  // CH.8 — Properties and uses
  { id: 'g28', title: 'Properties & Uses of Group II Compounds', minutes: 9, blocks: [
    { type: 'p', text: 'Group II compounds have many important industrial, medical and agricultural applications. The syllabus specifically lists several compounds and their uses.' },
    { type: 'd', spec: usesSpec, caption: 'Key uses of Group II compounds' },
    { type: 'h', text: 'Medical uses' },
    { type: 'ul', items: [
      'Mg(OH)₂ (milk of magnesia): antacid — neutralises excess stomach acid (HCl). Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O.',
      'Magnesium trisilicate (MMT): another antacid, used for indigestion and heartburn.',
      'MgSO₄ (Epsom salts): laxative, muscle relaxant, bath soaking.',
      'BaSO₄: "barium meal" — swallowed before X-ray to make the digestive tract visible. Safe because BaSO₄ is insoluble → Ba²⁺ ions (which are toxic) are NOT released into the body.',
      'CaSO₄: plaster of Paris for setting broken bones.',
    ]},
    { type: 'h', text: 'Agricultural and industrial uses' },
    { type: 'ul', items: [
      'CaO (quicklime): spread on acidic soil to neutralise it. Also used in cement manufacture.',
      'Ca(OH)₂ (slaked lime): neutralises acidic soil and water. Used in mortar.',
      'CaCO₃ (limestone): building material, raw material for cement and glass. Also used in blast furnace to remove impurities.',
      'MgO: refractory lining in furnaces (very high m.p. ~2850 °C), antacid.',
    ]},
    { type: 'callout', kind: 'key', title: 'BaSO₄ safety', body: 'Barium ions are toxic, but BaSO₄ is safe to ingest because it is so insoluble that no Ba²⁺ dissolves. BaCO₃ would be dangerous because it could react with stomach acid to release Ba²⁺.' },
    { type: 'takeaway', items: [
      'Antacids: Mg(OH)₂, MgO, magnesium trisilicate.',
      'Agriculture: CaO, Ca(OH)₂ — neutralise acidic soil.',
      'Medical imaging: BaSO₄ barium meal (safe because insoluble).',
      'Construction: CaCO₃, CaSO₄.',
    ]},
  ]},

  // CH.9 — Comparing solubility trends
  { id: 'g29', title: 'Solubility Trends Compared', minutes: 7, blocks: [
    { type: 'p', text: 'Two solubility trends run in OPPOSITE directions down Group II, and you must know both for the exam.' },
    { type: 'h', text: 'Hydroxides: solubility INCREASES down' },
    { type: 'ul', items: [
      'Mg(OH)₂ is barely soluble (milk of magnesia is a suspension).',
      'Ca(OH)₂ is sparingly soluble (limewater).',
      'Ba(OH)₂ is quite soluble (clear solution, strongly alkaline).',
    ]},
    { type: 'h', text: 'Sulphates: solubility DECREASES down' },
    { type: 'ul', items: [
      'MgSO₄ is very soluble.',
      'CaSO₄ is slightly soluble.',
      'BaSO₄ is virtually insoluble.',
    ]},
    { type: 'h', text: 'Quick memory aid' },
    { type: 'p', text: 'Think: "HOH goes up, SULPH goes down." Hydroxides get more soluble going down; sulphates get less soluble going down. If you can remember one, you know the other is the opposite.' },
    { type: 'callout', kind: 'key', title: 'Exam implications', body: 'This is why Ca(OH)₂ makes a useful limewater test for CO₂ — it is sparingly soluble (just enough in solution to react). And why BaSO₄ is used as the test for SO₄²⁻ — its extreme insolubility makes the precipitate unmistakable.' },
    { type: 'takeaway', items: [
      'Hydroxides: MORE soluble down the group.',
      'Sulphates: LESS soluble down the group.',
      'Opposite trends — learn both.',
    ]},
  ]},

  // CH.10 — Exam technique
  { id: 'g210', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Group II questions are very predictable — trends, explanations, equations and uses. Here is how to maximise marks.' },
    { type: 'h', text: 'Trend explanations' },
    { type: 'ul', items: [
      'Reactivity increase: "IE decreases because atomic radius increases and shielding increases" → "easier to form M²⁺".',
      'Thermal decomposition: "charge density of cation decreases down the group" → "less polarisation of CO₃²⁻/NO₃⁻ anion" → "stronger C-O/N-O bonds" → "higher temperature needed".',
      'Always link charge density to polarisation to bond weakness to decomposition temperature.',
    ]},
    { type: 'h', text: 'Common mistakes' },
    { type: 'ul', items: [
      'Confusing hydroxide and sulphate solubility trends — they go in opposite directions!',
      'Writing M(OH)₂ for the product of Mg + steam — it is MgO with steam, not Mg(OH)₂.',
      'Saying "Ba²⁺ is safe" — Ba²⁺ ions are TOXIC. BaSO₄ is safe because it is insoluble.',
      'Forgetting to state that the thermal decomposition explanation involves polarisation of the anion, not just "the cation is smaller".',
    ]},
    { type: 'h', text: 'Equations you must know' },
    { type: 'ul', items: [
      'M + O₂ → MO (burning in oxygen).',
      'M + 2H₂O → M(OH)₂ + H₂ (reaction with water).',
      'Mg + H₂O(g) → MgO + H₂ (Mg with steam specifically).',
      'MO + H₂O → M(OH)₂ (oxide dissolving).',
      'MCO₃ → MO + CO₂ (carbonate decomposition).',
      '2M(NO₃)₂ → 2MO + 4NO₂ + O₂ (nitrate decomposition).',
    ]},
    { type: 'takeaway', items: [
      'Link charge density → polarisation → decomposition T.',
      'Hydroxides up, sulphates down (solubility).',
      'Mg + steam → MgO (not hydroxide).',
      'Ba²⁺ is toxic; BaSO₄ is safe because insoluble.',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 30 MCQs
   ============================================================ */
const quizzes = [
  { q: 'Group II elements all form ions with charge:', opts: ['+1', '+2', '+3', '−2'], ans: 1, hint: 'They lose their 2 outer s electrons.' },
  { q: 'Atomic radius down Group II:', opts: ['Decreases', 'Increases', 'Stays the same', 'First increases then decreases'], ans: 1, hint: 'More electron shells are added.' },
  { q: 'First ionisation energy down Group II:', opts: ['Increases', 'Decreases', 'Stays constant', 'Doubles'], ans: 1, hint: 'Outer electrons further away and more shielded.' },
  { q: 'The most reactive Group II element is:', opts: ['Be', 'Mg', 'Ca', 'Ba'], ans: 3, hint: 'Lowest IE → easiest to form M²⁺.' },
  { q: 'Be does not react with water because:', opts: ['It is not a metal', 'Its oxide layer is very resistant', 'It has no outer electrons', 'It forms Be⁻ ions'], ans: 1, hint: 'Like Al, a protective oxide layer prevents reaction.' },
  { q: 'The product of Ca + cold water is:', opts: ['CaO + H₂', 'Ca(OH)₂ + H₂', 'CaCl₂ + H₂', 'CaCO₃ + H₂'], ans: 1, hint: 'Metal + water → hydroxide + hydrogen.' },
  { q: 'The product of Mg + steam is:', opts: ['Mg(OH)₂ + H₂', 'MgO + H₂', 'MgCl₂ + H₂', 'MgSO₄ + H₂'], ans: 1, hint: 'With steam specifically, the oxide (not hydroxide) forms.' },
  { q: 'The flame colour of Ca is:', opts: ['Green', 'Yellow', 'Brick red', 'Blue'], ans: 2, hint: 'Calcium gives a distinctive red flame.' },
  { q: 'The flame colour of Ba is:', opts: ['Brick red', 'Crimson', 'Apple green', 'Lilac'], ans: 2, hint: 'Barium produces a green flame.' },
  { q: 'Group II oxides are:', opts: ['Acidic', 'Basic', 'Neutral', 'Amphoteric'], ans: 1, hint: 'Metal oxides of Groups I and II are basic.' },
  { q: 'BaO + H₂O gives:', opts: ['Ba + O₂ + H₂', 'Ba(OH)₂', 'BaCO₃', 'BaCl₂'], ans: 1, hint: 'Oxide + water → hydroxide.' },
  { q: 'The pH of Ba(OH)₂ solution is approximately:', opts: ['1', '7', '13', '5'], ans: 2, hint: 'Ba(OH)₂ is the most soluble Group II hydroxide → strongly alkaline.' },
  { q: 'Which Group II hydroxide is MOST soluble?', opts: ['Mg(OH)₂', 'Ca(OH)₂', 'Sr(OH)₂', 'Ba(OH)₂'], ans: 3, hint: 'Hydroxide solubility increases down the group.' },
  { q: 'Which Group II sulphate is MOST soluble?', opts: ['MgSO₄', 'CaSO₄', 'SrSO₄', 'BaSO₄'], ans: 0, hint: 'Sulphate solubility decreases down the group — opposite to hydroxides.' },
  { q: 'BaSO₄ is used in barium meals because:', opts: ['Ba²⁺ is healthy', 'BaSO₄ is insoluble so toxic Ba²⁺ is not released', 'It tastes good', 'It dissolves quickly'], ans: 1, hint: 'Safety comes from insolubility.' },
  { q: 'The thermal decomposition of CaCO₃ produces:', opts: ['Ca + CO₂', 'CaO + CO₂', 'Ca(OH)₂ + CO₂', 'CaCl₂ + CO₂'], ans: 1, hint: 'MCO₃ → MO + CO₂.' },
  { q: 'Which carbonate decomposes at the LOWEST temperature?', opts: ['BaCO₃', 'CaCO₃', 'MgCO₃', 'BeCO₃'], ans: 3, hint: 'Smallest cation → highest polarising power → easiest decomposition.' },
  { q: 'Thermal decomposition temperature of carbonates increases down Group II because:', opts: ['The cations get smaller', 'The cation has lower polarising power so it polarises CO₃²⁻ less', 'The anion gets smaller', 'The lattice energy decreases'], ans: 1, hint: 'Larger cation → lower charge density → less polarisation.' },
  { q: 'The products of thermal decomposition of Mg(NO₃)₂ are:', opts: ['MgO + NO₂ + O₂', 'Mg + NO₃', 'MgO + N₂', 'Mg(OH)₂ + NO₂'], ans: 0, hint: '2M(NO₃)₂ → 2MO + 4NO₂ + O₂.' },
  { q: 'To test for SO₄²⁻ ions, add:', opts: ['NaOH then AgNO₃', 'Dilute HCl then BaCl₂', 'Dilute HCl then NaOH', 'AgNO₃ then NH₃'], ans: 1, hint: 'BaCl₂ gives white BaSO₄ precipitate. HCl removes CO₃²⁻.' },
  { q: 'Mg(OH)₂ is used as:', opts: ['A fuel', 'An antacid', 'A bleach', 'A fertiliser'], ans: 1, hint: 'Milk of magnesia neutralises stomach acid.' },
  { q: 'CaO is used to:', opts: ['Make plastics', 'Neutralise acidic soil', 'Make chlorine', 'Reduce iron ore'], ans: 1, hint: 'Quicklime is a common agricultural base.' },
  { q: 'CaCO₃ is also known as:', opts: ['Quicklime', 'Slaked lime', 'Limestone', 'Gypsum'], ans: 2, hint: 'Calcium carbonate is limestone.' },
  { q: 'CaSO₄ is used to make:', opts: ['Soap', 'Plaster of Paris', 'Bleach', 'Cement only'], ans: 1, hint: 'Gypsum (CaSO₄·2H₂O) is dehydrated to make plaster.' },
  { q: 'The general formula for Group II oxides is:', opts: ['MO₂', 'MO', 'M₂O', 'M₂O₃'], ans: 1, hint: 'M²⁺ combines with O²⁻ in a 1:1 ratio.' },
  { q: 'Which statement about Group II nitrate decomposition is correct?', opts: ['All produce NO₂ and O₂', 'All produce N₂', 'Only Ba(NO₃)₂ decomposes', 'They decompose at the same temperature'], ans: 0, hint: '2M(NO₃)₂ → 2MO + 4NO₂ + O₂ for all Group II nitrates.' },
  { q: 'Mg reacts slowly with cold water but vigorously with:', opts: ['Acid', 'Steam', 'Both acid and steam', 'Neither'], ans: 2, hint: 'Both reactions are faster than cold water.' },
  { q: 'Charge density is defined as:', opts: ['Charge × radius', 'Charge / radius²', 'Radius / charge', 'Mass / volume'], ans: 1, hint: 'High charge and small radius → high charge density.' },
  { q: 'Limewater is a solution of:', opts: ['CaO', 'Ca(OH)₂', 'CaCO₃', 'CaCl₂'], ans: 1, hint: 'Calcium hydroxide dissolved in water = limewater.' },
  { q: 'When CO₂ is bubbled through limewater:', opts: ['Nothing happens', 'It turns milky', 'It turns blue', 'It fizzes'], ans: 1, hint: 'Ca(OH)₂ + CO₂ → CaCO₃ (white precipitate) + H₂O.' },
];

/* ============================================================
   Structured questions — 6
   ============================================================ */
const structured = [
  { title: 'Physical property trends', marks: 8, q: 'Consider the Group II elements Mg, Ca, Sr and Ba.', parts: [
    { q: '(a) Describe and explain the trend in atomic radius down Group II.', marks: 3, ans: 'Atomic radius increases down the group. Each successive element has one more electron shell (Mg has 3, Ca has 4, Sr has 5, Ba has 6). The additional inner shells increase the shielding of the outer electrons from the nuclear charge, so the outer 2 electrons are held less tightly and further from the nucleus.' },
    { q: '(b) Describe and explain the trend in first ionisation energy down Group II.', marks: 3, ans: 'IE₁ decreases down the group. The outer electrons are progressively further from the nucleus (larger atomic radius) and experience greater shielding from more inner electron shells. Both factors reduce the effective nuclear charge felt by the outer electrons, so less energy is needed to remove one.' },
    { q: '(c) Explain how the IE trend relates to the trend in reactivity.', marks: 2, ans: 'Group II elements react by losing their 2 outer electrons to form M²⁺. As IE₁ (and IE₂) decrease down the group, it becomes easier to remove these electrons. Therefore reactivity increases down the group: Ba is the most reactive and Be/Mg the least reactive.' },
  ]},
  { title: 'Thermal decomposition', marks: 9, q: 'Group II carbonates decompose on heating: MCO₃ → MO + CO₂.', parts: [
    { q: '(a) State the trend in decomposition temperature down Group II.', marks: 1, ans: 'Decomposition temperature increases down the group (BeCO₃ decomposes most easily, BaCO₃ requires the highest temperature).' },
    { q: '(b) Explain this trend in terms of charge density and polarisation.', marks: 4, ans: 'Going down Group II, the ionic radius of M²⁺ increases (Be²⁺ is smallest, Ba²⁺ largest). Since the charge remains +2, the charge density (charge/radius²) decreases. A smaller cation with higher charge density more strongly polarises the large, electron-rich CO₃²⁻ anion, distorting its electron cloud and weakening the C–O bonds within it. This makes the carbonate easier to decompose (lower temperature). Larger cations like Ba²⁺ polarise the anion less, so the C–O bonds remain stronger and a higher temperature is needed.' },
    { q: '(c) Write the equation for the thermal decomposition of Mg(NO₃)₂.', marks: 1, ans: '2Mg(NO₃)₂(s) → 2MgO(s) + 4NO₂(g) + O₂(g).' },
    { q: '(d) Describe how you would test for the gaseous products of part (c).', marks: 3, ans: 'NO₂: brown gas is visible. Hold damp blue litmus paper near the tube mouth — it turns red (NO₂ is acidic). CO₂ is NOT produced from nitrate decomposition. O₂: hold a glowing splint near the mouth — it relights. Alternatively, the brown colour of the gas alone identifies NO₂.' },
  ]},
  { title: 'Reactions with water', marks: 7, q: 'Consider the reactions of Mg and Ba with water.', parts: [
    { q: '(a) Write the equation for the reaction of Ba with cold water.', marks: 1, ans: 'Ba(s) + 2H₂O(l) → Ba(OH)₂(aq) + H₂(g).' },
    { q: '(b) Describe what you would observe.', marks: 2, ans: 'Very vigorous effervescence (bubbles of hydrogen gas). The barium metal dissolves/disappears. The solution becomes warm. If an indicator is added, it turns alkaline (e.g. universal indicator turns purple/blue).' },
    { q: '(c) Write the equation for the reaction of Mg with steam.', marks: 1, ans: 'Mg(s) + H₂O(g) → MgO(s) + H₂(g).' },
    { q: '(d) Explain why Ba reacts more vigorously with water than Mg.', marks: 3, ans: 'Ba has a larger atomic radius than Mg, so its outer electrons are further from the nucleus and experience greater shielding. The ionisation energies (IE₁ and IE₂) of Ba are therefore lower than those of Mg. It requires less energy for Ba to lose its 2 outer electrons and form Ba²⁺, so the reaction occurs more readily and vigorously.' },
  ]},
  { title: 'Solubility trends', marks: 8, q: 'The solubility of Group II hydroxides increases down the group, while the solubility of Group II sulphates decreases.', parts: [
    { q: '(a) Arrange MgSO₄, CaSO₄, SrSO₄, BaSO₄ in order of decreasing solubility.', marks: 1, ans: 'MgSO₄ > CaSO₄ > SrSO₄ > BaSO₄.' },
    { q: '(b) Describe the test for sulphate ions.', marks: 3, ans: 'Step 1: Add dilute hydrochloric acid to the test solution (to remove any carbonate ions, which could give a false positive with Ba²⁺). Step 2: Add barium chloride solution, BaCl₂(aq). Step 3: If SO₄²⁻ is present, a white precipitate of BaSO₄ forms: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s). The precipitate is insoluble in excess dilute HCl.' },
    { q: '(c) Explain why BaSO₄ is safe to use in barium meals despite Ba²⁺ being toxic.', marks: 2, ans: 'BaSO₄ is extremely insoluble in water and in stomach acid. Because it does not dissolve, no Ba²⁺ ions are released into the body. The barium remains locked in the solid lattice as it passes through the digestive system, so it is non-toxic when ingested as BaSO₄.' },
    { q: '(d) Why is Ba(OH)₂ a stronger base in solution than Mg(OH)₂?', marks: 2, ans: 'Ba(OH)₂ is more soluble than Mg(OH)₂. A more soluble hydroxide produces a higher concentration of OH⁻ ions in solution, giving a higher pH and stronger alkalinity. Mg(OH)₂ is only slightly soluble, so it produces fewer OH⁻ ions and a lower pH.' },
  ]},
  { title: 'Uses of Group II compounds', marks: 7, q: 'Group II compounds have many practical applications.', parts: [
    { q: '(a) Name two Group II compounds used as antacids and write an equation for one of them neutralising stomach acid.', marks: 3, ans: 'Mg(OH)₂ (milk of magnesia) and MgO. Equation: Mg(OH)₂(s) + 2HCl(aq) → MgCl₂(aq) + 2H₂O(l). [Or: MgO(s) + 2HCl(aq) → MgCl₂(aq) + H₂O(l).]' },
    { q: '(b) Explain how CaO is used to treat acidic soil.', marks: 2, ans: 'CaO (quicklime) is a basic oxide. When spread on acidic soil, it reacts with the acid (H⁺ ions): CaO + 2H⁺ → Ca²⁺ + H₂O. This neutralises the soil acidity, raising the pH to a level more suitable for plant growth.' },
    { q: '(c) State one use of CaCO₃ and one use of CaSO₄.', marks: 2, ans: 'CaCO₃ (limestone): building material, or as a raw material for cement/glass/blast furnace flux. CaSO₄ (gypsum): making plaster of Paris (for casts/moulds) or as a component of cement.' },
  ]},
  { title: 'Oxide basicity', marks: 7, q: 'The oxides of Group II metals are all basic.', parts: [
    { q: '(a) Write equations for the reactions of MgO and BaO with water.', marks: 2, ans: 'MgO(s) + H₂O(l) → Mg(OH)₂(aq). BaO(s) + H₂O(l) → Ba(OH)₂(aq).' },
    { q: '(b) State the approximate pH of each resulting solution and explain the difference.', marks: 3, ans: 'MgO → pH ≈ 9–10. BaO → pH ≈ 13–14. Ba(OH)₂ is much more soluble than Mg(OH)₂, so a higher concentration of OH⁻ ions is present in the BaO solution, giving a higher pH and stronger alkalinity.' },
    { q: '(c) Write the equation for the reaction of MgO with dilute HCl.', marks: 1, ans: 'MgO(s) + 2HCl(aq) → MgCl₂(aq) + H₂O(l).' },
    { q: '(d) Explain why MgO has a very high melting point (2852 °C).', marks: 1, ans: 'MgO has a giant ionic lattice with strong electrostatic attractions between Mg²⁺ and O²⁻ ions. Both ions are small and doubly charged, giving high charge density and a very large lattice energy. A lot of energy is needed to overcome these strong ionic bonds.' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Explain reactivity trend', diff: 'easy', q: 'Explain why Ba reacts more vigorously with water than Ca.', steps: [
    { label: 'STEP 1', text: 'Ba has a larger atomic radius than Ca — 5 electron shells vs 4.' },
    { label: 'STEP 2', text: 'The outer electrons in Ba are further from the nucleus and more shielded by inner shells.' },
    { label: 'STEP 3', text: 'IE₁ and IE₂ of Ba are lower → it is easier to remove the 2 outer electrons.' },
    { label: 'STEP 4', text: 'Therefore Ba loses electrons more readily, forming Ba²⁺ faster → more vigorous reaction.' },
  ], ans: 'Ba reacts more vigorously because its lower ionisation energies (due to larger radius and more shielding) make it easier to form M²⁺.' },

  { title: 'Thermal decomposition temperature', diff: 'medium', q: 'Explain why BeCO₃ decomposes at a lower temperature than BaCO₃.', steps: [
    { label: 'STEP 1', text: 'Be²⁺ has a much smaller ionic radius than Ba²⁺ (45 pm vs 135 pm).' },
    { label: 'STEP 2', text: 'Both have charge +2, but Be²⁺ has a much higher charge density (charge/radius²).' },
    { label: 'STEP 3', text: 'Be²⁺ strongly polarises the large CO₃²⁻ anion, distorting its electron cloud and weakening the C–O bonds.' },
    { label: 'STEP 4', text: 'Weakened bonds require less thermal energy to break → BeCO₃ decomposes at a lower temperature.' },
  ], ans: 'Be²⁺ has higher charge density → more polarisation of CO₃²⁻ → weaker C–O bonds → lower decomposition T.' },

  { title: 'Write nitrate decomposition', diff: 'easy', q: 'Write the balanced equation for the thermal decomposition of Ca(NO₃)₂.', steps: [
    { label: 'STEP 1', text: 'General equation: 2M(NO₃)₂ → 2MO + 4NO₂ + O₂.' },
    { label: 'STEP 2', text: 'For Ca: 2Ca(NO₃)₂(s) → 2CaO(s) + 4NO₂(g) + O₂(g).' },
  ], ans: '2Ca(NO₃)₂(s) → 2CaO(s) + 4NO₂(g) + O₂(g). Brown NO₂ fumes observed.' },

  { title: 'Hydroxide vs sulphate solubility', diff: 'medium', q: 'Arrange Ba(OH)₂, Mg(OH)₂, MgSO₄, BaSO₄ in order of increasing solubility.', steps: [
    { label: 'STEP 1', text: 'Hydroxides: solubility increases down Group II. So Mg(OH)₂ < Ba(OH)₂.' },
    { label: 'STEP 2', text: 'Sulphates: solubility decreases down Group II. So BaSO₄ < MgSO₄.' },
    { label: 'STEP 3', text: 'BaSO₄ is virtually insoluble (least soluble of all four). Mg(OH)₂ is slightly soluble.' },
    { label: 'STEP 4', text: 'Order: BaSO₄ < Mg(OH)₂ < Ba(OH)₂ < MgSO₄.' },
  ], ans: 'BaSO₄ (least soluble) < Mg(OH)₂ < Ba(OH)₂ < MgSO₄ (most soluble).' },

  { title: 'Test for sulphate ions', diff: 'easy', q: 'Describe how you would test a solution for the presence of SO₄²⁻ ions.', steps: [
    { label: 'STEP 1', text: 'Add dilute hydrochloric acid to the test solution. This removes CO₃²⁻ ions that could form a white precipitate with Ba²⁺ and give a false positive.' },
    { label: 'STEP 2', text: 'Add barium chloride solution, BaCl₂(aq).' },
    { label: 'STEP 3', text: 'If SO₄²⁻ is present, a white precipitate of BaSO₄ forms: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).' },
    { label: 'STEP 4', text: 'The white precipitate is insoluble in excess dilute HCl, confirming it is BaSO₄.' },
  ], ans: 'Add dilute HCl then BaCl₂(aq). White precipitate of BaSO₄ confirms SO₄²⁻.' },

  { title: 'Antacid equation', diff: 'easy', q: 'Write the equation for Mg(OH)₂ neutralising stomach acid (HCl).', steps: [
    { label: 'STEP 1', text: 'Stomach acid is HCl(aq). Mg(OH)₂ is a base.' },
    { label: 'STEP 2', text: 'Mg(OH)₂(s) + 2HCl(aq) → MgCl₂(aq) + 2H₂O(l).' },
  ], ans: 'Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O. The base neutralises the excess acid.' },

  { title: 'Compare Mg and Ca with water', diff: 'medium', q: 'Compare the reactions of Mg and Ca with cold water.', steps: [
    { label: 'STEP 1', text: 'Ca reacts STEADILY with cold water: Ca + 2H₂O → Ca(OH)₂ + H₂. Bubbles of H₂ are visible. Solution becomes alkaline (limewater).' },
    { label: 'STEP 2', text: 'Mg reacts VERY SLOWLY with cold water: only a few tiny bubbles over many hours. The oxide layer partially protects it.' },
    { label: 'STEP 3', text: 'With STEAM, Mg reacts vigorously: Mg + H₂O(g) → MgO + H₂. Note: oxide, not hydroxide.' },
    { label: 'STEP 4', text: 'Ca is more reactive because it has lower IE₁ and IE₂ (larger atomic radius, more shielding).' },
  ], ans: 'Ca reacts steadily with cold water; Mg barely reacts. Ca is more reactive due to lower ionisation energies.' },

  { title: 'BaSO₄ barium meal safety', diff: 'medium', q: 'Explain why patients can safely swallow BaSO₄ for X-rays despite Ba²⁺ being toxic.', steps: [
    { label: 'STEP 1', text: 'Ba²⁺ ions are indeed toxic if they enter the bloodstream.' },
    { label: 'STEP 2', text: 'However, BaSO₄ is EXTREMELY insoluble in water and in stomach acid (Ksp ≈ 1.1 × 10⁻¹⁰).' },
    { label: 'STEP 3', text: 'Because it does not dissolve, no free Ba²⁺ ions are released into the body.' },
    { label: 'STEP 4', text: 'The solid BaSO₄ passes through the digestive system intact, providing X-ray contrast without any toxic effect.' },
  ], ans: 'BaSO₄ is so insoluble that no Ba²⁺ ions are released. The barium stays locked in the solid.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const GROUP2 = {
  id: 'group2',
  objectives: [
    'Describe and explain trends in atomic radius, ionisation energy and reactivity down Group II',
    'Write equations for Group II elements reacting with oxygen and water',
    'Describe the behaviour of Group II oxides with water (basic character increases)',
    'Explain the variation in thermal decomposition temperature of Group II carbonates and nitrates using charge density and polarisation',
    'Describe the variation in solubility of Group II sulphates (decreases) and hydroxides (increases)',
    'State the properties and uses of key Group II compounds (MgO, Mg(OH)₂, CaO, Ca(OH)₂, CaCO₃, CaSO₄, MgSO₄, BaSO₄, magnesium trisilicate)',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Explain the thermal decomposition trend using charge density step by step',
    'Compare the solubility trends for hydroxides and sulphates',
    'Why is BaSO₄ safe to swallow but BaCO₃ is not?',
    'Give me a data question where I have to identify a Group II compound',
    'Walk me through the test for sulphate ions',
  ],
};
