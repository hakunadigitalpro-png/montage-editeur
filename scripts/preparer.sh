# Préparation d'un projet : copie de la vidéo, cadrage plein écran, images, coupes détectées, transcription mot par mot
# bash preparer.sh <video> <dossier_projet> <langue: fr|ar|en> ["prompt Whisper"]
# Then, in the background (~1 s/frame): python "$ENG/mask.py" u2net_human_seg <project> && python "$ENG/make_head.py" <project>
set -e
. "$(dirname "$0")/env.sh"
SRC="$1"; W="$2"; LG="${3:-fr}"; PR="${4:-}"
mkdir -p "$W"/{parts,assets,captures,vfr,editeur/media,mixage/pistes}; cd "$W"
ffmpeg -v error -y -i "$SRC" -map 0:v:0 -map 0:a:0 -c copy src.mov
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 src.mov | cut -d. -f1-2)
echo "{\"keep\":[[0,$DUR]],\"total\":$DUR,\"src_dur\":$DUR}" > cut.json
cp "$ENG/compose.REFERENCE.html" ref.html
[ -f theme.json ] || cp "$ME/templates/theme.json" theme.json
[ -f logo.png ] || cp "$ME/templates/assets/logo.png" logo.png
ffmpeg -v error -y -i src.mov -vn -ac 1 -ar 16000 a.wav
python "$ENG/cut_zoom.py" . | tail -1
ffmpeg -v error -y -i cutz.mp4 -vf fps=30 -q:v 3 vfr/%05d.jpg
ffmpeg -v error -y -i src.mov -vf "fps=1,scale=216:-2,tile=8x8" -frames:v 1 sheet_src.jpg
echo "== coupes probables (score ≥ ~0,09, en secondes) =="
ffmpeg -i src.mov -vf "scale=270:-2,select='gte(scene,0)',metadata=print:key=lavfi.scene_score" -an -f null - 2>&1 | grep -o "scene_score=[0-9.]*" | awk -F= '{printf "%.2f %s\n", (NR-1)/30, $2}' | sort -k2 -nr | head -12
echo "== transcription ($LG) =="
python -m whisper a.wav --language "$LG" --model turbo --word_timestamps True --condition_on_previous_text False --output_format json --output_dir wh --verbose False ${PR:+--initial_prompt "$PR"} > wh.log 2>&1
python -c "
import json
d=json.load(open('wh/a.json',encoding='utf-8'))
for s in d['segments']: print('%.2f-%.2f'%(s['start'],s['end']),' '.join('%s@%.2f'%(w['word'].strip(),w['start']) for w in s['words']))"
echo "durée $DUR s · $(ls vfr | wc -l) images"
