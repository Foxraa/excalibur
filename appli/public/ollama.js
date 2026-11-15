/* Sur un PC neuf où l'IA choisie est Ollama mais pas installée : une fenêtre par-dessus le cartable
   demande s'il faut l'installer (oui / non), puis suit l'installation et le téléchargement du modèle. */
(function () {
  const style = document.createElement('style');
  style.textContent = `
#ollama-voile{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:16px;
  background:color-mix(in srgb,var(--ink) 55%,transparent);backdrop-filter:blur(3px)}
#ollama-voile .card{width:min(100%,520px);max-height:calc(100vh - 32px);overflow:auto}
#ollama-voile h2{margin:0 0 10px;font-family:var(--f-title,inherit);font-size:1.4em}
#ollama-voile p{margin:0 0 12px}
#ollama-voile .row{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:16px}
#ollama-voile .barre{height:16px;border-radius:999px;background:var(--surface-2);border:2px solid var(--line);overflow:hidden;margin:6px 0 12px}
#ollama-voile .barre span{display:block;height:100%;background:var(--accent);transition:width .4s}
#ollama-voile .barre.attente span{width:35%!important;animation:ollama-va 1.6s ease-in-out infinite alternate}
@keyframes ollama-va{from{margin-left:0}to{margin-left:65%}}
@media (prefers-reduced-motion:reduce){#ollama-voile .barre.attente span{animation:none;width:100%!important;opacity:.5}}`;
  document.head.appendChild(style);

  let voile = null, suivi = null;
  const ERREURS = {
    winget: "Windows n'a pas l'outil d'installation (winget). Installez Ollama depuis ollama.com/download, puis relancez « Démarrer le cartable ».",
    installation: "L'installation d'Ollama n'a pas abouti. Vérifiez la connexion internet et réessayez, ou installez-le depuis ollama.com/download.",
    demarrage: "Ollama est installé mais ne démarre pas. Ouvrez l'application Ollama depuis le menu Démarrer, puis réessayez.",
    modele: "Le téléchargement du modèle s'est arrêté (connexion coupée ?). Réessayez : il reprend là où il en était.",
    pc: "L'installation se lance seulement depuis le PC où tourne le cartable.",
    reseau: "Le serveur du cartable ne répond pas.",
  };

  function ouvrir(html) {
    if (!voile) {
      voile = document.createElement('div');
      voile.id = 'ollama-voile';
      voile.setAttribute('role', 'dialog');
      voile.setAttribute('aria-modal', 'true');
      voile.setAttribute('aria-labelledby', 'ollama-titre');
      voile.addEventListener('click', clic);
      document.body.appendChild(voile);
    }
    voile.innerHTML = `<div class="card">${html}</div>`;
    const b = voile.querySelector('button.primary') || voile.querySelector('button');
    if (b) b.focus();
  }
  function fermer() { if (voile) { voile.remove(); voile = null; } clearTimeout(suivi); }

  const question = e => ouvrir(`
<h2 id="ollama-titre">🤖 Installer Ollama ?</h2>
<p>L'IA du cartable est réglée sur <b>Ollama</b>, qui tourne sur ce PC : c'est gratuit et rien ne sort de la maison. Mais Ollama n'est pas encore installé.</p>
<p><b>La première fois, c'est long</b> : il faut installer Ollama puis télécharger son modèle (${esc(e.modele || '')}, plusieurs Go). Comptez de 10 minutes à plus d'une heure selon la connexion. Ensuite, c'est fait pour de bon.</p>
<p class="small muted">Sans Ollama, le cartable marche, mais sans l'aide de l'IA. Vous pourrez aussi choisir Claude ou Mistral (payants, avec une clé API) dans l'espace parents, à l'étape « L'IA du cartable ».</p>
<div class="row"><button class="btn" data-o="non">Non, pas maintenant</button><button class="btn primary" data-o="oui">Oui, installer</button></div>`);

  function avancement(e) {
    const titres = {
      installation: ['Installation d\'Ollama…', "Windows peut demander une autorisation : acceptez-la. Cela prend quelques minutes."],
      demarrage: ['Démarrage d\'Ollama…', 'Encore quelques secondes.'],
      modele: ['Téléchargement du modèle…', `Plusieurs Go à télécharger : c'est l'étape la plus longue. Vous pouvez laisser cette page ouverte et faire autre chose.`],
    };
    const [t, p] = titres[e.etape];
    const pc = e.etape === 'modele' && e.pourcent != null ? e.pourcent : null;
    ouvrir(`
<h2 id="ollama-titre">⏳ ${t}</h2>
<p>${p}</p>
<div class="barre${pc == null ? ' attente' : ''}" role="progressbar" aria-valuemin="0" aria-valuemax="100"${pc == null ? '' : ` aria-valuenow="${pc}"`}><span style="width:${pc || 0}%"></span></div>
${pc == null ? '' : `<p class="small muted">${pc} %</p>`}
<p class="small muted">Ne fermez pas la fenêtre noire du cartable pendant l'installation.</p>
<div class="row"><button class="btn" data-o="cacher">Masquer</button></div>`);
  }

  function afficher(e) {
    if (e.etape === 'pret') {
      ouvrir(`<h2 id="ollama-titre">✅ Ollama est prêt</h2><p>L'IA du cartable est installée. La première question peut prendre une minute, le temps que le modèle se charge.</p><div class="row"><button class="btn primary" data-o="fermer">Super !</button></div>`);
      if (typeof window.brancherIA === 'function') window.brancherIA();
      return;
    }
    if (e.etape === 'erreur') {
      ouvrir(`<h2 id="ollama-titre">⚠️ Ollama n'est pas installé</h2><p>${ERREURS[e.code] || ERREURS.installation}</p><div class="row"><button class="btn" data-o="non">Fermer</button><button class="btn primary" data-o="oui">Réessayer</button></div>`);
      return;
    }
    avancement(e);
  }

  // Le suivi continue même fenêtre masquée : elle revient d'elle-même quand c'est fini.
  let masque = false;
  async function suivre() {
    let e;
    try { e = await fetch('/api/ollama', { cache: 'no-store' }).then(r => r.json()); } catch (x) { suivi = setTimeout(suivre, 3000); return; }
    const enCours = ['installation', 'demarrage', 'modele'].includes(e.etape);
    if (!masque || !enCours) { masque = false; afficher(e); }
    if (enCours) suivi = setTimeout(suivre, 1500);
  }

  async function repondre(reponse) {
    let r;
    try { r = await fetch('/api/ollama', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reponse }) }).then(x => x.json()); }
    catch (x) { r = { code: 'reseau' }; }
    if (reponse === 'non') return fermer();
    if (!r.ok) return afficher({ etape: 'erreur', code: r.code });
    masque = false;
    afficher({ etape: 'installation' });
    suivi = setTimeout(suivre, 1000);
  }

  function clic(ev) {
    const b = ev.target.closest('[data-o]');
    if (!b) return;
    const o = b.dataset.o;
    if (o === 'oui' || o === 'non') repondre(o);
    else if (o === 'cacher') { masque = true; if (voile) { voile.remove(); voile = null; } }
    else fermer();
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }

  // Au chargement : on propose l'installation, ou on reprend le suivi si elle tourne déjà (page rechargée).
  fetch('/api/ollama', { cache: 'no-store' }).then(r => r.json()).then(e => {
    if (e.proposer) question(e);
    else if (['installation', 'demarrage', 'modele'].includes(e.etape)) suivre();
  }).catch(() => {});
})();
