// Session parent : jetons à durée limitée et règles d'écriture par collection.
import crypto from "node:crypto";

// Jetons en mémoire : chaque usage prolonge l'expiration.
export function creerSessions({ duree = 15 * 60e3, maintenant = Date.now } = {}) {
  const jetons = new Map(); // jeton -> expiration
  return {
    ouvrir() {
      const jeton = crypto.randomBytes(32).toString("hex");
      jetons.set(jeton, maintenant() + duree);
      return jeton;
    },
    valide(jeton) {
      if (!jeton) return false;
      const fin = jetons.get(jeton);
      if (fin === undefined) return false;
      if (maintenant() > fin) { jetons.delete(jeton); return false; }
      jetons.set(jeton, maintenant() + duree);
      return true;
    },
    fermer(jeton) { jetons.delete(jeton); },
  };
}

// Contrôles de bon sens sur le document écrit. Les anciens documents (règles plus généreuses)
// ne sont vérifiés que s'ils sont nouveaux ou si un champ contrôlé change.
function incoherent(col, data, existant) {
  if (!data || typeof data !== "object") return false;
  const change = champs => !existant || champs.some(c => String(existant[c]) !== String(data[c]));
  if (col === "quiz" && change(["score", "total", "etoiles"])) {
    const { score, total, etoiles } = data;
    if (score != null && total != null && Number(score) > Number(total)) return true;
    if (etoiles != null && total != null && Number(etoiles) > 2 * (Number(total) + 5) + 4) return true;
  }
  if (col === "notes" && change(["valeur", "sur"])) {
    const valeur = Number(data.valeur), sur = Number(data.sur);
    if (!(sur > 0) || !(valeur >= 0 && valeur <= sur)) return true;
  }
  return false;
}

// Une demande d'achat que l'enfant peut créer seul : au bon prix, ou cadeau de palier gratuit.
function demandeLegitime({ data, existant, recompenses }) {
  if (existant || !data || data.statut !== "demandé") return false;
  const cout = Number(data.cout);
  if (data.recompenseId != null) {
    const rec = recompenses?.[data.recompenseId];
    if (!rec) return false;
    if (cout === 0 && Number(data.palier) > 0) return true;
    return cout === Number(rec.cout);
  }
  return cout === 0 && Number(data.palier) > 0;
}

// L'enfant choisit seul son monde (skin) et le clair / sombre (theme) : permis si rien d'autre ne change dans config/main.
const APPARENCE = ["skin", "theme"];
function seulApparenceChange(data, existant) {
  if (!data || typeof data !== "object" || !existant) return false;
  if (APPARENCE.some(c => data[c] != null && (typeof data[c] !== "string" || !/^[a-z]{1,20}$/.test(data[c])))) return false;
  const cles = new Set([...Object.keys(data), ...Object.keys(existant)]);
  for (const c of [...APPARENCE, "id"]) cles.delete(c);
  return [...cles].every(c => JSON.stringify(data[c]) === JSON.stringify(existant[c]));
}

// Attente (ms) après le n-ième échec de code consécutif : 1 s, 2 s, 4 s… plafonnée à une minute.
export function delaiEchec(n) { return Math.min(2 ** (n - 1), 60) * 1000; }

// null si l'écriture est permise, sinon "parent" (jeton requis) ou "invalide" (document incohérent).
export function autorise({ col, id, data, existant, parent, pinDefini, recompenses, suppression = false }) {
  if (!suppression && incoherent(col, data, existant)) return "invalide";
  if (!pinDefini) return null;
  if (col === "config" && id === "pin") return "parent";
  if (parent) return null;
  if (col === "recompenses" || col === "programme") return "parent";
  if (col === "config" && id === "main") return seulApparenceChange(data, existant) ? null : "parent";
  if (col === "achats") {
    if (suppression) return "parent";
    return demandeLegitime({ data, existant, recompenses }) ? null : "parent";
  }
  return null;
}

// Exécute les fonctions async l'une après l'autre (essais de code parent).
export function fileUneParUne() {
  let queue = Promise.resolve();
  return fn => {
    const p = queue.then(fn);
    queue = p.catch(() => {});
    return p;
  };
}
