// Atomic Structure — PC-02 — full content (deepened)
// ZIMSEC Form 5/6 Chemistry, Section 6.1 — Topic 2 (Atomic Structure)
// Strictly aligned to syllabus objectives:
//   - Sub-atomic particles & behaviour in electric field
//   - Quantum numbers (n, l, mₗ, mₛ) for n = 1, 2, 3
//   - Shapes of s and p orbitals
//   - Aufbau, Pauli, Hund principles
//   - Electronic configurations (atoms and ions)
//   - Ionisation energy: definition, factors, trends, successive IE
//
// Note: mass spectra and isotopic-mass calculations belong to PC-01
// (Atoms, Molecules & Stoichiometry) per the syllabus chart, so they live there.

/* ============================================================
   Diagram specs (Phase K3.3 migration)
   ============================================================ */

const atomicParticlesSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 160,
      "primitives": [
        {
          "p": "circle",
          "cx": 60,
          "cy": 50,
          "r": 22,
          "color": "#e63946",
          "stroke": 1.5,
          "fill": "#e63946",
          "fillAlpha": 0.19
        },
        {
          "p": "text",
          "x": 60,
          "y": 55,
          "text": "p⁺",
          "color": "#e63946",
          "size": 14,
          "bold": true
        },
        {
          "p": "text",
          "x": 60,
          "y": 90,
          "text": "Proton",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 60,
          "y": 108,
          "text": "charge +1",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 60,
          "y": 124,
          "text": "mass 1",
          "color": "dim",
          "size": 10
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 50,
          "r": 22,
          "color": "#8ecae6",
          "stroke": 1.5,
          "fill": "#8ecae6",
          "fillAlpha": 0.19
        },
        {
          "p": "text",
          "x": 160,
          "y": 55,
          "text": "n",
          "color": "#8ecae6",
          "size": 14,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 90,
          "text": "Neutron",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 108,
          "text": "charge 0",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 124,
          "text": "mass 1",
          "color": "dim",
          "size": 10
        },
        {
          "p": "circle",
          "cx": 260,
          "cy": 50,
          "r": 22,
          "color": "#ffbe0b",
          "stroke": 1.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.19
        },
        {
          "p": "text",
          "x": 260,
          "y": 55,
          "text": "e⁻",
          "color": "#ffbe0b",
          "size": 14,
          "bold": true
        },
        {
          "p": "text",
          "x": 260,
          "y": 90,
          "text": "Electron",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 260,
          "y": 108,
          "text": "charge -1",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 260,
          "y": 124,
          "text": "mass 1/1836",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 148,
          "text": "relative masses and charges",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const atomicNuclearSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 180,
      "primitives": [
        {
          "p": "circle",
          "cx": 160,
          "cy": 90,
          "r": 80,
          "color": "border",
          "stroke": 0.7
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 90,
          "r": 55,
          "color": "border",
          "stroke": 0.7
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 90,
          "r": 14,
          "color": "primary",
          "stroke": 1.5,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 160,
          "y": 94,
          "text": "nucleus",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 35,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 215,
          "cy": 90,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 145,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 105,
          "cy": 90,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 130,
          "cy": 60,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 195,
          "cy": 120,
          "r": 4,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "text",
          "x": 250,
          "y": 50,
          "text": "+ p⁺ and n⁰ in nucleus",
          "color": "text",
          "size": 9,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 250,
          "y": 68,
          "text": "+ e⁻ in shells",
          "color": "text",
          "size": 9,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 250,
          "y": 86,
          "text": "+ atom mostly empty space",
          "color": "text",
          "size": 9,
          "anchor": "start"
        }
      ]
    }
  ]
};
const atomicElectricFieldSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 180,
      "primitives": [
        {
          "p": "rect",
          "x": 20,
          "y": 30,
          "w": 4,
          "h": 110,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "rect",
          "x": 296,
          "y": 30,
          "w": 4,
          "h": 110,
          "color": "cyan",
          "stroke": 0.7,
          "fill": "cyan"
        },
        {
          "p": "text",
          "x": 22,
          "y": 22,
          "text": "+ PLATE",
          "color": "red",
          "size": 10,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 298,
          "y": 22,
          "text": "− PLATE",
          "color": "cyan",
          "size": 10,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 50,
          "x2": 250,
          "y2": 70,
          "color": "amber",
          "width": 1.5
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 50,
          "x2": 250,
          "y2": 90,
          "color": "amber",
          "width": 0.6,
          "dash": true
        },
        {
          "p": "circle",
          "cx": 250,
          "cy": 70,
          "r": 5,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "text",
          "x": 230,
          "y": 58,
          "text": "e⁻ deflects strongly to +",
          "color": "amber",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 100,
          "x2": 120,
          "y2": 108,
          "color": "red",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 108,
          "r": 5,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 120,
          "y": 124,
          "text": "p⁺ deflects to −",
          "color": "red",
          "size": 9
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 140,
          "x2": 260,
          "y2": 140,
          "color": "#8ecae6",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 260,
          "cy": 140,
          "r": 5,
          "color": "#8ecae6",
          "stroke": 0.7,
          "fill": "#8ecae6"
        },
        {
          "p": "text",
          "x": 240,
          "y": 154,
          "text": "n⁰ goes straight",
          "color": "#8ecae6",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 160,
          "y": 172,
          "text": "deflection ∝ charge / mass",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const atomicQuantumNumbersSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 230,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "QUANTUM NUMBERS",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 20,
          "y1": 32,
          "x2": 300,
          "y2": 32,
          "color": "border",
          "width": 0.7
        },
        {
          "p": "text",
          "x": 50,
          "y": 48,
          "text": "n",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 120,
          "y": 48,
          "text": "l",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 195,
          "y": 48,
          "text": "mₗ",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 270,
          "y": 48,
          "text": "mₛ",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "line",
          "x1": 20,
          "y1": 56,
          "x2": 300,
          "y2": 56,
          "color": "border",
          "width": 0.7
        },
        {
          "p": "text",
          "x": 50,
          "y": 75,
          "text": "1, 2, 3…",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 120,
          "y": 75,
          "text": "0 to (n−1)",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 195,
          "y": 75,
          "text": "−l to +l",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 270,
          "y": 75,
          "text": "±½",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 50,
          "y": 95,
          "text": "shell",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 120,
          "y": 95,
          "text": "subshell",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 195,
          "y": 95,
          "text": "orbital",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 270,
          "y": 95,
          "text": "spin",
          "color": "dim",
          "size": 9
        },
        {
          "p": "line",
          "x1": 20,
          "y1": 108,
          "x2": 300,
          "y2": 108,
          "color": "border",
          "width": 0.7
        },
        {
          "p": "text",
          "x": 30,
          "y": 130,
          "text": "EXAMPLE · n = 2 shell",
          "color": "accent",
          "size": 10,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 30,
          "y": 150,
          "text": "l = 0  →  2s subshell  →  1 orbital",
          "color": "text",
          "size": 10,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 30,
          "y": 166,
          "text": "l = 1  →  2p subshell  →  3 orbitals (mₗ = −1, 0, +1)",
          "color": "text",
          "size": 10,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 30,
          "y": 186,
          "text": "2s holds 2 e⁻ ; 2p holds 6 e⁻ (3 orbitals × 2)",
          "color": "text",
          "size": 10,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 30,
          "y": 204,
          "text": "For n = 3: l = 0 (3s), 1 (3p), 2 (3d) → 9 orbitals → 18 e⁻ max",
          "color": "dim",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 30,
          "y": 220,
          "text": "Within a shell: s < p < d in energy",
          "color": "dim",
          "size": 9,
          "anchor": "start"
        }
      ]
    }
  ]
};
const atomicOrbitalShapesSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "circle",
          "cx": 60,
          "cy": 80,
          "r": 32,
          "color": "primary",
          "stroke": 1.5,
          "fill": "primary",
          "fillAlpha": 0.19
        },
        {
          "p": "circle",
          "cx": 60,
          "cy": 80,
          "r": 3,
          "color": "text",
          "stroke": 0.7,
          "fill": "text"
        },
        {
          "p": "text",
          "x": 60,
          "y": 130,
          "text": "s orbital",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 60,
          "y": 146,
          "text": "spherical",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 60,
          "y": 161,
          "text": "1 per shell",
          "color": "dim",
          "size": 9
        },
        {
          "p": "path",
          "d": "M146 80 C146 66 194 66 194 80 C194 94 146 94 146 80 Z",
          "color": "primary",
          "width": 1,
          "fill": "#00d4ff30"
        },
        {
          "p": "text",
          "x": 170,
          "y": 83,
          "text": "pₓ",
          "color": "text",
          "size": 9
        },
        {
          "p": "path",
          "d": "M220 56 C234 56 234 104 220 104 C206 104 206 56 220 56 Z",
          "color": "primary",
          "width": 1,
          "fill": "#00d4ff30"
        },
        {
          "p": "text",
          "x": 220,
          "y": 83,
          "text": "pᵧ",
          "color": "text",
          "size": 9
        },
        {
          "p": "path",
          "d": "M250 96 C238 84 274 48 286 60 C298 72 262 108 250 96 Z",
          "color": "primary",
          "width": 1,
          "fill": "#00d4ff30"
        },
        {
          "p": "text",
          "x": 270,
          "y": 83,
          "text": "p_z",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 220,
          "y": 130,
          "text": "p orbitals",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 220,
          "y": 146,
          "text": "dumbbell · 3 per shell (n≥2)",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 220,
          "y": 161,
          "text": "perpendicular axes (x, y, z)",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 160,
          "y": 195,
          "text": "SYLLABUS · only s and p shapes required",
          "color": "accent",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 211,
          "text": "d orbitals: 5 per shell (n≥3); shapes not examined",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const atomicSubshellsSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 40,
          "y": 24,
          "text": "1s",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 24,
          "text": "↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 54,
          "text": "2s",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 54,
          "text": "↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 84,
          "text": "2p",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 84,
          "text": "↑↓ ↑↓ ↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 114,
          "text": "3s",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 114,
          "text": "↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 144,
          "text": "3p",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 144,
          "text": "↑↓ ↑↓ ↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 174,
          "text": "4s",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 174,
          "text": "↑↓",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 40,
          "y": 204,
          "text": "3d",
          "color": "primary",
          "size": 11,
          "bold": true,
          "anchor": "end"
        },
        {
          "p": "text",
          "x": 55,
          "y": 204,
          "text": "↑ ↑ ↑ ↑ ↑",
          "color": "text",
          "size": 11,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 210,
          "y": 24,
          "text": "Fill order:",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 210,
          "y": 42,
          "text": "1s → 2s → 2p → 3s → 3p",
          "color": "text",
          "size": 10
        },
        {
          "p": "text",
          "x": 210,
          "y": 58,
          "text": "→ 4s → 3d → 4p → 5s …",
          "color": "text",
          "size": 10
        },
        {
          "p": "text",
          "x": 210,
          "y": 84,
          "text": "AUFBAU",
          "color": "accent",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 210,
          "y": 100,
          "text": "Lowest energy first",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 210,
          "y": 120,
          "text": "PAULI",
          "color": "accent",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 210,
          "y": 136,
          "text": "Max 2 e⁻/orbital, opp spin",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 210,
          "y": 156,
          "text": "HUND",
          "color": "accent",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 210,
          "y": 172,
          "text": "Singly fill before pairing",
          "color": "text",
          "size": 9
        }
      ]
    }
  ]
};
const atomicPenetrationSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "PENETRATION & SHIELDING",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 50,
          "y1": 180,
          "x2": 50,
          "y2": 40,
          "color": "dim",
          "width": 1
        },
        {
          "p": "text",
          "x": 42,
          "y": 45,
          "text": "E ↑",
          "color": "dim",
          "size": 10,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 160,
          "x2": 130,
          "y2": 160,
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 140,
          "y": 164,
          "text": "3s",
          "color": "text",
          "size": 10,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 195,
          "y": 164,
          "text": "penetrates closest, least shielded → low E",
          "color": "dim",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 120,
          "x2": 130,
          "y2": 120,
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 140,
          "y": 124,
          "text": "3p",
          "color": "text",
          "size": 10,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 195,
          "y": 124,
          "text": "moderate penetration",
          "color": "dim",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 80,
          "x2": 130,
          "y2": 80,
          "color": "primary",
          "width": 2
        },
        {
          "p": "text",
          "x": 140,
          "y": 84,
          "text": "3d",
          "color": "text",
          "size": 10,
          "bold": true,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 195,
          "y": 84,
          "text": "stays far out, more shielded → high E",
          "color": "dim",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 160,
          "y": 195,
          "text": "Within a shell: s < p < d in energy",
          "color": "accent",
          "size": 9,
          "bold": true
        }
      ]
    }
  ]
};
const atomicPeriodTrendSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "FIRST IE ACROSS PERIOD 3",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 170,
          "x2": 300,
          "y2": 170,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 40,
          "x2": 40,
          "y2": 170,
          "color": "dim",
          "width": 1
        },
        {
          "p": "circle",
          "cx": 60,
          "cy": 145,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 60,
          "y": 183,
          "text": "Na",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 90,
          "cy": 125,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 90,
          "y": 183,
          "text": "Mg",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 130,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 120,
          "y": 183,
          "text": "Al",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 120,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 150,
          "y": 183,
          "text": "Si",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 180,
          "cy": 95,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 180,
          "y": 183,
          "text": "P",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 210,
          "cy": 100,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 210,
          "y": 183,
          "text": "S",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 240,
          "cy": 80,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 240,
          "y": 183,
          "text": "Cl",
          "color": "text",
          "size": 9
        },
        {
          "p": "circle",
          "cx": 270,
          "cy": 60,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 270,
          "y": 183,
          "text": "Ar",
          "color": "text",
          "size": 9
        },
        {
          "p": "path",
          "d": "M60 145 L90 125 L120 130 L150 120 L180 95 L210 100 L240 80 L270 60",
          "color": "primary",
          "width": 1.2
        },
        {
          "p": "text",
          "x": 120,
          "y": 148,
          "text": "↓ dip at Al",
          "color": "red",
          "size": 9
        },
        {
          "p": "text",
          "x": 210,
          "y": 118,
          "text": "↓ dip at S",
          "color": "red",
          "size": 9
        },
        {
          "p": "text",
          "x": 28,
          "y": 100,
          "text": "IE ↑",
          "color": "dim",
          "size": 9,
          "anchor": "end"
        }
      ]
    }
  ]
};
const atomicSuccessiveIESpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "SUCCESSIVE IE OF SODIUM (log scale)",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 195,
          "x2": 310,
          "y2": 195,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 35,
          "x2": 40,
          "y2": 195,
          "color": "dim",
          "width": 1
        },
        {
          "p": "text",
          "x": 175,
          "y": 212,
          "text": "electron number removed →",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 28,
          "y": 115,
          "text": "log IE",
          "color": "dim",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "circle",
          "cx": 62,
          "cy": 180,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 84,
          "cy": 150,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 106,
          "cy": 143,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 128,
          "cy": 138,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 132,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 172,
          "cy": 124,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 194,
          "cy": 118,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 216,
          "cy": 112,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 238,
          "cy": 105,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 260,
          "cy": 68,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 282,
          "cy": 55,
          "r": 4,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "path",
          "d": "M62 180 L84 150 L106 143 L128 138 L150 132 L172 124 L194 118 L216 112 L238 105 L260 68 L282 55",
          "color": "primary",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 64,
          "y": 175,
          "text": "shell 3 (1 e⁻)",
          "color": "text",
          "size": 9,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 170,
          "y": 100,
          "text": "shell 2 (8 e⁻)",
          "color": "text",
          "size": 9
        },
        {
          "p": "text",
          "x": 295,
          "y": 50,
          "text": "shell 1 (2 e⁻)",
          "color": "text",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 245,
          "y1": 105,
          "x2": 245,
          "y2": 68,
          "color": "accent",
          "width": 1,
          "dash": true
        },
        {
          "p": "text",
          "x": 250,
          "y": 88,
          "text": "JUMP",
          "color": "accent",
          "size": 9,
          "anchor": "start"
        }
      ]
    }
  ]
};

/* ============================================================
   Chapters (7)
   ============================================================ */

const chapters = [
  // CH.1 — Subatomic particles
  { id: 'ch1', title: 'Subatomic Particles', minutes: 10, blocks: [
    { type: 'p', text: 'Every atom is built from three subatomic particles: protons, neutrons, and electrons. Their relative masses and charges dictate almost everything that follows — bonding, spectra, ionisation, even the colour of transition-metal complexes.' },
    { type: 'd', spec: atomicParticlesSpec, caption: 'The three subatomic particles' },
    { type: 'h', text: 'Inside the atom' },
    { type: 'p', text: 'Protons and neutrons sit together in a tiny, dense core called the nucleus. Electrons occupy the space around the nucleus in regions called shells. The atom is mostly empty space: if the nucleus were a pea in the centre of a football stadium, the electrons would be found near the outer seats.' },
    { type: 'd', spec: atomicNuclearSpec, caption: 'The nuclear model' },
    { type: 'callout', kind: 'definition', title: 'Atomic number (Z)', body: 'Number of protons. Defines the element. Identical to the number of electrons in a NEUTRAL atom.' },
    { type: 'callout', kind: 'definition', title: 'Mass number (A)', body: 'Total number of protons + neutrons. Number of neutrons = A − Z.' },
    { type: 'callout', kind: 'key', title: 'Isotopes', body: 'Same Z, different A — same element, different number of neutrons. Examples: ¹²C and ¹³C, ³⁵Cl and ³⁷Cl. Isotopes have identical chemistry (electrons unchanged) but different mass.' },
    { type: 'h', text: 'Notation' },
    { type: 'ul', items: [
      'An element X with mass number A and atomic number Z is written ᴬ_Z X (e.g. ²³_₁₁Na).',
      'The mass number sits top-left; the atomic number bottom-left.',
      'Charge (if any) goes top-right: Mg²⁺, O²⁻.',
    ]},
    { type: 'takeaway', items: [
      'Protons + neutrons in the nucleus; electrons in shells around it.',
      'Z identifies the element; A − Z = number of neutrons.',
      'Isotopes share Z but differ in neutron count and so in mass.',
      'A neutral atom has equal numbers of protons and electrons.',
    ]},
  ]},

  // CH.2 — Electric fields
  { id: 'ch2', title: 'Behaviour in Electric Fields', minutes: 8, blocks: [
    { type: 'p', text: 'When a beam of charged particles passes between oppositely-charged plates, each particle is deflected according to its charge-to-mass ratio. This is the principle behind mass spectrometry and cathode-ray tubes, and it is a favourite exam question.' },
    { type: 'd', spec: atomicElectricFieldSpec, caption: 'Relative deflection in a uniform electric field' },
    { type: 'h', text: 'The three rules' },
    { type: 'ul', items: [
      'Electrons (e⁻, charge −1) deflect TOWARDS the positive plate, and strongly — their mass is tiny.',
      'Protons (p⁺, charge +1) deflect TOWARDS the negative plate, but less than electrons of the same speed.',
      'Neutrons (n⁰, charge 0) are NOT deflected at all.',
    ]},
    { type: 'callout', kind: 'key', title: 'Deflection ∝ charge/mass', body: 'For the same accelerating voltage and field, a particle with larger q/m is deflected more. Electrons win by a factor of ~1836 over protons (same charge magnitude, much smaller mass).' },
    { type: 'h', text: 'Why the direction matters' },
    { type: 'p', text: 'The DIRECTION of deflection tells you the SIGN of the charge: opposite charges attract. The MAGNITUDE of deflection tells you q/m, and so distinguishes particles of different mass with the same charge — exactly how a mass spectrometer separates isotopes.' },
    { type: 'takeaway', items: [
      'Direction → sign of charge.',
      'Magnitude → q/m ratio.',
      'Neutrons ignore electric fields entirely.',
    ]},
  ]},

  // CH.3 — Quantum numbers (NEW deep chapter)
  { id: 'ch3', title: 'Quantum Numbers (n, l, mₗ, mₛ)', minutes: 14, blocks: [
    { type: 'p', text: 'Electrons aren\'t little planets orbiting a nucleus. They occupy three-dimensional regions called orbitals, each described by a unique set of FOUR quantum numbers. At A-level only n = 1, 2, 3 need be examined in detail, but the framework underpins everything in this topic.' },
    { type: 'd', spec: atomicQuantumNumbersSpec, caption: 'The four quantum numbers' },
    { type: 'h', text: 'The four quantum numbers' },
    { type: 'ul', items: [
      'PRINCIPAL n — the shell. n = 1, 2, 3, … Higher n means a larger, higher-energy shell.',
      'AZIMUTHAL l — the subshell within a shell. l = 0, 1, 2, … (n−1). Letter labels: 0 = s, 1 = p, 2 = d, 3 = f.',
      'MAGNETIC mₗ — the orientation of the orbital in space. mₗ = −l, … 0, … +l (so 2l + 1 orbitals per subshell).',
      'SPIN mₛ — the electron\'s spin. mₛ = +½ or −½. Each orbital holds at most 2 electrons, with opposite spins.',
    ]},
    { type: 'h', text: 'How shells, subshells, and orbitals nest' },
    { type: 'ul', items: [
      'n = 1 — one subshell (1s) → one orbital → max 2 electrons.',
      'n = 2 — two subshells (2s, 2p). 2s has 1 orbital (2 e⁻); 2p has 3 orbitals (6 e⁻). Total 8 electrons.',
      'n = 3 — three subshells (3s, 3p, 3d). 3s 1 orbital (2 e⁻), 3p 3 orbitals (6 e⁻), 3d 5 orbitals (10 e⁻). Total 18 electrons.',
      'In general, shell n holds up to 2n² electrons.',
    ]},
    { type: 'callout', kind: 'key', title: 'Energies WITHIN a shell are NOT equal', body: 'For a given n, the order is s < p < d < f. The s subshell is lowest in energy because s electrons penetrate closer to the nucleus (see Chapter 5).' },
    { type: 'h', text: 'Number of orbitals and electrons — quick formulas' },
    { type: 'ul', items: [
      'Subshell s → 1 orbital → max 2 electrons.',
      'Subshell p → 3 orbitals → max 6 electrons.',
      'Subshell d → 5 orbitals → max 10 electrons.',
      'Subshell f → 7 orbitals → max 14 electrons.',
    ]},
    { type: 'takeaway', items: [
      'Four quantum numbers uniquely identify any electron.',
      'n = shell, l = subshell, mₗ = orbital orientation, mₛ = spin.',
      'l ranges 0 to n−1; mₗ ranges −l to +l.',
      'Shell n holds 2n² electrons in total.',
    ]},
  ]},

  // CH.4 — Shapes of s and p orbitals
  { id: 'ch4', title: 'Shapes of s and p Orbitals', minutes: 8, blocks: [
    { type: 'p', text: 'An orbital is a 3-D region in which there is over 90 % probability of finding an electron. The shape matters because it controls how orbitals overlap when atoms bond.' },
    { type: 'd', spec: atomicOrbitalShapesSpec, caption: 's and p orbital shapes' },
    { type: 'h', text: 's orbitals' },
    { type: 'ul', items: [
      'Spherical, centred on the nucleus.',
      'There is exactly ONE s orbital per shell (n = 1, 2, 3, …).',
      'Higher s orbitals (2s, 3s, …) are larger and have nodal regions where the electron density drops to zero.',
    ]},
    { type: 'h', text: 'p orbitals' },
    { type: 'ul', items: [
      'Dumbbell-shaped — two lobes either side of the nucleus.',
      'There are THREE p orbitals per shell (from n = 2 onwards), oriented along the x, y and z axes — labelled pₓ, pᵧ, p_z.',
      'They are mutually perpendicular.',
      'In an isolated atom the three p orbitals are degenerate (same energy).',
    ]},
    { type: 'h', text: 'd orbitals (background only)' },
    { type: 'p', text: 'There are five d orbitals per shell from n = 3 onwards. Their shapes are more complex (cloverleaf, plus a doughnut/lobe variant). The syllabus does not require you to draw them — only s and p shapes are examined. The d orbitals matter when we get to transition-metal complexes (AC-21).' },
    { type: 'callout', kind: 'key', title: 'Why three p orbitals?', body: 'Because mₗ for p (l = 1) takes three values: −1, 0, +1. Each value corresponds to a different spatial orientation. Hund\'s rule fills each one singly first, giving atoms like nitrogen (2p³) a half-filled, unusually stable arrangement.' },
    { type: 'takeaway', items: [
      's: spherical, 1 per shell.',
      'p: dumbbell, 3 per shell (n ≥ 2), perpendicular orientations.',
      'd: more complex, 5 per shell (n ≥ 3); shapes not examinable.',
    ]},
  ]},

  // CH.5 — Aufbau, Pauli, Hund + electron configurations
  { id: 'ch5', title: 'Filling Orbitals — Aufbau, Pauli, Hund', minutes: 14, blocks: [
    { type: 'p', text: 'When you assign electrons to orbitals to write a configuration, three rules govern the order. They are deceptively simple and often confused — get them straight and most configuration questions follow automatically.' },
    { type: 'd', spec: atomicSubshellsSpec, caption: 'Subshell filling order with the three rules' },
    { type: 'h', text: 'Aufbau ("building up")' },
    { type: 'p', text: 'Electrons enter the lowest-energy subshell available first. The order is: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → 5d → 6p → 7s …' },
    { type: 'callout', kind: 'warning', title: 'The 4s/3d crossover', body: '4s fills BEFORE 3d in the neutral atom because 4s is slightly lower in energy. But once 3d has electrons, the 3d level drops below 4s. Consequence: when forming a positive ion, 4s ELECTRONS LEAVE FIRST. Hence Fe is [Ar] 3d⁶ 4s² but Fe²⁺ is [Ar] 3d⁶ (not [Ar] 3d⁴ 4s²).' },
    { type: 'h', text: 'Pauli (exclusion principle)' },
    { type: 'p', text: 'No two electrons in the same atom can have all four quantum numbers identical. In practice this means each orbital can hold AT MOST 2 electrons — and those two must have OPPOSITE spins.' },
    { type: 'h', text: 'Hund\'s rule' },
    { type: 'p', text: 'When filling a degenerate set of orbitals (e.g. the three 2p orbitals), put one electron in EACH orbital first — all with parallel spins — before pairing any of them up. Pairing electrons in the same orbital costs energy because of electron-electron repulsion, so single occupation is preferred whenever possible.' },
    { type: 'h', text: 'Building configurations — examples' },
    { type: 'ul', items: [
      'Na (Z = 11):  1s² 2s² 2p⁶ 3s¹  =  [Ne] 3s¹',
      'Cl (Z = 17):  1s² 2s² 2p⁶ 3s² 3p⁵  =  [Ne] 3s² 3p⁵',
      'Ar (Z = 18):  [Ne] 3s² 3p⁶  (full Period-3 octet)',
      'K  (Z = 19):  [Ar] 4s¹  (4s before 3d)',
      'Ti (Z = 22):  [Ar] 3d² 4s²',
      'Fe (Z = 26):  [Ar] 3d⁶ 4s²',
    ]},
    { type: 'h', text: 'The two famous anomalies' },
    { type: 'callout', kind: 'warning', title: 'Cr and Cu break the pattern', body: 'Cr is [Ar] 3d⁵ 4s¹ (NOT 3d⁴ 4s²) — half-filled d subshell is extra stable. Cu is [Ar] 3d¹⁰ 4s¹ (NOT 3d⁹ 4s²) — fully-filled d subshell is extra stable. Memorise these two; the rest follow Aufbau cleanly.' },
    { type: 'h', text: 'Configurations of common ions' },
    { type: 'ul', items: [
      'Na⁺: [Ne] (lost 3s¹). Mg²⁺: [Ne] (lost 3s²). Al³⁺: [Ne] (lost 3s² 3p¹).',
      'Cl⁻: [Ar] (gained one to fill 3p). O²⁻: [Ne] (gained two to fill 2p).',
      'Fe²⁺: [Ar] 3d⁶ (lost both 4s electrons).',
      'Fe³⁺: [Ar] 3d⁵ (lost both 4s and one 3d).',
      'Cu²⁺: [Ar] 3d⁹ (lost 4s¹ and one 3d).',
    ]},
    { type: 'callout', kind: 'key', title: 'Test yourself', body: 'Write out the configurations of Mn, Mn²⁺, V³⁺, Co³⁺, Zn²⁺. Mn: [Ar] 3d⁵ 4s²; Mn²⁺: [Ar] 3d⁵ (lost 4s²); V³⁺: [Ar] 3d² (lost 4s² and one 3d); Co³⁺: [Ar] 3d⁶; Zn²⁺: [Ar] 3d¹⁰.' },
    { type: 'takeaway', items: [
      'Aufbau: fill lowest-energy subshell first.',
      'Pauli: max 2 electrons per orbital, opposite spins.',
      'Hund: singly occupy degenerate orbitals before pairing.',
      '4s fills first but empties first when ionising.',
      'Cr (3d⁵ 4s¹) and Cu (3d¹⁰ 4s¹) are anomalies.',
    ]},
  ]},

  // CH.6 — Penetration, shielding, IE definition
  { id: 'ch6', title: 'Ionisation Energy — Foundations', minutes: 14, blocks: [
    { type: 'p', text: 'Ionisation energy (IE) is the energy needed to remove one mole of electrons from one mole of gaseous atoms (or ions). It is always endothermic — work is being done against the attraction between the negative electron and the positive nucleus. The size of an IE depends on three competing factors: nuclear charge, distance from nucleus, and shielding by inner electrons.' },
    { type: 'callout', kind: 'definition', title: 'First ionisation energy (IE₁)', body: 'X(g)  →  X⁺(g) + e⁻         ΔH = IE₁  (always positive)' },
    { type: 'callout', kind: 'definition', title: 'Second ionisation energy (IE₂)', body: 'X⁺(g)  →  X²⁺(g) + e⁻        ΔH = IE₂. ALWAYS larger than IE₁ — removing from a positive ion is harder.' },
    { type: 'h', text: 'The three factors that control IE' },
    { type: 'ul', items: [
      'Nuclear charge — more protons mean a stronger pull on electrons → HIGHER IE.',
      'Distance from nucleus (atomic radius) — outer electrons further from the nucleus are easier to remove → LOWER IE.',
      'Shielding (screening) — inner-shell electrons reduce the effective nuclear charge felt by outer electrons → LOWER IE for the outer ones.',
    ]},
    { type: 'h', text: 'Penetration explains why s < p < d in energy within a shell' },
    { type: 'd', spec: atomicPenetrationSpec, caption: 'Why 3s < 3p < 3d in energy' },
    { type: 'p', text: 'Within the same shell (same n), an s orbital "penetrates" closer to the nucleus than a p orbital, which in turn penetrates closer than a d orbital. Closer penetration means the electron experiences less shielding from inner electrons and more of the actual nuclear charge — so the s electron is held more tightly (lower in energy). This is why 3s < 3p < 3d, and is also why 4s actually drops below 3d for early TMs.' },
    { type: 'h', text: 'Effective nuclear charge (Z_eff)' },
    { type: 'p', text: 'A useful concept: Z_eff = Z − S, where S is the total shielding from inner electrons. For example, in Na the outermost 3s electron sees Z = 11, but the 10 inner electrons (1s² 2s² 2p⁶) shield it almost completely, so Z_eff ≈ 11 − 10 = 1. That is why Na\'s first IE is small. Compare to Mg: Z = 12, but its outer 3s² electron is shielded by 10 inner electrons, giving Z_eff ≈ 2. Higher Z_eff → harder to remove → higher IE.' },
    { type: 'callout', kind: 'key', title: 'Putting it together', body: 'IE rises when (a) nuclear charge rises faster than shielding, or (b) the electron being removed is in a smaller, lower-energy orbital. IE falls when (a) shielding outpaces nuclear charge, or (b) the electron is far from the nucleus or in a higher-energy subshell.' },
    { type: 'takeaway', items: [
      'IE is always endothermic — energy in.',
      'Three factors: nuclear charge ↑, distance ↑, shielding ↑ — all matter.',
      'Within a shell: s < p < d in energy (penetration argument).',
      'Effective nuclear charge Z_eff = Z − S.',
    ]},
  ]},

  // CH.7 — IE trends and successive IE (deepened)
  { id: 'ch7', title: 'IE Trends & Successive IE', minutes: 16, blocks: [
    { type: 'h', text: 'Across a period (Na → Ar)' },
    { type: 'p', text: 'First ionisation energy GENERALLY rises across a period: nuclear charge increases by 1 per element, but each new electron goes into the same outer shell, so shielding stays roughly constant. Net effect: Z_eff rises, electrons held more tightly, IE rises.' },
    { type: 'd', spec: atomicPeriodTrendSpec, caption: 'First IE across Period 3' },
    { type: 'callout', kind: 'warning', title: 'Two famous dips: Al and S', body: 'The trend is NOT monotonic. There is a small drop at Al (relative to Mg) and another at S (relative to P).' },
    { type: 'h', text: 'Why Al dips below Mg' },
    { type: 'p', text: 'Mg: outer 3s². Al: outer 3s² 3p¹. The fourth outer electron in Al is in 3p, which is HIGHER in energy than 3s (penetration argument). So the 3p¹ electron is easier to remove than a 3s electron from Mg, even though Al has more protons. The drop is small because the difference between 3s and 3p is small.' },
    { type: 'h', text: 'Why S dips below P' },
    { type: 'p', text: 'P: outer 3s² 3p³. The three 3p orbitals each hold one electron (Hund\'s rule). S: outer 3s² 3p⁴. The fourth 3p electron must PAIR up with one of the existing 3p electrons. Pairing brings extra electron-electron repulsion in the same orbital, which destabilises that paired electron and makes it easier to remove. So S has a slightly LOWER IE₁ than P, despite more protons.' },
    { type: 'h', text: 'Down a group' },
    { type: 'p', text: 'IE FALLS down a group. Atomic radius grows (more shells), and shielding by inner electrons grows roughly in step with nuclear charge — so Z_eff stays similar, but the outer electron is much further from the nucleus and so easier to remove.' },
    { type: 'h', text: 'Successive ionisation energies' },
    { type: 'p', text: 'Each ionisation gets harder than the last. Big jumps appear when you break into a NEW (inner) shell, because the next electron is in a much smaller orbital with much less shielding. This is how we use IE data to deduce GROUP NUMBER.' },
    { type: 'd', spec: atomicSuccessiveIESpec, caption: 'Successive IE of Na (log) — jumps reveal shell structure' },
    { type: 'h', text: 'Reading successive-IE data' },
    { type: 'ul', items: [
      'A big jump after the 1st electron → Group I (only 1 valence electron).',
      'After the 2nd → Group II.',
      'After the 3rd → Group III.',
      'After the 4th → Group IV.',
      'In general, the position of the FIRST big jump tells you the group number.',
    ]},
    { type: 'callout', kind: 'key', title: 'Spotting the jump', body: 'Look at the RATIO between successive IE values. Within the same shell, the ratio is typically 1.5–2×. Jumping into the next shell, the ratio is 4× or more. The first big multiplicative jump = the boundary between valence and core.' },
    { type: 'h', text: 'IE definition for higher ionisations' },
    { type: 'ul', items: [
      'IE₁: X(g) → X⁺(g) + e⁻',
      'IE₂: X⁺(g) → X²⁺(g) + e⁻',
      'IE₃: X²⁺(g) → X³⁺(g) + e⁻',
      'and so on.',
    ]},
    { type: 'takeaway', items: [
      'IE rises across a period (Z_eff up).',
      'IE falls down a group (radius and shielding up).',
      'Period 3 dips: Al (3p > 3s) and S (3p pair repulsion).',
      'Successive IEs: big jump = new shell = group number.',
    ]},
  ]},
];

/* ============================================================
   Quiz banks
   ============================================================ */

const quizzes = [
  { q: 'Which subatomic particle has the smallest relative mass?', opts: ['Proton', 'Neutron', 'Electron', 'Alpha particle'], ans: 2, hint: 'Mass of e⁻ is ~1/1836 of a proton.' },
  { q: 'Isotopes of the same element differ in the number of:', opts: ['Protons', 'Electrons', 'Neutrons', 'Both protons and electrons'], ans: 2, hint: 'Same element = same Z. Different mass = different A.' },
  { q: 'Which particle is NOT deflected in an electric field?', opts: ['Proton', 'Neutron', 'Electron', 'All are deflected'], ans: 1, hint: 'No charge, no deflection.' },
  { q: 'In a uniform electric field, why are electrons deflected more than protons of the same speed?', opts: ['Greater charge', 'Smaller mass (higher q/m)', 'They travel faster', 'Spin'], ans: 1, hint: 'Deflection scales with q/m — e⁻ wins because mass is tiny.' },
  { q: 'What is the principal quantum number n for an electron in the 3p subshell?', opts: ['1', '2', '3', '4'], ans: 2, hint: 'The "3" in 3p IS n.' },
  { q: 'For l = 1 (a p subshell), how many orbitals are there?', opts: ['1', '2', '3', '5'], ans: 2, hint: 'mₗ takes values −1, 0, +1.' },
  { q: 'How many electrons can the n = 3 shell hold in total?', opts: ['8', '14', '18', '32'], ans: 2, hint: '2n² = 2(9) = 18.' },
  { q: 'For an s orbital, the value of l is:', opts: ['0', '1', '2', '3'], ans: 0, hint: 's = 0, p = 1, d = 2, f = 3.' },
  { q: 'An s orbital has shape:', opts: ['Dumbbell', 'Spherical', 'Cloverleaf', 'Planar'], ans: 1, hint: 'Symmetric ball.' },
  { q: 'How many p orbitals are there in any shell from n = 2 onwards?', opts: ['1', '2', '3', '6'], ans: 2, hint: 'pₓ, pᵧ, p_z.' },
  { q: 'The electron configuration of Fe (Z = 26) is:', opts: ['[Ar] 3d⁸', '[Ar] 3d⁶ 4s²', '[Ar] 4s² 3d⁴', '[Ar] 4s² 4p⁶'], ans: 1, hint: '4s fills before 3d.' },
  { q: 'When Fe forms Fe³⁺, which electrons leave first?', opts: ['Three 3d', '4s², then one 3d', 'Three 3p', 'Two 2p, one 3d'], ans: 1, hint: '4s leaves first even though 4s fills first.' },
  { q: 'Which configuration is correct for Cu (Z = 29)?', opts: ['[Ar] 3d⁹ 4s²', '[Ar] 3d¹⁰ 4s¹', '[Ar] 4s¹ 4p¹⁰', '[Ar] 3d⁸ 4s²'], ans: 1, hint: 'Full d subshell stability.' },
  { q: 'Cr (Z = 24) is anomalous because:', opts: ['Half-filled 3d⁵ 4s¹ is more stable than 3d⁴ 4s²', 'Cr ignores Aufbau', 'Cr has only 4 protons in the d block', 'Cr is a noble gas'], ans: 0, hint: 'Half-filled d wins.' },
  { q: 'Hund\'s rule states:', opts: ['Electrons pair up before singly occupying', 'Each orbital in a degenerate set is singly occupied first', 'Orbitals fill in order of size only', 'Paired electrons have the same spin'], ans: 1, hint: 'Single first, pair later.' },
  { q: 'The Pauli exclusion principle states:', opts: ['No two electrons can have all four quantum numbers identical', 'Electrons cannot share orbitals', 'Spin is always positive', 'p orbitals must fill before s'], ans: 0, hint: 'Each orbital max 2 electrons of opposite spin.' },
  { q: 'Within the n = 3 shell, the order of subshell energies is:', opts: ['3s > 3p > 3d', '3s < 3p < 3d', '3s = 3p = 3d', '3p < 3s < 3d'], ans: 1, hint: 'Penetration argument — s most penetrating, lowest E.' },
  { q: 'Why does 4s fill before 3d in a neutral atom?', opts: ['4s closer to the nucleus', '4s is slightly lower in energy than 3d in neutral atoms', '4s has fewer electrons', 'It is a quirk with no reason'], ans: 1, hint: 'Energy ordering, not shell number.' },
  { q: 'First ionisation energy is the energy to:', opts: ['Add an electron', 'Remove 1 mole of electrons from 1 mole of gaseous atoms', 'Excite an electron', 'Break a covalent bond'], ans: 1, hint: 'Gaseous, 1 mole, remove outermost.' },
  { q: 'Which factor does NOT affect IE?', opts: ['Nuclear charge', 'Atomic radius', 'Shielding', 'Mass of the nucleus'], ans: 3, hint: 'Mass is irrelevant for IE.' },
  { q: 'Effective nuclear charge Z_eff is approximately:', opts: ['Z (proton number)', 'Z minus shielding S', 'Z plus shielding', 'Z divided by neutrons'], ans: 1, hint: 'Inner electrons screen the outer ones.' },
  { q: 'Which element has the highest first IE?', opts: ['Na', 'Mg', 'Al', 'Ar'], ans: 3, hint: 'Across a period IE rises; noble gases peak.' },
  { q: 'First IE down Group I:', opts: ['Increases', 'Decreases', 'Stays the same', 'Fluctuates'], ans: 1, hint: 'Atomic radius grows, easier to remove.' },
  { q: 'Why is the first IE of Al LOWER than Mg?', opts: ['Al has fewer protons', 'Al\'s outer electron is in 3p, which is higher in energy than 3s', 'Al is bigger than Ar', 'Pairing repulsion'], ans: 1, hint: 'Different subshell — penetration argument.' },
  { q: 'Why does S have a LOWER IE₁ than P?', opts: ['S has fewer protons', 'In S, the 4th 3p electron must pair up — pair repulsion lowers IE', 'S is lighter', 'S has more shielding'], ans: 1, hint: 'Pairing energy in same orbital.' },
  { q: 'Successive IEs (kJ/mol): 580, 1815, 2740, 11580, 14840. The element is in:', opts: ['Group I', 'Group II', 'Group III', 'Group IV'], ans: 2, hint: 'Big jump after the 3rd → 3 valence electrons.' },
  { q: 'Why is each successive IE larger than the one before?', opts: ['Nuclear mass increases', 'You are removing from a more positive species — remaining electrons are held more tightly', 'Shielding increases', 'Electrons get heavier'], ans: 1, hint: 'Each ion has fewer electrons but the same protons.' },
  { q: 'For n = 3, the allowed values of l are:', opts: ['0, 1', '0, 1, 2', '0, 1, 2, 3', '1, 2, 3'], ans: 1, hint: 'l ranges 0 to n−1.' },
  { q: 'How many unpaired electrons does a neutral N atom have?', opts: ['0', '1', '3', '5'], ans: 2, hint: '2p³ — three orbitals, three unpaired (Hund).' },
  { q: 'The total number of orbitals in the n = 2 shell is:', opts: ['2', '4', '6', '8'], ans: 1, hint: 'One 2s + three 2p = 4 orbitals.' },
];

const structured = [
  { title: 'Quantum numbers and configuration', marks: 8, q: 'Use ideas about quantum numbers and the rules of Aufbau, Pauli, and Hund to answer the following.', parts: [
    { q: '(a) State the four quantum numbers and what each describes.', marks: 4, ans: 'Principal n: the shell (n = 1, 2, 3, ...). Azimuthal l: the subshell within a shell (l = 0 to n−1, with letters s, p, d, f). Magnetic mₗ: the orientation of an orbital (mₗ = −l to +l). Spin mₛ: the electron\'s spin (mₛ = +½ or −½).' },
    { q: '(b) For the n = 3 shell, give the values of l and the corresponding subshells, and the maximum number of electrons in each.', marks: 2, ans: 'l = 0 → 3s subshell, max 2 electrons. l = 1 → 3p subshell, max 6 electrons. l = 2 → 3d subshell, max 10 electrons. Total for n = 3: 18 electrons.' },
    { q: '(c) Write the full electron configuration of Cr (Z = 24) and explain why it is anomalous.', marks: 2, ans: 'Cr: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹ (or [Ar] 3d⁵ 4s¹). The expected configuration based on Aufbau alone would be [Ar] 3d⁴ 4s², but the half-filled 3d⁵ subshell has extra stability that outweighs the small energy cost of moving one electron from 4s to 3d.' },
  ]},

  { title: 'Successive Ionisation Energies', marks: 7, q: 'The successive ionisation energies (in kJ mol⁻¹) of element X are: 789, 1577, 3232, 4356, 16091, 19785, 23787.', parts: [
    { q: '(a) Identify the group of X and justify your answer.', marks: 2, ans: 'Group IV. There is a large jump between IE₄ (4356) and IE₅ (16091) — a factor of about 3.7×, much larger than the typical 1.5–2× between successive IEs within the same shell. After 4 electrons have been removed easily, the 5th must come from a deeper, inner shell. Four valence electrons → Group IV.' },
    { q: '(b) Write an equation, with state symbols, for the second ionisation energy of X.', marks: 2, ans: 'X⁺(g) → X²⁺(g) + e⁻' },
    { q: '(c) Explain why each successive IE is larger than the one before it.', marks: 3, ans: 'Each electron is being removed from a species of increasingly positive charge. The remaining electrons are pulled in more tightly by the now-greater net positive charge, electron-electron repulsion is reduced, and the effective nuclear charge experienced by the electron being removed is higher. All three effects mean more energy is needed at each successive removal.' },
  ]},

  { title: 'Period 3 trends in IE', marks: 8, q: 'The first ionisation energies (kJ mol⁻¹) for some Period 3 elements are: Na 496, Mg 738, Al 578, P 1012, S 1000, Ar 1521.', parts: [
    { q: '(a) Explain the GENERAL trend across the period.', marks: 3, ans: 'First IE generally rises across the period. Nuclear charge increases by 1 per element while electrons are added to the same shell (n = 3), so shielding by inner electrons stays approximately constant. Effective nuclear charge Z_eff therefore rises, and the outer electron is pulled in more tightly, requiring more energy to remove.' },
    { q: '(b) Explain why Al has a LOWER first IE than Mg, despite Al having more protons.', marks: 2, ans: 'Mg has outer configuration 3s². Al has 3s² 3p¹. The fourth outer electron in Al is in the 3p subshell, which is HIGHER in energy than the 3s subshell (because 3p penetrates less, is more shielded). So removing an electron from 3p in Al is easier than removing one from 3s in Mg, despite Al\'s extra proton.' },
    { q: '(c) Explain why S has a lower first IE than P.', marks: 3, ans: 'P has outer config 3s² 3p³ — each of the three 3p orbitals contains one electron (Hund\'s rule), no pairing. S has 3s² 3p⁴ — the fourth 3p electron must pair up with one already in a 3p orbital. Pairing brings additional electron-electron repulsion within the same small orbital, which destabilises that paired electron. The result is that the paired 3p electron in S is easier to remove than an unpaired 3p electron in P, lowering S\'s IE₁ slightly.' },
  ]},

  { title: 'Behaviour of subatomic particles in fields', marks: 5, q: 'A beam containing protons, neutrons, and electrons passes between two parallel charged plates.', parts: [
    { q: '(a) Describe and explain the deflection of each particle.', marks: 3, ans: 'Electrons are deflected towards the positive plate and are deflected MOST because their charge-to-mass ratio (q/m) is the largest of the three (very small mass, charge of magnitude 1). Protons are deflected towards the negative plate but much LESS, since their q/m is smaller (mass ~1836× that of an electron, same charge magnitude). Neutrons are NOT deflected because they have no charge.' },
    { q: '(b) State the relationship between deflection and q/m.', marks: 1, ans: 'Deflection is directly proportional to q/m for a given accelerating voltage and field strength.' },
    { q: '(c) Explain how this principle is used in mass spectrometry.', marks: 1, ans: 'A mass spectrometer ionises atoms or molecules to give cations of known charge, accelerates them through an electric field, and then deflects them in a magnetic field. Particles of different mass deflect differently, allowing isotopes (or molecular fragments) of different mass to be separated and detected.' },
  ]},

  { title: 'Electron configurations of ions', marks: 6, q: 'Several first-row transition-metal ions are encountered in chemistry. Use Aufbau and the 4s/3d crossover to answer.', parts: [
    { q: '(a) Write the full electron configuration of a neutral Fe atom.', marks: 1, ans: 'Fe (Z = 26): 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²  (or [Ar] 3d⁶ 4s²).' },
    { q: '(b) Write the configurations of Fe²⁺ and Fe³⁺.', marks: 2, ans: 'Fe²⁺: [Ar] 3d⁶ (4s electrons removed first). Fe³⁺: [Ar] 3d⁵ (4s² removed, then one 3d).' },
    { q: '(c) Explain WHY 4s electrons are removed before 3d when forming positive ions, even though 4s fills before 3d.', marks: 3, ans: 'In a neutral atom, 4s is slightly LOWER in energy than 3d, so 4s fills first per Aufbau. However, once electrons populate the 3d subshell, the 3d level drops slightly BELOW 4s. So in the ion, the highest-energy electrons (those removed first) are now in the 4s, not the 3d. Result: 4s empties before 3d on ionisation. This is why Fe²⁺ is [Ar] 3d⁶ and not [Ar] 3d⁴ 4s².' },
  ]},
];

const worked = [
  { title: 'Electron configuration of a cation', diff: 'easy', q: 'Write the full electron configuration of Fe³⁺.', steps: [
    { label: 'STEP 1', text: 'Fe has Z = 26. Neutral atom: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² = [Ar] 3d⁶ 4s².' },
    { label: 'STEP 2', text: 'To form Fe³⁺ remove 3 electrons. Remember: 4s leaves first.' },
    { label: 'STEP 3', text: 'Remove both 4s electrons first → [Ar] 3d⁶. Then remove one 3d electron → [Ar] 3d⁵.' },
  ], ans: 'Fe³⁺: [Ar] 3d⁵' },

  { title: 'Reading successive IE data', diff: 'medium', q: 'An element\'s first six ionisation energies (kJ mol⁻¹) are 578, 1817, 2745, 11578, 14831, 18378. Identify the group.', steps: [
    { label: 'STEP 1', text: 'Look for the largest factor between consecutive IE values.' },
    { label: 'STEP 2', text: 'Ratios: IE₂/IE₁ = 3.1, IE₃/IE₂ = 1.5, IE₄/IE₃ = 4.2, IE₅/IE₄ = 1.3, IE₆/IE₅ = 1.2.' },
    { label: 'STEP 3', text: 'The largest ratio is between IE₃ and IE₄. So 3 electrons are easily removed; the 4th lies in a deeper shell.' },
    { label: 'STEP 4', text: '3 valence electrons → Group III.' },
  ], ans: 'Group III (e.g. Al). The IE₁ of 578 kJ/mol is consistent with aluminium.' },

  { title: 'First IE: explain S < P', diff: 'medium', q: 'Explain why the first ionisation energy of sulphur is lower than that of phosphorus, despite sulphur having a higher nuclear charge.', steps: [
    { label: 'STEP 1', text: 'Write the outer-shell configurations. P: 3s² 3p³. S: 3s² 3p⁴.' },
    { label: 'STEP 2', text: 'P has each of its three 3p orbitals singly occupied (Hund\'s rule) — no pairing.' },
    { label: 'STEP 3', text: 'S has one of its 3p orbitals doubly occupied — its fourth 3p electron has been forced to pair up.' },
    { label: 'STEP 4', text: 'Two electrons in the same orbital repel each other electrostatically. This raises the energy of the paired electron, making it easier to remove.' },
    { label: 'STEP 5', text: 'The pair-repulsion effect outweighs the small extra nuclear charge of S over P, giving S a slightly lower IE₁.' },
  ], ans: 'The paired 3p electron in sulphur is destabilised by electron-electron repulsion in the same orbital, lowering its IE₁ below that of phosphorus despite S having more protons.' },

  { title: 'Configuration of an anomalous TM', diff: 'easy', q: 'Deduce the electron configurations of Cu and Cu²⁺.', steps: [
    { label: 'STEP 1', text: 'Cu has Z = 29. Aufbau predicts [Ar] 3d⁹ 4s², but Cu is anomalous.' },
    { label: 'STEP 2', text: 'Actual configuration is [Ar] 3d¹⁰ 4s¹ — the full 3d subshell is extra stable.' },
    { label: 'STEP 3', text: 'For Cu²⁺ remove 2 electrons. 4s leaves first (1 electron), then one 3d.' },
  ], ans: 'Cu: [Ar] 3d¹⁰ 4s¹  ;  Cu²⁺: [Ar] 3d⁹' },

  { title: 'Quantum-number assignment', diff: 'medium', q: 'Give the four quantum numbers (n, l, mₗ, mₛ) for one of the electrons in the highest-energy occupied orbital of fluorine.', steps: [
    { label: 'STEP 1', text: 'F has Z = 9. Configuration: 1s² 2s² 2p⁵.' },
    { label: 'STEP 2', text: 'Highest-energy occupied orbitals are the 2p orbitals. So n = 2 and l = 1 for any 2p electron.' },
    { label: 'STEP 3', text: '2p has three orbitals corresponding to mₗ = −1, 0, +1. By Hund\'s rule each orbital is singly occupied first; F has 5 electrons in 2p, so two of the three orbitals are full and one has just one electron.' },
    { label: 'STEP 4', text: 'For one of the paired electrons in mₗ = −1: n = 2, l = 1, mₗ = −1, mₛ = +½ (or −½ for its partner).' },
  ], ans: 'A valid set: n = 2, l = 1, mₗ = −1, mₛ = +½. Many other valid combinations exist for F\'s 2p electrons.' },

  { title: 'Spotting the group from IE data', diff: 'hard', q: 'The first 7 IEs of element Y (kJ mol⁻¹) are: 1012, 1903, 2912, 4956, 6273, 22233, 25397. Identify the group of Y.', steps: [
    { label: 'STEP 1', text: 'Look at the ratio between successive IEs to spot the largest jump.' },
    { label: 'STEP 2', text: 'Ratios: IE₂/IE₁ = 1.88, IE₃/IE₂ = 1.53, IE₄/IE₃ = 1.70, IE₅/IE₄ = 1.27, IE₆/IE₅ = 3.54, IE₇/IE₆ = 1.14.' },
    { label: 'STEP 3', text: 'The largest jump is between IE₅ and IE₆ (ratio 3.54). So 5 electrons are removed easily; the 6th comes from a much deeper shell.' },
    { label: 'STEP 4', text: '5 valence electrons → Group V. IE₁ ≈ 1012 kJ/mol is consistent with phosphorus.' },
  ], ans: 'Y is in Group V — most likely phosphorus.' },

  { title: 'Counting orbitals and electrons', diff: 'easy', q: 'How many orbitals are in the n = 4 shell, and what is the maximum number of electrons it can hold?', steps: [
    { label: 'STEP 1', text: 'For n = 4, l can take values 0, 1, 2, 3 — that is, 4s, 4p, 4d, 4f subshells.' },
    { label: 'STEP 2', text: 'Number of orbitals per subshell: s = 1, p = 3, d = 5, f = 7. Total = 1 + 3 + 5 + 7 = 16 orbitals.' },
    { label: 'STEP 3', text: 'Each orbital holds 2 electrons. 16 × 2 = 32. Confirms the 2n² rule: 2(4²) = 32.' },
  ], ans: 'n = 4 has 16 orbitals and holds up to 32 electrons.' },

  { title: 'Why IE rises across a period', diff: 'medium', q: 'Explain why the first ionisation energy generally rises from Na to Ar across Period 3, even though atoms gain more electrons.', steps: [
    { label: 'STEP 1', text: 'Across Period 3, each successive element gains ONE proton AND one electron.' },
    { label: 'STEP 2', text: 'The added electron goes into the SAME outer shell (n = 3). It does not contribute much shielding to other 3rd-shell electrons (electrons in the same shell shield each other only weakly).' },
    { label: 'STEP 3', text: 'Inner-shell electrons (1s² 2s² 2p⁶) provide most of the shielding, and their number stays constant across Period 3. So shielding S barely changes.' },
    { label: 'STEP 4', text: 'Z_eff = Z − S therefore RISES with each step across the period. Higher Z_eff means a stronger pull on the outer electron, so harder to remove → higher IE.' },
  ], ans: 'Z increases by 1 per element; shielding stays nearly constant (added electrons go to the same shell). Effective nuclear charge rises, so IE rises.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const ATOMIC = {
  id: 'atomic',
  objectives: [
    'Describe the behaviour of sub-atomic particles in an electric field',
    'Define and use the four quantum numbers n, l, mₗ, mₛ for n = 1, 2, 3',
    'Describe the shapes of s and p orbitals',
    'Apply Aufbau, Pauli, and Hund principles to write electron configurations',
    'Write electron configurations of atoms and ions, including transition-metal ions',
    'Define ionisation energy and explain factors that affect it (nuclear charge, distance, shielding, penetration)',
    'Explain trends in IE across a period and down a group, including Al and S anomalies',
    'Deduce electronic configuration / group number from successive IE data',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through the four quantum numbers with examples for n = 3',
    'Explain the 4s/3d filling order vs ionisation order in one paragraph',
    'Why is Cr\'s configuration [Ar] 3d⁵ 4s¹ instead of 3d⁴ 4s²?',
    'Why does S have a lower first IE than P?',
    'Give me a tough past-paper style question on successive IEs',
    'What is the most common mistake students make on atomic structure?',
  ],
};
