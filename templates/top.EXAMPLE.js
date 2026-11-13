/* ===== EXAMPLE top.js — layout, brand, panels, zooms, captions. Copy to <project>/parts/top.js and adapt.
   Brand palette: read it from the client's website (captures/info.json). Here: dark #10404C · accent #25D074 · light #F4F4F4.
   AD format: nothing important in the top 14 % (y<270) nor below y≈1250 (Reels/TikTok UI) — captions raised (CAPDY),
   no captions inside panels (the panel shows the words as a title). ===== */
SCENES=[{s:0,e:99,m:R_FULL}];
const wS=(i,k)=>{const w=wordsOf(i);const x=w[Math.min(k,w.length-1)];return x?x.s:99;};
const HC=540, ZAY=640;
const BDARK='#10404C', BACC='#25D074', BSOFT='#BDF2D5', LIGHT='#F4F4F4', INKD='#10404C';   /* ← brand colours */
const VIO=BACC, VIO2=BSOFT;      /* alias pour les primitives reprises de 1109 */
const FF="'Clash Display',Outfit,'Segoe UI Emoji',sans-serif", FL="Roboto,'Segoe UI Emoji',sans-serif", FH="'Clash Display',Outfit,sans-serif";
const CUTS=[4.57,11.33,12.83,15.27,16.77,17.97];
const SEGB=[0,4.57,11.33,12.83,15.27,16.77,17.97,99];
const segOf=t=>{for(let i=0;i<SEGB.length-1;i++) if(t<SEGB[i+1]) return i; return SEGB.length-2;};
const wig=(t,f,a)=>Math.sin(t*f)*a;
const popIn=(t,a,d)=>Math.max(0,back(pr(t,a,a+(d||0.24))));

/* ---------- PANNEAUX (zoom out à l'entrée, zoom in à la sortie) ---------- */
const PANELS=[{a:2.30,b:8.95,tin:0.42,tout:0.34},{a:11.33,b:15.27,tin:0.42,tout:0.32}];
function panelMix(t){ for(const P of PANELS){ if(t<P.a||t>P.b) continue;
  return Math.min(eio(pr(t,P.a,P.a+P.tin)), 1-eio(pr(t,P.b-P.tout,P.b))); } return 0; }
let PF_SEG={};
function PF(t){ return PF_SEG[segOf(t)]||{s:0.6,ox:216,oy:800,ct:1440,tc:200}; }

/* ---------- ZOOMS plein écran ---------- */
const ZP=[
 ['pull',0.00,0.45,1.30,1.0],['punch',0.20,0.90,1.12,1.16],['punch',0.92,1.70,1.18,1.21],['punch',1.86,2.25,1.24,1.27],
 ['pull',8.95,9.30,1.22,1.0],['punch',9.64,10.10,1.10,1.13],['punch',10.16,10.85,1.18,1.21],
 ['punch',15.82,16.70,1.10,1.13],['pull',16.77,17.10,1.22,1.0],['punch',17.02,17.90,1.12,1.15],['punch',17.96,18.70,1.18,1.21],['punch',19.06,19.75,1.24,1.27]];
function zoomAt(t){ let z=1; for(let zi=0;zi<ZP.length;zi++){ const [ty,a,b,z0,z1]=ZP[zi]; if(typeof HID==='function'&&HID('zoom'+zi)) continue; if(t<a-0.001) continue;
    if(ty==='punch'){ if(t>b+0.18) continue; const zin=pr(t,a,a+0.12), zout=1-pr(t,b,b+0.18);
      z=Math.max(z,1+(lerp(z0,z1,pr(t,a,b))-1)*Math.min(ease(zin),eio(zout))); }
    else if(ty==='pull'){ if(t>b) continue; z=Math.max(z,lerp(z0,z1,eio(pr(t,a,b)))); }
    else if(ty==='slow'){ if(t>b) continue; z=Math.max(z,lerp(z0,z1,ease(pr(t,a,b)))); } }
  return z; }

/* ---------- fond du panneau : gris clair quadrillé + lueur verte/teal en bas ---------- */
function panelBg(t,m){ X.save(); X.globalAlpha=m; X.fillStyle=LIGHT; X.fillRect(0,0,W,H);
  const g0=X.createRadialGradient(540,620,60,540,620,780); g0.addColorStop(0,'rgba(16,64,76,0.09)'); g0.addColorStop(1,'rgba(16,64,76,0)');
  X.strokeStyle=g0; X.lineWidth=2; X.beginPath(); for(let x=0;x<=W;x+=72){X.moveTo(x,0);X.lineTo(x,1500);} for(let y=0;y<=1500;y+=72){X.moveTo(0,y);X.lineTo(W,y);} X.stroke();
  const g=X.createLinearGradient(0,980,0,1920); g.addColorStop(0,'rgba(37,208,116,0)'); g.addColorStop(0.55,'rgba(37,208,116,0.22)'); g.addColorStop(1,'rgba(16,64,76,0.55)');
  X.fillStyle=g; X.fillRect(0,980,W,940); X.restore(); }

/* ---------- couche vidéo : plein écran ↔ carte en bas avec la tête qui dépasse ---------- */
drawVideo=function(t){
  const m=panelMix(t), z=zoomAt(t), P=PF(t);
  const s=lerp(z,P.s,m), ox=lerp(HC*(1-z),P.ox,m), oy=lerp(ZAY*(1-z),P.oy,m), vw=1080*s, vh=1920*s;
  if(m>0){ panelBg(t,m); X.save(); X.globalAlpha=m; safe(panelGfx,t,'panelGfx'); X.restore(); }
  const cx=lerp(0,P.ox,m), cy=lerp(0,P.ct,m), cw=lerp(1080,1080*P.s,m), ch=lerp(1920,1960-P.ct,m), r=lerp(0,46,m);
  X.save();
  if(m>0){ X.shadowColor='rgba(16,64,76,'+(0.4*m)+')'; X.shadowBlur=60; X.shadowOffsetY=24; X.fillStyle='#000'; rr(cx,cy,cw,ch,r); X.fill(); nsh(); }
  rr(cx,cy,cw,ch,r); X.clip(); X.drawImage(window.VSRC||VF,ox,oy,vw,vh); X.restore();
  if(m>0){ X.save(); X.strokeStyle='rgba(255,255,255,'+(0.7*m)+')'; X.lineWidth=4; rr(cx,cy,cw,ch,r); X.stroke(); X.restore(); }
  const _PS=window.PSRC||PRS, _POK=window.PSRC?true:PRS_OK;
  if(m>0.35&&_POK){ X.save(); X.globalAlpha=pr(m,0.35,0.9); const yc=oy+s*(P.tc||0); X.beginPath(); X.rect(cx,yc,cw,cy+3-yc); X.clip();
    X.shadowColor='rgba(0,0,0,0.22)'; X.shadowBlur=26; X.shadowOffsetY=10; X.drawImage(_PS,ox,oy,vw,vh); X.restore(); }
};

/* ---------- sous-titres : remontés pour la zone sûre pub ; rien en panneau (titre dans le graphisme) ---------- */
const _cap=caption;
bar=function(){};
const CAPDY=-200;
caption=function(t){ const m=panelMix(t); if(m>0.02) return; X.save(); X.translate(0,CAPDY); _cap(t); X.restore(); };
