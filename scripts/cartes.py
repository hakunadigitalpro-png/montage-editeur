# Sous-titres : cartes.json (texte validé + timings Whisper) → a.json + fixes.json (format du moteur) puis caps.json
# cartes.json = {"cartes": [{"fin": 1.26, "mots": [["Comment", 0.0], ["doubler", 0.2], ...]}, ...], "hot": [...], "fx": {"mot": "pill|strike|slam|stretch|pulse"}}
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import json, os, sys, subprocess
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
C = json.load(open(os.path.join(W, "cartes.json"), encoding="utf-8"))
segs = []
for c in C["cartes"]:
    ws = c["mots"]; end = c["fin"]
    words = [{"word": " " + w, "start": s, "end": round(ws[i + 1][1] if i + 1 < len(ws) else end, 2)} for i, (w, s) in enumerate(ws)]
    segs.append({"start": ws[0][1], "end": end, "text": " ".join(w for w, _ in ws), "words": words})
json.dump({"text": "", "segments": segs}, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"fix": [[w for w, _ in c["mots"]] for c in C["cartes"]], "hot": C.get("hot", []), "fx": C.get("fx", {})},
          open(os.path.join(W, "fixes.json"), "w", encoding="utf-8"), ensure_ascii=False)
ENG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "engine")
subprocess.check_call([sys.executable, os.path.join(ENG, "02_captions.py"), W])
if os.path.exists(os.path.join(W, "caps.orig.json")): os.remove(os.path.join(W, "caps.orig.json"))   # nouvelles bases pour l'éditeur
print(len(C["cartes"]), "cartes")
