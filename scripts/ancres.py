# Checks word anchors: every wS(card, word) in parts/*.js → the caption word it really points to (and its time).
# python ancres.py <project>   — read the list: each animation must sit on the word it illustrates.
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import json, os, re, sys
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))["cards"]
print("== caption cards (card:word) ==")
for i, c in enumerate(caps):
    print("%2d  " % i + " | ".join("%d:%s@%.2f" % (j, w["t"], w["s"]) for j, w in enumerate(c["w"])))
print("\n== anchors used in the code ==")
bad = 0
for part in ("parts/top.js", "parts/gfx.js"):
    p = os.path.join(W, part)
    if not os.path.exists(p): continue
    for n, line in enumerate(open(p, encoding="utf-8"), 1):
        for m in re.finditer(r"wS\((\d+),\s*(\d+)\)", line):
            ci, wi = int(m.group(1)), int(m.group(2))
            if ci >= len(caps): print(f"  ❌ {part}:{n}  wS({ci},{wi}) → card does not exist"); bad += 1; continue
            ws = caps[ci]["w"]; clamp = wi >= len(ws); w = ws[min(wi, len(ws) - 1)]
            ctx = re.sub(r"\s+", " ", line.strip())[:70]
            print(f"  {'⚠️' if clamp else '  '} {part}:{n}  wS({ci},{wi}) → « {w['t']} » @ {w['s']:.2f}s{'  (index too large: clamped to last word)' if clamp else ''}   ·  {ctx}")
            bad += clamp
print("\n" + ("✅ no out-of-range anchor" if not bad else f"⚠️ {bad} anchor(s) to check") + " — still check by eye that each word matches its animation.")
