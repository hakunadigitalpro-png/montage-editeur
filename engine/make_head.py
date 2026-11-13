# Usage: python make_head.py <work> → head.js (sommet de la tête par image) + behind.json (charge la silhouette à chaque image)
import json, os, sys
W = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
hb = json.load(open(os.path.join(W, "bt", "headbox.json")))
head = {int(k): v["top"] for k, v in hb.items()}
open(os.path.join(W, "head.js"), "w").write("const HEAD=" + json.dumps(head) + ";")
n = len([f for f in os.listdir(os.path.join(W, "vfr")) if f.endswith(".jpg")])
json.dump({"lines": [], "ranges": [[1, n]], "faces": {}}, open(os.path.join(W, "behind.json"), "w"))
print(len(head), "têtes · sommet min", min(head.values()), "max", max(head.values()))
