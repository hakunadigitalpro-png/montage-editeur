# Builds <project>/compose.html = engine (ref.html) + project scenes + editor settings + patches
# python build.py <project>   (reads projet.json; parts/top.js, parts/primitives.js, parts/gfx.js; framing.js; edits.json)
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import sys, os, json
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
R = lambda p: open(os.path.join(W, p), encoding="utf-8").read()
ex = lambda p: os.path.exists(os.path.join(W, p))
P = json.loads(R("projet.json"))
ref = R("ref.html").rstrip()
assert ref.endswith("</body></html>"), "ref.html must be a copy of engine/compose.REFERENCE.html"

# 1) caption effect "strike" (word crossed out live)
old = "X.fillText(i.t,x,cy+lift);\n      X.shadowColor='transparent';X.shadowBlur=0;"
new = old + ("\n      if(i.fx==='strike'&&sp){const k=ease(Math.min(1,Math.max(0,(t-i.s-0.15)/0.25)));"
             "if(k>0){X.strokeStyle=ACC;X.lineWidth=Math.max(8,fs*0.13);X.lineCap='round';X.beginPath();"
             "X.moveTo(x+8,cy+lift+fs*0.06);X.lineTo(x+8-(i.w+16)*k,cy+lift-fs*0.06);X.stroke();}}")
# 2) caption effect "pill" (brand name in a coloured pill)
pill = P.get("pill", {"bg": "#7A86F2", "ink": "#FFFFFF"})
PATCH = [(old, new),
         ("X.fillStyle=(CAPSTYLE==='bar'&&act)?onACC():((i.hot&&sp)?ACC:'#FFFFFF');",
          "if(i.fx==='pill'&&sp){X.save();X.shadowColor='rgba(0,0,0,0.35)';X.shadowBlur=24;X.shadowOffsetY=6;X.fillStyle='%s';"
          "rr(x-i.w-26,cy+lift-fs*0.72,i.w+52,fs*1.42,fs*0.34);X.fill();X.restore();}\n      "
          "X.fillStyle=(i.fx==='pill')?'%s':(CAPSTYLE==='bar'&&act)?onACC():((i.hot&&sp)?ACC:'#FFFFFF');" % (pill["bg"], pill["ink"]))]
# 3) left-to-right languages (French, English…): the engine lays words out right-to-left by default
if P.get("sens", "rtl") == "ltr":
    PATCH += [("X.textAlign='right';X.textBaseline='middle'; X.font='900 '+FS2+'px '+FONT;",
               "X.textAlign='right';X.textBaseline='middle'; X.font='900 '+FS2+'px '+FONT; X.direction='ltr';"),
              ("for(const i of ln.items){ if(CAPSTYLE==='type'&&t<i.s) break; drawWord",
               "for(const i of [...ln.items].reverse()){ if(CAPSTYLE==='type'&&t<i.s) break; drawWord")]
for a, b in PATCH:
    assert a in ref, "engine anchor not found: " + a[:50]
    ref = ref.replace(a, b, 1)

parts = [R(p) for p in ("parts/top.js", "parts/primitives.js", "parts/gfx.js") if ex(p)]
js = ("window.EDITS=" + (R("edits.json") if ex("edits.json") else "{}") + ";\nwindow.PROJET=" + json.dumps(P, ensure_ascii=False) + ";\n"
      + "\n".join(parts) + "\n" + (R("framing.js") if ex("framing.js") else ""))
open(os.path.join(W, "scenes3d.js"), "w", encoding="utf-8").write(js)
head = '<script src="head.js"></script>\n' if ex("head.js") else ""
out = ref[:-len("</body></html>")] + head + "<script>\n" + js + "\n</script>\n</body></html>\n"
open(os.path.join(W, "compose.html"), "w", encoding="utf-8").write(out)
print("compose.html ready (" + P.get("nom", "?") + ")")
