export type FilmRenderProfile = {
  id: string;
  family: string;
  warmth: number;
  contrast: number;
  saturation: number;
  grain: number;
  halation: number;
};

type StockSignature = {
  red: number;
  green: number;
  blue: number;
  shadow: [number, number, number];
  highlight: [number, number, number];
  toe: number;
  shoulder: number;
  hueBias: number;
  grainSize: number;
  grainChroma: number;
  bwMix?: [number, number, number];
};

// These are deliberately authored creative response curves, not manufacturer
// sensitometric measurements or scans of proprietary stock data.
const signatures: Record<string, StockSignature> = {
  portra400: { red: 1.025, green: 1.005, blue: .975, shadow: [.012, .008, .018], highlight: [.025, .012, -.004], toe: .16, shoulder: .34, hueBias: -2, grainSize: 1, grainChroma: .18 },
  portra400vc: { red: 1.035, green: 1.01, blue: .975, shadow: [.01, .006, .014], highlight: [.028, .014, -.006], toe: .14, shoulder: .3, hueBias: -1, grainSize: 1, grainChroma: .2 },
  portra160nc: { red: 1.012, green: 1.006, blue: .99, shadow: [.012, .01, .018], highlight: [.018, .012, .006], toe: .2, shoulder: .42, hueBias: -1, grainSize: .8, grainChroma: .12 },
  gold100: { red: 1.055, green: 1.012, blue: .94, shadow: [.025, .012, -.006], highlight: [.035, .018, -.012], toe: .12, shoulder: .22, hueBias: 5, grainSize: .9, grainChroma: .25 },
  gold200: { red: 1.065, green: 1.018, blue: .93, shadow: [.03, .012, -.012], highlight: [.04, .02, -.014], toe: .1, shoulder: .2, hueBias: 7, grainSize: 1.15, grainChroma: .28 },
  ektar25: { red: 1.045, green: 1.025, blue: .985, shadow: [.004, .002, .012], highlight: [.012, .01, .012], toe: .08, shoulder: .16, hueBias: 1, grainSize: .55, grainChroma: .08 },
  ektar100: { red: 1.05, green: 1.03, blue: .98, shadow: [.003, .002, .012], highlight: [.012, .012, .016], toe: .08, shoulder: .16, hueBias: 1, grainSize: .65, grainChroma: .08 },
  velvia100f: { red: 1.045, green: 1.07, blue: 1.11, shadow: [-.01, .002, .018], highlight: [.012, .018, .025], toe: .05, shoulder: .12, hueBias: -2, grainSize: .55, grainChroma: .12 },
  provia400x: { red: 1.015, green: 1.035, blue: 1.045, shadow: [-.004, .004, .012], highlight: [.012, .016, .02], toe: .09, shoulder: .2, hueBias: -2, grainSize: .8, grainChroma: .1 },
  fuji400: { red: .985, green: 1.035, blue: 1.045, shadow: [-.008, .008, .018], highlight: [.004, .018, .025], toe: .14, shoulder: .28, hueBias: -4, grainSize: 1, grainChroma: .18 },
  superia200: { red: .98, green: 1.055, blue: 1.045, shadow: [-.012, .012, .022], highlight: [0, .018, .028], toe: .12, shoulder: .22, hueBias: -5, grainSize: 1.1, grainChroma: .25 },
  vision3_50d: { red: 1.008, green: 1.018, blue: 1.035, shadow: [-.008, .008, .018], highlight: [.012, .018, .026], toe: .22, shoulder: .48, hueBias: -2, grainSize: .65, grainChroma: .08 },
  vision3_250d: { red: 1.012, green: 1.018, blue: 1.028, shadow: [-.008, .008, .016], highlight: [.014, .018, .022], toe: .2, shoulder: .46, hueBias: -2, grainSize: .85, grainChroma: .1 },
  vision3_500t: { red: 1.025, green: 1.005, blue: .96, shadow: [.008, .002, .018], highlight: [.028, .012, -.004], toe: .18, shoulder: .42, hueBias: 3, grainSize: 1.35, grainChroma: .12 },
  vision3_500t_ext: { red: 1.025, green: 1.005, blue: .96, shadow: [.008, .002, .018], highlight: [.028, .012, -.004], toe: .18, shoulder: .42, hueBias: 3, grainSize: 1.35, grainChroma: .12 },
  hp5: { red: 1, green: 1, blue: 1, shadow: [.006, .006, .006], highlight: [.012, .012, .012], toe: .14, shoulder: .22, hueBias: 0, grainSize: 1.3, grainChroma: 0, bwMix: [.34, .48, .18] },
  ilford_delta400: { red: 1, green: 1, blue: 1, shadow: [.004, .004, .004], highlight: [.01, .01, .01], toe: .12, shoulder: .26, hueBias: 0, grainSize: .8, grainChroma: 0, bwMix: [.3, .59, .11] },
  tmax400: { red: 1, green: 1, blue: 1, shadow: [.002, .002, .002], highlight: [.012, .012, .012], toe: .1, shoulder: .3, hueBias: 0, grainSize: .65, grainChroma: 0, bwMix: [.3, .59, .11] },
  trix: { red: 1, green: 1, blue: 1, shadow: [.012, .012, .012], highlight: [.018, .018, .018], toe: .08, shoulder: .18, hueBias: 0, grainSize: 1.5, grainChroma: 0, bwMix: [.38, .48, .14] },
  polaroid: { red: 1.045, green: 1.01, blue: .94, shadow: [.035, .018, .006], highlight: [.025, .018, .008], toe: .28, shoulder: .52, hueBias: 4, grainSize: 1.15, grainChroma: .3 },
  lomo: { red: 1.025, green: .99, blue: .96, shadow: [.018, .008, -.008], highlight: [.01, .018, .02], toe: .06, shoulder: .16, hueBias: -3, grainSize: 1.5, grainChroma: .32 },
  '2383': { red: 1.025, green: 1.018, blue: .99, shadow: [.006, .008, .012], highlight: [.018, .018, .016], toe: .12, shoulder: .28, hueBias: 1, grainSize: .7, grainChroma: .08 },
};

function fallbackSignature(profile: FilmRenderProfile): StockSignature {
  if (profile.family === 'Black & white') return { red: 1, green: 1, blue: 1, shadow: [.006,.006,.006], highlight: [.012,.012,.012], toe: .12, shoulder: .24, hueBias: 0, grainSize: 1, grainChroma: 0, bwMix: [.3,.59,.11] };
  if (profile.family === 'Slide / reversal') return { red: 1.025, green: 1.035, blue: 1.045, shadow: [-.008,.002,.014], highlight: [.012,.018,.024], toe: .06, shoulder: .14, hueBias: -2, grainSize: .7, grainChroma: .12 };
  if (profile.family === 'Motion picture') return { red: 1.012, green: 1.018, blue: 1.028, shadow: [-.008,.008,.016], highlight: [.014,.018,.022], toe: .2, shoulder: .44, hueBias: -2, grainSize: 1, grainChroma: .1 };
  if (profile.family === 'Instant') return { red: 1.04, green: 1.015, blue: .96, shadow: [.03,.016,.006], highlight: [.025,.018,.008], toe: .26, shoulder: .5, hueBias: 3, grainSize: 1.1, grainChroma: .25 };
  if (profile.family === 'Experimental' || profile.family === 'Infrared') return { red: 1.04, green: .99, blue: .96, shadow: [.018,.006,-.008], highlight: [.012,.018,.024], toe: .08, shoulder: .16, hueBias: profile.warmth > 0 ? 5 : -4, grainSize: 1.3, grainChroma: .28 };
  if (profile.family === 'Print / output') return { red: 1.02, green: 1.018, blue: .995, shadow: [.006,.008,.012], highlight: [.018,.018,.016], toe: .12, shoulder: .28, hueBias: 1, grainSize: .7, grainChroma: .08 };
  const fuji = /fuji|superia|reala|astia|sensia|velvia|provia|eterna|acros|neopan/i.test(profile.id);
  return fuji
    ? { red: .99, green: 1.04, blue: 1.045, shadow: [-.008,.008,.018], highlight: [.004,.018,.025], toe: .13, shoulder: .26, hueBias: -4, grainSize: 1, grainChroma: .18 }
    : { red: 1.035, green: 1.012, blue: .965, shadow: [.018,.008,-.004], highlight: [.025,.014,-.004], toe: .14, shoulder: .28, hueBias: 3, grainSize: 1, grainChroma: .2 };
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, x: number) => { const t = clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const hash = (x: number, y: number, seed: number) => {
  let n = (Math.imul(x ^ seed, 374761393) + Math.imul(y ^ (seed * 31), 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};

export function applyFilmEmulation(
  frame: ImageData,
  profile: FilmRenderProfile,
  adjustments: { exposure: number; contrast: number; saturation: number; warmth: number; grain: number; halation: number },
  frameSeed = 0,
): ImageData {
  const signature = signatures[profile.id] || fallbackSignature(profile);
  const data = frame.data;
  const exposure = Math.pow(2, adjustments.exposure / 100);
  const contrast = Math.max(.25, profile.contrast + adjustments.contrast / 100);
  const saturation = Math.max(0, profile.saturation + adjustments.saturation / 100);
  const warmth = (profile.warmth + adjustments.warmth) / 100;
  const grainAmount = Math.max(0, (profile.grain + adjustments.grain / 100) * .19);
  const halationAmount = Math.max(0, (profile.halation + adjustments.halation / 100) * .11);
  const { width, height } = frame;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const originalR = data[i] / 255;
      const originalG = data[i + 1] / 255;
      const originalB = data[i + 2] / 255;
      let r = originalR * exposure;
      let g = originalG * exposure;
      let b = originalB * exposure;
      const luma = .2126*r + .7152*g + .0722*b;
      const shadow = 1 - smoothstep(.08, .52, luma);
      const highlight = smoothstep(.52, .98, luma);

      // Stock-specific negative/reversal toe and shoulder; not a generic CSS contrast filter.
      const toe = signature.toe;
      const shoulder = signature.shoulder;
      const curve = (v: number) => {
        const centered = (v - .18) * contrast + .18;
        const lifted = centered + toe * .035 * (1 - smoothstep(0, .28, centered));
        const rolled = lifted - shoulder * .16 * smoothstep(.58, 1.08, lifted);
        return clamp(rolled);
      };
      r = curve(r); g = curve(g); b = curve(b);

      r = r * signature.red + signature.shadow[0]*shadow + signature.highlight[0]*highlight;
      g = g * signature.green + signature.shadow[1]*shadow + signature.highlight[1]*highlight;
      b = b * signature.blue + signature.shadow[2]*shadow + signature.highlight[2]*highlight;

      // Warm/cool bias is split between shadows and highlights rather than a global sepia wash.
      r += warmth * (.018 + .018 * highlight);
      b -= warmth * (.012 + .008 * highlight);
      g += signature.hueBias * .00035 * (shadow - highlight);

      if (signature.bwMix) {
        const mono = originalR * signature.bwMix[0] + originalG * signature.bwMix[1] + originalB * signature.bwMix[2];
        const bw = curve(mono * exposure);
        r = g = b = bw;
      } else {
        const l = .2126*r + .7152*g + .0722*b;
        r = l + (r-l)*saturation;
        g = l + (g-l)*saturation;
        b = l + (b-l)*saturation;
      }

      // Fine grain is luminance-shaped and mostly monochromatic, with a small stock-specific chroma component.
      const grain = (hash(x, y, frameSeed + 17) - .5) * grainAmount * (0.45 + luma * .9) * signature.grainSize;
      const chromaR = (hash(x, y, frameSeed + 73) - .5) * grainAmount * signature.grainChroma * .55;
      const chromaB = (hash(x, y, frameSeed + 131) - .5) * grainAmount * signature.grainChroma * .55;
      const halo = highlight * halationAmount;
      r += grain + chromaR + halo * .045;
      g += grain + halo * .012;
      b += grain + chromaB - halo * .012;

      data[i] = Math.round(clamp(r) * 255);
      data[i + 1] = Math.round(clamp(g) * 255);
      data[i + 2] = Math.round(clamp(b) * 255);
    }
  }
  return frame;
}
