# OmniCAD website

A static single-page research website rebuilt from the supplied OmniLayout/OmniMech reference source and populated from the supplied OmniCAD main-paper and supplementary materials.

## Run locally

Because the 3D viewer uses ES modules, serve the folder over HTTP rather than opening `index.html` directly:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Release files

Replace these empty ZIPs with the final release packages, keeping the paths unchanged:

- `res/omnicad_code.zip`
- `res/omnicad_samples.zip`

## Interactive 3D

The supplied OmniCAD materials contain no GLB/GLTF/OBJ sample binaries suitable for direct browser interaction, so the 3D cards are intentionally unpopulated. See `models/README.md` for the exact filenames. Once those GLBs are added, the cards will load automatically.

The implementation mirrors the reference site: a shared Three.js WebGL canvas, `GLTFLoader`, `OrbitControls`, automatic centering/scaling, drag-to-orbit, wheel/pinch zoom, and theme-aware materials.

## Deployment checklist

1. Replace the two empty ZIP release files.
2. Optionally add the five GLBs documented in `models/README.md`.
3. Replace `https://omnicad.example/` in `sitemap.xml` with the production domain.
4. If a public arXiv/DOI becomes available, add it to the header/nav/citation metadata.


## Qualitative video

The qualitative-results section now uses one full-width MP4 containing all cases.
Place the final video at:

`public/media/3D-interaction.mp4`

Recommended web export: H.264 MP4, at least 2560 px wide for a wide composite, CRF 18–22, muted/loop-ready. The existing `qualitative-results.png` is used as the poster/fallback until the MP4 is supplied.

All paper figures are displayed without CSS color filters, inversion, hue rotation, or blend-mode recoloring.


## Qualitative video

Place the web-ready qualitative video at `public/media/3D-interaction.mp4`. Recommended encode: 5120×960 H.264, CRF 16, yuv420p, faststart. The page uses the original aspect ratio without cropping.
