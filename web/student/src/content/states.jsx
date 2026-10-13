// States of Matter — PC-04 — full content
// ZIMSEC Form 5/6 Chemistry, Section 6.1 — Topic 4
// Syllabus coverage:
//   - Intermolecular forces (cross-references PC-03 for foundations; this topic emphasises STATE consequences)
//   - Gaseous state — kinetic theory; ideal gas; PV=nRT; deviations
//   - Liquid state
//   - Solid state — lattice structures: ionic, simple molecular, giant molecular,
//     hydrogen-bonded, metallic (NaCl, I2, ice, Cu, SiO2, diamond, graphite)
//   - Interconversion of states

/* ============================================================
   Diagram specs (Phase K3.3 migration)
   ============================================================ */

const statesParticleStatesSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "SOLID · LIQUID · GAS",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "rect",
          "x": 20,
          "y": 70,
          "w": 60,
          "h": 60,
          "color": "border",
          "stroke": 0.7
        },
        {
          "p": "circle",
          "cx": 32,
          "cy": 82,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 50,
          "cy": 82,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 68,
          "cy": 82,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 32,
          "cy": 100,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 50,
          "cy": 100,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 68,
          "cy": 100,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 32,
          "cy": 118,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 50,
          "cy": 118,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 68,
          "cy": 118,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "text",
          "x": 50,
          "y": 156,
          "text": "SOLID",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 50,
          "y": 172,
          "text": "fixed positions",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 50,
          "y": 186,
          "text": "vibrate only",
          "color": "dim",
          "size": 9
        },
        {
          "p": "rect",
          "x": 130,
          "y": 70,
          "w": 60,
          "h": 60,
          "color": "border",
          "stroke": 0.7
        },
        {
          "p": "circle",
          "cx": 145,
          "cy": 80,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 170,
          "cy": 85,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 140,
          "cy": 105,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 165,
          "cy": 100,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 180,
          "cy": 115,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 118,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 175,
          "cy": 75,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 95,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 155,
          "cy": 122,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "text",
          "x": 160,
          "y": 156,
          "text": "LIQUID",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 172,
          "text": "close, mobile",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 160,
          "y": 186,
          "text": "flow + slip",
          "color": "dim",
          "size": 9
        },
        {
          "p": "rect",
          "x": 240,
          "y": 70,
          "w": 60,
          "h": 60,
          "color": "border",
          "stroke": 0.7
        },
        {
          "p": "circle",
          "cx": 255,
          "cy": 78,
          "r": 5,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 290,
          "cy": 88,
          "r": 5,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 245,
          "cy": 115,
          "r": 5,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 280,
          "cy": 120,
          "r": 5,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "circle",
          "cx": 265,
          "cy": 95,
          "r": 5,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.31
        },
        {
          "p": "text",
          "x": 270,
          "y": 156,
          "text": "GAS",
          "color": "text",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 270,
          "y": 172,
          "text": "far apart",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 270,
          "y": 186,
          "text": "fast, random",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const statesMaxwellSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "MAXWELL-BOLTZMANN DISTRIBUTION",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 180,
          "x2": 300,
          "y2": 180,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 40,
          "x2": 40,
          "y2": 180,
          "color": "dim",
          "width": 1
        },
        {
          "p": "text",
          "x": 170,
          "y": 200,
          "text": "molecular speed →",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 28,
          "y": 110,
          "text": "N(v)",
          "color": "dim",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "path",
          "d": "M40 180 Q90 60 130 90 Q180 130 250 175 L300 180",
          "color": "#4cc9f0",
          "width": 2
        },
        {
          "p": "text",
          "x": 130,
          "y": 75,
          "text": "T₁ (cold)",
          "color": "#4cc9f0",
          "size": 10,
          "bold": true
        },
        {
          "p": "path",
          "d": "M40 180 Q110 110 170 100 Q220 95 280 175 L300 180",
          "color": "red",
          "width": 2
        },
        {
          "p": "text",
          "x": 210,
          "y": 85,
          "text": "T₂ (hot)",
          "color": "red",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 210,
          "text": "area under each curve = N (total molecules)",
          "color": "accent",
          "size": 9,
          "bold": true
        }
      ]
    }
  ]
};
const statesGasVolumeSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 180,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "MOLAR GAS VOLUME",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 50,
          "text": "1 mol gas at RTP = 24.0 dm³",
          "color": "text",
          "size": 13,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 70,
          "text": "(RTP = 25 °C, 100 kPa)",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 100,
          "text": "1 mol gas at STP = 22.4 dm³",
          "color": "text",
          "size": 13,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 120,
          "text": "(STP = 0 °C, 100 kPa)",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 150,
          "text": "n = V / 24    (at RTP, V in dm³)",
          "color": "accent",
          "size": 11,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 170,
          "text": "Or use PV = nRT for non-standard conditions",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const statesIdealRealSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "IDEAL vs REAL GAS · PV/nRT plot",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 160,
          "x2": 300,
          "y2": 160,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 40,
          "x2": 40,
          "y2": 160,
          "color": "dim",
          "width": 1
        },
        {
          "p": "text",
          "x": 170,
          "y": 185,
          "text": "pressure →",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 28,
          "y": 100,
          "text": "PV/nRT",
          "color": "dim",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 100,
          "x2": 300,
          "y2": 100,
          "color": "green",
          "width": 1.5,
          "dash": true
        },
        {
          "p": "text",
          "x": 290,
          "y": 94,
          "text": "ideal (= 1)",
          "color": "green",
          "size": 10,
          "anchor": "end"
        },
        {
          "p": "path",
          "d": "M40 100 Q100 130 160 125 Q220 90 300 60",
          "color": "red",
          "width": 2
        },
        {
          "p": "text",
          "x": 160,
          "y": 142,
          "text": "real (e.g. N₂)",
          "color": "red",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 177,
          "text": "deviation: low T high P (gases liquefy)",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const statesNaClSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 240,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "IONIC · NaCl LATTICE",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 60,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 60,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 60,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 110,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 110,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 110,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 160,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 150,
          "cy": 160,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 160,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 108,
          "cy": 52,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 158,
          "cy": 52,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 208,
          "cy": 52,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 108,
          "cy": 102,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 158,
          "cy": 102,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 208,
          "cy": 102,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 108,
          "cy": 152,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 158,
          "cy": 152,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 208,
          "cy": 152,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 116,
          "cy": 44,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 166,
          "cy": 44,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 216,
          "cy": 44,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 116,
          "cy": 94,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 166,
          "cy": 94,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 216,
          "cy": 94,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 116,
          "cy": 144,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 166,
          "cy": 144,
          "r": 13,
          "color": "text",
          "stroke": 0.5,
          "fill": "#ffbe0b",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 216,
          "cy": 144,
          "r": 8,
          "color": "text",
          "stroke": 0.5,
          "fill": "#4cc9f0",
          "fillAlpha": 0.85
        },
        {
          "p": "circle",
          "cx": 40,
          "cy": 200,
          "r": 8,
          "color": "#4cc9f0",
          "stroke": 0.7,
          "fill": "#4cc9f0"
        },
        {
          "p": "text",
          "x": 56,
          "y": 205,
          "text": "Na⁺",
          "color": "text",
          "size": 10,
          "anchor": "start"
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 200,
          "r": 13,
          "color": "#ffbe0b",
          "stroke": 0.7,
          "fill": "#ffbe0b"
        },
        {
          "p": "text",
          "x": 140,
          "y": 205,
          "text": "Cl⁻",
          "color": "text",
          "size": 10,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 160,
          "y": 228,
          "text": "each Na⁺ surrounded by 6 Cl⁻ and vice versa",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const statesI2Spec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "SIMPLE MOLECULAR · I₂",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 70,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "circle",
          "cx": 102,
          "cy": 70,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "line",
          "x1": 88,
          "y1": 70,
          "x2": 94,
          "y2": 70,
          "color": "text",
          "width": 2
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 70,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "circle",
          "cx": 222,
          "cy": 70,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "line",
          "x1": 208,
          "y1": 70,
          "x2": 214,
          "y2": 70,
          "color": "text",
          "width": 2
        },
        {
          "p": "circle",
          "cx": 140,
          "cy": 110,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "circle",
          "cx": 162,
          "cy": 110,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "line",
          "x1": 148,
          "y1": 110,
          "x2": 154,
          "y2": 110,
          "color": "text",
          "width": 2
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 150,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "circle",
          "cx": 102,
          "cy": 150,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "line",
          "x1": 88,
          "y1": 150,
          "x2": 94,
          "y2": 150,
          "color": "text",
          "width": 2
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 150,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "circle",
          "cx": 222,
          "cy": 150,
          "r": 10,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.38
        },
        {
          "p": "line",
          "x1": 208,
          "y1": 150,
          "x2": 214,
          "y2": 150,
          "color": "text",
          "width": 2
        },
        {
          "p": "text",
          "x": 160,
          "y": 185,
          "text": "strong I—I covalent bonds within molecule",
          "color": "dim",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 200,
          "text": "weak vdW BETWEEN molecules → low m.p. (114°C)",
          "color": "accent",
          "size": 10,
          "bold": true
        }
      ]
    }
  ]
};
const statesIceSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "HYDROGEN-BONDED · ICE",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 60,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 120,
          "y": 63,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 60,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 200,
          "y": 63,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 100,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 80,
          "y": 103,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 100,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 160,
          "y": 103,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 240,
          "cy": 100,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 240,
          "y": 103,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 140,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 120,
          "y": 143,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 140,
          "r": 12,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary",
          "fillAlpha": 0.25
        },
        {
          "p": "text",
          "x": 200,
          "y": 143,
          "text": "O",
          "color": "text",
          "size": 10,
          "bold": true
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 72,
          "x2": 160,
          "y2": 88,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 200,
          "y1": 72,
          "x2": 160,
          "y2": 88,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 100,
          "x2": 120,
          "y2": 72,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 100,
          "x2": 120,
          "y2": 128,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 240,
          "y1": 100,
          "x2": 200,
          "y2": 72,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 240,
          "y1": 100,
          "x2": 200,
          "y2": 128,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 128,
          "x2": 160,
          "y2": 112,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "line",
          "x1": 200,
          "y1": 128,
          "x2": 160,
          "y2": 112,
          "color": "primary",
          "width": 1,
          "dash": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 175,
          "text": "open hexagonal H-bonded network",
          "color": "text",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 192,
          "text": "density 0.92 g/cm³ — less than liquid water",
          "color": "accent",
          "size": 9,
          "bold": true
        }
      ]
    }
  ]
};
const statesDiamondSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "GIANT COVALENT · DIAMOND",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 110,
          "r": 11,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 160,
          "y": 114,
          "text": "C",
          "color": "#000",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 110,
          "x2": 160,
          "y2": 60,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 60,
          "r": 9,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 160,
          "y": 63,
          "text": "C",
          "color": "#000",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 110,
          "x2": 115,
          "y2": 140,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 115,
          "cy": 140,
          "r": 9,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 115,
          "y": 143,
          "text": "C",
          "color": "#000",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 110,
          "x2": 205,
          "y2": 140,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 205,
          "cy": 140,
          "r": 9,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 205,
          "y": 143,
          "text": "C",
          "color": "#000",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 110,
          "x2": 160,
          "y2": 165,
          "color": "text",
          "width": 1.5
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 165,
          "r": 9,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 160,
          "y": 168,
          "text": "C",
          "color": "#000",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 195,
          "text": "each C bonded to 4 others tetrahedrally (sp³)",
          "color": "text",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 211,
          "text": "m.p. >3500°C · hardest natural material · insulator",
          "color": "accent",
          "size": 10,
          "bold": true
        }
      ]
    }
  ]
};
const statesGraphiteSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "GIANT COVALENT · GRAPHITE",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 60,
          "cy": 40,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 40,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 140,
          "cy": 40,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 68,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 68,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 60,
          "cy": 96,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 96,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 140,
          "cy": 96,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "line",
          "x1": 60,
          "y1": 40,
          "x2": 100,
          "y2": 40,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 100,
          "y1": 40,
          "x2": 140,
          "y2": 40,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 60,
          "y1": 40,
          "x2": 80,
          "y2": 68,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 100,
          "y1": 40,
          "x2": 80,
          "y2": 68,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 100,
          "y1": 40,
          "x2": 120,
          "y2": 68,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 140,
          "y1": 40,
          "x2": 120,
          "y2": 68,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 68,
          "x2": 60,
          "y2": 96,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 68,
          "x2": 100,
          "y2": 96,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 68,
          "x2": 100,
          "y2": 96,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 68,
          "x2": 140,
          "y2": 96,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 130,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 130,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 130,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 100,
          "cy": 158,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 140,
          "cy": 158,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 186,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 186,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 186,
          "r": 6,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 130,
          "x2": 120,
          "y2": 130,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 130,
          "x2": 160,
          "y2": 130,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 80,
          "y1": 130,
          "x2": 100,
          "y2": 158,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 130,
          "x2": 100,
          "y2": 158,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 120,
          "y1": 130,
          "x2": 140,
          "y2": 158,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 130,
          "x2": 140,
          "y2": 158,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 100,
          "y1": 158,
          "x2": 80,
          "y2": 186,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 100,
          "y1": 158,
          "x2": 120,
          "y2": 186,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 140,
          "y1": 158,
          "x2": 120,
          "y2": 186,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "line",
          "x1": 140,
          "y1": 158,
          "x2": 160,
          "y2": 186,
          "color": "text",
          "width": 0.7
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 70,
          "r": 2,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 75,
          "r": 2,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 80,
          "r": 2,
          "color": "amber",
          "stroke": 0.7,
          "fill": "amber"
        },
        {
          "p": "text",
          "x": 250,
          "y": 75,
          "text": "π electrons delocalised",
          "color": "accent",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 250,
          "y": 88,
          "text": "across each layer",
          "color": "accent",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 250,
          "y": 155,
          "text": "layers held by",
          "color": "text",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 250,
          "y": 168,
          "text": "weak vdW",
          "color": "text",
          "size": 8,
          "anchor": "start"
        },
        {
          "p": "text",
          "x": 160,
          "y": 210,
          "text": "conducts (in plane) · slippery (layers slide) · soft",
          "color": "dim",
          "size": 9
        }
      ]
    }
  ]
};
const statesSiO2Spec = {
  "blocks": [
    {
      "type": "raw",
      "height": 200,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "GIANT COVALENT · SiO₂ (QUARTZ)",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 100,
          "r": 11,
          "color": "primary",
          "stroke": 0.7,
          "fill": "primary"
        },
        {
          "p": "text",
          "x": 160,
          "y": 104,
          "text": "Si",
          "color": "#000",
          "size": 10,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 100,
          "x2": 160.0,
          "y2": 61.75,
          "color": "text",
          "width": 1.2
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 55,
          "r": 9,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 160,
          "y": 58,
          "text": "O",
          "color": "#fff",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 100,
          "x2": 126.0,
          "y2": 121.25,
          "color": "text",
          "width": 1.2
        },
        {
          "p": "circle",
          "cx": 120,
          "cy": 125,
          "r": 9,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 120,
          "y": 128,
          "text": "O",
          "color": "#fff",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 100,
          "x2": 194.0,
          "y2": 121.25,
          "color": "text",
          "width": 1.2
        },
        {
          "p": "circle",
          "cx": 200,
          "cy": 125,
          "r": 9,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 200,
          "y": 128,
          "text": "O",
          "color": "#fff",
          "size": 9,
          "bold": true
        },
        {
          "p": "line",
          "x1": 160,
          "y1": 100,
          "x2": 160.0,
          "y2": 142.5,
          "color": "text",
          "width": 1.2
        },
        {
          "p": "circle",
          "cx": 160,
          "cy": 150,
          "r": 9,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 160,
          "y": 153,
          "text": "O",
          "color": "#fff",
          "size": 9,
          "bold": true
        },
        {
          "p": "text",
          "x": 160,
          "y": 175,
          "text": "each Si bonded to 4 O; each O bonded to 2 Si",
          "color": "text",
          "size": 10
        },
        {
          "p": "text",
          "x": 160,
          "y": 190,
          "text": "m.p. ~1700°C · insulator · sand, glass, quartz",
          "color": "accent",
          "size": 9,
          "bold": true
        }
      ]
    }
  ]
};
const statesPhaseDiagramSpec = {
  "blocks": [
    {
      "type": "raw",
      "height": 220,
      "primitives": [
        {
          "p": "text",
          "x": 160,
          "y": 16,
          "text": "PHASE DIAGRAM (water)",
          "color": "primary",
          "size": 11,
          "bold": true
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 180,
          "x2": 300,
          "y2": 180,
          "color": "dim",
          "width": 1
        },
        {
          "p": "line",
          "x1": 40,
          "y1": 40,
          "x2": 40,
          "y2": 180,
          "color": "dim",
          "width": 1
        },
        {
          "p": "text",
          "x": 170,
          "y": 200,
          "text": "temperature →",
          "color": "dim",
          "size": 9
        },
        {
          "p": "text",
          "x": 28,
          "y": 110,
          "text": "P",
          "color": "dim",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "path",
          "d": "M80 170 Q120 130 100 60",
          "color": "text",
          "width": 1.5
        },
        {
          "p": "path",
          "d": "M80 170 Q130 175 220 90",
          "color": "text",
          "width": 1.5
        },
        {
          "p": "path",
          "d": "M80 170 Q70 178 50 178",
          "color": "text",
          "width": 1.5
        },
        {
          "p": "text",
          "x": 70,
          "y": 70,
          "text": "SOLID",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 170,
          "y": 120,
          "text": "LIQUID",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "text",
          "x": 250,
          "y": 150,
          "text": "GAS",
          "color": "primary",
          "size": 10,
          "bold": true
        },
        {
          "p": "circle",
          "cx": 80,
          "cy": 170,
          "r": 3,
          "color": "red",
          "stroke": 0.7,
          "fill": "red"
        },
        {
          "p": "text",
          "x": 75,
          "y": 163,
          "text": "triple",
          "color": "red",
          "size": 9,
          "anchor": "end"
        },
        {
          "p": "circle",
          "cx": 220,
          "cy": 90,
          "r": 3,
          "color": "green",
          "stroke": 0.7,
          "fill": "green"
        },
        {
          "p": "text",
          "x": 232,
          "y": 88,
          "text": "critical",
          "color": "green",
          "size": 9,
          "anchor": "start"
        }
      ]
    }
  ]
};

/* ============================================================
   Chapters (9)
   ============================================================ */

const chapters = [
  // CH.1 — Three states overview
  { id: 'st1', title: 'The Three States — Particle View', minutes: 7, blocks: [
    { type: 'p', text: 'All matter at A-level temperatures and pressures exists as solid, liquid, or gas. The three states differ in how the particles are arranged and how freely they move. Heat is the link — adding energy fights the inter-particle forces.' },
    { type: 'd', spec: statesParticleStatesSpec, caption: 'Particle arrangement in each state' },
    { type: 'h', text: 'The summary table' },
    { type: 'ul', items: [
      'SOLID — particles in fixed lattice positions; vibrate only; definite shape and volume.',
      'LIQUID — particles close together but can slip past each other; flows; definite volume but adopts container shape.',
      'GAS — particles far apart, fast and random; fills the container completely; compressible.',
    ]},
    { type: 'h', text: 'Energy and the changes of state' },
    { type: 'ul', items: [
      'MELTING (solid → liquid) — partial breakdown of lattice; energy in.',
      'BOILING (liquid → gas) — full separation of molecules; energy in (much larger than melting).',
      'SUBLIMATION (solid → gas directly) — happens when intermolecular forces are weak relative to thermal motion (e.g. CO₂(s), I₂).',
      'CONDENSATION, FREEZING, DEPOSITION — reverse processes; energy out.',
    ]},
    { type: 'callout', kind: 'key', title: 'Why is enthalpy of vaporisation > enthalpy of fusion?', body: 'Melting only loosens the lattice — the molecules stay close. Boiling fully separates the molecules into the gas phase, against ALL the intermolecular forces. So vaporisation costs much more energy. For water: ΔH_fus = 6.0 kJ/mol vs ΔH_vap = 41 kJ/mol — almost 7× larger.' },
  ]},

  // CH.2 — Kinetic theory
  { id: 'st2', title: 'Kinetic Theory of Gases', minutes: 11, blocks: [
    { type: 'p', text: 'Kinetic theory pictures a gas as a swarm of tiny particles in constant random motion. The macroscopic behaviour we measure (pressure, temperature, volume) is a statistical average over an enormous number of particles.' },
    { type: 'h', text: 'Assumptions of an IDEAL GAS' },
    { type: 'ul', items: [
      'Particles are point masses — they have negligible volume compared to the container.',
      'Particles have NO intermolecular forces between them.',
      'Collisions between particles, and between particles and walls, are PERFECTLY ELASTIC (no kinetic energy lost).',
      'Particles are in continuous random motion.',
      'The average kinetic energy is directly proportional to absolute temperature (T in K).',
    ]},
    { type: 'callout', kind: 'definition', title: 'Pressure (kinetic-theory view)', body: 'The result of countless particle collisions with the container walls per second. More collisions, or more energetic ones, means higher pressure.' },
    { type: 'h', text: 'Maxwell-Boltzmann distribution' },
    { type: 'd', spec: statesMaxwellSpec, caption: 'Speed distribution at two temperatures' },
    { type: 'p', text: 'Gas particles do NOT all move at the same speed. There is a distribution: some move slowly, most move at moderate speed, a few move very fast. The full distribution is the Maxwell-Boltzmann curve.' },
    { type: 'ul', items: [
      'The peak of the curve is the MOST PROBABLE speed.',
      'The mean speed is slightly higher than the most probable.',
      'Higher T: peak shifts to the right and curve flattens — more fast particles, fewer slow ones.',
      'The AREA under the curve = total number of particles (constant if no particles are added/removed).',
    ]},
    { type: 'callout', kind: 'key', title: 'Why this matters for kinetics', body: 'In Reaction Kinetics (PC-08), we will draw the Maxwell-Boltzmann curve again to show why higher temperature speeds up reactions: more particles have energy ≥ activation energy. Get this picture firmly in your head now.' },
  ]},

  // CH.3 — The ideal gas equation
  { id: 'st3', title: 'The Ideal Gas Equation', minutes: 12, blocks: [
    { type: 'p', text: 'Combining Boyle\'s, Charles\'s, and Avogadro\'s laws gives the ideal gas equation. It links pressure, volume, temperature and amount of gas in a single relationship — and it works astonishingly well for most gases at room conditions.' },
    { type: 'callout', kind: 'definition', title: 'Ideal gas equation', body: 'PV = nRT  where P is pressure, V is volume, n is moles, R is the gas constant (8.314 J K⁻¹ mol⁻¹), T is temperature in KELVIN.' },
    { type: 'h', text: 'Units — must match' },
    { type: 'ul', items: [
      'P in pascals (Pa). 1 atm = 101 325 Pa = 101.325 kPa.',
      'V in m³. 1 dm³ = 10⁻³ m³, 1 cm³ = 10⁻⁶ m³.',
      'n in mol.',
      'R = 8.314 J K⁻¹ mol⁻¹.',
      'T in KELVIN. K = °C + 273.',
    ]},
    { type: 'h', text: 'Common simplifications' },
    { type: 'ul', items: [
      'AT STP (273 K, 100 kPa): 1 mole of gas occupies 22.4 dm³.',
      'AT RTP (298 K, 100 kPa): 1 mole of gas occupies 24.0 dm³.',
      'For quick answers under standard lab conditions, use n = V / 24.',
    ]},
    { type: 'h', text: 'Variations — Boyle, Charles, Avogadro' },
    { type: 'ul', items: [
      'Boyle\'s law (constant T, n): P × V = constant. Halve V → double P.',
      'Charles\'s law (constant P, n): V / T = constant. Double T (in K) → double V.',
      'Avogadro\'s law (constant P, T): V / n = constant. Double n → double V.',
    ]},
    { type: 'h', text: 'Worked: PV = nRT' },
    { type: 'p', text: 'Calculate the volume of 0.50 mol of N₂ at 27 °C and 100 kPa.' },
    { type: 'ul', items: [
      'P = 100 000 Pa. T = 27 + 273 = 300 K. n = 0.50. R = 8.314.',
      'V = nRT / P = 0.50 × 8.314 × 300 / 100 000 = 0.01247 m³.',
      'Convert: 0.01247 m³ × 1000 = 12.47 dm³.',
    ]},
    { type: 'callout', kind: 'warning', title: 'Single biggest mistake', body: 'Forgetting to convert temperature to KELVIN. Always do K = °C + 273 first. Second biggest: mixing P in kPa with V in dm³ and R in standard SI units. If P is in Pa, V must be in m³.' },
    { type: 'd', spec: statesGasVolumeSpec, caption: 'Molar volumes at standard conditions' },
    { type: 'h', text: 'Determining Mr from gas density' },
    { type: 'p', text: 'PV = nRT can be rearranged: n = m/M_r, so PV = (m/M_r)RT, giving M_r = mRT/(PV) = (m/V)·RT/P. Density ρ = m/V, so M_r = ρRT/P. Useful in lab to find molar mass from gas density measurements.' },
  ]},

  // CH.4 — Real gases
  { id: 'st4', title: 'Real Gases — Where Ideal Fails', minutes: 9, blocks: [
    { type: 'p', text: 'Real gases deviate from ideal behaviour at LOW temperatures and HIGH pressures — exactly the conditions where intermolecular forces matter and where particles are close enough to each other that their finite size is no longer negligible.' },
    { type: 'd', spec: statesIdealRealSpec, caption: 'PV/nRT departs from 1 at high P or low T' },
    { type: 'h', text: 'Why real gases deviate' },
    { type: 'ul', items: [
      'INTERMOLECULAR FORCES (vdW, dipoles) — assumed zero in ideal model. Actually, attractive forces pull molecules together → smaller volume → PV/nRT < 1.',
      'PARTICLE VOLUME — assumed negligible. Actually, at very high P, the particles\' OWN volume becomes significant compared to the container → effective space larger → PV/nRT > 1.',
    ]},
    { type: 'callout', kind: 'key', title: 'When does ideal-gas behaviour FAIL?', body: 'At LOW temperature: kinetic energy is small, intermolecular attractions dominate → gases nearly liquefy → big deviations. At HIGH pressure: molecules forced close together; their finite volumes matter; intermolecular forces strong. Between these extremes (ordinary lab conditions), the ideal gas approximation is excellent for most non-polar gases like N₂, O₂, He.' },
    { type: 'h', text: 'When ideal gas works very well' },
    { type: 'ul', items: [
      'Low pressure (atmospheric or below).',
      'Moderate to high temperature.',
      'Non-polar gases with small molecules (He, Ne, H₂, N₂, O₂).',
    ]},
    { type: 'h', text: 'When deviation is significant' },
    { type: 'ul', items: [
      'Polar gases (H₂O, NH₃) — strong dipole forces.',
      'Large molecules — significant own-volume.',
      'Gases near their boiling point — very prone to liquefying.',
    ]},
    { type: 'callout', kind: 'warning', title: 'For exam purposes', body: 'Unless the question explicitly states "non-ideal" or shows a plot, you should USE the ideal gas equation. Mention deviations only when asked, or when conditions clearly call for it (very high P, near liquefaction).' },
  ]},

  // CH.5 — Liquid state
  { id: 'st5', title: 'The Liquid State', minutes: 8, blocks: [
    { type: 'p', text: 'A liquid sits between solid and gas — particles are close together (like a solid) but free to move past one another (unlike a solid). Intermolecular forces are still important; without them, the liquid would boil away.' },
    { type: 'h', text: 'Properties of liquids' },
    { type: 'ul', items: [
      'Definite VOLUME, no fixed shape. Adopts the container.',
      'Slightly compressible (much less than gas).',
      'Density much closer to solid than to gas.',
      'Viscosity (resistance to flow) varies hugely with intermolecular forces — water is fluid, glycerol is sticky, motor oils are designed to be viscous.',
      'Surface tension — molecules at the surface have neighbours only below and to the sides; net inward pull creates a "skin".',
    ]},
    { type: 'h', text: 'Boiling vs evaporation' },
    { type: 'ul', items: [
      'EVAPORATION — happens at any temperature, only at the SURFACE; faster molecules escape into vapour.',
      'BOILING — happens at a specific temperature when the liquid\'s vapour pressure equals the surrounding atmospheric pressure; bubbles form THROUGHOUT the liquid.',
      'Boiling point depends on pressure — water boils at 100 °C at 1 atm but only ~70 °C on Mount Everest (lower atmospheric pressure).',
    ]},
    { type: 'callout', kind: 'key', title: 'Vapour pressure', body: 'In a closed container, some liquid molecules escape to vapour while others condense back. At equilibrium, the partial pressure of the vapour is the SATURATED vapour pressure. Higher T → more molecules with enough KE to escape → higher vapour pressure. When vapour pressure = external pressure, the liquid boils.' },
  ]},

  // CH.6 — Solid state: ionic and molecular
  { id: 'st6', title: 'Solid State — Ionic & Molecular Lattices', minutes: 12, blocks: [
    { type: 'p', text: 'Most solids at A-level fall into one of four lattice categories: ionic, simple molecular, giant covalent, or metallic. Each has a distinctive arrangement and a distinctive property profile.' },
    { type: 'h', text: 'IONIC LATTICE — NaCl' },
    { type: 'd', spec: statesNaClSpec, caption: 'Sodium chloride — alternating cations and anions' },
    { type: 'ul', items: [
      'Each Na⁺ is surrounded by 6 Cl⁻ (octahedral coordination); each Cl⁻ by 6 Na⁺.',
      'Strong electrostatic attraction extends throughout the lattice.',
      'High m.p. (NaCl 801 °C), high b.p., hard but BRITTLE (under stress, like-charges align and repel — lattice cleaves).',
      'Soluble in polar solvents (water can hydrate the separated ions).',
      'Conducts when MOLTEN or in solution (mobile ions). Solid: ions fixed → no conduction.',
    ]},
    { type: 'h', text: 'SIMPLE MOLECULAR — I₂' },
    { type: 'd', spec: statesI2Spec, caption: 'Iodine — discrete I₂ molecules in a soft lattice' },
    { type: 'ul', items: [
      'Discrete I₂ molecules held in a regular array by VAN DER WAALS forces only.',
      'Within each I₂: strong covalent bond.',
      'BETWEEN I₂ molecules: weak vdW.',
      'Low m.p. (I₂ 114 °C), soft, sublimes when warmed (purple vapour).',
      'Insoluble in water (non-polar); soluble in non-polar solvents (hexane, CCl₄).',
      'Does NOT conduct (no free charges).',
    ]},
    { type: 'h', text: 'HYDROGEN-BONDED MOLECULAR — ICE' },
    { type: 'd', spec: statesIceSpec, caption: 'Ice — water molecules held in an open hexagonal lattice by H-bonds' },
    { type: 'ul', items: [
      'A special case of simple molecular — H-bonds replace ordinary vdW.',
      'Each O atom hydrogen-bonds to 4 others tetrahedrally.',
      'OPEN HEXAGONAL lattice with measurable empty spaces.',
      'Density 0.92 g/cm³ — LESS than liquid water (1.00 g/cm³). Ice floats.',
      'Higher m.p. than expected for a molecule of mass 18 (compare with H₂S, b.p. −60 °C).',
    ]},
    { type: 'callout', kind: 'key', title: 'Why ice is less dense than water', body: 'In the solid, every molecule has 4 specific H-bonded partners arranged tetrahedrally. This rigid geometry creates gaps. In the liquid, molecules tumble and re-form H-bonds with various neighbours — they pack together more closely. So liquid density > ice density.' },
  ]},

  // CH.7 — Solid state: giant covalent and metallic
  { id: 'st7', title: 'Giant Covalent & Metallic Lattices', minutes: 13, blocks: [
    { type: 'h', text: 'GIANT COVALENT — DIAMOND' },
    { type: 'd', spec: statesDiamondSpec, caption: 'Diamond — every C bonded to 4 others tetrahedrally' },
    { type: 'ul', items: [
      'Every C atom is sp³ hybridised, covalently bonded to 4 others in a tetrahedral arrangement.',
      'Bonds extend throughout the entire crystal — no discrete molecules.',
      'EXTREMELY HIGH m.p. ({">"}3500 °C) — to melt, you must break C–C covalent bonds throughout the structure.',
      'Hardest natural material; used in cutting tools, drill bits.',
      'Insulator — every electron is in a localised σ bond, none free to move.',
      'Insoluble in everything.',
    ]},
    { type: 'h', text: 'GIANT COVALENT — GRAPHITE' },
    { type: 'd', spec: statesGraphiteSpec, caption: 'Graphite — hexagonal layers with delocalised π electrons' },
    { type: 'ul', items: [
      'Each C atom is sp² hybridised, covalently bonded to 3 others in a planar hexagonal sheet.',
      'The fourth electron from each C goes into a p-orbital perpendicular to the sheet — these overlap to form a DELOCALISED π system spread across the whole layer.',
      'Layers are held together by WEAK vdW forces only.',
      'CONDUCTS electricity — but only IN THE PLANE of the layers (delocalised electrons there); poor conductor perpendicular.',
      'Soft and slippery — layers slide past each other (lubricant; pencil "lead").',
      'Used in electrodes, lubricants, pencils, structural composites.',
    ]},
    { type: 'h', text: 'GIANT COVALENT — SILICON DIOXIDE (SiO₂)' },
    { type: 'd', spec: statesSiO2Spec, caption: 'Quartz — Si tetrahedrally bonded to 4 O' },
    { type: 'ul', items: [
      'Si bonded to 4 O atoms tetrahedrally; each O bridges to 2 Si.',
      'Empirical formula SiO₂ (Si:O = 1:2).',
      'Found in sand, quartz, glass.',
      'Very high m.p. (~1700 °C); insulator; insoluble.',
    ]},
    { type: 'h', text: 'METALLIC LATTICE — Cu, Fe, Mg' },
    { type: 'ul', items: [
      'Lattice of cations in a "sea" of delocalised valence electrons.',
      'High m.p. (Cu 1085 °C, Fe 1538 °C); densities high; lustrous.',
      'Conducts heat AND electricity even when SOLID — delocalised electrons are mobile.',
      'Malleable and ductile — layers slide; electron sea adapts.',
      'Metallic-bond strength depends on charge density of cation and number of valence electrons donated.',
    ]},
    { type: 'callout', kind: 'key', title: 'Diamond vs Graphite — same element, very different properties', body: 'Both are giant covalent allotropes of pure carbon. Diamond: 4 σ-bonds per C, no free electrons → hardest, insulator. Graphite: 3 σ-bonds per C + 1 delocalised π electron → conducts in the plane, slippery. The structural difference (3-D network vs 2-D layers) drives all the property differences.' },
  ]},

  // CH.8 — Interconversion of states
  { id: 'st8', title: 'Interconversion of States — Phase Diagrams', minutes: 8, blocks: [
    { type: 'p', text: 'A phase diagram shows which state is stable at each combination of temperature and pressure. The lines on the diagram are PHASE BOUNDARIES — at any point on a line, two phases coexist in equilibrium.' },
    { type: 'd', spec: statesPhaseDiagramSpec, caption: 'Schematic phase diagram (water-like)' },
    { type: 'h', text: 'Key features' },
    { type: 'ul', items: [
      'TRIPLE POINT — single (T, P) where solid, liquid and gas all coexist. For water: 0.01 °C, 0.6 kPa.',
      'CRITICAL POINT — beyond this T, no amount of pressure can liquefy the gas. Above critical, the substance is a "supercritical fluid".',
      'NORMAL MELTING POINT — temperature on the solid-liquid line at 1 atm pressure.',
      'NORMAL BOILING POINT — temperature on the liquid-gas line at 1 atm pressure.',
    ]},
    { type: 'h', text: 'Water is unusual' },
    { type: 'p', text: 'For most substances, the solid-liquid line slopes slightly to the RIGHT (higher P → higher m.p.). For water, the line slopes to the LEFT (higher P → LOWER m.p.). Why? Because ice is less dense than liquid water — applying pressure pushes water to the denser phase, which is LIQUID, not solid. This is why ice skating works.' },
    { type: 'h', text: 'Sublimation' },
    { type: 'p', text: 'If atmospheric pressure is below the triple point pressure, the substance has NO liquid phase at that pressure — solid sublimes directly to gas. CO₂ at 1 atm has a triple point at 5.1 atm, so dry ice (CO₂(s)) sublimes rather than melting under normal conditions.' },
  ]},

  // CH.9 — Strategy
  { id: 'st9', title: 'Strategy & Property-Structure Mapping', minutes: 8, blocks: [
    { type: 'p', text: 'Most "states of matter" questions test three things: identifying lattice type from properties, applying PV=nRT, and explaining behaviour from particle pictures. A few habits clean up most marks.' },
    { type: 'h', text: 'Diagnostic — given m.p./conductivity/solubility, identify the lattice' },
    { type: 'ul', items: [
      'Very high m.p. + non-conductor (or graphite-conducts-in-plane) → GIANT COVALENT.',
      'High m.p. + conducts in solid + malleable → METALLIC.',
      'High m.p. + conducts when molten/aq only → IONIC.',
      'Low m.p. + non-conductor → SIMPLE MOLECULAR (with possible H-bonds if extra-high b.p. for size).',
    ]},
    { type: 'h', text: 'PV = nRT — recipe' },
    { type: 'ul', items: [
      '1. Convert ALL units: T to K, P to Pa, V to m³ (or use kPa with V in dm³ if R is the convenient form).',
      '2. Identify the unknown — usually V, T, n, or sometimes a missing P.',
      '3. Substitute and solve.',
      '4. Convert the answer back to the question\'s preferred unit (often dm³).',
    ]},
    { type: 'h', text: 'Comparing two states or two substances — be precise' },
    { type: 'ul', items: [
      'Always say which forces are strong/weak and what they\'re between (e.g. "vdW BETWEEN I₂ molecules", "covalent bonds WITHIN diamond"). Distinguish intra- from inter-molecular.',
      'For physical-property questions, name the lattice type.',
      'For boiling-point trends, identify the IMF (vdW, dipole-dipole, H-bond) and compare strengths.',
    ]},
    { type: 'callout', kind: 'key', title: 'A common trap', body: 'When asked "explain why diamond has a high m.p.", do NOT say "strong intermolecular forces". Diamond has NO intermolecular forces — the entire crystal is ONE molecule, held by covalent bonds. Saying "strong covalent bonds throughout the structure" earns the mark.' },
  ]},
];

/* ============================================================
   Quiz banks
   ============================================================ */

const quizzes = [
  { q: 'Which state has particles in fixed positions vibrating only?', opts: ['Solid', 'Liquid', 'Gas', 'Plasma'], ans: 0, hint: 'Lattice held tight.' },
  { q: 'Why is enthalpy of vaporisation greater than enthalpy of fusion?', opts: ['Vapour is heavier', 'Boiling separates molecules entirely; melting only loosens the lattice', 'Fusion releases heat', 'Vapour pressure is lower'], ans: 1, hint: 'Boiling breaks ALL the IMFs; melting just disrupts the order.' },
  { q: 'In an IDEAL gas, particles are assumed to:', opts: ['Have significant volume', 'Have NO intermolecular forces', 'Move at the same speed', 'Lose energy on collision'], ans: 1, hint: 'Key assumption.' },
  { q: 'Real gases deviate most from ideal behaviour at:', opts: ['Low P, high T', 'High P, low T', 'High T, atmospheric P', 'STP'], ans: 1, hint: 'Where IMFs and finite size matter most.' },
  { q: 'In the Maxwell-Boltzmann distribution at higher T:', opts: ['Curve gets taller and narrower', 'Curve flattens and shifts right', 'Peak shifts left', 'Total area changes'], ans: 1, hint: 'More molecules at higher speeds.' },
  { q: 'PV = nRT requires temperature in:', opts: ['°C', 'K', 'F', 'Either'], ans: 1, hint: 'Always Kelvin.' },
  { q: 'R = 8.314 J K⁻¹ mol⁻¹. With this R, V must be in:', opts: ['cm³', 'dm³', 'm³', 'L'], ans: 2, hint: 'SI consistency.' },
  { q: 'Volume of 1 mol gas at RTP:', opts: ['22.4 dm³', '24.0 dm³', '12.0 dm³', '101 dm³'], ans: 1, hint: 'RTP = 25°C, 100 kPa.' },
  { q: 'Calculate V of 0.50 mol gas at 300 K and 100 kPa:', opts: ['0.625 dm³', '12.5 dm³', '125 dm³', '24 dm³'], ans: 1, hint: 'V=nRT/P; convert m³→dm³.' },
  { q: 'Boyle\'s law states (at constant T, n):', opts: ['V/T constant', 'PV constant', 'P/n constant', 'V × T constant'], ans: 1, hint: 'Inverse P-V at fixed T.' },
  { q: 'For most gases, the ideal-gas approximation is best at:', opts: ['Very high P, very low T', 'Low P, moderate-to-high T', 'Below boiling point', 'In space only'], ans: 1, hint: 'IMFs negligible, particles dispersed.' },
  { q: 'A liquid boils when:', opts: ['Bubbles appear at the bottom', 'Vapour pressure equals external pressure', 'Temperature reaches 100°C', 'It evaporates from the surface'], ans: 1, hint: 'Definition of boiling.' },
  { q: 'Surface tension is caused by:', opts: ['Heat at the surface', 'Net inward pull on surface molecules (no neighbours above)', 'Repulsion from air', 'Density difference'], ans: 1, hint: 'Asymmetric IMFs at the surface.' },
  { q: 'Which solid has discrete molecules held by vdW only?', opts: ['Diamond', 'NaCl', 'Iodine', 'Cu'], ans: 2, hint: 'Simple molecular = discrete molecules.' },
  { q: 'NaCl has high m.p. because:', opts: ['Na is heavy', 'Strong electrostatic forces between Na⁺ and Cl⁻ throughout the lattice', 'Cl is reactive', 'It has covalent bonds'], ans: 1, hint: 'Ionic lattice forces.' },
  { q: 'Why doesn\'t solid NaCl conduct electricity?', opts: ['Lattice has no electrons', 'Ions are fixed in lattice positions', 'Na⁺ has no charge', 'It\'s an insulator material'], ans: 1, hint: 'Ions cannot move in solid.' },
  { q: 'Diamond has very high m.p. because:', opts: ['Strong intermolecular forces', 'Covalent bonds throughout the giant lattice — must break to melt', 'It is heavy', 'It has H-bonds'], ans: 1, hint: 'Whole crystal is one molecule.' },
  { q: 'Graphite conducts electricity because:', opts: ['It has ions', 'Each C contributes one delocalised electron in a π system within layers', 'Layers are charged', 'It is a metal'], ans: 1, hint: 'Delocalised π electrons in plane.' },
  { q: 'Why is graphite slippery?', opts: ['Hard sheets', 'Layers held by weak vdW; they slide past each other', 'Surface is smooth', 'High m.p.'], ans: 1, hint: 'Inter-layer forces are weak.' },
  { q: 'In SiO₂, the ratio of Si to O is:', opts: ['1:1', '1:2', '2:1', '1:4'], ans: 1, hint: 'Each Si surrounded by 4 O; each O bridges 2 Si.' },
  { q: 'Why is ice less dense than liquid water?', opts: ['It has more H₂O', 'Open hexagonal H-bonded lattice has gaps; liquid packs more tightly', 'Water boils', 'Ice has fewer molecules'], ans: 1, hint: 'Crystal structure.' },
  { q: 'In ice, each O atom is hydrogen-bonded to:', opts: ['2 other O', '4 other O', '6 other O', 'No others'], ans: 1, hint: 'Tetrahedral arrangement.' },
  { q: 'Metallic conductivity persists in the SOLID state because:', opts: ['Ions are mobile', 'Delocalised electrons can move freely throughout the lattice', 'Metals have no charges', 'Lattice expands'], ans: 1, hint: 'Sea of mobile electrons.' },
  { q: 'Mg has higher m.p. than Na because:', opts: ['Mg is heavier', 'Mg²⁺ has higher charge AND donates 2 valence e⁻ to the sea', 'Mg has more isotopes', 'Mg is harder'], ans: 1, hint: 'Stronger metallic bonding.' },
  { q: 'A substance has m.p. 1538 °C, conducts as solid, malleable. It is:', opts: ['Ionic', 'Simple molecular', 'Giant covalent', 'Metallic'], ans: 3, hint: 'Conducts as solid + malleable.' },
  { q: 'A white solid melts at 801 °C, conducts when molten only. Bonding type:', opts: ['Ionic', 'Simple molecular', 'Giant covalent', 'Metallic'], ans: 0, hint: 'Conducts only when ions are mobile.' },
  { q: 'On a phase diagram, the triple point is where:', opts: ['Solid melts', 'All three states coexist in equilibrium', 'Gas condenses', 'P = atmospheric'], ans: 1, hint: 'Three phase boundaries meet.' },
  { q: 'Above the critical point:', opts: ['Substance becomes a solid', 'Substance becomes a "supercritical fluid"; gas cannot be liquefied by pressure alone', 'P increases without limit', 'No matter exists'], ans: 1, hint: 'Supercritical state.' },
  { q: 'CO₂ sublimes at 1 atm because:', opts: ['It is light', 'Its triple point pressure (5.1 atm) is above 1 atm — no liquid possible at 1 atm', 'It does not melt', 'It is a noble gas'], ans: 1, hint: 'Phase diagram interpretation.' },
  { q: 'For water, increasing pressure on ice tends to:', opts: ['Raise the melting point', 'Lower the melting point (because liquid water is denser than ice)', 'Convert directly to gas', 'Have no effect'], ans: 1, hint: 'Density inversion → unusual slope.' },
];

const structured = [
  { title: 'Kinetic theory and ideal gases', marks: 8, q: 'Use kinetic theory to answer the following.', parts: [
    { q: '(a) State THREE assumptions of an ideal gas.', marks: 3, ans: '(1) Particles have negligible volume compared to the container. (2) There are NO intermolecular forces between particles. (3) Collisions between particles, and with the container walls, are perfectly elastic (no kinetic energy lost). Also acceptable: particles are in continuous random motion; average KE is proportional to absolute temperature.' },
    { q: '(b) Sketch the Maxwell-Boltzmann distribution at two different temperatures (T₂ > T₁) on the same axes. Label peaks.', marks: 3, ans: 'Both curves start at origin (no particles with zero KE) and rise to a peak before tailing off to the right. T₂ curve has a LOWER, FLATTER peak shifted to the RIGHT compared to T₁. The two curves enclose the same total area (same number of particles). Area to the right of any energy threshold (e.g. activation energy) is greater for T₂.' },
    { q: '(c) Explain why a real gas deviates most from ideal behaviour at low temperatures and high pressures.', marks: 2, ans: 'At LOW T: kinetic energy is reduced and intermolecular attractive forces (vdW, dipoles) become significant compared to KE — the assumption "no IMFs" breaks down and PV/nRT falls below 1. At HIGH P: particles are forced close together; their finite particle volume becomes significant compared to the container volume, and attractions between them are stronger — the ideal-gas assumptions both fail.' },
  ]},

  { title: 'Using PV = nRT', marks: 7, q: '0.250 mol of an unknown gas occupies 6.50 dm³ at 25 °C and 100 kPa.', parts: [
    { q: '(a) Verify whether the gas is behaving ideally.', marks: 3, ans: 'Use PV = nRT. P = 100 000 Pa, V = 6.50 × 10⁻³ m³, T = 298 K, R = 8.314. Calculated n = PV/RT = 100 000 × 6.50 × 10⁻³ / (8.314 × 298) = 650 / 2478 = 0.262 mol. Stated n = 0.250 mol. The 5 % discrepancy is small enough to be within experimental error or to indicate slight non-ideality, so the gas is approximately ideal under these conditions.' },
    { q: '(b) Calculate the volume the same gas would occupy at STP (273 K, 100 kPa).', marks: 2, ans: 'At constant n and P: V₁/T₁ = V₂/T₂ (Charles\'s law). V₂ = V₁ × T₂/T₁ = 6.50 × 273/298 = 5.95 dm³.' },
    { q: '(c) State and explain how the volume would change if the temperature was raised to 100 °C at constant pressure.', marks: 2, ans: 'Volume INCREASES (Charles\'s law). T₃ = 373 K. V₃ = V₁ × T₃/T₁ = 6.50 × 373/298 = 8.13 dm³. Higher T means greater average KE; particles strike walls harder/more often, so to maintain constant P, the container must expand.' },
  ]},

  { title: 'Lattice type from properties', marks: 9, q: 'Four substances W, X, Y, Z have the following data. Identify the bonding type and give an example of each.', parts: [
    { q: '(a) W: m.p. 1538 °C, conducts as solid AND when molten, malleable, lustrous.', marks: 2, ans: 'METALLIC bonding. Sea of delocalised electrons explains conduction in both states; non-directional bonding allows malleability. Example: iron, Fe.' },
    { q: '(b) X: m.p. 801 °C, white crystalline solid, no conductivity solid, conducts when molten or in aqueous solution, soluble in water.', marks: 2, ans: 'IONIC. Strong electrostatic lattice gives high m.p.; ions immobile in solid (no conduction) but free to move when molten or dissolved (conduction). Polar solvent dissolves it. Example: NaCl.' },
    { q: '(c) Y: m.p. 114 °C, soft purple-black solid, sublimes on warming, no conductivity, soluble in hexane but not water.', marks: 2, ans: 'SIMPLE MOLECULAR. Low m.p. and softness consistent with weak vdW between discrete molecules; non-conductor (no free charges); soluble in non-polar solvents. Example: I₂.' },
    { q: '(d) Z: m.p. > 3500 °C, hardest natural material, insulator, insoluble in everything.', marks: 3, ans: 'GIANT COVALENT (macromolecular). Every C atom covalently bonded to 4 others throughout a 3-D tetrahedral lattice; melting requires breaking covalent bonds (very high m.p.); all electrons localised in σ bonds (insulator); no IMFs to overcome for solubility (insoluble). Example: diamond.' },
  ]},

  { title: 'Diamond, graphite, ice — three special structures', marks: 9, q: 'Compare diamond, graphite, and ice as solid lattices.', parts: [
    { q: '(a) Diamond and graphite are both pure carbon. Explain how their structures differ and why diamond is hard but graphite is soft.', marks: 3, ans: 'Diamond: each C is sp³, bonded to 4 others in a 3-D tetrahedral network of covalent bonds. To deform diamond, many strong covalent bonds must break — extremely hard. Graphite: each C is sp² with 3 covalent bonds in a planar hexagonal layer; the fourth electron is delocalised in a π system across the layer. The LAYERS are held to each other only by weak vdW. Layers slide easily past each other → soft and slippery.' },
    { q: '(b) Explain why graphite conducts electricity but diamond does not.', marks: 2, ans: 'Graphite has one delocalised π electron per C, free to move within the plane of each layer — these mobile charges carry electric current along the layers. In diamond, every electron is localised in a σ bond between two specific C atoms — no free electrons, so diamond is an insulator.' },
    { q: '(c) Describe the structure of ice and explain why ice has a lower density than liquid water.', marks: 4, ans: 'In ice, each H₂O molecule forms FOUR hydrogen bonds, arranged tetrahedrally — two from its O lone pairs to neighbouring H, and two from its H to lone pairs on neighbouring O atoms. This forms a regular OPEN HEXAGONAL lattice with measurable empty spaces between molecules. In liquid water, H-bonds are constantly breaking and re-forming; molecules tumble and pack more closely without the rigid tetrahedral constraint. Less empty space → higher density. Therefore ice (0.92 g/cm³) is less dense than water (1.00 g/cm³), so ice floats.' },
  ]},

  { title: 'Phase changes and IMFs', marks: 8, q: 'Boiling points (°C): CH₄ −161; SiH₄ −112; H₂O 100; H₂S −60; HF 19; HCl −85.', parts: [
    { q: '(a) Explain why CH₄ has a lower b.p. than SiH₄ even though both are non-polar.', marks: 2, ans: 'Both molecules are non-polar (4 X–H bonds, tetrahedral, dipoles cancel) so only van der Waals forces operate between molecules. SiH₄ has more electrons than CH₄ (Si has 14 vs C 6 in valence + core), so its electron cloud is more polarisable → stronger temporary-dipole attractions → higher b.p.' },
    { q: '(b) Explain why H₂O has a much higher b.p. than H₂S, despite both being Group VI hydrides.', marks: 3, ans: 'Both molecules are bent and polar. However, H₂O molecules form HYDROGEN BONDS — H bonded to highly electronegative O can interact with a lone pair on O of a neighbouring molecule. H-bonds are much stronger than the ordinary dipole-dipole forces in H₂S (S is not electronegative enough for true H-bonding). So significantly more energy is needed to vaporise water — much higher b.p.' },
    { q: '(c) Predict and justify whether HF or HCl has stronger intermolecular forces.', marks: 2, ans: 'HF has stronger intermolecular forces because F is highly electronegative AND has lone pairs, so HF molecules H-bond. HCl is polar but Cl is not electronegative enough for true H-bonding; HCl shows only permanent dipole-dipole forces. The b.p. data confirm: HF (19 °C) >> HCl (−85 °C).' },
    { q: '(d) Sketch and label two water molecules H-bonded to each other.', marks: 1, ans: 'Two H₂O molecules; the H of one (δ+) points towards a lone pair on the O of the second (δ−); the H-bond is drawn as a dotted line; ordinary covalent O–H bonds are solid lines. Roughly: O–H ≈ 96 pm (covalent), H ··· O ≈ 180 pm (H-bond).' },
  ]},
];

const worked = [
  { title: 'Apply PV = nRT', diff: 'easy', q: 'A gas at 100 kPa and 27 °C contains 0.50 mol. Calculate its volume.', steps: [
    { label: 'STEP 1', text: 'Convert units. P = 100 000 Pa, T = 27 + 273 = 300 K, n = 0.50, R = 8.314.' },
    { label: 'STEP 2', text: 'V = nRT/P = 0.50 × 8.314 × 300 / 100 000 = 1247.1 / 100 000.' },
    { label: 'STEP 3', text: 'V = 0.01247 m³ = 12.47 dm³.' },
  ], ans: 'V ≈ 12.5 dm³.' },

  { title: 'Find Mr from gas density', diff: 'medium', q: 'A gas has density 1.96 g/dm³ at 100 kPa and 25 °C. Calculate its relative molecular mass.', steps: [
    { label: 'STEP 1', text: 'Use M = ρRT/P. Convert to SI: ρ = 1.96 g/dm³ = 1960 g/m³ = 1.96 kg/m³. T = 298 K. P = 100 000 Pa.' },
    { label: 'STEP 2', text: 'M = ρRT/P = 1.96 × 8.314 × 298 / 100 000 (working in kg/mol because ρ is kg/m³).' },
    { label: 'STEP 3', text: 'M = 4856 / 100 000 = 0.04856 kg/mol = 48.56 g/mol.' },
  ], ans: 'Mᵣ ≈ 48.6 (likely ozone, O₃, Mᵣ = 48).' },

  { title: 'Volume change with temperature', diff: 'easy', q: 'A 250 cm³ sample of gas at 25 °C is heated to 100 °C at constant pressure. What is the new volume?', steps: [
    { label: 'STEP 1', text: 'Apply Charles\'s law: V₁/T₁ = V₂/T₂.' },
    { label: 'STEP 2', text: 'T₁ = 298 K, T₂ = 373 K, V₁ = 250 cm³.' },
    { label: 'STEP 3', text: 'V₂ = V₁ × T₂/T₁ = 250 × 373/298 = 313 cm³.' },
  ], ans: 'V₂ ≈ 313 cm³.' },

  { title: 'Identify lattice type', diff: 'medium', q: 'A solid has m.p. 1083 °C, conducts electricity in the solid state, is malleable, and has a metallic shine. What is the lattice type? Suggest the substance.', steps: [
    { label: 'STEP 1', text: 'Conducts in solid state — only metallic substances do this (graphite is the exception, but it is not malleable and not "shiny" in the metallic sense).' },
    { label: 'STEP 2', text: 'High m.p. (1083 °C) consistent with a strong metallic bond.' },
    { label: 'STEP 3', text: 'Malleable + metallic lustre confirm metallic bonding.' },
    { label: 'STEP 4', text: 'm.p. 1083 °C strongly suggests copper (Cu) — known m.p. value.' },
  ], ans: 'Metallic lattice. Substance is copper (Cu).' },

  { title: 'Why ice floats', diff: 'medium', q: 'Explain in terms of structure and bonding why ice has a lower density than liquid water.', steps: [
    { label: 'STEP 1', text: 'In ice, every H₂O molecule forms 4 hydrogen bonds with neighbours, in a fixed tetrahedral geometry.' },
    { label: 'STEP 2', text: 'This produces an open hexagonal lattice with measurable empty space between molecules.' },
    { label: 'STEP 3', text: 'In liquid water, H-bonds form and break continuously; molecules can pack closer together without the rigid tetrahedral constraint.' },
    { label: 'STEP 4', text: 'Less empty space in liquid → higher density. Ice (0.92 g/cm³) is less dense than water (1.00 g/cm³). Therefore ice floats.' },
  ], ans: 'Ice has an open H-bonded hexagonal lattice with gaps; liquid water packs more tightly → liquid is denser than ice.' },

  { title: 'Compare diamond and graphite', diff: 'medium', q: 'Both diamond and graphite are pure carbon. Explain why diamond is hard and an insulator while graphite is soft and conducts electricity.', steps: [
    { label: 'STEP 1', text: 'Diamond: each C is sp³, bonded to 4 others by σ bonds in a 3-D tetrahedral network. Bonds extend throughout the crystal in all directions.' },
    { label: 'STEP 2', text: 'Diamond is HARD because deforming it requires breaking many strong covalent bonds. It is an INSULATOR because every valence electron is localised in a specific σ bond.' },
    { label: 'STEP 3', text: 'Graphite: each C is sp², bonded to 3 others by σ bonds in a planar hexagonal layer. The 4th valence electron per C is delocalised in a π system across each layer.' },
    { label: 'STEP 4', text: 'Layers held by weak vdW only — they slide easily, so graphite is SOFT/SLIPPERY. Delocalised π electrons move freely IN the plane of each layer → graphite CONDUCTS electricity (in-plane).' },
  ], ans: 'Diamond: 3-D σ network → hard, insulator. Graphite: 2-D σ layers + delocalised π → conducts in-plane, soft.' },

  { title: 'Real gas deviation', diff: 'medium', q: 'At 100 atm and 25 °C, the volume of 1 mol of N₂ is measured as 0.234 dm³. The ideal-gas prediction is 0.245 dm³. Explain the discrepancy.', steps: [
    { label: 'STEP 1', text: 'Real volume (0.234 dm³) is LESS than the ideal-gas prediction (0.245 dm³). PV/nRT = (100 × 101.325 × 0.000234) / (8.314 × 298) ≈ 0.96 < 1.' },
    { label: 'STEP 2', text: 'PV/nRT < 1 means the gas occupies less volume than ideal. This indicates that ATTRACTIVE intermolecular forces are dominating — molecules are pulled slightly closer than independent particles would be.' },
    { label: 'STEP 3', text: 'At 100 atm, the high pressure has compressed molecules close enough that their weak vdW attractions become noticeable.' },
    { label: 'STEP 4', text: 'At even higher pressure, the deviation could reverse — the finite particle volume could push V above the ideal prediction (PV/nRT > 1).' },
  ], ans: 'PV/nRT < 1 because attractive vdW forces between N₂ molecules cause slight compression below the ideal gas prediction at 100 atm.' },

  { title: 'CO₂ phase behaviour', diff: 'hard', q: 'Explain why solid CO₂ ("dry ice") sublimes rather than melting at atmospheric pressure.', steps: [
    { label: 'STEP 1', text: 'Sublimation = solid going directly to gas, without passing through the liquid state.' },
    { label: 'STEP 2', text: 'For CO₂, the triple point is at 5.1 atm and −56.6 °C. Below 5.1 atm, NO liquid phase exists at any temperature.' },
    { label: 'STEP 3', text: 'At 1 atm (atmospheric pressure), the line of constant P intersects only the solid-gas boundary, not the solid-liquid or liquid-gas boundaries.' },
    { label: 'STEP 4', text: 'So as solid CO₂ is warmed at 1 atm, it converts directly to gas at −78.5 °C.' },
  ], ans: 'CO₂\'s triple-point pressure (5.1 atm) is above atmospheric (1 atm). At 1 atm, no liquid exists at any temperature — the solid sublimes directly to gas.' },
];

/* ============================================================
   Exported module
   ============================================================ */
export const STATES = {
  id: 'states',
  objectives: [
    'Describe particle arrangement in solid, liquid, and gas',
    'State assumptions of an ideal gas; explain real-gas deviations',
    'Apply PV = nRT in calculations of P, V, T, n, and Mᵣ',
    'Sketch and interpret the Maxwell-Boltzmann distribution',
    'Distinguish ionic, simple molecular, giant covalent, hydrogen-bonded, and metallic lattices',
    'Describe and contrast NaCl, I₂, ice, diamond, graphite, SiO₂, and metals (e.g. Cu)',
    'Link bonding type to physical properties (m.p., conductivity, hardness, solubility)',
    'Interpret phase diagrams (triple point, critical point, normal m.p./b.p.)',
  ],
  chapters,
  quizzes,
  multi: [],
  structured,
  worked,
  tutorPrompts: [
    'Walk me through identifying lattice type from melting point and conductivity data',
    'Explain why ice is less dense than liquid water in terms of bonding',
    'Compare diamond, graphite and SiO₂ — same family, different properties',
    'Why does PV = nRT need temperature in Kelvin?',
    'Give me a tough past-paper problem on gas calculations',
  ],
};

