/* AFAGS offline support (works at / or under a sub-folder such as GitHub Pages /repo/): pages network-first, files cache-first, API never cached */
const V='afags-v6';const CORE=['./','index.html','afags-portal.html','manifest.webmanifest','icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/api/'))return;
  const html=e.request.mode==='navigate'||/\.html$/.test(u.pathname);
  e.respondWith(html?fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
    :caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&/\/(assets|guides|icons|uploads)\//.test(u.pathname)){const c=n.clone();caches.open(V).then(x=>x.put(e.request,c))}return n})))});
