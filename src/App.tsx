import { useEffect, useMemo, useRef, useState } from 'react';
import VideoLab from './VideoLab';
import ResolveHub from './ResolveHub';
import { filmCatalog } from './filmCatalog';
import {
  Aperture,
  ArrowDownToLine,
  ChevronDown,
  ChevronRight,
  Film,
  ImagePlus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  WandSparkles,
} from 'lucide-react';

type Stock = {
  id: string;
  family: string;
  maker: string;
  name: string;
  note: string;
  warmth: number;
  contrast: number;
  saturation: number;
  fade: number;
  grain: number;
  halation: number;
};
const stocks: Stock[] = [
  ...filmCatalog,
  {
    id: 'portra160',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'Portra 160',
    note: 'Soft pastel color, gentle skin tones, fine grain',
    warmth: 2,
    contrast: 0.92,
    saturation: 0.91,
    fade: 0.08,
    grain: 0.12,
    halation: 0.08,
  },
  {
    id: 'portra400',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'Portra 400',
    note: 'Natural color, creamy highlights, versatile latitude',
    warmth: 3,
    contrast: 0.96,
    saturation: 0.98,
    fade: 0.06,
    grain: 0.2,
    halation: 0.12,
  },
  {
    id: 'portra800',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'Portra 800',
    note: 'Warm low-light character with pronounced grain',
    warmth: 5,
    contrast: 1.02,
    saturation: 1.03,
    fade: 0.04,
    grain: 0.32,
    halation: 0.15,
  },
  {
    id: 'ektar100',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'Ektar 100',
    note: 'Vivid color, punchy reds and crisp detail',
    warmth: 1,
    contrast: 1.16,
    saturation: 1.28,
    fade: 0.01,
    grain: 0.08,
    halation: 0.05,
  },
  {
    id: 'gold200',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'Gold 200',
    note: 'Golden warmth, nostalgic consumer-film palette',
    warmth: 9,
    contrast: 1.08,
    saturation: 1.13,
    fade: 0.1,
    grain: 0.22,
    halation: 0.13,
  },
  {
    id: 'ultramax400',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'UltraMax 400',
    note: 'Sunny, saturated everyday 35mm look',
    warmth: 6,
    contrast: 1.12,
    saturation: 1.19,
    fade: 0.04,
    grain: 0.25,
    halation: 0.1,
  },
  {
    id: 'colorplus200',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'ColorPlus 200',
    note: 'Warm reds, soft contrast, casual snapshot feel',
    warmth: 8,
    contrast: 1.02,
    saturation: 1.08,
    fade: 0.12,
    grain: 0.23,
    halation: 0.12,
  },
  {
    id: 'vision3_50d',
    family: 'Motion picture',
    maker: 'Kodak',
    name: 'Vision3 50D 5203',
    note: 'Daylight cinema negative, restrained highlights',
    warmth: -2,
    contrast: 0.9,
    saturation: 0.93,
    fade: 0.05,
    grain: 0.08,
    halation: 0.08,
  },
  {
    id: 'vision3_250d',
    family: 'Motion picture',
    maker: 'Kodak',
    name: 'Vision3 250D 5207',
    note: 'Balanced daylight cinema stock, broad latitude',
    warmth: 0,
    contrast: 0.94,
    saturation: 0.96,
    fade: 0.04,
    grain: 0.14,
    halation: 0.12,
  },
  {
    id: 'vision3_500t',
    family: 'Motion picture',
    maker: 'Kodak',
    name: 'Vision3 500T 5219',
    note: 'Tungsten cinema palette, cool shadows and warm lights',
    warmth: -5,
    contrast: 0.98,
    saturation: 0.96,
    fade: 0.04,
    grain: 0.23,
    halation: 0.18,
  },
  {
    id: 'vision3_200t',
    family: 'Motion picture',
    maker: 'Kodak',
    name: 'Vision3 200T 5213',
    note: 'Fine-grained tungsten-balanced cinema negative',
    warmth: -4,
    contrast: 0.93,
    saturation: 0.94,
    fade: 0.04,
    grain: 0.12,
    halation: 0.1,
  },
  {
    id: 'fuji400h',
    family: 'Color negative',
    maker: 'Fujifilm',
    name: 'Pro 400H',
    note: 'Airy greens, gentle pastels, luminous skin',
    warmth: -5,
    contrast: 0.9,
    saturation: 0.9,
    fade: 0.12,
    grain: 0.18,
    halation: 0.08,
  },
  {
    id: 'fuji160ns',
    family: 'Color negative',
    maker: 'Fujifilm',
    name: 'Pro 160NS',
    note: 'Neutral portrait color with delicate greens',
    warmth: -2,
    contrast: 0.94,
    saturation: 0.92,
    fade: 0.04,
    grain: 0.1,
    halation: 0.06,
  },
  {
    id: 'superia400',
    family: 'Color negative',
    maker: 'Fujifilm',
    name: 'Superia X-TRA 400',
    note: 'Cool greens, lively blues and consumer-film grain',
    warmth: -4,
    contrast: 1.1,
    saturation: 1.12,
    fade: 0.02,
    grain: 0.26,
    halation: 0.08,
  },
  {
    id: 'c200',
    family: 'Color negative',
    maker: 'Fujifilm',
    name: 'Fujicolor C200',
    note: 'Clean daylight color with a green-cyan bias',
    warmth: -3,
    contrast: 1.02,
    saturation: 1.04,
    fade: 0.04,
    grain: 0.18,
    halation: 0.07,
  },
  {
    id: 'velvia50',
    family: 'Slide / reversal',
    maker: 'Fujifilm',
    name: 'Velvia 50',
    note: 'Dense contrast, intense greens and rich reds',
    warmth: 1,
    contrast: 1.3,
    saturation: 1.48,
    fade: 0,
    grain: 0.05,
    halation: 0.03,
  },
  {
    id: 'velvia100',
    family: 'Slide / reversal',
    maker: 'Fujifilm',
    name: 'Velvia 100',
    note: 'Highly saturated landscape color and deep blacks',
    warmth: 0,
    contrast: 1.26,
    saturation: 1.4,
    fade: 0,
    grain: 0.08,
    halation: 0.03,
  },
  {
    id: 'provia100f',
    family: 'Slide / reversal',
    maker: 'Fujifilm',
    name: 'Provia 100F',
    note: 'Faithful color, crisp detail, moderate saturation',
    warmth: 0,
    contrast: 1.1,
    saturation: 1.08,
    fade: 0,
    grain: 0.04,
    halation: 0.02,
  },
  {
    id: 'astia100f',
    family: 'Slide / reversal',
    maker: 'Fujifilm',
    name: 'Astia 100F',
    note: 'Soft portrait slide palette and smooth tonal range',
    warmth: 2,
    contrast: 0.96,
    saturation: 0.95,
    fade: 0.02,
    grain: 0.04,
    halation: 0.02,
  },
  {
    id: 'ektachrome100',
    family: 'Slide / reversal',
    maker: 'Kodak',
    name: 'Ektachrome E100',
    note: 'Clean cool transparency color, crisp whites',
    warmth: -2,
    contrast: 1.16,
    saturation: 1.12,
    fade: 0,
    grain: 0.04,
    halation: 0.02,
  },
  {
    id: 'ktachrome64',
    family: 'Slide / reversal',
    maker: 'Kodak',
    name: 'Kodachrome 64 inspired',
    note: 'Classic warm reds, rich blues, sculpted contrast',
    warmth: 4,
    contrast: 1.18,
    saturation: 1.16,
    fade: 0.02,
    grain: 0.05,
    halation: 0.03,
  },
  {
    id: 'cinestill800t',
    family: 'Color negative',
    maker: 'CineStill',
    name: '800T',
    note: 'Tungsten night look with signature red halation',
    warmth: -7,
    contrast: 1.08,
    saturation: 1.06,
    fade: 0.02,
    grain: 0.3,
    halation: 0.62,
  },
  {
    id: 'cinestill400d',
    family: 'Color negative',
    maker: 'CineStill',
    name: '400D',
    note: 'Daylight-balanced cinema color with soft glow',
    warmth: 1,
    contrast: 1.02,
    saturation: 1.02,
    fade: 0.04,
    grain: 0.2,
    halation: 0.18,
  },
  {
    id: 'cinestill50d',
    family: 'Color negative',
    maker: 'CineStill',
    name: '50D',
    note: 'Fine-grain daylight cinema-inspired color',
    warmth: 0,
    contrast: 0.98,
    saturation: 1.02,
    fade: 0.02,
    grain: 0.08,
    halation: 0.12,
  },
  {
    id: 'lomochrome_purple',
    family: 'Experimental',
    maker: 'Lomography',
    name: 'LomoChrome Purple',
    note: 'Color-shifting purple foliage and surreal tones',
    warmth: 2,
    contrast: 1.06,
    saturation: 1.2,
    fade: 0.06,
    grain: 0.2,
    halation: 0.1,
  },
  {
    id: 'lomochrome_metropolis',
    family: 'Experimental',
    maker: 'Lomography',
    name: 'LomoChrome Metropolis',
    note: 'Muted color, gritty contrast, urban mood',
    warmth: -2,
    contrast: 1.28,
    saturation: 0.55,
    fade: 0.04,
    grain: 0.34,
    halation: 0.08,
  },
  {
    id: 'lomography_color92',
    family: 'Color negative',
    maker: 'Lomography',
    name: 'Color Negative 92',
    note: 'Warm nostalgic color with playful saturation',
    warmth: 8,
    contrast: 1.04,
    saturation: 1.12,
    fade: 0.1,
    grain: 0.22,
    halation: 0.1,
  },
  {
    id: 'ilford_hp5',
    family: 'Black & white',
    maker: 'Ilford',
    name: 'HP5 Plus 400',
    note: 'Classic flexible monochrome with expressive grain',
    warmth: 0,
    contrast: 1.12,
    saturation: 0,
    fade: 0.02,
    grain: 0.28,
    halation: 0.02,
  },
  {
    id: 'ilford_delta100',
    family: 'Black & white',
    maker: 'Ilford',
    name: 'Delta 100',
    note: 'Fine-grain, clean and detailed monochrome',
    warmth: 0,
    contrast: 1.04,
    saturation: 0,
    fade: 0,
    grain: 0.07,
    halation: 0.01,
  },
  {
    id: 'ilford_delta3200',
    family: 'Black & white',
    maker: 'Ilford',
    name: 'Delta 3200',
    note: 'High-speed dramatic grain and deep shadows',
    warmth: 0,
    contrast: 1.2,
    saturation: 0,
    fade: 0,
    grain: 0.5,
    halation: 0.02,
  },
  {
    id: 'ilford_xp2',
    family: 'Black & white',
    maker: 'Ilford',
    name: 'XP2 Super',
    note: 'Smooth chromogenic black and white tonality',
    warmth: 0,
    contrast: 0.98,
    saturation: 0,
    fade: 0.02,
    grain: 0.12,
    halation: 0.01,
  },
  {
    id: 'kodak_tri_x',
    family: 'Black & white',
    maker: 'Kodak',
    name: 'Tri-X 400',
    note: 'Punchy reportage monochrome, gritty midtone grain',
    warmth: 0,
    contrast: 1.22,
    saturation: 0,
    fade: 0,
    grain: 0.36,
    halation: 0.02,
  },
  {
    id: 'kodak_tmax100',
    family: 'Black & white',
    maker: 'Kodak',
    name: 'T-Max 100',
    note: 'Very fine grain and precise tonal separation',
    warmth: 0,
    contrast: 1.04,
    saturation: 0,
    fade: 0,
    grain: 0.06,
    halation: 0.01,
  },
  {
    id: 'fomapan400',
    family: 'Black & white',
    maker: 'Foma',
    name: 'Fomapan 400',
    note: 'Classic European monochrome with lively grain',
    warmth: 0,
    contrast: 1.1,
    saturation: 0,
    fade: 0.04,
    grain: 0.3,
    halation: 0.02,
  },
  {
    id: 'rollei_ir',
    family: 'Black & white',
    maker: 'Rollei',
    name: 'Infrared 400 inspired',
    note: 'Infrared-inspired luminous foliage and dark skies',
    warmth: 0,
    contrast: 1.22,
    saturation: 0,
    fade: 0,
    grain: 0.14,
    halation: 0.02,
  },
  {
    id: 'polaroid600',
    family: 'Instant',
    maker: 'Polaroid',
    name: '600 Color',
    note: 'Soft instant color, lifted blacks and gentle fade',
    warmth: 7,
    contrast: 0.88,
    saturation: 0.88,
    fade: 0.2,
    grain: 0.18,
    halation: 0.12,
  },
  {
    id: 'polaroid_sx70',
    family: 'Instant',
    maker: 'Polaroid',
    name: 'SX-70',
    note: 'Pastel instant-film color and creamy highlights',
    warmth: 5,
    contrast: 0.86,
    saturation: 0.82,
    fade: 0.16,
    grain: 0.12,
    halation: 0.1,
  },
  {
    id: 'instax_wide',
    family: 'Instant',
    maker: 'Fujifilm',
    name: 'Instax Wide',
    note: 'Bright instant snapshot look with clean color',
    warmth: 3,
    contrast: 1.02,
    saturation: 1.02,
    fade: 0.03,
    grain: 0.08,
    halation: 0.04,
  },
  {
    id: 'agfa_vista',
    family: 'Color negative',
    maker: 'Agfa',
    name: 'Vista 200 inspired',
    note: 'Bright reds, warm daylight and cheerful color',
    warmth: 6,
    contrast: 1.06,
    saturation: 1.12,
    fade: 0.04,
    grain: 0.16,
    halation: 0.07,
  },
  {
    id: 'orwo_nc500',
    family: 'Color negative',
    maker: 'ORWO',
    name: 'NC500',
    note: 'Muted contemporary color with textured grain',
    warmth: -2,
    contrast: 1.08,
    saturation: 0.88,
    fade: 0.08,
    grain: 0.25,
    halation: 0.08,
  },
  {
    id: 'aerocolor',
    family: 'Color negative',
    maker: 'Kodak',
    name: 'AeroColor IV 2460',
    note: 'Clean aerial color negative with crisp color',
    warmth: -1,
    contrast: 1.08,
    saturation: 1.05,
    fade: 0.01,
    grain: 0.07,
    halation: 0.04,
  },
  {
    id: 'ektachrome64t',
    family: 'Slide / reversal',
    maker: 'Kodak',
    name: 'Ektachrome 64T inspired',
    note: 'Cool tungsten transparency with vivid color',
    warmth: -8,
    contrast: 1.18,
    saturation: 1.12,
    fade: 0,
    grain: 0.05,
    halation: 0.02,
  },
  {
    id: 'print2383',
    family: 'Print / output',
    maker: 'Kodak',
    name: '2383 Print Film',
    note: 'Cinema print contrast, rich blacks and warm highlights',
    warmth: 2,
    contrast: 1.2,
    saturation: 1.04,
    fade: 0.02,
    grain: 0.08,
    halation: 0.02,
  },
  {
    id: 'fuji3513',
    family: 'Print / output',
    maker: 'Fujifilm',
    name: '3513 Print Film inspired',
    note: 'Cooler cinema print palette with dense shadows',
    warmth: -3,
    contrast: 1.16,
    saturation: 0.98,
    fade: 0.02,
    grain: 0.06,
    halation: 0.02,
  },
];
const families = ['All stocks', ...Array.from(new Set(stocks.map(stock => stock.family)))];
const defaults = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  grain: 0,
  halation: 0,
  fade: 0,
  vignette: 0,
  bloom: 0,
};
type Controls = typeof defaults;

function App() {
  const [workspaceMode, setWorkspaceMode] = useState<'photo' | 'video' | 'resolve'>('photo');
  const [family, setFamily] = useState('All stocks');
  const [search, setSearch] = useState('');
  const [stockId, setStockId] = useState('portra400');
  const [controls, setControls] = useState<Controls>(defaults);
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [tab, setTab] = useState<'stocks' | 'adjust'>('stocks');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const stock = stocks.find(s => s.id === stockId) || stocks[1];
  const filtered = useMemo(
    () =>
      stocks.filter(
        s =>
          (family === 'All stocks' || s.family === family) &&
          (s.name + ' ' + s.maker + ' ' + s.family)
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [family, search]
  );

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      render();
    };
    img.src = imageUrl;
    return () => {
      imageRef.current = null;
    };
  }, [imageUrl]);

  function render() {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const scale = Math.min(
      1,
      1800 / Math.max(img.naturalWidth, img.naturalHeight)
    );
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, w, h);
    if (showOriginal) return;
    const frame = ctx.getImageData(0, 0, w, h);
    const d = frame.data;
    const c = controls;
    const exposure = Math.pow(2, c.exposure / 50);
    const contrast = Math.max(0.2, stock.contrast + c.contrast / 100);
    const sat = Math.max(0, stock.saturation + c.saturation / 100);
    const warm = (stock.warmth + c.warmth) * 0.42;
    const grain = Math.max(0, stock.grain + c.grain / 100);
    const fade = Math.max(0, stock.fade + c.fade / 100);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        let r = d[i] * exposure,
          g = d[i + 1] * exposure,
          b = d[i + 2] * exposure;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r += warm;
        b -= warm * 0.72;
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray + (r - gray) * sat;
        g = gray + (g - gray) * sat;
        b = gray + (b - gray) * sat;
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;
        if (stock.id === 'lomochrome_purple') {
          const oldR = r;
          r = b * 0.72 + g * 0.12;
          b = oldR * 0.78 + b * 0.12;
        }
        if (stock.id === 'lomochrome_metropolis') {
          r = gray + (r - gray) * 0.55;
          g = gray + (g - gray) * 0.55;
          b = gray + (b - gray) * 0.55;
        }
        if (stock.id === 'rollei_ir') {
          r = lum * 1.08;
          g = lum * 1.04;
          b = lum * 0.78;
        }
        if (stock.family === 'Black & white') {
          r = g = b = gray;
        }
        const n = (Math.random() - 0.5) * grain * 100;
        const lift = fade * 24;
        d[i] = Math.max(0, Math.min(255, r + n + lift));
        d[i + 1] = Math.max(0, Math.min(255, g + n + lift * 0.82));
        d[i + 2] = Math.max(0, Math.min(255, b + n + lift * 0.62));
      }
    }
    ctx.putImageData(frame, 0, 0);
    if (c.halation + stock.halation > 0.01) {
      const glow = document.createElement('canvas');
      glow.width = w;
      glow.height = h;
      const gx = glow.getContext('2d');
      if (gx) {
        gx.drawImage(canvas, 0, 0);
        gx.globalCompositeOperation = 'source-in';
        gx.fillStyle = 'rgba(255,70,35,0.9)';
        gx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Math.min(
          0.7,
          (c.halation / 100 + stock.halation) * 0.65
        );
        ctx.filter = 'blur(18px)';
        ctx.drawImage(glow, 0, 0);
        ctx.restore();
      }
    }
    if (c.bloom > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = c.bloom / 180;
      ctx.filter = 'blur(14px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
    if (c.vignette > 0) {
      const grad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.18,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.72
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,' + (c.vignette / 100) * 0.8 + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  useEffect(() => {
    if (imageRef.current) render();
  }, [stockId, controls, showOriginal]);

  function update(key: keyof Controls, value: number) {
    setControls(prev => ({ ...prev, [key]: value }));
  }
  function loadFile(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFileName(file.name);
    setImageUrl(URL.createObjectURL(file));
    setShowOriginal(false);
  }
  function exportImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (showOriginal) {
      setShowOriginal(false);
      return;
    }
    const link = document.createElement('a');
    link.download =
      (fileName.replace(/\.[^.]+$/, '') || 'frame') + '-' + stock.id + '.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.94);
    link.click();
  }
  function reset() {
    setControls(defaults);
  }

  if (workspaceMode === 'video') return <VideoLab onBack={() => setWorkspaceMode('photo')} />;
  if (workspaceMode === 'resolve') return <ResolveHub onBack={() => setWorkspaceMode('photo')} />;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Aperture size={19} />
          </div>
          <span>
            GRAIN<span className="brand-light">ROOM</span>
          </span>
          <span className="edition">FILM LAB / 01</span>
        </div>
        <div className="top-actions">
          <div className="workspace-switcher">
            <button className="mode-active" onClick={() => setWorkspaceMode('photo')}>PHOTO</button>
            <button onClick={() => setWorkspaceMode('video')}>VIDEO</button>
            <button onClick={() => setWorkspaceMode('resolve')}>RESOLVE OFX</button>
          </div>
          <span className="status-dot"></span>
          <span className="status-label">LOCAL PROCESSING</span>
          <button
            className="export-btn"
            onClick={exportImage}
            disabled={!imageUrl}
          >
            <ArrowDownToLine size={15} /> EXPORT FRAME
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="preview-column">
          <div className="section-head">
            <div>
              <div className="eyebrow">DARKROOM / DIGITAL</div>
              <h1>
                Make digital feel <em>analog.</em>
              </h1>
            </div>
            <div className="frame-meta">
              35MM SIMULATION <span>·</span> {stock.maker.toUpperCase()}{' '}
              {stock.name.toUpperCase()}
            </div>
          </div>
          <div className="preview-frame">
            {imageUrl ? (
              <canvas ref={canvasRef} className="preview-canvas" />
            ) : (
              <div className="empty-preview">
                <div className="empty-icon">
                  <ImagePlus size={28} />
                </div>
                <p className="empty-title">Your frame goes here.</p>
                <p className="empty-sub">
                  Bring in a photograph to begin the emulation process.
                </p>
                <label className="upload-button">
                  {' '}
                  <ImagePlus size={16} /> IMPORT IMAGE{' '}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => loadFile(e.target.files?.[0])}
                  />
                </label>
                <span className="file-hint">
                  JPG · PNG · WEBP · TIFF (browser-supported formats)
                </span>
              </div>
            )}
            {imageUrl && (
              <>
                <div className="preview-overlay">
                  <span>
                    PREVIEW /{' '}
                    {showOriginal ? 'ORIGINAL' : stock.name.toUpperCase()}
                  </span>
                  <button onClick={() => setShowOriginal(v => !v)}>
                    {showOriginal ? 'VIEW GRADE' : 'HOLD TO COMPARE'}
                  </button>
                </div>
                <div className="preview-bottom">
                  <span>{fileName}</span>
                  <span>
                    {canvasRef.current?.width || 0} ×{' '}
                    {canvasRef.current?.height || 0} PX
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="under-preview">
            <div className="stock-caption">
              <span className="caption-mark">✳</span>
              <div>
                <strong>
                  {stock.maker} {stock.name}
                </strong>
                <p>{stock.note}</p>
              </div>
            </div>
            <button className="reset-btn" onClick={reset}>
              <RotateCcw size={14} /> RESET ADJUSTMENTS
            </button>
          </div>
          <div className="film-strip">
            <div className="strip-label">IN THE LAB</div>
            <div className="strip-items">
              <span>COLOR SCIENCE</span>
              <i>✳</i>
              <span>GRAIN STRUCTURE</span>
              <i>✳</i>
              <span>HALATION</span>
              <i>✳</i>
              <span>PRINT CHARACTER</span>
            </div>
          </div>
        </section>
        <aside className="control-panel">
          <div className="panel-tabs">
            <button
              className={tab === 'stocks' ? 'active' : ''}
              onClick={() => setTab('stocks')}
            >
              <Film size={15} /> FILM STOCKS
            </button>
            <button
              className={tab === 'adjust' ? 'active' : ''}
              onClick={() => setTab('adjust')}
            >
              <SlidersHorizontal size={15} /> ADJUST
            </button>
          </div>
          {tab === 'stocks' ? (
            <div className="stock-browser">
              <div className="browser-heading">
                <div>
                  <div className="eyebrow">THE ARCHIVE</div>
                  <h2>
                    Film library <span>{stocks.length}</span>
                  </h2>
                </div>
                <Sparkles size={17} />
              </div>
              <div className="search-box">
                <Search size={15} />
                <input
                  placeholder="Find a film stock..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="family-list">
                {families.map(f => (
                  <button
                    key={f}
                    className={family === f ? 'selected' : ''}
                    onClick={() => setFamily(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="stock-list">
                {filtered.map(s => (
                  <button
                    key={s.id}
                    className={
                      'stock-item ' + (stockId === s.id ? 'chosen' : '')
                    }
                    onClick={() => {
                      setStockId(s.id);
                      setShowOriginal(false);
                    }}
                  >
                    <div
                      className="stock-swatch"
                      style={{
                        background:
                          s.family === 'Black & white'
                            ? 'linear-gradient(135deg,#ddd,#333)'
                            : s.family === 'Slide / reversal'
                              ? 'linear-gradient(135deg,#d9a54d,#547d75,#9a5445)'
                              : s.family === 'Instant'
                                ? 'linear-gradient(135deg,#e5c8a3,#9a8c75)'
                                : 'linear-gradient(135deg,#c88a5a,#6f8776,#526c8c)',
                      }}
                    ></div>
                    <div className="stock-info">
                      <strong>{s.name}</strong>
                      <span>
                        {s.maker} · {s.family}
                      </span>
                    </div>
                    {stockId === s.id ? (
                      <span className="selected-check">●</span>
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="no-results">No stocks match that search.</div>
                )}
              </div>
              <div className="panel-foot">
                <span>PROFILE CHARACTER IS AN INTERPRETATION</span>
                <span>GRAINROOM / 2026</span>
              </div>
            </div>
          ) : (
            <div className="adjust-panel">
              <div className="browser-heading">
                <div>
                  <div className="eyebrow">FINE TUNING</div>
                  <h2>Shape the image</h2>
                </div>
                <WandSparkles size={17} />
              </div>
              <div className="active-profile">
                <span>ACTIVE EMULATION</span>
                <strong>
                  {stock.maker} {stock.name}
                </strong>
                <small>{stock.family}</small>
              </div>
              <div className="slider-group">
                <div className="group-title">TONAL RESPONSE</div>
                {(
                  [
                    ['exposure', 'Exposure', -100, 100],
                    ['contrast', 'Contrast', -50, 50],
                    ['saturation', 'Saturation', -100, 100],
                  ] as const
                ).map(([key, label, min, max]) => (
                  <div className="slider-row" key={key}>
                    <div>
                      <label>{label}</label>
                      <output>
                        {controls[key] > 0 ? '+' : ''}
                        {controls[key]}
                      </output>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={controls[key]}
                      onChange={e => update(key, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
              <div className="slider-group">
                <div className="group-title">COLOR RESPONSE</div>
                <div className="slider-row">
                  <div>
                    <label>Warmth / coolness</label>
                    <output>
                      {controls.warmth > 0 ? '+' : ''}
                      {controls.warmth}
                    </output>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={controls.warmth}
                    onChange={e => update('warmth', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="slider-group">
                <div className="group-title">ANALOG ARTIFACTS</div>
                {(
                  [
                    ['grain', 'Film grain', 0, 100],
                    ['halation', 'Halation', 0, 100],
                    ['bloom', 'Lens bloom', 0, 100],
                    ['fade', 'Print fade', 0, 60],
                    ['vignette', 'Vignette', 0, 100],
                  ] as const
                ).map(([key, label, min, max]) => (
                  <div className="slider-row" key={key}>
                    <div>
                      <label>{label}</label>
                      <output>{controls[key]}</output>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={controls[key]}
                      onChange={e => update(key, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
              <button className="reset-wide" onClick={reset}>
                <RotateCcw size={14} /> RESET ALL SLIDERS
              </button>
              <div className="panel-foot">
                <span>ADJUSTMENTS STACK OVER STOCK PROFILE</span>
                <span>LOCAL / NON-DESTRUCTIVE</span>
              </div>
            </div>
          )}
        </aside>
      </main>
      <footer className="footer">
        <span>GRAINROOM — A DIGITAL FILM EMULATION WORKSPACE</span>
        <span>
          PROFILES ARE CREATIVE APPROXIMATIONS · NOT OFFICIAL MANUFACTURER LUTS
        </span>
      </footer>
      <input
        id="quick-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={e => loadFile(e.target.files?.[0])}
      />
    </div>
  );
}
export default App;
