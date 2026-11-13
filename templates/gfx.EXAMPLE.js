/* ===== EXAMPLE scenes (gfx.js) — a 20 s product ad, 7 scenes, 18 elements. Copy to <project>/parts/gfx.js and adapt.
   Every animation is an EL(...) element so the editor can select / shift / hide / comment it.
   Anchors wS(card, word) refer to cartes.EXAMPLE.json — always check them with scripts/ancres.py. ===== */
/* =================== BRAND IMAGES (official logo + website captures, in <project>/assets) =================== */
const IMG={}; for(const k of ['logo','logo-white','mark','site','feature-1','feature-2','feature-3']){ IMG[k]=new Image(); IMG[k].src='assets/'+k+'.png'; }
const imgOK=k=>IMG[k]&&IMG[k].naturalWidth>0;
function drawFit(k,cx,cy,w){ if(!imgOK(k)) return 0; const im=IMG[k], h=w*im.naturalHeight/im.naturalWidth; X.drawImage(im,cx-w/2,cy-h/2,w,h); return h; }
function icMonitor(x,y,s,c){ X.save(); X.strokeStyle=c; X.lineWidth=s*0.11; X.lineJoin='round'; rr(x-s*0.45,y-s*0.36,s*0.9,s*0.58,s*0.08); X.stroke();
  X.beginPath(); X.moveTo(x-s*0.2,y+s*0.42); X.lineTo(x+s*0.2,y+s*0.42); X.moveTo(x,y+s*0.22); X.lineTo(x,y+s*0.42); X.stroke(); X.restore(); }
function icTools(x,y,s,c){ X.save(); X.strokeStyle=c; X.lineWidth=s*0.13; X.lineCap='round'; X.beginPath(); X.moveTo(x-s*0.36,y+s*0.36); X.lineTo(x+s*0.18,y-s*0.18); X.stroke();
  X.beginPath(); X.arc(x+s*0.24,y-s*0.24,s*0.16,Math.PI*0.25,Math.PI*1.9); X.stroke(); X.restore(); }
function headline(s,x,y,px,col,k,o){ at(x,y,Math.max(0.01,k),0,o,()=>txt(s,0,0,'700',px,col,'center',FH)); }

/* =================== ELEMENT REGISTRY (used by the editor) ===================
   Each animation = one element: id, name, scene, layer, on-screen box [x,y,w,h], time span [a,b] and its draw function.
   Editor settings (window.EDITS): off[id] = time offset in s, hide[id] = hidden. */
const EDIT=window.EDITS||{off:{},hide:{}};
const OFF=id=>(EDIT.off&&EDIT.off[id])||0, HID=id=>!!(EDIT.hide&&EDIT.hide[id]);
const ELS=[]; window.ELS=ELS;
function EL(id,label,scene,layer,box,span,fn){ ELS.push({id,label,scene,layer,box,span,fn}); }
function runLayer(layer,t){ for(const e of ELS){ if(e.layer!==layer||HID(e.id)) continue; X.save(); try{ e.fn(t-OFF(e.id)); }catch(err){ console.error('élément',e.id,err.message); } X.restore(); } }
const SCENES_ED=[ {id:'s1',label:'1 · Hook',a:0,b:2.3,kind:'Full screen'}, {id:'s2',label:'2 · « It\'s simple: example.com »',a:2.3,b:4.57,kind:'Panel'},
  {id:'s3',label:'3 · « You automate… »',a:4.57,b:8.95,kind:'Panel'}, {id:'s4',label:'4 · « No need… »',a:8.95,b:11.33,kind:'Full screen'},
  {id:'s5',label:'5 · « Works with… »',a:11.33,b:15.27,kind:'Panel'}, {id:'s6',label:'6 · Appel à l\'action',a:15.27,b:19.8,kind:'Full screen'},
  {id:'s7',label:'7 · End card',a:19.8,b:22.8,kind:'End card'} ];
window.SCENES_ED=SCENES_ED; window.ZP=ZP; window.CUTS=CUTS;

/* ---------- Scene 1 · hook ---------- */
EL('ca','Card « Revenue ×2 »','s1','full',[695,390,320,340],()=>[wS(0,1),2.3],t=>{
  if(t>=2.32) return; const t0=wS(0,1), o=1-pr(t,2.1,2.3), k=popIn(t,t0,0.26), tt=wS(1,2); if(t<t0) return;
  at(855+wig(t,2.6,5),560+wig(t,3.1,7),k,0.05,o,()=>{ shadowOn(36,14,0.3); X.fillStyle='#fff'; rr(-160,-170,320,340,30); X.fill(); nsh();
    txt('Revenue',0,-128,'500',26,'#5A6B70','center',FL);
    const g=ease(pr(t,t0+0.1,t0+0.9)); [[-90,0.35],[-30,0.55],[30,0.75],[90,1]].forEach(([bx,hgt],i)=>{ const h=150*hgt*(i===3?lerp(0.5,1,g):1); X.fillStyle=i===3?BACC:'#D4E4E0'; rr(bx-22,100-h,44,h,8); X.fill(); });
    X.strokeStyle=BDARK; X.lineWidth=7; X.lineCap='round'; X.beginPath(); X.moveTo(-110,40); X.lineTo(-40,0); X.lineTo(20,-20); X.lineTo(lerp(20,105,g),lerp(-20,-85,g)); X.stroke();
    at(-70,-60,back(pr(t,t0+0.2,t0+0.5)),-0.08,1,()=>{ X.fillStyle=BDARK; rr(-70,-42,140,84,24); X.fill(); txt('×2',0,3,'700',58,BACC,'center',FH); });
    if(t>=tt){ at(0,140,popIn(t,tt,0.22),0,1,()=>{ X.fillStyle=BACC; rr(-140,-26,280,52,26); X.fill(); txt('This season',0,2,'700',28,BDARK,'center',FH); }); } }); });

/* ---------- Scene 2 · « It's simple: example.com » ---------- */
EL('browser','Browser showing the website','s2','panel',[110,470,860,440],()=>[2.45,4.6],t=>{
  if(t>=4.62||t<2.3) return; const o=1-pr(t,4.42,4.6), k=popIn(t,2.45,0.32); const bx=110,by=470,bw=860,bh=440, tl=wS(3,1);
  at(540,by+bh/2,k,wig(t,1.4,0.01),o,()=>{ X.translate(-540,-(by+bh/2));
    shadowOn(50,22,0.28); X.fillStyle='#fff'; rr(bx,by,bw,bh,28); X.fill(); nsh();
    X.save(); rr(bx,by,bw,bh,28); X.clip();
    if(imgOK('site')){ const im=IMG['site'], sc=bw/im.naturalWidth, sy=lerp(0,700,ease(pr(t,2.7,4.5))); X.drawImage(im,0,sy,im.naturalWidth,(bh-60)/sc,bx,by+60,bw,bh-60); }
    X.fillStyle='#EDEFF0'; X.fillRect(bx,by,bw,60); X.restore();
    ['#FF5F57','#FEBC2E','#28C840'].forEach((c,i)=>{ X.fillStyle=c; X.beginPath(); X.arc(bx+34+i*28,by+30,9,0,7); X.fill(); });
    X.fillStyle='#fff'; rr(bx+130,by+12,bw-170,36,18); X.fill();
    const url='example.com', n=t<tl?0:Math.min(url.length,Math.floor((t-tl)/0.05)+1);
    X.save(); X.font='600 24px '+FL; X.fillStyle=BDARK; X.textAlign='left'; X.textBaseline='middle'; X.direction='ltr'; X.fillText('🔒  '+url.slice(0,n),bx+150,by+31); X.restore(); }); });
EL('simple',"Title « It's simple, »",'s2','panel',[240,300,600,100],()=>[wS(2,1),wS(3,1)],t=>{
  const ts=wS(2,1), tl=wS(3,1); if(t>=ts&&t<tl+0.05) headline("It's simple,",540,350,92,BDARK,popIn(t,ts,0.22),1-pr(t,tl-0.08,tl)); });
EL('logo','Logo reveal (signature moment)','s2','panel',[280,250,520,190],()=>[wS(3,1),4.6],t=>{
  const tl=wS(3,1); if(t<tl||t>=4.62) return; const o=1-pr(t,4.42,4.6), hit=Math.exp(-(t-tl)*6); rings(540,340,tl,t,'rgba(37,208,116,0.7)',3,120);
  at(540,345,popIn(t,tl,0.3)*(1+0.10*hit),0,o,()=>drawFit('logo',0,0,520));
  for(let i=0;i<22;i++){ const d=t-tl; if(d>1.2) break; const a=i*2.6+0.4, v=360+((i*41)%180), x=540+Math.cos(a)*v*d, y=345+Math.sin(a)*v*d+240*d*d;
    X.save(); X.globalAlpha*=o*(1-d/1.2); X.fillStyle=[BACC,BDARK,'#fff',BSOFT][i%4]; X.translate(x,y); X.rotate(d*8+i); X.fillRect(-9,-5,18,10); X.restore(); } });

/* ---------- Scene 3 · « You automate… » ---------- */
EL('titreAuto','Title « You automate »','s3','panel',[180,280,720,110],()=>[4.62,8.95],t=>{
  if(t<4.62||t>=8.97) return; const o=1-pr(t,8.65,8.92), ta=wS(4,1);
  at(540,330,popIn(t,4.62,0.26),0,o,()=>{ X.save(); X.font='700 84px '+FH; X.textBaseline='middle'; X.direction='ltr';
    const a='You ', b='automate', wa=X.measureText(a).width, wb=X.measureText(b).width, x0=-(wa+wb)/2;
    X.fillStyle=BDARK; X.textAlign='left'; X.fillText(a,x0,0); X.fillStyle=t>=ta?BACC:BDARK; X.fillText(b,x0+wa,0);
    if(t>=ta){ const u=ease(pr(t,ta,ta+0.3)); X.fillStyle=BACC; rr(x0+wa,44,wb*u,10,5); X.fill(); } X.restore(); }); });
function featCard(t,t0,cx,lab,ill,rot){ if(t<t0||t>=8.97) return; const o=1-pr(t,8.65,8.92), k=popIn(t,t0,0.28), cy=665+wig(t+cx,1.8,6);
  at(cx,cy,k,rot,o,()=>{ shadowOn(34,14,0.18); X.fillStyle='#fff'; rr(-148,-215,296,430,30); X.fill(); nsh();
    X.save(); rr(-136,-203,272,300,22); X.clip(); X.fillStyle='#fff'; X.fillRect(-136,-203,272,300); drawFit(ill,0,-53,262); X.restore();
    const fs=lab.length>14?28:34; txt(lab,0,148,'700',fs,BDARK,'center',FH);
    const ck=pr(t,t0+0.25,t0+0.5); if(ck>0){ at(118,-188,back(ck),0,1,()=>{ X.fillStyle=BACC; X.beginPath(); X.arc(0,0,34,0,7); X.fill(); icCheck(0,2,40,'#fff',ck); }); } }); }
EL('card1','Card « Forms »','s3','panel',[57,450,296,430],()=>[wS(5,1),8.95],t=>featCard(t,wS(5,1),205,'Forms','feature-1',-0.04));
EL('card2','Card « Signatures »','s3','panel',[392,450,296,430],()=>[wS(6,1),8.95],t=>featCard(t,wS(6,1),540,'Signatures','feature-2',0));
EL('card3','Card « Online payments »','s3','panel',[727,450,296,430],()=>[wS(8,0),8.95],t=>featCard(t,wS(8,0),875,'Online payments','feature-3',0.04));

/* ---------- Scene 4 · « No need to add one more tool » ---------- */
EL('apps','Pile d\'applis, la « +1 » barrée','s4','full',[685,390,340,340],()=>[9.06,11.33],t=>{
  if(t<8.95||t>=11.36) return; const o=1-pr(t,11.15,11.33), k=popIn(t,9.06,0.26), ta=wS(9,2), tx=wS(10,1);
  at(855+wig(t,2.4,5),560+wig(t,3,6),k,-0.04,o,()=>{ shadowOn(36,14,0.3); X.fillStyle='#fff'; rr(-170,-170,340,340,34); X.fill(); nsh();
    [['#5B8DEF',-75,-75],['#F2A03C',75,-75],['#9C6ADE',-75,75]].forEach(([c,x,y])=>{ X.fillStyle=c; rr(x-55,y-55,110,110,26); X.fill(); X.fillStyle='rgba(255,255,255,0.85)'; rr(x-26,y-8,52,16,8); X.fill(); });
    if(t>=ta){ const kk=popIn(t,ta,0.22); at(75,75,kk,0,1,()=>{ X.setLineDash([10,8]); X.strokeStyle='#8A9BA0'; X.lineWidth=5; rr(-55,-55,110,110,26); X.stroke(); X.setLineDash([]); txt('+1',0,3,'700',50,'#8A9BA0','center',FH); }); }
    if(t>=tx) cross(75,75,120,pr(t,tx,tx+0.3)); }); });

/* ---------- Scene 5 · « works with your tools… » ---------- */
const CHIPS=[['chip1',()=>wS(12,3),210,560,'Your tools',icTools],['chip2',()=>wS(13,1),870,560,'Your software',icMonitor],['chip3',()=>wS(13,2),540,880,'Already in place',icCheck]];
EL('titreCompl','Title « Works with the tools you already use »','s5','panel',[140,270,800,190],()=>[11.4,15.27],t=>{
  if(t<11.33||t>=15.3) return; const o=1-pr(t,14.98,15.25), tc=wS(12,0);
  if(t>=11.4) headline('Brand',540,330,64,BDARK,popIn(t,11.4,0.22),o*(t<tc?1:0));
  if(t>=tc) headline('Works with',540,320,96,BACC,popIn(t,tc,0.24),o);
  if(t>=wS(12,1)) headline('the tools you already use',540,420,50,BDARK,popIn(t,wS(12,1),0.22),o); });
EL('hub','Brand mark + connections','s5','panel',[400,510,280,280],()=>[11.45,15.27],t=>{
  if(t<11.33||t>=15.3) return; const o=1-pr(t,14.98,15.25), tc=wS(12,0), cx=540, cy=650, bob=wig(t,2,8);
  for(const [id,f,lx,ly] of CHIPS){ if(HID(id)) continue; const t0=f()+OFF(id); if(t<t0) continue; const d=ease(pr(t,t0,t0+0.35)); X.save(); X.globalAlpha*=o; X.strokeStyle=BACC; X.lineWidth=6; X.setLineDash([16,14]); X.lineDashOffset=-t*60;
    X.beginPath(); X.moveTo(cx,cy+bob); X.lineTo(lerp(cx,lx,d),lerp(cy+bob,ly,d)); X.stroke(); X.restore(); }
  rings(cx,cy+bob,tc,t,'rgba(37,208,116,0.6)',3,110);
  at(cx,cy+bob,popIn(t,11.45,0.32),wig(t,1.7,0.05),o,()=>{ const g=X.createRadialGradient(0,0,40,0,0,190); g.addColorStop(0,'rgba(37,208,116,0.30)'); g.addColorStop(1,'rgba(37,208,116,0)');
    X.fillStyle=g; X.beginPath(); X.arc(0,0,190,0,7); X.fill(); shadowOn(30,12,0.2); X.fillStyle='#fff'; X.beginPath(); X.arc(0,0,118,0,7); X.fill(); nsh(); drawFit('mark',0,0,150); }); });
for(const [id,f,lx,ly,lab,ic] of CHIPS){ const bw=tw(lab,'800',34)+130;
  EL(id,'Chip « '+lab+' »','s5','panel',[lx-bw/2,ly-48,bw,96],()=>[f(),15.27],t=>{ const t0=f(); if(t<t0||t>=15.3) return; const o=1-pr(t,14.98,15.25);
    chip(lx+wig(t+lx,1.9,6),ly+wig(t+ly,2.3,8),lab,ic,popIn(t,t0,0.26),o,(lx<540?-0.04:0.04)); }); }

/* ---------- Scene 6 · call to action ---------- */
EL('url','Address bar « example.com »','s6','full',[160,290,760,120],()=>[wS(14,0),wS(15,1)+0.15],t=>{
  const tu=wS(14,2), tb=wS(15,1); if(t<wS(14,0)||t>=19.75) return; const o=1-pr(t,19.55,19.75), k=popIn(t,wS(14,0),0.26), url='example.com', n=Math.max(0,Math.min(url.length,Math.floor((t-tu)/0.07)+1));
  const bo=t>=tb?1-pr(t,tb,tb+0.15):1; if(bo<=0) return;
  at(540,350,k,0,o*bo,()=>{ shadowOn(40,16,0.3); X.fillStyle='#fff'; rr(-380,-60,760,120,60); X.fill(); nsh();
    X.strokeStyle='#8A9BA0'; X.lineWidth=7; X.beginPath(); X.arc(-312,-8,15,Math.PI,0); X.stroke(); X.fillStyle='#8A9BA0'; rr(-332,-6,40,32,6); X.fill();
    X.save(); X.font='700 54px '+FL; X.textAlign='left'; X.textBaseline='middle'; X.direction='ltr'; X.fillStyle=BDARK; const s=t>=tu?url.slice(0,n):''; X.fillText(s,-268,4);
    if(t<tb&&Math.floor(t*4)%2===0){ const wv=X.measureText(s).width; X.fillStyle=BACC; X.fillRect(-264+wv,-28,5,60); } X.restore();
    X.fillStyle=BACC; X.beginPath(); X.arc(318,0,44,0,7); X.fill(); X.strokeStyle=BDARK; X.lineWidth=7; X.lineCap='round'; X.beginPath(); X.moveTo(300,0); X.lineTo(334,0); X.moveTo(320,-13); X.lineTo(334,0); X.lineTo(320,13); X.stroke(); }); });
EL('btn','Button « Try the platform » + click','s6','full',[180,290,720,120],()=>[wS(15,1),19.75],t=>{
  const tb=wS(15,1); if(t<tb||t>=19.75) return; const o=1-pr(t,19.55,19.75), kk=popIn(t,tb,0.26), tk=tb+0.55, press=t>=tk?1-0.08*Math.sin(Math.min(1,(t-tk)/0.2)*Math.PI):1;
  at(540,350,kk*press,0,o,()=>{ shadowOn(30,12,0.3); X.fillStyle=BACC; rr(-360,-60,720,120,60); X.fill(); nsh(); txt('Try the platform  →',0,3,'700',52,BDARK,'center',FH); });
  if(t>=tk-0.45&&t<tk+0.5){ const mv=ease(pr(t,tk-0.45,tk-0.05)); at(lerp(900,720,mv),lerp(620,372,mv),1,-0.3,o,()=>{ shadowOn(10,4,0.4); X.fillStyle='#fff'; X.strokeStyle=BDARK; X.lineWidth=4; X.beginPath(); X.moveTo(0,0); X.lineTo(0,62); X.lineTo(16,48); X.lineTo(28,74); X.lineTo(38,68); X.lineTo(27,44); X.lineTo(46,42); X.closePath(); X.fill(); X.stroke(); }); } });

/* ---------- Global elements (for comments / hiding) ---------- */
EL('flash','Light flashes on cuts','all','none',[0,0,1080,1920],()=>[0,19.8],()=>{});
EL('outro','End card (logo, URL, tagline)','s7','none',[0,0,1080,1920],()=>[19.8,22.8],()=>{});

function panelGfx(t){ runLayer('panel',t); }
function fgFull(t){ if(panelMix(t)>0.02) return; runLayer('full',t); }

/* =================== LIGHT FLASH ON CUTS (brand colour) =================== */
function lightFlash(t){ if(HID('flash')) return; t-=OFF('flash'); for(const c of CUTS){ const d=t-c; if(d<-0.08||d>0.36) continue;
    const a=d<0?ease((d+0.08)/0.08):Math.exp(-d/0.11); const sx=lerp(-150,1230,pr(d,-0.08,0.36));
    X.save(); X.globalCompositeOperation='screen'; X.fillStyle='rgba(37,208,116,'+(0.22*a)+')'; X.fillRect(0,0,W,H);
    const g=X.createRadialGradient(sx,620,20,sx,620,1300); g.addColorStop(0,'rgba(235,255,245,'+(0.9*a)+')'); g.addColorStop(0.35,'rgba(120,235,170,'+(0.6*a)+')'); g.addColorStop(1,'rgba(37,208,116,0)');
    X.fillStyle=g; X.fillRect(0,0,W,H); X.restore(); } }
SCENE_LIST.push(['fgFull',fgFull],['lightFlash',lightFlash]);

/* fonts: brand heading font (here Clash Display from Fontshare) + Outfit fallback + Roboto */
(function(){ for(const href of ['https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap','https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Roboto:wght@400;500;600;700&display=swap']){
   const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l); }
 const _i=window.init; window.init=function(d){ const r=_i(d); FONT="'Clash Display',Outfit,sans-serif";
  return Promise.all([r,...Object.values(IMG).map(im=>Promise.race([im.decode().catch(()=>0),new Promise(r=>setTimeout(r,2000))])),document.fonts.load("700 80px 'Clash Display'","Tu automatises"),document.fonts.load("800 80px Outfit","Comment"),
    document.fonts.load("700 50px Roboto","example.com"),document.fonts.load("500 26px Roboto","Revenue")]).then(()=>r);};})();

/* end card: brand background, white logo, URL, tagline in the speaker's words */
outro=function(t){ const s=VEND; if(t<s||HID('outro'))return;
  const wipe=eio(pr(t,s,s+0.42)), top=H*(1-wipe);
  X.save(); X.fillStyle=BDARK; X.fillRect(0,top,W,H); X.beginPath(); X.rect(0,top,W,H); X.clip(); X.translate(0,top);
  const g=X.createRadialGradient(540,820,40,540,820,900); g.addColorStop(0,'rgba(37,208,116,0.25)'); g.addColorStop(1,'rgba(37,208,116,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  const ap=d=>pr(t,s+d,s+d+0.4);
  let a=ap(0.25); if(a>0){ X.save(); X.globalAlpha=a; X.translate(540,760+(1-ease(a))*24); X.scale(0.9+0.1*back(a),0.9+0.1*back(a)); drawFit('logo-white',0,0,700); X.restore(); }
  a=ap(0.6); if(a>0){ const URL_END='example.com', pw=tw(URL_END,'700',62,FH)+90; at(540,1000,back(a),0,a,()=>{ X.fillStyle=BACC; rr(-pw/2,-56,pw,112,56); X.fill(); txt(URL_END,0,3,'700',62,BDARK,'center',FH); }); }
  a=ap(0.85); if(a>0){ X.save(); X.globalAlpha=a; txt('Your tagline',540,1140,'600',46,'#fff','center',FH); txt('goes here',540,1205,'600',46,BACC,'center',FH); X.restore(); }
  X.restore(); };
