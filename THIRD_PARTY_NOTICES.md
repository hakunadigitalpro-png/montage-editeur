# Third-party notices

## Rendering engine — `engine/compose.REFERENCE.html`, `engine/02_captions.py`, `engine/04_render_frames.js`, `engine/09_srt.py`, `engine/cut_zoom.py`
From the skill **video-ad-editor** (Egyptian edition 3.4) by **Majed Alzaabi**, MIT License — full text in `engine/LICENSE-engine-MIT.txt`.
`engine/cut_zoom.py` is a Windows-compatible adaptation of its `03_cut_zoom.py`; `engine/mask.py` replaces its macOS-only person mask with `rembg`.

## Runtime dependencies (installed by the user, not bundled)
- ffmpeg (LGPL/GPL) · Node.js + puppeteer-core (Apache-2.0) · Google Chrome or Microsoft Edge
- openai-whisper (MIT) · rembg (MIT) + onnxruntime (MIT) · numpy, scipy, pillow (BSD / HPND)
- Fonts loaded at render time from Google Fonts / Fontshare under their own licences.
