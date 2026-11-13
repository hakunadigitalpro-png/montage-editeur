# Changelog

## 1.0.1 — 2026-11-13
- fix: `sons.py` now writes `sfx.wav` and `music.wav` (they were computed but not saved);
- `framing.py`: new `tete_h` setting (head-top → chin distance) for wide shots, so only the head pops out of the card;
- `rendu.sh`: `REPRISE=" " bash rendu.sh <project>` resumes an interrupted frame render instead of starting over;
- editor: red "disconnected" banner + error message when a comment cannot be sent.

## 1.0.0 — 2026-11-12
First public release, extracted from real client work (a product ad and a SaaS explainer):
- panel motion-graphics edit (zoom out into a card with the head popping out), punch-in / zoom-out camera, captions (LTR & RTL), brand pill, light flashes on cuts;
- website capture (full pages, transparent logos, colours, fonts) with cookie banners hidden;
- synthesized background music + sound effects tied to elements; stems + -14 LUFS mix;
- local editing interface: scenes, live preview, element timeline (drag to shift, hide), caption fixes, volumes, click-to-comment processed by Claude, render button;
- `ancres.py` anchor checker (catches animations hooked to the wrong word).
