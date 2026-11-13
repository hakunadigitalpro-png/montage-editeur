# The editing interface — how it works (UI labels are in French)

## Interface (`editeur/index.html`, servi par `scripts/editor_server.py <W> <port>`)
- **Gauche — Scènes** (`SCENES_ED`) avec leurs éléments ; clic = aller à la scène / sélectionner.
- **Centre — Aperçu en direct** : `compose.html` dans une iframe ; la vidéo (`editeur/media/video.mp4`) et la silhouette (`editeur/media/silhouette.webm`, VP9 avec transparence) remplacent les images du rendu (`window.VSRC` / `window.PSRC`). Survol = cadre pointillé, clic = sélection + bulle de commentaire.
- **Droite — Inspecteur** : élément (début/fin, décalage ±0,1 s, Masquer, Remettre), zoom (supprimer), sous-titre (corriger un mot), volumes, commentaires de l'élément et de tout le projet avec statut et réponse de Claude.
- **Bas — Timeline** : Scènes (+ coupes), Zooms caméra, une ligne par élément (glisser = décaler, pas de 0,05 s), Sous-titres, Voix / Musique / Effets (formes d'onde). Espace = lecture, ← → = image par image.
- **Enregistrer** → `edits.json`. **Rendre la vidéo** → `scripts/rendu.sh <W>` (statut affiché en haut).
- Quand Claude reconstruit `compose.html`, l'éditeur recharge l'aperçu tout seul (version = date de compose.html).

## API (serveur)
- `GET /api/state` → `{edits, comments, render, version}`
- `POST /api/edits` (corps = edits) · `POST /api/comments` · `POST /api/comments/status {id, status: "à faire"|"en cours"|"fait", reply}` · `POST /api/render`
- Le serveur gère les requêtes `Range` (obligatoire pour se déplacer dans les vidéos).

Exemple (Git Bash) :
```bash
curl -s -X POST localhost:8770/api/comments/status -H "Content-Type: application/json" -d '{"id":"ab12cd34","status":"fait","reply":"Carte agrandie et passée en vert."}'
```

## Surveiller les commentaires (outil Monitor, 30 min, à ré-armer)
```bash
cd "<W>"; seen=""; while true; do out=$(python -c "
import json
try: cm=json.load(open('comments.json',encoding='utf-8'))
except Exception: cm=[]
for c in cm:
  if c.get('status')=='à faire': print(c['id']+' | '+c.get('label','')+' | t='+str(c.get('t',''))+' | '+c.get('text','').replace(chr(10),' '))
" 2>/dev/null); while IFS= read -r line; do [ -z "$line" ] && continue; id=${line%% *}; case " $seen " in *" $id "*) ;; *) echo "NOUVEAU COMMENTAIRE: $line"; seen="$seen $id";; esac; done <<< "$out"; sleep 2; done
```

## Pièges connus
- `img.decode()` peut rester bloqué dans une iframe d'onglet caché → toujours `Promise.race` avec un délai (fait dans `gfx.EXEMPLE`).
- `requestAnimationFrame` s'arrête si l'onglet est caché → l'éditeur a une boucle de secours `setInterval`.
- The built-in browser pane can be small: ask the user to enlarge it.
- Dans l'aperçu, les effets sonores restent à leur place d'origine ; ils suivent les décalages au **rendu** (`sons.py` lit `edits.json`).
