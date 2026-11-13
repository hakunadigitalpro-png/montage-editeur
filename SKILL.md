---
name: montage-editeur
description: Edits a talking-head video (9:16 Reel, TikTok, Short or paid ad) into a punchy motion-graphics edit — full-screen face cam alternating with "panels" where the speaker zooms out into a card at the bottom with their head popping out while animated graphics in the brand's charter (official logo, website captures, chat/phone mockups, feature cards, logo reveal) play above — plus captions, background music, sound effects, punch-in / zoom-out camera moves; then opens a local CapCut-like EDITING INTERFACE (scene list, live preview, timeline of every animation, captions, voice/music/effects tracks) where the user clicks any element to leave a comment that Claude processes. Use when the user sends a talking video to edit "with motion graphics", "for a client", "as an ad", "like a product demo", asks for "an editing interface / timeline", "to adjust the sound levels", or "to comment an animation".
license: MIT (see LICENSE and THIRD_PARTY_NOTICES.md)
---

# Motion-graphics edit + editing interface

Talk to the user in **their language**. Write captions in the **speaker's exact words** (never paraphrase).

Paths: `ME` = this skill folder, `W` = one project folder per video. All scripts are bash/python/node; `scripts/env.sh` finds ffmpeg, node, python, Chrome and the bundled engine (`engine/`). First time: see `README.md` → Installation (`npm install` in the skill folder, `pip install -r requirements.txt`).

## Rules (non-negotiable)
1. **Official logos only** for any brand mentioned — never a redrawn "inspired" icon. Get it from the brand's website (`capture_site.js`) or ask the user.
2. **Brand charter**: for a client, read colours, fonts and logo from their website (`captures/info.json`) and write the palette at the top of `parts/top.js`. For the user's own videos, ask for their charter once and keep it in `theme.json` + `top.js`.
3. **Website captures**: capture the client's site (full pages, desktop + mobile) and use them in panels (scrolling browser, cropped official illustrations). Cookie banners are **hidden, never accepted**. Logged-in product screens are not reachable: say so and offer to integrate screenshots the user provides.
4. **Rhythm**: full screen ↔ panels (zoom OUT in, zoom IN out), punch-ins on strong words (~1 every 2-3 s), exactly **one signature moment** (logo / name reveal), background music ducked under the voice, sound effects (whoosh on every zoom, pops, clicks, typing, impact on the reveal), light flash on jump cuts.
5. **Paid ads**: nothing important in the top 14 % (y < 270) nor below y ≈ 1250 (Reels/TikTok UI); captions raised (`CAPDY`); no captions inside panels (the panel shows the words as titles); end card = brand logo + URL + the speaker's words; **no invented claims or numbers**.
6. **Captions** never on the face. LTR languages → `"sens": "ltr"` in `projet.json` (the build fixes word order); RTL (Arabic) → `"rtl"`. Brand name as a **pill** (`fx: "pill"`, colours in `projet.json → pill`).
7. **Mix**: the user sets voice / music / effects in the editor. Defaults: voice 100 %, music 46 %, effects 36 %. Always loudness-normalise to -14 LUFS.
8. **Every animation is a registry ELEMENT** (see below) so the user can select, shift, hide and comment it. No animation outside the registry.
9. **Anchors**: every `wS(card, word)` must point at the word the animation illustrates — run `scripts/ancres.py` and read the table; never guess an index.

## Workflow
1. **Prepare**: `bash $ME/scripts/preparer.sh <video> <W> <lang> "<Whisper prompt: proper nouns>"` → copied source, full-frame crop, frames, likely cuts, word-level transcript. Then the **person cut-out in the background** (~1 s/frame; don't run Whisper at the same time — RAM): `python $ME/engine/mask.py u2net_human_seg <W> && python $ME/engine/make_head.py <W>`.
2. **Client** (if any): `node $ME/scripts/capture_site.js <url> <W>` → `captures/`, `assets/logo-*.png`, colours/fonts. Look at the captures; crop useful visuals into `W/assets/` (illustrations, a long page for a scrolling browser).
3. **Captions**: write `W/cartes.json` (exact words + Whisper timings; 2-5-word cards; `hot`, `fx`) → `python $ME/scripts/cartes.py <W>`. Template: `templates/cartes.EXAMPLE.json`.
4. **Edit plan**: split the script into beats (hook, problem, product, proof, CTA…), choose for each: full screen or panel, which concrete object to show, one signature moment, sounds. Write `W/plan-montage.md` (template `templates/plan.EXAMPLE.md`) and show it briefly to the user before animating.
5. **projet.json** (template `templates/projet.EXAMPLE.json`): `nom`, `titre`, `langue`, `sens`, `outro`, `vol`, `musique_gain`, `pill`, `coupes`, `cadrage` (shots that go into a panel → measuring window), `cadrage_force` if the mask catches the background. Then `python $ME/scripts/framing.py <W>`.
6. **Scenes** in `W/parts/`: `top.js` ← `templates/top.EXAMPLE.js` (palette, `CUTS`/`SEGB`, `PANELS`, zooms `ZP`, `CAPDY`); `primitives.js` ← `templates/primitives.js`; `gfx.js` ← `templates/gfx.EXAMPLE.js` (`SCENES_ED`, one `EL(...)` per animation, layers, end card, fonts).
7. **Sounds**: `W/sons.json` (template `templates/sons.EXAMPLE.json`): `musique` {bpm, intro_filtree, coupure = silence before a reveal, accords} and `events` = `[element|null, time|"fin+x", "sound[:param]", gain, [repeat, step]]`. Sounds: pop, bulle, clic, shutter, succes, buzz, tick, touche, impact, tape, whoosh_in:dur, whoosh_out:dur, ding:freq:dur, shimmer:dur, riser:dur, souffle:dur. **Link each sound to its element** so it follows when the element is shifted or hidden.
8. **Anchors**: `python $ME/scripts/ancres.py <W>`.
9. **Previews**: `python $ME/scripts/build.py <W>` then `node $ME/engine/04_render_frames.js <W> preview t1 t2 …` → contact sheet → review like a demanding editor (readable? face clear? ad safe zones?) and fix before rendering.
10. **Render**: `bash $ME/scripts/rendu.sh <W>` (background, 3-6 min) → `<nom>.mp4` (+ `.srt`/`.txt`), stems in `mixage/pistes/`, editor media. Check 6-8 frames of the MP4, -14 LUFS, size.
11. **Editor**: run `python $ME/scripts/editor_server.py <W> <port>` (in Claude Code desktop: add it to `.claude/launch.json` and use the preview tool), open `http://localhost:<port>/editeur/`. Verify the preview, click-to-select and playback work.
12. **Watch comments**: monitor `W/comments.json` and emit one line per new comment with `status == "à faire"` (command in `references/editor.md`).

## Processing a comment
1. Read it (`target` = `el:<id>` | `scene:<id>` | `cap:<n>` | `audio:<track>`, `t`, click `x`,`y`).
2. Set status "en cours": `POST /api/comments/status {"id":…, "status":"en cours"}`.
3. Change the element in `parts/gfx.js` (or `top.js` for zooms/panels, `cartes.json` for captions, `sons.json` for sounds), staying within the charter and the registry. If the request is vague, apply the best option and mention an alternative in the reply.
4. `python $ME/scripts/build.py <W>` (+ `sons.py` if sounds change) → the editor **reloads its preview by itself**. Check 1-2 preview frames.
5. Status "fait" + a short `reply` (what changed) — shown in the editor. Remind the user they can click "Rendre la vidéo".
6. A general preference ("I never want X") → add it to the Rules of this file.

## Element registry (contract with the editor)
`EL(id, name, scene, layer, [x,y,w,h], ()=>[start,end], t=>{…draw…})`
- `layer`: `'panel'` (drawn inside the panel, behind the popping head) · `'full'` (full screen, in front) · `'none'` (global: flashes, end card).
- `t` received = time shifted by the editor (`EDITS.off`); draw only inside your window; hidden if `EDITS.hide[id]`.
- The box `[x,y,w,h]` is used for clicking in the preview: keep it accurate.
- `SCENES_ED` = scenes listed on the left of the editor (`id`, `label`, `a`, `b`, `kind`).
- Zooms: each `ZP` entry is element `zoom<i>` (can be removed in the editor).

## Project files
`projet.json` · `cartes.json` → `caps.json` (`caps.orig.json` = editor base) · `sons.json` · `parts/{top,primitives,gfx}.js` · `framing.js` · `edits.json` (editor settings: off, hide, caps, vol) · `comments.json` · `captures/`, `assets/` · `mixage/pistes/` · `editeur/` · `<nom>.mp4/.srt/.txt`.
