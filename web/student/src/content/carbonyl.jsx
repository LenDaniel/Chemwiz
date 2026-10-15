// Carbonyl Compounds — OC-17 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.3 — Topic 17
// Syllabus coverage:
//   Nomenclature, isomerism of aldehydes and ketones
//   Preparation from primary and secondary alcohols
//   Mechanism of nucleophilic addition with HCN
//   Reduction with NaBH4
//   Suitable tests for aldehydes and ketones
//   (2,4-DNPH, Tollens, Fehling, alkaline iodine)

/* ============================================================
   Diagram specs (Phase K3 migration)
   ============================================================ */

const carbonylBondSpec = {
  title: 'THE C=O CARBONYL BOND',
  blocks: [
    { type: 'compare',
      left: { title: 'ALDEHYDE', body: [
        'R–C(=O)–H',
        'C=O at end of chain',
        'one R group, one H',
        'e.g. CH₃CHO',
        '(ethanal)',
      ], color: 'primary' },
      right: { title: 'KETONE', body: [
        "R–C(=O)–R'",
        'C=O between two carbons',
        'two R groups, no H',
        'e.g. CH₃COCH₃',
        '(propanone)',
      ], color: 'accent' },
    },
    { type: 'note', text: 'C=O is POLAR: δ+ on C, δ− on O', emphasis: true },
    { type: 'note', text: 'nucleophiles attack the δ+ carbon' },
  ],
};

const oxidationFlowSpec = {
  title: 'PREPARATION FROM ALCOHOLS',
  blocks: [
    { type: 'panel', title: 'FROM 1° ALCOHOL → ALDEHYDE', body: [
      'R–CH₂–OH + [O] → R–CHO + H₂O',
    ], hint: 'K₂Cr₂O₇/H₂SO₄, DISTIL out aldehyde', color: 'primary' },
    { type: 'panel', title: 'FROM 2° ALCOHOL → KETONE', body: [
      'R₂CH–OH + [O] → R₂C=O + H₂O',
    ], hint: 'K₂Cr₂O₇/H₂SO₄, REFLUX (no further oxidation)', color: 'accent' },
    { type: 'note', text: 'Colour change: ORANGE Cr₂O₇²⁻ → GREEN Cr³⁺', emphasis: true },
    { type: 'note', text: '(use Tollens\'/Fehling\'s to confirm aldehyde vs ketone)' },
  ],
};

const nucleophilicAdditionSpec = {
  title: 'NUCLEOPHILIC ADDITION OF HCN',
  blocks: [
    { type: 'panel', title: 'STEP 1 — CN⁻ ATTACKS δ+ C', body: [
      'R₂C=O + CN⁻ → R₂C(O⁻)(CN)',
    ], hint: 'curly arrow: from CN⁻ lone pair to C of C=O', color: 'pink' },
    { type: 'arrow', text: '↓' },
    { type: 'panel', title: 'STEP 2 — O⁻ PICKS UP A PROTON', body: [
      'R₂C(O⁻)(CN) + H⁺ → R₂C(OH)(CN)',
    ], hint: '(H⁺ from HCN itself, or H₂O / catalyst)', color: 'green' },
    { type: 'note', text: 'Product: 2-hydroxynitrile (cyanohydrin)', emphasis: true },
    { type: 'note', text: 'chain has grown by 1 carbon (the CN carbon)' },
    { type: 'note', text: 'Reagents: KCN + dilute H₂SO₄ (safer than gaseous HCN)' },
  ],
};

const reductionSpec = {
  title: 'REDUCTION OF CARBONYLS',
  blocks: [
    { type: 'panel', title: 'ALDEHYDE → 1° ALCOHOL', body: [
      'R–CHO + 2[H] → R–CH₂–OH',
    ], hint: 'e.g. ethanal → ethanol', color: 'primary' },
    { type: 'panel', title: 'KETONE → 2° ALCOHOL', body: [
      'R₂C=O + 2[H] → R₂CH–OH',
    ], hint: 'e.g. propanone → propan-2-ol', color: 'accent' },
    { type: 'note', text: 'Reagents: NaBH₄ in methanol/water', emphasis: true },
    { type: 'note', text: '(or LiAlH₄ in dry ether — more powerful, more dangerous)' },
  ],
};

const carbonylTestsSpec = {
  title: 'TESTS FOR CARBONYL COMPOUNDS',
  blocks: [
    { type: 'table',
      headers: ['Reagent', 'Aldehyde', 'Ketone'],
      colWidths: [110, 95, 85],
      rows: [
        ["2,4-DNPH (Brady's)",     'orange/yellow ppt',    'orange/yellow ppt'],
        ["Tollens'",               'silver mirror',        'no reaction'],
        ["Fehling's",              'brick-red Cu₂O',       'no reaction'],
        ["K₂Cr₂O₇/H⁺",             'orange → green',       'no change'],
        ['I₂/NaOH',                '+ if CH₃CHO',          '+ if CH₃CO–'],
      ],
    },
    { type: 'note', text: '2,4-DNPH detects C=O. Tollens\'/Fehling\'s distinguish aldehyde from ketone.' },
  ],
};

const dnphSpec = {
  title: "2,4-DNPH (BRADY'S REAGENT)",
  blocks: [
    { type: 'equation', text: 'R₂C=O + H₂N–NH–Ar → R₂C=N–NH–Ar + H₂O', big: true },
    { type: 'note', text: 'Ar = 2,4-dinitrophenyl group' },
    { type: 'panel', title: 'OBSERVATION', body: [
      'orange or yellow precipitate forms',
      '(a "2,4-dinitrophenylhydrazone" derivative)',
    ], color: 'primary' },
    { type: 'note', text: 'USE: confirms presence of C=O group', emphasis: true },
    { type: 'note', text: 'm.p. of derivative identifies the specific carbonyl' },
  ],
};

const tollensFehlingsSpec = {
  title: "TOLLENS' & FEHLING'S TESTS",
  blocks: [
    { type: 'panel', title: "TOLLENS' [Ag(NH₃)₂]⁺", body: [
      'aldehyde + 2[Ag(NH₃)₂]⁺ + 3OH⁻ →',
      'RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O',
    ], hint: 'SILVER MIRROR on inside of test tube (Ag⁺ → Ag)', color: 'primary' },
    { type: 'panel', title: "FEHLING'S (Cu²⁺ in alkali)", body: [
      'aldehyde + 2Cu²⁺ + 5OH⁻ →',
      'RCOO⁻ + Cu₂O↓ + 3H₂O',
    ], hint: 'BRICK-RED precipitate Cu₂O (blue Cu²⁺ → red Cu⁺)', color: 'accent' },
    { type: 'note', text: "Both: positive only with aldehydes; ketones don't react", emphasis: true },
    { type: 'note', text: '(aldehydes are easily oxidised; ketones are not)' },
  ],
};

const syntheticUtilitySpec = {
  title: 'CARBONYL COMPOUNDS IN SYNTHESIS',
  subtitle: 'R₂C=O — aldehyde or ketone — central building block',
  blocks: [
    { type: 'cards', cards: [
      { title: '+ NaBH₄', body: ['→ alcohol'], color: 'primary' },
      { title: '+ HCN',   body: ['→ cyanohydrin'], color: 'accent' },
    ]},
    { type: 'cards', cards: [
      { title: "+ Tollens'", body: ['→ acid', '(1° only)'], color: 'pink' },
      { title: '+ I₂/OH⁻',   body: ['→ CHI₃', '+ acid'], color: 'green' },
    ]},
    { type: 'note', text: 'C=O is the most versatile functional group', emphasis: true },
    { type: 'note', text: 'reduce, add, oxidise, or detect — all from one centre' },
  ],
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  { id: 'cb1', title: 'The Carbonyl Group: C=O', minutes: 8, blocks: [
    { type: 'p', text: 'Carbonyl compounds contain the C=O double bond. There are two main classes at A-level: ALDEHYDES (R-CHO, the C=O is at the end of a chain with at least one H attached) and KETONES (R-CO-R\', the C=O is in the middle of a chain with two R groups attached). The C=O group is highly polar and is the centre of nearly all carbonyl chemistry.' },
    { type: 'd', spec: carbonylBondSpec, caption: 'Aldehydes and ketones differ in what is attached to the C=O' },
    { type: 'h', text: 'Why is C=O so reactive?' },
    { type: 'ul', items: [
      'Oxygen is much more electronegative than carbon, so the C=O bond is highly POLAR — δ+ on C, δ− on O.',
      'The δ+ carbon is a target for NUCLEOPHILES (electron-rich species like CN⁻, H⁻, NH₃).',
      'The C=O π bond is a "locked" target — it can break easily on attack, providing a place for nucleophile addition.',
      'Most carbonyl reactions are NUCLEOPHILIC ADDITION — a nucleophile adds across the C=O, breaking the π bond.',
    ]},
    { type: 'h', text: 'Aldehyde vs ketone — what\'s the difference?' },
    { type: 'ul', items: [
      'Aldehyde: at least one H attached directly to the carbonyl carbon. R-CHO. The H makes aldehydes EASIER TO OXIDISE (this distinguishes them from ketones).',
      'Ketone: two R groups (carbon chains) attached to the carbonyl carbon, no H. R-CO-R\'. Cannot be easily oxidised because there is no H on the carbonyl C to remove.',
      'Both have the same C=O reactivity towards nucleophiles, but aldehydes are slightly more reactive because the smaller H lets the nucleophile approach more easily and the H is also less electron-donating than alkyl groups.',
    ]},
    { type: 'callout', kind: 'key', title: 'The defining test', body: 'Aldehydes and ketones look similar — both contain C=O — and give the same response to 2,4-DNPH. To distinguish them, use a mild oxidising agent: Tollens\' reagent (silver mirror) or Fehling\'s solution (red precipitate). Aldehydes oxidise; ketones do not. This is the most asked carbonyl distinction at A-level.' },
    { type: 'takeaway', items: [
      'Carbonyl group: C=O, highly polar (δ+ C, δ− O).',
      'Aldehyde: R-CHO (H on C=O); ketone: R-CO-R\' (no H).',
      'Most reactions: nucleophilic addition across the C=O.',
      'Aldehydes oxidise easily (Tollens\'/Fehling\'s positive); ketones do not.',
    ]},
  ]},

  { id: 'cb2', title: 'Naming Aldehydes & Ketones', minutes: 7, blocks: [
    { type: 'p', text: 'IUPAC names of aldehydes end in "-al"; ketones end in "-one". The carbonyl carbon is included in the longest chain count.' },
    { type: 'h', text: 'Naming aldehydes' },
    { type: 'ul', items: [
      'Find the longest chain that includes the C=O carbon (always at C1 — at the end).',
      'Replace the "-e" of the parent alkane with "-al". The carbonyl is automatically position 1, no locant needed.',
      'Examples: HCHO = methanal (formaldehyde); CH₃CHO = ethanal (acetaldehyde); CH₃CH₂CHO = propanal; CH₃CH(CH₃)CHO = 2-methylpropanal.',
    ]},
    { type: 'h', text: 'Naming ketones' },
    { type: 'ul', items: [
      'Find the longest chain including the C=O carbon. Number from the end giving the C=O the LOWEST locant.',
      'Replace the "-e" of the alkane with "-one", with the position of C=O before it.',
      'Examples: CH₃COCH₃ = propan-2-one (commonly: acetone); CH₃COCH₂CH₃ = butan-2-one; CH₃CH₂COCH₂CH₃ = pentan-3-one.',
      'For ketones with more than 5 carbons, the locant matters because the C=O can be at different positions.',
    ]},
    { type: 'h', text: 'Common names worth knowing' },
    { type: 'ul', items: [
      'Methanal (HCHO) — also called formaldehyde. Used as preservative (formalin solution).',
      'Ethanal (CH₃CHO) — also called acetaldehyde.',
      'Propan-2-one (CH₃COCH₃) — also called acetone. Common solvent (nail polish remover).',
      'Benzaldehyde (C₆H₅CHO) — almond smell, used in flavourings.',
      'Phenylethanone (C₆H₅COCH₃) — also called acetophenone.',
    ]},
    { type: 'takeaway', items: [
      'Aldehyde names end in "-al"; ketones end in "-one".',
      'Aldehyde C=O is always at C1; ketone C=O needs a locant.',
      'Common names you should recognise: formaldehyde, acetaldehyde, acetone, benzaldehyde.',
    ]},
  ]},

  { id: 'cb3', title: 'Isomerism', minutes: 7, blocks: [
    { type: 'p', text: 'Carbonyl compounds show several types of isomerism: chain, position, functional group (between aldehydes and ketones), and optical isomerism.' },
    { type: 'h', text: 'Functional group isomerism: aldehyde vs ketone' },
    { type: 'ul', items: [
      'Aldehydes and ketones with the same molecular formula are functional group isomers.',
      'C₃H₆O has two such isomers: propanal (CH₃CH₂CHO, aldehyde) and propanone (CH₃COCH₃, ketone).',
      'They have similar chemistries (both react with 2,4-DNPH to give an orange precipitate) but DIFFERENT response to mild oxidisers (only the aldehyde reacts).',
    ]},
    { type: 'h', text: 'Position isomerism in ketones' },
    { type: 'p', text: 'For larger ketones, the C=O can be at different positions. C₅H₁₀O has pentan-2-one (CH₃COCH₂CH₂CH₃) and pentan-3-one (CH₃CH₂COCH₂CH₃) as position isomers.' },
    { type: 'h', text: 'Chain isomerism' },
    { type: 'p', text: 'Same molecular formula, different carbon skeleton. C₅H₁₀O ketones include pentan-2-one (straight chain) and 3-methylbutan-2-one (branched, CH₃COCH(CH₃)CH₃).' },
    { type: 'h', text: 'Optical isomerism' },
    { type: 'ul', items: [
      'Possible when a carbon other than the carbonyl C has 4 different groups attached.',
      'Example: 2-methylbutanal — CH₃CH₂CH(CH₃)CHO — the C2 has H, CH₃, CH₂CH₃ and CHO attached → chiral.',
      'The carbonyl carbon itself is sp² (planar) so cannot be a chiral centre.',
    ]},
    { type: 'callout', kind: 'key', title: 'Test for distinguishing aldehyde from ketone (functional group isomers)', body: 'Use Tollens\' reagent or Fehling\'s solution. A silver mirror (Tollens\') or brick-red precipitate (Fehling\'s) confirms an aldehyde. No reaction means a ketone.' },
    { type: 'takeaway', items: [
      'Aldehydes and ketones are functional group isomers if same molecular formula.',
      'Position and chain isomerism for larger ketones.',
      'Optical isomerism if a chiral centre exists OUTSIDE the C=O.',
      'Tollens\'/Fehling\'s distinguishes aldehyde from ketone.',
    ]},
  ]},

  { id: 'cb4', title: 'Preparation: Oxidation of Alcohols', minutes: 8, blocks: [
    { type: 'p', text: 'The standard preparation of aldehydes and ketones is by oxidation of alcohols. Primary alcohols give aldehydes (which can be further oxidised to acids); secondary alcohols give ketones (no further oxidation).' },
    { type: 'd', spec: oxidationFlowSpec, caption: 'Aldehydes from 1° alcohols; ketones from 2° alcohols' },
    { type: 'h', text: 'Aldehyde from a primary alcohol' },
    { type: 'ul', items: [
      'R-CH₂-OH + [O] → R-CHO + H₂O.',
      'Reagents: acidified potassium dichromate(VI), K₂Cr₂O₇/H₂SO₄ (or sodium dichromate, Na₂Cr₂O₇).',
      'Conditions: warm gently, DISTIL the aldehyde out as it forms.',
      'Why distil? The aldehyde has a LOWER boiling point than the alcohol (no H-bonding in aldehydes — only weak dipole-dipole). It evaporates and condenses in the receiver before being further oxidised to a carboxylic acid.',
      'Colour change: orange Cr₂O₇²⁻ → green Cr³⁺.',
    ]},
    { type: 'h', text: 'Ketone from a secondary alcohol' },
    { type: 'ul', items: [
      'R₂CH-OH + [O] → R₂C=O + H₂O.',
      'Reagents: same — acidified K₂Cr₂O₇/H₂SO₄.',
      'Conditions: REFLUX. No need to distil — ketones are not further oxidised by these mild oxidisers.',
      'Colour change: orange → green.',
    ]},
    { type: 'h', text: 'Why ketones don\'t oxidise further' },
    { type: 'p', text: 'Further oxidation would require breaking a C-C bond (since the carbonyl C in a ketone has no H to remove). Mild oxidisers like K₂Cr₂O₇ cannot do this. Only very harsh conditions (concentrated KMnO₄, hot) can break C-C bonds, and that gives a mixture of products.' },
    { type: 'h', text: 'Other preparation methods' },
    { type: 'ul', items: [
      'Aldehyde from acyl chloride + LiAlH(OtBu)₃ (very mild reducer that stops at aldehyde) — beyond the syllabus but useful to know.',
      'Aldehyde from ozonolysis of alkene: R-CH=CH-R\' + O₃ then Zn/H₂O → 2 R-CHO. Cleaves the C=C and gives two aldehydes.',
      'Methyl ketones from hydration of terminal alkynes (Markovnikov, with Hg²⁺ catalyst).',
    ]},
    { type: 'takeaway', items: [
      '1° alcohol + K₂Cr₂O₇/H₂SO₄ → aldehyde (DISTIL).',
      '2° alcohol + K₂Cr₂O₇/H₂SO₄ → ketone (REFLUX).',
      'Orange → green colour change. Ketones don\'t oxidise further (no H on C=O).',
    ]},
  ]},

  { id: 'cb5', title: 'Nucleophilic Addition: HCN Mechanism', minutes: 11, blocks: [
    { type: 'p', text: 'The most important reaction of carbonyl compounds is NUCLEOPHILIC ADDITION across the C=O double bond. The classic example uses HCN to give a 2-hydroxynitrile (cyanohydrin). This adds a carbon to the chain — useful for synthesis.' },
    { type: 'd', spec: nucleophilicAdditionSpec, caption: 'Two-step nucleophilic addition mechanism' },
    { type: 'h', text: 'The two steps' },
    { type: 'ul', items: [
      'STEP 1: CN⁻ attacks the δ+ carbon of C=O. Two curly arrows: one from CN⁻ lone pair to C, one from C=O π bond to O. This breaks the π bond and forms a tetrahedral intermediate with O carrying a negative charge: R₂C(O⁻)(CN).',
      'STEP 2: The negatively charged O picks up a proton to give the neutral product. R₂C(O⁻)(CN) + H⁺ → R₂C(OH)(CN). The H⁺ can come from undissociated HCN, from water, or from a small amount of dilute acid added.',
    ]},
    { type: 'h', text: 'Reagents and conditions' },
    { type: 'ul', items: [
      'In practice, gaseous HCN is too dangerous to handle, so KCN with a small amount of dilute H₂SO₄ is used. KCN provides the CN⁻ nucleophile; the small amount of acid keeps a low concentration of free HCN around to provide H⁺ for step 2.',
      'Without any acid: pure KCN solution would not work because the equilibrium of step 1 lies far to the left (CN⁻ is the dominant species, but no H⁺ to complete step 2).',
      'Without any base: pure HCN gives slow reaction because CN⁻ concentration is very low.',
      'Typical conditions: KCN(aq) + dilute H₂SO₄, at ~10-20 °C, mixed with the carbonyl compound.',
    ]},
    { type: 'h', text: 'Why is this useful?' },
    { type: 'ul', items: [
      'The product (cyanohydrin / 2-hydroxynitrile) has TWO functional groups: -OH and -CN.',
      'Adding HCN to a carbonyl gives a chain ONE CARBON longer than the starting material.',
      'The nitrile (CN) can then be HYDROLYSED to a carboxylic acid (R₂C(OH)COOH = a 2-hydroxy carboxylic acid, like lactic acid).',
      'Or the nitrile can be REDUCED to a primary amine (R₂C(OH)CH₂NH₂).',
      'This is a key chain-extension method in synthesis.',
    ]},
    { type: 'callout', kind: 'key', title: 'Stereochemistry: a racemate forms', body: 'When HCN adds to an unsymmetrical aldehyde or ketone (like ethanal CH₃CHO), the product is a chiral molecule. CN⁻ can attack from either face of the planar C=O equally, so a 50:50 RACEMIC MIXTURE of the two enantiomers is produced. This is a frequent exam point.' },
    { type: 'takeaway', items: [
      'Nucleophilic addition: CN⁻ attacks δ+ C → tetrahedral intermediate → protonation gives cyanohydrin.',
      'Reagents: KCN + dilute H₂SO₄ (safer than HCN gas).',
      'Adds one carbon; product can be hydrolysed to a 2-hydroxy acid.',
      'Unsymmetrical carbonyls give a racemic mixture (planar C=O attacked equally from both faces).',
    ]},
  ]},

  { id: 'cb6', title: 'Reduction with NaBH₄', minutes: 8, blocks: [
    { type: 'p', text: 'Aldehydes and ketones can be reduced back to alcohols using NaBH₄ (sodium tetrahydridoborate, also called sodium borohydride). This is the reverse of the oxidation reaction.' },
    { type: 'd', spec: reductionSpec, caption: 'Reduction gives the parent alcohol back' },
    { type: 'h', text: 'The reactions' },
    { type: 'ul', items: [
      'Aldehyde + 2[H] → 1° alcohol. Example: CH₃CHO + 2[H] → CH₃CH₂OH (ethanal → ethanol).',
      'Ketone + 2[H] → 2° alcohol. Example: CH₃COCH₃ + 2[H] → (CH₃)₂CHOH (propanone → propan-2-ol).',
      '[H] represents a hydrogen atom from the reducing agent. NaBH₄ is the source.',
    ]},
    { type: 'h', text: 'Reagents and conditions' },
    { type: 'ul', items: [
      'NaBH₄ is the standard A-level reducer for carbonyls. Solvent: methanol or ethanol or water (NaBH₄ does not react violently with these — it is mild).',
      'Conditions: room temperature or gentle warming.',
      'NaBH₄ is selective: it reduces aldehydes and ketones but does NOT reduce carboxylic acids or esters under normal conditions.',
      'LiAlH₄ (lithium tetrahydridoaluminate) is more powerful — it reduces aldehydes, ketones, AND carboxylic acids and esters. But it must be used in DRY ETHER (it reacts violently with water).',
    ]},
    { type: 'h', text: 'Mechanism (overview)' },
    { type: 'ul', items: [
      'NaBH₄ delivers hydride (H⁻) — a hydrogen ion with a lone pair, acting as a nucleophile.',
      'H⁻ attacks the δ+ carbon of C=O; the π bond breaks with electrons going to O.',
      'Tetrahedral intermediate: R₂C(H)(O⁻).',
      'Protonation of O⁻ (from solvent water/methanol) gives the alcohol: R₂CH-OH.',
      'Mechanism is similar to HCN addition but with H⁻ as the nucleophile.',
    ]},
    { type: 'callout', kind: 'key', title: 'Hydrogen as a nucleophile', body: 'In reduction, hydride (H⁻) acts as a nucleophile. This is unusual — usually we think of H⁺ (a proton, electrophile). NaBH₄ provides H⁻ because the boron-hydrogen bond is polarised the opposite way (H is more electronegative than B). State this clearly in mechanism questions.' },
    { type: 'takeaway', items: [
      'Aldehyde → 1° alcohol; ketone → 2° alcohol.',
      'NaBH₄ in methanol/water — mild and selective.',
      'LiAlH₄ stronger but requires dry ether.',
      'H⁻ acts as nucleophile (hydride).',
    ]},
  ]},

  { id: 'cb7', title: '2,4-DNPH (Brady\'s Reagent)', minutes: 7, blocks: [
    { type: 'p', text: '2,4-DNPH (2,4-dinitrophenylhydrazine, also called Brady\'s reagent) is the standard test for the C=O group. It reacts with both aldehydes AND ketones to give an orange/yellow precipitate, but does NOT react with esters or carboxylic acids.' },
    { type: 'd', spec: dnphSpec, caption: 'Brady\'s test confirms carbonyl group presence' },
    { type: 'h', text: 'The reaction' },
    { type: 'ul', items: [
      'R₂C=O + H₂N-NH-Ar → R₂C=N-NH-Ar + H₂O. (Ar = 2,4-dinitrophenyl group.)',
      'Type: condensation reaction (forms a new C=N bond, eliminates water).',
      'Product: 2,4-dinitrophenylhydrazone — an ORANGE or YELLOW solid that precipitates from solution.',
      'Conditions: mix the carbonyl with 2,4-DNPH solution (in methanol/H₂SO₄). The precipitate appears at room temperature.',
    ]},
    { type: 'h', text: 'Why it works' },
    { type: 'p', text: 'The hydrazine NH₂ group acts as a nucleophile, attacking the δ+ carbonyl carbon. After addition, water is eliminated to form a stable C=N bond. The aromatic dinitrophenyl group makes the product a highly coloured, insoluble solid that precipitates out — making it a clear visual test.' },
    { type: 'h', text: 'Identifying specific carbonyls' },
    { type: 'ul', items: [
      'Each carbonyl gives a 2,4-DNP derivative with a SPECIFIC, REPRODUCIBLE melting point.',
      'Filter, wash, recrystallise the orange/yellow precipitate, then measure its melting point.',
      'Compare the m.p. with database values to identify the specific carbonyl.',
      'This was a primary identification method before modern spectroscopy.',
    ]},
    { type: 'callout', kind: 'key', title: 'What 2,4-DNPH tells you and doesn\'t tell you', body: 'A positive Brady\'s test (orange ppt) confirms the presence of a C=O group (aldehyde OR ketone). It does NOT distinguish between them. To distinguish, follow up with Tollens\' or Fehling\'s. A negative Brady\'s test means the substance does NOT contain a free C=O (esters and carboxylic acids give NO precipitate).' },
    { type: 'takeaway', items: [
      '2,4-DNPH = Brady\'s reagent. Tests for C=O.',
      'Orange/yellow precipitate of 2,4-dinitrophenylhydrazone.',
      'Both aldehydes and ketones give positive — does not distinguish them.',
      'M.p. of derivative identifies the specific carbonyl.',
    ]},
  ]},

  { id: 'cb8', title: 'Tollens\' & Fehling\'s Tests', minutes: 9, blocks: [
    { type: 'p', text: 'Tollens\' and Fehling\'s are MILD OXIDISING agents that distinguish aldehydes from ketones. Aldehydes are oxidised (giving distinctive observations); ketones are not.' },
    { type: 'd', spec: tollensFehlingsSpec, caption: 'The two tests for aldehyde vs ketone' },
    { type: 'h', text: 'Tollens\' reagent' },
    { type: 'ul', items: [
      'Made fresh: AgNO₃(aq) + NaOH(aq) gives a brown precipitate of Ag₂O. Add NH₃(aq) until the precipitate just dissolves — this gives the Tollens\' reagent: [Ag(NH₃)₂]⁺ in solution.',
      'Reaction: aldehyde + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O.',
      'Observation: a SILVER MIRROR forms on the inside of the warm test tube. This is metallic silver (Ag) deposited from reduction of Ag⁺.',
      'Aldehyde is oxidised to carboxylic acid (carboxylate ion in alkaline conditions).',
      'Ketones do not react: no silver mirror.',
    ]},
    { type: 'h', text: 'Fehling\'s solution' },
    { type: 'ul', items: [
      'Two solutions: Fehling\'s A (CuSO₄(aq), blue) + Fehling\'s B (Na/K tartrate in NaOH). Mixed together, gives a deep blue solution containing Cu²⁺ complexed with tartrate (which keeps Cu²⁺ in solution under alkaline conditions).',
      'Reaction: aldehyde + 2Cu²⁺ + 5OH⁻ → RCOO⁻ + Cu₂O↓ + 3H₂O.',
      'Observation: BRICK-RED PRECIPITATE of copper(I) oxide forms. The blue colour fades.',
      'Aldehyde is oxidised; Cu²⁺ is reduced to Cu⁺ (in Cu₂O).',
      'Ketones do not react: no precipitate.',
    ]},
    { type: 'h', text: 'Why aldehydes oxidise and ketones don\'t' },
    { type: 'p', text: 'In an aldehyde (R-CHO), the carbonyl carbon has an H attached. Oxidation removes this H and replaces it with OH, giving R-COOH (carboxylic acid). In a ketone (R-CO-R\'), there is no H on the carbonyl carbon — to oxidise, you would have to break a C-C bond, which mild oxidisers cannot do.' },
    { type: 'h', text: 'Aromatic vs aliphatic aldehydes' },
    { type: 'ul', items: [
      'Aliphatic aldehydes (CH₃CHO, CH₃CH₂CHO) give positive Tollens\' AND Fehling\'s.',
      'Aromatic aldehydes (C₆H₅CHO benzaldehyde) give POSITIVE Tollens\' but NEGATIVE Fehling\'s — Fehling\'s is too weak to oxidise the more stable aromatic aldehyde.',
      'This is a useful distinction in practice: only Tollens\' is reliable for aromatic aldehydes.',
    ]},
    { type: 'takeaway', items: [
      'Tollens\' [Ag(NH₃)₂]⁺ — silver mirror with aldehydes.',
      'Fehling\'s (Cu²⁺/tartrate) — brick-red Cu₂O ppt with aliphatic aldehydes only.',
      'Ketones: no reaction with either.',
      'Aldehyde oxidised to carboxylic acid (or carboxylate in alkali).',
    ]},
  ]},

  { id: 'cb9', title: 'The Iodoform Test for Methyl Carbonyls', minutes: 7, blocks: [
    { type: 'p', text: 'The iodoform test (already met for alcohols) also identifies certain carbonyl compounds. Specifically, it gives a positive result with METHYL KETONES (CH₃-CO-R) and ETHANAL (CH₃-CHO).' },
    { type: 'h', text: 'Reagent and conditions' },
    { type: 'ul', items: [
      'Reagent: alkaline iodine — I₂ in NaOH(aq), or I₂ + KI in NaOH.',
      'Conditions: warm gently. The iodine colour fades; a yellow precipitate of CHI₃ (triiodomethane / "iodoform") forms.',
      'Distinctive antiseptic smell.',
    ]},
    { type: 'h', text: 'Which carbonyls give positive?' },
    { type: 'ul', items: [
      'POSITIVE: any compound containing CH₃-CO- (methyl ketone). Examples: propanone (CH₃COCH₃), butanone (CH₃COCH₂CH₃), phenylethanone (C₆H₅COCH₃).',
      'POSITIVE: ethanal (CH₃CHO) — the only aldehyde that gives a positive iodoform.',
      'NEGATIVE: methanal (HCHO) — no methyl group attached to the C=O. NEGATIVE: propanal (CH₃CH₂CHO) — the methyl is not adjacent to C=O.',
      'NEGATIVE: most other ketones like pentan-3-one (CH₃CH₂COCH₂CH₃) — no CH₃ on the carbonyl.',
    ]},
    { type: 'h', text: 'Mechanism overview' },
    { type: 'ul', items: [
      'Step 1: under alkaline conditions, the alpha hydrogens of the CH₃ are removed sequentially and replaced by I, giving CI₃-CO-R.',
      'Step 2: alkaline hydrolysis cleaves the bond between CI₃ and C=O, giving CHI₃ (yellow ppt) and a carboxylate ion R-COO⁻.',
      'Overall: CH₃COR + 3I₂ + 4OH⁻ → CHI₃↓ + RCOO⁻ + 3I⁻ + 3H₂O.',
    ]},
    { type: 'callout', kind: 'key', title: 'Cross-link with hydroxy compounds', body: 'The iodoform test also detects CH₃-CH(OH)- groups (methyl 2° alcohols including ethanol). This is because alkaline iodine FIRST oxidises the alcohol to a methyl ketone, then proceeds with the iodoform sequence. So the test detects BOTH carbonyls (CH₃CO–) AND certain alcohols (CH₃CHOH–). See OC-16 hydroxy compounds for full coverage.' },
    { type: 'takeaway', items: [
      'Iodoform: I₂ in NaOH(aq), warm. Yellow ppt of CHI₃ = positive.',
      'Positive for: methyl ketones (CH₃CO-R) and ethanal (CH₃CHO).',
      'Plus: ethanol and methyl 2° alcohols (oxidised first to methyl ketones).',
    ]},
  ]},

  { id: 'cb10', title: 'Distinguishing Aldehydes & Ketones', minutes: 7, blocks: [
    { type: 'p', text: 'A common exam task: given an unknown that contains a C=O, distinguish aldehyde from ketone. Here is the systematic approach.' },
    { type: 'd', spec: carbonylTestsSpec, caption: 'Summary of carbonyl tests' },
    { type: 'h', text: 'The decision tree' },
    { type: 'ul', items: [
      'Step 1: Add 2,4-DNPH. Orange/yellow ppt? → C=O present (aldehyde or ketone). No ppt? → not a carbonyl (could be ester, acid, alcohol, etc.).',
      'Step 2 (if Step 1 positive): Add Tollens\' reagent and warm. Silver mirror? → ALDEHYDE. No mirror? → KETONE.',
      'Step 3 (if needed): Use Fehling\'s solution. Brick-red ppt? → ALIPHATIC ALDEHYDE specifically. (Aromatic aldehydes give negative Fehling\'s but positive Tollens\'.)',
      'Step 4 (optional): Iodoform (I₂/NaOH) test. Yellow ppt? → methyl carbonyl (CH₃-CO-R or CH₃-CHO).',
    ]},
    { type: 'h', text: 'Worked decision example' },
    { type: 'ul', items: [
      'Compound A: gives orange ppt with 2,4-DNPH; gives silver mirror with Tollens\'; gives yellow CHI₃ with I₂/NaOH.',
      'Step 1: 2,4-DNPH +ve → it is a carbonyl.',
      'Step 2: Tollens\' +ve → it is an ALDEHYDE.',
      'Step 3: Iodoform +ve → must contain CH₃-CHO group.',
      'Conclusion: A is ETHANAL (CH₃CHO) — the only aldehyde that gives a positive iodoform test.',
    ]},
    { type: 'h', text: 'Acidified K₂Cr₂O₇ as a confirmatory test' },
    { type: 'p', text: 'You can also use acidified K₂Cr₂O₇ as a follow-up. Aldehydes are oxidised to carboxylic acids: orange → green colour change. Ketones do NOT oxidise: orange remains orange. Less mild than Tollens\' or Fehling\'s but useful confirmation.' },
    { type: 'takeaway', items: [
      'Test 1: 2,4-DNPH → confirms C=O (aldehyde or ketone).',
      'Test 2: Tollens\' → silver mirror = aldehyde.',
      'Test 3: Fehling\'s → brick-red ppt = aliphatic aldehyde.',
      'Test 4: Iodoform → CHI₃ ppt = methyl carbonyl (CH₃CO- or CH₃CHO).',
    ]},
  ]},

  { id: 'cb11', title: 'Carbonyls in Synthesis', minutes: 7, blocks: [
    { type: 'p', text: 'Aldehydes and ketones are versatile intermediates in organic synthesis — they can be converted to many different functional groups.' },
    { type: 'd', spec: syntheticUtilitySpec, caption: 'Synthetic options from carbonyls' },
    { type: 'h', text: 'From a carbonyl, you can make:' },
    { type: 'ul', items: [
      'Alcohol: NaBH₄ in methanol → 1° alcohol (from aldehyde) or 2° alcohol (from ketone).',
      'Cyanohydrin (2-hydroxynitrile): KCN/dilute H₂SO₄ → R₂C(OH)CN. Adds one carbon.',
      '2-hydroxy carboxylic acid: hydrolyse the cyanohydrin with HCl(aq), reflux → R₂C(OH)COOH (e.g. lactic acid from acetaldehyde).',
      'Carboxylic acid (from aldehyde only): K₂Cr₂O₇/H₂SO₄ reflux, or Tollens\' (in alkali, gives carboxylate).',
      'Imine (Schiff base): aldehyde/ketone + primary amine → R₂C=N-R\' + H₂O. Beyond core syllabus.',
      '2,4-DNP derivative: 2,4-DNPH → orange ppt for identification.',
    ]},
    { type: 'h', text: 'Multi-step example: ethanal → lactic acid' },
    { type: 'ul', items: [
      'Step 1: CH₃CHO + HCN → CH₃CH(OH)CN (2-hydroxypropanenitrile). Reagents: KCN/dilute H₂SO₄, ~10 °C.',
      'Step 2: hydrolyse the nitrile. CH₃CH(OH)CN + 2H₂O + HCl → CH₃CH(OH)COOH + NH₄Cl. Reagents: dilute HCl, reflux.',
      'Final product: 2-hydroxypropanoic acid (lactic acid). Note this is a chiral molecule produced as a racemate.',
    ]},
    { type: 'h', text: 'Multi-step example: propanone → propan-2-ol → propene' },
    { type: 'ul', items: [
      'Step 1: CH₃COCH₃ + 2[H] → (CH₃)₂CHOH. NaBH₄ in methanol.',
      'Step 2: (CH₃)₂CHOH → CH₃CH=CH₂ + H₂O. Conc. H₂SO₄, 170 °C (dehydration).',
    ]},
    { type: 'takeaway', items: [
      'Carbonyls → alcohols (NaBH₄), cyanohydrins (KCN), acids (oxidation).',
      'Cyanohydrin route extends carbon chain by 1.',
      'Multi-step synthesis: ethanal → lactic acid (HCN then hydrolyse).',
    ]},
  ]},

  { id: 'cb12', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Carbonyl questions test mechanism, identification tests, and synthesis. Here are the patterns.' },
    { type: 'h', text: 'Identifying carbonyls' },
    { type: 'ul', items: [
      'Aldehyde general formula R-CHO. Ketone R-CO-R\'. Both contain C=O.',
      'For mechanism questions, ALWAYS show curly arrows correctly. Two arrows in step 1: from nucleophile lone pair to C, AND from C=O π bond to O. One arrow in step 2: from H⁺ to O⁻.',
      'Show partial charges (δ+ on C, δ− on O) on the C=O bond.',
      'Show lone pairs on the nucleophile (CN⁻ has lone pairs on C; H⁻ has its pair).',
    ]},
    { type: 'h', text: 'Test selection' },
    { type: 'ul', items: [
      'To distinguish aldehyde from ketone: Tollens\' (silver mirror) or Fehling\'s (red ppt).',
      'To confirm any C=O: 2,4-DNPH (orange ppt).',
      'To find a methyl carbonyl: iodoform (yellow ppt).',
      'For aromatic aldehydes (e.g. benzaldehyde): use Tollens\' — Fehling\'s is too weak.',
      'For oxidation of aldehyde to acid in synthesis: K₂Cr₂O₇/H₂SO₄ reflux, or Tollens\' under alkaline conditions.',
    ]},
    { type: 'h', text: 'Common mistakes' },
    { type: 'ul', items: [
      'Saying ketones give a positive Tollens\' or Fehling\'s — they DO NOT (no H on C=O carbon to remove).',
      'Forgetting that benzaldehyde gives positive Tollens\' but NEGATIVE Fehling\'s.',
      'In HCN mechanism: writing the nucleophile as HCN — it is CN⁻ (the conjugate base) that attacks. Use KCN as the source.',
      'Forgetting that HCN addition gives a RACEMATE when the carbonyl is unsymmetrical.',
      'Confusing the iodoform test conditions: it is alkaline I₂ (I₂ + NaOH), not acidic.',
    ]},
    { type: 'h', text: 'Key equations to know' },
    { type: 'ul', items: [
      'Preparation: R-CH₂-OH → R-CHO (distil); R₂CH-OH → R₂C=O (reflux).',
      'Reduction: R₂C=O + 2[H] → R₂CH-OH (NaBH₄).',
      'HCN addition: R₂C=O + HCN → R₂C(OH)(CN).',
      'Tollens\': RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O.',
      'Fehling\'s: RCHO + 2Cu²⁺ + 5OH⁻ → RCOO⁻ + Cu₂O↓ + 3H₂O.',
      'Iodoform (CH₃CO-R): CH₃COR + 3I₂ + 4OH⁻ → CHI₃ + RCOO⁻ + 3I⁻ + 3H₂O.',
    ]},
    { type: 'callout', kind: 'key', title: 'The carbonyl distinction toolbox', body: 'A "given an unknown carbonyl, distinguish it" question always uses some combination of: 2,4-DNPH (any C=O); Tollens\'/Fehling\'s (aldehyde only); iodoform (CH₃-CO- or CH₃-CHO); K₂Cr₂O₇ (aldehyde to acid). Practice running through this decision tree on dozens of unknowns.' },
    { type: 'takeaway', items: [
      'Tests: 2,4-DNPH (any C=O), Tollens\'/Fehling\'s (aldehyde), iodoform (methyl).',
      'Mechanism: nucleophile attacks δ+ C, π bond breaks, O⁻ protonated.',
      'NaBH₄ reduces back to alcohol; HCN extends chain by 1 carbon.',
      'Ketones don\'t oxidise; aldehydes do.',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 32 MCQs
   ============================================================ */
const quizzes = [
  { q: 'The general formula of an aldehyde is:', opts: ['R-CO-R\'', 'R-CHO', 'R-COOH', 'R-OH'], ans: 1, hint: 'Aldehyde has H on the carbonyl C.' },
  { q: 'Which of these is a ketone?', opts: ['CH₃CHO', 'CH₃COOH', 'CH₃COCH₃', 'CH₃CH₂OH'], ans: 2, hint: 'Ketone has C=O between two R groups.' },
  { q: 'The IUPAC name of CH₃COCH₂CH₃ is:', opts: ['Butanal', 'Butan-2-one', 'Butanoic acid', 'Butan-1-ol'], ans: 1, hint: 'Ketone, 4 C, C=O at position 2.' },
  { q: 'Which oxidation makes a ketone?', opts: ['1° alcohol → ?', '2° alcohol → ?', '3° alcohol → ?', 'Aldehyde → ?'], ans: 1, hint: 'Secondary alcohols → ketones.' },
  { q: 'The reagent for oxidising 2° alcohols to ketones:', opts: ['NaBH₄', 'K₂Cr₂O₇/H₂SO₄', 'NaOH(aq)', 'AgNO₃'], ans: 1, hint: 'Acidified dichromate is the standard mild oxidiser.' },
  { q: 'When oxidising a 1° alcohol to an aldehyde, you should:', opts: ['Reflux for hours', 'Distil out the aldehyde as it forms', 'Use excess oxidiser', 'Cool to 0 °C'], ans: 1, hint: 'Aldehyde has lower b.p. than alcohol — it distils out before further oxidation.' },
  { q: 'In nucleophilic addition of HCN to a carbonyl, the nucleophile is:', opts: ['HCN', 'CN⁻', 'H⁺', 'OH⁻'], ans: 1, hint: 'CN⁻ has the lone pair that attacks δ+ C.' },
  { q: 'The product of HCN addition to ethanal is:', opts: ['CH₃CN', 'CH₃CH(OH)CN', 'CH₃COCN', 'CH₃CH₂NH₂'], ans: 1, hint: 'OH and CN add across the C=O.' },
  { q: 'HCN addition increases the chain length by:', opts: ['0 carbons', '1 carbon', '2 carbons', 'It depends'], ans: 1, hint: 'CN brings one new carbon.' },
  { q: 'The product of HCN addition to an unsymmetrical carbonyl is:', opts: ['One enantiomer only', 'Racemic mixture', 'A meso compound', 'Achiral'], ans: 1, hint: 'CN⁻ attacks planar C=O from either face equally.' },
  { q: 'Why is KCN preferred over HCN(g)?', opts: ['HCN is too cheap', 'HCN(g) is highly toxic; KCN provides CN⁻ in solution', 'KCN dissolves better', 'HCN gives only a small yield'], ans: 1, hint: 'Safety: gaseous HCN is extremely toxic.' },
  { q: 'Reduction of propanone with NaBH₄ gives:', opts: ['Propan-1-ol', 'Propan-2-ol', 'Propanal', 'Propanoic acid'], ans: 1, hint: 'Ketone + 2[H] → 2° alcohol.' },
  { q: 'NaBH₄ acts as a source of:', opts: ['H⁺ (proton)', 'H⁻ (hydride)', 'H· (radical)', 'H₂'], ans: 1, hint: 'Hydride is the nucleophile in NaBH₄ reductions.' },
  { q: 'NaBH₄ reduces:', opts: ['Esters and acids only', 'Aldehydes and ketones', 'All organic compounds', 'Only ketones'], ans: 1, hint: 'NaBH₄ is selective for carbonyls; LiAlH₄ is more powerful.' },
  { q: 'A solvent suitable for NaBH₄ reduction is:', opts: ['Dry ether (must avoid water)', 'Methanol or water', 'Concentrated H₂SO₄', 'Hexane only'], ans: 1, hint: 'NaBH₄ tolerates protic solvents (unlike LiAlH₄).' },
  { q: 'The 2,4-DNPH (Brady\'s) test gives a positive result with:', opts: ['Only aldehydes', 'Only ketones', 'Aldehydes AND ketones', 'Only carboxylic acids'], ans: 2, hint: 'It detects any C=O group.' },
  { q: 'A positive 2,4-DNPH test gives:', opts: ['Silver mirror', 'Brick-red ppt', 'Orange/yellow ppt', 'Blue solution'], ans: 2, hint: '2,4-dinitrophenylhydrazone is orange/yellow.' },
  { q: 'Tollens\' reagent is:', opts: ['CuSO₄ + tartrate', '[Ag(NH₃)₂]⁺ in alkaline solution', 'I₂ in NaOH', 'K₂Cr₂O₇/H₂SO₄'], ans: 1, hint: 'Tollens\' is the silver-ammine complex.' },
  { q: 'A positive Tollens\' test gives:', opts: ['Yellow ppt', 'Brick-red ppt', 'Silver mirror on the test tube', 'Black ppt'], ans: 2, hint: 'Ag⁺ is reduced to metallic silver.' },
  { q: 'Tollens\' test distinguishes:', opts: ['Aldehyde from acid', 'Aldehyde from ketone', 'Aldehyde from alcohol', 'Acid from ester'], ans: 1, hint: 'Aldehydes give silver mirror; ketones give no reaction.' },
  { q: 'Fehling\'s solution gives a positive result with:', opts: ['Aliphatic aldehydes', 'Aromatic aldehydes', 'Both aliphatic and aromatic aldehydes', 'Ketones'], ans: 0, hint: 'Aromatic aldehydes (like benzaldehyde) do NOT react with Fehling\'s.' },
  { q: 'A positive Fehling\'s test gives:', opts: ['Silver mirror', 'Brick-red ppt of Cu₂O', 'Orange ppt', 'Yellow ppt of CHI₃'], ans: 1, hint: 'Cu²⁺ (blue) is reduced to Cu⁺ in Cu₂O (red).' },
  { q: 'Why don\'t ketones react with Tollens\' or Fehling\'s?', opts: ['Ketones are too volatile', 'Ketones have no H on the carbonyl C, so cannot be oxidised by mild reagents', 'Ketones are acidic', 'Ketones don\'t contain C=O'], ans: 1, hint: 'Oxidation of aldehyde requires removing H from C=O.' },
  { q: 'Which carbonyl gives a positive iodoform test?', opts: ['HCHO', 'CH₃CH₂CHO', 'CH₃COCH₃', 'CH₃CH₂COCH₂CH₃'], ans: 2, hint: 'Methyl ketone CH₃-CO- triggers iodoform.' },
  { q: 'Iodoform test reagent:', opts: ['I₂ + H₂SO₄', 'I₂ + NaOH (alkaline)', 'KI only', 'AgNO₃ + I₂'], ans: 1, hint: 'Alkaline iodine in NaOH.' },
  { q: 'Iodoform test gives:', opts: ['Silver mirror', 'Brick-red ppt', 'Yellow ppt of CHI₃', 'Orange solution'], ans: 2, hint: 'Triiodomethane (iodoform) is bright yellow.' },
  { q: 'Which one is NOT a way to distinguish aldehyde from ketone?', opts: ['Tollens\' reagent', 'Fehling\'s solution', '2,4-DNPH', 'Acidified K₂Cr₂O₇'], ans: 2, hint: '2,4-DNPH gives positive with BOTH — does not distinguish.' },
  { q: 'Benzaldehyde gives:', opts: ['Positive Tollens\' AND Fehling\'s', 'Positive Tollens\' but NEGATIVE Fehling\'s', 'Negative both', 'Positive Fehling\'s only'], ans: 1, hint: 'Aromatic aldehydes don\'t reduce Fehling\'s — too weak a test.' },
  { q: 'Hydrolysis of cyanohydrin CH₃CH(OH)CN gives:', opts: ['CH₃COOH', 'CH₃CH₂OH', 'CH₃CH(OH)COOH', 'CH₃CH₂NH₂'], ans: 2, hint: '2-hydroxynitrile + H₂O → 2-hydroxy carboxylic acid.' },
  { q: 'Propanone + NaBH₄ gives:', opts: ['Propanoic acid', 'Propan-1-ol', 'Propan-2-ol', 'Propanal'], ans: 2, hint: 'Ketone → 2° alcohol.' },
  { q: 'In the nucleophilic addition mechanism, the C=O π bond breaks because:', opts: ['It is too strong', 'The π electrons go to the O atom (becomes O⁻)', 'It absorbs UV', 'The π bond is stable'], ans: 1, hint: 'The π bond breaks heterolytically; both electrons go to O.' },
  { q: 'Which test would you use to confirm a compound is butanone (a ketone)?', opts: ['Tollens\' (negative)', '2,4-DNPH (orange ppt) AND Tollens\' (negative) AND iodoform (positive)', 'Iodoform only', 'Just smell'], ans: 1, hint: 'Combination: C=O present, not aldehyde, methyl ketone present.' },
];

/* ============================================================
   Structured questions — 6
   ============================================================ */
const structured = [
  { title: 'Preparation of carbonyls', marks: 8, q: 'Aldehydes and ketones are commonly prepared by oxidation of alcohols.', parts: [
    { q: '(a) Write equations for the preparation of (i) ethanal from ethanol and (ii) propanone from propan-2-ol.', marks: 3, ans: '(i) CH₃CH₂OH + [O] → CH₃CHO + H₂O. (ii) (CH₃)₂CHOH + [O] → (CH₃)₂C=O + H₂O. The oxidising agent is acidified potassium dichromate(VI), K₂Cr₂O₇/H₂SO₄.' },
    { q: '(b) State the conditions for each preparation and explain the difference.', marks: 3, ans: 'For (i) ethanal: warm gently and DISTIL out the aldehyde as it forms. The aldehyde has a lower boiling point than the alcohol (no H-bonding) and so distils into the receiver before being further oxidised to ethanoic acid. For (ii) propanone: REFLUX with the oxidising agent. The ketone cannot be further oxidised under these mild conditions (no H on the carbonyl C), so refluxing is safe and gives a higher yield.' },
    { q: '(c) State the colour change observed during these oxidations.', marks: 1, ans: 'Orange (Cr₂O₇²⁻) changes to green (Cr³⁺).' },
    { q: '(d) Explain why a tertiary alcohol such as 2-methylpropan-2-ol does NOT give a carbonyl on treatment with K₂Cr₂O₇/H₂SO₄.', marks: 1, ans: 'The carbon bearing the –OH group has no H atom attached (it is bonded to three carbons). Oxidation requires removal of an H atom from this carbon — without it, no oxidation can occur. The dichromate remains orange.' },
  ]},
  { title: 'HCN nucleophilic addition mechanism', marks: 9, q: 'Propanone reacts with HCN in the presence of dilute KCN/H₂SO₄ to give a cyanohydrin.', parts: [
    { q: '(a) Write the equation for the reaction.', marks: 1, ans: '(CH₃)₂C=O + HCN → (CH₃)₂C(OH)(CN). [The product is 2-hydroxy-2-methylpropanenitrile.]' },
    { q: '(b) Outline the mechanism for this reaction. Use curly arrows and identify the nucleophile.', marks: 5, ans: 'STEP 1: CN⁻ (the nucleophile, with a lone pair on C) attacks the δ+ carbonyl carbon. Curly arrow 1 from CN⁻ lone pair to the C of C=O. Curly arrow 2 from the C=O π bond to the O atom. The π bond breaks; a tetrahedral intermediate is formed: (CH₃)₂C(O⁻)(CN). The O carries a negative charge. STEP 2: the O⁻ picks up a proton from a source (HCN itself, water, or the dilute acid). Curly arrow from O⁻ lone pair to the H of HCN (or H₂O). The product is the neutral cyanohydrin (CH₃)₂C(OH)(CN).' },
    { q: '(c) Explain why the reaction is performed using KCN with a small amount of dilute H₂SO₄, rather than gaseous HCN alone.', marks: 2, ans: 'Gaseous HCN is extremely TOXIC, so it is not safe to handle in the lab. KCN provides a much safer source of the CN⁻ nucleophile in solution. The small amount of dilute H₂SO₄ ensures that there is always a low equilibrium concentration of free HCN to provide the H⁺ needed for step 2 (protonation of the alkoxide). With pure KCN solution alone, no protonation source exists; with pure HCN alone, the CN⁻ concentration is too low for fast attack.' },
    { q: '(d) State whether the product is chiral, and explain.', marks: 1, ans: 'The product (CH₃)₂C(OH)(CN) is NOT chiral — the central C has TWO identical CH₃ groups attached, so it does not have 4 different groups (only 3 distinct types: two CH₃, one OH, one CN). For a chiral cyanohydrin, the starting carbonyl must be unsymmetrical (e.g. ethanal CH₃CHO gives chiral CH₃CH(OH)CN, formed as a racemic mixture).' },
  ]},
  { title: 'Reduction of carbonyls', marks: 6, q: 'Carbonyl compounds can be reduced to alcohols using NaBH₄.', parts: [
    { q: '(a) Write the equation for the reduction of butanal with NaBH₄.', marks: 1, ans: 'CH₃CH₂CH₂CHO + 2[H] → CH₃CH₂CH₂CH₂OH (butanal → butan-1-ol).' },
    { q: '(b) Write the equation for the reduction of butan-2-one with NaBH₄.', marks: 1, ans: 'CH₃COCH₂CH₃ + 2[H] → CH₃CH(OH)CH₂CH₃ (butan-2-one → butan-2-ol).' },
    { q: '(c) State the suitable solvent and temperature.', marks: 2, ans: 'Solvent: methanol, ethanol, or water (NaBH₄ does not react violently with these protic solvents). Temperature: room temperature, or gentle warming. NaBH₄ is a relatively mild reducer and works under straightforward conditions.' },
    { q: '(d) Explain in terms of the mechanism why the reaction is classified as a nucleophilic addition.', marks: 2, ans: 'NaBH₄ delivers a hydride ion (H⁻), which acts as the nucleophile. The H⁻ attacks the δ+ carbon of the C=O group; the C=O π bond breaks with both electrons going to the O atom, giving a tetrahedral alkoxide intermediate. The alkoxide is then protonated by the solvent to give the alcohol. The H⁻ has been ADDED across the C=O bond, breaking the π bond — this is the defining feature of nucleophilic addition.' },
  ]},
  { title: 'Distinguishing aldehyde from ketone', marks: 9, q: 'You are given two unlabelled bottles, each containing a colourless liquid. One contains propanal, the other propanone. Both react with 2,4-DNPH to give an orange precipitate.', parts: [
    { q: '(a) Explain why both compounds react with 2,4-DNPH.', marks: 2, ans: 'Both propanal (CH₃CH₂CHO) and propanone (CH₃COCH₃) contain the C=O group. The 2,4-DNPH (Brady\'s reagent) reacts with any carbonyl group through nucleophilic addition followed by elimination of water, forming a coloured 2,4-dinitrophenylhydrazone derivative that is insoluble and precipitates as an orange/yellow solid. The test does not distinguish between aldehydes and ketones — both give a positive result.' },
    { q: '(b) Describe TWO chemical tests that would distinguish the two liquids. Give the reagent, expected observation for each compound, and explain why one reacts and the other does not.', marks: 5, ans: 'Test 1: Tollens\' reagent ([Ag(NH₃)₂]⁺ in dilute NaOH). Add a few drops to each liquid in a clean test tube and warm gently in a water bath. Observation: PROPANAL → silver mirror forms on the inside of the test tube (Ag⁺ reduced to Ag metal). PROPANONE → no reaction; the solution stays clear and colourless. Reason: propanal is an aldehyde with H on the carbonyl C — easily oxidised to propanoic acid (carboxylate) by the mild Ag⁺ oxidiser. Propanone is a ketone with no H on the carbonyl C — cannot be oxidised by mild reagents. Test 2: Fehling\'s solution (Cu²⁺/tartrate in NaOH). Add to each and warm. Observation: PROPANAL → blue solution turns to a brick-red precipitate of Cu₂O (Cu²⁺ reduced to Cu⁺). PROPANONE → no change; the blue colour remains. Reason: same as Tollens\' — only the aldehyde is easily oxidised.' },
    { q: '(c) Suggest a test that would also give a positive result for propanone but not propanal.', marks: 2, ans: 'The iodoform test (alkaline iodine: I₂ + NaOH(aq), warm). Propanone (CH₃COCH₃) contains a methyl group attached to the C=O — it is a methyl ketone, so it gives a positive iodoform test (yellow precipitate of CHI₃). Propanal (CH₃CH₂CHO) does NOT have CH₃ attached to the C=O (the methyl is one carbon away) — it gives a negative iodoform test. (Note: ethanal CH₃CHO does give a positive iodoform — it is the only aldehyde that does.)' },
  ]},
  { title: 'Structure determination', marks: 8, q: 'Compound X has molecular formula C₄H₈O. It gives an orange precipitate with 2,4-DNPH but no reaction with Tollens\' reagent. It does, however, give a yellow precipitate with alkaline iodine.', parts: [
    { q: '(a) From the 2,4-DNPH result, what functional group is present in X?', marks: 1, ans: 'X contains a C=O group — it is a carbonyl compound (aldehyde or ketone).' },
    { q: '(b) What does the negative Tollens\' test tell you about X?', marks: 1, ans: 'X is NOT an aldehyde — therefore it must be a ketone. (Aldehydes give silver mirror with Tollens\'; ketones do not react.)' },
    { q: '(c) What does the positive iodoform test tell you about the structure of X?', marks: 2, ans: 'X must contain the CH₃-CO- substructure (a methyl group directly attached to the C=O group). The iodoform test gives a positive result with methyl ketones (and ethanal/methyl carbinols, but those are excluded by the other tests). So X is a methyl ketone.' },
    { q: '(d) Suggest the structure and IUPAC name of X. Justify your choice.', marks: 3, ans: 'Molecular formula C₄H₈O (degree of unsaturation = 1, consistent with one C=O). With CH₃-CO- as confirmed structure and 4 carbons total, the rest of the molecule is C₂H₅. X must be CH₃-CO-CH₂CH₃, which is BUTAN-2-ONE. The structure: methyl group, then C=O, then ethyl group. IUPAC name: butan-2-one. Pentan-3-one (CH₃CH₂COCH₂CH₃) would NOT give a positive iodoform (no methyl on C=O), so it is ruled out. Butanal (CH₃CH₂CH₂CHO) is an aldehyde and would give positive Tollens\', so it is ruled out.' },
    { q: '(e) Write the equation for the reaction of X with 2,4-DNPH.', marks: 1, ans: 'CH₃COCH₂CH₃ + H₂N-NH-Ar → (CH₃)(CH₂CH₃)C=N-NH-Ar + H₂O. (Ar = 2,4-dinitrophenyl group.)' },
  ]},
  { title: 'Multi-step synthesis', marks: 8, q: 'Outline how you would carry out the following synthesis steps. Give reagents, conditions and an equation for each step.', parts: [
    { q: '(a) Convert ethanol to ethanal.', marks: 2, ans: 'CH₃CH₂OH + [O] → CH₃CHO + H₂O. Reagents: acidified potassium dichromate(VI), K₂Cr₂O₇/H₂SO₄. Conditions: warm gently and DISTIL out the ethanal as it forms (b.p. 21 °C, much lower than ethanol\'s 78 °C). This stops further oxidation to ethanoic acid.' },
    { q: '(b) Convert ethanal to 2-hydroxypropanenitrile.', marks: 2, ans: 'CH₃CHO + HCN → CH₃CH(OH)CN. Reagents: KCN(aq) with a small amount of dilute H₂SO₄. Conditions: ~10–20 °C, mix the two solutions. Mechanism: nucleophilic addition. Note that the product is chiral and forms as a racemic mixture.' },
    { q: '(c) Convert 2-hydroxypropanenitrile to 2-hydroxypropanoic acid (lactic acid).', marks: 2, ans: 'CH₃CH(OH)CN + 2H₂O + HCl → CH₃CH(OH)COOH + NH₄Cl. Reagents: dilute hydrochloric acid (or H₂SO₄). Conditions: REFLUX. The nitrile group is hydrolysed to a carboxylic acid via an amide intermediate (which need not be isolated).' },
    { q: '(d) State the overall change in the carbon skeleton from ethanol to lactic acid.', marks: 2, ans: 'Ethanol has 2 carbons (C₂). Lactic acid has 3 carbons (C₃). The chain has been EXTENDED BY ONE CARBON via the HCN addition step (CN brings the extra carbon, which becomes COOH after hydrolysis). This three-step sequence (oxidation → HCN addition → hydrolysis) is a standard method for chain extension at A-level.' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Identify carbonyl from tests', diff: 'easy', q: 'A compound gives an orange precipitate with 2,4-DNPH and a silver mirror with Tollens\'. What functional group does it contain, and what general formula?', steps: [
    { label: 'STEP 1', text: 'Orange precipitate with 2,4-DNPH → confirms C=O group is present.' },
    { label: 'STEP 2', text: 'Silver mirror with Tollens\' → it is an ALDEHYDE specifically (ketones do not react).' },
    { label: 'STEP 3', text: 'General formula: R-CHO. The C=O is at the end of the chain, with H attached.' },
  ], ans: 'The compound is an aldehyde, R-CHO.' },

  { title: 'Predict iodoform test result', diff: 'medium', q: 'Will pentan-3-one (CH₃CH₂COCH₂CH₃) give a positive iodoform test?', steps: [
    { label: 'STEP 1', text: 'Iodoform test requires a CH₃-CO- substructure (methyl ketone) or CH₃-CH(OH)- (methyl 2° alcohol/ethanol/ethanal).' },
    { label: 'STEP 2', text: 'Pentan-3-one has the structure CH₃-CH₂-CO-CH₂-CH₃. The carbonyl C is attached to two CH₂CH₃ groups, NOT to a CH₃ directly.' },
    { label: 'STEP 3', text: 'No CH₃ directly attached to the C=O → NEGATIVE iodoform test.' },
  ], ans: 'No — pentan-3-one is not a methyl ketone, so it gives a negative iodoform test.' },

  { title: 'Mechanism of HCN addition', diff: 'hard', q: 'Show the mechanism for the reaction of HCN with propanone in the presence of dilute KCN/H₂SO₄. State the role of each reagent.', steps: [
    { label: 'STEP 1', text: 'KCN provides the CN⁻ nucleophile. The δ+ on the carbonyl C of (CH₃)₂C=O makes the C electrophilic.' },
    { label: 'STEP 2', text: 'STEP 1 of mechanism: CN⁻ lone pair attacks the δ+ C. Curly arrow 1: from CN⁻ lone pair to C. Curly arrow 2: from C=O π bond to O. Result: tetrahedral intermediate (CH₃)₂C(O⁻)(CN).' },
    { label: 'STEP 3', text: 'STEP 2 of mechanism: the O⁻ is protonated. Curly arrow: from O⁻ lone pair to H (of HCN, H₂O, or H₃O⁺). Result: (CH₃)₂C(OH)(CN) — the cyanohydrin.' },
    { label: 'STEP 4', text: 'Role of dilute H₂SO₄: provides H⁺ for step 2 (protonation). Role of KCN: provides CN⁻ in solution, safer than gaseous HCN. Together they keep [CN⁻] high enough for step 1 and [H⁺] available for step 2.' },
  ], ans: 'Two-step nucleophilic addition: CN⁻ attacks δ+ C; alkoxide protonated to give cyanohydrin. KCN supplies CN⁻; dilute H₂SO₄ supplies H⁺.' },

  { title: 'Reduction', diff: 'easy', q: 'What is the product when butan-2-one is treated with NaBH₄ in methanol?', steps: [
    { label: 'STEP 1', text: 'Butan-2-one is a ketone: CH₃COCH₂CH₃.' },
    { label: 'STEP 2', text: 'NaBH₄ reduces ketones to 2° alcohols: R₂C=O + 2[H] → R₂CH-OH.' },
    { label: 'STEP 3', text: 'CH₃COCH₂CH₃ + 2[H] → CH₃CH(OH)CH₂CH₃ (butan-2-ol).' },
  ], ans: 'Butan-2-ol, CH₃CH(OH)CH₂CH₃ — a secondary alcohol.' },

  { title: 'Distinguishing aldehyde and ketone', diff: 'easy', q: 'Describe a chemical test to distinguish ethanal from propanone.', steps: [
    { label: 'STEP 1', text: 'Both are carbonyls (give 2,4-DNPH positive). Need a test specific to aldehydes.' },
    { label: 'STEP 2', text: 'Add a few drops of Tollens\' reagent to each, warm gently in a water bath.' },
    { label: 'STEP 3', text: 'Ethanal (CH₃CHO, aldehyde): silver mirror forms on the inside of the test tube.' },
    { label: 'STEP 4', text: 'Propanone (CH₃COCH₃, ketone): no reaction; solution stays clear.' },
  ], ans: 'Add Tollens\' reagent and warm: ethanal gives silver mirror, propanone gives no reaction.' },

  { title: 'Synthesis with chain extension', diff: 'hard', q: 'Outline a 3-step synthesis of 2-hydroxybutanoic acid (CH₃CH₂CH(OH)COOH) from propan-1-ol.', steps: [
    { label: 'STEP 1', text: 'Step 1: oxidise propan-1-ol to propanal (no further). CH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O. Reagents: K₂Cr₂O₇/H₂SO₄, distil out propanal.' },
    { label: 'STEP 2', text: 'Step 2: add HCN to extend chain. CH₃CH₂CHO + HCN → CH₃CH₂CH(OH)CN. Reagents: KCN/dilute H₂SO₄.' },
    { label: 'STEP 3', text: 'Step 3: hydrolyse the nitrile to a carboxylic acid. CH₃CH₂CH(OH)CN + 2H₂O + HCl → CH₃CH₂CH(OH)COOH + NH₄Cl. Reagents: dilute HCl, reflux.' },
    { label: 'STEP 4', text: 'Overall: 3 steps, chain extends from C₃ (propan-1-ol) to C₄ (2-hydroxybutanoic acid). Note: the product is chiral and forms as a racemate.' },
  ], ans: '3 steps: oxidation → HCN addition → hydrolysis. Chain extends by 1 carbon.' },

  { title: 'Identify unknown', diff: 'medium', q: 'Compound Y has formula C₃H₆O. It gives an orange ppt with 2,4-DNPH, a silver mirror with Tollens\', and a brick-red ppt with Fehling\'s. Identify Y.', steps: [
    { label: 'STEP 1', text: 'C₃H₆O with one C=O (degree of unsaturation = 1). Possible structures: propanal, propanone, propenol (an enol — unstable).' },
    { label: 'STEP 2', text: '2,4-DNPH positive → C=O confirmed (rules out enols/ethers).' },
    { label: 'STEP 3', text: 'Tollens\' positive (silver mirror) → it is an aldehyde, not a ketone. Rules out propanone.' },
    { label: 'STEP 4', text: 'Fehling\'s positive (brick-red Cu₂O) → confirms it is an aliphatic (not aromatic) aldehyde. Consistent.' },
    { label: 'STEP 5', text: 'Conclusion: Y is propanal, CH₃CH₂CHO.' },
  ], ans: 'Y is propanal (CH₃CH₂CHO).' },

  { title: 'Why benzaldehyde behaves differently', diff: 'medium', q: 'Explain why benzaldehyde gives a positive Tollens\' test but a negative Fehling\'s test.', steps: [
    { label: 'STEP 1', text: 'Benzaldehyde (C₆H₅CHO) is an aromatic aldehyde — the C=O is attached to a benzene ring rather than to an alkyl chain.' },
    { label: 'STEP 2', text: 'Tollens\' reagent ([Ag(NH₃)₂]⁺) is sufficiently powerful to oxidise both aliphatic and aromatic aldehydes — silver mirror forms.' },
    { label: 'STEP 3', text: 'Fehling\'s solution (Cu²⁺/tartrate) is a WEAKER oxidising agent. The aromatic ring stabilises the C=O (delocalisation effects), making benzaldehyde harder to oxidise. Fehling\'s cannot oxidise it.' },
    { label: 'STEP 4', text: 'Aliphatic aldehydes (like propanal) are easily oxidised by both Tollens\' AND Fehling\'s.' },
  ], ans: 'Benzaldehyde is harder to oxidise (aromatic ring stabilisation). Tollens\' is strong enough; Fehling\'s is not.' },
];

export const CARBONYL = {
  id: 'carbonyl',
  objectives: [
    'Name and draw aldehydes and ketones; describe isomerism (chain, position, functional group, optical)',
    'Describe the preparation of aldehydes and ketones from primary and secondary alcohols',
    'Outline the mechanism of nucleophilic addition with HCN to give cyanohydrins',
    'Describe the reduction of carbonyl compounds with NaBH₄ to give alcohols',
    'Describe how to distinguish aldehydes and ketones using Tollens\', Fehling\'s, 2,4-DNPH and iodoform tests',
    'Suggest a suitable test for a given carbonyl compound and predict the observations',
    'Explain why aldehydes are oxidised by mild reagents but ketones are not',
    'Use carbonyls in multi-step synthesis (HCN addition for chain extension; reduction; oxidation to acids)',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through the nucleophilic addition mechanism of HCN to ethanal',
    'How would I distinguish butanal from butan-2-one using chemical tests?',
    'Why does propanone give a positive iodoform but propanal does not?',
    'Show me the synthesis of lactic acid from ethanal',
    'Explain why ketones don\'t react with Tollens\' but aldehydes do',
  ],
};
