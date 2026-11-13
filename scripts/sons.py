# Design sonore : sfx.wav (effets, mixés par 06_encode) + music.wav (fond, baissé sous la voix par 06b_master)
# python tools/audio_1109.py <work>
import sys as _s
try: _s.stdout.reconfigure(encoding='utf-8', errors='replace'); _s.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass
import numpy as np, wave, os, sys, json
from scipy.signal import butter, sosfilt
D = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
caps = json.load(open(os.path.join(D, "caps.json"), encoding="utf-8"))
P = json.load(open(os.path.join(D, "projet.json"), encoding="utf-8")); SN = json.load(open(os.path.join(D, "sons.json"), encoding="utf-8"))
SR = 48000; OUTRO = float(P.get("outro", 3.0)); DUR = caps["total"] + OUTRO; N = int(SR * (DUR + 1))
rng = np.random.default_rng(11)

def env(n, a=0.002, d=0.1):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def tone(f0, f1, dur, d, a=.002):
    n = int(SR * dur); f = np.geomspace(f0, f1, n); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, a, d)
def noise(dur): return rng.standard_normal(int(SR * dur))

# ---------- effets ----------
def pop(): return tone(900, 300, .09, .03) * .8 + bp(noise(.09), 2000, 6000) * env(int(SR * .09), .001, .006) * .3
def bubble_pop(): return tone(520, 1100, .08, .03) * .7
def click():
    c = bp(noise(.012), 2500, 9000) * env(int(SR * .012), .0005, .002)
    out = np.zeros(int(SR * .1)); out[:len(c)] += c; out[int(SR * .065):int(SR * .065) + len(c)] += c * .6; return out * 1.6
def whoosh(dur=.42, up=True):
    n = int(SR * dur); x = noise(dur); t = np.linspace(0, 1, n)
    e = np.sin(np.pi * (t ** (.55 if up else 1.7))) ** 2
    lo = bp(x, 300, 2500); hi = bp(x, 1800, 7000)
    mix = lo * (1 - t if up else t) + hi * (t if up else 1 - t)
    return mix * e * 1.1
def shutter():
    s = np.zeros(int(0.26 * SR))
    def tk(dur, f, decay, nz):
        L = int(dur * SR); tt = np.arange(L) / SR
        return (np.sin(2 * np.pi * f * tt) * (1 - nz) + hp(rng.standard_normal(L), 1500) * nz) * np.exp(-tt / decay) * np.minimum(1, tt / 0.0004)
    c1 = tk(0.05, 1900, 0.006, 0.8); c2 = tk(0.06, 1400, 0.009, 0.8)
    L = int(0.09 * SR); tt = np.arange(L) / SR; sw = hp(rng.standard_normal(L), 2500) * np.sin(np.pi * tt / 0.09) * 0.35
    s[:len(c1)] += c1; s[int(0.02 * SR):int(0.02 * SR) + L] += sw; s[int(0.11 * SR):int(0.11 * SR) + len(c2)] += c2 * 0.8
    return s / np.max(np.abs(s))
def ding(f=1318.5, d=.5):
    n = int(SR * 1.0); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.01 * t) + .2 * np.sin(2 * np.pi * f * 3 * t)) * env(n, .002, d) * .35
def success():
    out = np.zeros(int(SR * 1.2)); a = ding(1046.5, .35); b = ding(1568, .5); out[:len(a)] += a; out[int(SR * .09):int(SR * .09) + len(b)] += b; return out
def buzz():
    n = int(SR * .14); t = np.arange(n) / SR; sq = np.sign(np.sin(2 * np.pi * 140 * t)) * env(n, .003, .08)
    out = np.zeros(int(SR * .36)); out[:n] += lp(sq, 1400) * .4; out[int(SR * .17):int(SR * .17) + n] += lp(sq, 1400) * .4; return out
def tick(): return bp(noise(.01), 3000, 9000) * env(int(SR * .01), .0003, .002) * .9
def key(): return bp(noise(.02), 1500, 6000) * env(int(SR * .02), .0005, .004) * 1.2
def impact():
    a = tone(140, 40, .7, .25, .001) * 1.3; b = lp(noise(.7), 300) * env(int(SR * .7), .001, .05) * .6
    c = hp(noise(.9), 3000) * env(int(SR * .9), .002, .35) * .25
    out = np.zeros(int(SR * .9)); out[:len(a)] += a + b; out += c; return out
def shimmer(dur=1.2):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for k, f in enumerate([1568, 2093, 2637, 3136]):
        s += np.sin(2 * np.pi * f * t) * np.exp(-np.maximum(0, t - k * .05) / .35) * (t > k * .05) * .18
    return s
def riser(dur):
    n = int(SR * dur); t = np.linspace(0, 1, n)
    x = bp(noise(dur), 800, 6000) * t ** 2.2 * .6
    f = np.geomspace(180, 900, n); x += np.sin(2 * np.pi * np.cumsum(f) / SR) * t ** 2.5 * .25
    return x
def tape_stop():
    n = int(SR * .45); f = np.geomspace(700, 60, n); t = np.linspace(0, 1, n)
    return (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .25 + bp(noise(.45), 500, 4000) * .5) * (1 - t) ** .5
def hiss(dur): return bp(noise(dur), 2000, 9000) * .12

sfx = np.zeros(N)
def put(t, s, g=1.0):
    i = int(t * SR); j = min(N, i + len(s));
    if i < N: sfx[i:j] += s[:j - i] * g


# ---------- événements (sons.json) ----------
ED = json.load(open(os.path.join(D, "edits.json"), encoding="utf-8")) if os.path.exists(os.path.join(D, "edits.json")) else {}
def SIG(spec):
    k, *a = spec.split(":"); a = [float(x) for x in a]
    return {"pop": lambda: pop(), "bulle": lambda: bubble_pop(), "clic": lambda: click(), "shutter": lambda: shutter(), "succes": lambda: success(),
            "buzz": lambda: buzz(), "tick": lambda: tick(), "touche": lambda: key(), "impact": lambda: impact(), "tape": lambda: tape_stop(),
            "whoosh_in": lambda: whoosh(a[0] if a else .42, True), "whoosh_out": lambda: whoosh(a[0] if a else .42, False),
            "ding": lambda: ding(a[0] if a else 1318.5, a[1] if len(a) > 1 else .3), "shimmer": lambda: shimmer(a[0] if a else 1.2),
            "riser": lambda: riser(a[0] if a else 2.0), "souffle": lambda: hiss(a[0] if a else 1.5)}[k]()
for e in SN.get("events", []):      # [élément|null, temps|"fin+x", "son[:param]", gain, (répéter, pas)]
    eid, t, spec, g = e[0], e[1], e[2], float(e[3]); n, dt = (e[4] if len(e) > 4 else [1, 0])
    t = caps["total"] + float(t[3:] or 0) if isinstance(t, str) and t.startswith("fin") else float(t)   # "fin+0.3" = après la fin de la vidéo
    if eid and (ED.get("hide") or {}).get(eid): continue
    t += float((ED.get("off") or {}).get(eid, 0)) if eid else 0
    sig = SIG(spec)
    for i in range(int(n)): put(t + i * dt, sig, g)

# ---------- musique : groove tech 118 bpm, Am – F – C – G ----------
M = SN.get("musique", {}); BPM = M.get("bpm", 120); beat = 60 / BPM; mus = np.zeros(N); drums = np.zeros(N)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def mput(buf, t, s, g=1.0):
    i = int(t * SR); j = min(N, i + len(s));
    if 0 <= i < N: buf[i:j] += s[:j - i] * g
def kick(): return tone(150, 45, .32, .12, .001) * 1.0
def clap():
    x = bp(noise(.18), 900, 5000); e = env(int(SR * .18), .001, .05); return x * e * .55
def hat(open_=False): d = .09 if open_ else .025; return hp(noise(d * 3), 7000) * env(int(SR * d * 3), .0005, d) * (.22 if open_ else .14)
def pluck(f, dur=.5, g=.12):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * f * t)) * .35 + np.sin(2 * np.pi * f * t)
    return lp(s, 2600) * env(n, .003, .16) * g
def bass(f, dur):
    n = int(SR * dur); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t)) * env(n, .004, dur * .6) * .5
def pad(fs, dur):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        for dt in (-0.12, 0.12): s += np.sin(2 * np.pi * f * (1 + dt / 100) * t)
    a = np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .5); return lp(s, 1800) * a * .05
CH = M.get("accords", [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]])   # Am F C G par défaut
BREAK = tuple(M.get("coupure", [-1, -1])); END = caps["total"]
b = 0
while b * beat < END:
    t = b * beat; bar = (b // 4) % 4; ch = CH[bar]; k = b % 4
    inbreak = BREAK[0] <= t < BREAK[1]; intro = t < M.get("intro_filtree", 0)
    if k == 0: mput(mus, t, pad([mtof(m) for m in ch] + [mtof(ch[0] + 12)], beat * 4 + .3), 1.0 if not inbreak else 1.4)
    if not inbreak:
        mput(drums, t, kick(), .9)
        if not intro:
            if k in (1, 3): mput(drums, t, clap(), .7)
            mput(drums, t + beat / 2, hat(True), 1)
            for q in (0, .25, .75): mput(drums, t + beat * q, hat(), 1)
            mput(mus, t, bass(mtof(ch[0] - 24), beat * .45), 1); mput(mus, t + beat / 2, bass(mtof(ch[0] - 24), beat * .4), .8)
            arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
            mput(mus, t, pluck(mtof(arp[k])), 1); mput(mus, t + beat / 2, pluck(mtof(arp[(k + 2) % 4]), .35, .08), 1)
    b += 1
# accord final
mput(mus, END, pad([mtof(m) for m in [45, 57, 60, 64, 69]], OUTRO + .5), 2.0)
mput(mus, END, pluck(mtof(69), 1.2, .15), 1)
music = mus + drums
# intro filtrée (0 → 1.15 s) puis ouverture
i1 = int(M.get("intro_filtree", 0) * SR)
if i1: music[:i1] = lp(music[:i1], 900)
fade = np.ones(N); i0 = int((DUR - 0.8) * SR); fade[i0:] = np.linspace(1, 0, N - i0); music *= fade

def norm(x, db): return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)
sfx = norm(sfx, -9); music = norm(music, -3)
def wr(name, x):
    x = x[:int(SR * DUR)]; st = np.clip(np.stack([x, x], 1), -1, 1)
    with wave.open(os.path.join(D, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
wr('sfx.wav', sfx); wr('music.wav', music)
json.dump({"outro": OUTRO}, open(os.path.join(D, "sfx.json"), "w"))
print("sons ok — durée", round(DUR, 2), "s ·", len(SN.get("events", [])), "événements")
