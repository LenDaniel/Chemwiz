// Original synthetic questions: no learner records are sent in the trial.
module.exports = [
  {
    id: 'organic-reactivity',
    topicId: 'hydrocarbons', topicTitle: 'Hydrocarbons',
    question: 'Why does methylbenzene undergo electrophilic substitution more readily than benzene? Explain the methyl group\'s inductive effect, the role of hyperconjugation, and the relative stability of the intermediate. Keep the answer suitable for A-Level learners.',
    rubric: ['Identifies electron donation by the methyl group (+I effect).',
      'Connects greater ring electron density to electrophilic attack.',
      'Explains hyperconjugation and stabilisation of the arenium-ion intermediate; does not treat +I as the whole explanation.'],
  },
  {
    id: 'weak-acid-calculation',
    topicId: 'equilibria', topicTitle: 'Chemical equilibria',
    question: 'At 25 degrees Celsius, calculate the pH of 0.100 mol dm^-3 ethanoic acid with Ka = 1.80 x 10^-5 mol dm^-3. Show the equilibrium expression, state and check the approximation, and give the final pH.',
    rubric: ['Writes Ka = [H+][CH3COO-]/[CH3COOH].',
      'Obtains [H+] about 1.34 x 10^-3 mol dm^-3 by the approximation, or about 1.33 x 10^-3 by the quadratic.',
      'Checks dissociation is about 1.3% and gives pH about 2.87 to 2.88.'],
  },
  {
    id: 'electrochemistry-calculation',
    topicId: 'electrochem', topicTitle: 'Electrochemistry',
    question: 'For a standard zinc-copper galvanic cell, E degrees(Cu2+/Cu) = +0.34 V and E degrees(Zn2+/Zn) = -0.76 V. Identify the anode and cathode, write the overall ionic equation, calculate the cell potential, and calculate standard Gibbs energy change using F = 96485 C mol^-1. Show signs and units.',
    rubric: ['Zinc is oxidised at the anode; copper ions are reduced at the cathode.',
      'Balances Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s), transferring two electrons.',
      'Obtains E degrees(cell) = +1.10 V and delta G degrees about -212 kJ mol^-1.'],
  },
];
