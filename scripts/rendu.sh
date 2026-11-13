# Full render of a project (also run by the editor's "Render video" button)
# bash rendu.sh <project>  → <name>.mp4 (+ .srt/.txt); separate stems in mixage/pistes; editor media
set -e
# REPRISE=" " bash rendu.sh <projet>  → reprend le rendu des images là où il s'est arrêté (sans tout refaire)
. "$(dirname "$0")/env.sh"; cd "$1"
NOM=$(python -c "import json;print(json.load(open('projet.json',encoding='utf-8'))['nom'])")
VOL=$(python -c "import json,os;p=json.load(open('projet.json',encoding='utf-8'));e=json.load(open('edits.json',encoding='utf-8')) if os.path.exists('edits.json') else {};v={**p.get('vol',{}),**e.get('vol',{})};print(v.get('voix',100),v.get('musique',50),v.get('effets',40))")
GAIN=$(python -c "import json;print(json.load(open('projet.json',encoding='utf-8')).get('musique_gain',0.26))")
DUR=$(python -c "import json;c=json.load(open('caps.json',encoding='utf-8'));p=json.load(open('projet.json',encoding='utf-8'));print(round(c['total']+p.get('outro',3.0),3))")
echo "1/6 sous-titres"; python "$ME/scripts/apply_caps.py" .
echo "2/6 sons";        python "$ME/scripts/sons.py" .
echo "3/6 animations";  python "$ME/scripts/build.py" .
echo "4/6 images (≈2-4 min)"; node "$ENG/04_render_frames.js" . all ${REPRISE:---force} 2>&1 | tail -1
echo "5/6 pistes"; mkdir -p mixage/pistes editeur/media; P=mixage/pistes
ffmpeg -v error -y -framerate 30 -i out/%05d.jpg -vf "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p" -c:v libx264 -preset slow -crf 21 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -r 30 -movflags +faststart $P/image.mp4
ffmpeg -v error -y -i cutz.mp4 -vn -af "apad=pad_dur=8,atrim=0:$DUR,aresample=48000" -ac 2 $P/voix.wav
ffmpeg -v error -y -i sfx.wav -af "atrim=0:$DUR" -ac 2 $P/effets.wav
FO=$(python -c "print(max(0,round($DUR-1.4,3)))")
ffmpeg -v error -y -i music.wav -i $P/voix.wav -filter_complex "[0:a]volume=$GAIN,atrim=0:$DUR,afade=t=in:st=0:d=1.0,afade=t=out:st=$FO:d=1.4[m];[m][1:a]sidechaincompress=threshold=0.035:ratio=9:attack=8:release=320[md]" -map "[md]" -ac 2 $P/musique.wav
for n in voix musique effets; do ffmpeg -v error -y -i $P/$n.wav -filter_complex "showwavespic=s=2400x160:colors=white" -frames:v 1 mixage/wave-$n.png; done
[ -f editeur/media/video.mp4 ] || ffmpeg -v error -y -i cutz.mp4 -an -c:v libx264 -preset fast -crf 22 -g 15 -pix_fmt yuv420p -movflags +faststart editeur/media/video.mp4
[ -f editeur/media/silhouette.webm ] || ffmpeg -v error -y -framerate 30 -i bt/person/%05d.png -vf "scale=540:960" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 1.5M -auto-alt-ref 0 editeur/media/silhouette.webm
cp "$ME/editeur/index.html" editeur/index.html
echo "6/6 mixage"; bash "$ME/scripts/remix.sh" . $VOL "$NOM.mp4"
python "$ENG/09_srt.py" . "$NOM" 2>&1 | tail -1
echo "TERMINÉ : $NOM.mp4"
