// Carboxylic Acids & Derivatives — OC-18 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.3 — Topic 18
// Syllabus coverage:
//   Nomenclature, preparation and occurrence
//   Formation of carboxylic acids from alcohols, aldehydes, nitriles
//   Reactions: salt, ester, acyl chloride formation
//   Acidity of acids and chlorinated acids (inductive effect)
//   Reactions of acyl chlorides with water, alcohols, phenols, primary amines
//   Relative ease of hydrolysis: acyl chlorides vs alkyl chlorides vs aryl chlorides
//   Formation of esters via acids or acyl chlorides; ester hydrolysis
//   Uses including soap manufacture

/* ============================================================
   Diagram specs (Phase K3.5 migration)
   Unused legacy JSX removed in K-Cleanup; active specs are unchanged.
   ============================================================ */
const carboxylicGroupSpec = {
  "title": "THE CARBOXYL GROUP · –COOH",
  "blocks": [
    {
      "type": "equation",
      "text": "R–C(=O)–OH  =  R–COOH  =  R–CO₂H"
    },
    {
      "type": "compare",
      "left": {
        "title": "O–H part",
        "color": "pink",
        "body": [
          "acidic proton",
          "can lose H⁺",
          "forms R–COO⁻"
        ]
      },
      "right": {
        "title": "C=O part",
        "color": "accent",
        "body": [
          "carbonyl carbon is electrophilic",
          "nucleophiles can attack",
          "gives acyl chemistry"
        ]
      }
    },
    {
      "type": "note",
      "text": "–COOH combines acidic O–H and electrophilic C=O.",
      "emphasis": true
    }
  ]
};

const carboxylicPreparationSpec = {
  "title": "PREPARATION OF CARBOXYLIC ACIDS",
  "blocks": [
    {
      "type": "cards",
      "cards": [
        {
          "title": "1° alcohol",
          "color": "primary",
          "body": [
            "R–CH₂OH → R–CHO → R–COOH",
            "K₂Cr₂O₇/H₂SO₄",
            "reflux · excess oxidant"
          ]
        },
        {
          "title": "aldehyde",
          "color": "accent",
          "body": [
            "R–CHO + [O] → R–COOH",
            "K₂Cr₂O₇/H₂SO₄",
            "reflux"
          ]
        },
        {
          "title": "nitrile",
          "color": "pink",
          "body": [
            "R–CN → R–COOH",
            "H₂O/H⁺ · reflux",
            "extends chain by 1 C"
          ]
        }
      ]
    }
  ],
  "subtitle": "Nitrile hydrolysis extends the carbon chain by 1 C."
};

const carboxylicReactionsSpec = {
  "title": "REACTIONS OF CARBOXYLIC ACIDS",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "Reagent",
        "Main product",
        "Observation / type"
      ],
      "rows": [
        [
          "NaOH",
          "R–COO⁻Na⁺ + H₂O",
          "neutralisation"
        ],
        [
          "Na₂CO₃",
          "R–COO⁻Na⁺ + CO₂ + H₂O",
          "effervescence"
        ],
        [
          "NaHCO₃",
          "R–COO⁻Na⁺ + CO₂ + H₂O",
          "effervescence"
        ],
        [
          "Na metal",
          "R–COO⁻Na⁺ + ½H₂",
          "H₂ evolved"
        ],
        [
          "R'OH / H₂SO₄",
          "R–COOR' + H₂O",
          "esterification"
        ],
        [
          "SOCl₂ / PCl₅",
          "R–COCl",
          "acyl chloride"
        ],
        [
          "LiAlH₄",
          "R–CH₂OH",
          "reduction"
        ]
      ],
      "colWidths": [
        75,
        132,
        83
      ],
      "rowH": 23
    }
  ],
  "subtitle": "Na₂CO₃: acid gives CO₂; phenol does not."
};

const carboxylicAcidityComparisonSpec = {
  "title": "ACIDITY · CARBOXYLIC ACID vs PHENOL vs ALCOHOL",
  "blocks": [
    {
      "type": "cards",
      "cards": [
        {
          "title": "R–COOH",
          "color": "pink",
          "body": [
            "pKa ≈ 4–5",
            "strongest of the three",
            "resonance-stabilised anion"
          ]
        },
        {
          "title": "phenol",
          "color": "amber",
          "body": [
            "pKa ≈ 10",
            "phenoxide delocalised",
            "weaker than carboxylic acid"
          ]
        },
        {
          "title": "alcohol",
          "color": "green",
          "body": [
            "pKa ≈ 16",
            "alkoxide lacks resonance",
            "weakest"
          ]
        }
      ]
    },
    {
      "type": "note",
      "text": "Acidity: carboxylic acid ≫ phenol > alcohol.",
      "emphasis": true
    }
  ]
};

const carboxylicChloroAciditySpec = {
  "title": "ACIDITY OF CHLORINATED ETHANOIC ACIDS",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "Acid",
        "pKa",
        "Trend"
      ],
      "rows": [
        [
          "CH₃COOH",
          "4.76",
          "baseline"
        ],
        [
          "ClCH₂COOH",
          "2.86",
          "stronger"
        ],
        [
          "Cl₂CHCOOH",
          "1.30",
          "stronger still"
        ],
        [
          "Cl₃CCOOH",
          "0.66",
          "strongest"
        ]
      ],
      "colWidths": [
        130,
        60,
        100
      ],
      "rowH": 28
    }
  ],
  "subtitle": "More Cl → stronger −I effect → lower pKa."
};

const carboxylicAcylChlorideSpec = {
  "title": "REACTIONS OF ACYL CHLORIDES · R–COCl",
  "blocks": [
    {
      "type": "table",
      "headers": [
        "Reagent",
        "Product",
        "Conditions / note"
      ],
      "rows": [
        [
          "H₂O",
          "R–COOH + HCl",
          "vigorous · room T"
        ],
        [
          "R'OH",
          "R–COOR' + HCl",
          "fast · no catalyst"
        ],
        [
          "ArOH",
          "R–COOAr + HCl",
          "base / pyridine"
        ],
        [
          "NH₃",
          "R–CONH₂",
          "amide formed"
        ],
        [
          "R'NH₂",
          "R–CONHR'",
          "N-substituted amide"
        ]
      ],
      "colWidths": [
        72,
        125,
        103
      ],
      "rowH": 27
    }
  ],
  "subtitle": "Nucleophile replaces Cl; HCl is released."
};

const carboxylicEsterFormationSpec = {
  "title": "TWO ROUTES TO ESTERS",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "ACID + ALCOHOL",
        "color": "primary",
        "body": [
          "R–COOH + R'OH ⇌ R–COOR' + H₂O",
          "conc. H₂SO₄ · reflux",
          "reversible · slower · modest yield"
        ]
      },
      "right": {
        "title": "ACYL CHLORIDE + ALCOHOL",
        "color": "accent",
        "body": [
          "R–COCl + R'OH → R–COOR' + HCl",
          "room temperature",
          "fast · irreversible · high yield"
        ]
      }
    },
    {
      "type": "note",
      "text": "Use excess reagent or remove water to raise yield.",
      "emphasis": true
    }
  ]
};

const carboxylicEsterHydrolysisSpec = {
  "title": "HYDROLYSIS OF ESTERS",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "ACID HYDROLYSIS",
        "color": "primary",
        "body": [
          "R–COOR' + H₂O ⇌ R–COOH + R'OH",
          "dilute acid · reflux",
          "reversible · partial"
        ]
      },
      "right": {
        "title": "BASE HYDROLYSIS",
        "color": "pink",
        "body": [
          "R–COOR' + OH⁻ → R–COO⁻ + R'OH",
          "NaOH(aq) · reflux",
          "irreversible · complete · saponification"
        ]
      }
    },
    {
      "type": "note",
      "text": "Soap = Na⁺/K⁺ salts of long-chain fatty acids.",
      "emphasis": true
    }
  ]
};

/* ============================================================
   Chapters
   ============================================================ */
const chapters = [
  { id: 'ca1', title: 'The Carboxylic Acid Group', minutes: 8, blocks: [
    { type: 'p', text: 'Carboxylic acids contain the –COOH (carboxyl) functional group: a carbonyl C=O AND a hydroxyl –OH on the same carbon. Together these create a uniquely acidic group that defines the chemistry. The general formula is R-COOH; the simplest is methanoic acid (HCOOH, formic acid) and the next is ethanoic acid (CH₃COOH, vinegar).' },
    { type: 'd', spec: carboxylicGroupSpec, caption: 'The carboxyl group has both C=O and O-H' },
    { type: 'h', text: 'IUPAC nomenclature' },
    { type: 'ul', items: [
      'Find the longest chain containing the –COOH group. The COOH carbon is always C1.',
      'Replace the "-e" of the parent alkane with "-oic acid".',
      'No locant needed for –COOH — it is automatically C1.',
      'Examples: HCOOH = methanoic acid (formic acid); CH₃COOH = ethanoic acid (acetic acid); CH₃CH₂COOH = propanoic acid; (CH₃)₂CHCOOH = 2-methylpropanoic acid.',
      'Dicarboxylic acids: HOOC-COOH = ethanedioic acid (oxalic acid); HOOC-CH₂-COOH = propanedioic acid.',
    ]},
    { type: 'h', text: 'Common names worth knowing' },
    { type: 'ul', items: [
      'Methanoic acid (HCOOH) = formic acid (in ant venom).',
      'Ethanoic acid (CH₃COOH) = acetic acid (in vinegar, ~5%).',
      'Propanoic acid (CH₃CH₂COOH) = propionic acid.',
      'Butanoic acid (CH₃CH₂CH₂COOH) = butyric acid (rancid butter smell).',
      'Hexadecanoic acid (CH₃(CH₂)₁₄COOH) = palmitic acid (in palm oil, fats).',
      'Octadecanoic acid = stearic acid (in soaps, fats).',
      'Benzoic acid (C₆H₅COOH) — preservative E210.',
    ]},
    { type: 'h', text: 'Physical properties' },
    { type: 'ul', items: [
      'Hydrogen bonding: carboxylic acids form especially strong H-bonds — they exist as DIMERS (pairs joined by two H-bonds in a ring) in pure form and in non-polar solvents.',
      'Boiling points are even higher than alcohols of similar Mr because of dimer formation.',
      'Small acids (HCOOH, CH₃COOH, CH₃CH₂COOH, butanoic) are miscible with water — H-bond strongly with water.',
      'Solubility decreases as the alkyl chain lengthens (>5 carbons).',
      'Smell: short-chain acids have sharp, vinegar-like or rancid smells.',
    ]},
    { type: 'callout', kind: 'key', title: 'The combination defines the chemistry', body: 'The C=O makes the –COOH group electrophilic at C; the O–H provides acidity. Together, they enable: (1) loss of H⁺ to give a stabilised carboxylate ion R-COO⁻, (2) nucleophilic substitution at the C=O carbon. Both modes are heavily examined.' },
    { type: 'takeaway', items: [
      '–COOH = C=O + O-H on the same carbon.',
      'IUPAC: replace "-e" with "-oic acid", COOH = C1.',
      'Strong H-bonding (often dimers) → high b.p., good water solubility for short chains.',
      'Two reactive features: O-H (acidic) and C=O (electrophilic).',
    ]},
  ]},

  { id: 'ca2', title: 'Preparation of Carboxylic Acids', minutes: 8, blocks: [
    { type: 'p', text: 'Three main routes to carboxylic acids at A-level: oxidation of primary alcohols, oxidation of aldehydes, and hydrolysis of nitriles.' },
    { type: 'd', spec: carboxylicPreparationSpec, caption: 'Three routes to carboxylic acids' },
    { type: 'h', text: 'From primary alcohols' },
    { type: 'ul', items: [
      'R-CH₂-OH + 2[O] → R-COOH + H₂O.',
      'Reagents: acidified K₂Cr₂O₇/H₂SO₄ (or KMnO₄ for harsher oxidation).',
      'Conditions: REFLUX with EXCESS oxidising agent. The aldehyde intermediate is fully oxidised to the acid.',
      'Colour change: orange Cr₂O₇²⁻ → green Cr³⁺.',
      'Example: ethanol → ethanal → ethanoic acid. CH₃CH₂OH + 2[O] → CH₃COOH + H₂O.',
    ]},
    { type: 'h', text: 'From aldehydes' },
    { type: 'ul', items: [
      'R-CHO + [O] → R-COOH.',
      'Same reagents and conditions as above (acidified K₂Cr₂O₇, reflux).',
      'Aldehydes can also be oxidised to carboxylic acids by Tollens\' reagent (giving silver mirror) or in air over time.',
    ]},
    { type: 'h', text: 'From nitriles (hydrolysis)' },
    { type: 'ul', items: [
      'R-CN + 2H₂O + HCl → R-COOH + NH₄Cl. Acid hydrolysis is the most common.',
      'Or alkaline: R-CN + H₂O + NaOH → R-COO⁻Na⁺ + NH₃. Then acidify to get R-COOH.',
      'Conditions: reflux with dilute aqueous acid (or alkali) for several hours.',
      'This route extends the carbon chain by ONE atom — the CN carbon becomes part of the COOH.',
      'Example: CH₃CH₂Br + KCN(alc) → CH₃CH₂CN → CH₃CH₂COOH (propanoic acid). Started with 2 C, ended with 3 C.',
    ]},
    { type: 'callout', kind: 'key', title: 'Choosing the route', body: 'If you have an alcohol → oxidise. If you have an aldehyde → oxidise (or use Tollens\' for synthesis). If you need a CHAIN-EXTENDED acid → use the nitrile route from a halogenoalkane. The nitrile route is the standard way to add one carbon.' },
    { type: 'takeaway', items: [
      '1° alcohol + K₂Cr₂O₇/H₂SO₄, reflux → carboxylic acid.',
      'Aldehyde + K₂Cr₂O₇/H₂SO₄ → carboxylic acid.',
      'Nitrile + H₂O/HCl, reflux → carboxylic acid (chain extends by 1 C).',
    ]},
  ]},

  { id: 'ca3', title: 'Reactions of Carboxylic Acids', minutes: 9, blocks: [
    { type: 'p', text: 'Carboxylic acids react in two main modes: (1) as ACIDS, losing the O-H proton to bases or active metals, and (2) at the C=O group, forming esters or acyl chlorides. The acidic mode dominates with most reagents.' },
    { type: 'd', spec: carboxylicReactionsSpec, caption: 'Common reactions of carboxylic acids' },
    { type: 'h', text: 'Salt formation' },
    { type: 'ul', items: [
      'With NaOH(aq): R-COOH + NaOH → R-COO⁻Na⁺ + H₂O. Forms a sodium carboxylate (soluble, ionic).',
      'With Na₂CO₃(aq): 2R-COOH + Na₂CO₃ → 2R-COO⁻Na⁺ + CO₂↑ + H₂O. CO₂ effervescence is observed — diagnostic test for –COOH.',
      'With NaHCO₃(aq): R-COOH + NaHCO₃ → R-COO⁻Na⁺ + CO₂↑ + H₂O. Same effervescence; gentler base.',
      'With Na metal: 2R-COOH + 2Na → 2R-COO⁻Na⁺ + H₂↑. Slower than with water.',
      'These reactions show carboxylic acids are STRONGER acids than carbonic acid (H₂CO₃) — they release CO₂ from carbonates. Phenol does NOT — distinguishing test.',
    ]},
    { type: 'h', text: 'Ester formation (with alcohols)' },
    { type: 'ul', items: [
      'R-COOH + R\'-OH ⇌ R-COOR\' + H₂O.',
      'Conditions: concentrated H₂SO₄ catalyst, REFLUX.',
      'Reversible (equilibrium) — slow, modest yield.',
      'To improve yield: use excess alcohol or acid; remove water using anhydrous drying or by distillation; or use an acyl chloride instead (next chapter).',
      'Example: CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O (ethyl ethanoate, fruity smell).',
    ]},
    { type: 'h', text: 'Conversion to acyl chlorides' },
    { type: 'ul', items: [
      'With PCl₅: R-COOH + PCl₅ → R-COCl + HCl + POCl₃. Vigorous; produces fumes of HCl.',
      'With SOCl₂ (thionyl chloride): R-COOH + SOCl₂ → R-COCl + HCl + SO₂. CLEANEST method — by-products are gases that escape.',
      'With PCl₃: 3R-COOH + PCl₃ → 3R-COCl + H₃PO₃.',
      'The product (R-COCl, an acyl chloride) is far more reactive than the parent acid — useful intermediate.',
    ]},
    { type: 'h', text: 'Reduction to alcohol' },
    { type: 'p', text: 'Carboxylic acids can be reduced all the way to primary alcohols using LiAlH₄ in dry ether: R-COOH + 4[H] → R-CH₂OH + H₂O. NaBH₄ is NOT strong enough to reduce carboxylic acids (only carbonyls).' },
    { type: 'takeaway', items: [
      'NaOH/Na₂CO₃/NaHCO₃: salt formation. Na₂CO₃/NaHCO₃ → CO₂ effervescence (test).',
      'Alcohol + conc. H₂SO₄: ester (reversible).',
      'PCl₅/SOCl₂/PCl₃: acyl chloride.',
      'LiAlH₄: reduces to 1° alcohol (not NaBH₄).',
    ]},
  ]},

  { id: 'ca4', title: 'Acidity & The Inductive Effect', minutes: 10, blocks: [
    { type: 'p', text: 'Carboxylic acids are weak acids (pKa ≈ 4-5) but much stronger than phenols (pKa ≈ 10) or alcohols (pKa ≈ 16). The strength depends on the stability of the carboxylate ion (the conjugate base). Substituents can dramatically increase acid strength via the inductive effect.' },
    { type: 'd', spec: carboxylicAcidityComparisonSpec, caption: 'Carboxylic acids are stronger than phenols or alcohols' },
    { type: 'h', text: 'Why are carboxylic acids stronger than phenols?' },
    { type: 'ul', items: [
      'The conjugate base of a carboxylic acid is the carboxylate ion: R-COO⁻.',
      'The negative charge is DELOCALISED equally over BOTH oxygen atoms by resonance — the C-O bonds become equivalent (each is 1.5 bond order).',
      'This is much more effective stabilisation than in phenoxide (where charge is spread over 1 O + 3 ring carbons but unevenly).',
      'More stable conjugate base → stronger acid.',
      'pKa values: carboxylic acid ≈ 4-5; phenol ≈ 10; alcohol ≈ 16. Acid is ~10⁵ times stronger than phenol.',
    ]},
    { type: 'h', text: 'Effect of chlorine substituents (–I effect)' },
    { type: 'd', spec: carboxylicChloroAciditySpec, caption: 'Chloro substitution increases acidity' },
    { type: 'ul', items: [
      'Chlorine atoms are highly electronegative — they WITHDRAW electron density from neighbouring atoms (negative inductive effect, –I).',
      'In a chlorinated acid, the Cl atoms pull electron density AWAY from the carboxylate ion, helping to spread out the negative charge.',
      'A more stabilised carboxylate ion → easier to form → stronger acid.',
      'pKa values: ethanoic acid 4.76; chloroethanoic acid 2.86; dichloroethanoic acid 1.30; trichloroethanoic acid 0.66. Each Cl makes it about 100× more acidic.',
      'Trichloroethanoic acid is almost a strong acid! Comparable to inorganic acids.',
    ]},
    { type: 'h', text: 'Distance matters' },
    { type: 'ul', items: [
      'The inductive effect of Cl FALLS OFF rapidly with distance.',
      'Compare: 2-chlorobutanoic acid (Cl on C2, next to COOH) is much more acidic than 4-chlorobutanoic acid (Cl on C4, far away).',
      'Cl directly bonded to the C-COOH is most effective.',
      'A CH₃ group has the OPPOSITE effect: it DONATES electron density (+I effect), DESTABILISING the carboxylate. So methanoic acid (HCOOH, pKa 3.75) is slightly stronger than ethanoic acid (CH₃COOH, pKa 4.76) — the H is "neutral", but the CH₃ pushes electrons in.',
    ]},
    { type: 'callout', kind: 'key', title: 'Exam template for acidity', body: 'For "explain why X is more acidic than Y" questions: (1) compare conjugate bases. (2) Identify what stabilises the negative charge. (3) Carboxylates: resonance over 2 equivalent O atoms. Phenoxide: less effective resonance into ring. Alcohol\'s conjugate base: localised on O, destabilised by alkyl +I. (4) Chlorinated acids: -I effect of Cl removes electron density, stabilises carboxylate.' },
    { type: 'takeaway', items: [
      'Acid > phenol > alcohol in acidity (carboxylate stabilised by symmetric resonance).',
      '-I substituents (Cl, F) increase acidity; +I substituents (CH₃) decrease.',
      'Multiple Cl atoms give very strong acids.',
      'Distance matters: closer Cl is more effective.',
    ]},
  ]},

  { id: 'ca5', title: 'Acyl Chlorides: Reactions', minutes: 10, blocks: [
    { type: 'p', text: 'Acyl chlorides (R-COCl, also called acid chlorides) are far more reactive than carboxylic acids. They contain both an electron-withdrawing Cl (excellent leaving group) and the polar C=O. They are used in synthesis when you need fast, clean reactions to make esters, amides, or related derivatives.' },
    { type: 'd', spec: carboxylicAcylChlorideSpec, caption: 'Acyl chlorides react with many nucleophiles' },
    { type: 'h', text: 'With water: vigorous hydrolysis' },
    { type: 'ul', items: [
      'R-COCl + H₂O → R-COOH + HCl.',
      'Reaction is RAPID and VIGOROUS at room temperature.',
      'Steamy fumes of HCl are produced (visible).',
      'Acyl chlorides must be kept dry — they react with moisture in the air.',
      'Mechanism: water attacks δ+ C; tetrahedral intermediate forms; Cl⁻ leaves; H⁺ is then lost to give the acid.',
    ]},
    { type: 'h', text: 'With alcohols: ester formation' },
    { type: 'ul', items: [
      'R-COCl + R\'-OH → R-COOR\' + HCl.',
      'FAST and IRREVERSIBLE — much better than esterification with the carboxylic acid.',
      'No catalyst needed, room temperature.',
      'High yield because no equilibrium to drive.',
      'Example: CH₃COCl + CH₃CH₂OH → CH₃COOCH₂CH₃ + HCl (ethyl ethanoate).',
    ]},
    { type: 'h', text: 'With phenols: ester formation' },
    { type: 'ul', items: [
      'R-COCl + ArOH → R-COOAr + HCl. Same general pattern.',
      'Phenols are LESS nucleophilic than alcohols (the OH lone pair is delocalised into the ring), so the reaction is slower.',
      'Usually carried out with NaOH or pyridine present to neutralise HCl and to make phenoxide ion (more nucleophilic than phenol).',
      'Example: CH₃COCl + C₆H₅OH → CH₃COOC₆H₅ + HCl (phenyl ethanoate).',
    ]},
    { type: 'h', text: 'With ammonia and primary amines: amide formation' },
    { type: 'ul', items: [
      'With NH₃: R-COCl + 2NH₃ → R-CONH₂ + NH₄Cl. Forms a primary AMIDE. Vigorous reaction; usually forms a white precipitate of the amide.',
      'With primary amine R\'-NH₂: R-COCl + 2R\'-NH₂ → R-CONH-R\' + R\'-NH₃Cl. Forms an N-substituted amide. The 2nd equivalent of amine acts as a base to neutralise HCl.',
      'Example: CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl (ethanamide).',
    ]},
    { type: 'callout', kind: 'key', title: 'Why are acyl chlorides so reactive?', body: 'The C is doubly activated: (1) C=O makes it δ+; (2) Cl is highly electronegative, increasing the δ+. Cl is also an excellent LEAVING GROUP (Cl⁻ is stable). All four common nucleophiles (H₂O, R-OH, ArOH, NH₃/RNH₂) can attack and displace Cl⁻. The reactions are typically much faster than the analogous reactions of carboxylic acids — making acyl chlorides preferred for synthesis.' },
    { type: 'takeaway', items: [
      'Water → carboxylic acid + HCl (vigorous).',
      'Alcohol → ester + HCl (preferred to acid + alcohol route).',
      'Phenol → phenyl ester (with base to help).',
      'NH₃ or RNH₂ → primary or N-substituted amide.',
    ]},
  ]},

  { id: 'ca6', title: 'Comparing Hydrolysis: Acyl vs Alkyl vs Aryl Chlorides', minutes: 9, blocks: [
    { type: 'p', text: 'Three classes of organic chlorides have very different hydrolysis behaviour: acyl chlorides (R-COCl) hydrolyse violently; alkyl chlorides (R-Cl) hydrolyse slowly with NaOH; aryl chlorides (Ar-Cl, e.g. chlorobenzene) require extreme conditions.' },
    { type: 'h', text: 'Order of reactivity towards water/OH⁻' },
    { type: 'ul', items: [
      'ACYL chloride (R-COCl): VIGOROUS at room temperature. Hydrolyses on contact with water/moisture.',
      'ALKYL chloride (R-CH₂Cl): SLOW at room temperature. Hydrolyses with NaOH(aq) on REFLUX.',
      'ARYL chloride (C₆H₅-Cl): EXTREME. Requires 300 °C, 200 atm, conc. NaOH (Dow process for phenol). Effectively unreactive under normal conditions.',
    ]},
    { type: 'h', text: 'Why acyl chlorides are most reactive' },
    { type: 'ul', items: [
      'Two electron-withdrawing groups (C=O AND Cl) on the same carbon → very large δ+ on C → highly susceptible to nucleophilic attack.',
      'C=O π bond can break to accommodate nucleophile attack (mechanism resembles addition-elimination).',
      'Cl is an excellent leaving group from this position.',
    ]},
    { type: 'h', text: 'Why alkyl chlorides are intermediate' },
    { type: 'ul', items: [
      'The C-Cl bond is polar (δ+ on C) but only one electron-withdrawing group.',
      'No π bond available to assist mechanism.',
      'Mechanism is SN1 or SN2 (depending on class) — slower because it requires breaking the C-Cl bond before/during nucleophile attack.',
    ]},
    { type: 'h', text: 'Why aryl chlorides are essentially unreactive' },
    { type: 'ul', items: [
      'In chlorobenzene, the Cl lone pair OVERLAPS with the benzene π system — partial double-bond character in C-Cl bond.',
      'C-Cl bond is shorter and stronger than in alkyl chlorides.',
      'The electron-rich aromatic ring REPELS approaching nucleophiles.',
      'Bond strengths: C-Cl (alkyl) ~338 kJ/mol; C-Cl (aryl) ~399 kJ/mol; the difference reflects the partial double-bond character.',
    ]},
    { type: 'callout', kind: 'key', title: 'The exam answer', body: 'For "compare the ease of hydrolysis": state the order (acyl > alkyl >> aryl), then explain each: (1) Acyl: two electron-withdrawing groups + C=O π bond → addition-elimination at δ+ C. (2) Alkyl: standard SN1/SN2 at δ+ C. (3) Aryl: Cl lone pair delocalised into ring → C-Cl bond stronger and ring repels nucleophile. Cite typical conditions for each.' },
    { type: 'takeaway', items: [
      'Acyl > alkyl >> aryl in hydrolysis reactivity.',
      'Acyl: vigorous at RT. Alkyl: reflux NaOH. Aryl: 300 °C, 200 atm.',
      'Acyl: addition-elimination mechanism. Aryl: π-overlap stabilises C-Cl.',
    ]},
  ]},

  { id: 'ca7', title: 'Esters: Properties, Formation & Hydrolysis', minutes: 10, blocks: [
    { type: 'p', text: 'Esters (R-COOR\') are common in nature — found in fruits (giving them their smell), fats and oils (triglycerides), and many synthetic flavourings and fragrances. They are made by combining a carboxylic acid (or acyl chloride) with an alcohol.' },
    { type: 'd', spec: carboxylicEsterFormationSpec, caption: 'Two routes to esters' },
    { type: 'h', text: 'Naming esters' },
    { type: 'ul', items: [
      'Two parts: alkyl (from the alcohol) + alkanoate (from the acid).',
      'CH₃COOCH₂CH₃: from ethanoic acid + ethanol → ETHYL ETHANOATE.',
      'HCOOCH₃: from methanoic acid + methanol → METHYL METHANOATE.',
      'CH₃CH₂COOCH(CH₃)₂: from propanoic acid + propan-2-ol → PROPAN-2-YL PROPANOATE.',
    ]},
    { type: 'h', text: 'Formation' },
    { type: 'ul', items: [
      'Route 1: from carboxylic acid + alcohol with conc. H₂SO₄ catalyst, reflux. Reversible (equilibrium); modest yield. Slow.',
      'Route 2 (preferred): from acyl chloride + alcohol. Fast, irreversible, no catalyst needed, high yield.',
      'For high-value esters (perfumes, pharmaceuticals), Route 2 is preferred. For bulk industrial esters, Route 1 may be used with excess of one reagent and water removal.',
    ]},
    { type: 'h', text: 'Hydrolysis of esters' },
    { type: 'd', spec: carboxylicEsterHydrolysisSpec, caption: 'Acid vs base hydrolysis of esters' },
    { type: 'ul', items: [
      'ACID hydrolysis: R-COOR\' + H₂O ⇌ R-COOH + R\'-OH. Reagents: dilute H₂SO₄ or HCl, REFLUX. Reversible — partial conversion.',
      'BASE hydrolysis (saponification): R-COOR\' + NaOH → R-COO⁻Na⁺ + R\'-OH. Reagents: NaOH(aq), REFLUX. IRREVERSIBLE because the carboxylic acid is immediately converted to its salt by the base. Goes to completion.',
      'Base hydrolysis is preferred when complete conversion is wanted.',
    ]},
    { type: 'h', text: 'Uses of esters' },
    { type: 'ul', items: [
      'Flavourings: ethyl ethanoate (pear), pentyl ethanoate (banana), octyl ethanoate (orange), methyl butanoate (apple). Used in confectionery, drinks, perfumes.',
      'Solvents: ethyl ethanoate is a common solvent for nail polish remover, glues, paints.',
      'Polyesters: condensation polymers of diols + dicarboxylic acids (e.g. PET = poly(ethylene terephthalate), used in bottles and fibres). See OC-20.',
      'Fats and oils: triglycerides — esters of glycerol with three fatty acids.',
      'Plasticisers: phthalate esters used to make PVC flexible.',
    ]},
    { type: 'takeaway', items: [
      'Naming: alkyl + alkanoate (e.g. ethyl ethanoate).',
      'Best route to esters: acyl chloride + alcohol (irreversible, fast).',
      'Acid hydrolysis: reversible. Base hydrolysis (saponification): irreversible.',
      'Uses: flavours, solvents, polyesters, fats.',
    ]},
  ]},

  { id: 'ca8', title: 'Soap Manufacture & Saponification', minutes: 8, blocks: [
    { type: 'p', text: 'Soap is made by the BASE HYDROLYSIS of fats and oils (triglyceride esters). This process is called SAPONIFICATION ("soap-making"). It is one of the oldest chemical industries — the basic reaction has been used for thousands of years.' },
    { type: 'h', text: 'What are fats and oils?' },
    { type: 'ul', items: [
      'Fats (solids at room T) and oils (liquids at room T) are TRIGLYCERIDES — esters of glycerol (propane-1,2,3-triol) with three FATTY ACIDS.',
      'Structure: glycerol\'s three –OH groups each form an ester linkage with a long-chain carboxylic acid (typically 12–22 carbons).',
      'Saturated fats (e.g. animal fat, butter): fatty acids have no C=C bonds → straight chains pack tightly → solid at RT.',
      'Unsaturated fats/oils (e.g. olive oil, sunflower oil): one or more C=C bonds → kinked chains, can\'t pack tightly → liquid at RT.',
    ]},
    { type: 'h', text: 'The saponification process' },
    { type: 'ul', items: [
      'Triglyceride + 3NaOH → glycerol + 3 R-COO⁻Na⁺ (sodium salt of the fatty acid = SOAP).',
      'Conditions: heat fat or oil with concentrated NaOH(aq), reflux for several hours.',
      'Mechanism: NaOH hydrolyses each of the three ester linkages.',
      'Sodium soaps: hard, used for bar soap. Potassium soaps (with KOH): softer, used for liquid soap, shaving cream.',
    ]},
    { type: 'h', text: 'How soap cleans' },
    { type: 'ul', items: [
      'Soap molecules are AMPHIPHILIC: a long hydrophobic hydrocarbon "tail" (CH₃(CH₂)ₙ–) and a hydrophilic ionic "head" (–COO⁻Na⁺).',
      'Hydrophobic tails embed in oil/grease; hydrophilic heads point out into water.',
      'This forms MICELLES — droplets of grease surrounded by soap molecules with their heads facing water.',
      'The micelles are dispersed and washed away by water — grease is removed.',
    ]},
    { type: 'h', text: 'The "salting out" step' },
    { type: 'p', text: 'After the saponification reaction, salt (NaCl) is added to the mixture. Soap is less soluble in salt solution than in pure water — it precipitates out as a solid lump, separating from the glycerol-water layer below. This is "salting out" the soap.' },
    { type: 'callout', kind: 'key', title: 'Why does this matter?', body: 'Saponification is the prototype example of base hydrolysis of esters. Triglycerides are the natural feedstock; the principle applies to all esters. The glycerol by-product is itself useful (in pharmaceuticals, cosmetics, explosives nitroglycerine).' },
    { type: 'takeaway', items: [
      'Soap = sodium (or potassium) salt of long-chain fatty acid.',
      'Made by base hydrolysis (saponification) of fats/oils with NaOH or KOH.',
      'Cleans by forming micelles — hydrophobic tail in grease, ionic head in water.',
      'Salting out separates the soap as a solid.',
    ]},
  ]},

  { id: 'ca9', title: 'Amides & Their Hydrolysis', minutes: 8, blocks: [
    { type: 'p', text: 'Amides (R-CONH₂) are formed when an acyl chloride reacts with ammonia. They contain the amide functional group –C(=O)–NH–, which is also found in proteins (where it is called the peptide bond). Amides can be hydrolysed back to carboxylic acids and amines.' },
    { type: 'h', text: 'Formation of amides' },
    { type: 'ul', items: [
      'From acyl chloride + ammonia: R-COCl + 2NH₃ → R-CONH₂ + NH₄Cl. Forms a primary amide.',
      'From acyl chloride + primary amine: R-COCl + 2R\'-NH₂ → R-CONHR\' + R\'NH₃Cl. Forms an N-substituted amide. The 2nd equivalent of amine acts as a base to absorb HCl.',
      'From acid + amine direct: difficult — usually goes via the acyl chloride.',
      'Examples: CH₃COCl + NH₃ → CH₃CONH₂ (ethanamide); CH₃COCl + CH₃NH₂ → CH₃CONHCH₃ (N-methylethanamide).',
    ]},
    { type: 'h', text: 'Naming amides' },
    { type: 'ul', items: [
      'Replace "-oic acid" or "-oyl chloride" with "-amide". Example: ethanoic acid → ethanamide.',
      'For N-substituted amides: prefix "N-" with the substituent name. CH₃CONHCH₃ = N-methylethanamide.',
      'CH₃CON(CH₃)₂ = N,N-dimethylethanamide (both H replaced).',
    ]},
    { type: 'h', text: 'Hydrolysis of amides' },
    { type: 'ul', items: [
      'ACID hydrolysis: R-CONH₂ + H₂O + HCl → R-COOH + NH₄Cl. Reagents: dilute HCl, reflux several hours.',
      'BASE hydrolysis: R-CONH₂ + NaOH → R-COO⁻Na⁺ + NH₃. Reagents: dilute NaOH, reflux. Releases ammonia as gas.',
      'Both routes work but require harsher conditions than ester hydrolysis (amides are less reactive than esters because the lone pair on N delocalises into the C=O).',
      'Hydrolysis of N-substituted amides gives the carboxylic acid (or salt) + the amine: R-CONHR\' + H₂O + HCl → R-COOH + R\'NH₃Cl.',
    ]},
    { type: 'h', text: 'The peptide bond' },
    { type: 'ul', items: [
      'In proteins, amino acids are linked by peptide bonds: –NH–C(=O)– (an amide bond).',
      'Hydrolysis of proteins (e.g. by digestion or laboratory acid/base) breaks these peptide bonds, releasing individual amino acids.',
      'This is the same chemistry as amide hydrolysis — proteins are essentially long chains of amides.',
      'See OC-19 Nitrogen Compounds for the full discussion of amino acids and proteins.',
    ]},
    { type: 'callout', kind: 'key', title: 'Reactivity hierarchy of acid derivatives', body: 'Acyl chlorides > esters > amides in reactivity (towards nucleophiles). This is because: (1) Cl is the best leaving group, NH₂ is the worst. (2) The lone pair on N donates into C=O strongly (good resonance), making amides less electrophilic; OR on O is weaker resonance. So amides are the LEAST reactive — which is why proteins (containing peptide bonds) are stable to mild conditions.' },
    { type: 'takeaway', items: [
      'Amide formation: acyl chloride + NH₃/RNH₂.',
      'Naming: "-amide" suffix. N-substituted amides have prefix "N-".',
      'Acid or base hydrolysis: amide → acid (or salt) + amine.',
      'Peptide bond = amide bond in proteins. Hydrolysis breaks them.',
    ]},
  ]},

  { id: 'ca10', title: 'Distinguishing Tests & Functional Group ID', minutes: 8, blocks: [
    { type: 'p', text: 'Carboxylic acids and their derivatives can be distinguished from each other and from other classes (alcohols, phenols, esters) using a combination of simple tests.' },
    { type: 'h', text: 'Test 1: Sodium carbonate (Na₂CO₃)' },
    { type: 'ul', items: [
      'Add Na₂CO₃(aq) and observe.',
      'Carboxylic acids: EFFERVESCENCE — CO₂ released. 2R-COOH + Na₂CO₃ → 2R-COO⁻Na⁺ + CO₂ + H₂O.',
      'Phenols: NO reaction (too weak as acids).',
      'Alcohols: NO reaction.',
      'This test is the PRIMARY way to identify a carboxylic acid.',
    ]},
    { type: 'h', text: 'Test 2: Sodium hydroxide (NaOH)' },
    { type: 'ul', items: [
      'All three (acid, phenol, alcohol have OH groups), but only acids and phenols react with NaOH(aq).',
      'Acid: dissolves to form sodium carboxylate.',
      'Phenol: dissolves to form sodium phenoxide.',
      'Alcohol: NO reaction.',
      'Combined with Na₂CO₃ test, this gives a clear distinction.',
    ]},
    { type: 'h', text: 'Test 3: Smell' },
    { type: 'ul', items: [
      'Short-chain acids: pungent (vinegar-like); butanoic acid has a particularly rancid smell.',
      'Esters: PLEASANT, fruity smells (banana, pineapple, etc.).',
      'Useful as a quick check but never the only test.',
    ]},
    { type: 'h', text: 'Test 4: Acyl chlorides — fume test' },
    { type: 'ul', items: [
      'Add a drop of water (or expose to moist air): VIGOROUS reaction, white fumes of HCl visible.',
      'No other class of organic compound behaves like this.',
    ]},
    { type: 'h', text: 'Test 5: Amides — release of NH₃' },
    { type: 'ul', items: [
      'Boil with NaOH(aq). Ammonia gas is released — turns damp red litmus paper blue.',
      'Distinguishes amides from other functional groups.',
    ]},
    { type: 'callout', kind: 'key', title: 'Quick decision tree for OH-containing organics', body: 'Add Na: alcohol/phenol/acid all release H₂. Add NaOH: phenol and acid dissolve; alcohol does not. Add Na₂CO₃: acid effervesces with CO₂; phenol does not react. So: Na ✓ + NaOH ✓ + Na₂CO₃ ✓ = ACID. Na ✓ + NaOH ✓ + Na₂CO₃ ✗ = PHENOL. Na ✓ + NaOH ✗ + Na₂CO₃ ✗ = ALCOHOL.' },
    { type: 'takeaway', items: [
      'Na₂CO₃: CO₂ effervescence = carboxylic acid (specific test).',
      'NaOH: dissolves phenol and acid; not alcohol.',
      'Acyl chloride: vigorous fumes with water = HCl.',
      'Amide: NaOH/heat → NH₃ released.',
    ]},
  ]},

  { id: 'ca11', title: 'Synthesis: Multi-Step Examples', minutes: 8, blocks: [
    { type: 'p', text: 'Carboxylic acids and their derivatives are central to many synthetic sequences. Here are common multi-step patterns.' },
    { type: 'h', text: 'Pattern 1: Alcohol → ester (via acyl chloride)' },
    { type: 'ul', items: [
      'Alcohol → carboxylic acid → acyl chloride → ester.',
      'Step 1: oxidation. R-CH₂OH + 2[O] → R-COOH (K₂Cr₂O₇/H₂SO₄, reflux).',
      'Step 2: acyl chloride. R-COOH + SOCl₂ → R-COCl (SOCl₂, reflux briefly).',
      'Step 3: esterification. R-COCl + R\'-OH → R-COOR\' + HCl (room temperature, fast).',
      'Why use Route 2 (acyl chloride)? Fast, irreversible, no equilibrium to manage.',
    ]},
    { type: 'h', text: 'Pattern 2: Halogenoalkane → carboxylic acid (chain extension)' },
    { type: 'ul', items: [
      'R-X (n carbons) → R-CN (n+1 carbons) → R-COOH (n+1 carbons).',
      'Step 1: nucleophilic substitution. R-Br + KCN(alc) → R-CN + KBr. Reflux in ethanol.',
      'Step 2: acid hydrolysis of nitrile. R-CN + 2H₂O + HCl → R-COOH + NH₄Cl. Dilute HCl, reflux.',
      'Net result: chain extended by 1 carbon, halogen replaced by COOH group.',
      'Example: 1-bromopropane → butanoic acid (C3 → C4).',
    ]},
    { type: 'h', text: 'Pattern 3: Aldehyde → 2-hydroxy carboxylic acid (chain extension)' },
    { type: 'ul', items: [
      'R-CHO → R-CH(OH)CN → R-CH(OH)COOH.',
      'Step 1: HCN addition. R-CHO + HCN → R-CH(OH)CN (KCN/dilute H₂SO₄, ~10 °C).',
      'Step 2: hydrolysis. R-CH(OH)CN + 2H₂O + HCl → R-CH(OH)COOH + NH₄Cl. Dilute HCl, reflux.',
      'Example: ethanal → 2-hydroxypropanoic acid (lactic acid).',
    ]},
    { type: 'h', text: 'Pattern 4: Acid → amide → primary amine' },
    { type: 'ul', items: [
      'R-COOH → R-COCl → R-CONH₂ → R-CH₂-NH₂.',
      'Step 1: acid → acyl chloride (SOCl₂).',
      'Step 2: acyl chloride + NH₃ → primary amide.',
      'Step 3: amide reduction with LiAlH₄ in dry ether → primary amine.',
      'Useful for converting an acid to an amine with the same number of carbons.',
    ]},
    { type: 'callout', kind: 'key', title: 'Plan your synthesis', body: 'When given a multi-step problem, work BACKWARDS from the product. Identify which functional group transformation is needed at each step. Carboxylic acids and acyl chlorides are common intermediates because so many things connect through them.' },
    { type: 'takeaway', items: [
      'Alcohol → acid → acyl chloride → ester (preferred ester route).',
      'Halogenoalkane → nitrile → acid (chain extension by 1 C).',
      'Aldehyde → cyanohydrin → 2-hydroxy acid.',
      'Acid → acyl chloride → amide → primary amine.',
    ]},
  ]},

  { id: 'ca12', title: 'Exam Technique & Common Pitfalls', minutes: 7, blocks: [
    { type: 'p', text: 'Carboxylic acid questions test acidity, derivative interconversions, and multi-step synthesis. Here are the patterns.' },
    { type: 'h', text: 'Acidity comparisons — the must-have argument' },
    { type: 'ul', items: [
      'ALWAYS argue from CONJUGATE BASE STABILITY.',
      'Carboxylate: charge spread over 2 equivalent O atoms (resonance) — very stable.',
      'Phenoxide: charge in ring + on O, less effective resonance — less stable.',
      'Alkoxide (alcohol\'s base): charge localised on one O, +I from alkyl destabilises.',
      'Chlorinated acids: more Cl = more stabilisation of carboxylate via –I → stronger acid.',
      'Distance matters: Cl on the C adjacent to COOH is most effective.',
    ]},
    { type: 'h', text: 'Choosing the right ester route' },
    { type: 'ul', items: [
      'For HIGH YIELD ester: use acyl chloride + alcohol (irreversible, fast).',
      'For BULK/cheap esters: acid + alcohol with conc. H₂SO₄ (reversible — use excess).',
      'For PHENYL esters: use acyl chloride (acid + phenol is too slow because phenol is a weaker nucleophile).',
    ]},
    { type: 'h', text: 'Common mistakes' },
    { type: 'ul', items: [
      'Saying "acyl chlorides + water gives an ester" — they give the ACID, not an ester. Esters need an alcohol.',
      'Forgetting that base hydrolysis of esters is IRREVERSIBLE (because the carboxylate ion forms — base sucks up the acid product).',
      'Saying "NaBH₄ reduces carboxylic acids" — it does NOT. Use LiAlH₄.',
      'Using PCl₅ to make an acid → ester directly. PCl₅ converts acid to ACYL CHLORIDE, not to ester.',
      'Forgetting that the iodoform test for CH₃-CO- substructure works for methyl ketones, NOT for carboxylic acids.',
    ]},
    { type: 'h', text: 'Equations to memorise' },
    { type: 'ul', items: [
      'Acid + Na₂CO₃: 2R-COOH + Na₂CO₃ → 2R-COO⁻Na⁺ + CO₂↑ + H₂O. (Diagnostic test.)',
      'Acid + alcohol ⇌ ester + water. (Conc. H₂SO₄, reflux.)',
      'Acyl chloride + alcohol → ester + HCl. (Fast, irreversible.)',
      'Acyl chloride + NH₃ → primary amide + NH₄Cl.',
      'Ester + NaOH → carboxylate + alcohol. (Saponification, irreversible.)',
      'Nitrile + H₂O + HCl → carboxylic acid + NH₄Cl. (Reflux, chain +1 C.)',
    ]},
    { type: 'callout', kind: 'key', title: 'The acidity ladder', body: 'pKa: trichloroethanoic acid 0.66 < dichloro 1.30 < chloro 2.86 < methanoic 3.75 < ethanoic 4.76 < propanoic 4.87 < phenol 10 < water 14 < ethanol 16. Memorise the order: carboxylic acids >> phenols > water > alcohols. Within carboxylic acids: more –I substituents (Cl, F) = stronger acid.' },
    { type: 'takeaway', items: [
      'Argue acidity from conjugate base stability.',
      'Best ester route: acyl chloride + alcohol.',
      'Distinguishing tests: Na₂CO₃ for acid (CO₂); NaOH for phenol/acid; Na for any OH.',
      'Acyl chlorides > esters > amides in reactivity (Cl > OR > NH₂ as leaving groups).',
    ]},
  ]},
];

/* ============================================================
   Quizzes — 32 MCQs
   ============================================================ */
const quizzes = [
  { q: 'The IUPAC name for CH₃CH₂COOH is:', opts: ['Ethanoic acid', 'Propanoic acid', 'Propanal', 'Methanoic acid'], ans: 1, hint: '3 carbons, ending in –oic acid.' },
  { q: 'The functional group of carboxylic acids is:', opts: ['–OH only', '–COOH', '–CHO', '–CO–'], ans: 1, hint: 'C=O and O-H on the same carbon.' },
  { q: 'Carboxylic acids exist as DIMERS in pure liquid because:', opts: ['They are unstable as monomers', 'They form two H-bonds between molecules', 'They ionise', 'They polymerise'], ans: 1, hint: 'Strong H-bonding via OH and C=O joins pairs of molecules.' },
  { q: 'Test that distinguishes a carboxylic acid from a phenol:', opts: ['Na metal', 'NaOH(aq)', 'Na₂CO₃(aq) → CO₂', 'AgNO₃'], ans: 2, hint: 'Acids release CO₂ from carbonates; phenols do not.' },
  { q: 'When propan-1-ol is refluxed with K₂Cr₂O₇/H₂SO₄, the final product is:', opts: ['Propanal', 'Propanone', 'Propanoic acid', 'Propan-2-ol'], ans: 2, hint: 'Reflux + excess oxidiser → full oxidation to acid.' },
  { q: 'Hydrolysis of CH₃CN with dilute HCl gives:', opts: ['CH₃COOH + NH₄Cl', 'CH₃CHO + NH₃', 'CH₃CH₂OH + HCl', 'No reaction'], ans: 0, hint: 'Acid hydrolysis of nitrile → carboxylic acid + ammonium salt.' },
  { q: 'The reagent for converting CH₃COOH to CH₃COCl is:', opts: ['NaOH', 'PCl₅ or SOCl₂', 'KCN', 'HCl'], ans: 1, hint: 'Acid → acyl chloride: PCl₅, SOCl₂, or PCl₃.' },
  { q: 'Acidity order (strongest first):', opts: ['Phenol > acid > water', 'Acid > phenol > alcohol', 'Alcohol > acid > phenol', 'Water > acid > alcohol'], ans: 1, hint: 'Carboxylate is best stabilised → strongest acid.' },
  { q: 'Why is the carboxylate (R-COO⁻) so stable?', opts: ['It is a small ion', 'Charge spread equally over both O atoms by resonance', 'It is neutral', 'It has no electrons'], ans: 1, hint: 'Two equivalent O atoms share the negative charge.' },
  { q: 'Which is the strongest acid?', opts: ['Ethanoic acid', 'Chloroethanoic acid', 'Dichloroethanoic acid', 'Trichloroethanoic acid'], ans: 3, hint: 'More Cl → more –I effect → more carboxylate stability → stronger acid.' },
  { q: 'Why does CH₃ in ethanoic acid make it weaker than methanoic acid?', opts: ['CH₃ is bigger', 'CH₃ donates electrons (+I), destabilising carboxylate', 'CH₃ withdraws electrons', 'CH₃ blocks the OH'], ans: 1, hint: 'Alkyl groups donate electrons; this destabilises the negative charge.' },
  { q: 'CH₃COOH + NaHCO₃ →', opts: ['No reaction', 'CH₃COONa + H₂O', 'CH₃COONa + CO₂ + H₂O', 'CH₃COCl + NaOH'], ans: 2, hint: 'Acid + carbonate/hydrogencarbonate → CO₂ effervescence.' },
  { q: 'CH₃COOH + CH₃CH₂OH (with conc. H₂SO₄, reflux) gives:', opts: ['CH₃CH₂COOH', 'CH₃COOCH₂CH₃ + H₂O', 'CH₃CH₂CHO + H₂O', 'No reaction'], ans: 1, hint: 'Esterification: acid + alcohol ⇌ ester + water.' },
  { q: 'The reaction of an acid with an alcohol is:', opts: ['Irreversible', 'Reversible — use excess to push forward', 'Catalysed by NaOH', 'Spontaneous at RT'], ans: 1, hint: 'Esterification is an equilibrium; conc. H₂SO₄ is the catalyst.' },
  { q: 'For the BEST ester yield, use:', opts: ['Acid + alcohol + dilute H₂SO₄', 'Acyl chloride + alcohol', 'Aldehyde + alcohol', 'Acid + acid'], ans: 1, hint: 'Acyl chloride route is fast, irreversible, high yield.' },
  { q: 'CH₃COCl + H₂O →', opts: ['No reaction', 'CH₃COOH + HCl (vigorous)', 'CH₃CH₂OH + HCl', 'CH₃CHO + HCl'], ans: 1, hint: 'Acyl chloride hydrolysis → acid + HCl, fast and vigorous.' },
  { q: 'CH₃COCl + NH₃ →', opts: ['CH₃COOH + NH₃', 'CH₃CONH₂ + NH₄Cl', 'CH₃CN + H₂O', 'CH₃CHO + Cl⁻'], ans: 1, hint: 'Acyl chloride + NH₃ → primary amide.' },
  { q: 'Order of hydrolysis ease (fastest first):', opts: ['Alkyl Cl > acyl Cl > aryl Cl', 'Acyl Cl > alkyl Cl > aryl Cl', 'Aryl Cl > alkyl Cl > acyl Cl', 'All hydrolyse equally'], ans: 1, hint: 'Acyl Cl: vigorous at RT. Alkyl: needs reflux. Aryl: 300°C, 200 atm.' },
  { q: 'Why is chlorobenzene so much less reactive than acetyl chloride?', opts: ['Cl is too big', 'Cl lone pair delocalised into ring → C-Cl bond stronger', 'Aryl Cl is ionic', 'Chlorobenzene has no C=O'], ans: 1, hint: 'Ring π-overlap stabilises the C-Cl bond.' },
  { q: 'Acid hydrolysis of an ester gives:', opts: ['Carboxylate + alcohol', 'Acid + alcohol', 'Acid + alkene', 'Aldehyde + ketone'], ans: 1, hint: 'Reverse of esterification: ester + H₂O ⇌ acid + alcohol.' },
  { q: 'Base hydrolysis (saponification) of an ester gives:', opts: ['Acid + alcohol', 'Carboxylate salt + alcohol', 'Aldehyde + ketone', 'No reaction'], ans: 1, hint: 'NaOH consumes the acid product → forms carboxylate salt.' },
  { q: 'Saponification is irreversible because:', opts: ['NaOH is too dilute', 'The carboxylate salt does not react with the alcohol back', 'It is exothermic', 'No catalyst'], ans: 1, hint: 'The carboxylate ion is unreactive towards alcohol — equilibrium pulled to products.' },
  { q: 'Soap is the:', opts: ['Sodium salt of glycerol', 'Sodium salt of long-chain fatty acid', 'Sodium hydroxide directly', 'Sodium ester'], ans: 1, hint: 'Saponification of triglyceride → soap = R-COO⁻Na⁺ where R is C12-C22.' },
  { q: 'In a soap molecule, the hydrophilic end is:', opts: ['The hydrocarbon tail', 'The –COO⁻Na⁺ head', 'The CH₃ end', 'The middle of the chain'], ans: 1, hint: 'Ionic head likes water; hydrocarbon tail likes oil.' },
  { q: 'A triglyceride is an ester of:', opts: ['Glucose + fatty acid', 'Glycerol + 3 fatty acids', 'Methanol + acid', 'Ethanol + 3 alcohols'], ans: 1, hint: 'Glycerol (propane-1,2,3-triol) has 3 OH groups, each esterified.' },
  { q: 'CH₃CONH₂ on heating with NaOH gives:', opts: ['CH₃COOH', 'CH₃COO⁻Na⁺ + NH₃', 'CH₃CHO + NH₃', 'No reaction'], ans: 1, hint: 'Base hydrolysis of amide: → carboxylate salt + ammonia gas.' },
  { q: 'The reagent that reduces R-COOH to R-CH₂OH is:', opts: ['NaBH₄', 'LiAlH₄ in dry ether', 'H₂/Ni', 'Cr₂O₇²⁻'], ans: 1, hint: 'NaBH₄ is too weak; LiAlH₄ is needed.' },
  { q: 'Distinguishing test between phenol and ethanoic acid:', opts: ['Na metal', 'NaOH', 'Na₂CO₃ (acid effervesces, phenol does not)', 'PCl₅'], ans: 2, hint: 'Acid is strong enough to release CO₂; phenol is not.' },
  { q: 'Distinguishing test between alcohol and ethanoic acid:', opts: ['Na (both react)', 'NaOH (only acid reacts)', 'Heat (only alcohol burns)', 'AgNO₃'], ans: 1, hint: 'Acid dissolves in NaOH; alcohol does not react.' },
  { q: 'The simplest aliphatic carboxylic acid is:', opts: ['Ethanoic acid', 'Methanoic acid (HCOOH)', 'Carbonic acid', 'Glycolic acid'], ans: 1, hint: 'HCOOH = methanoic = formic acid (1 carbon).' },
  { q: 'Methyl propanoate is:', opts: ['CH₃COOCH₃', 'CH₃CH₂COOCH₃', 'CH₃COOCH₂CH₃', 'HCOOCH₃'], ans: 1, hint: 'Propanoate = from propanoic acid (C2H5COO-); methyl = OCH3.' },
  { q: 'The bond order of each C-O bond in the carboxylate (R-COO⁻) is:', opts: ['1', '1.5 (between single and double)', '2', '3'], ans: 1, hint: 'Resonance averages the C=O and C-O⁻ to bond order 1.5 each.' },
];

/* ============================================================
   Structured questions — 6
   ============================================================ */
const structured = [
  { title: 'Preparation and reactions', marks: 8, q: 'Ethanoic acid (CH₃COOH) can be prepared from ethanol and undergoes various reactions.', parts: [
    { q: '(a) Write the equation and conditions for the preparation of ethanoic acid from ethanol.', marks: 2, ans: 'CH₃CH₂OH + 2[O] → CH₃COOH + H₂O. Reagents: acidified potassium dichromate(VI), K₂Cr₂O₇/H₂SO₄. Conditions: REFLUX with excess oxidising agent (the aldehyde intermediate is fully oxidised). Colour change: orange → green.' },
    { q: '(b) Write the equation for the reaction of ethanoic acid with sodium carbonate, and state what would be observed.', marks: 2, ans: '2CH₃COOH + Na₂CO₃ → 2CH₃COO⁻Na⁺ + CO₂(g) + H₂O. Observation: effervescence (bubbles of CO₂ gas). The CO₂ would turn limewater milky, confirming its identity.' },
    { q: '(c) Write the equation for the reaction of ethanoic acid with ethanol, and state the conditions and the observed result.', marks: 2, ans: 'CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O. Conditions: concentrated H₂SO₄ catalyst, reflux. Observation: a sweet, fruity smell (ethyl ethanoate) develops. The reaction is reversible — only a partial conversion is achieved.' },
    { q: '(d) Write the equation for the conversion of ethanoic acid to ethanoyl chloride.', marks: 2, ans: 'CH₃COOH + SOCl₂ → CH₃COCl + HCl + SO₂. (Or alternatively: CH₃COOH + PCl₅ → CH₃COCl + HCl + POCl₃.) The cleaner method is SOCl₂ because the by-products are gases (HCl and SO₂) which escape, leaving pure acyl chloride.' },
  ]},
  { title: 'Acidity and the inductive effect', marks: 8, q: 'The acidities of substituted ethanoic acids vary widely. Some pKa values: ethanoic acid 4.76; chloroethanoic acid 2.86; trichloroethanoic acid 0.66.', parts: [
    { q: '(a) Define pKa and state what a lower pKa indicates.', marks: 1, ans: 'pKa = −log₁₀(Ka). A LOWER pKa means a HIGHER Ka, which means the acid dissociates more — i.e. the acid is STRONGER.' },
    { q: '(b) Explain why chloroethanoic acid (ClCH₂COOH) is much stronger than ethanoic acid.', marks: 3, ans: 'In chloroethanoic acid, the chlorine atom is highly electronegative and exerts a NEGATIVE INDUCTIVE EFFECT (–I): it withdraws electron density from the rest of the molecule. In the conjugate base (ClCH₂COO⁻), this electron-withdrawing effect helps to spread the negative charge away from the oxygen atoms, stabilising the anion. A more stable conjugate base → equilibrium of dissociation lies further right → stronger acid. In ethanoic acid (CH₃COOH), the methyl group has no such effect (in fact it slightly DESTABILISES the carboxylate via the +I effect), so the acid is weaker.' },
    { q: '(c) Explain why trichloroethanoic acid (Cl₃CCOOH) is even stronger than chloroethanoic acid.', marks: 2, ans: 'With three chlorine atoms, the –I (electron-withdrawing) effect is approximately tripled. The three Cl atoms collectively withdraw far more electron density from the carboxylate than a single Cl atom does. The carboxylate Cl₃CCOO⁻ is much more stabilised than ClCH₂COO⁻, making trichloroethanoic acid a much stronger acid (pKa 0.66 vs 2.86 — about 100× stronger).' },
    { q: '(d) Predict whether 4-chlorobutanoic acid (Cl on C4, far from COOH) would be more or less acidic than 2-chlorobutanoic acid (Cl on C2). Justify.', marks: 2, ans: '4-chlorobutanoic acid is LESS acidic than 2-chlorobutanoic acid. The –I effect of Cl falls off rapidly with distance through saturated bonds. In 2-chlorobutanoic acid, the Cl is directly bonded to the carbon next to the COOH, so it strongly stabilises the carboxylate. In 4-chlorobutanoic acid, the Cl is three carbons away — the inductive effect is much weaker, so the carboxylate is less stabilised. Therefore 4-chloro is the weaker acid.' },
  ]},
  { title: 'Acyl chlorides and esters', marks: 9, q: 'Ethanoyl chloride (CH₃COCl) reacts with several different nucleophiles.', parts: [
    { q: '(a) Write equations for the reactions of CH₃COCl with: (i) water, (ii) ethanol, (iii) ammonia.', marks: 3, ans: '(i) CH₃COCl + H₂O → CH₃COOH + HCl. (ii) CH₃COCl + CH₃CH₂OH → CH₃COOCH₂CH₃ + HCl. (iii) CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl.' },
    { q: '(b) State the type of reaction in each case and describe the conditions.', marks: 3, ans: 'All three are nucleophilic substitution (also called nucleophilic acyl substitution or addition-elimination). The nucleophile attacks the δ+ carbonyl C, displacing Cl⁻ which then takes a proton to leave as HCl. (i) Water: vigorous at room temperature; visible white fumes of HCl. (ii) Ethanol: rapid at room temperature; gives a high yield of ester (ethyl ethanoate). (iii) Ammonia: vigorous at room temperature; second equivalent of NH₃ acts as a base to neutralise HCl. Forms a white precipitate of ethanamide.' },
    { q: '(c) Compare the rate of hydrolysis of ethanoyl chloride with chloroethane. Explain the difference.', marks: 3, ans: 'Ethanoyl chloride (CH₃COCl) hydrolyses VIGOROUSLY at room temperature on contact with water. Chloroethane (CH₃CH₂Cl) hydrolyses SLOWLY and requires heating with NaOH(aq) under reflux. The difference is due to: (1) In ethanoyl chloride, the C is bonded to two electron-withdrawing groups (C=O and Cl), giving a very large δ+ on C. (2) The C=O π bond can break to allow nucleophilic attack via an addition-elimination mechanism, giving a stable tetrahedral intermediate. (3) Cl is an excellent leaving group from this position. In chloroethane, only the C-Cl bond is polar (one electron-withdrawing group), and there is no π bond to assist, so the mechanism is slower SN1/SN2.' },
  ]},
  { title: 'Ester chemistry', marks: 8, q: 'Esters can be prepared and hydrolysed using a variety of conditions.', parts: [
    { q: '(a) Write equations for the formation of ethyl ethanoate by (i) the carboxylic acid route and (ii) the acyl chloride route.', marks: 2, ans: '(i) CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O. (ii) CH₃COCl + CH₃CH₂OH → CH₃COOCH₂CH₃ + HCl.' },
    { q: '(b) Compare the two routes — give two advantages of the acyl chloride route over the acid route.', marks: 2, ans: 'Advantages of the acyl chloride route: (1) The reaction is IRREVERSIBLE (HCl evolved as a gas, removing it from the system) — gives high yield. The acid + alcohol route is REVERSIBLE — yield is limited by equilibrium. (2) The acyl chloride route is FAST and proceeds at room temperature, whereas the acid + alcohol route requires reflux for hours and a catalyst (conc. H₂SO₄). (3) Acyl chloride route works well for both alcohols and phenols, while the acid + alcohol route is impractical for phenols (phenols are weaker nucleophiles).' },
    { q: '(c) Write the equation for the BASE hydrolysis of ethyl ethanoate, state the conditions, and explain why this reaction is irreversible.', marks: 4, ans: 'CH₃COOCH₂CH₃ + NaOH → CH₃COO⁻Na⁺ + CH₃CH₂OH. Conditions: aqueous NaOH, REFLUX for several hours. The reaction is IRREVERSIBLE because the carboxylate ion (CH₃COO⁻) is the final form — it does not react back with the alcohol because both are now negatively charged or neutral with no driving force. The base "consumes" the carboxylic acid as soon as it forms by deprotonation, removing it from any equilibrium. By Le Chatelier, removal of a product drives the reaction to completion. To recover the acid, acidify the mixture with HCl after hydrolysis is complete.' },
  ]},
  { title: 'Soap manufacture', marks: 7, q: 'Soap is manufactured by the saponification of fats and oils.', parts: [
    { q: '(a) Define saponification.', marks: 1, ans: 'Saponification is the BASE HYDROLYSIS of esters (specifically, of fats/oils which are triglyceride esters) using NaOH or KOH, producing the sodium (or potassium) salt of the fatty acid (which is the soap) and glycerol.' },
    { q: '(b) Describe the structure of a typical triglyceride.', marks: 2, ans: 'A triglyceride is an ester of GLYCEROL (propane-1,2,3-triol — a triol with three –OH groups) with three FATTY ACIDS (long-chain carboxylic acids, typically C12–C22). Each of the three –OH groups of glycerol is esterified with a different (or the same) fatty acid. The general structure is CH₂(OOC-R)–CH(OOC-R\')–CH₂(OOC-R\'\').' },
    { q: '(c) Write a general equation for the saponification of a triglyceride with NaOH.', marks: 2, ans: 'CH₂(OOC-R)CH(OOC-R\')CH₂(OOC-R\'\') + 3NaOH → CH₂(OH)CH(OH)CH₂(OH) + R-COO⁻Na⁺ + R\'-COO⁻Na⁺ + R\'\'-COO⁻Na⁺. The triglyceride + 3NaOH → glycerol + 3 sodium salts of the fatty acids (the soap).' },
    { q: '(d) Explain how soap molecules clean grease and oil from skin or clothes.', marks: 2, ans: 'Soap molecules are AMPHIPHILIC: they have a long hydrophobic hydrocarbon "tail" (the R group) and a hydrophilic ionic "head" (the –COO⁻Na⁺ group). When mixed with greasy water, the hydrophobic tails embed in the oil/grease droplets while the hydrophilic heads stay in the water. This forms MICELLES — small spherical aggregates with the grease trapped inside, surrounded by ionic heads facing outwards. The micelles are dispersed in the water and washed away, removing the grease.' },
  ]},
  { title: 'Multi-step synthesis', marks: 8, q: 'Outline the synthesis of the following, giving reagents, conditions and equations.', parts: [
    { q: '(a) Convert ethanol into ethyl ethanoate via an acyl chloride.', marks: 4, ans: 'Step 1: oxidise ethanol to ethanoic acid. CH₃CH₂OH + 2[O] → CH₃COOH + H₂O. Reagents: K₂Cr₂O₇/H₂SO₄, REFLUX. Step 2: convert acid to acyl chloride. CH₃COOH + SOCl₂ → CH₃COCl + HCl + SO₂. Reagents: SOCl₂, reflux briefly. Step 3: react acyl chloride with ethanol. CH₃COCl + CH₃CH₂OH → CH₃COOCH₂CH₃ + HCl. Reagents: ethanol, room temperature. Note: half of the original ethanol is set aside for step 3; the other half is oxidised in step 1.' },
    { q: '(b) Convert 1-bromopropane into butanoic acid (chain extension).', marks: 2, ans: 'Step 1: substitute halogen with cyanide. CH₃CH₂CH₂Br + KCN(alc) → CH₃CH₂CH₂CN + KBr. Conditions: KCN dissolved in ethanol, reflux. Step 2: hydrolyse the nitrile. CH₃CH₂CH₂CN + 2H₂O + HCl → CH₃CH₂CH₂COOH + NH₄Cl. Conditions: dilute HCl, reflux. Net: chain extends from 3 carbons (1-bromopropane) to 4 carbons (butanoic acid).' },
    { q: '(c) Convert ethanoic acid into ethanamide (CH₃CONH₂).', marks: 2, ans: 'Two-step process via acyl chloride. Step 1: CH₃COOH + SOCl₂ → CH₃COCl + HCl + SO₂. Step 2: CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl. Conditions: room temperature; the second equivalent of NH₃ neutralises HCl. The product is a primary amide (white solid).' },
  ]},
];

/* ============================================================
   Worked examples — 8
   ============================================================ */
const worked = [
  { title: 'Distinguishing test', diff: 'easy', q: 'How would you distinguish ethanoic acid from phenol using a single chemical test?', steps: [
    { label: 'STEP 1', text: 'Both react with Na metal (release H₂) and with NaOH(aq) (dissolve), so neither of these distinguishes them.' },
    { label: 'STEP 2', text: 'Use sodium carbonate solution, Na₂CO₃(aq).' },
    { label: 'STEP 3', text: 'Ethanoic acid: 2CH₃COOH + Na₂CO₃ → 2CH₃COO⁻Na⁺ + CO₂ + H₂O. Effervescence (CO₂ bubbles) is observed.' },
    { label: 'STEP 4', text: 'Phenol: NO reaction. Phenol is too weak an acid to release CO₂ from carbonate.' },
  ], ans: 'Add Na₂CO₃(aq): ethanoic acid effervesces (CO₂); phenol does not react.' },

  { title: 'Acidity comparison', diff: 'medium', q: 'Explain why dichloroethanoic acid (Cl₂CHCOOH, pKa 1.30) is a much stronger acid than ethanoic acid (CH₃COOH, pKa 4.76).', steps: [
    { label: 'STEP 1', text: 'Both acids ionise to release H⁺ and form a carboxylate ion. Acid strength is determined by the stability of the conjugate base.' },
    { label: 'STEP 2', text: 'In dichloroethanoic acid, the two Cl atoms are highly electronegative (–I effect). They withdraw electron density away from the C-COOH carbon, and through the carbon, away from the carboxylate.' },
    { label: 'STEP 3', text: 'The withdrawn electron density helps to spread out the negative charge on Cl₂CHCOO⁻, stabilising the conjugate base.' },
    { label: 'STEP 4', text: 'In ethanoic acid, the CH₃ group is electron-DONATING (+I effect), which DESTABILISES the carboxylate by pushing electron density onto the already negative O.' },
    { label: 'STEP 5', text: 'More stable conjugate base = stronger acid. Cl₂CHCOOH has a much more stabilised carboxylate than CH₃COOH, so it is a much stronger acid.' },
  ], ans: 'Two Cl atoms withdraw electron density (–I effect), stabilising the carboxylate ion. CH₃ donates electrons (+I), destabilising it. Net: dichloro is far stronger.' },

  { title: 'Acyl chloride synthesis', diff: 'easy', q: 'How would you convert propanoic acid into propanoyl chloride? Give the equation and reagents.', steps: [
    { label: 'STEP 1', text: 'To convert a carboxylic acid to an acyl chloride, replace –OH with –Cl.' },
    { label: 'STEP 2', text: 'Reagents: SOCl₂ (thionyl chloride) is the cleanest. Or PCl₅, or PCl₃.' },
    { label: 'STEP 3', text: 'Equation: CH₃CH₂COOH + SOCl₂ → CH₃CH₂COCl + HCl + SO₂.' },
    { label: 'STEP 4', text: 'Conditions: reflux briefly. By-products HCl and SO₂ are gases and escape, leaving pure propanoyl chloride.' },
  ], ans: 'CH₃CH₂COOH + SOCl₂ → CH₃CH₂COCl + HCl + SO₂. Reflux briefly.' },

  { title: 'Ester via acyl chloride', diff: 'medium', q: 'Explain why the acyl chloride route is preferred over the direct acid route for making methyl propanoate.', steps: [
    { label: 'STEP 1', text: 'Acid route: CH₃CH₂COOH + CH₃OH ⇌ CH₃CH₂COOCH₃ + H₂O. Reversible; conc. H₂SO₄ catalyst; reflux. Modest yield because of equilibrium.' },
    { label: 'STEP 2', text: 'Acyl chloride route: first make CH₃CH₂COCl (from acid + SOCl₂), then react with methanol.' },
    { label: 'STEP 3', text: 'Step 1 of route: CH₃CH₂COOH + SOCl₂ → CH₃CH₂COCl + HCl + SO₂. Step 2: CH₃CH₂COCl + CH₃OH → CH₃CH₂COOCH₃ + HCl.' },
    { label: 'STEP 4', text: 'Advantages: (1) Step 2 is irreversible (HCl evolves as gas), giving very high yield. (2) Step 2 is fast at room temperature, no catalyst. (3) The acid route\'s equilibrium limit is bypassed.' },
  ], ans: 'Acyl chloride route is irreversible, fast, room T, no catalyst. Acid route is reversible, slow, low yield. Acyl chloride is preferred for high-yield synthesis.' },

  { title: 'Ester hydrolysis: acid vs base', diff: 'medium', q: 'Compare the acid and base hydrolysis of ethyl ethanoate (CH₃COOCH₂CH₃).', steps: [
    { label: 'STEP 1', text: 'Acid hydrolysis: CH₃COOCH₂CH₃ + H₂O ⇌ CH₃COOH + CH₃CH₂OH. Reagents: dilute HCl or H₂SO₄, reflux. The reaction is REVERSIBLE — partial conversion (since this is the reverse of esterification).' },
    { label: 'STEP 2', text: 'Base hydrolysis: CH₃COOCH₂CH₃ + NaOH → CH₃COO⁻Na⁺ + CH₃CH₂OH. Reagents: NaOH(aq), reflux. The reaction is IRREVERSIBLE — goes to completion.' },
    { label: 'STEP 3', text: 'Why is base hydrolysis irreversible? Because the product is the carboxylate ion (CH₃COO⁻), not the carboxylic acid. The carboxylate is stable and unreactive towards alcohol — there is no driving force back. Base "consumes" the acid product, pulling equilibrium fully forward.' },
    { label: 'STEP 4', text: 'Practical: to maximise yield, use base hydrolysis. To get the free carboxylic acid back, acidify the mixture with HCl after the reaction is complete.' },
  ], ans: 'Acid hydrolysis: reversible, modest yield. Base hydrolysis (saponification): irreversible, complete — preferred for high yield.' },

  { title: 'Saponification', diff: 'medium', q: 'Write the equation for the saponification of glyceryl tristearate (a triglyceride) with NaOH.', steps: [
    { label: 'STEP 1', text: 'Glyceryl tristearate: glycerol esterified with three stearic acid (C₁₇H₃₅COOH, octadecanoic acid) molecules. Structure: CH₂(OOC-C₁₇H₃₅)CH(OOC-C₁₇H₃₅)CH₂(OOC-C₁₇H₃₅).' },
    { label: 'STEP 2', text: 'With NaOH, all three ester linkages are hydrolysed. Each becomes a sodium stearate.' },
    { label: 'STEP 3', text: 'Equation: glyceryl tristearate + 3NaOH → glycerol (CH₂OH-CHOH-CH₂OH) + 3 C₁₇H₃₅COO⁻Na⁺ (sodium stearate, the soap).' },
    { label: 'STEP 4', text: 'The sodium stearate is then "salted out" by adding NaCl, which reduces its solubility and precipitates it as the solid soap. The glycerol stays in the aqueous layer.' },
  ], ans: 'Glyceryl tristearate + 3NaOH → glycerol + 3 sodium stearate. Soap = sodium stearate; glycerol is the by-product.' },

  { title: 'Multi-step synthesis', diff: 'hard', q: 'Outline how to convert ethanol into ethanamide (CH₃CONH₂) in 3 steps.', steps: [
    { label: 'STEP 1', text: 'Step 1: oxidise ethanol to ethanoic acid. CH₃CH₂OH + 2[O] → CH₃COOH + H₂O. Reagents: K₂Cr₂O₇/H₂SO₄, reflux.' },
    { label: 'STEP 2', text: 'Step 2: convert ethanoic acid to ethanoyl chloride. CH₃COOH + SOCl₂ → CH₃COCl + HCl + SO₂. Reagents: SOCl₂, reflux briefly.' },
    { label: 'STEP 3', text: 'Step 3: react ethanoyl chloride with ammonia. CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl. Reagents: NH₃ (excess), room temperature. The 2nd equivalent of NH₃ acts as a base to neutralise HCl.' },
    { label: 'STEP 4', text: 'Why use the acyl chloride route? Direct reaction of ethanoic acid + NH₃ → ammonium ethanoate (just the ammonium salt), not the amide. To get the amide, the C=O must be more electrophilic — hence the conversion to the acyl chloride first.' },
  ], ans: 'Ethanol → ethanoic acid (oxidation) → ethanoyl chloride (SOCl₂) → ethanamide (with NH₃).' },

  { title: 'Identify unknown acid', diff: 'medium', q: 'A liquid X has molecular formula C₃H₆O₂. It dissolves in NaOH(aq) and effervesces with Na₂CO₃ to release CO₂. With ethanol and conc. H₂SO₄, X gives a sweet-smelling product. Identify X.', steps: [
    { label: 'STEP 1', text: 'C₃H₆O₂ has degree of unsaturation = 1. Possible: carboxylic acid, ester, hydroxy aldehyde/ketone.' },
    { label: 'STEP 2', text: 'Dissolves in NaOH and effervesces with Na₂CO₃ → it is a CARBOXYLIC ACID (only acids release CO₂ from carbonate).' },
    { label: 'STEP 3', text: 'With ethanol + H₂SO₄: gives ester (sweet smell). Confirms carboxylic acid.' },
    { label: 'STEP 4', text: 'C₃H₆O₂ + carboxylic acid functionality → propanoic acid (CH₃CH₂COOH).' },
    { label: 'STEP 5', text: 'The ester formed is ethyl propanoate: CH₃CH₂COOCH₂CH₃ (sweet, fruity smell).' },
  ], ans: 'X is propanoic acid, CH₃CH₂COOH.' },
];

export const CARBOXYLIC = {
  id: 'carboxylic',
  objectives: [
    'Name and draw carboxylic acids and their derivatives (acyl chlorides, esters, amides)',
    'Describe the formation of carboxylic acids from alcohols, aldehydes and nitriles',
    'Recall reactions of carboxylic acids: salt formation, esterification, conversion to acyl chlorides, reduction',
    'Explain the relative acidity of carboxylic acids and chlorinated derivatives using the inductive effect',
    'Describe reactions of acyl chlorides with water, alcohols, phenols, primary amines and ammonia',
    'Explain why acyl chlorides hydrolyse much faster than alkyl chlorides or aryl chlorides',
    'Compare the two routes to esters: acid + alcohol (reversible) vs acyl chloride + alcohol (irreversible)',
    'Describe acid and base hydrolysis of esters and the saponification of fats to make soap',
    'State the uses of carboxylic acids and esters',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through the acidity argument for chlorinated acids',
    'Why are acyl chlorides so much more reactive than alkyl chlorides?',
    'Explain saponification step by step',
    'Show me a chain extension synthesis using a nitrile',
    'Compare acid vs base hydrolysis of esters',
  ],
};
