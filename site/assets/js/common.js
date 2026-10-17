// ---- À personnaliser -------------------------------------------------------
const CONFIG = {
  prenom: "Marie",             // son prénom ou son surnom
  signature: "ton chéri",      // comment tu signes les petits mots
  petitsMots: [
    "Tu es ma personne préférée dans tout l'univers.",
    "Je suis fier de toi, tous les jours.",
    "Un jour tu seras la meilleure généalogiste de France, et je serai ton premier client.",
    "Ton rire est mon son préféré.",
    "Même un léopard n'a pas autant de taches que j'ai de raisons de t'aimer.",
    "Bon pour un câlin illimité, valable à vie.",
    "Tu rends tout plus doux, même les lundis.",
    "Si je faisais mon arbre généalogique, je voudrais que tu sois sur toutes les branches à venir.",
    "Pense à boire de l'eau et à te reposer un peu, je t'aime.",
    "Je t'aime plus qu'hier et moins que demain.",
  ],
};
// ---------------------------------------------------------------------------

// Racine du site (ce fichier est dans assets/js/) et mode hors ligne
const ROOT = new URL("../../", document.currentScript.src);
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  addEventListener("load", () => navigator.serviceWorker.register(new URL("sw.js", ROOT), { scope: ROOT.pathname }).catch(() => {}));
}

const STICKERS = {
  genealogie:{ label: "Généalogiste diplômée", art: "📜" },
  ecole:    { label: "Première de la classe", art: "🎓" },
  memory:   { label: "Mémoire de félin", art: "🐆" },
  coeurs:   { label: "Attrapeuse de câlins", art: "💗" },
  leo2048:  { label: "Reine de la jungle", art: "👑" },
  motsmeles:{ label: "Œil de lynx", art: "🔎" },
  sudoku:   { label: "Cerveau de panthère", art: "🧠" },
  coloriage:{ label: "Petite artiste", art: "🎨" },
  bonbons:  { label: "Bec sucré", art: "🧁" },
  tape:     { label: "Patte rapide", art: "🐾" },
  simon:    { label: "Oreille musicale", art: "🎵" },
  taquin:   { label: "Reine du puzzle", art: "🧩" },
  morpion:  { label: "Stratège", art: "❌" },
  motmystere:{ label: "Devineresse", art: "🔤" },
  biscuit:  { label: "Petit mot ouvert", art: "🥠" },
};

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("leo:" + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("leo:" + key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
  },
};

function hasSticker(id) { return !!store.get("stickers", {})[id]; }

function award(id) {
  const all = store.get("stickers", {});
  if (all[id]) return false;
  all[id] = Date.now();
  store.set("stickers", all);
  const s = STICKERS[id];
  toast(`Nouveau sticker : ${s.art} ${s.label} !`);
  confetti();
  return true;
}

function best(key, value, higherIsBetter = true) {
  const prev = store.get("best:" + key, null);
  const better = prev === null || (higherIsBetter ? value > prev : value < prev);
  if (better) store.set("best:" + key, value);
  return { best: better ? value : prev, isNew: better && prev !== null };
}

let toastTimer;
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.className = "confetti";
  document.body.append(c);
  const ctx = c.getContext("2d");
  const dpr = devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const pieces = ["💗", "🐾", "✨", "🌸", "💕"];
  const bits = Array.from({ length: 70 }, () => ({
    x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .5,
    vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2, r: Math.random() * 6.28, vr: -.1 + Math.random() * .2,
    s: 16 + Math.random() * 14, t: pieces[(Math.random() * pieces.length) | 0],
  }));
  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.font = `${b.s}px serif`; ctx.fillText(b.t, 0, 0); ctx.restore();
    }
    if (++frame < 220) requestAnimationFrame(tick); else c.remove();
  })();
}

// Fenêtre de fin : showEnd({title, text, again: fn})
function showEnd({ title, text, againLabel = "Rejouer", again }) {
  const o = document.createElement("div");
  o.className = "overlay";
  o.innerHTML = `<div class="sticker" role="dialog" aria-modal="true">
      <h2></h2><p></p>
      <div class="row" style="justify-content:center">
        <button class="btn" data-a="again"></button>
        <a class="btn ghost" href="${new URL("index.html", ROOT)}" style="text-decoration:none">Retour au repaire</a>
      </div></div>`;
  o.querySelector("h2").textContent = title;
  o.querySelector("p").innerHTML = text;
  const btn = o.querySelector("[data-a=again]");
  btn.textContent = againLabel;
  btn.onclick = () => { o.remove(); again && again(); };
  document.body.append(o);
  btn.focus();
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
