import { ArrowLeft, ExternalLink, FileCode2, MonitorDown, ShieldCheck } from 'lucide-react';

export default function ResolveHub({ onBack }: { onBack: () => void }) {
  return (
    <div className="shell resolve-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><FileCode2 size={19}/></div><span>GRAIN<span className="brand-light">ROOM</span></span><span className="edition">RESOLVE / OFX</span></div>
        <div className="top-actions"><span className="status-dot"></span><span className="status-label">PLUGIN DEVELOPMENT</span><button className="export-btn" onClick={onBack}><ArrowLeft size={14}/> BACK TO LAB</button></div>
      </header>
      <main className="resolve-content">
        <div className="eyebrow">NATIVE WORKFLOW / OPENFX</div>
        <h1>Grainroom, <em>inside Resolve.</em></h1>
        <p className="resolve-intro">The target is a native OpenFX effect on the Color page, with camera input transforms, film-stock emulation and analog controls in the Inspector.</p>
        <div className="resolve-grid">
          <article className="resolve-card"><span>01 / INSTALLER</span><h2>One-click setup</h2><p>A Windows setup executable will install the compiled plugin bundle into the shared OFX folder and provide an uninstaller.</p></article>
          <article className="resolve-card"><span>02 / FILM LIBRARY</span><h2>Stock emulation</h2><p>Color negative, motion-picture, slide, monochrome, instant and print-film profiles, plus grain and halation controls.</p></article>
          <article className="resolve-card"><span>03 / CAMERA INPUT</span><h2>Source-aware pipeline</h2><p>Select camera gamut and log curve first, normalize into the working space, then apply the film stock and output transform.</p></article>
        </div>
        <div className="resolve-build">
          <div className="resolve-build-icon"><MonitorDown size={25}/></div>
          <div><div className="eyebrow">WINDOWS INSTALLER PLAN</div><h2>Grainroom-Setup.exe</h2><p>The installer will request administrator permission, check whether Resolve is running, install the compiled <code>Grainroom.ofx.bundle</code> into the standard OFX directory and register an uninstaller. Resolve must be restarted after setup.</p><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: '#c4b994', font: '10px DM Mono, monospace' }}><ShieldCheck size={15}/><span>Installer design specified · executable not yet compiled or tested</span></div></div>
        </div>
        <div className="resolve-install"><h2>Target OFX installation folder</h2><code>C:\\Program Files\\Common Files\\OFX\\Plugins\\Grainroom.ofx.bundle</code><p>The installer will use the shared Windows OFX plugin location without modifying Resolve project files or unrelated plugins.</p><a href="https://openfx.readthedocs.io/en/latest/Guide/" target="_blank" rel="noreferrer">OpenFX developer guide <ExternalLink size={13}/></a><span> · </span><a href="https://openfx.readthedocs.io/en/latest/Reference/" target="_blank" rel="noreferrer">OpenFX API reference <ExternalLink size={13}/></a></div>
        <div className="resolve-footer"><span>BUILD TARGET: WINDOWS x64 · OPENFX</span><span>NATIVE BINARY + SETUP EXE STILL TO BUILD</span></div>
      </main>
    </div>
  );
}
