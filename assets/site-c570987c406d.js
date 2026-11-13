/* ===== AFAGS website v3: navigation, inner pages, search, forms, CMS, themes ===== */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const C=window.AFAGS_CMS;
const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const D=s=>{if(!s)return null;const [y,m,d]=String(s).split('-').map(Number);return y&&m&&d?new Date(y,m-1,d):null};
const fmtD=s=>{const d=D(s);return d?`${String(d.getDate()).padStart(2,'0')} ${MON[d.getMonth()]} ${d.getFullYear()}`:esc(s||'—')};
const range=(a,b)=>{const x=D(a),y=D(b);if(!x)return '—';if(!y||+x===+y)return fmtD(a);if(x.getMonth()===y.getMonth()&&x.getFullYear()===y.getFullYear())return `${String(x.getDate()).padStart(2,'0')}–${String(y.getDate()).padStart(2,'0')} ${MON[x.getMonth()]} ${x.getFullYear()}`;return fmtD(a)+' – '+fmtD(b)};
const today=()=>{const t=new Date();return new Date(t.getFullYear(),t.getMonth(),t.getDate())};
const toast=t=>{let e=$('#v3toast');if(!e){e=document.createElement('div');e.id='v3toast';e.setAttribute('role','status');e.setAttribute('aria-live','polite');document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2800)};
window.AFAGS_TOAST=toast;

/* ---------- images that already live inside the page ---------- */
const DOMIMG={};const bgUrl=s=>{const m=/url\(["']?(.*?)["']?\)/.exec(s||'');return m?m[1]:''};
function domImg(k){if(DOMIMG[k])return DOMIMG[k];let u='';try{
  if(/^news\d$/.test(k)){const el=$$('#news .timg i')[+k.slice(4)];u=el?bgUrl(el.style.backgroundImage||getComputedStyle(el).backgroundImage):''}
  else if(k==='hero'){const el=$('.bgL');u=el?bgUrl(getComputedStyle(el).backgroundImage):''}
  else if(['foil','epee','sabre'].includes(k)){const el=$$('.dc .dphoto img')[['foil','epee','sabre'].indexOf(k)];u=el?el.src:''}
  else if(k==='kiyg'){const el=$('.sp-ph');u=el?bgUrl(el.style.backgroundImage||getComputedStyle(el).backgroundImage):''}}catch(e){}return DOMIMG[k]=u}
const imgSrc=v=>!v?'':String(v).startsWith('dom:')?domImg(v.slice(4)):/^(data:image\/|\/?uploads\/|https:\/\/)/.test(String(v))?String(v):'';

/* ---------- members accredited through the portal ---------- */
function members(key){const apps=LS('afags_apps',[]),dec=LS('afags_dec',{}),ids=LS('afags_ids',{});
  return apps.filter(a=>a.key===key&&dec[a.ref]==='Approved').map(a=>({name:a.name,district:a.district,weapon:a.weapon,cat:a.cat,id:ids[a.ref]||'',photo:((a.files||{}).photo||(a.files||{}).logo||{}).thumb||'',V:a.V||{},type:a.type,real:1}))}
function sampleFencers(){return $$('#fzGrid .fz').map(c=>{const sm=(c.querySelector('.fz-b small')||{}).textContent||'';const [district,cat]=sm.split('·').map(x=>x.trim());
  return {name:(c.querySelector('.fz-b h3')||{}).textContent||'',district:district||'',cat:cat||'',weapon:(c.querySelector('.fz-w')||{}).textContent||'',id:'',photo:(c.querySelector('.fz-img')||{}).src||'',rank:(c.querySelector('.fz-rank')||{}).textContent||'',sample:1}})}

/* ---------- navigation structure (mirrors fencingindia.org) ---------- */
const NAV=[
 {k:'home',l:'Home'},
 {k:'about',l:'About Us',mega:1,items:[['afags','About AFAGS'],['constitution','Constitution and Policies'],['bearers','Office Bearers & EC'],['committees','Committees / Commissions'],['members','Members (District Units)'],['rti','RTI / Grievance Authority'],['circulars','Circulars'],['tenders','Tenders / EOI'],
   {g:'Records',items:[['records','Annual Reports'],['records/finance','Finances'],['records/election','Elections'],['records/compliance','Compliance']]},['legal','Legal / Arbitration / Disciplinary'],['donate','Donate']]},
 {k:'calendar',l:'Calendar',items:[['all','Fencing Calendar'],['state','State Championships'],['national','National Championships'],['international','International Competitions'],['asmita','ASMITA Calendar']]},
 {k:'results',l:'Results',items:[['state','State Championships'],['national','National Championships'],['international','International Competitions'],['rankings','State Rankings']]},
 {k:'fencers',l:'Fencers',items:[['profiles','Fencers Profile'],['achievers','Achievers'],['guidelines','Registration Guidelines']]},
 {k:'sport',l:'Sport',items:[['fencing','Fencing'],['rules','Rules'],['antidoping','Anti Doping'],['coaches','Coaches Profile'],['referees','Referees and TOs Profile'],['academies','Academies / Clubs Profile']]},
 {k:'media',l:'Media',items:[['news','News / Press Releases'],['career','Career'],['photos','Photo Gallery'],['videos','Video Gallery']]},
 {k:'contact',l:'Contact Us',items:[['us','Contact Us'],['faq','Help & FAQ']]}];
const TITLES={};NAV.forEach(n=>(n.items||[]).forEach(i=>{if(i.g)i.items.forEach(j=>TITLES[n.k+'/'+j[0]]=[n.l,j[1]]);else TITLES[n.k+'/'+i[0]]=[n.l,i[1]]}));
Object.assign(TITLES,{'accessibility':['Help','Screen Reader & Accessibility'],'privacy':['Legal','Privacy Policy'],'terms':['Legal','Terms of Use'],'sitemap':['Help','Sitemap']});
function buildNav(){const ul=$('#mn');if(!ul)return;
  ul.innerHTML=NAV.map(n=>{if(!n.items)return `<li><a href="#/" data-top="home" class="on">${n.l}</a></li>`;
    const link=i=>`<a href="#/${n.k}/${i[0]}">${esc(i[1])}</a>`;
    return `<li class="dd" data-top="${n.k}"><button type="button" class="ddt" aria-expanded="false" aria-haspopup="true">${n.l}<i aria-hidden="true">▾</i></button><div class="ddm${n.mega?' mega':''}" role="menu">${n.items.map(i=>i.g?`<div class="ddg"><span>${i.g}</span>${i.items.map(link).join('')}</div>`:link(i)).join('')}</div></li>`}).join('');
  ul.querySelectorAll('.ddt').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const li=b.parentNode,open=!li.classList.contains('open');ul.querySelectorAll('li.dd.open').forEach(x=>{x.classList.remove('open');x.querySelector('.ddt').setAttribute('aria-expanded','false')});if(open){li.classList.add('open');b.setAttribute('aria-expanded','true')}}));
  ul.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ul.classList.remove('op');$('#bg')&&$('#bg').classList.remove('x');ul.querySelectorAll('li.dd.open').forEach(x=>x.classList.remove('open'))}));
  document.addEventListener('click',e=>{if(!e.target.closest('#mn'))ul.querySelectorAll('li.dd.open').forEach(x=>{x.classList.remove('open');x.querySelector('.ddt').setAttribute('aria-expanded','false')})});
  ul.addEventListener('keydown',e=>{if(e.key==='Escape'){const li=e.target.closest('li.dd');li&&(li.classList.remove('open'),li.querySelector('.ddt').focus())}})}
function setActive(top){$$('#mn > li').forEach(li=>{const t=li.dataset.top||(li.querySelector('a')||{}).dataset?.top;const on=t===top;li.classList.toggle('on',on);const a=li.querySelector(':scope>a,:scope>.ddt');a&&a.classList.toggle('on',on)})}

/* ---------- small UI helpers ---------- */
const sampleNote=c=>!C.isCustom(c)&&C.get(c).some(x=>x.sample)?`<div class="v3-sample">ℹ️ Sample content — the AFAGS admin can replace it from <b>Member Login › Website CMS</b>.</div>`:'';
const empty=(msg,cta='')=>`<div class="v3-empty"><div class="v3-empty-i">📭</div><p>${msg}</p>${cta}</div>`;
const chip=(t,c='')=>`<span class="v3-chip ${c}">${esc(t)}</span>`;
const LV={District:'c-teal',State:'c-saffron',National:'c-navy',International:'c-purple',ASMITA:'c-pink'};
function fileBtns(it,label){if(it.file&&it.file.data){return `<button type="button" class="v3-btn sm" data-file="${esc(it.id)}">View</button><button type="button" class="v3-btn sm ghost" data-dl="${esc(it.id)}">Download</button>`}
  return `<a class="v3-btn sm ghost" href="#/contact/us?subject=${encodeURIComponent('Request copy: '+(label||it.title))}">Request copy</a>`}
const FILEMAP={};
function regFiles(list){list.forEach(it=>{if(it.file&&it.file.data)FILEMAP[it.id]=it.file})}
function dataToBlobUrl(data){if(data&&!String(data).startsWith('data:'))return String(data);try{const [h,b]=data.split(',');const mime=(/data:([^;]+)/.exec(h)||[])[1]||'application/octet-stream';const bin=atob(b);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return URL.createObjectURL(new Blob([u],{type:mime}))}catch(e){return ''}}
function openFile(f,download){const url=dataToBlobUrl(f.data);if(!url){toast('This file could not be opened');return}
  if(download){const a=document.createElement('a');a.href=url;a.download=f.name||'document';document.body.appendChild(a);a.click();a.remove();return}
  const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}
document.addEventListener('click',e=>{const v=e.target.closest('[data-file],[data-dl]');if(!v)return;const id=v.dataset.file||v.dataset.dl,f=FILEMAP[id];if(f)openFile(f,!!v.dataset.dl)});

/* ---------- registration guides (PDF) ---------- */
const GUIDE_META={fencer:['Fencer','#007AFF','₹200','Fencer'],coach:['Coach','#F47B20','Free','Coach'],referee:['Referee & Technical Official','#28B44A','Free','Referee & Technical Official'],club:['Club / Academy','#AF52DE','Free','Club'],district:['District Unit','#1E9FB8','Free','District Unit']};
/* guides uploaded by the admin (Portal › Settings) win over the built-in ones: on the server → uploads/…pdf, in demo mode → this browser's file store */
const IDBF=(mode,fn)=>new Promise((res,rej)=>{try{const o=indexedDB.open('afags_files',1);o.onupgradeneeded=()=>o.result.createObjectStore('f');o.onerror=()=>rej(o.error);o.onsuccess=()=>{const tx=o.result.transaction('f',mode);const r=fn(tx.objectStore('f'));tx.oncomplete=()=>res(r&&r.result);tx.onerror=()=>rej(tx.error)}}catch(e){rej(e)}});
window.AFAGS_IDBF=IDBF;
function guide(k,dl){const cg=(LS('afags_cms_guides',{})||{})[k],nm=`AFAGS-${GUIDE_META[k][0].replace(/[^A-Za-z]+/g,'-')}-Registration-Guide.pdf`;
  if(cg&&cg.src){if(/^idb:/.test(cg.src)){IDBF('readonly',st=>st.get(cg.src.slice(4))).then(b=>{if(!b)throw 0;const u=URL.createObjectURL(b);openFile({data:u,name:cg.name||nm},dl)}).catch(()=>toast('This guide is stored on the admin\'s computer only — open the website from the AFAGS server'));return}
    if(/^(uploads\/[a-f0-9]{32}\.pdf|https:\/\/)/.test(cg.src)){openFile({data:cg.src,name:cg.name||nm},dl);return}}
  const g=(window.AFAGS_GUIDES||{})[k];if(!g){toast('Guide not available');return}openFile({data:String(g).startsWith('url:')?String(g).slice(4):'data:application/pdf;base64,'+g,name:`AFAGS-${GUIDE_META[k][0].replace(/[^A-Za-z]+/g,'-')}-Registration-Guide.pdf`},dl)}
window.AFAGS_GUIDE=guide;
document.addEventListener('click',e=>{const b=e.target.closest('[data-guide]');if(!b)return;e.preventDefault();guide(b.dataset.guide,b.dataset.mode==='dl')});

/* ---------- open the member portal, optionally straight into a registration form ---------- */
function openPortal(regType){try{regType?sessionStorage.setItem('afags_openreg',regType):sessionStorage.removeItem('afags_openreg')}catch(e){}
  const a=document.createElement('a');a.href='afags-portal.html';a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  if(regType){let n=0;const t=setInterval(()=>{const f=$('.pov iframe');if(f&&f.contentWindow){try{f.contentWindow.postMessage({afags:'openReg'},'*')}catch(e){}}if(++n>12)clearInterval(t)},350)}}
window.AFAGS_OPENPORTAL=openPortal;addEventListener('hashchange',()=>{if(location.hash==='#member-login')openPortal()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-reg-open]');if(!b)return;e.preventDefault();openPortal(b.dataset.regOpen)});

/* ---------- forms: validation, honeypot, rate limit, inbox ---------- */
const RX={email:/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/,phone:/^[6-9]\d{9}$/,name:/^[A-Za-z઀-૿ऀ-ॿ][A-Za-z઀-૿ऀ-ॿ .'-]{1,59}$/};
const clean=s=>String(s||'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim().slice(0,2000);
function rateOk(){const now=Date.now(),L=LS('afags_form_rl',[]).filter(t=>now-t<600000);if(L.length>=5)return false;L.push(now);LSS('afags_form_rl',L);return true}
function sniff(file){return file.slice(0,8).arrayBuffer().then(b=>{const u=new Uint8Array(b),h=[...u].map(x=>x.toString(16).padStart(2,'0')).join('');
  return h.startsWith('25504446')?'application/pdf':h.startsWith('89504e47')?'image/png':h.startsWith('ffd8ff')?'image/jpeg':''})}
function bindForm(form,type,done){form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form),msg=form.querySelector('.v3-fmsg');
  if(fd.get('website')){msg.innerHTML='<div class="v3-ok">Thank you!</div>';form.reset();return}
  let bad=[];form.querySelectorAll('[required]').forEach(i=>{const ok=i.type==='checkbox'?i.checked:clean(i.value)!=='';i.classList.toggle('bad',!ok);if(!ok)bad.push(i)});
  form.querySelectorAll('[data-rx]').forEach(i=>{if(i.value&&!RX[i.dataset.rx].test(i.value.trim())){i.classList.add('bad');bad.push(i)}});
  if(bad.length){msg.innerHTML='<div class="v3-err">Please complete the highlighted fields correctly.</div>';bad[0].focus();return}
  if(!rateOk()){msg.innerHTML='<div class="v3-err">Too many submissions from this device. Please try again in a few minutes.</div>';return}
  const rec={id:type.slice(0,3).toUpperCase()+'-'+Date.now().toString(36).toUpperCase(),type,at:Date.now(),status:'New'};
  for(const [k,v] of fd.entries()){if(k==='website'||v instanceof File)continue;rec[k]=clean(v)}
  const fi=form.querySelector('input[type=file]');
  if(fi&&fi.files[0]){const f=fi.files[0];if(f.size>2*1024*1024){msg.innerHTML='<div class="v3-err">File must be under 2 MB.</div>';return}
    const real=await sniff(f);if(!real){msg.innerHTML='<div class="v3-err">Only genuine PDF, JPG or PNG files are accepted.</div>';return}
    rec.file=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r({name:f.name,size:f.size,type:real,data:fr.result});fr.readAsDataURL(f)})}
  C.addInbox(rec);C.audit('website-form',type+' '+rec.id);form.reset();msg.innerHTML=`<div class="v3-ok">✓ Received. Your reference number is <b>${rec.id}</b>.</div>`;done&&done(rec)})}
const HP='<input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">';

/* ---------- ICS calendar export ---------- */
function ics(ev){const d=s=>s.replace(/-/g,''),nx=s=>{const x=D(s);x.setDate(x.getDate()+1);return `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}`};
  const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AFAGS//Calendar//EN','BEGIN:VEVENT',`UID:${ev.id}@afagujarat.org`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z`,`DTSTART;VALUE=DATE:${d(ev.start)}`,`DTEND;VALUE=DATE:${nx(ev.end||ev.start)}`,`SUMMARY:${ev.title.replace(/[,;]/g,' ')}`,`LOCATION:${(ev.venue||'').replace(/[,;]/g,' ')}`,`DESCRIPTION:${(ev.level||'')} event — Amateur Fencing Association of Gujarat State`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([body],{type:'text/calendar'}));a.download=ev.title.replace(/[^\w]+/g,'-')+'.ics';document.body.appendChild(a);a.click();a.remove();toast('Calendar file downloaded')}
function share(title,hash){const url=location.href.split('#')[0]+hash;if(navigator.share){navigator.share({title,url}).catch(()=>{})}else{const fb=()=>{try{const t=document.createElement('textarea');t.value=url;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();toast(ok?'Link copied':url)}catch(e){toast(url)}};try{navigator.clipboard?navigator.clipboard.writeText(url).then(()=>toast('Link copied'),fb):fb()}catch(e){fb()}}}

/* ---------- modal ---------- */
function modal(html,cls=''){const m=document.createElement('div');m.className='v3-md';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.innerHTML=`<div class="v3-mdc ${cls}"><button type="button" class="v3-x" aria-label="Close">✕</button>${html}</div>`;
  document.body.appendChild(m);document.body.classList.add('v3-lock');const prev=document.activeElement;const close=()=>{m.remove();document.body.classList.remove('v3-lock');prev&&prev.focus&&prev.focus()};
  m.querySelector('.v3-x').onclick=close;m.addEventListener('click',e=>{if(e.target===m)close()});m.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close()}});setTimeout(()=>m.querySelector('.v3-x').focus(),30);return {m,close}}

/* ===================== PAGES ===================== */
const P={};
const stats=()=>{const n=$$('#about .st .n').map(x=>x.dataset.n);return {units:n[0]||33,clubs:n[1]||60,coaches:n[2]||150,fencers:n[3]||2500}};
P['about/afags']=()=>({lead:'The governing body for the Olympic sport of fencing in Gujarat, affiliated to the Fencing Association of India.',html:`
 <div class="v3-grid2"><div class="v3-card"><h3>Who we are</h3><p>The Amateur Fencing Association of Gujarat State (AFAGS) promotes, regulates and develops fencing across Gujarat. We work with district units, clubs, coaches, referees and athletes to build a strong fencing ecosystem — from first lessons in schools to podiums at national and international championships.</p>
   <h3 style="margin-top:16px">What we do</h3><ul class="v3-ticks"><li>Register and accredit fencers, coaches, referees, clubs and district units</li><li>Conduct district and state championships and selection trials</li><li>Select and prepare Team Gujarat for national competitions</li><li>Run coach and referee education programmes</li><li>Promote clean sport, safety and fair play</li></ul></div>
  <div class="v3-card"><h3>Affiliation structure</h3><div class="v3-chain">${['Fédération Internationale d’Escrime (FIE)','Asian Fencing Confederation','Fencing Association of India (FAI)','AFAGS — Gujarat State','33 District Units','Clubs & Academies','Fencers, Coaches & Officials'].map((t,i)=>`<div class="v3-link" style="--i:${i}"><span>${i+1}</span>${t}</div>`).join('')}</div></div></div>
 <div class="v3-stats">${[['District Units',stats().units],['Affiliated Clubs',stats().clubs],['Coaches & Referees',stats().coaches],['Registered Fencers',stats().fencers]].map(([l,n])=>`<div class="v3-card"><b data-cnt="${n}">${n}</b><span>${l}</span></div>`).join('')}</div>
 <div class="v3-grid3">${[['🎯','Mission','To promote and develop fencing at all levels in Gujarat and support athletes to excel on the national and international stage.'],['👁','Vision','To build a strong fencing ecosystem and produce world-class athletes from Gujarat.'],['🏅','Values','Excellence · Integrity · Respect · Inclusivity · Fair Play']].map(([i,t,p])=>`<div class="v3-card v3-mv"><span>${i}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
 <div class="v3-cta"><a class="v3-btn" href="#/about/bearers">Meet the Office Bearers</a><a class="v3-btn ghost" href="#/about/constitution">Constitution & Policies</a></div>`});
P['about/constitution']=()=>{const L=C.get('docs').filter(d=>d.cat==='Constitution'||d.cat==='Policy');regFiles(L);return {lead:'Governing documents and policies of AFAGS.',html:sampleNote('docs')+docList(L)}};
function docList(L,showCat=true){return L.length?`<div class="v3-docs">${L.map(d=>`<div class="v3-doc"><span class="v3-di">${/pdf/.test((d.file||{}).type||'')||!d.file?'PDF':'IMG'}</span><div><b>${esc(d.title)}</b><small>${[showCat?d.cat:'',d.no,d.year,d.date?fmtD(d.date):''].filter(Boolean).map(esc).join(' · ')}</small></div><div class="v3-da">${fileBtns(d,d.title)}</div></div>`).join('')}</div>`:empty('No documents published yet.')}
P['about/bearers']=()=>{const src=$('#obp .obwrap');return {lead:'The elected executive committee of AFAGS.',html:`<div class="v3-bearers">${src?src.innerHTML:''}</div><p class="v3-note">For the national federation, see <a href="https://www.fencingindia.org/office-bearers/" target="_blank" rel="noopener noreferrer">FAI Office Bearers ↗</a>.</p>`,after(){$$('#pageView .obt').forEach(t=>t.style.opacity=1)}}};
P['about/committees']=()=>({lead:'Committees and commissions that support the work of AFAGS.',html:`<div class="v3-grid3">${[['🤺','Technical Committee','Competition formats, venues, equipment checks and technical standards for AFAGS events.'],['🏆','Selection Committee','Selects Team Gujarat for national championships using the published selection policy.'],['⚖️','Referees & Officials Commission','Training, grading and appointment of referees and technical officials.'],['🧑‍🤝‍🧑','Athletes’ Commission','Represents the voice of fencers in AFAGS decisions.'],['👩','Women in Fencing Commission','Encourages participation of girls and women at every level.'],['💊','Medical & Anti-Doping Commission','Athlete health, safety and clean-sport education with NADA guidelines.'],['📚','Coach Education Commission','Coach courses, certification and continuing education.'],['🛡','Disciplinary Committee','Hears complaints and decides disciplinary matters under the constitution.'],['📮','Grievance Redressal Committee','Receives and resolves grievances from members and the public.']].map(([i,t,p])=>`<div class="v3-card v3-mv"><span>${i}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div><p class="v3-note">Committee members are notified by AFAGS through circulars.</p>`});
P['about/members']=()=>{const D_=['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'];
  const reg=members('districts').map(m=>m.district),clubs=members('clubs');
  return {lead:'District units are the member units of AFAGS — one for each district of Gujarat.',html:`<div class="v3-bar"><input type="search" id="mSrch" placeholder="Search district…" aria-label="Search district"><span class="v3-muted">${D_.length} districts · ${reg.length} accredited online</span><button type="button" class="v3-btn sm" data-reg-open="District Unit">Register a District Unit</button></div>
   <div class="v3-dist" id="mList">${D_.map(d=>{const r=reg.includes(d),c=clubs.filter(x=>x.district===d).length;return `<div class="v3-card v3-dc" data-n="${d.toLowerCase()}"><b>${d}</b><small>${d} District Fencing Unit</small><span class="v3-chip ${r?'c-green':''}">${r?'✓ Accredited':'Affiliation via AFAGS'}</span>${c?`<small>${c} club${c>1?'s':''} registered</small>`:''}</div>`}).join('')}</div>`,
   after(){$('#mSrch').oninput=e=>{const q=e.target.value.toLowerCase();$$('#mList .v3-dc').forEach(x=>x.style.display=x.dataset.n.includes(q)?'':'none')}}}};
P['about/rti']=()=>({lead:'Ask for information or raise a grievance. Every request gets a reference number you can track.',html:`
 <div class="v3-grid2"><div class="v3-card"><h3>How it works</h3><div class="v3-steps">${[['Submit','Fill the form with your details and request.'],['Acknowledge','You get a reference number immediately.'],['Review','The Grievance Redressal Committee reviews it.'],['Reply','AFAGS replies by email, normally within 30 days.']].map(([t,p],i)=>`<div><span>${i+1}</span><b>${t}</b><p>${p}</p></div>`).join('')}</div>
   <h3 style="margin-top:18px">Track a request</h3><form id="gTrack" class="v3-inline"><input id="gRef" placeholder="e.g. GRI-M2X9Q1" aria-label="Reference number" required><button class="v3-btn sm">Track</button></form><div id="gOut"></div></div>
  <form class="v3-card v3-form" id="gForm" novalidate><h3>Submit a request / grievance</h3>${HP}
   <div class="v3-f2"><label>Full name *<input name="name" required maxlength="60" data-rx="name"></label><label>Email *<input name="email" type="email" required maxlength="120" data-rx="email"></label></div>
   <div class="v3-f2"><label>Mobile<input name="phone" inputmode="numeric" maxlength="10" data-rx="phone"></label><label>Type *<select name="kind" required><option value="">Select…</option><option>Request for information</option><option>Grievance / complaint</option><option>Selection appeal</option><option>Other</option></select></label></div>
   <label>Details *<textarea name="message" rows="5" required maxlength="2000"></textarea></label>
   <label class="v3-chk"><input type="checkbox" required> I confirm the information is true.</label><button class="v3-btn">Submit</button><div class="v3-fmsg"></div></form></div>`,
 after(){bindForm($('#gForm'),'grievance');$('#gTrack').onsubmit=e=>{e.preventDefault();const r=$('#gRef').value.trim().toUpperCase(),m=C.inbox().find(x=>x.id===r);$('#gOut').innerHTML=m?`<div class="v3-ok">${esc(m.id)} — <b>${esc(m.status||'New')}</b>${m.reply?'<br>Reply: '+esc(m.reply):''}</div>`:'<div class="v3-err">No request found with that reference.</div>'}}});
P['about/circulars']=()=>{const L=C.get('circulars').sort((a,b)=>(b.date||'').localeCompare(a.date||''));regFiles(L);const cats=[...new Set(L.map(x=>x.cat))];
  return {lead:'Official circulars issued by AFAGS.',html:sampleNote('circulars')+`<div class="v3-bar"><div class="v3-seg" id="cSeg"><button class="on" data-c="">All</button>${cats.map(c=>`<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div></div><div id="cList">${docList(L)}</div>`,
   after(){$$('#cSeg button').forEach(b=>b.onclick=()=>{$$('#cSeg button').forEach(x=>x.classList.toggle('on',x===b));$('#cList').innerHTML=docList(L.filter(x=>!b.dataset.c||x.cat===b.dataset.c))})}}};
P['about/tenders']=()=>{const L=C.get('tenders');regFiles(L);const t=today();
  return {lead:'Tenders and expressions of interest invited by AFAGS.',html:sampleNote('tenders')+(L.length?`<div class="v3-docs">${L.map(x=>{const open=D(x.lastDate)>=t;return `<div class="v3-doc"><span class="v3-di">${open?'OPEN':'CLOSED'}</span><div><b>${esc(x.title)}</b><small>${esc(x.ref)} · Published ${fmtD(x.published)} · Last date ${fmtD(x.lastDate)}</small></div><div class="v3-da">${chip(open?'Open':'Closed',open?'c-green':'')}${fileBtns(x,x.title)}</div></div>`}).join('')}</div>`:empty('No tenders at the moment.'))}};
function recordsPage(cat,lead){return ()=>{const L=C.get('docs').filter(d=>d.cat===cat);regFiles(L);return {lead,html:sampleNote('docs')+docList(L,false)+`<div class="v3-cta"><a class="v3-btn ghost" href="#/about/records">Annual Reports</a><a class="v3-btn ghost" href="#/about/records/finance">Finances</a><a class="v3-btn ghost" href="#/about/records/election">Elections</a><a class="v3-btn ghost" href="#/about/records/compliance">Compliance</a></div>`}}}
P['about/records']=recordsPage('Annual Report','Annual reports of AFAGS.');
P['about/records/finance']=recordsPage('Finance','Audited accounts and financial statements.');
P['about/records/election']=recordsPage('Election','Election notifications and results.');
P['about/records/compliance']=recordsPage('Compliance','Affiliation, recognition and governance compliance.');
P['about/legal']=()=>({lead:'How AFAGS handles disputes, disciplinary matters and appeals.',html:`<div class="v3-card"><h3>Disciplinary & dispute process</h3><div class="v3-flow">${['Complaint received','Preliminary review','Notice to parties','Hearing by Disciplinary Committee','Written decision','Appeal (within 30 days)','Arbitration / FAI'].map((t,i)=>`<div style="--i:${i}"><span>${i+1}</span>${t}</div>`).join('')}</div>
 <p class="v3-note">The process follows the AFAGS Constitution and the rules of the Fencing Association of India. Every party has the right to be heard and to receive a written decision.</p></div>
 <div class="v3-grid3">${[['📮','Raise a grievance','Use the grievance form to start the process.','#/about/rti','Open form'],['📜','Constitution','Read the rules that govern AFAGS.','#/about/constitution','View documents'],['🛡','Anti-doping matters','Anti-doping cases are handled under NADA rules.','#/sport/antidoping','Learn more']].map(([i,t,p,h,b])=>`<div class="v3-card v3-mv"><span>${i}</span><h3>${t}</h3><p>${p}</p><a class="v3-btn sm" href="${h}">${b}</a></div>`).join('')}</div>`});
P['about/donate']=()=>({lead:'Support Gujarat’s fencers — equipment, training camps and grassroots programmes.',html:`<div class="v3-grid2"><div class="v3-card"><h3>Where your support goes</h3><div class="v3-impact">${[['🛡','₹2,500','Starter kit for a young fencer'],['⚡','₹10,000','Electric scoring set for a club'],['🏕','₹25,000','Sponsor a fencer at a training camp'],['🏫','₹50,000','Start fencing in a school']].map(([i,a,t])=>`<div><span>${i}</span><b>${a}</b><small>${t}</small></div>`).join('')}</div></div>
 <form class="v3-card v3-form" id="dForm" novalidate><h3>Pledge your support</h3>${HP}<div class="v3-amt" id="dAmt">${[500,1000,2500,5000,10000].map((a,i)=>`<button type="button" data-a="${a}" class="${i===2?'on':''}">₹${a.toLocaleString('en-IN')}</button>`).join('')}</div>
  <label>Amount (₹) *<input name="amount" id="dVal" inputmode="numeric" value="2500" required maxlength="7"></label>
  <label>Purpose<select name="purpose"><option>Where most needed</option><option>Equipment</option><option>Athlete support</option><option>Grassroots programmes</option><option>Women in fencing</option></select></label>
  <div class="v3-f2"><label>Full name *<input name="name" required maxlength="60" data-rx="name"></label><label>Email *<input name="email" type="email" required data-rx="email" maxlength="120"></label></div>
  <label>Mobile *<input name="phone" inputmode="numeric" maxlength="10" required data-rx="phone"></label><button class="v3-btn">Submit pledge</button><p class="v3-note">AFAGS will contact you with payment details and a receipt. Online donation payments will be enabled once a payment gateway is connected.</p><div class="v3-fmsg"></div></form></div>`,
 after(){$$('#dAmt button').forEach(b=>b.onclick=()=>{$$('#dAmt button').forEach(x=>x.classList.toggle('on',x===b));$('#dVal').value=b.dataset.a});$('#dVal').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'');$$('#dAmt button').forEach(x=>x.classList.toggle('on',x.dataset.a===e.target.value))};bindForm($('#dForm'),'donation')}});

/* calendar */
const evs=()=>C.get('events').filter(e=>e.start).sort((a,b)=>a.start.localeCompare(b.start));
function evCard(e){const d=D(e.start),past=D(e.end||e.start)<today();return `<div class="v3-ev${past?' past':''}"><div class="v3-cal"><span>${MON[d.getMonth()].toUpperCase()}</span><b>${String(d.getDate()).padStart(2,'0')}</b><small>${d.getFullYear()}</small></div>
  <div class="v3-evb"><b>${esc(e.title)}</b><small>📍 ${esc(e.venue)} · ${range(e.start,e.end)}</small><div>${chip(e.level,LV[e.level])}${e.weapons?chip(e.weapons):''}${e.cats?chip(e.cats):''}${past?chip('Completed'):e.regOpen==='Yes'?chip('Registration open','c-green'):''}</div></div>
  <div class="v3-eva"><button type="button" class="v3-btn sm ghost" data-ics="${esc(e.id)}">＋ Calendar</button>${!past&&e.regOpen==='Yes'?'<a class="v3-btn sm" href="afags-portal.html">Register</a>':''}<button type="button" class="v3-ic" data-share-ev="${esc(e.id)}" aria-label="Share">↗</button></div></div>`}
function calPage(level,lead){return ()=>{let L=evs();if(level)L=L.filter(e=>e.level===level);const up=L.filter(e=>D(e.end||e.start)>=today()),next=up[0];
  return {lead,html:sampleNote('events')+(next?`<div class="v3-next"><div><small>NEXT EVENT</small><b>${esc(next.title)}</b><span>📍 ${esc(next.venue)} · ${range(next.start,next.end)}</span></div><div class="v3-cd" id="cd"></div></div>`:'')+
   `<div class="v3-bar"><div class="v3-seg" id="calV"><button class="on" data-v="list">List</button><button data-v="month">Month</button></div>${level?'':`<div class="v3-seg" id="calL"><button class="on" data-l="">All</button>${Object.keys(LV).map(l=>`<button data-l="${l}">${l}</button>`).join('')}</div>`}</div><div id="calOut"></div>`,
   after(){let view='list',lv='';const draw=()=>{const LL=L.filter(e=>!lv||e.level===lv);$('#calOut').innerHTML=view==='list'?(LL.length?`<h4 class="v3-h4">Upcoming</h4>${LL.filter(e=>D(e.end||e.start)>=today()).map(evCard).join('')||empty('No upcoming events.')}<h4 class="v3-h4">Past</h4>${LL.filter(e=>D(e.end||e.start)<today()).reverse().map(evCard).join('')||'<p class="v3-muted">No past events.</p>'}`:empty('No events in this calendar yet.')):month(LL)};
    let mo=next?D(next.start):today();mo=new Date(mo.getFullYear(),mo.getMonth(),1);
    function month(LL){const y=mo.getFullYear(),m=mo.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate();let cells='';for(let i=0;i<first;i++)cells+='<div></div>';
      for(let d=1;d<=days;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,es=LL.filter(e=>e.start<=ds&&(e.end||e.start)>=ds);const isT=+new Date(y,m,d)===+today();cells+=`<div class="${es.length?'has':''}${isT?' today':''}"><span>${d}</span>${es.map(e=>`<i class="${LV[e.level]||''}" title="${esc(e.title)}">${esc(e.title)}</i>`).join('')}</div>`}
      return `<div class="v3-month"><div class="v3-mh"><button type="button" id="mPrev" aria-label="Previous month">‹</button><b>${MON[m]} ${y}</b><button type="button" id="mNext" aria-label="Next month">›</button></div><div class="v3-mg">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<em>${x}</em>`).join('')}${cells}</div></div>`}
    $('#calOut').addEventListener('click',e=>{if(e.target.id==='mPrev'){mo=new Date(mo.getFullYear(),mo.getMonth()-1,1);draw()}if(e.target.id==='mNext'){mo=new Date(mo.getFullYear(),mo.getMonth()+1,1);draw()}});
    $$('#calV button').forEach(b=>b.onclick=()=>{$$('#calV button').forEach(x=>x.classList.toggle('on',x===b));view=b.dataset.v;draw()});
    $$('#calL button').forEach(b=>b.onclick=()=>{$$('#calL button').forEach(x=>x.classList.toggle('on',x===b));lv=b.dataset.l;draw()});draw();
    if(next){const tick=()=>{const el=$('#cd');if(!el)return clearInterval(T);let s=Math.max(0,(D(next.start)-Date.now())/1000|0);const dd=s/86400|0;s%=86400;const h=s/3600|0;s%=3600;const mi=s/60|0;el.innerHTML=[[dd,'days'],[h,'hrs'],[mi,'min'],[s%60,'sec']].map(([n,l])=>`<div><b>${n}</b><span>${l}</span></div>`).join('')};const T=setInterval(tick,1000);tick()}}}}}
P['calendar/all']=calPage('','All AFAGS, national and international fencing events in one place.');
P['calendar/state']=calPage('State','State championships and selection trials conducted by AFAGS.');
P['calendar/national']=calPage('National','National championships in which Team Gujarat participates.');
P['calendar/international']=calPage('International','International competitions with Indian participation.');
P['calendar/asmita']=calPage('ASMITA','ASMITA (Achieving Sports Milestone by Inspiring Women Through Action) women’s league events.');
document.addEventListener('click',e=>{const b=e.target.closest('[data-ics]');if(b){const ev=C.get('events').find(x=>x.id===b.dataset.ics);ev&&ics(ev)}const s=e.target.closest('[data-share-ev]');if(s){const ev=C.get('events').find(x=>x.id===s.dataset.shareEv);ev&&share(ev.title,'#/calendar/all')}});

/* results */
function resPage(level,lead){return ()=>{const L=C.get('results').filter(r=>r.level===level).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  return {lead,html:sampleNote('results')+`<div class="v3-bar"><div class="v3-seg" id="rW"><button class="on" data-w="">All weapons</button><button data-w="Foil">Foil</button><button data-w="Épée">Épée</button><button data-w="Sabre">Sabre</button></div></div><div id="rOut"></div>`,
   after(){const draw=w=>{const LL=L.filter(r=>!w||r.weapon===w);$('#rOut').innerHTML=LL.length?`<div class="v3-res">${LL.map(r=>`<div class="v3-card v3-pod"><div class="v3-ph"><b>${esc(r.event)}</b><small>${fmtD(r.date)} · ${esc(r.weapon)} · ${esc(r.category)}</small></div><div class="v3-podium"><div class="s2"><i>🥈</i><span>${esc(r.silver||'—')}</span><em>2</em></div><div class="s1"><i>🥇</i><span>${esc(r.gold||'—')}</span><em>1</em></div><div class="s3"><i>🥉</i><span>${esc([r.bronze1,r.bronze2].filter(x=>x&&x!=='—').join(' · ')||'—')}</span><em>3</em></div></div></div>`).join('')}</div>`:empty('No results published yet.')};
    $$('#rW button').forEach(b=>b.onclick=()=>{$$('#rW button').forEach(x=>x.classList.toggle('on',x===b));draw(b.dataset.w)});draw('')}}}}
P['results/state']=resPage('State','Results of AFAGS state championships.');
P['results/national']=resPage('National','Gujarat’s results at national championships.');
P['results/international']=resPage('International','Results of Gujarat fencers at international competitions.');
P['results/rankings']=()=>{const pts={},PT={gold:32,silver:26,bronze1:20,bronze2:20},LM={State:1,National:2,International:3};
  C.get('results').forEach(r=>Object.keys(PT).forEach(k=>{const n=(r[k]||'').trim();if(!n||n==='—')return;const key=r.weapon+'|'+n.replace(/\s*\(.*\)$/,'');pts[key]=(pts[key]||0)+PT[k]*(LM[r.level]||1)}));
  const W=['Foil','Épée','Sabre'];return {lead:'State rankings calculated automatically from published results (State ×1, National ×2, International ×3).',html:sampleNote('results')+`<div class="v3-grid3">${W.map(w=>{const L=Object.entries(pts).filter(([k])=>k.startsWith(w+'|')).map(([k,v])=>[k.split('|')[1],v]).sort((a,b)=>b[1]-a[1]);
   return `<div class="v3-card"><h3>${w}</h3>${L.length?`<ol class="v3-rank">${L.map(([n,p],i)=>`<li><span>${i+1}</span><b>${esc(n)}</b><em>${p} pts</em></li>`).join('')}</ol>`:'<p class="v3-muted">No results yet.</p>'}</div>`}).join('')}</div><div class="v3-cta"><button class="v3-btn ghost" type="button" id="rkCsv">⬇ Download rankings (CSV)</button></div>`,
   after(){$('#rkCsv').onclick=()=>{const rows=[['Weapon','Rank','Name','Points']];W.forEach(w=>Object.entries(pts).filter(([k])=>k.startsWith(w+'|')).map(([k,v])=>[k.split('|')[1],v]).sort((a,b)=>b[1]-a[1]).forEach(([n,p],i)=>rows.push([w,i+1,n,p])));csv(rows,'afags-state-rankings.csv')}}}};
function csv(rows,name){const t=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+t],{type:'text/csv'}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast('Downloaded '+name)}

/* people directories */
function peopleCard(p,kind){const ph=p.photo?`<img src="${p.photo}" alt="" loading="lazy">`:`<span class="v3-ini">${esc(p.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`;
  return `<button type="button" class="v3-card v3-person" data-person='${esc(JSON.stringify({n:p.name,d:p.district,w:p.weapon,c:p.cat,id:p.id,k:kind,ph:p.photo&&p.photo.length<200000?p.photo:'',s:p.sample?1:0,g:(p.V||{}).grade||''}))}'><div class="v3-pph">${ph}</div><b>${esc(p.name)}</b><small>${[p.district,p.weapon&&p.weapon!=='—'?p.weapon:'',p.cat&&p.cat!=='—'?p.cat:''].filter(Boolean).map(esc).join(' · ')}</small>${p.id?`<code>${esc(p.id)}</code>`:p.sample?'<em class="v3-s">Sample</em>':''}</button>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-person]');if(!b)return;let p;try{p=JSON.parse(b.dataset.person)}catch(x){return}
  modal(`<div class="v3-idc"><div class="v3-idh"><span class="logo-img"></span><div><b>Amateur Fencing Association of Gujarat State</b><small>${esc({fencers:'Fencer',coaches:'Coach',referees:'Referee / Official',clubs:'Club / Academy'}[p.k]||'Member')}</small></div></div>
   <div class="v3-idb">${p.ph?`<img src="${p.ph}" alt="">`:`<span class="v3-ini lg">${esc(p.n.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`}<div><h3>${esc(p.n)}</h3><dl>${p.id?`<dt>AFAGS ID</dt><dd class="id">${esc(p.id)}</dd>`:''}<dt>District</dt><dd>${esc(p.d||'—')}</dd>${p.w&&p.w!=='—'?`<dt>Weapon</dt><dd>${esc(p.w)}</dd>`:''}${p.c&&p.c!=='—'?`<dt>Category</dt><dd>${esc(p.c)}</dd>`:''}${p.g?`<dt>Grade</dt><dd>${esc(p.g)}</dd>`:''}<dt>Status</dt><dd>${p.s?'Sample profile':'✓ Accredited'}</dd></dl></div></div></div>`,'v3-small')});
function dirPage(key,kind,lead,regType,extra){return ()=>{let L=members(key);if(key==='fencers')L=L.concat(sampleFencers());
  return {lead,html:`<div class="v3-bar"><input type="search" id="pS" placeholder="Search by name, district or AFAGS ID…" aria-label="Search">${extra||''}<button type="button" class="v3-btn sm" data-reg-open="${regType}">Register as ${regType.split(' &')[0]}</button></div><div id="pOut"></div>`,
   after(){const draw=()=>{const q=($('#pS').value||'').toLowerCase(),w=($('#pW')||{}).value||'',c=($('#pC')||{}).value||'';const LL=L.filter(p=>(!q||(p.name+p.district+p.id).toLowerCase().includes(q))&&(!w||p.weapon===w)&&(!c||(p.cat||'').startsWith(c)));
     $('#pOut').innerHTML=LL.length?`<p class="v3-muted">${LL.length} profile${LL.length>1?'s':''}</p><div class="v3-people">${LL.map(p=>peopleCard(p,key)).join('')}</div>`:empty(L.length?'No profiles match your search.':`No accredited ${kind} yet. Profiles appear here automatically once AFAGS approves a registration.`,`<button type="button" class="v3-btn" data-reg-open="${regType}">Register now</button>`)};
    ['#pS','#pW','#pC'].forEach(s=>{const el=$(s);el&&(el.oninput=el.onchange=draw)});draw()}}}}
const WSEL='<select id="pW" aria-label="Weapon"><option value="">All weapons</option><option>Foil</option><option>Épée</option><option>Sabre</option></select>';
P['fencers/profiles']=dirPage('fencers','fencers','Profiles of fencers accredited by AFAGS.','Fencer',WSEL+'<select id="pC" aria-label="Category"><option value="">All categories</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-17</option><option>U-20</option><option>Senior</option></select>');
P['sport/coaches']=dirPage('coaches','coaches','Coaches accredited by AFAGS.','Coach',WSEL);
P['sport/referees']=dirPage('referees','referees and technical officials','Referees and technical officials accredited by AFAGS.','Referee & Technical Official');
P['sport/academies']=dirPage('clubs','clubs or academies','Fencing clubs and academies accredited by AFAGS — find one near you.','Club');
P['fencers/achievers']=()=>{const L=C.get('achievers');return {lead:'Gujarat fencers who made us proud.',html:sampleNote('achievers')+(L.length?`<div class="v3-ach">${L.map(a=>`<div class="v3-card v3-a"><div class="v3-aph">${imgSrc(a.photo)?`<img src="${imgSrc(a.photo)}" alt="" loading="lazy">`:'<span>🏅</span>'}</div><div><span class="v3-chip ${LV[a.level]||''}">${esc(a.level)} · ${esc(a.year)}</span><h3>${esc(a.name)}</h3><p>${esc(a.achievement)}</p>${a.weapon?`<small>${esc(a.weapon)}</small>`:''}</div></div>`).join('')}</div>`:empty('Achievers will be listed here soon.'))}};
P['fencers/guidelines']=()=>({lead:'Step-by-step registration guides with screenshots, document checklists and diagrams. Download, read, then register.',html:`<div class="v3-guides">${Object.entries(GUIDE_META).map(([k,[n,c,fee,reg]])=>`<div class="v3-card v3-g" style="--gc:${c}"><div class="v3-gi">📘</div><h3>${n}</h3><p>${fee==='Free'?'Free registration':'Registration fee '+fee}</p><div class="v3-ga"><button type="button" class="v3-btn sm" data-guide="${k}">View guide</button><button type="button" class="v3-btn sm ghost" data-guide="${k}" data-mode="dl">⬇ PDF</button><button type="button" class="v3-btn sm ghost" data-reg-open="${reg}">Register</button></div></div>`).join('')}</div>
 <div class="v3-card"><h3>The registration journey</h3><div class="v3-flow">${['Read the guide','Prepare documents','Fill the online form','Pay fee (fencers ₹200)','Get reference number','AFAGS accreditation','AFAGS ID issued'].map((t,i)=>`<div style="--i:${i}"><span>${i+1}</span>${t}</div>`).join('')}</div></div>`});

/* sport */
P['sport/fencing']=()=>({lead:'Fencing is one of only a handful of sports contested at every modern Olympic Games — a game of speed, precision and strategy.',html:`
 <div class="v3-grid3">${[['wFoil','Foil','Point only · target: torso · right of way','#0b2257'],['wEpee','Épée','Point only · target: whole body · no right of way','#f47b20'],['wSabre','Sabre','Edge & point · target: above the waist · right of way','#1f8f3f']].map(([s,n,t,c])=>`<div class="v3-card v3-wpn" style="--wc:${c}"><svg viewBox="0 0 100 400" aria-hidden="true"><use href="#${s}"/></svg><div><h3>${n}</h3><p>${t}</p></div></div>`).join('')}</div>
 <div class="v3-card"><h3>The piste (field of play)</h3><svg class="v3-piste" viewBox="0 0 1000 170" role="img" aria-label="Diagram of a fencing piste, 14 metres long"><defs><linearGradient id="pst" x1="0" x2="1"><stop offset="0" stop-color="#dfe6f3"/><stop offset=".5" stop-color="#f4f7fc"/><stop offset="1" stop-color="#dfe6f3"/></linearGradient></defs>
  <rect x="40" y="50" width="920" height="70" rx="6" fill="url(#pst)" stroke="#0b2257" stroke-width="2"/><rect x="40" y="50" width="131" height="70" fill="#f47b20" opacity=".18"/><rect x="829" y="50" width="131" height="70" fill="#f47b20" opacity=".18"/>
  ${[[500,'Centre line','#0b2257'],[368,'On-guard','#1f8f3f'],[632,'On-guard','#1f8f3f'],[171,'Warning (2 m)','#f47b20'],[829,'Warning (2 m)','#f47b20']].map(([x,l,c])=>`<line x1="${x}" y1="50" x2="${x}" y2="120" stroke="${c}" stroke-width="3"/><text x="${x}" y="${l==='Centre line'?40:140}" text-anchor="middle" font-size="13" fill="${c}" font-weight="700">${l}</text>`).join('')}
  <line x1="40" y1="160" x2="960" y2="160" stroke="#5c6680" stroke-width="1.5" marker-end="url(#ar)" marker-start="url(#ar)"/><defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5c6680"/></marker></defs><text x="500" y="155" text-anchor="middle" font-size="13" fill="#5c6680">14 m long · 1.5–2 m wide</text></svg></div>
 <div class="v3-grid2"><div class="v3-card" id="equipment"><h3>Safety equipment</h3><ul class="v3-ticks">${['Mask (FIE 1600 N or national standard)','Jacket (800 N) and under-plastron (800 N)','Glove with cuff covering half the forearm','Breeches, long socks and indoor shoes','Body cord and mask cord (electric)','Conductive lamé — foil & sabre','Chest protector — mandatory for women'].map(x=>`<li>${x}</li>`).join('')}</ul></div>
  <div class="v3-card"><h3>Bout basics</h3><ul class="v3-ticks"><li><b>Pools:</b> first to 5 touches or 3 minutes</li><li><b>Direct elimination:</b> first to 15 touches, three periods of 3 minutes with 1-minute breaks</li><li><b>Sabre:</b> break when a fencer reaches 8 touches</li><li><b>Right of way</b> (foil, sabre) decides who scores when both hit</li><li><b>Épée:</b> simultaneous hits score a double touch</li></ul></div></div>
 <div class="v3-cta"><a class="v3-btn" href="#/sport/rules">Read the rules</a><a class="v3-btn ghost" href="#/sport/academies">Find a club</a></div>`});
P['sport/rules']=()=>({lead:'Competitions follow the rules of the Fédération Internationale d’Escrime (FIE), as adopted by FAI and AFAGS.',html:`
 <div class="v3-card"><h3>Penalty cards</h3><div class="v3-cards">${[['#ffcc00','Yellow card','Warning — valid for the bout.'],['#e53935','Red card','Penalty touch awarded to the opponent.'],['#1c1c1e','Black card','Exclusion from the competition.']].map(([c,t,p])=>`<div><i style="background:${c}"></i><b>${t}</b><p>${p}</p></div>`).join('')}</div></div>
 <div class="v3-grid3">${[['Foil','Target is the torso (front, back, groin). Only point hits count. Off-target hits stop the bout but do not score. Right of way decides simultaneous hits.'],['Épée','Whole body is target. Point hits only. No right of way — the first to hit scores; hits within 1/25 s are a double touch.'],['Sabre','Target is above the waist including arms and head. Cuts and thrusts both count. Right of way applies; forward crossing of the feet is penalised.']].map(([t,p])=>`<div class="v3-card"><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
 <div class="v3-card"><h3>Official rulebooks</h3><div class="v3-docs"><div class="v3-doc"><span class="v3-di">FIE</span><div><b>FIE Rules — Technical, Organisation & Material</b><small>Published by the Fédération Internationale d’Escrime</small></div><div class="v3-da"><a class="v3-btn sm" href="https://fie.org/fie/documents/rules" target="_blank" rel="noopener noreferrer">Open ↗</a></div></div>
  <div class="v3-doc"><span class="v3-di">FAI</span><div><b>Fencing Association of India — Rules</b><small>National rules and circulars</small></div><div class="v3-da"><a class="v3-btn sm" href="https://www.fencingindia.org/rules/" target="_blank" rel="noopener noreferrer">Open ↗</a></div></div></div></div>`});
P['sport/antidoping']=()=>({lead:'AFAGS supports clean sport. All athletes are subject to the National Anti-Doping Agency (NADA) rules and the WADA Code.',html:`
 <div class="v3-card"><h3>Before you take any medicine</h3><div class="v3-flow">${['Check the label & ingredients','Check the WADA Prohibited List','Ask a sports doctor','Need it? Apply for a TUE','Keep prescriptions safe'].map((t,i)=>`<div style="--i:${i}"><span>${i+1}</span>${t}</div>`).join('')}</div></div>
 <div class="v3-grid2"><div class="v3-card"><h3>Athlete responsibilities</h3><ul class="v3-ticks"><li>You are responsible for anything found in your body (strict liability)</li><li>Supplements can be contaminated — use with great care</li><li>Report for testing when notified and stay with the chaperone</li><li>Registered athletes must keep whereabouts updated</li></ul></div>
  <div class="v3-card"><h3>Your rights during testing</h3><ul class="v3-ticks"><li>Bring a representative and an interpreter</li><li>Ask for identification of the doping control officer</li><li>Request a delay for valid reasons (e.g. medal ceremony)</li><li>Record comments on the doping control form</li></ul></div></div>
 <div class="v3-docs"><div class="v3-doc"><span class="v3-di">NADA</span><div><b>National Anti-Doping Agency, India</b><small>Rules, education and TUE applications</small></div><div class="v3-da"><a class="v3-btn sm" href="https://www.nadaindia.org/" target="_blank" rel="noopener noreferrer">Visit ↗</a></div></div>
  <div class="v3-doc"><span class="v3-di">WADA</span><div><b>WADA Prohibited List</b><small>Updated every year on 1 January</small></div><div class="v3-da"><a class="v3-btn sm" href="https://www.wada-ama.org/en/prohibited-list" target="_blank" rel="noopener noreferrer">Visit ↗</a></div></div></div>`});

/* media */
const newsList=()=>C.get('news').sort((a,b)=>(b.date||'').localeCompare(a.date||''));
P['media/news']=(id)=>{const L=newsList();if(id){const i=L.findIndex(n=>n.id===id),n=L[i];if(!n)return {lead:'',html:empty('This story could not be found.','<a class="v3-btn" href="#/media/news">All news</a>')};
   return {title:n.title,lead:`${fmtD(n.date)} · ${esc(n.cat)}`,html:`<article class="v3-card v3-art">${imgSrc(n.img)?`<img src="${imgSrc(n.img)}" alt="">`:''}<p class="v3-sum">${esc(n.summary)}</p>${esc(n.body||'').split(/\n\n+/).map(p=>`<p>${p}</p>`).join('')}${(()=>{const al=[n.img2,n.img3,n.img4].map(imgSrc).filter(Boolean);return al.length?`<div class="v3-album">${al.map(u=>`<button type="button" class="v3-alb" data-lb="${u.length<300000?u:''}"><img src="${u}" alt="" loading="lazy"></button>`).join('')}</div>`:''})()}${(()=>{const m=/(?:youtu\.be\/|v=|embed\/|live\/|shorts\/)([\w-]{11})/.exec(n.video||'');return m?`<div class="v3-vid"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Video" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`:''})()}${n.file&&(n.file.data||n.file.url)?`<p><a class="v3-btn ghost" download="${esc(n.file.name||'attachment.pdf')}" href="${esc(n.file.url||n.file.data)}">📎 ${esc(n.file.name||'Attachment')}</a></p>`:''}<div class="v3-shr"><span>Share:</span><a target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent(n.title+' '+location.href.split('#')[0]+'#/media/news/'+n.id)}">WhatsApp</a><a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href.split('#')[0]+'#/media/news/'+n.id)}">Facebook</a><a target="_blank" rel="noopener noreferrer" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(n.title)}&url=${encodeURIComponent(location.href.split('#')[0]+'#/media/news/'+n.id)}">X</a></div>
    <div class="v3-cta"><button type="button" class="v3-btn ghost" id="shN">Share ↗</button>${L[i+1]?`<a class="v3-btn ghost" href="#/media/news/${L[i+1].id}">‹ Older</a>`:''}${L[i-1]?`<a class="v3-btn ghost" href="#/media/news/${L[i-1].id}">Newer ›</a>`:''}<a class="v3-btn" href="#/media/news">All news</a></div></article>${n.sample?'<div class="v3-sample">ℹ️ Sample story.</div>':''}`,after(){$('#shN').onclick=()=>share(n.title,'#/media/news/'+n.id);$$('.v3-alb').forEach(x=>x.onclick=()=>{const u=x.querySelector('img').src;modal(`<img src="${u}" alt="" style="width:100%;border-radius:14px">`,'v3-lbx')})}}}
  return {lead:'News, announcements and press releases from AFAGS.',html:sampleNote('news')+(L.length?`<div class="v3-news">${L.map((n,i)=>`<a class="v3-card v3-nc${i===0&&!String(n.img||'').startsWith('dom:')&&imgSrc(n.img)?' big':''}" href="#/media/news/${esc(n.id)}"><div class="v3-ni">${imgSrc(n.img)?`<img src="${imgSrc(n.img)}" alt="" loading="lazy">`:'<span>📰</span>'}</div><div><span class="v3-chip">${esc(n.cat)}</span><b>${esc(n.title)}</b><p>${esc(n.summary)}</p><small>${fmtD(n.date)}</small></div></a>`).join('')}</div>`:empty('No news yet.'))}};
P['media/career']=()=>{const L=C.get('careers'),t=today();return {lead:'Work and volunteer with AFAGS.',html:sampleNote('careers')+(L.length?`<div class="v3-jobs">${L.map(j=>{const open=D(j.lastDate)>=t;return `<div class="v3-card v3-job"><div><span class="v3-chip ${open?'c-green':''}">${open?'Open':'Closed'}</span> ${chip(j.type)}<h3>${esc(j.title)}</h3><small>📍 ${esc(j.loc)} · Apply by ${fmtD(j.lastDate)}</small><p>${esc(j.desc||'')}</p></div>${open?`<button type="button" class="v3-btn sm" data-apply="${esc(j.id)}">Apply</button>`:''}</div>`}).join('')}</div>`:empty('No openings right now.')),
  after(){$$('[data-apply]').forEach(b=>b.onclick=()=>{const j=L.find(x=>x.id===b.dataset.apply);const {m,close}=modal(`<form class="v3-form" id="aForm" novalidate><h3>Apply — ${esc(j.title)}</h3>${HP}<input type="hidden" name="job" value="${esc(j.title)}">
   <div class="v3-f2"><label>Full name *<input name="name" required maxlength="60" data-rx="name"></label><label>Email *<input name="email" type="email" required data-rx="email" maxlength="120"></label></div>
   <label>Mobile *<input name="phone" inputmode="numeric" maxlength="10" required data-rx="phone"></label><label>About you *<textarea name="message" rows="4" required maxlength="1500"></textarea></label>
   <label>CV (PDF, max 2 MB)<input type="file" name="cv" accept="application/pdf"></label><button class="v3-btn">Submit application</button><div class="v3-fmsg"></div></form>`);bindForm(m.querySelector('#aForm'),'career')})}}};
P['media/photos']=()=>{const L=C.get('gallery').filter(g=>imgSrc(g.image));const albums=[...new Set(L.map(g=>g.album))];
  return {lead:'Moments from AFAGS competitions, camps and events.',html:sampleNote('gallery')+(L.length?`<div class="v3-bar"><div class="v3-seg" id="gA"><button class="on" data-a="">All</button>${albums.map(a=>`<button data-a="${esc(a)}">${esc(a)}</button>`).join('')}</div></div><div class="v3-gal" id="gOut"></div>`:empty('Photos will be added soon.')),
   after(){if(!L.length)return;let cur=L;const draw=a=>{cur=L.filter(g=>!a||g.album===a);$('#gOut').innerHTML=cur.map((g,i)=>`<button type="button" class="v3-gi2" data-i="${i}"><img src="${imgSrc(g.image)}" alt="${esc(g.caption||g.album)}" loading="lazy"><span>${esc(g.caption||g.album)}</span></button>`).join('')};
    $$('#gA button').forEach(b=>b.onclick=()=>{$$('#gA button').forEach(x=>x.classList.toggle('on',x===b));draw(b.dataset.a)});draw('');
    $('#gOut').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;let i=+b.dataset.i;const {m}=modal(`<div class="v3-lb"><img id="lbI" alt=""><p id="lbC"></p><button type="button" class="v3-lbn p" aria-label="Previous">‹</button><button type="button" class="v3-lbn n" aria-label="Next">›</button></div>`,'v3-wide');
      const show=()=>{const g=cur[i];m.querySelector('#lbI').src=imgSrc(g.image);m.querySelector('#lbC').textContent=`${g.caption||''} · ${g.album}${g.date?' · '+fmtD(g.date):''}`};show();
      m.querySelector('.p').onclick=()=>{i=(i-1+cur.length)%cur.length;show()};m.querySelector('.n').onclick=()=>{i=(i+1)%cur.length;show()};
      m.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')m.querySelector('.p').click();if(e.key==='ArrowRight')m.querySelector('.n').click()});
      let sx=null;m.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});m.addEventListener('touchend',e=>{if(sx==null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)(d<0?m.querySelector('.n'):m.querySelector('.p')).click();sx=null})}}}};
const ytId=u=>{const m=/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(u||'');return m?m[1]:''};
P['media/videos']=()=>{const L=C.get('videos').filter(v=>ytId(v.url));return {lead:'Highlights, tutorials and event videos.',html:L.length?`<div class="v3-vids">${L.map(v=>`<div class="v3-card v3-v"><button type="button" class="v3-vt" data-yt="${ytId(v.url)}" aria-label="Play ${esc(v.title)}"><img src="https://i.ytimg.com/vi/${ytId(v.url)}/hqdefault.jpg" alt="" loading="lazy" data-rmerr><span>▶</span></button><b>${esc(v.title)}</b>${v.date?`<small>${fmtD(v.date)}</small>`:''}</div>`).join('')}</div>`:empty('Videos will be added soon. AFAGS admins can add YouTube links from Member Login › Website CMS › Video Gallery.'),
  after(){$$('[data-yt]').forEach(b=>b.onclick=()=>{b.outerHTML=`<iframe class="v3-yt" src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`})}}};

/* contact */
P['contact/us']=(q)=>{const s=C.site(),subj=new URLSearchParams(q||'').get('subject')||'';return {lead:'We usually reply within two working days.',html:`<div class="v3-grid2"><div><div class="v3-ci">${[['📍','Office',s.address],['✉️','Email',`<a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`],['📞','Phone',/X{3}/.test(s.phone)?esc(s.phone):`<a href="tel:${esc(s.phone.replace(/\s/g,''))}">${esc(s.phone)}</a>`],['🕘','Office hours',s.hours]].filter(([i,t,v])=>v&&!/href="(tel|mailto):"/.test(v)).map(([i,t,v])=>`<div class="v3-card"><span>${i}</span><div><small>${t}</small><b>${t==='Office'||t==='Office hours'?esc(v):v}</b></div></div>`).join('')}</div>
  <div class="v3-card"><h3>Find us</h3><p class="v3-muted">${esc(s.address)}</p><a class="v3-btn sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address.includes('[')?'Gandhinagar, Gujarat':s.address)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></div></div>
  <form class="v3-card v3-form" id="ctForm" novalidate><h3>Send us a message</h3>${HP}<div class="v3-f2"><label>Full name *<input name="name" required maxlength="60" data-rx="name"></label><label>Email *<input name="email" type="email" required maxlength="120" data-rx="email"></label></div>
   <div class="v3-f2"><label>Mobile<input name="phone" inputmode="numeric" maxlength="10" data-rx="phone"></label><label>Topic *<select name="topic" required><option value="">Select…</option><option>Registration</option><option>Events & results</option><option>Clubs & coaching</option><option>Documents</option><option>Media</option><option>Other</option></select></label></div>
   <label>Subject *<input name="subject" required maxlength="120" value="${esc(subj)}"></label><label>Message *<textarea name="message" rows="5" required maxlength="2000"></textarea></label>
   <label class="v3-chk"><input type="checkbox" required> I agree to AFAGS storing my details to reply to me (<a href="#/privacy">Privacy Policy</a>).</label><button class="v3-btn">Send message</button><div class="v3-fmsg"></div></form></div>`,after(){bindForm($('#ctForm'),'contact')}}};
const FAQ=[['How do I register with AFAGS?','Click Member Login, then choose your registration type (Fencer, Coach, Referee & Official, Club or District Unit). Read the registration guide first so you have all documents ready.'],['What is the registration fee?','Fencer registration costs ₹200, paid online before you submit. Coach, referee, club and district unit registration is free.'],['What is an AFAGS ID?','A unique member ID (for example AFAGS/FEN/2026/0001) generated automatically when AFAGS approves your registration. You need it to enter AFAGS events.'],['How do I check my application status?','On the Member Login page click “Track your application” and enter your reference number or mobile number.'],['Which documents do I need?','Typically a passport-size photo, Aadhaar (front and back), residence proof and a birth certificate for fencers. Files must be JPG, PNG or PDF under 5 MB.'],['How are age categories decided?','By your age in the current season: U-10, U-12, U-14 (Sub-Junior), U-17 (Cadet), U-20 (Junior), Senior, plus Open events.'],['How do I find a club near me?','See Sport › Academies / Clubs Profile, or contact your district fencing unit through AFAGS.']];
P['contact/faq']=()=>({lead:'Answers to common questions. Still stuck? Ask Jig, our assistant, in the bottom-right corner.',html:`<div class="v3-faq">${FAQ.map(([q,a])=>`<details class="v3-card"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div><div class="v3-cta"><button type="button" class="v3-btn" data-chat-open>Ask Jig</button><a class="v3-btn ghost" href="#/contact/us">Contact AFAGS</a></div>`});
P['accessibility']=()=>({lead:'Make the website easier to read and use.',html:`<div class="v3-card v3-acc">${[['acc-contrast','High contrast'],['acc-links','Underline all links'],['acc-motion','Reduce motion'],['acc-readable','Readable font (larger line spacing)']].map(([k,l])=>`<label class="v3-sw"><input type="checkbox" data-acc="${k}" ${document.documentElement.classList.contains(k)?'checked':''}><span></span>${l}</label>`).join('')}
 <div class="v3-cta"><button type="button" class="v3-btn ghost" id="fsM">A−</button><button type="button" class="v3-btn ghost" id="fs0">A</button><button type="button" class="v3-btn ghost" id="fsP">A+</button></div></div>
 <div class="v3-card"><h3>Screen readers</h3><p>The website uses semantic headings, labelled buttons and form fields, and keyboard navigation (Tab, Enter, Esc). It works with NVDA, JAWS, VoiceOver and TalkBack.</p></div>`,
 after(){$$('[data-acc]').forEach(c=>c.onchange=()=>{document.documentElement.classList.toggle(c.dataset.acc,c.checked);const a=LS('afags_a11y',{});a[c.dataset.acc]=c.checked;LSS('afags_a11y',a)});
  const fs=v=>{document.documentElement.style.fontSize=v+'%';LSS('afags_fs',v)};$('#fsM').onclick=()=>fs(90);$('#fs0').onclick=()=>fs(100);$('#fsP').onclick=()=>fs(115)}});
P['privacy']=()=>({lead:'How AFAGS handles your personal information — in line with the Digital Personal Data Protection Act, 2023.',html:`<div class="v3-card v3-prose"><p class="v3-muted">Last updated: October 2026</p>
<h3>What we collect</h3><p>Details you give us when you register, enter an event, contact us, apply for a job or make a pledge — name, contact details, date of birth, district, club, photographs and identity / age documents.</p>
<h3>Why we collect it</h3><p>To process registrations and accreditation, verify age categories, organise competitions and publish results, send notices (renewals, event reminders), and meet our obligations to the Fencing Association of India and government authorities. We do not sell your data or use it for advertising.</p>
<h3>Children (under 18)</h3><p>For an applicant under 18 we need the consent of a parent or legal guardian, recorded with the guardian's name, relationship and time. A parent may withdraw consent or ask for the child's data to be removed at any time through the Contact Us page.</p>
<h3>Documents & security</h3><p>Identity and age documents are stored privately and can be opened only by authorised AFAGS administrators; they are never shown on the public website. Aadhaar numbers are masked (last four digits only). Administrator accounts use strong passwords, 2-step login and secure sign-in cookies, and every access is logged.</p>
<h3>What is public</h3><p>For accredited members: name, district, photograph, AFAGS ID status (for card verification), competition results and rankings. Contact details, date of birth and documents are never public.</p>
<h3>How long we keep it</h3><ul><li>Membership records: while you are a member and for 3 seasons after your last membership, then deleted or anonymised.</li><li>Applications that are rejected or withdrawn: deleted after 1 year.</li><li>Uploaded documents not linked to any application: deleted automatically after 7 days.</li><li>Competition results and rankings: kept permanently as the sporting record.</li><li>Website messages: up to 2 years. Backups: rolling 30 days.</li></ul>
<h3>Your rights</h3><p>You can ask to see, correct or delete your information, withdraw consent, or name a nominee, by writing to the AFAGS office through the Contact Us page. We reply within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India.</p>
<h3>Cookies & storage</h3><p>The website stores your preferences (theme, language, accessibility) on your device. Administrators get one secure sign-in cookie. No advertising or tracking cookies are used.</p><h3>Visitor numbers</h3><p>The visit counts shown on the home page are anonymous. The server keeps only totals per day; it does not store IP addresses, and the daily visitor code is scrambled with a key that changes every day, so a visit cannot be traced back to a person.</p></div>`});
P['terms']=()=>({lead:'Terms for using the AFAGS website and member portal.',html:`<div class="v3-card v3-prose"><h3>Use of the website</h3><p>Content is provided for information about fencing in Gujarat. Official decisions are communicated by AFAGS circulars.</p><h3>Member accounts</h3><p>Keep your login details private. You are responsible for the accuracy of the information you submit.</p><h3>Fees & refunds</h3><p>Registration fees are non-refundable once an application has been accredited. Rejected applications may be resubmitted after corrections.</p><h3>Content</h3><p>Logos, photographs and text belong to AFAGS or their respective owners and may not be reused without permission.</p></div>`});
P['sitemap']=()=>({lead:'Every page on this website.',html:`<div class="v3-grid3">${NAV.filter(n=>n.items).map(n=>`<div class="v3-card"><h3>${n.l}</h3><ul class="v3-sm">${n.items.flatMap(i=>i.g?i.items.map(j=>[n.k+'/'+j[0],j[1]]):[[n.k+'/'+i[0],i[1]]]).map(([h,l])=>`<li><a href="#/${h}">${esc(l)}</a></li>`).join('')}</ul></div>`).join('')}<div class="v3-card"><h3>More</h3><ul class="v3-sm"><li><a href="#/">Home</a></li><li><a href="afags-portal.html">Member Login</a></li><li><a href="#/accessibility">Accessibility</a></li><li><a href="#/privacy">Privacy Policy</a></li><li><a href="#/terms">Terms of Use</a></li></ul></div></div>`});

/* ===================== ROUTER ===================== */
const home=$('#homeView'),pv=$('#pageView');
function render(){const h=location.hash||'';
  if(!h.startsWith('#/')||h==='#/'){if(h==='#member-login')return;
    pv.hidden=true;home.hidden=false;document.title='Amateur Fencing Association of Gujarat State';setActive('home');
    if(h&&h!=='#/'&&h.length>1){const el=document.getElementById(h.slice(1));el&&setTimeout(()=>el.scrollIntoView({behavior:'smooth'}),30)}else if(h==='#/')scrollTo({top:0});return}
  let [path,q]=h.slice(2).split('?');path=path.replace(/\/+$/,'');if(path==='contact')path='contact/us';
  if(/^(about|calendar|results|fencers|sport|media)$/.test(path)){const n=NAV.find(x=>x.k===path);path=path+'/'+(n.items[0].g?n.items[0].items[0][0]:n.items[0][0])}
  let key=path,arg=null;if(!P[key]){const m=/^(.*)\/([^/]+)$/.exec(path);if(m&&P[m[1]]){key=m[1];arg=m[2]}}
  const fn=P[key];let out;try{out=fn?fn(arg||q):null}catch(err){console.error(err);out={lead:'',html:empty('Something went wrong loading this page.')}}
  if(!out){out={lead:'',html:empty('Page not found.','<a class="v3-btn" href="#/">Go home</a>')}}
  const [sec,title]=TITLES[key]||['','Page'],top=key.split('/')[0],n=NAV.find(x=>x.k===top),sib=n&&n.items?n.items.flatMap(i=>i.g?i.items.map(j=>[top+'/'+j[0],j[1]]):[[top+'/'+i[0],i[1]]]):[];
  pv.innerHTML=`<section class="v3-hero"><div class="w"><div class="v3-crumbs" role="navigation" aria-label="Breadcrumb"><a href="#/">Home</a> › ${sec?`<span>${esc(sec)}</span> › `:''}<b>${esc(out.title||title)}</b></div><h1>${esc(out.title||title)}</h1>${out.lead?`<p>${out.lead}</p>`:''}</div></section>
   ${sib.length>1?`<div class="w"><div class="v3-sub" role="navigation" aria-label="${esc(sec)} pages">${sib.map(([hh,l])=>`<a href="#/${hh}" class="${hh===key?'on':''}">${esc(l)}</a>`).join('')}</div></div>`:''}<div class="w v3-body">${out.html}</div>`;
  home.hidden=true;pv.hidden=false;setActive(top);document.title=(out.title||title)+' — AFAGS';scrollTo({top:0});
  const on=pv.querySelector('.v3-sub .on');on&&on.scrollIntoView({block:'nearest',inline:'center'});
  try{out.after&&out.after()}catch(err){console.error(err)}
  pv.querySelectorAll('.v3-card,.v3-ev,.v3-doc').forEach((c,i)=>{c.style.animationDelay=Math.min(i,12)*40+'ms';c.classList.add('v3-in')});
  const h1=pv.querySelector('h1');h1&&h1.setAttribute('tabindex','-1');}
addEventListener('hashchange',render);
window.AFAGS_ROUTE=render;

/* ===================== SEARCH ===================== */
function searchIndex(){const I=[];Object.entries(TITLES).forEach(([k,[s,t]])=>I.push({t,s,h:'#/'+k,k:'Page'}));
  newsList().forEach(n=>I.push({t:n.title,s:fmtD(n.date),h:'#/media/news/'+n.id,k:'News',x:n.summary}));evs().forEach(e=>I.push({t:e.title,s:range(e.start,e.end)+' · '+e.venue,h:'#/calendar/all',k:'Event'}));
  C.get('circulars').forEach(c=>I.push({t:c.title,s:c.no,h:'#/about/circulars',k:'Circular'}));$$('#obp .obt').forEach(o=>I.push({t:o.querySelector('b').textContent,s:o.querySelector('span').textContent,h:'#/about/bearers',k:'Office Bearer'}));
  FAQ.forEach(([q,a])=>I.push({t:q,s:a.slice(0,90)+'…',h:'#/contact/faq',k:'FAQ'}));return I}
function openSearch(){const {m,close}=modal(`<div class="v3-srch"><input type="search" id="sQ" placeholder="Search pages, news, events, people…" aria-label="Search the website" autocomplete="off"><div id="sR" class="v3-sr"></div></div>`,'v3-top');
  const I=searchIndex(),q=m.querySelector('#sQ'),R=m.querySelector('#sR');
  const draw=()=>{const t=q.value.trim().toLowerCase();if(!t){R.innerHTML='<p class="v3-muted">Try “registration”, “championship”, “rules” or a name.</p>';return}
    const ws=t.split(/\s+/),hits=I.map(x=>{const hay=(x.t+' '+x.s+' '+(x.x||'')+' '+x.k).toLowerCase();let sc=0;ws.forEach(w=>{if(hay.includes(w))sc+=x.t.toLowerCase().includes(w)?3:1});return [sc,x]}).filter(([s])=>s>=ws.length).sort((a,b)=>b[0]-a[0]).slice(0,14);
    R.innerHTML=hits.length?hits.map(([,x])=>`<a href="${x.h}" class="v3-hit"><span>${x.k}</span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></a>`).join(''):'<p class="v3-muted">No results. Ask Jig instead?</p><button type="button" class="v3-btn sm" data-chat-open>Ask Jig</button>'};
  q.oninput=draw;draw();q.focus();R.addEventListener('click',e=>{if(e.target.closest('a,[data-chat-open]'))close()});
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=R.querySelector('a');a&&(location.hash=a.getAttribute('href'),close())}})}
window.AFAGS_SEARCH=openSearch;

/* ===================== SITE SETTINGS → page ===================== */
function applySite(){const s=C.site();
  const set=(i,v)=>{const el=document.getElementById(i);el&&(el.textContent=v)};set('ftAddr',s.address);set('ftMail',s.email);set('ftPhone',s.phone);set('ftHours',s.hours);
  $$('[data-social]').forEach(a=>{const u=s[a.dataset.social];if(u&&/^https:\/\//.test(u)){a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.removeAttribute('data-nolink')}else{a.href='#';a.dataset.nolink='1'}})}
document.addEventListener('click',e=>{const a=e.target.closest('[data-social][data-nolink]');if(!a)return;e.preventDefault();toast('Social media link will be added by the AFAGS admin')});

/* ===================== THEMES ===================== */
const THEMES=['liquid','glass','spatial'];
function applyTheme(t){if(!THEMES.includes(t))t='liquid';document.documentElement.dataset.theme=t}
applyTheme(C.theme('site'));
addEventListener('storage',e=>{if(!e.key)return;if(e.key==='afags_theme_site')applyTheme(C.theme('site'));if(e.key.startsWith('afags_cms_')||e.key==='afags_site'||e.key==='afags_apps'||e.key==='afags_dec'){applySite();if(location.hash.startsWith('#/'))render()}});
addEventListener('message',e=>{const d=e.data||{};if(d.afags==='theme'&&d.which==='site')applyTheme(d.t);if(d.afags==='cms'){applySite();if(location.hash.startsWith('#/'))render()}if(d.afags==='goto'&&typeof d.hash==='string'&&/^#\/[\w\/-]*$/.test(d.hash)){window.postMessage({afags:'close'},'*');setTimeout(()=>{location.hash=d.hash},250)}});

/* accessibility prefs */
(()=>{const a=LS('afags_a11y',{});Object.entries(a).forEach(([k,v])=>v&&document.documentElement.classList.add(k));const f=LS('afags_fs',0);f&&(document.documentElement.style.fontSize=f+'%')})();

/* ===================== LANGUAGE (Google Translate, loaded on demand) ===================== */
function langMenu(btn){const {m,close}=modal(`<h3 class="v3-mh3">Select language</h3><div class="v3-langs">${[['en','English'],['gu','ગુજરાતી (Gujarati)'],['hi','हिन्दी (Hindi)']].map(([c,l])=>`<button type="button" data-lang="${c}">${l}</button>`).join('')}</div><p class="v3-note">Menus, buttons and headings switch instantly (works offline). For every paragraph, use full translation (Google, needs internet).</p><button type="button" class="v3-btn ghost sm" id="gtFull">🌐 Full-page translation (Google)</button>`,'v3-small');
  m.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{const c=b.dataset.lang;close();setLang(c)});
  m.querySelector('#gtFull').onclick=()=>{const c=(window.AFAGS_I18N&&AFAGS_I18N.get()!=='en')?AFAGS_I18N.get():'gu';close();setLangGoogle(c)}}
function setLang(c){if(window.AFAGS_SETLANG){AFAGS_SETLANG(c);toast(c==='en'?'English':c==='gu'?'ગુજરાતી':'हिन्दी');return}setLangGoogle(c)}
function setLangGoogle(c){const host=location.hostname;document.cookie=`googtrans=/en/${c};path=/`;if(host)document.cookie=`googtrans=/en/${c};path=/;domain=${host}`;
  if(c==='en'){document.cookie='googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';location.reload();return}
  if(window.google&&window.google.translate){const s=document.querySelector('.goog-te-combo');if(s){s.value=c;s.dispatchEvent(new Event('change'))}return}
  let d=document.getElementById('gtEl');if(!d){d=document.createElement('div');d.id='gtEl';d.style.display='none';document.body.appendChild(d)}
  window.afagsGT=()=>{try{new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,gu,hi',autoDisplay:false},'gtEl');setTimeout(()=>{const s=document.querySelector('.goog-te-combo');if(s){s.value=c;s.dispatchEvent(new Event('change'))}},900)}catch(e){toast('Translation is unavailable right now')}};
  const sc=document.createElement('script');sc.src='https://translate.google.com/translate_a/element.js?cb=afagsGT';sc.onerror=()=>toast('Translation needs an internet connection');document.head.appendChild(sc);toast('Loading translation…')}

/* ===================== WIRE EXISTING HOME BUTTONS ===================== */
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;e.preventDefault();const t=a.dataset.act;
  if(t==='lang')langMenu(a);else if(t==='search')openSearch();else if(t==='portal')openPortal();
  else if(t==='rankcsv'){const rows=[['Rank','Name','District','Points']];$$('#rkList .rk').forEach(r=>rows.push([r.querySelector('.no').textContent,r.querySelector('b').textContent,(r.querySelector('small')||{}).textContent||'',r.querySelector('.pt').textContent]));const tab=($('#tabs .on')||{}).textContent||'';csv(rows,`afags-ranking-${tab.toLowerCase()||'list'}.csv`)}});
const srch=$('.srch');if(srch){srch.setAttribute('role','button');srch.setAttribute('tabindex','0');srch.addEventListener('click',openSearch);srch.addEventListener('keydown',e=>{if(e.key==='Enter')openSearch()})}
$$('#tk span').forEach(sp=>{sp.style.cursor='pointer';sp.addEventListener('click',()=>location.hash='#/calendar/all')});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea|select/i.test((document.activeElement||{}).tagName||'')){e.preventDefault();openSearch()}});

/* newsletter */
const nf=$('#nlForm');if(nf)nf.addEventListener('submit',e=>{e.preventDefault();const v=nf.querySelector('input[type=email]').value.trim();if(nf.querySelector('.hp').value)return;
  if(!RX.email.test(v)){toast('Please enter a valid email address');return}const L=LS('afags_subs',[]);if(L.includes(v)){toast('You are already subscribed');return}if(!rateOk()){toast('Please try again later');return}
  L.push(v);LSS('afags_subs',L);C.addInbox({id:'NEW-'+Date.now().toString(36).toUpperCase(),type:'newsletter',email:v,at:Date.now(),status:'New'});nf.reset();toast('✓ Subscribed to AFAGS updates')});

/* ===== Our Fencers (home page) — managed from Admin › Website CMS › Our Fencers ===== */
(()=>{const WK={'Foil':'foil','Épée':'epee','Epee':'epee','Sabre':'sabre'};
const grid=document.getElementById('fzGrid');if(!grid)return;
['epee','foil','sabre'].forEach(k=>imgSrc('dom:'+k)); // cache the built-in photos before any re-render
const card=(f,i)=>{const w=WK[f.weapon]||'foil',src=imgSrc(f.photo)||imgSrc('dom:'+w),flip=String(f.photo||'').startsWith('dom:')&&i%2;
  return `<article class="fz${f.real?' fz-real':''}" data-w="${w}" data-fzi="${i}" tabindex="0" role="button" aria-label="${esc(f.name)} — view profile">
  <div class="fz-ph fz-${w}"><span class="fz-glow"></span><img class="fz-img${flip?' flip':''}" src="${src}" alt="${esc(f.name)}, ${esc(f.weapon)} fencer" loading="lazy">${f.rank?`<span class="fz-rank">${esc(f.rank)}</span>`:''}<span class="fz-w">${esc(f.weapon)}</span></div>
  <div class="fz-b"><h3>${esc(f.name)}</h3><small>${esc([f.district,f.category].filter(Boolean).join(' · '))}</small>
  <div class="fz-st"><div><b>${esc(f.rank||'—')}</b><span>State Rank</span></div><div><b>${esc(f.points||'—')}</b><span>Points</span></div><div><b>${esc(f.medals||'0')}</b><span>Medals</span></div></div></div></article>`};
let LIST=[];
function readStatic(){return [...grid.querySelectorAll('.fz')].map(c=>{const st=[...c.querySelectorAll('.fz-st b')].map(b=>b.textContent),sm=(c.querySelector('.fz-b small')||{}).textContent||'',pp=sm.split('·').map(x=>x.trim());
  return {name:c.querySelector('h3').textContent,weapon:(c.querySelector('.fz-w')||{}).textContent||'',district:pp[0]||'',category:pp.slice(1).join(' · '),rank:st[0],points:st[1],medals:st[2],photoSrc:(c.querySelector('.fz-img')||{}).src||'',sample:1}})}
function render(){const custom=C.isCustom('fencers');
  if(custom){LIST=C.get('fencers').filter(f=>f.show!=='No').map((f,i)=>({...f,_o:parseFloat(f.order)||999,_i:i})).sort((a,b)=>a._o-b._o||a._i-b._i);
    grid.innerHTML=LIST.length?LIST.map(card).join(''):'<p class="v3-muted" style="padding:30px;text-align:center;width:100%">Fencer profiles will appear here soon.</p>';
    const act=(document.querySelector('.fz-tabs button.on')||{}).dataset;const fl=act?act.f:'all';grid.querySelectorAll('.fz').forEach(c=>{c.classList.toggle('hide',fl!=='all'&&c.dataset.w!==fl);c.classList.add('pop')});
    dispatchEvent(new Event('resize'))}
  else{LIST=readStatic();grid.querySelectorAll('.fz').forEach((c,i)=>{c.dataset.fzi=i;c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',LIST[i].name+' — view profile')})}}
document.querySelectorAll('.fz-tabs button').forEach(t=>t.addEventListener('click',()=>{const f=t.dataset.f;grid.querySelectorAll('.fz').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.w!==f))}));
function open(i){const f=LIST[i];if(!f)return;const ph=f.photoSrc||imgSrc(f.photo)||imgSrc('dom:'+(WK[f.weapon]||'foil'));const ach=String(f.achievements||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  modal(`<div class="fzd"><div class="fzd-ph fz-${WK[f.weapon]||'foil'}"><img src="${ph}" alt=""></div><div class="fzd-b"><span class="v3-chip">${esc(f.weapon)}${f.category?' · '+esc(f.category):''}</span><h2>${esc(f.name)}</h2><p class="v3-muted">${esc(f.district||'')}${f.club?' · '+esc(f.club):''}</p>
   <div class="fzd-st">${[['State rank',f.rank],['Points',f.points],['Medals',f.medals]].map(([l,v])=>`<div><b>${esc(v||'—')}</b><small>${l}</small></div>`).join('')}</div>
   <dl>${[['AFAGS ID',f.afagsId],['Coach',f.coach],['District',f.district]].filter(x=>x[1]).map(([l,v])=>`<dt>${l}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
   ${ach.length?`<h4>Achievements</h4><ul>${ach.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>`:''}${f.bio?`<h4>About</h4><p>${esc(f.bio)}</p>`:''}${f.sample?'<p class="v3-muted" style="font-size:12px;margin-top:10px">Sample profile — the AFAGS admin can add real fencers with photos from Admin › Website CMS › Our Fencers.</p>':''}</div></div>`,'fzd-w')}
grid.addEventListener('click',e=>{const c=e.target.closest('.fz[data-fzi]');if(c&&!grid.dataset.drag)open(+c.dataset.fzi)});
grid.addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.fz[data-fzi]');if(c)open(+c.dataset.fzi)}});
render();window.AFAGS_FZ=render;
addEventListener('storage',e=>{if(e.key==='afags_cms_fencers')render()});addEventListener('message',e=>{if(e.data&&e.data.afags==='cms'&&e.data.c==='fencers')render()});
})();
/* ===== website v4: live numbers, verify, renewal, discipline photos, built-in language, server sync ===== */
(()=>{
/* ---- live numbers on the home page (written by the admin portal / server) ---- */
const STAT_DEF=window.AFAGS_STAT_DEFAULT||{units:31,clubs:55,coachRef:134,fencers:2363};
function liveStats(){const s=Object.assign({},STAT_DEF,LS('afags_stats',{}));const map={'District Units':s.units,'Affiliated District Units':s.units,'Clubs':s.clubs,'Affiliated Clubs':s.clubs,'& Referees':s.coachRef,'Coaches & Referees':s.coachRef,'Registered':s.fencers,'Registered Fencers':s.fencers};
  $$('#homeView [data-n]').forEach(el=>{const box=el.parentElement;if(!box)return;const lab=(box.querySelector('small')||{}).textContent||'';const k=Object.keys(map).find(x=>lab.replace(/\s+/g,' ').trim().endsWith(x)||lab.replace(/\s+/g,' ').includes(x));
    if(k==null||map[k]==null||el.closest('.k4'))return;el.dataset.s='';if(/\+$/.test(el.textContent))el.textContent=el.textContent.replace(/\+$/,'');const v=Math.max(0,Math.round(+map[k]||0));if(+el.dataset.n===v)return;el.dataset.n=v;if(el.textContent.trim()!=='0')el.textContent=v.toLocaleString('en-IN')})}
liveStats();addEventListener('storage',e=>{if(e.key==='afags_stats')liveStats()});

/* ---- discipline photos managed from Admin › Website CMS › Discipline photos ---- */
function discPhotos(){const L=C.get('disciplines')||[];const W={Foil:1,'Épée':2,Sabre:3};
  L.forEach(d=>{const n=W[d.weapon],src=imgSrc(d.photo);if(!n||!src)return;const img=document.querySelector(`#disc .dc:nth-child(${n}) img.dfz`);if(img&&img.src!==src){img.src=src;if(d.caption)img.alt=d.caption}})}
discPhotos();

/* ---- Verify an AFAGS ID or certificate number ---- */
const VTYPE={FEN:'Fencer',COA:'Coach',REF:'Referee / Official',CLB:'Club',DIS:'District Unit'};
function vLookup(q){q=String(q||'').trim().toUpperCase();if(!q)return null;
  const vi=LS('afags_vindex',{});const hit=vi[q];if(hit)return {kind:'member',id:q,name:hit[0],type:VTYPE[hit[1]]||hit[1],status:hit[2],district:hit[3],renewed:hit[4]};
  const m=members('fencers').concat(members('coaches'),members('referees'),members('clubs'),members('districts')).find(x=>String(x.id).toUpperCase()===q);if(m)return {kind:'member',id:m.id,name:m.name,type:m.type,status:'Approved',district:m.district};
  const base=q.replace(/-M$/,'');const B=LS('afags_certb',[]);for(const b of B){const r=(b.rows||[]).find(x=>String(x.no).toUpperCase()===base);if(r&&r.held)return {kind:'cert',no:q,name:r.name,type:'Withheld — not valid',event:b.tournament,date:b.date,withheld:true};if(r&&(!/-M$/.test(q)||r.position))return {kind:'cert',no:q,name:r.name,type:/-M$/.test(q)?'Merit — '+r.position:'Participation',event:b.tournament,date:b.date}}
  const c=LS('afags_certs',[]).find(x=>String(x.no).toUpperCase()===q);if(c)return {kind:'cert',no:q,name:c.name,type:c.type,event:c.event,date:c.date};return false}
P['fencers/verify']=q=>{const init=decodeURIComponent((String(q||'').match(/(?:^|&)(?:q|id)=([^&]+)/)||[])[1]||'');
  return {lead:'Check that an AFAGS ID card or an AFAGS certificate is genuine. Scan the QR code on the card / certificate, or type the number below.',html:`<div class="v3-card v3-ver"><form id="vForm" class="v3-form" novalidate><label>AFAGS ID or certificate number<input name="q" id="vQ" maxlength="40" placeholder="e.g. AFAGS/FEN/2026/0001 or AFAGS/CERT/2026/0001" value="${esc(init)}" autocomplete="off"></label><button class="v3-btn">Verify</button></form><div id="vOut" aria-live="polite"></div></div>`,
   async after(){const out=$('#vOut'),run=async()=>{const q=$('#vQ').value.trim();if(!q){out.innerHTML='';return}out.innerHTML='<p class="v3-muted">Checking…</p>';
      let r=null;if(window.AFAGS_API&&AFAGS_API.online){try{r=(await AFAGS_API.call('GET','/verify?q='+encodeURIComponent(q))).result||false}catch(e){r=vLookup(q)}}else r=vLookup(q);
      out.innerHTML=r?`<div class="v3-vok ${r.withheld||(r.status&&r.status!=='Approved')?'warn':''}"><b>${r.withheld?'⛔ Certificate withheld by AFAGS — not valid':r.status&&r.status!=='Approved'?'⚠️ Found — status: '+esc(r.status):'✅ Genuine'}</b><dl>${r.kind==='member'?`<dt>AFAGS ID</dt><dd>${esc(r.id)}</dd><dt>Name</dt><dd>${esc(r.name)}</dd><dt>Type</dt><dd>${esc(r.type)}</dd><dt>District</dt><dd>${esc(r.district||'—')}</dd>${r.renewed!=null?`<dt>Season</dt><dd>${r.renewed?'Renewed for '+(y=>y+'–'+String(y+1).slice(2))(new Date().getMonth()>=3?new Date().getFullYear():new Date().getFullYear()-1):'Renewal due'}</dd>`:''}`:`<dt>Certificate no.</dt><dd>${esc(r.no)}</dd><dt>Name</dt><dd>${esc(r.name)}</dd><dt>Certificate</dt><dd>${esc(r.type)}</dd><dt>Event</dt><dd>${esc(r.event||'—')}</dd>`}</dl></div>`
       :`<div class="v3-vno"><b>❌ Not found</b><p>This number is not in the AFAGS records. Check the number, or contact the AFAGS office.</p></div>`};
    $('#vForm').onsubmit=e=>{e.preventDefault();run()};if(init)run()}}};
/* ---- Renew registration (opens the portal renewal desk) ---- */
P['fencers/renew']=()=>({lead:`Renew your AFAGS registration for the ${(y=>y+'–'+String(y+1).slice(2))(new Date().getMonth()>=3?new Date().getFullYear():new Date().getFullYear()-1)} season to stay eligible for district and state events.`,html:`<div class="v3-grid2"><div class="v3-card"><h3>How to renew</h3><ol class="v3-steps"><li>Keep your <b>AFAGS ID</b> ready (on your ID card).</li><li>Click <b>Renew now</b> — enter the AFAGS ID and your registered mobile number.</li><li>Pay the renewal fee (fencers ₹200; coaches, referees, clubs and district units free).</li><li>Your record is marked <b>Renewed</b> instantly and a receipt is shown.</li></ol><button type="button" class="v3-btn" id="rnGo">Renew now ›</button></div><div class="v3-card"><h3>Need help?</h3><p>Lost your AFAGS ID? ${'<a href="#/fencers/verify">Verify</a>'} your details or <a href="#/contact/us">contact the AFAGS office</a>. You can also ask Jig, the chat assistant.</p></div></div>`,
  after(){$('#rnGo').onclick=()=>{try{sessionStorage.setItem('afags_openrenew','1')}catch(e){}window.AFAGS_OPENPORTAL&&AFAGS_OPENPORTAL();let n=0;const t=setInterval(()=>{const f=document.querySelector('.pov iframe');if(f&&f.contentWindow){try{f.contentWindow.postMessage({afags:'openRenew'},'*')}catch(e){}}if(++n>12)clearInterval(t)},350)}}});
const fz=NAV.find(x=>x.k==='fencers');if(fz&&!fz.items.some(i=>i[0]==='renew')){fz.items.push(['renew','Renew Registration'],['verify','Verify ID / Certificate'])}
TITLES['fencers/renew']=['Fencers','Renew Registration'];TITLES['fencers/verify']=['Fencers','Verify ID / Certificate'];

/* ---- language: built-in Gujarati / Hindi for the interface, Google Translate optional for everything ---- */
window.AFAGS_SETLANG=c=>{if(window.AFAGS_I18N)AFAGS_I18N.apply(c)};
try{const l=localStorage.getItem('afags_lang');if(l&&l!=='en')setTimeout(()=>AFAGS_SETLANG(l),50)}catch(e){}

/* ---- server: pull the latest public data, then refresh what is on screen ---- */
if(window.AFAGS_API)AFAGS_API.ready.then(on=>{if(!on)return;AFAGS_API.pullPublic().then(()=>{applySite();liveStats();discPhotos();window.AFAGS_FZ&&AFAGS_FZ();if(location.hash.startsWith('#/'))render()}).catch(()=>{})});
addEventListener('message',e=>{if(e.data&&e.data.afags==='cms'){discPhotos();liveStats()}});
})();

/*V5START*/
/* ===== AFAGS certificate — same layout, wording, fonts and colours as the official AFAGS Merit / Participation certificates =====
   One template for the admin portal (create, tournament batches, print all) and the website (My AFAGS). A4 landscape, 1123 × 794 px. */
(()=>{if(window.AFAGS_CERT)return;
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SIGS=[{name:'Rigneshkumar Chaudhari',title:'Treasurer - AFAGS'},{name:'Bharatji Thakor',title:'Secretary - AFAGS'},{name:'Mukeshbhai Chaudhari',title:'President - AFAGS'}];
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
/* "05 April, 2026" / "15 – 16 November, 2026" like the official certificate */
function dates(a,b){const p=s=>{const d=new Date(String(s||'').slice(0,10)+'T00:00:00');return isNaN(d)?null:d};const x=p(a),y=p(b);if(!x)return a||'';
  const f=d=>`${String(d.getDate()).padStart(2,'0')} ${MON[d.getMonth()]}, ${d.getFullYear()}`;
  if(!y||+y===+x)return f(x);if(x.getMonth()===y.getMonth()&&x.getFullYear()===y.getFullYear())return `${String(x.getDate()).padStart(2,'0')} to ${f(y)}`;return `${f(x)} to ${f(y)}`}
/* season: 2026-2027 (title) and 2026-27 (body); the season starts in April */
function season(d){const t=new Date(String(d||'').slice(0,10)+'T00:00:00');const n=isNaN(t)?new Date():t;const y=n.getMonth()>=3?n.getFullYear():n.getFullYear()-1;return {long:`${y}-${y+1}`,short:`${y}-${String(y+1).slice(2)}`}}
const dmy=s=>{const m=/^(\d{4})-(\d\d)-(\d\d)/.exec(String(s||''));return m?`${m[3]}-${m[2]}-${m[1]}`:(s||'')};
const medalOf=p=>{p=String(p||'');return /gold|1st|first/i.test(p)?'Gold':/silver|2nd|second/i.test(p)?'Silver':/bronze|3rd|third/i.test(p)?'Bronze':p.replace(/\s*—.*$/,'')};
const weaponTxt=w=>({'Épée':'Epee','épée':'Epee'}[w]||w||'');
/* d = {kind:'merit'|'participation'|'appreciation'|'service'|'accreditation', no, idLabel, idValue, name, dob, parent, district, tournament,
        date, end, venue, organizer, medal, event, photo, qr, logo, sigs:[{name,title,img}], affiliated, recognized, border} */
function htmlClassic(d){d=d||{};const kind=d.kind||'participation',S=season(d.date),sig=(d.sigs&&d.sigs.length?d.sigs:SIGS).slice(0,3);
  const title={merit:'CERTIFICATE OF MERIT',participation:'CERTIFICATE OF PARTICIPATION',appreciation:'CERTIFICATE OF APPRECIATION',service:'CERTIFICATE OF SERVICE',accreditation:'CERTIFICATE OF ACCREDITATION'}[kind]||'CERTIFICATE';
  const tour=String(d.tournament||'State Fencing Championship').replace(/\s*\(?\d{4}(\s*[-–]\s*\d{2,4})?\)?\s*$/,'').trim();
  const blank=(v,cls,w)=>`<span class="${cls}"${v?'':` style="min-width:${w||160}px"`}>${E(v)||'&nbsp;'}</span>`;
  const tail=kind==='merit'?` and won ${blank(medalOf(d.medal),'won',100)} Medal in the event `:kind==='appreciation'?' and is appreciated for an outstanding contribution in the event ':kind==='service'?' and rendered valuable service as a coach / technical official in the event ':kind==='accreditation'?' and is a duly accredited member, as recorded in the event ':' in the event ';
  return `<div class="afc afc-${E(kind==='merit'?'merit':'participation')}"><div class="afc-cert">
   <div class="afc-wm" aria-hidden="true"></div>
   <div class="afc-no">${E(d.no||'')}</div>
   ${d.idValue?`<div class="afc-fai">${E(d.idLabel||'AFAGS ID')}: ${E(d.idValue)}</div>`:''}
   <div class="afc-logo">${d.logo||''}</div>
   <div class="afc-photo">${d.photo?`<img src="${E(d.photo)}" alt="">`:''}</div>
   <div class="afc-qr">${d.qr||''}</div>
   <div class="afc-head"><div class="afc-org">Amateur Fencing Association of Gujarat State</div>
    <div class="afc-aff">${E(d.affiliated||'Affiliated to: Fencing Association of India (FAI)')}</div>
    <div class="afc-rec">${E(d.recognized||'Recognized by: Sports, Youth and Cultural Activities Department, Government of Gujarat')}</div></div>
   <div class="afc-title">${title}</div>
   <div class="afc-champ">${E(tour.toUpperCase())} (${S.long})</div>
   <div class="afc-orgby">Organized by: ${E(d.organizer||'Amateur Fencing Association of Gujarat State')}</div>
   <div class="afc-body"><div class="afc-text">The Amateur Fencing Association of Gujarat State certify that ${blank(d.name,'afc-name')}
    DOB ${blank(dmy(d.dob),'afc-dob',120)} S/O D/o W/o ${blank(d.parent,'afc-so',150)} represented ${blank(d.district,'afc-dist',140)}
    in the ${E(tour)} ${S.short}${d.venue?` held in ${E(d.venue)}`:''}${d.date?` from ${E(dates(d.date,d.end))}`:''}${tail}<span class="afc-event">${E(d.event||'')||'&nbsp;'}</span></div></div>
   <div class="afc-foot">${sig.map(s=>`<div class="afc-sig"><div class="afc-sigimg">${s.img?`<img src="${E(s.img)}" alt="">`:''}</div><div class="afc-sigline"></div><div class="afc-signame">${E(s.name)}</div><div class="afc-sigtitle">${E(s.title)}</div></div>`).join('')}</div>
  </div></div>`}
/* event line in the official style: "Men - Epee - Individual" */
function eventLine(gender,weapon,cat,type){const g=/^f|women|girl/i.test(gender||'')?'Women':/^m|men|boy/i.test(gender||'')?'Men':'';return [g,weaponTxt(weapon),cat&&!/^(—|-)$/.test(cat)?cat:'',type||'Individual'].filter(Boolean).join(' - ')}
/* fit a certificate into a smaller box on screen (print always uses the real A4 size) */
function fit(box){if(!box)return;const c=box.querySelector('.afc');if(!c)return;const w=box.clientWidth||1123,k=Math.min(1,w/1123);c.style.setProperty('--k',k);box.style.height=Math.ceil(794*k)+'px'}

/* ---------- Code 128-B barcode (SVG) for the member ID ---------- */
const C128=['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
function barcode(text,h){text=String(text||'').replace(/[^\x20-\x7e]/g,'');if(!text)return '';const codes=[104];for(const ch of text)codes.push(ch.charCodeAt(0)-32);let sum=104;for(let i=1;i<codes.length;i++)sum+=codes[i]*i;codes.push(sum%103,106);
  let x=10,bars='';for(const c of codes){const pat=C128[c];for(let i=0;i<pat.length;i++){const w=+pat[i];if(i%2===0)bars+=`<rect x="${x}" y="0" width="${w}" height="${h}"/>`;x+=w}}
  return `<svg class="afm-bc" viewBox="0 0 ${x+10} ${h}" preserveAspectRatio="none" aria-hidden="true"><g fill="#111">${bars}</g></svg>`}
/* ---------- ornaments (original AFAGS line-work: crossed blades, laurel scrolls) ---------- */
const CORNER=`<svg viewBox="0 0 140 140" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M8 132V40C8 22 22 8 40 8h92" stroke-width="2.2"/><path d="M18 132V46c0-15 13-28 28-28h86" stroke-width="1"/>
 <path d="M30 110c0-30 12-52 36-66M30 110c14-6 24-16 30-30M44 70c-10-2-17 2-22 10M58 52c-10-4-18-1-24 6M66 44c4-9 11-14 20-16" stroke-width="1.4"/>
 <path d="M110 30c-30 0-52 12-66 36M110 30c-6 14-16 24-30 30M70 44c-2-10 2-17 10-22M52 58c-4-10-1-18 6-24" stroke-width="1.4"/><circle cx="34" cy="34" r="6" stroke-width="1.6"/><circle cx="34" cy="34" r="2" fill="currentColor"/></g></svg>`;
const MID=`<svg viewBox="0 0 160 30" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.4"><path d="M2 15h48M110 15h48"/><path d="M58 15c6-10 16-10 22 0 6 10 16 10 22 0"/><path d="M58 15c6 10 16 10 22 0 6-10 16-10 22 0"/><circle cx="80" cy="15" r="3" fill="currentColor"/></g></svg>`;
const ROSETTE=m=>{const c={Gold:['#f7d26b','#c9921e'],Silver:['#eef1f5','#9aa3ae'],Bronze:['#f0b48a','#a85d2a']}[m]||['#f7d26b','#c9921e'];
  return `<svg class="afm-medal" viewBox="0 0 120 150" aria-hidden="true"><path d="M38 80 22 146l20-12 12 18 14-60z" fill="#0b2257"/><path d="M82 80l16 66-20-12-12 18-14-60z" fill="#f47b20"/>
  <g transform="translate(60 60)">${Array.from({length:24},(_,i)=>`<path d="M0-56 7-44H-7z" fill="${c[1]}" transform="rotate(${i*15})"/>`).join('')}<circle r="46" fill="${c[1]}"/><circle r="40" fill="${c[0]}"/><circle r="40" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-dasharray="2 4"/>
  <text y="-6" text-anchor="middle" font-family="AFC Cinzel,Times New Roman,serif" font-size="15" font-weight="600" fill="#3a2a05">${E(m||'')}</text><text y="14" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" letter-spacing="1.5" fill="#3a2a05">MEDAL</text></g></svg>`};
function htmlModern(d){d=d||{};const kind=d.kind||'participation',S=season(d.date),sig=(d.sigs&&d.sigs.length?d.sigs:SIGS).slice(0,3),medal=medalOf(d.medal);
  const title={merit:'Certificate of Merit',participation:'Certificate of Participation',appreciation:'Certificate of Appreciation',service:'Certificate of Service',accreditation:'Certificate of Accreditation'}[kind]||'Certificate';
  const tour=String(d.tournament||'State Fencing Championship').replace(/\s*\(?\d{4}(\s*[-–]\s*\d{2,4})?\)?\s*$/,'').trim();
  const f=(v,cls)=>`<span class="afm-f ${cls||''}">${E(v)||'&nbsp;'}</span>`;
  const won=kind==='merit'?` and won ${f(medal,'afm-won')} Medal`:kind==='appreciation'?' and is appreciated for an outstanding contribution':kind==='service'?' and rendered valuable service as a coach / technical official':'';
  return `<div class="afc afm afm-${kind==='merit'?'merit':'part'}"><div class="afc-cert afm-cert">
   <div class="afm-frame" aria-hidden="true"></div>${['tl','tr','bl','br'].map(k=>`<i class="afm-c afm-${k}">${CORNER}</i>`).join('')}<i class="afm-m afm-mt">${MID}</i><i class="afm-m afm-mb">${MID}</i>
   <div class="afm-wm" aria-hidden="true">${d.logo||''}</div>
   <header class="afm-hd"><div class="afm-logo">${d.logo||''}</div><div class="afm-brand"><b>Amateur Fencing Association</b><span>of Gujarat State</span></div></header>
   <p class="afm-aff">${E(d.affiliated||'Affiliated to: Fencing Association of India (FAI)')}<br>${E(String(d.recognized||'Recognized by: Sports, Youth and Cultural Activities Department, Government of Gujarat'))}</p>
   <h1 class="afm-title">${title}</h1>
   <div class="afm-rib"><span>${E(tour)} ${S.short}</span></div>
   <aside class="afm-side"><div class="afm-ph">${d.photo?`<img src="${E(d.photo)}" alt="">`:'<span>PHOTO</span>'}</div><div class="afm-role">${E(d.role||'Fencer')}</div><div class="afm-id">${E(d.idValue||'')}</div>${d.idValue?barcode(d.idValue,34):''}<div class="afm-no">${E(d.no||'')}</div></aside>
   ${kind==='merit'?ROSETTE(medal):''}
   <div class="afm-body"><p class="afm-lead">The Amateur Fencing Association of Gujarat State certify that</p>
    <p class="afm-namel">${f(d.name,'afm-name')}</p>
    <p>DOB ${f(dmy(d.dob),'afm-sm')} S/o D/o W/o ${f(d.parent,'afm-md')} represented ${f(d.district,'afm-sm')}</p>
    <p>in the <b>${E(tour)} ${S.short}</b>${d.venue?`, held in ${E(d.venue)}`:''}${d.date?` from ${E(dates(d.date,d.end))}`:''}${won} in the event</p>
    <p class="afm-ev">${f(d.event,'afm-event')}</p>
    ${d.organizer?`<p class="afm-org">Organized by ${E(d.organizer)}</p>`:''}</div>
   <div class="afm-qr">${d.qr||''}<small>Scan to verify</small></div>
   <footer class="afm-sigs">${sig.map(x=>`<div class="afm-sig"><div class="afm-sigimg">${x.img?`<img src="${E(x.img)}" alt="">`:''}</div><b>${E(x.name)}</b><span>${E(String(x.title||'').replace(/\s*-\s*AFAGS$/,', AFAGS'))}</span>${x.org?`<em>${E(x.org)}</em>`:''}</div>`).join('')}</footer>
  </div></div>`}
function html(d){return (d&&d.style==='classic')?htmlClassic(d):htmlModern(d)}
window.AFAGS_CERT={html,htmlClassic,htmlModern,barcode,eventLine,dates,season,medalOf,fit,SIGS};
})();

/* ===== website v5: home page from real data, Live Centre, event entry, My AFAGS, seasonal rankings ===== */
const V5={};
const nowMs=()=>Date.now();
const evEnd=e=>D(e.end)||D(e.start);
const upcomingEvents=()=>C.get('events').filter(e=>{const x=evEnd(e);return x&&x>=today()}).sort((a,b)=>String(a.start).localeCompare(String(b.start)));
const entriesOpen=e=>e.regOpen==='Yes'&&(!e.regClose||D(e.regClose)>=today())&&(evEnd(e)>=today());
const MONS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const shortD=s=>{const d=D(s);return d?`${d.getDate()} ${MON[d.getMonth()]}`:''};

/* ---------- home: News, Upcoming Events, ticker, hero headline, numbers, footer ---------- */
function homeNews(){const box=$('#news .box.pn.fromL .pb');if(!box)return;const L=C.get('news').slice(0,4);
  box.innerHTML=L.length?L.map(n=>{const im=imgSrc(n.img);return `<a href="#/media/news/${esc(n.id)}" class="ni"><span class="timg">${im?`<i style="background-image:url('${im.replace(/'/g,'%27')}')"></i>`:'<i class="noimg">📰</i>'}</span><span><b>${n.pin==='Yes'?'📌 ':''}${n.breaking==='Yes'?'<em class="brk">Breaking</em> ':''}${esc(n.title)}</b><small>${fmtD(n.date)}</small></span></a>`}).join(''):'<p class="v3-muted" style="padding:14px">News will appear here soon.</p>'}
function homeEvents(){const box=$('#news .box.pn.zoom .pb');if(!box)return;const L=upcomingEvents().slice(0,4);
  box.innerHTML=L.length?L.map(e=>{const a=D(e.start),b=D(e.end)||a,same=a.getMonth()===b.getMonth();return `<a class="ev" href="#/calendar/all" style="text-decoration:none;color:inherit"><div class="dt"><div class="m">${MONS[a.getMonth()]}${same?'':'–'+MONS[b.getMonth()]}</div><div class="d">${a.getDate()}${+b!==+a?'-'+b.getDate():''}</div><div class="y">${a.getFullYear()}</div></div><div><b>${esc(e.title)}</b><small>${esc(e.venue||'')}${entriesOpen(e)?` · <em class="eo">Entries open${e.regClose?' till '+shortD(e.regClose):''}</em>`:''}</small></div></a>`}).join(''):'<p class="v3-muted" style="padding:14px">No upcoming events right now. Check the full calendar.</p>'}
function tickerItems(){const out=[],now=today();
  C.get('news').filter(n=>n.breaking==='Yes'&&(!n.date||(now-D(n.date))/864e5<=21)).slice(0,3).forEach(n=>out.push(`<a href="#/media/news/${esc(n.id)}">🔴 ${esc(n.title)}</a>`));
  if(V5.liveBout)out.push(`<a href="#/live">🟢 LIVE — ${esc(V5.liveBout.label)}</a>`);
  upcomingEvents().forEach(e=>{if(out.length>=6)return;out.push(entriesOpen(e)?`<a href="#/calendar/entry?e=${encodeURIComponent(e.id)}">${esc(e.title)} — entries open${e.regClose?' till '+shortD(e.regClose):''}</a>`:`<a href="#/calendar/all">${esc(e.title)} — ${shortD(e.start)}, ${esc(e.venue||'')}</a>`)});
  if(out.length<3)C.get('news').slice(0,3).forEach(n=>{if(out.length<4&&!out.some(x=>x.includes('#/media/news/'+esc(n.id)+'"')))out.push(`<a href="#/media/news/${esc(n.id)}">${esc(n.title)}</a>`)});return out}
function homeTicker(){const tk=$('#tk');if(!tk)return;const items=tickerItems(),html=items.map(x=>`<span>${x}</span>`).join(' ');const key=html;if(tk.dataset.k===key)return;tk.dataset.k=key;
  const box=tk.closest('.ticker');if(!items.length){box&&(box.style.display='none');return}box&&(box.style.display='');tk.innerHTML=html+' '+html}
function heroKicker(){const k=$('#slides .slide .kick')||$('.slide .kick');if(!k)return;const L=upcomingEvents(),open=L.find(entriesOpen);
  if(open){k.innerHTML=`<i></i>${esc(open.title)} · Entries open${open.regClose?' till '+shortD(open.regClose):''}`;k.style.display=''}
  else if(L[0]){k.innerHTML=`<i></i>Next: ${esc(L[0].title)} · ${shortD(L[0].start)}`;k.style.display=''}else k.style.display='none'}
function homeNumbers(){const s=C.site();const yr=new Date().getFullYear();const evN=C.get('events').filter(e=>String(e.start||'').startsWith(String(yr))&&/State|District|ASMITA/.test(e.level||'')).length;
  const set={'State Events Annually':s.eventsYear||evN||'','National Medals':s.medals||'','Years of Service':s.years||''};
  $$('#homeView .box.gl .g').forEach(g=>{const lab=((g.querySelector('small')||{}).textContent||'').trim();if(!(lab in set))return;const v=parseInt(String(set[lab]).replace(/\D/g,''))||0;const n=g.querySelector('.n');
    if(!v){g.style.display='none';return}g.style.display='';if(+n.dataset.n!==v){n.dataset.n=v;n.dataset.s='';if(n.textContent.trim()!=='0')n.textContent=v.toLocaleString('en-IN')}})}
function footerClean(){const s=C.site();[['ftAddr',s.address],['ftPhone',s.phone]].forEach(([id,v])=>{const el=document.getElementById(id);if(!el)return;const row=el.closest('li,p,div')||el;const bad=!v||/\[|XXXX/.test(v);row.style.display=bad?'none':''})}
/* hero slider pause button */
(()=>{const dots=$('#hDots');if(!dots||$('#hPause'))return;const b=document.createElement('button');b.id='hPause';b.type='button';b.className='hpause';b.setAttribute('aria-label','Pause slideshow');b.textContent='❚❚';dots.after(b);
  b.onclick=()=>{const p=document.documentElement.classList.toggle('hero-paused');b.textContent=p?'▶':'❚❚';b.setAttribute('aria-label',p?'Play slideshow':'Pause slideshow')}})();

/* ---------- live data (shared with the admin Live Centre) ---------- */
function liveData(){return LS('afags_live',{comps:[]})||{comps:[]}}
function boutsOf(c){const out=[];(c.pools||[]).forEach((p,pi)=>(p.bouts||[]).forEach((b,bi)=>out.push({...b,kind:'pool',pool:pi,idx:bi,piste:p.piste,fa:fzF(c,b.a),fb:fzF(c,b.b),to:5})));
  const de=c.de;if(de&&de.r)de.r.forEach((round,ri)=>round.forEach((b,bi)=>{const [a,bb]=deSlots(c,ri,bi);out.push({...b,kind:'de',round:ri,idx:bi,fa:fzF(c,a),fb:fzF(c,bb),to:15,label:roundName(de.size>>ri)})}));return out}
function fzF(c,id){return (c.fencers||[]).find(f=>f.id===id)||null}
function bracketOrder(n){let o=[1,2];while(o.length<n){const m=o.length*2;o=o.flatMap(s=>[s,m+1-s])}return o}
function deVoid(c,r,k,side){/* true when that slot can never receive a fencer (a structural bye) */const de=c.de;if(r===0){const o=bracketOrder(de.size);return !de.seed[o[2*k+side]-1]}return deVoid(c,r-1,2*k+side,0)&&deVoid(c,r-1,2*k+side,1)}
function deSlots(c,r,k){const de=c.de;if(r===0){const o=bracketOrder(de.size);return [de.seed[o[2*k]-1]||null,de.seed[o[2*k+1]-1]||null]}
  const w=(rr,kk)=>{const b=de.r[rr][kk],[a,bb]=deSlots(c,rr,kk);if(a&&!bb)return deVoid(c,rr,kk,1)?a:null;if(bb&&!a)return deVoid(c,rr,kk,0)?bb:null;if(!a||!bb||!b||b.st!=='done')return null;return b.w==='a'?a:bb};return [w(r-1,2*k),w(r-1,2*k+1)]}
function roundName(n){return n===2?'Final':n===4?'Semi-final':n===8?'Quarter-final':'Table of '+n}
function clock(b){let t=b.t==null?(b.kind==='de'?180000:180000):b.t;if(b.run)t-=Date.now()-b.run;t=Math.max(0,t);const s=Math.ceil(t/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function liveNow(){const out=[];liveData().comps.forEach(c=>{if(c.status==='done')return;boutsOf(c).forEach(b=>{if(b.st==='live'&&b.fa&&b.fb&&(!b.at||Date.now()-b.at<20*60e3))out.push({c,b})})});return out}
function homeLive(){const L=liveNow();V5.liveBout=L[0]?{label:`${L[0].c.name} · ${L[0].b.fa.name} ${L[0].b.sa}–${L[0].b.sb} ${L[0].b.fb.name}`}:null;
  const badge=$('.badge-live');if(badge){if(L[0]){const {c,b}=L[0];badge.style.display='';badge.innerHTML=`<span class="dot"></span><div><b id="liveScore">${b.sa} – ${b.sb}</b>Live · ${esc(c.weapon||'')} ${esc(b.kind==='de'?b.label:'Pool '+(b.pool+1))}</div>`;badge.onclick=()=>location.hash='#/live';badge.style.cursor='pointer'}else badge.style.display='none'}
  hpPanel(L);homeTicker()}
/* ---------- home "Digital Fencing Platform" panel 1: real live scoring when a bout is on, otherwise the Video Gallery ----------
   (replaces the old simulated demo board — visitors only ever see real scores or real videos) */
const ytIdH=u=>{const m=/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/.exec(u||'');return m?m[1]:''};
function hpPanel(L){let box=$('#hpPanel');const old=$('#board');
  if(!box){if(!old)return;old.id='boardOld';const col=old.parentElement;box=document.createElement('div');box.id='hpPanel';box.className='board hp-panel';old.replaceWith(box);
    const t=col.querySelector('.ptitle');t&&(t.id='hpTitle');box.addEventListener('click',hpClick)}
  const mode=L&&L[0]?'live':'video',title=$('#hpTitle');
  if(title){const want=mode==='live'?'<b>1</b>Live Scoring <span class="hp-dot" aria-hidden="true"></span>':'<b>1</b>Video Gallery';if(title.dataset.m!==mode){title.innerHTML=want;title.dataset.m=mode}}
  if(mode==='live'){const {c,b}=L[0],key='L'+c.id+b.kind+b.pool+b.idx+b.sa+b.sb+(b.ca||[]).join('')+(b.cb||[]).join('')+b.per+L.length;
    if(box.dataset.k!==key){box.dataset.k=key;box.dataset.m='live';const cards=a=>(a||[]).map(x=>`<i class="hp-card ${x==='y'?'y':x==='r'?'r':'k'}" title="${x==='y'?'Yellow':x==='r'?'Red':'Black'} card"></i>`).join('');
      const where=b.kind==='de'?(b.label||'Tableau'):'Pool '+(b.pool+1);
      box.innerHTML=`<div class="top"><span>${esc(c.name)} · ${esc(c.weapon||'')} · ${esc(where)}${b.piste?' · Piste '+esc(b.piste):''}</span><span class="live-tag"><i></i>LIVE</span></div>
       <div class="score-row"><div class="player"><small>${esc(b.fa.club||'')}</small><b>${esc(b.fa.name)}</b><div class="pts">${b.sa}</div><div class="hp-cards">${cards(b.ca)}</div></div>
        <div class="clock"><span id="hpClk">${clock(b)}</span><small>${b.kind==='de'?'Period '+(b.per||1):'Pool bout'}</small></div>
        <div class="player"><small>${esc(b.fb.club||'')}</small><b>${esc(b.fb.name)}</b><div class="pts">${b.sb}</div><div class="hp-cards">${cards(b.cb)}</div></div></div>
       <div class="hp-foot"><span>${L.length>1?`${L.length} bouts live now`:'Updates by itself — no refresh needed'}</span><a href="#/live" class="hp-go">Open Live Centre ➜</a></div>`}
    else{const k=$('#hpClk');k&&(k.textContent=clock(L[0].b))}return}
  /* video mode */
  const V=C.get('videos').filter(v=>ytIdH(v.url)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))),today=new Date().toISOString().slice(0,10);
  const nxt=evs().find(e=>(e.end||e.start)>=today),site=C.site()||{},key='V'+V.map(v=>ytIdH(v.url)).join()+(nxt?nxt.id+nxt.start:'')+(site.youtube||'');
  if(box.dataset.k===key)return;if(box.querySelector('iframe'))return;/* don't interrupt a playing video */
  box.dataset.k=key;box.dataset.m='video';
  const nextStrip=nxt?`<a class="hp-next" href="#/live"><span class="hp-ld" aria-hidden="true"></span><span><small>Next live scoring</small><b>${esc(nxt.title)}</b><em>${fmtD(nxt.start)}${nxt.venue?' · '+esc(nxt.venue):''}</em></span><i>➜</i></a>`:'';
  if(V.length){const f=V[0],rest=V.slice(1,nxt?3:4);
    box.innerHTML=`<button type="button" class="hp-feat" data-hpyt="${ytIdH(f.url)}" aria-label="Play ${esc(f.title)}"><img src="https://i.ytimg.com/vi/${ytIdH(f.url)}/hqdefault.jpg" alt="" loading="lazy" data-rmerr><span class="hp-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="hp-cap"><b>${esc(f.title)}</b>${f.date?`<small>${fmtD(f.date)}</small>`:''}</span></button>
      ${rest.length?`<div class="hp-list">${rest.map(v=>`<button type="button" class="hp-mini" data-hpyt="${ytIdH(v.url)}"><span class="hp-th"><img src="https://i.ytimg.com/vi/${ytIdH(v.url)}/mqdefault.jpg" alt="" loading="lazy" data-rmerr><i aria-hidden="true">▶</i></span><span><b>${esc(v.title)}</b>${v.date?`<small>${fmtD(v.date)}</small>`:''}</span></button>`).join('')}</div>`:''}
      <div class="hp-foot"><a href="#/media/videos" class="hp-go">All videos ➜</a>${site.youtube?`<a href="${esc(site.youtube)}" target="_blank" rel="noopener" class="hp-go">YouTube channel ↗</a>`:''}</div>${nextStrip}`}
  else{const days=nxt?Math.ceil((Date.parse(nxt.start)-Date.parse(today))/864e5):null;
    box.innerHTML=`<div class="hp-empty"><div class="hp-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg></div>
      ${nxt?`<small>Next live scoring</small><b>${esc(nxt.title)}</b><p>${fmtD(nxt.start)}${nxt.venue?' · '+esc(nxt.venue):''}</p>${days>0?`<div class="hp-cd"><b>${days}</b> ${days===1?'day':'days'} to go</div>`:'<div class="hp-cd"><b>Today</b></div>'}`:'<b>Live scores & highlight videos</b><p>During AFAGS events every bout is scored live here and in the Live Centre.</p>'}
      <div class="hp-btns"><a href="#/live" class="hp-go">Live Centre ➜</a><a href="#/media/videos" class="hp-go">Video Gallery ➜</a>${site.youtube?`<a href="${esc(site.youtube)}" target="_blank" rel="noopener" class="hp-go">YouTube ↗</a>`:''}</div></div>`}}
function hpClick(e){const b=e.target.closest('[data-hpyt]');if(!b)return;const id=b.dataset.hpyt,box=$('#hpPanel');const f=box.querySelector('.hp-feat');
  const ifr=`<div class="hp-vid"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  if(f)f.outerHTML=ifr;else{const v=box.querySelector('.hp-vid');v?v.outerHTML=ifr:box.insertAdjacentHTML('afterbegin',ifr)}}

/* ---------- Live Centre page ---------- */
function poolTable(c,p,pi){const F=p.f.map(id=>fzF(c,id)),n=F.length,res=poolResults(c,p);
  const cell=(i,j)=>{if(i===j)return '<td class="x"></td>';const b=p.bouts.find(x=>(x.a===p.f[i]&&x.b===p.f[j])||(x.a===p.f[j]&&x.b===p.f[i]));if(!b||b.st!=='done')return `<td>${b&&b.st==='live'?'<i class="lv">●</i>':''}</td>`;const mine=b.a===p.f[i]?b.sa:b.sb,won=(b.w==='a'&&b.a===p.f[i])||(b.w==='b'&&b.b===p.f[i]);return `<td class="${won?'v':'d'}">${won?'V':''}${mine}</td>`};
  return `<div class="lc-pool"><h4>Pool ${pi+1}${p.piste?` · Piste ${esc(p.piste)}`:''}</h4><div class="lc-scroll"><table class="lc-mx"><thead><tr><th></th><th></th>${F.map((f,i)=>`<th>${i+1}</th>`).join('')}<th>V</th><th>Ind</th><th>Rank</th></tr></thead><tbody>${F.map((f,i)=>{const r=res.find(x=>x.id===p.f[i])||{};return `<tr><th>${i+1}</th><td class="nm">${esc(f?f.name:'?')}<small>${esc(f&&f.club||'')}</small></td>${F.map((g,j)=>cell(i,j)).join('')}<td><b>${r.v??''}</b></td><td>${r.ind!=null?(r.ind>0?'+':'')+r.ind:''}</td><td>${r.rank||''}</td></tr>`}).join('')}</tbody></table></div></div>`}
function poolResults(c,p){const R=p.f.map(id=>({id,v:0,m:0,ts:0,tr:0}));p.bouts.forEach(b=>{if(b.st!=='done')return;const A=R.find(x=>x.id===b.a),B=R.find(x=>x.id===b.b);if(!A||!B)return;A.m++;B.m++;A.ts+=b.sa;A.tr+=b.sb;B.ts+=b.sb;B.tr+=b.sa;(b.w==='a'?A:B).v++});
  R.forEach(r=>{r.ind=r.ts-r.tr;r.vm=r.m?r.v/r.m:0});R.sort((a,b)=>b.vm-a.vm||b.ind-a.ind||b.ts-a.ts);R.forEach((r,i)=>r.rank=i+1);return R}
function bracketHTML(c){const de=c.de;if(!de||!de.r)return '<p class="v3-muted">The direct-elimination tableau has not started yet.</p>';
  return `<div class="lc-br">${de.r.map((round,ri)=>`<div class="lc-col"><h5>${roundName(de.size>>ri)}</h5>${round.map((b,bi)=>{const [a,bb]=deSlots(c,ri,bi),fa=fzF(c,a),fb=fzF(c,bb);const row=(f,s,win)=>`<div class="lc-s ${win?'w':''}"><span>${f?esc(f.name):'<i>—</i>'}</span><b>${b&&(b.st==='done'||b.st==='live')&&f?s:''}</b></div>`;
    return `<div class="lc-m ${b&&b.st==='live'?'live':''}">${row(fa,b?b.sa:'',b&&b.st==='done'&&b.w==='a')}${row(fb,b?b.sb:'',b&&b.st==='done'&&b.w==='b')}</div>`}).join('')}</div>`).join('')}</div>`}
function finalRanking(c){return (c.final||[]).map(x=>({...x,f:fzF(c,x.id)}))}
function scoreCard(c,b){const card=(L)=>(L||[]).map(x=>`<i class="cd ${x}"></i>`).join('');return `<div class="lc-live"><div class="lc-lh"><span>${esc(c.name)}</span><span>${b.kind==='de'?esc(b.label):'Pool '+(b.pool+1)}${b.piste?' · Piste '+esc(b.piste):''}</span></div>
  <div class="lc-sb"><div class="lc-f a"><small>${esc(b.fa.club||'')}</small><b>${esc(b.fa.name)}</b><div>${card(b.ca)}</div></div><div class="lc-sc"><span>${b.sa}</span><em>${clock(b)}</em><span>${b.sb}</span></div><div class="lc-f b"><small>${esc(b.fb.club||'')}</small><b>${esc(b.fb.name)}</b><div>${card(b.cb)}</div></div></div><div class="lc-per">Period ${b.per||1}${b.pri?` · Priority: ${b.pri==='a'?esc(b.fa.name):esc(b.fb.name)}`:''}${b.run?' · ⏱ running':''}</div></div>`}
P['live']=(q)=>{const data=liveData(),comps=(data.comps||[]).slice().sort((a,b)=>(a.status==='done')-(b.status==='done')||String(b.date||'').localeCompare(String(a.date||'')));const sel=new URLSearchParams(q||'').get('c');
  const c=comps.find(x=>x.id===sel)||comps.find(x=>x.status!=='done'&&x.status!=='setup')||comps[0];
  const stream=(()=>{const ev=c&&C.get('events').find(e=>e.id===c.eventId);const m=c&&/(?:youtu\.be\/|v=|embed\/|live\/)([\w-]{11})/.exec((c.stream||'')||(ev&&ev.stream)||'');return m?`<div class="v3-vid" style="margin-bottom:14px"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Live stream" allow="encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`:''})();
  if(!c){const up=upcomingEvents().slice(0,3);return {title:'Live Centre',lead:'Live scores from AFAGS competitions — pools, tableau and final results update automatically.',html:`<div class="v3-card lc-none"><div style="font-size:42px">🤺</div><h3>No competition is running right now</h3><p class="v3-muted">When an AFAGS event starts, every bout appears here live.</p>${up.length?`<h4 style="margin-top:14px">Coming up</h4><ul class="lc-up">${up.map(e=>`<li><b>${esc(e.title)}</b> · ${range(e.start,e.end)} · ${esc(e.venue||'')}</li>`).join('')}</ul>`:''}</div>`}}
  const live=boutsOf(c).filter(b=>b.st==='live'&&b.fa&&b.fb);
  const html=`${comps.length>1?`<div class="v3-seg lc-tabs">${comps.map(x=>`<a href="#/live?c=${esc(x.id)}" class="${x.id===c.id?'on':''}">${esc(x.name)}${x.status!=='done'&&x.status!=='setup'?' <i class="lv">●</i>':''}</a>`).join('')}</div>`:''}
   <div class="lc-head"><div><h2>${esc(c.name)}</h2><p class="v3-muted">${esc([c.weapon,c.gender&&c.gender!=='Mixed'?c.gender:'',c.cat,c.venue].filter(Boolean).join(' · '))}${c.date?' · '+(c.end&&c.end!==c.date?range(c.date,c.end):fmtD(c.date)):''}${c.time?' · '+esc(c.time):''}</p>${c.org?`<p class="v3-muted" style="font-size:13px">Organiser: ${esc(c.org)}</p>`:''}</div><span class="v3-chip ${c.status==='done'?'':'c-green'}">${{setup:'Starting soon',pools:'Pools in progress',de:'Direct elimination',done:'Final results'}[c.status]||''}</span></div>
   ${c.notice?`<div class="lc-notice">📢 ${esc(c.notice)}</div>`:''}${stream}<div id="lcLive">${live.length?`<div class="lc-grid">${live.map(b=>scoreCard(c,b)).join('')}</div>`:c.status!=='done'?'<p class="v3-muted">No bout is on the piste at this moment.</p>':''}</div>
   ${c.status==='done'?`<div class="v3-card"><h3>🏆 Final ranking</h3><ol class="lc-final">${finalRanking(c).map(x=>`<li><span class="rk">${x.rank}</span><b>${esc(x.f?x.f.name:'')}</b><small>${esc(x.f&&x.f.club||'')}</small></li>`).join('')}</ol></div>`:''}
   ${c.de&&c.de.r?`<div class="v3-card"><h3>Direct elimination</h3>${bracketHTML(c)}</div>`:''}
   ${(c.pools||[]).length?`<div class="v3-card"><h3>Pools</h3><div class="lc-pools">${c.pools.map((p,i)=>poolTable(c,p,i)).join('')}</div></div>`:''}
   <p class="v3-muted" style="font-size:12px">Updates automatically every few seconds. Scores are entered by the referee / table official on the AFAGS scoring app.</p>`;
  return {title:'Live Centre',lead:'Live scores from AFAGS competitions — pools, tableau and final results update automatically.',html}};
TITLES['live']=['Calendar','Live Centre'];
{const cal=NAV.find(x=>x.k==='calendar');if(cal&&!cal.items.some(i=>i[0]==='live'))cal.items.splice(1,0,['live','Live Centre'])}
/* the calendar sub-menu link uses #/calendar/live — send it to #/live */
P['calendar/live']=()=>{setTimeout(()=>{location.replace('#/live')},0);return {lead:'',html:''}};
TITLES['calendar/live']=['Calendar','Live Centre'];

/* ---------- Event entry (online) ---------- */
function myMembers(){const apps=LS('afags_apps',[]),dec=LS('afags_dec',{}),ids=LS('afags_ids',{}),fl=LS('afags_flags',{});return apps.filter(a=>dec[a.ref]==='Approved'&&ids[a.ref]).map(a=>({ref:a.ref,id:ids[a.ref],name:a.name,district:a.district,type:a.type,key:a.key,dob:(a.V||{}).dob,mobile:a.mobile||(a.V||{}).mobile,email:(a.V||{}).email,weapon:a.weapon,cat:a.cat,photo:((a.files||{}).photo||{}).thumb,renewed:(fl[a.ref]||{}).renewed,app:a}))}
async function findMember(id,dob){id=String(id||'').trim().toUpperCase();if(window.AFAGS_API&&AFAGS_API.online){const j=await AFAGS_API.call('POST','/me',{id,dob});return j.me?{...j.me,bundle:j}:null}
  return myMembers().find(m=>m.id.toUpperCase()===id&&m.dob===dob)||null}
function catFor(dob){const d=D(dob);if(!d)return '';const y=new Date().getFullYear()-d.getFullYear();return y<10?'U-10':y<12?'U-12':y<14?'U-14':y<17?'U-17':y<20?'U-20':'Senior'}
const CATS=['U-10','U-12','U-14','U-17','U-20','Senior'];
P['calendar/entry']=(q)=>{const id=new URLSearchParams(q||'').get('e');const ev=C.get('events').find(e=>e.id===id);const open=upcomingEvents().filter(entriesOpen);
  if(!ev)return {title:'Event Entry',lead:'Enter AFAGS tournaments online.',html:open.length?`<div class="v3-grid2">${open.map(e=>`<div class="v3-card"><span class="v3-chip c-green">Entries open${e.regClose?' till '+shortD(e.regClose):''}</span><h3>${esc(e.title)}</h3><p class="v3-muted">${range(e.start,e.end)} · ${esc(e.venue||'')}</p><a class="v3-btn" href="#/calendar/entry?e=${encodeURIComponent(e.id)}">Enter now ›</a></div>`).join('')}</div>`:empty('No event is open for entries right now.','<a class="v3-btn" href="#/calendar/all">See the calendar</a>')};
  if(!entriesOpen(ev))return {title:esc(ev.title),lead:'Event entry',html:empty('Entries for this event are closed.','<a class="v3-btn" href="#/calendar/all">See the calendar</a>')};
  const weapons=String(ev.weapons||'Foil, Épée, Sabre').split(/[,/]+/).map(x=>x.trim()).filter(x=>/foil|[ée]p[ée]e|sabre/i.test(x)),fee=parseInt(ev.fee)||0;
  return {title:'Enter — '+ev.title,lead:`${range(ev.start,ev.end)} · ${esc(ev.venue||'')}${ev.regClose?' · Entries close '+fmtD(ev.regClose):''}`,html:`<div class="v3-grid2"><form class="v3-card v3-form" id="enF" novalidate><h3>1. Your AFAGS membership</h3>${HP}
   <div class="v3-f2"><label>AFAGS ID *<input name="id" required placeholder="AFAGS/FEN/2026/0001" maxlength="30"></label><label>Date of birth *<input name="dob" type="date" required></label></div><div id="enMe"></div>
   <h3 style="margin-top:14px">2. Events</h3><div class="en-w">${weapons.map(w=>`<label class="v3-chk"><input type="checkbox" name="w" value="${esc(w)}"> ${esc(w)}</label>`).join('')}</div>
   <label>Category *<select name="cat" required><option value="">Select…</option>${CATS.map(c=>`<option>${c}</option>`).join('')}</select></label><small class="v3-muted">Your own age category is chosen automatically; you may also enter an older category if the rules allow.</small>
   <label class="v3-chk"><input type="checkbox" name="ok" required> I confirm that I am fit to compete, hold valid FIE-standard equipment and accept the AFAGS competition rules.</label>
   <div class="en-fee" id="enFee"></div><button class="v3-btn" id="enGo">Continue</button><div class="v3-fmsg"></div></form>
   <div class="v3-card"><h3>How entry works</h3><ol class="v3-steps"><li>Type your AFAGS ID and date of birth — we check your membership.</li><li>Choose your weapon(s) and category.</li><li>${fee?`Pay the entry fee (₹${fee} per weapon) online.`:'Entry to this event is free.'}</li><li>You get an entry number. Your name appears in the competition list on the Live Centre.</li></ol><p class="v3-muted">Not a member yet? <a href="#/fencers/guidelines">Register first</a>. Membership expired? <a href="#/fencers/renew">Renew</a>.</p></div></div>`,
  after(){const f=$('#enF');let me=null;const upd=()=>{const n=$$('#enF [name=w]:checked').length;$('#enFee').innerHTML=fee?`<b>Entry fee: ₹${(fee*n).toLocaleString('en-IN')}</b> <small>(₹${fee} × ${n} weapon${n===1?'':'s'})</small>`:'<b>Free entry</b>'};$$('#enF [name=w]').forEach(x=>x.onchange=upd);upd();
    const look=async()=>{const id=f.id.value.trim(),dob=f.dob.value;if(!id||!dob)return;$('#enMe').innerHTML='<p class="v3-muted">Checking…</p>';try{me=await findMember(id,dob)}catch(e){me=null}
      if(!me){$('#enMe').innerHTML='<div class="v3-err">No accredited member found with this AFAGS ID and date of birth.</div>';return}
      if(me.status==='Blocked'){me=null;$('#enMe').innerHTML='<div class="v3-err">This AFAGS ID is blocked. Please contact the AFAGS office.</div>';return}
      $('#enMe').innerHTML=`<div class="v3-ok">✅ <b>${esc(me.name)}</b> · ${esc(me.district||'')}${me.renewed===false?' · <span style="color:#c62828">membership not renewed for this season — <a href="#/fencers/renew">renew</a></span>':''}</div>`;const c=catFor(me.dob);if(c&&!f.cat.value)f.cat.value=c};
    f.id.onchange=look;f.dob.onchange=look;
    f.onsubmit=async e=>{e.preventDefault();const msg=f.querySelector('.v3-fmsg');msg.textContent='';if(f.website.value)return;if(!me){await look();if(!me){msg.textContent='Check your AFAGS ID and date of birth.';return}}
      const ws=$$('#enF [name=w]:checked').map(x=>x.value);if(!ws.length){msg.textContent='Choose at least one weapon.';return}if(!f.cat.value){msg.textContent='Choose a category.';return}if(!f.ok.checked){msg.textContent='Please accept the declaration.';return}
      const own=catFor(me.dob);if(own&&CATS.indexOf(f.cat.value)<CATS.indexOf(own)){msg.textContent=`You cannot enter a younger category than your own (${own}).`;return}
      const E=LS('afags_entries',[]);const dup=ws.filter(w=>E.some(x=>x.eventId===ev.id&&x.afagsId===me.id&&x.weapon===w&&x.status!=='Cancelled'));if(dup.length){msg.textContent='Already entered for: '+dup.join(', ');return}
      let payment=null;const amt=fee*ws.length;
      if(amt){if(window.AFAGS_API&&AFAGS_API.online&&AFAGS_API.cfg.payments){try{payment=await AFAGS_API.pay({amount:amt,purpose:'Entry · '+ev.title,ref:me.id,name:me.name,email:me.email,mobile:me.mobile})}catch(x){msg.textContent=x.message||'Payment failed';return}}
        else{const ok=await new Promise(r=>{const {m,close}=modal(`<h3>Pay entry fee</h3><p>Amount: <b>₹${amt.toLocaleString('en-IN')}</b></p><div class="v3-sample">🧪 Demo checkout — no money is charged. On the AFAGS server this opens Razorpay (UPI / card / net banking).</div><div class="v3-cta"><button class="v3-btn" id="dPay">Pay ₹${amt}</button><button class="v3-btn ghost" id="dCan">Cancel</button></div>`);m.querySelector('#dPay').onclick=()=>{close();r(true)};m.querySelector('#dCan').onclick=()=>{close();r(false)}});
          if(!ok){msg.textContent='Payment cancelled — entry not submitted.';return}payment={amount:amt,txn:'DEMO'+Date.now().toString(36).toUpperCase(),method:'Demo checkout',at:Date.now()}}}
      const no='ENT-'+Date.now().toString(36).toUpperCase();const rows=ws.map((w,i)=>({id:no+'-'+(i+1),no,eventId:ev.id,event:ev.title,afagsId:me.id,name:me.name,district:me.district||'',weapon:w,category:f.cat.value,fee:fee,payment:i===0?payment:null,at:Date.now(),status:'Confirmed'}));
      if(window.AFAGS_API&&AFAGS_API.online){try{await AFAGS_API.call('POST','/entries',{rows,dob:me.dob})}catch(x){msg.textContent=x.message||'Could not save the entry';return}}
      const L=LS('afags_entries',[]);try{(window.AFAGS_API?AFAGS_API.put:((k,v)=>localStorage.setItem(k,JSON.stringify(v))))('afags_entries',JSON.stringify(rows.concat(L)))}catch(x){}
      $('#enF').outerHTML=`<div class="v3-card"><h3>✅ Entry confirmed</h3><p>Entry number <b>${no}</b></p><p>${esc(me.name)} · ${ws.map(esc).join(', ')} · ${esc(f.cat.value)}</p>${payment?`<p>Paid ₹${payment.amount} · ${esc(payment.txn)}</p>`:''}<p class="v3-muted">Keep this number. Your name will appear in the competition list on the Live Centre.</p><a class="v3-btn" href="#/fencers/my">Go to My AFAGS</a></div>`}}}};
TITLES['calendar/entry']=['Calendar','Event Entry'];
{const cal=NAV.find(x=>x.k==='calendar');if(cal&&!cal.items.some(i=>i[0]==='entry'))cal.items.splice(2,0,['entry','Event Entry'])}

/* ---------- My AFAGS: fencer self-service ---------- */
function myBundle(me){const id=me.id.toUpperCase();if(me.bundle)return me.bundle;
  const certs=[];(LS('afags_certb',[])||[]).forEach(b=>(b.rows||[]).forEach(r=>{if(!r.held&&String(r.afagsId||'').toUpperCase()===id)certs.push({t:b.tournament,date:b.date,end:b.end,venue:b.venue,organizer:b.organizer,no:r.no,position:r.position,weapon:r.weapon,category:r.category})}));
  const results=(LS('afags_rankpts',[])||[]).filter(x=>String(x.afagsId||'').toUpperCase()===id);const entries=(LS('afags_entries',[])||[]).filter(x=>String(x.afagsId||'').toUpperCase()===id);return {certs,results,entries}}
function idCardHTML(me){return `<div class="my-id"><div class="my-idh"><b>AMATEUR FENCING ASSOCIATION OF GUJARAT STATE</b><small>Affiliated to the Fencing Association of India</small></div><div class="my-idb">${me.photo?`<img src="${me.photo}" alt="">`:`<span class="my-ini">${esc(me.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`}<div><small>${esc((me.type||'Member').toUpperCase())}</small><h3>${esc(me.name)}</h3><dl><dt>AFAGS ID</dt><dd class="idn">${esc(me.id)}</dd><dt>District</dt><dd>${esc(me.district||'')}</dd>${me.weapon&&me.weapon!=='—'?`<dt>Weapon</dt><dd>${esc(me.weapon)}</dd>`:''}<dt>Season</dt><dd>${(y=>y+'–'+String(y+1).slice(2))(new Date().getMonth()>=3?new Date().getFullYear():new Date().getFullYear()-1)}</dd></dl></div><div class="my-qr" id="myQr"></div></div></div>`}
P['fencers/my']=()=>({title:'My AFAGS',lead:'Your membership, digital ID card, entries, results and certificates in one place.',html:`<div id="myBox"><form class="v3-card v3-form" id="myF" novalidate style="max-width:560px"><h3>Sign in</h3><div class="v3-f2"><label>AFAGS ID *<input name="id" required placeholder="AFAGS/FEN/2026/0001" maxlength="30" autocomplete="username"></label><label>Date of birth *<input name="dob" type="date" required></label></div><button class="v3-btn">Open My AFAGS</button><div class="v3-fmsg"></div><p class="v3-muted" style="font-size:12.5px">Your AFAGS ID is on your ID card and in the approval message. Lost it? <a href="#/fencers/verify">Verify</a> or <a href="#/contact/us">contact AFAGS</a>.</p></form></div>`,
  after(){const f=$('#myF');f.onsubmit=async e=>{e.preventDefault();const msg=f.querySelector('.v3-fmsg');msg.textContent='Checking…';let me=null;try{me=await findMember(f.id.value,f.dob.value)}catch(x){}
    if(!me){msg.textContent='No accredited member found with this AFAGS ID and date of birth.';return}const B=myBundle(me),mon=n=>'₹'+(n||0).toLocaleString('en-IN');
    const pts=B.results.reduce((s,x)=>s+(+x.pts||0),0);
    $('#myBox').innerHTML=`<div class="my-top"><div>${idCardHTML(me)}<div class="v3-cta"><button class="v3-btn" id="myPrint">🖨 Print / save ID card</button><button class="v3-btn ghost" id="myOut">Sign out</button></div></div>
     <div class="v3-card"><h3>Membership</h3><dl class="my-dl"><dt>Status</dt><dd>${me.status==='Blocked'?'<b style="color:#c62828">Blocked</b>':'<b style="color:#1f8f3f">Accredited</b>'}</dd><dt>Season</dt><dd>${me.renewed===false?'Not renewed — <a href="#/fencers/renew">renew now</a>':'Valid'}</dd><dt>Ranking points</dt><dd>${pts}</dd><dt>Events entered</dt><dd>${B.entries.length}</dd><dt>Certificates</dt><dd>${B.certs.length}</dd></dl><a class="v3-btn sm" href="#/calendar/entry">Enter an event</a></div></div>
     <div class="v3-grid2"><div class="v3-card"><h3>My entries</h3>${B.entries.length?`<ul class="my-ul">${B.entries.map(x=>`<li><b>${esc(x.event)}</b><small>${esc(x.weapon)} · ${esc(x.category)} · ${esc(x.no||x.id)}${x.payment?' · paid '+mon(x.payment.amount):''}</small></li>`).join('')}</ul>`:'<p class="v3-muted">No entries yet.</p>'}</div>
     <div class="v3-card"><h3>My results</h3>${B.results.length?`<ul class="my-ul">${B.results.map(x=>`<li><b>${esc(x.event)}</b><small>${esc(x.weapon||'')} ${esc(x.category||'')} · ${x.pts} pts${x.date?' · '+fmtD(x.date):''}</small></li>`).join('')}</ul>`:'<p class="v3-muted">Results appear here after AFAGS publishes them.</p>'}</div></div>
     <div class="v3-card"><h3>My certificates</h3>${B.certs.length?`<table class="v3-tbl"><thead><tr><th>Tournament</th><th>Type</th><th>Cert. no.</th><th></th></tr></thead><tbody>${B.certs.map((c,i)=>`<tr><td>${esc(c.t)}</td><td>${c.position?esc(c.position):'Participation'}</td><td><small>${esc(c.no)}</small></td><td><button class="v3-btn sm ghost" data-ct="${i}">View</button></td></tr>`).join('')}</tbody></table>`:'<p class="v3-muted">No certificates yet.</p>'}</div>`;
    try{if(window.AFAGS_QR){const u=(C.site().siteUrl||location.href.split('#')[0]).replace(/\/?$/,'/')+'#/fencers/verify?id='+encodeURIComponent(me.id);$('#myQr').innerHTML=AFAGS_QR.svg(u,{size:96})}}catch(x){}
    $('#myOut').onclick=()=>render();$('#myPrint').onclick=()=>{const w=document.createElement('div');w.id='myPrintBox';w.innerHTML=$('.my-id').outerHTML;document.body.appendChild(w);document.body.classList.add('my-printing');setTimeout(()=>{print();w.remove();document.body.classList.remove('my-printing')},80)};
    $$('[data-ct]').forEach(b=>b.onclick=()=>{const c=B.certs[+b.dataset.ct],V=(me.app&&me.app.V)||{},merit=/gold|silver|bronze|1st|2nd|3rd|first|second|third/i.test(c.position||'');
      const base=(((C.site()||{}).siteUrl)||location.href.split('#')[0]).replace(/\/?$/,'/');let qr='';try{qr=AFAGS_QR.svg(base+'#/fencers/verify?q='+encodeURIComponent(c.no),{size:105})}catch(x){}
      const d={kind:merit?'merit':'participation',no:c.no,idLabel:(V.faiId||me.faiId)?'FAI ID':'AFAGS ID',idValue:V.faiId||me.faiId||me.id,name:me.name,dob:me.dob||V.dob,parent:me.parent||V.father||V.mother||V.guardian||'',district:me.district,
        tournament:c.t,date:c.date,end:c.end,venue:c.venue,organizer:c.organizer||'Amateur Fencing Association of Gujarat State',medal:c.position,event:AFAGS_CERT.eventLine(me.gender||V.gender||'',c.weapon,String(c.t||'').toLowerCase().includes(String(c.category||'').toLowerCase())?'':c.category),
        photo:me.photo||'',qr,logo:'<span class="logo-img" role="img" aria-label="AFAGS logo"></span>'};
      const {m}=modal(`<div class="afc-box" id="myCertBox">${AFAGS_CERT.html(d)}</div><div class="v3-cta"><button class="v3-btn" id="myCertPr">🖨 Print / Save as PDF</button></div><p class="v3-muted" style="text-align:center;font-size:12.5px">A4 landscape. Choose “Save as PDF” in the print window to download.</p>`,'my-certw');
      const box=m.querySelector('#myCertBox'),fit=()=>AFAGS_CERT.fit(box);requestAnimationFrame(fit);setTimeout(fit,120);
      m.querySelector('#myCertPr').onclick=()=>{const w=document.createElement('div');w.id='myPrintBox';w.className='afc-print';w.innerHTML=AFAGS_CERT.html(d);document.body.appendChild(w);document.body.classList.add('my-printing');setTimeout(()=>{print();w.remove();document.body.classList.remove('my-printing')},120)}})}}});
TITLES['fencers/my']=['Fencers','My AFAGS'];
{const fz2=NAV.find(x=>x.k==='fencers');if(fz2&&!fz2.items.some(i=>i[0]==='my'))fz2.items.unshift(['my','My AFAGS'])}

/* ---------- seasonal rankings with points history ---------- */
const seasonOf=d=>{const x=D(d);if(!x)return '';const y=x.getMonth()>=3?x.getFullYear():x.getFullYear()-1;return y+'–'+String(y+1).slice(2)};
P['results/rankings']=(q)=>{const P2=LS('afags_rankpts',[])||[],W=['Foil','Épée','Sabre'];
  if(!P2.length){/* fall back to medal table from published results */const pts={},PT={gold:32,silver:26,bronze1:20,bronze2:20},LM={State:1,National:2,International:3};C.get('results').forEach(r=>Object.keys(PT).forEach(k=>{const n=(r[k]||'').trim();if(!n||n==='—')return;P2.push({name:n.replace(/\s*\(.*\)$/,''),district:(/\((.*)\)/.exec(n)||[])[1]||'',weapon:r.weapon,category:r.category,event:r.event,date:r.date,pts:PT[k]*(LM[r.level]||1)})}))}
  const seasons=[...new Set(P2.map(x=>seasonOf(x.date)).filter(Boolean))].sort().reverse(),qs=new URLSearchParams(q||''),sea=qs.get('s')||seasons[0]||'',cat=qs.get('c')||'';
  const cats=[...new Set(P2.map(x=>x.category).filter(Boolean))];const L=P2.filter(x=>(!sea||seasonOf(x.date)===sea)&&(!cat||x.category===cat));
  const agg={};L.forEach(x=>{const w=W.find(y=>y.toLowerCase()===String(x.weapon||'').toLowerCase().replace('epee','épée'))||x.weapon||'Foil';const k=w+'|'+(x.afagsId||x.name);const a=agg[k]=agg[k]||{w,name:x.name,id:x.afagsId,district:x.district,pts:0,ev:[]};a.pts+=+x.pts||0;a.ev.push(x)});
  V5.rank=agg;
  return {lead:'Season rankings from AFAGS results. Points: 1st 32 · 2nd 26 · 3rd 20 · 5th–8th 14 · others 4 — ×1 State, ×2 National, ×3 International.',html:`<form class="v3-bar rk-f" id="rkF"><label>Season <select name="s">${seasons.map(s=>`<option ${s===sea?'selected':''}>${s}</option>`).join('')||'<option>—</option>'}</select></label><label>Category <select name="c"><option value="">All</option>${cats.map(c=>`<option ${c===cat?'selected':''}>${esc(c)}</option>`).join('')}</select></label></form>
   <div class="v3-grid3">${W.map(w=>{const R=Object.entries(agg).filter(([k])=>k.startsWith(w+'|')).sort((a,b)=>b[1].pts-a[1].pts);return `<div class="v3-card"><h3>${w}</h3>${R.length?`<ol class="v3-rank">${R.slice(0,30).map(([k,a],i)=>`<li><span>${i+1}</span><b><button type="button" class="rk-n" data-rk="${esc(k)}">${esc(a.name)}</button><small>${esc(a.district||'')}</small></b><em>${a.pts} pts</em></li>`).join('')}</ol>`:'<p class="v3-muted">No results yet.</p>'}</div>`}).join('')}</div><div class="v3-cta"><button class="v3-btn ghost" type="button" id="rkCsv">⬇ Download rankings (CSV)</button></div>`,
   after(){const f=$('#rkF');f.onchange=()=>{location.hash='#/results/rankings?s='+encodeURIComponent(f.s.value)+'&c='+encodeURIComponent(f.c.value)};
    $('#rkCsv').onclick=()=>{const rows=[['Season','Weapon','Rank','Name','District','Points']];W.forEach(w=>Object.entries(agg).filter(([k])=>k.startsWith(w+'|')).sort((a,b)=>b[1].pts-a[1].pts).forEach(([k,a],i)=>rows.push([sea,w,i+1,a.name,a.district||'',a.pts])));csv(rows,'afags-rankings.csv')};
    $$('[data-rk]').forEach(b=>b.onclick=()=>{const a=agg[b.dataset.rk];const ev=a.ev.slice().sort((x,y)=>String(x.date).localeCompare(String(y.date)));let cum=0;const pts=ev.map(x=>cum+=(+x.pts||0)),mx=Math.max(1,...pts),W2=520,H=160;
      const xy=pts.map((p,i)=>[ev.length===1?W2/2:20+i*(W2-40)/(ev.length-1),H-20-(p/mx)*(H-40)]);
      modal(`<h3>${esc(a.name)}</h3><p class="v3-muted">${esc(a.w)} · ${esc(a.district||'')} · ${a.pts} pts this season</p><svg viewBox="0 0 ${W2} ${H}" class="rk-g" role="img" aria-label="Points over the season"><polyline fill="none" stroke="#f47b20" stroke-width="3" points="${xy.map(p=>p.join(',')).join(' ')}"/>${xy.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#0b2257"><title>${esc(ev[i].event)}: +${ev[i].pts}</title></circle>`).join('')}</svg><table class="v3-tbl"><thead><tr><th>Event</th><th>Date</th><th>Points</th></tr></thead><tbody>${ev.map(x=>`<tr><td>${esc(x.event)}</td><td>${fmtD(x.date)}</td><td>+${x.pts}</td></tr>`).join('')}</tbody></table>`)})}}};

/* ---------- refresh loop ---------- */
function v5Home(){if($('#homeView')&&!$('#homeView').hidden){homeNews();homeEvents();heroKicker();homeNumbers()}footerClean();homeLive()}
v5Home();
addEventListener('storage',e=>{if(!e.key||/^afags_(cms_|site|live|entries)/.test(e.key)){v5Home();if(location.hash.startsWith('#/live')&&e.key==='afags_live')render()}});
addEventListener('message',e=>{const d=e.data||{};if(d.afags==='cms'||d.afags==='live'){v5Home();if(location.hash.startsWith('#/live'))render()}});
addEventListener('hashchange',()=>setTimeout(v5Home,50));
/* live polling: server SSE when online, otherwise read localStorage */
setInterval(()=>{homeLive();const box=$('#lcLive');if(box&&location.hash.startsWith('#/live')){const id=new URLSearchParams(location.hash.split('?')[1]||'').get('c');const data=liveData();const c=(data.comps||[]).find(x=>x.id===id)||(data.comps||[]).find(x=>x.status!=='done'&&x.status!=='setup');if(c){const live=boutsOf(c).filter(b=>b.st==='live'&&b.fa&&b.fb);box.innerHTML=live.length?`<div class="lc-grid">${live.map(b=>scoreCard(c,b)).join('')}</div>`:(c.status!=='done'?'<p class="v3-muted">No bout is on the piste at this moment.</p>':'')}}},1000);
(function liveSync(){if(!window.AFAGS_API)return;AFAGS_API.ready.then(on=>{if(!on)return;let last='';const pull=()=>AFAGS_API.call('GET','/live').then(j=>{const v=JSON.stringify(j.live||{comps:[]});if(v!==last){last=v;AFAGS_API.put('afags_live',v);v5Home();if(location.hash.startsWith('#/live'))render()}}).catch(()=>{});
  pull();try{const es=new EventSource('/api/live/stream');es.onmessage=()=>pull();es.onerror=()=>{}}catch(e){}setInterval(pull,15000)})})();
/* print buttons without inline handlers (strict CSP) */
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-print]'))window.print()});
/* image fallbacks without inline handlers (strict CSP): data-ph → mark the holder when the photo loads, data-rmerr → drop broken images */
(()=>{const ok=i=>{if(i.matches('img[data-ph]'))i.parentNode&&i.parentNode.classList.add('has')},bad=i=>{if(i.matches('img[data-ph],img[data-rmerr]'))i.remove()};
  document.addEventListener('load',e=>{e.target.tagName==='IMG'&&ok(e.target)},true);document.addEventListener('error',e=>{e.target.tagName==='IMG'&&bad(e.target)},true);
  const sweep=()=>document.querySelectorAll('img[data-ph],img[data-rmerr]').forEach(i=>{if(i.complete)(i.naturalWidth?ok(i):bad(i))});sweep();addEventListener('load',sweep)})();
/* ===== Liquid "Waterline" dock — vanilla port of Nimbus UI Liquid Navbar (by guglielmogiannattasio.it) =====
   A pill of water under the phone dock: the active drop stretches toward the tapped item, splits into droplets on
   long jumps and merges back with a ripple; each icon plays its own little scene. WebGL water (paused off-screen),
   CSS drop fallback without WebGL. Follows the page: Home / Events / Live / Login / Contact. */
(()=>{const nav=document.getElementById('dock');if(!nav||nav.dataset.lq)return;nav.dataset.lq='1';
const PAD=14,FX=['glow','spin','plane','pop','wave'];
const VERT='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAG=`precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;
/* ---- markup: glass, water canvas, CSS fallback drop; items keep their links ---- */
const items=[...nav.querySelectorAll(':scope > a')];
nav.classList.add('lq');
items.forEach((a,i)=>{a.classList.add('lq-item');const ic=a.querySelector('.appicon');if(ic){ic.className='lq-ico';ic.removeAttribute('style');const sv=ic.querySelector('svg');if(sv){sv.setAttribute('stroke','currentColor');sv.setAttribute('width','22');sv.setAttribute('height','22');sv.setAttribute('stroke-width','1.9');sv.setAttribute('stroke-linecap','round');sv.setAttribute('stroke-linejoin','round');sv.setAttribute('aria-hidden','true')}}
  const txt=[...a.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());txt.forEach(n=>{const s=document.createElement('span');s.className='lq-label';s.textContent=n.textContent.trim();n.replaceWith(s)});
  if(!a.getAttribute('aria-label'))a.setAttribute('aria-label',a.textContent.trim())});
const glass=document.createElement('span');glass.className='lq-glass';glass.setAttribute('aria-hidden','true');
const cv=document.createElement('canvas');cv.className='lq-water';cv.setAttribute('aria-hidden','true');
const drop=document.createElement('span');drop.className='lq-drop';drop.setAttribute('aria-hidden','true');
nav.prepend(glass,cv,drop);
/* ---- state ---- */
const s={a:{x:0,v:0},b:{x:0,v:0},sy:{s:1,v:0},lead:0,lagFrom:0,sats:[],rips:[],t:{x:0,cy:0,q:0,r:21},q:0,mouse:{x:0,y:0,s:0,on:false},moving:false,split:false,ready:false,w:0,h:0,visible:true,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,raf:0,last:0,time:0,glc:null};
let current=-1;
function initGL(){let gl;try{gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false})}catch(e){}if(!gl)return null;
  const sh=(t,src)=>{const x=gl.createShader(t);gl.shaderSource(x,src);gl.compileShader(x);return gl.getShaderParameter(x,gl.COMPILE_STATUS)?x:null};
  const vs=sh(gl.VERTEX_SHADER,VERT),fs=sh(gl.FRAGMENT_SHADER,FRAG);if(!vs||!fs)return null;const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;gl.useProgram(p);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const u={};['uRes','uDpr','uTime','uPill','uBlob','uSy','uRip','uMouse','uDark','uAmb'].forEach(n=>u[n]=gl.getUniformLocation(p,n));return {gl,u}}
function draw(){const T=s.t,sep=Math.abs(s.a.x-s.b.x),thin=Math.min(sep/(2*(s.q+T.r)||1),1),r=T.r*(1-.3*thin);
  if(s.glc){const {gl:g,u}=s.glc,dpr=Math.min(devicePixelRatio||1,2);g.viewport(0,0,g.drawingBufferWidth,g.drawingBufferHeight);
    g.uniform2f(u.uRes,s.w+PAD*2,s.h+PAD*2);g.uniform1f(u.uDpr,dpr);g.uniform1f(u.uTime,s.time);g.uniform4f(u.uPill,PAD,PAD,s.w,s.h);
    const blobs=new Float32Array(24),sy=new Float32Array(6).fill(1),head=s.lead===0?s.a:s.b,tail=s.lead===0?s.b:s.a;
    blobs.set([head.x,T.cy,s.q*(1-.25*thin),T.r*(1-.12*thin),tail.x,T.cy,s.q*(1-.8*thin),T.r*(1-.5*thin)],0);sy[0]=sy[1]=s.sy.s;
    s.sats.slice(0,4).forEach((d,i)=>blobs.set([d.x,d.y,0,d.r],8+i*4));g.uniform4fv(u.uBlob,blobs);g.uniform1fv(u.uSy,sy);
    const rips=new Float32Array(24);s.rips.slice(-6).forEach((p,i)=>rips.set([p.x,p.y,p.age,p.amp],i*4));g.uniform4fv(u.uRip,rips);
    g.uniform3f(u.uMouse,s.mouse.x,s.mouse.y,s.mouse.s);g.uniform1f(u.uDark,0);g.uniform1f(u.uAmb,s.reduce?0:1);g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);g.drawArrays(g.TRIANGLES,0,3)}
  else{const left=Math.min(s.a.x,s.b.x)-s.q-r-PAD,width=sep+2*(s.q+r);drop.style.width=width+'px';drop.style.transform=`translateX(${left}px) scaleY(${s.sy.s})`}}
function step(dt,now){const T=s.t;s.time+=dt;s.q+=(T.q-s.q)*Math.min(1,dt*12);const bodies=[s.a,s.b];let still=true;
  if(s.reduce){s.a.x=s.b.x=T.x;s.a.v=s.b.v=0;s.sy.s=1;s.sats=[]}
  else{bodies.forEach((B,i)=>{const lead=i===s.lead,k=lead?210:72,c=lead?25:13,f=!lead&&now<s.lagFrom?.08:1;B.v+=(k*(T.x-B.x)-c*B.v)*dt*f;B.x+=B.v*dt;
      const lo=PAD+6+s.q+T.r-3,hi=PAD+s.w-6-s.q-T.r+3;if(B.x<lo||B.x>hi){s.sy.v-=Math.min(Math.abs(B.v),900)*.0016;B.x=Math.max(lo,Math.min(hi,B.x));B.v*=-.25}
      if(Math.abs(T.x-B.x)>.3||Math.abs(B.v)>3)still=false});
    const L=bodies[s.lead],syT=1-.2*Math.min(Math.abs(L.v)/1500,1);s.sy.v+=(280*(syT-s.sy.s)-9*s.sy.v)*dt;s.sy.s+=s.sy.v*dt;if(Math.abs(s.sy.s-1)>.002||Math.abs(s.sy.v)>.02)still=false;
    const sep=Math.abs(s.a.x-s.b.x),r=T.r*(1-.3*Math.min(sep/(2*(T.q+T.r)||1),1));
    if(!s.split&&s.moving&&sep-2*T.q-2*r>-6){s.split=true;const lo=bodies[1-s.lead],hi=bodies[s.lead];[.3,.5,.72].forEach((t,j)=>s.sats.push({x:lo.x+(hi.x-lo.x)*t+(Math.random()-.5)*6,y:T.cy+(Math.random()-.5)*10,vx:(lo.v+hi.v)*.45,vy:(Math.random()-.5)*60,r:5+Math.random()*3-j*.5,k:70+Math.random()*90}))}
    s.sats=s.sats.filter(d=>{d.vx+=(d.k*(T.x-d.x)-9*d.vx)*dt;d.vy+=(90*(T.cy-d.y)-7*d.vy)*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.x=Math.max(PAD+8+d.r,Math.min(PAD+s.w-8-d.r,d.x));d.y=Math.max(T.cy-T.r+d.r,Math.min(T.cy+T.r-d.r,d.y));if(Math.abs(T.x-d.x)<T.q+T.r*.5)d.r-=dt*26;return d.r>.6});
    if(s.sats.length)still=false}
  if(s.moving&&still){s.moving=false;if(s.split||!s.reduce)s.rips.push({x:T.x,y:T.cy,age:0,amp:s.split?1.2:.7})}
  s.rips.forEach(p=>p.age+=dt);s.rips=s.rips.filter(p=>p.age<2.4);s.mouse.s+=((s.mouse.on?1:0)-s.mouse.s)*Math.min(1,dt*7)}
function loop(){s.ambUntil=performance.now()+4000;if(s.raf)return;s.last=performance.now();const tick=now=>{const dt=Math.min((now-s.last)/1000,1/30);s.last=now;step(dt,now);draw();
    /* ambient water moves for a few seconds after each interaction, then the frame freezes — saves battery on phones */
    const busy=s.moving||s.rips.length||s.sats.length||s.mouse.s>.01;s.raf=s.visible&&(busy||(!s.reduce&&now<s.ambUntil))?requestAnimationFrame(tick):0};s.raf=requestAnimationFrame(tick)}
function measure(){const el=items[current];if(!el||!nav.offsetWidth)return;s.w=nav.offsetWidth;s.h=nav.offsetHeight;const T=s.t;
  T.r=el.offsetHeight/2;T.q=Math.max(0,el.offsetWidth/2-T.r);T.cy=PAD+el.offsetTop+el.offsetHeight/2;const nx=PAD+el.offsetLeft+el.offsetWidth/2;
  if(!s.ready){s.a.x=s.b.x=nx;s.q=T.q;s.ready=true}else if(Math.abs(nx-T.x)>.5){s.lead=Math.abs(nx-s.a.x)<=Math.abs(nx-s.b.x)?0:1;s.lagFrom=performance.now()+70;s.moving=true;s.split=false}
  T.x=nx;const dpr=Math.min(devicePixelRatio||1,2),W=s.w+PAD*2,Hh=s.h+PAD*2;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(Hh*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);cv.style.width=W+'px';cv.style.height=Hh+'px'}loop()}
const local=(x,y)=>{const r=nav.getBoundingClientRect();return {x:x-r.left+PAD,y:y-r.top+PAD}};
const ripple=(x,y,amp)=>{if(s.reduce)return;s.rips.push({x,y,age:0,amp});loop()};
function setActive(i){if(i===current)return;current=i;items.forEach((a,j)=>j===i?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));measure()}
function play(i){const ic=items[i]&&items[i].querySelector('.lq-ico');if(!ic)return;const k=FX[i]||'pop';ic.removeAttribute('data-fx');void ic.offsetWidth;ic.dataset.fx=k;
  const b=ic.getBoundingClientRect(),c=local(b.left+b.width/2,b.top+b.height/2);if(k==='plane')ripple(c.x,c.y,.6);if(k==='drop')setTimeout(()=>ripple(c.x,s.t.cy,1.4),430)}
/* which dock item matches the page the visitor is on */
function fromHash(){const h=location.hash||'';if(/^#\/live/.test(h))return 2;if(/^#(\/contact|contact)/.test(h))return 4;if(/^#(\/calendar|news|events)/.test(h))return 1;if(/^#member-login/.test(h)||document.querySelector('.portal-ov,.pov'))return 3;return 0}
items.forEach((a,i)=>a.addEventListener('click',()=>{play(i);setActive(i)}));
nav.addEventListener('pointerdown',e=>{const p=local(e.clientX,e.clientY);ripple(p.x,p.y,.8)});
nav.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p=local(e.clientX,e.clientY);s.mouse.x=p.x;s.mouse.y=p.y;s.mouse.on=true;loop()});
nav.addEventListener('pointerleave',()=>{s.mouse.on=false;loop()});
nav.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();const n=(Math.max(current,0)+(e.key==='ArrowRight'?1:-1)+items.length)%items.length;items[n].focus();play(n);setActive(n)});
addEventListener('hashchange',()=>setTimeout(()=>setActive(fromHash()),30));
s.glc=initGL();if(!s.glc)nav.dataset.gl='off';
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();s.glc=null;nav.dataset.gl='off'});
/* pause when the dock is hidden (desktop, before scrolling, behind a dialog) or the tab is in the background */
const io=new IntersectionObserver(([e])=>{s.visible=e.isIntersecting;if(s.visible){s.ready=false;measure();loop()}});io.observe(nav);
document.addEventListener('visibilitychange',()=>{s.visible=document.visibilityState==='visible';if(s.visible)loop()});
let lastW=-1;new ResizeObserver(()=>{const w=nav.offsetWidth;if(w!==lastW){lastW=w;s.ready=false;measure()}}).observe(nav);
current=-1;setActive(fromHash());
window.AFAGS_DOCK={setActive,state:s};
})();
/* ===== iPhone / iPad / Android polish (shared by website + portal) ===== */
(()=>{if(window.__afagsMobile)return;window.__afagsMobile=1;const H=document.documentElement,ua=navigator.userAgent;
const iOS=/iP(hone|od|ad)/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/i.test(ua),touch=matchMedia('(pointer:coarse)').matches;
H.classList.toggle('is-ios',iOS);H.classList.toggle('is-android',android);H.classList.toggle('is-touch',touch);
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;H.classList.toggle('is-standalone',standalone);
/* iOS zooms into any input under 16px and stays zoomed: stop the auto-zoom (pinch-zoom still works on iOS) */
if(iOS){const vp=document.querySelector('meta[name=viewport]');if(vp&&!/maximum-scale/.test(vp.content))vp.content+=', maximum-scale=1'}
/* real visible height (address bar / keyboard aware) for older browsers without svh/dvh */
const setVh=()=>H.style.setProperty('--vh',(window.visualViewport?visualViewport.height:innerHeight)*.01+'px');setVh();addEventListener('resize',setVh,{passive:true});window.visualViewport&&visualViewport.addEventListener('resize',setVh,{passive:true});
/* on-screen keyboard open → hide the bottom dock / back-to-top so they don't cover the field */
const isField=el=>el&&(el.tagName==='TEXTAREA'||el.tagName==='SELECT'||(el.tagName==='INPUT'&&!/^(checkbox|radio|range|button|submit|reset|file|color)$/.test(el.type))||el.isContentEditable);
if(touch){addEventListener('focusin',e=>{if(isField(e.target))H.classList.add('kb-open')});addEventListener('focusout',()=>setTimeout(()=>{if(!isField(document.activeElement))H.classList.remove('kb-open')},120));
  /* keep the focused field visible above the keyboard */
  addEventListener('focusin',e=>{if(!isField(e.target))return;setTimeout(()=>{try{e.target.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}},350)})}
/* :has() fallback for older Safari: mark the chosen radio / checkbox card */
const markChecked=()=>document.querySelectorAll('.choice label,.pay-m label').forEach(l=>{const i=l.querySelector('input');l.classList.toggle('is-on',!!(i&&i.checked))});
document.addEventListener('change',e=>{if(e.target.closest&&e.target.closest('.choice,.pay-m'))markChecked()});
/* dialogs: lock the page behind them, and let the phone's Back button / swipe-back close them instead of leaving the site */
const SEL='.v3-md,.wm.open,.lp.open,.pc-panel.open,.md,.pay';
const openEl=()=>{const L=[...document.querySelectorAll(SEL)].filter(x=>{const c=getComputedStyle(x);return c.display!=='none'&&c.visibility!=='hidden'&&!(x.classList.contains('pc-panel')&&innerWidth>560)});return L[L.length-1]||null};
let pushed=false,popping=false,raf=0;
function sync(){raf=0;const o=openEl();H.classList.toggle('md-open',!!o);if(o&&!o.closest('.pc-panel'))markChecked();
  if(o&&!pushed&&!popping){try{history.pushState(Object.assign({},history.state,{afagsMd:1}),'');pushed=true}catch(e){}}
  else if(!o&&pushed&&!popping){pushed=false;if(history.state&&history.state.afagsMd){try{history.back()}catch(e){}}}}
new MutationObserver(()=>{if(!raf)raf=requestAnimationFrame(sync)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
addEventListener('popstate',()=>{if(!pushed)return;pushed=false;const o=openEl();if(!o)return;popping=true;
  const t=o.querySelector('[data-close],[data-lpclose],[data-obclose],.v3-x,.md-x,#pcX')||o;
  if(t!==o&&t.click){t.click()}else{o.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}
  setTimeout(()=>{popping=false;sync()},80)});
})();

/* ===== FAI affiliation marks: top strip, header subtitle, footer (logo uploaded in Admin › Settings) ===== */
function faiSrc(){const s=C.site()||{};const v=s.faiLogo||window.AFAGS_FAI_LOGO||'';return /^(data:image\/(png|jpeg|webp|svg\+xml);base64,|uploads\/|assets\/|https:\/\/)/.test(v)?v:''}
const FAI_URL='https://www.fencingindia.org/';
function faiMarks(){const src=faiSrc();
  const sm=$('#hd .brand small');if(sm){sm.title='Affiliated to the Fencing Association of India';sm.innerHTML=`${src?`<img class="fai-mini" src="${src}" alt="">`:''}<span class="fai-l">Affiliated to Fencing Association of India (FAI)</span><span class="fai-s">Affiliated to FAI · Fencing Association of India</span>`}
  const msg=$('.strip .msg');if(msg){if(!msg.dataset.fai){msg.dataset.fai=1}msg.innerHTML=`${src?`<img class="fai-strip" src="${src}" alt="">`:''}<a href="${FAI_URL}" target="_blank" rel="noopener">Affiliated to the Fencing Association of India (FAI)</a><i class="fai-sep"></i>Official website of the Amateur Fencing Association of Gujarat State`}
  let ft=$('#faiFt');const fl=$('footer .fl');
  if(fl){const html=`<span class="fai-lg">${src?`<img src="${src}" alt="Fencing Association of India logo">`:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>'}</span><span class="fai-tx"><small>Affiliated to</small><b>Fencing Association of India</b><em>National federation for fencing in India ↗</em></span>`;
    if(!ft){fl.insertAdjacentHTML('beforeend',`<a id="faiFt" class="fai-ft" href="${FAI_URL}" target="_blank" rel="noopener" aria-label="Affiliated to the Fencing Association of India (opens fencingindia.org)"></a>`);ft=$('#faiFt')}ft.innerHTML=html}}
faiMarks();addEventListener('message',e=>{const d=e.data||{};if(d.afags==='cms'&&d.c==='site')faiMarks()});addEventListener('storage',e=>{if(e.key==='afags_site')faiMarks()});
/*V5END*/
window.AFAGS_SITE={imgSrc,modal,esc,toast,fmtD,C,render,share};
buildNav();applySite();render();
})();
/*VOICESSTART*/
/* cobe 2.0.1 — WebGL globe by Shu Ding, MIT licence (https://github.com/shuding/cobe) */
(()=>{function Re(e,t,r){let a=e.createShader(t);return e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(e.deleteShader(a),null)}function Y(e,t,r){let a=Re(e,e.VERTEX_SHADER,t),o=Re(e,e.FRAGMENT_SHADER,r);if(!a||!o)return null;let i=e.createProgram();return e.attachShader(i,a),e.attachShader(i,o),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)?(e.deleteShader(a),e.deleteShader(o),i):(e.deleteProgram(i),null)}function H(e,t,r){let a={};for(let o of r)a[o]=e.getUniformLocation(t,o);return a}function Q(e,t,r){let a={};for(let o of r)a[o]=e.getAttribLocation(t,o);return a}function Ae(e){let t={},r={},a={},o=document.createElement("style");function i(t,r,a,o){let i=t[r];i||(i=document.createElement("div"),i.style.cssText="position:absolute;width:1px;height:1px;pointer-events:none;anchor-name:"+a,e.append(i),t[r]=i),i.style.left=100*o.x+"%",i.style.top=100*o.y+"%"}return document.head.append(o),{m:function(e,r){let o={};for(let n of e){let e=n.id;if(!e)continue;let f=r(n.location);o[e]=1,i(t,e,"--cobe-"+e,f),f.visible?a["--cobe-visible-"+e]="N":delete a["--cobe-visible-"+e]}for(let e in t)o[e]||(t[e].remove(),delete t[e],delete a["--cobe-visible-"+e])},a:function(e,t){let o={};for(let n of e){let e=n.id;if(!e)continue;let f=t(n);o[e]=1,i(r,e,"--cobe-arc-"+e,f),f.visible?a["--cobe-visible-arc-"+e]="N":delete a["--cobe-visible-arc-"+e]}for(let e in r)o[e]||(r[e].remove(),delete r[e],delete a["--cobe-visible-arc-"+e])},r:function(){for(let e in t)t[e].remove();for(let e in r)r[e].remove();o.remove()},s:function(){let e="";for(let t in a)e+=t+":"+a[t]+";";o.textContent=":root{"+e+"}"}}}var{PI:Z,sin:le,cos:_e}=Math,Be="attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}",Ce="precision highp float;uniform vec2 t,v,s;uniform vec3 F,w;uniform vec4 n;uniform float k,x,y;uniform sampler2D z;float u;mat3 A(float a,float b){float c=cos(a),d=cos(b),e=sin(a),f=sin(b);return mat3(d,f*e,-f*c,0,c,e,f,d*-e,d*c);}vec3 B(vec3 c,out float G){c=c.xzy;float q=max(2.,floor(log2(2.236068*k*3.141593*(1.-c.z*c.z))*.72021));vec2 g=floor(pow(1.618034,q)/2.236068*vec2(1,1.618034)+.5),d=fract((g+1.)*.618034)*6.283185-3.883222,e=-2.*g,f=vec2(atan(c.y,c.x),c.z-1.),r=floor(vec2(e.y*f.x-d.y*(f.y*k+1.),-e.x*f.x+d.x*(f.y*k+1.))/(d.x*e.y-e.x*d.y));float o=3.141593;vec3 C;for(float h=0.;h<4.;h+=1.){vec2 D=vec2(mod(h,2.),floor(h*.5));float j=dot(g,r+D);if(j>k)continue;float a=j,b=0.;a>=16384.?(a-=16384.,b+=.868872):0.,a>=8192.?(a-=8192.,b+=.934436):0.,a>=4096.?(a-=4096.,b+=.467218):0.,a>=2048.?(a-=2048.,b+=.733609):0.,a>=1024.?(a-=1024.,b+=.866804):0.,a>=512.?(a-=512.,b+=.433402):0.,a>=256.?(a-=256.,b+=.216701):0.,a>=128.?(a-=128.,b+=.108351):0.,a>=64.?(a-=64.,b+=.554175):0.,a>=32.?(a-=32.,b+=.777088):0.,a>=16.?(a-=16.,b+=.888544):0.,a>=8.?(a-=8.,b+=.944272):0.,a>=4.?(a-=4.,b+=.472136):0.,a>=2.?(a-=2.,b+=.236068):0.,a>=1.?(a-=1.,b+=.618034):0.;float l=fract(b)*6.283185,i=1.-2.*j*u,m=sqrt(1.-i*i);vec3 p=vec3(cos(l)*m,sin(l)*m,i);float E=length(c-p);if(E<o)o=E,C=p;}G=o;return C.xzy;}void main(){u=1./k;vec2 c=1./t,b=(gl_FragCoord.xy*c*2.-1.)/x-v*vec2(1,-1)*c;b.x*=t.x*c.y;float a=dot(b,b),f=0.;vec4 l=vec4(0);if(a<=.64){float g;vec4 m=vec4(0);vec3 h=normalize(vec3(b,sqrt(.64-a)));mat3 o=A(s.y,s.x);float i=h.z;vec3 d=B(h*o,g);float j=asin(d.y),e=acos(-d.x/cos(j));e=d.z<0.?-e:e;float p=max(texture2D(z,vec2(e*.5/3.141593,-(j/3.141593+.5))).x,y),q=p*smoothstep(8e-3,0.,g)*pow(i,n.y)*n.x;m+=vec4(F*(mix((1.-q)*pow(i,.4),q,n.z)+.1)+pow(1.-i,4.)*w,1),l+=m*(1.+n.w)*.5,f=(1.-a)*(1.-a)*smoothstep(0.,1.,.2/(a-.64));}else{float r=sqrt(.2/(a-.64));f=smoothstep(.5,1.,r/(r+1.));}gl_FragColor=l+vec4(f*w,f);}",be="varying vec2 m;varying vec3 g;varying float h;attribute vec2 n;attribute vec3 p,w;attribute float q,x;uniform vec2 b,r;uniform float i,j,k,s;void main(){float c=cos(j),d=sin(j),e=cos(i),f=sin(i);vec3 a=p*(.8+s),l=vec3(e*a.x+f*a.z,f*d*a.x+c*a.y-e*d*a.z,-f*c*a.x+d*a.y+e*c*a.z);if(l.z<0.&&length(l.xy)<.8){gl_Position=vec4(2,2,0,1);return;}float t=b.y/b.x;vec2 y=(l.xy+n*q*2.)*vec2(t,1)*k+r*vec2(1,-1)*k/b;gl_Position=vec4(y,0,1),m=n,g=w,h=x;}",ge="precision highp float;varying vec2 m;varying vec3 g;varying float h;uniform vec3 v;void main(){if(length(m)>.25)discard;vec3 a=h>.5?g:v;gl_FragColor=vec4(a,1);}",Fe="varying vec3 i;varying float j,s,t;attribute vec2 k;attribute vec3 l,m,N;attribute float v,w,O;uniform vec2 g,x;uniform float y,z,h,A;mat3 B(float a,float b){float c=cos(a),d=cos(b),e=sin(a),f=sin(b);return mat3(d,f*e,-f*c,0,c,e,f,d*-e,d*c);}vec3 C(vec3 c,vec3 d,vec3 e,float a){float b=1.-a;return b*b*c+2.*b*a*d+a*a*e;}vec3 D(vec3 c,vec3 b,vec3 d,float a){float e=1.-a;return 2.*e*(b-c)+2.*a*(d-b);}void main(){mat3 b=B(z,y);float c=.8+A;vec3 d=l*c,e=m*c,f=l+m;float n=length(f);vec3 E=n>1e-3?f/n:vec3(0,1,0),o=E*(.8+v);float p=k.x;vec3 F=C(d,o,e,p),q=b*F,G=D(d,o,e,p),H=b*G;vec2 a=H.xy;float r=length(a);vec2 I=r>1e-3?vec2(-a.y,a.x)/r:vec2(1,0);float J=g.x/g.y;vec2 K=q.xy*vec2(1./J,1)*h+x*vec2(1,-1)*h/g,P=K+I*w*k.y*h;gl_Position=vec4(P,0,1),i=N,j=O,s=q.z,t=length(q.xy);}",Le="precision highp float;varying vec3 i;varying float j,s,t;uniform vec3 M;void main(){if(s<0.&&t<.8)discard;vec3 a=j>.5?i:M;gl_FragColor=vec4(a,1);}",ee=.8;function U([e,t]){let r=e*Z/180,a=t*Z/180-Z,o=_e(r);return[-o*_e(a),le(r),o*le(a)]}var Pe=(e,t)=>{let r={alpha:!0,stencil:!1,antialias:!0,depth:!1,preserveDrawingBuffer:!1,...t.context},a=e.getContext("webgl2",r),o=!!a;if(a||(a=e.getContext("webgl",r)),!a)return{destroy:()=>{},update:()=>{}};let i=o?null:a.getExtension("ANGLE_instanced_arrays"),n=t.devicePixelRatio||1;e.width=t.width*n,e.height=t.height*n;let f=t.phi||0,l=t.theta||0,c=t.markers||[],s=t.arcs||[],A=t.mapSamples||1e4,v=t.mapBrightness||1,d=t.mapBaseBrightness||0,g=t.baseColor||[1,1,1],m=t.markerColor||[1,.5,0],u=t.glowColor||[1,1,1],h=t.arcColor||[.3,.6,1],E=t.arcWidth??1,R=t.arcHeight??.2,b=t.diffuse||1,x=t.dark||0,y=t.opacity??1,T=t.offset||[0,0],B=t.scale||1,p=t.markerElevation??.05,w=Y(a,Be,Ce),C=Y(a,be,ge),F=Y(a,Fe,Le);if(!w)return{destroy:()=>{},update:()=>{}};let D=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,D),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),a.STATIC_DRAW);let _=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,_);let N=[];for(let e=0;e<=32;e++){let t=e/32;N.push(t,-1,t,1)}a.bufferData(a.ARRAY_BUFFER,new Float32Array(N),a.STATIC_DRAW);let k=a.createBuffer(),S=a.createBuffer(),I=H(a,w,["t","s","k","x","v","F","w","n","y","z"]),P=H(a,C,["i","j","b","k","r","v","s"]),L=Q(a,C,["n","p","q","w","x"]),z=H(a,F,["y","z","g","h","x","M","A"]),G=Q(a,F,["k","l","m","v","w","N","O"]),M=a.getAttribLocation(w,"a"),V=a.createTexture();a.bindTexture(a.TEXTURE_2D,V),a.texImage2D(a.TEXTURE_2D,0,a.RGB,1,1,0,a.RGB,a.UNSIGNED_BYTE,new Uint8Array([0,0,0])),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST);let j=new Image;j.onload=()=>{a.bindTexture(a.TEXTURE_2D,V),a.texImage2D(a.TEXTURE_2D,0,a.RGB,a.RGB,a.UNSIGNED_BYTE,j),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,V)},j.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACAAQAAAADMzoqnAAAECklEQVR42u3VsW4jRRzH8d94gzfF4Q0VQaC4vBLTRTp0mze4ggfAPAE5XQEFsGNAVIjwBrmW7h7gJE+giKjyABTZE4g06LKJETdRJvtD65kdz6yduKABiW+TVfzRf2bXYxtcE/59YJCz6YdbgQF6ACSRrwYKYImmh5PbwOewlV3wlQNbAN6SEExjUOO+BU0aCSnxReHABUlK4YFQeJeUT3da8IIkZ6NGoSnFY5KsMoVzMKfECUnqxgPYRArarmUCndHwzIEaQEpg5xVdBXROl8mpAQx5dUgPiHoYAAkg5w3JABR06byGAVgcRGAz5bznj6phBQNRFwyqgdxebH6gshJAesWoFhgYpApAFoG8BIZ/fEhSox5jDjQXmV0Ar5XJfAIrALi3URVs09gHIL4XJCkLC5LH9JWiArABFCSrQjdgkBzRJ0WJeUOSNyQAfJJwUSWUBRlJQ8oGHATACGlBynnzy2kEYLNjrxouigD8BZcgOeVPqh12RtufaCN5wCPVDpvQ9lsIrqndsJtDcWqBCpf4hWN7OdWHBw58FwIaNOU/n1TpMW2DFaD48cmr4185T8NHkpUFX749pQPVdgRKC/DGoQPVeAEKv+WHvY8OOWNTPRp5kHuwSf8wzXtVBKR7YwEH9H3lQUaypUfSATOALyVNu5vZJW31Bnx98nkLfDUWJaz6ixvm+RIQRdl3kmRxxiaDoGnZW4CpPfkaQadlcPim1xOSvETQo7Lv75enVAXJ3xGUlony4KQBBWUM1NiDc6qhyS8RgQs18OCMMtPDaAUIyg0PZkRWDqs+wnKJBTDI1Js6BolegOsKmUxNDBAAKqQyMQmidhegBlLZ+wwKYdv5M/8x1khkb1cgKqP2H+MKyV5vS+whrE8DQDgAlUAoRBX056EElJCjJVACeJBZgNfVp+iCCm4RBWCgKsRxASSA9KgDhDtCiTuMyfHsKXzhC6wNAIjjWb8LKAOA2ctk3FmCOlgKFy8f1N0JJtgsxinYnVAHt4t3gPzZXSCTyCWCQmBT91QE3B5yarSN40dNHYPka4TlDhTUI8zLvl0JSL3vZn6DsCFZOeB2yROEpR68sECQQA++xIGCR2X7DwlEoLRgUrZrqlUg50S1uy43YqDcN6UFBVkhAjWiCV2Q0jgQPdplMKxvBXodcOfAwJYvgdL+1etA1YJJfBcZlQV7sO1i2gHoNiyxtQ5sBsCgWyoxCHiFFd2L5nUTCqMAqGUgsQ9f5kCcCiZgRYkMgMTd5WsB1rTzj0Em14BE4r+QxN1lCEsVur2PoF5Wbg8RJXR4djgvBgauhLywoEZQrt1KKRdVS4CdlJ8qafyP+9KIj/nE/d7kKwH9jgS72e9DV+kvfTWgct4ZyP8Byb8BPG7MaaIIkAQAAAAASUVORK5CYII=";let J=0;function O(t){let r=Math.cos(l),a=Math.cos(f),o=Math.sin(l),i=Math.sin(f),c=a*t[0]+i*t[2],s=i*o*t[0]+r*t[1]-a*o*t[2];return[(c/(e.width/e.height)*B+T[0]*B*n/e.width+1)/2,(-s*B+T[1]*B*n/e.height+1)/2,-i*r*t[0]+o*t[1]+a*r*t[2]>=0||c*c+s*s>=.64]}function W(e){let t=U(e),r=ee+p,a=O([t[0]*r,t[1]*r,t[2]*r]);return{x:a[0],y:a[1],visible:a[2]}}function X(e){let t=U(e.from),r=U(e.to),a=[t[0]+r[0],t[1]+r[1],t[2]+r[2]],o=(a[0]**2+a[1]**2+a[2]**2)**.5;if(o<.001)return null;let i=.25*(ee+p)+.5*(ee+R+p)/o,n=O([a[0]*i,a[1]*i,a[2]*i]);return{x:n[0],y:n[1],visible:n[2]}}function K(e,t,r,n,f){e<0||(a.enableVertexAttribArray(e),a.vertexAttribPointer(e,t,a.FLOAT,!1,r,n),o?a.vertexAttribDivisor(e,f):i&&i.vertexAttribDivisorANGLE(e,f))}let q,Z=document.createElement("div");Z.style.cssText="position:relative;width:100%;height:100%",e.parentElement?.insertBefore(Z,e),Z.append(e);let $=Ae(Z);function te(t){if(t.phi!=q&&(f=t.phi),t.theta!=q&&(l=t.theta),t.markers&&function(e){c=e;let t=new Float32Array(8*c.length);c.forEach((e,r)=>{t.set([...U(e.location),e.size,...e.color||[0,0,0],e.color?1:0],8*r)}),a.bindBuffer(a.ARRAY_BUFFER,k),a.bufferData(a.ARRAY_BUFFER,t,a.DYNAMIC_DRAW)}(t.markers),t.arcs&&function(e){s=e,J=s.length;let t=new Float32Array(12*s.length);s.forEach((e,r)=>{t.set([...U(e.from),...U(e.to),R+p,.005*E,...e.color||[0,0,0],e.color?1:0],12*r)}),a.bindBuffer(a.ARRAY_BUFFER,S),a.bufferData(a.ARRAY_BUFFER,t,a.DYNAMIC_DRAW)}(t.arcs),t.width&&t.height&&(e.width=t.width*n,e.height=t.height*n),t.mapSamples!=q&&(A=t.mapSamples),t.mapBrightness!=q&&(v=t.mapBrightness),t.mapBaseBrightness!=q&&(d=t.mapBaseBrightness),t.baseColor!=q&&(g=t.baseColor),t.markerColor!=q&&(m=t.markerColor),t.glowColor!=q&&(u=t.glowColor),t.arcColor!=q&&(h=t.arcColor),t.arcWidth!=q&&(E=t.arcWidth),t.arcHeight!=q&&(R=t.arcHeight),t.diffuse!=q&&(b=t.diffuse),t.dark!=q&&(x=t.dark),t.opacity!=q&&(y=t.opacity),t.offset!=q&&(T=t.offset),t.scale!=q&&(B=t.scale),t.markerElevation!=q&&(p=t.markerElevation),$.m(c,W),$.a(s,X),$.s(),a.viewport(0,0,e.width,e.height),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.enable(a.BLEND),a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA),a.useProgram(w),a.bindBuffer(a.ARRAY_BUFFER,D),a.enableVertexAttribArray(M),a.vertexAttribPointer(M,2,a.FLOAT,!1,0,0),o?a.vertexAttribDivisor(M,0):i&&i.vertexAttribDivisorANGLE(M,0),a.uniform2f(I.t,e.width,e.height),a.uniform2f(I.s,f,l),a.uniform1f(I.k,A),a.uniform1f(I.x,B),a.uniform2f(I.v,T[0]*n,T[1]*n),a.uniform3fv(I.F,g),a.uniform3fv(I.w,u),a.uniform4f(I.n,v,b,x,y),a.uniform1f(I.y,d),a.uniform1i(I.z,0),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,V),a.drawArrays(a.TRIANGLES,0,6),F&&J>0){a.useProgram(F),a.bindBuffer(a.ARRAY_BUFFER,_),G.k>=0&&(a.enableVertexAttribArray(G.k),a.vertexAttribPointer(G.k,2,a.FLOAT,!1,0,0),o?a.vertexAttribDivisor(G.k,0):i&&i.vertexAttribDivisorANGLE(G.k,0)),a.bindBuffer(a.ARRAY_BUFFER,S);let t=48;if(K(G.l,3,t,0,1),K(G.m,3,t,12,1),K(G.v,1,t,24,1),K(G.w,1,t,28,1),K(G.N,3,t,32,1),K(G.O,1,t,44,1),a.uniform1f(z.y,f),a.uniform1f(z.z,l),a.uniform2f(z.g,e.width,e.height),a.uniform1f(z.h,B),a.uniform2f(z.x,T[0]*n,T[1]*n),a.uniform3fv(z.M,h),a.uniform1f(z.A,p),o)a.drawArraysInstanced(a.TRIANGLE_STRIP,0,66,J);else if(i)i.drawArraysInstancedANGLE(a.TRIANGLE_STRIP,0,66,J);else for(let e=0;e<J;e++)a.drawArrays(a.TRIANGLE_STRIP,0,66)}if(C&&c.length>0){a.useProgram(C),a.bindBuffer(a.ARRAY_BUFFER,D),L.n>=0&&(a.enableVertexAttribArray(L.n),a.vertexAttribPointer(L.n,2,a.FLOAT,!1,0,0),o?a.vertexAttribDivisor(L.n,0):i&&i.vertexAttribDivisorANGLE(L.n,0)),a.bindBuffer(a.ARRAY_BUFFER,k);let t=32;K(L.p,3,t,0,1),K(L.q,1,t,12,1),K(L.w,3,t,16,1),K(L.x,1,t,28,1),a.uniform1f(P.i,f),a.uniform1f(P.j,l),a.uniform2f(P.b,e.width,e.height),a.uniform1f(P.k,B),a.uniform2f(P.r,T[0]*n,T[1]*n),a.uniform3fv(P.v,m),a.uniform1f(P.s,p),function(e){if(o)a.drawArraysInstanced(a.TRIANGLES,0,6,e);else if(i)i.drawArraysInstancedANGLE(a.TRIANGLES,0,6,e);else for(let t=0;t<e;t++)a.drawArrays(a.TRIANGLES,0,6)}(c.length)}}return te({markers:c,arcs:s}),{update:te,destroy:()=>{a.deleteBuffer(D),a.deleteBuffer(_),a.deleteBuffer(k),a.deleteBuffer(S),a.deleteProgram(w),C&&a.deleteProgram(C),F&&a.deleteProgram(F),$.r()}}};window.AFAGS_COBE=Pe;;})();

/* ===== Voices of AFAGS — feedback globe on the home page (vanilla port of "Testimonial Globe", uses cobe) ===== */
(()=>{if(window.__afagsVoices)return;window.__afagsVoices=1;
const {esc,toast,modal}=window.AFAGS_SITE||{},C=window.AFAGS_CMS;if(!C)return;
/* places: Gujarat district HQs, Indian training / competition centres and international venues */
const PLACES={'Ahmedabad':[23.02,72.57,'IN'],'Amreli':[21.6,71.22,'IN'],'Anand':[22.56,72.95,'IN'],'Aravalli (Modasa)':[23.46,73.3,'IN'],'Banaskantha (Palanpur)':[24.17,72.43,'IN'],'Bharuch':[21.71,72.98,'IN'],'Bhavnagar':[21.76,72.15,'IN'],'Botad':[22.17,71.67,'IN'],'Chhota Udaipur':[22.3,74.01,'IN'],'Dahod':[22.84,74.25,'IN'],'Dang (Ahwa)':[20.76,73.69,'IN'],'Devbhumi Dwarka':[22.24,68.97,'IN'],'Gandhinagar':[23.22,72.65,'IN'],'Gir Somnath (Veraval)':[20.91,70.37,'IN'],'Jamnagar':[22.47,70.06,'IN'],'Junagadh':[21.52,70.46,'IN'],'Kheda (Nadiad)':[22.69,72.86,'IN'],'Kutch (Bhuj)':[23.25,69.67,'IN'],'Mahisagar (Lunawada)':[23.13,73.61,'IN'],'Mehsana':[23.6,72.4,'IN'],'Morbi':[22.82,70.84,'IN'],'Narmada (Rajpipla)':[21.87,73.5,'IN'],'Navsari':[20.95,72.92,'IN'],'Panchmahal (Godhra)':[22.78,73.61,'IN'],'Patan':[23.85,72.13,'IN'],'Porbandar':[21.64,69.6,'IN'],'Rajkot':[22.3,70.8,'IN'],'Sabarkantha (Himmatnagar)':[23.6,72.97,'IN'],'Surat':[21.17,72.83,'IN'],'Surendranagar':[22.73,71.64,'IN'],'Tapi (Vyara)':[21.11,73.39,'IN'],'Vadodara':[22.31,73.18,'IN'],'Valsad':[20.6,72.93,'IN'],
 'New Delhi':[28.61,77.21,'IN'],'Patiala (NIS)':[30.34,76.39,'IN'],'Mumbai':[19.08,72.88,'IN'],'Pune':[18.52,73.86,'IN'],'Aurangabad':[19.88,75.34,'IN'],'Bengaluru':[12.97,77.59,'IN'],'Chennai':[13.08,80.27,'IN'],'Hyderabad':[17.39,78.49,'IN'],'Kolkata':[22.57,88.36,'IN'],'Bhubaneswar':[20.3,85.82,'IN'],'Guwahati':[26.14,91.74,'IN'],'Thiruvananthapuram':[8.52,76.94,'IN'],'Lucknow':[26.85,80.95,'IN'],'Jaipur':[26.91,75.79,'IN'],'Bhopal':[23.26,77.41,'IN'],'Imphal':[24.82,93.94,'IN'],'Panaji (Goa)':[15.49,73.83,'IN'],
 'Tashkent':[41.3,69.24,'UZ'],'Bangkok':[13.76,100.5,'TH'],'Kuala Lumpur':[3.14,101.69,'MY'],'Singapore':[1.35,103.82,'SG'],'Dubai':[25.2,55.27,'AE'],'Doha':[25.29,51.53,'QA'],'Kathmandu':[27.72,85.32,'NP'],'Colombo':[6.93,79.86,'LK'],'Dhaka':[23.81,90.41,'BD'],'Seoul':[37.57,126.98,'KR'],'Tokyo':[35.68,139.69,'JP'],'Shanghai':[31.23,121.47,'CN'],'Hangzhou':[30.27,120.16,'CN'],'Paris':[48.86,2.35,'FR'],'Budapest':[47.5,19.04,'HU'],'Plovdiv':[42.14,24.75,'BG'],'Milan':[45.46,9.19,'IT'],'London':[51.51,-0.13,'GB'],'Lausanne':[46.52,6.63,'CH'],'Cairo':[30.04,31.24,'EG'],'New York':[40.71,-74.01,'US'],'Melbourne':[-37.81,144.96,'AU']};
window.AFAGS_PLACES=PLACES;
const TONES=['#ff9a3c','#4cc3ff','#3ddc84','#ffd24a','#ff6fae'];
const GR=.8,THETA=.42,ALT=.05,FRICTION=.92,TURN_MS=1200,SWAP_MS=220,HOLD_MS=7000,INTERVAL=6000,SLOP=6;
const clamp01=v=>Math.min(1,Math.max(0,v)),smooth=t=>t*t*(3-2*t),easeOutExpo=t=>t>=1?1:(1-Math.pow(2,-10*t))/(1-Math.pow(2,-10));
const toCart=(lat,lng)=>{const la=lat*Math.PI/180,lo=lng*Math.PI/180-Math.PI,c=Math.cos(la);return [-c*Math.cos(lo),Math.sin(la),c*Math.sin(lo)]};
function project([x,y,z],phi,theta,alt){const cp=Math.cos(phi),sp=Math.sin(phi),ct=Math.cos(theta),st=Math.sin(theta),r=GR*(1+alt);
  const sx=(cp*x+sp*z)*r,sy=(sp*st*x+ct*y-cp*st*z)*r,depth=-sp*ct*x+st*y+cp*ct*z;return {x:(sx+1)/2,y:(1-sy)/2,depth,rim:Math.hypot(sx,sy)-GR}}
const facingPhi=lng=>3*Math.PI/2-lng*Math.PI/180,nearest=(from,a)=>{const t=Math.PI*2;return a+t*Math.round((from-a)/t)};
function pinOpacity(d,rim){if(d>=0)return .45+.55*smooth(clamp01(d/.3));return .45*Math.max(clamp01(rim/.04),clamp01(1+d*8))*clamp01(1+d*3)}
const pinScale=d=>.62+.38*smooth(clamp01((d+.2)/.7));
const ini=n=>String(n||'?').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const STAR='<svg viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1.2 12.4,7.4 19,7.7 13.9,11.9 15.6,18.3 10,14.7 4.4,18.3 6.1,11.9 1,7.7 7.6,7.4" fill="currentColor"/></svg>';
function items(){let L=(C.get('voices')||[]).filter(v=>v&&v.status!=='Hidden'&&v.quote);const real=L.filter(v=>!v.sample);if(real.length)L=real;
  L=L.map((v,i)=>{const p=PLACES[v.place];const lat=parseFloat(v.lat),lng=parseFloat(v.lng);return {...v,lat:isFinite(lat)?lat:p?p[0]:23.02,lng:isFinite(lng)?lng:p?p[1]:72.57,country:v.country||(p?p[2]:'IN'),city:v.city||String(v.place||'Gujarat').replace(/\s*\(.*\)/,''),tone:i%5}}).slice(0,24);
  return L}
/* registered (accredited) fencers per district — from the public verification index, else the portal's stats */
const LSJ=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
function placeOf(dist){const k=Object.keys(PLACES).find(x=>x===dist||x.startsWith(dist+' ('));return k?PLACES[k]:null}
function fencerMap(){const cnt={};Object.values(LSJ('afags_vindex',{})||{}).forEach(r=>{if(Array.isArray(r)&&r[1]==='FEN'&&r[2]==='Approved'&&r[3])cnt[r[3]]=(cnt[r[3]]||0)+1});
  if(!Object.keys(cnt).length){const st=LSJ('afags_stats',{})||{};Object.assign(cnt,st.dist||{})}
  return Object.entries(cnt).map(([d,c])=>{const p=placeOf(d);return p&&c>0?{d,c:+c,lat:p[0],lng:p[1]}:null}).filter(Boolean).sort((a,b)=>b.c-a.c)}
const fmtN=n=>Number(n||0).toLocaleString('en-IN');
/* website visits: counted by the AFAGS server (anonymous); this browser only when the site runs as a file */
let VIS=null;const visHooks=new Set();
let VCOUNTED=false;async function visits(hb){let st=null;const once=!VCOUNTED&&(()=>{try{return !sessionStorage.getItem('afags_vs')}catch(e){return false}})();VCOUNTED=true;
  try{const A=window.AFAGS_API;if(A&&await A.ready&&A.online){st=await A.call('POST','/visit',{hb:once?0:1});st.live=true}}catch(e){st=null}
  if(!st){const L=LSJ('afags_visits_local',{total:0,days:{}}),d=new Date().toISOString().slice(0,10);if(once){L.total=(L.total||0)+1;L.days=L.days||{};L.days[d]=(L.days[d]||0)+1;Object.keys(L.days).sort().slice(0,-60).forEach(k=>delete L.days[k]);try{localStorage.setItem('afags_visits_local',JSON.stringify(L))}catch(e){}}
    st={total:L.total||0,today:{v:(L.days||{})[d]||0,u:(L.days||{})[d]?1:0},online:1,live:false}}
  if(once||st.live)try{sessionStorage.setItem('afags_vs','1')}catch(e){}VIS=st;visHooks.forEach(f=>{try{f(st)}catch(e){}});return st}
window.AFAGS_VISITS={get:()=>VIS,refresh:()=>visits(1)};
function visitsHTML(v){if(!v)return '<span class="vg-vload">Counting visitors…</span>';
  return `<span><b>${fmtN(v.total)}</b> website visits</span><i></i><span><b>${fmtN(v.today&&v.today.u)}</b> visitors today</span><i></i><span class="vg-on"><em></em><b>${fmtN(v.online)}</b> online now</span>${v.live?'':'<small>(this device — live counts appear when the site runs on the AFAGS server)</small>'}`}
/* ---------- build the section once, on the home page, after the last band ---------- */
function mount(){const band=document.querySelector('.band');const host=band&&band.closest('.w');if(!host||document.getElementById('voices'))return;
  const sec=document.createElement('section');sec.id='voices';sec.className='vg';sec.setAttribute('aria-labelledby','vgH');host.after(sec);render(sec)}
let S=null;
function render(sec){const L=items(),FM=fencerMap(),FN=FM.reduce((a,x)=>a+x.c,0);if(S&&S.destroy)S.destroy();sec.innerHTML='';sec.hidden=false;const sample=L.length&&L.every(v=>v.sample);
  const rated=L.filter(v=>+v.rating>0),avg=rated.length?(rated.reduce((a,v)=>a+ +v.rating,0)/rated.length).toFixed(1):null,places=new Set(L.map(v=>v.city)).size,countries=new Set(L.map(v=>v.country)).size;
  sec.innerHTML=`<div class="vg-bg" aria-hidden="true"></div><div class="vg-in">
   <div class="vg-hd"><p class="vg-eb">Voices of AFAGS</p><h2 id="vgH">Fencers, parents & coaches — from every corner of Gujarat and beyond</h2>
    <p class="vg-cap">Spin the globe or tap a face to read their story. Every pin is a member of our fencing family, placed where they train or compete.</p>
    </div>

   <div class="vg-globe" id="vgGlobe"><div class="vg-stars" aria-hidden="true">${Array.from({length:34},(_,i)=>{let s=11+i*7919;const r=()=>((s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff);let x,y;do{x=.02+r()*.96;y=.02+r()*.96}while(Math.hypot(x-.5,y-.5)<.44);return `<span style="left:${x*100}%;top:${y*100}%;width:${r()<.75?1:2}px;height:${r()<.75?1:2}px;animation-delay:${(r()*4).toFixed(2)}s;animation-duration:${(2.5+r()*3).toFixed(2)}s"></span>`}).join('')}</div>
    <div class="vg-fallback" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width=".6"><ellipse cx="50" cy="50" rx="50" ry="14"/><ellipse cx="50" cy="50" rx="50" ry="32"/><line x1="0" y1="50" x2="100" y2="50"/><ellipse cx="50" cy="50" rx="18" ry="50"/><ellipse cx="50" cy="50" rx="36" ry="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg></div>
    <div class="vg-canvas" aria-hidden="true"></div>
    <div class="vg-hubs" aria-hidden="true"></div><div class="vg-pins" role="group" aria-label="Voices on the globe">${L.map((v,i)=>`<button type="button" class="vg-pin" data-pin="${i}" tabindex="${i?-1:0}" style="--t:${TONES[v.tone]}" aria-label="Show the voice of ${esc(v.name)}, ${esc(v.city)}"><span class="vg-ping" style="animation-delay:${(i%5)*.6}s"></span><span class="vg-face">${v.photo&&!String(v.photo).startsWith('dom:')?`<img src="${esc(v.photo)}" alt="" draggable="false">`:`<em>${esc(ini(v.name))}</em>`}</span></button>`).join('')}</div></div>
   <div class="vg-meta">
    <div class="vg-stats"><span><b>${L.length}</b> ${L.length===1?'voice':'voices'}</span>${avg?`<i></i><span class="vg-avg">${STAR}<b>${avg}</b> average</span>`:''}<i></i><span><b>${places}</b> ${places===1?'place':'places'}</span>${countries>1?`<i></i><span><b>${countries}</b> countries</span>`:''}</div>
    ${FN?`<p class="vg-fm"><span class="vg-dot" aria-hidden="true"></span><b>${fmtN(FN)}</b> registered fencers in <b>${FM.length}</b> ${FM.length===1?'district':'districts'} <span class="vg-top">· ${FM.slice(0,3).map(x=>esc(x.d)+' '+fmtN(x.c)).join(' · ')}</span></p>`:''}
    <div class="vg-visits" id="vgVisits" aria-live="polite">${visitsHTML(VIS)}</div>
   </div>
   <div class="vg-region" id="vgRegion" aria-live="polite"><div class="vg-cards" id="vgCards">${L.length?'':`<figure class="vg-card vg-empty"><blockquote><p>No voices yet — be the first to tell us what fencing with AFAGS means to you.</p></blockquote><figcaption><button type="button" class="btn bo" data-vgshare>Share your experience <i>➜</i></button></figcaption></figure>`}</div>
    <div class="vg-foot"><div class="vg-nav"${L.length>1?'':' hidden'}><button type="button" class="vg-arrow" id="vgPrev" aria-label="Previous voice"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 3.5 5.5 8l4.5 4.5"/></svg></button><span class="vg-count" id="vgCount"></span><button type="button" class="vg-arrow" id="vgNext" aria-label="Next voice"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 3.5 10.5 8 6 12.5"/></svg></button></div><button type="button" class="btn bo vg-share" id="vgShare">Share your experience <i>➜</i></button></div>
    ${sample?'<p class="vg-sample">Sample voices — shown until real feedback is published in Admin › CMS › Voices.</p>':''}</div>
   <svg class="vg-leader" aria-hidden="true"><g><line x1="0" y1="0" x2="1" y2="0"/><circle class="a" r="3"/><circle class="b" r="3.5"/></g></svg>
  </div>`;
  sec.querySelectorAll('#vgShare,[data-vgshare]').forEach(b=>b.onclick=shareForm);
  S=globe(sec,L,FM)}
visHooks.add(v=>{const el=document.getElementById('vgVisits');if(el)el.innerHTML=visitsHTML(v)});
function card(v,i,n){const r=Math.max(0,Math.min(5,Math.round(+v.rating||0))),meta=[v.role,v.district&&v.district!==v.city?v.district+' district':''].filter(Boolean).join(' · ');
  return `<figure class="vg-card" data-i="${i}" style="--t:${TONES[v.tone]}"><div class="vg-ch"><svg class="vg-q" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.6 5.5C6.4 6.5 4.4 9.3 4.4 12.9v5.6h6.2v-6.2H7.7c.2-2 1.4-3.6 3.2-4.3L9.6 5.5Zm9.4 0c-3.2 1-5.2 3.8-5.2 7.4v5.6H20v-6.2h-2.9c.2-2 1.4-3.6 3.2-4.3L19 5.5Z"/></svg>${r?`<span class="vg-rate" role="img" aria-label="Rated ${r} out of 5">${[0,1,2,3,4].map(k=>`<i class="${k<r?'on':''}">${STAR}</i>`).join('')}</span>`:''}${v.sample?'<span class="vg-tag">Sample</span>':''}</div>
   <blockquote><p>${esc(v.quote)}</p></blockquote>
   <figcaption><span class="vg-av">${v.photo&&!String(v.photo).startsWith('dom:')?`<img src="${esc(v.photo)}" alt="">`:`<em>${esc(ini(v.name))}</em>`}</span><span class="vg-who"><b>${esc(v.name)}</b>${meta?`<small>${esc(meta)}</small>`:''}</span><span class="vg-where"><span>${esc(v.city)}</span><small>${esc(v.country||'')}</small></span></figcaption></figure>`}
/* ---------- the globe ---------- */
function globe(sec,L,FM){FM=FM||[];const mk=list=>{const mx=Math.max(1,...list.map(x=>x.c));return list.map(x=>({location:[x.lat,x.lng],size:.018+.05*Math.sqrt(x.c/mx)}))};const box=sec.querySelector('#vgGlobe'),host=box.querySelector('.vg-canvas'),pins=[...box.querySelectorAll('.vg-pin')],cards=sec.querySelector('#vgCards'),region=sec.querySelector('#vgRegion'),inner=sec.querySelector('.vg-in');
  const lead=sec.querySelector('.vg-leader g'),line=lead.querySelector('line'),dA=lead.querySelector('.a'),dB=lead.querySelector('.b');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const s={phi:facingPhi(L.length?L[0].lng:72),theta:THETA,vel:0,drag:false,pressed:false,moved:false,pid:-1,px:0,py:0,lx:0,lt:0,gap:0,turn:null,vec:L.map(v=>toCart(v.lat,v.lng)),depth:[],size:0,pin:38,featured:0,front:-1,
    onScreen:true,hover:null,cardHover:false,pinned:false,pinTimer:0,auto:0,raf:0,last:0,wide:false,ax:0,ay:0,gx:0,gy:0,shown:false,grow:0,growing:false,dead:false};
  let G=null,canvas=null;
  /* faces from nearby places fan out in a ring around the spot (like map markers), so none hide behind another */
  let CL=[],hubs=[];
  function cluster(){const unit=GR*s.size/2,ang=(a,b)=>Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2]))),ringR=n=>n>1?Math.max(s.pin*.78,n*s.pin*1.08/(2*Math.PI)):0;
    let C2=L.map((v,i)=>({m:[i],v:s.vec[i].slice()}));let merged=true;
    while(merged){merged=false;outer:for(let a=0;a<C2.length;a++)for(let b=a+1;b<C2.length;b++){const need=(ringR(C2[a].m.length)+ringR(C2[b].m.length)+s.pin*1.15)/unit;
      if(ang(C2[a].v,C2[b].v)<need){const m=C2[a].m.concat(C2[b].m),sum=[0,0,0];m.forEach(i=>{sum[0]+=s.vec[i][0];sum[1]+=s.vec[i][1];sum[2]+=s.vec[i][2]});const l=Math.hypot(...sum);C2[a]={m,v:sum.map(x=>x/l)};C2.splice(b,1);merged=true;break outer}}}
    CL=C2;const mem=new Array(L.length);CL.forEach((c,ci)=>{const n=c.m.length,R=ringR(n);c.R=R;c.m.forEach((i,k)=>{mem[i]={c:ci,a:-Math.PI/2+k*2*Math.PI/n,R}})});s.mem=mem;
    const hb=box.querySelector('.vg-hubs');hb.innerHTML=CL.map(c=>c.m.length>1?'<span class="vg-hub"><i></i></span>':'<span></span>').join('');hubs=[...hb.children]}
  function size(){const w=inner.clientWidth;s.wide=w>=860;const d=Math.round(s.wide?Math.min(400,w*.4):Math.min(300,w-40));if(d===s.size)return;s.size=d;s.pin=d>=380?44:d>=300?40:34;
    box.style.width=box.style.height=d+'px';inner.style.setProperty('--gd',d+'px');pins.forEach(p=>{p.style.width=p.style.height=s.pin+'px'});cluster();sec.classList.toggle('vg-wide',s.wide);
    if(G)G.update({width:d,height:d});else make();anchor();kick()}
  function make(){canvas=document.createElement('canvas');canvas.style.cssText='width:100%;height:100%;display:block';host.appendChild(canvas);
    try{G=window.AFAGS_COBE&&AFAGS_COBE(canvas,{devicePixelRatio:Math.min(devicePixelRatio||1,2),width:s.size,height:s.size,phi:s.phi,theta:s.theta,dark:1,diffuse:1.25,mapSamples:16000,mapBrightness:5.5,mapBaseBrightness:.02,baseColor:[.16,.26,.5],markerColor:[1,.6,.25],glowColor:[.32,.46,.86],markers:mk(FM),markerElevation:.01,opacity:.95})}catch(e){G=null}
    const gl=G?(canvas.getContext('webgl2')||canvas.getContext('webgl')):null;sec.dataset.gl=gl?'ready':'off';
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();sec.dataset.gl='off'});[150,600,1500].forEach(ms=>setTimeout(kick,ms))}
  function anchor(){const sr=inner.getBoundingClientRect(),br=box.getBoundingClientRect(),rr=region.getBoundingClientRect();s.gx=br.left-sr.left;s.gy=br.top-sr.top;s.ax=rr.left-sr.left;s.ay=rr.top-sr.top+Math.min(56,rr.height/2)}
  function place(now){const d=s.size;let front=-1,fd=-Infinity,fp=null;
    const CP=CL.map((c,ci)=>{const p=project(c.v,s.phi,s.theta,ALT),h=hubs[ci];if(h&&c.m.length>1){const o=pinOpacity(p.depth,p.rim),sc=pinScale(p.depth);h.style.opacity=o;h.style.transform=`translate3d(${(p.x*d).toFixed(1)}px,${(p.y*d).toFixed(1)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`;h.style.setProperty('--r',(c.R*2)+'px')}return p});
    s.vec.forEach((v,i)=>{const m=s.mem&&s.mem[i],cp=m?CP[m.c]:null,p=cp?{x:cp.x+Math.cos(m.a)*m.R*pinScale(cp.depth)/d,y:cp.y+Math.sin(m.a)*m.R*pinScale(cp.depth)/d,depth:cp.depth,rim:cp.rim}:project(v,s.phi,s.theta,ALT);s.depth[i]=p.depth;if(p.depth>fd){fd=p.depth;front=i}const el=pins[i],o=Math.round(pinOpacity(p.depth,p.rim)*100)/100,sc=pinScale(p.depth);
      el.style.opacity=o;el.style.zIndex=(i===s.featured?100:0)+Math.round((p.depth+1)*40);el.style.pointerEvents=o>.4?'auto':'none';
      if(o>0)el.style.transform=`translate3d(${(p.x*d).toFixed(1)}px,${(p.y*d).toFixed(1)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`;if(i===s.featured)fp={x:p.x*d,y:p.y*d,depth:p.depth,sc}});
    if(front>=0&&front!==s.front){const cur=s.depth[s.front]??-Infinity;if(s.front<0)s.front=front;else if(fd>cur+.06){s.front=front}}
    const show=s.wide&&!s.turn&&fp&&fp.depth>.15;if(show!==s.shown){s.shown=show;lead.style.opacity=show?1:0;if(show)s.grow=now}s.growing=false;if(!show)return;
    const x0=s.gx+fp.x,y0=s.gy+fp.y,dx=s.ax-x0,dy=s.ay-y0,dist=Math.hypot(dx,dy)||1,gap=s.pin/2*1.35*fp.sc+6,len=Math.max(0,dist-gap),g=reduced?1:smooth(clamp01((now-s.grow)/360));s.growing=g<1;
    const sx=x0+dx/dist*gap,sy=y0+dy/dist*gap;line.style.transform=`translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px) rotate(${Math.atan2(dy,dx).toFixed(4)}rad) scaleX(${Math.max(.001,len*g).toFixed(1)})`;
    dA.style.transform=`translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;dB.style.transform=`translate(${s.ax.toFixed(1)}px,${s.ay.toFixed(1)}px) scale(${g>=1?1:0})`}
  const spinning=()=>!reduced&&!s.pinned&&s.hover===null;
  function busy(){return s.drag||s.turn||s.growing||Math.abs(s.vel)>1e-4||spinning()}
  function frame(now){s.raf=0;if(s.dead)return;const dt=s.last?Math.min((now-s.last)/1000,.1):0;s.last=now;const t=s.turn;
    if(t){const k=reduced?1:clamp01((now-t.start)/TURN_MS);s.phi=t.from+(t.to-t.from)*easeOutExpo(k);s.vel=0;if(k>=1){s.turn=null;s.phi=t.to}}
    else if(!s.drag){if(Math.abs(s.vel)>1e-4){const st=dt*60;s.phi+=s.vel*st;s.vel*=Math.pow(FRICTION,st)}else{s.vel=0;if(spinning())s.phi+=.1*dt}}
    if(G)G.update({phi:s.phi,theta:s.theta});place(now);
    if(busy()&&s.onScreen&&!document.hidden)s.raf=requestAnimationFrame(frame);else s.last=0}
  function kick(){if(!s.raf&&!s.dead)s.raf=requestAnimationFrame(frame)}
  function turnTo(i){if(!L[i])return;const to=nearest(s.phi,facingPhi(L[i].lng));s.vel=0;if(reduced){s.phi=to;s.turn=null}else s.turn={from:s.phi,to,start:performance.now()};kick()}
  /* featured card */
  let shownI=-1;
  function feature(i,{turn=true,focus=false}={}){if(!L.length)return;i=((i%L.length)+L.length)%L.length;if(turn)turnTo(i);if(i===shownI)return;const old=cards.querySelector('.vg-card:not(.out)');
    s.featured=i;shownI=i;pins.forEach((p,k)=>{p.classList.toggle('on',k===i);p.tabIndex=k===i?0:-1;k===i?p.setAttribute('aria-current','true'):p.removeAttribute('aria-current')});
    cards.insertAdjacentHTML('beforeend',card(L[i],i,L.length));const nw=cards.lastElementChild;sec.querySelector('#vgCount').textContent=`${i+1} / ${L.length}`;
    if(old){old.classList.add('out');if(!reduced&&old.animate){old.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(12px) scale(.98)'}],{duration:SWAP_MS,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});nw.animate&&nw.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:SWAP_MS,easing:'cubic-bezier(.2,.8,.2,1)'});setTimeout(()=>old.remove(),SWAP_MS)}else old.remove()}
    s.grow=performance.now();if(focus)pins[i].focus({preventScroll:true});kick();schedule()}
  /* autoplay: one voice after another, paused by hover, a tap, keyboard focus, off-screen */
  function schedule(){clearTimeout(s.auto);if(reduced||L.length<2)return;s.auto=setTimeout(()=>{if(s.hover!==null||s.cardHover||s.pinned||s.drag||!s.onScreen||document.hidden||sec.contains(document.activeElement)&&document.activeElement.matches(':focus-visible')){schedule();return}feature(s.featured+1)},INTERVAL)}
  pins.forEach((p,i)=>{p.addEventListener('pointerenter',e=>{if(e.pointerType==='touch'||s.drag)return;s.hover=i;feature(i,{turn:false})});p.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch'&&s.hover===i){s.hover=null;kick()}});
    p.addEventListener('click',()=>{if(s.moved){s.moved=false;return}s.pinned=true;clearTimeout(s.pinTimer);s.pinTimer=setTimeout(()=>{s.pinned=false;kick()},HOLD_MS);shownI=-1;feature(i)});
    p.addEventListener('keydown',e=>{const n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?L.length-1:null;if(n===null)return;e.preventDefault();feature(n,{focus:true})})});
  sec.querySelector('#vgPrev').onclick=()=>feature(s.featured-1);sec.querySelector('#vgNext').onclick=()=>feature(s.featured+1);
  region.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')s.cardHover=true});region.addEventListener('pointerleave',()=>{s.cardHover=false});
  /* swipe the card on phones */
  let sw=null;region.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')sw={x:e.clientX,y:e.clientY}});region.addEventListener('pointerup',e=>{if(!sw)return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y;sw=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)feature(s.featured+(dx<0?1:-1))});
  /* drag to spin, flick for inertia */
  box.addEventListener('pointerdown',e=>{if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;Object.assign(s,{pressed:true,moved:false,pid:e.pointerId,px:e.clientX,py:e.clientY,lx:e.clientX,lt:e.timeStamp,gap:0,vel:0});if(!e.target.closest('.vg-pin'))begin(e)});
  function begin(e){s.drag=true;s.turn=null;try{box.setPointerCapture(e.pointerId)}catch(x){}box.classList.add('grab');kick()}
  box.addEventListener('pointermove',e=>{if(!s.pressed||e.pointerId!==s.pid)return;if(!s.drag){if(Math.hypot(e.clientX-s.px,e.clientY-s.py)<SLOP)return;if(Math.abs(e.clientY-s.py)>Math.abs(e.clientX-s.px)){s.pressed=false;return}s.moved=true;begin(e)}
    const d=(e.clientX-s.lx)/Math.max(s.size,1)*Math.PI,el=Math.max(e.timeStamp-s.lt,1);s.gap=el;s.lx=e.clientX;s.lt=e.timeStamp;s.phi+=d;s.vel=d/el*(1000/60);if(Math.abs(e.clientX-s.px)>SLOP)s.moved=true});
  const end=e=>{if(e&&e.pointerId!==s.pid)return;if(s.drag){const grace=Math.min(250,Math.max(80,s.gap*1.5));if(reduced||(e&&e.timeStamp-s.lt>grace))s.vel=0}s.drag=false;s.pressed=false;s.pid=-1;box.classList.remove('grab');kick();
    /* a spin that brings another face to the front features it */
    setTimeout(()=>{if(!s.drag&&s.front>=0&&s.front!==s.featured&&s.moved)feature(s.front,{turn:false})},700)};
  box.addEventListener('pointerup',end);box.addEventListener('pointercancel',()=>{s.vel=0;end()});
  /* pause off-screen and in background tabs */
  const io=new IntersectionObserver(es=>{s.onScreen=es[es.length-1].isIntersecting;if(s.onScreen){kick();schedule()}});io.observe(sec);
  const vis=()=>{if(!document.hidden){kick();schedule()}};document.addEventListener('visibilitychange',vis);
  const ro=new ResizeObserver(()=>{size();anchor();kick()});ro.observe(inner);
  size();shownI=-1;feature(0,{turn:false});
  const mt=setInterval(()=>{const F2=fencerMap();if(G&&JSON.stringify(F2)!==JSON.stringify(FM)){FM=F2;try{G.update({markers:mk(FM)})}catch(e){}kick()}},15000);
  return {destroy(){clearInterval(mt);s.dead=true;clearTimeout(s.auto);clearTimeout(s.pinTimer);io.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',vis);cancelAnimationFrame(s.raf);try{G&&G.destroy()}catch(e){}}}}
/* ---------- "Share your experience" → AFAGS inbox (the office publishes it on the globe) ---------- */
function shareForm(){const D=['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'];
  const {m,close}=modal(`<h3>Share your experience</h3><p class="v3-muted">Tell us about fencing with AFAGS. With your permission, the office may show it on the globe on our home page.</p>
  <form class="v3-form vg-form" id="vgF" novalidate><div class="v3-grid2"><label>Your name<input name="name" required maxlength="60" autocomplete="name"></label>
   <label>You are a<select name="role" required><option value="">Choose</option>${['Fencer','Parent / Guardian','Coach','Referee / Official','Club','Volunteer','Fan'].map(x=>`<option>${x}</option>`).join('')}</select></label>
   <label>District<select name="district" required><option value="">Choose</option>${D.map(x=>`<option>${x}</option>`).join('')}<option>Outside Gujarat</option></select></label>
   <label>Where you train / competed (optional)<input name="place" maxlength="60" list="vgPl" placeholder="e.g. Surat, Patiala, Tashkent"><datalist id="vgPl">${Object.keys(PLACES).map(x=>`<option value="${esc(x)}">`).join('')}</datalist></label></div>
   <fieldset class="vg-rf"><legend>Your rating</legend>${[5,4,3,2,1].map(n=>`<input type="radio" name="rating" value="${n}" id="vgr${n}" ${n===5?'checked':''}><label for="vgr${n}" title="${n} star${n>1?'s':''}">${STAR}</label>`).join('')}</fieldset>
   <label>Your feedback<textarea name="message" required maxlength="300" rows="4" placeholder="What has fencing with AFAGS meant to you?"></textarea></label>
   <label>Email or mobile (only for the office, never shown)<input name="contact" maxlength="80"></label>
   <label class="v3-chk"><input type="checkbox" name="consent" value="Yes" required> AFAGS may publish my name, district and feedback on its website</label>
   <div class="hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>
   <button class="v3-btn" type="submit">Send feedback</button><div class="v3-fmsg"></div></form>`,'vg-mdl');
  const f=m.querySelector('#vgF');f.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(f);if(fd.get('website'))return close();const bad=[...f.querySelectorAll('[required]')].filter(i=>i.type==='checkbox'?!i.checked:!String(i.value).trim());
    f.querySelectorAll('.bad').forEach(x=>x.classList.remove('bad'));bad.forEach(x=>x.classList.add('bad'));if(bad.length){f.querySelector('.v3-fmsg').innerHTML='<div class="v3-err">Please fill in the highlighted fields.</div>';bad[0].focus();return}
    const cl=v=>String(v||'').replace(/[\u0000-\u001f]/g,' ').trim();const rec={id:'FBK-'+Date.now().toString(36).toUpperCase(),type:'feedback',at:Date.now(),status:'New',name:cl(fd.get('name')).slice(0,60),role:cl(fd.get('role')),district:cl(fd.get('district')),place:cl(fd.get('place')).slice(0,60),rating:cl(fd.get('rating')),message:cl(fd.get('message')).slice(0,300),contact:cl(fd.get('contact')).slice(0,80),consent:'Yes',subject:'Website feedback ('+cl(fd.get('rating'))+'★)'};
    C.addInbox(rec);C.audit('website-form','feedback '+rec.id);f.innerHTML=`<div class="v3-ok">✓ Thank you, ${esc(rec.name)}! Your feedback reached the AFAGS office (ref. <b>${rec.id}</b>). Once approved it will appear on the globe.</div>`})}
window.AFAGS_VOICES={refresh(){const sec=document.getElementById('voices');sec?render(sec):mount()},share:shareForm};
const start=()=>{try{mount()}catch(e){console.warn('voices',e)}visits(0);setInterval(()=>{if(!document.hidden)visits(1)},60000)};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else setTimeout(start,0);
addEventListener('message',e=>{const d=e.data||{};if(d.afags==='cms'&&(d.c==='voices'||d.c==='site'))window.AFAGS_VOICES.refresh()});
addEventListener('storage',e=>{if(e.key==='afags_cms_voices')window.AFAGS_VOICES.refresh()});
})();

/*VOICESEND*/
