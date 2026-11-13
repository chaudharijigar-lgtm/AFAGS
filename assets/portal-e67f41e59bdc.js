
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}},del(k){try{localStorage.removeItem(k)}catch(e){}},
  sget(k){try{return JSON.parse(sessionStorage.getItem(k))}catch(e){return null}},sset(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}},sdel(k){try{sessionStorage.removeItem(k)}catch(e){}}};
/* embedded inside the website: website links close the overlay */
const EMB=window.parent!==window;
if(EMB)document.addEventListener('click',e=>{const a=e.target.closest('a[href="afags-website.html"]');if(!a)return;e.preventDefault();parent.postMessage({afags:'close'},'*')},true);
const toast=(t)=>{const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),3000)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ini=n=>String(n).split(/\s+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
const fmt=d=>new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const YEAR=new Date().getFullYear();
const SEASON_Y=(d=>d.getMonth()>=3?d.getFullYear():d.getFullYear()-1)(new Date()),SEASON_L=SEASON_Y+'–'+String(SEASON_Y+1).slice(2),SEASON_K=SEASON_Y+'-'+String(SEASON_Y+1).slice(2);
/* renewed for THIS season? new flags store the season ('2026-27'); old flags (true) count only if the renewal was paid this season */
function renewedNow(v,id){if(v===SEASON_K)return true;if(v!==true)return false;const s0=new Date(SEASON_Y,3,1).getTime();return (store.get('afags_renewals')||[]).some(x=>x.id===id&&x.at>=s0)}

/* ---------------- DEMO ACCOUNTS (replace with a real server) ---------------- */
const ACCOUNTS={
  superadmin:{cred:{s:'71023e54f002bc41f501bcf0',h:'934f1e1f50f5df4c65f3f73e125e3d17db66ebadc364f9fb9ba6435d9fc52b9d'},name:'Super Admin',role:'admin',roleLabel:'Super Admin',org:'Amateur Fencing Association of Gujarat State',email:'admin@afagujarat.org',canApprove:true},
  ahmedabad:{cred:{s:'c0d1df671de3c5969379f47c',h:'3904374ee418a857fe2daabd8fab05cb0d785d4b971c7ca3500eb4ae29996211'},name:'Ahmedabad District',role:'district_unit',roleLabel:'District Unit',org:'Ahmedabad District Fencing Unit',email:'ahmedabad@afagujarat.org',district:'Ahmedabad',canApprove:false},
  amreli:{cred:{s:'faaa4c2cec44390f71c847aa',h:'51bb08f743a28559a690b1056bdffa8ea6c81e6dbe8004a89a1de989426c8c71'},name:'Amreli District',role:'district_unit',roleLabel:'District Unit',org:'Amreli District Fencing Unit',email:'amreli@afagujarat.org',district:'Amreli',canApprove:false},
  anand:{cred:{s:'6ea553a89b334d4be643a4f6',h:'dfcb33edeec202386d12f549ab1290cfa9858ec8d577b124704577a8f6f57eb5'},name:'Anand District',role:'district_unit',roleLabel:'District Unit',org:'Anand District Fencing Unit',email:'anand@afagujarat.org',district:'Anand',canApprove:false},
  aravalli:{cred:{s:'1ab15ffabbfffbb5501f99b9',h:'aab6902124e26d976d3ca13bd914950bbe80eebc8fdcbac1eaf64dd3f52c8a2b'},name:'Aravalli District',role:'district_unit',roleLabel:'District Unit',org:'Aravalli District Fencing Unit',email:'aravalli@afagujarat.org',district:'Aravalli',canApprove:false},
  banaskantha:{cred:{s:'896382b80979a9663143b119',h:'0d1480f3867a9948ca8f5df1f931163502f7177f0a3adc9b33c4ee45fb422bab'},name:'Banaskantha District',role:'district_unit',roleLabel:'District Unit',org:'Banaskantha District Fencing Unit',email:'banaskantha@afagujarat.org',district:'Banaskantha',canApprove:false},
  bharuch:{cred:{s:'70e0eaaf4b0af5b701b782a0',h:'0f3abaaae5fa6a1e1507192c9eaaa4be184ffa22bb41ba93dedc9da7320baffc'},name:'Bharuch District',role:'district_unit',roleLabel:'District Unit',org:'Bharuch District Fencing Unit',email:'bharuch@afagujarat.org',district:'Bharuch',canApprove:false},
  bhavnagar:{cred:{s:'8d1eebd0ea1f6f155a4d1904',h:'1afabcebfe25b6bbcd70cece5f70e46446152184115f9458f6fc170500a72954'},name:'Bhavnagar District',role:'district_unit',roleLabel:'District Unit',org:'Bhavnagar District Fencing Unit',email:'bhavnagar@afagujarat.org',district:'Bhavnagar',canApprove:false},
  botad:{cred:{s:'92fad7fda7abda45e6247cbe',h:'b02bb6ce84720f251729a3cd64600400b8d6675c183b782635ac67e90a28c13c'},name:'Botad District',role:'district_unit',roleLabel:'District Unit',org:'Botad District Fencing Unit',email:'botad@afagujarat.org',district:'Botad',canApprove:false},
  chhotaudaipur:{cred:{s:'c0729f99771dc53bb61dff31',h:'e9658c375dfb8774ccb4a88fb6f2271b30a17897185f597dcce2a336c0553bd3'},name:'Chhota Udaipur District',role:'district_unit',roleLabel:'District Unit',org:'Chhota Udaipur District Fencing Unit',email:'chhotaudaipur@afagujarat.org',district:'Chhota Udaipur',canApprove:false},
  dahod:{cred:{s:'b9b8150176c74e527177b73f',h:'83cd4021b533c9702010a0a8e8bce66223041bcaa73e1d0606f2b935eb42dc59'},name:'Dahod District',role:'district_unit',roleLabel:'District Unit',org:'Dahod District Fencing Unit',email:'dahod@afagujarat.org',district:'Dahod',canApprove:false},
  dang:{cred:{s:'15bab106bbb121b740a07927',h:'ce70361fae97c5f207abe88ef24b315c870929c598be695a8f67101a61c83214'},name:'Dang District',role:'district_unit',roleLabel:'District Unit',org:'Dang District Fencing Unit',email:'dang@afagujarat.org',district:'Dang',canApprove:false},
  devbhumidwarka:{cred:{s:'1e2749e6f86e16413b8b03e1',h:'47e00e54cc8ab82fa6f11573a7b14c475ad9078f09f69979e2736fe738b6e851'},name:'Devbhumi Dwarka District',role:'district_unit',roleLabel:'District Unit',org:'Devbhumi Dwarka District Fencing Unit',email:'devbhumidwarka@afagujarat.org',district:'Devbhumi Dwarka',canApprove:false},
  gandhinagar:{cred:{s:'856134d77dc94f380f524690',h:'8436afedde987735dcaae054ffd73e7157b9e3c302818cbe2227cd33429f29ed'},name:'Gandhinagar District',role:'district_unit',roleLabel:'District Unit',org:'Gandhinagar District Fencing Unit',email:'gandhinagar@afagujarat.org',district:'Gandhinagar',canApprove:false},
  girsomnath:{cred:{s:'61b3f475f8fe78a86e9fc760',h:'10fe608c73209efd4d880039cd3b64c57444823f8ae806bb73a4a4f521cb4eee'},name:'Gir Somnath District',role:'district_unit',roleLabel:'District Unit',org:'Gir Somnath District Fencing Unit',email:'girsomnath@afagujarat.org',district:'Gir Somnath',canApprove:false},
  jamnagar:{cred:{s:'157f80cbb31404a9946302d6',h:'0cfef66474b6b63b4cbfb38b476f370cdf5bd5866ea0958d08f247d41ae7ae15'},name:'Jamnagar District',role:'district_unit',roleLabel:'District Unit',org:'Jamnagar District Fencing Unit',email:'jamnagar@afagujarat.org',district:'Jamnagar',canApprove:false},
  junagadh:{cred:{s:'2ed00325fa6d68ae99a6326b',h:'7f1a2ac3a2e06af2d2cdc99b27a6400ca678cd3d0a97f6fccbb269432143ea94'},name:'Junagadh District',role:'district_unit',roleLabel:'District Unit',org:'Junagadh District Fencing Unit',email:'junagadh@afagujarat.org',district:'Junagadh',canApprove:false},
  kheda:{cred:{s:'ed24df26fd7c3f85ff8e85e5',h:'f786e0f2d9330262385d2fd3901a4d53609047f8d823debeb6fdaeb3dac01a87'},name:'Kheda District',role:'district_unit',roleLabel:'District Unit',org:'Kheda District Fencing Unit',email:'kheda@afagujarat.org',district:'Kheda',canApprove:false},
  kutch:{cred:{s:'d4efbf51c81bf69288f088a8',h:'7f0ff476961586d2e7a48aef6305bfa0308bbaea3e710cb6f36092e327da1e23'},name:'Kutch District',role:'district_unit',roleLabel:'District Unit',org:'Kutch District Fencing Unit',email:'kutch@afagujarat.org',district:'Kutch',canApprove:false},
  mahisagar:{cred:{s:'9f9be28b67653bd72a1720f2',h:'8a45cbaf545ff220f2c6860838aa5627ec59c61a57fa8038940baf2956dae628'},name:'Mahisagar District',role:'district_unit',roleLabel:'District Unit',org:'Mahisagar District Fencing Unit',email:'mahisagar@afagujarat.org',district:'Mahisagar',canApprove:false},
  mehsana:{cred:{s:'5e6ace8f3a0bc649ce7fcc28',h:'720beb45476458badc486ee55e6af169835c12ee3ab900fd84967b56f489fd23'},name:'Mehsana District',role:'district_unit',roleLabel:'District Unit',org:'Mehsana District Fencing Unit',email:'mehsana@afagujarat.org',district:'Mehsana',canApprove:false},
  morbi:{cred:{s:'fbed411967a14bdf0ce39313',h:'adb553619e0503f923c8f95e9c6f01dd37d428d84b900fe4c68d161ce6d3cb4f'},name:'Morbi District',role:'district_unit',roleLabel:'District Unit',org:'Morbi District Fencing Unit',email:'morbi@afagujarat.org',district:'Morbi',canApprove:false},
  narmada:{cred:{s:'caa5250d7719bc3ffdc928de',h:'ccf6538d894fc55b6d6304276d6f6ca2835d62a9d49f7009bec0fc761ea70950'},name:'Narmada District',role:'district_unit',roleLabel:'District Unit',org:'Narmada District Fencing Unit',email:'narmada@afagujarat.org',district:'Narmada',canApprove:false},
  navsari:{cred:{s:'17ac58416d777d0e8fd2dd65',h:'206e6f450d126579797ee3203021fb3d8c7acb0efa950de7e4d291e0dd2268f0'},name:'Navsari District',role:'district_unit',roleLabel:'District Unit',org:'Navsari District Fencing Unit',email:'navsari@afagujarat.org',district:'Navsari',canApprove:false},
  panchmahal:{cred:{s:'980f5977aedaf29f4dc53c2f',h:'022769346d02331170ad04cc6f56e6c5262bbf4b8c2879cf88622dfed9f5b398'},name:'Panchmahal District',role:'district_unit',roleLabel:'District Unit',org:'Panchmahal District Fencing Unit',email:'panchmahal@afagujarat.org',district:'Panchmahal',canApprove:false},
  patan:{cred:{s:'6efcf8988c13af1d4a40132b',h:'ef5c6ed284fb8bc7059d9e8061c0ea353399055b72bdc71bb8491a438de17c23'},name:'Patan District',role:'district_unit',roleLabel:'District Unit',org:'Patan District Fencing Unit',email:'patan@afagujarat.org',district:'Patan',canApprove:false},
  porbandar:{cred:{s:'4503bbf8b040a216523a3d8f',h:'c6e27e8aff42174230c6a466c38ca96d4643bd68ba96881ee55828b6c7d7cf19'},name:'Porbandar District',role:'district_unit',roleLabel:'District Unit',org:'Porbandar District Fencing Unit',email:'porbandar@afagujarat.org',district:'Porbandar',canApprove:false},
  rajkot:{cred:{s:'c98a31654e24845d37977ff2',h:'46d460c0ac3b8c2848100227107de2cbf467f3538fc4563203114c42f19ff4dd'},name:'Rajkot District',role:'district_unit',roleLabel:'District Unit',org:'Rajkot District Fencing Unit',email:'rajkot@afagujarat.org',district:'Rajkot',canApprove:false},
  sabarkantha:{cred:{s:'db9cdd9f42db749a07daf33a',h:'c98083d30fa5261af9c30de3613a44e2f9497412ea851cb0962158c4f041a3f2'},name:'Sabarkantha District',role:'district_unit',roleLabel:'District Unit',org:'Sabarkantha District Fencing Unit',email:'sabarkantha@afagujarat.org',district:'Sabarkantha',canApprove:false},
  surat:{cred:{s:'f1717c1750cb4cd81aab0e90',h:'900f291500c327cca3e87e6c63606d4aa1d8cbf0d26faa1ad73acabf107cefbf'},name:'Surat District',role:'district_unit',roleLabel:'District Unit',org:'Surat District Fencing Unit',email:'surat@afagujarat.org',district:'Surat',canApprove:false},
  surendranagar:{cred:{s:'939b191548a7949dfbff3bb6',h:'73fcb6cf6e336e9fa5ff824cc7700cf329dd079a51c6b21cf8a15822fccc522b'},name:'Surendranagar District',role:'district_unit',roleLabel:'District Unit',org:'Surendranagar District Fencing Unit',email:'surendranagar@afagujarat.org',district:'Surendranagar',canApprove:false},
  tapi:{cred:{s:'30e17a77b2dc78a807b00f64',h:'6360276eb9e75eb6d6dc421a076f2e960fdf9281d5652279450d9d83b346b83a'},name:'Tapi District',role:'district_unit',roleLabel:'District Unit',org:'Tapi District Fencing Unit',email:'tapi@afagujarat.org',district:'Tapi',canApprove:false},
  vadodara:{cred:{s:'d1f64b7a0d085dda3989cb7c',h:'1768137401a1940572f43a30919ddb66917e8dbc46669a7a6564a78649002048'},name:'Vadodara District',role:'district_unit',roleLabel:'District Unit',org:'Vadodara District Fencing Unit',email:'vadodara@afagujarat.org',district:'Vadodara',canApprove:false},
  valsad:{cred:{s:'e02b28448a5487865e33c2a1',h:'ed2aa0ddf3f2eee320bfbeec6ad40d85d87767a5c553c70cbcb00b86ccec0f90'},name:'Valsad District',role:'district_unit',roleLabel:'District Unit',org:'Valsad District Fencing Unit',email:'valsad@afagujarat.org',district:'Valsad',canApprove:false}
};
try{const MA=JSON.parse(localStorage.getItem('afags_maccts')||'{}');Object.keys(MA).forEach(k=>{if(!ACCOUNTS[k]||ACCOUNTS[k].role==='member')ACCOUNTS[k]=MA[k]})}catch(e){}
const ROLE_MENU={member:['dashboard','settings'],admin:['dashboard','accreditation','fencers','coaches','referees','clubs','districts','certificates','ranking','events','reports','cms','inbox','audit','settings'],
  district_unit:['dashboard','fencers','coaches','clubs','ranking','events','reports','settings']};

/* ================= LOGIN ================= */
let code='',fails=0,lockUntil=0;
function drawCap(){const c=$('#capC'),x=c.getContext('2d');code=String(Math.floor(1000000+Math.random()*9000000)).slice(0,7);
  x.clearRect(0,0,300,100);const g=x.createLinearGradient(0,0,300,100);g.addColorStop(0,'#e3e9f3');g.addColorStop(1,'#eef2f8');x.fillStyle=g;x.fillRect(0,0,300,100);
  for(let i=0;i<6;i++){x.strokeStyle=`rgba(${60+Math.random()*80|0},${80+Math.random()*80|0},${140+Math.random()*80|0},.35)`;x.lineWidth=1+Math.random()*2;x.beginPath();x.moveTo(Math.random()*300,Math.random()*100);x.bezierCurveTo(Math.random()*300,Math.random()*100,Math.random()*300,Math.random()*100,Math.random()*300,Math.random()*100);x.stroke()}
  for(let i=0;i<60;i++){x.fillStyle=`rgba(40,60,120,${Math.random()*.3})`;x.fillRect(Math.random()*300,Math.random()*100,2,2)}
  const shown=code.slice(0,3)+' '+code.slice(3,5)+' '+code.slice(5);let px=26;
  x.font='600 40px ui-monospace,Menlo,monospace';x.textBaseline='middle';
  for(const ch of shown){if(ch===' '){px+=16;continue}x.save();x.translate(px,52+(Math.random()*14-7));x.rotate((Math.random()-.5)*.45);x.fillStyle=['#1c2337','#0b2257','#2c3550','#15327a'][Math.random()*4|0];x.fillText(ch,0,0);x.restore();px+=33}
  $('#cin').value=''}
drawCap();
$('#capR').onclick=()=>{const r=$('#capR');r.classList.remove('spin');void r.offsetWidth;r.classList.add('spin');drawCap()};
$('#eye').onclick=()=>{const p=$('#pw'),sh=p.type==='password';p.type=sh?'text':'password';$('#eye').setAttribute('aria-label',sh?'Hide password':'Show password');$('#eye').style.color=sh?'#f47b20':''};
const remembered=store.get('afags_rem');if(remembered){$('#u').value=remembered;$('#rem').checked=true}
function fieldErr(id,msg){const f=$(id);f.classList.toggle('err',!!msg);f.querySelector('.msg').textContent=msg||''}
function alertBox(el,type,msg){$(el).innerHTML=msg?`<div class="alert ${type}" role="alert">${msg}</div>`:''}
$('#fLogin').addEventListener('submit',e=>{e.preventDefault();alertBox('#lAlert');
  const u=$('#u').value.trim().toLowerCase(),p=$('#pw').value,c=$('#cin').value.replace(/\s/g,'');
  fieldErr('#fU',u?'':'Please enter your username or email');fieldErr('#fP',p?'':'Please enter your password');fieldErr('#fC',c?'':'Please enter the security code');
  if(!u||!p||!c)return;
  const now=Date.now(),LS=lockState();if(now<LS.until){alertBox('#lAlert','e',`Too many failed attempts. Login is locked — try again in ${Math.ceil((LS.until-now)/1000)} seconds.`);return}
  if(c!==code){fieldErr('#fC','Security code does not match. A new code has been generated.');drawCap();return}
  if(API.online){serverLogin(u,p);return}
  const btn=$('#lBtn');btn.disabled=true;btn.innerHTML='<span class="spn"></span> Signing in…';
  setTimeout(()=>{btn.disabled=false;btn.textContent='Login';
    const key=demoKeyOf(u),acc=key&&ACCOUNTS[key];
    if(!acc||!checkPw(key,p)){const L=failLogin(u);drawCap();$('#pw').value='';
      if(L.until>Date.now())alertBox('#lAlert','e',`Too many failed attempts. Login is locked for ${Math.round((L.until-Date.now())/1000)} seconds.`);
      else alertBox('#lAlert','e',`Invalid username or password. ${5-L.f} attempt${5-L.f>1?'s':''} left.`);return}
    if(userOff(key)){drawCap();alertBox('#lAlert','e','This account is disabled. Please contact the AFAGS Super Admin.');return}if(tempExpired(key)){drawCap();alertBox('#lAlert','e','Your temporary password has expired. Ask the AFAGS office for a new one.');return}store.del('afags_lock');$('#rem').checked?store.set('afags_rem',u):store.del('afags_rem');
    newSession(key);$('#pw').value='';startApp(key);mustChangeCheck(key)},900)});
$$('.dqb').forEach(b=>b.onclick=()=>{if(!secCfg().demo){toast('Demo login is disabled');return}const k=b.dataset.acc,a=ACCOUNTS[k];if(loginAliases()[k]){toast('Login ID was changed — please sign in normally');$('#u').focus();return}if(store.get('afags_pw')&&store.get('afags_pw')[k]){toast('Password was changed — please sign in normally');$('#u').value=k;$('#pw').focus();return}$('#u').value=k;$('#pw').value='';$('#cin').value=code;['#fU','#fP','#fC'].forEach(i=>fieldErr(i,''));alertBox('#lAlert');
  const lb=$('#lBtn');lb.disabled=true;lb.innerHTML='<span class="spn"></span> Signing in…';
  setTimeout(()=>{lb.disabled=false;lb.textContent='Login';newSession(k);$('#pw').value='';startApp(k);toast('Welcome, '+a.name)},650)});
function showPane(id){['#fLogin','#fForgot','#fTrack','#fRenew','#fReset'].forEach(p=>{const e=$(p);e&&e.classList.toggle('hidden',p!==id)})}
$('#toForgot').onclick=()=>{showPane('#fForgot');alertBox('#fAlert');$('#fe').value=$('#u').value;$('#fe').focus()};
$$('.toLogin').forEach(b=>b.onclick=()=>{showPane('#fLogin');drawCap();$('#u').focus()});
$('#toTrack').onclick=()=>{showPane('#fTrack');$('#tAlert').innerHTML='';$('#tq').focus()};
$('#fForgot').addEventListener('submit',e=>{e.preventDefault();const v=$('#fe').value.trim();
  fieldErr('#fE',v?'':'Please enter your username or email');if(!v)return;
  const b=$('#fBtn');b.disabled=true;b.innerHTML='<span class="spn"></span> Sending…';
  const done=(t,m)=>{b.disabled=false;b.textContent='Send Reset Link';alertBox('#fAlert',t,m)};
  if(API.online){API.call('POST','/auth/forgot',{user:v}).then(()=>done('s','If an account exists for <b>'+esc(v)+'</b>, a reset link has been emailed to its registered address. The link works for 30 minutes.')).catch(e=>done('e',esc(e.message)));return}
  setTimeout(()=>done('e','Email reset needs the AFAGS server, which is not connected in this copy. Ask the AFAGS Super Admin to reset your password from <b>Users &amp; Logins</b> — you will get a one-time temporary password.'),600)});

/* ================= REFERENCE DATA ================= */
const DISTRICTS=['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'];
const BANKS=['State Bank of India','Bank of Baroda','Punjab National Bank','Bank of India','Union Bank of India','Canara Bank','Central Bank of India','Indian Bank','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','IDBI Bank','IndusInd Bank','Yes Bank','Other'];
const BLOOD=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const ID_DOCS=['Aadhaar Card','Passport','Driving Licence'];
const RES_DOCS=['Aadhaar Card','Passport','Driving Licence','Letter/Certificate of Educational Institution','Letter/Certificate of Employer',"Letter about parent's/guardian's occupation",'Any other approved ID proof'];
const PAT={name:[/^[A-Za-z][A-Za-z .'-]{0,59}$/,'Use letters only'],aadhaar:[/^[2-9]\d{11}$/,'Enter a valid 12-digit Aadhaar number'],pan:[/^[A-Z]{5}\d{4}[A-Z]$/,'Enter a valid PAN (e.g. ABCDE1234F)'],
  mobile:[/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile number'],email:[/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,'Enter a valid email address'],pin:[/^3[6-9]\d{4}$/,'Enter a valid Gujarat PIN code (36xxxx–39xxxx)'],
  ifsc:[/^[A-Z]{4}0[A-Z0-9]{6}$/,'Enter a valid IFSC (e.g. SBIN0001234)'],acc:[/^\d{9,18}$/,'Account number must be 9–18 digits'],year:[/^(19[5-9]\d|20\d\d)$/,'Enter a valid year'],passport:[/^[A-Z][0-9]{7}$/,'Enter a valid passport number (e.g. A1234567)']};
function ageCat(dob){if(!dob)return '';const y=YEAR-new Date(dob).getFullYear();if(isNaN(y))return '';
  return y<10?'U-10 (Sub-Junior)':y<12?'U-12 (Sub-Junior)':y<14?'U-14 (Sub-Junior)':y<17?'U-17 (Cadet)':y<20?'U-20 (Junior)':'Senior'}
const catShort=c=>c?c.split(' ')[0]:'—';

/* ---- field builders ---- */
const F=(n,l,t='text',o={})=>({n,l,t,...o});
const H=(l,o={})=>({t:'h',l,...o});
const nameF=()=>[F('first','First name','text',{req:1,pat:'name',w:3}),F('middle','Middle name','text',{pat:'name',w:3}),F('last','Last name','text',{req:1,pat:'name',w:3}),F('certName','Name on the certificate','text',{w:2,ph:'As it should appear on certificates'})];
const contactF=()=>[F('email','Email','email',{req:1,pat:'email',w:2}),F('email2','Re-enter email','email',{req:1,match:'email',w:2,nopaste:1}),F('mobile','Mobile number','tel',{req:1,pat:'mobile',w:3,pre:'+91'}),F('mobile2','Re-enter mobile','tel',{req:1,match:'mobile',w:3,pre:'+91',nopaste:1}),F('altMobile','Secondary mobile','tel',{pat:'mobile',w:3,pre:'+91'})];
const idF=()=>[F('aadhaar','Aadhaar card number','text',{req:1,pat:'aadhaar',w:2,im:'numeric',max:12,ph:'12-digit number',mask:1}),F('pan','PAN number','text',{pat:'pan',w:2,up:1,max:10})];
const addrF=(withDocs=true)=>[H('Permanent address'),F('pin','PIN code','text',{req:1,pat:'pin',w:3,im:'numeric',max:6}),F('addr','Address','text',{req:1,w:2,span:2}),F('landmark','Apartment / landmark','text',{w:3}),F('city','City / Taluka','text',{req:1,w:3}),F('district','District','select',{req:1,opts:DISTRICTS,w:3}),F('state','State','text',{w:3,val:'Gujarat',ro:1}),
  ...(withDocs?[F('domDoc','Document confirming domicile','select',{req:1,opts:ID_DOCS,w:3})]:[]),
  F('same','Current address is the same as permanent address','check',{val:true,re:1}),
  H('Current address',{when:V=>!V.same}),
  F('cpin','PIN code','text',{req:1,pat:'pin',w:3,im:'numeric',max:6,when:V=>!V.same}),F('caddr','Address','text',{req:1,w:2,span:2,when:V=>!V.same}),F('ccity','City / Taluka','text',{req:1,w:3,when:V=>!V.same}),F('cdistrict','District','select',{req:1,opts:DISTRICTS,w:3,when:V=>!V.same}),
  ...(withDocs?[F('resDoc','Document confirming current residence','select',{req:1,opts:RES_DOCS,w:2,when:V=>!V.same})]:[])];
const bankF=()=>[H('Bank details (optional — for prize money / reimbursements)'),F('bank','Bank name','select',{opts:BANKS,w:3}),F('branch','Branch','text',{w:3}),F('ifsc','IFSC code','text',{pat:'ifsc',w:3,up:1,max:11}),F('acc','Account number','text',{pat:'acc',w:2,im:'numeric',max:18,mask:1}),F('acc2','Re-enter account number','text',{match:'acc',w:2,im:'numeric',max:18,nopaste:1})];
const passF=()=>[H('Indian passport (optional)'),F('passNo','Passport number','text',{pat:'passport',w:3,up:1,max:8}),F('passAt','Issued at','text',{w:3}),F('passIss','Issue date','date',{w:3,past:1}),F('passExp','Expiry date','date',{w:3,future:1})];
const eduF=()=>[H('Education & employment'),F('qual','Highest qualification / currently studying','text',{req:1,w:2}),F('inst','School / college / university','text',{req:1,w:2}),F('employer','Current employer (if employed)','text',{w:2})];
const docsBase=()=>[F('photo','Passport-size photograph','file',{req:1,img:1,w:2,note:'JPG/PNG, plain background, face clearly visible'}),F('aadF','Aadhaar card — front','file',{req:1,w:2}),F('aadB','Aadhaar card — back','file',{req:1,w:2}),F('resProof','Residence proof','file',{req:1,w:2})];
const declare=t=>F('agree',t,'check',{req:1});
const DECL='I declare that the information given is true and complete. I agree to abide by the rules of AFAGS, FAI and FIE, and to the AFAGS Terms & Conditions.';

const FORMS={
 'Fencer':{key:'fencers',code:'FEN',icon:'#007AFF',fee:200,steps:[
   {t:'Personal',f:[...nameF(),F('gender','Gender','radio',{req:1,opts:['Male','Female'],w:3}),F('dob','Date of birth','date',{req:1,past:1,minAge:5,w:3}),F('cat','Age category (auto)','info',{w:3,calc:V=>ageCat(V.dob)||'Enter date of birth'}),
     F('weapon','Weapon','select',{req:1,opts:['Foil','Épée','Sabre'],w:3}),F('hand','Hand','select',{req:1,opts:['Right handed','Left handed'],w:3}),F('blood','Blood group','select',{req:1,opts:BLOOD,w:3}),
     F('height','Height (cm)','number',{req:1,min:80,max:230,w:3}),F('weight','Weight (kg)','number',{req:1,min:15,max:200,w:3}),...idF(),...contactF()]},
   {t:'Family & Address',f:[H("Parent / guardian"),F('father',"Father's name",'text',{pat:'name',w:3}),F('mother',"Mother's name",'text',{pat:'name',w:3}),F('guardian','Spouse / legal guardian (if any)','text',{pat:'name',w:3}),F('gMobile',"Parent's / guardian's mobile",'tel',{req:1,pat:'mobile',w:3,pre:'+91'}),
     H('Home association'),F('homeUnit','Home District Unit','select',{req:1,opts:DISTRICTS.map(d=>d+' District Fencing Unit'),w:2}),F('club','Club / academy','text',{w:2,ph:'If attached to a club'}),...addrF()]},
   {t:'Training & Education',f:[H('Training details'),F('training','Training status','select',{req:1,opts:['Active fencer','Not training currently','Retired from active fencing'],w:3}),F('since','Started training in (year)','text',{req:1,pat:'year',w:3,im:'numeric',max:4}),F('firstCentre','First training centre','text',{req:1,w:3}),F('curCentre','Current training centre','text',{req:1,w:2}),F('coach','Name of current coach','text',{req:1,pat:'name',w:2}),
     ...eduF(),F('acc_list','Sporting accomplishments','repeat',{max:5,sub:[F('title','Position & competition','text',{w:2}),F('year','Year','text',{pat:'year',im:'numeric',max:4})]})]},
   {t:'Passport & Bank',opt:1,f:[...passF(),...bankF()]},
   {t:'Documents',f:[...docsBase(),F('birthCert','Birth certificate','file',{req:1,w:2}),F('schoolCert','School / university certificate','file',{w:2}),declare(DECL)]}]},
 'Coach':{key:'coaches',code:'COA',icon:'#F47B20',steps:[
   {t:'Personal',f:[...nameF(),F('gender','Gender','radio',{req:1,opts:['Male','Female'],w:3}),F('dob','Date of birth','date',{req:1,past:1,minAge:18,w:3}),F('blood','Blood group','select',{opts:BLOOD,w:3}),F('weapon','Specialised weapon','select',{req:1,opts:['Foil','Épée','Sabre'],w:3}),...idF(),...contactF()]},
   {t:'Coaching',f:[F('grade','Coach grade','choice',{req:1,opts:[['A','FIE/ICC international course + NIS Diploma + 14 years’ experience'],['B','NIS Diploma + 7 years’ experience'],['C','NIS Diploma or certificate course'],['D','Certified coach — state / national course'],['E','Non-NIS coach / former fencer']]}),
     F('curCentre','Current coaching centre','text',{req:1,w:2,ph:'or “Not coaching currently”'}),F('since','Coaching there since (year)','text',{req:1,pat:'year',w:3,im:'numeric',max:4}),F('homeUnit','District Unit','select',{req:1,opts:DISTRICTS.map(d=>d+' District Fencing Unit'),w:2}),
     F('quals','Coaching qualifications','repeat',{req:1,max:5,sub:[F('title','Qualification title','text',{w:2}),F('year','Year of passing','text',{pat:'year',im:'numeric',max:4})]}),
     F('past','Past coaching experience','repeat',{max:5,sub:[F('centre','Centre name','text',{w:2}),F('year','Year(s)','text')]}),
     F('acc_list','Coaching accomplishments','repeat',{max:5,sub:[F('title','Accomplishment','text',{w:2}),F('year','Year','text',{pat:'year',im:'numeric',max:4})]}),...eduF()]},
   {t:'Address',f:addrF()},
   {t:'Bank',opt:1,f:bankF()},
   {t:'Documents',f:[...docsBase(),F('qualCert','Coaching qualification certificate(s)','file',{req:1,w:2}),declare(DECL)]}]},
 'Referee & Technical Official':{key:'referees',code:'REF',icon:'#28B44A',steps:[
   {t:'Personal',f:[F('role','Registering as','radio',{req:1,opts:['Referee','Technical Official'],w:2}),...nameF(),F('gender','Gender','radio',{req:1,opts:['Male','Female'],w:3}),F('dob','Date of birth','date',{req:1,past:1,minAge:16,w:3}),F('weapon','Specialised weapon','select',{req:1,opts:['Foil','Épée','Sabre','All weapons'],w:3}),...idF(),...contactF()]},
   {t:'Grade & Qualifications',f:[F('grade','Referee & TO grade','choice',{req:1,opts:[['A+','FIE / FCA referee licence for the current year'],['A','Former FIE/FCA licensed, or national/NIS qualified with 14+ years'],['B','National/NIS qualified referee with 7+ years'],['C','National/NIS qualified referee or TO with under 7 years'],['D','Technical Official — former fencer with officiating experience']]}),
     F('homeUnit','District Unit','select',{req:1,opts:DISTRICTS.map(d=>d+' District Fencing Unit'),w:2}),F('events','Events officiated (approx.)','number',{min:0,max:999,w:3}),
     F('quals','Qualifications','repeat',{req:1,max:4,sub:[F('title','Qualification title','text',{w:2}),F('year','Year of passing','text',{pat:'year',im:'numeric',max:4})]}),...eduF()]},
   {t:'Address',f:addrF()},
   {t:'Documents',f:[...docsBase(),F('qualCert','Referee / TO qualification certificate','file',{req:1,w:2}),declare(DECL)]}]},
 'Club':{key:'clubs',code:'CLB',icon:'#AF52DE',org:1,steps:[
   {t:'Club Details',f:[F('clubName','Club / academy name','text',{req:1,w:2}),F('short','Short name','text',{w:3,up:1,max:10}),F('type','Type','select',{req:1,opts:['Club','Academy','School','College / University','Institution'],w:3}),F('est','Established (year)','text',{req:1,pat:'year',w:3,im:'numeric',max:4}),F('regNo','Registration number (if registered)','text',{w:3}),F('regDate','Registration date','date',{past:1,w:3}),
     F('homeUnit','District Unit','select',{req:1,opts:DISTRICTS.map(d=>d+' District Fencing Unit'),w:2})]},
   {t:'People',f:[H('Head / owner'),F('headName','Name','text',{req:1,pat:'name',w:3}),F('headMobile','Mobile','tel',{req:1,pat:'mobile',w:3,pre:'+91'}),F('email','Email','email',{req:1,pat:'email',w:3}),F('email2','Re-enter email','email',{req:1,match:'email',w:3,nopaste:1}),
     H('Head coach'),F('coachName','Head coach name','text',{req:1,pat:'name',w:3}),F('coachId','Coach AFAGS ID (if any)','text',{w:3,up:1,ph:'AFAGS/COA/…'}),F('coachMobile','Head coach mobile','tel',{pat:'mobile',w:3,pre:'+91'})]},
   {t:'Facilities',f:[F('weapons','Weapons offered','multi',{req:1,opts:['Foil','Épée','Sabre']}),F('pistes','Number of pistes','number',{req:1,min:1,max:60,w:3}),F('scoring','Electric scoring apparatus','select',{req:1,opts:['Yes','No'],w:3}),F('members','Number of fencers','number',{req:1,min:1,max:5000,w:3}),F('timings','Training days & timings','text',{w:2,ph:'e.g. Mon–Sat, 6–8 AM & 5–7 PM'})]},
   {t:'Address',f:addrF(false)},
   {t:'Bank',opt:1,f:bankF()},
   {t:'Documents',f:[F('logo','Club logo','file',{req:1,img:1,w:2}),F('regCert','Registration certificate / trust deed','file',{w:2}),F('venue','Photo of training venue','file',{req:1,img:1,w:2}),F('idProof','ID proof of head / owner','file',{req:1,w:2}),declare('I declare that the information is true and that the club will follow AFAGS, FAI and FIE rules and safety standards.')]}]},
 'District Unit':{key:'districts',code:'DIS',icon:'#1E9FB8',org:1,steps:[
   {t:'Basic Information',f:[F('district','District','select',{req:1,opts:DISTRICTS,w:3}),F('assoc','Association name','text',{req:1,w:2,calcDefault:V=>V.district?V.district+' District Fencing Association':''}),F('short','Short code','text',{w:3,up:1,max:8}),F('regNo','Registration number','text',{req:1,w:3}),F('regDate','Registration date','date',{req:1,past:1,w:3}),
     F('tenFrom','Tenure from','date',{req:1,w:3}),F('tenTo','Tenure to','date',{req:1,w:3,after:'tenFrom'}),F('election','Last election held on','date',{req:1,past:1,w:3})]},
   {t:'Office Bearers',f:[H('President'),F('presName','Name','text',{req:1,pat:'name',w:3}),F('presMobile','Mobile','tel',{req:1,pat:'mobile',w:3,pre:'+91'}),F('presEmail','Email','email',{req:1,pat:'email',w:3}),
     H('Secretary'),F('secName','Name','text',{req:1,pat:'name',w:3}),F('secMobile','Mobile','tel',{req:1,pat:'mobile',w:3,pre:'+91'}),F('secEmail','Email','email',{req:1,pat:'email',w:3}),
     H('Admin / official contact'),F('adminName','Admin name','text',{req:1,pat:'name',w:3}),F('email','Official email','email',{req:1,pat:'email',w:3}),F('email2','Re-enter email','email',{req:1,match:'email',w:3,nopaste:1}),F('mobile','Official mobile','tel',{req:1,pat:'mobile',w:3,pre:'+91'}),F('mobile2','Re-enter mobile','tel',{req:1,match:'mobile',w:3,pre:'+91',nopaste:1})]},
   {t:'Address',f:[H('Office address'),F('pin','PIN code','text',{req:1,pat:'pin',w:3,im:'numeric',max:6}),F('addr','Address','text',{req:1,w:2,span:2}),F('city','City / Taluka','text',{req:1,w:3}),F('phone','Office phone','tel',{w:3})]},
   {t:'Bank & Tournaments',f:[...bankF(),F('tourn','Tournaments held (last 3 years)','repeat',{max:5,sub:[F('name','Tournament name','text',{w:2}),F('loc','Location','text'),F('start','Start date','date'),F('end','End date','date')]})]},
   {t:'Documents',f:[F('logo','Association logo','file',{req:1,img:1,w:2}),F('regCert','Registration certificate','file',{req:1,w:2}),F('electionDoc','Election minutes / office-bearer list','file',{w:2}),declare('I declare on behalf of the association that the information is true and that we will abide by the AFAGS constitution and rules.')]}]}
};
const TYPE_OF={fencers:'Fencer',coaches:'Coach',referees:'Referee & Technical Official',clubs:'Club',districts:'District Unit'};

/* ================= REGISTRATION WIZARD ================= */
$$('#regBtns button').forEach(b=>b.onclick=()=>openWizard(b.dataset.reg));
let WZ=null;
function openWizard(type){const spec=FORMS[type];if(!spec)return;
  const draft=store.get('afags_draft_'+spec.key);
  WZ={type,spec,step:0,V:Object.assign({same:true,state:'Gujarat'},draft||{}),FILES:{},done:new Set()};
  const m=document.createElement('div');m.className='wz';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label',type+' registration');
  m.innerHTML=`<div class="wz-c"><header class="wz-h"><span class="logo" style="width:44px;height:44px"></span><div><h3>${esc(type)} Registration</h3><p>Amateur Fencing Association of Gujarat State</p></div><button type="button" class="md-x" data-x aria-label="Close">✕</button></header>
   <nav class="wz-steps" id="wzSteps"></nav><div class="wz-prog"><i id="wzProg"></i></div>
   <form class="wz-b" id="wzB" novalidate autocomplete="on"></form>
   <footer class="wz-f"><button type="button" class="btn ghost" id="wzBack">‹ Back</button><span class="wz-note" id="wzNote"></span><button type="button" class="btn pri" id="wzNext">Next ›</button></footer></div>`;
  document.body.appendChild(m);WZ.el=m;document.body.classList.add('lock');
  m.querySelector('[data-x]').onclick=closeWizard;m.addEventListener('keydown',e=>{if(e.key==='Escape')closeWizard()});
  $('#wzBack').onclick=()=>go(WZ.step-1);$('#wzNext').onclick=next;
  const B=$('#wzB');B.addEventListener('input',onInput);B.addEventListener('change',onInput);B.addEventListener('submit',e=>{e.preventDefault();next()});
  B.addEventListener('paste',e=>{if(e.target.dataset.nopaste){e.preventDefault();toast('Please type this again instead of pasting')}});
  B.addEventListener('click',onClick);
  render();if(draft)toast('Your saved draft was restored');}
function closeWizard(){if(!WZ)return;WZ.el.remove();WZ=null;document.body.classList.remove('lock')}
const stepsAll=()=>WZ.spec.steps.length+1;
function stepFields(i){return (WZ.spec.steps[i]||{f:[]}).f.filter(f=>!f.when||f.when(WZ.V))}
function renderSteps(){const names=[...WZ.spec.steps.map(s=>s.t),'Review'];
  $('#wzSteps').innerHTML=names.map((n,i)=>`<button type="button" class="${i===WZ.step?'on':''} ${WZ.done.has(i)?'ok':''}" data-go="${i}" ${i>WZ.step&&!WZ.done.has(i-1)?'disabled':''}><span>${WZ.done.has(i)&&i!==WZ.step?'✓':i+1}</span><em>${esc(n)}</em></button>`).join('');
  $('#wzProg').style.width=((WZ.step+1)/stepsAll()*100)+'%';
  $('#wzBack').style.visibility=WZ.step?'visible':'hidden';
  const last=WZ.step===stepsAll()-1,fee=WZ.spec.fee;$('#wzNext').innerHTML=last?(fee&&!WZ.paid?`Pay ₹${fee} &amp; Submit`:'Submit Application ✓'):'Next ›';
  $('#wzNote').textContent=last?'':(WZ.spec.steps[WZ.step].opt?'This step is optional':`Step ${WZ.step+1} of ${stepsAll()}`)}
function render(){renderSteps();const B=$('#wzB');
  if(WZ.step===stepsAll()-1){B.innerHTML=reviewHTML();B.scrollTop=0;return}
  B.innerHTML=`<div class="wz-grid">${stepFields(WZ.step).map(fieldHTML).join('')}</div>`;B.scrollTop=0;
  B.querySelectorAll('[data-file]').forEach(drawFile);
  const first=B.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=file]),select');first&&setTimeout(()=>first.focus({preventScroll:true}),60)}
function val(n){return WZ.V[n]??''}
function fieldHTML(f){const id='wf_'+f.n,cls=`wf w${f.w||1}${f.span?' span'+f.span:''}`,req=f.req?'<b class="rq">*</b>':'';
  const err=`<div class="fe" id="e_${f.n}"></div>`;
  if(f.t==='h')return `<h4 class="wh">${esc(f.l)}</h4>`;
  if(f.t==='info'){return `<div class="${cls}"><label>${esc(f.l)}</label><div class="winfo" id="${id}">${esc(f.calc(WZ.V))}</div></div>`}
  if(f.t==='check')return `<div class="wf w1 wchk"><label><input type="checkbox" name="${f.n}" ${val(f.n)?'checked':''}><span>${esc(f.l)}${req}</span></label>${err}</div>`;
  if(f.t==='radio')return `<div class="${cls}"><label>${esc(f.l)}${req}</label><div class="seg" role="radiogroup">${f.opts.map(o=>`<label><input type="radio" name="${f.n}" value="${esc(o)}" ${val(f.n)===o?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div>${err}</div>`;
  if(f.t==='multi'){const v=val(f.n)||[];return `<div class="${cls} w1"><label>${esc(f.l)}${req}</label><div class="seg">${f.opts.map(o=>`<label><input type="checkbox" data-multi="${f.n}" value="${esc(o)}" ${v.includes(o)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div>${err}</div>`}
  if(f.t==='choice')return `<div class="wf w1"><label>${esc(f.l)}${req}</label><div class="choice">${f.opts.map(([k,d])=>`<label><input type="radio" name="${f.n}" value="${k}" ${val(f.n)===k?'checked':''}><b>${k}</b><span>${esc(d)}</span></label>`).join('')}</div>${err}</div>`;
  if(f.t==='select')return `<div class="${cls}"><label for="${id}">${esc(f.l)}${req}</label><select id="${id}" name="${f.n}"><option value="">Select…</option>${f.opts.map(o=>`<option ${val(f.n)===o?'selected':''}>${esc(o)}</option>`).join('')}</select>${err}</div>`;
  if(f.t==='file'){const fl=WZ.FILES[f.n];return `<div class="${cls}"><label>${esc(f.l)}${req}</label><label class="drop${fl?' has':''}" data-file="${f.n}"><input type="file" name="${f.n}" accept="${f.img?'image/png,image/jpeg':'image/png,image/jpeg,application/pdf'}"><span class="dz"></span></label>${f.note?`<small class="wn">${esc(f.note)}</small>`:''}${err}</div>`}
  if(f.t==='repeat'){const rows=val(f.n)||[];if(!rows.length&&f.req)rows.push({});WZ.V[f.n]=rows;
    return `<div class="wf w1 wrep"><label>${esc(f.l)}${req} <small>(up to ${f.max})</small></label><div class="reps">${rows.map((r,i)=>`<div class="rep">${f.sub.map(s=>`<input data-rep="${f.n}" data-i="${i}" data-s="${s.n}" type="${s.t==='date'?'date':'text'}" placeholder="${esc(s.l)}" aria-label="${esc(s.l)}" value="${esc(r[s.n]||'')}" ${s.im?`inputmode="${s.im}"`:''} ${s.max?`maxlength="${s.max}"`:''} class="r${s.w||1}">`).join('')}<button type="button" class="rm" data-rm="${f.n}" data-i="${i}" aria-label="Remove">✕</button></div>`).join('')}</div>${rows.length<f.max?`<button type="button" class="add" data-add="${f.n}">+ Add</button>`:''}${err}</div>`}
  let v=val(f.n);if(!v&&f.calcDefault)v=f.calcDefault(WZ.V);if(!v&&f.val)v=f.val;
  const t=f.t==='number'?'number':f.t==='date'?'date':f.t==='email'?'email':f.t==='tel'?'tel':'text';
  const inp=`<input id="${id}" name="${f.n}" type="${t}" value="${esc(v)}" ${f.ph?`placeholder="${esc(f.ph)}"`:''} ${f.im?`inputmode="${f.im}"`:''} ${f.max&&t!=='number'?`maxlength="${f.max}"`:''} ${t==='number'&&f.min!=null?`min="${f.min}" max="${f.max}"`:''} ${f.ro?'readonly':''} ${f.nopaste?'data-nopaste="1" autocomplete="off"':''} ${f.up?'style="text-transform:uppercase"':''} ${t==='date'&&f.past?`max="${new Date().toISOString().slice(0,10)}"`:''}>`;
  return `<div class="${cls}"><label for="${id}">${esc(f.l)}${req}</label>${f.pre?`<div class="pre"><span>${f.pre}</span>${inp}</div>`:inp}${err}</div>`}
function onInput(e){const t=e.target;if(!WZ)return;
  if(t.dataset.rep){const arr=WZ.V[t.dataset.rep];arr[+t.dataset.i][t.dataset.s]=t.value;saveDraft();return}
  if(t.dataset.multi){const n=t.dataset.multi,cur=new Set(WZ.V[n]||[]);t.checked?cur.add(t.value):cur.delete(t.value);WZ.V[n]=[...cur];clearErr(n);saveDraft();return}
  if(t.type==='file'){if(e.type==='change')takeFile(t);return}
  const f=findField(t.name);if(!f)return;
  let v=t.type==='checkbox'?t.checked:t.value;if(f&&f.up&&typeof v==='string'){v=v.toUpperCase()}if(f.im==='numeric'&&typeof v==='string'){const c=v.replace(/\D/g,'');if(c!==v){t.value=c;v=c}}
  WZ.V[t.name]=v;clearErr(t.name);
  stepFields(WZ.step).filter(x=>x.t==='info').forEach(x=>{const el=$('#wf_'+x.n);el&&(el.textContent=x.calc(WZ.V))});
  if(f.re&&e.type==='change'){keepFocusRender(t.name)}
  if(f.n==='district'){const a=findField('assoc');if(a&&!WZ.V.assoc){const el=$('#wf_assoc');el&&(el.value=a.calcDefault(WZ.V))}}
  saveDraft()}
function keepFocusRender(name){const B=$('#wzB'),st=B.scrollTop;render();B.scrollTop=st;const el=B.querySelector(`[name="${name}"]`);el&&el.focus({preventScroll:true})}
function onClick(e){const t=e.target.closest('[data-add],[data-rm]');if(!t)return;const n=t.dataset.add||t.dataset.rm,arr=WZ.V[n]||(WZ.V[n]=[]);
  if(t.dataset.add)arr.push({});else arr.splice(+t.dataset.i,1);const B=$('#wzB'),st=B.scrollTop;render();B.scrollTop=st;saveDraft()}
function findField(n){for(const s of WZ.spec.steps)for(const f of s.f)if(f.n===n)return f;return null}
function clearErr(n){const e=$('#e_'+n);if(e){e.textContent='';e.closest('.wf')?.classList.remove('bad')}}
function setErr(n,m){const e=$('#e_'+n);if(e){e.textContent=m;e.closest('.wf')?.classList.add('bad')}}
let draftT;function saveDraft(){clearTimeout(draftT);draftT=setTimeout(()=>{if(!WZ)return;const d={...WZ.V};store.set('afags_draft_'+WZ.spec.key,d)},400)}
/* files */
function takeFile(input){const n=input.name,f=findField(n),file=input.files[0];if(!file)return;if(!input._sn){sniffType(file).then(real=>{const ok=f.img?/^image\//.test(real):!!real;if(!ok){setErr(n,'This file is not a genuine '+(f.img?'JPG/PNG image':'JPG, PNG or PDF file'));input.value='';return}input._sn=1;takeFile(input);input._sn=0});return}
  const okType=f.img?/^image\/(png|jpe?g)$/.test(file.type):/^(image\/(png|jpe?g)|application\/pdf)$/.test(file.type);
  if(!okType){setErr(n,f.img?'Please upload a JPG or PNG image':'Please upload a JPG, PNG or PDF file');input.value='';return}
  if(file.size>5*1024*1024){setErr(n,'File is larger than 5 MB');input.value='';return}
  clearErr(n);const rec={name:file.name,size:file.size,type:file.type,file};
  if(/^image\//.test(file.type)){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const S=f.img?260:160,c=document.createElement('canvas'),s=Math.min(im.width,im.height);
      c.width=c.height=S;const x=c.getContext('2d');if(f.img){x.drawImage(im,(im.width-s)/2,(im.height-s)/2*.6,s,s,0,0,S,S)}else{const k=S/Math.max(im.width,im.height);c.width=im.width*k;c.height=im.height*k;x.drawImage(im,0,0,c.width,c.height)}
      rec.thumb=c.toDataURL('image/jpeg',.82);WZ.FILES[n]=rec;drawFile(document.querySelector(`[data-file="${n}"]`))};im.src=r.result};r.readAsDataURL(file)}
  else{WZ.FILES[n]=rec;drawFile(document.querySelector(`[data-file="${n}"]`))}}
function drawFile(lbl){if(!lbl)return;const n=lbl.dataset.file,fl=WZ.FILES[n],dz=lbl.querySelector('.dz');lbl.classList.toggle('has',!!fl);
  dz.innerHTML=fl?`${fl.thumb?`<img src="${fl.thumb}" alt="">`:'<i class="pdf">PDF</i>'}<span><b>${esc(fl.name)}</b><small>${(fl.size/1024).toFixed(0)} KB · tap to change</small></span><button type="button" class="rmf" data-rmf="${n}" aria-label="Remove file">✕</button>`
   :'<i class="up">⬆</i><span><b>Choose file</b><small>JPG, PNG'+(findField(n).img?'':' or PDF')+' · max 5 MB</small></span>';
  const rb=dz.querySelector('[data-rmf]');rb&&(rb.onclick=e=>{e.preventDefault();e.stopPropagation();delete WZ.FILES[n];lbl.querySelector('input').value='';drawFile(lbl)})}
/* validation */
function check(f){const V=WZ.V;let v=V[f.n];
  if(f.t==='h'||f.t==='info')return '';
  if(f.t==='file'){return f.req&&!WZ.FILES[f.n]?'Please upload this document':''}
  if(f.t==='check')return f.req&&!v?'Please confirm to continue':'';
  if(f.t==='multi')return f.req&&!(v&&v.length)?'Select at least one':'';
  if(f.t==='repeat'){const rows=(v||[]).filter(r=>Object.values(r).some(x=>String(x).trim()));if(f.req&&!rows.length)return 'Add at least one entry';
    for(const r of rows)for(const s of f.sub){if(!String(r[s.n]||'').trim())return 'Complete or remove the empty fields';if(s.pat&&!PAT[s.pat][0].test(r[s.n]))return PAT[s.pat][1]}return ''}
  if((v===undefined||v==='')&&f.calcDefault){v=f.calcDefault(V);V[f.n]=v}
  if(v===undefined||v===null||String(v).trim()===''){return f.req?'This field is required':''}
  v=String(v).trim();if(f.up)v=v.toUpperCase();V[f.n]=v;
  if(f.pat&&!PAT[f.pat][0].test(v))return PAT[f.pat][1];
  if(f.match&&v!==String(V[f.match]||''))return 'Does not match';
  if(f.t==='number'){const x=+v;if(isNaN(x)||x<f.min||x>f.max)return `Enter a value between ${f.min} and ${f.max}`}
  if(f.t==='date'){const d=new Date(v),now=new Date();if(isNaN(d))return 'Enter a valid date';if(f.past&&d>now)return 'Date cannot be in the future';if(f.future&&d<now)return 'Date must be in the future';
    if(f.minAge){const a=(now-d)/31557600000;if(a<f.minAge)return `Minimum age is ${f.minAge} years`;if(a>90)return 'Please check the date of birth'}
    if(f.after&&V[f.after]&&d<=new Date(V[f.after]))return 'Must be after the start date'}
  if(f.n==='since'&&+v>YEAR)return 'Year cannot be in the future';
  return ''}
function validStep(i){let bad=null;for(const f of stepFields(i)){const m=check(f);if(m){setErr(f.n,m);bad=bad||f.n}else clearErr(f.n)}
  if(bad){const el=$('#e_'+bad)?.closest('.wf');el&&el.scrollIntoView({block:'center',behavior:'smooth'});const inp=el?.querySelector('input,select');inp&&inp.focus({preventScroll:true});toast('Please fix the highlighted fields')}
  return !bad}
function go(i){if(i<0||i>=stepsAll())return;if(i>WZ.step){for(let k=WZ.step;k<i;k++){if(k===WZ.step&&!validStep(k))return;WZ.done.add(k)}}WZ.step=i;render()}
function next(){if(WZ.step===stepsAll()-1){if(WZ.spec.fee&&!WZ.paid){if(allValid())openPay();return}submitApp();return}if(!validStep(WZ.step))return;WZ.done.add(WZ.step);WZ.step++;render()}
$('body').addEventListener('click',e=>{const g=e.target.closest('#wzSteps [data-go],[data-edit]');if(!g||!WZ)return;const i=+(g.dataset.go??g.dataset.edit);if(i<WZ.step||WZ.done.has(i-1)||i===WZ.step){WZ.step=i;render()}});
/* display helpers */
function mask(f,v){if(!v)return v;if(f.n==='aadhaar')return 'XXXX XXXX '+String(v).slice(-4);if(f.n==='acc'||f.n==='acc2')return 'XXXXXX'+String(v).slice(-4);return v}
function showVal(f,V,files){if(f.t==='file'){const x=files[f.n];return x?`📎 ${esc(x.name)}`:'—'}
  if(f.t==='check')return V[f.n]?'Yes':'No';if(f.t==='multi')return esc((V[f.n]||[]).join(', '))||'—';
  if(f.t==='repeat'){const r=(V[f.n]||[]).filter(r=>Object.values(r).some(x=>String(x).trim()));return r.length?r.map(x=>esc(f.sub.map(s=>x[s.n]).filter(Boolean).join(' · '))).join('<br>'):'—'}
  if(f.t==='info')return esc(f.calc(V));if(f.t==='choice'){const o=f.opts.find(o=>o[0]===V[f.n]);return o?`<b>${o[0]}</b> — ${esc(o[1])}`:'—'}
  const v=V[f.n];return v===undefined||v===''?'—':esc(mask(f,v))}
function sectionsHTML(spec,V,files,editable){return spec.steps.map((s,i)=>{const fs=s.f.filter(f=>f.t!=='h'&&!f.nopaste&&f.n!=='agree'&&(!f.when||f.when(V)));
  return `<section class="rv"><h4>${esc(s.t)}${editable?`<button type="button" class="link" data-edit="${i}">Edit</button>`:''}</h4><dl>${fs.map(f=>`<dt>${esc(f.l)}</dt><dd>${showVal(f,V,files)}</dd>`).join('')}</dl></section>`}).join('')}
function reviewHTML(){const ph=WZ.FILES.photo||WZ.FILES.logo;return `<div class="rv-top">${ph?`<img src="${ph.thumb}" alt="">`:''}<div><h3>${esc(dispName(WZ.type,WZ.V))}</h3><p>${esc(WZ.type)} · ${esc(dispDistrict(WZ.type,WZ.V))}${WZ.V.dob?' · '+esc(ageCat(WZ.V.dob)):''}</p></div></div>
  ${WZ.spec.fee?feeBox():''}<div class="alert s" style="animation:none">Please check everything carefully. After submitting, your application goes to AFAGS for accreditation. Once approved, your <b>AFAGS ID</b> is generated automatically.</div>${sectionsHTML(WZ.spec,WZ.V,WZ.FILES,true)}`}
function dispName(type,V){const sp=FORMS[type];if(sp.org)return V.clubName||V.assoc||'';return [V.first,V.middle,V.last].filter(Boolean).join(' ')}
function dispDistrict(type,V){return V.district||(V.homeUnit||'').replace(' District Fencing Unit','')||''}
/* ---------- registration fee payment ---------- */
function feeBox(){const f=WZ.spec.fee,p=WZ.paid;return `<div class="feebox ${p?'paid':''}"><div class="fb-i">${p?'✓':'₹'}</div><div class="fb-t"><b>Registration fee: ₹${f}</b><span>${p?`Paid · Payment ID ${p.txn}`:'Payment is required before your application can be submitted.'}</span></div><div class="fb-a">${p?'<span class="st Approved">Paid</span>':'<span class="st Pending">Unpaid</span>'}</div></div>`}
function openPay(){const fee=WZ.spec.fee,name=dispName(WZ.type,WZ.V);let method='UPI';
  if(API.online&&API.cfg.payments){API.pay({amount:fee,purpose:'AFAGS fencer registration fee',ref:'reg',name,email:WZ.V.email,mobile:WZ.V.mobile}).then(p=>{WZ.paid=p;render();submitApp()}).catch(e=>toast((e.message||'Payment failed')+' — your application has not been submitted'));return}
  const m=document.createElement('div');m.className='pay';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Pay registration fee');
  m.innerHTML=`<div class="pay-c"><div class="pay-h"><span class="logo" style="width:40px;height:40px"></span><div><b>AFAGS Registration Fee</b><small>${esc(name)} · Fencer</small></div><button type="button" class="md-x" data-px aria-label="Close">✕</button></div>
   <div class="pay-amt"><span>Amount payable</span><b>₹${fee}.00</b><small>Fencer registration fee · ${SEASON_L}</small></div>
   <div class="pay-demo">🧪 <b>Demo checkout</b> — no money is charged. Connect a payment gateway (Razorpay / PayU / Paytm) before going live.</div>
   <div class="pay-m" role="radiogroup" aria-label="Payment method">${[['UPI','📱','Google Pay, PhonePe, Paytm, BHIM'],['Card','💳','Debit / credit card'],['Net Banking','🏦','All major banks'],['Wallet','👛','Paytm, Mobikwik & more']].map(([k,i,d],n)=>`<label><input type="radio" name="pm" value="${k}" ${n===0?'checked':''}><span class="pi">${i}</span><span><b>${k}</b><small>${d}</small></span><em>›</em></label>`).join('')}</div>
   <label class="pay-fail"><input type="checkbox" id="pFail"> Simulate a failed payment (for testing)</label>
   <div id="pMsg"></div>
   <button type="button" class="btn pri" id="pGo">Pay ₹${fee} securely</button>
   <p class="pay-sec">🔒 Payments are processed by the gateway. AFAGS never sees or stores your card or UPI PIN.</p></div>`;
  document.body.appendChild(m);const close=()=>m.remove();
  m.querySelector('[data-px]').onclick=close;m.addEventListener('click',e=>{if(e.target===m)close()});m.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close()}});
  m.querySelectorAll('input[name=pm]').forEach(r=>r.onchange=()=>method=r.value);
  const go=m.querySelector('#pGo');setTimeout(()=>go.focus(),50);
  go.onclick=()=>{go.disabled=true;go.innerHTML='<span class="spn"></span> Processing payment…';m.querySelector('#pMsg').innerHTML='';
    setTimeout(()=>{if(m.querySelector('#pFail').checked){go.disabled=false;go.textContent='Retry payment';
        m.querySelector('#pMsg').innerHTML='<div class="alert e">Payment failed or was cancelled. No money was deducted. Please try again — your application has not been submitted.</div>';return}
      const txn='PAY'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,6).toUpperCase();
      WZ.paid={amount:fee,txn,method,at:Date.now()};
      m.querySelector('.pay-c').innerHTML=`<div class="pay-ok"><div class="ico ap"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 12l5 5 9-10"/></svg></div><h3>Payment Successful</h3><p>₹${fee}.00 paid via ${method}</p><code>${txn}</code><p class="sm">Submitting your application…</p></div>`;
      setTimeout(()=>{close();render();submitApp()},1100)},1300)}}
/* submit */
function allValid(){for(let i=0;i<WZ.spec.steps.length;i++){if(!stepFields(i).every(f=>!check(f))){WZ.step=i;render();validStep(i);return false}}return true}
function submitApp(){if(!allValid())return;if(!preSubmitChecks())return;if(WZ.spec.fee&&!WZ.paid){openPay();return}
  const btn=$('#wzNext');btn.disabled=true;btn.innerHTML='<span class="spn"></span> Submitting…';
  setTimeout(()=>{const V={...WZ.V};if(V.aadhaar)V.aadhaar='XXXXXXXX'+V.aadhaar.slice(-4);if(V.acc)V.acc='XXXXXX'+String(V.acc).slice(-4);delete V.acc2;delete V.email2;delete V.mobile2;
    const files={};for(const k in WZ.FILES){const x=WZ.FILES[k];files[k]={name:x.name,size:x.size,type:x.type,thumb:(k==='photo'||k==='logo')?x.thumb:undefined,url:x.url||undefined}}
    const seq=(store.get('afags_refseq')||1000)+1;store.set('afags_refseq',seq);
    const ref=`AFAGS-${WZ.spec.code}-${String(YEAR).slice(2)}${String(seq).padStart(5,'0')}`;
    const app={ref,type:WZ.type,key:WZ.spec.key,at:Date.now(),V,files,consent:WZ.consent||null,captcha:WZ.captcha&&WZ.captcha.id?WZ.captcha:undefined,name:dispName(WZ.type,V),district:dispDistrict(WZ.type,V),weapon:V.weapon||((V.weapons||[]).join(', '))||'—',cat:V.dob&&WZ.spec.key==='fencers'?catShort(ageCat(V.dob)):'—',mobile:V.mobile||V.headMobile||V.presMobile||'',payment:WZ.paid||null};
    const apps=store.get('afags_apps')||[];apps.unshift(app);
    if(!store.set('afags_apps',apps)){apps.shift();app.files.photo&&(delete app.files.photo.thumb);apps.unshift(app);store.set('afags_apps',apps)}
    store.del('afags_draft_'+WZ.spec.key);
    addAppToDB(app);if(ME){buildMenu();route()}
    $('#wzSteps').innerHTML='';$('#wzProg').style.width='100%';$('.wz-f').style.display='none';
    $('#wzB').innerHTML=`<div class="done"><div class="ico ap"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 12l5 5 9-10"/></svg></div><h3>Application Submitted</h3><p>Your reference number</p><div class="refno">${ref}</div>
     ${WZ.paid?`<div class="rcpt"><div><span>Registration fee paid</span><b>₹${WZ.paid.amount}</b></div><div><span>Payment ID</span><b>${WZ.paid.txn}</b></div><div><span>Method</span><b>${WZ.paid.method}</b></div></div>`:''}
     <p class="sm">Status: <span class="st Pending">Pending accreditation</span><br>Keep this number safe. Once AFAGS approves your application, your <b>AFAGS ID</b> will be generated automatically. Use <b>Track Application</b> on the login page to check your status.</p>
     <div class="row2"><button type="button" class="btn ghost" id="cpRef">Copy number</button><button type="button" class="btn nav" id="doneB">Done</button></div></div>`;
    $('#cpRef').onclick=()=>{try{navigator.clipboard.writeText(ref);toast('Reference number copied')}catch(e){toast(ref)}};$('#doneB').onclick=closeWizard;},900)}

/* ================= TRACK APPLICATION ================= */
$('#fTrack').addEventListener('submit',e=>{e.preventDefault();const q=$('#tq').value.trim().toUpperCase();if(!q){fieldErr('#fT','Enter your reference number or mobile');return}fieldErr('#fT','');
  const apps=store.get('afags_apps')||[],dec=store.get('afags_dec')||{},ids=store.get('afags_ids')||{},why=store.get('afags_reason')||{};
  const hit=apps.filter(a=>a.ref===q||a.mobile===q.replace(/\D/g,''));
  if(!hit.length){$('#tAlert').innerHTML='<div class="alert e">No application found. Check the number and try again.</div>';return}
  $('#tAlert').innerHTML=hit.map(a=>{const st=dec[a.ref]||'Pending';return `<div class="trk"><div class="trk-h"><b>${esc(a.name)}</b><span class="st ${st}">${st}</span></div><small>${esc(a.type)} · ${a.ref} · submitted ${fmt(a.at)}${a.payment?` · fee ₹${a.payment.amount} paid (${a.payment.txn})`:''}</small>
    ${st==='Approved'?`<div class="trk-id"><span>Your AFAGS ID</span><b>${ids[a.ref]||'—'}</b></div>`:st==='Rejected'?`<p class="trk-r">Reason: ${esc(why[a.ref]||'Not specified')}</p>`:st==='Relookup'?`<p class="trk-r">Correction needed: ${esc(why[a.ref]||'Please contact AFAGS')}</p>`:st==='Verified'?'<p class="trk-r">Documents verified — waiting for final approval by AFAGS.</p>':st==='Blocked'?`<p class="trk-r">Your AFAGS ID is blocked: ${esc(why[a.ref]||'contact the AFAGS office')}</p>`:'<p class="trk-r">Your application is under review by AFAGS.</p>'}</div>`}).join('')});

/* ================= DATA ================= */
const FN=['Aarav','Vivaan','Aditya','Krish','Dhruv','Harsh','Yash','Parth','Jay','Nirav','Rohan','Kunal','Meet','Om','Dev','Ananya','Diya','Aisha','Kavya','Riya','Isha','Pooja','Khushi','Nidhi','Janvi','Hetvi','Mansi','Prachi','Saanvi','Tanvi'];
const LN=['Patel','Shah','Desai','Mehta','Joshi','Parmar','Chaudhari','Thakor','Rathod','Solanki','Trivedi','Bhatt','Vaghela','Chauhan','Prajapati','Dave','Pandya','Modi','Gohil','Jadeja'];
let seed=20261027;const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;const pick=a=>a[rnd()*a.length|0];
const COL=['#1d6fe0','#f47b20','#1f8f3f','#7b4fc9','#1e9fb8','#e5323a','#0b2257'];
const W=['Foil','Épée','Sabre'],CAT=['U-10','U-12','U-14','U-17','U-20','Senior'];
const CODE={fencers:'FEN',coaches:'COA',referees:'REF',clubs:'CLB',districts:'DIS'};
function gen(type,n,dist){const out=[];if(store.get('afags_nosample'))return out;for(let i=0;i<n;i++){const r=rnd(),st=r<dist[0]?'Approved':r<dist[0]+dist[1]?'Pending':'Rejected';
  const d=new Date(2026,0,1+(rnd()*290|0));
  const name=type==='clubs'?pick(['Shakti','Gujarat','Sardar','Narmada','Sabarmati','Royal','Elite','Victory','Lion','Garuda'])+' Fencing '+pick(['Club','Academy','Centre']):type==='districts'?DISTRICTS[i%33]+' District Fencing Unit':pick(FN)+' '+pick(LN);
  out.push({id:type.slice(0,2).toUpperCase()+String(1000+i),name,district:type==='districts'?DISTRICTS[i%33]:pick(DISTRICTS),weapon:type==='clubs'||type==='districts'?'—':pick(W),cat:type==='fencers'?pick(CAT):'—',status:st,date:d,col:pick(COL),sample:1})}return out}
const DB={fencers:gen('fencers',2512,[.946,.018,.036]),coaches:gen('coaches',92,[.93,.03,.04]),referees:gen('referees',58,[.88,.04,.08]),clubs:gen('clubs',64,[.9,.05,.05]),districts:gen('districts',33,[.94,.03,.03])};
/* AFAGS IDs: sample members already accredited get sequential IDs */
const SEQ=store.get('afags_seq')||{};
for(const k in DB){const ap=DB[k].filter(r=>r.status==='Approved').sort((a,b)=>a.date-b.date);ap.forEach((r,i)=>r.afagsId=`AFAGS/${CODE[k]}/2026/${String(i+1).padStart(4,'0')}`);SEQ[k]=Math.max(SEQ[k]||0,ap.length)}
function addAppToDB(a){const k=a.key;if(!DB[k]||DB[k].some(r=>r.id===a.ref))return;DB[k].unshift({id:a.ref,ref:a.ref,name:a.name,district:a.district,weapon:a.weapon,cat:a.cat,status:'Pending',date:new Date(a.at),col:'#f47b20',app:a,isNew:true,photo:(a.files.photo||a.files.logo||{}).thumb})}
(store.get('afags_apps')||[]).slice().reverse().forEach(addAppToDB);
/* legacy quick registrations from the earlier version */
(store.get('afags_new')||[]).forEach(a=>{const k={'Fencer':'fencers','Coach':'coaches','Referee & Technical Official':'referees','Club':'clubs','District Unit':'districts'}[a.type];if(k&&!DB[k].some(r=>r.id===a.ref))DB[k].unshift({id:a.ref,name:a.name,district:a.district,weapon:a.weapon||'—',cat:'—',status:'Pending',date:new Date(a.at),col:'#f47b20',isNew:true})});
const decisions=store.get('afags_dec')||{},IDS=store.get('afags_ids')||{},WHY=store.get('afags_reason')||{};
Object.values(DB).flat().forEach(r=>{if(decisions[r.id])r.status=decisions[r.id];if(IDS[r.id])r.afagsId=IDS[r.id];if(WHY[r.id])r.reason=WHY[r.id]});
const META={fencers:['Fencers','Fencer'],coaches:['Coaches','Coach'],referees:['Referees & Officials','Referee / Official'],clubs:['Clubs','Club'],districts:['District Units','District Unit']};
function newAfagsId(k){SEQ[k]=(SEQ[k]||0)+1;store.set('afags_seq',SEQ);return `AFAGS/${CODE[k]}/${YEAR}/${String(SEQ[k]).padStart(4,'0')}`}

/* ================= APP ================= */
let ME=null,scope=null;
const ICONS={cms:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/>',inbox:'<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1 3h6l1-3h5"/>',audit:'<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',dashboard:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',accreditation:'<path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',fencers:'<circle cx="9" cy="4" r="2"/><path d="M9 7l-2 6 4 2 1 6M7 13l-4 7M10 9l4 1 8-4"/>',coaches:'<rect x="10" y="3" width="11" height="8" rx="1"/><circle cx="6" cy="8" r="3"/><path d="M1 21c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/>',referees:'<circle cx="12" cy="4" r="2.5"/><path d="M9 22v-9l-3-4 3-2h6l3 2-3 4v9"/>',clubs:'<path d="M3 10l9-6 9 6M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18"/>',districts:'<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',certificates:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',ranking:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',events:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',reports:'<path d="M12 3v9l7 4"/><circle cx="12" cy="12" r="9"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'};
const LABEL={cms:'Website CMS',inbox:'Inbox',audit:'Audit Log',dashboard:'Dashboard',accreditation:'Accreditation',fencers:'Fencers',coaches:'Coaches',referees:'Referee & Officials',clubs:'Clubs / Academy',districts:'District Units',certificates:'Certificates',ranking:'Ranking',events:'Events',reports:'Reports',settings:'Settings'};
const rows=k=>scope?DB[k].filter(r=>r.district===scope):DB[k];
const cnt=(k,s)=>rows(k).filter(r=>!s||r.status===s).length;
const memberKeys=()=>ROLE_MENU[ME.role].filter(k=>DB[k]);
const pendingAll=()=>memberKeys().reduce((a,k)=>a+cnt(k,'Pending'),0);
function startApp(key){ME=Object.assign({key},ACCOUNTS[key]);scope=ME.district||null;(store.get('afags_apps')||[]).slice().reverse().forEach(addAppToDB);
  $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');
  const i2=ini(ME.name);$('#pAv').textContent=$('#whoAv').textContent=i2;$('#pName').textContent=ME.name;$('#pOrg').textContent=ME.org;$('#pRole').textContent=ME.roleLabel;$('#whoN').textContent=ME.roleLabel;
  buildMenu();route()}
function buildMenu(){const m=ROLE_MENU[ME.role];let h='';
  m.forEach((k,i)=>{if(k==='fencers')h+='<li class="sep">Members</li>';if(k==='certificates'||(k==='ranking'&&!m.includes('certificates')))h+='<li class="sep">Manage</li>';
    const pc=k==='accreditation'?pendingAll():k==='inbox'?inboxNew():DB[k]?cnt(k,'Pending'):0;if(k==='cms')h+='<li class="sep">Website</li>';h+=`<li><a href="#${k}" data-k="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>${LABEL[k]}${pc?`<span class="cnt">${pc}</span>`:'<span class="chev">›</span>'}</a></li>`});
  h+=`<li class="sep">Account</li><li><a href="#" id="sbLogout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>Logout</a></li>`;
  $('#menu').innerHTML=h;$('#sbLogout').onclick=e=>{e.preventDefault();logout()};$('#bellN').textContent=pendingAll()}
function setActive(k){$$('#menu a').forEach(a=>a.classList.toggle('on',a.dataset.k===k));$('#tbTitle').textContent=LABEL[k]||'Dashboard';document.body.classList.remove('menu-open')}
function route(){if(!ME)return;let [k,q]=(location.hash.slice(1)||'dashboard').split('?');
  if(k==='profile'){viewProfile();return}
  if(!ROLE_MENU[ME.role].includes(k)){if(k!=='dashboard'&&k)toast('You do not have access to that section');k='dashboard'}
  setActive(k);scrollTo(0,0);
  if(k==='dashboard')viewDash();else if(k==='accreditation')viewAccr();else if(DB[k])viewList(k,new URLSearchParams(q||'').get('s')||'All');else if(k==='ranking')viewRank();else if(k==='events')viewCMS('events','events');else if(k==='cms')viewCMS(new URLSearchParams(q||'').get('c')||'news');else if(k==='inbox')viewInbox(q);else if(k==='audit')viewAudit();else if(k==='certificates')viewCerts();else if(k==='reports')viewReports();else if(k==='settings')viewSettings();else viewPlaceholder(k)}
addEventListener('hashchange',()=>{if(!WZ)$$('.md').forEach(m=>m.remove());route()});
const crumb=(t,r='')=>`<div class="crumb">Home <span>/</span> <b>${t}</b><span class="r">${r}</span></div>${DBG()}`;
const SVGI={all:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>',ap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-10"/></svg>',pe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',re:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 7l10 10M17 7L7 17"/></svg>'};
function countUp(el){const t=+el.dataset.n,s0=performance.now();(function f(n){const p=Math.min((n-s0)/900,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3))).toLocaleString('en-IN');if(p<1)requestAnimationFrame(f)})(s0)}
const av=r=>r.photo?`<img class="a" src="${r.photo}" alt="">`:`<span class="a" style="background:${r.col}">${ini(r.name)}</span>`;
function viewDash(){const ents=memberKeys();let h=crumb('Dashboard',scope?scope+' district':'All Gujarat');let d=0;
  ents.forEach(k=>{h+=`<div class="sec-t">${META[k][0]}<a href="#${k}">View all ›</a></div><div class="stats">`;
    [['All','all',''],['Approved','ap','Approved'],['Pending','pe','Pending'],['Rejected','re','Rejected']].forEach(([l,c,s])=>{h+=`<button class="sc" style="animation-delay:${(d++)*35}ms" data-go="#${k}?s=${l}"><span><small>${l} ${META[k][0]}</small><b data-n="${cnt(k,s)}">0</b></span><span class="ico ${c==='all'?'':c}">${SVGI[c]}</span></button>`});h+='</div>'});
  const pend=ents.flatMap(k=>rows(k).filter(r=>r.status==='Pending'||r.status==='Verified').map(r=>({...r,k}))).sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0)||b.date-a.date).slice(0,8);
  h+=`<div class="cards2"><div class="panel"><h4>Awaiting Accreditation${ME.canApprove?'<a href="#accreditation">Open queue ›</a>':''}</h4>${pend.length?`<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Name</th><th class="hm">Type</th><th class="hm">Applied</th><th>Action</th></tr></thead><tbody>${pend.map(r=>`<tr><td><div class="nm">${av(r)}<div><b>${esc(r.name)}${r.isNew?' <span class="st New">New</span>':''}</b><small>${r.id} · ${esc(r.district)}</small></div></div></td><td class="hm">${META[r.k][1]}</td><td class="hm">${fmt(r.date)}</td><td>${actions(r)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">🎉 Nothing waiting for accreditation</div>'}</div>
  <div class="panel"><h4>Approval Status</h4><div class="bars">${ents.map(k=>{const t=cnt(k)||1;return `<div class="bar"><label><span>${META[k][0]}</span><span>${cnt(k).toLocaleString('en-IN')}</span></label><div class="t"><i style="--w:${cnt(k,'Approved')/t*100}%;background:#2ea84a"></i><i style="--w:${cnt(k,'Pending')/t*100}%;background:#f08a12"></i><i style="--w:${cnt(k,'Rejected')/t*100}%;background:#e5323a"></i></div></div>`}).join('')}</div><div class="legend"><span style="--c:#2ea84a">Approved</span><span style="--c:#f08a12">Pending</span><span style="--c:#e5323a">Rejected</span></div></div></div>`;
  $('#main').innerHTML=h;$$('.sc b[data-n]').forEach(countUp);$$('.sc').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
  requestAnimationFrame(()=>setTimeout(()=>$$('.bar .t i').forEach(i=>i.style.width=i.style.getPropertyValue('--w')),50));bindActions()}
function viewAccr(){const all=memberKeys().flatMap(k=>rows(k).filter(r=>r.status==='Pending').map(r=>({...r,k}))).sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0)||b.date-a.date);
  $('#main').innerHTML=crumb('Accreditation',all.length+' pending')+`<div class="acc-int"><div><b>Accreditation queue</b><span>Review each application. Approving it generates the member's <b>AFAGS ID</b> automatically, in the format <code>AFAGS/FEN/${YEAR}/0001</code>.</span></div></div>
  <div class="tblw">${all.length?`<table class="tbl"><thead><tr><th>Applicant</th><th class="hm">Type</th><th class="hm">District</th><th class="hm">Applied</th><th>Action</th></tr></thead><tbody>${all.map(r=>`<tr><td><div class="nm">${av(r)}<div><b>${esc(r.name)}${r.isNew?' <span class="st New">New</span>':''}${r.app&&r.app.payment?' <span class="st Approved">₹'+r.app.payment.amount+' paid</span>':''}</b><small>${r.id}${r.weapon&&r.weapon!=='—'?' · '+esc(r.weapon):''}${r.cat&&r.cat!=='—'?' · '+r.cat:''}</small></div></div></td><td class="hm">${META[r.k][1]}</td><td class="hm">${esc(r.district)}</td><td class="hm">${fmt(r.date)}</td><td>${actions(r)}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">🎉 All applications have been reviewed</div>'}</div>`;bindActions()}
const actions=r=>rowActions(r);const actionsV3=r=>`<div class="act"><button class="vw" data-v="${r.id}">View</button>${ME.canApprove?`${r.status!=='Approved'?`<button class="ok" data-a="${r.id}">Approve</button>`:''}${r.status!=='Rejected'?`<button class="no" data-r="${r.id}">Reject</button>`:''}`:''}</div>`;
const findRec=id=>{for(const k in DB){const r=DB[k].find(x=>x.id===id);if(r)return [r,k]}return []};
function persist(r){const _newId=!!(r.afagsId&&!IDS[r.id]);setTimeout(()=>{if(_newId&&r.status==='Approved'&&window.__onApproved)__onApproved(r)},700);decisions[r.id]=r.status;store.set('afags_dec',decisions);if(r.afagsId){IDS[r.id]=r.afagsId;store.set('afags_ids',IDS)}if(r.reason!==undefined){WHY[r.id]=r.reason;store.set('afags_reason',WHY)}}
function approve(id){const [r,k]=findRec(id);if(!r||!ME.canApprove)return;
  confirmBox({title:'Approve & accredit?',body:`<b>${esc(r.name)}</b> (${META[k][1]}) will be accredited and an AFAGS ID will be generated automatically.`,ok:'Approve & Generate ID',tone:'ok'},()=>{
    r.status='Approved';r.isNew=false;if(!r.afagsId)r.afagsId=newAfagsId(k);audit('approve',r.name+' → '+r.afagsId);r.approvedAt=Date.now();r.reason=undefined;persist(r);delete WHY[r.id];store.set('afags_reason',WHY);
    buildMenu();route();viewRec(id,true)})}
function reject(id){const [r,k]=findRec(id);if(!r||!ME.canApprove)return;
  confirmBox({title:'Reject application',body:`Give a reason — the applicant will see it when tracking <b>${esc(r.name)}</b>'s application.`,reason:1,ok:'Reject Application',tone:'no'},why=>{
    r.status='Rejected';r.isNew=false;r.reason=why;audit('reject',r.name+' — '+why);persist(r);toast(`${r.name} — Rejected`);buildMenu();route()})}
function confirmBox(o,cb){const m=document.createElement('div');m.className='md';m.innerHTML=`<div class="md-c" style="max-width:460px"><div class="md-h"><div><h3>${o.title}</h3></div><button class="md-x" aria-label="Close">✕</button></div><p style="color:#3d4660;font-size:14px">${o.body}</p>
  ${o.reason?`<div class="chips">${['Documents unclear','Aadhaar details mismatch','Incomplete information','Duplicate registration','Not eligible for category'].map(x=>`<button type="button">${x}</button>`).join('')}</div><textarea id="cfR" rows="3" placeholder="Reason for rejection" style="width:100%;border:1.5px solid #dbe3f0;border-radius:12px;padding:10px;font:inherit;margin-top:8px"></textarea><div class="fe" id="cfE"></div>`:''}
  <div style="display:flex;gap:10px;margin-top:18px"><button class="btn ghost" style="flex:1" data-c>Cancel</button><button class="btn" style="flex:1.4;background:${o.tone==='ok'?'linear-gradient(180deg,#5CE07A,#28B44A)':'linear-gradient(180deg,#ff7a7a,#e5323a)'}" data-ok>${o.ok}</button></div></div>`;
  document.body.appendChild(m);const close=()=>m.remove();m.querySelector('.md-x').onclick=close;m.querySelector('[data-c]').onclick=close;m.onclick=e=>{if(e.target===m)close()};
  m.querySelectorAll('.chips button').forEach(b=>b.onclick=()=>{m.querySelector('#cfR').value=b.textContent});
  m.querySelector('[data-ok]').onclick=()=>{let why='';if(o.reason){why=m.querySelector('#cfR').value.trim();if(!why){m.querySelector('#cfE').textContent='Please give a reason';return}}close();cb(why)};
  setTimeout(()=>(m.querySelector('#cfR')||m.querySelector('[data-ok]')).focus(),50)}
function bindActions(){$$('#main [data-a]').forEach(b=>b.onclick=()=>approve(b.dataset.a));$$('#main [data-r]').forEach(b=>b.onclick=()=>reject(b.dataset.r));$$('#main [data-v]').forEach(b=>b.onclick=()=>viewRec(b.dataset.v))}
function idCard(r,k){return `<div class="idc" id="idCard"><div class="idc-h"><span class="logo"></span><div><b>Amateur Fencing Association of Gujarat State</b><small>Affiliated to Fencing Association of India</small></div></div>
  <div class="idc-b">${r.photo?`<img src="${r.photo}" alt="">`:`<span class="idc-ini" style="background:${r.col}">${ini(r.name)}</span>`}<div><small>${META[k][1].toUpperCase()}</small><h4>${esc(r.name)}</h4>
  <dl><dt>AFAGS ID</dt><dd class="idn">${r.afagsId}</dd><dt>District</dt><dd>${esc(r.district)}</dd>${r.weapon&&r.weapon!=='—'?`<dt>Weapon</dt><dd>${esc(r.weapon)}</dd>`:''}${r.cat&&r.cat!=='—'?`<dt>Category</dt><dd>${r.cat}</dd>`:''}<dt>Valid</dt><dd>Season ${SEASON_L}</dd></dl></div><div class="idc-qr">${qrSVG(r.afagsId,72)}</div></div>
  <div class="idc-f"><span>One Weapon. One Sport. One Gujarat.</span><span class="tri"><i></i><i></i><i></i></span></div></div>`}
function viewRec(id,justApproved){const [r,k]=findRec(id);if(!r)return;const m=document.createElement('div');m.className='md';
  const app=r.app,spec=app&&FORMS[app.type];
  m.innerHTML=`<div class="md-c dview wide"><div class="md-h">${r.photo?`<img src="${r.photo}" alt="" style="width:56px;height:56px;border-radius:50%;object-fit:cover">`:`<div class="av" style="width:56px;height:56px;margin:0;font-size:20px;background:${r.col}">${ini(r.name)}</div>`}<div><h3>${esc(r.name)}</h3><p>${META[k][1]} · ${r.id} · <span class="st ${r.status}">${r.status}</span></p></div><button class="md-x" aria-label="Close">✕</button></div>
  ${justApproved?`<div class="alert s" style="animation:none">✅ Accredited. AFAGS ID <b>${r.afagsId}</b> has been generated.</div>`:''}
  ${r.status==='Approved'&&r.afagsId?idCard(r,k)+`<div style="display:flex;gap:10px;justify-content:center;margin:12px 0 4px"><button class="btn nav" id="prId" style="height:42px">🖨 Print ID Card</button><button class="btn ghost" id="cpId" style="height:42px">Copy ID</button></div>`:''}
  ${r.status==='Rejected'?`<div class="alert e" style="animation:none">Rejected — ${esc(r.reason||'no reason given')}</div>`:''}
  ${app&&app.payment?`<div class="paybar"><span>💳 Registration fee</span><b>₹${app.payment.amount} paid</b><small>${app.payment.method} · ${app.payment.txn} · ${fmt(app.payment.at)}</small></div>`:app&&FORMS[app.type]&&FORMS[app.type].fee?'<div class="alert e" style="animation:none">Registration fee not paid.</div>':''}
  ${app?`<div class="docs"><h4>Documents</h4>${Object.entries(app.files).map(([n,f])=>{const fl=spec&&findIn(spec,n);return `<div class="doc">${f.thumb?`<img src="${f.thumb}" alt="">`:'<i class="pdf">'+(f.type==='application/pdf'?'PDF':'IMG')+'</i>'}<span><b>${esc(fl?fl.l:n)}</b><small>${esc(f.name)} · ${(f.size/1024).toFixed(0)} KB</small></span>${f.url?`<button type="button" class="btn ghost" style="height:34px;margin-left:auto" data-pf="${esc(f.url)}">Open</button>`:''}</div>`}).join('')}${app.consent?`<p class="sd" style="margin-top:8px">✅ Parent / guardian consent: <b>${esc(app.consent.name)}</b> (${esc(app.consent.relation||'')}) · ${fmt(app.consent.at)}</p>`:''}</div>${sectionsHTML(spec,app.V,app.files,false)}`
   :`<dl><dt>Status</dt><dd><span class="st ${r.status}">${r.status}</span></dd>${r.afagsId&&r.status==='Approved'?`<dt>AFAGS ID</dt><dd>${r.afagsId}</dd>`:''}<dt>District</dt><dd>${esc(r.district)}</dd>${r.weapon!=='—'?`<dt>Weapon</dt><dd>${r.weapon}</dd>`:''}${r.cat!=='—'?`<dt>Age category</dt><dd>${r.cat}</dd>`:''}<dt>Applied on</dt><dd>${fmt(r.date)}</dd></dl><p class="note" style="margin-top:12px;font-size:12px;color:var(--mu)">Sample record — full application details appear for registrations submitted through the forms.</p>`}
  ${ME.canApprove&&r.status!=='Approved'?`<div class="dact">${r.status!=='Approved'?`<button class="btn" style="flex:1;background:linear-gradient(180deg,#5CE07A,#28B44A)" data-x="a">Approve & Generate ID</button>`:''}${r.status!=='Rejected'?`<button class="btn" style="flex:1;background:linear-gradient(180deg,#ff7a7a,#e5323a)" data-x="r">Reject</button>`:''}</div>`:!ME.canApprove&&r.status==='Pending'?'<p class="note" style="margin-top:14px;font-size:12.5px;color:var(--mu)">Accreditation is done by the AFAGS Super Admin.</p>':''}</div>`;
  document.body.appendChild(m);const close=()=>m.remove();m.querySelector('.md-x').onclick=close;m.onclick=e=>{if(e.target===m)close()};m.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  m.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{close();b.dataset.x==='a'?approve(id):reject(id)});
  const pr=m.querySelector('#prId');pr&&(pr.onclick=()=>{document.body.classList.add('printing');const c=m.querySelector('#idCard').cloneNode(true);c.id='idPrint';document.body.appendChild(c);setTimeout(()=>{window.print();c.remove();document.body.classList.remove('printing')},50)});
  const cp=m.querySelector('#cpId');cp&&(cp.onclick=()=>{try{navigator.clipboard.writeText(r.afagsId);toast('AFAGS ID copied')}catch(e){toast(r.afagsId)}})}
function findIn(spec,n){for(const s of spec.steps)for(const f of s.f)if(f.n===n)return f;return null}
const LV={q:'',p:1};
function viewList(k,s){LV.k=k;LV.s=s;LV.p=1;LV.q='';
  $('#main').innerHTML=crumb(META[k][0],cnt(k).toLocaleString('en-IN')+' records')+`<div class="lv-h"><div class="tabs" id="lvT">${['All','Approved','Pending','Rejected'].map(t=>`<button data-s="${t}" class="${t===s?'on':''}">${t}<i>${cnt(k,t==='All'?'':t).toLocaleString('en-IN')}</i></button>`).join('')}</div><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="lvQ" placeholder="Search name, AFAGS ID, ref or district" aria-label="Search"></label><button class="btn nav" style="height:42px;font-size:12px" id="newReg">+ New ${META[k][1]}</button><button class="btn ghost" style="height:42px;font-size:12px" id="exp">⬇ CSV</button></div><div class="tblw" id="lvB"></div><div class="pg" id="lvP"></div>`;
  $$('#lvT button').forEach(b=>b.onclick=()=>{location.hash=`#${k}?s=${b.dataset.s}`});
  $('#lvQ').oninput=e=>{LV.q=e.target.value.toLowerCase();LV.p=1;drawList()};$('#exp').onclick=exportCSV;$('#newReg').onclick=()=>openWizard(TYPE_OF[k]);drawList()}
function filtered(){const {k,s,q}=LV;return rows(k).filter(r=>(s==='All'||r.status===s)&&(!q||(r.name+r.id+(r.afagsId||'')+r.district).toLowerCase().includes(q)))}
function drawList(){const {k}=LV,all=filtered(),per=10,pages=Math.max(1,Math.ceil(all.length/per));LV.p=Math.min(LV.p,pages);const pg=all.slice((LV.p-1)*per,LV.p*per);
  const pc=k==='fencers'||k==='coaches'||k==='referees';
  $('#lvB').innerHTML=pg.length?`<table class="tbl"><thead><tr><th>Name</th><th class="hm">AFAGS ID</th><th class="hm">District</th>${pc?'<th class="hm">Weapon</th>':''}${k==='fencers'?'<th class="hm">Category</th>':''}<th>Status</th><th>Action</th></tr></thead><tbody>${pg.map(r=>`<tr><td><div class="nm">${av(r)}<div><b>${esc(r.name)}${r.isNew?' <span class="st New">New</span>':''}</b><small>${r.id} · ${fmt(r.date)}</small></div></div></td><td class="hm">${r.status==='Approved'&&r.afagsId?`<span class="aid">${r.afagsId}</span>`:'<span style="color:#b4bdd0">—</span>'}</td><td class="hm">${esc(r.district)}</td>${pc?`<td class="hm">${esc(r.weapon)}</td>`:''}${k==='fencers'?`<td class="hm">${r.cat}</td>`:''}<td><span class="st ${r.status}">${r.status}</span></td><td>${actions(r)}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No records found</div>';
  const nums=[];for(let i=Math.max(1,LV.p-2);i<=Math.min(pages,LV.p+2);i++)nums.push(i);
  $('#lvP').innerHTML=`<span>Showing ${all.length?(LV.p-1)*per+1:0}–${Math.min(LV.p*per,all.length)} of ${all.length.toLocaleString('en-IN')}</span><div class="b"><button ${LV.p<2?'disabled':''} data-p="${LV.p-1}" aria-label="Previous page">‹</button>${nums.map(n=>`<button class="${n===LV.p?'on':''}" data-p="${n}">${n}</button>`).join('')}<button ${LV.p>=pages?'disabled':''} data-p="${LV.p+1}" aria-label="Next page">›</button></div>`;
  $$('#lvP [data-p]').forEach(b=>b.onclick=()=>{LV.p=+b.dataset.p;drawList();$('#lvB').scrollIntoView({block:'nearest'})});bindActions()}
function exportCSV(){const rs=filtered(),hd=['Reference','AFAGS ID','Name','District','Weapon','Category','Status','Applied'];
  const csv=[hd,...rs.map(r=>[r.id,r.status==='Approved'?r.afagsId||'':'',r.name,r.district,r.weapon,r.cat,r.status,fmt(r.date)])].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'}));a.download=`afags-${LV.k}-${LV.s.toLowerCase()}.csv`;a.click();toast(`Exported ${rs.length} records`)}
function viewRank(){const sets=W.map(w=>[w,rows('fencers').filter(r=>r.status==='Approved'&&r.weapon===w).slice(0,10)]);
  $('#main').innerHTML=crumb('Ranking')+`<div class="cards2" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin-top:0">${sets.map(([w,l])=>`<div class="panel"><h4>${w} — State Ranking</h4><table class="tbl"><tbody>${l.map((r,i)=>`<tr><td style="width:34px;font-weight:800;color:var(--navy)">${i+1}</td><td><div class="nm">${av(r)}<div><b>${esc(r.name)}</b><small>${r.afagsId||''} · ${esc(r.district)}</small></div></div></td><td style="text-align:right;font-weight:700">${1300-i*37}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`}
function viewEvents(){const ev=[['15–16 Nov 2026','Gujarat State Fencing Championship 2026','Gandhinagar','Registration open'],['05–06 Dec 2026','AFAGS U-17 & U-20 Selection Trials','Rajkot','Registration open'],['02–03 Jan 2027','Inter-District Fencing Tournament','Surat','Upcoming'],['06–07 Feb 2027','National Cadet Circuit (West Zone)','Ahmedabad','Upcoming']];
  $('#main').innerHTML=crumb('Events')+`<div class="tblw"><table class="tbl"><thead><tr><th>Date</th><th>Event</th><th class="hm">Venue</th><th>Status</th></tr></thead><tbody>${ev.map(e=>`<tr><td style="white-space:nowrap">${e[0]}</td><td><b>${e[1]}</b></td><td class="hm">${e[2]}</td><td><span class="st ${e[3]==='Upcoming'?'Pending':'Approved'}">${e[3]}</span></td></tr>`).join('')}</tbody></table></div>`}
function viewPlaceholder(k){$('#main').innerHTML=crumb(LABEL[k])+`<div class="ph-card"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${ICONS[k]}</svg></span><h3>${LABEL[k]}</h3><p>This module's screen is ready to be connected to the AFAGS server. Once the backend is in place, ${LABEL[k].toLowerCase()} will be managed here.</p></div>`}
function viewProfile(){setActive('');$('#tbTitle').textContent='My Profile';$('#main').innerHTML=crumb('My Profile')+`<div class="panel dview" style="max-width:560px"><div class="md-h"><div class="av" style="width:60px;height:60px;margin:0">${ini(ME.name)}</div><div><h3 style="font:800 24px var(--cond);color:var(--navy);text-transform:uppercase">${ME.name}</h3><p style="color:var(--mu);font-size:13px">${ME.roleLabel}</p></div></div><dl><dt>Organisation</dt><dd>${ME.org}</dd><dt>Email</dt><dd>${ME.email}</dd><dt>Access</dt><dd>${scope?scope+' district only':'All of Gujarat'}</dd><dt>Accreditation</dt><dd>${ME.canApprove?'Can approve & generate AFAGS IDs':'View only'}</dd></dl></div>`}
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||WZ)return;const m=[...document.querySelectorAll('.md')].pop();if(m)m.remove();else if(EMB)parent.postMessage({afags:'close'},'*')});
/* chrome */
$('#hb').onclick=()=>{if(innerWidth<=960)document.body.classList.toggle('menu-open');else document.body.classList.toggle('collapsed')};
$('#scrim').onclick=()=>document.body.classList.remove('menu-open');
$('#whoB').onclick=e=>{e.stopPropagation();$('#dd').classList.toggle('open')};document.addEventListener('click',()=>$('#dd').classList.remove('open'));
$('#bell').onclick=()=>location.hash=ME&&ME.canApprove?'#accreditation':'#fencers?s=Pending';
$('#logout').onclick=logout;
function logout(msg){if(ME)audit('logout',ME.key);try{API.logout?API.logout():API.setToken&&API.setToken('')}catch(e){}store.sdel('afags_session');ME=null;try{history.replaceState(null,'',location.href.split('#')[0])}catch(e){};$('#appView').classList.add('hidden');$('#loginView').classList.remove('hidden');document.body.classList.remove('menu-open','collapsed');showPane('#fLogin');drawCap();toast(typeof msg==='string'?msg:'You have been logged out');$('#u').focus()}
/* ===== AFAGS portal v3: security, CMS, inbox, audit, certificates, reports, settings, themes ===== */
const CMS=window.AFAGS_CMS;
const SHA=(()=>{const K=[];let n=2,c=0;const isP=x=>{for(let i=2;i*i<=x;i++)if(x%i===0)return false;return true};while(c<64){if(isP(n)){K[c++]=(Math.pow(n,1/3)%1)*4294967296|0}n++}
 return function(str){const b=new TextEncoder().encode(str),l=b.length,w=new Array(64),len=((l+9+63)>>6)<<6,m=new Uint8Array(len);m.set(b);m[l]=0x80;const dv=new DataView(m.buffer),bits=l*8;dv.setUint32(len-4,bits>>>0);dv.setUint32(len-8,Math.floor(bits/4294967296));
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  for(let o=0;o<len;o+=64){for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);for(let i=16;i<64;i++){const a=w[i-15],q=w[i-2];w[i]=(w[i-16]+(((a>>>7)|(a<<25))^((a>>>18)|(a<<14))^(a>>>3))+w[i-7]+(((q>>>17)|(q<<15))^((q>>>19)|(q<<13))^(q>>>10)))|0}
   let [A,B,Cc,Dd,E,F,G,Hh]=H;for(let i=0;i<64;i++){const t1=(Hh+(((E>>>6)|(E<<26))^((E>>>11)|(E<<21))^((E>>>25)|(E<<7)))+((E&F)^(~E&G))+K[i]+w[i])|0,t2=((((A>>>2)|(A<<30))^((A>>>13)|(A<<19))^((A>>>22)|(A<<10)))+((A&B)^(A&Cc)^(B&Cc)))|0;Hh=G;G=F;F=E;E=(Dd+t1)|0;Dd=Cc;Cc=B;B=A;A=(t1+t2)|0}
   H=[(H[0]+A)|0,(H[1]+B)|0,(H[2]+Cc)|0,(H[3]+Dd)|0,(H[4]+E)|0,(H[5]+F)|0,(H[6]+G)|0,(H[7]+Hh)|0]}
  return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('')}})();
const ITER=5000;
const hashPw=(pw,salt)=>{let h=SHA(salt+':'+pw);for(let i=1;i<ITER;i++)h=SHA(h+salt);return h};
const sameStr=(a,b)=>{if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0};
function credOf(k){const o=(store.get('afags_pw')||{})[k];return o||ACCOUNTS[k].cred}
function checkPw(k,pw){const c=credOf(k);return !!c&&sameStr(hashPw(pw,c.s),c.h)}
function secCfg(){return Object.assign({idle:15,demo:true},store.get('afags_sec')||{})}
function audit(a,d){CMS.audit(a,d)}
/* lockout persists across reloads, escalating 30 s → 2 min → 10 min */
function lockState(){return Object.assign({f:0,until:0,lvl:0},store.get('afags_lock')||{})}
function failLogin(u){const L=lockState();L.f++;audit('login-failed',u);if(L.f>=5){L.lvl=Math.min(L.lvl+1,3);L.until=Date.now()+[0,30,120,600][L.lvl]*1000;L.f=0}store.set('afags_lock',L);return L}
/* session: token + idle timeout */
function newSession(k){const tok=Array.from(crypto.getRandomValues(new Uint8Array(16))).map(x=>x.toString(16).padStart(2,'0')).join('');store.sset('afags_session',{user:k,at:Date.now(),last:Date.now(),tok});audit('login',k)}
function sessionValid(s){if(!s||!ACCOUNTS[s.user])return false;const idle=secCfg().idle*60000;return Date.now()-(s.last||s.at)<idle&&Date.now()-s.at<8*3600000}
let lastTouch=0;function touch(){const now=Date.now();if(now-lastTouch<10000)return;lastTouch=now;const s=store.sget('afags_session');if(s&&ME){s.last=now;store.sset('afags_session',s)}}
['click','keydown','scroll','touchstart','mousemove'].forEach(ev=>addEventListener(ev,touch,{passive:true}));
let warnEl=null;setInterval(()=>{if(!ME)return;const s=store.sget('afags_session');if(!sessionValid(s)){warnEl&&warnEl.remove();warnEl=null;logout('Your session expired. Please sign in again.');return}
  const left=secCfg().idle*60000-(Date.now()-(s.last||s.at));
  if(left<60000&&!warnEl){warnEl=document.createElement('div');warnEl.className='md';warnEl.innerHTML=`<div class="md-c" style="max-width:420px;text-align:center"><h3 style="font:800 22px var(--cond);color:var(--navy);text-transform:uppercase">Still there?</h3><p style="color:#3d4660;margin:8px 0 16px">For security you will be signed out in about a minute because of inactivity.</p><div style="display:flex;gap:10px"><button class="btn ghost" style="flex:1" data-o>Sign out</button><button class="btn pri" style="flex:1" data-s>Stay signed in</button></div></div>`;
   document.body.appendChild(warnEl);warnEl.querySelector('[data-s]').onclick=()=>{lastTouch=0;touch();warnEl.remove();warnEl=null};warnEl.querySelector('[data-o]').onclick=()=>{warnEl.remove();warnEl=null;logout()}}},5000);

/* ---------- themes (website + admin) ---------- */
const THEMES=[['liquid','Liquid Glass','iOS-style glass with light-catching edges and glossy app icons'],['glass','Glassmorphism','Vibrant colour background with clear frosted panels'],['spatial','Spatial UI','visionOS-style floating windows with real depth and shadows']];
function applyAdminTheme(t){document.documentElement.dataset.theme=THEMES.some(x=>x[0]===t)?t:'liquid'}
applyAdminTheme(CMS.theme('site'));
addEventListener('storage',e=>{if(e.key==='afags_theme_site'||e.key==='afags_theme_admin')applyAdminTheme(CMS.theme('site'))});

/* ---------- messages from the website ---------- */
function checkOpenReg(){let t=null;try{t=sessionStorage.getItem('afags_openreg');sessionStorage.removeItem('afags_openreg')}catch(e){}if(t&&FORMS[t]&&!WZ)openWizard(t)}
addEventListener('message',e=>{const d=e.data||{};if(d.afags==='openReg')checkOpenReg()});
setTimeout(checkOpenReg,300);
window.AFAGS_FORMS=FORMS;

/* ---------- helpers ---------- */
const kb=n=>n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
function lsUsage(){let t=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);t+=(k.length+(localStorage.getItem(k)||'').length)*2}}catch(e){}return t}
function sniffType(file){return file.slice(0,8).arrayBuffer().then(b=>{const h=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');return h.startsWith('25504446')?'application/pdf':h.startsWith('89504e47')?'image/png':h.startsWith('ffd8ff')?'image/jpeg':''})}
function readAsData(f){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)})}
const WEBP=(()=>{try{const c=document.createElement('canvas');c.width=c.height=1;return c.toDataURL('image/webp').startsWith('data:image/webp')}catch(e){return false}})();
function shrinkImage(dataUrl,max=1200,q=.8,png){return new Promise(r=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k|0;c.height=im.height*k|0;c.getContext('2d').drawImage(im,0,0,c.width,c.height);r(WEBP?c.toDataURL('image/webp',png?.85:q):png?c.toDataURL('image/png'):c.toDataURL('image/jpeg',q))};im.onerror=()=>r('');im.src=dataUrl})}
function goWebsite(hash){if(window.parent!==window){try{parent.postMessage({afags:'goto',hash},'*');return}catch(e){}}window.open('afags-website.html'+hash,'_blank','noopener')}
function dlCSV(rows,name){const t=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+t],{type:'text/csv'}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast('Downloaded '+name)}
function mdOpen(html,wide){const m=document.createElement('div');m.className='md';m.innerHTML=`<div class="md-c${wide?' wide':''}" style="${wide?'':'max-width:560px'}"><button class="md-x" aria-label="Close" style="position:absolute;right:16px;top:16px">✕</button>${html}</div>`;m.querySelector('.md-c').style.position='relative';document.body.appendChild(m);const close=()=>m.remove();m.querySelector('.md-x').onclick=close;m.onclick=e=>{if(e.target===m)close()};return {m,close}}
const fmtDs=s=>{if(!s)return '—';const [y,mo,d]=String(s).split('-').map(Number);return y?new Date(y,mo-1,d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):esc(s)};

/* ================= WEBSITE CMS ================= */
const CMS_ROUTE={disciplines:'#/sport/fencing',fencers:'#/fencers/profiles',news:'#/media/news',circulars:'#/about/circulars',tenders:'#/about/tenders',docs:'#/about/constitution',events:'#/calendar/all',results:'#/results/state',achievers:'#/fencers/achievers',gallery:'#/media/photos',videos:'#/media/videos',careers:'#/media/career'};
function itemTitle(c,it){return it.title||it.event||it.name||it.album||'—'}
function itemSub(c,it){return ({disciplines:[it.weapon,it.caption],fencers:[it.weapon,it.category,it.district,it.rank&&('rank '+it.rank),it.show==='No'?'hidden':''],news:[fmtDs(it.date),it.cat],circulars:[it.no,fmtDs(it.date)],tenders:[it.ref,'last date '+fmtDs(it.lastDate)],docs:[it.cat,it.year],events:[fmtDs(it.start),it.venue,it.level],results:[fmtDs(it.date),it.weapon,it.category],achievers:[it.achievement,it.year],gallery:[it.caption,fmtDs(it.date)],videos:[it.url],careers:[it.loc,it.type,'apply by '+fmtDs(it.lastDate)]}[c]||[]).filter(x=>x&&x!=='—').map(esc).join(' · ')}
function newsBadge(it){if(it.sample)return '<span class="st Pending">Sample</span>';const st=it.status||'Published';if(st==='Draft')return '<span class="st" style="background:#eef2f8;color:#5c6680">Draft</span>';if(st==='Pending approval')return '<span class="st Pending">Pending approval</span>';const t=Date.parse(it.publishAt||'');return (t&&t>Date.now()?`<span class="st Verified">Scheduled · ${new Date(t).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>`:'<span class="st Approved">Published</span>')+(it.pin==='Yes'?' <span class="st New">📌</span>':'')+(it.breaking==='Yes'?' <span class="st Rejected">Breaking</span>':'')}
function shareNews(it){const base=(CMS.site().siteUrl||'').replace(/\/?$/,'/');const url=(base.length>1?base:'')+'#/media/news/'+encodeURIComponent(it.id),txt=it.title+' — AFAGS';
  mdOpen(`<h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Share this news</h3><p class="sd">${esc(it.title)}</p>${base.length>1?'':'<div class="alert e" style="animation:none">Add the website address in Settings › Website details so shared links open the site.</div>'}<div class="sheet"><a class="btn ghost" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent(txt+' '+url)}">🟢 WhatsApp</a><a class="btn ghost" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">🔵 Facebook</a><a class="btn ghost" target="_blank" rel="noopener noreferrer" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}">⚫ X (Twitter)</a><button class="btn ghost" id="shCopy">📋 Copy link</button></div><p class="sd" style="margin-top:10px">On the AFAGS server, new news can also be posted automatically to your social channels through the SOCIAL_WEBHOOK_URL setting (Zapier / Make).</p>`).m.querySelector('#shCopy').onclick=()=>{try{navigator.clipboard.writeText(url).then(()=>toast('Link copied'),()=>toast(url))}catch(e){toast(url)}}}
function viewCMS(c,only){const S=CMS.SCHEMA;if(!S[c])c=only||'news';if(!ME.canApprove&&!only){c='news';only='cms'}const L=CMS.get(c),use=lsUsage();
  $('#main').innerHTML=crumb(only?LABEL[only]:'Website CMS',`${S[c].label} · ${L.length} item${L.length===1?'':'s'}`)+
  `${only?'':`<div class="cms-tabs">${Object.entries(S).map(([k,v])=>`<a href="#cms?c=${k}" class="${k===c?'on':''}">${v.label}<i>${CMS.get(k).length}</i></a>`).join('')}</div>`}
   <div class="cms-bar"><div><b>${S[c].label}</b><small>${CMS.isCustom(c)?'Published from the CMS':'Showing the sample content — add or edit items to publish your own'} · storage used ${kb(use)} of ~5 MB</small></div>
    <button class="btn ghost" id="cmsView">View on website ↗</button>${CMS.isCustom(c)?'<button class="btn ghost" id="cmsReset">Reset to sample</button>':''}<button class="btn nav" id="cmsAdd">+ Add ${S[c].label.replace(/s$/,'').replace(/ies$/,'y')}</button></div>
   ${use>4.2*1048576?'<div class="alert e" style="animation:none">Browser storage is almost full. Use smaller images or remove old items.</div>':''}
   <div class="tblw">${L.length?`<table class="tbl"><thead><tr><th>Item</th><th class="hm">Details</th><th>Status</th><th>Action</th></tr></thead><tbody>${L.map((it,i)=>`<tr><td><b>${esc(itemTitle(c,it))}</b></td><td class="hm"><small>${itemSub(c,it)}</small></td><td>${c==='news'?newsBadge(it):it.sample?'<span class="st Pending">Sample</span>':'<span class="st Approved">Published</span>'}${(it.file&&it.file.data)||(it.img&&String(it.img).startsWith('data:'))||(it.image&&String(it.image).startsWith('data:'))||(it.photo&&String(it.photo).startsWith('data:'))?' <span class="st New">📎</span>':''}</td><td><div class="act">${c==='news'&&ME.canApprove&&it.status==='Pending approval'?`<button class="ok" data-apv="${i}">Approve</button>`:''}${c==='news'&&CMS.newsVisible(it)&&!it.sample?`<button class="vw" data-shr="${i}">Share</button>`:''}<button class="vw" data-ed="${i}">Edit</button>${ME.canApprove||(it.author===ME.key&&it.status!=='Published')?`<button class="no" data-del="${i}">Delete</button>`:''}</div></td></tr>`).join('')}</tbody></table>`:'<div class="empty">No items yet. Click “Add” to publish the first one.</div>'}</div>`;
  $('#cmsAdd').onclick=()=>cmsEdit(c,-1,only);$('#cmsView').onclick=()=>goWebsite(CMS_ROUTE[c]||'#/');
  const rb=$('#cmsReset');rb&&(rb.onclick=()=>confirmBox({title:'Reset to sample content?',body:`All published ${esc(S[c].label.toLowerCase())} will be removed and the sample items restored.`,ok:'Reset',tone:'no',reason:0},()=>{CMS.reset(c);audit('cms-reset',c);toast('Reset to sample');route()}));
  $$('#main [data-ed]').forEach(b=>b.onclick=()=>cmsEdit(c,+b.dataset.ed,only));
  $$('#main [data-apv]').forEach(b=>b.onclick=()=>{const it=L[+b.dataset.apv];it.status='Published';CMS.set(c,L);audit('cms-edit','news approved: '+itemTitle(c,it));toast('Approved — now on the website');route()});
  $$('#main [data-shr]').forEach(b=>b.onclick=()=>shareNews(L[+b.dataset.shr]));
  $$('#main [data-del]').forEach(b=>b.onclick=()=>{const it=L[+b.dataset.del];confirmBox({title:'Delete this item?',body:`<b>${esc(itemTitle(c,it))}</b> will be removed from the website.`,ok:'Delete',tone:'no'},()=>{L.splice(+b.dataset.del,1);if(!CMS.set(c,L)){toast('Could not save — storage full');return}audit('cms-delete',c+': '+itemTitle(c,it));toast('Deleted');route()})})}
function cmsEdit(c,idx,only){const S=CMS.SCHEMA[c],L=CMS.get(c),it=idx>=0?Object.assign({},L[idx]):{id:c.slice(0,2)+Date.now().toString(36),...(c==='fencers'?{show:'Yes',order:''}:{}),...(c==='news'?{status:ME.canApprove?'Published':'Pending approval',pin:'No',breaking:'No',author:ME.key,date:new Date().toISOString().slice(0,10)}:{})},files={};if(c==='news'&&!ME.canApprove&&idx>=0&&(it.author!==ME.key||it.status==='Published')){toast('District logins can edit only their own news that is waiting for approval');return}
  const fld=([k,l,t,req,opts])=>{const v=it[k]??'';const R=req?'<b class="rq">*</b>':'';
    if(t==='textarea')return `<label class="cf w1">${l}${R}<textarea name="${k}" rows="${k==='body'||k==='desc'?6:3}" maxlength="${k==='body'?6000:1200}">${esc(v)}</textarea></label>`;
    if(t==='select'&&c==='news'&&k==='status'&&!ME.canApprove)return `<label class="cf">${l}<input name="status" value="Pending approval" readonly></label>`;
    if(t==='select')return `<label class="cf">${l}${R}<select name="${k}"><option value="">Select…</option>${opts.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`;
    if(t==='image'||t==='file'){const cur=t==='image'?(String(v).startsWith('data:')?`<img src="${v}" alt="">`:String(v).startsWith('dom:')?'<span>Site image</span>':''):(v&&v.data?`<span>📎 ${esc(v.name)} (${kb(v.size)})</span>`:'');
      return `<div class="cf w1"><label>${l}${R}</label><div class="cf-file"><div class="cf-prev" id="pv_${k}">${cur||'<span>No file</span>'}</div><input type="file" name="${k}" accept="${t==='image'?'image/png,image/jpeg':'application/pdf,image/png,image/jpeg'}">${cur?`<button type="button" class="link" data-clr="${k}">Remove</button>`:''}</div><small class="cf-n">${t==='image'?'JPG or PNG — resized automatically':'PDF, JPG or PNG up to 1.5 MB'}</small></div>`}
    return `<label class="cf${k==='title'||k==='event'||k==='url'||k==='achievement'?' w1':''}">${l}${R}<input name="${k}" type="${t==='date'?'date':t==='datetime'?'datetime-local':t==='url'?'url':'text'}" value="${esc(v)}" maxlength="${t==='url'?300:200}"></label>`};
  const {m,close}=mdOpen(`<form class="cms-f" novalidate><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy);margin-bottom:12px">${idx>=0?'Edit':'Add'} — ${S.label}</h3><div class="cf-g">${S.fields.map(fld).join('')}</div><div id="cfErr"></div><div style="display:flex;gap:10px;margin-top:16px"><button type="button" class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" style="flex:1.4">${idx>=0?'Save changes':'Publish'}</button></div></form>`,true);
  const f=m.querySelector('form');m.querySelector('[data-c]').onclick=close;
  m.querySelectorAll('[data-clr]').forEach(b=>b.onclick=()=>{files[b.dataset.clr]=null;m.querySelector('#pv_'+b.dataset.clr).innerHTML='<span>Removed</span>'});
  f.querySelectorAll('input[type=file]').forEach(inp=>inp.onchange=async()=>{const file=inp.files[0];if(!file)return;const k=inp.name,isImg=S.fields.find(x=>x[0]===k)[2]==='image',real=await sniffType(file);
    if(!real||(isImg&&real==='application/pdf')){toast('Only genuine '+(isImg?'JPG/PNG images':'PDF, JPG or PNG files')+' are allowed');inp.value='';return}
    let data=await readAsData(file);if(real.startsWith('image/'))data=(c==='fencers'||c==='disciplines')&&real==='image/png'?await shrinkImage(data,720,.8,1):await shrinkImage(data,isImg?1000:1400,.76);
    if(!isImg&&data.length>1.5*1048576*1.37){toast('File is larger than 1.5 MB');inp.value='';return}
    files[k]=isImg?data:{name:file.name.replace(/[^\w.\- ]+/g,'_').slice(0,80),size:file.size,type:real,data};
    m.querySelector('#pv_'+k).innerHTML=isImg?`<img src="${data}" alt="">`:`<span>📎 ${esc(file.name)} (${kb(file.size)})</span>`});
  f.onsubmit=e=>{e.preventDefault();const out=Object.assign({},it),bad=[];
    S.fields.forEach(([k,l,t,req])=>{if(t==='image'||t==='file'){if(k in files)out[k]=files[k]||'';if(req&&!out[k])bad.push(l);return}
      let v=String(f.elements[k].value||'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').trim();if(req&&!v)bad.push(l);
      if(t==='url'&&v&&!/^https:\/\/(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)\//.test(v))bad.push(l+' (must be a YouTube https link)');out[k]=v});
    if(c==='events'&&out.end&&out.start&&out.end<out.start)bad.push('End date must be after start date');
    if(bad.length){m.querySelector('#cfErr').innerHTML=`<div class="alert e" style="animation:none;margin-top:12px">Please check: ${bad.map(esc).join(', ')}</div>`;return}
    delete out.sample;const arr=CMS.get(c);if(idx>=0)arr[idx]=out;else arr.unshift(out);
    if(!CMS.set(c,arr)){m.querySelector('#cfErr').innerHTML='<div class="alert e" style="animation:none;margin-top:12px">Browser storage is full. Use a smaller image/file or delete old items.</div>';return}
    audit(idx>=0?'cms-edit':'cms-add',c+': '+itemTitle(c,out));close();toast(idx>=0?'Saved — live on the website':'Published — live on the website');route()}}

/* ================= INBOX ================= */
const IBT={contact:'Contact',grievance:'Grievance / RTI',career:'Career',donation:'Donation pledge',newsletter:'Newsletter'};
function inboxNew(){return CMS.inbox().filter(x=>x.status==='New').length}
function viewInbox(q){const t=new URLSearchParams(q||'').get('t')||'',all=CMS.inbox(),L=all.filter(x=>!t||x.type===t);
  $('#main').innerHTML=crumb('Inbox',`${inboxNew()} new`)+`<div class="lv-h"><div class="tabs">${[['','All'],...Object.entries(IBT)].map(([k,l])=>`<button data-t="${k}" class="${k===t?'on':''}">${l}<i>${all.filter(x=>!k||x.type===k).length}</i></button>`).join('')}</div><button class="btn ghost" style="height:42px;font-size:12px" id="ibCsv">⬇ CSV</button></div>
  <div class="tblw">${L.length?`<table class="tbl"><thead><tr><th>From</th><th class="hm">Type</th><th class="hm">Subject</th><th class="hm">Received</th><th>Status</th></tr></thead><tbody>${L.map(x=>`<tr class="ibr${x.status==='New'?' nw':''}" data-ib="${esc(x.id)}" tabindex="0"><td><b>${esc(x.name||x.email||'—')}</b><small style="display:block;color:var(--mu)">${esc(x.id)}</small></td><td class="hm">${IBT[x.type]||esc(x.type)}</td><td class="hm">${esc(x.subject||x.kind||x.job||x.purpose||'')}${x.amount?' · ₹'+esc(x.amount):''}</td><td class="hm">${fmt(x.at)}</td><td><span class="st ${x.status==='Resolved'?'Approved':x.status==='New'?'New':'Pending'}">${esc(x.status)}</span></td></tr>`).join('')}</tbody></table>`:'<div class="empty">📭 No messages yet. Website forms (contact, grievance, career, donation, newsletter) arrive here.</div>'}</div>`;
  $$('#main .tabs button').forEach(b=>b.onclick=()=>location.hash='#inbox'+(b.dataset.t?'?t='+b.dataset.t:''));
  $('#ibCsv').onclick=()=>dlCSV([['Reference','Type','Name','Email','Phone','Subject','Message','Status','Received'],...L.map(x=>[x.id,IBT[x.type]||x.type,x.name,x.email,x.phone,x.subject||x.kind||x.job||x.purpose,x.message||(x.amount?'₹'+x.amount:''),x.status,fmt(x.at)])],'afags-inbox.csv');
  $$('#main [data-ib]').forEach(r=>{const op=()=>ibOpen(r.dataset.ib);r.onclick=op;r.onkeydown=e=>{if(e.key==='Enter')op()}})}
function ibOpen(id){const all=CMS.inbox(),x=all.find(y=>y.id===id);if(!x)return;if(x.status==='New'){x.status='Read';CMS.setInbox(all);buildMenu()}
  const rows=Object.entries(x).filter(([k])=>!['id','type','at','status','reply','file','website'].includes(k)).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  const {m,close}=mdOpen(`<div class="dview"><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">${IBT[x.type]||esc(x.type)}</h3><p style="color:var(--mu);font-size:13px;margin-bottom:12px">${esc(x.id)} · ${fmt(x.at)}</p><dl>${rows}</dl>
   ${x.file?`<div class="doc" style="margin-top:12px"><i class="pdf">${x.file.type==='application/pdf'?'PDF':'IMG'}</i><span><b>${esc(x.file.name)}</b><small>${kb(x.file.size)}</small></span>${x.file.data?'<button class="btn ghost" style="height:36px;margin-left:auto" id="ibF">Download</button>':''}</div>`:''}
   <label style="display:block;margin-top:16px;font-size:12.5px;font-weight:600">Status<select id="ibS" style="width:100%;height:42px;border-radius:12px;border:1.5px solid #dbe3f0;margin-top:4px">${['New','Read','In progress','Resolved'].map(s=>`<option ${s===x.status?'selected':''}>${s}</option>`).join('')}</select></label>
   <label style="display:block;margin-top:10px;font-size:12.5px;font-weight:600">Reply / note ${x.type==='grievance'?'(visible to the person when they track this request)':''}<textarea id="ibR" rows="3" maxlength="1500" style="width:100%;border-radius:12px;border:1.5px solid #dbe3f0;margin-top:4px;padding:10px;font:inherit">${esc(x.reply||'')}</textarea></label>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${x.email?`<a class="btn ghost" style="height:42px" href="mailto:${encodeURIComponent(x.email)}?subject=${encodeURIComponent('Re: '+(x.subject||IBT[x.type]||'AFAGS')+' ['+x.id+']')}">✉ Reply by email</a>`:''}<button class="btn" style="height:42px;background:linear-gradient(180deg,#ff7a7a,#e5323a)" id="ibD">Delete</button><button class="btn nav" style="height:42px;margin-left:auto" id="ibSave">Save</button></div></div>`);
  const fb=m.querySelector('#ibF');fb&&(fb.onclick=()=>{if(/^private\//.test(x.file.data)){fb.dataset.pf=x.file.data;return}const a=document.createElement('a');a.href=x.file.data;a.download=x.file.name;document.body.appendChild(a);a.click();a.remove()});
  m.querySelector('#ibSave').onclick=()=>{x.status=m.querySelector('#ibS').value;x.reply=m.querySelector('#ibR').value.trim().slice(0,1500);CMS.setInbox(all);audit('inbox-update',x.id+' → '+x.status);close();toast('Saved');buildMenu();route()};
  m.querySelector('#ibD').onclick=()=>{close();confirmBox({title:'Delete message?',body:`${esc(x.id)} will be permanently removed.`,ok:'Delete',tone:'no'},()=>{CMS.setInbox(all.filter(y=>y.id!==id));audit('inbox-delete',id);toast('Deleted');buildMenu();route()})}}

/* ================= AUDIT LOG ================= */
const ALBL={login:'Signed in','login-failed':'Failed sign-in',logout:'Signed out',approve:'Approved',reject:'Rejected','cms-add':'CMS: added','cms-edit':'CMS: edited','cms-delete':'CMS: deleted','cms-reset':'CMS: reset','inbox-update':'Inbox updated','inbox-delete':'Inbox deleted','settings':'Settings changed','password':'Password changed','theme':'Theme changed','website-form':'Website form','backup':'Data backup','restore':'Data restored','reset-data':'Demo data reset'};
function viewAudit(){const L=CMS.auditLog();
  $('#main').innerHTML=crumb('Audit Log',L.length+' entries')+`<div class="acc-int"><div><b>Security audit trail</b><span>Every sign-in, failed attempt, approval, rejection, CMS change and settings change is recorded here (latest 500).</span></div></div><div class="lv-h"><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="auQ" placeholder="Filter by action, user or detail" aria-label="Filter"></label><button class="btn ghost" style="height:42px;font-size:12px" id="auCsv">⬇ CSV</button></div><div class="tblw" id="auB"></div>`;
  const draw=()=>{const q=$('#auQ').value.toLowerCase(),R=L.filter(x=>!q||(x.a+' '+(ALBL[x.a]||'')+' '+x.who+' '+x.d).toLowerCase().includes(q)).slice(0,300);
    $('#auB').innerHTML=R.length?`<table class="tbl"><thead><tr><th>When</th><th>Action</th><th class="hm">User</th><th class="hm">Detail</th></tr></thead><tbody>${R.map(x=>`<tr><td style="white-space:nowrap">${new Date(x.at).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td><td><span class="st ${/fail|delete|reject|reset/.test(x.a)?'Rejected':/login|approve|add/.test(x.a)?'Approved':'Pending'}">${esc(ALBL[x.a]||x.a)}</span></td><td class="hm">${esc(x.who)}</td><td class="hm"><small>${esc(x.d)}</small></td></tr>`).join('')}</tbody></table>`:'<div class="empty">No entries.</div>'};
  $('#auQ').oninput=draw;draw();$('#auCsv').onclick=()=>dlCSV([['When','Action','User','Detail'],...L.map(x=>[new Date(x.at).toISOString(),ALBL[x.a]||x.a,x.who,x.d])],'afags-audit-log.csv')}

/* ================= CERTIFICATES ================= */
function viewCerts(){const L=memberKeys().flatMap(k=>rows(k).filter(r=>r.status==='Approved').map(r=>({...r,k}))).sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0)||(b.approvedAt||0)-(a.approvedAt||0));
  $('#main').innerHTML=crumb('Certificates',L.length.toLocaleString('en-IN')+' accredited')+`<div class="acc-int"><div><b>Accreditation certificates</b><span>Generate and print an official certificate of registration for any accredited member.</span></div></div><div class="lv-h"><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="ceQ" placeholder="Search name, AFAGS ID or district" aria-label="Search"></label></div><div class="tblw" id="ceB"></div>`;
  const draw=()=>{const q=$('#ceQ').value.toLowerCase(),R=L.filter(r=>!q||(r.name+(r.afagsId||'')+r.district).toLowerCase().includes(q)).slice(0,60);
    $('#ceB').innerHTML=R.length?`<table class="tbl"><thead><tr><th>Member</th><th class="hm">AFAGS ID</th><th class="hm">Type</th><th>Action</th></tr></thead><tbody>${R.map(r=>`<tr><td><div class="nm">${av(r)}<div><b>${esc(r.name)}</b><small>${esc(r.district)}</small></div></div></td><td class="hm"><span class="aid">${esc(r.afagsId||'')}</span></td><td class="hm">${META[r.k][1]}</td><td><button class="btn nav" style="height:34px;font-size:11px;padding:0 12px" data-ce="${esc(r.id)}">🎓 Certificate</button></td></tr>`).join('')}</tbody></table><p style="font-size:12px;color:var(--mu);padding:10px 14px">Showing up to 60 — search to find others.</p>`:'<div class="empty">No accredited members found.</div>';
    $$('#ceB [data-ce]').forEach(b=>b.onclick=()=>certOpen(b.dataset.ce))};$('#ceQ').oninput=draw;draw()}
function certOpen(id){const [r,k]=findRec(id);if(!r)return;const S=new Date().getFullYear();
  const cert=`<div class="cert" id="certCard"><div class="cert-b"><span class="logo cert-l"></span><small>AMATEUR FENCING ASSOCIATION OF GUJARAT STATE</small><em>Affiliated to the Fencing Association of India</em><h2>Certificate of Accreditation</h2><p>This is to certify that</p><h3>${esc(r.name)}</h3><p>is a duly accredited <b>${META[k][1]}</b> of the Amateur Fencing Association of Gujarat State${r.district?` from <b>${esc(r.district)}</b>`:''}${r.weapon&&r.weapon!=='—'?`, in the weapon <b>${esc(r.weapon)}</b>`:''}, for the season <b>${S}–${String(S+1).slice(2)}</b>.</p>
   <div class="cert-id">AFAGS ID · <b>${esc(r.afagsId||'')}</b></div><div class="cert-qr">${qrSVG(r.afagsId,78)}<small>Scan to verify</small></div><div class="cert-s"><div><i></i><b>Mukeshbhai Chaudhari</b><small>President</small></div><div class="cert-seal">AFAGS<br><small>${S}</small></div><div><i></i><b>Bharatji Thakor</b><small>Secretary General</small></div></div>
   <p class="cert-f">Issued on ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} · Verify at the AFAGS office quoting the AFAGS ID</p></div></div>`;
  const {m}=mdOpen(cert+`<div style="display:flex;gap:10px;justify-content:center;margin-top:14px"><button class="btn nav" id="cePr">🖨 Print / Save as PDF</button></div>`,true);
  m.querySelector('#cePr').onclick=()=>{document.body.classList.add('printing');const c=m.querySelector('#certCard').cloneNode(true);c.id='idPrint';c.classList.add('cert-print');document.body.appendChild(c);setTimeout(()=>{window.print();c.remove();document.body.classList.remove('printing')},60)}}

/* ================= REPORTS ================= */
function viewReports(){const K=memberKeys(),apps=store.get('afags_apps')||[],fees=apps.filter(a=>a.payment&&(!scope||a.district===scope)).reduce((s,a)=>s+(+a.payment.amount||0),0),ib=CMS.inbox();
  const byDist={};rows('fencers').forEach(r=>{byDist[r.district]=(byDist[r.district]||0)+1});const top=Object.entries(byDist).sort((a,b)=>b[1]-a[1]).slice(0,10),mx=top[0]?top[0][1]:1;
  const months=[];const now=new Date();for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push([d,K.reduce((s,k)=>s+rows(k).filter(r=>r.date&&r.date.getFullYear()===d.getFullYear()&&r.date.getMonth()===d.getMonth()).length,0)])}const mm=Math.max(1,...months.map(x=>x[1]));
  $('#main').innerHTML=crumb('Reports',scope?scope+' district':'All Gujarat')+`<div class="stats">${[['Total members',K.reduce((s,k)=>s+cnt(k),0),'all'],['Accredited',K.reduce((s,k)=>s+cnt(k,'Approved'),0),'ap'],['Pending',K.reduce((s,k)=>s+cnt(k,'Pending'),0),'pe'],['Fees collected (online)','₹'+fees.toLocaleString('en-IN'),'ap']].map(([l,n,c])=>`<div class="sc" style="cursor:default;opacity:1"><span><small>${l}</small><b>${typeof n==='number'?n.toLocaleString('en-IN'):n}</b></span><span class="ico ${c==='all'?'':c}">${SVGI[c]}</span></div>`).join('')}</div>
  <div class="cards2"><div class="panel"><h4>Registrations — last 6 months</h4><div class="chart">${months.map(([d,n])=>`<div><i style="--h:${n/mm*100}%"></i><b>${n}</b><small>${d.toLocaleDateString('en-IN',{month:'short'})}</small></div>`).join('')}</div></div>
   <div class="panel"><h4>Fencers by district (top 10)</h4><div class="bars">${top.map(([d,n])=>`<div class="bar"><label><span>${esc(d)}</span><span>${n}</span></label><div class="t"><i style="--w:${n/mx*100}%;background:linear-gradient(90deg,#f47b20,#1f8f3f)"></i></div></div>`).join('')}</div></div></div>
  <div class="panel" style="margin-top:18px"><h4>Downloads</h4><div style="display:flex;gap:8px;flex-wrap:wrap">${K.map(k=>`<button class="btn ghost" style="height:40px;font-size:12px" data-rp="${k}">⬇ ${META[k][0]} (CSV)</button>`).join('')}${ME.canApprove?`<button class="btn ghost" style="height:40px;font-size:12px" id="rpIb">⬇ Inbox (${ib.length})</button><button class="btn ghost" style="height:40px;font-size:12px" id="rpFee">⬇ Fee payments</button>`:''}</div></div>`;
  requestAnimationFrame(()=>setTimeout(()=>{$$('#main .bar .t i').forEach(i=>i.style.width=i.style.getPropertyValue('--w'));$$('#main .chart i').forEach(i=>i.style.height=i.style.getPropertyValue('--h'))},60));
  $$('#main [data-rp]').forEach(b=>b.onclick=()=>{const k=b.dataset.rp;dlCSV([['Reference','AFAGS ID','Name','District','Weapon','Category','Status','Applied'],...rows(k).map(r=>[r.id,r.status==='Approved'?r.afagsId||'':'',r.name,r.district,r.weapon,r.cat,r.status,fmt(r.date)])],`afags-${k}-report.csv`)});
  const ri=$('#rpIb');ri&&(ri.onclick=()=>dlCSV([['Reference','Type','Name','Email','Status','Received'],...ib.map(x=>[x.id,x.type,x.name,x.email,x.status,fmt(x.at)])],'afags-inbox.csv'));
  const rf=$('#rpFee');rf&&(rf.onclick=()=>dlCSV([['Reference','Name','Amount','Payment ID','Method','Paid on'],...apps.filter(a=>a.payment).map(a=>[a.ref,a.name,a.payment.amount,a.payment.txn,a.payment.method,fmt(a.payment.at)])],'afags-fee-payments.csv'))}

/* ================= SETTINGS ================= */
function pwStrength(p){let s=0;if(p.length>=10)s++;if(p.length>=14)s++;if(/[a-z]/.test(p)&&/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s}
function viewSettings(){const admin=ME.canApprove,site=CMS.site(),sec=secCfg(),tS=CMS.theme('site'),tA=CMS.theme('admin');
  const tCards=(which,cur)=>`<div class="thm">${THEMES.map(([k,n,d])=>`<button type="button" class="thm-c t-${k}${k===cur?' on':''}" data-th="${which}:${k}"><span class="thm-p"><i></i><i></i><i></i></span><b>${n}</b><small>${d}</small>${k===cur?'<em>✓ Active</em>':''}</button>`).join('')}</div>`;
  $('#main').innerHTML=crumb('Settings')+`
  ${admin?`<div class="panel"><h4>🎨 Site theme</h4><p class="sd">One theme for the whole site — the public website and this admin portal change together. Only the Super Admin can change it.</p>${tCards('all',tS)}</div>`:''}
  <div class="cards2" style="grid-template-columns:1fr 1fr">
   <form class="panel" id="pwF" novalidate><h4>🔐 Change password</h4><label class="sf">Current password<input type="password" id="pw0" autocomplete="current-password" required></label><label class="sf">New password<input type="password" id="pw1" autocomplete="new-password" required></label><div class="pwm"><i id="pwBar"></i></div><small class="sd" id="pwTip">At least 10 characters with upper & lower case, a number and a symbol.</small><label class="sf">Confirm new password<input type="password" id="pw2" autocomplete="new-password" required></label><div id="pwMsg"></div><button class="btn nav" style="margin-top:10px">Update password</button></form>
   ${admin?`<form class="panel" id="secF"><h4>🛡 Security</h4><label class="sf">Sign out after inactivity<select id="sIdle">${[5,15,30,60].map(n=>`<option value="${n}" ${n===sec.idle?'selected':''}>${n} minutes</option>`).join('')}</select></label>
    <label class="sw2"><input type="checkbox" id="sDemo" ${sec.demo?'checked':''}><span></span>Show one-tap demo login on the sign-in page</label>
    <ul class="secl"><li>✓ Passwords stored as salted SHA-256 hashes (${ITER.toLocaleString('en-IN')} rounds), never in plain text</li><li>✓ Login locks after 5 failed attempts (30 s → 2 min → 10 min)</li><li>✓ Security code (captcha) on every sign-in</li><li>✓ Content-Security-Policy blocks unknown scripts</li><li>✓ Uploaded files checked by their real file signature</li><li>✓ All admin actions written to the Audit Log</li></ul>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn nav">Save security settings</button><button type="button" class="btn ghost" id="sUnlock">Clear login lock</button></div></form>`:''}</div>
  ${admin?`<form class="panel" id="siteF" style="margin-top:18px" novalidate><h4>🌐 Website contact details & social links</h4><div class="cf-g">${[['siteUrl','Website address (for QR codes)'],['address','Office address'],['email','Email'],['phone','Phone'],['hours','Office hours'],['facebook','Facebook URL'],['instagram','Instagram URL'],['x','X (Twitter) URL'],['youtube','YouTube URL']].map(([k,l])=>`<label class="cf">${l}<input name="${k}" value="${esc(site[k]||'')}" maxlength="200" ${['facebook','instagram','x','youtube'].includes(k)?'placeholder="https://…"':''}></label>`).join('')}</div><div id="siteMsg"></div><button class="btn nav" style="margin-top:12px">Save website details</button></form>
  <div class="panel" style="margin-top:18px"><h4>💾 Data</h4><p class="sd">Everything is stored in this browser. Download a backup regularly, and restore it on another device if needed.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn ghost" id="bk">⬇ Download backup (JSON)</button><label class="btn ghost" style="cursor:pointer">⬆ Restore backup<input type="file" id="rs" accept="application/json" hidden></label><button class="btn" style="background:linear-gradient(180deg,#ff9a5a,#e5541a)" id="rmS">Remove sample data (start fresh)</button><button class="btn" style="background:linear-gradient(180deg,#ff7a7a,#e5323a)" id="rz">Reset demo data</button></div><small class="sd">Storage used: ${kb(lsUsage())} of ~5 MB</small></div>`:''}`;
  $$('#main [data-th]').forEach(b=>b.onclick=()=>{if(!ME.canApprove){toast('Only the Super Admin can change the site theme');return}const t=b.dataset.th.split(':')[1];CMS.setTheme('site',t);CMS.setTheme('admin',t);applyAdminTheme(t);audit('theme','whole site → '+t);toast(`Site theme: ${THEMES.find(x=>x[0]===t)[1]} — website and portal updated`);viewSettings()});
  $('#pw1').oninput=e=>{const s=pwStrength(e.target.value);$('#pwBar').style.width=s*20+'%';$('#pwBar').style.background=['#e5323a','#e5323a','#f08a12','#f0c000','#2ea84a','#1f8f3f'][s]};
  $('#pwF').onsubmit=e=>{e.preventDefault();const a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value,msg=t=>$('#pwMsg').innerHTML=`<div class="alert e" style="animation:none;margin-top:8px">${t}</div>`;
    if(window.AFAGS_API&&AFAGS_API.online){if(b!==c)return msg('New passwords do not match.');if(pwStrength(b)<4||b.length<10)return msg('New password is too weak.');AFAGS_API.call('POST','/auth/change',{current:a,password:b}).then(()=>{e.target.reset();audit('password',ME.key);$('#pwMsg').innerHTML='<div class="alert s" style="animation:none;margin-top:8px">Password updated on the AFAGS server.</div>'}).catch(x=>msg(esc(x.message)));return}
    if(!checkPw(ME.key,a)){audit('login-failed','password change — wrong current password');return msg('Current password is incorrect.')}
    if(pwStrength(b)<4||b.length<10)return msg('New password is too weak. Use at least 10 characters with upper & lower case, a number and a symbol.');
    if(b!==c)return msg('New passwords do not match.');if(a===b)return msg('New password must be different.');
    const salt=Array.from(crypto.getRandomValues(new Uint8Array(12))).map(x=>x.toString(16).padStart(2,'0')).join(''),P=store.get('afags_pw')||{};P[ME.key]={s:salt,h:hashPw(b,salt)};store.set('afags_pw',P);audit('password',ME.key);
    e.target.reset();$('#pwBar').style.width=0;$('#pwMsg').innerHTML='<div class="alert s" style="animation:none;margin-top:8px">Password updated. Use the new password next time you sign in.</div>'};
  if(!admin)return;
  $('#secF').onsubmit=e=>{e.preventDefault();store.set('afags_sec',{idle:+$('#sIdle').value,demo:$('#sDemo').checked});audit('settings','idle '+$('#sIdle').value+' min, demo login '+($('#sDemo').checked?'on':'off'));applyDemoBox();toast('Security settings saved')};
  $('#sUnlock').onclick=()=>{store.del('afags_lock');audit('settings','login lock cleared');toast('Login lock cleared')};
  $('#siteF').onsubmit=e=>{e.preventDefault();const f=e.target,o={},bad=[];['siteUrl','address','email','phone','hours','facebook','instagram','x','youtube'].forEach(k=>{const v=f.elements[k].value.trim();o[k]=v;if(k==='siteUrl'&&v&&!/^https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v))bad.push('website address');if(['facebook','instagram','x','youtube'].includes(k)&&v&&!/^https:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v))bad.push(k)});
    if(o.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(o.email))bad.push('email');if(bad.length){$('#siteMsg').innerHTML=`<div class="alert e" style="animation:none">Please check: ${bad.join(', ')} (links must start with https://)</div>`;return}
    CMS.setSite(o);audit('settings','website contact details');$('#siteMsg').innerHTML='<div class="alert s" style="animation:none">Saved — the website footer and contact page are updated.</div>'};
  $('#bk').onclick=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('afags_')&&k!=='afags_pw'&&k!=='afags_lock')o[k]=localStorage.getItem(k)}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'AFAGS',v:3,at:new Date().toISOString(),data:o})],{type:'application/json'}));a.download=`afags-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();audit('backup','downloaded');store.set('afags_lastbackup',Date.now());toast('Backup downloaded')};
  $('#rs').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(j.app!=='AFAGS'||!j.data||typeof j.data!=='object')throw 0;
    confirmBox({title:'Restore this backup?',body:`Data from ${esc(j.at||'the backup')} will replace the current data in this browser.`,ok:'Restore',tone:'ok'},()=>{Object.entries(j.data).forEach(([k,v])=>{if(/^afags_[\w]+$/.test(k)&&k!=='afags_pw'&&typeof v==='string')try{localStorage.setItem(k,v)}catch(x){}});audit('restore',f.name);toast('Backup restored — reloading');setTimeout(()=>location.reload(),900)})}catch(x){toast('This is not a valid AFAGS backup file')}e.target.value=''};
  $('#rmS').onclick=clearSamples;$('#rz').onclick=()=>confirmBox({title:'Reset all demo data?',body:'Applications, approvals, AFAGS IDs, CMS content and inbox messages in this browser will be cleared. Passwords and the audit log are kept.',ok:'Reset everything',tone:'no'},()=>{const keep=['afags_pw','afags_audit','afags_theme_site','afags_theme_admin','afags_sec'];for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&k.startsWith('afags_')&&!keep.includes(k))localStorage.removeItem(k)}audit('reset-data','all demo data');toast('Demo data cleared — reloading');setTimeout(()=>location.reload(),900)})}
function applyDemoBox(){const d=$('.demo');d&&(d.style.display=secCfg().demo?'':'none')}
applyDemoBox();
/* in-page links: inside the website's embedded (srcdoc) frame a plain "#x" link would resolve against the website URL and reload the
   whole site inside the frame — route every in-page hash link here instead */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||e.defaultPrevented)return;const h=a.getAttribute('href');if(h==='#'||h.length<2)return;
  e.preventDefault();if(location.hash!==h){try{location.hash=h}catch(x){history.replaceState(null,'',h);route()}}else route()});

/* ===== portal v4: FAI-DMS style expandable menu, extended statuses, reminders, grade upgrades, certificates, tournaments, paid reports ===== */
/* --- extended statuses & flags --- */
const STX=['Pending','Verified','Relookup','Approved','Rejected','Blocked'];
const FLAGS=store.get('afags_flags')||{};const saveFlags=()=>store.set('afags_flags',FLAGS);
const numOf=id=>parseInt(String(id).replace(/\D/g,'').slice(-4))||0;
const NOW=Date.now(),DAY=86400000;
Object.values(DB).flat().forEach(r=>{const n=numOf(r.id),f=FLAGS[r.id]||{};
  if(r.sample&&!decisions[r.id]){if(r.status==='Pending'&&n%3===0)r.status='Verified';else if(r.status==='Pending'&&n%3===1)r.status='Relookup';if(r.status==='Approved'&&n%97===5)r.status='Blocked'}
  if(r.sample){r.migrated=r.status!=='Pending'&&n%3===0;r.renewed=(r.status==='Approved'&&n%5<2);r.offline=n%23===0}
  if(r.status==='Relookup'&&!r.reason)r.reason='Photo is not clear — please upload a recent passport-size photograph.';
  Object.assign(r,f);if('renewed' in f)r.renewed=renewedNow(f.renewed,r.id)});
/* offline registrations added by the admin */
(store.get('afags_offline')||[]).forEach(o=>{if(DB[o.k]&&!DB[o.k].some(r=>r.id===o.id))DB[o.k].unshift(Object.assign({col:'#1e9fb8',date:new Date(o.at)},o,{date:new Date(o.at)}))});
Object.values(DB).flat().forEach(r=>{if(decisions[r.id])r.status=decisions[r.id]});
const isNewData=r=>(r.isNew||(NOW-r.date<30*DAY))&&['Pending','Verified','Relookup'].includes(r.status);
const SF={All:()=>true,New:isNewData,Migrated:r=>r.migrated,Renewed:r=>r.renewed,Offline:r=>r.offline};
const passS=(r,s)=>SF[s]?SF[s](r):r.status===s;
const cntS=(k,s)=>rows(k).filter(r=>passS(r,s)).length;
const SLBL={All:'All',Pending:'Pending',New:'New Data',Relookup:'Relookup',Verified:'Verified',Rejected:'Rejected',Approved:'Approved',Blocked:'Blocked',Migrated:'Migrated',Renewed:'Renewed',Offline:'Offline'};
const NOUN={fencers:'Fencers',coaches:'Coaches',referees:'Referee & Officials',clubs:'Clubs',districts:'District Units'};
const SUB={
 fencers:[...['All','Pending','New','Relookup','Verified','Rejected','Approved','Blocked','Migrated','Renewed','Offline'].map(s=>[SLBL[s]+' Fencers','s='+s]),['Send Reminder','v=reminder'],['Our Fencers (home page)','v=our']],
 coaches:['All','Pending','Rejected','Approved','Blocked','Renewed'].map(s=>[s+' Coaches','s='+s]),
 referees:[...['All','Pending','Rejected','Approved'].map(s=>[s+' Referee & Officials','s='+s]),['Renewed Referees','s=Renewed'],['Blocked Referee & Officials','s=Blocked'],['Upgrade Grade Request','v=upgrade']],
 clubs:['All','Pending','Approved','Rejected','Blocked'].map(s=>[s+' Clubs','s='+s]),
 districts:['All','Pending','Approved','Rejected','Blocked'].map(s=>[s+' District Units','s='+s]),
 certificates:[['Certificate Dashboard',''],['Create Certificate','v=create'],['Manual Entries','v=manual']],
 ranking:[['Ranking Details','']],
 events:[['Add Tournaments','v=add'],['List Tournaments',''],['Upload Results','v=results']],
 reports:[['Reports Overview',''],['Paid Fencers','v=paid&k=fencers'],['Paid Referees','v=paid&k=referees'],['Paid Coaches','v=paid&k=coaches'],['Paid Districts','v=paid&k=districts']],
 cms:[['All content',''],['Our Fencers (home page)','c=fencers'],['Discipline photos','c=disciplines'],['News','c=news'],['Circulars','c=circulars'],['Tenders','c=tenders'],['Documents','c=docs'],['Results','c=results'],['Achievers','c=achievers'],['Photo Gallery','c=gallery'],['Videos','c=videos'],['Voices (feedback globe)','c=voices'],['Careers','c=careers']],
 inbox:[['All messages',''],['Contact','t=contact'],['Grievance / RTI','t=grievance'],['Career','t=career'],['Donation pledges','t=donation'],['Newsletter','t=newsletter']]};
LABEL.events='Tournaments';LABEL.profile='My Profile';
const subLink=(k,q)=>'#'+k+(q?'?'+q:'');
let OPEN=null;
function buildMenu(){const m=ROLE_MENU[ME.role];let h='';
  m.forEach(k=>{if(k==='fencers')h+='<li class="sep">Members</li>';if(k==='certificates'||(k==='ranking'&&!m.includes('certificates')))h+='<li class="sep">Manage</li>';if(k==='cms')h+='<li class="sep">Website</li>';
    const subs=(SUB[k]||[]).filter(([,q])=>!(q==='v=reminder'&&!ME.canApprove)&&!(q==='v=upgrade'&&!ME.canApprove)&&!(q==='v=create'&&!ME.canApprove)&&!(q==='v=manual'&&!ME.canApprove)&&!(q==='v=add'&&!ME.canApprove)&&!(q==='v=results'&&!ME.canApprove)&&!(q==='v=our'&&!ME.canApprove)&&!(k==='cms'&&!ME.canApprove&&q!=='c=news')&&!(k==='reports'&&q.includes('k=')&&!m.includes(q.split('k=')[1])));
    const pc=k==='accreditation'?pendingAll():k==='inbox'?inboxNew():DB[k]?cnt(k,'Pending'):0;
    const ic=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
    if(!subs.length){h+=`<li><a href="#${k}" data-k="${k}">${ic}${LABEL[k]}${pc?`<span class="cnt">${pc}</span>`:'<span class="chev">›</span>'}</a></li>`;return}
    h+=`<li class="grp${OPEN===k?' open':''}" data-g="${k}"><a href="#${k}" data-k="${k}" data-tg="${k}" aria-expanded="${OPEN===k}">${ic}${LABEL[k]}${pc?`<span class="cnt">${pc}</span>`:''}<span class="cv">⌄</span></a><ul class="subm">${subs.map(([l,q])=>{const s=(q.match(/s=(\w+)/)||[])[1],n=DB[k]&&s&&s!=='All'?cntS(k,s):0;return `<li><a href="${subLink(k,q)}" data-sub="${subLink(k,q)}"><i class="sd2"></i>${esc(l)}${n&&['Pending','Relookup','Verified','New'].includes(s)?`<em>${n.toLocaleString('en-IN')}</em>`:''}</a></li>`}).join('')}</ul></li>`});
  h+=`<li class="sep">Account</li><li><a href="#profile" data-k="profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>My Profile<span class="chev">›</span></a></li><li><a href="#" id="sbLogout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>Logout</a></li>`;
  $('#menu').innerHTML=h;$('#sbLogout').onclick=e=>{e.preventDefault();logout()};$('#bellN').textContent=pendingAll();
  $$('#menu [data-tg]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const k=a.dataset.tg,li=a.parentElement,op=!li.classList.contains('open');
    $$('#menu .grp.open').forEach(g=>{if(g!==li){g.classList.remove('open');g.firstElementChild.setAttribute('aria-expanded','false')}});li.classList.toggle('open',op);a.setAttribute('aria-expanded',op);OPEN=op?k:null;
    if(op&&!location.hash.startsWith('#'+k)){const all=[...li.querySelectorAll('[data-sub]')],first=all.find(x=>!x.dataset.sub.includes('?'))||all.find(x=>/s=All/.test(x.dataset.sub))||all[0];first&&(location.hash=first.dataset.sub)}},true));
  setActive((location.hash.slice(1)||'dashboard').split('?')[0])}
function setActive(k){const full=location.hash||'#dashboard';
  $$('#menu a[data-k]').forEach(a=>a.classList.toggle('on',a.dataset.k===k));
  let best=null;$$('#menu [data-sub]').forEach(a=>{a.classList.remove('on');const s=a.dataset.sub;if(full===s||full.startsWith(s+'&')||(full.split('?')[0]===s&&!best))best=a});
  if(!best){const g=$(`#menu [data-g="${k}"]`);if(g){const q=full.split('?')[1]||'';best=[...g.querySelectorAll('[data-sub]')].find(a=>(a.dataset.sub.split('?')[1]||'')===q)||(!q?g.querySelector('[data-sub]'):null)}}
  if(best){best.classList.add('on');const g=best.closest('.grp');if(g&&!g.classList.contains('open')){$$('#menu .grp.open').forEach(x=>x.classList.remove('open'));g.classList.add('open');OPEN=g.dataset.g}}
  const sl=best?best.textContent.replace(/[\d,]+$/,'').trim():'';$('#tbTitle').textContent=sl&&k!=='cms'&&k!=='inbox'?sl:(LABEL[k]||'Dashboard');document.body.classList.remove('menu-open')}
function route(){if(!ME)return;let [k,q]=(location.hash.slice(1)||'dashboard').split('?');const P=new URLSearchParams(q||''),v=P.get('v');
  if(k==='profile'){viewProfile();setActive('profile');return}
  if(!ROLE_MENU[ME.role].includes(k)){if(k!=='dashboard'&&k)toast('You do not have access to that section');k='dashboard'}
  setActive(k);scrollTo(0,0);$('#main').scrollTop=0;
  if(k==='dashboard'){if(ME.role==='member')viewMember();else{viewDash();dashExtras()}}else if(k==='users'){viewUsers()}else if(k==='accreditation')viewAccr();
  else if(DB[k]){if(v==='our'&&ME.canApprove){viewCMS('fencers','fencers');$('#tbTitle').textContent='Our Fencers (home page)'}else if(v==='reminder')viewReminder(k);else if(v==='upgrade')viewUpgrade();else viewList(k,P.get('s')||'All')}
  else if(k==='ranking')viewRankX();else if(k==='events'){if(v==='entries')viewEntries();else if(v==='results'&&ME.canApprove)viewResultsUpload();else if(v==='add'&&ME.canApprove){viewCMS('events','events');setTimeout(()=>cmsEdit('events',-1,'events'),60)}else viewCMS('events','events')}
  else if(k==='cms')viewCMS(P.get('c')||'news');else if(k==='inbox')viewInbox(q);else if(k==='audit')viewAudit();
  else if(k==='certificates'){if(v==='create'&&ME.canApprove){const P2=new URLSearchParams(q||'');P2.get('b')?viewCertBatch(P2.get('b'),P2.get('t')||'p'):viewCertBatches()}else if(v==='manual'&&ME.canApprove)viewCertCreate();else viewCertDash()}
  else if(k==='reports'){if(v==='annual')viewAnnual();else if(v==='paid')viewPaid(P.get('k')||'fencers');else viewReports()}else if(k==='live')viewLive(v,P.get('c'));
  else if(k==='settings')viewSettings();else viewPlaceholder(k);setTimeout(()=>window.__afterRoute&&__afterRoute(),40)}

/* --- member lists with all FAI-style status filters --- */
function viewList(k,s){if(!SF[s]&&!STX.includes(s))s='All';LV.k=k;LV.s=s;LV.p=1;LV.q='';
  const tabs=(SUB[k]||[]).map(([,q])=>(q.match(/s=(\w+)/)||[])[1]).filter(Boolean);
  $('#main').innerHTML=crumb(META[k][0],`${SLBL[s]} · ${cntS(k,s).toLocaleString('en-IN')} records`)+`<div class="lv-h"><div class="tabs" id="lvT">${tabs.map(t=>`<button data-s="${t}" class="${t===s?'on':''}">${SLBL[t]}<i>${cntS(k,t).toLocaleString('en-IN')}</i></button>`).join('')}</div></div>
  <div class="lv-h"><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="lvQ" placeholder="Search name, AFAGS ID, ref or district" aria-label="Search"></label>${s==='Offline'&&ME.canApprove?`<button class="btn nav" style="height:42px;font-size:12px" id="offAdd">+ Offline ${META[k][1]}</button>`:`<button class="btn nav" style="height:42px;font-size:12px" id="newReg">+ New ${META[k][1]}</button>`}<button class="btn ghost" style="height:42px;font-size:12px" id="exp">⬇ CSV</button></div>
  ${{Relookup:'<div class="acc-int"><div><b>Relookup</b><span>Applications sent back to the applicant for correction. The remark is shown to them in Track Application.</span></div></div>',Verified:'<div class="acc-int"><div><b>Verified</b><span>Documents checked — waiting for final approval by the Super Admin.</span></div></div>',Blocked:'<div class="acc-int"><div><b>Blocked</b><span>AFAGS ID suspended. Blocked members cannot enter tournaments until unblocked.</span></div></div>',Migrated:'<div class="acc-int"><div><b>Migrated</b><span>Records brought over from the earlier (offline / legacy) registration system.</span></div></div>',Renewed:`<div class="acc-int"><div><b>Renewed</b><span>Members who renewed for season ${SEASON_L}.</span></div></div>`,Offline:'<div class="acc-int"><div><b>Offline</b><span>Registered at the AFAGS office / at a tournament desk on a paper form.</span></div></div>',New:'<div class="acc-int"><div><b>New data</b><span>Applications received in the last 30 days that are still in process.</span></div></div>'}[s]||''}
  <div class="tblw" id="lvB"></div><div class="pg" id="lvP"></div>`;
  $$('#lvT button').forEach(b=>b.onclick=()=>{location.hash=`#${k}?s=${b.dataset.s}`});
  $('#lvQ').oninput=e=>{LV.q=e.target.value.toLowerCase();LV.p=1;drawList()};$('#exp').onclick=exportCSV;
  const nr=$('#newReg');nr&&(nr.onclick=()=>openWizard(TYPE_OF[k]));const oa=$('#offAdd');oa&&(oa.onclick=()=>offlineAdd(k));drawList();
  const on=$('#lvT .on');on&&on.scrollIntoView({block:'nearest',inline:'center'})}
function filtered(){const {k,s,q}=LV;return rows(k).filter(r=>passS(r,s)&&(!q||(r.name+r.id+(r.afagsId||'')+r.district).toLowerCase().includes(q)))}
function canAct(){return ME.canApprove}
function canVerify(r){return ME.canApprove||(ME.role==='district_unit'&&r.district===scope)}
function rowActions(r){const p=r.status==='Approved'?(canAct()?`<button class="no" data-blk="${r.id}">Block</button>`:''):r.status==='Blocked'?(canAct()?`<button class="ok" data-ubk="${r.id}">Unblock</button>`:''):canAct()&&r.status!=='Rejected'?`<button class="ok" data-a="${r.id}">Approve</button>`:canVerify(r)&&r.status==='Pending'?`<button class="ok" data-ver="${r.id}">Verify</button>`:'';
  return `<div class="act"><button class="vw" data-v="${r.id}">View</button>${p}${(canAct()||canVerify(r))?`<button class="mo" data-more="${r.id}" aria-label="More actions">⋯</button>`:''}</div>`}
function bindActions(){$$('#main [data-a]').forEach(b=>b.onclick=()=>approve(b.dataset.a));$$('#main [data-r]').forEach(b=>b.onclick=()=>reject(b.dataset.r));$$('#main [data-v]').forEach(b=>b.onclick=()=>viewRec(b.dataset.v));
  $$('#main [data-blk]').forEach(b=>b.onclick=()=>setStatus(b.dataset.blk,'Blocked'));$$('#main [data-ubk]').forEach(b=>b.onclick=()=>setStatus(b.dataset.ubk,'Approved'));
  $$('#main [data-ver]').forEach(b=>b.onclick=()=>setStatus(b.dataset.ver,'Verified'));$$('#main [data-more]').forEach(b=>b.onclick=()=>actionSheet(b.dataset.more))}
function setStatus(id,st,why){const [r,k]=findRec(id);if(!r)return;
  const go=reason=>{const prev=r.status;r.status=st;r.isNew=false;if(reason!==undefined)r.reason=reason;if(st==='Approved'&&!r.afagsId)r.afagsId=newAfagsId(k);persist(r);
    audit(st==='Blocked'?'block':st==='Approved'&&prev==='Blocked'?'unblock':st==='Verified'?'verify':st==='Relookup'?'relookup':'status',`${r.name}: ${prev} → ${st}${reason?' ('+reason+')':''}`);toast(`${r.name} — ${st}`);buildMenu();route()};
  if(st==='Relookup')confirmBox({title:'Send back for correction',body:`Tell <b>${esc(r.name)}</b> what to correct — they will see this when tracking the application.`,reason:1,ok:'Send to Relookup',tone:'no'},go);
  else if(st==='Blocked')confirmBox({title:'Block this member?',body:`<b>${esc(r.name)}</b> (${esc(r.afagsId||r.id)}) will be suspended and cannot enter tournaments. Give a reason.`,reason:1,ok:'Block',tone:'no'},go);
  else go()}
function setFlag(id,f,v){const [r]=findRec(id);if(!r)return;r[f]=v;FLAGS[id]=Object.assign(FLAGS[id]||{},{[f]:f==='renewed'&&v?SEASON_K:v});saveFlags();audit(f==='renewed'?'renew':'status',`${r.name}: ${f} ${v?'on':'off'}`);toast(f==='renewed'?`${r.name} — renewed for ${SEASON_L}`:'Updated');buildMenu();route()}
function actionSheet(id){const [r,k]=findRec(id);if(!r)return;const A=[];
  A.push(['👁','View full record',()=>viewRec(id)]);
  if(canVerify(r)&&['Pending','Relookup'].includes(r.status))A.push(['✅','Mark as Verified',()=>setStatus(id,'Verified')]);
  if(canVerify(r)&&['Pending','Verified'].includes(r.status))A.push(['↩️','Send to Relookup (correction)',()=>setStatus(id,'Relookup')]);
  if(canAct()){if(!['Approved','Blocked'].includes(r.status))A.push(['🎫','Approve & generate AFAGS ID',()=>approve(id)]);
    if(!['Rejected','Approved','Blocked'].includes(r.status))A.push(['✖️','Reject',()=>reject(id)]);
    if(r.status==='Approved')A.push(['⛔','Block (suspend)',()=>setStatus(id,'Blocked')]);if(r.status==='Blocked')A.push(['🔓','Unblock',()=>setStatus(id,'Approved')]);
    if(r.status==='Approved')A.push([r.renewed?'↺':'🔁',r.renewed?'Undo renewal':`Renew for ${SEASON_L}`,()=>setFlag(id,'renewed',!r.renewed)]);
    if(r.status==='Approved'&&r.afagsId)A.push(['🎓','Certificate',()=>certOpen(id)]);
    if(r.status==='Rejected')A.push(['♻️','Re-open as Pending',()=>setStatus(id,'Pending')])}
  const {m,close}=mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">${esc(r.name)}</h3><p style="color:var(--mu);font-size:13px;margin:2px 0 12px">${META[k][1]} · ${esc(r.afagsId||r.id)} · <span class="st ${r.status}">${r.status}</span>${r.renewed?' <span class="st Approved">Renewed</span>':''}${r.offline?' <span class="st Pending">Offline</span>':''}</p><div class="sheet">${A.map(([i,l],n)=>`<button data-i="${n}"><span>${i}</span>${l}<b>›</b></button>`).join('')}</div>`);
  m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{close();A[+b.dataset.i][2]()})}
/* offline registration desk */
function offlineAdd(k){const {m,close}=mdOpen(`<form class="cms-f" novalidate><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy);margin-bottom:4px">Offline ${META[k][1]} registration</h3><p class="sd">For paper forms received at the AFAGS office or a tournament desk. The record is accredited immediately and an AFAGS ID is generated.</p><div class="cf-g">
  <label class="cf w1">Full name<b class="rq">*</b><input name="name" maxlength="60" required></label><label class="cf">District<b class="rq">*</b><select name="district"><option value="">Select…</option>${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></label>
  ${k==='fencers'?`<label class="cf">Date of birth<b class="rq">*</b><input name="dob" type="date"></label>`:''}${['fencers','coaches','referees'].includes(k)?`<label class="cf">Weapon<b class="rq">*</b><select name="weapon"><option value="">Select…</option><option>Foil</option><option>Épée</option><option>Sabre</option></select></label>`:''}
  <label class="cf">Mobile<input name="mobile" inputmode="numeric" maxlength="10"></label>${k==='fencers'?'<label class="cf">Fee receipt no.<b class="rq">*</b><input name="rcpt" maxlength="20" placeholder="e.g. AFAGS/R/0457"></label>':''}</div><div id="ofErr"></div>
  <div style="display:flex;gap:10px;margin-top:16px"><button type="button" class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" style="flex:1.4">Register & generate ID</button></div></form>`,true);
  const f=m.querySelector('form');m.querySelector('[data-c]').onclick=close;
  f.onsubmit=e=>{e.preventDefault();const g=n=>f.elements[n]?f.elements[n].value.trim():'',bad=[];const name=g('name');
    if(!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(name))bad.push('Full name (letters only)');if(!g('district'))bad.push('District');if(k==='fencers'&&!g('dob'))bad.push('Date of birth');if(f.elements.weapon&&!g('weapon'))bad.push('Weapon');if(g('mobile')&&!/^[6-9]\d{9}$/.test(g('mobile')))bad.push('Mobile (10 digits)');if(k==='fencers'&&!g('rcpt'))bad.push('Fee receipt no.');
    if(bad.length){m.querySelector('#ofErr').innerHTML=`<div class="alert e" style="animation:none;margin-top:12px">Please check: ${bad.join(', ')}</div>`;return}
    const seq=(store.get('afags_refseq')||1000)+1;store.set('afags_refseq',seq);const id=`AFAGS-${CODE[k]}-${String(YEAR).slice(2)}${String(seq).padStart(5,'0')}`;
    const rec={id,k,name,district:g('district'),weapon:g('weapon')||'—',cat:k==='fencers'?catShort(ageCat(g('dob'))):'—',mobile:g('mobile'),rcpt:g('rcpt'),status:'Approved',offline:true,renewed:true,at:Date.now(),col:'#1e9fb8'};
    rec.afagsId=newAfagsId(k);const L=store.get('afags_offline')||[];L.unshift(rec);store.set('afags_offline',L);DB[k].unshift(Object.assign({},rec,{date:new Date(rec.at)}));IDS[id]=rec.afagsId;store.set('afags_ids',IDS);decisions[id]='Approved';store.set('afags_dec',decisions);
    audit('offline',`${META[k][1]} ${name} → ${rec.afagsId}`);close();toast(`Registered offline — AFAGS ID ${rec.afagsId}`);buildMenu();route()}}

/* --- send reminder --- */
function viewReminder(k){const aud=[['Pending','Pending applications','Your AFAGS registration is pending. Please make sure all documents are uploaded so we can complete accreditation.',r=>r.status==='Pending'],
   ['Relookup','Relookup — correction needed','Your AFAGS registration needs a correction. Please check “Track Application” for the remark, correct it and resubmit.',r=>r.status==='Relookup'],
   ['Renewal','Renewal due (approved, not renewed)',`Your AFAGS registration is due for renewal for season ${SEASON_L}. Renew now to stay eligible for state events.`,r=>r.status==='Approved'&&!r.renewed],
   ['Blocked','Blocked members','Your AFAGS ID is currently blocked. Please contact the AFAGS office to resolve this.',r=>r.status==='Blocked']];
  const H=store.get('afags_reminders')||[];
  $('#main').innerHTML=crumb('Send Reminder',META[k][0])+`<div class="cards2" style="grid-template-columns:1.3fr 1fr;margin-top:0"><form class="panel" id="rmF"><h4>📣 Compose reminder</h4>
   <p class="sd">Choose who should get it</p><div class="aud">${aud.map(([id,l,,fn],i)=>`<label><input type="radio" name="aud" value="${i}" ${i?'':'checked'}><span><b>${l}</b><em>${rows(k).filter(fn).length.toLocaleString('en-IN')} ${META[k][0].toLowerCase()}</em></span></label>`).join('')}</div>
   <label class="sf">District<select id="rmD"><option value="">All districts</option>${DISTRICTS.filter(d=>!scope||d===scope).map(d=>`<option>${d}</option>`).join('')}</select></label>
   <p class="sd" style="margin-top:12px">Send by</p><div class="chs">${['SMS','Email','WhatsApp'].map((c,i)=>`<label><input type="checkbox" name="ch" value="${c}" ${i<2?'checked':''}><span>${c}</span></label>`).join('')}</div>
   <label class="sf">Message<textarea id="rmM" rows="4" maxlength="480" style="height:auto;padding:10px 12px;line-height:1.5">${esc(aud[0][2])}</textarea></label><small class="sd" id="rmC"></small>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn nav">Send reminder</button><button type="button" class="btn ghost" id="rmCsv">⬇ Recipient list</button></div></form>
   <div class="panel"><h4>🕑 Reminder history</h4>${H.length?`<div class="rmh">${H.slice(0,12).map(x=>`<div><b>${esc(x.aud)}</b><small>${new Date(x.at).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} · ${x.count.toLocaleString('en-IN')} recipients · ${esc(x.ch)}${x.d?' · '+esc(x.d):''}</small></div>`).join('')}</div>`:'<div class="empty" style="padding:24px">No reminders sent yet.</div>'}</div></div>
   <div class="dbg" style="margin-top:14px">ℹ️ <span>Demo: reminders are logged here and in the Audit Log. Connect an SMS / email / WhatsApp gateway on the server to deliver them.</span></div>`;
  const list=()=>{const a=aud[+$('#rmF').aud.value],d=$('#rmD').value;return rows(k).filter(r=>a[3](r)&&(!d||r.district===d))};
  const upd=()=>{$('#rmC').textContent=`${list().length.toLocaleString('en-IN')} recipients · ${$('#rmM').value.length}/480 characters`};
  $$('#rmF [name=aud]').forEach(r=>r.onchange=()=>{$('#rmM').value=aud[+r.value][2];upd()});$('#rmD').onchange=upd;$('#rmM').oninput=upd;upd();
  $('#rmCsv').onclick=()=>dlCSV([['Reference','AFAGS ID','Name','District','Status','Mobile'],...list().map(r=>[r.id,r.afagsId||'',r.name,r.district,r.status,r.mobile||(r.app&&r.app.mobile)||''])],`afags-${k}-reminder-list.csv`);
  $('#rmF').onsubmit=e=>{e.preventDefault();const L=list(),ch=$$('#rmF [name=ch]:checked').map(x=>x.value);if(!L.length){toast('No recipients in this group');return}if(!ch.length){toast('Choose at least one channel');return}if($('#rmM').value.trim().length<10){toast('Write a message');return}
    const a=aud[+$('#rmF').aud.value];if(API.online){API.call('POST','/reminders',{channels:ch,message:$('#rmM').value.trim(),recipients:L.map(r=>{const V=(r.app&&r.app.V)||{};return {name:r.name,email:V.email||'',mobile:r.mobile||V.mobile||''}})}).then(j=>toast(`Sent: ${j.sent||0} · skipped (no contact): ${j.skipped||0}`)).catch(e=>toast('Server: '+e.message))}H.unshift({at:Date.now(),aud:a[1],count:L.length,ch:ch.join(', '),d:$('#rmD').value,msg:$('#rmM').value.trim()});store.set('afags_reminders',H.slice(0,100));audit('reminder',`${a[1]} → ${L.length} ${k} via ${ch.join('/')}`);toast(`Reminder queued for ${L.length.toLocaleString('en-IN')} ${META[k][0].toLowerCase()}`);viewReminder(k)}}

/* --- referee grade upgrade requests --- */
const GR=['D','C','B','A','A+'];
function upgList(){let L=store.get('afags_upg');if(!L&&store.get('afags_nosample')){L=[];store.set('afags_upg',L)}if(!L){const ap=DB.referees.filter(r=>r.status==='Approved');L=[3,11,19,27,35].map((i,j)=>{const r=ap[i%ap.length],f=GR[j%3+1];return {id:'UG'+(101+j),rid:r.id,name:r.name,district:r.district,from:f,to:GR[GR.indexOf(f)+1],basis:['Passed national referee course 2026','Officiated 20+ national bouts this season','FIE referee seminar (Asian Zone) certificate','State referee panel — 8 years','NIS referee refresher course'][j],at:NOW-(j+1)*4*DAY,status:j<4?'Pending':'Approved'}});store.set('afags_upg',L)}return L}
function viewUpgrade(){const L=upgList(),P=L.filter(x=>x.status==='Pending').length;
  $('#main').innerHTML=crumb('Upgrade Grade Request',P+' pending')+`<div class="acc-int"><div><b>Referee & TO grade upgrades</b><span>Approve a request to move the official to the next grade (D → C → B → A → A+). The new grade applies from the next event.</span></div></div>
  <div class="tblw">${L.length?`<table class="tbl"><thead><tr><th>Official</th><th>Grade</th><th class="hm">Basis</th><th class="hm">Requested</th><th>Status / Action</th></tr></thead><tbody>${L.map(x=>`<tr><td><b>${esc(x.name)}</b><small style="display:block;color:var(--mu)">${esc(x.rid)} · ${esc(x.district)}</small></td><td><span class="gr">${x.from}</span> → <span class="gr up">${x.to}</span></td><td class="hm"><small>${esc(x.basis)}</small></td><td class="hm">${fmt(x.at)}</td><td>${x.status==='Pending'&&ME.canApprove?`<div class="act"><button class="ok" data-ua="${x.id}">Approve</button><button class="no" data-ur="${x.id}">Reject</button></div>`:`<span class="st ${x.status}">${x.status}</span>`}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No upgrade requests.</div>'}</div>`;
  const act=(id,st,why)=>{const x=L.find(y=>y.id===id);x.status=st;if(why)x.reason=why;store.set('afags_upg',L);audit('upgrade',`${x.name}: ${x.from} → ${x.to} ${st}`);toast(`${x.name} — upgrade ${st.toLowerCase()}`);viewUpgrade()};
  $$('#main [data-ua]').forEach(b=>b.onclick=()=>confirmBox({title:'Approve grade upgrade?',body:'The official moves to the next grade.',ok:'Approve',tone:'ok'},()=>act(b.dataset.ua,'Approved')));
  $$('#main [data-ur]').forEach(b=>b.onclick=()=>confirmBox({title:'Reject grade upgrade',body:'Give a reason for the official.',reason:1,ok:'Reject',tone:'no'},w=>act(b.dataset.ur,'Rejected',w)))}

/* --- ranking details with filters --- */
function viewRankX(){const RP=rankFromPoints();const draw=()=>{const w=$('#rkW').value,c=$('#rkC').value,d=$('#rkD').value;const L=RP?RP.filter(r=>(!w||r.weapon===w)&&(!c||String(r.cat).startsWith(c))&&(!d||r.district===d)).slice(0,50).map(r=>({...r,id:r.afagsId||r.name,col:'#1d6fe0'})):rows('fencers').filter(r=>r.status==='Approved'&&(!w||r.weapon===w)&&(!c||r.cat===c)&&(!d||r.district===d)).slice(0,50);
    $('#rkB').innerHTML=L.length?`<table class="tbl"><thead><tr><th style="width:56px">Rank</th><th>Fencer</th><th class="hm">Weapon</th><th class="hm">Category</th><th style="text-align:right">Points</th></tr></thead><tbody>${L.map((r,i)=>`<tr><td><span class="rk ${i<3?'m'+i:''}">${i+1}</span></td><td><div class="nm">${av(r)}<div><b>${esc(r.name)}</b><small>${esc(r.afagsId||'')} · ${esc(r.district)}</small></div></div></td><td class="hm">${esc(r.weapon)}</td><td class="hm">${esc(r.cat)}</td><td style="text-align:right;font-weight:800;color:var(--navy)">${RP?r.pts:Math.max(40,1320-i*29-(numOf(r.id)%17))}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No ranked fencers for this filter.</div>'};
  $('#main').innerHTML=crumb('Ranking Details','State ranking '+YEAR)+`<div class="lv-h"><select id="rkW" aria-label="Weapon" class="selx"><option value="">All weapons</option>${W.map(w=>`<option>${w}</option>`).join('')}</select><select id="rkC" aria-label="Category" class="selx"><option value="">All categories</option>${CAT.map(c=>`<option>${c}</option>`).join('')}</select><select id="rkD" aria-label="District" class="selx"><option value="">All districts</option>${DISTRICTS.filter(d=>!scope||d===scope).map(d=>`<option>${d}</option>`).join('')}</select><button class="btn ghost" style="height:42px;font-size:12px" id="rkCsv">⬇ CSV</button></div><div class="tblw" id="rkB"></div>${RP?'<p class="sd" style="margin-top:8px">Points from uploaded tournament results (Tournaments › Upload Results).</p>':'<p class="sd" style="margin-top:8px">Sample points — upload tournament results (Tournaments › Upload Results) and the ranking is calculated automatically.</p>'}`;
  ['#rkW','#rkC','#rkD'].forEach(s=>$(s).onchange=draw);draw();
  $('#rkCsv').onclick=()=>{const rs=[...$$('#rkB tbody tr')].map(tr=>[...tr.children].map(td=>td.innerText.replace(/\n/g,' · ')));dlCSV([['Rank','Fencer','Weapon','Category','Points'],...rs],'afags-ranking.csv')}}

/* --- certificates: dashboard + create --- */
const CTYPES=['Participation','Merit — Winner','Appreciation','Accreditation','Coaching / Officiating'];
function certsIssued(){return store.get('afags_certs')||[]}
function viewCertDash(){viewCerts();const I=certsIssued(),acc=memberKeys().reduce((s,k)=>s+cnt(k,'Approved'),0),by={};I.forEach(c=>by[c.type]=(by[c.type]||0)+1);
  $('#tbTitle').textContent='Certificate Dashboard';
  const top=`<div class="stats">${[['Accredited members',acc],['Certificates issued',I.length+batchTotal()],['Issued this month',I.filter(c=>new Date(c.at).getMonth()===new Date().getMonth()).length],['Certificate types',Object.keys(by).length]].map(([l,n])=>`<div class="sc" style="cursor:default;opacity:1"><span><small>${l}</small><b>${n.toLocaleString('en-IN')}</b></span><span class="ico ap">${SVGI.ap}</span></div>`).join('')}</div>
   <div class="panel" style="margin:18px 0"><h4 style="display:flex;align-items:center">Issued certificates${ME.canApprove?'<a href="#certificates?v=create" class="btn nav" style="margin-left:auto;height:38px;font-size:12px;text-decoration:none;display:inline-flex;align-items:center">+ Create Certificate</a>':''}</h4>${I.length?`<table class="tbl"><thead><tr><th>Cert. no.</th><th>Recipient</th><th class="hm">Type</th><th class="hm">Event</th><th>Action</th></tr></thead><tbody>${I.slice(0,30).map(c=>`<tr><td><span class="aid">${esc(c.no)}</span></td><td><b>${esc(c.name)}</b></td><td class="hm">${esc(c.type)}</td><td class="hm"><small>${esc(c.event)}</small></td><td><button class="btn ghost" style="height:32px;font-size:11px;padding:0 10px" data-rp="${esc(c.no)}">🖨 Reprint</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty" style="padding:20px">No certificates created yet.</div>'}</div><div class="sec-t">Accreditation certificates</div>`;
  const ai=$('#main .acc-int');ai.insertAdjacentHTML('beforebegin',top);$$('#main [data-rp]').forEach(b=>b.onclick=()=>certPreview(I.find(c=>c.no===b.dataset.rp),true))}
function certHTML(c){return `<div class="cert" id="certCard"><div class="cert-b"><span class="logo cert-l"></span><small>AMATEUR FENCING ASSOCIATION OF GUJARAT STATE</small><em>Affiliated to the Fencing Association of India</em><h2>Certificate of ${esc(c.type.split(' —')[0].replace('Coaching / Officiating','Service'))}</h2><p>This is to certify that</p><h3>${esc(c.name)}</h3>
  <p>${c.type.startsWith('Merit')?`secured <b>${esc(c.pos||'a position')}</b>${c.weapon?` in <b>${esc(c.weapon)}</b>`:''} at the`:c.type==='Appreciation'?'is appreciated for outstanding contribution to fencing at the':c.type==='Accreditation'?'is a duly accredited member of AFAGS, as recorded at the':c.type.startsWith('Coaching')?'rendered valuable service as a coach / official at the':'participated in the'} <b>${esc(c.event)}</b>${c.venue?`, held at <b>${esc(c.venue)}</b>`:''}${c.date?` on <b>${esc(fmtDs(c.date))}</b>`:''}.</p>
  ${c.afagsId?`<div class="cert-id">AFAGS ID · <b>${esc(c.afagsId)}</b></div>`:''}<div class="cert-s"><div><i></i><b>Mukeshbhai Chaudhari</b><small>President</small></div><div class="cert-seal">AFAGS<br><small>${YEAR}</small></div><div><i></i><b>Bharatji Thakor</b><small>Secretary General</small></div></div>
  <div class="cert-qr">${c.no&&c.no!=='PREVIEW'?qrSVG(c.no,78):''}<small>Scan to verify</small></div><p class="cert-f">Certificate no. ${esc(c.no)} · Issued ${new Date(c.at).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</p></div></div>`}
function certPreview(c,issued){const {m}=mdOpen(certHTML(c)+`<div style="display:flex;gap:10px;justify-content:center;margin-top:14px"><button class="btn nav" id="cePr">🖨 Print / Save as PDF</button></div>`,true);
  m.querySelector('#cePr').onclick=()=>{document.body.classList.add('printing');const x=m.querySelector('#certCard').cloneNode(true);x.id='idPrint';x.classList.add('cert-print');document.body.appendChild(x);setTimeout(()=>{window.print();x.remove();document.body.classList.remove('printing')},60)}}
function viewCertCreate(){const ev=CMS.get('events'),mem=memberKeys().flatMap(k=>rows(k).filter(r=>r.status==='Approved').slice(0,400).map(r=>r));
  $('#main').innerHTML=crumb('Create Certificate')+`<form class="panel" id="ccF" novalidate style="max-width:820px"><h4>🎓 New certificate</h4><div class="cf-g">
   <label class="cf w1">Recipient — search an accredited member or type any name<b class="rq">*</b><input name="name" list="ccL" maxlength="70" placeholder="Start typing a name or AFAGS ID"><datalist id="ccL">${mem.map(r=>`<option value="${esc(r.name)} — ${esc(r.afagsId||r.id)}">`).join('')}</datalist></label>
   <label class="cf">Certificate type<b class="rq">*</b><select name="type">${CTYPES.map(t=>`<option>${t}</option>`).join('')}</select></label><label class="cf">Position (for merit)<select name="pos"><option value="">—</option><option>Gold — 1st place</option><option>Silver — 2nd place</option><option>Bronze — 3rd place</option><option>Joint Bronze — 3rd place</option></select></label>
   <label class="cf w1">Event / tournament<b class="rq">*</b><input name="event" list="ccE" maxlength="120"><datalist id="ccE">${ev.map(e=>`<option value="${esc(e.title)}">`).join('')}</datalist></label>
   <label class="cf">Weapon<select name="weapon"><option value="">—</option><option>Foil</option><option>Épée</option><option>Sabre</option></select></label><label class="cf">Venue<input name="venue" maxlength="80"></label><label class="cf">Date<input name="date" type="date"></label></div><div id="ccErr"></div>
   <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"><button type="button" class="btn ghost" id="ccPv">👁 Preview</button><button class="btn nav">Issue certificate</button></div></form>`;
  const f=$('#ccF'),val=()=>{const g=n=>f.elements[n].value.trim();let name=g('name'),afagsId='';const mm=name.match(/^(.*) — (AFAGS\/\S+|[A-Z]{2}\d+|AFAGS-\S+)$/);if(mm){name=mm[1];afagsId=mm[2].startsWith('AFAGS/')?mm[2]:''}
    const ev2=ev.find(e=>e.title===g('event'));return {name,afagsId,type:g('type'),pos:g('pos'),event:g('event'),weapon:g('weapon'),venue:g('venue')||(ev2&&ev2.venue)||'',date:g('date')||(ev2&&ev2.start)||'',at:Date.now()}};
  const check=c=>{const bad=[];if(!/^[A-Za-z][A-Za-z .'-]{1,69}$/.test(c.name))bad.push('Recipient name');if(c.event.length<3)bad.push('Event');if(c.type.startsWith('Merit')&&!c.pos)bad.push('Position');$('#ccErr').innerHTML=bad.length?`<div class="alert e" style="animation:none;margin-top:12px">Please check: ${bad.join(', ')}</div>`:'';return !bad.length};
  f.elements.event.onchange=()=>{const e=ev.find(x=>x.title===f.elements.event.value);if(e){f.elements.venue.value=e.venue||'';f.elements.date.value=e.start||''}};
  $('#ccPv').onclick=()=>{const c=val();if(check(c))certPreview(Object.assign(c,{no:'PREVIEW'}))};
  f.onsubmit=e=>{e.preventDefault();const c=val();if(!check(c))return;const I=certsIssued();c.no=nextCertNo();I.unshift(c);store.set('afags_certs',I.slice(0,2000));audit('certificate',`${c.no} — ${c.name} (${c.type})`);toast('Certificate issued — '+c.no);certPreview(c,true);f.reset()}}

/* --- paid reports --- */
function viewPaid(k){const apps=(store.get('afags_apps')||[]).filter(a=>a.key===k&&a.payment&&(!scope||a.district===scope));const FEE={fencers:200,coaches:0,referees:0,districts:0}[k];
  const online=apps.map(a=>({id:a.ref,name:a.name,district:a.district,amt:+a.payment.amount,txn:a.payment.txn,mode:'Online · '+a.payment.method,at:a.payment.at})).concat((store.get('afags_renewals')||[]).filter(x=>x.key===k&&x.amount&&(!scope||x.district===scope)).map(x=>({id:x.afagsId,name:x.name,district:x.district,amt:+x.amount,txn:x.txn,mode:'Renewal · '+x.method,at:x.at})));
  const offline=(k==='fencers'?rows(k).filter(r=>r.renewed&&r.status!=='Pending'):[]).map(r=>({id:r.afagsId||r.id,name:r.name,district:r.district,amt:200,txn:r.rcpt||('R-'+numOf(r.id)),mode:r.offline?'Offline · office':'Offline · sample',at:+r.date}));
  const L=online.concat(offline).sort((a,b)=>b.at-a.at),tot=L.reduce((s,x)=>s+x.amt,0),lbl={fencers:'Paid Fencers',referees:'Paid Referees',coaches:'Paid Coaches',districts:'Paid Districts'}[k];
  $('#main').innerHTML=crumb(lbl,scope?scope+' district':'All Gujarat')+`<div class="stats">${[['Payments',L.length.toLocaleString('en-IN')],['Total collected','₹'+tot.toLocaleString('en-IN')],['Online',online.length.toLocaleString('en-IN')],['Fee per registration',FEE?'₹'+FEE:'Free']].map(([l,n])=>`<div class="sc" style="cursor:default;opacity:1"><span><small>${l}</small><b>${n}</b></span><span class="ico ap">${SVGI.ap}</span></div>`).join('')}</div>
  <div class="lv-h" style="margin-top:16px"><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="pdQ" placeholder="Search name, ID, payment ID or district" aria-label="Search"></label><button class="btn ghost" style="height:42px;font-size:12px" id="pdCsv">⬇ CSV</button></div><div class="tblw" id="pdB"></div>
  ${FEE?'':`<p class="sd" style="margin-top:10px">${META[k][1]} registration is free under the current AFAGS fee settings, so only voluntary / event payments would appear here.</p>`}`;
  const draw=()=>{const q=$('#pdQ').value.toLowerCase(),R=L.filter(x=>!q||(x.name+x.id+x.txn+x.district).toLowerCase().includes(q)).slice(0,200);
    $('#pdB').innerHTML=R.length?`<table class="tbl"><thead><tr><th>Member</th><th class="hm">Payment ID</th><th class="hm">Mode</th><th class="hm">Date</th><th style="text-align:right">Amount</th></tr></thead><tbody>${R.map(x=>`<tr><td><b>${esc(x.name)}</b><small style="display:block;color:var(--mu)">${esc(x.id)} · ${esc(x.district)}</small></td><td class="hm"><span class="aid">${esc(x.txn)}</span></td><td class="hm">${esc(x.mode)}</td><td class="hm">${fmt(x.at)}</td><td style="text-align:right;font-weight:800;color:#1f8f3f">₹${x.amt}</td></tr>`).join('')}</tbody></table>${L.length>200?'<p class="sd" style="padding:10px 14px">Showing 200 — search or download CSV for all.</p>':''}`:'<div class="empty">No payments found.</div>'};
  $('#pdQ').oninput=draw;draw();$('#pdCsv').onclick=()=>dlCSV([['ID','Name','District','Amount','Payment ID','Mode','Date'],...L.map(x=>[x.id,x.name,x.district,x.amt,x.txn,x.mode,fmt(x.at)])],`afags-${lbl.toLowerCase().replace(/ /g,'-')}.csv`)}
Object.assign(ALBL,{block:'Blocked',unblock:'Unblocked',verify:'Verified',relookup:'Sent to relookup',status:'Status changed',renew:'Renewed',offline:'Offline registration',reminder:'Reminder sent',upgrade:'Grade upgrade',certificate:'Certificate issued'});

/* ===== portal v5: tournament certificates — Excel / CSV upload → auto-generated participation & merit certificates ===== */
function nextCertNo(){const n=(store.get('afags_certseq')||Math.max(certsIssued().length,0))+1;store.set('afags_certseq',n);return `AFAGS/CERT/${YEAR}/${String(n).padStart(4,'0')}`}
function certBatches(){let B=store.get('afags_certb');if(!B){B=store.get('afags_nosample')?[]:sampleBatches();store.set('afags_certb',B)}return B}
function batchTotal(){return certBatches().filter(b=>!b.sample).reduce((s,b)=>s+b.rows.length,0)}
function sampleBatches(){const F=DB.fencers.filter(r=>r.status==='Approved'),ev=[['Gujarat State Fencing Championship 2025','Gandhinagar','2025-11-16',148,24],['AFAGS U-17 & U-20 Selection Trials 2025','Rajkot','2025-12-06',96,18],['Inter-District Fencing Tournament 2025','Surat','2025-09-20',72,12]];let o=0;
  return ev.map(([t,venue,date,np,nm],bi)=>{const rows=[];for(let i=0;i<np;i++){const r=F[(o+i*7)%F.length];const pos=i<nm?['Gold — 1st place','Silver — 2nd place','Bronze — 3rd place','Bronze — 3rd place','5th place','6th place','7th place','8th place'][i%8]:'';rows.push({name:r.name,afagsId:r.afagsId||'',district:r.district,weapon:r.weapon,category:r.cat,position:pos,no:`AFAGS/CERT/2025/${String(bi*200+i+1).padStart(4,'0')}`})}o+=np;
    return {id:'CB'+(bi+1),tournament:t,venue,date,at:new Date(date).getTime(),rows,sample:1}})}
const isMerit=r=>!!r.position;
function viewCertBatches(){const B=certBatches();let per=10,q='',p=1;
  $('#main').innerHTML=`<div class="crumb">Home <span>/</span> Certificate <span>/</span> <b>Participate Certificate</b><span class="r"><button class="btn nav sm2" id="cbUp">⬆ Upload Excel</button><a class="btn sm2 ghost" href="#certificates?v=manual">Manual Entries</a></span></div>${DBG()}
   <div class="panel dt"><div class="dt-h"><label>Show <select id="cbN">${[10,25,50,100].map(n=>`<option>${n}</option>`).join('')}</select> entries</label><label>Search: <input id="cbQ" type="search" aria-label="Search tournaments"></label></div><div class="tblw" style="border:0"><table class="tbl dtb"><thead><tr><th style="width:64px">S.No</th><th>Tournament</th><th style="width:190px">Details</th><th style="width:340px;text-align:center">Action</th></tr></thead><tbody id="cbB"></tbody></table></div><div class="pg" id="cbP"></div></div>
   <div class="acc-int" style="margin-top:16px"><div><b>How it works</b><span>Upload the tournament's result sheet (Excel .xlsx / .xls or CSV). Every row becomes a <strong>Participation</strong> certificate; rows with a position (1, 2, 3 … or Gold / Silver / Bronze) also get a <strong>Merit</strong> certificate. Certificate numbers are generated automatically. <a href="#" id="cbTpl">Download the Excel template</a></span></div></div>`;
  const draw=()=>{const L=B.filter(b=>!q||b.tournament.toLowerCase().includes(q)),pages=Math.max(1,Math.ceil(L.length/per));p=Math.min(p,pages);const pg=L.slice((p-1)*per,p*per);
    $('#cbB').innerHTML=pg.length?pg.map((b,i)=>`<tr><td>${(p-1)*per+i+1}</td><td><b style="font-weight:600">${esc(b.tournament)}</b>${b.sample?' <span class="st Pending">Sample</span>':''}<small style="display:block;color:var(--mu)">${esc(b.venue||'')}${b.date?' · '+fmtDs(b.date):''}</small></td><td><b>Participation: ${b.rows.length}</b><br><b>Merit: ${b.rows.filter(isMerit).length}</b></td><td style="text-align:center"><div class="cb-a"><a class="btn nav sm2" href="#certificates?v=create&b=${b.id}&t=p">View Participate</a><a class="btn nav sm2" href="#certificates?v=create&b=${b.id}&t=m">View Merit</a></div></td></tr>`).join(''):`<tr><td colspan="4"><div class="empty">No tournaments yet — click “Upload Excel”.</div></td></tr>`;
    $('#cbP').innerHTML=`<span>Showing ${L.length?(p-1)*per+1:0} to ${Math.min(p*per,L.length)} of ${L.length} entries</span><div class="b"><button ${p<2?'disabled':''} data-p="${p-1}">Previous</button><button class="on">${p}</button><button ${p>=pages?'disabled':''} data-p="${p+1}">Next</button></div>`;
    $$('#cbP [data-p]').forEach(x=>x.onclick=()=>{p=+x.dataset.p;draw()})};
  $('#cbN').onchange=e=>{per=+e.target.value;p=1;draw()};$('#cbQ').oninput=e=>{q=e.target.value.toLowerCase();p=1;draw()};draw();
  $('#cbUp').onclick=uploadSheet;$('#cbTpl').onclick=e=>{e.preventDefault();dlTemplate()}}
function viewCertBatch(id,t){const B=certBatches(),b=B.find(x=>x.id===id);if(!b){location.hash='#certificates?v=create';return}
  const merit=t==='m',L0=b.rows.map((r,i)=>({...r,i})).filter(r=>!merit||isMerit(r));let per=10,q='',p=1;
  $('#main').innerHTML=`<div class="crumb">Home <span>/</span> <a href="#certificates?v=create">Certificate</a> <span>/</span> <b>${merit?'Merit':'Participate'} Certificate</b><span class="r"><a class="btn sm2 ghost" href="#certificates?v=create">‹ Back</a></span></div>
   <div class="panel" style="margin-bottom:14px"><h4 style="margin-bottom:2px">${esc(b.tournament)}</h4><p class="sd">${esc(b.venue||'')}${b.date?' · '+fmtDs(b.date):''} · ${L0.length} ${merit?'merit':'participation'} certificates${b.sample?' · <b>sample data</b>':''}</p>
   <div class="cb-org" style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:8px"><label class="cf" style="flex:1;min-width:240px">Organized by (printed on every certificate)<input id="cbOrg" maxlength="120" value="${esc(b.organizer||(typeof certCfg==='function'?certCfg().organizer:''))}"></label><label class="cf" style="width:170px">Last day (if more than one)<input id="cbEnd" type="date" value="${esc(b.end||'')}"></label></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><a class="btn sm2 ${merit?'ghost':'nav'}" href="#certificates?v=create&b=${b.id}&t=p">Participation (${b.rows.length})</a><a class="btn sm2 ${merit?'nav':'ghost'}" href="#certificates?v=create&b=${b.id}&t=m">Merit (${b.rows.filter(isMerit).length})</a><button class="btn sm2 ghost" id="cbPrint">🖨 Print all (${L0.length})</button><button class="btn sm2 ghost" id="cbCsv">⬇ CSV</button>${b.sample?'':'<button class="btn sm2 ghost" id="cbDel" style="color:#c62828">Delete tournament</button>'}</div></div>
   <div class="panel dt"><div class="dt-h"><label>Show <select id="cbN">${[10,25,50,100].map(n=>`<option>${n}</option>`).join('')}</select> entries</label><label>Search: <input id="cbQ" type="search" aria-label="Search"></label></div><div class="tblw" style="border:0"><table class="tbl dtb"><thead><tr><th style="width:56px">S.No</th><th>Name</th><th class="hm">AFAGS ID</th><th class="hm">District</th><th class="hm">Event</th>${merit?'<th>Position</th>':''}<th class="hm">Cert. no.</th><th style="text-align:center">Action</th></tr></thead><tbody id="cbB"></tbody></table></div><div class="pg" id="cbP"></div></div>`;
  const cert=(r,m)=>({name:r.name,afagsId:r.afagsId,type:m?'Merit — Winner':'Participation',pos:r.position,event:b.tournament,weapon:[r.weapon,r.category].filter(x=>x&&x!=='—').join(' · '),wpn:r.weapon,category:r.category,gender:r.gender,district:r.district,dob:r.dob,parent:r.parent,venue:b.venue,date:b.date,end:b.end,organizer:b.organizer,at:b.at,no:r.no+(m?'-M':'')});
  const draw=()=>{const L=L0.filter(r=>!q||(r.name+r.afagsId+r.district+r.no).toLowerCase().includes(q)),pages=Math.max(1,Math.ceil(L.length/per));p=Math.min(p,pages);const pg=L.slice((p-1)*per,p*per);
    $('#cbB').innerHTML=pg.length?pg.map((r,i)=>`<tr><td>${(p-1)*per+i+1}</td><td><b style="font-weight:600">${esc(r.name)}</b></td><td class="hm">${r.afagsId?`<span class="aid">${esc(r.afagsId)}</span>`:'—'}</td><td class="hm">${esc(r.district||'—')}</td><td class="hm">${esc([r.weapon,r.category].filter(x=>x&&x!=='—').join(' · ')||'—')}</td>${merit?`<td><span class="medal ${/gold|1st/i.test(r.position)?'g':/silver|2nd/i.test(r.position)?'s':/bronze|3rd/i.test(r.position)?'b':''}">${esc(r.position)}</span></td>`:''}<td class="hm"><small>${esc(r.no)}${merit?'-M':''}</small></td><td style="text-align:center"><button class="btn nav sm2" data-cv="${r.i}">🎓 View / Print</button></td></tr>`).join(''):`<tr><td colspan="8"><div class="empty">No ${merit?'merit':'participation'} entries.</div></td></tr>`;
    $('#cbP').innerHTML=`<span>Showing ${L.length?(p-1)*per+1:0} to ${Math.min(p*per,L.length)} of ${L.length} entries</span><div class="b"><button ${p<2?'disabled':''} data-p="${p-1}">Previous</button><button class="on">${p}</button><button ${p>=pages?'disabled':''} data-p="${p+1}">Next</button></div>`;
    $$('#cbP [data-p]').forEach(x=>x.onclick=()=>{p=+x.dataset.p;draw()});$$('#cbB [data-cv]').forEach(x=>x.onclick=()=>certPreview(cert(b.rows[+x.dataset.cv],merit)))};
  const keep=()=>{b.organizer=$('#cbOrg').value.trim();b.end=$('#cbEnd').value;store.set('afags_certb',B);toast('Saved for all certificates of this tournament')};$('#cbOrg').onchange=keep;$('#cbEnd').onchange=keep;
  $('#cbN').onchange=e=>{per=+e.target.value;p=1;draw()};$('#cbQ').oninput=e=>{q=e.target.value.toLowerCase();p=1;draw()};draw();
  $('#cbCsv').onclick=()=>dlCSV([['S.No','Certificate no.','Name','AFAGS ID','District','Weapon','Category','Position','Tournament'],...L0.map((r,i)=>[i+1,r.no+(merit?'-M':''),r.name,r.afagsId,r.district,r.weapon,r.category,r.position,b.tournament])],`afags-${merit?'merit':'participation'}-${b.id}.csv`);
  $('#cbPrint').onclick=()=>{const w=document.createElement('div');w.id='idPrint';w.className='certpages';w.innerHTML=L0.map(r=>`<div class="certpg">${certHTML(cert(r,merit)).replace('id="certCard"','')}</div>`).join('');
    document.body.classList.add('printing');document.body.appendChild(w);audit('certificate',`printed ${L0.length} ${merit?'merit':'participation'} — ${b.tournament}`);setTimeout(()=>{window.print();w.remove();document.body.classList.remove('printing')},300)};
  const del=$('#cbDel');del&&(del.onclick=()=>confirmBox({title:'Delete this tournament?',body:`All ${b.rows.length} certificates of <b>${esc(b.tournament)}</b> will be removed.`,ok:'Delete',tone:'no'},()=>{store.set('afags_certb',B.filter(x=>x.id!==id));audit('certificate','deleted batch '+b.tournament);toast('Deleted');location.hash='#certificates?v=create'}))}

/* ---------- reading Excel (.xlsx) and CSV in the browser (no external library) ---------- */
async function unzip(buf){const dv=new DataView(buf),u8=new Uint8Array(buf);let e=-1;for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-66000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break}
  if(e<0)throw new Error('Not a valid .xlsx file');const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out={},td=new TextDecoder();
  for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const m=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    const name=td.decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;if(!/^(xl\/sharedStrings\.xml|xl\/worksheets\/sheet\d+\.xml|xl\/workbook\.xml)$/.test(name))continue;
    const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),data=u8.slice(ds,ds+cs);
    out[name]=m===0?td.decode(data):m===8?await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text():'';}
  return out}
const colIdx=r=>{const m=/^([A-Z]+)/.exec(r||'');if(!m)return -1;let n=0;for(const ch of m[1])n=n*26+ch.charCodeAt(0)-64;return n-1};
async function readXlsx(buf){const z=await unzip(buf),P=new DOMParser(),tags=(d,t)=>[...d.getElementsByTagNameNS('*',t)];
  const ss=z['xl/sharedStrings.xml']?tags(P.parseFromString(z['xl/sharedStrings.xml'],'application/xml'),'si').map(si=>tags(si,'t').map(t=>t.textContent).join('')):[];
  const sheet=Object.keys(z).filter(k=>k.startsWith('xl/worksheets/')).sort((a,b)=>parseInt(a.replace(/\D/g,''))-parseInt(b.replace(/\D/g,'')))[0];if(!sheet)throw new Error('No worksheet found');
  const doc=P.parseFromString(z[sheet],'application/xml');const rows=[];
  tags(doc,'row').forEach(rw=>{const row=[];tags(rw,'c').forEach((c,ci)=>{let i=colIdx(c.getAttribute('r'));if(i<0)i=ci;const t=c.getAttribute('t'),v=(tags(c,'v')[0]||{}).textContent;
    row[i]=t==='s'?(ss[+v]||''):t==='inlineStr'?tags(c,'t').map(x=>x.textContent).join(''):(v??'')});rows.push([...row].map(x=>x??''))});return rows}
function readCSV(txt){const rows=[];let row=[],f='',q=false;txt=txt.replace(/^﻿/,'');for(let i=0;i<txt.length;i++){const ch=txt[i];
  if(q){if(ch==='"'){if(txt[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===','){row.push(f);f=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&txt[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}else f+=ch}
  if(f||row.length){row.push(f);rows.push(row)}return rows}
const HDR={name:/^(name|full ?name|fencer|fencer ?name|participant|participant ?name|player)$/,afagsId:/^(afags ?id|id|reg(istration)? ?(no|id)|member ?id)$/,district:/^(district|unit|district ?unit|state|team)$/,weapon:/^(weapon|event|discipline)$/,category:/^(category|age ?group|age ?category|cat)$/,position:/^(position|rank|place|result|medal|merit)$/,
  dob:/^(dob|d\.o\.b\.?|date ?of ?birth|birth ?date)$/,parent:/^(father|father'?s? ?name|parent|parent'?s? ?name|guardian|guardian'?s? ?name|s\/?o|s\/o ?d\/o ?w\/o|s\/o d\/o|relation ?name)$/,gender:/^(gender|sex)$/,mobile:/^(mobile|mobile ?no|phone|contact|contact ?no)$/,faiId:/^(fai ?id|fai ?no)$/};
/* dates from Excel: serial numbers, 20-10-2010, 20/10/2010, 2010-10-20, 20.10.2010, 20 Oct 2010 → 2010-10-20 */
function normDob(v){v=String(v||'').trim();if(!v)return '';if(/^\d{4,5}(\.\d+)?$/.test(v)){const n=parseFloat(v);if(n>3000&&n<60000){const d=new Date(Date.UTC(1899,11,30)+Math.round(n)*864e5);return d.toISOString().slice(0,10)}}
  let m=/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.exec(v);if(m)return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
  m=/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.exec(v);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  const d=new Date(v);return isNaN(d)?'':new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
const normGender=v=>{v=String(v||'').trim().toLowerCase();return /^(f|female|woman|women|girl|girls)$/.test(v)?'Female':/^(m|male|man|men|boy|boys)$/.test(v)?'Male':''};
/* find the fencer in the registration database: AFAGS ID → FAI ID → mobile → name + DOB → name + district (only when unique) */
const nameKey=s=>String(s||'').toLowerCase().replace(/[^a-z]/g,'');
function regIndex(){const all=[];for(const k in DB)DB[k].forEach(r=>{if(r.afagsId&&['Approved','Blocked'].includes(r.status))all.push(r)});return all}
function matchMember(x,ALL){const V=r=>(r.app&&r.app.V)||{},u=String(x.afagsId||'').toUpperCase();let r=null,how='';
  if(u){r=ALL.find(m=>String(m.afagsId).toUpperCase()===u);if(r)how='AFAGS ID'}
  if(!r&&x.faiId){r=ALL.find(m=>String(V(m).faiId||'').toUpperCase()===x.faiId.toUpperCase());if(r)how='FAI ID'}
  const mob=String(x.mobile||'').replace(/\D/g,'').slice(-10);if(!r&&mob.length===10){const L=ALL.filter(m=>String((m.app&&m.app.mobile)||V(m).mobile||m.mobile||'').replace(/\D/g,'').slice(-10)===mob&&nameKey(m.name)===nameKey(x.name));if(L.length===1){r=L[0];how='mobile'}}
  const nk=nameKey(x.name);if(!r&&x.dob){const L=ALL.filter(m=>nameKey(m.name)===nk&&V(m).dob===x.dob);if(L.length===1){r=L[0];how='name + DOB'}}
  if(!r&&x.district){const L=ALL.filter(m=>nameKey(m.name)===nk&&String(m.district||'').toLowerCase()===x.district.toLowerCase());if(L.length===1){r=L[0];how='name + district'}}
  if(!r)return {...x,match:''};const v=V(r);
  return {...x,afagsId:x.afagsId||r.afagsId,district:x.district||r.district||'',dob:x.dob||v.dob||'',parent:x.parent||v.father||v.mother||v.guardian||'',gender:x.gender||v.gender||'',match:how,hasPhoto:!!r.photo}}
function normPos(v){v=String(v||'').trim().toLowerCase();if(!v||/^(participa|-|—|na|n\/a|0)/.test(v))return '';
  if(/gold|^1(st)?$|first/.test(v))return 'Gold — 1st place';if(/silver|^2(nd)?$|second/.test(v))return 'Silver — 2nd place';if(/bronze|^3(rd)?$|third/.test(v))return 'Bronze — 3rd place';
  const n=parseInt(v);if(n>=4&&n<=8)return n+'th place';if(/merit/.test(v))return 'Merit';return ''}
function mapRows(raw){const hi=raw.findIndex(r=>r.some(c=>HDR.name.test(String(c).trim().toLowerCase())));if(hi<0)return {err:'Could not find a “Name” column in the first rows. Use the template headers.'};
  const H=raw[hi].map(c=>String(c).trim().toLowerCase()),col={};Object.entries(HDR).forEach(([k,re])=>{const i=H.findIndex(h=>re.test(h));if(i>=0)col[k]=i});
  const rows=[],bad=[];raw.slice(hi+1).forEach((r,j)=>{const g=k=>col[k]!=null?String(r[col[k]]??'').trim():'';const name=g('name').replace(/\s+/g,' ');if(!name&&!r.some(x=>String(x).trim()))return;
    if(!/^[A-Za-z][A-Za-z .'-]{1,69}$/.test(name)){bad.push(`Row ${hi+j+2}: name “${name||'(blank)'}” is not valid`);return}
    rows.push({name,afagsId:g('afagsId').toUpperCase().slice(0,30),district:g('district').slice(0,40),weapon:g('weapon').replace(/^epee$/i,'Épée').slice(0,20),category:g('category').slice(0,20),position:normPos(g('position')),
      dob:normDob(g('dob')),parent:g('parent').replace(/\s+/g,' ').slice(0,60),gender:normGender(g('gender')),mobile:g('mobile').slice(0,20),faiId:g('faiId').toUpperCase().slice(0,30)})});
  const ALL=regIndex();return {rows:rows.map(x=>matchMember(x,ALL)),bad,col}}
function uploadSheet(){const ev=CMS.get('events');
  const {m,close}=mdOpen(`<form class="cms-f" novalidate><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Upload result sheet</h3><p class="sd">Excel (.xlsx or old .xls) or CSV, up to 3,000 rows. Columns: <b>Name</b> (required), AFAGS ID, District, Weapon, Category, Position — optional DOB, Father's name, Gender, Mobile, FAI ID. Each fencer is found in the registration database (by AFAGS ID, FAI ID, mobile or name + DOB) and the <b>photo, DOB, parent's name and gender are filled in automatically</b>.</p><div class="cf-g">
   <label class="cf w1">Tournament<b class="rq">*</b><input name="t" list="ubE" maxlength="120" placeholder="Type or pick a tournament"><datalist id="ubE">${ev.map(e=>`<option value="${esc(e.title)}">`).join('')}</datalist></label>
   <label class="cf">Venue<input name="venue" maxlength="80"></label><label class="cf">Date<input name="date" type="date"></label>
   <div class="cf w1"><label>Result sheet<b class="rq">*</b></label><label class="drop" id="ubD"><input type="file" name="f" accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" hidden><span>📄 <b>Choose Excel / CSV file</b><small>or drag and drop it here</small></span></label><a href="#" class="link" id="ubT" style="margin-top:6px">⬇ Download Excel template</a></div></div>
   <div id="ubPv"></div><div style="display:flex;gap:10px;margin-top:14px"><button type="button" class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" style="flex:1.4" id="ubGo" disabled>Generate certificates</button></div></form>`,true);
  const f=m.querySelector('form'),inp=f.elements.f,drop=m.querySelector('#ubD');let parsed=null;m.querySelector('[data-c]').onclick=close;m.querySelector('#ubT').onclick=e=>{e.preventDefault();dlTemplate()};
  f.elements.t.onchange=()=>{const e=ev.find(x=>x.title===f.elements.t.value);if(e){f.elements.venue.value=e.venue||'';f.elements.date.value=e.start||''}};
  const take=async file=>{if(!file)return;const pv=m.querySelector('#ubPv');parsed=null;m.querySelector('#ubGo').disabled=true;
    if(file.size>5*1048576){pv.innerHTML='<div class="alert e" style="animation:none">File is larger than 5 MB.</div>';return}
    pv.innerHTML='<p class="sd">Reading…</p>';try{const raw=await readSheet(file);
      const r=mapRows(raw);if(r.err)throw new Error(r.err);if(!r.rows.length)throw new Error('No valid rows found.');if(r.rows.length>3000)throw new Error('More than 3,000 rows — split the file.');parsed=r;
      const nm=r.rows.filter(isMerit).length;drop.querySelector('span').innerHTML=`📄 <b>${esc(file.name)}</b><small>${(file.size/1024).toFixed(0)} KB · click to change</small>`;
      pv.innerHTML=`<div class="ub-sum"><div><b>${r.rows.length}</b><small>Participation</small></div><div><b>${nm}</b><small>Merit</small></div><div class="ok"><b>${r.rows.filter(x=>x.match).length}</b><small>Found in registration</small></div><div class="ok"><b>${r.rows.filter(x=>x.hasPhoto).length}</b><small>Photos fetched</small></div>${r.rows.some(x=>!x.match)?`<div class="w"><b>${r.rows.filter(x=>!x.match).length}</b><small>Not found (no photo)</small></div>`:''}${r.bad.length?`<div class="w"><b>${r.bad.length}</b><small>Rows skipped</small></div>`:''}</div>
       <div class="tblw" style="max-height:220px;overflow:auto;margin-top:10px"><table class="tbl"><thead><tr><th>#</th><th>Photo</th><th>Name</th><th>AFAGS ID</th><th>District</th><th>Event</th><th>Position</th></tr></thead><tbody>${r.rows.slice(0,8).map((x,i)=>{const mm=x.match&&memberOf(x.afagsId);return `<tr><td>${i+1}</td><td>${mm&&mm.photo?`<img src="${mm.photo}" alt="" class="ub-ph">`:'<span class="ub-ph none">—</span>'}</td><td>${esc(x.name)}<small style="display:block;color:${x.match?'#17803d':'#b45309'}">${x.match?'✓ matched by '+esc(x.match):'Not in registration'}</small></td><td>${esc(x.afagsId||'—')}</td><td>${esc(x.district||'—')}</td><td>${esc([x.weapon,x.category].filter(Boolean).join(' · ')||'—')}</td><td>${esc(x.position||'Participation')}</td></tr>`}).join('')}</tbody></table></div>${r.rows.length>8?`<p class="sd">…and ${r.rows.length-8} more rows</p>`:''}${r.bad.length?`<details class="sd"><summary>Skipped rows</summary>${r.bad.slice(0,20).map(esc).join('<br>')}</details>`:''}`;
      m.querySelector('#ubGo').disabled=false}catch(x){pv.innerHTML=`<div class="alert e" style="animation:none">${esc(x.message||'Could not read the file')}</div>`}};
  inp.onchange=()=>take(inp.files[0]);['dragover','dragenter'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('on')}));['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('on')}));drop.addEventListener('drop',e=>take(e.dataTransfer.files[0]));
  f.onsubmit=e=>{e.preventDefault();const t=f.elements.t.value.trim();if(t.length<3){toast('Enter the tournament name');f.elements.t.focus();return}if(!parsed){toast('Choose the result sheet');return}
    const B=certBatches(),b={id:'CB'+Date.now().toString(36),tournament:t,venue:f.elements.venue.value.trim(),date:f.elements.date.value,at:Date.now(),rows:parsed.rows.map(r=>{const {hasPhoto,mobile,...x}=r;return {...x,no:nextCertNo()}})};
    B.unshift(b);if(!store.set('afags_certb',B)){toast('Browser storage is full — delete old tournaments');return}audit('certificate',`${b.rows.length} participation + ${b.rows.filter(isMerit).length} merit — ${t}`);close();const ph=parsed.rows.filter(x=>x.hasPhoto).length;toast(`${b.rows.length} certificates generated · ${parsed.rows.filter(x=>x.match).length} found in registration · ${ph} with photo`);location.hash=`#certificates?v=create&b=${b.id}&t=p`}}
/* ---------- Excel template (.xlsx written in the browser) ---------- */
function crc32(u){let c,t=crc32.t;if(!t){t=crc32.t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}let crc=-1;for(let i=0;i<u.length;i++)crc=(crc>>>8)^t[(crc^u[i])&255];return (crc^-1)>>>0}
function zipStore(files){const te=new TextEncoder(),parts=[],cd=[];let off=0;
  files.forEach(([name,txt])=>{const n=te.encode(name),d=te.encode(txt),c=crc32(d),h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,n.length,true);
    parts.push(new Uint8Array(h.buffer),n,d);const C=new DataView(new ArrayBuffer(46));C.setUint32(0,0x02014b50,true);C.setUint16(4,20,true);C.setUint16(6,20,true);C.setUint32(16,c,true);C.setUint32(20,d.length,true);C.setUint32(24,d.length,true);C.setUint16(28,n.length,true);C.setUint32(42,off,true);cd.push(new Uint8Array(C.buffer),n);off+=30+n.length+d.length});
  const cdl=cd.reduce((s,x)=>s+x.length,0),E=new DataView(new ArrayBuffer(22));E.setUint32(0,0x06054b50,true);E.setUint16(8,files.length,true);E.setUint16(10,files.length,true);E.setUint32(12,cdl,true);E.setUint32(16,off,true);return new Blob([...parts,...cd,new Uint8Array(E.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function dlTemplate(){const rows=[['Name','AFAGS ID','District','Weapon','Category','Position','DOB','Father Name','Gender','Mobile'],['Aarav Patel','AFAGS/FEN/2026/0001','Ahmedabad','Sabre','U-17','1','12-03-2010','Rakesh Patel','Male','9876500001'],['Diya Shah','AFAGS/FEN/2026/0002','Surat','Foil','U-17','2','','','Female',''],['Kunal Desai','','Rajkot','Épée','Senior','3','05-08-2004','','Male',''],['Riya Mehta','AFAGS/FEN/2026/0004','Vadodara','Foil','U-14','','','','','']];
  const x=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),L='ABCDEFGHIJ';
  const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="26" customWidth="1"/><col min="2" max="2" width="24" customWidth="1"/><col min="3" max="6" width="14" customWidth="1"/></cols><sheetData>${rows.map((r,i)=>`<row r="${i+1}">${r.map((c,j)=>`<c r="${L[j]}${i+1}" t="inlineStr"><is><t>${x(c)}</t></is></c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;
  const blob=zipStore([['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],
    ['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Results" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
    ['xl/worksheets/sheet1.xml',sheet]]);
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='AFAGS-certificate-template.xlsx';document.body.appendChild(a);a.click();a.remove();toast('Template downloaded')}

/* ===== portal v6: live public data, users & logins, renewal, results upload, QR verification, clean start, server mode ===== */
const API=window.AFAGS_API||{online:false,cfg:{}};
const SITEURL=()=>{const u=(CMS.site().siteUrl||'').trim();return /^https?:\/\//.test(u)?u.replace(/#.*$/,'').replace(/\/?$/,'/'):'https://afagujarat.org/'};
const vurl=id=>SITEURL()+'#/fencers/verify?q='+encodeURIComponent(id);
function qrSVG(id,size){try{return AFAGS_QR.svg(vurl(id),{size:size||84})}catch(e){return ''}}
/* ---------- public data for the website: live numbers + verification index ---------- */
let pubT=0;function schedulePublic(){clearTimeout(pubT);pubT=setTimeout(writePublic,300)}
function writePublic(){if(!ME||!ME.canApprove)return;/* only the Super Admin publishes the public index & numbers */const ap=k=>DB[k].filter(r=>r.status==='Approved').length;
  const dist={};DB.fencers.forEach(r=>{if(r.status==='Approved'&&r.district)dist[r.district]=(dist[r.district]||0)+1});
  const stats={units:ap('districts'),clubs:ap('clubs'),coachRef:ap('coaches')+ap('referees'),fencers:ap('fencers'),dist,at:Date.now()};
  const vi={},C2={fencers:'FEN',coaches:'COA',referees:'REF',clubs:'CLB',districts:'DIS'};
  for(const k in DB)DB[k].forEach(r=>{if(r.afagsId&&(r.status==='Approved'||r.status==='Blocked'))vi[r.afagsId.toUpperCase()]=[r.name,C2[k],r.status,r.district,r.renewed?1:0]});
  const o=JSON.stringify(store.get('afags_stats')||{}),n={...stats,at:0};if(JSON.stringify({...(store.get('afags_stats')||{}),at:0})!==JSON.stringify(n))store.set('afags_stats',stats);
  try{const cur=localStorage.getItem('afags_vindex'),nv=JSON.stringify(vi);if(cur!==nv)localStorage.setItem('afags_vindex',nv)}catch(e){}}
{const _set=store.set;store.set=(k,v)=>{const r=_set(k,v);if(/^afags_(dec|ids|flags|offline|apps|nosample)$/.test(k))schedulePublic();return r}}
schedulePublic();

/* ---------- accounts: all 33 district units + disable / reset ---------- */
function userState(){return store.get('afags_users')||{}}
function userOff(k){return !!(userState()[k]||{}).disabled}
function mustChange(k){const P=store.get('afags_pw')||{};return !!(P[k]&&P[k].must)}
function mustChangeCheck(k){if(mustChange(k))setTimeout(()=>{location.hash='#settings';toast('Please set a new password now');const f=$('#pw0');f&&f.focus()},400)}
LABEL.users='Users & Logins';ICONS.users='<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.6c2.6.2 4.6 1.8 5.3 4.6"/>';
if(!ROLE_MENU.admin.includes('users'))ROLE_MENU.admin.splice(ROLE_MENU.admin.indexOf('settings'),0,'users');
function lastLogin(k){const a=CMS.auditLog().find(x=>x.a==='login'&&x.d===k);return a?new Date(a.at).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}
async function viewUsers(){let L=Object.entries(ACCOUNTS).map(([k,a])=>({k,name:a.name,role:a.roleLabel,district:a.district||'All Gujarat',email:a.email,off:userOff(k),must:mustChange(k)}));
  if(API.online){try{const j=await API.call('GET','/users');L=j.users.map(u=>({k:u.key,name:u.name,role:u.roleLabel,district:u.district||'All Gujarat',email:u.email,off:u.disabled,must:u.mustChange,last:u.lastLogin?new Date(u.lastLogin).toLocaleString('en-IN'):'—'}))}catch(e){toast('Could not load users from the server')}}
  $('#main').innerHTML=crumb('Users & Logins',L.length+' accounts')+`<div class="acc-int"><div><b>Logins for the Super Admin and all 33 District Units</b><span>District logins see only their own district. Reset a password to issue a one-time temporary password — the user must change it at the next login. Default district password: <code>District@2026</code> (change it before going live).</span></div></div>
   <div class="lv-h"><label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg><input id="usQ" placeholder="Search username or district" aria-label="Search"></label><button class="btn ghost" style="height:42px;font-size:12px" id="usCsv">⬇ CSV</button></div><div class="tblw" id="usB"></div>`;
  const draw=()=>{const q=$('#usQ').value.toLowerCase(),R=L.filter(u=>!q||(u.k+u.name+u.district).toLowerCase().includes(q));
    $('#usB').innerHTML=`<table class="tbl"><thead><tr><th>Username</th><th class="hm">Role</th><th class="hm">Area</th><th class="hm">Last login</th><th>Status</th><th>Action</th></tr></thead><tbody>${R.map(u=>`<tr><td><b>${esc(u.k)}</b><small style="display:block;color:var(--mu)">${esc(u.email||'')}</small></td><td class="hm">${esc(u.role)}</td><td class="hm">${esc(u.district)}</td><td class="hm"><small>${u.last||lastLogin(u.k)}</small></td><td>${u.off?'<span class="st Rejected">Disabled</span>':u.must?'<span class="st Pending">Must change password</span>':'<span class="st Approved">Active</span>'}</td><td>${u.k===ME.key?'<small style="color:var(--mu)">You</small>':`<div class="act"><button class="vw" data-ur="${esc(u.k)}">Reset password</button><button class="${u.off?'ok':'no'}" data-ut="${esc(u.k)}">${u.off?'Enable':'Disable'}</button></div>`}</td></tr>`).join('')}</tbody></table>`;
    $$('#usB [data-ur]').forEach(b=>b.onclick=()=>resetUser(b.dataset.ur));$$('#usB [data-ut]').forEach(b=>b.onclick=()=>toggleUser(b.dataset.ut))};
  $('#usQ').oninput=draw;draw();$('#usCsv').onclick=()=>dlCSV([['Username','Name','Role','Area','Email','Status'],...L.map(u=>[u.k,u.name,u.role,u.district,u.email,u.off?'Disabled':'Active'])],'afags-users.csv')}
const tempPw=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZ',b='abcdefghijkmnpqrstuvwxyz',d='23456789',r=n=>Array.from(crypto.getRandomValues(new Uint32Array(n)));const [x,y,z,w]=r(4);return a[x%24]+b[y%24]+b[z%24]+b[w%24]+'@'+r(4).map(v=>d[v%8]).join('')};
async function resetUser(k){confirmBox({title:'Reset password?',body:`A one-time temporary password will be created for <b>${esc(k)}</b>. They must change it after signing in.`,ok:'Reset',tone:'ok'},async()=>{let pw=tempPw();
  if(API.online){try{pw=(await API.call('POST','/users/'+encodeURIComponent(k)+'/reset')).tempPassword}catch(e){toast(e.message);return}}
  else{const salt=Array.from(crypto.getRandomValues(new Uint8Array(12))).map(x=>x.toString(16).padStart(2,'0')).join(''),P=store.get('afags_pw')||{};P[k]={s:salt,h:hashPw(pw,salt),must:1};store.set('afags_pw',P)}
  audit('password','reset for '+k);mdOpen(`<h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Temporary password</h3><p class="sd">Give this to <b>${esc(k)}</b> privately. It is shown only once.</p><div class="tpw"><code id="tpw">${esc(pw)}</code><button class="btn ghost" id="tpwC" style="height:38px">Copy</button></div>`).m.querySelector('#tpwC').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(pw).then(()=>toast('Copied'),()=>{})};viewUsers()})}
async function toggleUser(k){const off=!userOff(k);if(API.online){try{await API.call('POST','/users/'+encodeURIComponent(k)+'/'+(off?'disable':'enable'))}catch(e){toast(e.message);return}}
  const U=userState();U[k]=Object.assign(U[k]||{},{disabled:off});store.set('afags_users',U);audit('settings',`${k} ${off?'disabled':'enabled'}`);toast(`${k} ${off?'disabled':'enabled'}`);viewUsers()}

/* ---------- login page: forgot password, reset link, renewal desk, footer links ---------- */
$$('.lg-foot a').forEach((a,i)=>a.onclick=e=>{e.preventDefault();goWebsite(['#/terms','#/privacy','#/terms'][i]||'#/terms')});
function mkPane(id,html){const f=document.createElement('form');f.id=id;f.className='pane hidden';f.noValidate=true;f.innerHTML=html;const t=$('#fTrack');t.parentNode.insertBefore(f,t.nextSibling);return f}
const back='<p style="text-align:center;margin-top:12px"><button type="button" class="link toLogin2">← Back to Login</button></p>';
const fRenew=mkPane('fRenew',`<h1>Renew Registration</h1><p class="sub">Renew for the ${SEASON_L} season. Enter your AFAGS ID and registered mobile number.</p>
  <div class="fld" id="fRn"><label for="rnId">AFAGS ID</label><div class="inp"><input id="rnId" placeholder="AFAGS/FEN/${YEAR}/0001" autocomplete="off" style="text-transform:uppercase"></div><div class="msg"></div></div>
  <div class="fld" id="fRm"><label for="rnM">Registered mobile <small>(optional for older records)</small></label><div class="inp"><input id="rnM" inputmode="numeric" maxlength="10" placeholder="98XXXXXXXX"></div><div class="msg"></div></div>
  <button class="btn pri" type="submit">Find my registration</button><div id="rnOut" style="margin-top:14px"></div>${back}`);
const fReset=mkPane('fReset',`<h1>Set a new password</h1><p class="sub">Choose a strong password (10+ characters with upper & lower case, a number and a symbol).</p>
  <div class="fld"><label for="rsP1">New password</label><div class="inp"><input id="rsP1" type="password" autocomplete="new-password"></div></div><div class="fld"><label for="rsP2">Confirm password</label><div class="inp"><input id="rsP2" type="password" autocomplete="new-password"></div></div>
  <button class="btn pri" type="submit">Save new password</button><div id="rsOut" style="margin-top:12px"></div>${back}`);
$$('.toLogin2').forEach(b=>b.onclick=()=>{showPane('#fLogin');drawCap()});
const tr=$('.trackl');tr&&tr.insertAdjacentHTML('afterend','<p class="trackl" style="margin-top:4px">Season over? <button type="button" class="link" id="toRenew">Renew your registration</button></p>');
$('#toRenew').onclick=()=>{showPane('#fRenew');$('#rnOut').innerHTML='';$('#rnId').focus()};
function openRenew(){if(ME)return;showPane('#fRenew');$('#rnOut').innerHTML='';setTimeout(()=>$('#rnId').focus(),100)}
addEventListener('message',e=>{if(e.data&&e.data.afags==='openRenew'){try{sessionStorage.removeItem('afags_openrenew')}catch(x){}openRenew()}});
try{if(sessionStorage.getItem('afags_openrenew')){sessionStorage.removeItem('afags_openrenew');setTimeout(openRenew,200)}}catch(e){}
const FEE_RENEW={fencers:200,coaches:0,referees:0,clubs:0,districts:0};
fRenew.addEventListener('submit',e=>{e.preventDefault();const id=$('#rnId').value.trim().toUpperCase(),mob=$('#rnM').value.replace(/\D/g,'');fieldErr('#fRn',id?'':'Enter your AFAGS ID');if(!id)return;
  let hit=null,k=null;for(const kk in DB){const r=DB[kk].find(x=>(x.afagsId||'').toUpperCase()===id);if(r){hit=r;k=kk;break}}
  const out=$('#rnOut');if(!hit){out.innerHTML='<div class="alert e">No accredited member found with this AFAGS ID. Check the ID on your card.</div>';return}
  const mobOk=!mob||!(hit.mobile||(hit.app&&hit.app.mobile))||(hit.mobile||hit.app.mobile)===mob;if(!mobOk){out.innerHTML='<div class="alert e">The mobile number does not match our records.</div>';return}
  if(hit.status==='Blocked'){out.innerHTML='<div class="alert e">This AFAGS ID is blocked. Please contact the AFAGS office.</div>';return}
  if(hit.status!=='Approved'){out.innerHTML='<div class="alert e">This registration is not yet accredited.</div>';return}
  const fee=FEE_RENEW[k];
  out.innerHTML=`<div class="trk"><div class="trk-h"><b>${esc(hit.name)}</b><span class="st ${hit.renewed?'Approved':'Pending'}">${hit.renewed?'Renewed':'Renewal due'}</span></div><small>${META[k][1]} · ${esc(hit.afagsId)} · ${esc(hit.district)}</small>
    ${hit.renewed?`<p class="trk-r">Already renewed for ${SEASON_L}. Nothing more to do.</p>`:`<button type="button" class="btn pri" id="rnPay" style="margin-top:12px">${fee?`Pay ₹${fee} & Renew`:'Renew now (free)'}</button>`}</div>`;
  const pb=$('#rnPay');pb&&(pb.onclick=()=>renewPay(hit,k,fee))});
function renewDone(r,k,p){r.renewed=true;FLAGS[r.id]=Object.assign(FLAGS[r.id]||{},{renewed:SEASON_K});saveFlags();const L=store.get('afags_renewals')||[];L.unshift({id:r.id,afagsId:r.afagsId,name:r.name,district:r.district,key:k,amount:p?p.amount:0,txn:p?p.txn:'FREE',method:p?p.method:'—',at:Date.now()});store.set('afags_renewals',L.slice(0,5000));
  audit('renew',`${r.name} (${r.afagsId})${p?' ₹'+p.amount+' '+p.txn:''}`);$('#rnOut').innerHTML=`<div class="alert s">✅ Renewed for ${SEASON_L}.${p?` Receipt: <b>${esc(p.txn)}</b> · ₹${p.amount} via ${esc(p.method)}`:''}</div>`}
function renewPay(r,k,fee){if(!fee){renewDone(r,k,null);return}
  if(API.online&&API.cfg.payments){API.pay({amount:fee,purpose:'AFAGS renewal '+YEAR,ref:r.afagsId,name:r.name}).then(p=>renewDone(r,k,p)).catch(e=>toast(e.message));return}
  const {m,close}=mdOpen(`<div class="pay-h" style="display:flex;gap:10px;align-items:center"><span class="logo" style="width:40px;height:40px"></span><div><b style="font:800 18px var(--cond);text-transform:uppercase;color:var(--navy)">AFAGS renewal fee</b><small style="display:block;color:var(--mu)">${esc(r.name)} · ${esc(r.afagsId)}</small></div></div>
   <div class="pay-amt" style="margin-top:12px"><span>Amount payable</span><b>₹${fee}.00</b><small>Season ${SEASON_L}</small></div><div class="pay-demo">🧪 <b>Demo checkout</b> — no money is charged until the AFAGS server with Razorpay is connected.</div>
   <div class="pay-m">${['UPI','Card','Net Banking'].map((x,i)=>`<label><input type="radio" name="rpm" value="${x}" ${i?'':'checked'}><span class="pi">${['📱','💳','🏦'][i]}</span><span><b>${x}</b></span><em>›</em></label>`).join('')}</div><button class="btn pri" id="rpGo" style="margin-top:12px">Pay ₹${fee} securely</button>`);
  m.querySelector('#rpGo').onclick=()=>{const b=m.querySelector('#rpGo');b.disabled=true;b.innerHTML='<span class="spn"></span> Processing…';setTimeout(()=>{const method=(m.querySelector('[name=rpm]:checked')||{}).value||'UPI';close();renewDone(r,k,{amount:fee,txn:'RNW'+Date.now().toString(36).toUpperCase(),method,at:Date.now()})},1100)}}
/* password reset link from email: afags-portal.html#reset=TOKEN */
const RT=(location.hash.match(/reset=([\w-]{20,})/)||[])[1];
if(RT){setTimeout(()=>{showPane('#fReset')},100);fReset.addEventListener('submit',async e=>{e.preventDefault();const a=$('#rsP1').value,b=$('#rsP2').value,o=$('#rsOut');
  if(pwStrength(a)<4||a.length<10){o.innerHTML='<div class="alert e">Password is too weak.</div>';return}if(a!==b){o.innerHTML='<div class="alert e">Passwords do not match.</div>';return}
  try{await API.call('POST','/auth/reset',{token:RT,password:a});o.innerHTML='<div class="alert s">Password saved. You can sign in now.</div>';history.replaceState(null,'',location.pathname);setTimeout(()=>showPane('#fLogin'),1500)}catch(x){o.innerHTML=`<div class="alert e">${esc(x.message||'This link is invalid or has expired.')}</div>`}})}

/* ---------- server login ---------- */
/* 2-step login: password OK → 6-digit code from the authenticator app (or a one-time recovery code) */
function ask2fa(pre){return new Promise(done=>{const {m,close}=mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">2-step login</h3><p class="sd">Open your authenticator app (Google Authenticator, Microsoft Authenticator…) and type the 6-digit code for AFAGS. Lost your phone? Type a recovery code.</p>
  <div class="fld" style="margin-top:12px"><input id="tfC" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="123456" style="font:800 24px var(--mono,monospace);letter-spacing:6px;text-align:center"></div><div id="tfM"></div>
  <div class="mact" style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px"><button class="btn ghost" id="tfX">Cancel</button><button class="btn pri" id="tfGo">Verify</button></div>`);let fin=false;
  const inp=m.querySelector('#tfC');setTimeout(()=>inp.focus(),60);
  const go=async()=>{try{const j=await API.call('POST','/auth/2fa/login',{pre,code:inp.value.trim()});fin=true;close();done(j)}catch(e){m.querySelector('#tfM').innerHTML=`<div class="alert e" style="animation:none;margin-top:8px">${esc(e.message)}</div>`;inp.select();if(/expired/i.test(e.message)){fin=true;setTimeout(()=>{close();done(null)},1500)}}};
  m.querySelector('#tfGo').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};m.querySelector('#tfX').onclick=()=>{fin=true;close();done(null)}})}
async function serverLogin(u,p){const btn=$('#lBtn');btn.disabled=true;btn.innerHTML='<span class="spn"></span> Signing in…';
  try{let j=await API.call('POST','/auth/login',{username:u,password:p});
    if(j.need2fa){btn.disabled=false;btn.textContent='Login';j=await ask2fa(j.pre);if(!j)return;btn.disabled=true;btn.innerHTML='<span class="spn"></span> Signing in…'}
    API.setToken(j.token);if(j.user.role==='member'){await API.pullPublic().catch(()=>{});memberAccount(j.user)}else await API.pullAll();newSession(j.user.key);if(j.user.mustChange)sessionStorage.setItem('afags_must','1');location.reload()}
  catch(e){btn.disabled=false;btn.textContent='Login';drawCap();$('#pw').value='';alertBox('#lAlert','e',esc(e.message||'Login failed'))}}
if(sessionStorage.getItem('afags_must')){sessionStorage.removeItem('afags_must');setTimeout(()=>{location.hash='#settings';toast('Please set a new password now')},600)}

/* ---------- Upload Results (Tournaments) → website results + ranking points ---------- */
const RPTS={'Gold — 1st place':32,'Silver — 2nd place':26,'Bronze — 3rd place':20,'5th place':14,'6th place':14,'7th place':14,'8th place':14};
function viewResultsUpload(){const ev=CMS.get('events'),done=store.get('afags_resup')||[];
  $('#main').innerHTML=crumb('Upload Results',done.length+' uploaded')+`<div class="acc-int"><div><b>One upload updates everything</b><span>Upload a tournament's final standings (Excel .xlsx / .xls or CSV). AFAGS then publishes the medal table on the website <b>Results</b> page, adds ranking points to <b>State Rankings</b>, and — if ticked — creates participation & merit certificates.</span></div></div>
   <form class="panel cms-f" id="ruF" novalidate style="max-width:880px"><div class="cf-g"><label class="cf w1">Tournament<b class="rq">*</b><input name="t" list="ruE" maxlength="120"><datalist id="ruE">${ev.map(e=>`<option value="${esc(e.title)}">`).join('')}</datalist></label>
   <label class="cf">Level<b class="rq">*</b><select name="level"><option>State</option><option>National</option><option>International</option></select></label><label class="cf">Date<input name="date" type="date"></label><label class="cf">Venue<input name="venue" maxlength="80"></label>
   <div class="cf w1"><label>Result sheet<b class="rq">*</b></label><label class="drop" id="ruD"><input type="file" name="f" accept=".xlsx,.xls,.csv" hidden><span>📄 <b>Choose Excel / CSV file</b><small>Columns: Name, AFAGS ID, District, Weapon, Category, Position</small></span></label></div>
   <label class="sw2 cf w1"><input type="checkbox" name="cert" checked><span></span>Also generate participation & merit certificates</label><label class="sw2 cf w1"><input type="checkbox" name="news" checked><span></span>Also post a News story with the medal winners</label></div><div id="ruPv"></div><button class="btn nav" id="ruGo" disabled style="margin-top:12px">Publish results</button></form>
   <div class="panel" style="margin-top:16px"><h4>Points scale (per event)</h4><p class="sd">1st 32 · 2nd 26 · 3rd 20 · 5th–8th 14 · other finishers 4. Multiplied ×1 State, ×2 National, ×3 International.</p>${done.length?`<table class="tbl"><thead><tr><th>Tournament</th><th class="hm">Level</th><th>Rows</th><th class="hm">Uploaded</th></tr></thead><tbody>${done.slice(0,20).map(d=>`<tr><td>${esc(d.t)}</td><td class="hm">${esc(d.level)}</td><td>${d.n}</td><td class="hm">${fmt(d.at)}</td></tr>`).join('')}</tbody></table>`:''}</div>`;
  const f=$('#ruF'),drop=$('#ruD');let parsed=null;
  f.elements.t.onchange=()=>{const e=ev.find(x=>x.title===f.elements.t.value);if(e){f.elements.venue.value=e.venue||'';f.elements.date.value=e.start||'';if(e.level&&['State','National','International'].includes(e.level))f.elements.level.value=e.level}};
  const take=async file=>{parsed=null;$('#ruGo').disabled=true;try{const raw=await readSheet(file),r=mapRows(raw);if(r.err)throw new Error(r.err);if(!r.rows.length)throw new Error('No valid rows found');parsed=r;
      drop.querySelector('span').innerHTML=`📄 <b>${esc(file.name)}</b><small>${r.rows.length} rows · ${r.rows.filter(isMerit).length} placed · click to change</small>`;
      const grp={};r.rows.forEach(x=>{const g=(x.weapon||'—')+' · '+(x.category||'Open');grp[g]=(grp[g]||0)+1});
      $('#ruPv').innerHTML=`<div class="ub-sum">${Object.entries(grp).slice(0,8).map(([g,n])=>`<div><b>${n}</b><small>${esc(g)}</small></div>`).join('')}</div>${r.bad.length?`<p class="sd">${r.bad.length} rows skipped (invalid name).</p>`:''}`;$('#ruGo').disabled=false}
    catch(x){$('#ruPv').innerHTML=`<div class="alert e" style="animation:none">${esc(x.message||'Could not read the file')}</div>`}};
  f.elements.f.onchange=()=>take(f.elements.f.files[0]);['dragover','dragenter'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('on')}));['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('on')}));drop.addEventListener('drop',e=>take(e.dataTransfer.files[0]));
  f.onsubmit=e=>{e.preventDefault();const t=f.elements.t.value.trim(),level=f.elements.level.value,date=f.elements.date.value,venue=f.elements.venue.value.trim();if(t.length<3){toast('Enter the tournament name');return}if(!parsed)return;
    const grp={};parsed.rows.forEach(x=>{const g=(x.weapon||'')+'|'+(x.category||'');(grp[g]=grp[g]||[]).push(x)});
    const R=CMS.get('results').filter(x=>!(x.event===t&&x.date===date)),who=x=>x?`${x.name}${x.district?' ('+x.district+')':''}`:'—';
    Object.entries(grp).forEach(([g,L])=>{const [w,c]=g.split('|'),f1=p=>L.filter(x=>x.position===p);const br=f1('Bronze — 3rd place');
      R.unshift({id:'rs'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),event:t,date,level,weapon:['Foil','Épée','Sabre'].find(x=>x.toLowerCase()===String(w).toLowerCase().replace('epee','épée'))||w||'Foil',category:c||'Open',gold:who(f1('Gold — 1st place')[0]),silver:who(f1('Silver — 2nd place')[0]),bronze1:who(br[0]),bronze2:who(br[1])})});
    if(!CMS.set('results',R)){toast('Storage full — remove old results');return}
    const mult={State:1,National:2,International:3}[level]||1,P=(store.get('afags_rankpts')||[]).filter(x=>x.event!==t);
    parsed.rows.forEach(x=>P.push({name:x.name,afagsId:x.afagsId,district:x.district,weapon:x.weapon,category:x.category,event:t,date,pts:(RPTS[x.position]||4)*mult}));store.set('afags_rankpts',P);
    if(f.elements.cert.checked){const B=certBatches();B.unshift({id:'CB'+Date.now().toString(36),tournament:t,venue,date,at:Date.now(),rows:parsed.rows.map(r=>({...r,no:nextCertNo()}))});store.set('afags_certb',B)}
    const D=store.get('afags_resup')||[];D.unshift({t,level,n:parsed.rows.length,at:Date.now()});store.set('afags_resup',D.slice(0,200));
    if(f.elements.news&&f.elements.news.checked)publishStandings({t,level,date,venue,rows:parsed.rows,res:false,rank:false,cert:false,news:true,key:'upload:'+t+'|'+date});audit('results',`${t}: ${parsed.rows.length} rows${f.elements.cert.checked?' + certificates':''}`);toast('Results published — website and rankings updated');viewResultsUpload()}}
async function readSheet(file){if(file.size>5*1048576)throw new Error('File is larger than 5 MB');const buf=await file.arrayBuffer(),h=new Uint8Array(buf.slice(0,4));
  if(h[0]===0x50&&h[1]===0x4b)return readXlsx(buf);if(h[0]===0xD0&&h[1]===0xCF)return AFAGS_XLS.read(buf);if(/\.csv$/i.test(file.name)||file.type==='text/csv')return readCSV(new TextDecoder().decode(buf));throw new Error('Please upload an Excel (.xlsx / .xls) or CSV file')}
function rankFromPoints(){const P=store.get('afags_rankpts')||[];if(!P.length)return null;const agg={};P.forEach(x=>{const key=(x.afagsId||x.name)+'|'+x.weapon+'|'+x.category;const a=agg[key]=agg[key]||{name:x.name,afagsId:x.afagsId,district:x.district,weapon:x.weapon,cat:x.category,pts:0,ev:0};a.pts+=x.pts;a.ev++});return Object.values(agg).sort((a,b)=>b.pts-a.pts)}

/* ---------- clean start: remove all sample / demo data ---------- */
function clearSamples(){confirmBox({title:'Remove all sample data?',body:'All demo members, sample news / events / results / gallery, sample tournaments and certificates will be removed so only your real data remains. Your own entries, passwords and the audit log are kept. This cannot be undone — download a backup first.',ok:'Remove sample data',tone:'no'},()=>{
  store.set('afags_nosample',1);Object.keys(CMS.SCHEMA).forEach(c=>{const L=CMS.get(c);if(L.some(x=>x.sample))CMS.set(c,L.filter(x=>!x.sample))});
  store.set('afags_certb',certBatches().filter(b=>!b.sample));store.set('afags_upg',[]);store.del('afags_flags');audit('reset-data','sample data removed');toast('Sample data removed — reloading');setTimeout(()=>location.reload(),900)})}

/* ---------- dashboard: storage, backup and renewal reminders ---------- */
function dashExtras(){const use=lsUsage(),pct=Math.min(100,use/(5*1048576)*100),lb=store.get('afags_lastbackup')||0,days=lb?Math.floor((Date.now()-lb)/864e5):null,due=ME.canApprove?rows('fencers').filter(r=>r.status==='Approved'&&!r.renewed).length:0;
  const box=document.createElement('div');box.className='dx';box.innerHTML=`${ME.canApprove&&(days===null||days>=7)?`<div class="dx-i warn"><b>💾 ${days===null?'No backup yet':'Last backup '+days+' days ago'}</b><span>All data is in this browser${API.online?' and on the AFAGS server':''}. Download a backup regularly.</span><a class="btn sm2 nav" href="#settings">Back up now</a></div>`:''}
   ${!API.online?`<div class="dx-i ${pct>80?'warn':''}"><b>🗄 Browser storage ${pct.toFixed(0)}% used</b><div class="dx-bar"><i style="width:${pct}%"></i></div><span>${kb(use)} of ~5 MB. ${pct>80?'Almost full — remove old photos or move to the AFAGS server.':'Photos are compressed automatically.'}</span></div>`:'<div class="dx-i ok"><b>☁️ Connected to the AFAGS server</b><span>Data is saved centrally and backed up every night.</span></div>'}
   ${due?`<div class="dx-i"><b>🔁 ${due.toLocaleString('en-IN')} fencers due for renewal</b><span>Send them a renewal reminder.</span><a class="btn sm2 nav" href="#fencers?v=reminder">Send reminder</a></div>`:''}`;
  const c=$('#main .crumb');c&&c.nextElementSibling&&c.nextElementSibling.after(box)}

/* server mode: hide the offline demo login */
if(API.ready)API.ready.then(on=>{if(!on)return;const d=$('.demo');d&&(d.style.display='none');$$('.dqb').forEach(b=>b.onclick=()=>toast('Please sign in with your username and password'))});

function DBG(){return window.AFAGS_API&&AFAGS_API.online?'<div class="dbg live">☁️ <span><b>Live</b> — connected to the AFAGS server. Changes are saved centrally.</span></div>':'<div class="dbg">⚠️ <span><b>Demo mode</b> — data is stored in this browser only. Run the AFAGS server (afags-server kit) to share data across devices.</span></div>'}

/* ===== portal v7: Fencing Live Centre (pools, DE, referee scoring), event entries, annual report, setup checklist, 2FA ===== */
LABEL.live='Live Centre';LABEL.entries='Event Entries';
ICONS.live='<circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7"/>';
if(!ROLE_MENU.admin.includes('live'))ROLE_MENU.admin.splice(ROLE_MENU.admin.indexOf('reports'),0,'live');
if(!ROLE_MENU.district_unit.includes('live'))ROLE_MENU.district_unit.splice(ROLE_MENU.district_unit.indexOf('reports'),0,'live');
if(!ROLE_MENU.district_unit.includes('cms'))ROLE_MENU.district_unit.splice(ROLE_MENU.district_unit.indexOf('settings'),0,'cms');
SUB.live=[['Competitions',''],['Referee scoring','v=ref']];
if(!SUB.events.some(x=>x[1]==='v=entries'))SUB.events.push(['Event Entries','v=entries']);
if(!SUB.reports.some(x=>x[1]==='v=annual'))SUB.reports.push(['Annual Report','v=annual']);
const ONLINE=()=>!!(window.AFAGS_API&&AFAGS_API.online&&AFAGS_API.token());

/* ---------- live data ---------- */
function liveGet(){const v=store.get('afags_live');return v&&Array.isArray(v.comps)?v:{comps:[]}}
function livePutLocal(L){L.at=Date.now();if(window.AFAGS_API&&AFAGS_API.put)AFAGS_API.put('afags_live',JSON.stringify(L));else store.set('afags_live',L);try{parent!==window&&parent.postMessage({afags:'live'},'*')}catch(e){}}
async function liveSaveComp(c){const L=liveGet(),i=L.comps.findIndex(x=>x.id===c.id);if(i>=0)L.comps[i]=c;else L.comps.unshift(c);livePutLocal(L);
  if(ONLINE()){try{await AFAGS_API.call('PUT','/live/comp/'+encodeURIComponent(c.id),{comp:c})}catch(e){toast('Not saved on the server: '+e.message)}}}
async function liveDelComp(id){const L=liveGet();L.comps=L.comps.filter(x=>x.id!==id);livePutLocal(L);if(ONLINE()){try{await AFAGS_API.call('DELETE','/live/comp/'+encodeURIComponent(id))}catch(e){}}}
function boutRef(c,kind,i,j){return kind==='pool'?c.pools[i].bouts[j]:c.de.r[i][j]}
let boutQ=Promise.resolve();
function liveBout(cid,kind,i,j,patch){const L=liveGet(),c=L.comps.find(x=>x.id===cid);if(!c)return;Object.assign(boutRef(c,kind,i,j),patch,{at:Date.now()});livePutLocal(L);
  if(ONLINE())boutQ=boutQ.then(()=>AFAGS_API.call('POST','/live/bout',{cid,kind,i,j,patch}).catch(e=>toast('Score not saved on the server: '+e.message)))}
async function livePull(){if(!ONLINE())return;try{const j=await AFAGS_API.call('GET','/live');AFAGS_API.put('afags_live',JSON.stringify(j.live||{comps:[]}))}catch(e){}}
const fzOf=(c,id)=>(c.fencers||[]).find(f=>f.id===id)||null;
function bracketOrder(n){let o=[1,2];while(o.length<n){const m=o.length*2;o=o.flatMap(s=>[s,m+1-s])}return o}
function deVoid(c,r,k,side){/* true when that slot can never receive a fencer (a structural bye) */const de=c.de;if(r===0){const o=bracketOrder(de.size);return !de.seed[o[2*k+side]-1]}return deVoid(c,r-1,2*k+side,0)&&deVoid(c,r-1,2*k+side,1)}
function deSlots(c,r,k){const de=c.de;if(r===0){const o=bracketOrder(de.size);return [de.seed[o[2*k]-1]||null,de.seed[o[2*k+1]-1]||null]}
  const w=(rr,kk)=>{const b=de.r[rr][kk],[a,bb]=deSlots(c,rr,kk);if(a&&!bb)return deVoid(c,rr,kk,1)?a:null;if(bb&&!a)return deVoid(c,rr,kk,0)?bb:null;if(!a||!bb||!b||b.st!=='done')return null;return b.w==='a'?a:bb};return [w(r-1,2*k),w(r-1,2*k+1)]}
const roundName=n=>n===2?'Final':n===4?'Semi-final':n===8?'Quarter-final':'Table of '+n;
function rrOrder(n){const ids=[...Array(n).keys()];if(n%2)ids.push(-1);const m=ids.length,out=[];for(let r=0;r<m-1;r++){for(let i=0;i<m/2;i++){const a=ids[i],b=ids[m-1-i];if(a>=0&&b>=0)out.push(r%2?[b,a]:[a,b])}ids.splice(1,0,ids.pop())}return out}
const FIE_ORDER={4:[[1,4],[2,3],[1,3],[2,4],[3,4],[1,2]],5:[[1,2],[3,4],[5,1],[2,3],[5,4],[1,3],[2,5],[4,1],[3,5],[4,2]],6:[[1,2],[4,5],[2,3],[5,6],[3,1],[6,4],[2,5],[1,4],[5,3],[1,6],[4,2],[3,6],[5,1],[3,4],[6,2]],7:[[1,4],[2,5],[3,6],[7,1],[5,4],[2,3],[6,7],[5,1],[4,3],[6,2],[5,7],[3,1],[4,6],[7,2],[3,5],[1,6],[2,4],[7,3],[6,5],[1,2],[4,7]]};
function poolBoutOrder(n){return FIE_ORDER[n]?FIE_ORDER[n].map(([a,b])=>[a-1,b-1]):rrOrder(n)}
function poolResults(p){const R=p.f.map(id=>({id,v:0,m:0,ts:0,tr:0}));p.bouts.forEach(b=>{if(b.st!=='done')return;const A=R.find(x=>x.id===b.a),B=R.find(x=>x.id===b.b);if(!A||!B)return;A.m++;B.m++;A.ts+=b.sa;A.tr+=b.sb;B.ts+=b.sb;B.tr+=b.sa;(b.w==='a'?A:B).v++});
  R.forEach(r=>{r.ind=r.ts-r.tr;r.vm=r.m?r.v/r.m:0});return R}
function overallSeeding(c){const all=[];(c.pools||[]).forEach(p=>all.push(...poolResults(p)));all.sort((a,b)=>b.vm-a.vm||b.ind-a.ind||b.ts-a.ts||a.id.localeCompare(b.id));return all}
function finalRanking(c){const de=c.de,seed=de.seed,pos=id=>seed.indexOf(id),out=[];let rank=1;const R=de.r.length;
  const f=de.r[R-1][0],[fa,fb]=deSlots(c,R-1,0);if(f&&f.st==='done'){out.push({id:f.w==='a'?fa:fb,rank:1},{id:f.w==='a'?fb:fa,rank:2});rank=3}
  for(let r=R-2;r>=0;r--){const losers=[];de.r[r].forEach((b,k)=>{const [a,bb]=deSlots(c,r,k);if(!a||!bb||!b||b.st!=='done')return;losers.push(b.w==='a'?bb:a)});losers.sort((x,y)=>pos(x)-pos(y));
    const tie=r===R-2;losers.forEach((id,i)=>out.push({id,rank:tie?rank:rank+i}));rank+=losers.length}
  (c.elim||[]).forEach(id=>out.push({id,rank:rank++}));return out}
const isDone=c=>c.de&&c.de.r&&c.de.r[c.de.r.length-1][0]&&c.de.r[c.de.r.length-1][0].st==='done';

/* ---------- Live Centre: list ---------- */
function viewLive(v,cid){if(v==='ref')return viewReferee(cid);if(cid)return viewComp(cid);const L=liveGet().comps;
  $('#main').innerHTML=crumb('Live Centre',L.length+' competitions')+`<div class="acc-int"><div><b>Run competitions live</b><span>Create a competition, add fencers (from online entries, members, a pasted list or Excel), generate pools, score every bout on a phone or tablet, then the direct-elimination tableau. Spectators follow everything on the website <b>Live Centre</b>.</span></div></div>
  <div class="lv-h"><button class="btn nav" style="height:42px" id="lcNew">+ New competition</button><button class="btn ghost" style="height:42px" id="lcRef">🎛 Referee scoring</button><button class="btn ghost" style="height:42px" id="lcSite">View on website ↗</button></div>
  <div class="tblw">${L.length?`<table class="tbl"><thead><tr><th>Competition</th><th class="hm">Date</th><th>Fencers</th><th>Status</th><th>Action</th></tr></thead><tbody>${L.map(c=>`<tr><td><b>${esc(c.name)}</b><small style="display:block;color:var(--mu)">${esc([c.weapon,c.cat,c.venue].filter(Boolean).join(' · '))}</small></td><td class="hm">${c.date?fmtDs(c.date):'—'}</td><td>${(c.fencers||[]).length}</td><td><span class="st ${c.status==='done'?'Approved':c.status==='setup'?'Pending':'Verified'}">${{setup:'Setup',pools:'Pools',de:'Tableau',done:'Finished'}[c.status]}</span></td><td><div class="act"><button class="vw" data-oc="${esc(c.id)}">Open</button><button class="vw" data-ec="${esc(c.id)}">Edit</button>${ME.canApprove?`<button class="no" data-dc="${esc(c.id)}">Delete</button>`:''}</div></td></tr>`).join('')}</tbody></table>`:'<div class="empty">No competitions yet. Click “New competition”.</div>'}</div>`;
  $('#lcNew').onclick=()=>compForm();$$('[data-ec]').forEach(b=>b.onclick=()=>{const c=liveGet().comps.find(x=>x.id===b.dataset.ec);c&&compForm(c)});$('#lcRef').onclick=()=>location.hash='#live?v=ref';$('#lcSite').onclick=()=>goWebsite('#/live');
  $$('#main [data-oc]').forEach(b=>b.onclick=()=>location.hash='#live?c='+encodeURIComponent(b.dataset.oc));
  $$('#main [data-dc]').forEach(b=>b.onclick=()=>confirmBox({title:'Delete competition?',body:'All pools, bouts and scores of this competition will be removed.',ok:'Delete',tone:'no'},()=>{liveDelComp(b.dataset.dc);audit('live','deleted competition');route()}))}
function compForm(c){const ev=CMS.get('events'),isNew=!c;c=c||{id:'LC'+Date.now().toString(36),name:'',weapon:'Foil',cat:'Senior',gender:'Men',date:new Date().toISOString().slice(0,10),venue:'',pistes:4,poolSize:6,elimPct:0,status:'setup',fencers:[]};
  const {m,close}=mdOpen(`<form class="cms-f" novalidate><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy);margin-bottom:10px">${isNew?'New':'Edit'} competition</h3><div class="cf-g">
   <label class="cf w1">Event / Tournament name<input name="eventT" list="lcEvL" maxlength="120" autocomplete="off" value="${esc((ev.find(e=>e.id===c.eventId)||{}).title||c.eventTitle||'')}" placeholder="Type the tournament name, or pick one from the calendar"><datalist id="lcEvL">${ev.map(e=>`<option value="${esc(e.title)}">${esc([e.start,e.venue].filter(Boolean).join(' · '))}</option>`).join('')}</datalist><small class="sd" id="lcEvH" style="font-weight:600"></small></label>
   <label class="cf">Weapon<b class="rq">*</b><select name="weapon">${['Foil','Épée','Sabre'].map(w=>`<option ${w===c.weapon?'selected':''}>${w}</option>`).join('')}</select></label>
   <label class="cf">Category<b class="rq">*</b><select name="cat">${['U-10','U-12','U-14','U-17','U-20','Senior','Veteran','Open'].map(w=>`<option ${w===c.cat?'selected':''}>${w}</option>`).join('')}</select></label>
   <label class="cf">Gender<select name="gender">${['Men','Women','Mixed'].map(w=>`<option ${w===c.gender?'selected':''}>${w}</option>`).join('')}</select></label><label class="cf">Date<input type="date" name="date" value="${esc(c.date||'')}"></label>
   <label class="cf w1">Competition name<b class="rq">*</b><input name="name" maxlength="120" value="${esc(c.name)}" placeholder="e.g. State Championship 2026 — Men's Foil U-17"></label>
   <label class="cf">Start time<input type="time" name="time" value="${esc(c.time||'')}"></label><label class="cf">End date (if more than one day)<input type="date" name="end" value="${esc(c.end||'')}"></label>
   <label class="cf">Venue<input name="venue" maxlength="80" value="${esc(c.venue||'')}"></label>
   <label class="cf w1">Live stream link (YouTube, optional)<input name="stream" maxlength="200" inputmode="url" value="${esc(c.stream||'')}" placeholder="https://youtube.com/live/…"></label>
   <label class="cf w1">Notice for spectators (shown on the website, optional)<input name="notice" maxlength="200" value="${esc(c.notice||'')}" placeholder="e.g. Pools start 9:30 AM · Finals after lunch"></label>
   <label class="cf">Organiser / Technical Director<input name="org" maxlength="80" value="${esc(c.org||'')}"></label><label class="cf">Number of pistes<input name="pistes" inputmode="numeric" value="${c.pistes}"></label>
   ${isNew||c.status==='setup'?'':'<div class="cf w1"><div class="alert s" style="animation:none;margin:0">Pools are already made — weapon, pistes, pool size and elimination stay as they are. Name, dates, time, venue, stream and notice can still be changed.</div></div>'}
   <label class="cf">Pool size<select name="poolSize">${[5,6,7].map(n=>`<option ${+c.poolSize===n?'selected':''}>${n}</option>`).join('')}</select></label>
   <label class="cf">Eliminated after pools<select name="elimPct">${[0,20,25,30].map(n=>`<option value="${n}" ${+c.elimPct===n?'selected':''}>${n?n+'%':'None — all fencers go to the tableau'}</option>`).join('')}</select></label></div><div id="cfE"></div>
   <div style="display:flex;gap:10px;margin-top:14px"><button type="button" class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" style="flex:1.4">${isNew?'Create':'Save'}</button></div></form>`,true);
  const f=m.querySelector('form');m.querySelector('[data-c]').onclick=close;
  const evOf=()=>{const t=f.eventT.value.trim().toLowerCase();return t?ev.find(x=>String(x.title).trim().toLowerCase()===t):null};
  const hint=()=>{const e=evOf(),t=f.eventT.value.trim(),h=m.querySelector('#lcEvH');h.style.color=e?'#17803d':'#5b6478';h.textContent=e?`✓ Linked to the calendar event${e.start?' · '+e.start:''}${e.venue?' · '+e.venue:''}`:t?'✎ Written manually (not linked to a calendar event)':''};
  const auto=()=>{const e=evOf(),tt=f.eventT.value.trim();hint();if(e&&!f.venue.value)f.venue.value=e.venue||'';if(e&&f.date.value===new Date().toISOString().slice(0,10)&&e.start)f.date.value=e.start;if(!f.name.dataset.touched)f.name.value=`${e?e.title+' — ':tt?tt+' — ':''}${f.gender.value==='Mixed'?'':f.gender.value+"'s "}${f.weapon.value} ${f.cat.value}`};
  f.name.oninput=()=>f.name.dataset.touched=1;if(!isNew)f.name.dataset.touched=1;
  const locked=!isNew&&c.status!=='setup';if(locked)['weapon','cat','gender','pistes','poolSize','elimPct'].forEach(n=>{f[n].disabled=true});['weapon','cat','gender'].forEach(n=>f[n].onchange=auto);f.eventT.oninput=auto;f.eventT.onchange=auto;if(isNew)auto();else hint();
  f.onsubmit=e=>{e.preventDefault();const name=f.name.value.trim(),pi=parseInt(f.pistes.value),err=t=>{m.querySelector('#cfE').innerHTML=`<div class="alert e" style="animation:none">${t}</div>`};
    if(name.length<3||!(pi>=1&&pi<=40))return err('Enter a name and 1–40 pistes.');
    const st=f.stream.value.trim();if(st&&!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(st))return err('The live stream must be a YouTube link (https://youtube.com/… or https://youtu.be/…).');
    if(f.end.value&&f.date.value&&f.end.value<f.date.value)return err('End date is before the start date.');
    const le=evOf(),base={name,eventId:le?le.id:'',eventTitle:f.eventT.value.trim().slice(0,120),date:f.date.value,end:f.end.value,time:f.time.value,venue:f.venue.value.trim(),stream:st,notice:f.notice.value.trim().slice(0,200),org:f.org.value.trim().slice(0,80)};
    Object.assign(c,base,locked?{}:{weapon:f.weapon.value,cat:f.cat.value,gender:f.gender.value,pistes:pi,poolSize:+f.poolSize.value,elimPct:+f.elimPct.value});
    liveSaveComp(c);audit('live',(isNew?'created ':'edited ')+name);close();location.hash='#live?c='+encodeURIComponent(c.id);route()}}

/* ---------- competition view ---------- */
let LCTAB={};
function viewComp(id){const c=liveGet().comps.find(x=>x.id===id);if(!c){location.hash='#live';return}$('#tbTitle').textContent='Live Centre';
  const tab=LCTAB[id]||({setup:'fencers',pools:'pools',de:'de',done:'final'}[c.status]);const steps=[['fencers','1 · Fencers'],['pools','2 · Pools'],['de','3 · Tableau'],['final','4 · Results']];
  $('#main').innerHTML=crumb('Live Centre',esc(c.name))+`<div class="panel lc-hd"><div><h3>${esc(c.name)}</h3><p class="sd">${esc([c.weapon,c.gender,c.cat,c.venue].filter(Boolean).join(' · '))}${c.date?' · '+fmtDs(c.date)+(c.end&&c.end!==c.date?' – '+fmtDs(c.end):''):''}${c.time?' · '+esc(c.time):''} · ${c.pistes} pistes</p>${c.notice?`<p class="sd" style="margin-top:4px">📢 ${esc(c.notice)}</p>`:''}${c.stream?'<p class="sd" style="margin-top:2px">📺 Live stream linked</p>':''}</div><div class="lc-hb"><button class="btn ghost" id="lcEd">✏️ Edit details</button><button class="btn ghost" id="lcScore">🎛 Scoring</button><button class="btn ghost" id="lcWeb">Website ↗</button><a class="btn ghost" href="#live">‹ All</a></div></div>
   <div class="cms-tabs">${steps.map(([k,l])=>`<a href="#" data-tb="${k}" class="${k===tab?'on':''}">${l}</a>`).join('')}</div><div id="lcB"></div>`;
  $$('[data-tb]').forEach(a=>a.onclick=e=>{e.preventDefault();LCTAB[id]=a.dataset.tb;viewComp(id)});
  $('#lcEd').onclick=()=>compForm(c);$('#lcWeb').onclick=()=>goWebsite('#/live');$('#lcScore').onclick=()=>location.hash='#live?v=ref&c='+encodeURIComponent(id);
  ({fencers:tabFencers,pools:tabPools,de:tabDE,final:tabFinal})[tab](c)}
function tabFencers(c){const F=c.fencers||[],locked=c.status!=='setup';
  $('#lcB').innerHTML=`${locked?'<div class="alert s" style="animation:none">Pools have been created — the fencer list is locked. To change it, reset the pools.</div>':''}
   <div class="lv-h"><button class="btn nav" style="height:40px;font-size:12px" data-add="entries" ${locked?'disabled':''}>+ From online entries</button><button class="btn ghost" style="height:40px;font-size:12px" data-add="members" ${locked?'disabled':''}>+ Registered fencers</button><button class="btn ghost" style="height:40px;font-size:12px" data-add="paste" ${locked?'disabled':''}>+ Paste list</button><label class="btn ghost" style="height:40px;font-size:12px;cursor:pointer;${locked?'opacity:.5;pointer-events:none':''}">⬆ Excel / CSV<input type="file" id="lcX" accept=".xlsx,.xls,.csv" hidden></label><button class="btn ghost" style="height:40px;font-size:12px" id="lcSeed" ${locked?'disabled':''}>⇅ Seed by ranking</button></div>
   <div class="tblw">${F.length?`<table class="tbl"><thead><tr><th style="width:50px">Seed</th><th>Fencer</th><th class="hm">Club / District</th><th class="hm">AFAGS ID</th><th></th></tr></thead><tbody>${F.map((f,i)=>`<tr><td><b>${i+1}</b></td><td><b>${esc(f.name)}</b></td><td class="hm">${esc(f.club||'')}</td><td class="hm"><small>${esc(f.afagsId||'—')}</small></td><td>${locked?'':`<div class="act"><button class="vw" data-up="${i}" ${i?'':'disabled'}>↑</button><button class="no" data-rm="${i}">✕</button></div>`}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No fencers yet. Add them with the buttons above.</div>'}</div>
   ${!locked&&F.length>=3?`<div class="panel" style="margin-top:14px"><h4>Ready to start?</h4><p class="sd">${F.length} fencers → ${Math.ceil(F.length/c.poolSize)} pool(s) of up to ${c.poolSize}, on ${c.pistes} piste(s). Fencers are spread across pools by seed (snake) and by club where possible.</p><button class="btn nav" id="lcPools">Generate pools ›</button></div>`:''}`;
  const save=()=>{liveSaveComp(c);tabFencers(c)};const add=list=>{let n=0;list.forEach(x=>{if(!x.name)return;if(F.some(f=>(x.afagsId&&f.afagsId===x.afagsId)||f.name.toLowerCase()===x.name.toLowerCase()))return;F.push({id:'F'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:x.name,club:x.club||x.district||'',afagsId:x.afagsId||''});n++});c.fencers=F;save();toast(n+' fencer(s) added')};
  $$('[data-rm]').forEach(b=>b.onclick=()=>{F.splice(+b.dataset.rm,1);save()});$$('[data-up]').forEach(b=>b.onclick=()=>{const i=+b.dataset.up;[F[i-1],F[i]]=[F[i],F[i-1]];save()});
  $$('[data-add]').forEach(b=>b.onclick=()=>{const k=b.dataset.add;
    if(k==='entries'){const E=(store.get('afags_entries')||[]).filter(x=>x.status!=='Cancelled'&&(!c.eventId||x.eventId===c.eventId)&&String(x.weapon).toLowerCase().replace('epee','épée')===c.weapon.toLowerCase()&&(!c.cat||x.category===c.cat));
      if(!E.length){toast(c.eventId?'No online entries for this event, weapon and category yet':'Link the competition to a calendar event first (Edit)');return}add(E.map(x=>({name:x.name,club:x.district,afagsId:x.afagsId})))}
    if(k==='members'){const A=DB.fencers.filter(r=>r.status==='Approved'&&(!c.weapon||r.weapon===c.weapon));const {m,close}=mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">Add registered fencers</h3><p class="sd">${esc(c.weapon)} · accredited members</p><input id="amQ" placeholder="Search name, district or AFAGS ID" style="width:100%;height:42px;border-radius:12px;border:1.5px solid #dbe3f0;padding:0 12px"><div id="amL" style="max-height:340px;overflow:auto;margin-top:10px"></div><div style="display:flex;gap:10px;margin-top:12px"><button class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" id="amGo" style="flex:1.4">Add selected</button></div>`,true);
      const draw=()=>{const q=m.querySelector('#amQ').value.toLowerCase();m.querySelector('#amL').innerHTML=A.filter(r=>!q||(r.name+r.district+(r.afagsId||'')).toLowerCase().includes(q)).slice(0,80).map(r=>`<label class="am-r"><input type="checkbox" value="${esc(r.id)}"> <b>${esc(r.name)}</b> <small>${esc(r.district)} · ${esc(r.cat||'')} · ${esc(r.afagsId||'')}</small></label>`).join('')||'<p class="sd">No match.</p>'};
      m.querySelector('#amQ').oninput=draw;draw();m.querySelector('[data-c]').onclick=close;m.querySelector('#amGo').onclick=()=>{const ids=[...m.querySelectorAll('#amL input:checked')].map(x=>x.value);close();add(A.filter(r=>ids.includes(r.id)).map(r=>({name:r.name,club:r.district,afagsId:r.afagsId})))}}
    if(k==='paste'){const {m,close}=mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">Paste fencer list</h3><p class="sd">One fencer per line: <b>Name, Club or District, AFAGS ID</b> (club and ID are optional). Order = seeding.</p><textarea id="ptT" rows="10" style="width:100%;border-radius:12px;border:1.5px solid #dbe3f0;padding:10px;font:inherit"></textarea><div style="display:flex;gap:10px;margin-top:12px"><button class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" id="ptGo" style="flex:1.4">Add</button></div>`,true);
      m.querySelector('[data-c]').onclick=close;m.querySelector('#ptGo').onclick=()=>{const L=m.querySelector('#ptT').value.split(/\n+/).map(l=>l.split(/[,\t]/).map(x=>x.trim())).filter(x=>/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(x[0]||'')).map(x=>({name:x[0],club:x[1]||'',afagsId:(x[2]||'').toUpperCase()}));close();add(L)}}});
  const fx=$('#lcX');fx&&(fx.onchange=async()=>{try{const raw=await readSheet(fx.files[0]),r=mapRows(raw);if(r.err)throw new Error(r.err);add(r.rows.map(x=>({name:x.name,club:x.district,afagsId:x.afagsId})))}catch(e){toast(e.message||'Could not read the file')}});
  const sd=$('#lcSeed');sd&&(sd.onclick=()=>{const R=rankFromPoints()||[];const pts=f=>{const x=R.find(r=>(f.afagsId&&r.afagsId===f.afagsId)||(r.name||'').toLowerCase()===f.name.toLowerCase());return x?x.pts:0};F.sort((a,b)=>pts(b)-pts(a));save();toast('Seeded by ranking points')});
  const gp=$('#lcPools');gp&&(gp.onclick=()=>{makePools(c);liveSaveComp(c);audit('live','pools created — '+c.name);LCTAB[c.id]='pools';viewComp(c.id)})}
function makePools(c){const F=c.fencers,np=Math.ceil(F.length/c.poolSize),pools=[...Array(np)].map((_,i)=>({piste:String(i%c.pistes+1),f:[],bouts:[]}));
  F.forEach((f,i)=>{const row=Math.floor(i/np),idx=row%2?np-1-(i%np):i%np;let t=idx;/* avoid same club in a pool when possible */for(let k=0;k<np;k++){const cand=row%2?(idx-k+np)%np:(idx+k)%np;const p=pools[cand];if(p.f.length<Math.ceil(F.length/np)&&!(f.club&&p.f.some(id=>fzOf(c,id).club===f.club))){t=cand;break}}if(pools[t].f.length>=Math.ceil(F.length/np))t=pools.findIndex(p=>p.f.length<Math.ceil(F.length/np));pools[t].f.push(f.id)});
  pools.forEach(p=>{p.bouts=poolBoutOrder(p.f.length).map(([a,b])=>({a:p.f[a],b:p.f[b],sa:0,sb:0,st:'wait'}))});c.pools=pools;c.status='pools';c.de=null;c.final=null;c.elim=[]}
function tabPools(c){if(!c.pools||!c.pools.length){$('#lcB').innerHTML='<div class="empty">Pools are not created yet — add fencers and click “Generate pools”.</div>';return}
  const done=c.pools.every(p=>p.bouts.every(b=>b.st==='done')),left=c.pools.reduce((s,p)=>s+p.bouts.filter(b=>b.st!=='done').length,0);
  $('#lcB').innerHTML=`<div class="lv-h"><span class="sd">${left?left+' bouts left':'All pool bouts finished'}</span>${ME.canApprove&&c.status==='pools'?'<button class="btn ghost" style="height:38px;font-size:12px;margin-left:auto" id="lcReset">Reset pools</button>':''}</div>
   <div class="lc-pools">${c.pools.map((p,pi)=>{const R=poolResults(p);return `<div class="panel"><h4>Pool ${pi+1} · Piste ${esc(p.piste)}</h4><table class="tbl lc-pt"><thead><tr><th>#</th><th>Fencer</th><th>V</th><th>Ind</th><th>TS</th></tr></thead><tbody>${p.f.map((id,i)=>{const r=R.find(x=>x.id===id);return `<tr><td>${i+1}</td><td>${esc(fzOf(c,id).name)}<small style="display:block;color:var(--mu)">${esc(fzOf(c,id).club||'')}</small></td><td>${r.v}</td><td>${r.ind>0?'+':''}${r.ind}</td><td>${r.ts}</td></tr>`}).join('')}</tbody></table>
    <div class="lc-bl">${p.bouts.map((b,bi)=>`<button class="lc-bt ${b.st}" data-sb="${pi}.${bi}"><span>${bi+1}</span><b>${esc(fzOf(c,b.a).name.split(' ')[0])} <em>${b.st==='wait'?'–':b.sa+'–'+b.sb}</em> ${esc(fzOf(c,b.b).name.split(' ')[0])}</b>${b.st==='live'?'<i>LIVE</i>':''}</button>`).join('')}</div></div>`}).join('')}</div>
   ${done&&c.status==='pools'?`<div class="panel" style="margin-top:14px"><h4>Pools finished</h4><p class="sd">${c.elimPct?`Bottom ${c.elimPct}% are eliminated. `:''}The tableau is seeded from the pool results (victories ÷ bouts, indicator, hits scored).</p><button class="btn nav" id="lcDE">Create tableau ›</button></div>`:''}`;
  $$('[data-sb]').forEach(b=>b.onclick=()=>{const [pi,bi]=b.dataset.sb.split('.').map(Number);openScoring(c.id,'pool',pi,bi)});
  const rs=$('#lcReset');rs&&(rs.onclick=()=>confirmBox({title:'Reset pools?',body:'All pool scores will be cleared and the fencer list unlocked.',ok:'Reset',tone:'no'},()=>{c.pools=[];c.status='setup';c.de=null;liveSaveComp(c);LCTAB[c.id]='fencers';viewComp(c.id)}));
  const de=$('#lcDE');de&&(de.onclick=()=>{const S=overallSeeding(c).map(x=>x.id),keep=Math.max(2,Math.ceil(S.length*(1-(c.elimPct||0)/100)));const q=S.slice(0,keep);let size=2;while(size<q.length)size*=2;
    c.elim=S.slice(keep);c.de={size,seed:q,r:[]};for(let n=size;n>=2;n/=2)c.de.r.push([...Array(n/2)].map((_,k)=>({sa:0,sb:0,st:'wait',piste:String(k%c.pistes+1)})));c.status='de';liveSaveComp(c);audit('live','tableau created — '+c.name);LCTAB[c.id]='de';viewComp(c.id)})}
function tabDE(c){if(!c.de){$('#lcB').innerHTML='<div class="empty">The tableau is created after all pool bouts are finished.</div>';return}const de=c.de;
  $('#lcB').innerHTML=`<div class="lc-br">${de.r.map((round,ri)=>`<div class="lc-col"><h5>${roundName(de.size>>ri)}</h5>${round.map((b,bi)=>{const [a,bb]=deSlots(c,ri,bi),fa=fzOf(c,a),fb=fzOf(c,bb),byeA=!a&&deVoid(c,ri,bi,0),byeB=!bb&&deVoid(c,ri,bi,1),ready=fa&&fb;
    return `<button class="lc-m ${b.st} ${ready?'':'off'}" data-db="${ri}.${bi}" ${ready?'':'disabled'}><div class="lc-s ${b.st==='done'&&b.w==='a'?'w':''}"><span>${fa?esc(fa.name):byeA?'<i>bye</i>':'—'}</span><b>${b.st!=='wait'&&ready?b.sa:''}</b></div><div class="lc-s ${b.st==='done'&&b.w==='b'?'w':''}"><span>${fb?esc(fb.name):byeB?'<i>bye</i>':'—'}</span><b>${b.st!=='wait'&&ready?b.sb:''}</b></div><small>Piste ${esc(b.piste||'')}${b.st==='live'?' · LIVE':''}</small></button>`}).join('')}</div>`).join('')}</div>
   ${isDone(c)&&c.status!=='done'?'<div class="panel" style="margin-top:14px"><h4>Final bout finished 🏆</h4><button class="btn nav" id="lcFin">Finish competition ›</button></div>':''}`;
  $$('[data-db]').forEach(b=>b.onclick=()=>{const [ri,bi]=b.dataset.db.split('.').map(Number);openScoring(c.id,'de',ri,bi)});
  const fi=$('#lcFin');fi&&(fi.onclick=()=>{c.final=finalRanking(c);c.status='done';liveSaveComp(c);audit('live','finished — '+c.name);LCTAB[c.id]='final';viewComp(c.id)})}
function tabFinal(c){if(c.status!=='done'){$('#lcB').innerHTML='<div class="empty">Final results appear when the final bout is finished.</div>';return}const ev=CMS.get('events').find(e=>e.id===c.eventId);
  $('#lcB').innerHTML=`<div class="cards2" style="grid-template-columns:1.2fr 1fr;margin-top:0"><div class="panel"><h4>🏆 Final ranking</h4><table class="tbl"><tbody>${c.final.map(x=>`<tr><td style="width:50px"><span class="rk ${x.rank<=3?'m'+(x.rank-1):''}">${x.rank}</span></td><td><b>${esc(fzOf(c,x.id).name)}</b><small style="display:block;color:var(--mu)">${esc(fzOf(c,x.id).club||'')}</small></td></tr>`).join('')}</tbody></table></div>
   <form class="panel" id="pubF"><h4>Publish</h4><p class="sd">${c.published?'Already published on '+fmt(c.published)+'. Publishing again replaces the earlier results for this competition.':'One click updates the website and the admin records.'}</p>
   <label class="sw2"><input type="checkbox" name="res" checked><span></span>Website Results page (medal table)</label><label class="sw2"><input type="checkbox" name="rank" checked><span></span>State ranking points</label><label class="sw2"><input type="checkbox" name="cert" checked><span></span>Participation & merit certificates</label><label class="sw2"><input type="checkbox" name="news" checked><span></span>News story with the podium</label>
   <label class="sf">Level (for ranking points)<select name="level">${['State','National','International'].map(l=>`<option ${ev&&ev.level===l?'selected':''}>${l}</option>`).join('')}</select></label><button class="btn nav" style="margin-top:10px">Publish results</button><button type="button" class="btn ghost" id="pubCsv" style="margin-top:10px">⬇ CSV</button></form></div>`;
  $('#pubCsv').onclick=()=>dlCSV([['Rank','Name','Club','AFAGS ID'],...c.final.map(x=>[x.rank,fzOf(c,x.id).name,fzOf(c,x.id).club,fzOf(c,x.id).afagsId])],`afags-${c.id}-results.csv`);
  $('#pubF').onsubmit=e=>{e.preventDefault();const f=e.target,pos=r=>r===1?'Gold — 1st place':r===2?'Silver — 2nd place':r===3?'Bronze — 3rd place':r<=8?r+'th place':'';
    const rows=c.final.map(x=>{const fz=fzOf(c,x.id);return {name:fz.name,afagsId:fz.afagsId||'',district:fz.club||'',weapon:c.weapon,category:c.cat,position:pos(x.rank)}});
    publishStandings({t:c.name,level:f.level.value,date:c.date,venue:c.venue,rows,res:f.res.checked,rank:f.rank.checked,cert:f.cert.checked,news:f.news.checked,key:'live:'+c.id});c.published=Date.now();liveSaveComp(c);toast('Results published');tabFinal(c)}}
function publishStandings(o){const who=x=>x?`${x.name}${x.district?' ('+x.district+')':''}`:'—',p=n=>o.rows.filter(x=>x.position===n);const br=p('Bronze — 3rd place');
  if(o.res){const R=CMS.get('results').filter(x=>x.src!==o.key);R.unshift({id:'rs'+Date.now().toString(36),src:o.key,event:o.t,date:o.date,level:o.level,weapon:o.rows[0]?o.rows[0].weapon:'',category:o.rows[0]?o.rows[0].category:'',gold:who(p('Gold — 1st place')[0]),silver:who(p('Silver — 2nd place')[0]),bronze1:who(br[0]),bronze2:who(br[1])});CMS.set('results',R)}
  if(o.rank){const mult={State:1,National:2,International:3}[o.level]||1,P=(store.get('afags_rankpts')||[]).filter(x=>x.src!==o.key);o.rows.forEach(x=>P.push({src:o.key,name:x.name,afagsId:x.afagsId,district:x.district,weapon:x.weapon,category:x.category,event:o.t,date:o.date,pts:(RPTS[x.position]||4)*mult}));store.set('afags_rankpts',P)}
  if(o.cert){const B=certBatches().filter(b=>b.src!==o.key);B.unshift({id:'CB'+Date.now().toString(36),src:o.key,tournament:o.t,venue:o.venue,date:o.date,at:Date.now(),rows:o.rows.map(r=>({...r,no:nextCertNo()}))});store.set('afags_certb',B)}
  if(o.news){const N=CMS.get('news').filter(n=>n.src!==o.key),g=p('Gold — 1st place')[0],s=p('Silver — 2nd place')[0];
    N.unshift({id:'nw'+Date.now().toString(36),src:o.key,title:`Results: ${o.t}`,date:o.date||new Date().toISOString().slice(0,10),cat:'Result',summary:g?`${g.name}${g.district?' ('+g.district+')':''} won gold${s?`, ${s.name} took silver`:''}${br.length?` and ${br.map(x=>x.name).join(' & ')} bronze`:''}.`:`Final results of ${o.t}.`,
      body:`Final ranking — ${o.t}${o.venue?', '+o.venue:''}.\n\n`+o.rows.slice(0,8).map((x,i)=>`${x.position||'Rank '+(i+1)}: ${x.name}${x.district?' ('+x.district+')':''}`).join('\n')+`\n\nFull results, pools and the tableau are on the Live Centre.`,status:'Published',pin:'No',breaking:'No',author:ME.key});CMS.set('news',N)}
  audit('results',`${o.t}: ${o.rows.length} fencers published`)}

/* ---------- scoring panel (referee / table official) ---------- */
let SCT=null;
function openScoring(cid,kind,i,j){const get=()=>{const c=liveGet().comps.find(x=>x.id===cid);if(!c)return {};const b=boutRef(c,kind,i,j);const [a,bb]=kind==='pool'?[b.a,b.b]:deSlots(c,i,j);return {c,b,fa:fzOf(c,a),fb:fzOf(c,bb)}};
  let {c,b,fa,fb}=get();if(!fa||!fb){toast('Both fencers are not known yet');return}const to=kind==='pool'?5:15,dur=180000;
  const m=document.createElement('div');m.className='md sc-md';document.body.appendChild(m);
  const save=p=>{liveBout(cid,kind,i,j,p);({c,b,fa,fb}=get());draw()};
  const t=()=>{let x=b.t==null?dur:b.t;if(b.run)x-=Date.now()-b.run;return Math.max(0,x)};
  const fmtT=ms=>{const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
  const cards=L=>(L||[]).map(x=>`<i class="cd ${x}"></i>`).join('');
  function draw(){const done=b.st==='done';m.innerHTML=`<div class="sc-c"><div class="sc-top"><span>${esc(c.name)} · ${kind==='pool'?'Pool '+(i+1)+' · Bout '+(j+1):roundName(c.de.size>>i)} · Piste ${esc(kind==='pool'?c.pools[i].piste:(b.piste||''))}</span><button class="md-x" data-x aria-label="Close">✕</button></div>
   <div class="sc-row"><div class="sc-side a"><small>${esc(fa.club||'')}</small><b>${esc(fa.name)}</b><div class="sc-s">${b.sa}</div><div class="sc-bt"><button data-p="a+1" ${done?'disabled':''}>+1</button><button data-p="a-1" ${done?'disabled':''}>−1</button></div><div class="sc-cards">${cards(b.ca)}</div><div class="sc-cb"><button data-c="a.y" ${done?'disabled':''}>🟨</button><button data-c="a.r" ${done?'disabled':''}>🟥</button><button data-c="a.k" ${done?'disabled':''}>⬛</button></div></div>
    <div class="sc-mid"><div class="sc-t ${b.run?'run':''}" id="scT">${fmtT(t())}</div><button class="btn ${b.run?'':'nav'}" data-t="toggle" ${done?'disabled':''}>${b.run?'⏸ Stop':'▶ Start'}</button><div class="sc-ms"><button data-t="reset" ${done?'disabled':''}>⟲ ${kind==='pool'?'3:00':'3:00'}</button><button data-t="1m" ${done?'disabled':''}>1:00</button><button data-t="per" ${done||kind==='pool'?'disabled':''}>Period ${b.per||1}</button></div>${c.weapon==='Épée'?`<button class="btn ghost" data-p="double" ${done?'disabled':''}>Double touch</button>`:''}<button class="btn ghost" data-pri ${done?'disabled':''}>Priority${b.pri?': '+esc((b.pri==='a'?fa:fb).name.split(' ')[0]):''}</button><small>Target: ${to} touches · Space = start/stop</small></div>
    <div class="sc-side b"><small>${esc(fb.club||'')}</small><b>${esc(fb.name)}</b><div class="sc-s">${b.sb}</div><div class="sc-bt"><button data-p="b+1" ${done?'disabled':''}>+1</button><button data-p="b-1" ${done?'disabled':''}>−1</button></div><div class="sc-cards">${cards(b.cb)}</div><div class="sc-cb"><button data-c="b.y" ${done?'disabled':''}>🟨</button><button data-c="b.r" ${done?'disabled':''}>🟥</button><button data-c="b.k" ${done?'disabled':''}>⬛</button></div></div></div>
   <div class="sc-foot">${done?`<div class="alert s" style="animation:none;flex:1">Finished — winner <b>${esc((b.w==='a'?fa:fb).name)}</b></div>${ME.canApprove?'<button class="btn ghost" data-reopen>Re-open bout</button>':''}`:`<button class="btn ghost" data-x>Close (scores are saved)</button><button class="btn pri" data-end>End bout ✓</button>`}</div></div>`;
   m.querySelectorAll('[data-x]').forEach(x=>x.onclick=close);
   m.querySelectorAll('[data-p]').forEach(x=>x.onclick=()=>{const v=x.dataset.p;const sa=b.sa+(v==='a+1'||v==='double'?1:v==='a-1'?-1:0),sb=b.sb+(v==='b+1'||v==='double'?1:v==='b-1'?-1:0);if(sa<0||sb<0)return;
     const p={sa:Math.min(sa,to),sb:Math.min(sb,to),st:'live'};if(b.run&&(v.endsWith('+1')||v==='double')){p.t=t();p.run=null}save(p);if(p.sa>=to||p.sb>=to)setTimeout(endBout,150)});
   m.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{const [s,k]=x.dataset.c.split('.'),key='c'+s,L=(b[key]||[]).concat(k),o=s==='a'?'b':'a',p={[key]:L,st:'live'};
     if(k==='y'&&(b[key]||[]).includes('y')){L[L.length-1]='r'}/* second yellow = red */if(L[L.length-1]==='r'){p['s'+o]=Math.min(to,b['s'+o]+1)}if(k==='k'){p.st='done';p.w=o;p.run=null;p.t=t()}save(p);if(k==='k')toast('Black card — bout awarded to '+(o==='a'?fa:fb).name)});
   m.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{const v=x.dataset.t;if(v==='toggle')save(b.run?{t:t(),run:null,st:'live'}:{run:Date.now(),t:t(),st:'live'});if(v==='reset')save({t:dur,run:null});if(v==='1m')save({t:60000,run:null});if(v==='per')save({per:Math.min(3,(b.per||1)+1),t:dur,run:null})});
   const pr=m.querySelector('[data-pri]');pr&&(pr.onclick=()=>save({pri:Math.random()<.5?'a':'b'}));
   const en=m.querySelector('[data-end]');en&&(en.onclick=endBout);const ro=m.querySelector('[data-reopen]');ro&&(ro.onclick=()=>save({st:'live',w:null}))}
  function endBout(){({c,b,fa,fb}=get());if(b.st==='done')return;let w=b.sa>b.sb?'a':b.sb>b.sa?'b':b.pri||'';
    if(!w){toast('Scores are level — set priority (one extra minute) or add the deciding touch');return}
    if(b.sa<to&&b.sb<to&&t()>0&&!confirm('Time is not over and nobody has reached '+to+'. End the bout now?'))return;
    save({st:'done',w,run:null,t:t()});audit('live',`bout ${fa.name} ${b.sa}–${b.sb} ${fb.name}`);setTimeout(close,500)}
  function close(){clearInterval(SCT);document.removeEventListener('keydown',key);m.remove();route()}
  const key=e=>{if(e.code==='Space'&&b.st!=='done'&&!e.target.closest('input,textarea')){e.preventDefault();m.querySelector('[data-t="toggle"]').click()}};document.addEventListener('keydown',key);
  clearInterval(SCT);SCT=setInterval(()=>{const el=m.querySelector('#scT');if(el)el.textContent=fmtT(t());if(b.run&&t()<=0){save({t:0,run:null});toast('Time!')}},250);
  draw()}

/* ---------- referee view (tablet) ---------- */
function viewReferee(cid){const L=liveGet().comps.filter(c=>c.status==='pools'||c.status==='de');const c=L.find(x=>x.id===cid)||L[0];$('#tbTitle').textContent='Referee scoring';
  if(!c){$('#main').innerHTML=crumb('Referee scoring')+'<div class="empty">No competition is running. Create one in Live Centre › Competitions and generate the pools.</div>';return}
  const pistes=[...Array(+c.pistes||1)].map((_,i)=>String(i+1)),pis=sessionStorage.getItem('afags_piste')||'1';
  const todo=[];if(c.status==='pools')c.pools.forEach((p,pi)=>{if(p.piste!==pis)return;p.bouts.forEach((b,bi)=>{if(b.st!=='done')todo.push({kind:'pool',i:pi,j:bi,a:b.a,b:b.b,st:b.st,label:'Pool '+(pi+1)+' · Bout '+(bi+1)})})});
  if(c.status==='de')c.de.r.forEach((r,ri)=>r.forEach((b,bi)=>{if(b.piste!==pis||b.st==='done')return;const [a,bb]=deSlots(c,ri,bi);if(a&&bb)todo.push({kind:'de',i:ri,j:bi,a,b:bb,st:b.st,label:roundName(c.de.size>>ri)})}));
  $('#main').innerHTML=crumb('Referee scoring',esc(c.name))+`<div class="panel"><div class="lv-h" style="margin:0"><label class="sf" style="margin:0;flex:1">Competition<select id="rfC">${L.map(x=>`<option value="${esc(x.id)}" ${x.id===c.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label class="sf" style="margin:0;width:160px">My piste<select id="rfP">${pistes.map(p=>`<option ${p===pis?'selected':''}>${p}</option>`).join('')}</select></label></div></div>
   <div class="rf-l">${todo.length?todo.map((x,n)=>`<button class="rf-b ${x.st}" data-rf="${n}"><small>${esc(x.label)}${x.st==='live'?' · LIVE':''}</small><b>${esc(fzOf(c,x.a).name)}</b><span>vs</span><b>${esc(fzOf(c,x.b).name)}</b></button>`).join(''):'<div class="empty">No bouts waiting on this piste.</div>'}</div>`;
  $('#rfC').onchange=e=>location.hash='#live?v=ref&c='+encodeURIComponent(e.target.value);$('#rfP').onchange=e=>{sessionStorage.setItem('afags_piste',e.target.value);viewReferee(c.id)};
  $$('[data-rf]').forEach(b=>b.onclick=()=>{const x=todo[+b.dataset.rf];openScoring(c.id,x.kind,x.i,x.j)})}

/* ---------- event entries (admin) ---------- */
function viewEntries(){const E=(store.get('afags_entries')||[]).filter(x=>!scope||x.district===scope),ev=[...new Set(E.map(x=>x.event))];let fe='';
  $('#main').innerHTML=crumb('Event Entries',E.length+' entries')+`<div class="acc-int"><div><b>Online event entries</b><span>Fencers enter from the website (Calendar › Event Entry) with their AFAGS ID and date of birth; fees are paid online. Use “From online entries” in the Live Centre to load them into a competition.</span></div></div>
   <div class="lv-h"><select id="enE" aria-label="Event" class="selx"><option value="">All events</option>${ev.map(x=>`<option>${esc(x)}</option>`).join('')}</select><button class="btn ghost" style="height:42px;font-size:12px" id="enCsv">⬇ CSV</button></div><div class="tblw" id="enB"></div>`;
  const draw=()=>{const L=E.filter(x=>!fe||x.event===fe);$('#enB').innerHTML=L.length?`<table class="tbl"><thead><tr><th>Fencer</th><th class="hm">Event</th><th>Weapon · Cat.</th><th class="hm">Fee</th><th>Status</th><th></th></tr></thead><tbody>${L.map(x=>`<tr><td><b>${esc(x.name)}</b><small style="display:block;color:var(--mu)">${esc(x.afagsId)} · ${esc(x.district||'')}</small></td><td class="hm">${esc(x.event)}</td><td>${esc(x.weapon)} · ${esc(x.category)}</td><td class="hm">${x.payment?'₹'+x.payment.amount+' <small>'+esc(x.payment.txn||'')+'</small>':x.fee?'—':'Free'}</td><td><span class="st ${x.status==='Cancelled'?'Rejected':'Approved'}">${esc(x.status)}</span></td><td>${ME.canApprove&&x.status!=='Cancelled'?`<button class="btn ghost" style="height:30px;font-size:11px" data-cx="${esc(x.id)}">Cancel</button>`:''}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No entries yet.</div>';
    $$('[data-cx]').forEach(b=>b.onclick=()=>confirmBox({title:'Cancel this entry?',body:'Refunds, if any, are handled in the payment gateway dashboard.',ok:'Cancel entry',tone:'no'},()=>{const A=store.get('afags_entries')||[];const x=A.find(y=>y.id===b.dataset.cx);if(x){x.status='Cancelled';store.set('afags_entries',A);audit('entry','cancelled '+x.id)}viewEntries()}))};
  $('#enE').onchange=e=>{fe=e.target.value;draw()};draw();$('#enCsv').onclick=()=>dlCSV([['Entry','Event','AFAGS ID','Name','District','Weapon','Category','Fee paid','Payment ID','Status'],...E.map(x=>[x.id,x.event,x.afagsId,x.name,x.district,x.weapon,x.category,x.payment?x.payment.amount:0,x.payment?x.payment.txn:'',x.status])],'afags-event-entries.csv')}

/* ---------- annual report (print / save as PDF) ---------- */
function viewAnnual(){const yr=new Date().getFullYear(),K=memberKeys(),apps=store.get('afags_apps')||[],fees=apps.filter(a=>a.payment).reduce((s,a)=>s+(+a.payment.amount||0),0)+(store.get('afags_entries')||[]).reduce((s,x)=>s+(x.payment?+x.payment.amount||0:0),0);
  const ev=CMS.get('events').filter(e=>String(e.start||'').startsWith(String(yr))),res=CMS.get('results').filter(r=>String(r.date||'').startsWith(String(yr))),news=CMS.get('news').filter(n=>String(n.date||'').startsWith(String(yr))),certs=certBatches().reduce((s,b)=>s+b.rows.length,0),comps=liveGet().comps.filter(c=>String(c.date||'').startsWith(String(yr)));
  const byD={};rows('fencers').filter(r=>r.status==='Approved').forEach(r=>byD[r.district]=(byD[r.district]||0)+1);const top=Object.entries(byD).sort((a,b)=>b[1]-a[1]).slice(0,10),mx=top[0]?top[0][1]:1;
  $('#main').innerHTML=crumb('Annual Report',String(yr))+`<div class="lv-h"><button class="btn nav" id="arPr">🖨 Print / Save as PDF</button><span class="sd">Uses the live data in the portal. Fill in the office address in Settings for the cover.</span></div>
  <div class="ar" id="arDoc"><div class="ar-cv"><span class="logo" style="width:70px;height:70px"></span><div><small>AMATEUR FENCING ASSOCIATION OF GUJARAT STATE</small><h2>Annual Report ${yr}</h2><p>Affiliated to the Fencing Association of India</p></div></div>
   <div class="ar-k">${[['Accredited members',K.reduce((s,k)=>s+cnt(k,'Approved'),0)],['Fencers',cnt('fencers','Approved')],['Coaches',cnt('coaches','Approved')],['Referees & officials',cnt('referees','Approved')],['Clubs',cnt('clubs','Approved')],['District units',cnt('districts','Approved')],['Events in calendar',ev.length],['Competitions run live',comps.length],['Results published',res.length],['Certificates issued',certs],['News stories',news.length],['Fees collected online','₹'+fees.toLocaleString('en-IN')]].map(([l,v])=>`<div><b>${typeof v==='number'?v.toLocaleString('en-IN'):v}</b><small>${l}</small></div>`).join('')}</div>
   <h3>Fencers by district (top 10)</h3><div class="bars">${top.map(([d,n])=>`<div class="bar"><label><span>${esc(d)}</span><span>${n}</span></label><div class="t"><i style="width:${n/mx*100}%;background:linear-gradient(90deg,#f47b20,#1f8f3f)"></i></div></div>`).join('')}</div>
   <h3>Events ${yr}</h3>${ev.length?`<table class="tbl"><tbody>${ev.map(e=>`<tr><td>${fmtDs(e.start)}</td><td><b>${esc(e.title)}</b></td><td>${esc(e.venue||'')}</td><td>${esc(e.level||'')}</td></tr>`).join('')}</tbody></table>`:'<p class="sd">No events listed for this year.</p>'}
   <h3>Medal results ${yr}</h3>${res.length?`<table class="tbl"><thead><tr><th>Event</th><th>Weapon · Cat.</th><th>Gold</th><th>Silver</th></tr></thead><tbody>${res.map(r=>`<tr><td>${esc(r.event)}</td><td>${esc(r.weapon)} · ${esc(r.category)}</td><td>${esc(r.gold)}</td><td>${esc(r.silver)}</td></tr>`).join('')}</tbody></table>`:'<p class="sd">No results published this year.</p>'}
   <p class="sd" style="margin-top:18px">Generated from the AFAGS portal on ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}.</p></div>`;
  $('#arPr').onclick=()=>{document.body.classList.add('printing');const x=$('#arDoc').cloneNode(true);x.id='idPrint';x.classList.add('ar-print');document.body.appendChild(x);setTimeout(()=>{window.print();x.remove();document.body.classList.remove('printing')},80)}}

/* ---------- setup checklist on the dashboard ---------- */
function setupChecklist(){if(!ME||!ME.canApprove)return;const s=CMS.site(),items=[[!!(s.address&&!/\[/.test(s.address)),'Office address','#settings'],[!!(s.phone&&!/X/.test(s.phone)),'Office phone number','#settings'],[['facebook','instagram','x','youtube'].some(k=>/^https:\/\//.test(s[k]||'')),'Social media links','#settings'],[!!s.siteUrl,'Website address (for QR codes and shared links)','#settings'],
   [!DB.fencers.some(r=>r.sample)&&!CMS.get('news').some(n=>n.sample),'Remove sample data (Clean start)','#settings'],[!(secCfg().demo),'Turn off the one-tap demo login','#settings'],[!!(store.get('afags_pw')||{}).superadmin||ONLINE(),'Change the default Super Admin password','#settings']];
  const left=items.filter(x=>!x[0]);if(!left.length)return;const box=document.createElement('div');box.className='panel setup-cl';
  box.innerHTML=`<h4>✅ Go-live checklist <small>${items.length-left.length}/${items.length} done</small></h4><ul>${items.map(([ok,l,h])=>`<li class="${ok?'ok':''}">${ok?'✔':'○'} ${ok?l:`<a href="${h}">${l}</a>`}</li>`).join('')}</ul>`;
  const at=$('#main .dbg');at?at.after(box):$('#main').prepend(box)}

/* ---------- 2-step login (Super Admin, server mode) ---------- */
async function twoFactorPanel(){if(!ONLINE()||!ME.canApprove||$('#tfaP'))return;const host=$('#secF')||$('#pwF');if(!host)return;let st={};try{st=await AFAGS_API.call('GET','/auth/2fa')}catch(e){return}
  const p=document.createElement('div');p.className='panel';p.id='tfaP';p.style.marginTop='18px';
  p.innerHTML=st.enabled?`<h4>🔐 2-step login is ON</h4><p class="sd">A 6-digit code from your authenticator app is needed at every sign-in.</p><button class="btn ghost" id="tfaOff">Turn off</button>`:`<h4>🔐 2-step login (recommended)</h4><p class="sd">Protect the Super Admin account with a 6-digit code from Google Authenticator, Microsoft Authenticator or Authy.</p><button class="btn nav" id="tfaOn">Set up 2-step login</button>`;
  host.closest('.cards2')?host.closest('.cards2').after(p):host.after(p);
  const on=$('#tfaOn');on&&(on.onclick=async()=>{let s;try{s=await AFAGS_API.call('POST','/auth/2fa/setup')}catch(e){toast(e.message);return}
    const {m,close}=mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">Set up 2-step login</h3><ol class="sd" style="line-height:1.7"><li>Open your authenticator app and scan this QR code.</li><li>Type the 6-digit code it shows.</li></ol><div style="display:flex;justify-content:center">${AFAGS_QR.svg(s.uri,{size:190})}</div><p class="sd" style="text-align:center">Or enter this key: <code>${esc(s.secret)}</code></p><input id="tfaC" inputmode="numeric" maxlength="6" placeholder="123456" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #dbe3f0;text-align:center;font-size:22px;letter-spacing:6px"><div id="tfaM"></div><button class="btn pri" id="tfaGo" style="margin-top:10px">Turn on</button>`);
    m.querySelector('#tfaGo').onclick=async()=>{try{const r=await AFAGS_API.call('POST','/auth/2fa/enable',{code:m.querySelector('#tfaC').value.trim()});close();mdOpen(`<h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy)">2-step login is ON</h3><p class="sd">Keep these one-time recovery codes safe (print or save). Each works once if you lose your phone.</p><pre style="background:#f8fafd;padding:12px;border-radius:12px;font-size:15px">${r.recovery.map(esc).join('\n')}</pre>`);audit('settings','2-step login turned on');$('#tfaP').remove();twoFactorPanel()}catch(e){m.querySelector('#tfaM').innerHTML=`<div class="alert e" style="animation:none;margin-top:8px">${esc(e.message)}</div>`}}});
  const off=$('#tfaOff');off&&(off.onclick=()=>confirmBox({title:'Turn off 2-step login?',body:'Only the password will be needed to sign in.',ok:'Turn off',tone:'no'},async()=>{try{await AFAGS_API.call('POST','/auth/2fa/disable');audit('settings','2-step login turned off');$('#tfaP').remove();twoFactorPanel()}catch(e){toast(e.message)}}))}

/* ---------- hooks into the router ---------- */
function afterRoute(){if(!ME)return;const k=(location.hash.slice(1)||'dashboard').split('?')[0];if(k==='dashboard')setupChecklist();if(k==='settings')twoFactorPanel()}
let liveTimer=null;setInterval(()=>{if(!ME||!ONLINE())return;const k=(location.hash.slice(1)||'').split('?')[0];if(k==='live'&&!document.querySelector('.sc-md'))livePull().then(()=>{if((location.hash.slice(1)||'').startsWith('live')&&!document.querySelector('.md'))route()})},5000);

window.__afterRoute=afterRoute;

/* ---------- registration safeguards: parent consent (DPDP Act 2023), duplicate check, captcha, private document upload ---------- */
function ageOf(dob){const d=new Date(dob);if(isNaN(d))return 99;const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))a--;return a}
const normName=s=>String(s||'').toLowerCase().replace(/[^a-z]/g,'');
function findDuplicate(){const V=WZ.V,k=WZ.spec.key,me=normName(dispName(WZ.type,V)),mob=String(V.mobile||V.headMobile||V.presMobile||'').replace(/\D/g,''),em=String(V.email||'').toLowerCase();
  return (store.get('afags_apps')||[]).find(a=>{if(a.key!==k)return false;const dec=(store.get('afags_dec')||{})[a.ref];if(dec==='Rejected')return false;const v=a.V||{};
    const sameName=normName(a.name)===me,sameMob=mob&&String(a.mobile||'').replace(/\D/g,'')===mob,sameDob=V.dob&&v.dob===V.dob,sameEmail=em&&String(v.email||'').toLowerCase()===em;
    return k==='clubs'||k==='districts'?(sameName&&(sameMob||sameEmail))||(k==='districts'&&v.district&&v.district===V.district):(sameName&&sameDob)||(sameDob&&sameMob&&sameName)||(sameName&&sameEmail)})}
function preSubmitChecks(){
  /* 1. duplicate */
  if(!WZ.dupOk){const d=findDuplicate();if(d){const m=document.createElement('div');m.className='md';m.innerHTML=`<div class="md-c" style="max-width:480px"><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Already registered?</h3><p style="margin:8px 0;color:#3d4660">An application with the same details already exists: <b>${esc(d.name)}</b> · reference <code>${esc(d.ref)}</code>.</p><p class="sd">Use <b>Track Application</b> with this reference instead of registering again. If this really is a different person, continue.</p><div style="display:flex;gap:10px;margin-top:14px"><button class="btn ghost" data-a style="flex:1">This is someone else</button><button class="btn pri" data-b style="flex:1">Track instead</button></div></div>`;
      document.body.appendChild(m);m.querySelector('[data-a]').onclick=()=>{m.remove();WZ.dupOk=1;submitApp()};m.querySelector('[data-b]').onclick=()=>{m.remove();closeWizard();showPane('#fTrack');$('#tq').value=d.ref};return false}WZ.dupOk=1}
  /* 2. parent / guardian consent for anyone under 18 */
  if(!WZ.consent&&WZ.V.dob&&ageOf(WZ.V.dob)<18){const m=document.createElement('div');m.className='md';m.innerHTML=`<div class="md-c" style="max-width:520px"><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Parent / guardian consent</h3><p style="margin:8px 0;color:#3d4660">${esc(dispName(WZ.type,WZ.V))} is under 18. Under the Digital Personal Data Protection Act, 2023, a parent or legal guardian must agree before AFAGS processes a child's personal data.</p>
     <label class="sf">Parent / guardian full name<input id="cgN" maxlength="60" value="${esc(WZ.V.father||WZ.V.mother||WZ.V.guardian||'')}"></label><label class="sf">Relationship<select id="cgR"><option>Father</option><option>Mother</option><option>Legal guardian</option></select></label>
     <label class="sw2" style="align-items:flex-start"><input type="checkbox" id="cgOk"><span></span><small style="line-height:1.45">I am the parent / legal guardian. I consent to AFAGS collecting and using this child's details and documents only for registration, accreditation, competitions and safeguarding, as described in the AFAGS Privacy Policy. I can withdraw consent by writing to AFAGS.</small></label><div id="cgM"></div>
     <div style="display:flex;gap:10px;margin-top:14px"><button class="btn ghost" data-a style="flex:1">Cancel</button><button class="btn pri" data-b style="flex:1.3">I agree — continue</button></div></div>`;
    document.body.appendChild(m);m.querySelector('[data-a]').onclick=()=>m.remove();m.querySelector('[data-b]').onclick=()=>{const n=m.querySelector('#cgN').value.trim();if(!/^[A-Za-z][A-Za-z .'-]{2,59}$/.test(n)){m.querySelector('#cgM').innerHTML='<div class="alert e" style="animation:none">Enter the parent / guardian name.</div>';return}if(!m.querySelector('#cgOk').checked){m.querySelector('#cgM').innerHTML='<div class="alert e" style="animation:none">Tick the consent box to continue.</div>';return}
      WZ.consent={name:n,relation:m.querySelector('#cgR').value,at:Date.now(),text:'DPDP Act 2023 parental consent v1'};m.remove();submitApp()};return false}
  /* 3. captcha for free registrations (fee registrations are protected by the payment) */
  if(!WZ.spec.fee&&!WZ.captcha){const m=document.createElement('div');m.className='md';m.innerHTML=`<div class="md-c" style="max-width:420px;text-align:center"><h3 style="font:800 22px var(--cond);text-transform:uppercase;color:var(--navy)">Quick check</h3><p class="sd">Type the characters shown, so we know you are not a bot.</p><div id="cpI" style="margin:10px auto;min-height:70px"></div><button type="button" class="link" id="cpR">↻ New code</button><input id="cpA" maxlength="8" autocomplete="off" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #dbe3f0;text-align:center;font-size:22px;letter-spacing:4px;margin-top:8px"><div id="cpM"></div><button class="btn pri" id="cpGo" style="margin-top:10px">Continue</button></div>`;
    document.body.appendChild(m);let cap=null;const load=async()=>{if(ONLINE()||(window.AFAGS_API&&AFAGS_API.online)){try{cap=await AFAGS_API.call('GET','/captcha');m.querySelector('#cpI').innerHTML=cap.svg;return}catch(e){}}
      const code=Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.random()*32|0]).join('');cap={local:code};m.querySelector('#cpI').innerHTML=`<svg viewBox="0 0 200 64" width="200" height="64"><rect width="200" height="64" rx="10" fill="#eef2f8"/>${[...code].map((ch,i)=>`<text x="${22+i*36}" y="${42+(i%2?6:-4)}" font-size="34" font-family="monospace" font-weight="700" fill="#0b2257" transform="rotate(${(i%2?8:-10)} ${22+i*36} 40)">${ch}</text>`).join('')}<path d="M5 ${20+Math.random()*25} C60 0,140 64,195 ${15+Math.random()*30}" stroke="#f47b20" stroke-width="2" fill="none"/></svg>`};
    load();m.querySelector('#cpR').onclick=load;setTimeout(()=>m.querySelector('#cpA').focus(),50);
    m.querySelector('#cpGo').onclick=()=>{const a=m.querySelector('#cpA').value.trim().toUpperCase();if(!cap)return;if(cap.local!=null&&a!==cap.local){m.querySelector('#cpM').innerHTML='<div class="alert e" style="animation:none;margin-top:8px">That does not match — try again.</div>';load();return}
      WZ.captcha=cap.local!=null?{local:1}:{id:cap.id,answer:a};m.remove();submitApp()};return false}
  /* 4. server: upload documents privately before submitting */
  if(window.AFAGS_API&&AFAGS_API.online&&!WZ.docsUp){const files=Object.entries(WZ.FILES).filter(([k,x])=>x&&x.file&&!x.url);if(files.length){const btn=$('#wzNext');btn.disabled=true;btn.innerHTML='<span class="spn"></span> Uploading documents…';
      (async()=>{try{for(const [k,x] of files){let data=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(x.file)});
          if(/^data:image\//.test(data))data=await new Promise(r=>{const im=new Image();im.onload=()=>{const sc=Math.min(1,1800/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=im.width*sc|0;cv.height=im.height*sc|0;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);r(cv.toDataURL('image/jpeg',.82))};im.src=data});
          const j=await AFAGS_API.call('POST','/upload',{name:x.name,data},{timeout:60000});x.url=j.url}WZ.docsUp=1;btn.disabled=false;submitApp()}catch(e){btn.disabled=false;btn.textContent='Submit Application ✓';toast('Upload failed: '+e.message)}})();return false}WZ.docsUp=1}
  return true}
/* admin: open a privately stored document (needs login on the server) */
document.addEventListener('click',async e=>{const b=e.target.closest('[data-pf]');if(!b)return;e.preventDefault();const u=b.dataset.pf;
  if(!/^private\//.test(u)){window.open(u,'_blank','noopener');return}try{const r=await fetch('/api/file/'+encodeURIComponent(u.slice(8)),{headers:{Authorization:'Bearer '+(window.AFAGS_API?AFAGS_API.token():'')},credentials:'same-origin'});if(!r.ok)throw new Error('HTTP '+r.status);const bl=await r.blob();const url=URL.createObjectURL(bl);const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}catch(x){toast('Could not open the document: '+x.message)}});

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

/* ================= v8: login ID + temporary password on approval, member self-service ================= */
function loginKey(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function tempPassword(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ',b='abcdefghijkmnpqrstuvwxyz',d='23456789',R=n=>n[crypto.getRandomValues(new Uint32Array(1))[0]%n.length];return R(A)+R(b)+R(b)+R(b)+R(d)+R(d)+R(d)+R(d)+'@'+R(A)+R(b)}
function portalLink(){const su=(CMS.site()||{}).siteUrl;if(su)return su.replace(/\/?$/,'/')+'#member-login';try{const L=(window.parent!==window?parent.location:location);if(/^https?:/.test(L.protocol))return L.origin+'/#member-login'}catch(e){}return 'AFAGS website › Member Login'}
function credMessage(c){return `Dear ${c.name},\nCongratulations! Your AFAGS ${c.type} registration is approved.\n\nAFAGS ID: ${c.afagsId}\nLogin ID: ${c.login}\nTemporary password: ${c.pw}\nSign in: ${portalLink()}\n\nPlease set your own password the first time you sign in (the temporary password works for 7 days).\n— Amateur Fencing Association of Gujarat State`}
/* member accounts kept in this browser (offline / demo mode); on the AFAGS server they live in the server's user list */
function memberAccount(u){const MA=store.get('afags_maccts')||{};const acc={name:u.name,role:'member',roleLabel:u.roleLabel||u.type||'Member',org:u.org||(u.district?u.district+' District':'AFAGS'),email:u.email||'',mobile:u.mobile||'',district:u.district||null,afagsId:u.afagsId,ref:u.ref,type:u.type,canApprove:false};
  MA[u.key]=acc;ACCOUNTS[u.key]=acc;if(window.AFAGS_API&&AFAGS_API.put)AFAGS_API.put('afags_maccts',JSON.stringify(MA));else store.set('afags_maccts',MA)}
/* offline: approving creates the login here and shows the message to send */
window.__onApproved=function(r){if(API.online||!r.app)return;const a=r.app,k=Object.keys(META).find(x=>DB[x]&&DB[x].includes(r))||a.key;const V=a.V||{},pw=tempPassword();let key,login;
  if(k==='districts'){key=loginKey(a.district);if(!ACCOUNTS[key]||ACCOUNTS[key].role!=='district_unit')return;login=key}
  else{key=loginKey(r.afagsId);login=r.afagsId;if(ACCOUNTS[key]&&!mustChange(key)&&(store.get('afags_pw')||{})[key])return;
    memberAccount({key,name:a.name,roleLabel:a.type,type:k,afagsId:r.afagsId,ref:a.ref,district:a.district,email:V.email,mobile:a.mobile,org:k==='clubs'?a.name:''})}
  const salt=Array.from(crypto.getRandomValues(new Uint8Array(12))).map(x=>x.toString(16).padStart(2,'0')).join(''),P=store.get('afags_pw')||{};P[key]={s:salt,h:hashPw(pw,salt),must:1,exp:Date.now()+7*864e5};store.set('afags_pw',P);
  const U=userState();if(U[key]&&U[key].disabled){U[key].disabled=false;store.set('afags_users',U)}
  audit('login-issued',`${a.name} → ${login}`);
  showCreds([{ref:a.ref,name:a.name,type:a.type,afagsId:r.afagsId,login,pw,email:V.email||'',mobile:String(a.mobile||'').replace(/\D/g,'').slice(-10),sent:null}])};
/* server mode: the server created the logins and sent email / SMS — show the result to the admin */
addEventListener('afags-creds',e=>{if(ME&&ME.canApprove&&Array.isArray(e.detail))setTimeout(()=>showCreds(e.detail),700)});
function showCreds(list){list.forEach(c=>{const msg=credMessage(c),enc=encodeURIComponent(msg),mob=c.mobile;
  const chip=(ok,l)=>`<span class="cr-chip ${ok?'ok':ok===false?'no':''}">${ok?'✓':ok===false?'✕':'•'} ${l}</span>`;
  const sent=c.sent?`<div class="cr-sent">${chip(c.sent.email,c.email?'Email to '+esc(c.email):'No email on form')}${chip(c.sent.sms,mob?'SMS to '+mob:'No mobile')}${c.sent.whatsapp?chip(true,'WhatsApp'):''}</div>${c.sent.email||c.sent.sms?'<p class="sd">The member has received the login details automatically.</p>':'<p class="sd"><b>Email / SMS is not set up on the server yet</b> — send the message yourself with the buttons below.</p>'}`
    :'<p class="sd">Offline mode — nothing is sent automatically. Send the login details with one tap:</p>';
  const {m}=mdOpen(`<h3 class="cr-h">🔑 Login created</h3><p class="sd"><b>${esc(c.name)}</b> · ${esc(c.type)}</p>
    <div class="cr-box"><div><small>AFAGS ID</small><b>${esc(c.afagsId)}</b></div><div><small>Login ID</small><b>${esc(c.login)}</b></div><div><small>Temporary password</small><b class="cr-pw">${esc(c.pw)}</b></div></div>${sent}
    <div class="cr-btns">${mob?`<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/91${mob}?text=${enc}">WhatsApp</a><a class="btn ghost" href="sms:+91${mob}?&body=${enc}">SMS</a>`:''}${c.email?`<a class="btn ghost" href="mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent('AFAGS login — '+c.afagsId)}&body=${enc}">Email</a>`:''}<button class="btn pri" id="crCopy">Copy message</button></div>
    <p class="sd" style="margin-top:10px">The password is shown only now. The member must change it at first login. Lost it? Users & Logins › Reset password.</p>`);
  m.querySelector('#crCopy').onclick=()=>{try{navigator.clipboard.writeText(msg).then(()=>toast('Message copied'),()=>toast('Copy failed'))}catch(x){toast('Copy failed')}}})}
/* temporary password expires after 7 days (offline mode) */
function tempExpired(k){const o=(store.get('afags_pw')||{})[k];return !!(o&&o.must&&o.exp&&o.exp<Date.now())}
/* ---------- member home: ID card, membership, entries, results, certificates ---------- */
async function viewMember(){$('#tbTitle').textContent='My AFAGS';const box=$('#main');box.innerHTML=crumb('My AFAGS')+'<div class="panel"><span class="spn"></span> Loading…</div>';let B;
  try{if(API.online){B=await API.call('GET','/member/me')}else{const id=String(ME.afagsId||'').toUpperCase(),a=(store.get('afags_apps')||[]).find(x=>x.ref===ME.ref)||{},dec=store.get('afags_dec')||{},fl=(store.get('afags_flags')||{})[ME.ref]||{},certs=[];
      (store.get('afags_certb')||[]).forEach(b=>(b.rows||[]).forEach(r=>{if(!r.held&&String(r.afagsId||'').toUpperCase()===id)certs.push({t:b.tournament,date:b.date,venue:b.venue,no:r.no,position:r.position,weapon:r.weapon,category:r.category})}));
      B={me:{id:ME.afagsId,ref:ME.ref,name:a.name||ME.name,type:a.type||ME.roleLabel,key:a.key||ME.type,district:a.district||ME.district,weapon:a.weapon,cat:a.cat,status:dec[ME.ref]||'Approved',renewed:renewedNow(fl.renewed,ME.ref),photo:((a.files||{}).photo||(a.files||{}).logo||{}).thumb||'',email:ME.email,mobile:ME.mobile,mustChange:mustChange(ME.key)},certs,
        results:(store.get('afags_rankpts')||[]).filter(x=>String(x.afagsId||'').toUpperCase()===id),entries:(store.get('afags_entries')||[]).filter(x=>String(x.afagsId||'').toUpperCase()===id)}}}
  catch(e){box.innerHTML=crumb('My AFAGS')+`<div class="panel"><div class="alert e">${esc(e.message)}</div></div>`;return}
  const me=B.me,k=me.key&&META[me.key]?me.key:'fencers',r={name:me.name,photo:me.photo,col:'#1d3f8a',afagsId:me.id,district:me.district||'—',weapon:me.weapon,cat:me.cat};
  const fd=d=>d?new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—';
  const tbl=(h,rows,empty)=>rows.length?`<div class="tblw"><table class="tbl"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`:`<div class="empty">${empty}</div>`;
  box.innerHTML=crumb('My AFAGS',esc(me.id||''))+`${me.mustChange?`<div class="panel mb-warn"><b>🔐 Set your own password now.</b> You signed in with a temporary password. <a class="btn pri" href="#settings">Change password</a></div>`:''}
  <div class="mb-grid"><div>${idCard(r,k)}<div class="mb-act"><button class="btn ghost" id="mbPrint">🖨 Print card</button><button class="btn ghost" data-go="#/fencers/verify?id=${encodeURIComponent(me.id||'')}">Verify link</button></div></div>
   <div class="panel"><h4>Membership</h4><dl class="mb-dl"><dt>Status</dt><dd><span class="st ${esc(me.status)}">${esc(me.status)}</span></dd><dt>Type</dt><dd>${esc(me.type||'')}</dd><dt>Season ${SEASON_L}</dt><dd>${me.renewed?'Renewed ✓':'Not renewed yet'}</dd><dt>Reference</dt><dd>${esc(me.ref||'')}</dd><dt>Email</dt><dd>${esc(me.email||'—')}</dd><dt>Mobile</dt><dd>${esc(me.mobile||'—')}</dd></dl>
    <div class="mb-act">${me.key==='fencers'?'<button class="btn pri" data-go="#/calendar/entry">Enter an event</button>':''}<button class="btn ghost" data-go="#/fencers/renew">Renew</button><button class="btn ghost" data-go="#/live">Live scores</button><a class="btn ghost" href="#settings">Change password</a></div></div></div>
  ${me.key==='fencers'||B.results.length?`<div class="panel"><h4>🏅 Results & ranking points</h4>${tbl(['Event','Date','Weapon','Category','Points'],B.results.map(x=>`<tr><td>${esc(x.event||x.t||'')}</td><td>${fd(x.date)}</td><td>${esc(x.weapon||'')}</td><td>${esc(x.category||'')}</td><td><b>${esc(String(x.pts||x.points||''))}</b></td></tr>`),'No results yet.')}</div>`:''}
  ${me.key==='fencers'||B.entries.length?`<div class="panel"><h4>📝 My event entries</h4>${tbl(['Entry no.','Event','Weapon','Category','Status'],B.entries.map(x=>`<tr><td>${esc(x.no||'')}</td><td>${esc(x.event||'')}</td><td>${esc(x.weapon||'')}</td><td>${esc(x.category||'')}</td><td><span class="st ${x.status==='Cancelled'?'Rejected':'Approved'}">${esc(x.status||'')}</span></td></tr>`),'No entries yet.')}</div>`:''}
  <div class="panel"><h4>📜 Certificates</h4>${tbl(['Certificate','Event','Date','Result'],B.certs.map(c=>`<tr><td>${esc(c.no||'')}</td><td>${esc(c.t||'')}</td><td>${fd(c.date)}</td><td>${esc(c.position||'Participation')}</td></tr>`),'No certificates yet.')}</div>`;
  $$('[data-go]').forEach(b=>b.onclick=()=>goWebsite(b.dataset.go));
  $('#mbPrint').onclick=()=>{const w=document.createElement('div');w.id='mbPrintBox';w.innerHTML=$('#idCard').outerHTML;document.body.appendChild(w);document.body.classList.add('mb-printing');setTimeout(()=>{print();document.body.classList.remove('mb-printing');w.remove()},50)}}

/* ---------- Voices: publish website feedback onto the home-page globe ---------- */
function voicesInbox(){if(!ME||!ME.canApprove||!/^#cms\?c=voices/.test(location.hash)||$('#vgIn'))return;
  const L=CMS.inbox().filter(x=>x.type==='feedback'&&x.consent==='Yes'&&!['Published','Dismissed'].includes(x.status));const main=$('#main');if(!main)return;
  const box=document.createElement('div');box.className='panel';box.id='vgIn';
  box.innerHTML=`<h4>💬 New feedback from the website <small class="sd">(${L.length})</small></h4>${L.length?`<div class="tblw"><table class="tbl"><thead><tr><th>From</th><th>Feedback</th><th>Rating</th><th>Action</th></tr></thead><tbody>${L.map(x=>`<tr><td><b>${esc(x.name||'')}</b><br><small>${esc([x.role,x.district,x.place].filter(Boolean).join(' · '))}</small></td><td style="max-width:420px">${esc(x.message||'')}</td><td>${'★'.repeat(+x.rating||0)}</td><td><div class="act"><button class="ok" data-vp="${esc(x.id)}">Publish on globe</button><button class="no" data-vd="${esc(x.id)}">Dismiss</button></div></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No new feedback. Visitors can send it with “Share your experience” under the globe on the home page.</div>'}`;
  const anchor=main.querySelector('.crumb');anchor?anchor.after(box):main.prepend(box);
  const setSt=(id,st)=>{const A=CMS.inbox();const m=A.find(y=>y.id===id);if(m){m.status=st;CMS.setInbox(A)}};
  box.querySelectorAll('[data-vp]').forEach(b=>b.onclick=()=>{const x=CMS.inbox().find(y=>y.id===b.dataset.vp);if(!x)return;const opts=((CMS.SCHEMA.voices.fields.find(f=>f[0]==='place')||[])[4])||[];
    const pick=v=>{v=String(v||'').toLowerCase().trim();return v&&(opts.find(o=>o.toLowerCase()===v)||opts.find(o=>o.toLowerCase().startsWith(v))||opts.find(o=>o.toLowerCase().includes(v)))};
    const place=pick(x.place)||pick(x.district)||'Ahmedabad';
    const V=CMS.get('voices').filter(v=>!v.sample);V.unshift({id:'vc'+Date.now().toString(36),name:x.name,role:x.role||'Fencer',district:x.district||'',place,rating:String(x.rating||''),quote:String(x.message||'').slice(0,300),status:'Published',from:x.id,date:new Date().toISOString().slice(0,10)});
    CMS.set('voices',V);setSt(x.id,'Published');audit('cms','voice published from '+x.id);toast('Published on the globe'+(CMS.get('voices').length===1?' — sample voices are now hidden':''));$('#vgIn').remove();route()});
  box.querySelectorAll('[data-vd]').forEach(b=>b.onclick=()=>{setSt(b.dataset.vd,'Dismissed');audit('cms','feedback dismissed '+b.dataset.vd);$('#vgIn').remove();voicesInbox()})}
{const _ar=window.__afterRoute;window.__afterRoute=()=>{_ar&&_ar();try{voicesInbox()}catch(e){console.warn(e)}}}
/* ---------- dashboard: website visitors (anonymous counts from the AFAGS server) ---------- */
async function visitorsPanel(){if(!ME||!ME.canApprove||!['','#','#dashboard'].includes(location.hash))return;if($('#visP'))return;const host=$('#main');if(!host)return;
  let v=null,live=false;try{if(API.online){v=await API.call('GET','/visits');live=true}}catch(e){}
  if(!v){const L=store.get('afags_visits_local')||{total:0,days:{}},d=new Date().toISOString().slice(0,10);v={total:L.total||0,today:{v:(L.days||{})[d]||0,u:(L.days||{})[d]?1:0},last7:Object.entries(L.days||{}).filter(([k])=>Date.now()-Date.parse(k)<7*864e5).reduce((a,[,n])=>a+n,0),online:0,days:Object.entries(L.days||{}).slice(-14).map(([d,n])=>({d,v:n,u:n}))}}
  if($('#visP'))return;const days=(v.days||[]).slice(-14),mx=Math.max(1,...days.map(x=>x.v||0)),n=x=>Number(x||0).toLocaleString('en-IN');
  const el=document.createElement('div');el.className='panel vis-p';el.id='visP';
  el.innerHTML=`<div class="vis-h"><h4>👁 Website visitors</h4>${live?'<span class="vis-live"><i></i>Live</span>':'<span class="st Pending">This browser only</span>'}</div>
   <div class="vis-k"><div><b>${n(v.online)}</b><small>Online now</small></div><div><b>${n(v.today&&v.today.u)}</b><small>Visitors today</small></div><div><b>${n(v.today&&v.today.v)}</b><small>Visits today</small></div><div><b>${n(v.last7)}</b><small>Visits · 7 days</small></div><div><b>${n(v.total)}</b><small>All visits${v.since?' since '+esc(new Date(v.since).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})):''}</small></div></div>
   ${days.length?`<div class="vis-ch" role="img" aria-label="Visits in the last ${days.length} days">${days.map(x=>`<span title="${esc(x.d)}: ${n(x.v)} visits, ${n(x.u)} visitors"><i style="height:${Math.max(4,Math.round((x.v||0)/mx*100))}%"></i><small>${esc(String(x.d).slice(8))}</small></span>`).join('')}</div>`:''}
   <p class="sd">${live?'Counted anonymously by the AFAGS server — no IP addresses are stored. The same numbers show on the home page globe.':'Run the site on the AFAGS server to count every visitor.'}</p>`;
  const anchor=host.querySelector('.cards2')||host.querySelector('.panel');anchor?anchor.before(el):host.appendChild(el)}
{const _ar2=window.__afterRoute;window.__afterRoute=()=>{_ar2&&_ar2();if(ME&&ME.role!=='member'&&(location.hash===''||location.hash==='#dashboard'||location.hash==='#'))setTimeout(()=>visitorsPanel().catch(e=>console.warn(e)),120)}}

/* ---------- FAI affiliation logo: upload in Settings, shown on the website + this login page ---------- */
function faiSrcP(){const v=(CMS.site()||{}).faiLogo||'';return /^(data:image\/(png|jpeg|webp);base64,|uploads\/|https:\/\/)/.test(v)?v:''}
function faiLoginBadge(){const b=document.querySelector('.lg-l .lg-brand');if(!b)return;let el=document.getElementById('faiLg');const src=faiSrcP();
  if(!el){b.insertAdjacentHTML('afterend','<a id="faiLg" class="fai-lgn" href="https://www.fencingindia.org/" target="_blank" rel="noopener" aria-label="Affiliated to the Fencing Association of India"></a>');el=document.getElementById('faiLg')}
  el.innerHTML=`${src?`<span class="fai-lgi"><img src="${src}" alt="Fencing Association of India logo"></span>`:''}<span><small>Affiliated to</small><b>Fencing Association of India (FAI)</b></span>`}
faiLoginBadge();
function faiSettings(){if(!ME||!ME.canApprove||location.hash!=='#settings'||$('#faiP'))return;const host=$('#main');if(!host)return;const src=faiSrcP();
  const el=document.createElement('div');el.className='panel';el.id='faiP';
  el.innerHTML=`<h4>🤝 Affiliation logo — Fencing Association of India</h4><p class="sd">Upload the official FAI logo (PNG with a transparent background looks best). It appears in the website's top bar, beside "Affiliated to FAI" in the header, in the footer and on the login page.</p>
   <div class="fai-up"><span class="fai-pv">${src?`<img src="${src}" alt="FAI logo preview">`:'<em>No logo yet</em>'}</span><label class="btn ghost" style="height:40px;display:inline-flex;align-items:center;cursor:pointer">${src?'Replace logo':'Upload logo'}<input type="file" id="faiF" accept="image/png,image/jpeg,image/webp" hidden></label>${src?'<button type="button" class="btn ghost" id="faiX" style="height:40px">Remove</button>':''}</div><div id="faiM"></div>`;
  const anchor=$('#siteF');anchor?anchor.after(el):host.appendChild(el);
  const save=v=>{CMS.setSite(Object.assign({},CMS.site(),{faiLogo:v}));audit('settings',v?'FAI logo updated':'FAI logo removed');try{parent.postMessage({afags:'cms',c:'site'},'*')}catch(e){}faiLoginBadge();el.remove();faiSettings();toast(v?'FAI logo saved — it now shows on the website':'FAI logo removed')};
  el.querySelector('#faiF').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!/^image\/(png|jpeg|webp)$/.test(f.type)){$('#faiM').innerHTML='<div class="alert e">Please choose a PNG, JPG or WEBP image.</div>';return}if(f.size>3*1048576){$('#faiM').innerHTML='<div class="alert e">Image is larger than 3 MB.</div>';return}
    const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,320/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);save(cv.toDataURL('image/png'))};im.onerror=()=>{$('#faiM').innerHTML='<div class="alert e">This file could not be read as an image.</div>'};im.src=rd.result};rd.readAsDataURL(f)};
  const x=el.querySelector('#faiX');x&&(x.onclick=()=>confirmBox({title:'Remove the FAI logo?',body:'The website will show the text "Affiliated to FAI" without the logo.',ok:'Remove',tone:'no'},()=>save('')))}
{const _ar3=window.__afterRoute;window.__afterRoute=()=>{_ar3&&_ar3();if(location.hash==='#settings')setTimeout(faiSettings,150)}}

/* ================= official AFAGS certificate design (Merit / Participation layout) ================= */
function certCfg(){return Object.assign({organizer:'Amateur Fencing Association of Gujarat State',recognized:'Recognized by: Sports, Youth and Cultural Activities Department, Government of Gujarat',sigs:AFAGS_CERT.SIGS.map(x=>({...x,img:''}))},store.get('afags_certcfg')||{})}
function memberOf(id){if(!id)return null;const u=String(id).toUpperCase();for(const k in DB){const r=DB[k].find(x=>String(x.afagsId||'').toUpperCase()===u);if(r)return r}return null}
function certData(c){const r=memberOf(c.afagsId),V=(r&&r.app&&r.app.V)||{},cfg=certCfg(),t=String(c.type||'');
  const kind=t.startsWith('Merit')?'merit':t==='Appreciation'?'appreciation':t==='Accreditation'?'accreditation':t.startsWith('Coaching')?'service':'participation';
  const w=c.wpn||String(c.weapon||'').split(' · ')[0],cat=c.category||String(c.weapon||'').split(' · ')[1]||'',inTitle=cat&&String(c.event||'').toLowerCase().includes(String(cat).toLowerCase());
  return {kind,no:c.no==='PREVIEW'?'PREVIEW':c.no,idLabel:V.faiId?'FAI ID':'AFAGS ID',idValue:V.faiId||c.afagsId||'',name:c.name,dob:c.dob||V.dob||'',parent:c.parent||V.father||V.mother||V.guardian||'',
    district:c.district||(r&&r.district)||'',tournament:c.event,date:c.date,end:c.end,venue:c.venue,organizer:c.organizer||cfg.organizer,recognized:cfg.recognized,medal:c.pos,
    event:AFAGS_CERT.eventLine(c.gender||V.gender||'',w,inTitle?'':cat),photo:(r&&r.photo)||'',qr:c.no&&c.no!=='PREVIEW'?qrSVG(c.no,105):'',logo:'<span class="logo" role="img" aria-label="AFAGS logo"></span>',sigs:cfg.sigs,style:c.style||cfg.style||'modern',role:c.role||(r&&r.app&&r.app.type)||'Fencer'}}
function certHTML(c){return `<div class="afc-box" id="certCard">${AFAGS_CERT.html(certData(c))}</div>`}
function certPreview(c,issued){const {m}=mdOpen(certHTML(c)+`<div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap"><button class="btn nav" id="cePr">🖨 Print / Save as PDF</button></div><p class="sd" style="text-align:center;margin-top:6px">Prints on A4 landscape. In the print window choose “Save as PDF” to download.</p>`,true);
  const box=m.querySelector('#certCard'),f=()=>AFAGS_CERT.fit(box);requestAnimationFrame(f);addEventListener('resize',f);
  m.querySelector('#cePr').onclick=()=>{document.body.classList.add('printing');const x=document.createElement('div');x.id='idPrint';x.className='certpages';x.innerHTML=`<div class="certpg">${AFAGS_CERT.html(certData(c))}</div>`;document.body.appendChild(x);setTimeout(()=>{window.print();x.remove();document.body.classList.remove('printing')},120)}}
/* settings: who signs, signature images, organiser line */
function certSettings(){if(!ME||!ME.canApprove||location.hash!=='#settings'||$('#cfgCert'))return;const host=$('#main');if(!host)return;const cfg=certCfg();
  const el=document.createElement('div');el.className='panel';el.id='cfgCert';
  el.innerHTML=`<h4>🎓 Certificate design</h4><p class="sd">Merit and participation certificates use the official AFAGS layout. Set the default organiser line and the three signatories. Signature images stay private to the admin portal (they are not published on the website).</p>
   <div class="cf-g" style="margin-top:10px"><label class="cf">Default design<select id="ccSty"><option value="modern" ${cfg.style!=='classic'?'selected':''}>Modern (national style)</option><option value="classic" ${cfg.style==='classic'?'selected':''}>Classic (AFAGS)</option></select></label><label class="cf w1">Organized by (default)<input id="ccOrg" maxlength="120" value="${esc(cfg.organizer)}"></label><label class="cf w1">Recognized by line<input id="ccRec" maxlength="160" value="${esc(cfg.recognized)}"></label></div>
   <div class="sig-g">${cfg.sigs.map((s,i)=>`<div class="sig-c"><span class="sig-pv">${s.img?`<img src="${s.img}" alt="">`:'<em>No signature</em>'}</span><label class="cf">Name<input data-sn="${i}" maxlength="60" value="${esc(s.name)}"></label><label class="cf">Title<input data-st="${i}" maxlength="60" value="${esc(s.title)}"></label><div style="display:flex;gap:6px;flex-wrap:wrap"><label class="btn ghost sm2" style="cursor:pointer">Upload signature<input type="file" data-si="${i}" accept="image/png,image/jpeg,image/webp" hidden></label>${s.img?`<button type="button" class="btn ghost sm2" data-sx="${i}">Remove</button>`:''}</div></div>`).join('')}</div>
   <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn nav" id="ccSave">Save certificate settings</button><button class="btn ghost" id="ccPrev">👁 Preview a certificate</button></div>`;
  ($('#faiP')||$('#siteF')||host.lastElementChild).after(el);
  const cur=certCfg();
  const save=(msg)=>{cur.style=$('#ccSty').value;cur.organizer=$('#ccOrg').value.trim()||'Amateur Fencing Association of Gujarat State';cur.recognized=$('#ccRec').value.trim();cur.sigs=cur.sigs.map((s,i)=>({...s,name:el.querySelector(`[data-sn="${i}"]`).value.trim(),title:el.querySelector(`[data-st="${i}"]`).value.trim()}));store.set('afags_certcfg',cur);audit('settings','certificate design '+(msg||'saved'));toast('Certificate settings saved');el.remove();certSettings()};
  el.querySelectorAll('[data-si]').forEach(inp=>inp.onchange=e=>{const f=e.target.files[0];if(!f||!/^image\//.test(f.type))return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,480/im.width),cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);cur.sigs[+inp.dataset.si].img=cv.toDataURL('image/png');save('signature updated')};im.src=rd.result};rd.readAsDataURL(f)});
  el.querySelectorAll('[data-sx]').forEach(b=>b.onclick=()=>{cur.sigs[+b.dataset.sx].img='';save('signature removed')});
  $('#ccSave').onclick=()=>save();
  $('#ccPrev').onclick=()=>certPreview({name:'Jigarkumar Karshanbhai Chaudhari',dob:'1994-06-28',parent:'Karshanbhai Chaudhari',district:'Mahesana',gender:'Male',wpn:'Épée',type:'Merit — Winner',pos:'Bronze — 3rd place',event:'Cadet (U-17) State Fencing Championship',venue:'Matrushree Joitiba Hall, Gandhinagar',date:'2026-04-05',no:'PREVIEW',at:Date.now()})}
{const _ar4=window.__afterRoute;window.__afterRoute=()=>{_ar4&&_ar4();if(location.hash==='#settings')setTimeout(certSettings,220)}}

/* ================= certificates: two ways to work — List (federation style) and Studio (live preview) ================= */
function certRow(b,r,merit){return {name:r.name,afagsId:r.afagsId,type:merit?'Merit — Winner':'Participation',pos:r.position,event:b.tournament,weapon:[r.weapon,r.category].filter(x=>x&&x!=='—').join(' · '),wpn:r.weapon,category:r.category,gender:r.gender,district:r.district,dob:r.dob,parent:r.parent,venue:b.venue,date:b.date,end:b.end,organizer:b.organizer,at:b.at,no:r.no+(merit?'-M':''),style:b.style}}
function rowInfo(r){const m=memberOf(r.afagsId),V=(m&&m.app&&m.app.V)||{};return {dob:r.dob||V.dob||'',gender:r.gender||V.gender||'',parent:r.parent||V.father||V.mother||V.guardian||'',photo:m&&m.photo}}
function printCerts(list,label){if(!list.length){toast('Nothing selected');return}const w=document.createElement('div');w.id='idPrint';w.className='certpages';w.innerHTML=list.map(c=>`<div class="certpg">${AFAGS_CERT.html(certData(c))}</div>`).join('');
  document.body.classList.add('printing');document.body.appendChild(w);audit('certificate',`printed ${list.length} — ${label}`);setTimeout(()=>{window.print();w.remove();document.body.classList.remove('printing')},300)}
function certEdit(b,r,B,done){const I=rowInfo(r);const {m,close}=mdOpen(`<form class="cms-f" novalidate><h3 style="font:800 20px var(--cond);text-transform:uppercase;color:var(--navy);margin-bottom:10px">Edit certificate details</h3><div class="cf-g">
   <label class="cf w1">Name on certificate<input name="name" maxlength="70" value="${esc(r.name)}"></label>
   <label class="cf w1">AFAGS ID — linked registration (photo, DOB &amp; parent's name come from here)<input name="afagsId" maxlength="30" list="cuMem" value="${esc(r.afagsId||'')}" placeholder="Type a name or ID to search members" autocomplete="off"><datalist id="cuMem">${(()=>{const o=[];for(const k in DB)DB[k].forEach(x=>{if(x.afagsId&&x.status==='Approved')o.push(`<option value="${esc(x.afagsId)}">${esc(x.name)} · ${esc(x.district||'')}${x.photo?'':' · no photo'}</option>`)});return o.slice(0,800).join('')})()}</datalist><small id="cuLk" style="font-weight:600"></small></label><label class="cf">Date of birth<input type="date" name="dob" value="${esc(I.dob)}"></label>
   <label class="cf">S/o · D/o · W/o<input name="parent" maxlength="60" value="${esc(I.parent)}"></label><label class="cf">Gender<select name="gender">${['','Male','Female'].map(g=>`<option ${g===I.gender?'selected':''}>${g}</option>`).join('')}</select></label>
   <label class="cf">District represented<input name="district" maxlength="40" value="${esc(r.district||'')}"></label><label class="cf">Weapon<select name="weapon">${['Foil','Épée','Sabre'].map(w=>`<option ${w===r.weapon?'selected':''}>${w}</option>`).join('')}</select></label>
   <label class="cf">Category<input name="category" maxlength="20" value="${esc(r.category||'')}"></label><label class="cf">Position (merit)<input name="position" maxlength="40" value="${esc(r.position||'')}" placeholder="e.g. Gold — 1st place"></label></div>
   <p class="sd" style="margin-top:8px">Changes apply only to this certificate (the member's registration is not changed).</p>
   <div style="display:flex;gap:10px;margin-top:12px"><button type="button" class="btn ghost" data-c style="flex:1">Cancel</button><button class="btn pri" style="flex:1.4">Save</button></div></form>`);
  const f=m.querySelector('form');m.querySelector('[data-c]').onclick=close;
  const lk=()=>{const v=f.elements.afagsId.value.trim(),mm=v&&memberOf(v),o=m.querySelector('#cuLk');o.style.color=mm?'#17803d':'#b45309';o.textContent=!v?'Not linked — no photo will print':mm?`✓ ${mm.name} · ${mm.district||''} · ${mm.photo?'photo found':'no photo in registration'}`:'No approved member with this ID'};f.elements.afagsId.oninput=lk;lk();
  f.onsubmit=e=>{e.preventDefault();const nid=f.elements.afagsId.value.trim().toUpperCase(),mm=nid&&memberOf(nid);if(nid!==String(r.afagsId||'').toUpperCase()){r.afagsId=nid;if(mm){const V=(mm.app&&mm.app.V)||{};['dob','parent','gender'].forEach(k=>{if(f.elements[k].value.trim()===String(I[k]||''))f.elements[k].value=k==='parent'?(V.father||V.mother||V.guardian||''):(V[k]||'')});if(!f.elements.district.value.trim())f.elements.district.value=mm.district||''}}
  ['name','dob','parent','gender','district','weapon','category','position'].forEach(k=>{const v=f.elements[k].value.trim();if(k==='name'&&!v)return;r[k]=v});store.set('afags_certb',B);audit('certificate','edited '+r.no);close();toast('Certificate updated');done()}}
function viewCertBatch(id,t){const B=certBatches(),b=B.find(x=>x.id===id);if(!b){location.hash='#certificates?v=create';return}
  const merit=t==='m',ui=(()=>{try{return localStorage.getItem('afags_certui')||'list'}catch(e){return 'list'}})(),cfg=certCfg();
  const all=b.rows.map((r,i)=>({r,i})).filter(x=>!merit||isMerit(x.r));
  const F={q:'',dist:'',gender:'',weapon:'',cat:'',held:'all'};let per=10,p=1,sel=new Set(),cur=0;
  const opts=(k)=>[...new Set(all.map(x=>k==='gender'?rowInfo(x.r).gender:x.r[k]).filter(Boolean))].sort();
  $('#main').innerHTML=`<div class="crumb">Home <span>/</span> <a href="#certificates?v=create">Certificate</a> <span>/</span> <b>${merit?'Merit':'Participate'} Certificate</b><span class="r"><a class="btn sm2" style="background:#e53935;color:#fff" href="#certificates?v=create">Back</a></span></div>
   <div class="panel cu-top"><div class="cu-row"><select id="cuB" aria-label="Tournament">${B.map(x=>`<option value="${esc(x.id)}" ${x.id===id?'selected':''}>${esc(x.tournament)}</option>`).join('')}</select>
     <select id="cuD" aria-label="District"><option value="">— All districts —</option>${opts('district').map(d=>`<option>${esc(d)}</option>`).join('')}</select>
     <div class="cu-seg" role="tablist"><a class="${merit?'':'on'}" href="#certificates?v=create&b=${b.id}&t=p">Participation <i>${b.rows.length}</i></a><a class="${merit?'on':''}" href="#certificates?v=create&b=${b.id}&t=m">Merit <i>${b.rows.filter(isMerit).length}</i></a></div>
     <div class="cu-seg cu-ui" role="tablist" aria-label="Interface"><button data-ui="list" class="${ui==='list'?'on':''}">☰ List</button><button data-ui="studio" class="${ui==='studio'?'on':''}">◧ Studio</button></div></div>
    <div class="cu-row"><label>Gender<select id="cuG"><option value="">Select gender</option>${opts('gender').map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Weapon<select id="cuW"><option value="">Select weapon</option>${opts('weapon').map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Category<select id="cuC"><option value="">All</option>${opts('category').map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
     <label>Design<select id="cuS"><option value="modern" ${(b.style||cfg.style||'modern')==='modern'?'selected':''}>Modern (national style)</option><option value="classic" ${(b.style||cfg.style)==='classic'?'selected':''}>Classic (AFAGS)</option></select></label>
     <label class="cu-grow">Organized by<input id="cbOrg" maxlength="120" value="${esc(b.organizer||cfg.organizer||'')}"></label><label>Last day<input id="cbEnd" type="date" value="${esc(b.end||'')}"></label></div></div>
   <div id="cuBody"></div>`;
  const filt=()=>all.filter(({r})=>{const I=rowInfo(r);return (!F.q||(r.name+' '+r.afagsId+' '+(r.district||'')+' '+r.no).toLowerCase().includes(F.q))&&(!F.dist||r.district===F.dist)&&(!F.gender||I.gender===F.gender)&&(!F.weapon||r.weapon===F.weapon)&&(!F.cat||r.category===F.cat)&&(F.held==='all'||(F.held==='noph'?!I.photo:F.held==='held'?r.held:!r.held))});
  const C=x=>certRow(b,x.r,merit);
  function list(){const L=filt(),pages=Math.max(1,Math.ceil(L.length/per));p=Math.min(p,pages);const pg=L.slice((p-1)*per,p*per);
    $('#cuBody').innerHTML=`<div class="panel"><div class="cu-row"><input id="cuQ" placeholder="Filter by AFAGS ID, name or district" value="${esc(F.q)}" class="cu-grow"><select id="cuH"><option value="all">All</option><option value="ok" ${F.held==='ok'?'selected':''}>Issued</option><option value="held" ${F.held==='held'?'selected':''}>Withheld</option><option value="noph" ${F.held==='noph'?'selected':''}>No photo (${all.filter(x=>!rowInfo(x.r).photo).length})</option></select><button class="btn sm2" style="background:#16a34a;color:#fff" id="cuR">Reset</button></div>
      <h3 class="cu-h">${esc(b.tournament)}</h3><p class="sd" style="text-align:center">${esc(b.venue||'')}${b.date?' · '+fmtDs(b.date):''} · ${L.length} ${merit?'merit':'participation'} certificate${L.length===1?'':'s'}</p>
      <div class="cu-row" style="justify-content:space-between"><label class="sd">Show <select id="cuN">${[10,25,50,100].map(n=>`<option ${n===per?'selected':''}>${n}</option>`).join('')}</select> entries</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm2 ghost" id="cuCsv">⬇ CSV</button><button class="btn nav sm2" id="cuSel">⬇ Download selected (${sel.size})</button><button class="btn sm2 ghost" id="cuAll">🖨 Print all (${L.filter(x=>!x.r.held).length})</button></div></div>
      <div class="tblw" style="border:0"><table class="tbl cu-t"><thead><tr><th style="width:40px"><input type="checkbox" id="cuChk" aria-label="Select all on this page"></th><th>AFAGS ID</th><th>Name</th><th class="hm">DOB</th><th class="hm">District</th><th class="hm">Event</th>${merit?'<th>Position</th>':''}<th style="text-align:center">Action</th></tr></thead>
      <tbody>${pg.length?pg.map(x=>{const r=x.r,I=rowInfo(r);return `<tr class="${r.held?'cu-held':''}"><td><input type="checkbox" data-s="${x.i}" ${sel.has(x.i)?'checked':''} aria-label="Select ${esc(r.name)}"></td><td><span class="aid">${esc(r.afagsId||'—')}</span></td><td><span class="cu-nm">${I.photo?`<img src="${I.photo}" alt="" class="cu-th">`:`<span class="cu-th none" title="${r.afagsId&&memberOf(r.afagsId)?'No photo in registration':'Not linked to a registration — edit to link'}">?</span>`}<b style="font-weight:600">${esc(r.name)}</b></span>${r.held?' <span class="st Rejected">Withheld</span>':''}</td><td class="hm">${I.dob?esc(I.dob.split('-').reverse().join('-')):'—'}</td><td class="hm">${esc(r.district||'—')}</td><td class="hm">${esc(AFAGS_CERT.eventLine(I.gender,r.weapon,r.category))}</td>${merit?`<td>${esc(r.position||'')}</td>`:''}
        <td><div class="cu-act"><button class="ca v" data-v="${x.i}" title="View">👁</button><button class="ca d" data-d="${x.i}" title="Download / print">⬇</button><button class="ca h" data-h="${x.i}" title="${r.held?'Release (issue again)':'Withhold this certificate'}">⊘</button><button class="ca g" data-v="${x.i}">Generate Certificate</button><button class="ca e" data-e="${x.i}" title="Edit details">✎</button></div></td></tr>`}).join(''):`<tr><td colspan="8"><div class="empty">No certificates match these filters.</div></td></tr>`}</tbody></table></div>
      <div class="pg"><span>Showing ${L.length?(p-1)*per+1:0} to ${Math.min(p*per,L.length)} of ${L.length} entries</span><div class="b"><button ${p<2?'disabled':''} data-p="${p-1}">Previous</button><button class="on">${p}</button><button ${p>=pages?'disabled':''} data-p="${p+1}">Next</button></div></div></div>`;
    const q=$('#cuQ');q.oninput=()=>{F.q=q.value.toLowerCase();p=1;list();const n=$('#cuQ');n.focus();n.setSelectionRange(n.value.length,n.value.length)};
    $('#cuH').onchange=e=>{F.held=e.target.value;p=1;list()};$('#cuR').onclick=()=>{Object.assign(F,{q:'',dist:'',gender:'',weapon:'',cat:'',held:'all'});['#cuD','#cuG','#cuW','#cuC'].forEach(s=>$(s).value='');sel.clear();p=1;list()};
    $('#cuN').onchange=e=>{per=+e.target.value;p=1;list()};$$('#cuBody [data-p]').forEach(x=>x.onclick=()=>{p=+x.dataset.p;list()});
    $$('#cuBody [data-s]').forEach(c=>c.onchange=()=>{c.checked?sel.add(+c.dataset.s):sel.delete(+c.dataset.s);$('#cuSel').textContent=`⬇ Download selected (${sel.size})`});
    $('#cuChk').onchange=e=>{pg.forEach(x=>e.target.checked?sel.add(x.i):sel.delete(x.i));list()};
    $$('#cuBody [data-v]').forEach(x=>x.onclick=()=>certPreview(C(all.find(y=>y.i===+x.dataset.v))));
    $$('#cuBody [data-d]').forEach(x=>x.onclick=()=>printCerts([C(all.find(y=>y.i===+x.dataset.d))],b.tournament));
    $$('#cuBody [data-h]').forEach(x=>x.onclick=()=>{const r=b.rows[+x.dataset.h];r.held=!r.held;store.set('afags_certb',B);audit('certificate',(r.held?'withheld ':'released ')+r.no);toast(r.held?'Certificate withheld — it will not be printed or verified':'Certificate released');list()});
    $$('#cuBody [data-e]').forEach(x=>x.onclick=()=>certEdit(b,b.rows[+x.dataset.e],B,list));
    $('#cuSel').onclick=()=>printCerts(all.filter(x=>sel.has(x.i)&&!x.r.held).map(C),b.tournament+' (selected)');
    $('#cuAll').onclick=()=>printCerts(L.filter(x=>!x.r.held).map(C),b.tournament);
    $('#cuCsv').onclick=()=>dlCSV([['S.No','Certificate no.','Name','AFAGS ID','DOB','District','Event','Position','Status'],...L.map((x,i)=>{const I=rowInfo(x.r);return [i+1,x.r.no+(merit?'-M':''),x.r.name,x.r.afagsId,I.dob,x.r.district,AFAGS_CERT.eventLine(I.gender,x.r.weapon,x.r.category),x.r.position||'',x.r.held?'Withheld':'Issued']})],`afags-${merit?'merit':'participation'}-${b.id}.csv`)}
  function studio(){const L=filt();cur=Math.min(cur,Math.max(0,L.length-1));const x=L[cur];
    $('#cuBody').innerHTML=`<div class="cu-studio"><div class="panel cu-list"><input id="cuQ" placeholder="Search name / ID / district" value="${esc(F.q)}"><div class="cu-items">${L.map((y,k)=>`<button class="cu-it ${k===cur?'on':''} ${y.r.held?'held':''}" data-k="${k}"><b>${esc(y.r.name)}</b><small>${esc(y.r.afagsId||'')} · ${esc(y.r.district||'')}${merit&&y.r.position?' · '+esc(y.r.position):''}</small></button>`).join('')||'<div class="empty">No matches</div>'}</div>
       <div class="cu-row"><button class="btn nav sm2 cu-grow" id="cuAll">🖨 Print all ${L.filter(y=>!y.r.held).length}</button><button class="btn ghost sm2" id="cuCsv">CSV</button></div></div>
      <div class="panel cu-prev">${x?`<div class="cu-ph"><button class="btn ghost sm2" id="cuPrev" ${cur<1?'disabled':''}>‹ Previous</button><span>${cur+1} / ${L.length}${x.r.held?' · <b style="color:#c62828">Withheld</b>':''}</span><button class="btn ghost sm2" id="cuNext" ${cur>=L.length-1?'disabled':''}>Next ›</button></div>
        <div class="afc-box" id="cuBox">${AFAGS_CERT.html(certData(C(x)))}</div>
        <div class="cu-row" style="justify-content:center;margin-top:12px"><button class="btn nav" id="cuPr">🖨 Print / Save PDF</button><button class="btn ghost" id="cuEd">✎ Edit details</button><button class="btn ghost" id="cuHo">${x.r.held?'Release':'⊘ Withhold'}</button></div><p class="sd" style="text-align:center">Tip: use ← → keys to move between certificates.</p>`:'<div class="empty">Nothing to show</div>'}</div></div>`;
    const box=$('#cuBox');box&&requestAnimationFrame(()=>AFAGS_CERT.fit(box));
    const q=$('#cuQ');q.oninput=()=>{F.q=q.value.toLowerCase();cur=0;studio();const n=$('#cuQ');n.focus();n.setSelectionRange(n.value.length,n.value.length)};
    $$('#cuBody [data-k]').forEach(y=>y.onclick=()=>{cur=+y.dataset.k;studio()});
    const go=d=>{cur=Math.max(0,Math.min(L.length-1,cur+d));studio()};$('#cuPrev')&&($('#cuPrev').onclick=()=>go(-1));$('#cuNext')&&($('#cuNext').onclick=()=>go(1));
    $('#cuPr')&&($('#cuPr').onclick=()=>printCerts([C(x)],b.tournament));$('#cuEd')&&($('#cuEd').onclick=()=>certEdit(b,x.r,B,studio));
    $('#cuHo')&&($('#cuHo').onclick=()=>{x.r.held=!x.r.held;store.set('afags_certb',B);audit('certificate',(x.r.held?'withheld ':'released ')+x.r.no);studio()});
    $('#cuAll').onclick=()=>printCerts(L.filter(y=>!y.r.held).map(C),b.tournament);
    $('#cuCsv').onclick=()=>dlCSV([['Certificate no.','Name','AFAGS ID','District','Position'],...L.map(y=>[y.r.no+(merit?'-M':''),y.r.name,y.r.afagsId,y.r.district,y.r.position||''])],`afags-${b.id}.csv`);
    const it=$('#cuBody .cu-it.on');it&&it.scrollIntoView({block:'nearest'})}
  const draw=()=>{const u=(()=>{try{return localStorage.getItem('afags_certui')||'list'}catch(e){return 'list'}})();u==='studio'?studio():list()};
  $('#cuB').onchange=e=>location.hash=`#certificates?v=create&b=${encodeURIComponent(e.target.value)}&t=${merit?'m':'p'}`;
  const sf=(s,k)=>$(s).onchange=e=>{F[k]=e.target.value;p=1;cur=0;draw()};sf('#cuD','dist');sf('#cuG','gender');sf('#cuW','weapon');sf('#cuC','cat');
  $('#cuS').onchange=e=>{b.style=e.target.value;store.set('afags_certb',B);toast('Design: '+(b.style==='classic'?'Classic':'Modern'));draw()};
  const keep=()=>{b.organizer=$('#cbOrg').value.trim();b.end=$('#cbEnd').value;store.set('afags_certb',B);toast('Saved for all certificates of this tournament');draw()};$('#cbOrg').onchange=keep;$('#cbEnd').onchange=keep;
  $$('[data-ui]').forEach(x=>x.onclick=()=>{try{localStorage.setItem('afags_certui',x.dataset.ui)}catch(e){}$$('[data-ui]').forEach(y=>y.classList.toggle('on',y===x));draw()});
  const key=e=>{if(!document.getElementById('cuBox')||e.target.closest('input,select,textarea')||document.querySelector('.md'))return;if(e.key==='ArrowRight'){e.preventDefault();$('#cuNext')&&$('#cuNext').click()}if(e.key==='ArrowLeft'){e.preventDefault();$('#cuPrev')&&$('#cuPrev').click()}};
  document.removeEventListener('keydown',window.__cuKey||(()=>{}));window.__cuKey=key;document.addEventListener('keydown',key);
  draw()}

/* ================= Settings › Registration guides (PDF): replace the 5 website guides ================= */
const GUIDE_LIST=[['fencer','Fencer'],['coach','Coach'],['referee','Referee & Technical Official'],['club','Club / Academy'],['district','District Unit']];
const GDEF=k=>`guides/AFAGS-${{fencer:'Fencer',coach:'Coach',referee:'Referee',club:'Club',district:'District'}[k]}-Registration-Guide.pdf`;
const GIDB=(mode,fn)=>new Promise((res,rej)=>{try{const o=indexedDB.open('afags_files',1);o.onupgradeneeded=()=>o.result.createObjectStore('f');o.onerror=()=>rej(o.error);o.onsuccess=()=>{const tx=o.result.transaction('f',mode);const r=fn(tx.objectStore('f'));tx.oncomplete=()=>res(r&&r.result);tx.onerror=()=>rej(tx.error)}}catch(e){rej(e)}});
const gdKb=n=>n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
function guidesSettings(){if(!ME||!ME.canApprove||location.hash!=='#settings'||$('#gdP'))return;const host=$('#main');if(!host)return;
  const G=store.get('afags_cms_guides')||{};const el=document.createElement('div');el.className='panel';el.id='gdP';
  el.innerHTML=`<h4>📘 Registration guides (PDF)</h4><p class="sd">These are the step-by-step guides visitors open from the website (Registration pages, Jig the assistant, the registration form). Upload a new PDF to replace a guide — the website uses it at once. PDF only, up to 10 MB.</p>
   <div class="gd-l">${GUIDE_LIST.map(([k,n])=>{const g=G[k];return `<div class="gd-r" data-k="${k}"><span class="gd-ic">PDF</span><div class="gd-t"><b>${esc(n)}</b><small>${g&&g.src?`Uploaded · ${esc(g.name||'guide.pdf')} · ${gdKb(g.size||0)} · ${new Date(g.at||Date.now()).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`:'Built-in AFAGS guide'}</small></div>
     <div class="gd-a"><button type="button" class="btn ghost sm2" data-gv="${k}">View</button><label class="btn ghost sm2" style="cursor:pointer">${g&&g.src?'Replace':'Upload'}<input type="file" accept="application/pdf,.pdf" data-gu="${k}" hidden></label>${g&&g.src?`<button type="button" class="btn ghost sm2" data-gx="${k}" title="Go back to the built-in guide">Reset</button>`:''}</div></div>`}).join('')}</div><div id="gdM"></div>`;
  const anchor=$('#faiP')||$('#siteF');anchor?anchor.after(el):host.appendChild(el);
  const msg=(t,ok)=>{$('#gdM').innerHTML=`<div class="alert ${ok?'s':'e'}" style="margin-top:10px">${t}</div>`};
  const put=(k,v)=>{const G2=store.get('afags_cms_guides')||{};if(v)G2[k]=v;else delete G2[k];store.set('afags_cms_guides',G2);try{parent.postMessage({afags:'cms',c:'guides'},'*')}catch(e){}};
  const redraw=()=>{el.remove();guidesSettings()};
  el.querySelectorAll('[data-gu]').forEach(inp=>inp.onchange=async e=>{const f=e.target.files[0],k=inp.dataset.gu,n=GUIDE_LIST.find(x=>x[0]===k)[1];if(!f)return;
    if(f.size>10*1048576)return msg('This PDF is larger than 10 MB. Please compress it (for example with “Save as reduced size PDF”) and try again.');
    const head=new Uint8Array(await f.slice(0,5).arrayBuffer());if(String.fromCharCode(...head)!=='%PDF-')return msg('This file is not a PDF.');
    msg('Uploading…',true);const meta={name:f.name.replace(/[^\w .()-]/g,'').slice(0,80)||'guide.pdf',size:f.size,at:Date.now()};
    try{if(API.online){const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});
        const url=data.replace(/^data:[^;]*;/,'data:application/pdf;');
        /* straight to the server (too big for browser storage): it saves the PDF and answers with uploads/…pdf */
        const G2=store.get('afags_cms_guides')||{};G2[k]={...meta,src:url};const val=JSON.stringify(G2);
        const r=await API.call('PUT','/kv/afags_cms_guides',{value:val},{timeout:120000});const out=r.value||val;
        if(!/"src":"uploads\/[a-f0-9]{32}\.pdf"/.test(out))throw new Error('The server did not accept this PDF');
        AFAGS_API.put('afags_cms_guides',out);try{parent.postMessage({afags:'cms',c:'guides'},'*')}catch(e){}}
      else{await GIDB('readwrite',st=>st.put(f,'guide_'+k));put(k,{...meta,src:'idb:guide_'+k})}
      audit('settings',`${n} guide replaced (${meta.name})`);toast(`${n} guide updated on the website`);redraw()}
    catch(err){msg('Upload failed — '+esc(err.message||'please try again'))}});
  el.querySelectorAll('[data-gx]').forEach(b=>b.onclick=()=>{const k=b.dataset.gx,n=GUIDE_LIST.find(x=>x[0]===k)[1];confirmBox({title:`Reset the ${n} guide?`,body:'The website will show the built-in AFAGS guide again.',ok:'Reset',tone:'no'},()=>{GIDB('readwrite',st=>st.delete('guide_'+k)).catch(()=>{});put(k,null);audit('settings',n+' guide reset to built-in');toast(n+' guide reset');redraw()})});
  el.querySelectorAll('[data-gv]').forEach(b=>b.onclick=async()=>{const k=b.dataset.gv,g=(store.get('afags_cms_guides')||{})[k];let url=GDEF(k);
    try{if(g&&/^idb:/.test(g.src||'')){const bl=await GIDB('readonly',st=>st.get(g.src.slice(4)));if(bl)url=URL.createObjectURL(bl)}else if(g&&/^(uploads\/[a-f0-9]{32}\.pdf|https:\/\/)/.test(g.src||''))url=g.src}catch(e){}
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()})}
{const _ar5=window.__afterRoute;window.__afterRoute=()=>{_ar5&&_ar5();if(location.hash==='#settings')setTimeout(guidesSettings,260)}}

/* ================= Settings › Login ID (Super Admin): change own user ID — password change sits right below ================= */
const LOGIN_OK=/^[a-z][a-z0-9._-]{3,29}$/;
function loginAliases(){return store.get('afags_login')||{}}
/* demo mode: which account does a typed login belong to? (a changed ID replaces the built-in one) */
function demoKeyOf(u){u=String(u||'').toLowerCase();const L=loginAliases(),K=Object.keys(ACCOUNTS);
  return K.find(k=>L[k]===u)||K.find(k=>(k===u||k===loginKey(u))&&!L[k])||K.find(k=>(ACCOUNTS[k].email||'').toLowerCase()===u)||null}
async function currentLogin(){if(API.online){try{const j=await API.call('GET','/auth/me');return (j.user&&j.user.login)||ME.key}catch(e){return ME.key}}return loginAliases()[ME.key]||ME.key}
async function loginIdPanel(){if(!ME||!ME.canApprove||location.hash!=='#settings'||$('#lidF'))return;const pwF=$('#pwF');if(!pwF)return;
  const cur=await currentLogin();if($('#lidF'))return;const def=cur===ME.key&&ME.key==='superadmin';
  const el=document.createElement('form');el.className='panel';el.id='lidF';el.noValidate=true;el.style.marginBottom='18px';
  el.innerHTML=`<h4>🪪 Login ID (User ID)</h4><p class="sd">The ID you type on the sign-in page. Choose a private ID that is hard to guess — together with a strong password this keeps the Super Admin account safe.</p>
   <div class="lid-cur"><span>Current login ID</span><b>${esc(cur)}</b>${def?'<em>⚠️ Still the default — change it</em>':''}</div>
   <div class="cf-g"><label class="cf">New login ID<input id="lidN" maxlength="30" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="e.g. afags.admin.rk"></label>
   <label class="cf">Current password (to confirm)<input id="lidP" type="password" autocomplete="current-password"></label></div>
   <small class="sd">4–30 characters, starting with a letter: small letters, numbers, dot ( . ), dash ( - ) or underscore ( _ ). After the change only the new ID works${API.online?' and every other signed-in device is signed out':''}.</small><div id="lidM"></div>
   <button class="btn nav" style="margin-top:10px">Change login ID</button>`;
  const grid=pwF.closest('.cards2');(grid||pwF).before(el);
  const msg=(t,ok)=>$('#lidM').innerHTML=`<div class="alert ${ok?'s':'e'}" style="animation:none;margin-top:8px">${t}</div>`;
  $('#lidN').oninput=e=>{e.target.value=e.target.value.toLowerCase().replace(/\s/g,'')};
  el.onsubmit=async e=>{e.preventDefault();const n=$('#lidN').value.trim().toLowerCase(),p=$('#lidP').value;
    if(!LOGIN_OK.test(n))return msg('Login ID: 4–30 characters, start with a letter; small letters, numbers, dot, dash or underscore only.');
    if(n===cur)return msg('That is already your login ID.');if(!p)return msg('Enter your current password to confirm.');
    if(API.online){try{await API.call('POST','/auth/username',{current:p,username:n});audit('login-id',`${cur} → ${n}`);try{if(store.get('afags_rem'))store.set('afags_rem',n)}catch(x){}el.remove();await loginIdPanel();msg(`✓ Login ID changed to <b>${esc(n)}</b>. Use it the next time you sign in.`,true);toast('Login ID changed')}catch(x){msg(esc(x.message))}return}
    if(!checkPw(ME.key,p)){audit('login-failed','login ID change — wrong current password');return msg('Current password is incorrect.')}
    if(/^afags/.test(n)&&n!==ME.key)return msg('This login ID is reserved.');
    const L=loginAliases(),clash=Object.keys(ACCOUNTS).some(k=>k!==ME.key&&(k===n||L[k]===n||(ACCOUNTS[k].email||'').toLowerCase()===n||k===loginKey(n)));if(clash)return msg('This login ID is already used by another account.');
    if(n===ME.key)delete L[ME.key];else L[ME.key]=n;store.set('afags_login',L);if(store.get('afags_rem'))store.set('afags_rem',n);audit('login-id',`${cur} → ${n}`);
    el.remove();await loginIdPanel();msg(`✓ Login ID changed to <b>${esc(n)}</b>. Use it the next time you sign in.`,true);toast('Login ID changed')}}
{const _ar6=window.__afterRoute;window.__afterRoute=()=>{_ar6&&_ar6();if(location.hash==='#settings')setTimeout(()=>loginIdPanel().catch(e=>console.warn(e)),80)}}

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

const sess=store.sget('afags_session');if(sessionValid(sess))startApp(sess.user);else{$('#u').value?$('#pw').focus():$('#u').focus()}
})();

