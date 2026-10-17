// Généré par tools/build.py, ne pas modifier à la main.
const CACHE = "coin-leopard-08688e174868";
const FILES = [
  "./",
  "assets/css/fonts.css",
  "assets/css/style.css",
  "assets/fonts/BagelFatOne-400-normal-124559.woff2",
  "assets/fonts/BagelFatOne-400-normal-167790.woff2",
  "assets/fonts/BagelFatOne-400-normal-180167.woff2",
  "assets/fonts/BagelFatOne-400-normal-263437.woff2",
  "assets/fonts/BagelFatOne-400-normal-30434.woff2",
  "assets/fonts/BagelFatOne-400-normal-32906.woff2",
  "assets/fonts/BagelFatOne-400-normal-373138.woff2",
  "assets/fonts/BagelFatOne-400-normal-375501.woff2",
  "assets/fonts/BagelFatOne-400-normal-46550.woff2",
  "assets/fonts/BagelFatOne-400-normal-541300.woff2",
  "assets/fonts/BagelFatOne-400-normal-567485.woff2",
  "assets/fonts/BagelFatOne-400-normal-570060.woff2",
  "assets/fonts/BagelFatOne-400-normal-651970.woff2",
  "assets/fonts/BagelFatOne-400-normal-770743.woff2",
  "assets/fonts/BagelFatOne-400-normal-795375.woff2",
  "assets/fonts/BagelFatOne-400-normal-975972.woff2",
  "assets/fonts/BagelFatOne-400-normal-984764.woff2",
  "assets/fonts/Caveat-500-normal-184187.woff2",
  "assets/fonts/Caveat-500-normal-332291.woff2",
  "assets/fonts/Caveat-700-normal-184187.woff2",
  "assets/fonts/Caveat-700-normal-332291.woff2",
  "assets/fonts/IMFellEnglish-400-italic-731878.woff2",
  "assets/fonts/IMFellEnglish-400-normal-258776.woff2",
  "assets/fonts/Nunito-400-normal-628706.woff2",
  "assets/fonts/Nunito-400-normal-769156.woff2",
  "assets/fonts/Nunito-600-normal-628706.woff2",
  "assets/fonts/Nunito-600-normal-769156.woff2",
  "assets/fonts/Nunito-800-normal-628706.woff2",
  "assets/fonts/Nunito-800-normal-769156.woff2",
  "assets/img/apple-touch-icon.png",
  "assets/img/favicon.png",
  "assets/img/icon-192.png",
  "assets/img/icon-512.png",
  "assets/img/leopard.jpg",
  "assets/js/common.js",
  "ecole/cours.html",
  "ecole/outils.html",
  "index.html",
  "jeux/2048.html",
  "jeux/bonbons.html",
  "jeux/coeurs.html",
  "jeux/coloriage.html",
  "jeux/genealogie.html",
  "jeux/memory.html",
  "jeux/morpion.html",
  "jeux/mot-mystere.html",
  "jeux/mots-meles.html",
  "jeux/simon.html",
  "jeux/sudoku.html",
  "jeux/tape-leopard.html",
  "jeux/taquin.html",
  "manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("coin-leopard-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : Response.error()))
  );
});
