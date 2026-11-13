# bash remix.sh <projet> <voix%> <musique%> <effets%> <sortie.mp4> — mélange les pistes (mixage/pistes) et normalise à -14 LUFS
set -e
. "$(dirname "$0")/env.sh"; cd "$1"
DUR=$(python -c "import json;c=json.load(open('caps.json',encoding='utf-8'));p=json.load(open('projet.json',encoding='utf-8'));print(round(c['total']+p.get('outro',3.0),3))")
FO=$(python -c "print(round($DUR-0.6,3))")
GV=$(python -c "print($2/100)"); GM=$(python -c "print($3/100)"); GS=$(python -c "print($4/100)"); P=mixage/pistes
ffmpeg -v error -y -i $P/voix.wav -i $P/musique.wav -i $P/effets.wav -filter_complex \
 "[0:a]volume=$GV[a];[1:a]volume=$GM[b];[2:a]volume=$GS[c];[a][b][c]amix=inputs=3:duration=first:normalize=0,afade=t=out:st=$FO:d=0.6[m]" -map "[m]" -ar 48000 -ac 2 .remix.wav
J=$(ffmpeg -hide_banner -nostats -i .remix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
v(){ echo "$J" | python -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i $P/image.mp4 -i .remix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true" \
 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$5"
echo "ok $5 — voix $2% · musique $3% · effets $4%"
