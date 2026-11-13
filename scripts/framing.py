# Cadrage de la personne dans la carte des panneaux, plan par plan, depuis la silhouette (bt/person/*.png) → framing.js
# projet.json : "coupes": [..], "cadrage": {"<n° de plan>": [début, fin]}, "cadrage_force": {"<n°>": [sommet_tête_px, centre_x_px]}
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import json, os, sys, numpy as np
from PIL import Image
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
P = json.load(open(os.path.join(W, "projet.json"), encoding="utf-8"))
HEAD_Y = P.get("tete_y", 930)   # "tete_h" = distance sommet de la tête → menton en px du cadre (830 gros plan, ~430 plan large)
out = {}
for seg, (a, b) in P.get("cadrage", {}).items():
    tops, cxs = [], []
    for t in np.arange(a, b, 0.25):
        f = os.path.join(W, "bt", "person", "%05d.png" % (int(round(t * 30)) + 1))
        if not os.path.exists(f): continue
        al = np.array(Image.open(f).getchannel("A").resize((270, 480))) > 128
        ok = np.where(al.sum(1) > 25)[0]
        if not len(ok): continue
        T = ok[0]; ys, xs = np.nonzero(al[T:T + 130]); tops.append(T * 4); cxs.append(xs.mean() * 4)
    if not tops and seg not in P.get("cadrage_force", {}): print("plan", seg, ": pas de silhouette"); continue
    T, cx = (float(np.median(tops)), float(np.median(cxs))) if tops else (0, 540)
    if seg in P.get("cadrage_force", {}): T, cx = P["cadrage_force"][seg]
    s = max(0.56, 1035 / (1920 - T)); oy = HEAD_Y - s * T; vw = 1080 * s; ox = (1080 - vw) / 2
    ox += max(-140, min(140, 540 - (ox + s * cx)))
    out[int(seg)] = {"s": round(s, 4), "ox": round(ox, 1), "oy": round(oy, 1), "ct": round(min(oy + s * (T + P.get("tete_h", 830)), 1500), 1), "tc": round(T - 18, 1)}
    print("plan", seg, "→", out[int(seg)])
open(os.path.join(W, "framing.js"), "w", encoding="utf-8").write("PF_SEG=" + json.dumps(out) + ";\n")
