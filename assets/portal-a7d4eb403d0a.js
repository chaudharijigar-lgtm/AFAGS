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
