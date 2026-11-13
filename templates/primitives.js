/* =================== PRIMITIVES GRAPHIQUES =================== */
const txt=(s,x,y,w,px,col,al,font)=>{X.save();X.font=w+' '+px+'px '+(font||FF);X.fillStyle=col;X.textAlign=al||'center';X.textBaseline='middle';
  X.direction=/[؀-ۿ]/.test(s)?'rtl':'ltr';X.fillText(s,x,y);X.restore();};
const tw=(s,w,px,font)=>{X.save();X.font=w+' '+px+'px '+(font||FF);const v=X.measureText(s).width;X.restore();return v;};
function shadowOn(b,y,a){X.shadowColor='rgba(0,0,0,'+a+')';X.shadowBlur=b;X.shadowOffsetY=y;}
function at(x,y,sc,rot,o,fn){ if(o<=0||sc<=0.001) return; X.save(); X.globalAlpha*=Math.min(1,o); X.translate(x,y); if(rot) X.rotate(rot); X.scale(sc,sc); fn(); X.restore(); }
/* icône « agent » glossy (inspirée de la réf.) */
function rings(cx,cy,t0,t,col,n,R){ for(let i=0;i<(n||2);i++){ const d=t-t0-i*0.22; if(d<0||d>1.1) continue; const k=d/1.1;
  X.save(); X.globalAlpha*=(1-k)*0.85; X.strokeStyle=col; X.lineWidth=10*(1-k)+2; X.beginPath(); X.arc(cx,cy,(R||90)+k*260,0,7); X.stroke(); X.restore(); } }
function phone(x,y,w,h,title,sub){ X.save(); shadowOn(60,26,0.32); X.fillStyle='#17171A'; rr(x,y,w,h,52); X.fill(); nsh();
  X.strokeStyle='rgba(255,255,255,0.08)'; X.lineWidth=3; rr(x+2,y+2,w-4,h-4,50); X.stroke();
  txt(title,x+w/2,y+58,'700',30,'#fff','center',FL); if(sub) txt(sub,x+w/2,y+96,'500',20,'rgba(255,255,255,0.45)','center',FL);
  X.strokeStyle='rgba(255,255,255,0.08)'; X.beginPath(); X.moveTo(x+30,y+124); X.lineTo(x+w-30,y+124); X.stroke(); X.restore(); }
/* bulle de chat : side 'L' (client) | 'R' (agent) */
function bubble(xL,xR,y,s,side,k,o,fill,ink,fs){ fs=fs||32; const bw=tw(s,'700',fs)+fs*1.3, bh=fs*1.85;
  const bx=side==='L'?xL:xR-bw; const ax=side==='L'?bx:bx+bw;
  at(ax,y+bh/2,Math.max(0.01,k),0,o,()=>{ X.translate(-ax,-(y+bh/2)); shadowOn(16,6,0.22); X.fillStyle=fill; rr(bx,y,bw,bh,bh*0.42); X.fill(); nsh();
    txt(s,bx+bw/2,y+bh/2+2,'700',fs,ink); }); return bh; }
function avatar(x,y,r,col,ch){ X.save(); X.fillStyle=col; X.beginPath(); X.arc(x,y,r,0,7); X.fill(); X.fillStyle='rgba(255,255,255,0.92)';
  if(ch) txt(ch,x,y+1,'800',r*1.05,'#fff','center',FL); else { X.beginPath(); X.arc(x,y-r*0.22,r*0.34,0,7); X.fill(); X.beginPath(); X.arc(x,y+r*0.62,r*0.56,Math.PI,0); X.fill(); }
  X.restore(); }
function typingDots(x,y,t,col){ for(let i=0;i<3;i++){ const b=Math.max(0,Math.sin(t*9-i*0.9)); X.fillStyle=col; X.beginPath(); X.arc(x+i*26,y-b*8,8,0,7); X.fill(); } }
/* pastille (chip) blanche avec icône */
function chip(cx,cy,label,icon,k,o,tilt){ const w=tw(label,'800',34)+130, h=96;
  at(cx,cy,Math.max(0.01,k),tilt||0,o,()=>{ shadowOn(30,14,0.20); X.fillStyle='#fff'; rr(-w/2,-h/2,w,h,h/2); X.fill(); nsh();
    X.fillStyle=ACC; X.beginPath(); X.arc(-w/2+50,0,32,0,7); X.fill(); icon(-w/2+50,0,34,'#fff');
    txt(label,-w/2+92+(w-142)/2,3,'800',34,INKD); }); }
/* icônes vectorielles simples */
function icStore(x,y,s,c){ X.save(); X.strokeStyle=c; X.fillStyle=c; X.lineWidth=s*0.12; X.lineJoin='round';
  X.beginPath(); X.moveTo(x-s*0.5,y-s*0.1); X.lineTo(x-s*0.4,y-s*0.45); X.lineTo(x+s*0.4,y-s*0.45); X.lineTo(x+s*0.5,y-s*0.1); X.closePath(); X.fill();
  X.strokeRect(x-s*0.4,y-s*0.1,s*0.8,s*0.55); X.fillRect(x-s*0.1,y+s*0.12,s*0.2,s*0.33); X.restore(); }
function icBox(x,y,s,c){ X.save(); X.strokeStyle=c; X.lineWidth=s*0.12; X.lineJoin='round'; X.beginPath();
  X.moveTo(x,y-s*0.48); X.lineTo(x+s*0.44,y-s*0.24); X.lineTo(x+s*0.44,y+s*0.26); X.lineTo(x,y+s*0.5); X.lineTo(x-s*0.44,y+s*0.26); X.lineTo(x-s*0.44,y-s*0.24); X.closePath();
  X.moveTo(x-s*0.44,y-s*0.24); X.lineTo(x,y); X.lineTo(x+s*0.44,y-s*0.24); X.moveTo(x,y); X.lineTo(x,y+s*0.5); X.stroke(); X.restore(); }
function icTruck(x,y,s,c){ X.save(); X.fillStyle=c; X.fillRect(x-s*0.52,y-s*0.3,s*0.62,s*0.42); X.beginPath(); X.moveTo(x+s*0.12,y-s*0.14); X.lineTo(x+s*0.36,y-s*0.14); X.lineTo(x+s*0.52,y+s*0.02); X.lineTo(x+s*0.52,y+s*0.12); X.lineTo(x+s*0.12,y+s*0.12); X.fill();
  X.beginPath(); X.arc(x-s*0.3,y+s*0.22,s*0.12,0,7); X.arc(x+s*0.3,y+s*0.22,s*0.12,0,7); X.fill(); X.restore(); }
function icList(x,y,s,c){ X.save(); X.fillStyle=c; for(let i=-1;i<=1;i++){ X.beginPath(); X.arc(x-s*0.32,y+i*s*0.3,s*0.07,0,7); X.fill(); rr(x-s*0.18,y+i*s*0.3-s*0.06,s*0.56,s*0.12,s*0.06); X.fill(); } X.restore(); }
function icBot(x,y,s,c){ X.save(); X.fillStyle=c; rr(x-s*0.42,y-s*0.28,s*0.84,s*0.62,s*0.18); X.fill(); X.fillRect(x-s*0.03,y-s*0.48,s*0.06,s*0.2); X.beginPath(); X.arc(x,y-s*0.5,s*0.08,0,7); X.fill();
  X.fillStyle='#fff'; X.beginPath(); X.arc(x-s*0.17,y,s*0.09,0,7); X.arc(x+s*0.17,y,s*0.09,0,7); X.fill(); X.restore(); }
function icClock(x,y,s,c,a){ X.save(); X.strokeStyle=c; X.lineWidth=s*0.1; X.lineCap='round'; X.beginPath(); X.arc(x,y,s*0.45,0,7); X.stroke();
  X.beginPath(); X.moveTo(x,y); X.lineTo(x+Math.sin(a)*s*0.32,y-Math.cos(a)*s*0.32); X.moveTo(x,y); X.lineTo(x+Math.sin(a/12)*s*0.2,y-Math.cos(a/12)*s*0.2); X.stroke(); X.restore(); }
function icCheck(x,y,s,c,k){ X.save(); X.strokeStyle=c; X.lineWidth=s*0.16; X.lineCap='round'; X.lineJoin='round'; X.beginPath();
  const p=[[x-s*0.3,y],[x-s*0.08,y+s*0.24],[x+s*0.34,y-s*0.24]]; const L1=Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]), L2=Math.hypot(p[2][0]-p[1][0],p[2][1]-p[1][1]); const d=(k===undefined?1:k)*(L1+L2);
  X.moveTo(p[0][0],p[0][1]); if(d<=L1) X.lineTo(lerp(p[0][0],p[1][0],d/L1),lerp(p[0][1],p[1][1],d/L1)); else { X.lineTo(p[1][0],p[1][1]); X.lineTo(lerp(p[1][0],p[2][0],(d-L1)/L2),lerp(p[1][1],p[2][1],(d-L1)/L2)); } X.stroke(); X.restore(); }
function cross(x,y,s,k,col){ X.save(); X.strokeStyle=col||'#E5332A'; X.lineWidth=s*0.16; X.lineCap='round'; const a=Math.min(1,k*2), b=Math.max(0,k*2-1);
  X.beginPath(); X.moveTo(x-s/2,y-s/2); X.lineTo(x-s/2+s*a,y-s/2+s*a); if(b>0){X.moveTo(x+s/2,y-s/2); X.lineTo(x+s/2-s*b,y-s/2+s*b);} X.stroke(); X.restore(); }
function product(x,y,w,h,kind){ X.save(); X.fillStyle='#F4F1EC'; rr(x,y,w,h,18); X.fill(); const cx=x+w/2, cy=y+h*0.42;
  if(kind===0){ X.fillStyle='#8C4A2F'; rr(cx-w*0.14,cy-h*0.26,w*0.28,h*0.52,10); X.fill(); X.fillStyle='#2B2622'; X.fillRect(cx-w*0.07,cy-h*0.36,w*0.14,h*0.1); }
  else if(kind===1){ X.fillStyle='#2B2622'; rr(cx-w*0.26,cy-h*0.06,w*0.52,h*0.24,10); X.fill(); X.fillStyle='#E9D7C2'; rr(cx-w*0.26,cy-h*0.2,w*0.52,h*0.14,8); X.fill(); }
  else { X.fillStyle='#D7C2AF'; rr(cx-w*0.22,cy-h*0.18,w*0.44,h*0.42,10); X.fill(); X.strokeStyle='#8C7760'; X.lineWidth=5; X.beginPath(); X.arc(cx,cy-h*0.18,w*0.1,Math.PI,0); X.stroke(); }
  X.fillStyle=ACC; rr(x+w*0.16,y+h*0.8,w*0.68,h*0.11,h*0.05); X.fill(); X.restore(); }

