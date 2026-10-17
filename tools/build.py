"""Prépare le site pour le hors ligne : en-têtes communs, manifeste, liste de cache du service worker.
À relancer après chaque modification : python3 tools/build.py"""
import hashlib, json, os, re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

HEAD = """<!--HEAD-->
<meta name="theme-color" content="#c8ae8b">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Coin Léopard">
<link rel="manifest" href="{r}manifest.webmanifest">
<link rel="apple-touch-icon" href="{r}assets/img/apple-touch-icon.png">
<link rel="icon" type="image/png" href="{r}assets/img/favicon.png">
<link rel="stylesheet" href="{r}assets/css/fonts.css">
<link rel="stylesheet" href="{r}assets/css/style.css">
<!--/HEAD-->"""

DROP = ("fonts.googleapis.com", "fonts.gstatic.com", "assets/css/style.css", "claude:viewport-fit-sides")

for page in sorted(SITE.rglob("*.html")):
    depth = len(page.relative_to(SITE).parts) - 1
    block = HEAD.format(r="../" * depth)
    html = page.read_text()
    html = re.sub(r"<!--HEAD-->.*?<!--/HEAD-->", "<!--HEAD-->", html, flags=re.S)
    html = "\n".join(l for l in html.split("\n") if not any(d in l for d in DROP))
    if "<!--HEAD-->" not in html:
        html = re.sub(r"(</title>\n)", r"\1<!--HEAD-->\n", html, count=1)
    page.write_text(html.replace("<!--HEAD-->", block, 1))

manifest = {
    "name": "Le Coin Léopard", "short_name": "Coin Léopard", "lang": "fr",
    "start_url": "./index.html", "scope": "./", "display": "standalone",
    "background_color": "#c8ae8b", "theme_color": "#c8ae8b",
    "icons": [
        {"src": "assets/img/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
    ],
}
(SITE / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

files = sorted(p.relative_to(SITE).as_posix() for p in SITE.rglob("*") if p.is_file() and p.name != "sw.js")
digest = hashlib.sha256()
for f in files:
    digest.update(f.encode()); digest.update((SITE / f).read_bytes())
version = digest.hexdigest()[:12]

sw = f"""// Généré par tools/build.py, ne pas modifier à la main.
const CACHE = "coin-leopard-{version}";
const FILES = {json.dumps(["./"] + files, ensure_ascii=False, indent=2)};

self.addEventListener("install", e => {{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
}});

self.addEventListener("activate", e => {{
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("coin-leopard-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
}});

self.addEventListener("fetch", e => {{
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {{ ignoreSearch: true }}).then(hit => hit || fetch(e.request).then(res => {{
      if (res.ok && new URL(e.request.url).origin === location.origin) {{
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }}
      return res;
    }}).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : Response.error()))
  );
}});
"""
(SITE / "sw.js").write_text(sw)
print(f"{len(files)} fichiers en cache, version {version}")
