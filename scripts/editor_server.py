# Local server for the editing interface (skill montage-editeur)
#   python editor_server.py <project_folder> [port]   → http://localhost:<port>/editeur/
# Serves the project folder (with HTTP Range, needed to seek in videos) + a small API:
#   GET  /api/state            → {edits, comments, render, version}
#   POST /api/edits            → saves edits.json (offsets, hidden elements, caption fixes, volumes)
#   POST /api/comments         → adds a comment (comments.json) — Claude processes it
#   POST /api/comments/status  → {id, status: "à faire"|"en cours"|"fait", reply}
#   POST /api/render           → runs rendu.sh (render with the current settings)
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import json, os, sys, time, uuid, subprocess, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8770
RENDU = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rendu.sh")
F_ED, F_CM, F_LOG = (os.path.join(ROOT, n) for n in ("edits.json", "comments.json", "editeur/render.log"))
import shutil
BASH = os.environ.get("BASH_EXE") or next((p for p in (r"C:\Program Files\Git\bin\bash.exe", shutil.which("bash")) if p and os.path.exists(p)), "bash")
LOCK = threading.Lock(); RENDER = {"running": False, "started": None, "ended": None, "ok": None}

def rj(p, d):
    try:
        with open(p, encoding="utf-8") as f: return json.load(f)
    except Exception: return d
def wj(p, v):
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f: json.dump(v, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)

def run_render():
    RENDER.update(running=True, started=time.time(), ended=None, ok=None)
    with open(F_LOG, "w", encoding="utf-8") as log:
        r = subprocess.run([BASH, RENDU, ROOT], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT)
    RENDER.update(running=False, ended=time.time(), ok=(r.returncode == 0))

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header("Cache-Control", "no-store"); super().end_headers()
    def _json(self, v, code=200):
        b = json.dumps(v, ensure_ascii=False).encode("utf-8")
        self.send_response(code); self.send_header("Content-Type", "application/json; charset=utf-8"); self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)
    def _body(self):
        n = int(self.headers.get("Content-Length") or 0); return json.loads(self.rfile.read(n).decode("utf-8") or "{}")
    def do_GET(self):
        if self.path.startswith("/api/state"):
            tail = ""
            try:
                with open(F_LOG, encoding="utf-8", errors="replace") as f: tail = "".join(f.readlines()[-6:])
            except Exception: pass
            cv = os.path.join(ROOT, "compose.html"); ver = os.path.getmtime(cv) if os.path.exists(cv) else 0
            return self._json({"edits": rj(F_ED, {}), "comments": rj(F_CM, []), "render": {**RENDER, "log": tail}, "version": ver})
        rng = self.headers.get("Range")
        path = self.translate_path(self.path.split("?")[0])
        if rng and os.path.isfile(path):   # lecture par morceaux (nécessaire pour se déplacer dans les vidéos)
            size = os.path.getsize(path); a, _, b = rng.replace("bytes=", "").partition("-")
            a = int(a) if a else 0; b = min(int(b) if b else size - 1, size - 1)
            self.send_response(206); self.send_header("Content-Type", self.guess_type(path)); self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {a}-{b}/{size}"); self.send_header("Content-Length", str(b - a + 1)); self.end_headers()
            with open(path, "rb") as f:
                f.seek(a); left = b - a + 1
                while left > 0:
                    chunk = f.read(min(1 << 16, left))
                    if not chunk: break
                    try: self.wfile.write(chunk)
                    except (BrokenPipeError, ConnectionResetError): break
                    left -= len(chunk)
            return
        return super().do_GET()
    def do_POST(self):
        with LOCK:
            if self.path == "/api/edits":
                wj(F_ED, self._body()); return self._json({"ok": True})
            if self.path == "/api/comments":
                c = self._body(); cm = rj(F_CM, [])
                c.update(id=uuid.uuid4().hex[:8], status="à faire", created=time.strftime("%Y-%m-%d %H:%M:%S"), reply="")
                cm.append(c); wj(F_CM, cm); return self._json(c)
            if self.path == "/api/comments/status":
                b = self._body(); cm = rj(F_CM, [])
                for c in cm:
                    if c["id"] == b.get("id"):
                        c["status"] = b.get("status", c["status"]); c["reply"] = b.get("reply", c.get("reply", ""))
                wj(F_CM, cm); return self._json({"ok": True})
            if self.path == "/api/render":
                if RENDER["running"]: return self._json({"ok": False, "msg": "rendu déjà en cours"})
                threading.Thread(target=run_render, daemon=True).start(); return self._json({"ok": True})
        self._json({"error": "inconnu"}, 404)

if __name__ == "__main__":
    print(f"Éditeur : http://localhost:{PORT}/editeur/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
