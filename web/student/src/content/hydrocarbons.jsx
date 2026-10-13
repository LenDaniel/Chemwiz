// Hydrocarbons — OC-14 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.3 — Topic 14 (Hydrocarbons)
// Full syllabus coverage including:
//   - IUPAC nomenclature and displayed formulae for C1–C10
//   - All forms of isomerism
//   - Crude oil, natural gas, fractional distillation, cracking
//   - Physical property trends (volatility ↓ with chain length)
//   - Reactions of ethane (combustion + radical chlorination)
//   - Reactions of ethene (ALL six from syllabus)
//   - Benzene + methylbenzene (electrophilic substitution, directing effects)
//   - Ring vs side-chain halogenation of arenes
//   - Industrial uses + environmental impact
//   - Halogenoalkane connection (bridge to OC-15)

/* ============================================================
   Diagram specs (Phase K3.6 migration)
   Unused legacy JSX removed in K-Cleanup; active specs are unchanged.
   ============================================================ */
const alkanesSpec = {
  title: 'THE ALKANE HOMOLOGOUS SERIES',
  blocks: [
    { type: 'table', headers: ['Formula','Name','C atoms','Typical use'], rows: [
      ['CH₄','Methane','C₁','gas · fuel'], ['C₂H₆','Ethane','C₂','gas · LPG'],
      ['C₃H₈','Propane','C₃','gas · LPG'], ['C₄H₁₀','Butane','C₄','gas · LPG'],
      ['C₅H₁₂','Pentane','C₅','liquid'], ['C₈H₁₈','Octane','C₈','petrol'],
    ]},
    { type: 'equation', text: 'General formula: CₙH₂ₙ₊₂', big: true },
    { type: 'note', text: 'CH₂ is added each step → homologous series' },
    { type: 'note', text: 'As chain length increases: volatility ↓ · boiling point ↑ · viscosity ↑', emphasis: true },
  ],
};

const benzeneSpec = {
  title: 'BENZENE · C₆H₆',
  blocks: [
    { type: 'compare', left: { title: 'Kekulé model', color: 'primary', body: ['alternating C=C and C–C','two equivalent resonance forms'] }, right: { title: 'Delocalised model', color: 'accent', body: ['6 π electrons shared','continuous electron density around ring'] } },
    { type: 'equation', text: 'Kekulé  ↔  delocalised ring' },
    { type: 'note', text: 'All six C–C bonds are equal (~139 pm), intermediate between single and double.', emphasis: true },
  ],
};

const cisTransSpec = {
  title: 'GEOMETRIC ISOMERISM · BUT-2-ENE',
  blocks: [
    { type: 'compare', left: { title: 'cis-but-2-ene', color: 'primary', body: ['CH₃ groups on the same side','H atoms on the same side'] }, right: { title: 'trans-but-2-ene', color: 'accent', body: ['CH₃ groups on opposite sides','H atoms on opposite sides'] } },
    { type: 'note', text: 'Restricted rotation around C=C fixes two different arrangements.', emphasis: true },
  ],
};

const fractionalDistillationSpec = {
  title: 'FRACTIONATING COLUMN',
  subtitle: 'Hot crude vapour rises; the column becomes cooler towards the top.',
  blocks: [
    { type: 'table', headers: ['Fraction','Boiling range','Column position'], rows: [
      ['Refinery gas','<40 °C','top'], ['Petrol','40–100 °C','high'], ['Naphtha','100–150 °C','upper-mid'],
      ['Kerosene','150–250 °C','mid'], ['Diesel','250–350 °C','lower'], ['Bitumen','>350 °C','bottom'],
    ]},
    { type: 'note', text: 'Fractions condense where column temperature falls below their boiling range.', emphasis: true },
  ],
};

const crackingSpec = {
  title: 'CATALYTIC CRACKING',
  blocks: [
    { type: 'equation', text: 'C₁₀H₂₂  →  C₈H₁₈ + C₂H₄', big: true },
    { type: 'panel', title: 'Conditions', body: ['Al₂O₃ / silica catalyst','high temperature (~700 °C)'], color: 'primary' },
    { type: 'compare', left: { title: 'Feed', body: ['long-chain alkane','less useful / lower demand'] }, right: { title: 'Products', color: 'accent', body: ['shorter-chain alkane (petrol)','alkene feedstock'] } },
    { type: 'note', text: 'Cracking converts less useful long chains into petrol-range alkanes and alkenes.', emphasis: true },
  ],
};

const bromineTestSpec = {
  title: 'BROMINE-WATER TEST FOR C=C',
  blocks: [
    { type: 'compare', left: { title: 'ALKANE + Br₂(aq)', color: '#ff6b35', body: ['orange colour remains','no reaction without UV'] }, right: { title: 'ALKENE + Br₂(aq)', color: 'primary', body: ['orange → colourless','Br₂ adds across C=C'] } },
    { type: 'note', text: 'Rapid decolourisation at room temperature confirms unsaturation.', emphasis: true },
  ],
};

const radicalMechanismSpec = {
  title: 'FREE-RADICAL SUBSTITUTION · C₂H₆ + Cl₂',
  blocks: [
    { type: 'panel', title: 'INITIATION', body: ['Cl–Cl → 2Cl•','UV light causes homolytic fission'], color: 'accent' },
    { type: 'panel', title: 'PROPAGATION', body: ['Cl• + C₂H₆ → C₂H₅• + HCl','C₂H₅• + Cl₂ → C₂H₅Cl + Cl•','radical is regenerated; chain continues'], color: 'primary' },
    { type: 'panel', title: 'TERMINATION', body: ['Cl• + Cl• → Cl₂','C₂H₅• + C₂H₅• → C₄H₁₀'], color: 'pink' },
  ],
};

const electrophilicAdditionSpec = {
  title: 'ELECTROPHILIC ADDITION · C₂H₄ + HBr',
  blocks: [
    { type: 'steps', items: [
      { number: '1', body: 'π electrons attack δ⁺ H; H–Br bond breaks heterolytically', color: 'primary' },
      { number: '2', body: 'CH₃–CH₂⁺ carbocation forms together with Br⁻', color: 'accent' },
      { number: '3', body: 'Br⁻ lone pair attacks C⁺ → CH₃–CH₂Br', color: 'green' },
    ]},
    { type: 'note', text: 'Electrophile = δ⁺ H of HBr.', emphasis: true },
  ],
};

const bromoniumSpec = {
  title: 'Br₂ ADDITION · BROMONIUM-ION PATHWAY',
  blocks: [
    { type: 'steps', items: [
      { body: 'C=C polarises Br₂: near Br becomes δ⁺, far Br becomes δ⁻', color: 'primary' },
      { body: 'π attack forms a three-membered cyclic bromonium ion; Br⁻ leaves', color: 'accent' },
      { body: 'Br⁻ attacks from the opposite face → anti-addition', color: 'pink' },
    ]},
    { type: 'equation', text: 'CH₂=CH₂ + Br₂ → BrCH₂–CH₂Br' },
    { type: 'note', text: 'Product: 1,2-dibromoethane.', emphasis: true },
  ],
};

const markovnikovSpec = {
  title: "MARKOVNIKOV'S RULE · HBr + PROPENE",
  blocks: [
    { type: 'equation', text: 'CH₃–CH=CH₂ + HBr → ?' },
    { type: 'compare', left: { title: 'MAJOR ✓', color: 'green', body: ['CH₃–CHBr–CH₃','via 2° carbocation','more stable intermediate'] }, right: { title: 'MINOR ✗', color: 'red', body: ['CH₃–CH₂–CH₂Br','via 1° carbocation','less stable intermediate'] } },
    { type: 'note', text: 'H adds to the C already bearing more H atoms; the more stable carbocation gives the major product.', emphasis: true },
  ],
};

const kmno4Spec = {
  title: 'KMnO₄ OXIDATION OF ALKENES',
  blocks: [
    { type: 'compare', left: { title: 'COLD, DILUTE, ALKALINE', color: 'accent', body: ['CH₂=CH₂ → HOCH₂–CH₂OH','forms a vicinal diol','purple → green/brown'] }, right: { title: 'HOT, CONCENTRATED, ACIDIC', color: 'pink', body: ['CH₂=CH–CH₃ → CO₂ + CH₃COOH','oxidative cleavage of C=C','purple → colourless'] } },
    { type: 'note', text: 'Mild conditions add –OH groups; vigorous conditions cleave the double bond.', emphasis: true },
  ],
};

const electrophilicSubstitutionSpec = {
  title: 'ELECTROPHILIC SUBSTITUTION · BENZENE + Br₂',
  blocks: [
    { type: 'steps', items: [
      { body: 'Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻  (electrophile generated)', color: 'accent' },
      { body: 'Br⁺ attacks the benzene π system → cyclohexadienyl cation', color: 'primary' },
      { body: 'FeBr₄⁻ removes H⁺ → C₆H₅Br + HBr; FeBr₃ regenerated', color: 'green' },
    ]},
    { type: 'note', text: 'Aromaticity is restored: substitution occurs rather than addition.', emphasis: true },
  ],
};

const nitrationSpec = {
  title: 'NITRATION OF BENZENE',
  blocks: [
    { type: 'panel', title: 'GENERATE NO₂⁺', body: ['HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺'], color: 'accent' },
    { type: 'equation', text: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O', big: true },
    { type: 'panel', title: 'Conditions', body: ['conc. HNO₃ / conc. H₂SO₄','about 55 °C'], color: 'primary' },
    { type: 'note', text: 'Nitrobenzene is an important route to phenylamine (aniline) and dyes.', emphasis: true },
  ],
};

const directingSpec = {
  title: 'METHYLBENZENE · –CH₃ DIRECTS ORTHO/PARA',
  blocks: [
    { type: 'table', headers: ['Position','Ring number','Effect'], rows: [
      ['ortho','2,6','favoured'], ['meta','3,5','less favoured'], ['para','4','favoured'],
    ], rowColors: ['green','dim','green'] },
    { type: 'panel', title: 'WHY?', body: ['–CH₃ is electron-donating (+I)','it stabilises the intermediate cation at ortho/para positions','the ring is activated and reacts faster than benzene'], color: 'accent' },
    { type: 'note', text: 'Major products are the ortho and para isomers.', emphasis: true },
  ],
};

const ringVsSideSpec = {
  title: 'METHYLBENZENE + Cl₂ · CONDITIONS DECIDE',
  blocks: [
    { type: 'compare', left: { title: 'RING HALOGENATION', color: 'accent', body: ['Cl₂ / FeCl₃','dark, cold','electrophilic substitution','2- or 4-chloromethylbenzene + HCl'] }, right: { title: 'SIDE-CHAIN HALOGENATION', color: 'primary', body: ['Cl₂ / UV light','no FeCl₃','free-radical substitution','C₆H₅CH₂Cl + HCl'] } },
    { type: 'note', text: 'Mnemonic: dark + catalyst → ring; UV → side chain.', emphasis: true },
  ],
};

/* ============================================================
   Chapters (13)
   ============================================================ */

const chapters = [
  // CH.1 — Nomenclature
  { id: 'h1', title: 'Nomenclature (C1–C10)', minutes: 14, blocks: [
    { type: 'p', text: 'Every organic compound has a systematic IUPAC name that tells you its structure exactly. Master nomenclature and you unlock half of organic chemistry — every mechanism, test, and synthesis depends on knowing what you\'re looking at.' },
    { type: 'h', text: 'The three hydrocarbon families' },
    { type: 'ul', items: [
      'Alkanes — saturated (only single C-C bonds). General formula CₙH₂ₙ₊₂. Suffix -ane.',
      'Alkenes — one or more C=C double bonds. General formula CₙH₂ₙ (for one C=C). Suffix -ene.',
      'Arenes — contain a benzene ring. Based on C₆H₆.',
    ]},
    { type: 'd', spec: alkanesSpec, caption: 'The alkane homologous series' },
    { type: 'h', text: 'IUPAC rules — three steps' },
    { type: 'ul', items: [
      'Find the longest carbon chain containing the functional group. That is the parent name.',
      'Number the chain to give the functional group the LOWEST possible locant. C=C wins over branches.',
      'Name and locate each substituent alphabetically as a prefix (methyl, ethyl, chloro, bromo…).',
    ]},
    { type: 'callout', kind: 'key', title: 'Stem names C1–C10', body: 'meth- eth- prop- but- pent- hex- hept- oct- non- dec-. Learn these cold.' },
    { type: 'h', text: 'Worked examples' },
    { type: 'ul', items: [
      'CH₃CH(CH₃)CH₂CH₃   →   2-methylbutane',
      'CH₃CH=CHCH₂CH₃    →   pent-2-ene',
      'C₆H₅CH₃             →   methylbenzene (traditional: toluene)',
    ]},
    { type: 'takeaway', items: [
      'Longest chain = parent. Lowest locant = priority. Alphabetical prefix = substituent.',
      'Suffix changes with family: -ane, -ene, -yne.',
      'For C=C in C4+, always specify the position (but-1-ene vs but-2-ene).',
    ]},
  ]},

  // CH.2 — Isomerism
  { id: 'h2', title: 'Isomerism', minutes: 12, blocks: [
    { type: 'p', text: 'Isomers are compounds with the same molecular formula but different structures. Even a small molecule like C₄H₁₀ has two isomers; C₅H₁₂ has three; C₁₀H₂₂ has 75.' },
    { type: 'h', text: 'Structural isomerism' },
    { type: 'ul', items: [
      'Chain — different skeleton. butane vs 2-methylpropane (both C₄H₁₀).',
      'Positional — same skeleton, functional group in a different position. but-1-ene vs but-2-ene.',
      'Functional group — same formula, different class. C₂H₆O can be ethanol or methoxymethane.',
    ]},
    { type: 'h', text: 'Stereoisomerism — cis/trans' },
    { type: 'p', text: 'Alkenes cannot rotate around their C=C double bond — it\'s held rigid by the π overlap. That locks substituents on either side of the bond into one of two fixed positions.' },
    { type: 'd', spec: cisTransSpec, caption: 'cis vs trans but-2-ene' },
    { type: 'callout', kind: 'definition', title: 'Requirement for cis/trans isomerism', body: 'The C=C must have TWO different groups on each carbon. CH₂=CHCl has only one isomer — one carbon has two Hs. CH₃CH=CHCH₃ has cis and trans.' },
    { type: 'callout', kind: 'key', title: 'Physical differences', body: 'cis and trans isomers have slightly different boiling points, melting points, and (for polar molecules) different dipole moments. cis generally has a net dipole; trans often cancels to zero.' },
    { type: 'takeaway', items: [
      'Same molecular formula ≠ same molecule.',
      'Structural (chain/positional/functional-group) vs stereo (cis/trans).',
      'cis/trans needs restricted rotation AND two different groups on each C=C carbon.',
    ]},
  ]},

  // CH.3 — Crude oil and cracking
  { id: 'h3', title: 'Crude Oil, Natural Gas & Cracking', minutes: 11, blocks: [
    { type: 'p', text: 'Crude oil is a mixture of hundreds of hydrocarbons. On its own it\'s useless — you have to separate it into fractions with similar boiling points. That\'s done in a fractionating column, relying on the fact that smaller molecules have weaker Van der Waals forces and so boil first.' },
    { type: 'd', spec: fractionalDistillationSpec, caption: 'Fractional distillation of crude oil' },
    { type: 'h', text: 'The trick of fractionation' },
    { type: 'ul', items: [
      'Crude is heated to ~350 °C. Everything vapourises except the heaviest residue (bitumen).',
      'Vapours rise through the column. The column is HOT at the bottom, COOL at the top.',
      'Each fraction condenses at its level — heaviest at the base, lightest at the top.',
    ]},
    { type: 'h', text: 'Cracking — turning big into small' },
    { type: 'p', text: 'Demand for petrol and alkenes far exceeds demand for kerosene, diesel, and heavier fractions. Cracking breaks long alkane chains into shorter alkanes + an alkene (which is also useful as a polymer feedstock).' },
    { type: 'd', spec: crackingSpec, caption: 'Catalytic cracking of decane' },
    { type: 'ul', items: [
      'Thermal cracking — high T, high P. Free-radical mechanism. More alkenes.',
      'Catalytic cracking — Al₂O₃ / zeolite, ~700 °C. Carbocation mechanism. More branched alkanes for petrol.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why cracking matters', body: 'It converts low-demand heavy fractions into high-demand petrol and the alkene feedstock (ethene, propene) used to make plastics.' },
  ]},

  // CH.4 — Physical properties
  { id: 'h4', title: 'Physical Properties', minutes: 8, blocks: [
    { type: 'p', text: 'Hydrocarbons are non-polar. Their physical properties are dictated by Van der Waals (dispersion) forces between molecules, which scale with surface area and electron count.' },
    { type: 'h', text: 'Trends along the homologous series' },
    { type: 'ul', items: [
      'Boiling point rises by ~20–30 °C per CH₂ added (more electrons → stronger Van der Waals).',
      'C₁–C₄ gases at room temp. C₅–C₁₆ liquids. C₁₇+ solids (waxes).',
      'Viscosity ↑ with chain length. Flammability ↓.',
      'Insoluble in water (non-polar), fully soluble in other hydrocarbons.',
    ]},
    { type: 'callout', kind: 'key', title: 'Chain branching', body: 'Branched isomers have LOWER boiling points than straight-chain versions — they\'re more spherical, so surface contact between molecules is reduced. 2,2-dimethylpropane boils at 9 °C, pentane boils at 36 °C.' },
  ]},

  // CH.5 — Alkane chemistry (ETHANE specifically per syllabus)
  { id: 'h5', title: 'Chemistry of Alkanes (Ethane)', minutes: 13, blocks: [
    { type: 'p', text: 'Alkanes are notoriously unreactive — they\'re often called paraffins ("having little affinity"). They have only strong, non-polar C-H and C-C bonds, so they\'re immune to most ionic reagents. The syllabus uses ethane (C₂H₆) as the exemplar. Two reactions matter: combustion, and halogenation by free-radical substitution with chlorine.' },
    { type: 'h', text: 'Combustion of ethane' },
    { type: 'ul', items: [
      'Complete (excess O₂):   2C₂H₆ + 7O₂  →  4CO₂ + 6H₂O     (highly exothermic — use as fuel)',
      'Incomplete (limited O₂): 2C₂H₆ + 5O₂ → 4CO + 6H₂O        (or further: 2C₂H₆ + 3O₂ → 4C + 6H₂O, producing soot)',
      'CO is toxic — binds to haemoglobin ~250× more strongly than O₂, blocking oxygen transport.',
    ]},
    { type: 'h', text: 'Free-radical substitution — ethane + Cl₂' },
    { type: 'p', text: 'In UV light, ethane reacts with chlorine to give chloroethane. The mechanism is a three-stage chain reaction: initiation, propagation, termination.' },
    { type: 'd', spec: radicalMechanismSpec, caption: 'Free-radical chlorination of ethane' },
    { type: 'callout', kind: 'warning', title: 'UV light is essential', body: 'Without UV, Cl₂ doesn\'t homolyse. Without homolysis, no Cl• radicals. Without Cl• radicals, no reaction. "In the dark" = no product. Heat alone is not enough at A-level.' },
    { type: 'callout', kind: 'key', title: 'Multiple substitution', body: 'The product C₂H₅Cl can react further with Cl₂ to give C₂H₄Cl₂, C₂H₃Cl₃, and so on. Real reactions give a mixture — for mainly the monosubstituted product, use excess ethane.' },
    { type: 'callout', kind: 'key', title: 'Bridge to Halogen Derivatives (OC-15)', body: 'Chloroethane (C₂H₅Cl) is a halogenoalkane. In OC-15 you learn how it reacts with nucleophiles (hydrolysis to ethanol, reaction with NH₃ to give amines, formation of nitriles). Free-radical substitution is one of the two main ways to make halogenoalkanes; the other is electrophilic addition of HX to alkenes (CH.6).' },
    { type: 'takeaway', items: [
      'Ethane burns (combustion) and substitutes (radical halogenation with UV).',
      '3-step mechanism: initiation (UV homolysis), propagation (2-step chain), termination (2 radicals combine).',
      'UV light is essential — no UV, no reaction.',
      'The chloroethane product leads into OC-15 (Halogen Derivatives).',
    ]},
  ]},

  // CH.6 — Alkene chemistry (ETHENE specifically per syllabus)
  { id: 'h6', title: 'Chemistry of Alkenes (Ethene)', minutes: 17, blocks: [
    { type: 'p', text: 'The C=C bond in alkenes is the reason they\'re reactive. The π electrons are exposed above and below the molecular plane — easy prey for electrophiles. The syllabus lists six specific reactions of ethene that you must know: halogenation, hydrohalogenation, catalytic hydrogenation, hydration, cold-dilute KMnO₄, hot-concentrated KMnO₄, plus polymerisation.' },
    { type: 'h', text: 'Test for unsaturation — bromine water' },
    { type: 'p', text: 'Shake an unknown hydrocarbon with orange bromine water. If the colour vanishes, there\'s a C=C. If not, it\'s saturated (or aromatic).' },
    { type: 'd', spec: bromineTestSpec, caption: 'Alkanes vs alkenes with Br₂(aq)' },
    { type: 'h', text: 'The six reactions of ethene' },
    { type: 'ul', items: [
      '1. Halogens — Br₂ or Cl₂ → 1,2-dihaloethane (electrophilic addition via bromonium ion).',
      '2. Hydrogen halides — HCl, HBr, HI → haloethane (electrophilic addition, Markovnikov for unsymmetrical alkenes).',
      '3. Catalytic hydrogenation — H₂, Ni catalyst, 150 °C → ethane. Industrial use: hardening vegetable oils into margarine.',
      '4. Hydration (steam) — H₂O(g), H₃PO₄ catalyst, 300 °C, 60 atm → ethanol. Industrial route to ethanol.',
      '5. Cold dilute alkaline KMnO₄ → ethane-1,2-diol (the diol). Purple → green/brown.',
      '6. Hot concentrated acidic KMnO₄ → CO₂ + HCOOH (cleavage of C=C). Purple → colourless.',
      '7. Polymerisation — high pressure, trace O₂ (or Ziegler-Natta) → polyethene.',
    ]},
    { type: 'h', text: 'Mechanism — HBr + ethene (electrophilic addition)' },
    { type: 'd', spec: electrophilicAdditionSpec, caption: 'HBr across ethene' },
    { type: 'h', text: 'Mechanism — Br₂ + ethene (bromonium ion)' },
    { type: 'p', text: 'Br₂ is non-polar at first, so how can it act as an electrophile? The answer: the π electrons of the alkene induce a dipole in the Br-Br bond as it approaches. This makes the nearer Br δ⁺ and the far Br δ⁻. The mechanism then proceeds through a cyclic bromonium ion intermediate, giving overall trans-addition.' },
    { type: 'd', spec: bromoniumSpec, caption: 'Br₂ addition via bromonium ion' },
    { type: 'h', text: 'Markovnikov\'s rule' },
    { type: 'p', text: 'When an unsymmetrical molecule like HBr adds to an unsymmetrical alkene like propene, there are two possible products. Markovnikov\'s rule tells you which is major: "the H goes to the carbon that already has more Hs." The underlying reason is carbocation stability — tertiary > secondary > primary.' },
    { type: 'd', spec: markovnikovSpec, caption: 'HBr + propene' },
    { type: 'h', text: 'Oxidation with KMnO₄' },
    { type: 'd', spec: kmno4Spec, caption: 'Cold vs hot KMnO₄' },
    { type: 'callout', kind: 'key', title: 'Bridge to Halogen Derivatives (OC-15)', body: 'Electrophilic addition of HBr or Br₂ to an alkene is the second main route to halogenoalkanes. Use this when you need a specific regiochemistry (Markovnikov gives predominantly secondary/tertiary products). In OC-15 these halogenoalkanes become starting materials for nucleophilic substitution and elimination reactions.' },
    { type: 'takeaway', items: [
      'Alkenes react via electrophilic addition — π electrons attack δ⁺ species.',
      'Markovnikov: more stable carbocation wins → major product.',
      'Br₂ addition goes through a cyclic bromonium ion → trans product.',
      'Bromine water is THE diagnostic test for C=C.',
      'The seven reactions of ethene must be known cold — reagent AND conditions.',
    ]},
  ]},

  // CH.7 — Benzene structure
  { id: 'h7', title: 'Benzene — Structure & Stability', minutes: 12, blocks: [
    { type: 'p', text: 'Benzene is C₆H₆ — a planar, symmetric, six-carbon ring. Kekulé\'s 1865 structure drew it with alternating single and double bonds, but experiments showed all six C-C bonds are identical (139 pm — halfway between 154 pm single and 134 pm double). The modern picture: six p orbitals overlap sideways to form a delocalised π system — a ring of six electrons circulating above and below the ring plane.' },
    { type: 'd', spec: benzeneSpec, caption: 'Two ways of drawing benzene' },
    { type: 'h', text: 'Evidence for delocalisation' },
    { type: 'ul', items: [
      'All C-C bonds equal length (139 pm).',
      'Enthalpy of hydrogenation of benzene (-208 kJ/mol) is ~150 kJ/mol LESS exothermic than 3 × cyclohexene (-360 kJ/mol). This "missing" energy is the delocalisation energy — extra stability.',
      'Benzene doesn\'t decolourise bromine water without a catalyst — it doesn\'t behave like a typical alkene.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why benzene substitutes, not adds', body: 'Addition would break the aromatic ring and lose ~150 kJ/mol of delocalisation stability. Substitution preserves the ring and only swaps one H for another group — much more favourable.' },
    { type: 'takeaway', items: [
      'Benzene = six-membered planar ring with 6 delocalised π electrons.',
      'All C-C bonds equivalent (139 pm). More stable than Kekulé predicts.',
      'Reacts by substitution, NOT addition, to preserve aromaticity.',
    ]},
  ]},

  // CH.8 — Benzene reactions
  { id: 'h8', title: 'Reactions of Benzene', minutes: 12, blocks: [
    { type: 'p', text: 'Benzene undergoes electrophilic substitution: an electrophile (generated by a catalyst) replaces one of the H atoms on the ring. Every arene reaction follows the same three-step pattern: generate electrophile → electrophile attacks π → lose H⁺ to restore aromaticity.' },
    { type: 'h', text: 'Bromination' },
    { type: 'd', spec: electrophilicSubstitutionSpec, caption: 'Br₂ + benzene with FeBr₃' },
    { type: 'h', text: 'Nitration' },
    { type: 'd', spec: nitrationSpec, caption: 'Benzene + HNO₃ / H₂SO₄' },
    { type: 'h', text: 'Catalytic hydrogenation (forcing conditions)' },
    { type: 'ul', items: [
      'Conditions: H₂, Ni catalyst, 150 °C AND HIGH PRESSURE (~30 atm).',
      'Product: cyclohexane C₆H₁₂.',
      'Contrast with alkenes: hydrogenation of ethene needs only 1 atm H₂ at 150 °C. The extra pressure reflects benzene\'s extra stability.',
    ]},
    { type: 'takeaway', items: [
      'Benzene always reacts by electrophilic substitution, preserving aromaticity.',
      'Mechanism always: electrophile generated by catalyst → attacks π → H⁺ lost.',
      'Hydrogenation of benzene is possible but requires high pressure.',
    ]},
  ]},

  // CH.9 — Methylbenzene: directing effects
  { id: 'h9', title: 'Methylbenzene — Directing Effects', minutes: 14, blocks: [
    { type: 'p', text: 'When a substituent is already on the benzene ring, it influences both where AND how fast further substitution occurs. Methylbenzene (C₆H₅CH₃, historically "toluene") has a -CH₃ group. This group changes everything — it steers incoming electrophiles to specific positions, and it accelerates the ring\'s reactivity overall.' },
    { type: 'd', spec: directingSpec, caption: 'The -CH₃ group is a 2,4-director (ortho/para director)' },
    { type: 'h', text: 'Where does the next substituent go?' },
    { type: 'ul', items: [
      'Numbering: the -CH₃ is at position 1. The two carbons next to it (2 and 6) are ORTHO. The carbon opposite (4) is PARA. Positions 3 and 5 are META.',
      'The -CH₃ group directs incoming electrophiles to the ORTHO (2) and PARA (4) positions.',
      'Mixture: roughly 60 % para + 35 % ortho + 5 % meta (para dominates for steric reasons — ortho is crowded next to the methyl).',
    ]},
    { type: 'h', text: 'Why ortho and para?' },
    { type: 'p', text: 'The -CH₃ group is electron-donating through the inductive effect (it pushes electron density onto the ring). This stabilises the intermediate cation (cyclohexadienyl cation) formed after electrophile attack — but only when the cation\'s positive charge sits at a position where the methyl group is directly next door. Drawing out the intermediate, the + charge falls on carbons 2, 4, 6 (ortho and para to the attacking position) when the electrophile attacks at ortho or para, but on 1, 3, 5 (including meta) when attack is at meta. Only the ortho and para intermediates have the + charge adjacent to the methyl, so only they are stabilised. Meta is disfavoured.' },
    { type: 'h', text: 'Why faster than benzene?' },
    { type: 'p', text: 'Same reason, simpler statement: the electron-donating -CH₃ raises the electron density in the ring. Higher electron density means the ring is more nucleophilic and more attractive to electrophiles. Methylbenzene brominates roughly 600 times faster than benzene and can undergo some reactions at milder conditions.' },
    { type: 'h', text: 'Nitration of methylbenzene' },
    { type: 'ul', items: [
      'Conditions: conc. HNO₃ / conc. H₂SO₄ / 30 °C (LOWER than 55 °C used for benzene — because methylbenzene is more reactive).',
      'Major products: 2-nitromethylbenzene and 4-nitromethylbenzene (ortho and para).',
      'Overall: C₆H₅CH₃ + HNO₃ → CH₃C₆H₄NO₂ + H₂O.',
    ]},
    { type: 'h', text: 'Ring bromination of methylbenzene' },
    { type: 'ul', items: [
      'Conditions: Br₂, FeBr₃ (or AlBr₃) catalyst, dark, room temp.',
      'Major products: 2-bromomethylbenzene and 4-bromomethylbenzene (ortho and para).',
      'Can stop at monosubstitution or go further with more Br₂.',
    ]},
    { type: 'callout', kind: 'key', title: 'Activating vs deactivating groups', body: 'Electron-donating groups (-CH₃, -OH, -NH₂, -OR) activate the ring and direct to ortho/para. Electron-withdrawing groups (-NO₂, -COOH, -CN, -SO₃H) deactivate the ring and direct to meta. This is worth knowing even though full coverage comes later in other topics.' },
    { type: 'takeaway', items: [
      '-CH₃ is an activating, ortho/para-directing group.',
      'Reason: inductive electron donation stabilises intermediates where + charge is adjacent to CH₃.',
      'Methylbenzene reacts faster than benzene under milder conditions.',
      'Expect a mixture of ortho + para products (para usually majors).',
    ]},
  ]},

  // CH.10 — Ring vs side chain
  { id: 'h10', title: 'Ring vs Side-Chain Halogenation', minutes: 10, blocks: [
    { type: 'p', text: 'Methylbenzene has TWO sites where chlorine (or bromine) could attack: the ring, and the methyl side chain. Which one wins depends entirely on conditions. Get this wrong in an exam and you lose marks — the syllabus specifically flags this as a skill to master.' },
    { type: 'd', spec: ringVsSideSpec, caption: 'Same reactants, different conditions, different products' },
    { type: 'h', text: 'The two outcomes' },
    { type: 'ul', items: [
      'RING halogenation — happens with a halogen carrier catalyst (FeCl₃, FeBr₃, AlCl₃), in the dark, cold. Mechanism: electrophilic substitution on the ring. Product: 2- or 4-chloromethylbenzene (o/p mixture).',
      'SIDE-CHAIN halogenation — happens with UV light, NO catalyst, often hotter. Mechanism: free-radical substitution on the CH₃. Product: (chloromethyl)benzene, C₆H₅CH₂Cl.',
    ]},
    { type: 'h', text: 'Why the split?' },
    { type: 'p', text: 'A halogen carrier (FeCl₃) polarises Cl₂ into Cl⁺ + FeCl₄⁻. The Cl⁺ cation is an electrophile that attacks the most electron-rich site in the molecule — the π cloud of the aromatic ring. Without a catalyst but with UV, the Cl-Cl bond undergoes homolysis instead to give Cl• radicals. Radicals are unselective toward π clouds but highly selective toward the weakest C-H bonds. The C-H bonds on the CH₃ side chain (benzylic position) are weaker than those on the ring, because the resulting benzyl radical is resonance-stabilised by the ring. So radicals preferentially abstract benzylic Hs.' },
    { type: 'callout', kind: 'key', title: 'Predicting the product — quick rules', body: 'See a catalyst (FeCl₃, AlBr₃) mentioned? → RING substitution, o/p products. See "UV light" or "in sunlight"? → SIDE-CHAIN substitution. See neither? → probably no reaction under those conditions.' },
    { type: 'callout', kind: 'key', title: 'Further halogenation of the side chain', body: 'The side-chain product (C₆H₅CH₂Cl) can react with more Cl₂ under continued UV to give C₆H₅CHCl₂ (benzal chloride) then C₆H₅CCl₃ (benzotrichloride). Progressive substitution analogous to methane → CH₂Cl₂ → CHCl₃ → CCl₄.' },
    { type: 'takeaway', items: [
      'Halogen carrier + dark + cold → RING (electrophilic substitution).',
      'UV + no catalyst → SIDE CHAIN (free-radical substitution).',
      'The benzyl C-H bonds are weaker (resonance-stabilised radical) → radicals prefer them.',
      'Read the conditions before you predict the product.',
    ]},
  ]},

  // CH.11 — Side-chain oxidation
  { id: 'h11', title: 'Side-Chain Oxidation', minutes: 7, blocks: [
    { type: 'p', text: 'The aromatic ring itself is remarkably resistant to oxidation — it survives most oxidising agents unchanged. But any alkyl side chain attached to the ring is vulnerable. Under strong oxidising conditions, the entire alkyl chain is stripped back to a single -COOH group, no matter how long the chain was. This is a powerful synthesis method and a common exam question.' },
    { type: 'h', text: 'The reaction' },
    { type: 'ul', items: [
      'Reagents: hot alkaline KMnO₄, followed by acidification with dilute H₂SO₄.',
      'C₆H₅-CH₃ (methylbenzene) → C₆H₅-COOH (benzoic acid).',
      'C₆H₅-CH₂-CH₃ (ethylbenzene) → C₆H₅-COOH (benzoic acid!) — the ethyl chain is cleaved back.',
      'C₆H₅-CH(CH₃)₂ (isopropylbenzene) → C₆H₅-COOH — same story.',
      'Benzene itself — no reaction. No side chain, no -COOH.',
    ]},
    { type: 'callout', kind: 'key', title: 'The mechanism shortcut', body: 'The benzylic C-H (attached to the carbon directly connected to the ring) is weaker than average, so it is attacked first. Once the first C-H is broken, successive oxidation keeps stripping atoms until you\'re left with just -COOH. The ring itself is untouched.' },
    { type: 'callout', kind: 'warning', title: 'Quaternary carbons resist', body: 'If the benzylic carbon has NO hydrogens (e.g. tert-butylbenzene, C₆H₅-C(CH₃)₃), there is no benzylic H to abstract — the side chain is inert to KMnO₄. No -COOH forms.' },
    { type: 'takeaway', items: [
      'Hot alkaline KMnO₄ + H⁺ workup → any side chain with benzylic H becomes -COOH.',
      'Ring itself is unreactive to oxidation at A-level.',
      'No benzylic H (e.g. tert-butyl) → no reaction.',
    ]},
  ]},

  // CH.12 — Industrial uses + environmental impact
  { id: 'h12', title: 'Industrial Uses & Environmental Impact', minutes: 12, blocks: [
    { type: 'p', text: 'Hydrocarbons are the foundation of the modern chemical industry. Every time you put fuel in a car, use a plastic bag, eat margarine, or drink industrial ethanol, you\'re using chemistry from this topic. This chapter links the lab reactions to real-world products and their environmental cost.' },
    { type: 'h', text: 'Industrial products from the reactions you know' },
    { type: 'ul', items: [
      'Catalytic hydrogenation of alkenes → margarine. Unsaturated vegetable oils (liquid) are "hardened" by partial hydrogenation into semi-solid fats for spreads.',
      'Hydration of ethene (H₃PO₄, 300 °C, 60 atm) → industrial ethanol for solvents, fuel blends, disinfectants.',
      'Polymerisation of alkenes → plastics. Polythene (ethene), polypropene (propene), PVC (chloroethene), polystyrene (phenylethene), PTFE/Teflon (tetrafluoroethene).',
      'Nitration of benzene → nitrobenzene → reduction (Sn/HCl) → aniline (phenylamine) → azo dyes and pharmaceutical intermediates.',
      'Side-chain oxidation of methylbenzene → benzoic acid → food preservative (E210), part of salicylic-acid synthesis (aspirin).',
    ]},
    { type: 'h', text: 'Environmental concerns — combustion' },
    { type: 'ul', items: [
      'Carbon dioxide (CO₂) — from complete combustion. Principal greenhouse gas driving climate change.',
      'Carbon monoxide (CO) — from incomplete combustion. Binds haemoglobin ~250× stronger than O₂ → tissue hypoxia → death at high exposure.',
      'Particulates (soot, C) — from very incomplete combustion. Respiratory and cardiovascular disease; visible as black smoke.',
      'Oxides of nitrogen (NOₓ) — from the high combustion temperature, not from the fuel itself. Cause acid rain (with SO₂) and photochemical smog.',
      'Unburnt hydrocarbons — escape into the atmosphere, react with NOₓ in sunlight to form ground-level ozone (smog) and PAN (peroxyacyl nitrates).',
    ]},
    { type: 'h', text: 'Mitigation — catalytic converters' },
    { type: 'p', text: 'Modern cars fit three-way catalytic converters (Pt/Rh on ceramic honeycomb) that simultaneously: oxidise CO to CO₂, oxidise unburnt hydrocarbons to CO₂ and H₂O, and reduce NOₓ back to N₂. They do nothing about CO₂ itself, which is the main climate concern.' },
    { type: 'h', text: 'Environmental concerns — polymers' },
    { type: 'ul', items: [
      'Non-biodegradable — C-C backbones are inert; polymers persist in landfills and oceans for centuries.',
      'Microplastics — photodegradation breaks polymers into micro-fragments that enter the food chain.',
      'Incineration — releases CO₂ (greenhouse); incinerating PVC produces HCl and dioxins.',
      'Recycling — sorting is difficult (different polymer types don\'t mix); usually downcycled rather than properly recycled.',
    ]},
    { type: 'callout', kind: 'key', title: 'Greener alternatives', body: 'Biofuels (ethanol from fermentation, biodiesel from vegetable oils), bioplastics (polylactic acid from corn starch, starch-based plastics), electrification (EVs shift emissions to the grid). Each has its own trade-offs — a common exam discussion point.' },
    { type: 'takeaway', items: [
      'Know one industrial use for each of the six ethene reactions.',
      'Combustion pollutants: CO₂, CO, soot, NOₓ, unburnt hydrocarbons.',
      'Catalytic converters fix CO, unburnt HCs, NOₓ — NOT CO₂.',
      'Polymers: environmental cost is non-biodegradability.',
    ]},
  ]},

  // CH.13 — Reaction summary (exam prep)
  { id: 'h13', title: 'Reaction Summary & Exam Technique', minutes: 10, blocks: [
    { type: 'p', text: 'This chapter is the one-page cheat sheet you use two nights before the exam. It\'s all reagents and conditions — the details you must know exactly.' },
    { type: 'h', text: 'Alkanes (ethane exemplar)' },
    { type: 'ul', items: [
      'Combustion — excess O₂ → CO₂ + H₂O; limited O₂ → CO and/or C soot.',
      'Chlorination — Cl₂ + UV light → C₂H₅Cl + HCl. Free-radical mechanism.',
    ]},
    { type: 'h', text: 'Alkenes (ethene exemplar — SEVEN reactions)' },
    { type: 'ul', items: [
      'Halogenation — Br₂ or Cl₂ → 1,2-dihaloethane. Decolourises Br₂(aq). Bromonium ion mechanism.',
      'Hydrohalogenation — HBr (or HCl) → haloethane. Markovnikov if unsymmetrical.',
      'Hydrogenation — H₂ + Ni, 150 °C → ethane. Used for margarine.',
      'Hydration — H₂O(g) + H₃PO₄, 300 °C, 60 atm → ethanol.',
      'Cold dilute alkaline KMnO₄ → diol. Purple → green/brown.',
      'Hot conc. acidic KMnO₄ → cleavage to CO₂ + HCOOH.',
      'Polymerisation — high P, trace O₂ → polyethene.',
    ]},
    { type: 'h', text: 'Arenes (benzene + methylbenzene)' },
    { type: 'ul', items: [
      'Bromination — Br₂ + FeBr₃, dark, cold → bromobenzene (or o/p-bromomethylbenzene).',
      'Nitration — conc. HNO₃ / conc. H₂SO₄ / 55 °C (or 30 °C for methylbenzene) → nitroarene.',
      'Hydrogenation — H₂ + Ni, 150 °C, HIGH pressure → cyclohexane.',
      'Side-chain halogenation — Cl₂ + UV, no catalyst → (chloromethyl)benzene.',
      'Side-chain oxidation — hot alkaline KMnO₄ → benzoic acid (any alkyl side chain with benzylic H).',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam trap #1 — bromine water test', body: 'If a hydrocarbon decolourises bromine WATER WITHOUT a catalyst at room temperature, it\'s an alkene (has C=C). Benzene alone does not.' },
    { type: 'callout', kind: 'key', title: 'Exam trap #2 — conditions change everything', body: 'Same reactants (Cl₂ + methylbenzene) give different products at different conditions. ALWAYS state conditions. KMnO₄ has two sets of products depending on temperature and concentration — always specify which.' },
    { type: 'callout', kind: 'key', title: 'Exam trap #3 — ortho/para direction', body: 'When a ring already has an electron-donating group (-CH₃, -OH, -NH₂), the products are o/p mixtures, not a single compound. Write all major isomers.' },
  ]},
];

/* ============================================================
   Quiz banks
   ============================================================ */

const quizzes = [
  { q: 'What is the general formula for an alkane?', opts: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙH₂ₙ₊₁'], ans: 1, hint: 'Saturated — two extra Hs at the ends.' },
  { q: 'Give the systematic name of CH₃CH(CH₃)CH₂CH₃.', opts: ['pentane', '2-methylbutane', '3-methylbutane', 'isobutane'], ans: 1, hint: 'Longest chain = 4 carbons; methyl at C2 (lowest locant).' },
  { q: 'Which best describes the bonding in benzene?', opts: ['Three localised C=C and three C-C', 'Six delocalised π electrons above and below the ring', 'Six C-C triple bonds', 'Alternating C=C C-C only'], ans: 1, hint: 'All C-C bonds are equal length.' },
  { q: 'Why do branched alkane isomers have lower boiling points than straight-chain isomers?', opts: ['Stronger Van der Waals forces', 'Less surface area → weaker Van der Waals forces', 'Polar', 'Heavier molecules'], ans: 1, hint: 'Branching reduces molecular contact.' },
  { q: 'Under what conditions does C₂H₆ react with Cl₂?', opts: ['Room temperature, in the dark', 'Presence of UV light', 'Aqueous solution', 'Iron(III) bromide catalyst'], ans: 1, hint: 'UV is essential for homolysis.' },
  { q: 'What is the role of Cl• in the propagation step of C₂H₆ + Cl₂?', opts: ['Spectator only', 'Attacks C₂H₆ to give C₂H₅• and HCl', 'Attacks another Cl• to give Cl₂', 'Reduces C₂H₅Cl'], ans: 1, hint: 'Radical abstracts H from alkane.' },
  { q: 'Which test distinguishes an alkene from an alkane?', opts: ['Flame test', 'Shake with bromine water — alkene decolourises it', 'Add NaOH', 'Add water'], ans: 1, hint: 'Orange → colourless = C=C present.' },
  { q: 'HBr adds to propene. The MAJOR product is:', opts: ['1-bromopropane', '2-bromopropane', 'propan-2-ol', 'propan-1-ol'], ans: 1, hint: 'Markovnikov — more stable carbocation (2°).' },
  { q: 'Why is the 2° carbocation more stable than the 1°?', opts: ['Smaller', 'More alkyl groups donate electron density to the + carbon', 'More electronegative', 'Greater mass'], ans: 1, hint: 'Alkyl groups are inductive electron donors.' },
  { q: 'Cold dilute alkaline KMnO₄ reacts with ethene to give:', opts: ['Ethanoic acid', 'Ethane-1,2-diol', 'CO₂', 'Ethanol'], ans: 1, hint: 'Cold/dilute/alkaline = diol formation.' },
  { q: 'Hot concentrated acidic KMnO₄ with ethene gives:', opts: ['Ethane-1,2-diol', 'CO₂ + HCOOH (cleavage products)', 'Ethanol', 'Propanoic acid'], ans: 1, hint: 'Hot/conc = full oxidation cleaves C=C.' },
  { q: 'Why does benzene undergo substitution rather than addition?', opts: ['Benzene is a gas', 'Addition would destroy the aromatic delocalisation', 'Benzene has no π electrons', 'Benzene is a salt'], ans: 1, hint: '~150 kJ/mol stabilisation lost on addition.' },
  { q: 'The electrophile in the nitration of benzene is:', opts: ['NO₂⁻', 'NO₂⁺', 'HNO₃', 'NO₃⁻'], ans: 1, hint: 'Generated by HNO₃ + 2H₂SO₄.' },
  { q: 'In the bromination of benzene with FeBr₃, the role of FeBr₃ is:', opts: ['Solvent', 'Halogen carrier generating Br⁺', 'Oxidising agent', 'Catalyst for addition'], ans: 1, hint: 'It polarises Br₂.' },
  { q: 'Methylbenzene + hot alkaline KMnO₄ followed by H⁺ gives:', opts: ['Benzaldehyde', 'Benzoic acid', 'Phenol', 'Cyclohexane'], ans: 1, hint: 'Side-chain oxidation → -COOH.' },
  { q: 'With UV light (no catalyst), methylbenzene + Cl₂ gives mostly:', opts: ['Chlorobenzene (ring substitution)', '(chloromethyl)benzene (side-chain substitution)', '1,2-dichloroethene', 'Addition product'], ans: 1, hint: 'UV → radical mechanism → side chain.' },
  { q: 'Which conditions give RING bromination of methylbenzene?', opts: ['UV, no catalyst', 'FeBr₃, dark, cold', 'NaOH(aq)', 'H₂O + heat'], ans: 1, hint: 'Halogen carrier → ring.' },
  { q: 'What is the repeat unit of poly(chloroethene) / PVC?', opts: ['-CH₂-CH₂-', '-CH(Cl)-CH₂- (i.e. -CH₂-CHCl-)', '-CHCl=CH₂-', '-CH₂-CHCl-CHCl-'], ans: 1, hint: 'Monomer CH₂=CHCl becomes -CH₂-CHCl- repeat unit.' },
  { q: 'Why are addition polymers environmentally problematic?', opts: ['Highly reactive', 'Not biodegradable — inert C-C backbone', 'Water-soluble', 'Easily ignite'], ans: 1, hint: 'No polar group for microbes to attack.' },
  { q: 'Cracking of long alkanes produces:', opts: ['Larger alkanes only', 'Smaller alkanes + alkenes', 'Alkynes', 'Aromatics'], ans: 1, hint: 'Breaks a C-C bond, makes one C=C.' },
  { q: 'Which fraction of crude oil has the lowest boiling range?', opts: ['Bitumen', 'Refinery gas', 'Diesel', 'Lubricating oil'], ans: 1, hint: 'Smallest molecules → weakest VdW → lowest BP.' },
  { q: 'Which molecule shows cis-trans isomerism?', opts: ['CH₂=CH₂', 'CH₂=CHCl', 'CH₃CH=CHCH₃', 'CH₂=C(CH₃)₂'], ans: 2, hint: 'Need two different groups on EACH C=C carbon.' },
  { q: 'The product from hydrogenation of cis-but-2-ene is:', opts: ['cis-butane', 'trans-butane', 'Butane (single product)', 'Buta-1,3-diene'], ans: 2, hint: 'Once C=C is gone, free rotation returns.' },
  { q: 'Why is benzene\'s enthalpy of hydrogenation less exothermic than expected for 3 × C=C?', opts: ['Benzene is less reactive', 'Delocalisation energy stabilises benzene', 'Three C=C is wrong', 'Wrong catalyst'], ans: 1, hint: 'That "missing" energy IS the stabilisation.' },
  { q: 'An unknown hydrocarbon C₄H₈ decolourises bromine water. How many structural isomers are possible?', opts: ['1', '2', '3', '4'], ans: 2, hint: 'but-1-ene, but-2-ene, methylpropene = 3.' },
  // NEW questions for expanded content
  { q: 'Br₂ addition to an alkene gives TRANS-dibromide. Why?', opts: ['Radical mechanism', 'Cyclic bromonium ion blocks one face; Br⁻ attacks opposite face', 'Steric clash', 'Markovnikov'], ans: 1, hint: 'Cyclic intermediate enforces anti-addition.' },
  { q: 'Methylbenzene + conc. HNO₃/H₂SO₄ at 30°C gives mainly:', opts: ['3-nitromethylbenzene only', 'A mixture of 2- and 4-nitromethylbenzene (ortho + para)', '1-nitromethylbenzene', 'No reaction'], ans: 1, hint: '-CH₃ is an ortho/para director.' },
  { q: 'Why does methylbenzene react faster than benzene?', opts: ['Smaller molecule', '-CH₃ donates electrons to the ring (+I), activating it', 'Higher melting point', 'No ring'], ans: 1, hint: 'Activation by electron donation.' },
  { q: 'Which group is an electron-WITHDRAWING, meta-director?', opts: ['-OH', '-CH₃', '-NO₂', '-NH₂'], ans: 2, hint: 'The nitro group pulls electrons from the ring.' },
  { q: 'Ethylbenzene (C₆H₅CH₂CH₃) + hot alkaline KMnO₄ then H⁺ gives:', opts: ['C₆H₅CH(OH)CH₃', 'C₆H₅CHO', 'C₆H₅COOH (benzoic acid)', 'C₆H₅CH₂COOH'], ans: 2, hint: 'Any side chain with benzylic H → -COOH.' },
  { q: 'Catalytic converters on cars do NOT reduce emissions of:', opts: ['CO', 'NOₓ', 'Unburnt hydrocarbons', 'CO₂'], ans: 3, hint: 'CO₂ is the product of complete combustion — the catalyst can\'t remove it.' },
  { q: 'Industrial hydration of ethene to ethanol uses:', opts: ['NaOH(aq), 25°C', 'H₂O(g), H₃PO₄ catalyst, 300°C, 60 atm', 'H₂SO₄(aq), cold', 'Ni catalyst + steam'], ans: 1, hint: 'Phosphoric-acid catalysis at high T and P.' },
  { q: 'Margarine is made by:', opts: ['Oxidation of oils', 'Partial hydrogenation of unsaturated vegetable oils', 'Polymerisation of glycerol', 'Fractional distillation'], ans: 1, hint: 'H₂/Ni converts some C=C to C-C → liquid → semi-solid.' },
  { q: 'Which C-H bond in methylbenzene is most easily attacked by a Cl• radical?', opts: ['A ring C-H', 'One of the CH₃ (benzylic) C-Hs', 'They are identical', 'The para C-H'], ans: 1, hint: 'Benzylic radical is resonance-stabilised.' },
  { q: 'The product C₆H₅CH₂Cl + KOH(aq) gives:', opts: ['Benzene', 'Benzyl alcohol (C₆H₅CH₂OH)', 'Benzoic acid directly', 'No reaction'], ans: 1, hint: 'Nucleophilic substitution — covered fully in OC-15.' },
];

const multi = [
  { q: 'Which of the following are TRUE about the reaction of alkenes with HBr?', opts: [
    '1. Mechanism is electrophilic addition',
    '2. Markovnikov\'s rule applies to unsymmetrical alkenes',
    '3. Carbocation stability determines product distribution',
    '4. Free-radical intermediates are involved',
  ], ans: [0, 1, 2], hint: 'Radicals are NOT involved in polar electrophilic addition.' },
  { q: 'Benzene CANNOT:', opts: [
    '1. Be reduced with H₂ / Ni under high pressure',
    '2. Undergo free-radical chlorination on the ring',
    '3. Decolourise bromine water without a catalyst',
    '4. Undergo nitration with HNO₃ / H₂SO₄',
  ], ans: [1, 2], hint: 'Aromatics don\'t react with Br₂(aq) directly; free-radical substitution requires a side chain.' },
  { q: 'Which of these monomers would give an addition polymer?', opts: [
    '1. CH₂=CH₂',
    '2. CH₂=CHCl',
    '3. CH₃-CH₃',
    '4. CH₂=CH-CH=CH₂',
  ], ans: [0, 1, 3], hint: 'Needs a C=C. Ethane has no double bond.' },
  { q: 'Which statements about methylbenzene are TRUE?', opts: [
    '1. -CH₃ is an ortho/para director',
    '2. Methylbenzene is more reactive than benzene to electrophiles',
    '3. Hot KMnO₄ oxidises the ring to benzoic acid',
    '4. UV + Cl₂ substitutes on the side chain',
  ], ans: [0, 1, 3], hint: 'KMnO₄ oxidises the SIDE CHAIN, not the ring.' },
];

const structured = [
  { title: 'Alkane & Alkene Chemistry', marks: 10, q: 'Ethane (C₂H₆) and ethene (C₂H₄) are both gaseous hydrocarbons obtained from crude oil processing.', parts: [
    { q: '(a) Write balanced equations for the complete combustion of each.', marks: 2, ans: '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O  ;  C₂H₄ + 3O₂ → 2CO₂ + 2H₂O' },
    { q: '(b) Describe a simple chemical test to distinguish ethane from ethene. State reagent AND observation.', marks: 3, ans: 'Shake a sample with bromine water. Ethene (the alkene) decolourises the orange bromine water by electrophilic addition across the C=C. Ethane leaves the bromine water orange — no reaction.' },
    { q: '(c) Write the full 3-step mechanism for the reaction of ethane with Cl₂ under UV light.', marks: 3, ans: 'Initiation (UV homolysis): Cl-Cl → 2 Cl•. Propagation step 1: Cl• + C₂H₆ → C₂H₅• + HCl. Propagation step 2: C₂H₅• + Cl₂ → C₂H₅Cl + Cl•. Termination: any two radicals combine, e.g. Cl• + Cl• → Cl₂, or C₂H₅• + C₂H₅• → C₄H₁₀.' },
    { q: '(d) Give the mechanism label and describe the first step of the HBr + ethene reaction.', marks: 2, ans: 'Mechanism: electrophilic addition. Step 1: the π electrons of C=C attack the δ⁺ hydrogen of polar H-Br. The H-Br bond breaks heterolytically, with the bonding pair going to Br to form Br⁻. A carbocation (CH₃CH₂⁺) forms on one of the carbons.' },
  ]},
  { title: 'Benzene Substitution', marks: 9, q: 'Benzene reacts with a mixture of concentrated nitric and sulfuric acids at about 55 °C.', parts: [
    { q: '(a) Name the electrophile, and give an equation showing how it is generated.', marks: 3, ans: 'Electrophile is the nitronium ion, NO₂⁺. Formed by: HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺. H₂SO₄ (the stronger acid) protonates HNO₃, which loses water to form NO₂⁺.' },
    { q: '(b) Write the overall equation for the nitration reaction.', marks: 2, ans: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O' },
    { q: '(c) Explain why benzene undergoes substitution rather than addition.', marks: 2, ans: 'Benzene has a delocalised π system containing 6 electrons spread over all six carbons, giving extra stability (~150 kJ/mol). Addition would disrupt the delocalisation and lose this stability. Substitution replaces only one H, preserving the aromatic ring and its stability.' },
    { q: '(d) Give a practical use of the nitrobenzene product.', marks: 2, ans: 'Nitrobenzene is reduced (Sn/HCl) to phenylamine (aniline), a precursor to azo dyes, pharmaceutical intermediates, and rubber chemicals.' },
  ]},
  { title: 'Methylbenzene — Directing Effects & Conditions', marks: 10, q: 'Methylbenzene (C₆H₅CH₃) reacts differently with Cl₂ depending on conditions. It also undergoes nitration at milder conditions than benzene does.', parts: [
    { q: '(a) Give the products, conditions and mechanism type for EACH of:  (i) methylbenzene + Cl₂ with FeCl₃ catalyst in the dark,  (ii) methylbenzene + Cl₂ with UV light.', marks: 4, ans: '(i) Ring: electrophilic substitution at o/p positions. Products: 2-chloromethylbenzene and 4-chloromethylbenzene (plus HCl). Conditions: FeCl₃ halogen carrier, dark, cold. (ii) Side chain: free-radical substitution on CH₃. Product: (chloromethyl)benzene C₆H₅CH₂Cl (plus HCl). Conditions: UV light, no catalyst.' },
    { q: '(b) Explain why -CH₃ is an ortho/para director and why methylbenzene is MORE reactive than benzene.', marks: 4, ans: 'The -CH₃ group is weakly electron-donating through the inductive effect (+I): it pushes electron density onto the ring. This increases the ring\'s electron density, making it more nucleophilic and so more attractive to electrophiles — methylbenzene therefore reacts faster than benzene. The intermediate cyclohexadienyl cation from electrophile attack is stabilised only when the + charge sits on a carbon adjacent to the methyl group, which occurs for attack at the ortho and para positions. Meta attack gives a cation that cannot place its + charge next to -CH₃, so is disfavoured.' },
    { q: '(c) State the conditions and give the products for the nitration of methylbenzene.', marks: 2, ans: 'Conditions: conc. HNO₃ / conc. H₂SO₄ / 30 °C (lower than the 55 °C needed for benzene, because methylbenzene is more reactive). Major products: 2-nitromethylbenzene and 4-nitromethylbenzene (o/p mixture).' },
  ]},
  { title: 'Polymerisation', marks: 8, q: 'Propene (CH₃CH=CH₂) undergoes addition polymerisation.', parts: [
    { q: '(a) Draw the repeat unit of poly(propene).', marks: 2, ans: '-[CH(CH₃)-CH₂]-  (or equivalent with CH₃ group shown on alternate carbons of the backbone)' },
    { q: '(b) Describe the mechanism (outline only) of addition polymerisation.', marks: 3, ans: 'Under high pressure and a trace of oxygen (or a Ziegler-Natta catalyst), the π bond of one propene molecule attacks the carbon of another, opening the C=C and forming a new C-C single bond. Thousands of propene molecules chain together head-to-tail, producing a long polymer with no by-product.' },
    { q: '(c) State two environmental disadvantages of addition polymers like poly(propene).', marks: 2, ans: 'Not biodegradable (inert C-C backbone) — long-term accumulation in landfills and oceans. Incineration releases CO₂ (greenhouse); some polymers release toxic gases. Manufacture depends on finite fossil feedstock.' },
    { q: '(d) Name ONE common everyday use of poly(propene).', marks: 1, ans: 'Ropes, packaging film, yogurt pots, carpets, laboratory containers — any one.' },
  ]},
  { title: 'Industrial Chemistry & Environment', marks: 9, q: 'Ethene is one of the most important industrial chemicals, produced by cracking of crude-oil fractions.', parts: [
    { q: '(a) Give the reagents and conditions for converting ethene to ethanol industrially.', marks: 2, ans: 'Steam (H₂O vapour), phosphoric-acid catalyst (H₃PO₄), 300 °C, 60 atm pressure. This is the industrial hydration reaction.' },
    { q: '(b) Give the reagents and conditions for converting vegetable oils (which contain unsaturated C=C bonds) into margarine.', marks: 2, ans: 'Hydrogen gas (H₂), nickel catalyst, 150 °C (moderate pressure). Partial hydrogenation of the C=C double bonds in the oils converts them from liquid to semi-solid fat.' },
    { q: '(c) Identify three harmful gases emitted by the incomplete combustion of hydrocarbons in a car engine and state the health or environmental effect of each.', marks: 3, ans: 'CO (carbon monoxide) — binds haemoglobin more strongly than O₂, causing hypoxia and at high doses death. NOₓ (oxides of nitrogen) — cause acid rain and photochemical smog. Unburnt hydrocarbons — contribute to photochemical smog and ground-level ozone. (Particulates/soot also acceptable — respiratory and cardiovascular disease.)' },
    { q: '(d) Catalytic converters fitted to cars reduce emissions of CO, NOₓ and unburnt hydrocarbons. Explain why catalytic converters do NOT solve the climate impact of car exhaust.', marks: 2, ans: 'The catalytic converter actually converts CO and unburnt hydrocarbons INTO CO₂, and reduces NOₓ back to N₂. But CO₂ itself is the principal greenhouse gas driving climate change, and it passes through the converter unchanged. The converter solves local air-quality problems but not global warming.' },
  ]},
];

const worked = [
  { title: 'IUPAC name of a branched alkane', diff: 'easy', q: 'Give the IUPAC name of CH₃CH₂CH(CH₃)CH₂CH₂CH₃.', steps: [
    { label: 'STEP 1', text: 'Find the longest continuous carbon chain. Reading left to right we get 6 carbons. Parent name: hexane.' },
    { label: 'STEP 2', text: 'Number the chain to give the substituent the lowest locant. Numbering left-to-right, the methyl group is on C3. Numbering right-to-left, it\'s on C4. Use 3.' },
    { label: 'STEP 3', text: 'Substituent is -CH₃ (methyl) at C3.' },
  ], ans: '3-methylhexane' },

  { title: 'Combustion stoichiometry', diff: 'easy', q: 'Balance the equation for the complete combustion of octane, C₈H₁₈.', steps: [
    { label: 'STEP 1', text: 'Write the unbalanced equation: C₈H₁₈ + O₂ → CO₂ + H₂O.' },
    { label: 'STEP 2', text: 'Balance carbons: 8 CO₂ on the right. Balance hydrogens: 9 H₂O on the right (18 H ÷ 2).' },
    { label: 'STEP 3', text: 'Count O on the right: 8(2) + 9(1) = 25. Divide by 2 → 12.5 O₂.' },
    { label: 'STEP 4', text: 'Multiply everything by 2 to clear the fraction.' },
  ], ans: '2 C₈H₁₈ + 25 O₂ → 16 CO₂ + 18 H₂O' },

  { title: 'Predict the major product (Markovnikov)', diff: 'medium', q: 'HCl adds to 2-methylbut-2-ene. Predict the major product and explain why.', steps: [
    { label: 'STEP 1', text: 'Draw the alkene: (CH₃)₂C=CHCH₃. The C=C is between C2 (two CH₃ groups) and C3 (one H, one CH₃).' },
    { label: 'STEP 2', text: 'Possible carbocations after H⁺ adds: (a) H adds to C3 → 3° carbocation at C2 (stabilised by THREE alkyl groups); (b) H adds to C2 → 2° carbocation at C3.' },
    { label: 'STEP 3', text: 'The 3° carbocation is more stable (more alkyl groups donate electron density to the + carbon). Cl⁻ attacks it.' },
  ], ans: '(CH₃)₂CCl-CH₂CH₃  ·  2-chloro-2-methylbutane (major).' },

  { title: 'Free-radical mechanism — ethane + Cl₂', diff: 'medium', q: 'Write out the mechanism for the monochlorination of ethane, C₂H₆ + Cl₂ → C₂H₅Cl + HCl, in UV light.', steps: [
    { label: 'STEP 1', text: 'INITIATION: UV breaks Cl-Cl homolytically. Cl-Cl → 2 Cl• (each Cl gets one electron of the bond).' },
    { label: 'STEP 2', text: 'PROPAGATION A: Cl• abstracts H from ethane. Cl• + C₂H₆ → C₂H₅• + HCl.' },
    { label: 'STEP 3', text: 'PROPAGATION B: C₂H₅• attacks Cl₂. C₂H₅• + Cl₂ → C₂H₅Cl + Cl•. The regenerated Cl• continues the chain.' },
    { label: 'STEP 4', text: 'TERMINATION: any two radicals combine. Cl• + Cl• → Cl₂, or C₂H₅• + Cl• → C₂H₅Cl, or C₂H₅• + C₂H₅• → C₄H₁₀ (butane, side product).' },
  ], ans: 'Three-step chain mechanism: initiation (UV homolysis of Cl₂), propagation (two-step cycle that regenerates Cl•), termination (any two radicals combine).' },

  { title: 'Distinguish three hydrocarbons', diff: 'hard', q: 'Three colourless liquids are hexane, hex-1-ene, and methylbenzene. Describe simple chemical tests to distinguish all three.', steps: [
    { label: 'STEP 1', text: 'Start with bromine water (Br₂/aq). Hex-1-ene decolourises it instantly at room temp by electrophilic addition across C=C. Hexane and methylbenzene both leave it orange.' },
    { label: 'STEP 2', text: 'Now distinguish hexane from methylbenzene. Add hot alkaline KMnO₄ then acidify. Methylbenzene has a -CH₃ side chain with benzylic H that is oxidised to benzoic acid — the purple colour disappears and a white solid may precipitate on cooling/acidifying. Hexane does not react — KMnO₄ stays purple.' },
    { label: 'STEP 3', text: 'Alternative: Br₂ + FeBr₃ catalyst. Methylbenzene reacts by electrophilic substitution on the ring (steamy HBr fumes released); hexane does not.' },
  ], ans: 'Test 1: Br₂(aq) — only hex-1-ene decolourises. Test 2: hot KMnO₄ — only methylbenzene decolourises (gives benzoic acid). Hexane is inert to both.' },

  { title: 'Identify polymer monomer', diff: 'medium', q: 'An addition polymer has the structure -[CH₂-C(CH₃)₂-CH₂-C(CH₃)₂-]-. Identify the monomer.', steps: [
    { label: 'STEP 1', text: 'The repeat unit in an addition polymer is half of what is shown between the brackets (since the brackets show two repeat units joined).' },
    { label: 'STEP 2', text: 'Repeat unit: -[CH₂-C(CH₃)₂]-' },
    { label: 'STEP 3', text: 'To get the monomer, put back the C=C between the two carbons of the repeat unit.' },
  ], ans: 'CH₂=C(CH₃)₂ — 2-methylpropene (isobutylene).' },

  // NEW worked examples
  { title: 'Predict directing-effect products', diff: 'medium', q: 'Methylbenzene reacts with a mixture of conc. HNO₃ and conc. H₂SO₄ at 30 °C. Predict the major product(s) and explain the outcome.', steps: [
    { label: 'STEP 1', text: 'Identify the directing group. -CH₃ is weakly electron-donating (+I inductive effect), an activating o/p director.' },
    { label: 'STEP 2', text: 'Electrophile generated is NO₂⁺ (from HNO₃ + 2H₂SO₄).' },
    { label: 'STEP 3', text: 'NO₂⁺ attacks preferentially at positions 2 (ortho) and 4 (para) relative to -CH₃. Position 4 tends to dominate on steric grounds.' },
    { label: 'STEP 4', text: 'Temperature 30 °C is lower than the 55 °C used for benzene — because methylbenzene\'s ring is activated (more nucleophilic), milder conditions suffice.' },
  ], ans: 'Major products: 2-nitromethylbenzene and 4-nitromethylbenzene (o/p mixture, with para usually dominating). Mechanism: electrophilic substitution.' },

  { title: 'Ring vs side chain — predict the product', diff: 'medium', q: 'Methylbenzene is shaken with bromine in the presence of AlBr₃ at room temperature in the dark. State the product, mechanism, and explain why the outcome would differ in UV light.', steps: [
    { label: 'STEP 1', text: 'Identify the conditions. AlBr₃ is a halogen carrier (Lewis acid catalyst). Dark means no UV. This combination favours ring substitution.' },
    { label: 'STEP 2', text: 'AlBr₃ polarises Br₂: Br₂ + AlBr₃ → Br⁺ + AlBr₄⁻. The Br⁺ electrophile attacks the electron-rich ring at ortho and para positions (-CH₃ directs).' },
    { label: 'STEP 3', text: 'In UV light without a catalyst, the Br-Br bond homolyses to give Br• radicals. These abstract the benzylic C-H (weaker bond, resonance-stabilised radical) rather than attacking the ring. The side chain is substituted.' },
  ], ans: 'Conditions given → RING substitution. Major products: 2-bromomethylbenzene and 4-bromomethylbenzene. Mechanism: electrophilic substitution. Under UV without catalyst, the product is instead (bromomethyl)benzene C₆H₅CH₂Br by free-radical substitution.' },

  { title: 'Design a synthesis using hydrocarbon chemistry', diff: 'hard', q: 'Starting from ethene, describe how you would make each of: (a) ethanol, (b) polyethene, (c) 1,2-dibromoethane, (d) bromoethane. State reagents and conditions for each.', steps: [
    { label: 'STEP 1', text: 'For ethanol: hydration of ethene. Steam + H₃PO₄ catalyst, 300 °C, 60 atm. CH₂=CH₂ + H₂O → CH₃CH₂OH.' },
    { label: 'STEP 2', text: 'For polyethene: addition polymerisation. High pressure (~1000-2000 atm), trace O₂ (or Ziegler-Natta catalyst at lower P). n CH₂=CH₂ → -(CH₂-CH₂)ₙ-.' },
    { label: 'STEP 3', text: 'For 1,2-dibromoethane: halogenation. Br₂ (aqueous or in CCl₄), room temperature. CH₂=CH₂ + Br₂ → BrCH₂-CH₂Br. Mechanism: electrophilic addition via bromonium ion; trans product.' },
    { label: 'STEP 4', text: 'For bromoethane: hydrohalogenation. HBr(g), room temperature (no catalyst needed). CH₂=CH₂ + HBr → CH₃CH₂Br. Mechanism: electrophilic addition. Only one possible product because ethene is symmetrical (no Markovnikov issue).' },
  ], ans: '(a) H₂O/H₃PO₄/300°C/60atm. (b) high P, trace O₂. (c) Br₂, room temp. (d) HBr(g), room temp. All are electrophilic addition reactions except (b), which opens the C=C for polymerisation.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const HYDROCARBONS = {
  id: 'hydrocarbons',
  objectives: [
    'Use IUPAC nomenclature and displayed formulae for hydrocarbons C1–C10',
    'Describe the forms of isomerism found in hydrocarbons',
    'Explain the use of crude oil and natural gas as sources of hydrocarbons',
    'Describe the reactions of ethane (combustion, free-radical chlorination)',
    'Describe the reactions of ethene (all six: halogens, HX, H₂, H₂O, KMnO₄ cold, KMnO₄ hot, polymerisation)',
    'Describe the mechanism of free radical substitution',
    'Describe the mechanism of electrophilic addition (including bromonium ion for Br₂)',
    'Describe the reactions and mechanism for benzene electrophilic substitution',
    'Describe the reactions of methylbenzene: ortho/para direction and activation of ring',
    'Predict whether halogenation occurs on the ring or the side chain',
    'Describe the oxidation of arene side chains with KMnO₄',
    'Explain industrial uses and environmental impact of hydrocarbons',
  ],
  chapters,
  quizzes,
  multi,
  structured,
  worked,
  tutorPrompts: [
    'Explain Markovnikov\'s rule in one paragraph with an example',
    'Why is methylbenzene more reactive than benzene — explain with inductive effects',
    'Walk me through the free-radical mechanism of ethane + Cl₂',
    'Predict the product: methylbenzene + Cl₂ in UV light vs with AlCl₃ catalyst',
    'What\'s the difference between ortho/para and meta directors?',
    'Give me a challenging past-paper-style question on the mechanism of Br₂ + ethene',
  ],
};
