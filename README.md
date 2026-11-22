# GRAINROOM — A Digital Film Lab

Film-emulation workspace for photographers, filmmakers, and visual artists. This repository contains the current React/TypeScript photo and video application.

## Development

Requires Node.js and npm.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Current capabilities

- Stock-specific creative rendering engine with per-stock channel response, shadow/highlight colour bias, toe/shoulder curves, monochrome spectral mixes and luminance-shaped grain.
- Dedicated response signatures for key stocks including Portra 400, Gold 200, Ektar, Vision3 50D/250D/500T, Velvia, Provia, HP5, T-Max, Tri-X, Polaroid and 2383 print film.
- Other catalogue entries use family- and stock-name-aware response defaults, so they are no longer all processed through one generic CSS filter.

- Photo grading with film-inspired stock profiles and image controls.
- Video preview and browser-based WebM export.
- Automatically generated, cached 17-point 3D creative LUT for every film stock, applied automatically when selected.
- Stock-specific tone response, colour bias, monochrome spectral mixes, grain and highlight behaviour.
- Built-in stock LUTs expect Rec.709 / standard display-referred input. Convert camera Log or HDR footage to Rec.709 before importing; camera-specific input transforms are not included yet.
- MP4 export is not currently implemented.

## DaVinci Resolve / OpenFX

A native OpenFX plugin and Windows installer are planned, not included as compiled binaries yet. Compatibility with Resolve Free and Studio requires testing.

Film profiles are creative interpretations, not official manufacturer LUTs or calibrated reproductions. Grainroom is under active development.