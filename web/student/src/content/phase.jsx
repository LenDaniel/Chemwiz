// Phase Equilibria — AC-22 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.4 — Topic 22
// Syllabus coverage:
//   Steam distillation of two immiscible liquids; applications
//   Partition coefficient — same molecular state in two solvents; calculations
//   Solvent extraction
//   Chromatography: paper, TLC, column, ion-exchange, HPLC, GLC — adsorption vs partition
//   Industrial and medical applications of chromatography
//   Electrophoresis; effect of pH; protein hydrolysis + product detection
//   Genetic fingerprinting (overview)

/* ============================================================
   Diagram specs (Phase K3.5 migration)
   Unused legacy JSX removed in K-Cleanup; active specs are unchanged.
   ============================================================ */
const phaseConceptSpec = {
  "title": "WHAT IS A PHASE?",
  "blocks": [
    {
      "type": "cards",
      "cards": [
        {
          "title": "SOLID",
          "color": "primary",
          "body": [
            "NaCl crystal",
            "fixed structure",
            "distinct solid phase"
          ]
        },
        {
          "title": "LIQUID",
          "color": "accent",
          "body": [
            "NaCl(aq)",
            "uniform solution = one phase",
            "immiscible liquids give 2 phases"
          ]
        },
        {
          "title": "GAS",
          "color": "amber",
          "body": [
            "HCl(g)",
            "fills container",
            "compressible"
          ]
        }
      ]
    }
  ],
  "subtitle": "Phase = distinct homogeneous region of matter."
};

const phaseSteamDistillationSpec = {
  "title": "STEAM DISTILLATION",
  "blocks": [
    {
      "type": "panel",
      "title": "Principle",
      "body": [
        "Ptotal = P°water + P°organic",
        "boils when Ptotal = atmospheric pressure",
        "boils below either pure-liquid b.p."
      ],
      "color": "primary"
    },
    {
      "type": "panel",
      "title": "Best for",
      "body": [
        "water-immiscible volatile organics",
        "heat-sensitive compounds",
        "essential oils · phenylamine"
      ],
      "color": "accent"
    },
    {
      "type": "equation",
      "text": "morg / mwater = (P°org × Mrorg) / (P°water × Mrwater)"
    }
  ]
};

const phasePartitionSpec = {
  "title": "PARTITION COEFFICIENT Kpc",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "ORGANIC PHASE",
        "color": "accent",
        "body": [
          "contains dissolved solute X",
          "concentration [X]org"
        ]
      },
      "right": {
        "title": "AQUEOUS PHASE",
        "color": "primary",
        "body": [
          "contains dissolved solute X",
          "concentration [X]aq"
        ]
      }
    },
    {
      "type": "equation",
      "text": "Kpc = [X]org / [X]aq"
    },
    {
      "type": "note",
      "text": "Kpc constant only if X has same state in both phases.",
      "emphasis": true
    }
  ]
};

const phaseExtractionSpec = {
  "title": "SOLVENT EXTRACTION · PROCEDURE",
  "blocks": [
    {
      "type": "steps",
      "items": [
        {
          "body": "Add solution + immiscible solvent to funnel",
          "color": "primary"
        },
        {
          "body": "Shake / vent → reach partition equilibrium",
          "color": "accent"
        },
        {
          "body": "Let layers separate; drain lower layer",
          "color": "amber"
        },
        {
          "body": "Repeat with fresh solvent portions",
          "color": "green"
        }
      ]
    },
    {
      "type": "note",
      "text": "Several small extractions give better recovery.",
      "emphasis": true
    }
  ]
};

const phaseChromOverviewSpec = {
  "title": "CHROMATOGRAPHY · UNIFIED PRINCIPLE",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "ADSORPTION",
        "color": "primary",
        "body": [
          "solute sticks to solid surface",
          "silica TLC",
          "alumina column"
        ]
      },
      "right": {
        "title": "PARTITION",
        "color": "accent",
        "body": [
          "solute partitions into liquid phase",
          "paper chromatography",
          "gas-liquid chromatography"
        ]
      }
    },
    {
      "type": "note",
      "text": "All methods use stationary + mobile phases.",
      "emphasis": true
    },
    {
      "type": "note",
      "text": "More stationary affinity → slower travel.",
      "emphasis": true
    }
  ]
};

const phaseRfSpec = {
  "title": "PAPER & TLC · Rf VALUES",
  "blocks": [
    {
      "type": "panel",
      "title": "Measure from the baseline",
      "body": [
        "distance travelled by spot",
        "solvent-front distance"
      ],
      "color": "accent"
    },
    {
      "type": "equation",
      "text": "Rf = spot distance / solvent-front distance"
    },
    {
      "type": "note",
      "text": "Compare Rf only under identical conditions.",
      "emphasis": true
    }
  ]
};

const phaseColumnHPLCSpec = {
  "title": "COLUMN · ION-EXCHANGE · HPLC",
  "blocks": [
    {
      "type": "cards",
      "cards": [
        {
          "title": "Column",
          "color": "primary",
          "body": [
            "silica / alumina packed tube",
            "solvent flows by gravity",
            "collect fractions as they elute"
          ]
        },
        {
          "title": "Ion-exchange",
          "color": "accent",
          "body": [
            "charged resin sites",
            "separates ions",
            "water softening · ion separation"
          ]
        },
        {
          "title": "HPLC",
          "color": "pink",
          "body": [
            "very fine particles",
            "high-pressure solvent",
            "fast sharp peaks · analytical"
          ]
        }
      ]
    }
  ]
};

const phaseGLCSpec = {
  "title": "GAS-LIQUID CHROMATOGRAPHY (GLC)",
  "blocks": [
    {
      "type": "compare",
      "left": {
        "title": "MOBILE PHASE",
        "color": "primary",
        "body": [
          "inert carrier gas",
          "He or N₂"
        ]
      },
      "right": {
        "title": "STATIONARY PHASE",
        "color": "accent",
        "body": [
          "high-b.p. liquid",
          "coated on solid support"
        ]
      }
    },
    {
      "type": "panel",
      "title": "Operation",
      "body": [
        "sample vaporised and injected",
        "components partition repeatedly",
        "each has characteristic retention time",
        "peak area ∝ amount"
      ],
      "hint": "Uses: alcohol · pesticides · GC-MS"
    }
  ]
};

const phaseElectrophoresisSpec = {
  "title": "ELECTROPHORESIS",
  "blocks": [
    {
      "type": "panel",
      "title": "Setup",
      "body": [
        "buffer-soaked paper or gel",
        "voltage applied across gel",
        "ions move to opposite electrode"
      ],
      "color": "accent"
    },
    {
      "type": "table",
      "headers": [
        "Species",
        "Net charge",
        "Migration"
      ],
      "rows": [
        [
          "cation",
          "+",
          "towards cathode (−)"
        ],
        [
          "zwitterion",
          "0",
          "little / no movement"
        ],
        [
          "anion",
          "−",
          "towards anode (+)"
        ]
      ],
      "colWidths": [
        95,
        75,
        120
      ]
    },
    {
      "type": "note",
      "text": "pH < pI: cation · pH > pI: anion",
      "emphasis": true
    }
  ]
};

const phaseGeneticFingerprintSpec = {
  "title": "GENETIC FINGERPRINTING · OVERVIEW",
  "blocks": [
    {
      "type": "steps",
      "items": [
        {
          "body": "Extract DNA from cells",
          "color": "primary"
        },
        {
          "body": "Cut DNA with restriction enzymes",
          "color": "accent"
        },
        {
          "body": "Amplify small samples by PCR",
          "color": "amber"
        },
        {
          "body": "Separate DNA fragments by gel electrophoresis",
          "color": "green"
        },
        {
          "body": "Visualise and compare band patterns",
          "color": "pink"
        }
      ]
    },
    {
      "type": "note",
      "text": "Uses: forensics · paternity · identification.",
      "emphasis": true
    }
  ]
};

/* ============================================================
   Chapters
   ============================================================ */

const chapters = [
  { id: 'pe1', title: 'Phases & Phase Equilibria — Why This Topic Exists', minutes: 5, blocks: [
    { type: 'p', text: 'Modern chemistry depends on separation. Whenever we make a compound, isolate a natural product, test for a contaminant, or sequence a protein, we have to separate one substance from a mixture. Every separation method exploits the same idea — that different compounds distribute themselves differently between two phases. This topic gives you the principles behind steam distillation, solvent extraction, all the chromatographies, and electrophoresis. Once you see the common framework, you can predict what each technique will do.' },
    { type: 'd', spec: phaseConceptSpec, caption: 'A phase is a uniform region with definite composition and properties' },
    { type: 'h', text: 'What is a phase?' },
    { type: 'ul', items: [
      'A phase is a region of matter that is physically distinct, uniform throughout, and separated from other phases by a boundary.',
      'The familiar three: solid, liquid, gas. Within "liquid" you can have several mutually immiscible phases — oil and water, for example.',
      'A solution of NaCl in water is ONE phase (uniform composition); add some hexane and shake — now you have TWO liquid phases (water-rich and hexane-rich), with the salt almost entirely in the water phase.',
      'A glass of fizzy water has TWO phases: aqueous solution + gaseous CO₂ (the bubbles).',
    ]},
    { type: 'h', text: 'Phase equilibrium' },
    { type: 'ul', items: [
      'When two phases are in contact and a substance can exist in both, the system reaches a dynamic equilibrium: molecules cross the boundary in both directions at equal rates.',
      'At equilibrium the concentration ratio is fixed (at given T) — this is the principle behind partition coefficients.',
      'Disturbing the equilibrium drives net transfer until balance is restored — this is why solvent extraction works (remove the loaded solvent, partition shifts to refill it).',
    ]},
    { type: 'h', text: 'How this topic ties to other syllabus areas' },
    { type: 'ul', items: [
      'OC-19: peptide bonds; protein hydrolysis; ninhydrin staining of amino acids — those amino acids are separated by chromatography or electrophoresis methods we develop here.',
      'PC-07: equilibrium constants. The partition coefficient is a special equilibrium constant for a phase-distribution equilibrium.',
      'AC-23: chromatography is used to detect environmental pollutants; ion-exchange columns are used in industrial water treatment.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Phase', body: 'A physically distinct, homogeneous region of matter, separated from other phases by a recognisable boundary. Phases need not be macroscopic — fog droplets are a separate (liquid) phase suspended in air.' },
    { type: 'takeaway', items: [
      'A phase = uniform region with a definite boundary.',
      'Many separation methods rely on different distributions of compounds between two phases.',
      'Equilibrium between phases is dynamic; disturbing it drives transfer.',
      'This topic is the unifying theory behind distillation, extraction, chromatography, and electrophoresis.',
    ]},
  ]},

  { id: 'pe2', title: 'Steam Distillation', minutes: 7, blocks: [
    { type: 'p', text: 'Many organic compounds — phenylamine, nitrobenzene, plant-derived essential oils — decompose if heated to their normal boiling points. Steam distillation lets us distil them at a temperature below 100 °C by exploiting a quirk of the vapour pressures of two immiscible liquids in contact.' },
    { type: 'd', spec: phaseSteamDistillationSpec, caption: 'Two immiscible liquids share boiling — neither boils alone' },
    { type: 'h', text: 'The principle' },
    { type: 'ul', items: [
      'For a single pure liquid, boiling occurs when its vapour pressure equals the external pressure (1 atm at sea level).',
      'For TWO immiscible liquids in contact (e.g. water + an organic), each exerts its OWN saturated vapour pressure, independent of the other. The total vapour pressure above the mixture is P_total = P°_water + P°_organic.',
      'Boiling occurs when P_total = atmospheric. Because we are summing two contributions, this is reached at a temperature LOWER than the b.p. of either pure component.',
      'Example: phenylamine (b.p. 184 °C, would decompose if heated alone in air) + water — the mixture boils at about 98 °C, well below 100 °C and far below 184 °C.',
    ]},
    { type: 'h', text: 'Composition of the distillate' },
    { type: 'ul', items: [
      'The mole ratio in the vapour is given by the ratio of partial pressures: n_org / n_water = P°_org / P°_water at the boiling temperature.',
      'Converting to mass: m_org / m_water = (P°_org × Mr_org) / (P°_water × Mr_water).',
      'Despite the organic having LOWER P° than water, if its Mr is much larger, the mass ratio of organic in the distillate can be substantial (often 30–60% organic by mass).',
      'Each fraction of distillate has a fixed composition determined by these ratios — no fractionating column needed for this part.',
    ]},
    { type: 'h', text: 'Procedure' },
    { type: 'ul', items: [
      'Steam is passed (or generated in situ) through the impure organic.',
      'The two-phase mixture boils as soon as its sum of vapour pressures = atmospheric.',
      'Vapour goes up through a condenser; the condensate is two layers (water + organic, immiscible).',
      'Separate the layers in a separating funnel; dry the organic over anhydrous Na₂SO₄ (or MgSO₄); decant.',
    ]},
    { type: 'h', text: 'Ideal substrates' },
    { type: 'ul', items: [
      'Volatile (significant P° at 100 °C — say > 5 kPa).',
      'Immiscible with water (negligible mutual solubility).',
      'Thermally unstable above ~100 °C — that is why we want to AVOID the high temperature of conventional distillation.',
      'Examples of compounds purified industrially this way: phenylamine, nitrobenzene, essential oils (lavender, lemon, peppermint), nicotine, naphthalene.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why steam, not just heat?', body: 'For a single pure organic, the only way to lower its boiling point is reduced pressure (vacuum distillation). Steam distillation lowers it by ADDING water rather than reducing pressure — simpler equipment, no vacuum pump. Use vacuum distillation when the organic IS miscible with water; use steam distillation when it is NOT.' },
    { type: 'takeaway', items: [
      'Steam distillation: P_total = P°_water + P°_org → boils below 100 °C.',
      'Used for heat-sensitive, water-immiscible, volatile organics.',
      'Mass ratio in distillate = (P°_org × Mr_org) / (P°_water × Mr_water).',
      'Industrial: essential oils, phenylamine, nitrobenzene purification.',
    ]},
  ]},

  { id: 'pe3', title: 'Partition Coefficient', minutes: 7, blocks: [
    { type: 'p', text: 'When a solute is shaken with two immiscible solvents, it distributes between the two phases until equilibrium. The ratio of its concentrations in the two phases at equilibrium is a constant — the partition coefficient. This is the most important quantitative idea in this topic, and the basis of solvent extraction.' },
    { type: 'd', spec: phasePartitionSpec, caption: 'Partition coefficient = ratio of concentrations at equilibrium' },
    { type: 'h', text: 'Definition' },
    { type: 'ul', items: [
      'For a solute X distributing between two immiscible solvents, e.g. an organic solvent and water, at equilibrium: K_pc = [X]_organic / [X]_aqueous.',
      'K_pc is a function of solute, solvents, and temperature only. Independent of total amount of X (within limits — at very high concentration, the simple law breaks down).',
      'Convention: by tradition K_pc is written with the LESS POLAR solvent on top. For a non-polar organic + water, K_pc = [X]_org / [X]_aq.',
      'A large K_pc (≫ 1) means X greatly prefers the organic phase; small K_pc (≪ 1) means it prefers the aqueous phase.',
    ]},
    { type: 'h', text: 'Conditions for the simple law' },
    { type: 'ul', items: [
      'Solute must be in the SAME molecular state in both solvents. e.g. it does not dissociate to ions in one but stay as molecule in the other.',
      'It must not associate (dimerise) in one phase and not the other.',
      'Concentrations must be reasonably dilute — at high concentrations, deviations occur (analogous to non-ideal gas behaviour).',
      'If the solute IS in different states in the two phases, write K_pc using the MOLECULAR (not total) concentration in each phase.',
    ]},
    { type: 'h', text: 'Worked example — calculating K_pc' },
    { type: 'ul', items: [
      'A mixture of 25 cm³ of organic solvent and 75 cm³ of water is shaken with 5.0 g of solute X. After equilibrium, 1.0 g of X is in the aqueous layer.',
      'Mass in organic = 5.0 − 1.0 = 4.0 g.',
      '[X]_org = 4.0 g / 25 cm³ = 0.16 g cm⁻³. [X]_aq = 1.0 g / 75 cm³ = 0.0133 g cm⁻³.',
      'K_pc = 0.16 / 0.0133 = 12.0. (Units cancel — they were the same on both sides.)',
      'X has a strong preference for the organic phase: it would be efficiently extracted from water with this solvent.',
    ]},
    { type: 'h', text: 'When the simple law fails — examples' },
    { type: 'ul', items: [
      'Carboxylic acids in water + benzene: in water, R-COOH partly dissociates to R-COO⁻ + H⁺ (so total [acid] in water exceeds [molecular acid]). In benzene, no dissociation. Use the MOLECULAR concentration in water (not total) to get the true K_pc.',
      'Ethanoic acid in water + non-polar solvent: in the non-polar solvent, two molecules dimerise via H-bonding, (CH₃COOH)₂. Use the MONOMER concentration in the non-polar phase.',
      'Both of these are exam-classic complications — you can calculate the simple K_pc only after first calculating the concentration of the molecular form.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Partition coefficient K_pc', body: 'The ratio of equilibrium concentrations of a solute in two immiscible solvents at constant temperature, with the solute existing in the same molecular state in both solvents.' },
    { type: 'takeaway', items: [
      'K_pc = [X]_top / [X]_bottom (or [X]_organic / [X]_aqueous).',
      'Constant at given T; depends on solute, solvents, T.',
      'Solute must be in the SAME molecular state in both phases.',
      'Large K_pc = solute prefers organic; small K_pc = prefers water.',
    ]},
  ]},

  { id: 'pe4', title: 'Solvent Extraction', minutes: 7, blocks: [
    { type: 'p', text: 'Solvent extraction uses partition between two immiscible solvents to remove a substance from one phase to another. It is one of the commonest unit operations in any organic chemistry lab — almost every preparation of a non-volatile organic finishes with extraction into a non-polar solvent, then drying, then evaporation.' },
    { type: 'd', spec: phaseExtractionSpec, caption: 'Procedure: shake, separate, repeat with fresh solvent' },
    { type: 'h', text: 'Procedure (separating funnel)' },
    { type: 'ul', items: [
      'Pour the aqueous mixture into a separating funnel.',
      'Add a portion of the chosen extracting solvent (typically diethyl ether, ethyl acetate, or DCM).',
      'Stopper, invert, shake (vent regularly to release pressure from CO₂ or vapour).',
      'Stand vertically; allow the two layers to separate.',
      'Drain the lower layer into one beaker, the upper into another.',
      'Re-extract the AQUEOUS layer with FRESH solvent. Repeat 2-3 times for efficiency.',
      'Combine the organic extracts; dry over anhydrous Na₂SO₄; filter; evaporate.',
    ]},
    { type: 'h', text: 'Why multiple small extractions beat one big one' },
    { type: 'ul', items: [
      'For a fixed volume V_org of organic solvent and V_aq of water, with K_pc = [X]_org / [X]_aq, the FRACTION of X remaining in the aqueous after one extraction is V_aq / (V_aq + K_pc × V_org).',
      'Each extraction multiplies the remaining fraction by this same factor. So n extractions leave [V_aq / (V_aq + K_pc × V_org)]ⁿ of the original X.',
      'Splitting the same total volume into n smaller portions reduces the remaining fraction more aggressively because the (n-th) power amplifies the effect.',
      'Example calculation: V_aq = 100 cm³, K_pc = 4. Total organic = 100 cm³. (1) one extraction with 100 cm³: remaining = 100/(100 + 4×100) = 20%. (2) Two extractions of 50 cm³ each: remaining = (100/(100+200))² = (1/3)² = 11.1%. (3) Four extractions of 25 cm³ each: remaining = (100/(100+100))⁴ = (1/2)⁴ = 6.25%.',
      'Diminishing returns: doubling the number of extractions does not double the recovery. After about 4–5 extractions the remaining is small enough that further effort is wasted.',
    ]},
    { type: 'h', text: 'Choosing the extracting solvent' },
    { type: 'ul', items: [
      'Must be IMMISCIBLE with water. Common choices: diethyl ether, DCM (dichloromethane), ethyl acetate, hexane, chloroform.',
      'Must dissolve the target SOLUTE well (large K_pc favours extraction).',
      'Should NOT dissolve impurities (or should leave them in water).',
      'Should be VOLATILE for easy evaporation at the end.',
      'Should be SAFE — diethyl ether is highly flammable; chloroform is suspected carcinogen; modern preference is ethyl acetate for most extractions.',
    ]},
    { type: 'h', text: 'Industrial applications' },
    { type: 'ul', items: [
      'Extraction of caffeine from coffee beans (using supercritical CO₂ — modern decaffeination).',
      'Extraction of essential oils from plant material (lavender, peppermint, citrus oils).',
      'Recovery of antibiotics from fermentation broth.',
      'Purification of organic acids — exploit pH-dependent solubility (acid form in non-polar; carboxylate form in water).',
      'Hydrometallurgy: extracting copper, uranium, rare earths from leach liquors using selective organic complexants.',
    ]},
    { type: 'callout', kind: 'key', title: 'Always do multiple small extractions', body: 'For a given volume of extractant, splitting it into more, smaller portions ALWAYS removes more solute than a single large portion. The maths above proves it. Standard lab practice: "extract with 3 × 10 cm³" rather than "extract with 1 × 30 cm³".' },
    { type: 'takeaway', items: [
      'Solvent extraction transfers solute from water to organic via partition.',
      'Procedure: shake, separate, repeat with fresh solvent.',
      'Multiple small extractions > one big extraction (exponential decay).',
      'Choose solvent: immiscible, dissolves target, easy to evaporate, safe.',
    ]},
  ]},

  { id: 'pe5', title: 'Chromatography — Unified Principle', minutes: 6, blocks: [
    { type: 'p', text: 'Chromatography is partition or adsorption equilibrium done many thousands of times in series. Every variant — paper, TLC, column, ion-exchange, HPLC, GLC — uses the same idea: two phases (one mobile, one stationary), and components of a mixture distribute between them differently as the mobile phase moves past the stationary phase. Components with stronger affinity for the stationary phase travel slowly; those with stronger affinity for the mobile phase travel quickly. Result: the mixture spreads out into bands or peaks.' },
    { type: 'd', spec: phaseChromOverviewSpec, caption: 'All chromatographies share the same logic' },
    { type: 'h', text: 'Two phases — defining the technique' },
    { type: 'ul', items: [
      'The MOBILE phase carries the components through. It can be a liquid (paper, TLC, column, HPLC, ion-exchange) or a gas (GLC).',
      'The STATIONARY phase stays put. It can be a solid (paper cellulose, silica, alumina, ion-exchange resin) or a liquid coated on a solid support (in GLC, the stationary phase is liquid; in paper chromatography, water adsorbed onto cellulose acts as a liquid stationary phase).',
      'The technique\'s name usually identifies the mobile phase: liquid chromatography, gas chromatography, ion chromatography.',
    ]},
    { type: 'h', text: 'Two mechanisms — adsorption vs partition' },
    { type: 'ul', items: [
      'Adsorption chromatography: solute STICKS to the surface of a solid stationary phase (e.g. silica, alumina) by intermolecular forces (H-bonding, dipole, dispersion). Strongly-adsorbing components move slowly. Examples: silica TLC, alumina column.',
      'Partition chromatography: solute DISSOLVES in a liquid stationary phase (often a thin film of water on cellulose, or an organic liquid coating on a solid support). The solute partitions between the mobile and stationary liquid phases — basic K_pc behaviour. Examples: paper chromatography, GLC.',
      'In practice the line is blurred: in TLC on silica, both adsorption AND partition (in adsorbed water) contribute. The exam mostly asks you to identify which mechanism dominates for a given technique.',
    ]},
    { type: 'h', text: 'Retention factor and retention time' },
    { type: 'ul', items: [
      'For paper or TLC: Rf = (distance to spot) / (distance to solvent front). 0 ≤ Rf ≤ 1. Rf is characteristic of compound, mobile phase, and stationary phase.',
      'For column-based methods: retention time t_R = time from injection to peak emergence at detector. Identifies the compound (compared with a known standard) under fixed conditions.',
      'In all cases: separation is achieved if components have DIFFERENT Rf (or t_R). If two components have the same Rf, they cannot be separated by that method — change the solvent or the stationary phase.',
    ]},
    { type: 'h', text: 'Common to every variant' },
    { type: 'ul', items: [
      'Apply the sample to the stationary phase as a small spot or injection.',
      'Allow the mobile phase to flow past for a defined distance or time.',
      'Detect the resolved components — visually (coloured), with a stain, or with an instrument detector.',
      'Identify by comparing Rf or t_R with known standards.',
      'Quantify by measuring spot size or peak area — proportional to amount, with calibration.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Chromatography', body: 'A separation method based on the differential distribution of components between a mobile and a stationary phase. The single principle that links paper, TLC, column, GLC, HPLC, and ion exchange.' },
    { type: 'takeaway', items: [
      'All chromatographies: mobile phase + stationary phase + differential distribution.',
      'Adsorption (sticking to solid surface) vs partition (dissolving in liquid layer).',
      'Rf or t_R is characteristic — identifies compounds.',
      'Variants distinguished by what the phases are — gas/liquid/solid combinations.',
    ]},
  ]},

  { id: 'pe6', title: 'Paper & Thin-Layer Chromatography', minutes: 7, blocks: [
    { type: 'p', text: 'Paper chromatography and TLC are the two simplest and most-used variants — found in every school and in the early stages of any analytical workflow. They differ mainly in the stationary phase. Both give Rf values that are diagnostic for a compound under specified conditions.' },
    { type: 'd', spec: phaseRfSpec, caption: 'Spot, run, measure — Rf is the result' },
    { type: 'h', text: 'Paper chromatography' },
    { type: 'ul', items: [
      'Stationary phase: water adsorbed on cellulose fibres in paper — effectively a liquid-on-solid stationary phase. Mechanism: PARTITION between the water and the moving solvent.',
      'Mobile phase: a chosen solvent that moves up the paper by capillarity.',
      'Procedure: spot the sample on a baseline drawn in pencil; dip the paper just below the baseline into solvent; let the solvent rise; remove and mark the solvent front; let dry; locate spots.',
      'Locating agents: visible spots are easy. Invisible compounds need a stain — ninhydrin (purple) for amino acids, iodine vapour (brown) for many organics, UV light for aromatics.',
      'Calculating Rf: Rf = distance from baseline to spot centre / distance from baseline to solvent front.',
      'Limitations: paper has limited capacity; Rf reproducibility ~5%; not used for large or non-polar compounds.',
    ]},
    { type: 'h', text: 'Thin-layer chromatography (TLC)' },
    { type: 'ul', items: [
      'Stationary phase: a thin layer of silica gel or alumina spread on a glass, plastic, or aluminium sheet. Mechanism: mainly ADSORPTION (with some partition contribution from any adsorbed water).',
      'Mobile phase: chosen organic solvent, moves up by capillarity (same as paper).',
      'Procedure: identical to paper, but on a TLC plate.',
      'Speed: faster than paper (silica is more porous), better resolution.',
      'Visualisation: UV lamp is the most common (silica plates contain a fluorescent indicator that glows green; spots show up dark). Other staining methods: ninhydrin, iodine, KMnO₄ dip.',
      'Routine uses: monitoring reaction progress (run a TLC of starting material vs reaction mixture every 30 min); checking purity; comparing unknowns with reference standards.',
    ]},
    { type: 'h', text: 'Choosing a solvent' },
    { type: 'ul', items: [
      'Polar stationary phase (silica, paper): need polar mobile phase to move polar compounds; non-polar mobile phase to move non-polar compounds.',
      'Common TLC solvents: hexane (non-polar), ethyl acetate (medium), ethanol or methanol (polar), water-containing systems for amino acids.',
      'Solvent strength affects all spots. If everything moves to the front, solvent is too strong — use a weaker solvent. If nothing moves from the baseline, solvent is too weak.',
      'Mixed solvents: e.g. 50:50 hexane/ethyl acetate — adjust ratio to "tune" Rf into the 0.2–0.7 range, where separation is best.',
    ]},
    { type: 'h', text: 'Two-dimensional (2D) chromatography' },
    { type: 'ul', items: [
      'For complex mixtures (e.g. all 20 amino acids in a protein hydrolysate), one solvent often cannot resolve everything.',
      'Solution: run the chromatogram in one direction with solvent A; rotate the plate 90°; run it again with solvent B.',
      'Compounds that had the same Rf in solvent A may now separate, because they have different Rf in solvent B.',
      'Result: a 2D pattern of spots, much more discriminating than 1D.',
    ]},
    { type: 'callout', kind: 'key', title: 'Rf is conditional', body: 'An Rf value is meaningful only with the same solvent system, the same stationary phase, and the same temperature. Always run a known standard ALONGSIDE the unknown — comparing Rf values side-by-side is reliable; comparing across runs or across labs is not.' },
    { type: 'takeaway', items: [
      'Paper chromatography: partition; cellulose stationary; cheap and simple.',
      'TLC: adsorption (mainly); silica/alumina stationary; faster, better resolution.',
      'Rf = spot distance / solvent-front distance (between 0 and 1).',
      '2D chromatography for complex mixtures (e.g. amino acids).',
    ]},
  ]},

  { id: 'pe7', title: 'Column, Ion-Exchange & HPLC', minutes: 7, blocks: [
    { type: 'p', text: 'Move from a thin layer to a long packed tube and you have column chromatography — the same principles applied at a larger scale, with the option of collecting fractions for further use. Ion-exchange and HPLC are specialised variants that have transformed analytical chemistry.' },
    { type: 'd', spec: phaseColumnHPLCSpec, caption: 'Three column-based variants for different jobs' },
    { type: 'h', text: 'Column chromatography' },
    { type: 'ul', items: [
      'Vertical glass tube packed with adsorbent (silica or alumina).',
      'Sample loaded at the top in a small volume of solvent.',
      'Solvent flows down by gravity (or pumped pressure).',
      'Different components elute at different times — collect fractions, monitor by TLC.',
      'Use: PREPARATIVE — separate gram quantities for further use. Standard final purification step in synthetic organic labs.',
    ]},
    { type: 'h', text: 'Ion-exchange chromatography' },
    { type: 'ul', items: [
      'Stationary phase: a polymer resin bead carrying many charged sites. Cation-exchange resin: anionic groups (–SO₃⁻ or –COO⁻) bonded to the resin, with H⁺ counterions; binds cations (Ca²⁺, Na⁺, etc.). Anion-exchange resin: cationic groups (–NR₃⁺) with OH⁻ or Cl⁻ counterions; binds anions.',
      'Solute ions exchange with the resin counterions: 2 R-SO₃⁻H⁺ + Ca²⁺(aq) ⇌ (R-SO₃⁻)₂Ca²⁺ + 2 H⁺(aq).',
      'Solutes with different charges or different binding affinities elute at different times when the column is washed (e.g. with increasing salt or pH).',
      'Industrial use: WATER SOFTENING (Ca²⁺ swapped for Na⁺ on a cation resin); DEMINERALISATION (cation resin in H⁺ form + anion resin in OH⁻ form removes all ions; outflow is pure water — used for boiler feed water and battery electrolytes).',
      'Analytical use: separating amino acids (charged at any pH except their pI), separating nucleotides, ions chromatography for environmental samples.',
    ]},
    { type: 'h', text: 'High-Performance Liquid Chromatography (HPLC)' },
    { type: 'ul', items: [
      'Like column chromatography, but with much finer particles (typically 5 µm) and high pressure to push solvent through.',
      'Steel column 5–25 cm long, packed under pressure.',
      'Mobile phase: pumped at hundreds of bars by a high-pressure pump.',
      'Detector at the column outlet (UV-Vis, fluorescence, refractive index, mass spec).',
      'Output: a chromatogram = plot of detector signal vs time. Each compound emerges as a peak at its retention time t_R.',
      'Sensitivity: sub-µg detection limits.',
      'Speed: a typical HPLC run takes 5–30 minutes (vs hours for gravity-flow column).',
      'Modes: REVERSED-PHASE (non-polar stationary, polar mobile — most common, for organic analytes) vs NORMAL-PHASE (polar stationary, non-polar mobile — for very non-polar analytes).',
    ]},
    { type: 'h', text: 'Industrial and medical applications' },
    { type: 'ul', items: [
      'Pharmaceutical: assaying drug purity and concentration; quality control of every batch.',
      'Forensic: identifying drugs in body fluids; doping tests in athletic competition.',
      'Environmental: pesticide residues in water and food; herbicide concentrations in soil leachates.',
      'Food safety: vitamin content, residual antibiotics in milk, heavy metals via ion chromatography.',
      'Clinical: blood tests for hormones, drug therapy monitoring, neonatal screening.',
    ]},
    { type: 'h', text: 'Comparison with TLC' },
    { type: 'ul', items: [
      'TLC is fast, cheap, and good for QUALITATIVE analysis (is the compound present? is the reaction done?).',
      'HPLC is more expensive and slower per run, but provides QUANTITATIVE analysis with sub-percent precision and excellent reproducibility.',
      'Workflow: monitor reaction progress with TLC; quantify final purity with HPLC.',
    ]},
    { type: 'callout', kind: 'key', title: 'Ion-exchange in everyday water', body: 'Hard water (high in Ca²⁺ and Mg²⁺) is softened by passing through a column of cation-exchange resin in the Na⁺ form. The Ca²⁺/Mg²⁺ binds and Na⁺ is released. Eventually the resin is exhausted and is regenerated by flushing with concentrated brine (Na⁺ excess pushes the equilibrium back).' },
    { type: 'takeaway', items: [
      'Column chromatography: gravity-flow, preparative, gram scale.',
      'Ion-exchange: charged resin swaps ions; water softening, demineralisation.',
      'HPLC: high pressure + fine particles → fast, sensitive, quantitative.',
      'Used everywhere in pharmaceutical, forensic, environmental, clinical labs.',
    ]},
  ]},

  { id: 'pe8', title: 'Gas-Liquid Chromatography (GLC)', minutes: 6, blocks: [
    { type: 'p', text: 'GLC takes the chromatography idea and uses a GAS as the mobile phase. The stationary phase is a high-boiling liquid coated on a solid support (or directly on the column wall). Volatile organic samples are vaporised, swept through the column by the carrier gas, and emerge at characteristic retention times. Coupled with a mass spectrometer (GC-MS), GLC is the gold standard for analysis of volatile mixtures.' },
    { type: 'd', spec: phaseGLCSpec, caption: 'Gas mobile + liquid stationary = partition for volatile compounds' },
    { type: 'h', text: 'How it works' },
    { type: 'ul', items: [
      'Carrier gas: an inert gas (helium, nitrogen, hydrogen) flows continuously through the column.',
      'Stationary phase: a liquid with high b.p. (e.g. silicone oil, polyethylene glycol) coated on a solid support inside the column. In modern capillary columns, the liquid is bonded directly to the inside wall of a fused silica tube.',
      'Sample: small volume (typically µL) injected through a heated septum into the carrier gas stream. Sample vaporises immediately.',
      'Separation: each compound partitions between gas (mobile) and liquid (stationary). High-affinity compounds spend more time dissolved in the liquid → they travel slowly. Low-affinity compounds stay mostly in the gas → they travel fast.',
      'Detection: at the outlet, a detector responds to compounds emerging. Common detectors: flame ionisation (FID — universal for organics), thermal conductivity, mass spectrometer (GC-MS — also identifies).',
      'Output: a chromatogram of detector signal vs time, with peaks for each component.',
    ]},
    { type: 'h', text: 'Quantitation: peak area' },
    { type: 'ul', items: [
      'The AREA under each peak is proportional to the AMOUNT of that compound (with calibration).',
      'If you inject a known amount of standard, you can calibrate the response factor and quantify unknowns by ratio.',
      'For pure standards of two different compounds, the relative areas tell you the molar ratio in a mixture.',
      'Modern instruments calculate areas automatically; old GCs used a chart recorder and you literally cut out and weighed the peaks!',
    ]},
    { type: 'h', text: 'When to use GLC' },
    { type: 'ul', items: [
      'Sample is VOLATILE and stable to vaporisation (typically b.p. < 250 °C).',
      'Components are organic (most common) but inorganic gases also work.',
      'For NON-volatile or thermally labile samples, use HPLC instead.',
      'Common applications: forensic analysis (drugs, alcohol), pesticide residues, perfume composition, breath alcohol, exhaust gas analysis, petroleum analysis (hydrocarbon profiling), flavour chemistry.',
    ]},
    { type: 'h', text: 'GC-MS — the powerhouse' },
    { type: 'ul', items: [
      'Modern instruments connect a GC column directly to a mass spectrometer. Each compound emerges from the GC, enters the MS, and is fragmented and analysed.',
      'Result: every peak in the GC trace has a full mass spectrum attached, identifying it from libraries of known spectra.',
      'GC-MS is used in: drug testing (Olympics anti-doping), environmental forensics (oil spill source identification), arson investigation (residual accelerants in burnt debris), space exploration (Mars rover instruments).',
      'Sensitivity: detects parts-per-billion (ng/g) routinely.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Retention time t_R', body: 'The time taken for a compound to travel from the injection port to the detector under specified GC conditions. Characteristic of the compound; used for identification.' },
    { type: 'takeaway', items: [
      'GLC: gas mobile, liquid stationary; partition mechanism.',
      'Sample must be volatile and stable.',
      'Peaks at characteristic retention times t_R; area ∝ amount.',
      'GC-MS combines separation + identification — the analytical workhorse.',
    ]},
  ]},

  { id: 'pe9', title: 'Electrophoresis', minutes: 7, blocks: [
    { type: 'p', text: 'Electrophoresis is separation by movement in an electric field. Charged species drift towards the electrode of opposite charge; the rate depends on the size of the charge, the friction (which depends on size and shape), and the strength of the field. With a buffer that fixes the pH, you can separate amino acids, proteins, or DNA fragments — the same gel format used for genetic fingerprinting.' },
    { type: 'd', spec: phaseElectrophoresisSpec, caption: 'Charged species migrate towards the opposite electrode' },
    { type: 'h', text: 'Setup' },
    { type: 'ul', items: [
      'Support medium: a strip of paper or (more often now) a slab of agarose or polyacrylamide gel. The medium is soaked in buffer.',
      'Buffer: holds the pH constant. Typical: pH 8.5 (for proteins), pH 7.4 (for amino acids when needed), pH 8.0 (for DNA). The choice of pH determines what charges the species carry.',
      'Electrodes: at each end of the medium, with a potential difference (typically 100–300 V).',
      'Sample: applied as a spot or thin band at one end of the medium.',
      'Run: charged species migrate towards the opposite electrode; uncharged species do not move.',
      'Stop, dry, stain: detect the bands or spots.',
    ]},
    { type: 'h', text: 'pH controls migration — amino acid example' },
    { type: 'ul', items: [
      'Recall from OC-19 chapter 9: an amino acid has different charges at different pH.',
      'pH < pI: cation (H₃N⁺-CHR-COOH); migrates to the CATHODE (negative electrode).',
      'pH = pI: zwitterion, net charge 0; does NOT migrate.',
      'pH > pI: anion (H₂N-CHR-COO⁻); migrates to the ANODE (positive electrode).',
      'Different amino acids have different pI values. Choose buffer pH to maximise the difference in their net charges, hence their migration distances.',
    ]},
    { type: 'h', text: 'Worked separation of amino acids' },
    { type: 'ul', items: [
      'Mixture: aspartate (acidic, pI ≈ 3), alanine (neutral, pI ≈ 6), lysine (basic, pI ≈ 10). Buffer at pH 6.',
      'Aspartate at pH 6: pH > pI 3, so net charge is NEGATIVE → migrates to + (anode).',
      'Alanine at pH 6: pH ≈ pI, net charge 0 → does not migrate.',
      'Lysine at pH 6: pH < pI 10, so net charge is POSITIVE → migrates to − (cathode).',
      'After running: three distinct bands, separated cleanly. Stain with ninhydrin to visualise.',
    ]},
    { type: 'h', text: 'Detection of separated amino acids and proteins' },
    { type: 'ul', items: [
      'For amino acids and small peptides: NINHYDRIN spray and warming → purple/violet spots (proline gives yellow, an exception).',
      'For proteins: COOMASSIE BLUE stain (binds to peptide bonds, gives blue bands) or SILVER STAIN (more sensitive, gives black bands).',
      'For DNA: ethidium bromide soaks into DNA and fluoresces under UV light; modern alternative is SYBR Green (less toxic).',
    ]},
    { type: 'h', text: 'Protein hydrolysis followed by electrophoresis (link to OC-19)' },
    { type: 'ul', items: [
      'Hydrolyse the protein with 6 M HCl, reflux 24 h → mixture of free amino acids.',
      'Neutralise; spot onto electrophoresis paper or 2D chromatography paper.',
      'Apply electric field at chosen pH → amino acids separate by net charge.',
      'Stain with ninhydrin → identify which amino acids are present in the protein, and (with a quantitative scanner) in what proportions.',
      'This was the standard amino acid analysis method from the 1950s to the 1990s. Modern methods use HPLC or mass spec.',
    ]},
    { type: 'callout', kind: 'key', title: 'Choosing the buffer pH', body: 'For maximum separation of two species, choose a buffer pH that puts as much difference between their net charges as possible. A pH halfway between two pI values often works well.' },
    { type: 'takeaway', items: [
      'Electrophoresis: charged species migrate in an electric field.',
      'Direction set by sign of charge; speed set by charge magnitude and friction.',
      'pH (set by buffer) controls the charge on each species.',
      'Used for amino acids, proteins, and DNA — same principle, scale-up.',
    ]},
  ]},

  { id: 'pe10', title: 'Genetic Fingerprinting', minutes: 6, blocks: [
    { type: 'p', text: 'Every person\'s DNA carries unique sequence patterns. Genetic fingerprinting (also called DNA profiling) uses gel electrophoresis to display these patterns as bands of DNA fragments, generating a "fingerprint" pattern that is essentially unique. The chemistry is electrophoresis applied to DNA fragments produced by restriction enzymes.' },
    { type: 'd', spec: phaseGeneticFingerprintSpec, caption: 'Five-step workflow from sample to band pattern' },
    { type: 'h', text: 'The five-step workflow' },
    { type: 'ul', items: [
      'Step 1: Collect a DNA-containing sample. Blood, saliva, hair root, semen, skin cells from a crime scene; cheek swab from a suspect; embryo cells in paternity testing.',
      'Step 2: Extract DNA. Lyse the cells; remove proteins and lipids; precipitate the DNA with ethanol; redissolve in buffer.',
      'Step 3: Cut DNA into fragments using RESTRICTION ENZYMES. These bacterial enzymes recognise specific 4–8 base pair sequences and cut at those sites. Different individuals carry different lengths of repeated DNA between cut sites — these length differences are the fingerprint.',
      'Step 4: AMPLIFY using PCR (polymerase chain reaction) if the sample is small. PCR doubles the DNA in each cycle; 30 cycles → 10⁹-fold amplification. Now we have enough DNA to see.',
      'Step 5: Run on agarose gel ELECTROPHORESIS. DNA is uniformly negatively charged (phosphate backbone); ALL fragments migrate towards the anode. SMALLER fragments move faster (less friction in gel pores); LARGER fragments move slower. Stain with ethidium bromide; view under UV → bands of DNA at different positions.',
    ]},
    { type: 'h', text: 'Why is the pattern unique?' },
    { type: 'ul', items: [
      'The human genome contains regions with VARIABLE NUMBERS OF TANDEM REPEATS (VNTRs) and SHORT TANDEM REPEATS (STRs) — short sequences (e.g. 4 base pairs) repeated different numbers of times in different individuals.',
      'Each person inherits one set of repeats from each parent.',
      'Combining the VNTR/STR lengths at 13–20 different locations gives a pattern with combined probability of ~ 1 in 10⁹ to 10¹³ of appearing in another (unrelated) individual.',
      'Identical twins SHARE the pattern — they have the same DNA. Everyone else differs.',
    ]},
    { type: 'h', text: 'Applications' },
    { type: 'ul', items: [
      'Forensic science: identify criminals from blood/saliva/semen/hair at crime scenes; exonerate the wrongly convicted.',
      'Paternity testing: a child shares half of their DNA with each biological parent; bands in the child\'s pattern can be matched to either parent.',
      'Identifying remains: bodies in mass graves, after natural disasters, or victims of war.',
      'Pedigree of plants and animals: tracking lineages in conservation, agriculture, racehorse breeding.',
      'Conservation: identifying poached animal products; tracking endangered species.',
      'Personal genomics: ancestry tests, predisposition to inherited diseases.',
    ]},
    { type: 'h', text: 'Limitations and ethical issues' },
    { type: 'ul', items: [
      'Contamination: a single skin flake from someone else can spoil a sample. Strict lab procedures prevent this.',
      'Degraded samples (old, weathered) may not amplify cleanly — partial profiles only.',
      'Statistical interpretation: a "1 in 10⁹ match" still has a small probability of occurring by chance, especially in small populations or related individuals.',
      'Privacy: large national DNA databases (kept by police forces) raise concerns about who has access and for what purposes.',
      'Discrimination: fear that insurers or employers might use genetic data — addressed in some countries by genetic anti-discrimination legislation.',
    ]},
    { type: 'callout', kind: 'definition', title: 'Genetic fingerprinting', body: 'A DNA-profiling technique that uses restriction enzymes and gel electrophoresis to produce a band pattern characteristic of an individual. Same chemistry as protein electrophoresis; different macromolecule.' },
    { type: 'takeaway', items: [
      'DNA fragments from one individual give a unique band pattern on electrophoresis.',
      'Steps: extract → cut with restriction enzymes → amplify (PCR) → electrophorese → stain.',
      'DNA is uniformly negatively charged; smaller fragments travel faster.',
      'Forensics, paternity, identification of remains — high discriminating power.',
    ]},
  ]},
];

/* ============================================================
   Quiz — 28 MCQs
   ============================================================ */
const quizzes = [
  { q: 'A "phase" is best defined as:', opts: ['A stage in a chemical reaction', 'A uniform region with definite composition, separated by a boundary', 'A liquid component', 'An ionic species'], ans: 1, hint: 'Look for "uniform" and "boundary".' },
  { q: 'Steam distillation works because:', opts: ['Water boils at 100 °C', 'Sum of vapour pressures = atmospheric → boils below b.p. of either', 'Steam reacts with the organic', 'Vacuum is applied'], ans: 1, hint: 'P_total = P°_water + P°_organic = 1 atm at boiling.' },
  { q: 'Steam distillation is most useful for:', opts: ['Water-soluble compounds', 'Heat-sensitive, immiscible, fairly volatile organics', 'Metallic compounds', 'Salts'], ans: 1, hint: 'Avoid decomposition; rely on partial pressure.' },
  { q: 'Phenylamine is purified by steam distillation because:', opts: ['It is highly water-soluble', 'It decomposes near its high b.p. of 184 °C', 'It is involatile', 'Steam reacts with it'], ans: 1, hint: 'Steam distillation lets us boil it below 100 °C.' },
  { q: 'The partition coefficient K_pc for solute X between organic and water is:', opts: ['[X]_aq / [X]_org', '[X]_org / [X]_aq', '[X]_org × [X]_aq', '[X]_total / V_total'], ans: 1, hint: 'Convention: less polar solvent on top.' },
  { q: 'K_pc is constant only if:', opts: ['The solute is in the same molecular state in both solvents', 'The solute is solid', 'The temperature is 25 °C', 'The amount is large'], ans: 0, hint: 'Dimerisation/dissociation breaks the simple law.' },
  { q: '50 cm³ of organic solvent is shaken with 50 cm³ of water containing X. K_pc = 4 (organic over water). What fraction of X stays in water?', opts: ['80%', '50%', '20%', '4%'], ans: 2, hint: 'Fraction = V_aq / (V_aq + K_pc × V_org) = 50 / (50 + 200).' },
  { q: 'Why do multiple small extractions remove more solute than one big extraction?', opts: ['Higher temperature', 'Each step removes a fixed fraction of remaining solute → exponential decay', 'Mixing is better', 'No reason — they are equivalent'], ans: 1, hint: 'fⁿ < f for n ≥ 2 when 0 < f < 1.' },
  { q: 'Which solvent is NOT suitable for liquid-liquid extraction from water?', opts: ['Diethyl ether', 'Hexane', 'Ethanol (miscible with water)', 'DCM'], ans: 2, hint: 'Ethanol mixes with water — no two-phase system.' },
  { q: 'In chromatography, the MOBILE phase is:', opts: ['Always a gas', 'Always a liquid', 'A liquid or gas that moves through the stationary phase', 'A solid'], ans: 2, hint: 'Mobile = moves; stationary = stays put.' },
  { q: 'In paper chromatography, the stationary phase is:', opts: ['The paper itself', 'Water adsorbed on cellulose fibres', 'The mobile solvent', 'Air'], ans: 1, hint: 'Mechanism is partition between adsorbed water and the solvent.' },
  { q: 'Rf is calculated as:', opts: ['Time / distance', 'Distance to spot / distance to solvent front', 'Solvent front / spot', 'Mass of solvent / mass of solute'], ans: 1, hint: '0 ≤ Rf ≤ 1.' },
  { q: 'In TLC, the stationary phase is typically:', opts: ['Cellulose', 'Silica gel or alumina', 'Carbon black', 'Water'], ans: 1, hint: 'Polar adsorbent on a glass/aluminium plate.' },
  { q: 'Two compounds give the same Rf in solvent A. Best next step:', opts: ['Increase temperature', 'Try a different solvent', 'Add more sample', 'Use UV light'], ans: 1, hint: 'Rf depends on solvent — different solvent may resolve them.' },
  { q: 'Visualisation of amino acid spots on a chromatogram uses:', opts: ['Bromine water', 'Ninhydrin (purple/violet)', 'Iron(III) chloride', 'AgNO₃'], ans: 1, hint: 'Standard amino acid stain.' },
  { q: 'Ion-exchange resins remove which species from water?', opts: ['Organic molecules', 'Ions (cations or anions)', 'Bacteria', 'Gases'], ans: 1, hint: 'Charged sites on the resin swap with ions in solution.' },
  { q: 'Water softening replaces:', opts: ['Cl⁻ with OH⁻', 'Ca²⁺ and Mg²⁺ with Na⁺', 'Na⁺ with K⁺', 'NO₃⁻ with SO₄²⁻'], ans: 1, hint: 'Hard-water cations exchange with sodium.' },
  { q: 'HPLC vs TLC: HPLC is preferred when:', opts: ['Cost is the main issue', 'Quantitative accuracy and sensitivity are needed', 'Visual qualitative result is enough', 'Sample is involatile'], ans: 1, hint: 'HPLC: pumped, fine particles, sub-µg detection, peaks quantified.' },
  { q: 'In GLC, the mobile phase is:', opts: ['Water', 'An inert carrier gas (He, N₂)', 'A liquid solvent', 'Vacuum'], ans: 1, hint: 'Gas chromatography → gas is mobile.' },
  { q: 'GLC is suitable for:', opts: ['Salts and ionic compounds', 'Volatile, thermally stable organics', 'Polymers', 'Proteins'], ans: 1, hint: 'Sample must vaporise without decomposing.' },
  { q: 'GC-MS combines:', opts: ['Two GC columns', 'Separation by GC + identification by mass spectrometry', 'GC and HPLC', 'GC and electrophoresis'], ans: 1, hint: 'Each peak gets a full mass spectrum identifier.' },
  { q: 'In electrophoresis, charged species migrate towards:', opts: ['The same-charged electrode', 'The oppositely-charged electrode', 'They do not move', 'Random direction'], ans: 1, hint: 'Anion → anode; cation → cathode.' },
  { q: 'An amino acid at pH = pI:', opts: ['Migrates to anode', 'Migrates to cathode', 'Does not migrate (zwitterion)', 'Decomposes'], ans: 2, hint: 'Net charge = 0 at pI.' },
  { q: 'Which amino acid migrates farthest TOWARDS THE CATHODE at pH 6 (in electrophoresis)?', opts: ['Aspartate (pI 3)', 'Alanine (pI 6)', 'Lysine (pI 10)', 'Glycine (pI 6)'], ans: 2, hint: 'Lysine is most positive at pH 6 (pH < pI 10 → cation).' },
  { q: 'For protein hydrolysis followed by amino acid identification, a typical sequence is:', opts: ['NaOH 24 h, then GLC', '6 M HCl reflux 24 h, then chromatography or electrophoresis, then ninhydrin', 'Distil with steam', 'Crystallise from water'], ans: 1, hint: 'Standard amino acid analysis workflow.' },
  { q: 'In genetic fingerprinting, DNA is cut by:', opts: ['UV light', 'Restriction enzymes', 'NaOH', 'Heating to 200 °C'], ans: 1, hint: 'Bacterial enzymes recognise short sequences and cut at them.' },
  { q: 'Why does DNA migrate to the ANODE in electrophoresis at any normal pH?', opts: ['Bases are positive', 'Phosphate backbone carries a uniform negative charge', 'It is neutral', 'Random'], ans: 1, hint: 'DNA is uniformly negatively charged.' },
  { q: 'In a DNA gel, smaller fragments:', opts: ['Stay near the well', 'Migrate slower', 'Migrate faster (less friction in gel pores)', 'Do not move'], ans: 2, hint: 'Smaller fragments squeeze through the gel matrix more easily.' },
];

/* ============================================================
   Structured questions — 5
   ============================================================ */
const structured = [
  { title: 'Steam distillation', marks: 8, q: 'Phenylamine (b.p. 184 °C) decomposes near its boiling point and is purified industrially by steam distillation.', parts: [
    { q: '(a) Explain the principle of steam distillation in terms of vapour pressures.', marks: 3, ans: 'When two immiscible liquids are heated together, each exerts its own saturated vapour pressure independently of the other. The total vapour pressure above the mixture is the sum of the two: P_total = P°_water + P°_organic. Boiling occurs when the total vapour pressure equals atmospheric (101 kPa). Because P_total is the SUM of two contributions, boiling is reached at a temperature LOWER than the boiling point of either pure component. For phenylamine + water the mixture boils at about 98 °C — well below the 184 °C at which pure phenylamine would boil and decompose.' },
    { q: '(b) State TWO properties an organic compound must have to be suitable for steam distillation. Give a reason for each.', marks: 2, ans: 'Property 1: IMMISCIBLE with water. Reason: the analysis depends on each liquid contributing its OWN vapour pressure. Miscible compounds (which dissolve in water) lower water\'s vapour pressure (Raoult\'s law) and the simple steam-distillation analysis no longer applies. Property 2: VOLATILE — the compound must have a non-negligible vapour pressure at ~100 °C (typically P° > 5 kPa). Reason: if the compound has very low P° at 100 °C, the distillate would contain almost only water and recovery of the organic would be impractical.' },
    { q: '(c) At 98 °C, the saturated vapour pressure of water is 95 kPa and that of phenylamine is 6 kPa. Calculate the mass ratio of phenylamine to water in the distillate. (Mr: phenylamine 93, water 18.)', marks: 3, ans: 'In the vapour, the mole ratio = ratio of partial pressures: n_pa / n_water = 6 / 95 = 0.0632. Convert to mass ratio: m_pa / m_water = (n_pa × Mr_pa) / (n_water × Mr_water) = (0.0632 × 93) / (1 × 18) = 5.876 / 18 = 0.326. The distillate is therefore 32.6% phenylamine by mass relative to water, or roughly 1 g of phenylamine per 3 g of water. Despite the small partial pressure of phenylamine, the high Mr means a substantial mass fraction of organic in the distillate.' },
  ]},
  { title: 'Partition and extraction', marks: 9, q: 'A compound X is to be extracted from 100 cm³ of an aqueous solution containing 5.00 g of X using diethyl ether as the extracting solvent. K_pc = [X]_ether / [X]_water = 4.0 at 25 °C.', parts: [
    { q: '(a) Calculate the mass of X extracted into the ether layer if 100 cm³ of ether is used in a SINGLE extraction.', marks: 3, ans: 'Let m be the mass of X remaining in the water layer at equilibrium. Then mass in ether = (5.00 - m). [X]_ether = (5.00 - m) / 100 g cm⁻³. [X]_water = m / 100 g cm⁻³. K_pc = (5.00 - m) / m = 4.0. So 5.00 - m = 4.0 m → 5.00 = 5.0 m → m = 1.00 g. Mass extracted = 5.00 - 1.00 = 4.00 g (80% of original).' },
    { q: '(b) Calculate the mass of X extracted in TOTAL if the same 100 cm³ of ether is used in TWO 50 cm³ portions instead.', marks: 3, ans: 'First extraction with 50 cm³ ether. K_pc = (5.00 - m₁) × 100 / (m₁ × 50) = 2(5.00 - m₁)/m₁ = 4.0 → 5.00 - m₁ = 2 m₁ → m₁ = 5.00/3 = 1.667 g remaining. Mass extracted in step 1 = 5.00 - 1.667 = 3.333 g. Second extraction with another 50 cm³ ether. Now starting with 1.667 g in water. (1.667 - m₂)/m₂ × 2 = 4 → m₂ = 1.667/3 = 0.556 g remaining. Mass extracted in step 2 = 1.667 - 0.556 = 1.111 g. TOTAL extracted = 3.333 + 1.111 = 4.444 g (88.9% of original).' },
    { q: '(c) State and explain the conclusion this comparison illustrates.', marks: 3, ans: 'Conclusion: TWO smaller extractions (4.444 g, 88.9%) recover MORE of the solute than ONE larger extraction (4.00 g, 80%) using the SAME total volume of solvent. Explanation: each extraction is a separate equilibrium, and at each step a fixed FRACTION of the remaining solute moves to the organic phase. Removing the loaded organic between extractions effectively "resets" the equilibrium with fresh solvent, allowing more solute to migrate. Mathematically, the fraction left after n extractions of equal size is [V_aq / (V_aq + K_pc × V_per_step)]ⁿ — multiplying small numbers together gives a smaller result than a single multiplication, especially as n increases. The lesson for laboratory practice: always extract with several smaller portions of solvent rather than one big portion.' },
  ]},
  { title: 'Chromatographic identification', marks: 8, q: 'A protein is hydrolysed and the resulting amino acids are analysed by paper chromatography.', parts: [
    { q: '(a) Describe how the protein is hydrolysed to its constituent amino acids and how the mixture is then prepared for paper chromatography.', marks: 3, ans: 'Hydrolysis: place the protein in 6 M HCl(aq) in a sealed tube, heat in an oven at 110 °C for 24 hours. The harsh acid conditions cleave every peptide bond, giving a mixture of free amino acids (in their protonated cation form because of the low pH). Note: tryptophan is destroyed by acid hydrolysis and must be analysed separately if its content is needed. Preparation for chromatography: cool the hydrolysate; remove HCl by evaporation under reduced pressure; dissolve the residue in a small volume of water or dilute buffer; spot a tiny drop on a sheet of chromatography paper above the baseline drawn in pencil; dry the spot.' },
    { q: '(b) Describe how the chromatogram is run and how the amino acids are visualised.', marks: 3, ans: 'Running the chromatogram: place a suitable solvent (e.g. butanol/ethanoic acid/water 4:1:5 mixture) in the bottom of a closed glass tank. Suspend the paper so that its bottom edge dips into the solvent BUT the baseline (with the spots) is ABOVE the solvent level. The solvent rises by capillarity, carrying the amino acids upward at different rates depending on each amino acid\'s relative affinity for the (water-rich) stationary phase vs the (butanol-rich) mobile phase. When the solvent front nears the top of the paper, remove the paper and immediately mark the front in pencil. Let it dry. Visualisation: spray the dry paper with NINHYDRIN solution and warm it gently in an oven (~100 °C). Most amino acids appear as PURPLE/VIOLET spots. Proline gives a YELLOW spot — the well-known exception, since proline\'s α-N is in a ring and forms a different coloured complex with ninhydrin.' },
    { q: '(c) Explain how Rf values are used to identify the amino acids present and discuss ONE limitation.', marks: 2, ans: 'Identification: measure the distance from the baseline to the centre of each spot, and from the baseline to the solvent front. Calculate Rf = spot distance / solvent-front distance. Compare each Rf with values measured for KNOWN standard amino acids run on the same chromatogram (or at least the same paper, solvent, and temperature). Matching Rf values within experimental tolerance identifies the amino acid. Limitation: Rf depends on solvent, paper, temperature and run time — values vary by ~5–10% between runs. Two different amino acids may also have similar Rf values in one solvent, requiring a 2-D chromatogram (run with one solvent, rotate 90°, run with another) to resolve them. Proline gives a yellow spot, not purple — easy to overlook.' },
  ]},
  { title: 'Electrophoresis of amino acids', marks: 7, q: 'A mixture of three amino acids — aspartic acid (pI 2.77), glycine (pI 5.97) and lysine (pI 9.74) — is to be separated by paper electrophoresis using a buffer at pH 6.', parts: [
    { q: '(a) For each amino acid, predict the predominant ionic form at pH 6 and the direction of migration in the electric field.', marks: 3, ans: 'Aspartic acid (pI 2.77): pH 6 is well above pI, so the molecule is predominantly the ANION (net negative charge) — the side-chain carboxyl is fully deprotonated to –COO⁻ in addition to the α-COO⁻. It migrates towards the ANODE (positive electrode). Glycine (pI 5.97): pH 6 is essentially equal to pI, so glycine is predominantly the ZWITTERION with net charge zero. It does NOT migrate (or migrates negligibly). Lysine (pI 9.74): pH 6 is well below pI, so lysine is predominantly the CATION with net positive charge — both the α-NH₃⁺ and the side-chain –NH₃⁺ are protonated. It migrates towards the CATHODE (negative electrode).' },
    { q: '(b) Sketch and label the appearance of the developed chromatogram, indicating the position of each amino acid relative to the starting line.', marks: 2, ans: 'The starting line is in the middle of the paper. After the run: the band of ASPARTIC ACID is on the side of the positive electrode (anode), some distance from the start. The spot of GLYCINE remains on or very near the starting line (zwitterion, no net charge, no movement). The band of LYSINE is on the side of the negative electrode (cathode), opposite to aspartic acid. Visualisation: spray with ninhydrin → all three give purple/violet spots.' },
    { q: '(c) Explain ONE practical advantage of electrophoresis over chromatography for this separation.', marks: 2, ans: 'Electrophoresis separates by charge (and to a lesser extent by size), so amino acids with the same Rf in chromatography may still be cleanly separated by electrophoresis if they have different pI values. The technique is also faster than running a long chromatogram (typically 30–60 min for electrophoresis vs several hours for ascending paper chromatography). For ions and ionisable compounds, electrophoresis often gives sharper, better-resolved bands than chromatography. Another acceptable answer: 2D combination of the two — first electrophoresis (one direction), then chromatography (perpendicular direction) — gives outstanding resolution of complex amino acid mixtures.' },
  ]},
  { title: 'Genetic fingerprinting', marks: 8, q: 'In a paternity test, DNA is extracted from a child, the mother, and a putative father.', parts: [
    { q: '(a) Outline the major steps in producing a DNA fingerprint from each sample, naming the techniques used at each stage.', marks: 4, ans: 'Step 1: Extract DNA from each sample (typically a cheek swab). Lyse the cells; remove proteins by adding protease and detergent; precipitate the DNA with cold ethanol; redissolve in buffer. Step 2: Cut the DNA into fragments using RESTRICTION ENZYMES (e.g. EcoRI, HindIII). These bacterial enzymes recognise specific 4–8 base-pair sequences and cut the DNA there. Different individuals carry different lengths of repeat sequences (VNTRs/STRs) between cut sites, generating fragments of different lengths. Step 3: AMPLIFY the fragments using PCR (polymerase chain reaction). Cycle through high-temperature denaturation, primer annealing, and extension by Taq polymerase. After 30 cycles the amount of target DNA has increased by 10⁹ — enough to visualise. Step 4: Run on an AGAROSE GEL with electrophoresis. The DNA is uniformly negatively charged and migrates toward the anode. Smaller fragments travel faster through the gel pores; the result is a series of bands at different distances from the well. Step 5: STAIN with a DNA-binding dye (ethidium bromide or SYBR Green) and photograph under UV light. The pattern of bands is the DNA fingerprint.' },
    { q: '(b) Explain how the fingerprints are interpreted to confirm or rule out paternity.', marks: 2, ans: 'The child\'s fingerprint contains bands inherited from BOTH parents — half from the mother and half from the biological father. To check paternity: compare the child\'s bands with the mother\'s. The bands inherited from the mother are present in both. The remaining bands in the child\'s pattern must come from the biological father. Compare these "father bands" with the putative father\'s pattern. If every "father band" in the child is also present in the putative father, paternity is supported (with very high statistical confidence — typically > 99.99%). If even one "father band" is absent from the putative father, he cannot be the biological father (mutations are extremely rare).' },
    { q: '(c) State TWO situations where DNA profiling might give an inconclusive result.', marks: 2, ans: 'Situation 1: DEGRADED or CONTAMINATED sample. Old, weathered, or sun-bleached samples contain partly hydrolysed DNA — fragments may be too short for restriction enzymes to cut as expected, giving a partial or inconsistent profile. Cross-contamination with someone else\'s DNA at the crime scene or in the lab also confuses the result. Situation 2: IDENTICAL TWINS or close relatives. Identical twins have the same DNA profile and cannot be distinguished by standard methods. Close relatives (siblings, parent–child) share half of their DNA and produce profiles with many shared bands; statistical interpretation requires care. Other acceptable answers: very small sample sizes; mutations at one of the test loci (rare); mixed samples (e.g. from multiple contributors at a scene).' },
  ]},
];

/* ============================================================
   Worked examples — 6
   ============================================================ */
const worked = [
  { title: 'Steam distillation composition', diff: 'medium', q: 'A water-immiscible organic compound has Mr = 150 and saturated vapour pressure 12 kPa at the steam distillation boiling temperature, where water has saturated vapour pressure 89 kPa. Calculate the percentage by mass of the organic in the distillate.', steps: [
    { label: 'STEP 1', text: 'In the vapour, mole ratio = vapour pressure ratio: n_org / n_water = P°_org / P°_water = 12 / 89 = 0.1348.' },
    { label: 'STEP 2', text: 'Mass ratio: m_org / m_water = (n_org × Mr_org) / (n_water × Mr_water) = (0.1348 × 150) / (1 × 18) = 20.22 / 18 = 1.123.' },
    { label: 'STEP 3', text: 'For every 1 g of water in the distillate there are 1.123 g of the organic.' },
    { label: 'STEP 4', text: 'Total mass = 1 + 1.123 = 2.123 g. Percentage organic by mass = (1.123 / 2.123) × 100 = 52.9%.' },
  ], ans: 'The distillate is approximately 53% organic by mass. Despite a partial pressure of only 12 kPa, the high Mr means the organic still makes up about half the mass of the distillate.' },

  { title: 'Partition coefficient — calculate K_pc', diff: 'easy', q: 'When 200 cm³ of water containing 4.0 g of solute Y is shaken with 100 cm³ of an organic solvent and allowed to reach equilibrium, the organic layer is found to contain 3.2 g of Y. Calculate K_pc.', steps: [
    { label: 'STEP 1', text: 'Mass of Y in water at equilibrium = 4.0 - 3.2 = 0.8 g.' },
    { label: 'STEP 2', text: '[Y]_water = 0.8 g / 200 cm³ = 0.004 g cm⁻³.' },
    { label: 'STEP 3', text: '[Y]_org = 3.2 g / 100 cm³ = 0.032 g cm⁻³.' },
    { label: 'STEP 4', text: 'K_pc = [Y]_org / [Y]_water = 0.032 / 0.004 = 8.0.' },
  ], ans: 'K_pc = 8.0. Y has a strong preference for the organic solvent (eight times more concentrated there than in water at equilibrium).' },

  { title: 'Optimum extraction strategy', diff: 'medium', q: 'You have 5.0 g of a solute X dissolved in 100 cm³ of water, and 60 cm³ of organic solvent available, with K_pc = 5 (organic over water). Compare the mass extracted (a) in one 60 cm³ extraction, (b) in three 20 cm³ extractions.', steps: [
    { label: 'STEP 1', text: 'Fraction REMAINING in water after one extraction with V_org cm³ of solvent (V_aq = 100 cm³, K_pc = 5): f = V_aq / (V_aq + K_pc × V_org).' },
    { label: 'STEP 2', text: 'Case (a), 1 × 60 cm³: f = 100 / (100 + 5 × 60) = 100 / 400 = 0.25. Mass left in water = 5.0 × 0.25 = 1.25 g. Mass extracted = 5.0 − 1.25 = 3.75 g.' },
    { label: 'STEP 3', text: 'Case (b), 3 × 20 cm³: each step has f = 100 / (100 + 5 × 20) = 100 / 200 = 0.5. After 3 extractions, fraction left = (0.5)³ = 0.125. Mass left in water = 5.0 × 0.125 = 0.625 g. Mass extracted = 5.0 − 0.625 = 4.375 g.' },
    { label: 'STEP 4', text: 'Difference: case (b) extracts 4.375 − 3.75 = 0.625 g MORE than case (a), using the SAME total solvent volume.' },
  ], ans: 'One 60 cm³ extraction recovers 3.75 g (75%); three 20 cm³ extractions recover 4.375 g (87.5%). Multiple smaller extractions are demonstrably more efficient.' },

  { title: 'Identify amino acids by Rf', diff: 'medium', q: 'A 2-D chromatogram of a hydrolysed peptide shows three spots. Reference values (in the chosen solvent system): glycine 0.16, alanine 0.21, serine 0.18, leucine 0.51, lysine 0.06. The unknown spots have Rf values 0.16, 0.21, and 0.51. Identify the amino acid composition of the peptide.', steps: [
    { label: 'STEP 1', text: 'Match each unknown Rf with reference values. Unknown 0.16 matches glycine (0.16). Unknown 0.21 matches alanine (0.21). Unknown 0.51 matches leucine (0.51).' },
    { label: 'STEP 2', text: 'Lysine (Rf 0.06) and serine (Rf 0.18) are absent (Rf 0.18 of serine is close to glycine 0.16 and alanine 0.21, but if the run was clean and a serine standard was included, the absence is unambiguous).' },
    { label: 'STEP 3', text: 'Note that Rf alone does not give the SEQUENCE — only the COMPOSITION. To determine the sequence, partial enzymatic digestion would be needed (see OC-19, chapter 11).' },
  ], ans: 'The peptide contains glycine, alanine, and leucine. The sequence is not determined from Rf alone; further analysis (e.g. partial enzymatic digestion) would be required.' },

  { title: 'Predict electrophoresis migration', diff: 'medium', q: 'A mixture of haemoglobin (pI 6.8), albumin (pI 4.7) and lysozyme (pI 11.4) is electrophoresed in a buffer at pH 8.5. Predict the direction of migration of each protein.', steps: [
    { label: 'STEP 1', text: 'Compare each protein\'s pI with the buffer pH. The protein has net NEGATIVE charge if pH > pI, net POSITIVE charge if pH < pI, and net ZERO charge if pH = pI.' },
    { label: 'STEP 2', text: 'Haemoglobin (pI 6.8): pH 8.5 > pI → net NEGATIVE charge → migrates to ANODE.' },
    { label: 'STEP 3', text: 'Albumin (pI 4.7): pH 8.5 >> pI → strongly NEGATIVE charge → migrates rapidly to ANODE (faster than haemoglobin because charge magnitude is greater).' },
    { label: 'STEP 4', text: 'Lysozyme (pI 11.4): pH 8.5 < pI → net POSITIVE charge → migrates to CATHODE.' },
  ], ans: 'Albumin → fast to anode. Haemoglobin → slowly to anode. Lysozyme → to cathode. The three proteins are well separated at this pH.' },

  { title: 'Choose a chromatographic method', diff: 'easy', q: 'For each scenario, recommend the most suitable chromatographic technique and briefly justify: (a) detect traces of pesticide in 1 mL of orange juice, (b) check whether a chemistry student\'s synthesis of aspirin is pure, (c) separate the cations Cu²⁺, Fe³⁺ and Zn²⁺ from a sample of contaminated water.', steps: [
    { label: 'STEP 1', text: '(a) Pesticide trace in orange juice. The pesticide is volatile organic at trace level. → Use GC-MS. The chromatography (GLC) separates components by their volatility; the mass spectrometer identifies them by their mass spectrum. Sub-µg sensitivity needed.' },
    { label: 'STEP 2', text: '(b) Aspirin purity check. A teaching-lab task at small scale. → Use TLC. Cheap, fast, qualitative result in 10 min. Run the synthesis sample alongside a reference aspirin spot. A single spot at the same Rf as aspirin = pure; multiple spots = contamination by salicylic acid (starting material) or unreacted starting materials.' },
    { label: 'STEP 3', text: '(c) Separating metal cations. Different cations have different binding affinities to ion-exchange resins. → Use ION-EXCHANGE chromatography (or specifically, cation-exchange chromatography with elution by increasing acid or salt concentration). Cu²⁺, Fe³⁺ and Zn²⁺ elute at different times.' },
  ], ans: '(a) GC-MS for trace volatile pesticide. (b) TLC for cheap, fast, qualitative purity check. (c) Ion-exchange chromatography for cation separation. Choose the technique to match the analyte type, scale, and purpose.' },
];

export const PHASE = {
  id: 'phase',
  objectives: [
    'Explain the principle of steam distillation and identify suitable substrates',
    'Define partition coefficient and use it in calculations',
    'Explain why multiple smaller extractions are more efficient than a single large one',
    'Describe the unifying principle of chromatography (mobile + stationary phase)',
    'Distinguish adsorption from partition mechanisms',
    'Use Rf values from paper and TLC to identify compounds',
    'Compare column, ion-exchange, HPLC and GLC chromatography',
    'Explain electrophoresis and the role of buffer pH',
    'Outline the steps in genetic fingerprinting',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through the steam distillation derivation',
    'Why are multiple small extractions better?',
    'Compare adsorption vs partition chromatography',
    'When would I use HPLC instead of TLC?',
    'How does pH control electrophoresis of amino acids?',
    'Outline genetic fingerprinting from sample to band pattern',
  ],
};
