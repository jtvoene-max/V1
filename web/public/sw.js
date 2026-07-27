// Service worker: maakt de site installeerbaar en bruikbaar zonder verbinding.
// Bewust minimaal: prijzen en voorraad mogen nooit uit een verouderde cache komen,
// dus alleen de schil en statische bestanden worden bewaard.

const CACHE = "still-iconic-v1";
const SCHIL = ["/offline", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SCHIL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((namen) => Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Statische bestanden: eerst uit cache, dat scheelt laadtijd op mobiel
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/uploads") || SCHIL.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const kopie = res.clone();
        caches.open(CACHE).then((c) => c.put(req, kopie));
        return res;
      }))
    );
    return;
  }

  // Pagina's: altijd vers ophalen; zonder verbinding het offline-scherm
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline")));
  }
});
