export type CubeLut = {
  size: number;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
  data: Array<[number, number, number]>;
  title: string;
};

export function parseCube(text: string): CubeLut {
  let size = 0;
  let title = 'Imported .cube LUT';
  const domainMin: [number, number, number] = [0, 0, 0];
  const domainMax: [number, number, number] = [1, 1, 1];
  const data: Array<[number, number, number]> = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.match(/"[^"]*"|\S+/g) || [];
    const key = parts[0]?.toUpperCase();
    if (key === 'TITLE') { title = parts.slice(1).join(' ').replace(/^"|"$/g, ''); continue; }
    if (key === 'LUT_3D_SIZE') { size = Number(parts[1]); continue; }
    if (key === 'DOMAIN_MIN' || key === 'DOMAIN_MAX') {
      const values = parts.slice(1).map(Number);
      if (values.length === 3 && values.every(Number.isFinite)) {
        (key === 'DOMAIN_MIN' ? domainMin : domainMax).splice(0, 3, ...values);
      }
      continue;
    }
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(parts[0])) {
      const values = parts.slice(0, 3).map(Number);
      if (values.length === 3 && values.every(Number.isFinite)) data.push(values as [number, number, number]);
    }
  }
  if (!Number.isInteger(size) || size < 2 || size > 65 || data.length !== size ** 3) {
    throw new Error('Invalid .cube file. A 3D LUT with 2–65 points per axis is required.');
  }
  if (domainMax.some((v, i) => v <= domainMin[i])) throw new Error('Invalid .cube domain range.');
  return { size, domainMin, domainMax, data, title };
}

export function applyCubeLut(image: ImageData, lut: CubeLut): ImageData {
  const { size, domainMin, domainMax, data } = lut;
  const max = size - 1;
  const sample = (r: number, g: number, b: number, channel: number) => {
    const idx = ((b * size + g) * size + r) * 3 + channel;
    return data[Math.min(data.length - 1, idx / 3)][channel];
  };
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    const coords = [d[i] / 255, d[i + 1] / 255, d[i + 2] / 255].map((v, c) =>
      Math.max(0, Math.min(max, (v - domainMin[c]) / (domainMax[c] - domainMin[c]) * max))
    );
    const lo = coords.map(Math.floor);
    const hi = coords.map(v => Math.min(max, Math.ceil(v)));
    const f = coords.map((v, c) => v - lo[c]);
    const out = [0, 0, 0];
    for (let channel = 0; channel < 3; channel++) {
      const c000 = sample(lo[0], lo[1], lo[2], channel);
      const c100 = sample(hi[0], lo[1], lo[2], channel);
      const c010 = sample(lo[0], hi[1], lo[2], channel);
      const c110 = sample(hi[0], hi[1], lo[2], channel);
      const c001 = sample(lo[0], lo[1], hi[2], channel);
      const c101 = sample(hi[0], lo[1], hi[2], channel);
      const c011 = sample(lo[0], hi[1], hi[2], channel);
      const c111 = sample(hi[0], hi[1], hi[2], channel);
      const x00 = c000 * (1-f[0]) + c100*f[0];
      const x10 = c010 * (1-f[0]) + c110*f[0];
      const x01 = c001 * (1-f[0]) + c101*f[0];
      const x11 = c011 * (1-f[0]) + c111*f[0];
      const y0 = x00 * (1-f[1]) + x10*f[1];
      const y1 = x01 * (1-f[1]) + x11*f[1];
      out[channel] = (y0 * (1-f[2]) + y1*f[2]) * 255;
    }
    d[i] = Math.max(0, Math.min(255, out[0]));
    d[i + 1] = Math.max(0, Math.min(255, out[1]));
    d[i + 2] = Math.max(0, Math.min(255, out[2]));
  }
  return image;
}
