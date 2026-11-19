# GRAINROOM — A Digital Film Lab

Grainroom is a film-emulation workspace for photographers, filmmakers, and visual artists. See the source folders for the current photo and video workflows. The project is under active development.

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
- DaVinci Resolve OpenFX integration and a Windows installer are planned, not yet built.

Camera profile selection alone is not a calibrated transform. For log or HDR footage, load the correct technical input LUT. MP4 export is not currently implemented.

Film profiles are creative interpretations, not official manufacturer LUTs or calibrated reproductions.