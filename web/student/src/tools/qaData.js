export const CATIONS = [
  { ion: 'Al³⁺', name: 'Aluminium', tests: [
    { reagent: 'NaOH(aq) dropwise', obs: 'White gelatinous ppt of Al(OH)₃', eq: 'Al³⁺ + 3OH⁻ → Al(OH)₃' },
    { reagent: 'NaOH(aq) excess', obs: 'Ppt dissolves (amphoteric)', eq: 'Al(OH)₃ + OH⁻ → [Al(OH)₄]⁻' },
    { reagent: 'NH₃(aq)', obs: 'White ppt, insoluble in excess NH₃', eq: 'Al³⁺ + 3NH₃ + 3H₂O → Al(OH)₃ + 3NH₄⁺' },
  ]},
  { ion: 'NH₄⁺', name: 'Ammonium', tests: [
    { reagent: 'NaOH(aq) + warm', obs: 'NH₃ gas evolved, turns damp red litmus blue', eq: 'NH₄⁺ + OH⁻ → NH₃ + H₂O' },
  ]},
  { ion: 'Ca²⁺', name: 'Calcium', tests: [
    { reagent: 'NaOH(aq)', obs: 'White ppt only at high [Ca²⁺]', eq: 'Ca²⁺ + 2OH⁻ → Ca(OH)₂' },
    { reagent: 'Flame test', obs: 'Brick-red flame', eq: '—' },
  ]},
  { ion: 'Cr³⁺', name: 'Chromium(III)', tests: [
    { reagent: 'NaOH(aq) dropwise', obs: 'Grey-green ppt of Cr(OH)₃', eq: 'Cr³⁺ + 3OH⁻ → Cr(OH)₃' },
    { reagent: 'NaOH(aq) excess', obs: 'Dissolves → green [Cr(OH)₆]³⁻ (amphoteric)', eq: 'Cr(OH)₃ + 3OH⁻ → [Cr(OH)₆]³⁻' },
  ]},
  { ion: 'Cu²⁺', name: 'Copper(II)', tests: [
    { reagent: 'NaOH(aq)', obs: 'Pale blue ppt of Cu(OH)₂', eq: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂' },
    { reagent: 'NH₃(aq) excess', obs: 'Deep blue solution [Cu(NH₃)₄(H₂O)₂]²⁺', eq: 'Cu(OH)₂ + 4NH₃ + 2H₂O → [Cu(NH₃)₄(H₂O)₂]²⁺ + 2OH⁻' },
    { reagent: 'Conc. HCl', obs: 'Yellow-green [CuCl₄]²⁻', eq: '[Cu(H₂O)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O' },
  ]},
  { ion: 'Fe²⁺', name: 'Iron(II)', tests: [
    { reagent: 'NaOH(aq)', obs: 'Dirty green ppt Fe(OH)₂; darkens in air to brown', eq: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂' },
    { reagent: 'K₃[Fe(CN)₆]', obs: 'Deep blue (Turnbull\'s blue)', eq: '—' },
  ]},
  { ion: 'Fe³⁺', name: 'Iron(III)', tests: [
    { reagent: 'NaOH(aq)', obs: 'Rust-brown ppt Fe(OH)₃', eq: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃' },
    { reagent: 'KSCN(aq)', obs: 'Blood-red solution', eq: 'Fe³⁺ + SCN⁻ → [Fe(SCN)(H₂O)₅]²⁺' },
  ]},
  { ion: 'Mg²⁺', name: 'Magnesium', tests: [
    { reagent: 'NaOH(aq)', obs: 'White ppt Mg(OH)₂, insoluble in excess', eq: 'Mg²⁺ + 2OH⁻ → Mg(OH)₂' },
  ]},
  { ion: 'Mn²⁺', name: 'Manganese(II)', tests: [
    { reagent: 'NaOH(aq)', obs: 'Off-white ppt Mn(OH)₂; darkens to brown in air', eq: 'Mn²⁺ + 2OH⁻ → Mn(OH)₂' },
  ]},
  { ion: 'Pb²⁺', name: 'Lead(II)', tests: [
    { reagent: 'NaOH(aq) dropwise', obs: 'White ppt Pb(OH)₂', eq: 'Pb²⁺ + 2OH⁻ → Pb(OH)₂' },
    { reagent: 'NaOH(aq) excess', obs: 'Dissolves (amphoteric)', eq: 'Pb(OH)₂ + 2OH⁻ → [Pb(OH)₄]²⁻' },
    { reagent: 'KI(aq)', obs: 'Bright yellow ppt PbI₂', eq: 'Pb²⁺ + 2I⁻ → PbI₂' },
  ]},
  { ion: 'Zn²⁺', name: 'Zinc', tests: [
    { reagent: 'NaOH(aq) dropwise', obs: 'White ppt Zn(OH)₂', eq: 'Zn²⁺ + 2OH⁻ → Zn(OH)₂' },
    { reagent: 'NaOH(aq) excess', obs: 'Dissolves → [Zn(OH)₄]²⁻ (amphoteric)', eq: 'Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻' },
    { reagent: 'NH₃(aq) excess', obs: 'Dissolves → [Zn(NH₃)₄]²⁺ colourless', eq: 'Zn(OH)₂ + 4NH₃ → [Zn(NH₃)₄]²⁺ + 2OH⁻' },
  ]},
];

export const ANIONS = [
  { ion: 'CO₃²⁻', name: 'Carbonate', tests: [{ reagent: 'Dilute HCl', obs: 'Effervescence, CO₂ turns limewater milky', eq: 'CO₃²⁻ + 2H⁺ → CO₂ + H₂O' }] },
  { ion: 'Cl⁻',   name: 'Chloride',  tests: [{ reagent: 'AgNO₃(aq) / HNO₃', obs: 'White ppt AgCl, soluble in dilute NH₃', eq: 'Ag⁺ + Cl⁻ → AgCl' }] },
  { ion: 'Br⁻',   name: 'Bromide',   tests: [{ reagent: 'AgNO₃(aq) / HNO₃', obs: 'Cream ppt AgBr, soluble in conc. NH₃ only', eq: 'Ag⁺ + Br⁻ → AgBr' }] },
  { ion: 'I⁻',    name: 'Iodide',    tests: [{ reagent: 'AgNO₃(aq) / HNO₃', obs: 'Yellow ppt AgI, insoluble in NH₃', eq: 'Ag⁺ + I⁻ → AgI' }] },
  { ion: 'NO₃⁻',  name: 'Nitrate',   tests: [
    { reagent: 'NaOH + Al + warm', obs: 'NH₃ evolved (turns damp red litmus blue)', eq: '3NO₃⁻ + 8Al + 5OH⁻ + 18H₂O → 3NH₃ + 8[Al(OH)₄]⁻' },
    { reagent: 'Brown ring (conc. H₂SO₄ + FeSO₄)', obs: 'Brown ring at interface', eq: '—' },
  ]},
  { ion: 'SO₄²⁻', name: 'Sulfate',   tests: [{ reagent: 'BaCl₂(aq) / HCl', obs: 'White ppt BaSO₄, insoluble in acid', eq: 'Ba²⁺ + SO₄²⁻ → BaSO₄' }] },
  { ion: 'SO₃²⁻', name: 'Sulfite',   tests: [{ reagent: 'Dilute HCl + warm', obs: 'SO₂ gas evolved, decolourises acidified KMnO₄', eq: 'SO₃²⁻ + 2H⁺ → SO₂ + H₂O' }] },
];

export const GASES = [
  { gas: 'H₂',  test: 'Lighted splint',   result: 'Pops' },
  { gas: 'O₂',  test: 'Glowing splint',   result: 'Relights' },
  { gas: 'CO₂', test: 'Limewater',        result: 'Turns milky (Ca(OH)₂ → CaCO₃)' },
  { gas: 'NH₃', test: 'Damp red litmus',  result: 'Turns blue' },
  { gas: 'Cl₂', test: 'Damp blue litmus', result: 'Turns red then bleaches white' },
  { gas: 'HCl', test: 'NH₃ vapour',       result: 'White fumes of NH₄Cl' },
  { gas: 'SO₂', test: 'Acidified KMnO₄',  result: 'Decolourises purple → colourless' },
  { gas: 'H₂O', test: 'Anhydrous CuSO₄',  result: 'White → blue (hydration)' },
  { gas: 'NO₂', test: 'Observation',      result: 'Brown pungent gas' },
];

export const FUNCTIONAL_GROUPS = [
  {
    group: 'C=C',
    name: 'Alkene / unsaturation',
    tests: [
      {
        reagent: 'Bromine water',
        confirm: 'Orange/brown bromine water is decolourised.',
        absent: 'Bromine-water colour remains; no decolourisation.',
        note: 'A rapid decolourisation supports the presence of a reactive C=C bond under normal test conditions.',
      },
    ],
  },
  {
    group: '–OH',
    name: 'Primary or secondary alcohol',
    tests: [
      {
        reagent: 'Acidified potassium dichromate(VI), with gentle warming',
        confirm: 'Orange dichromate(VI) changes to green as the alcohol is oxidised.',
        absent: 'No orange-to-green change under the same conditions.',
        note: 'Tertiary alcohols normally give no oxidation colour change, so this test helps classify alcohols rather than proving every –OH group by itself.',
      },
    ],
  },
  {
    group: 'Ar–OH',
    name: 'Phenol',
    tests: [
      {
        reagent: 'Bromine water',
        confirm: 'Bromine water is decolourised and a white precipitate forms.',
        absent: 'No white precipitate; bromine colour is not removed in the characteristic phenol reaction.',
        note: 'The white precipitate distinguishes this response from simple alkene decolourisation.',
      },
    ],
  },
  {
    group: '>C=O',
    name: 'Carbonyl compound (aldehyde or ketone)',
    tests: [
      {
        reagent: '2,4-dinitrophenylhydrazine (2,4-DNPH)',
        confirm: 'Yellow/orange precipitate forms.',
        absent: 'No yellow/orange precipitate.',
        note: 'A positive test shows a reactive aldehyde or ketone carbonyl; use a second test to distinguish aldehydes from ketones.',
      },
    ],
  },
  {
    group: '–CHO',
    name: 'Aldehyde',
    tests: [
      {
        reagent: "Tollens' reagent",
        confirm: 'A silver mirror or grey silver deposit forms.',
        absent: 'No silver deposit.',
        note: 'A positive result distinguishes most aldehydes from ordinary ketones.',
      },
      {
        reagent: "Fehling's solution, with warming",
        confirm: 'Blue solution gives a brick-red precipitate.',
        absent: 'Solution remains blue; no brick-red precipitate.',
        note: 'Commonly used as a second aldehyde confirmation test.',
      },
    ],
  },
  {
    group: 'R–CO–R′',
    name: 'Ketone',
    tests: [
      {
        reagent: '2,4-DNPH followed by an aldehyde test',
        confirm: "2,4-DNPH gives a yellow/orange precipitate, but Tollens' reagent gives no silver deposit.",
        absent: 'If 2,4-DNPH is negative, the ordinary aldehyde/ketone carbonyl group is not confirmed.',
        note: 'A positive carbonyl test plus a negative aldehyde test supports identification as a ketone.',
      },
    ],
  },
  {
    group: '–COOH',
    name: 'Carboxylic acid',
    tests: [
      {
        reagent: 'Aqueous sodium carbonate or sodium hydrogencarbonate',
        confirm: 'Effervescence occurs; the evolved carbon dioxide turns limewater milky.',
        absent: 'No characteristic carbon-dioxide effervescence.',
        note: 'This distinguishes carboxylic acids from many neutral oxygen-containing organic compounds.',
      },
    ],
  },
  {
    group: 'CH₃CO– / CH₃CH(OH)–',
    name: 'Methyl carbonyl / methyl secondary alcohol',
    tests: [
      {
        reagent: 'Iodine in alkaline solution (iodoform test)',
        confirm: 'A pale-yellow precipitate of iodoform forms.',
        absent: 'No pale-yellow precipitate.',
        note: 'Positive for methyl ketones and alcohols that oxidise to methyl ketones, including ethanol/ethanal-related cases.',
      },
    ],
  },
  {
    group: 'C–X',
    name: 'Halogenoalkane',
    tests: [
      {
        reagent: 'Hydrolysis followed by acidified silver nitrate test for the released halide',
        confirm: 'A silver-halide precipitate forms: white for chloride, cream for bromide, yellow for iodide.',
        absent: 'No silver-halide precipitate after the corresponding hydrolysis/test sequence.',
        note: 'The precipitate colour helps identify which halogen was present.',
      },
    ],
  },
  {
    group: '–NH₂ / –NHR / –NR₂',
    name: 'Amine (basic organic nitrogen)',
    tests: [
      {
        reagent: 'Damp red litmus / dilute acid',
        confirm: 'Red litmus turns blue; with dilute acid the amine forms an ammonium salt.',
        absent: 'No basic litmus change under the same conditions.',
        note: 'This is a useful basicity screen; structural confirmation may require additional evidence.',
      },
    ],
  },
];
