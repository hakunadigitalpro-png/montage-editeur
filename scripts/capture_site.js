// Captures du site du client : pages complètes (desktop + mobile, bannière cookies masquée — jamais acceptée), logo(s) en PNG transparent, couleurs et polices
// node capture_site.js <url> <dossier_projet>   → captures/*.png, assets/logo-*.png, captures/info.json
const path=require('path'),fs=require('fs'); const P=require(process.env.PUPPETEER_PATH);
const URL0=process.argv[2], W=path.resolve(process.argv[3]||'.'), OUT=path.join(W,'captures'), AS=path.join(W,'assets');
fs.mkdirSync(OUT,{recursive:true}); fs.mkdirSync(AS,{recursive:true});
const CH=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(f=>fs.existsSync(f));
const hide=p=>p.evaluate(()=>{ for(const el of document.querySelectorAll('body *')){ const cs=getComputedStyle(el);
  if((cs.position==='fixed'||cs.position==='sticky')&&/cookie|témoin|consent/i.test(el.innerText||'')) el.style.setProperty('display','none','important'); } });
(async()=>{ const b=await P.launch({executablePath:CH,headless:'new',args:['--no-sandbox']}); const p=await b.newPage();
  await p.setViewport({width:1440,height:900,deviceScaleFactor:1.5}); await p.goto(URL0,{waitUntil:'networkidle2',timeout:60000});
  const host=new URL(URL0).host.replace(/^www\./,'');
  const links=await p.$$eval('a',as=>[...new Set(as.map(a=>a.href.split('#')[0]))]);
  const pick=links.filter(h=>h.includes(host)&&/produit|product|fonctionn|feature|platefor|platform|solution|service|tarif|pricing|securit/i.test(h)).slice(0,4);
  const info={url:URL0,pages:[],logos:[]};
  for(const [i,url] of [URL0,...pick].entries()){ for(const [dev,vw,vh,dpr] of [['d',1440,900,1.5],['m',430,932,3]]){
    await p.setViewport({width:vw,height:vh,deviceScaleFactor:dpr}); await p.goto(url,{waitUntil:'networkidle2',timeout:60000}); await new Promise(r=>setTimeout(r,1500));
    const H=await p.evaluate(()=>document.body.scrollHeight); for(let y=0;y<H;y+=vh*0.8){ await p.evaluate(y=>window.scrollTo(0,y),y); await new Promise(r=>setTimeout(r,200)); }
    await p.evaluate(()=>window.scrollTo(0,0)); await new Promise(r=>setTimeout(r,500)); await hide(p);
    const f=`page${i}-${dev}.png`; await p.screenshot({path:path.join(OUT,f),fullPage:true}); info.pages.push({url,dev,file:f}); } }
  await p.setViewport({width:1440,height:900,deviceScaleFactor:1}); await p.goto(URL0,{waitUntil:'networkidle2'});
  const logos=await p.$$eval('img',ims=>ims.map(i=>({src:i.currentSrc||i.src,alt:i.alt||'',w:i.naturalWidth||0,h:i.naturalHeight||0})).filter(i=>i.src&&/logo/i.test(i.src+i.alt)));
  let n=0; for(const L of logos.slice(0,4)){ const q=await b.newPage(); const w=Math.max(L.w,148), h=Math.max(L.h,48);
    await q.setViewport({width:w,height:h,deviceScaleFactor:Math.max(2,Math.round(1800/w))});
    await q.setContent(`<html><body style="margin:0;background:transparent"><img src="${L.src}" style="width:${w}px;height:${h}px;display:block"></body></html>`,{waitUntil:'networkidle0'});
    const f=`logo-${++n}.png`; await q.screenshot({path:path.join(AS,f),omitBackground:true}); await q.close(); info.logos.push({...L,file:'assets/'+f}); }
  info.style=await p.evaluate(()=>{ const cols={}; for(const el of document.querySelectorAll('a,button,h1,h2,h3,section,header,footer,div')){ const cs=getComputedStyle(el);
      for(const k of ['backgroundColor','color']){ const v=cs[k]; if(v&&v!=='rgba(0, 0, 0, 0)') cols[v]=(cols[v]||0)+1; } }
    return {couleurs:Object.entries(cols).sort((a,b)=>b[1]-a[1]).slice(0,15),polices:[...new Set([...document.querySelectorAll('h1,h2,p,a')].map(e=>getComputedStyle(e).fontFamily))].slice(0,5),titre:document.title}; });
  fs.writeFileSync(path.join(OUT,'info.json'),JSON.stringify(info,null,1));
  console.log(JSON.stringify({pages:info.pages.length,logos:info.logos.map(l=>l.file),style:info.style}).slice(0,1500)); await b.close(); })();
