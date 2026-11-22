const P = [
  null,
  {cat:"UX Research · UI Design", title:"Application mobile",
   desc:"Projet UX/UI de master : recherche utilisateur, personas, parcours, wireframes et prototype interactif testé auprès d'utilisateurs.",
   role:"UX/UI Designer", tools:"Figma", year:"2026",
   next:"Étude de cas en préparation."},
  {cat:"Motion design", title:"Motion & communication",
   desc:"Création de supports de communication digitale et print, et d'animations en motion design pendant le stage chez IB Comprod.",
   role:"Graphic Designer (stagiaire)", tools:"After Effects, Illustrator", year:"2024",
   next:"Sélection de vidéos à venir."},
  {cat:"Social media", title:"Contenus réseaux sociaux",
   desc:"Création de visuels pour les réseaux sociaux de Foot24 (Avatar Media) et participation au processus créatif de l'équipe.",
   role:"Graphic Designer (stagiaire)", tools:"Photoshop, Illustrator", year:"2023",
   next:"Galerie de publications à venir."},
  {cat:"Print & digital", title:"Supports graphiques",
   desc:"Conception et réalisation de supports graphiques professionnels et de documents visuels adaptés aux besoins de DM TN.",
   role:"Graphic Designer", tools:"InDesign, Illustrator, Photoshop", year:"2025",
   next:"Sélection de réalisations à venir."}
];
const dlg = document.getElementById('dlg');
const $ = id => document.getElementById(id);
function openP(i){
  const p = P[i];
  $('dlg-cat').textContent = p.cat; $('dlg-title').textContent = p.title; $('dlg-desc').textContent = p.desc;
  $('dlg-role').textContent = p.role; $('dlg-tools').textContent = p.tools; $('dlg-year').textContent = p.year; $('dlg-next').textContent = p.next;
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
}
document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('click',()=>openP(+c.dataset.p));
  c.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openP(+c.dataset.p);} });
});
$('dlg-close').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });

/* Routage : #ecoresto ouvre l'étude de cas, toute autre ancre revient au portfolio */
const CASES = {ecoresto:['cs-ecoresto','EcoResto'], patcare:['cs-patcare','PATCare'], voltup:['cs-voltup','VoltUP'], maybank:['cs-maybank','Maybank'], mbooking:['cs-mbooking','MBooking'], droits:['cs-droits','Droits.tn'], monsapo:['cs-monsapo','Monsapo'], exersize:['cs-exersize','Exersize'], ixia:['cs-ixia','Institut IXIA'], flexoprint:['cs-flexoprint','Flexoprint'], aroui:['cs-aroui',"Au temps d'El Aroui"], motion:['cs-motion','Motion design'], social:['cs-social','Illustrations sport'], boheme:['cs-boheme','Bohème']};
const lb = $('lb');
document.querySelectorAll('[data-lb]').forEach(b => b.addEventListener('click', () => {
  $('lb-img').src = b.dataset.lb; $('lb-img').alt = b.dataset.cap; $('lb-cap').textContent = t(b.dataset.cap);
  if (lb.showModal) lb.showModal(); else lb.setAttribute('open','');
}));
$('lb-close').addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
const home = [document.querySelector('header.nav'), document.querySelector('main'), document.querySelector('footer')];
/* Vidéos sur téléphone : certains mobiles refusent la lecture en flux ; on charge alors le fichier entier puis on le lit localement */
const touchDev = matchMedia('(pointer:coarse)').matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
function prepVideo(v){
  const src = v.getAttribute('src');
  if (!src || v.dataset.b) return;
  v.dataset.b = '1';
  const go = () => {
    fetch(src).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => {
      const was = !v.paused, u = URL.createObjectURL(new Blob([b], {type:'video/mp4'}));
      v.src = u; v.load();
      if (v.autoplay || was) v.play().catch(() => { v.controls = true; });
    }).catch(() => { v.controls = true; });
  };
  if (touchDev) go(); else v.addEventListener('error', go, {once:true});
}
/* Une seule vidéo à la fois dans une page : lancer l'une met les autres en pause */
document.addEventListener('play', e => {
  const v = e.target;
  if (!v || v.tagName !== 'VIDEO') return;
  const art = v.closest('article');
  if (art) art.querySelectorAll('video').forEach(o => { if (o !== v) o.pause(); });
}, true);
function route(){
  const h = location.hash.slice(1);
  const showCs = h in CASES;
  Object.entries(CASES).forEach(([k,[id]]) => {
    const el = $(id); el.hidden = k !== h;
    el.querySelectorAll('video').forEach(v => { if (el.hidden) v.pause(); else { prepVideo(v); if (v.autoplay) v.play().catch(()=>{ v.controls = true; }); } });
  });
  home.forEach(el => el.hidden = showCs);
  if (!showCs) document.querySelectorAll('main video').forEach(prepVideo);
  if (showCs){ window.scrollTo(0,0); document.title = CASES[h][1] + ' — Issrar Karoui'; }
  else {
    document.title = 'Issrar Karoui — Portfolio';
    const t = h && document.getElementById(h);
    if (t) requestAnimationFrame(()=>t.scrollIntoView());
  }
}
window.addEventListener('hashchange', route);
route();

document.querySelectorAll('.ptype').forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))));
$('form').addEventListener('submit',e=>{
  e.preventDefault();
  const f = e.target, note = $('form-note');
  if(!f.name.value.trim() || !f.email.value.includes('@') || !f.message.value.trim()){
    note.textContent = t("Merci de remplir votre nom, une adresse e-mail valide et un message."); return;
  }
  const types = [...document.querySelectorAll('.ptype[aria-pressed="true"]')].map(b => b.textContent.trim());
  const body = encodeURIComponent((types.length ? t('Type de projet') + ' : ' + types.join(', ') + "\n\n" : '') + f.message.value + "\n\n— " + f.name.value + " (" + f.email.value + ")");
  const href = "mailto:issrarkaroui8@gmail.com?subject=" + encodeURIComponent("Contact portfolio") + "&body=" + body;
  note.textContent = '';
  const a = document.createElement('a'); a.href = href; a.style.cssText = 'color:var(--accent);font-weight:600'; a.textContent = t('ouvrir dans ma messagerie');
  note.append(t('Votre message est prêt :') + ' ', a, t(', ou écrivez directement à issrarkaroui8@gmail.com.'));
});

/* ===== Langue FR / EN ===== */
let LANG = 'fr';
const EN = window.I18N_EN || {};
function t(fr){ return (LANG === 'en' && Object.prototype.hasOwnProperty.call(EN, fr)) ? EN[fr] : fr; }
const ORIG = new WeakMap();
const ATTRS = ['alt','aria-label','placeholder'];
function applyLang(lang){
  LANG = lang;
  document.documentElement.lang = lang;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())){
    const p = n.parentElement; if (!p || p.closest('script,style')) continue;
    if (!ORIG.has(n)) ORIG.set(n, n.nodeValue);
    const o = ORIG.get(n), k = o.trim();
    if (!k) continue;
    if (lang === 'en' && Object.prototype.hasOwnProperty.call(EN, k)){
      const lead = o.match(/^\s*/)[0], trail = o.match(/\s*$/)[0];
      n.nodeValue = lead + EN[k] + trail;
    } else n.nodeValue = o;
  }
  document.querySelectorAll('[alt],[aria-label],[placeholder]').forEach(el => {
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      const key = 'fr' + a.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, c => c.toUpperCase());
      if (!(key in el.dataset)) el.dataset[key] = el.getAttribute(a);
      el.setAttribute(a, t(el.dataset[key]));
    });
  });
  document.querySelectorAll('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  updateThemeLabel();
  try { localStorage.setItem('ik-lang', lang); } catch(e) {}
}
/* Ajoute le sélecteur de langue dans la barre de chaque étude de cas */
document.querySelectorAll('.cs-bar .wrap').forEach(wr => {
  const back = wr.querySelector('a[href="#projets"]:not(.logo)');
  const box = document.createElement('div'); box.className = 'bar-right';
  box.appendChild(document.querySelector('.nav .lang-switch').cloneNode(true));
  if (back) box.appendChild(back);
  wr.appendChild(box);
});
document.addEventListener('click', e => {
  const b = e.target.closest('.lang-switch button'); if (!b) return;
  applyLang(b.dataset.lang);
});


/* ===== Filtres projets ===== */
const cards = [...document.querySelectorAll('.projects .card')];
document.querySelectorAll('.chip-f').forEach(b => {
  const f = b.dataset.f;
  b.querySelector('sup').textContent = f === 'all' ? cards.length : cards.filter(c => c.dataset.cat === f).length;
  b.addEventListener('click', () => {
    document.querySelectorAll('.chip-f').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const shown = cards.filter(c => f === 'all' || c.dataset.cat === f);
    cards.forEach(c => { c.classList.toggle('is-hidden', !shown.includes(c)); c.classList.remove('fx-in','span2'); });
    // une carte seule sur sa ligne prend toute la largeur
    const small = shown.filter(c => !c.classList.contains('wide'));
    if (small.length % 2 === 1) small[small.length - 1].classList.add('span2');
    shown.forEach((c, i) => { void c.offsetWidth; c.style.animationDelay = (i * 60) + 'ms'; c.classList.add('fx-in'); });
  });
});
/* ===== Thème clair / sombre ===== */
const root = document.documentElement;
function isDark(){
  const th = root.getAttribute('data-theme');
  if (th) return th === 'dark';
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
}
function updateThemeLabel(){
  const b = $('theme-btn'); if (!b) return;
  b.setAttribute('aria-label', t(isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'));
}
$('theme-btn').addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('ik-theme', next); } catch(e) {}
  updateThemeLabel();
});

/* ===== Copier ===== */
const toast = $('toast'); let toastT;
function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 1800); }
document.querySelectorAll('.copy').forEach(btn => btn.addEventListener('click', async () => {
  const label = btn.querySelector('span');
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('done'); label.textContent = t('Copié');
    showToast(t('Copié dans le presse-papiers'));
    setTimeout(() => { btn.classList.remove('done'); label.textContent = t('Copier'); }, 1600);
  } catch (err) {
    const v = btn.previousElementSibling;
    if (v){ const r = document.createRange(); r.selectNodeContents(v); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    showToast(t('Copie impossible : sélectionnez le texte manuellement.'));
  }
}));

/* ===== CV ===== */
const cvDlg = $('cv-dlg');
function cvShow(v){
  ['fr','en'].forEach(k => {
    $('cv-img-'+k).hidden = k !== v; $('cv-pdf-'+k).hidden = k !== v;
    $('cv-tab-'+k).setAttribute('aria-selected', k === v ? 'true' : 'false');
  });
  cvDlg.scrollTop = 0;
}
document.querySelectorAll('.cv-tab').forEach(t => t.addEventListener('click', () => cvShow(t.dataset.v)));
document.querySelectorAll('[data-cv]').forEach(b => b.addEventListener('click', e => {
  e.preventDefault();
  cvShow(document.documentElement.lang === 'en' ? 'en' : 'fr');
  if (cvDlg.showModal) cvDlg.showModal(); else cvDlg.setAttribute('open','');
}));
$('cv-close').addEventListener('click', () => cvDlg.close());
cvDlg.addEventListener('click', e => { if (e.target === cvDlg) cvDlg.close(); });

/* Préférences enregistrées */
try {
  const th = localStorage.getItem('ik-theme'); if (th) root.setAttribute('data-theme', th);
  const lg = localStorage.getItem('ik-lang'); if (lg === 'en') applyLang('en'); else updateThemeLabel();
} catch(e) { updateThemeLabel(); }
