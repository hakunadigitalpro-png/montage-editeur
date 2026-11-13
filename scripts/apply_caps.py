# Applique les corrections de sous-titres de l'éditeur (edits.json → "caps": {"carte:mot": "texte"}) à caps.json
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import json, os, sys, shutil
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
orig = os.path.join(W, "caps.orig.json"); cur = os.path.join(W, "caps.json")
if not os.path.exists(orig): shutil.copy(cur, orig)
caps = json.load(open(orig, encoding="utf-8"))
ed = json.load(open(os.path.join(W, "edits.json"), encoding="utf-8")) if os.path.exists(os.path.join(W, "edits.json")) else {}
n = 0
for k, v in (ed.get("caps") or {}).items():
    ci, wi = map(int, k.split(":")); caps["cards"][ci]["w"][wi]["t"] = v; n += 1
json.dump(caps, open(cur, "w", encoding="utf-8"), ensure_ascii=False)
print("sous-titres corrigés :", n)
