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

- Photo grading with film-inspired stock profiles and image controls.
- Video preview and browser-based WebM export.
- 3D `.cube` camera input LUT import, validation, and trilinear interpolation.
- Camera profile selection alone is not a calibrated transform. For log/HDR footage, load the correct technical input LUT.
- MP4 export is not currently implemented.

## DaVinci Resolve / OpenFX

A native OpenFX plugin and Windows installer are planned, not included as compiled binaries yet. Compatibility with Resolve Free and Studio requires testing.

Film profiles are creative interpretations, not official manufacturer LUTs or calibrated reproductions. Grainroom is under active development.