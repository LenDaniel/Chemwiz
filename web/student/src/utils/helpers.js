// Formatting helpers
const SUB_MAP = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const SUP_MAP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺'};
export const toSub = s => String(s).split('').map(c => SUB_MAP[c] || c).join('');
export const toSup = s => String(s).split('').map(c => SUP_MAP[c] || c).join('');

// Math
export function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); return b === 0 ? a : gcd(b, a % b); }
export function lcm(a, b) { return (a && b) ? Math.abs(a * b) / gcd(a, b) : 0; }

// Exact rational arithmetic [num, den] — used by the balancer
export function fr(n, d = 1) {
  if (d === 0) throw new Error('div by zero');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}
export const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
export const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
export const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
export const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
export const fneg = (a) => [-a[0], a[1]];
export const fzero = (a) => a[0] === 0;

// Electron configuration generator (used by PeriodicTable / ElementDetail)
const ORBITAL_ORDER = [['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['4s',2],['3d',10],['4p',6],['5s',2],['4d',10],['5p',6],['6s',2],['4f',14],['5d',10],['6p',6],['7s',2],['5f',14],['6d',10],['7p',6]];
const NOBLE_CORES = [[86,'Rn'],[54,'Xe'],[36,'Kr'],[18,'Ar'],[10,'Ne'],[2,'He']];
const CONFIG_EXCEPTIONS = {
  24:[['Ar'],{'3d':5,'4s':1}], 29:[['Ar'],{'3d':10,'4s':1}],
  41:[['Kr'],{'4d':4,'5s':1}], 42:[['Kr'],{'4d':5,'5s':1}],
  44:[['Kr'],{'4d':7,'5s':1}], 45:[['Kr'],{'4d':8,'5s':1}],
  46:[['Kr'],{'4d':10}],       47:[['Kr'],{'4d':10,'5s':1}],
  78:[['Xe'],{'4f':14,'5d':9,'6s':1}], 79:[['Xe'],{'4f':14,'5d':10,'6s':1}],
};

function fillShells(z) {
  const filled = {}; let rem = z;
  for (const [sh, cap] of ORBITAL_ORDER) {
    if (rem <= 0) break;
    const n = Math.min(rem, cap);
    filled[sh] = n; rem -= n;
  }
  return filled;
}
const orbKey = sh => parseInt(sh[0]) * 10 + ({s:0,p:1,d:2,f:3}[sh[1]]);
const formatShells = obj => Object.entries(obj).sort((a,b) => orbKey(a[0]) - orbKey(b[0])).map(([sh, n]) => `${sh}${toSup(n)}`).join(' ');

export function electronConfig(z) {
  if (CONFIG_EXCEPTIONS[z]) return `[${CONFIG_EXCEPTIONS[z][0][0]}] ${formatShells(CONFIG_EXCEPTIONS[z][1])}`;
  const filled = fillShells(z);
  for (const [nz, nsym] of NOBLE_CORES) {
    if (nz < z) {
      const core = fillShells(nz);
      const outer = {};
      for (const sh in filled) {
        const diff = filled[sh] - (core[sh] || 0);
        if (diff > 0) outer[sh] = diff;
      }
      return `[${nsym}] ${formatShells(outer)}`;
    }
  }
  return formatShells(filled);
}

export const CONFIG_EXCEPTION_IDS = new Set(Object.keys(CONFIG_EXCEPTIONS).map(Number));
