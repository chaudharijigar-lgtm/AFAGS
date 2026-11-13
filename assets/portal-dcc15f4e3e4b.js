window.AFAGS_ADMIN=1;/* ===== AFAGS API client — switches the site to the AFAGS server automatically when one is online ===== */
(()=>{if(window.AFAGS_API)return;
const BASE=(window.AFAGS_API_BASE||'')+'/api',TK='afags_jwt';
const httpish=/^https?:$/.test(location.protocol)||(location.protocol==='about:'&&(()=>{try{return /^https?:$/.test(parent.location.protocol)}catch(e){return false}})());
const A={online:false,cfg:{},ready:null,pulling:false,
  token(){try{return sessionStorage.getItem(TK)||''}catch(e){return ''}},
  setToken(t){try{t?sessionStorage.setItem(TK,t):sessionStorage.removeItem(TK)}catch(e){}},
  /* 'cookie-session' = signed in with an HttpOnly cookie: the real token is never visible to scripts */
  async call(method,path,body,opt={}){const h={'Content-Type':'application/json','X-AFAGS':'1'},t=A.token();if(t&&t!=='cookie-session')h.Authorization='Bearer '+t;
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),opt.timeout||20000);
    try{const r=await fetch(BASE+path,{method,headers:h,body:body?JSON.stringify(body):undefined,signal:ctl.signal,credentials:'same-origin',cache:'no-store'});
      const j=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(j.error||('HTTP '+r.status));e.status=r.status;e.data=j;throw e}return j}finally{clearTimeout(to)}}};
/* raw localStorage writer that never triggers sync */
const rawSet=Storage.prototype.setItem,BASEV={};/* last value known to be on the server, per key (for conflict-safe merging) */
A.put=(k,v)=>{A.pulling=true;const s=typeof v==='string'?v:JSON.stringify(v);BASEV[k]=s;try{rawSet.call(localStorage,k,s)}catch(e){}A.pulling=false};
A.logout=()=>{const t=A.token();A.setToken('');return t?A.call('POST','/auth/logout',{}).catch(()=>{}):Promise.resolve()};
A.ready=!httpish?Promise.resolve(false):A.call('GET','/health',null,{timeout:2500}).then(j=>{A.online=!!j.ok;A.cfg=j.cfg||{};document.documentElement.classList.add('afags-online');return true}).catch(()=>false);
/* public pull: CMS, site settings, theme, accredited members, stats, verification index */
A.pullPublic=async()=>{const j=await A.call('GET','/public');Object.entries(j.kv||{}).forEach(([k,v])=>A.put(k,v));return j};
A.pullAll=async()=>{const j=await A.call('GET','/kv');Object.entries(j.kv||{}).forEach(([k,v])=>A.put(k,v));return j};
/* outgoing sync */
const seen={apps:null,inbox:null},timers={};
function ids(k,f){try{return (JSON.parse(localStorage.getItem(k))||[]).map(f)}catch(e){return []}}
Storage.prototype.setItem=function(k,v){const prevApps=k==='afags_apps'?ids('afags_apps',a=>a.ref):null,prevIn=k==='afags_inbox'?ids('afags_inbox',a=>a.id):null;
  rawSet.call(this,k,v);if(this!==localStorage||!A.online||A.pulling||!/^afags_/.test(k))return;
  if(A.token()){if(['afags_lock','afags_rem','afags_a11y','afags_fs','afags_form_rl','afags_live','afags_sec','afags_pw','afags_maccts','afags_login'].includes(k))return;clearTimeout(timers[k]);
    timers[k]=setTimeout(()=>{const val=localStorage.getItem(k);A.call('PUT','/kv/'+encodeURIComponent(k),{value:val,base:BASEV[k]}).then(j=>{if(j&&j.creds){try{window.dispatchEvent(new CustomEvent('afags-creds',{detail:j.creds}))}catch(e){}}if(j&&j.merged){A.put(k,j.value);try{window.dispatchEvent(new CustomEvent('afags-merged',{detail:k}))}catch(e){}}else BASEV[k]=val}).catch(e=>{console.warn('sync',k,e.message);if(e.status===401){A.setToken('');try{window.dispatchEvent(new Event('afags-signed-out'))}catch(x){}}})},400);return}
  try{if(k==='afags_apps'){JSON.parse(v).filter(a=>!prevApps.includes(a.ref)).forEach(a=>A.call('POST','/apps',a).catch(e=>console.warn('apps',e.message)))}
      if(k==='afags_inbox'){JSON.parse(v).filter(a=>!prevIn.includes(a.id)).forEach(a=>A.call('POST','/inbox',a).catch(e=>console.warn('inbox',e.message)))}}catch(e){}};
/* Razorpay checkout (only when the server says payments are configured) */
A.pay=o=>new Promise(async(res,rej)=>{try{const ord=await A.call('POST','/pay/order',{amount:o.amount,purpose:o.purpose,ref:o.ref,name:o.name});
  if(!window.Razorpay)await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=()=>no(new Error('Could not load the payment window'));document.head.appendChild(s)});
  const rz=new Razorpay({key:ord.key,amount:ord.amount,currency:'INR',order_id:ord.id,name:'AFAGS',description:o.purpose,prefill:{name:o.name||'',email:o.email||'',contact:o.mobile||''},theme:{color:'#0b2257'},
    handler:async r=>{try{const v=await A.call('POST','/pay/verify',r);res({amount:o.amount,txn:v.paymentId,method:'Razorpay · '+(v.method||'online'),at:Date.now(),order:ord.id})}catch(e){rej(e)}},modal:{ondismiss:()=>rej(new Error('Payment cancelled'))}});
  rz.on('payment.failed',r=>rej(new Error((r.error&&r.error.description)||'Payment failed')));rz.open()}catch(e){rej(e)}});
window.AFAGS_API=A})();

/* ===== Minimal QR code generator (byte mode, error-correction level M, versions 1–10) → SVG ===== */
window.AFAGS_QR=(()=>{
const ECC=[0,10,16,26,18,24,16,18,22,22,26],BLK=[0,1,1,1,2,2,4,4,4,5,5];
const raw=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r};
const cap=v=>Math.floor(raw(v)/8)-ECC[v]*BLK[v];
const ALIGN=v=>{if(v===1)return [];const n=Math.floor(v/7)+2,step=v===32?26:Math.ceil((v*4+4)/(n*2-2))*2,res=[6];for(let p=v*4+10;res.length<n;p-=step)res.splice(1,0,p);return res};
function mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z&255}
function rsDiv(d){const r=new Array(d).fill(0);r[d-1]=1;let root=1;for(let i=0;i<d;i++){for(let j=0;j<d;j++){r[j]=mul(r[j],root);if(j+1<d)r[j]^=r[j+1]}root=mul(root,2)}return r}
function rsRem(data,div){const r=new Array(div.length).fill(0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>r[i]^=mul(c,f))}return r}
function make(text){const bytes=[...new TextEncoder().encode(text)];let v=1;for(;v<=10;v++)if(bytes.length+(v<10?2:3)<=cap(v))break;if(v>10)throw new Error('Text too long for QR');
  const bits=[],push=(val,n)=>{for(let i=n-1;i>=0;i--)bits.push((val>>>i)&1)};push(4,4);push(bytes.length,v<10?8:16);bytes.forEach(b=>push(b,8));
  const dc=cap(v);push(0,Math.min(4,dc*8-bits.length));while(bits.length%8)bits.push(0);const data=[];for(let i=0;i<bits.length;i+=8)data.push(parseInt(bits.slice(i,i+8).join(''),2));
  for(let p=0xEC;data.length<dc;p^=0xEC^0x11)data.push(p);
  /* blocks + ecc + interleave */
  const nb=BLK[v],el=ECC[v],rc=Math.floor(raw(v)/8),ns=nb-rc%nb,sl=Math.floor(rc/nb),div=rsDiv(el),blocks=[];
  for(let i=0,k=0;i<nb;i++){const dat=data.slice(k,k+sl-el+(i<ns?0:1));k+=dat.length;const ecc=rsRem(dat,div);if(i<ns)dat.push(0);blocks.push(dat.concat(ecc))}
  const cw=[];for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==sl-el||j>=ns)cw.push(b[i])});
  /* matrix */
  const N=v*4+17,M=[...Array(N)].map(()=>new Array(N).fill(false)),F=[...Array(N)].map(()=>new Array(N).fill(false));
  const set=(x,y,d)=>{M[y][x]=d;F[y][x]=true};
  for(let i=0;i<N;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
  const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<N&&y>=0&&y<N)set(x,y,d!==2&&d!==4)}};
  finder(3,3);finder(N-4,3);finder(3,N-4);
  const al=ALIGN(v);al.forEach((a,i)=>al.forEach((b,j)=>{if(!((i===0&&j===0)||(i===0&&j===al.length-1)||(i===al.length-1&&j===0)))for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(a+dx,b+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}));
  const fmt=mask=>{const d=(0<<3)|mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((d<<10)|r)^0x5412,g=i=>((b>>>i)&1)===1;
    for(let i=0;i<=5;i++)set(8,i,g(i));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(let i=9;i<15;i++)set(14-i,8,g(i));
    for(let i=0;i<8;i++)set(N-1-i,8,g(i));for(let i=8;i<15;i++)set(8,N-15+i,g(i));set(8,N-8,true)};
  fmt(0);
  if(v>=7){let r=v;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);const b=(v<<12)|r;for(let i=0;i<18;i++){const bit=((b>>>i)&1)===1,a=N-11+i%3,c=Math.floor(i/3);set(a,c,bit);set(c,a,bit)}}
  let i=0;for(let right=N-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<N;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?N-1-vert:vert;
    if(!F[y][x]&&i<cw.length*8){M[y][x]=((cw[i>>>3]>>>(7-(i&7)))&1)===1;i++}}}
  const MASK=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,x=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
  const apply=m=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!F[y][x]&&MASK[m](x,y))M[y][x]=!M[y][x]};
  const pen=()=>{let p=0;for(let y=0;y<N;y++){let run=1;for(let x=1;x<N;x++){if(M[y][x]===M[y][x-1]){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}}
    for(let x=0;x<N;x++){let run=1;for(let y=1;y<N;y++){if(M[y][x]===M[y-1][x]){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}}
    for(let y=0;y<N-1;y++)for(let x=0;x<N-1;x++){const c=M[y][x];if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])p+=3}
    let dark=0;M.forEach(r=>r.forEach(c=>dark+=c));p+=Math.floor(Math.abs(dark*20-N*N*10)/(N*N))*10;return p};
  let best=0,bp=1e9;for(let m=0;m<8;m++){apply(m);fmt(m);const p=pen();if(p<bp){bp=p;best=m}apply(m)}
  apply(best);fmt(best);return M}
function svg(text,o={}){const M=make(text),N=M.length,q=4,s=N+q*2;let d='';M.forEach((r,y)=>r.forEach((c,x)=>{if(c)d+=`M${x+q} ${y+q}h1v1h-1z`}));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${o.size||120}" height="${o.size||120}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${s}" height="${s}" fill="#fff"/><path d="${d}" fill="${o.color||'#0b2257'}"/></svg>`}
return {make,svg}})();

/* ===== Old Excel 97–2003 (.xls / BIFF8) reader — first worksheet → array of rows ===== */
window.AFAGS_XLS=(()=>{
function cfbStream(buf,names){const dv=new DataView(buf),u8=new Uint8Array(buf);if(dv.getUint32(0,true)!==0xE011CFD0)throw new Error('Not an .xls file');
  const ss=1<<dv.getUint16(30,true),mss=1<<dv.getUint16(32,true),nFat=dv.getUint32(44,true),dirStart=dv.getInt32(48,true),cutoff=dv.getUint32(56,true),miniStart=dv.getInt32(60,true),difStart=dv.getInt32(68,true);
  const off=s=>(s+1)*ss,fatSecs=[];for(let i=0;i<109&&fatSecs.length<nFat;i++){const s=dv.getInt32(76+i*4,true);if(s>=0)fatSecs.push(s)}
  let d=difStart,guard=0;while(d>=0&&fatSecs.length<nFat&&guard++<1e4){for(let i=0;i<ss/4-1&&fatSecs.length<nFat;i++){const s=dv.getInt32(off(d)+i*4,true);if(s>=0)fatSecs.push(s)}d=dv.getInt32(off(d)+ss-4,true)}
  const fat=[];fatSecs.forEach(s=>{for(let i=0;i<ss/4;i++)fat.push(dv.getInt32(off(s)+i*4,true))});
  const chain=(s,arr)=>{const r=[];let g=0;while(s>=0&&s<arr.length&&g++<1e6){r.push(s);s=arr[s]}return r};
  const read=(s,size)=>{const out=new Uint8Array(size);let p=0;for(const c of chain(s,fat)){const n=Math.min(ss,size-p);if(n<=0)break;out.set(u8.subarray(off(c),off(c)+n),p);p+=n}return out};
  const dirSecs=chain(dirStart,fat),dirs=[];dirSecs.forEach(s=>{for(let i=0;i<ss/128;i++){const b=off(s)+i*128,nl=dv.getUint16(b+64,true);let name='';for(let k=0;k<Math.max(0,nl/2-1);k++)name+=String.fromCharCode(dv.getUint16(b+k*2,true));
    dirs.push({name,type:dv.getUint8(b+66),start:dv.getInt32(b+116,true),size:dv.getUint32(b+120,true)})}});
  const e=dirs.find(x=>x.type===2&&names.includes(x.name));if(!e)throw new Error('No workbook found in the .xls file');
  if(e.size>=cutoff)return read(e.start,e.size);
  const root=dirs.find(x=>x.type===5),ms=read(root.start,root.size),mfat=[];chain(miniStart,fat).forEach(s=>{for(let i=0;i<ss/4;i++)mfat.push(dv.getInt32(off(s)+i*4,true))});
  const out=new Uint8Array(e.size);let p=0;for(const c of chain(e.start,mfat)){const n=Math.min(mss,e.size-p);if(n<=0)break;out.set(ms.subarray(c*mss,c*mss+n),p);p+=n}return out}
function read(buf){const wb=cfbStream(buf,['Workbook','Book']),dv=new DataView(wb.buffer,wb.byteOffset,wb.byteLength);
  const recs=[];for(let p=0;p+4<=wb.length;){const t=dv.getUint16(p,true),l=dv.getUint16(p+2,true);recs.push({t,p:p+4,l});p+=4+l}
  /* shared strings (with CONTINUE handling) */
  const sst=[];const si=recs.findIndex(r=>r.t===0x00FC);
  if(si>=0){const parts=[recs[si]];for(let k=si+1;k<recs.length&&recs[k].t===0x003C;k++)parts.push(recs[k]);let pi=0,pos=parts[0].p+8,end=parts[0].p+parts[0].l;
    const next=()=>{pi++;if(pi>=parts.length)return false;pos=parts[pi].p;end=pos+parts[pi].l;return true};
    const u8=()=>{if(pos>=end&&!next())throw 0;return wb[pos++]},u16=()=>u8()|(u8()<<8),u32=()=>(u16()|(u16()<<16))>>>0;
    const n=dv.getUint32(parts[0].p+4,true);
    try{for(let i=0;i<n;i++){let cch=u16(),fl=u8();const rich=fl&8?u16():0,ext=fl&4?u32():0;let s='',wide=fl&1;
      while(cch>0){if(pos>=end){next();wide=wb[pos++]&1}const avail=wide?Math.floor((end-pos)/2):end-pos,take=Math.min(cch,avail);
        for(let k=0;k<take;k++){s+=String.fromCharCode(wide?dv.getUint16(pos,true):wb[pos]);pos+=wide?2:1}cch-=take;if(cch>0&&take===0&&!next())break}
      for(let k=0;k<rich*4+ext;k++)u8();sst.push(s)}}catch(e){}}
  /* first worksheet */
  const bs=recs.find(r=>r.t===0x0085&&(wb[r.p+5]===0));const start=bs?dv.getUint32(bs.p,true):0;
  const rows=[],put=(r,c,v)=>{(rows[r]=rows[r]||[])[c]=v};
  const rk=x=>{let v;if(x&2)v=x>>2;else{const b=new DataView(new ArrayBuffer(8));b.setUint32(4,x&0xFFFFFFFC,true);v=b.getFloat64(0,true)}return x&1?v/100:v};
  const num=v=>Number.isInteger(v)?String(v):String(+v.toFixed(6));
  let i=recs.findIndex(r=>r.p-4===start);if(i<0)i=0;let pendingStr=null;
  for(i++;i<recs.length;i++){const {t,p,l}=recs[i];if(t===0x000A)break;
    if(t===0x00FD)put(dv.getUint16(p,true),dv.getUint16(p+2,true),sst[dv.getUint32(p+6,true)]??'');
    else if(t===0x0203)put(dv.getUint16(p,true),dv.getUint16(p+2,true),num(dv.getFloat64(p+6,true)));
    else if(t===0x027E)put(dv.getUint16(p,true),dv.getUint16(p+2,true),num(rk(dv.getUint32(p+6,true))));
    else if(t===0x00BD){const r=dv.getUint16(p,true),c0=dv.getUint16(p+2,true),n=(l-6)/6;for(let k=0;k<n;k++)put(r,c0+k,num(rk(dv.getUint32(p+4+k*6+2,true))))}
    else if(t===0x0204){const r=dv.getUint16(p,true),c=dv.getUint16(p+2,true),cch=dv.getUint16(p+6,true),w=wb[p+8]&1;let s='';for(let k=0;k<cch;k++)s+=String.fromCharCode(w?dv.getUint16(p+9+k*2,true):wb[p+9+k]);put(r,c,s)}
    else if(t===0x0006){const r=dv.getUint16(p,true),c=dv.getUint16(p+2,true);if(dv.getUint16(p+12,true)===0xFFFF&&wb[p+6]===0)pendingStr=[r,c];else if(dv.getUint16(p+12,true)!==0xFFFF)put(r,c,num(dv.getFloat64(p+6,true)))}
    else if(t===0x0207&&pendingStr){const cch=dv.getUint16(p,true),w=wb[p+2]&1;let s='';for(let k=0;k<cch;k++)s+=String.fromCharCode(w?dv.getUint16(p+3+k*2,true):wb[p+3+k]);put(pendingStr[0],pendingStr[1],s);pendingStr=null}}
  return [...rows].map(r=>r?[...r].map(x=>x??''):[])}
return {read}})();
