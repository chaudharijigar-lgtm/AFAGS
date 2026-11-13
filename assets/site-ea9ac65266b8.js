/* ===== AFAGS API client — switches the site to the AFAGS server automatically when one is online ===== */
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

/* ===== Built-in Gujarati / Hindi interface translation (works offline; Google Translate is optional for full text) ===== */
window.AFAGS_I18N=(()=>{
// [English, Gujarati, Hindi]
const T=[
['Home','હોમ','होम'],['About Us','અમારા વિશે','हमारे बारे में'],['About AFAGS','AFAGS વિશે','AFAGS के बारे में'],['Constitution and Policies','બંધારણ અને નીતિઓ','संविधान और नीतियाँ'],['Office Bearers & EC','પદાધિકારીઓ અને કારોબારી','पदाधिकारी और कार्यकारिणी'],
['Committees / Commissions','સમિતિઓ / કમિશન','समितियाँ / आयोग'],['Members (District Units)','સભ્યો (જિલ્લા એકમો)','सदस्य (ज़िला इकाइयाँ)'],['RTI / Grievance Authority','RTI / ફરિયાદ નિવારણ','RTI / शिकायत निवारण'],['Circulars','પરિપત્રો','परिपत्र'],['Tenders / EOI','ટેન્ડર / EOI','निविदा / EOI'],
['Records','રેકોર્ડ્સ','अभिलेख'],['Annual Reports','વાર્ષિક અહેવાલ','वार्षिक रिपोर्ट'],['Finances','નાણાકીય','वित्त'],['Elections','ચૂંટણી','चुनाव'],['Compliance','અનુપાલન','अनुपालन'],['Legal / Arbitration / Disciplinary','કાનૂની / લવાદ / શિસ્ત','कानूनी / मध्यस्थता / अनुशासन'],['Donate','દાન કરો','दान करें'],
['Calendar','કેલેન્ડર','कैलेंडर'],['Fencing Calendar','ફેન્સિંગ કેલેન્ડર','फेंसिंग कैलेंडर'],['State Championships','રાજ્ય ચેમ્પિયનશિપ','राज्य चैंपियनशिप'],['National Championships','રાષ્ટ્રીય ચેમ્પિયનશિપ','राष्ट्रीय चैंपियनशिप'],['International Competitions','આંતરરાષ્ટ્રીય સ્પર્ધાઓ','अंतरराष्ट्रीय प्रतियोगिताएँ'],['ASMITA Calendar','ASMITA કેલેન્ડર','ASMITA कैलेंडर'],
['Results','પરિણામો','परिणाम'],['State Rankings','રાજ્ય રેન્કિંગ','राज्य रैंकिंग'],['Fencers','ફેન્સર્સ','फेंसर्स'],['Fencers Profile','ફેન્સર પ્રોફાઇલ','फेंसर प्रोफ़ाइल'],['Achievers','સિદ્ધિ મેળવનારા','उपलब्धि प्राप्तकर्ता'],['Registration Guidelines','નોંધણી માર્ગદર્શિકા','पंजीकरण दिशानिर्देश'],['Renew Registration','નોંધણી રિન્યૂ કરો','पंजीकरण नवीनीकरण'],['Verify ID / Certificate','ID / પ્રમાણપત્ર ચકાસો','ID / प्रमाणपत्र सत्यापित करें'],
['Sport','રમત','खेल'],['Fencing','ફેન્સિંગ','फेंसिंग'],['Rules','નિયમો','नियम'],['Anti Doping','એન્ટી ડોપિંગ','एंटी डोपिंग'],['Coaches Profile','કોચ પ્રોફાઇલ','कोच प्रोफ़ाइल'],['Referees and TOs Profile','રેફરી અને TO પ્રોફાઇલ','रेफरी और TO प्रोफ़ाइल'],['Academies / Clubs Profile','એકેડેમી / ક્લબ પ્રોફાઇલ','अकादमी / क्लब प्रोफ़ाइल'],
['Media','મીડિયા','मीडिया'],['News / Press Releases','સમાચાર / પ્રેસ રિલીઝ','समाचार / प्रेस विज्ञप्ति'],['Career','કારકિર્દી','करियर'],['Photo Gallery','ફોટો ગેલેરી','फोटो गैलरी'],['Video Gallery','વિડિયો ગેલેરી','वीडियो गैलरी'],
['Contact Us','સંપર્ક કરો','संपर्क करें'],['Help & FAQ','મદદ અને પ્રશ્નો','सहायता और प्रश्न'],['Member Login','સભ્ય લૉગિન','सदस्य लॉगिन'],['Latest','તાજા','ताज़ा'],['Screen Reader Access','સ્ક્રીન રીડર ઍક્સેસ','स्क्रीन रीडर एक्सेस'],
['Welcome to the Official Website of the Amateur Fencing Association of Gujarat State','ગુજરાત રાજ્ય એમેચ્યોર ફેન્સિંગ એસોસિએશનની સત્તાવાર વેબસાઇટ પર આપનું સ્વાગત છે','गुजरात राज्य एमेच्योर फेंसिंग एसोसिएशन की आधिकारिक वेबसाइट पर आपका स्वागत है'],
['Amateur Fencing Association of Gujarat State','ગુજરાત રાજ્ય એમેચ્યોર ફેન્સિંગ એસોસિએશન','गुजरात राज्य एमेच्योर फेंसिंग एसोसिएशन'],['Affiliated to Fencing Association of India (FAI)','ફેન્સિંગ એસોસિએશન ઓફ ઇન્ડિયા (FAI) સાથે સંલગ્ન','फेंसिंग एसोसिएशन ऑफ इंडिया (FAI) से संबद्ध'],
['One Weapon.','એક શસ્ત્ર.','एक हथियार.'],['One Sport.','એક રમત.','एक खेल.'],['One Gujarat.','એક ગુજરાત.','एक गुजरात.'],['Join AFAGS','AFAGS માં જોડાઓ','AFAGS से जुड़ें'],['Learn More','વધુ જાણો','और जानें'],['Pride of','ગૌરવ:','गौरव:'],['Gujarat','ગુજરાત','गुजरात'],['Fencing.','ફેન્સિંગનું.','फेंसिंग का.'],
['Meet Office Bearers','પદાધિકારીઓને મળો','पदाधिकारियों से मिलें'],['Register Now','હમણાં નોંધણી કરો','अभी पंजीकरण करें'],['View Calendar','કેલેન્ડર જુઓ','कैलेंडर देखें'],['Grassroots to Podium','પાયાથી પોડિયમ સુધી','ज़मीनी स्तर से पोडियम तक'],['From Districts','જિલ્લાઓથી','ज़िलों से'],['To The','લઈને','लेकर'],['World Stage.','વિશ્વ મંચ સુધી.','विश्व मंच तक.'],
['Find a Club','ક્લબ શોધો','क्लब खोजें'],['Explore Disciplines','શાખાઓ જુઓ','विधाएँ देखें'],['Our Mission','અમારું મિશન','हमारा मिशन'],['Our Vision','અમારું વિઝન','हमारा विज़न'],['Our Values','અમારા મૂલ્યો','हमारे मूल्य'],['Excellence','શ્રેષ્ઠતા','उत्कृष्टता'],['Integrity','પ્રામાણિકતા','ईमानदारी'],['Respect','આદર','सम्मान'],['Inclusivity','સમાવેશ','समावेशिता'],['Fair Play','ખેલદિલી','निष्पक्ष खेल'],
['Affiliated To','સંલગ્ન','संबद्ध'],['Governance','શાસન','शासन'],['Know More About AFAGS','AFAGS વિશે વધુ જાણો','AFAGS के बारे में और जानें'],['Disciplines of Fencing','ફેન્સિંગની શાખાઓ','फेंसिंग की विधाएँ'],
['Foil','ફોઇલ','फॉइल'],['Épée','એપી','एपी'],['Sabre','સેબર','सेबर'],['A light thrusting weapon with a button target.','બટનવાળી ટોચ સાથેનું હલકું થ્રસ્ટિંગ શસ્ત્ર.','बटन वाली नोक के साथ हल्का थ्रस्टिंग हथियार.'],['A thrusting weapon where the entire body is the target.','થ્રસ્ટિંગ શસ્ત્ર જેમાં આખું શરીર લક્ષ્ય છે.','थ्रस्टिंग हथियार जिसमें पूरा शरीर लक्ष्य है.'],
['A slashing and thrusting weapon with target above the waist.','કમરથી ઉપરના લક્ષ્ય સાથે કાપવા અને ભોંકવાનું શસ્ત્ર.','कमर से ऊपर के लक्ष्य के साथ काटने और भोंकने वाला हथियार.'],['Touches score with the point.','ટોચથી સ્પર્શ કરતાં પોઇન્ટ મળે છે.','नोक से छूने पर अंक मिलता है.'],['Touches score with the edge or point.','ધાર અથવા ટોચથી સ્પર્શ કરતાં પોઇન્ટ મળે છે.','धार या नोक से छूने पर अंक मिलता है.'],
['Point','ટોચ','नोक'],['Edge + Point','ધાર + ટોચ','धार + नोक'],['More Info','વધુ માહિતી','और जानकारी'],["Men's Foil",'પુરુષ ફોઇલ','पुरुष फॉइल'],["Women's Foil",'મહિલા ફોઇલ','महिला फॉइल'],['Team Foil','ટીમ ફોઇલ','टीम फॉइल'],["Men's Épée",'પુરુષ એપી','पुरुष एपी'],["Women's Épée",'મહિલા એપી','महिला एपी'],['Team Épée','ટીમ એપી','टीम एपी'],["Men's Sabre",'પુરુષ સેબર','पुरुष सेबर'],["Women's Sabre",'મહિલા સેબર','महिला सेबर'],['Team Sabre','ટીમ સેબર','टीम सेबर'],
['Senior','સિનિયર','सीनियर'],['Open','ઓપન','ओपन'],['Office Bearers','પદાધિકારીઓ','पदाधिकारी'],['Secretary General','મહામંત્રી','महासचिव'],['President','પ્રમુખ','अध्यक्ष'],['Treasurer','ખજાનચી','कोषाध्यक्ष'],['Vice President','ઉપપ્રમુખ','उपाध्यक्ष'],['Joint Secretary','સહમંત્રી','संयुक्त सचिव'],['Executive Member','કારોબારી સભ્ય','कार्यकारी सदस्य'],['View More','વધુ જુઓ','और देखें'],
['Affiliated District Units','સંલગ્ન જિલ્લા એકમો','संबद्ध ज़िला इकाइयाँ'],['Affiliated Clubs','સંલગ્ન ક્લબ','संबद्ध क्लब'],['Coaches & Referees','કોચ અને રેફરી','कोच और रेफरी'],['Registered Fencers','નોંધાયેલા ફેન્સર્સ','पंजीकृत फेंसर्स'],['State Events Annually','વાર્ષિક રાજ્ય સ્પર્ધાઓ','वार्षिक राज्य प्रतियोगिताएँ'],['National Medals','રાષ્ટ્રીય મેડલ','राष्ट्रीय पदक'],['Years of Service','સેવાના વર્ષો','सेवा के वर्ष'],
['Our Fencers','અમારા ફેન્સર્સ','हमारे फेंसर्स'],['All','બધા','सभी'],['State Rank','રાજ્ય રેન્ક','राज्य रैंक'],['Points','પોઇન્ટ','अंक'],['Medals','મેડલ','पदक'],['View Rankings','રેન્કિંગ જુઓ','रैंकिंग देखें'],
['Key Initiatives','મુખ્ય પહેલ','प्रमुख पहल'],['Grassroots Development','પાયાનો વિકાસ','ज़मीनी स्तर पर विकास'],['Coach & Referee Education','કોચ અને રેફરી તાલીમ','कोच और रेफरी शिक्षा'],['High Performance Program','હાઇ પરફોર્મન્સ પ્રોગ્રામ','हाई परफॉर्मेंस प्रोग्राम'],['Women in Fencing','ફેન્સિંગમાં મહિલાઓ','फेंसिंग में महिलाएँ'],['Anti-Doping & Fair Play','એન્ટી-ડોપિંગ અને ખેલદિલી','एंटी-डोपिंग और निष्पक्ष खेल'],['Fencing for All','સૌ માટે ફેન્સિંગ','सबके लिए फेंसिंग'],
['Online Registration','ઓનલાઇન નોંધણી','ऑनलाइन पंजीकरण'],['Live Scoring','લાઇવ સ્કોરિંગ','लाइव स्कोरिंग'],['Rankings','રેન્કિંગ','रैंकिंग'],['Athlete Profiles','ખેલાડી પ્રોફાઇલ','खिलाड़ी प्रोफ़ाइल'],['Calendar & Events','કેલેન્ડર અને સ્પર્ધાઓ','कैलेंडर और प्रतियोगिताएँ'],['Documents Centre','દસ્તાવેજ કેન્દ્ર','दस्तावेज़ केंद्र'],['News & Media','સમાચાર અને મીડિયા','समाचार और मीडिया'],['Anti-Doping','એન્ટી-ડોપિંગ','एंटी-डोपिंग'],['Member Portal','સભ્ય પોર્ટલ','सदस्य पोर्टल'],
['News & Updates','સમાચાર અને અપડેટ્સ','समाचार और अपडेट'],['View All News ➜','બધા સમાચાર જુઓ ➜','सभी समाचार देखें ➜'],['View Calendar ➜','કેલેન્ડર જુઓ ➜','कैलेंडर देखें ➜'],['View All Events','બધી સ્પર્ધાઓ જુઓ','सभी प्रतियोगिताएँ देखें'],['Upcoming Events','આગામી સ્પર્ધાઓ','आगामी प्रतियोगिताएँ'],['Upcoming','આગામી','आगामी'],
['Resources','સંસાધનો','संसाधन'],['Rules & Regulations','નિયમો અને વિનિયમો','नियम और विनियम'],['AFAGS Constitution','AFAGS બંધારણ','AFAGS संविधान'],['Policies & Guidelines','નીતિઓ અને માર્ગદર્શિકા','नीतियाँ और दिशानिर्देश'],['Forms & Downloads','ફોર્મ અને ડાઉનલોડ','फ़ॉर्म और डाउनलोड'],['Rankings & Results','રેન્કિંગ અને પરિણામો','रैंकिंग और परिणाम'],['Anti-Doping Information','એન્ટી-ડોપિંગ માહિતી','एंटी-डोपिंग जानकारी'],['Coaching Education','કોચિંગ શિક્ષણ','कोचिंग शिक्षा'],['Safety & Equipment','સલામતી અને સાધનો','सुरक्षा और उपकरण'],['View All Resources','બધા સંસાધનો જુઓ','सभी संसाधन देखें'],
["Be a part of Gujarat's fencing family",'ગુજરાતના ફેન્સિંગ પરિવારનો ભાગ બનો','गुजरात के फेंसिंग परिवार का हिस्सा बनें'],['Join a Club','ક્લબમાં જોડાઓ','क्लब से जुड़ें'],['Become a Member','સભ્ય બનો','सदस्य बनें'],['Get Involved','જોડાઓ','जुड़ें'],
['About','વિશે','बारे में'],['Constitution & Policies','બંધારણ અને નીતિઓ','संविधान और नीतियाँ'],['Clubs & Academies','ક્લબ અને એકેડેમી','क्लब और अकादमी'],['Important Links','મહત્વપૂર્ણ લિંક્સ','महत्वपूर्ण लिंक'],['Contact','સંપર્ક','संपर्क'],['Subscribe','સબ્સ્ક્રાઇબ','सब्सक्राइब'],['Privacy Policy','ગોપનીયતા નીતિ','गोपनीयता नीति'],['Terms of Use','ઉપયોગની શરતો','उपयोग की शर्तें'],['Sitemap','સાઇટમેપ','साइटमैप'],['Accessibility','ઍક્સેસિબિલિટી','सुलभता'],
['Search','શોધો','खोजें'],['Submit','સબમિટ કરો','सबमिट करें'],['Send message','સંદેશ મોકલો','संदेश भेजें'],['Download','ડાઉનલોડ','डाउनलोड'],['View guide','માર્ગદર્શિકા જુઓ','गाइड देखें'],['Register','નોંધણી','पंजीकरण'],['District Units','જિલ્લા એકમો','ज़िला इकाइयाँ'],['Clubs','ક્લબ','क्लब'],['Coaches','કોચ','कोच'],['Referees','રેફરી','रेफरी'],['Athletes','ખેલાડીઓ','खिलाड़ी'],['Officials','અધિકારીઓ','अधिकारी'],['Login','લૉગિન','लॉगिन'],
['Registration fee ₹200','નોંધણી ફી ₹200','पंजीकरण शुल्क ₹200'],['Free registration','મફત નોંધણી','निःशुल्क पंजीकरण'],['Verify','ચકાસો','सत्यापित करें'],['Renew now','હમણાં રિન્યૂ કરો','अभी नवीनीकरण करें']
];
const MAP={gu:new Map(),hi:new Map()};T.forEach(([e,g,h])=>{MAP.gu.set(e,g);MAP.hi.set(e,h)});
const orig=new WeakMap();let cur='en',obs=null,busy=false;
const SKIP='script,style,svg,textarea,input,select,code,#parry .pc-log,.pov,[data-noi18n]';
function walk(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const e=n.parentElement;return !e||e.closest(SKIP)?2:1}});let n;const L=[];while(n=w.nextNode())L.push(n);
  L.forEach(n=>{const o=orig.has(n)?orig.get(n):n.textContent;const k=o.trim().replace(/\s+/g,' ');if(!k)return;
    if(cur==='en'){if(orig.has(n)&&n.textContent!==o)n.textContent=o;return}
    let tr=MAP[cur].get(k);if(!tr&&/^🌐/.test(k))tr='🌐 '+({gu:'ભાષા પસંદ કરો',hi:'भाषा चुनें'}[cur])+' ▾';
    if(tr){if(!orig.has(n))orig.set(n,o);const lead=o.match(/^\s*/)[0],tail=o.match(/\s*$/)[0];if(n.textContent!==lead+tr+tail)n.textContent=lead+tr+tail}});
  ['placeholder','aria-label','title'].forEach(a=>root.querySelectorAll&&root.querySelectorAll(`[${a}]`).forEach(el=>{const key='data-i18n-'+a;const o=el.getAttribute(key)||el.getAttribute(a);const tr=cur!=='en'&&MAP[cur].get(o);if(tr){el.setAttribute(key,o);el.setAttribute(a,tr)}else if(el.hasAttribute(key)&&cur==='en'){el.setAttribute(a,el.getAttribute(key))}}))}
function apply(c){cur=c;document.documentElement.lang=c==='en'?'en':c;busy=true;walk(document.body);busy=false;
  if(!obs){obs=new MutationObserver(ms=>{if(busy||cur==='en')return;busy=true;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)walk(n);else if(n.nodeType===3&&n.parentElement)walk(n.parentElement)}));busy=false});obs.observe(document.body,{childList:true,subtree:true})}
  try{localStorage.setItem('afags_lang',c)}catch(e){}}
return {apply,get:()=>cur,count:T.length}})();

/* ===== AFAGS shared content store (website + admin CMS) ===== */
(function(){
const S=1; /* sample flag */
const DEF={
 news:[
  {id:'n1',date:'2026-10-12',cat:'Achievement',title:'Gujarat Fencers Shine at Senior National Championship',summary:'Team Gujarat returned with medals across foil, épée and sabre at the Senior National Fencing Championship.',body:'Team Gujarat delivered one of its best performances at the Senior National Fencing Championship, finishing on the podium in all three weapons.\n\nAFAGS congratulates the fencers, coaches and district units whose work made this possible, and thanks the officials who supported the team throughout the competition.',img:'dom:news0',sample:S},
  {id:'n2',date:'2026-10-08',cat:'Announcement',title:'AFAGS Announces State Training Camp',summary:'A residential training camp for selected cadet and junior fencers will be held ahead of the national circuit.',body:'AFAGS will conduct a State Training Camp for selected cadet (U-17) and junior (U-20) fencers. Selected fencers will be informed through their district units.\n\nThe camp will focus on footwork, bout tactics, fitness and refereeing awareness.',img:'dom:news1',sample:S},
  {id:'n3',date:'2026-10-02',cat:'Announcement',title:'Selection Trials for National Camp Announced',summary:'Selection trials for U-17 and U-20 fencers will be held in Rajkot on 5–6 December.',body:'Selection trials for the U-17 and U-20 categories will be held in Rajkot. Fencers must hold a valid AFAGS ID to participate. Entries are accepted through district units.',img:'dom:news2',sample:S},
  {id:'n4',date:'2026-09-28',cat:'Press Release',title:'AFAGS Coach Education Program – Level 1',summary:'Registrations are open for the Level 1 coaching course for aspiring fencing coaches in Gujarat.',body:'The Level 1 coaching course introduces aspiring coaches to fencing fundamentals, safety, lesson planning and the basics of all three weapons. Registered coaches receive an AFAGS course certificate on completion.',img:'dom:news3',sample:S}],
 circulars:[
  {id:'c1',no:'AFAGS/CIR/2026/14',date:'2026-10-20',cat:'Competition',title:'Gujarat State Fencing Championship 2026 — Entry Circular',sample:S},
  {id:'c2',no:'AFAGS/CIR/2026/13',date:'2026-10-05',cat:'Selection',title:'U-17 & U-20 Selection Trials — Eligibility and Schedule',sample:S},
  {id:'c3',no:'AFAGS/CIR/2026/12',date:'2026-09-18',cat:'Administration',title:'Annual Registration of Fencers for Season 2026–27',sample:S},
  {id:'c4',no:'AFAGS/CIR/2026/11',date:'2026-09-02',cat:'Coaching',title:'Level 1 Coach Education Course — Registrations Open',sample:S},
  {id:'c5',no:'AFAGS/CIR/2026/10',date:'2026-08-20',cat:'General',title:'District Unit Affiliation Renewal — Documents Required',sample:S}],
 tenders:[
  {id:'t1',ref:'AFAGS/TEN/2026/03',title:'Supply of Electric Scoring Apparatus (10 sets)',published:'2026-10-15',lastDate:'2026-11-20',sample:S},
  {id:'t2',ref:'AFAGS/EOI/2026/02',title:'Expression of Interest — Event Management for State Championship',published:'2026-09-25',lastDate:'2026-10-25',sample:S},
  {id:'t3',ref:'AFAGS/TEN/2026/01',title:'Fencing Equipment for State Training Camp',published:'2026-06-10',lastDate:'2026-07-05',sample:S}],
 docs:[
  {id:'d1',cat:'Constitution',title:'Constitution of the Amateur Fencing Association of Gujarat State',year:'2024',sample:S},
  {id:'d2',cat:'Policy',title:'Selection Policy for State Teams',year:'2026',sample:S},
  {id:'d3',cat:'Policy',title:'Safeguarding & Athlete Welfare Policy',year:'2026',sample:S},
  {id:'d4',cat:'Policy',title:'Code of Conduct for Fencers, Coaches & Officials',year:'2026',sample:S},
  {id:'d5',cat:'Annual Report',title:'Annual Report 2025–26',year:'2026',sample:S},
  {id:'d6',cat:'Finance',title:'Audited Statement of Accounts 2025–26',year:'2026',sample:S},
  {id:'d7',cat:'Election',title:'Election of Office Bearers — Notification & Results',year:'2025',sample:S},
  {id:'d8',cat:'Compliance',title:'Affiliation & Recognition Compliance Status',year:'2026',sample:S}],
 events:[
  {id:'e1',title:'Gujarat State Fencing Championship 2026',start:'2026-11-15',end:'2026-11-16',venue:'Gandhinagar',level:'State',weapons:'Foil, Épée, Sabre',cats:'U-10 to Senior',regOpen:'Yes',sample:S},
  {id:'e2',title:'AFAGS U-17 & U-20 Selection Trials',start:'2026-12-05',end:'2026-12-06',venue:'Rajkot',level:'State',weapons:'Foil, Épée, Sabre',cats:'U-17, U-20',regOpen:'Yes',sample:S},
  {id:'e3',title:'Inter-District Fencing Tournament',start:'2027-01-02',end:'2027-01-03',venue:'Surat',level:'District',weapons:'Foil, Épée, Sabre',cats:'U-12, U-14, U-17',regOpen:'No',sample:S},
  {id:'e4',title:'National Cadet Circuit (West Zone)',start:'2027-02-06',end:'2027-02-07',venue:'Ahmedabad',level:'National',weapons:'Foil, Épée, Sabre',cats:'U-17',regOpen:'No',sample:S},
  {id:'e5',title:'Senior National Fencing Championship',start:'2026-12-20',end:'2026-12-24',venue:'As notified by FAI',level:'National',weapons:'Foil, Épée, Sabre',cats:'Senior',regOpen:'No',sample:S},
  {id:'e6',title:'ASMITA Women’s Fencing League — Gujarat Leg',start:'2027-01-18',end:'2027-01-19',venue:'Vadodara',level:'ASMITA',weapons:'Foil, Épée, Sabre',cats:'Women — U-14, U-17',regOpen:'No',sample:S},
  {id:'e7',title:'Asian Cadet & Junior Fencing Championships',start:'2027-02-25',end:'2027-03-06',venue:'As notified by FAI',level:'International',weapons:'Foil, Épée, Sabre',cats:'U-17, U-20',regOpen:'No',sample:S}],
 results:[
  {id:'r1',event:'Gujarat State Fencing Championship 2025',date:'2025-11-16',level:'State',weapon:'Épée',category:'Senior Men',gold:'Fencer A (Ahmedabad)',silver:'Fencer B (Surat)',bronze1:'Fencer H (Bhavnagar)',bronze2:'Fencer I (Vadodara)',sample:S},
  {id:'r2',event:'Gujarat State Fencing Championship 2025',date:'2025-11-16',level:'State',weapon:'Foil',category:'Senior Men',gold:'Fencer C (Vadodara)',silver:'Fencer D (Ahmedabad)',bronze1:'Fencer E (Rajkot)',bronze2:'Fencer F (Surat)',sample:S},
  {id:'r3',event:'Gujarat State Fencing Championship 2025',date:'2025-11-16',level:'State',weapon:'Sabre',category:'Senior Men',gold:'Fencer K (Gandhinagar)',silver:'Fencer L (Ahmedabad)',bronze1:'Fencer M (Surat)',bronze2:'Fencer N (Jamnagar)',sample:S},
  {id:'r4',event:'Senior National Fencing Championship 2025',date:'2025-12-22',level:'National',weapon:'Épée',category:'Senior Men',gold:'—',silver:'—',bronze1:'Fencer A (Gujarat)',bronze2:'—',sample:S},
  {id:'r5',event:'Asian Cadet Circuit 2026',date:'2026-03-14',level:'International',weapon:'Sabre',category:'Cadet Men',gold:'—',silver:'—',bronze1:'Fencer K (India)',bronze2:'—',sample:S}],
 disciplines:[],
 fencers:[
  {id:'f1',name:'Fencer A',weapon:'Épée',category:'U-20 · Junior',district:'Ahmedabad',rank:'#1',points:'1,250',medals:'6',photo:'dom:epee',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f2',name:'Fencer C',weapon:'Foil',category:'Senior',district:'Vadodara',rank:'#1',points:'1,180',medals:'5',photo:'dom:foil',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f3',name:'Fencer K',weapon:'Sabre',category:'U-17 · Cadet',district:'Gandhinagar',rank:'#1',points:'1,210',medals:'7',photo:'dom:sabre',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f4',name:'Fencer B',weapon:'Épée',category:'Senior',district:'Surat',rank:'#2',points:'1,190',medals:'4',photo:'dom:epee',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f5',name:'Fencer D',weapon:'Foil',category:'U-14 · Sub-Junior',district:'Ahmedabad',rank:'#2',points:'1,105',medals:'3',photo:'dom:foil',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f6',name:'Fencer L',weapon:'Sabre',category:'U-20 · Junior',district:'Rajkot',rank:'#2',points:'1,120',medals:'4',photo:'dom:sabre',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f7',name:'Fencer E',weapon:'Foil',category:'U-17 · Cadet',district:'Rajkot',rank:'#3',points:'990',medals:'2',photo:'dom:foil',show:'Yes',achievements:'',bio:'',sample:S},
  {id:'f8',name:'Fencer M',weapon:'Sabre',category:'Open',district:'Surat',rank:'#3',points:'1,040',medals:'3',photo:'dom:sabre',show:'Yes',achievements:'',bio:'',sample:S}],
 achievers:[
  {id:'a1',name:'Fencer A',achievement:'Bronze — Senior National Fencing Championship',year:'2025',level:'National',weapon:'Épée',photo:'dom:epee',sample:S},
  {id:'a2',name:'Fencer K',achievement:'Bronze — Asian Cadet Circuit',year:'2026',level:'International',weapon:'Sabre',photo:'dom:sabre',sample:S},
  {id:'a3',name:'Fencer C',achievement:'Gold — Gujarat State Championship (Senior Foil)',year:'2025',level:'State',weapon:'Foil',photo:'dom:foil',sample:S}],
 gallery:[
  {id:'g1',album:'Gujarat State Championship',caption:'Bout in progress',date:'2025-11-16',image:'dom:hero',sample:S},
  {id:'g2',album:'Gujarat State Championship',caption:'Épée fencer',date:'2025-11-16',image:'dom:epee',sample:S},
  {id:'g3',album:'Gujarat State Championship',caption:'Foil fencer',date:'2025-11-16',image:'dom:foil',sample:S},
  {id:'g4',album:'Gujarat State Championship',caption:'Sabre fencer',date:'2025-11-16',image:'dom:sabre',sample:S},
  {id:'g5',album:'Khelo India Youth Games 2025',caption:'Bharatji Thakor, Competition Manager',date:'2025-05-10',image:'dom:kiyg',sample:S}],
 videos:[],
 voices:[
  {id:'vc1',name:'Fencer A',role:'Fencer',district:'Surat',place:'Surat',rating:'5',quote:'I picked up a foil at a school demo and now I train every evening. The district camp coaches made me believe I can fence for Gujarat.',status:'Published',sample:S},
  {id:'vc2',name:'Fencer B',role:'Fencer',district:'Ahmedabad',place:'Patiala (NIS)',rating:'5',quote:'The national camp at Patiala was tough, but AFAGS prepared us well — fitness, footwork and a lot of bouts.',status:'Published',sample:S},
  {id:'vc3',name:'Parent C',role:'Parent / Guardian',district:'Vadodara',place:'Vadodara',rating:'4',quote:'Online registration and the digital ID card saved us many trips. My daughter loves her sabre classes.',status:'Published',sample:S},
  {id:'vc4',name:'Coach D',role:'Coach',district:'Rajkot',place:'New Delhi',rating:'5',quote:'Our Saurashtra fencers held their own at the Senior Nationals in Delhi. Proud of how far the sport has come in Gujarat.',status:'Published',sample:S},
  {id:'vc5',name:'Fencer E',role:'Fencer',district:'Gandhinagar',place:'Tashkent',rating:'5',quote:'Competing abroad for the first time was a dream. The live scores on the AFAGS site let my family follow every bout.',status:'Published',sample:S},
  {id:'vc6',name:'Referee F',role:'Referee / Official',district:'Bhavnagar',place:'Bhubaneswar',rating:'4',quote:'The referee clinic gave me the confidence to officiate at national level. Clear rules, good mentors.',status:'Published',sample:S},
  {id:'vc7',name:'Fencer G',role:'Fencer',district:'Kutch',place:'Kutch (Bhuj)',rating:'5',quote:'Fencing reached Kutch and now there is a club ten minutes from my school. Épée is my favourite!',status:'Published',sample:S},
  {id:'vc8',name:'Fencer H',role:'Fencer',district:'Surat',place:'Dubai',rating:'4',quote:'An international open in Dubai taught me more in three days than a month of training. Thank you AFAGS for the support.',status:'Published',sample:S}],
 careers:[
  {id:'j1',title:'Fencing Coach (Contract) — District Training Centre',loc:'Ahmedabad',type:'Contract',lastDate:'2026-11-30',desc:'NIS-certified fencing coach to run daily sessions for U-12 to U-17 fencers. Experience with electric scoring preferred.',sample:S},
  {id:'j2',title:'Office Assistant (Part-time)',loc:'Gandhinagar',type:'Part-time',lastDate:'2026-11-15',desc:'Support member registrations, documents and event logistics. Good knowledge of Gujarati, Hindi and English required.',sample:S},
  {id:'j3',title:'Volunteer — Gujarat State Championship 2026',loc:'Gandhinagar',type:'Volunteer',lastDate:'2026-11-10',desc:'Help with accreditation desk, piste management and results display during the championship.',sample:S}]
};
const SITE={siteUrl:'',address:'',email:'info@afagujarat.org',phone:'',eventsYear:'',medals:'',years:'',hours:'Mon – Sat: 10:00 AM – 6:00 PM',facebook:'',instagram:'',x:'',youtube:'',faiLogo:''};
const SCHEMA={
 news:{label:'News',fields:[['title','Title','text',1],['date','Date','date',1],['cat','Category','select',1,['News','Achievement','Announcement','Press Release','Result']],['summary','Summary','textarea',1],['body','Full story','textarea',0],['img','Main photo','image',0],['img2','Photo 2 (album)','image',0],['img3','Photo 3 (album)','image',0],['img4','Photo 4 (album)','image',0],['video','YouTube video link','url',0],['file','Attachment (PDF)','file',0],['status','Status','select',1,['Published','Draft','Pending approval']],['publishAt','Publish on (leave empty = now)','datetime',0],['pin','Pin to top','select',0,['No','Yes']],['breaking','Breaking news (show in ticker)','select',0,['No','Yes']]]},
 circulars:{label:'Circulars',fields:[['no','Circular number','text',1],['title','Title','text',1],['date','Date','date',1],['cat','Category','select',1,['Competition','Selection','Administration','Coaching','General']],['file','Attachment (PDF/image)','file',0]]},
 tenders:{label:'Tenders / EOI',fields:[['ref','Reference','text',1],['title','Title','text',1],['published','Published on','date',1],['lastDate','Last date','date',1],['file','Document (PDF)','file',0]]},
 docs:{label:'Documents & Records',fields:[['title','Title','text',1],['cat','Category','select',1,['Constitution','Policy','Annual Report','Finance','Election','Compliance']],['year','Year','text',0],['file','Document (PDF)','file',0]]},
 events:{label:'Calendar Events',fields:[['title','Event name','text',1],['start','Start date','date',1],['end','End date','date',0],['venue','Venue','text',1],['level','Level','select',1,['District','State','National','International','ASMITA']],['weapons','Weapons','text',0],['cats','Categories','text',0],['regOpen','Registration open','select',1,['Yes','No']],['regClose','Entries close on','date',0],['fee','Entry fee per weapon (₹, 0 = free)','text',0],['stream','YouTube live stream link','url',0],['album','Photo album link (Google Photos / Drive)','text',0]]},
 results:{label:'Results',fields:[['event','Event','text',1],['date','Date','date',1],['level','Level','select',1,['State','National','International']],['weapon','Weapon','select',1,['Foil','Épée','Sabre']],['category','Category','text',1],['gold','Gold','text',1],['silver','Silver','text',0],['bronze1','Bronze','text',0],['bronze2','Bronze','text',0]]},
 disciplines:{label:'Discipline photos',fields:[['weapon','Weapon','select',1,['Foil','Épée','Sabre']],['photo','Fencer photo holding this weapon (cut-out PNG best)','image',1],['caption','Caption / alt text','text',0]]},
 fencers:{label:'Our Fencers',fields:[['name','Fencer name','text',1],['photo','Photo (action / cut-out photo works best)','image',0],['weapon','Weapon','select',1,['Foil','Épée','Sabre']],['category','Age category','select',1,['U-10 · Sub-Junior','U-12 · Sub-Junior','U-14 · Sub-Junior','U-17 · Cadet','U-20 · Junior','Senior','Open']],['district','District','select',1,['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad']],['afagsId','AFAGS ID','text',0],['rank','State rank (e.g. #1)','text',0],['points','Ranking points','text',0],['medals','Medals','text',0],['club','Club / academy','text',0],['coach','Coach','text',0],['achievements','Key achievements (one per line)','textarea',0],['bio','Short bio','textarea',0],['order','Display order (1 = first)','text',0],['show','Show on home page','select',1,['Yes','No']]]},
 achievers:{label:'Achievers',fields:[['name','Name','text',1],['achievement','Achievement','text',1],['year','Year','text',1],['level','Level','select',1,['State','National','International']],['weapon','Weapon','select',0,['Foil','Épée','Sabre']],['photo','Photo','image',0]]},
 gallery:{label:'Photo Gallery',fields:[['album','Album','text',1],['caption','Caption','text',0],['date','Date','date',0],['image','Photo','image',1]]},
 videos:{label:'Video Gallery',fields:[['title','Title','text',1],['url','YouTube link','url',1],['date','Date','date',0]]},
 voices:{label:'Voices (feedback globe)',fields:[['name','Name (as it should appear)','text',1],['role','Role','select',1,['Fencer','Parent / Guardian','Coach','Referee / Official','Club','Volunteer','Fan']],['district','Home district','text',0],['place','Pin location (where they train / competed)','select',1,["Ahmedabad", "Amreli", "Anand", "Aravalli (Modasa)", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang (Ahwa)", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath (Veraval)", "Jamnagar", "Junagadh", "Kheda (Nadiad)", "Kutch (Bhuj)", "Mahisagar (Lunawada)", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad", "New Delhi", "Patiala (NIS)", "Mumbai", "Pune", "Aurangabad", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Bhubaneswar", "Guwahati", "Thiruvananthapuram", "Lucknow", "Jaipur", "Bhopal", "Imphal", "Panaji (Goa)", "Tashkent", "Bangkok", "Kuala Lumpur", "Singapore", "Dubai", "Doha", "Kathmandu", "Colombo", "Dhaka", "Seoul", "Tokyo", "Shanghai", "Hangzhou", "Paris", "Budapest", "Plovdiv", "Milan", "London", "Lausanne", "Cairo", "New York", "Melbourne"]],['quote','Feedback (1–3 sentences)','textarea',1],['rating','Rating','select',0,['5','4','3','2','1']],['photo','Photo (square, optional)','image',0],['status','Show on globe','select',1,['Published','Hidden']],['lat','Custom latitude (optional)','text',0],['lng','Custom longitude (optional)','text',0]]},
 careers:{label:'Careers',fields:[['title','Position','text',1],['loc','Location','text',1],['type','Type','select',1,['Full-time','Contract','Part-time','Volunteer']],['lastDate','Last date to apply','date',1],['desc','Description','textarea',0]]}
};
const LSG=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function newsVisible(n){if(!n)return false;if(n.status&&n.status!=='Published')return false;if(n.publishAt){const t=Date.parse(n.publishAt);if(t&&t>Date.now())return false}return true}
window.AFAGS_CMS={DEF,SITE,SCHEMA,
 get(c){const v=LSG('afags_cms_'+c,null);let L=Array.isArray(v)?v:JSON.parse(JSON.stringify(DEF[c]||[]));if(c==='news'&&!window.AFAGS_ADMIN)L=L.filter(newsVisible).sort((a,b)=>(b.pin==='Yes')-(a.pin==='Yes')||String(b.date||'').localeCompare(String(a.date||'')));return L},
 newsVisible(n){return newsVisible(n)},
 isCustom(c){return LSG('afags_cms_'+c,null)!==null},
 set(c,arr){const ok=LSS('afags_cms_'+c,arr);try{parent!==window&&parent.postMessage({afags:'cms',c},'*')}catch(e){}return ok},
 reset(c){try{localStorage.removeItem('afags_cms_'+c)}catch(e){}try{parent!==window&&parent.postMessage({afags:'cms',c},'*')}catch(e){}},
 site(){return Object.assign({},SITE,LSG('afags_site',{}))},
 setSite(o){const ok=LSS('afags_site',o);try{parent!==window&&parent.postMessage({afags:'cms',c:'site'},'*')}catch(e){}return ok},
 inbox(){return LSG('afags_inbox',[])},
 addInbox(m){const a=LSG('afags_inbox',[]);a.unshift(m);if(!LSS('afags_inbox',a)){m.file&&(m.file={name:m.file.name,size:m.file.size});a[0]=m;LSS('afags_inbox',a)}},
 setInbox(a){LSS('afags_inbox',a)},
 theme(which){return LSG('afags_theme_'+which,'liquid')},
 setTheme(which,t){LSS('afags_theme_'+which,t);try{parent!==window&&parent.postMessage({afags:'theme',which,t},'*')}catch(e){}},
 audit(a,d){const L=LSG('afags_audit',[]);L.unshift({at:Date.now(),a,d:String(d||'').slice(0,200),who:(function(){try{return JSON.parse(sessionStorage.getItem('afags_session')||'{}').user||'website'}catch(e){return 'website'}})()});LSS('afags_audit',L.slice(0,500))},
 auditLog(){return LSG('afags_audit',[])}
};
})();
