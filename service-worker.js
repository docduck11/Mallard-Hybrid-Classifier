
const CACHE = "wma-esf-final-v1";
const ASSETS = ["./","./index.html","./manifest.json","./logo.png","./duck_tractor.png",
"icon-192.png","icon-256.png","icon-384.png","icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
