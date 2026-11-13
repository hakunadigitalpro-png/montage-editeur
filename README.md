# montage-editeur — Claude skill

**Turn a talking-head video into a punchy motion-graphics edit (Reel, TikTok, Short or paid ad) — then fine-tune it in a CapCut-like editor where you click any animation to tell Claude what to change.**

*Created by Mariam Ben Aissa — Hakuna Digital.* · MIT License

---

## 🇫🇷 En bref

Envoie une vidéo face caméra à Claude (et le site de la marque si c'est pour un client). Le skill :

1. **monte la vidéo** dans un style « panneaux motion graphic » : plein écran rythmé ↔ panneaux où la personne rétrécit dans une carte en bas (zoom out) avec la tête qui dépasse, et au-dessus des animations à la charte de la marque (logo officiel, captures du site qui défilent, cartes, puces, révélation du logo) ;
2. ajoute **sous-titres**, **musique de fond**, **effets sonores**, **zooms in/out**, flashs sur les coupes ;
3. **capture le site du client** (pages complètes, logo transparent, couleurs, polices — bannière cookies masquée, jamais acceptée) ;
4. livre le **MP4** (normalisé -14 LUFS), les sous-titres `.srt`, et les **pistes séparées** (image, voix, musique, effets) ;
5. ouvre un **éditeur de montage local** : scènes, aperçu en direct, timeline de chaque animation (glisser pour décaler, masquer), correction des sous-titres, volumes — et **un clic sur une animation pour laisser un commentaire** que Claude traite (statut et réponse visibles dans l'éditeur). Bouton « Rendre la vidéo » pour la version finale.

## 🇬🇧 What it does

Send Claude a talking-head video (plus the brand's website for client work). The skill edits it in a **"motion-graphics panels"** style, adds captions, music, sound effects and camera moves, captures the client's website for on-brand visuals, renders a loudness-normalised MP4 with captions and stems, and opens a **local editing interface** where you can shift/hide animations, fix captions, set volumes and **click any element to comment** — Claude applies the change and the preview reloads.

---

## Installation

Requirements: **Claude Code** (desktop app or CLI), **bash** (macOS/Linux, or Git Bash on Windows), **Python 3.10+**, **Node.js 18+**, **ffmpeg**, **Google Chrome** or Microsoft Edge.

```bash
# 1. put the skill in your skills folder (Windows: run this in Git Bash)
git clone https://github.com/hakunadigitalpro-png/montage-editeur.git ~/.claude/skills/montage-editeur
cd ~/.claude/skills/montage-editeur
# 2. install the dependencies (from inside the skill folder)
npm install
pip install -r requirements.txt
# 3. ffmpeg if missing:  winget install Gyan.FFmpeg   ·   brew install ffmpeg   ·   sudo apt install ffmpeg
```

The editing interface and the pipeline messages are in **French** (Claude itself answers in your language).

Optional environment variables: `FFMPEG_DIR`, `PY`, `CHROME_PATH`, `PUPPETEER_PATH`, `BASH_EXE`.

The first transcription downloads the Whisper *turbo* model (~1.5 GB) and the first person cut-out downloads the *u2net_human_seg* model (~170 MB).

## Use

Just ask Claude, for example:
- « Monte cette vidéo avec l'éditeur » / "Edit this video with the editor"
- « C'est une pub pour mon client www.example.com, prends des captures du site »
- « Ouvre l'interface de montage » / "Open the editing interface"
- Then click an animation in the editor and write your comment.

Typical times on a laptop (20 s video): transcription 1-3 min · person cut-out 10-20 min (runs in the background) · render 3-6 min.

## What's inside

| Folder | Content |
|---|---|
| `SKILL.md` | Instructions for Claude (rules, workflow, element registry, comment processing) |
| `scripts/` | prepare, site capture, captions, framing, sounds & music, build, anchor check, render, remix, editor server |
| `engine/` | canvas rendering engine (MIT, see `THIRD_PARTY_NOTICES.md`), person cut-out |
| `editeur/` | the editing interface (single HTML file) |
| `templates/` | a complete example project (20 s product ad, 7 scenes, 18 animated elements) |
| `references/editor.md` | editor API, comment monitor, known pitfalls |

## Privacy & good practice
- Everything runs **locally**; the editor server listens on `127.0.0.1` only.
- Website captures never accept cookies; logged-in pages are never accessed.
- Use **official logos** and only claims the speaker actually makes — the skill enforces both.

## License
MIT © 2026 Mariam Ben Aissa (Hakuna Digital). Bundled rendering engine: MIT © 2026 Majed Alzaabi — see `THIRD_PARTY_NOTICES.md`.
