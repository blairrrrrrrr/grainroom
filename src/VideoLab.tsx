import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Film, Pause, Play, RotateCcw, Upload } from 'lucide-react';
import { filmCatalog } from './filmCatalog';
import { applyCubeLut, parseCube, type CubeLut } from './cubeLut';

const videoStocks = [
  ...filmCatalog.map(stock => ({
    id: stock.id,
    name: stock.maker + ' ' + stock.name,
    family: stock.family,
    warmth: stock.warmth,
    contrast: Math.round(stock.contrast * 100),
    saturation: Math.round(stock.saturation * 100),
    grain: Math.round(stock.grain * 100),
    halation: Math.round(stock.halation * 100),
  })),
  { id: 'portra400', name: 'Kodak Portra 400', family: 'Color negative', warmth: 3, contrast: 96, saturation: 98, grain: 20, halation: 12 },
  { id: 'gold200', name: 'Kodak Gold 200', family: 'Color negative', warmth: 9, contrast: 108, saturation: 113, grain: 22, halation: 13 },
  { id: 'ektar100', name: 'Kodak Ektar 100', family: 'Color negative', warmth: 1, contrast: 116, saturation: 128, grain: 8, halation: 5 },
  { id: 'vision3_50d', name: 'Kodak Vision3 50D', family: 'Motion picture', warmth: -2, contrast: 90, saturation: 93, grain: 8, halation: 8 },
  { id: 'vision3_250d', name: 'Kodak Vision3 250D', family: 'Motion picture', warmth: 0, contrast: 94, saturation: 96, grain: 14, halation: 12 },
  { id: 'vision3_500t', name: 'Kodak Vision3 500T', family: 'Motion picture', warmth: -5, contrast: 98, saturation: 96, grain: 23, halation: 18 },
  { id: 'velvia50', name: 'Fujifilm Velvia 50', family: 'Slide / reversal', warmth: 1, contrast: 130, saturation: 148, grain: 5, halation: 3 },
  { id: 'provia100f', name: 'Fujifilm Provia 100F', family: 'Slide / reversal', warmth: 0, contrast: 110, saturation: 108, grain: 4, halation: 2 },
  { id: 'hp5', name: 'Ilford HP5 Plus 400', family: 'Black & white', warmth: 0, contrast: 112, saturation: 0, grain: 28, halation: 2 },
  { id: 'trix', name: 'Kodak Tri-X 400', family: 'Black & white', warmth: 0, contrast: 122, saturation: 0, grain: 36, halation: 2 },
  { id: 'polaroid', name: 'Polaroid 600', family: 'Instant', warmth: 7, contrast: 88, saturation: 88, grain: 18, halation: 12 },
  { id: 'lomo', name: 'LomoChrome Metropolis', family: 'Experimental', warmth: -2, contrast: 128, saturation: 55, grain: 34, halation: 8 },
  { id: '2383', name: 'Kodak 2383 Print Film', family: 'Print / output', warmth: 2, contrast: 120, saturation: 104, grain: 8, halation: 2 },
];

const sourceProfiles = [
  { id: 'rec709', name: 'Rec.709 / Standard', detail: 'Display-referred footage.', contrast: 1, saturation: 1, brightness: 1 },
  { id: 'slog3', name: 'Sony S-Log3 / S-Gamut3.Cine', detail: 'Sony log footage · approximate preview normalization.', contrast: 1.2, saturation: 1.12, brightness: 1.08 },
  { id: 'slog2', name: 'Sony S-Log2 / S-Gamut', detail: 'Sony legacy log · approximate preview normalization.', contrast: 1.16, saturation: 1.1, brightness: 1.06 },
  { id: 'scinetone', name: 'Sony S-Cinetone', detail: 'Soft display-referred cinema profile.', contrast: 1.02, saturation: 1.02, brightness: 1 },
  { id: 'clog3', name: 'Canon Log 3 / Cinema Gamut', detail: 'Canon log footage · approximate preview normalization.', contrast: 1.18, saturation: 1.1, brightness: 1.07 },
  { id: 'clog2', name: 'Canon Log 2 / Cinema Gamut', detail: 'Canon wide dynamic range log · approximate preview normalization.', contrast: 1.2, saturation: 1.12, brightness: 1.08 },
  { id: 'vlog', name: 'Panasonic V-Log / V-Gamut', detail: 'Panasonic log footage · approximate preview normalization.', contrast: 1.2, saturation: 1.12, brightness: 1.08 },
  { id: 'braw', name: 'Blackmagic Film Gen 5', detail: 'BRAW Film footage · approximate preview normalization.', contrast: 1.18, saturation: 1.12, brightness: 1.07 },
  { id: 'redlog', name: 'RED Log3G10 / REDWideGamutRGB', detail: 'RED log footage · approximate preview normalization.', contrast: 1.2, saturation: 1.12, brightness: 1.08 },
  { id: 'dlogm', name: 'DJI D-Log M', detail: 'DJI D-Log M footage · approximate preview normalization.', contrast: 1.16, saturation: 1.1, brightness: 1.06 },
  { id: 'hlg', name: 'HLG / Rec.2020', detail: 'HDR HLG · approximate SDR preview mapping.', contrast: 1.12, saturation: 1.04, brightness: 0.98 },
  { id: 'pq', name: 'HDR10 / PQ (ST 2084)', detail: 'PQ HDR footage · approximate SDR preview mapping.', contrast: 1.14, saturation: 1.02, brightness: 0.94 },
  { id: 'samsunghdr', name: 'Samsung HDR10 / Rec.2020', detail: 'Phone HDR footage · approximate SDR preview mapping.', contrast: 1.12, saturation: 1.04, brightness: 0.96 },
];

type Knobs = { exposure: number; contrast: number; saturation: number; warmth: number; grain: number; halation: number; bloom: number; vignette: number };
const initial: Knobs = { exposure: 0, contrast: 0, saturation: 0, warmth: 0, grain: 0, halation: 0, bloom: 0, vignette: 0 };
const families = ['All stocks', ...Array.from(new Set(videoStocks.map(s => s.family)))];

export default function VideoLab({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [stockId, setStockId] = useState('vision3_250d');
  const [sourceProfileId, setSourceProfileId] = useState('rec709');
  const [inputLut, setInputLut] = useState<CubeLut | null>(null);
  const [family, setFamily] = useState('All stocks');
  const [search, setSearch] = useState('');
  const [knobs, setKnobs] = useState<Knobs>(initial);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'stocks' | 'adjust'>('stocks');
  const stock = videoStocks.find(s => s.id === stockId) || videoStocks[0];
  const sourceProfile = sourceProfiles.find(p => p.id === sourceProfileId) || sourceProfiles[0];
  const filtered = useMemo(() => videoStocks.filter(s => (family === 'All stocks' || s.family === family) && (s.name + s.family).toLowerCase().includes(search.toLowerCase())), [family, search]);

  function drawFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;
    const scale = Math.min(1, 1440 / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.max(1, Math.round(video.videoWidth * scale));
    const h = Math.max(1, Math.round(video.videoHeight * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const exposure = Math.pow(2, knobs.exposure / 100);
    const contrast = Math.max(0.2, (stock.contrast + knobs.contrast) / 100);
    const saturation = Math.max(0, (stock.saturation + knobs.saturation) / 100);
    const warm = stock.warmth + knobs.warmth;
    ctx.drawImage(video, 0, 0, w, h);
    // Technical input transform: apply the selected camera manufacturer's .cube LUT first.
    if (inputLut) {
      const sourceFrame = ctx.getImageData(0, 0, w, h);
      ctx.putImageData(applyCubeLut(sourceFrame, inputLut), 0, 0);
    }
    // Creative film-stock rendering follows the camera normalization stage.
    const normalized = document.createElement('canvas');
    normalized.width = w; normalized.height = h;
    normalized.getContext('2d')?.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.filter = 'brightness(' + exposure + ') contrast(' + contrast + ') saturate(' + saturation + ') sepia(' + Math.max(0, warm) / 100 + ') hue-rotate(' + (warm < 0 ? Math.abs(warm) * 0.7 : 0) + 'deg)';
    ctx.drawImage(normalized, 0, 0, w, h);
    ctx.restore();
    if (stock.family === 'Black & white') {
      const frame = ctx.getImageData(0, 0, w, h);
      const d = frame.data;
      for (let i = 0; i < d.length; i += 4) {
        const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        d[i] = d[i + 1] = d[i + 2] = y;
      }
      ctx.putImageData(frame, 0, 0);
    }
    const grain = Math.max(0, stock.grain + knobs.grain);
    if (grain > 0) {
      const noise = document.createElement('canvas');
      noise.width = 128; noise.height = 128;
      const nctx = noise.getContext('2d');
      if (nctx) {
        const image = nctx.createImageData(128, 128);
        for (let i = 0; i < image.data.length; i += 4) {
          const n = Math.random() * 255;
          image.data[i] = image.data[i + 1] = image.data[i + 2] = n;
          image.data[i + 3] = grain * 1.3;
        }
        nctx.putImageData(image, 0, 0);
        ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(noise, 0, 0, w, h); ctx.restore();
      }
    }
    if (stock.halation + knobs.halation > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = Math.min(0.32, (stock.halation + knobs.halation) / 180);
      ctx.filter = 'blur(18px) saturate(1.8)'; ctx.drawImage(video, 0, 0, w, h); ctx.restore();
    }
    if (knobs.bloom > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = knobs.bloom / 180; ctx.filter = 'blur(16px)'; ctx.drawImage(video, 0, 0, w, h); ctx.restore();
    }
    if (knobs.vignette > 0) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.72);
      grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,' + knobs.vignette / 140 + ')');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    }
  }

  useEffect(() => {
    if (!url) return;
    const video = videoRef.current;
    if (!video) return;
    video.src = url;
    video.load();
    return () => cancelAnimationFrame(animationRef.current);
  }, [url]);

  useEffect(() => {
    const tick = () => {
      drawFrame();
      if (videoRef.current) setTime(videoRef.current.currentTime || 0);
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [url, stockId, knobs, sourceProfileId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => { setPlaying(false); if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); };
    video.addEventListener('ended', onEnded);
    return () => video.removeEventListener('ended', onEnded);
  }, [url]);

  function loadFile(file?: File) {
    if (!file || !file.type.startsWith('video/')) { setError('Choose a supported video file.'); return; }
    if (url) URL.revokeObjectURL(url);
    setFileName(file.name); setUrl(URL.createObjectURL(file)); setError('');
    setPlaying(false); setTime(0);
  }
  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { try { await video.play(); setPlaying(true); } catch { setError('This video format could not be played by your browser.'); } }
    else { video.pause(); setPlaying(false); }
  }
  function update(key: keyof Knobs, value: number) { setKnobs(prev => ({ ...prev, [key]: value })); }
  async function loadInputLut(file?: File) {
    if (!file) return;
    try {
      const parsed = parseCube(await file.text());
      setInputLut(parsed);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this .cube LUT.');
    }
  }
  function stopRecording() { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); }
  function exportVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !url) return;
    if (!('MediaRecorder' in window) || !canvas.captureStream) { setError('Video export is not supported in this browser.'); return; }
    const canvasStream = canvas.captureStream(30);
    const sourceStream = (video as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream?.();
    sourceStream?.getAudioTracks().forEach(track => canvasStream.addTrack(track));
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type));
    if (!mime) { setError('This browser does not support WebM recording.'); return; }
    chunksRef.current = [];
    const recorder = new MediaRecorder(canvasStream, { mimeType: mime, videoBitsPerSecond: 12000000 });
    recorderRef.current = recorder;
    recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const link = document.createElement('a');
      const outputUrl = URL.createObjectURL(blob);
      link.href = outputUrl;
      link.download = (fileName.replace(/\.[^.]+$/, '') || 'grainroom-video') + '-' + stock.id + '.webm';
      link.click();
      setTimeout(() => URL.revokeObjectURL(outputUrl), 60000);
      setRecording(false);
      canvasStream.getTracks().forEach(track => track.stop());
    };
    video.currentTime = 0;
    video.play().then(() => { recorder.start(250); setRecording(true); setPlaying(true); }).catch(() => setError('Could not start video rendering.'));
  }
  const fmt = (n: number) => new Date(n * 1000).toISOString().slice(14, 19);

  return (
    <div className="shell video-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Film size={19}/></div><span>GRAIN<span className="brand-light">ROOM</span></span><span className="edition">VIDEO LAB / 02</span></div>
        <div className="top-actions"><span className="status-dot"></span><span className="status-label">FRAME PROCESSING</span><button className="export-btn" onClick={recording ? stopRecording : exportVideo} disabled={!url}><Download size={15}/>{recording ? 'STOP RENDER' : 'RENDER VIDEO'}</button></div>
      </header>
      <main className="video-workspace">
        <section className="video-main">
          <div className="section-head"><div><div className="eyebrow">MOTION PICTURE / DIGITAL</div><h1>Give every frame an <em>identity.</em></h1></div><button className="back-btn" onClick={onBack}><ArrowLeft size={14}/> PHOTO LAB</button></div>
          <div className="video-stage">
            {url ? <canvas ref={canvasRef} className="video-canvas"/> : <div className="empty-preview"><div className="empty-icon"><Upload size={27}/></div><p className="empty-title">Bring your footage in.</p><p className="empty-sub">Import a video to preview film stocks and render a graded copy.</p><label className="upload-button"><Upload size={15}/> IMPORT VIDEO<input type="file" accept="video/*" onChange={e => loadFile(e.target.files?.[0])}/></label><span className="file-hint">MP4 · MOV · WEBM · BROWSER-SUPPORTED CODECS</span></div>}
            <video ref={videoRef} className="video-source" playsInline preload="metadata" onLoadedMetadata={e => setDuration(e.currentTarget.duration || 0)} onError={() => setError('The browser could not decode this video. Try an H.264 MP4 or WebM file.')}/>
            {url && <div className="video-hud"><span>{fileName}</span><span>{stock.name}</span></div>}
          </div>
          {url && <div className="transport"><button onClick={togglePlay}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button><span>{fmt(time)}</span><input aria-label="Seek video" type="range" min="0" max={duration || 1} step="0.01" value={Math.min(time, duration || 0)} onChange={e => { if (videoRef.current) videoRef.current.currentTime = Number(e.target.value); }}/><span>{fmt(duration)}</span><button className="reset-btn" onClick={() => { if (videoRef.current) videoRef.current.currentTime = 0; }}><RotateCcw size={14}/></button></div>}
          <div className="video-note"><strong>VIDEO RENDER</strong><span>Exports a real-time WebM render with the source audio track when supported. MP4 export is not yet included.</span></div>
          {error && <div className="video-error">{error}<button onClick={() => setError('')}>DISMISS</button></div>}
        </section>
        <aside className="control-panel video-controls">
          <div style={{ border: '1px solid #45453a', background: '#171813', padding: 15, marginBottom: 14 }}>
            <div className="eyebrow">STEP 01 / SOURCE FOOTAGE</div>
            <label htmlFor="source-profile" style={{ display: 'block', fontSize: 12, margin: '8px 0' }}>Camera / recording profile</label>
            <select id="source-profile" value={sourceProfileId} onChange={e => setSourceProfileId(e.target.value)} style={{ width: '100%', background: '#22231d', color: '#e8e5dc', border: '1px solid #5c5a49', padding: 10, fontSize: 11 }}>
              {sourceProfiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
            </select>
            <p style={{ color: '#c4b994', fontSize: 11, lineHeight: 1.5 }}>{sourceProfile.detail}</p>
            <label style={{ display: 'block', marginTop: 10, fontSize: 11 }}>Camera input transform (.cube LUT)</label>
            <label className="upload-button" style={{ display: 'inline-flex', marginTop: 7 }}><Upload size={13}/> {inputLut ? 'REPLACE INPUT LUT' : 'LOAD CAMERA LUT'}<input type="file" accept=".cube,text/plain" onChange={e => loadInputLut(e.target.files?.[0])}/></label>
            <small style={{ display: 'block', color: '#c4b994', fontSize: 10, lineHeight: 1.5, marginTop: 7 }}>{inputLut ? 'Applied before the creative film stock: ' + inputLut.title + ' (' + inputLut.size + '³).' : 'Choose the matching manufacturer technical LUT for the selected camera log/gamut. No guessed contrast lift is applied. Rec.709 footage can be used without an input LUT.'}</small>
            {inputLut && <button className="reset-btn" style={{ marginTop: 8 }} onClick={() => setInputLut(null)}>REMOVE INPUT LUT</button>}
          </div>
          <div className="panel-tabs"><button className={tab === 'stocks' ? 'active' : ''} onClick={() => setTab('stocks')}><Film size={15}/> FILM STOCKS</button><button className={tab === 'adjust' ? 'active' : ''} onClick={() => setTab('adjust')}>ADJUST</button></div>
          {tab === 'stocks' ? <div className="stock-browser"><div className="browser-heading"><div><div className="eyebrow">MOTION ARCHIVE</div><h2>Film library <span>{videoStocks.length}</span></h2></div><Film size={17}/></div><div className="search-box"><input placeholder="Find a film stock..." value={search} onChange={e => setSearch(e.target.value)}/></div><div className="family-list">{families.map(f => <button key={f} className={family === f ? 'selected' : ''} onClick={() => setFamily(f)}>{f}</button>)}</div><div className="stock-list">{filtered.map(s => <button key={s.id} className={'stock-item ' + (stockId === s.id ? 'chosen' : '')} onClick={() => setStockId(s.id)}><div className="stock-swatch"/><div className="stock-info"><strong>{s.name}</strong><span>{s.family}</span></div>{stockId === s.id && <span className="selected-check">●</span>}</button>)}</div><div className="panel-foot"><span>VIDEO STOCK PROFILES</span><span>GRAINROOM</span></div></div> : <div className="adjust-panel"><div className="browser-heading"><div><div className="eyebrow">FINE TUNING</div><h2>Shape the motion</h2></div></div><div className="active-profile"><span>ACTIVE STOCK</span><strong>{stock.name}</strong><small>{stock.family}</small></div>{([['exposure','Exposure',-100,100],['contrast','Contrast',-50,50],['saturation','Saturation',-100,100],['warmth','Warmth',-50,50],['grain','Film grain',0,100],['halation','Halation',0,100],['bloom','Bloom',0,100],['vignette','Vignette',0,100]] as const).map(([key,label,min,max]) => <div className="slider-row" key={key}><div><label>{label}</label><output>{knobs[key] > 0 ? '+' : ''}{knobs[key]}</output></div><input type="range" min={min} max={max} value={knobs[key]} onChange={e => update(key, Number(e.target.value))}/></div>)}<button className="reset-wide" onClick={() => setKnobs(initial)}><RotateCcw size={14}/> RESET ALL</button><div className="panel-foot"><span>LIVE FRAME ADJUSTMENTS</span><span>NON-DESTRUCTIVE PREVIEW</span></div></div>}
        </aside>
      </main>
      <footer className="footer"><span>GRAINROOM — VIDEO FILM EMULATION</span><span>LOCAL PROCESSING · WEBM EXPORT · CODEC SUPPORT DEPENDS ON BROWSER</span></footer>
    </div>
  );
}
