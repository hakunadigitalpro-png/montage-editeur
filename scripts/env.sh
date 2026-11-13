# Environment for the skill scripts (bash: macOS, Linux, or Git Bash on Windows). Sourced by every script.
# Override anything by exporting it before running: FFMPEG_DIR, PY, CHROME_PATH, PUPPETEER_PATH.
ME="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; export ME
export ENG="$ME/engine"
export PYTHONUTF8=1 PYTHONIOENCODING=utf-8

# ffmpeg / ffprobe
if [ -n "$FFMPEG_DIR" ]; then export PATH="$FFMPEG_DIR:$PATH"; fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  for d in /c/Users/*/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin /opt/homebrew/bin /usr/local/bin; do
    if [ -x "$d/ffmpeg" ] || [ -x "$d/ffmpeg.exe" ]; then export PATH="$d:$PATH"; break; fi
  done
fi
command -v ffmpeg >/dev/null 2>&1 || echo "⚠️  ffmpeg not found — install it (winget install Gyan.FFmpeg / brew install ffmpeg / apt install ffmpeg) or set FFMPEG_DIR" >&2

# node
if ! command -v node >/dev/null 2>&1 && [ -x "/c/Program Files/nodejs/node.exe" ]; then export PATH="/c/Program Files/nodejs:$PATH"; fi

# python (Windows has "python", macOS/Linux usually "python3")
if [ -z "$PY" ]; then for c in python3 python py; do command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys" >/dev/null 2>&1 && { PY="$c"; break; }; done; fi
export PY="${PY:-python3}"
if [ "$PY" != "python" ]; then python(){ command "$PY" "$@"; }; export -f python 2>/dev/null || true; fi

# puppeteer-core: installed in the skill folder by `npm install`
if [ -z "$PUPPETEER_PATH" ] && [ -d "$ME/node_modules/puppeteer-core" ]; then export PUPPETEER_PATH="$ME/node_modules/puppeteer-core"; fi
true
