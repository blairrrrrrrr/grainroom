export type FilmRenderProfile = {
  id: string;
  family: string;
  warmth: number;
  contrast: number;
  saturation: number;
  grain: number;
  halation: number;
};

type StockResponse = {
  red: number;
  green: number;
  blue: number;
  shadow: [number, number, number];
  highlight: [number, number, number];
  toe: number;
  shoulder: number;
  hueBias: number;
  grainScale: number;
  chromaGrain: number;
  bwMix?: [number, number, number];
  special?: 'redscale' | 'aerochrome' | 'technicolor' | 'bleach' | 'crossprocess' | 'turquoise';
};

type BuiltInLut = { size: number; values: Float32Array };
const LUT_SIZE = 17;
const lutCache = new Map<string, BuiltInLut>();
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const hash = (x: number, y: number, seed: number) => {
  let n = (Math.imul(x ^ seed, 374761393) + Math.imul(y ^ (seed * 31), 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};

function responseFor(profile: FilmRenderProfile): StockResponse {
  const id = profile.id.toLowerCase();
  const family = profile.family;
  const response: StockResponse = {
    red: 1.025, green: 1.012, blue: .982,
    shadow: [.012, .006, .012], highlight: [.018, .012, .004],
    toe: .15, shoulder: .3, hueBias: profile.warmth * .35,
    grainScale: 1, chromaGrain: .18,
  };

  if (family === 'Slide / reversal') {
    Object.assign(response, { red: 1.015, green: 1.025, blue: 1.04, shadow: [-.006, .002, .018], highlight: [.006, .012, .022], toe: .055, shoulder: .13, grainScale: .72, chromaGrain: .1 });
  } else if (family === 'Motion picture') {
    Object.assign(response, { red: 1.008, green: 1.018, blue: 1.026, shadow: [-.006, .006, .014], highlight: [.012, .016, .02], toe: .22, shoulder: .46, grainScale: 1.05, chromaGrain: .09 });
  } else if (family === 'Black & white') {
    Object.assign(response, { red: 1, green: 1, blue: 1, shadow: [.004, .004, .004], highlight: [.008, .008, .008], toe: .12, shoulder: .24, grainScale: 1.1, chromaGrain: 0, bwMix: [.3, .59, .11] });
  } else if (family === 'Instant') {
    Object.assign(response, { red: 1.035, green: 1.012, blue: .965, shadow: [.026, .014, .004], highlight: [.02, .014, .006], toe: .27, shoulder: .5, grainScale: 1.15, chromaGrain: .25 });
  } else if (family === 'Print / output') {
    Object.assign(response, { red: 1.02, green: 1.018, blue: .998, shadow: [.006, .008, .012], highlight: [.016, .016, .014], toe: .12, shoulder: .3, grainScale: .65, chromaGrain: .08 });
  } else if (family === 'Infrared') {
    Object.assign(response, { red: 1.04, green: .99, blue: .97, shadow: [.014, .004, -.008], highlight: [.012, .016, .024], toe: .08, shoulder: .18, grainScale: .95, chromaGrain: .12 });
  } else if (family === 'Experimental') {
    Object.assign(response, { red: 1.035, green: 1.005, blue: .97, shadow: [.018, .006, -.006], highlight: [.018, .012, .006], toe: .09, shoulder: .2, grainScale: 1.2, chromaGrain: .26 });
  }

  if (/portra|ektacolorpro|natura|astia/.test(id)) {
    Object.assign(response, { red: 1.018, green: 1.008, blue: .99, shadow: [.014, .01, .018], highlight: [.018, .014, .01], toe: .19, shoulder: .4, grainScale: .82, chromaGrain: .1 });
  }
  if (/gold|kodacolor|ferrania_solaris|agfa_optima|lomography|color92/.test(id)) {
    Object.assign(response, { red: 1.055, green: 1.018, blue: .955, shadow: [.025, .012, -.008], highlight: [.03, .018, -.008], toe: .12, shoulder: .24, grainScale: 1.08, chromaGrain: .24 });
  }
  if (/ektar|ultra/.test(id)) {
    Object.assign(response, { red: 1.035, green: 1.035, blue: 1.005, shadow: [.002, .004, .014], highlight: [.008, .012, .018], toe: .07, shoulder: .17, grainScale: .58, chromaGrain: .07 });
  }
  if (/fuji|superia|reala|sensia|velvia|provia|eterna|acros|neopan/.test(id)) {
    response.red *= .985; response.green *= 1.012; response.blue *= 1.018;
    response.shadow = [-.01, .009, .02];
    response.highlight = [.002, .016, .024];
    response.hueBias -= 2.5;
  }
  if (/velvia/.test(id)) {
    response.red = 1.035; response.green = 1.065; response.blue = 1.09;
    response.toe = .045; response.shoulder = .11; response.grainScale = .58;
  }
  if (/provia/.test(id)) {
    response.red = 1.012; response.green = 1.025; response.blue = 1.035;
    response.toe = .09; response.shoulder = .2; response.grainScale = .72;
  }
  if (/vision|eterna|cinestill|2383|3513|print2393|doublex/.test(id)) {
    response.toe = .2; response.shoulder = .44;
  }
  if (/500t|200t/.test(id)) {
    response.red = 1.025; response.green = 1.008; response.blue = .965;
    response.shadow = [.008, .002, .018];
    response.highlight = [.025, .014, .002];
    response.hueBias += 2;
    response.grainScale = id.includes('500t') ? 1.35 : .92;
  }
  if (/hp5|trix|tri.?x|5222|bwxx/.test(id)) {
    response.bwMix = [.34, .48, .18]; response.toe = .1; response.shoulder = .22;
    response.grainScale = 1.35;
  }
  if (/tmax|delta|acros|fp4|panf|pan.?100|adox|apx/.test(id)) {
    response.bwMix = [.3, .59, .11]; response.toe = .12; response.shoulder = .28;
    response.grainScale = .72;
  }
  if (/3200|1600|800|p3200/.test(id)) response.grainScale *= 1.35;
  if (/redscale/.test(id)) response.special = 'redscale';
  if (/aerochrome/.test(id)) response.special = 'aerochrome';
  if (/technicolor/.test(id)) response.special = 'technicolor';
  if (/bleach/.test(id)) response.special = 'bleach';
  if (/crossprocess/.test(id)) response.special = 'crossprocess';
  if (/turquoise/.test(id)) response.special = 'turquoise';

  if (/polaroid|spectra|instax/.test(id)) {
    response.red = 1.035; response.green = 1.012; response.blue = .97;
    response.toe = .26; response.shoulder = .48; response.grainScale = 1.05;
  }
  return response;
}

function tone(v: number, contrast: number, toe: number, shoulder: number): number {
  const centered = (v - .18) * contrast + .18;
  const lifted = centered + toe * .035 * (1 - smoothstep(0, .28, centered));
  const rolled = lifted - shoulder * .16 * smoothstep(.58, 1.08, lifted);
  return clamp(rolled);
}

function transformRgb(r0: number, g0: number, b0: number, p: FilmRenderProfile, s: StockResponse): [number, number, number] {
  const luma0 = .2126 * r0 + .7152 * g0 + .0722 * b0;
  if (s.bwMix) {
    const filtered = r0 * s.bwMix[0] + g0 * s.bwMix[1] + b0 * s.bwMix[2];
    const v = tone(filtered, p.contrast, s.toe, s.shoulder);
    return [v, v, v];
  }

  let r = tone(r0, p.contrast, s.toe, s.shoulder);
  let g = tone(g0, p.contrast, s.toe, s.shoulder);
  let b = tone(b0, p.contrast, s.toe, s.shoulder);
  const shadow = 1 - smoothstep(.07, .5, luma0);
  const highlight = smoothstep(.5, .98, luma0);
  r = r * s.red + s.shadow[0] * shadow + s.highlight[0] * highlight;
  g = g * s.green + s.shadow[1] * shadow + s.highlight[1] * highlight;
  b = b * s.blue + s.shadow[2] * shadow + s.highlight[2] * highlight;

  const warmth = p.warmth / 100;
  r += warmth * (.014 + .014 * highlight);
  g += s.hueBias * .00028 * (shadow - highlight);
  b -= warmth * (.01 + .006 * highlight);

  if (s.special === 'redscale') {
    const oldR = r;
    r = r * 1.12 + g * .08;
    g = g * .72 + r0 * .08;
    b *= .58;
    r += oldR * .02;
  } else if (s.special === 'aerochrome') {
    const foliage = smoothstep(.12, .62, g0 - r0 * .45);
    r = r * (1 - foliage) + (g0 * 1.08) * foliage;
    g = g * (1 - foliage) + (r0 * .88) * foliage;
    b = b * (1 - foliage) + (b0 * .9) * foliage;
  } else if (s.special === 'technicolor') {
    r = r * .9 + g * .12;
    g = g * .92 + r0 * .08;
    b = b * .28 + g0 * .08;
  } else if (s.special === 'bleach') {
    const gray = .2126 * r + .7152 * g + .0722 * b;
    const retention = p.id.includes('100') ? .96 : p.id.includes('50') ? .52 : .3;
    r = gray * retention + r * (1 - retention);
    g = gray * retention + g * (1 - retention);
    b = gray * retention + b * (1 - retention);
  } else if (s.special === 'crossprocess') {
    r = Math.pow(clamp(r), .92) * 1.025;
    g = Math.pow(clamp(g), 1.04) * 1.01;
    b = Math.pow(clamp(b), 1.12) * 1.04;
  } else if (s.special === 'turquoise') {
    const sky = smoothstep(.22, .72, b0 - r0 * .45);
    b += sky * .1; g += sky * .035; r -= sky * .045;
  }

  const luma = .2126 * r + .7152 * g + .0722 * b;
  const saturation = Math.max(0, p.saturation);
  r = luma + (r - luma) * saturation;
  g = luma + (g - luma) * saturation;
  b = luma + (b - luma) * saturation;
  return [clamp(r), clamp(g), clamp(b)];
}

function getStockLut(profile: FilmRenderProfile): BuiltInLut {
  const key = [profile.id, profile.family, profile.warmth, profile.contrast, profile.saturation].join('|');
  const cached = lutCache.get(key);
  if (cached) return cached;

  const response = responseFor(profile);
  const size = LUT_SIZE;
  const values = new Float32Array(size * size * size * 3);
  let offset = 0;
  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {