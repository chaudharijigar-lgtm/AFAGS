
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* loader */
const lt=$('#lt');lt.innerHTML=[...lt.textContent].map((c,i)=>`<span style="animation-delay:${i*.05}s">${c===' '?'&nbsp;':c}</span>`).join('');
const finish=()=>{const l=$('#loader');if(l.classList.contains('done'))return;l.classList.add('done');requestAnimationFrame(()=>document.body.classList.add('ready'))};
addEventListener('load',()=>setTimeout(finish,reduce?0:1400));setTimeout(finish,3500);

/* ticker loop */
const tk=$('#tk');tk.innerHTML+=tk.innerHTML;

/* scroll effects */
const hd=$('#hd'),pg=$('#prog'),tp=$('#top'),run=$('#runner'),ring=$('#ring');
addEventListener('scroll',()=>{const s=scrollY,h=document.documentElement.scrollHeight-innerHeight,p=h>0?s/h:0;
  pg.style.width=p*100+'%';run.style.left=p*100+'%';run.style.opacity=p>.01?1:0;ring.style.strokeDashoffset=157*(1-p);
  hd.classList.toggle('sh',s>8);tp.classList.toggle('s',s>600);
  if(!reduce&&s<1000){hsc=s;heroFx()}},{passive:true});
tp.onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* mobile menu */
const b=$('#bg'),m=$('#mn');
b.onclick=()=>{m.classList.toggle('op');b.classList.toggle('x')};
m.querySelectorAll('a').forEach(a=>a.onclick=()=>{m.classList.remove('op');b.classList.remove('x');m.querySelectorAll('a').forEach(x=>x.classList.remove('on'));a.classList.add('on')});

/* text size */
let fs=100;$('#fs').onclick=e=>{e.preventDefault();fs=fs>=120?90:fs+10;document.documentElement.style.fontSize=fs+'%'};

/* cursor glow + hero parallax (map moves between photo and fencers) */
const glow=$('#glow'),mapL=$('#mapL'),kbw=$('#kbw'),heroEl=$('.hero');let mx=0,my=0,hsc=0;
function heroFx(){const k=Math.min(hsc/700,1);mapL.style.transform=`translate(${mx*22-hsc*.07}px,${my*14-hsc*.05}px) rotate(${-k*2}deg)`;kbw.style.translate=`${mx*-8}px ${my*-6+hsc*.14}px`}
addEventListener('mousemove',e=>{document.body.classList.add('hasmouse');glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
heroEl.addEventListener('mousemove',e=>{if(reduce)return;const r=heroEl.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;heroFx()});
heroEl.addEventListener('mouseleave',()=>{mx=my=0;heroFx()});
/* hero slider */
const sl=[...document.querySelectorAll('#slides .slide')],hd2=[...document.querySelectorAll('#hDots button')];let si=0,stimer;
function hgo(n){sl[si].classList.remove('on');hd2[si].classList.remove('on');si=(n+sl.length)%sl.length;sl[si].classList.add('on');void hd2[si].offsetWidth;hd2[si].classList.add('on');hreset()}
function hreset(){clearInterval(stimer);stimer=setInterval(()=>{if(!document.documentElement.classList.contains('hero-paused'))hgo(si+1)},6500)}
$('#hNext').onclick=()=>hgo(si+1);$('#hPrev').onclick=()=>hgo(si-1);hd2.forEach((d,k)=>d.onclick=()=>hgo(k));hreset();
let sx=null;heroEl.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
heroEl.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)hgo(si+(dx<0?1:-1));sx=null});

/* blade clash sparks */
const cl=$('#clash');for(let i=0;i<14;i++){const s=document.createElement('b'),a=Math.random()*Math.PI*2,d=30+Math.random()*60;s.style.setProperty('--x',Math.cos(a)*d+'px');s.style.setProperty('--y',Math.sin(a)*d+'px');s.style.animationDelay=(2.2+Math.random()*.08)+'s';cl.appendChild(s)}
/* dust */
const du=$('#dust');for(let i=0;i<34;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.top=60+Math.random()*45+'%';s.style.animationDuration=7+Math.random()*9+'s';s.style.animationDelay=-Math.random()*14+'s';du.appendChild(s)}
/* hero live badge score */
/* live badge is driven by real Live Centre data (site v5) */

/* split headings */
$$('.tt h2').forEach(h=>{const t=h.textContent;h.innerHTML='';let i=0;t.split(' ').forEach((w,wi)=>{if(wi)h.appendChild(document.createTextNode(' '));const wd=document.createElement('span');wd.className='wd';[...w].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;s.style.transitionDelay=(i++)*30+'ms';wd.appendChild(s)});i++;h.appendChild(wd)})});

/* stagger delays */
$$('.stg').forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=i*80+'ms'));
$$('.dt').forEach((d,i)=>d.style.transitionDelay=(.3+(i%4)*.15)+'s');
$$('.timg').forEach((d,i)=>{d.style.setProperty('--d',i)});
const st=document.createElement('style');st.textContent=[0,1,2,3].map(i=>`.ni:nth-child(${i+1}) .timg::after{transition-delay:${.3+i*.15}s}`).join('');document.head.appendChild(st);

/* counters */
const count=el=>{const t=+el.dataset.n,suf=el.dataset.s??'+',d=1600,s0=performance.now();(function f(n){const p=Math.min((n-s0)/d,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(t*e).toLocaleString('en-IN')+(p===1?suf:'');if(p<1)requestAnimationFrame(f)})(s0)};

/* access matrix */
const rows=[['Registration',[1,1,1,1,1,1]],['Profile Management',[1,1,1,1,1,1]],['Event Registration',[1,1,0,1,1,1]],['Results & Rankings',[1,1,1,1,1,1]],['Certificates',[1,1,1,0,0,1]],['Downloads',[1,1,1,1,1,1]],['News & Updates',[1,1,1,1,1,1]],['Dashboard',[0,1,1,1,1,1]],['Manage Members',[0,0,0,1,1,1]],['Event Management',[0,0,0,0,1,1]],['Reports & Analytics',[0,0,0,0,1,1]]];
let k=0;if($('#mxBody'))$('#mxBody').innerHTML=rows.map(([n,v])=>`<tr><td>${n}</td>${v.map((x,i)=>`<td>${x?`<span class="ck c${i+1}" style="transition-delay:${(k++)*.018}s">✓</span>`:'<span style="color:#c5ccda">–</span>'}</td>`).join('')}</tr>`).join('');

/* rankings */
const data=[[['Fencer C','Vadodara',1180],['Fencer D','Ahmedabad',1105],['Fencer E','Rajkot',990],['Fencer F','Surat',920],['Fencer G','Gandhinagar',860]],
[['Fencer A','Ahmedabad',1250],['Fencer B','Surat',1190],['Fencer H','Bhavnagar',1010],['Fencer I','Vadodara',955],['Fencer J','Rajkot',870]],
[['Fencer K','Gandhinagar',1210],['Fencer L','Ahmedabad',1120],['Fencer M','Surat',1040],['Fencer N','Jamnagar',930],['Fencer O','Anand',845]]];
const rk=$('#rkList');
function showRank(w,animate){rk.innerHTML=data[w].map((r,i)=>`<div class="rk"><span class="no">${i+1}</span><div><b>${r[0]}</b><small style="color:var(--mu);font-size:11px">${r[1]}</small><div class="bar"><i data-w="${r[2]/13}"></i></div></div><span class="pt">${r[2]}</span></div>`).join('');
  if(animate)requestAnimationFrame(()=>setTimeout(()=>rk.querySelectorAll('.bar i').forEach(i=>i.style.width=i.dataset.w+'%'),30))}
let rankSeen=false;showRank(0,false);
$('#tabs').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;$$('#tabs button').forEach(x=>x.classList.remove('on'));t.classList.add('on');showRank(+t.dataset.w,true)});

/* live scoring */
let started=false;
function startBout(){if(started)return;started=true;
  const pL=$('#pL'),pR=$('#pR'),lL=$('#lampL'),lR=$('#lampR'),feed=$('#feed'),clk=$('#clk'),per=$('#per'),hist=$('#hist');
  let L=0,R=0,t=180,p=1;const moves=['direct attack','riposte','counter-attack','flèche','parry–riposte','remise','stop-hit to the wrist','toe touch'];
  setInterval(()=>{t--;if(t<0){t=180;p=p%3+1;per.textContent='Period '+p}clk.textContent=Math.floor(t/60)+':'+String(t%60).padStart(2,'0')},1000);
  setInterval(()=>{
    if(L>=15||R>=15){L=R=0;pL.textContent=pR.textContent=0;hist.innerHTML='';feed.textContent='New bout — fencers on guard';return}
    const dbl=Math.random()<.18,left=Math.random()<.5;
    if(dbl){L++;R++;lL.classList.add('on');lR.classList.add('on');pL.textContent=L;pR.textContent=R;pL.classList.add('bump');pR.classList.add('bump');hist.insertAdjacentHTML('beforeend','<span class="l">D</span><span class="r">D</span>');feed.textContent='Double touch!'}
    else{left?L++:R++;const lamp=left?lL:lR,el=left?pL:pR;el.textContent=left?L:R;lamp.classList.add('on');el.classList.add('bump');hist.insertAdjacentHTML('beforeend',`<span class="${left?'l':'r'}">${left?'A':'B'}</span>`);feed.textContent=(left?'Touch Fencer A':'Touch Fencer B')+' — '+moves[Math.floor(Math.random()*moves.length)]}
    setTimeout(()=>{[lL,lR,pL,pR].forEach(x=>x.classList.remove('on','bump'))},700);
  },2300)}

/* observer */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');
  t.querySelectorAll('[data-n]').forEach(count);
  if(t.querySelector('#board'))startBout();
  if(t.querySelector('#rank')&&!rankSeen){rankSeen=true;showRank(0,true)}
  io.unobserve(t)}),{threshold:.15});
$$('.reveal,.stg,.tt,.fromL,.fromR,.zoom').forEach(el=>io.observe(el));

/* 3D tilt + magnetic buttons */
if(!reduce&&matchMedia('(hover:hover)').matches){
  $$('.kc,.po,.pn,.board,.dash,.rank,.about,.disc').forEach(el=>{el.classList.add('tilt');
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transition='transform .1s';el.style.transform=`perspective(1000px) rotateY(${x*7}deg) rotateX(${y*-7}deg) translateY(-5px)`});
    el.addEventListener('mouseleave',()=>{el.style.transition='transform .6s cubic-bezier(.2,.8,.2,1)';el.style.transform=''})});
  $$('.btn').forEach(bt=>{bt.addEventListener('mousemove',e=>{const r=bt.getBoundingClientRect();bt.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.3}px)`});bt.addEventListener('mouseleave',()=>bt.style.transform='')});
}

/* ripple */
document.addEventListener('click',e=>{const bt=e.target.closest('.btn,.tabs button');if(!bt)return;const r=bt.getBoundingClientRect(),s=Math.max(r.width,r.height),d=document.createElement('span');d.className='rip';d.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;bt.style.position='relative';bt.style.overflow='hidden';bt.appendChild(d);setTimeout(()=>d.remove(),650)});
})();

/* ===== LIQUID GLASS THEME: glass surfaces, app icons, dock ===== */
(()=>{
const $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* glass panels */
$$('.box,.kc,.po,.pn').forEach(el=>{el.classList.add('glass');const sh=document.createElement('span');sh.className='sheen';el.prepend(sh)});
$$('.board').forEach(el=>el.classList.add('glass-dark'));
if(!reduce)document.addEventListener('pointermove',e=>{const el=e.target.closest('.glass');if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
/* turn an svg white for an app icon; keep cut-outs as tinted */
function whiten(svg){[svg,...svg.querySelectorAll('*')].forEach(n=>{['fill','stroke'].forEach(a=>{const v=n.getAttribute(a);if(!v||v==='none')return;const vv=v.toLowerCase();n.setAttribute(a,(vv==='#fff'||vv==='#ffffff'||vv==='white')&&n!==svg?'rgba(0,0,0,.22)':'#fff')})})}
const pal={
  '.pil .ic':['c-blue','c-indigo','c-orange','c-teal','c-green'],
  '.iv .ic':['c-navy','c-saffron','c-green','c-indigo','c-red','c-mint'],
  '.dc .bd':['c-navy','c-saffron','c-green'],
  '.st > svg':['c-green','c-saffron','c-indigo','c-teal'],
  '.g > svg':['c-green','c-saffron','c-indigo','c-mint','c-yellow','c-purple','c-teal'],
  '.kc > svg':['c-saffron','c-orange','c-navy','c-purple','c-green','c-red','c-blue','c-mint','c-pink'],
  '.po > svg':['c-blue','c-saffron','c-green','c-purple','c-teal','c-indigo'],
  '.rs a > svg':['c-navy','c-indigo','c-green','c-blue','c-orange','c-purple','c-teal','c-red'],
  '.ql a > svg':['c-blue','c-green','c-yellow','c-purple','c-saffron'],
  '.mx th > svg':['c-navy','c-saffron','c-green','c-purple','c-teal','c-red'],
  '.ci > svg':['c-saffron','c-saffron','c-saffron','c-saffron']
};
Object.entries(pal).forEach(([sel,cols])=>{
  $$(sel).forEach((el,i)=>{const c=cols[i%cols.length];
    if(el.tagName.toLowerCase()==='svg'){const w=document.createElement('span');w.className='appicon '+c;el.replaceWith(w);w.appendChild(el);whiten(el)}
    else{el.classList.add('appicon',c);el.style.background='';const sv=el.querySelector('svg');if(sv)whiten(sv)}
  })
});
/* footer contact blocks get grouped icons too */
/* dock: show after hero */
const dock=document.getElementById('dock');
addEventListener('scroll',()=>dock.classList.toggle('show',scrollY>380),{passive:true});
})();

/* ===== Discipline "More Info" dialog ===== */
(()=>{
const W={
 foil:{name:'Foil',color:'#1d3f8a',tag:'Precision & tactics — the classic training weapon.',
  ov:'Foil is a light thrusting weapon. Touches are scored only with the point on the valid target — the torso. It teaches timing, distance and the "right of way" convention, which is why most fencers start with foil.',
  facts:[['Max weight','500 g'],['Max length','110 cm'],['Target','Torso']],
  rules:['Valid target is the torso (front, back and groin) — arms, legs and head are off-target.','Touches are made with the point only; the tip must be pressed with a set force to register.','Right of way decides who scores when both fencers hit at the same time.','Fencers wear a conductive lamé jacket so on-target touches light up.','Pool bouts go to 5 touches (3 min); direct elimination bouts go to 15 touches (3 × 3 min).']},
 epee:{name:'Épée',color:'#e0620b',tag:'The whole body is the target.',
  ov:'Épée is the heaviest thrusting weapon. The entire body — head to toe — is valid target, and there is no right of way: whoever hits first scores, and if both hit together each fencer gets a point.',
  facts:[['Max weight','770 g'],['Max length','110 cm'],['Target','Whole body']],
  rules:['The entire body, including the mask and feet, is valid target.','Touches are made with the point only.','No right of way — the first to hit scores; simultaneous hits give a double touch.','Patience, counter-attacks and distance control are the key skills.','Pool bouts go to 5 touches (3 min); direct elimination bouts go to 15 touches (3 × 3 min).']},
 sabre:{name:'Sabre',color:'#16702f',tag:'The fastest weapon — cuts and thrusts.',
  ov:'Sabre scores with both the edge and the point. The target is everything above the waist, including arms and mask. Bouts are fast and explosive, and right of way decides simultaneous actions.',
  facts:[['Max weight','500 g'],['Max length','105 cm'],['Target','Above waist']],
  rules:['Valid target is above the waist — torso, arms and head (hands excluded).','Touches can be cuts with the edge or thrusts with the point.','Right of way applies, like foil.','Fencers wear a conductive lamé jacket, sleeve-cuffs and a conductive mask.','Direct elimination bouts go to 15 touches, with a break when one fencer reaches 8.']}
};
const AGES=[['U-10','Sub-Junior','a-sj','Introductory / mini-fencing level'],['U-12','Sub-Junior','a-sj','Development level'],['U-14','Sub-Junior','a-sj','State & national sub-junior events'],['U-17','Cadet','a-c','Cadet championships & circuits'],['U-20','Junior','a-j','Junior championships & selection'],['Senior','Senior','a-s','State & national senior events'],['Open','Open age','a-o','Open to all eligible age groups']];
const imgs={};document.querySelectorAll('.dc').forEach((dc,i)=>{const im=dc.querySelector('.dphoto img');if(im)imgs[['foil','epee','sabre'][i]]=im.src});
const wm=document.getElementById('wm'),body=document.getElementById('wmBody'),tabs=[...wm.querySelectorAll('.wm-tabs button')];let last=null;
function pane(id,html,on){return `<div class="wm-pane${on?' on':''}" data-p="${id}" role="tabpanel">${html}</div>`}
function render(k){const d=W[k];wm.style.setProperty('--wc',d.color);
  document.getElementById('wmBadge').textContent='Discipline';document.getElementById('wmTitle').textContent=d.name;document.getElementById('wmTag').textContent=d.tag;
  document.getElementById('wmWpn').setAttribute('href',{foil:'#wFoil',epee:'#wEpee',sabre:'#wSabre'}[k]);const img=document.getElementById('wmImg');img.src=imgs[k]||'';img.alt=d.name+' fencer';img.style.animation='none';img.offsetWidth;img.style.animation='';
  body.innerHTML=
   pane('ov',`<div class="facts">${d.facts.map(f=>`<div class="fact"><small>${f[0]}</small><b>${f[1]}</b></div>`).join('')}</div><h4>About ${d.name}</h4><p>${d.ov}</p><div class="wm-cta"><a href="#/calendar/all" class="btn bo" data-close>Register for Events <i>➜</i></a><a href="#/sport/academies" class="btn bn" data-close>Find a Club</a></div>`,1)+
   pane('ru',`<h4>${d.name} Rules at a Glance</h4><ul class="rules">${d.rules.map(r=>`<li>${r}</li>`).join('')}</ul><p class="note" style="margin-top:12px">Summary only — official FIE / FAI rules apply in competition.</p>`)+
   pane('ag',`<h4>Age Groups — ${d.name}</h4><table class="agetbl"><thead><tr><th>Age</th><th>Category</th><th>Level</th></tr></thead><tbody>${AGES.map(a=>`<tr><td><span class="tag ${a[2]}">${a[0]}</span></td><td><b>${a[1]}</b></td><td>${a[3]}</td></tr>`).join('')}</tbody></table><p class="note">Age eligibility for each season follows FAI / AFAGS circulars.</p>`)+
   pane('ev',`<h4>${d.name} Events</h4><div class="evgrid"><div class="evcard"><b>Men's</b><small>Individual</small></div><div class="evcard"><b>Women's</b><small>Individual</small></div><div class="evcard"><b>Team</b><small>Men's &amp; Women's</small></div></div><p>Held in every age group from U-10 to Senior, plus Open events, at district, state and national level.</p><div class="wm-cta"><a href="#/calendar/all" class="btn bg" data-close>View Event Calendar <i>➜</i></a></div>`);
  tabs.forEach((t,i)=>t.setAttribute('aria-selected',i===0))}
function open(k,btn){last=btn;render(k);wm.classList.add('open');wm.setAttribute('aria-hidden','false');document.body.classList.add('wm-lock');setTimeout(()=>tabs[0].focus(),60)}
function close(){wm.classList.remove('open');wm.setAttribute('aria-hidden','true');document.body.classList.remove('wm-lock');if(last)last.focus()}
document.querySelectorAll('.moreinfo').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(b.dataset.w,b)}));
wm.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close()});
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',x===t));body.querySelectorAll('.wm-pane').forEach(p=>p.classList.toggle('on',p.dataset.p===t.dataset.t));body.scrollTop=0}));
document.addEventListener('keydown',e=>{if(!wm.classList.contains('open'))return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const i=tabs.indexOf(document.activeElement);if(i>-1){const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.click();n.focus()}}
  if(e.key==='Tab'){const f=[...wm.querySelectorAll('button,a[href]')].filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
/* swipe down to close on phones */
let sy=null;const card=document.getElementById('wmCard');
card.addEventListener('touchstart',e=>{if(document.getElementById('wmBody').scrollTop>0)return;sy=e.touches[0].clientY},{passive:true});
card.addEventListener('touchmove',e=>{if(sy===null)return;const d=e.touches[0].clientY-sy;if(d>0)card.style.transform=`translateY(${d}px)`},{passive:true});
card.addEventListener('touchend',e=>{if(sy===null)return;const d=e.changedTouches[0].clientY-sy;card.style.transform='';sy=null;if(d>110)close()});
/* make the whole card image / title open it too */
document.querySelectorAll('.dc').forEach((dc,i)=>{const k=['foil','epee','sabre'][i];dc.querySelector('.dphoto')?.addEventListener('click',()=>open(k,dc.querySelector('.moreinfo')))});
})();

/* ===== Member Login → Access Portals list ===== */
(()=>{
const lp=document.getElementById('lp'),card=document.getElementById('lpCard');let last=null;
lp.querySelectorAll('.lp-row').forEach((r,i)=>r.style.setProperty('--d',(.08+i*.05)+'s'));
function open(trigger){last=trigger||document.activeElement;
  document.getElementById('wm')?.classList.contains('open')&&document.querySelector('#wm [data-close]').click();
  lp.classList.add('open');lp.setAttribute('aria-hidden','false');document.body.classList.add('lp-lock');setTimeout(()=>lp.querySelector('.lp-row').focus(),80)}
function close(){lp.classList.remove('open');lp.setAttribute('aria-hidden','true');document.body.classList.remove('lp-lock');if(last&&last.focus)last.focus()}
document.addEventListener('click',e=>{const a=e.target.closest('a[href="#portals"],a[href="#login"]');if(!a)return;e.preventDefault();e.stopPropagation();
  document.getElementById('mn')?.classList.remove('op');document.getElementById('bg')?.classList.remove('x');open(a)},true);
lp.addEventListener('click',e=>{if(e.target.closest('[data-lpclose]'))close()});

document.addEventListener('keydown',e=>{if(!lp.classList.contains('open'))return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){const rows=[...lp.querySelectorAll('.lp-row')],i=rows.indexOf(document.activeElement);if(i>-1){e.preventDefault();rows[(i+(e.key==='ArrowDown'?1:rows.length-1))%rows.length].focus()}}
  if(e.key==='Tab'){const f=[...lp.querySelectorAll('button,a[href]')];const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
let sy=null;
card.addEventListener('touchstart',e=>{if(lp.querySelector('.lp-list').scrollTop>0)return;sy=e.touches[0].clientY},{passive:true});
card.addEventListener('touchmove',e=>{if(sy===null)return;const d=e.touches[0].clientY-sy;if(d>0)card.style.transform=`translateY(${d}px)`},{passive:true});
card.addEventListener('touchend',e=>{if(sy===null)return;const d=e.changedTouches[0].clientY-sy;card.style.transform='';sy=null;if(d>110)close()});
if(location.hash==='#portals'||location.hash==='#login')setTimeout(()=>open(null),1600);
})();

/* ===== Office Bearers panel + Our Fencers ===== */
(()=>{
/* fencer photos reuse the discipline cutouts */
const src={};['foil','epee','sabre'].forEach((k,i)=>{const im=document.querySelectorAll('.dc .dphoto img')[i];if(im)src[k]=im.src});
document.querySelectorAll('.fz-img').forEach(im=>{im.src=src[im.dataset.src]||''});
/* weapon filter */
const tabs=[...document.querySelectorAll('.fz-tabs button')],cards=[...document.querySelectorAll('.fz')];
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('on',x===t));const f=t.dataset.f;
  cards.forEach((c,i)=>{const show=f==='all'||c.dataset.w===f;c.classList.toggle('hide',!show);if(show){c.classList.remove('pop');void c.offsetWidth;c.style.animationDelay=(i%4)*60+'ms';c.classList.add('pop')}});
  document.getElementById('fzGrid').scrollTo({left:0,behavior:'smooth'})}));
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('pop');io.unobserve(e.target)}}),{threshold:.15});
cards.forEach((c,i)=>{c.style.animationDelay=(i%4)*80+'ms';io.observe(c)});
/* tilt */
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.obc,.fz').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transition='transform .1s';el.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${y*-8}deg) translateY(-6px)`});
  el.addEventListener('mouseleave',()=>{el.style.transition='';el.style.transform=''})})}
/* View More panel */
const p=document.getElementById('obp');let last=null;
p.querySelectorAll('.obl').forEach((r,i)=>{r.classList.add('lp-row');r.style.setProperty('--d',(.08+i*.05)+'s')});
const open=b=>{last=b;p.classList.add('open');p.setAttribute('aria-hidden','false');document.body.classList.add('lp-lock');setTimeout(()=>p.querySelector('.lp-close').focus(),60)};
const close=()=>{p.classList.remove('open');p.setAttribute('aria-hidden','true');document.body.classList.remove('lp-lock');last&&last.focus()};
document.getElementById('obMore').addEventListener('click',e=>open(e.currentTarget));
p.addEventListener('click',e=>{if(e.target.closest('[data-obclose]'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&p.classList.contains('open'))close()});
})();

/* ===== Our Fencers carousel ===== */
(()=>{
const car=document.getElementById('fzCar'),g=document.getElementById('fzGrid'),dots=document.getElementById('fzDots'),bar=document.getElementById('fzBar'),play=document.getElementById('fzPlay');
const T=3800,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let timer=null,paused=reduce,user=false,inView=false;
car.style.setProperty('--t',T+'ms');
const vis=()=>[...g.querySelectorAll('.fz')].filter(c=>!c.classList.contains('hide'));
const step=()=>{const c=vis();return c.length>1?c[1].offsetLeft-c[0].offsetLeft:(c[0]?.offsetWidth||1)};
const pages=()=>{const n=vis().length,per=Math.max(1,Math.round(g.clientWidth/step()));return Math.max(1,n-per+1)};
const idx=()=>Math.min(pages()-1,Math.round(g.scrollLeft/step()));
function buildDots(){dots.innerHTML='';for(let i=0;i<pages();i++){const b=document.createElement('button');b.setAttribute('aria-label','Go to slide '+(i+1));b.onclick=()=>{go(i);kick()};dots.appendChild(b)}mark()}
function mark(){const i=idx();[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===i))}
function go(i){const n=pages();i=(i+n)%n;g.scrollTo({left:i*step(),behavior:reduce?'auto':'smooth'})}
const next=()=>go(idx()>=pages()-1?0:idx()+1),prev=()=>go(idx()-1);
function restartBar(){bar.classList.remove('run');void bar.offsetWidth;if(!paused&&inView)bar.classList.add('run')}
function schedule(){clearTimeout(timer);restartBar();if(paused||!inView)return;timer=setTimeout(()=>{next();schedule()},T)}
function kick(){schedule()}
function setPaused(v,byUser){if(byUser)user=v;paused=v||user;car.classList.toggle('paused',paused);play.textContent=paused?'▶':'❚❚';play.setAttribute('aria-label',paused?'Play auto-slide':'Pause auto-slide');paused?clearTimeout(timer):schedule()}
document.getElementById('fzNext').onclick=()=>{next();kick()};document.getElementById('fzPrev').onclick=()=>{prev();kick()};
play.onclick=()=>setPaused(!user,true);
car.addEventListener('mouseenter',()=>{if(!user){paused=true;car.classList.add('paused');clearTimeout(timer)}});
car.addEventListener('mouseleave',()=>{if(!user&&!reduce){paused=false;car.classList.remove('paused');schedule()}});
car.addEventListener('focusin',()=>{if(!user){paused=true;clearTimeout(timer)}});
car.addEventListener('focusout',()=>{if(!user&&!reduce){paused=false;schedule()}});
let tt;g.addEventListener('touchstart',()=>{clearTimeout(timer);clearTimeout(tt)},{passive:true});
g.addEventListener('touchend',()=>{tt=setTimeout(()=>{if(!paused)schedule()},2500)},{passive:true});
let st;g.addEventListener('scroll',()=>{clearTimeout(st);st=setTimeout(mark,80)},{passive:true});
car.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){next();kick()}if(e.key==='ArrowLeft'){prev();kick()}});
new IntersectionObserver(es=>{inView=es[0].isIntersecting;inView?schedule():clearTimeout(timer)},{threshold:.3}).observe(car);
document.querySelectorAll('.fz-tabs button').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{g.scrollTo({left:0});buildDots();schedule()},30)));
addEventListener('resize',()=>{clearTimeout(st);st=setTimeout(buildDots,150)});
if(reduce){play.textContent='▶'}
buildDots();
})();

/* ===== Member Login → open AFAGS Portal (embedded) ===== */
(()=>{
const SRC="";
let ov=null,last=null;
function html(){const bin=atob(SRC),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new TextDecoder().decode(u)}
function open(trigger,push=true){last=trigger||null;
  document.getElementById('lp')?.classList.contains('open')&&document.querySelector('#lp [data-lpclose]').click();
  document.getElementById('mn')?.classList.remove('op');document.getElementById('bg')?.classList.remove('x');
  if(!ov){ov=document.createElement('div');ov.className='pov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','AFAGS Member Portal');
    const f=document.createElement('iframe');f.title='AFAGS Member Portal';if(SRC)f.srcdoc=html();else f.src='afags-portal.html';ov.appendChild(f);document.body.appendChild(ov);
    f.addEventListener('load',()=>{try{f.contentWindow.document.getElementById('u')?.focus()}catch(e){}})}
  requestAnimationFrame(()=>ov.classList.add('open'));document.body.classList.add('pov-lock');
  if(push){try{history.pushState({afagsPortal:1},'','#member-login')}catch(e){}}}
function close(fromPop){if(!ov)return;ov.classList.remove('open');document.body.classList.remove('pov-lock');
  if(!fromPop){try{if(history.state&&history.state.afagsPortal)history.back();else history.replaceState(null,'',location.href.split('#')[0])}catch(e){}}
  if(last&&last.focus)last.focus()}
document.addEventListener('click',e=>{const a=e.target.closest('a[href="afags-portal.html"]');if(!a)return;e.preventDefault();e.stopPropagation();open(a)},true);
addEventListener('message',e=>{if(e.data&&e.data.afags==='close')close(false)});
addEventListener('popstate',()=>{if(ov&&ov.classList.contains('open'))close(true)});
if(location.hash==='#member-login')setTimeout(()=>open(null,false),300);
})();

/* ===== Hero spotlight slide ===== */
(()=>{
const hero=document.querySelector('.hero'),spot=document.getElementById('spot');if(!hero||!spot)return;
const src=document.querySelector('.gjmap .gjLine'),mp=document.getElementById('spMapP');
if(src&&mp){mp.setAttribute('d',src.getAttribute('d'));requestAnimationFrame(()=>{try{const b=mp.getBBox(),pad=4;mp.closest('svg').setAttribute('viewBox',`${b.x-pad} ${b.y-pad} ${b.width+pad*2} ${b.height+pad*2}`)}catch(e){}})}
const sl=[...document.querySelectorAll('#slides .slide')];
const sync=()=>{const on=sl.some(x=>x.dataset.spot&&x.classList.contains('on'));hero.classList.toggle('spot-on',on);spot.setAttribute('aria-hidden',!on);
  if(on){const p=mp;p&&(p.style.animation='none',p.getBoundingClientRect(),p.style.animation='')}};
new MutationObserver(sync).observe(document.getElementById('slides'),{subtree:true,attributes:true,attributeFilter:['class']});sync();
})();
