/* A complete, scope-owned offline release. Never delete other apps' caches. */
const SCOPE = self.registration.scope;
const PREFIX = 'pcguide:' + new URL(SCOPE).pathname + ':';
const CACHE = PREFIX + '3.0.0-e04d0b0133';
const ASSETS = ["","appnest-assistant.js","icon-180.png","icon-192.png","icon-512.png","index.html","manifest.json","pcg-content.js","pcg-depth.js","pcg-learning.js","pcg-paths.js","pcg-pro.css","pcg-pro.js","pcg-state.js","pcg-upgrade.css","pcg-upgrade.js","pcg-visuals.css","pcg-visuals.js","privacy_policy.html","assets/windows-guides/sources.json","assets/windows-guides/win10-sound-output.png","assets/windows-guides/win10-volume-mixer.png","assets/windows-guides/win11-backup.png","assets/windows-guides/win11-volume-mixer.png"];
const URLS = new Set(ASSETS.map(p=>new URL(p,SCOPE).href));
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...URLS])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);url.search='';url.hash='';
 if(!URLS.has(url.href))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.href))||fetch(event.request)));
});
