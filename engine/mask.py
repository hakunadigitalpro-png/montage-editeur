# Détourage de la personne (remplace personmask.swift, Mac-only) → bt/person/%05d.png (RGBA) + bt/headbox.json
import sys, os, json, glob
from PIL import Image, ImageFilter
from rembg import new_session, remove

W = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else ".")  # usage: python mask.py <modele> <work>
model = sys.argv[1] if len(sys.argv) > 1 else "u2net_human_seg"
frames = sorted(glob.glob(os.path.join(W, "vfr", "*.jpg")))
if len(sys.argv) > 3:  # sous-ensemble: "100,400"
    want = {int(x) for x in sys.argv[3].split(",")}
    frames = [f for f in frames if int(os.path.basename(f)[:5]) in want]
os.makedirs(os.path.join(W, "bt", "person"), exist_ok=True)
S = new_session(model)
hb_path = os.path.join(W, "bt", "headbox.json")
hb = json.load(open(hb_path)) if os.path.exists(hb_path) else {}
for i, f in enumerate(frames):
    n = int(os.path.basename(f)[:5])
    out = os.path.join(W, "bt", "person", "%05d.png" % n)
    if os.path.exists(out) and str(n) in hb:
        continue
    im = Image.open(f).convert("RGB")
    small = im.resize((540, 960))
    m = remove(small, session=S, only_mask=True).resize(im.size, Image.BILINEAR)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.copy(); rgba.putalpha(m); rgba.save(out)
    bb = m.point(lambda v: 255 if v > 128 else 0).getbbox()
    if bb:
        # largeur de la tête: lignes 40-120 px sous le sommet
        y0 = bb[1]; xs = []
        for y in range(y0 + 40, min(y0 + 200, im.height), 20):
            row = m.crop((0, y, im.width, y + 1)).point(lambda v: 255 if v > 128 else 0).getbbox()
            if row: xs.append((row[0], row[2]))
        hx0 = min(a for a, b in xs) if xs else bb[0]; hx1 = max(b for a, b in xs) if xs else bb[2]
        hb[str(n)] = {"top": y0, "x0": hx0, "x1": hx1}
    if i % 50 == 0:
        print(i, "/", len(frames), flush=True); json.dump(hb, open(hb_path, "w"))
json.dump(hb, open(hb_path, "w"))
print("done", len(frames))
