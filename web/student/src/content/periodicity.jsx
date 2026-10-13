// Periodicity (Period 3) — IC-09 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.2 — Topic 9
// Syllabus coverage:
//   Variation in atomic radius, ionic radius, IE, m.p., conductivity
//   Reactions of elements with O₂, Cl₂, H₂O
//   Variation in oxidation number of oxides and chlorides
//   Acid-base behaviour of oxides; reactions of oxides & chlorides with water
//   Deducing bonding from physical/chemical properties

/* ============================================================
   Diagram specs (Phase K3 migration)
   ============================================================ */

const atomicRadiusSpec = {
  title: 'ATOMIC RADIUS ACROSS PERIOD 3',
  blocks: [
    { type: 'bars',
      yMax: 200,
      items: [
        { label: 'Na', value: 186, valueLabel: '186', color: 'primary' },
        { label: 'Mg', value: 160, valueLabel: '160', color: 'primary' },
        { label: 'Al', value: 143, valueLabel: '143', color: 'primary' },
        { label: 'Si', value: 117, valueLabel: '117', color: 'primary' },
        { label: 'P',  value: 110, valueLabel: '110', color: 'primary' },
        { label: 'S',  value: 104, valueLabel: '104', color: 'primary' },
        { label: 'Cl', value:  99, valueLabel:  '99', color: 'primary' },
      ],
    },
    { type: 'note', text: 'DECREASES across the period', emphasis: true },
    { type: 'note', text: '↑ nuclear charge, same shielding → electrons pulled closer' },
  ],
};

const ionisationEnergySpec = {
  title: 'FIRST IONISATION ENERGY · PERIOD 3',
  blocks: [
    { type: 'raw', height: 180, primitives: [
      // Axes
      { p: 'line', x1: 35, y1: 145, x2: 305, y2: 145, color: 'text', width: 1 },
      { p: 'line', x1: 35, y1: 145, x2:  35, y2:  20, color: 'text', width: 1 },
      { p: 'text', x: 20, y: 80, text: 'IE₁', size: 7, color: 'text' },
      // Data points (line+circles); Na 496, Mg 738, Al 577, Si 786, P 1012, S 1000, Cl 1251, Ar 1521
      // y mapping: y = 145 - h*0.7 with h chosen so peak fits
      { p: 'circle', cx:  50, cy: 145 - 55*0.7,  r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx:  83, cy: 145 - 90*0.7,  r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 116, cy: 145 - 68*0.7,  r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 149, cy: 145 - 97*0.7,  r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 182, cy: 145 - 128*0.7, r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 215, cy: 145 - 126*0.7, r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 248, cy: 145 - 160*0.7, r: 4, fill: 'primary', color: 'primary' },
      { p: 'circle', cx: 281, cy: 145 - 195*0.7, r: 4, fill: 'primary', color: 'primary' },
      { p: 'path', d: 'M50 106.5 L83 82 L116 97.4 L149 77.1 L182 55.4 L215 56.8 L248 33 L281 8.5',
        color: 'primary', width: 1.5 },
      // Labels
      { p: 'text', x:  50, y: 160, text: 'Na', size: 8, bold: true, color: 'text' },
      { p: 'text', x:  83, y: 160, text: 'Mg', size: 8, bold: true, color: 'text' },
      { p: 'text', x: 116, y: 160, text: 'Al', size: 8, bold: true, color: 'text' },
      { p: 'text', x: 149, y: 160, text: 'Si', size: 8, bold: true, color: 'text' },
      { p: 'text', x: 182, y: 160, text: 'P',  size: 8, bold: true, color: 'text' },
      { p: 'text', x: 215, y: 160, text: 'S',  size: 8, bold: true, color: 'text' },
      { p: 'text', x: 248, y: 160, text: 'Cl', size: 8, bold: true, color: 'text' },
      { p: 'text', x: 281, y: 160, text: 'Ar', size: 8, bold: true, color: 'text' },
      // Annotations
      { p: 'text', x: 100, y: 110, text: 'Al dip: 3p¹',         size: 7, color: 'pink' },
      { p: 'text', x: 100, y: 120, text: 'easier to remove',    size: 7, color: 'pink' },
      { p: 'text', x: 210, y:  67, text: 'S dip: 3p⁴',          size: 7, color: 'pink' },
      { p: 'text', x: 210, y:  77, text: 'paired e⁻ repulsion', size: 7, color: 'pink' },
    ]},
    { type: 'note', text: 'general increase: ↑ nuclear charge across period' },
  ],
};

const meltingPointsSpec = {
  title: 'MELTING POINTS ACROSS PERIOD 3',
  blocks: [
    { type: 'bars',
      yMax: 1700,
      items: [
        { label: 'Na', value:  371, valueLabel:  '371', color: 'accent', sublabel: 'metallic' },
        { label: 'Mg', value:  923, valueLabel:  '923', color: 'accent' },
        { label: 'Al', value:  933, valueLabel:  '933', color: 'accent' },
        { label: 'Si', value: 1687, valueLabel: '1687', color: 'primary', sublabel: 'giant cov.' },
        { label: 'P',  value:  317, valueLabel:  '317', color: 'pink', sublabel: 'molecular' },
        { label: 'S',  value:  393, valueLabel:  '393', color: 'pink' },
        { label: 'Cl', value:  172, valueLabel:  '172', color: 'pink' },
        { label: 'Ar', value:   84, valueLabel:   '84', color: 'pink' },
      ],
    },
    { type: 'note', text: 'bonding type explains the pattern', emphasis: true },
  ],
};

const oxidesAcidBaseSpec = {
  title: 'ACID-BASE CHARACTER OF PERIOD 3 OXIDES',
  blocks: [
    { type: 'cards', cards: [
      { title: 'BASIC',      body: ['Na₂O', 'MgO'],         color: 'cyan' },
      { title: 'AMPHOTERIC', body: ['Al₂O₃'],               color: 'green' },
      { title: 'ACIDIC',     body: ['SiO₂', 'P₄O₁₀', 'SO₃'], color: 'pink' },
    ]},
    { type: 'panel', title: 'WHEN DISSOLVED IN WATER', body: [
      'Na₂O, MgO → alkaline (pH > 7)',
      'Al₂O₃ → insoluble (does not dissolve)',
      'SiO₂ → insoluble (does not dissolve)',
      'P₄O₁₀, SO₃ → acidic (pH < 7)',
    ], color: 'primary' },
    { type: 'note', text: 'trend: basic → amphoteric → acidic (left to right)' },
  ],
};

const chloridesSpec = {
  title: 'PERIOD 3 CHLORIDES · BONDING & WATER',
  blocks: [
    { type: 'table',
      headers: ['Chloride', 'Bonding', '+ Water', 'pH'],
      rows: [
        ['NaCl',       'Ionic',     'dissolves',  '7'],
        ['MgCl₂',      'Ionic',     'dissolves',  '~6.5'],
        ['AlCl₃',      'Covalent*', 'hydrolyses', '~3'],
        ['SiCl₄',      'Covalent',  'hydrolyses', '~2'],
        ['PCl₃/PCl₅',  'Covalent',  'hydrolyses', '~2'],
      ],
      rowColors: ['accent', 'accent', 'primary', 'primary', 'primary'],
    },
    { type: 'note', text: '*AlCl₃ is covalent when anhydrous', emphasis: true },
    { type: 'note', text: 'Ionic chlorides dissolve (neutral/slightly acidic)' },
    { type: 'note', text: 'Covalent chlorides hydrolyse → HCl → acidic' },
  ],
};

const reactionsO2Spec = {
  title: 'REACTIONS OF PERIOD 3 ELEMENTS WITH O₂',
  blocks: [
    { type: 'table',
      headers: ['Element', 'Equation', 'Ox. no.'],
      colWidths: [50, 200, 40],
      rows: [
        ['Na', '4Na + O₂ → 2Na₂O',    '+1'],
        ['Mg', '2Mg + O₂ → 2MgO',     '+2'],
        ['Al', '4Al + 3O₂ → 2Al₂O₃',  '+3'],
        ['Si', 'Si + O₂ → SiO₂',      '+4'],
        ['P',  'P₄ + 5O₂ → P₄O₁₀',    '+5'],
        ['S',  'S + O₂ → SO₂',        '+4 (+6*)'],
      ],
    },
    { type: 'note', text: '*S can also form SO₃ (ox.state +6) under certain conditions' },
  ],
};

const conductivitySpec = {
  title: 'ELECTRICAL CONDUCTIVITY · PERIOD 3',
  blocks: [
    { type: 'bars',
      yMax: 110,
      items: [
        { label: 'Na', value: 55,  valueLabel: '55',  color: 'primary', sublabel: 'metal' },
        { label: 'Mg', value: 85,  valueLabel: '85',  color: 'primary', sublabel: 'metal' },
        { label: 'Al', value: 100, valueLabel: '100', color: 'primary', sublabel: 'metal' },
        { label: 'Si', value: 5,   valueLabel: '~5',  color: 'accent',  sublabel: 'semi' },
        { label: 'P',  value: 0.5, valueLabel: '0',   color: 'grey',    sublabel: 'nil' },
        { label: 'S',  value: 0.5, valueLabel: '0',   color: 'grey',    sublabel: 'nil' },
        { label: 'Cl', value: 0.5, valueLabel: '0',   color: 'grey',    sublabel: 'nil' },
        { label: 'Ar', value: 0.5, valueLabel: '0',   color: 'grey',    sublabel: 'nil' },
      ],
    },
    { type: 'note', text: 'metals have delocalised electrons; non-metals do not' },
  ],
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  // CH.1 — Introduction to periodicity
  { id: 'pd1', title: 'What Is Periodicity?', minutes: 7, blocks: [
    { type: 'p', text: 'Periodicity is the repeating pattern of physical and chemical properties as you move across a period of the periodic table. Period 3 runs from sodium (Na, Z = 11) to argon (Ar, Z = 18). These eight elements show a complete transition from reactive metal to noble gas, and every trend can be explained by changes in electronic structure.' },
    { type: 'h', text: 'The elements of Period 3' },
    { type: 'ul', items: [
      'Na (2,8,1) — reactive metal, Group I.',
      'Mg (2,8,2) — reactive metal, Group II.',
      'Al (2,8,3) — metal with some amphoteric character, Group III.',
      'Si (2,8,4) — metalloid/semiconductor, Group IV.',
      'P (2,8,5) — non-metal, Group V.',
      'S (2,8,6) — non-metal, Group VI.',
      'Cl (2,8,7) — non-metal/halogen, Group VII.',
      'Ar (2,8,8) — noble gas, Group 0.',
    ]},
    { type: 'p', text: 'All Period 3 elements have the same number of electron shells (3), but the number of protons in the nucleus increases from 11 to 18. This increasing nuclear charge, with constant shielding from the inner two shells, drives all the trends across the period.' },
    { type: 'takeaway', items: [
      'Period 3: Na to Ar (8 elements, all with 3 electron shells).',
      'Nuclear charge increases left to right; shielding stays the same.',
      'This drives all physical and chemical trends.',
    ]},
  ]},

  // CH.2 — Atomic and ionic radius
  { id: 'pd2', title: 'Atomic & Ionic Radius Trends', minutes: 9, blocks: [
    { type: 'p', text: 'The atomic radius DECREASES across Period 3 from Na to Cl. This is because the nuclear charge increases while the shielding from inner electrons stays essentially the same (all elements have the same 1s²2s²2p⁶ inner core). The increasing effective nuclear charge pulls the outer electrons closer to the nucleus.' },
    { type: 'd', spec: atomicRadiusSpec, caption: 'Atomic radius decreases across Period 3' },
    { type: 'h', text: 'Why the decrease?' },
    { type: 'ul', items: [
      'Na has 11 protons pulling on 1 outer electron (3s¹). Cl has 17 protons pulling on 7 outer electrons (3s²3p⁵).',
      'Although Cl has more electrons, the extra electrons go into the SAME shell (n = 3) and provide poor shielding from each other.',
      'The dominant factor is the increasing nuclear charge → smaller radius.',
    ]},
    { type: 'h', text: 'Ionic radius' },
    { type: 'ul', items: [
      'Cations (Na⁺, Mg²⁺, Al³⁺) are SMALLER than their parent atoms — they have lost their outer shell entirely. The remaining electrons are pulled in more tightly by the nucleus.',
      'Anions (P³⁻, S²⁻, Cl⁻) are LARGER than their parent atoms — extra electrons increase electron-electron repulsion, expanding the electron cloud.',
      'For isoelectronic species (e.g. O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺ — all with 10 electrons): more protons → smaller radius. So Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻.',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam favourite', body: 'Explain why Na⁺ is smaller than Na: Na⁺ has lost the 3s electron — only 2 shells remain. The 10 remaining electrons are attracted by 11 protons, giving a very small, tightly held ion.' },
    { type: 'takeaway', items: [
      'Atomic radius decreases left to right (↑ nuclear charge, same shielding).',
      'Cations < parent atoms; anions > parent atoms.',
      'Isoelectronic: more protons → smaller radius.',
    ]},
  ]},

  // CH.3 — Ionisation energy
  { id: 'pd3', title: 'First Ionisation Energy Trend', minutes: 9, blocks: [
    { type: 'p', text: 'The first ionisation energy (IE₁) generally INCREASES across Period 3, with two notable dips at aluminium and sulphur. IE₁ is the energy required to remove one electron from a gaseous atom: X(g) → X⁺(g) + e⁻.' },
    { type: 'd', spec: ionisationEnergySpec, caption: 'IE₁ trend across Period 3 with dips at Al and S' },
    { type: 'h', text: 'General increase' },
    { type: 'p', text: 'Across the period, nuclear charge increases while shielding is approximately constant. The outer electron is more strongly attracted to the nucleus and harder to remove. This is the same reasoning as for atomic radius — both trends are driven by effective nuclear charge.' },
    { type: 'h', text: 'The aluminium dip' },
    { type: 'ul', items: [
      'Mg: [Ne] 3s². The electron removed is from a FULL 3s subshell.',
      'Al: [Ne] 3s² 3p¹. The electron removed is from the 3p subshell, which is slightly HIGHER in energy and FURTHER from the nucleus than 3s.',
      'The 3p electron in Al is easier to remove than the 3s electron in Mg, despite Al having one more proton.',
      'Result: IE₁(Al) < IE₁(Mg).',
    ]},
    { type: 'h', text: 'The sulphur dip' },
    { type: 'ul', items: [
      'P: [Ne] 3s² 3p³. All three 3p electrons are UNPAIRED (one in each 3p orbital).',
      'S: [Ne] 3s² 3p⁴. One 3p orbital now has a PAIR of electrons.',
      'The paired electron in S experiences extra electron-electron REPULSION within the same orbital, making it easier to remove.',
      'Result: IE₁(S) < IE₁(P).',
    ]},
    { type: 'callout', kind: 'key', title: 'Two dips, two reasons', body: 'Al dip: 3p electron is higher energy than 3s (subshell effect). S dip: paired 3p electron has extra repulsion (pairing effect). These are frequently examined — learn both explanations precisely.' },
    { type: 'takeaway', items: [
      'IE₁ generally increases across Period 3.',
      'Al dip: 3p¹ electron easier to remove than Mg\'s 3s².',
      'S dip: paired 3p⁴ electron experiences repulsion.',
    ]},
  ]},

  // CH.4 — Melting point and conductivity
  { id: 'pd4', title: 'Melting Points & Electrical Conductivity', minutes: 10, blocks: [
    { type: 'p', text: 'The melting point pattern across Period 3 is NOT a simple increase or decrease — it depends on the TYPE OF BONDING and STRUCTURE, which changes dramatically across the period.' },
    { type: 'd', spec: meltingPointsSpec, caption: 'Melting points reflect bonding type' },
    { type: 'h', text: 'Explaining the pattern' },
    { type: 'ul', items: [
      'Na, Mg, Al: METALLIC bonding. Strong attraction between positive metal ions and a sea of delocalised electrons. M.p. increases Na → Mg → Al because: (1) charge on the cation increases (+1, +2, +3), (2) number of delocalised electrons increases, (3) ionic radius decreases. All three factors strengthen the metallic bond.',
      'Si: GIANT COVALENT structure (like diamond). Each Si atom is bonded to 4 others in a 3D network. Very strong covalent bonds throughout → very high m.p. (1687 °C).',
      'P₄, S₈, Cl₂, Ar: SIMPLE MOLECULAR structures held together by weak VAN DER WAALS (London) forces between molecules. Very low m.p. S₈ > P₄ > Cl₂ > Ar because S₈ has the most electrons → strongest London forces.',
    ]},
    { type: 'd', spec: conductivitySpec, caption: 'Only the metals (and Si partially) conduct electricity' },
    { type: 'h', text: 'Electrical conductivity' },
    { type: 'ul', items: [
      'Na, Mg, Al: good conductors — delocalised electrons carry charge. Al is the best conductor of the three.',
      'Si: semiconductor — a small number of electrons can be promoted to the conduction band. Conductivity increases with temperature (opposite to metals).',
      'P, S, Cl, Ar: non-conductors — no free electrons or mobile ions.',
    ]},
    { type: 'takeaway', items: [
      'M.p. Na < Mg < Al (metallic, increasing charge). Si very high (giant covalent).',
      'P₄, S₈, Cl₂, Ar: low m.p. (simple molecular, weak London forces).',
      'Conductivity: metals conduct; Si is a semiconductor; non-metals do not conduct.',
    ]},
  ]},

  // CH.5 — Reactions with oxygen
  { id: 'pd5', title: 'Reactions of Period 3 Elements with Oxygen', minutes: 8, blocks: [
    { type: 'p', text: 'All Period 3 elements (except Ar) react with oxygen to form oxides. The oxidation state in the oxide generally equals the group number, which increases from +1 (Na) to +6 (S, in SO₃).' },
    { type: 'd', spec: reactionsO2Spec, caption: 'Products and oxidation states when Period 3 elements burn in O₂' },
    { type: 'h', text: 'Observations' },
    { type: 'ul', items: [
      'Na burns with a YELLOW flame → white solid Na₂O (also forms Na₂O₂ peroxide in excess O₂).',
      'Mg burns with a brilliant WHITE flame → white powder MgO.',
      'Al burns only when powdered (oxide layer protects it) → white powder Al₂O₃.',
      'Si reacts slowly at very high temperatures → SiO₂ (quartz).',
      'P₄ burns spontaneously in air (white phosphorus) → white fumes of P₄O₁₀.',
      'S burns with a BLUE flame → colourless gas SO₂ (pungent smell).',
      'Cl₂ and Ar do not form stable oxides under normal conditions.',
    ]},
    { type: 'h', text: 'Oxidation state pattern' },
    { type: 'p', text: 'The maximum oxidation state in the oxide matches the group number: Na (+1), Mg (+2), Al (+3), Si (+4), P (+5), S (+6 in SO₃, +4 in SO₂). This reflects the number of electrons available for bonding in the outer shell.' },
    { type: 'takeaway', items: [
      'All Period 3 elements (except Ar) form oxides with O₂.',
      'Oxidation state = group number in the highest oxide.',
      'Observations vary: flames (Na yellow, Mg white, S blue), products (solids, gases).',
    ]},
  ]},

  // CH.6 — Reactions with chlorine and water
  { id: 'pd6', title: 'Reactions with Chlorine & Water', minutes: 9, blocks: [
    { type: 'p', text: 'Period 3 elements also react with chlorine to form chlorides, and some react with water (cold or steam).' },
    { type: 'h', text: 'Reactions with chlorine' },
    { type: 'ul', items: [
      '2Na + Cl₂ → 2NaCl (ionic, white solid, m.p. 801 °C).',
      'Mg + Cl₂ → MgCl₂ (ionic, white solid, m.p. 714 °C).',
      '2Al + 3Cl₂ → 2AlCl₃ (covalent when anhydrous; exists as Al₂Cl₆ dimer; sublimes at 178 °C).',
      'Si + 2Cl₂ → SiCl₄ (covalent liquid, b.p. 57 °C).',
      'P₄ + 6Cl₂ → 4PCl₃ (or P₄ + 10Cl₂ → 4PCl₅ in excess Cl₂). Both covalent.',
      'Oxidation state in chloride = group number: NaCl (+1), MgCl₂ (+2), AlCl₃ (+3), SiCl₄ (+4), PCl₅ (+5).',
    ]},
    { type: 'h', text: 'Reactions with water' },
    { type: 'ul', items: [
      'Na reacts VIGOROUSLY with cold water: 2Na + 2H₂O → 2NaOH + H₂. Fizzes, moves on the surface, may ignite.',
      'Mg reacts SLOWLY with cold water: Mg + 2H₂O → Mg(OH)₂ + H₂. Reacts faster with steam: Mg + H₂O → MgO + H₂.',
      'Al does NOT react with water under normal conditions — its oxide layer protects it. Will react with steam if the oxide layer is removed.',
      'Si, P, S, Cl, Ar: do not react with water (though Cl₂ disproportionates — covered in Group VII).',
    ]},
    { type: 'callout', kind: 'warning', title: 'Sodium in water', body: 'Na + water is extremely vigorous. The syllabus notes that sodium explodes in water — handle with extreme care in demonstrations. Never use large pieces.' },
    { type: 'takeaway', items: [
      'Chloride oxidation state = group number.',
      'Bonding: NaCl/MgCl₂ ionic; AlCl₃/SiCl₄/PCl₃ covalent.',
      'Na reacts vigorously with cold water; Mg slowly; Al protected by oxide layer.',
    ]},
  ]},

  // CH.7 — Acid-base behaviour of oxides
  { id: 'pd7', title: 'Acid-Base Behaviour of Period 3 Oxides', minutes: 10, blocks: [
    { type: 'p', text: 'The oxides of Period 3 show a clear trend in acid-base character: from strongly BASIC on the left, through AMPHOTERIC in the middle, to strongly ACIDIC on the right.' },
    { type: 'd', spec: oxidesAcidBaseSpec, caption: 'Acid-base character transitions across Period 3' },
    { type: 'h', text: 'Basic oxides: Na₂O and MgO' },
    { type: 'ul', items: [
      'Na₂O dissolves in water to give NaOH (strong alkali): Na₂O + H₂O → 2NaOH, pH ≈ 14.',
      'MgO is only slightly soluble — forms Mg(OH)₂ (weak base): MgO + H₂O → Mg(OH)₂, pH ≈ 9–10.',
      'Both react with acids: Na₂O + 2HCl → 2NaCl + H₂O; MgO + 2HCl → MgCl₂ + H₂O.',
    ]},
    { type: 'h', text: 'Amphoteric oxide: Al₂O₃' },
    { type: 'ul', items: [
      'Al₂O₃ does NOT dissolve in water.',
      'It reacts with ACIDS: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O (behaving as a base).',
      'It reacts with BASES: Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]⁻ (behaving as an acid).',
      'Amphoteric = reacts with both acids AND bases.',
    ]},
    { type: 'h', text: 'Acidic oxides: SiO₂, P₄O₁₀, SO₂, SO₃' },
    { type: 'ul', items: [
      'SiO₂ does NOT dissolve in water (giant covalent, insoluble). But it reacts with hot NaOH: SiO₂ + 2NaOH → Na₂SiO₃ + H₂O.',
      'P₄O₁₀ dissolves in water: P₄O₁₀ + 6H₂O → 4H₃PO₄ (phosphoric acid), pH ≈ 1.',
      'SO₂ dissolves: SO₂ + H₂O → H₂SO₃ (sulphurous acid), pH ≈ 2–3.',
      'SO₃ dissolves: SO₃ + H₂O → H₂SO₄ (sulphuric acid), pH ≈ 1.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why the trend?', body: 'Metal oxides are ionic (Na₂O, MgO) — the O²⁻ ion acts as a base (accepts H⁺). Non-metal oxides are covalent — they react with water to form acidic solutions by generating H⁺ ions. Al₂O₃ sits at the transition point with intermediate character.' },
    { type: 'takeaway', items: [
      'Left (Na₂O, MgO): basic. Middle (Al₂O₃): amphoteric. Right (SiO₂, P₄O₁₀, SO₃): acidic.',
      'Metal oxides have ionic bonding → basic. Non-metal oxides have covalent bonding → acidic.',
      'Al₂O₃ reacts with both acids AND bases.',
    ]},
  ]},

  // CH.8 — Reactions of chlorides with water
  { id: 'pd8', title: 'Chlorides with Water — Dissolve or Hydrolyse?', minutes: 9, blocks: [
    { type: 'p', text: 'The chlorides of Period 3 fall into two categories when added to water: the ionic ones DISSOLVE peacefully, while the covalent ones HYDROLYSE vigorously, producing HCl fumes and acidic solutions.' },
    { type: 'd', spec: chloridesSpec, caption: 'Period 3 chlorides: bonding, behaviour with water, pH' },
    { type: 'h', text: 'Ionic chlorides: NaCl, MgCl₂' },
    { type: 'ul', items: [
      'NaCl dissolves in water → Na⁺(aq) + Cl⁻(aq). Neutral solution, pH ≈ 7.',
      'MgCl₂ dissolves → Mg²⁺(aq) + 2Cl⁻(aq). Slightly acidic (pH ≈ 6.5) because Mg²⁺ is small and highly charged — it polarises surrounding water molecules, releasing some H⁺.',
      'No HCl fumes — the ions simply separate and hydrate.',
    ]},
    { type: 'h', text: 'Covalent chlorides: AlCl₃, SiCl₄, PCl₃, PCl₅' },
    { type: 'ul', items: [
      'These undergo HYDROLYSIS — the covalent bond to Cl is broken by water, producing HCl.',
      'AlCl₃ + 3H₂O → Al(OH)₃ + 3HCl. White fumes of HCl, strongly acidic solution (pH ≈ 3).',
      'SiCl₄ + 2H₂O → SiO₂ + 4HCl. Very vigorous, white fumes, strongly acidic (pH ≈ 2).',
      'PCl₃ + 3H₂O → H₃PO₃ + 3HCl. White fumes.',
      'PCl₅ + 4H₂O → H₃PO₄ + 5HCl. Even more vigorous.',
    ]},
    { type: 'h', text: 'Why the difference?' },
    { type: 'p', text: 'Ionic chlorides have strong ion-ion bonding that is broken by hydration (water surrounds the ions). No new bonds to water are formed by the chloride ion. Covalent chlorides have a central atom with vacant orbitals — water can attack (nucleophilic substitution), breaking the M–Cl bond and forming M–OH and H–Cl. This is hydrolysis.' },
    { type: 'takeaway', items: [
      'Ionic chlorides (NaCl, MgCl₂): dissolve, neutral to slightly acidic.',
      'Covalent chlorides (AlCl₃, SiCl₄, PCl₅): hydrolyse, produce HCl fumes, strongly acidic.',
      'Hydrolysis occurs because the central atom has accessible vacant orbitals.',
    ]},
  ]},

  // CH.9 — Deducing bonding from properties
  { id: 'pd9', title: 'Deducing Bonding from Physical & Chemical Properties', minutes: 8, blocks: [
    { type: 'p', text: 'A common exam question gives you data for an unknown oxide or chloride and asks you to deduce the type of bonding. Here is the systematic approach.' },
    { type: 'h', text: 'Physical property clues' },
    { type: 'ul', items: [
      'HIGH melting point (>1000 °C) + conducts when molten → IONIC (e.g. NaCl, MgO).',
      'VERY HIGH melting point + does NOT conduct when molten → GIANT COVALENT (e.g. SiO₂, diamond).',
      'LOW melting point + does NOT conduct → SIMPLE MOLECULAR (e.g. P₄O₁₀, SiCl₄, SO₂).',
      'Conducts as solid → METALLIC (delocalised electrons).',
    ]},
    { type: 'h', text: 'Chemical property clues' },
    { type: 'ul', items: [
      'Dissolves in water to give neutral/alkaline solution → ionic oxide or chloride of a metal.',
      'Reacts with water producing HCl fumes / acidic solution → covalent chloride.',
      'Dissolves in water to give acidic solution → covalent oxide of a non-metal.',
      'Insoluble in water but reacts with both acid and base → amphoteric (Al₂O₃).',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam approach', body: 'When given data: (1) Check m.p. — high or low? (2) Check conductivity — solid and/or molten? (3) Check pH of aqueous solution — acidic or alkaline? (4) Match to bonding type. Present your reasoning step by step for full marks.' },
    { type: 'takeaway', items: [
      'High m.p. + conducts molten → ionic. Very high m.p. + no conductivity → giant covalent.',
      'Low m.p. + no conductivity → simple molecular.',
      'pH of aqueous solution: alkaline → metal oxide; acidic → non-metal oxide.',
    ]},
  ]},

  // CH.10 — Exam technique
  { id: 'pd10', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Periodicity questions involve trends, explanations, and data interpretation. Here are the key exam patterns.' },
    { type: 'h', text: 'Trend explanations — what earns marks' },
    { type: 'ul', items: [
      'Atomic radius: state "nuclear charge increases" AND "shielding stays approximately the same" AND "greater effective nuclear charge pulls electrons closer". All three points are typically needed.',
      'IE₁ dips: for Al, state "electron removed from 3p not 3s" and "3p is higher energy". For S, state "electron removed from a paired 3p orbital" and "electron-electron repulsion".',
      'Melting points: identify the bonding type FIRST, then explain why that bonding gives high or low m.p.',
    ]},
    { type: 'h', text: 'Common mistakes' },
    { type: 'ul', items: [
      'Saying "more shielding across the period" — WRONG. Shielding is approximately constant (same inner core).',
      'Confusing dissolving with hydrolysis. NaCl dissolves (ions separate); SiCl₄ hydrolyses (bonds break, HCl forms).',
      'Forgetting that Al₂O₃ is AMPHOTERIC, not just basic or just acidic.',
      'Not specifying the oxidation state when writing formulas for oxides and chlorides.',
    ]},
    { type: 'h', text: 'Data interpretation questions' },
    { type: 'ul', items: [
      'If given a table of m.p. and conductivity data, group the elements by bonding type first.',
      'If asked to "sketch a graph" of IE₁ or m.p., include the dips/discontinuities — a smooth curve without them loses marks.',
      'When asked to predict, use the pattern to infer the answer for an element not explicitly covered.',
    ]},
    { type: 'takeaway', items: [
      'Always state both "↑ nuclear charge" AND "same shielding" for radius/IE trends.',
      'Dissolving ≠ hydrolysis. Know the difference.',
      'Al₂O₃ is amphoteric — this is a guaranteed exam point.',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 30 MCQs
   ============================================================ */
const quizzes = [
  { q: 'Atomic radius across Period 3 generally:', opts: ['Increases', 'Decreases', 'Stays the same', 'First increases then decreases'], ans: 1, hint: 'More protons, same shielding → electrons pulled closer.' },
  { q: 'The main reason for decreasing atomic radius across Period 3 is:', opts: ['Increasing number of electron shells', 'Increasing nuclear charge with similar shielding', 'Decreasing number of electrons', 'Increasing electron-electron repulsion'], ans: 1, hint: 'All elements have 3 shells; protons increase from 11 to 18.' },
  { q: 'Which Period 3 element has the smallest atomic radius?', opts: ['Na', 'Si', 'Cl', 'Ar'], ans: 2, hint: 'Cl has the highest effective nuclear charge among those that form bonds.' },
  { q: 'First ionisation energy generally _____ across Period 3.', opts: ['Decreases', 'Increases', 'Stays constant', 'Halves'], ans: 1, hint: 'Harder to remove electrons when nuclear charge is higher.' },
  { q: 'IE₁ of Al is lower than IE₁ of Mg because:', opts: ['Al has fewer protons', 'Al\'s outer electron is in a 3p orbital (higher energy than 3s)', 'Al has more shielding', 'Al is a larger atom'], ans: 1, hint: 'The 3p electron is easier to remove than a 3s electron.' },
  { q: 'IE₁ of S is lower than IE₁ of P because:', opts: ['S has fewer electrons', 'S has a paired 3p electron with extra repulsion', 'S is in a lower group', 'S has more protons'], ans: 1, hint: 'Paired electrons in the same orbital repel each other.' },
  { q: 'Which Period 3 element has the highest melting point?', opts: ['Na', 'Al', 'Si', 'S'], ans: 2, hint: 'Si has a giant covalent structure like diamond.' },
  { q: 'The low melting point of S₈ compared to Si is because:', opts: ['S has fewer electrons', 'S₈ is a simple molecular structure held by weak London forces', 'S has ionic bonding', 'S is a gas'], ans: 1, hint: 'Simple molecular substances have weak intermolecular forces.' },
  { q: 'Why does Al have a higher melting point than Na?', opts: ['Al has 3 delocalised electrons per atom, Na has 1', 'Al has covalent bonding', 'Al is a non-metal', 'Al has weaker metallic bonds'], ans: 0, hint: 'More delocalised electrons + higher cation charge = stronger metallic bonding.' },
  { q: 'Which Period 3 elements conduct electricity?', opts: ['Na, Mg, Al only', 'Na, Mg, Al, Si', 'All of them', 'None of them'], ans: 1, hint: 'Metals conduct well; Si is a semiconductor.' },
  { q: 'Na₂O is classified as:', opts: ['Acidic', 'Basic', 'Amphoteric', 'Neutral'], ans: 1, hint: 'Na₂O + H₂O → NaOH, which is alkaline.' },
  { q: 'Al₂O₃ is classified as:', opts: ['Acidic', 'Basic', 'Amphoteric', 'Neutral'], ans: 2, hint: 'Reacts with both acids AND bases.' },
  { q: 'P₄O₁₀ dissolves in water to form:', opts: ['NaOH', 'H₃PO₄', 'HCl', 'H₂O₂'], ans: 1, hint: 'A non-metal oxide of phosphorus → phosphoric acid.' },
  { q: 'SO₃ + H₂O produces:', opts: ['H₂SO₃', 'H₂SO₄', 'SO₂', 'Na₂SO₄'], ans: 1, hint: 'SO₃ is the anhydride of sulphuric acid.' },
  { q: 'The pH of the solution formed when Na₂O dissolves in water is approximately:', opts: ['1', '7', '14', '3'], ans: 2, hint: 'Na₂O + H₂O → 2NaOH, a strong alkali.' },
  { q: 'When SiCl₄ is added to water:', opts: ['It dissolves peacefully', 'It hydrolyses, producing HCl fumes', 'Nothing happens', 'It produces NaOH'], ans: 1, hint: 'Covalent chlorides hydrolyse.' },
  { q: 'NaCl added to water gives a solution with pH:', opts: ['1', '7', '14', '3'], ans: 1, hint: 'Ionic chloride dissolves without hydrolysis — neutral.' },
  { q: 'AlCl₃ is covalent when anhydrous because:', opts: ['Al is a non-metal', 'The small, highly charged Al³⁺ polarises Cl⁻ strongly', 'It has low melting point like ionic compounds', 'Cl is a metal'], ans: 1, hint: 'High charge density of Al³⁺ distorts the Cl⁻ electron cloud → covalent character.' },
  { q: 'The oxidation state of S in SO₃ is:', opts: ['+2', '+4', '+6', '−2'], ans: 2, hint: 'S + 3(−2) = 0, so S = +6.' },
  { q: 'The oxidation state of P in PCl₅ is:', opts: ['+3', '+4', '+5', '−3'], ans: 2, hint: 'P + 5(−1) = 0, so P = +5.' },
  { q: 'Na reacts with cold water to produce:', opts: ['NaCl + H₂', 'NaOH + H₂', 'Na₂O + H₂', 'NaH + O₂'], ans: 1, hint: '2Na + 2H₂O → 2NaOH + H₂.' },
  { q: 'Mg reacts more vigorously with:', opts: ['Cold water', 'Steam', 'Ice', 'Ethanol'], ans: 1, hint: 'Mg + H₂O(g) → MgO + H₂ — faster than cold water.' },
  { q: 'Which oxide does NOT dissolve in water?', opts: ['Na₂O', 'SO₃', 'SiO₂', 'P₄O₁₀'], ans: 2, hint: 'SiO₂ has a giant covalent structure — insoluble.' },
  { q: 'A compound has high m.p., conducts when molten but not when solid. The bonding is:', opts: ['Metallic', 'Ionic', 'Covalent', 'Simple molecular'], ans: 1, hint: 'Ions are mobile when molten but fixed in the solid lattice.' },
  { q: 'A compound has very high m.p. and does not conduct in any state. The bonding is:', opts: ['Ionic', 'Metallic', 'Giant covalent', 'Simple molecular'], ans: 2, hint: 'No mobile charge carriers; very strong bonds throughout.' },
  { q: 'A substance with low m.p. that does not conduct is likely:', opts: ['Ionic', 'Metallic', 'Giant covalent', 'Simple molecular'], ans: 3, hint: 'Weak intermolecular forces, no free electrons or ions.' },
  { q: 'The trend in acid-base character of Period 3 oxides is:', opts: ['All acidic', 'All basic', 'Basic → amphoteric → acidic', 'Acidic → basic'], ans: 2, hint: 'Left = metal oxides (basic), right = non-metal oxides (acidic).' },
  { q: 'Hydrolysis of a chloride means:', opts: ['Dissolving in water without reaction', 'Reacting with water, breaking M-Cl bonds', 'Melting in water', 'Evaporating from water'], ans: 1, hint: 'Hydrolysis = water breaks covalent bonds, producing HCl.' },
  { q: 'Which chloride produces HCl fumes when added to water?', opts: ['NaCl', 'MgCl₂', 'PCl₅', 'KCl'], ans: 2, hint: 'PCl₅ is covalent and hydrolyses vigorously.' },
  { q: 'The structure of silicon dioxide is best described as:', opts: ['Simple molecular', 'Giant ionic', 'Giant covalent', 'Metallic'], ans: 2, hint: 'Each Si is bonded to 4 O atoms in a 3D network — like diamond.' },
];

/* ============================================================
   Structured questions — 6
   ============================================================ */
const structured = [
  { title: 'Atomic radius and IE trends', marks: 8, q: 'Consider the elements Na to Ar in Period 3.', parts: [
    { q: '(a) Describe and explain the trend in atomic radius across Period 3.', marks: 3, ans: 'Atomic radius decreases from Na to Cl. Across the period, the number of protons (nuclear charge) increases from 11 to 17. The electrons are added to the same shell (n = 3), so the shielding from inner shells (1s²2s²2p⁶) remains approximately constant. The increasing effective nuclear charge pulls the outer electrons closer to the nucleus, reducing the atomic radius.' },
    { q: '(b) Explain why the first ionisation energy of Al is lower than that of Mg.', marks: 3, ans: 'Mg has the configuration [Ne] 3s². The electron removed is from a full 3s subshell, which is relatively close to the nucleus and has no node. Al has [Ne] 3s²3p¹. The electron removed is from the 3p subshell, which is at a higher energy level and slightly further from the nucleus than 3s. Despite Al having one more proton, the 3p electron is easier to remove because it is in a higher-energy subshell with greater shielding from the 3s electrons.' },
    { q: '(c) Explain why IE₁ of S is lower than that of P.', marks: 2, ans: 'P has [Ne] 3s²3p³ with all three 3p electrons unpaired (one in each orbital). S has [Ne] 3s²3p⁴ with one pair of electrons in the same 3p orbital. The paired electron in S experiences electron-electron repulsion within the shared orbital, making it easier to remove. Therefore IE₁(S) < IE₁(P) despite S having a higher nuclear charge.' },
  ]},
  { title: 'Melting points across Period 3', marks: 8, q: 'The melting points (°C) of Period 3 elements are: Na 98, Mg 650, Al 660, Si 1414, P 44, S 113, Cl −101, Ar −189.', parts: [
    { q: '(a) Explain why the melting point increases from Na to Al.', marks: 3, ans: 'Na, Mg and Al have metallic bonding. The strength of metallic bonding increases because: (1) the charge on the cation increases (+1 → +2 → +3), (2) the number of delocalised electrons per atom increases (1 → 2 → 3), and (3) the ionic radius decreases (Na⁺ > Mg²⁺ > Al³⁺). All three factors increase the electrostatic attraction between the cations and the sea of electrons, raising the melting point.' },
    { q: '(b) Explain why Si has the highest melting point.', marks: 2, ans: 'Si has a giant covalent (macromolecular) structure similar to diamond. Each Si atom is covalently bonded to 4 others in a tetrahedral arrangement throughout the 3D lattice. Strong covalent bonds must be broken to melt the structure, requiring a very large amount of energy.' },
    { q: '(c) Explain why the melting points of P, S, Cl and Ar are much lower than Si.', marks: 3, ans: 'These elements form simple molecular structures: P₄, S₈, Cl₂, and Ar (monatomic). The molecules are held together by weak van der Waals (London) forces, which require very little energy to overcome. S₈ has the highest m.p. among these because it has the most electrons → strongest London forces. Ar has the weakest London forces (monatomic, fewest electrons) → lowest m.p.' },
  ]},
  { title: 'Oxides acid-base behaviour', marks: 9, q: 'Consider the oxides Na₂O, Al₂O₃, and SO₃.', parts: [
    { q: '(a) Write the equation for the reaction of Na₂O with water and state the pH of the solution.', marks: 2, ans: 'Na₂O(s) + H₂O(l) → 2NaOH(aq). pH ≈ 13–14 (strongly alkaline).' },
    { q: '(b) Write the equation for the reaction of SO₃ with water and state the pH.', marks: 2, ans: 'SO₃(g) + H₂O(l) → H₂SO₄(aq). pH ≈ 1 (strongly acidic).' },
    { q: '(c) Al₂O₃ is described as amphoteric. Write equations to show its reaction with (i) dilute HCl and (ii) aqueous NaOH.', marks: 3, ans: '(i) Al₂O₃(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂O(l). (ii) Al₂O₃(s) + 2NaOH(aq) + 3H₂O(l) → 2Na[Al(OH)₄]⁻(aq) (sodium tetrahydroxoaluminate).' },
    { q: '(d) Explain, in terms of bonding, why Na₂O is basic and SO₃ is acidic.', marks: 2, ans: 'Na₂O is ionic — it contains the O²⁻ ion, which is a strong base (proton acceptor). When dissolved, O²⁻ reacts with water: O²⁻ + H₂O → 2OH⁻, making the solution alkaline. SO₃ is covalently bonded — when it reacts with water, it forms S–O–H bonds, producing H₂SO₄, which fully dissociates to release H⁺ ions, making the solution acidic.' },
  ]},
  { title: 'Chlorides with water', marks: 8, q: 'NaCl and SiCl₄ are both Period 3 chlorides but behave very differently when added to water.', parts: [
    { q: '(a) Describe what you would observe when NaCl is added to water.', marks: 1, ans: 'NaCl dissolves to form a colourless solution. No gas is evolved, no fumes.' },
    { q: '(b) Describe what you would observe when SiCl₄ is added to water.', marks: 2, ans: 'Vigorous reaction producing white fumes of HCl. A white solid/precipitate of SiO₂ (hydrated silicon dioxide) may form. The resulting solution is strongly acidic.' },
    { q: '(c) Write the equation for the reaction of SiCl₄ with water.', marks: 1, ans: 'SiCl₄(l) + 2H₂O(l) → SiO₂(s) + 4HCl(g).' },
    { q: '(d) Explain why NaCl dissolves but SiCl₄ hydrolyses.', marks: 3, ans: 'NaCl is ionic — the Na⁺ and Cl⁻ ions are separated and surrounded by water molecules (hydration). No bonds are broken in the NaCl — it simply dissolves. SiCl₄ is covalent. Silicon has vacant 3d orbitals that can accept a lone pair from water (nucleophilic attack). Water attacks the Si, forming Si–O bonds and breaking Si–Cl bonds, releasing HCl. This is hydrolysis — covalent bonds are broken and new ones formed.' },
    { q: '(e) State the pH of each resulting solution.', marks: 1, ans: 'NaCl: pH ≈ 7 (neutral). SiCl₄: pH ≈ 1–2 (strongly acidic due to HCl produced).' },
  ]},
  { title: 'Reactions with oxygen', marks: 7, q: 'Period 3 elements react with oxygen to form oxides.', parts: [
    { q: '(a) Write balanced equations for the reactions of Mg and S with oxygen.', marks: 2, ans: '2Mg(s) + O₂(g) → 2MgO(s). S(s) + O₂(g) → SO₂(g).' },
    { q: '(b) Describe the flame colour observed when (i) Mg and (ii) S burn in oxygen.', marks: 2, ans: '(i) Mg burns with an intense bright white flame. (ii) S burns with a blue flame.' },
    { q: '(c) State the oxidation state of the metal/non-metal in each oxide.', marks: 1, ans: 'Mg in MgO: +2. S in SO₂: +4.' },
    { q: '(d) Classify each oxide as acidic, basic, or amphoteric, and justify.', marks: 2, ans: 'MgO is basic — it is an ionic oxide of a metal; O²⁻ reacts with water to form OH⁻. SO₂ is acidic — it is a covalent oxide of a non-metal; it dissolves in water to form sulphurous acid (H₂SO₃), which releases H⁺.' },
  ]},
  { title: 'Deducing bonding', marks: 7, q: 'Compound X has m.p. 2050 °C, does not conduct as a solid or when molten, and is insoluble in water. Compound Y has m.p. −34 °C, does not conduct, and produces a strongly acidic solution when dissolved in water.', parts: [
    { q: '(a) Deduce the type of bonding in compound X and justify.', marks: 2, ans: 'Giant covalent. Very high m.p. indicates very strong bonds throughout the structure. Does not conduct in any state → no free electrons or ions. This rules out ionic (would conduct molten) and metallic (would conduct solid). Compound X could be SiO₂.' },
    { q: '(b) Deduce the type of bonding in compound Y and justify.', marks: 2, ans: 'Simple molecular (covalent). Very low m.p. → weak intermolecular forces. Does not conduct → no free charges. Produces acidic solution → non-metal oxide or covalent chloride. Compound Y could be HCl or SO₂.' },
    { q: '(c) Name one Period 3 compound that could be X and one that could be Y.', marks: 1, ans: 'X could be SiO₂ (silicon dioxide). Y could be PCl₃ or SO₂.' },
    { q: '(d) Explain why compound X has a much higher melting point than compound Y.', marks: 2, ans: 'X has a giant covalent structure with strong covalent bonds in all directions — a large amount of energy is needed to break these bonds. Y is a simple molecular substance held together by weak van der Waals forces — very little energy needed to separate the molecules.' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Explain atomic radius trend', diff: 'easy', q: 'Explain why the atomic radius of Cl is smaller than that of Na.', steps: [
    { label: 'STEP 1', text: 'Na has 11 protons; Cl has 17 protons.' },
    { label: 'STEP 2', text: 'Both have the same inner electron configuration (1s²2s²2p⁶), so shielding from inner shells is approximately the same.' },
    { label: 'STEP 3', text: 'Cl has a greater effective nuclear charge than Na, so the outer electrons (in the same n = 3 shell) are pulled closer to the nucleus.' },
    { label: 'STEP 4', text: 'Therefore Cl has a smaller atomic radius than Na.' },
  ], ans: 'Cl is smaller because it has higher nuclear charge with similar shielding, giving greater effective nuclear charge.' },

  { title: 'Explain the Al dip in IE₁', diff: 'medium', q: 'Explain why IE₁(Al) < IE₁(Mg) despite Al having a higher nuclear charge.', steps: [
    { label: 'STEP 1', text: 'Mg: [Ne] 3s². The electron removed is from the 3s subshell.' },
    { label: 'STEP 2', text: 'Al: [Ne] 3s²3p¹. The electron removed is from the 3p subshell.' },
    { label: 'STEP 3', text: 'The 3p subshell is at a higher energy than 3s and is further from the nucleus, with additional shielding from the 3s electrons.' },
    { label: 'STEP 4', text: 'Therefore the 3p electron in Al requires less energy to remove than the 3s electron in Mg, despite Al having one more proton.' },
  ], ans: 'Al\'s 3p electron is in a higher-energy subshell than Mg\'s 3s electron, making it easier to remove.' },

  { title: 'Predict product of P₄O₁₀ + water', diff: 'easy', q: 'Write the equation and predict the pH when P₄O₁₀ is added to water.', steps: [
    { label: 'STEP 1', text: 'P₄O₁₀ is a non-metal oxide → likely acidic.' },
    { label: 'STEP 2', text: 'Equation: P₄O₁₀ + 6H₂O → 4H₃PO₄.' },
    { label: 'STEP 3', text: 'H₃PO₄ is phosphoric acid → solution is acidic, pH ≈ 1–2.' },
  ], ans: 'P₄O₁₀ + 6H₂O → 4H₃PO₄. pH ≈ 1–2 (strongly acidic).' },

  { title: 'Explain m.p. pattern Na-Mg-Al-Si', diff: 'medium', q: 'Explain why m.p. increases in the order Na < Mg < Al << Si.', steps: [
    { label: 'STEP 1', text: 'Na, Mg, Al: metallic bonding. Strength increases because cation charge increases (+1, +2, +3), number of delocalised electrons increases, and cation radius decreases.' },
    { label: 'STEP 2', text: 'All three factors strengthen the metallic bond → higher m.p. from Na to Al.' },
    { label: 'STEP 3', text: 'Si has a giant covalent structure — each Si atom bonded to 4 others in a 3D network. Very strong covalent bonds must be broken → much higher m.p. than the metals.' },
  ], ans: 'Na < Mg < Al: increasing metallic bond strength. Si: giant covalent → very high m.p.' },

  { title: 'Hydrolysis of AlCl₃', diff: 'medium', q: 'Write the equation for the hydrolysis of AlCl₃ and explain why it hydrolyses while NaCl does not.', steps: [
    { label: 'STEP 1', text: 'AlCl₃ + 3H₂O → Al(OH)₃ + 3HCl.' },
    { label: 'STEP 2', text: 'AlCl₃ is covalent when anhydrous. Al has vacant 3d orbitals accessible to lone pairs on water → nucleophilic attack occurs.' },
    { label: 'STEP 3', text: 'Water breaks the Al–Cl bonds, forming Al–OH bonds and releasing HCl.' },
    { label: 'STEP 4', text: 'NaCl is ionic. Na⁺ and Cl⁻ simply separate and are hydrated — no covalent bonds are broken.' },
  ], ans: 'AlCl₃ hydrolyses because it is covalent with accessible vacant orbitals. NaCl dissolves peacefully because it is ionic.' },

  { title: 'Compare Na₂O and SiO₂ with NaOH', diff: 'medium', q: 'Explain why Na₂O dissolves in water but SiO₂ does not.', steps: [
    { label: 'STEP 1', text: 'Na₂O is ionic: Na⁺ and O²⁻ ions. O²⁻ reacts with water (O²⁻ + H₂O → 2OH⁻) — exothermic, drives dissolving.' },
    { label: 'STEP 2', text: 'SiO₂ is giant covalent: every Si is bonded to 4 O atoms in a 3D network. Very strong Si–O bonds (452 kJ mol⁻¹) would need to be broken for dissolving.' },
    { label: 'STEP 3', text: 'The energy released by hydration of any resulting species is far less than the energy needed to break the lattice → SiO₂ is insoluble in water.' },
  ], ans: 'Na₂O: ionic, O²⁻ reacts readily with water. SiO₂: giant covalent, Si–O bonds too strong to break.' },

  { title: 'Deduce bonding from data', diff: 'hard', q: 'A chloride Z has m.p. 714 °C, conducts when molten, and dissolves in water to give pH 6.5. Identify the bonding and suggest a formula.', steps: [
    { label: 'STEP 1', text: 'High m.p. (714 °C) suggests strong bonding — either ionic or giant covalent.' },
    { label: 'STEP 2', text: 'Conducts when molten → mobile ions present → ionic bonding. Giant covalent would not conduct.' },
    { label: 'STEP 3', text: 'Dissolves in water to give slightly acidic pH (6.5) → not strongly acidic (rules out covalent chlorides that hydrolyse to pH 1–3). Slightly acidic because of polarisation of water by a small, highly charged cation.' },
    { label: 'STEP 4', text: 'Likely formula: MgCl₂ (ionic, m.p. 714 °C, slightly acidic due to Mg²⁺ polarising water).' },
  ], ans: 'Ionic bonding. Compound Z is MgCl₂.' },

  { title: 'Compare ionic radii', diff: 'medium', q: 'Arrange the isoelectronic species Na⁺, Mg²⁺, O²⁻, F⁻ in order of increasing ionic radius.', steps: [
    { label: 'STEP 1', text: 'All have 10 electrons (isoelectronic with Ne).' },
    { label: 'STEP 2', text: 'Nuclear charges: O = 8, F = 9, Na = 11, Mg = 12.' },
    { label: 'STEP 3', text: 'More protons → stronger pull on the same number of electrons → smaller radius.' },
    { label: 'STEP 4', text: 'Order: Mg²⁺ < Na⁺ < F⁻ < O²⁻.' },
  ], ans: 'Mg²⁺ (smallest) < Na⁺ < F⁻ < O²⁻ (largest).' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const PERIODICITY = {
  id: 'periodicity',
  objectives: [
    'Describe and explain trends in atomic radius, ionic radius and first ionisation energy across Period 3',
    'Explain the dips in IE₁ at Al and S using subshell and pairing arguments',
    'Interpret melting point and electrical conductivity trends in terms of bonding and structure',
    'Write equations for the reactions of Period 3 elements with O₂, Cl₂ and H₂O',
    'State the oxidation states of Period 3 elements in their oxides and chlorides',
    'Describe and explain the acid-base behaviour of Period 3 oxides (basic → amphoteric → acidic)',
    'Explain why ionic chlorides dissolve but covalent chlorides hydrolyse',
    'Deduce the type of bonding in oxides and chlorides from physical and chemical data',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through why IE₁ dips at Al and S',
    'Explain the melting point pattern across Period 3 step by step',
    'Why does Al₂O₃ react with both acids and bases?',
    'What happens when SiCl₄ meets water? Explain the mechanism.',
    'Give me a data-interpretation question where I deduce bonding type',
  ],
};
