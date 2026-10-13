import { gcd, lcm, fr, fsub, fmul, fdiv, fneg, fzero } from '../utils/helpers.js';

// Recursive parser. Handles () and [] (treated identically).
export function parseFormula(formula) {
  formula = String(formula).replace(/\[/g, '(').replace(/\]/g, ')');
  const pos = { i: 0 };
  return parseGroup(formula, pos);
}

function parseGroup(str, pos) {
  const counts = {};
  while (pos.i < str.length && str[pos.i] !== ')') {
    const ch = str[pos.i];
    if (ch === '(') {
      pos.i++;
      const sub = parseGroup(str, pos);
      if (str[pos.i] === ')') pos.i++;
      let num = '';
      while (pos.i < str.length && /\d/.test(str[pos.i])) { num += str[pos.i]; pos.i++; }
      const mult = num ? parseInt(num) : 1;
      for (const [el, n] of Object.entries(sub)) counts[el] = (counts[el] || 0) + n * mult;
    } else if (/[A-Z]/.test(ch)) {
      let sym = str[pos.i++];
      if (pos.i < str.length && /[a-z]/.test(str[pos.i])) sym += str[pos.i++];
      let num = '';
      while (pos.i < str.length && /\d/.test(str[pos.i])) { num += str[pos.i]; pos.i++; }
      const n = num ? parseInt(num) : 1;
      counts[sym] = (counts[sym] || 0) + n;
    } else {
      pos.i++;
    }
  }
  return counts;
}

/**
 * Balance any chemical equation via Gauss-Jordan null-space on the stoichiometry matrix.
 * Works for any reaction type (combustion, redox, precipitation, complex formation) because
 * mass conservation is universal. Exact rational arithmetic — no coefficient cap.
 */
export function balance(leftStrs, rightStrs) {
  const leftF = leftStrs.map(parseFormula);
  const rightF = rightStrs.map(parseFormula);
  const allEls = new Set();
  [...leftF, ...rightF].forEach(f => Object.keys(f).forEach(e => allEls.add(e)));
  const elements = [...allEls];
  if (elements.length === 0) return null;
  const n = leftStrs.length + rightStrs.length;

  // Build: rows = elements, cols = compounds. +count for reactants, -count for products.
  const A = elements.map(el => {
    const row = [];
    for (let i = 0; i < leftF.length; i++) row.push(fr(leftF[i][el] || 0));
    for (let i = 0; i < rightF.length; i++) row.push(fr(-(rightF[i][el] || 0)));
    return row;
  });
  const rows = A.length, cols = n;

  // Reduced Row Echelon Form
  const pivotCol = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1;
    for (let i = r; i < rows; i++) { if (!fzero(A[i][c])) { piv = i; break; } }
    if (piv === -1) continue;
    if (piv !== r) [A[r], A[piv]] = [A[piv], A[r]];
    const pv = A[r][c];
    for (let j = 0; j < cols; j++) A[r][j] = fdiv(A[r][j], pv);
    for (let i = 0; i < rows; i++) {
      if (i !== r && !fzero(A[i][c])) {
        const factor = A[i][c];
        for (let j = 0; j < cols; j++) A[i][j] = fsub(A[i][j], fmul(A[r][j], factor));
      }
    }
    pivotCol.push(c);
    r++;
  }

  // Expect exactly one free variable (the scaling degree of freedom)
  const pivotSet = new Set(pivotCol);
  const freeCols = [];
  for (let c = 0; c < cols; c++) if (!pivotSet.has(c)) freeCols.push(c);
  if (freeCols.length !== 1) return null;
  const fc = freeCols[0];

  const x = Array.from({ length: cols }, () => fr(0));
  x[fc] = fr(1);
  for (let i = 0; i < pivotCol.length; i++) x[pivotCol[i]] = fneg(A[i][fc]);

  // Clear denominators, normalise sign, reduce by GCD
  let L = 1;
  for (const v of x) L = lcm(L, v[1]);
  let ints = x.map(v => (v[0] * L) / v[1]);
  const firstNZ = ints.find(v => v !== 0);
  if (firstNZ !== undefined && firstNZ < 0) ints = ints.map(v => -v);
  if (ints.some(v => v <= 0)) return null;
  const g = ints.reduce((a, b) => gcd(a, b));
  return ints.map(v => v / g);
}
