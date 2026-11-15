// Lancer avec : npm test
import test from "node:test";
import assert from "node:assert/strict";
import "./public/questions.js";

const { controlerQuestion: c, memeReponse, memeEcriture, promptResolution, accordResolution } = globalThis;
const vf = (question, bonne = true) => c({ type: "vf", question, bonne });
const courte = (question, ...reponses) => c({ type: "courte", question, reponses });

test("un vrai/faux qui propose deux mots est refusé", () => {
  assert.ok(vf("Dans la phrase « Nous allons à la plage », le mot « à » est-il un verbe ou une préposition ?").refus);
  assert.ok(vf("Le total sera plus proche de 4 € ou de 5 € ?").refus);
  assert.ok(vf("Quels sont les deux mots qui riment ?").refus);
  assert.ok(vf("Trouve deux mots de la même famille.").refus);
});

test("un vrai/faux normal passe, sans « Vrai ou faux : » au début", () => {
  assert.equal(vf("Vrai ou faux : Un carré a quatre côtés.").question.question, "Un carré a quatre côtés.");
  assert.equal(vf("Le mot « à » est ici une préposition.").question.type, "vf");
});

test("une question en oui ou non reçoit les boutons Oui et Non", () => {
  const r = vf("Est-ce qu'un carré a quatre côtés ?", false).question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["Oui", "Non"], 1]);
  const s = courte("Cette figure est-elle un carré ? Réponds par oui ou non.", "oui").question;
  assert.deepEqual([s.type, s.question, s.bonne], ["qcm", "Cette figure est-elle un carré ?", 0]);
});

test("sans texte à lire, rien ne fait croire à une dictée", () => {
  assert.ok(courte("Écoute bien la phrase et écris-la.", "chat").refus);
  assert.ok(courte("Écris le mot que tu entends.", "chat").refus);
  assert.ok(c({ type: "qcm", question: "Dictée : quel mot est bien écrit ?", choix: ["a", "b"], bonne: 0 }).refus);
  assert.equal(vf("Pour dire « Écoutez » en anglais, on dit « Listen ».").question.type, "vf");
});

const OK = { matiere: "francais", voix: true };
const orale = (question, oral, reponses, ctx = OK, reste = {}) => c({ type: "courte", question, oral, reponses, ...reste }, ctx);

test("une question orale bien faite passe, en français avec la voix française", () => {
  const r = orale("Écoute et écris le verbe.", "Les enfants mangent une pomme.", ["mangent"]).question;
  assert.deepEqual([r.type, r.oral, r.langue], ["courte", "Les enfants mangent une pomme.", "fr-FR"]);
});

test("en anglais, la voix est anglaise et la réponse peut être une traduction", () => {
  const r = orale("Écoute et écris le mot en français.", "apple", ["pomme"], { matiere: "anglais", voix: true }).question;
  assert.deepEqual([r.oral, r.langue, r.reponses], ["apple", "en-US", ["pomme"]]);
});

test("pas d'oral là où il ne sert à rien, ni sans voix", () => {
  assert.ok(orale("Écoute et écris.", "douze", ["12"], { matiere: "maths", voix: true }).refus);
  assert.ok(orale("Écoute et écris.", "les enfants", ["enfants"], { matiere: "francais", voix: false }).refus);
  assert.ok(orale("Écoute et écris.", "les enfants", ["enfants"], {}).refus);
  assert.ok(c({ type: "qcm", question: "Écoute et choisis.", oral: "chat", choix: ["a", "b"], bonne: 0 }, OK).refus);
});

test("en français, la réponse doit être dans ce qui est lu", () => {
  assert.ok(orale("Écoute et écris le verbe.", "Les enfants jouent.", ["mangent"]).refus);
});

test("le texte lu est court", () => {
  const long = "un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize";
  assert.ok(orale("Écoute et écris.", long, [long]).refus);
  assert.ok(orale("Écoute et écris.", "   ", ["chat"]).refus);
});

test("ce qui est lu n'est jamais affiché, ni dans la question ni dans l'indice", () => {
  const r = orale("Écris : les enfants mangent.", "les enfants mangent", ["les enfants mangent"], OK, { indice: "On écrit les enfants mangent." }).question;
  assert.doesNotMatch(r.question, /mangent/);
  assert.equal(r.indice, undefined);
  const s = orale("Écoute et écris.", "le chat dort", ["le chat dort"], OK, { indice: "Pense au verbe." }).question;
  assert.equal(s.indice, "Pense au verbe.");
});

test("il et ils s'entendent pareil : le nombre est précisé à l'écran", () => {
  assert.match(orale("Écoute et écris.", "ils mangent", ["ils mangent"]).question.question, /au pluriel/);
  assert.match(orale("Écoute et écris.", "elle chante", ["elle chante"]).question.question, /au singulier/);
  assert.doesNotMatch(orale("Écoute et écris.", "ils arrivent", ["ils arrivent"]).question.question, /pluriel/);
  assert.doesNotMatch(orale("Écoute et écris.", "tu chantes", ["tu chantes"]).question.question, /pluriel|singulier/);
  assert.doesNotMatch(orale("Écoute et écris.", "Les enfants mangent.", ["mangent"]).question.question, /pluriel/);
  assert.equal(orale("Écris au pluriel.", "ils mangent", ["ils mangent"]).question.question.match(/pluriel/g).length, 1);
});

test("un mot seul qui se prononce comme un autre est refusé", () => {
  assert.ok(orale("Écoute et écris.", "à", ["à"]).refus);
  assert.ok(orale("Écoute et écris.", "ces", ["ces"]).refus);
  assert.ok(orale("Écoute et écris.", "mer", ["mer"]).refus);
  assert.ok(orale("Écoute et écris.", "Ces chats dorment.", ["Ces chats dorment."]).question);
});

test("une question qui affiche le mot à écrire devient une question orale", () => {
  const r = c({ type: "courte", question: "Comment écrit-on ils mangent ?", reponses: ["ils mangent"] }, OK).question;
  assert.equal(r.oral, "ils mangent");
  assert.doesNotMatch(r.question, /mangent/);
  assert.match(r.question, /au pluriel/);
  const s = c({ type: "courte", question: "Quel est l'orthographe du mot « maison » ?", reponses: ["maison"] }, OK).question;
  assert.equal(s.oral, "maison");
});

test("sans voix, ou hors français et anglais, cette question reste refusée", () => {
  const x = { type: "courte", question: "Comment écrit-on ils mangent ?", reponses: ["ils mangent"] };
  assert.ok(c(x).refus);
  assert.ok(c(x, { matiere: "francais", voix: false }).refus);
  assert.ok(c(x, { matiere: "maths", voix: true }).refus);
});

test("un choix entre mots tapé à la main devient un QCM", () => {
  const r = courte("Dans la phrase : « Le chat ___ faim », dois-tu écrire « a » ou « à » ? Explique ton choix en remplaçant le mot.", "a", "a (car on peut dire avait)").question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["a", "à"], 0]);
  assert.doesNotMatch(r.question, /Explique/);
  const s = courte("Quel homophone faut-il choisir : ses, ces ou c'est ?", "ces").question;
  assert.deepEqual([s.type, s.choix, s.bonne], ["qcm", ["ses", "ces", "c'est"], 1]);
});

test("« Complète avec a ou à » devient un QCM", () => {
  const r = courte("Complète avec a ou à : La maîtresse donne le livre ___ Lucas.", "à").question;
  assert.deepEqual([r.type, r.choix, r.bonne], ["qcm", ["a", "à"], 1]);
});

test("le mot cité doit être dans la phrase citée", () => {
  assert.ok(vf("Dans la phrase « Mon frère est intelligent », le mot 'son' est un déterminant.").refus);
  assert.equal(vf("Dans la phrase « Il est grand et fort », le mot 'et' lie deux idées.").question.type, "vf");
});

test("le mot à trouver n'est pas sous les yeux : la phrase devient une phrase à trou", () => {
  const r = c({ type: "qcm", question: 'Dans la phrase "Mon papa a un chien", quel mot est le bon entre "a" (sans accent) et "à" (avec accent) ?', choix: ["mes", "et", "à", "a"], bonne: 3 }).question;
  assert.equal(r.question, "Complète la phrase : « Mon papa ___ un chien »");
  assert.deepEqual([r.choix, r.choix[r.bonne]], [["a", "à"], "a"]);
  const s = courte("Dans la phrase « Il va à Paris », quel mot est le bon ?", "à").question;
  assert.equal(s.question, "Complète la phrase : « Il va ___ Paris »");
});

test("une question de grammaire garde sa phrase", () => {
  const q = "Dans la phrase « Le chat dort », quel mot est le verbe ?";
  assert.equal(c({ type: "qcm", question: q, choix: ["chat", "dort"], bonne: 1 }).question.question, q);
});

test("une phrase sans trou ni réponse est refusée", () => {
  assert.ok(c({ type: "qcm", question: "Dans la phrase : « Les dessins sont magnifiques », quel mot faut-il choisir entre « est » (verbe être) et « et » (conjonction) ?", choix: ["est", "et"], bonne: 0 }).refus);
  assert.ok(courte("Dans la phrase « Les dessins sont magnifiques », quel mot faut-il choisir ?", "est").refus);
});

test("en français, une phrase à trou trop courte ne passe qu'au premier niveau", () => {
  const q = (question, difficulte) => c({ type: "qcm", question, choix: ["a", "à"], bonne: 0, difficulte }, { matiere: "francais" });
  assert.ok(q("Complète la phrase : « Le chien ___ faim »", 1).question);
  assert.ok(q("Complète la phrase : « Le chien ___ faim »", 2).refus);
  assert.ok(q("Complète : « Pendant les vacances, ma cousine ___ appris le piano toute seule. »", 2).question);
});

test("la bonne réponse doit être parmi les mots nommés", () => {
  assert.ok(c({ type: "qcm", question: "Quel mot est le bon : « a » ou « à » ?", choix: ["a", "à", "et"], bonne: 2 }).refus);
});

test("le mot à écrire ne doit pas être déjà affiché", () => {
  assert.ok(courte("Quel est le mot exact à écrire pour dire « J'ai faim » ? Écris le verbe conjugué.", "j'ai").refus);
  assert.equal(courte("Dans « Les nouveaux exercices », quel mot est un adjectif ?", "nouveaux").question.type, "courte");
});

test("une réponse courte ne demande qu'une chose", () => {
  assert.ok(courte("Donne-moi trois exemples de choses qui sont de l'eau.", "glace").refus);
  assert.ok(courte("Quels sont les quatre éléments d'une carte ?", "titre").refus);
  assert.equal(courte("Recopie la phrase en corrigeant les deux mots mal écrits : « Au debu, un reve. »", "Au début, un rêve.").question.type, "courte");
  assert.equal(courte("Calcule 12 × 3.", "36").question.type, "courte");
});

test("pas de bavardage ni de piège annoncé", () => {
  assert.ok(courte("Tu t'es trompé sur ce verbe. Conjugue finir avec nous.", "finissons").refus);
  assert.equal(courte("Conjugue finir avec nous. (Attention, il y a un piège.)", "finissons").question.question, "Conjugue finir avec nous.");
});

test("un mot souligné doit vraiment l'être", () => {
  assert.ok(c({ type: "qcm", question: "Remplace le mot souligné.", choix: ["a", "b"], bonne: 0 }).refus);
  assert.ok(c({ type: "qcm", question: "Quel est le mot souligné dans « Il <u>part</u> » ?", choix: ["a", "b"], bonne: 0 }).question);
});

test("les choix en double d'un QCM disparaissent, la bonne réponse reste", () => {
  const r = c({ type: "qcm", question: "Quel mot ?", choix: ["ces", "ses", "ses", "son"], bonne: 2 }).question;
  assert.deepEqual(r.choix, ["ces", "ses", "son"]);
  assert.equal(r.choix[r.bonne], "ses");
  assert.ok(c({ type: "qcm", question: "Quel mot ?", choix: ["ses", "ses"], bonne: 0 }).refus);
});

test("le pronom ne fait pas échouer une réponse", () => {
  assert.ok(memeReponse("tu as", "as"));
  assert.ok(memeReponse("as", "tu as"));
  assert.ok(memeReponse("prends", "je prends"));
  assert.ok(memeReponse("ai", "j ai"));
  assert.ok(!memeReponse("il as", "tu as"));
  assert.ok(!memeReponse("elle", "il"));
  assert.ok(!memeReponse("a", "tu as"));
});

test("une dictée compte l'orthographe, pas la majuscule ni le point", () => {
  assert.ok(memeEcriture("La mère.", "la mère"));
  assert.ok(memeEcriture("ils mangent", "mangent"));
  assert.ok(!memeEcriture("la mere", "la mère"));
  assert.ok(!memeEcriture("ils mange", "ils mangent"));
});

test("la voix lit la phrase complète quand les choix se prononcent pareil", () => {
  const qcm = (question, choix, bonne) => texteAEcouter({ type: "qcm", question, choix, bonne });
  assert.equal(qcm("Complète : « Mon papa ___ un vélo rouge »", ["a", "à"], 0), "Complète : Mon papa a un vélo rouge");
  assert.equal(qcm("Mon ami ___ gentil.", ["et", "est", "à", "a"], 1), "Mon ami est gentil.");
});

test("la voix ne donne pas une réponse qu'on entendrait", () => {
  const qcm = (question, choix, bonne) => texteAEcouter({ type: "qcm", question, choix, bonne });
  assert.equal(qcm("Nous ___ une chanson.", ["chantons", "chantez"], 0), "Nous … une chanson.");
  assert.equal(qcm("Il va ___ Paris.", ["à", "dans", "pour"], 0), "Il va … Paris.");
  assert.equal(texteAEcouter({ type: "courte", question: "Nous ___ une chanson.", reponses: ["chantons"] }), "Nous … une chanson.");
  assert.equal(qcm("Elle ___ partie ___ pied.", ["est / à", "et / a"], 0), "Elle … partie … pied.");
});

test("sans trou, la voix lit la question sans guillemets", () => {
  assert.equal(texteAEcouter({ type: "vf", question: "Le mot « à » est une **préposition**." }), "Le mot à est une préposition.");
});

const SANS_FAUTE = "Dans l'énoncé suivant : « Les personnes qui ont vécu la Révolution française sont des témoins importants de cette période, » quel mot est mal orthographié ?";
const FAUTE = "Quel mot est mal écrit dans : Le chien à faim et il cherche sa gamelle dans le jardin ?";
const FR = { matiere: "francais" };

test("une phrase sans faute ne peut pas demander le mot mal écrit", () => {
  assert.ok(c({ type: "courte", question: SANS_FAUTE, reponses: ["personnes"] }, FR).refus);
  assert.ok(c({ type: "courte", question: SANS_FAUTE, faute: "personnes", reponses: ["personnes"] }, FR).refus);
  assert.ok(c({ type: "courte", question: SANS_FAUTE, faute: "personne", reponses: ["personnes"] }, FR).refus);
  // En qcm, le mot fautif est le bon choix : la relecture vérifie ensuite qu'il est vraiment mal écrit.
  assert.equal(c({ type: "qcm", question: FAUTE, choix: ["chien", "à", "faim"], bonne: 1 }, FR).question.faute, "à");
  assert.ok(c({ type: "courte", question: "Corrige le mot mal écrit dans : « Les personnes sont là. »", reponses: ["personnes"] }, FR).refus);
});

test("une vraie faute à trouver passe : le mot fautif et sa correction sont acceptés", () => {
  const r = c({ type: "courte", question: FAUTE, faute: "à", reponses: ["a"] }, FR).question;
  assert.deepEqual([r.type, r.reponses], ["courte", ["a", "à"]]);
  assert.deepEqual(c({ type: "courte", question: FAUTE, faute: "à", reponses: ["à", "a"] }, FR).question.reponses, ["a", "à"]);
});

test("hors français, on ne cherche pas de mot mal écrit", () => {
  assert.ok(c({ type: "courte", question: FAUTE, faute: "à", reponses: ["a"] }, { matiere: "histoire" }).refus);
});

test("parler d'une erreur sans chercher un mot reste permis", () => {
  assert.equal(courte("Quelle erreur a fait Louis XVI en fuyant à Varennes ?", "la fuite").question.type, "courte");
  assert.equal(c({ type: "vf", question: "Une erreur de calcul change le résultat." }, { matiere: "maths" }).question.type, "vf");
});

const FARINE = { type: "qcm", question: "Pour 2 gâteaux identiques, il faut 4 tasses de farine. Avec 1 gâteau, il te faudra :", choix: ["8 tasses de farine", "2 tasses de farine", "1 tasse de farine", "4 tasses de farine"], bonne: 2 };

test("celui qui résout ne voit jamais la réponse proposée", () => {
  const p = promptResolution(FARINE);
  assert.ok(p.includes("1 tasse de farine") && p.includes("4 tasses de farine"));
  assert.doesNotMatch(p, /bonne réponse|"bonne"/);
  assert.doesNotMatch(promptResolution({ type: "courte", question: "Calcule 6 × 7.", reponses: ["42"] }), /42/);
});

test("un QCM est écarté si la résolution choisit une autre réponse", () => {
  assert.equal(accordResolution(FARINE, { choix: "2 tasses de farine", resultat: "2" }), false);
  assert.equal(accordResolution({ ...FARINE, bonne: 1 }, { choix: "2 tasses de farine", resultat: "2" }), true);
  assert.equal(accordResolution(FARINE, { choix: "aucun", resultat: "2" }), false);
});

test("une réponse courte est comparée par ses nombres", () => {
  const q = { type: "courte", question: "…", reponses: ["12 kg", "12"] };
  assert.equal(accordResolution(q, { resultat: "12" }), true);
  assert.equal(accordResolution(q, { resultat: "13 kg" }), false);
  assert.equal(accordResolution({ ...q, reponses: ["1 234,5"] }, { resultat: "1234.5" }), true);
  assert.equal(accordResolution({ ...q, reponses: ["2 h 30"] }, { resultat: "2 h 15" }), false);
});

test("un vrai/faux se vérifie aussi", () => {
  const q = { type: "vf", question: "La moitié de 8 est 4.", bonne: true };
  assert.equal(accordResolution(q, { choix: "Vrai" }), true);
  assert.equal(accordResolution(q, { choix: "Faux" }), false);
});

test("sans résolution lisible, la question n'est pas jugée", () => {
  assert.equal(accordResolution(FARINE, null), null);
  assert.equal(accordResolution(FARINE, {}), null);
  assert.equal(accordResolution({ type: "courte", question: "…", reponses: ["un triangle"] }, { resultat: "triangle" }), null);
});

test("le badge du quiz dit où en est la préparation", () => {
  const { etatBadgeQuiz: b } = globalThis;
  const q = o => ({ n: 8, i: 0, questions: [], rep: [], attente: true, ...o });
  const qs = k => Array(k).fill({});
  assert.equal(b(null), null);
  assert.equal(b(q({ fini: true })), null);
  assert.equal(b(q({ gen: true })).texte, "Je prépare ton quiz…");
  assert.equal(b(q({ questions: qs(3), gen: true })).texte, "Quiz : 3/8 prêtes");
  assert.deepEqual(b(q({ questions: qs(8) })), { ico: "✅", texte: "Ton quiz est prêt !", ton: "pret" });
});

test("le badge d'un quiz commencé dit si la question suivante est prête", () => {
  const { etatBadgeQuiz: b } = globalThis;
  const q = { n: 8, i: 3, questions: Array(4).fill({}), rep: [{}, {}, {}], attente: false };
  assert.equal(b(q).texte, "Reprendre mon quiz (question 4/8)");
  assert.equal(b({ ...q, i: 4, gen: true }).texte, "Question 5/8 en préparation…");
});

test("le badge signale un échec, sauf si on peut quand même jouer", () => {
  const { etatBadgeQuiz: b } = globalThis;
  const q = { n: 8, i: 0, questions: [], rep: [], attente: true };
  assert.equal(b({ ...q, err: "Oups" }).ton, "souci");
  assert.equal(b({ ...q, i: 2, questions: Array(2).fill({}), attente: false, genErr: "Oups" }).ton, "souci");
  assert.equal(b({ ...q, questions: Array(3).fill({}), genErr: "Oups" }).ton, "pret");
  assert.equal(b({ ...q, i: 2, questions: Array(2).fill({}), attente: false, genErr: "Oups", gen: true }).ton, "attente");
});

const LEGENDE = "Sur une carte, si tu vois une grande rivière bleue, comment la légende t'aide-t-elle à savoir que ce trait représente bien une rivière et non une route ?";
const qcm = (question, choix, bonne = 0, matiere = "geographie") => c({ type: "qcm", question, choix, bonne }, { matiere });

test("la bonne réponse ne se contente pas de répéter la question", () => {
  assert.ok(qcm(LEGENDE, ["En consultant la légende", "En utilisant l'échelle", "En mesurant le trait", "En regardant le titre"]).refus);
  assert.ok(qcm("À quoi sert la légende d'une carte ?", ["À lire la légende", "À mesurer"]).refus);
  assert.ok(c({ type: "courte", question: "Comment la légende t'aide-t-elle à lire une carte ?", reponses: ["avec la légende"] }, { matiere: "geographie" }).refus);
});

test("une réponse citée dans la question reste permise si elle n'est pas seule, ou si elle apporte du neuf", () => {
  assert.ok(qcm("Une carte a une légende et une échelle. Quel outil explique les symboles ?", ["la légende", "l'échelle", "le titre"]).question);
  assert.ok(qcm("À quoi sert la légende d'une carte ?", ["À expliquer les symboles", "À mesurer les distances"]).question);
  assert.ok(qcm("Marie court 3 km puis 200 mètres. Quelle distance en mètres ?", ["3 200 mètres", "500 mètres"], 0, "maths").question);
  assert.ok(qcm("Cette carte a-t-elle une légende ?", ["Oui", "Non"]).question);
});

test("en français et en anglais, retrouver un mot dans la phrase est l'exercice", () => {
  assert.ok(qcm("Dans la phrase Le chat dort, quel mot est le verbe ?", ["dort", "chien", "table"], 0, "francais").question);
  assert.ok(qcm("Which word is a colour in : the red car ?", ["red", "dog"], 0, "anglais").question);
});

test("rien n'est montré à l'écran : pas de paysage, de photo ou de carte à observer", () => {
  const geo = { matiere: "geographie" };
  assert.ok(c({ type: "courte", question: "Dans le paysage que tu observes, tu vois une maison construite près d'un grand champ de blé. Quel mot permet de dire que la maison a été faite par l'homme ?", reponses: ["aménagé"] }, geo).refus);
  assert.ok(c({ type: "qcm", question: "Observe la photo. Quel élément est naturel ?", choix: ["la forêt", "la route"], bonne: 0 }, geo).refus);
  assert.ok(c({ type: "vf", question: "Sur la carte ci-dessous, le fleuve traverse la ville.", bonne: true }, geo).refus);
  assert.ok(c({ type: "qcm", question: "Regarde bien le schéma : quel organe pompe le sang ?", choix: ["le cœur", "le foie"], bonne: 0 }, { matiere: "sciences" }).refus);
});

test("une image décrite avec des mots reste permise", () => {
  const geo = { matiere: "geographie" };
  assert.ok(c({ type: "qcm", question: "Sur une photo de campagne, on voit une forêt, un champ de blé et une route. Quel élément est naturel ?", choix: ["la forêt", "la route", "le champ"], bonne: 0 }, geo).question);
  assert.ok(c({ type: "qcm", question: "Sur une carte, où trouves-tu ce que veut dire un trait bleu ?", choix: ["dans la légende", "dans le titre"], bonne: 0 }, geo).question);
});

const PHOTOS = { matiere: "geographie", photos: ["rural-bocage", "village-gordes"] };
const surPhoto = (question, image, ctx = PHOTOS) => c({ type: "qcm", question, image, choix: ["des vaches", "des moutons"], bonne: 0 }, ctx);

test("une question peut montrer une photo de la liste", () => {
  const r = surPhoto("Sur la photo, quels animaux broutent dans le pré ?", "rural-bocage").question;
  assert.equal(r.image, "rural-bocage");
  assert.ok(surPhoto("Dans le paysage que tu observes, quels animaux vois-tu au second plan ?", "rural-bocage").question);
});

test("une photo qui n'existe pas, ou dans une matière sans photos, est refusée", () => {
  assert.ok(surPhoto("Sur la photo, quels animaux vois-tu ?", "rural-moutons").refus);
  assert.ok(surPhoto("Sur la photo, quels animaux vois-tu ?", "rural-bocage", { matiere: "sciences", photos: [] }).refus);
});

test("sans photo choisie, « sur la photo » ne montre rien", () => {
  assert.ok(surPhoto("Sur la photo, quels animaux broutent dans le pré ?", undefined).refus);
  assert.ok(surPhoto("Dans cette image, quels animaux vois-tu ?", "").refus);
});

test("chaque photo de paysage a son fichier, sa description et son auteur", async () => {
  const fs = await import("node:fs");
  await import("./public/paysages.js");
  const { PAYSAGES, photosPour } = globalThis;
  assert.ok(PAYSAGES.length >= 10);
  assert.equal(new Set(PAYSAGES.map((p) => p.id)).size, PAYSAGES.length);
  for (const p of PAYSAGES) {
    assert.ok(fs.existsSync(new URL(`./public/${p.fichier}`, import.meta.url)), p.fichier);
    assert.ok(p.description.length > 200 && p.auteur && p.licence && p.source.startsWith("https://commons.wikimedia.org/"), p.id);
  }
  assert.equal(photosPour("geographie"), PAYSAGES);
  assert.deepEqual(photosPour("maths"), []);
});

test("un faux choix qui sort des homophones travaillés est retiré : il pourrait être juste", () => {
  const q = "Dans le parc, deux garçons jouent au foot. Complète : Les enfants ___ contents car ___ ballon est tout neuf.";
  const r = c({ type: "qcm", question: q, choix: ["son / sont", "sont / leur", "sont / son", "son / son"], bonne: 2 }).question;
  assert.deepEqual(r.choix, ["son / sont", "sont / son", "son / son"]);
  assert.equal(r.choix[r.bonne], "sont / son");
  const un = c({ type: "qcm", question: "Les deux sœurs rangent ___ chambre avant de partir en vacances chez leur grand-mère.", choix: ["son", "sont", "leur"], bonne: 0 }).question;
  assert.deepEqual(un.choix, ["son", "sont"]);
  assert.ok(c({ type: "qcm", question: "Les enfants ___ contents car ___ ballon est neuf et rouge.", choix: ["sont / son", "sont / leur"], bonne: 0 }).refus);
});

test("en maths, une bonne réponse recopiée telle quelle depuis la question est refusée", () => {
  const q = "Une horloge à aiguilles indique 3 h 25 min 40 s. Quelle est la bonne façon d'écrire cette heure avec les unités ?";
  assert.ok(c({ type: "qcm", question: q, choix: ["3 h 25 min 40 h", "3 min 25 h 40 s", "3 h 25 s 40 min", "3 h 25 min 40 s"], bonne: 3 }, { matiere: "maths" }).refus);
  assert.ok(c({ type: "courte", question: q, reponses: ["3 h 25 min 40 s"] }, { matiere: "maths" }).refus);
  // Les deux durées sont dans la question : il faut les comparer.
  assert.ok(c({ type: "qcm", question: "Qu'est-ce qui dure le plus longtemps : 1 h 10 min ou 75 min ?", choix: ["1 h 10 min", "75 min"], bonne: 1 }, { matiere: "maths" }).question);
  assert.ok(c({ type: "qcm", question: "Il est 3 h 25. Quelle heure sera-t-il dans 10 minutes ?", choix: ["3 h 35", "3 h 15"], bonne: 0 }, { matiere: "maths" }).question);
});

test("une question qui annonce « la phrase suivante » sans l'écrire est refusée", () => {
  const qcm = (question, choix, bonne = 0) => c({ type: "qcm", question, choix, bonne });
  assert.ok(qcm("Dans la phrase suivante, quel verbe est du 2e groupe ?", ["Nous partons en vacances.", "Ils dorment tôt.", "Elle vient demain.", "Tu choisis un dessert."], 3).refus);
  assert.ok(courte("Recopie le verbe de la phrase ci-dessous.", "mange").refus);
  // La phrase est bien écrite : la question passe.
  assert.ok(qcm("Dans la phrase suivante, quel verbe est du 2e groupe : « Tu choisis un dessert » ?", ["choisis", "dessert"]).question);
  assert.ok(courte("Trouve le verbe dans la phrase suivante : Le chat dort sur le canapé.", "dort").question);
  assert.ok(qcm("Dans quelle phrase le verbe est-il du 2e groupe ?", ["Ils dorment tôt.", "Tu choisis un dessert."], 1).question);
});

test("une phrase à deux trous exige un mot par trou dans chaque choix", () => {
  const q = "Dans cette phrase, quel mot complète le mieux la phrase ? Mon frère ___ un vélo rouge ___ bleu.";
  assert.ok(c({ type: "qcm", question: q, choix: ["a", "à", "est", "et"], bonne: 0 }).refus);
  const r = c({ type: "qcm", question: q, choix: ["a / et", "à / est", "et", "a / est"], bonne: 0 }).question;
  assert.deepEqual(r.choix, ["a / et", "à / est", "a / est"]);
  assert.ok(courte(q, "a").refus);
  assert.ok(courte(q, "a / et").question);
});

test("chercher une faute dans une phrase à trous est refusé", () => {
  const q = "Quel mot est mal écrit dans cette phrase ? Pendant les vacances, ma cousine ___ appris ___ nager dans le lac.";
  assert.ok(c({ type: "courte", question: q, reponses: ["a / à"], faute: "___" }, { matiere: "francais" }).refus);
  assert.ok(c({ type: "qcm", question: q, choix: ["a / à", "à / a"], bonne: 0 }, { matiere: "francais" }).refus);
});

test("une faute annoncée n'est gardée que si la relecture trouve la même", () => {
  const { accordFaute, promptFaute } = globalThis;
  const x = { type: "courte", question: "Quel mot est mal écrit dans cette phrase ? Le professeur a donné des exercices à faire.", faute: "a", reponses: ["à", "a"] };
  assert.equal(accordFaute(x, { faute: "" }), false);
  assert.equal(accordFaute(x, { faute: "exercices" }), false);
  assert.equal(accordFaute(x, { faute: "a", correction: "à" }), true);
  assert.equal(accordFaute(x, null), null);
  assert.equal(accordFaute(x, { raisonnement: "…" }), null);
  assert.ok(!promptFaute(x).includes('"a"'));
});

test("un mot déjà bien écrit n'est pas une faute", () => {
  const { accordFaute } = globalThis;
  const q = "Quel mot est mal écrit dans : Pendant les vacances, ma cousine a appris à préparer une potion pour son baptême ?";
  const x = { type: "courte", question: q, faute: "baptême", reponses: ["baptême", "baptême"] };
  assert.equal(accordFaute(x, { faute: "baptême", correction: "baptême" }), false);
  // Même mot écrit avec un accent composé (e + ^) : c'est le même mot, il n'y a pas de faute.
  const decompose = "baptême";
  assert.ok(c({ type: "courte", question: q, faute: decompose, reponses: ["baptême"] }, FR).refus);
  // La relecture désigne la forme juste comme fautive : la question est écartée.
  const y = { type: "courte", question: q.replace("baptême", "batême"), faute: "batême", reponses: ["baptême", "batême"] };
  assert.equal(accordFaute(y, { faute: "baptême" }), false);
  assert.equal(accordFaute(y, { faute: "batême", correction: "baptême" }), true);
});

test("une question qui parle d'un mot en gras doit le montrer en gras", () => {
  assert.ok(c({ type: "qcm", question: "Dans quelle phrase le mot en gras est-il bien écrit ?", choix: ["Les élèves ont rangé leurs affaires.", "Les éléves ont rangé leurs affaires."], bonne: 0 }).refus);
  assert.ok(c({ type: "qcm", question: "Dans « Les **éléves** sont là », le mot en gras est-il bien écrit ?", choix: ["Oui", "Non"], bonne: 1 }).question);
});

test("une phrase à trou n'est gardée que si la relecture trouve le même mot sans voir les choix", () => {
  const { accordTrou, promptTrou, aRelireTrou } = globalThis;
  const x = { type: "qcm", question: "Les élèves ___ leur cartable avant de rentrer à la maison.", choix: ["a", "à"], bonne: 0 };
  assert.ok(aRelireTrou(x));
  assert.ok(!aRelireTrou({ type: "qcm", question: "Quel est le pluriel de cheval ?", choix: ["chevals", "chevaux"], bonne: 1 }));
  assert.equal(accordTrou(x, { mot: "rangent" }), false);
  assert.equal(accordTrou(x, { mot: "" }), false);
  assert.equal(accordTrou(x, { mot: "« a »" }), true);
  assert.equal(accordTrou(x, {}), null);
  assert.ok(!/Choix|« à »/.test(promptTrou(x)));
  const deux = { type: "qcm", question: "Mon frère ___ un vélo rouge ___ bleu.", choix: ["a / et", "à / est"], bonne: 0 };
  assert.ok(promptTrou(deux).includes("2 trous"));
  assert.equal(accordTrou(deux, { mot: "a / et" }), true);
});

test("« dans quelle phrase … bien écrit » : les faux choix n'ont qu'une faute, sur le même mot", () => {
  const q = "Dans quelle phrase le verbe est-il bien écrit ?";
  const r = c({ type: "qcm", question: q, choix: ["Les enfants joue au foot dans le parc.", "Les enfants jouent au foot dans les parc.", "Les enfants jouent au foot dans le parc.", "Les enfants jou à le foot dans le parc."], bonne: 2 }).question;
  assert.deepEqual(r.choix, ["Les enfants joue au foot dans le parc.", "Les enfants jouent au foot dans le parc."]);
  assert.equal(r.bonne, 1);
  assert.ok(c({ type: "qcm", question: q, choix: ["Les enfants jouent au foot dans les parc.", "Les enfants jouent au foot dans le parc."], bonne: 1 }).question);
  assert.ok(c({ type: "qcm", question: q, choix: ["Les enfants jou à le foot dans le parc.", "Les enfants jouent au foot dans le parc."], bonne: 1 }).refus);
});

test("deux trous à compléter dans une seule case deviennent un QCM de combinaisons", () => {
  const q = "Complète avec 'a' ou 'à' : Ce matin, mon frère ___ pris son vélo ___ la maison.";
  const r = courte(q, "a / à").question;
  assert.equal(r.type, "qcm");
  assert.deepEqual([...r.choix].sort(), ["a / a", "a / à", "à / a", "à / à"]);
  assert.equal(r.choix[r.bonne], "a / à");
  assert.ok(courte(q, "a").refus);
  assert.ok(courte(q, "et / à").refus);
});

test("deux trous d'homophones sans mots nommés : QCM de combinaisons, consigne au pluriel", () => {
  const q = "Complète cette phrase avec le mot qui convient : Pendant les vacances, ma cousine ___ appris ___ nager dans le lac.";
  const r = courte(q, "a / à").question;
  assert.equal(r.type, "qcm");
  assert.equal(r.choix[r.bonne], "a / à");
  assert.equal(r.choix.length, 4);
  assert.match(r.question, /^Complète cette phrase avec les mots qui conviennent :/);
  assert.equal(courte(q, "son / son").question.choix.length, 4);
  assert.ok(courte("Écris les verbes : Hier, nous ___ et vous ___ au parc.", "chantions / dansiez").refus);
});

test("le chiffre des centaines n'accepte qu'un chiffre", () => {
  const r = courte("Dans le nombre 3 457, quel est le chiffre des centaines ?", "4", "40", "345").question;
  assert.deepEqual(r.reponses, ["4"]);
  assert.ok(courte("Dans le nombre 3 457, quel est le chiffre des centaines ?", "34").refus);
  assert.deepEqual(courte("Dans le nombre 2 304, quel est le nombre de centaines ?", "23", "vingt-trois").question.reponses, ["23", "vingt-trois"]);
});

test("après la résolution, les réponses acceptées qui donnent un autre nombre sont retirées", () => {
  const { reponsesConfirmees } = globalThis;
  const x = { type: "courte", question: "Combien de centaines dans 8 400 ?", reponses: ["84", "840", "quatre-vingt-quatre", "8 400"] };
  assert.deepEqual(reponsesConfirmees(x, { resultat: "84" }), ["84", "quatre-vingt-quatre"]);
  assert.deepEqual(reponsesConfirmees({ type: "courte", reponses: ["3427", "3 427"] }, { resultat: "3 427" }), ["3427", "3 427"]);
  assert.deepEqual(reponsesConfirmees(x, { resultat: "je ne sais pas" }), x.reponses);
});

test("un siècle en chiffres romains se juge sans le e de l'ordinal", () => {
  assert.ok(memeReponse("v", "ve"));
  assert.ok(memeReponse("ve", "v"));
  assert.ok(memeReponse("v eme siecle", "ve"));
  assert.ok(memeReponse("xiv", "xive siecle"));
  assert.ok(!memeReponse("iv", "ve"));
  assert.ok(!memeReponse("vi", "v"));
  assert.ok(!memeReponse("il", "ile"));
  assert.ok(!memeReponse("c", "ce"));
});

test("« dans quelle phrase » sans choix, et l'orthographe hors du français, sont refusés", () => {
  const q = "Dans quelle phrase le mot de sciences est-il bien écrit ?";
  assert.ok(c({ type: "courte", question: q, reponses: ["expérience"] }, { matiere: "sciences" }).refus);
  assert.ok(c({ type: "qcm", question: q, choix: ["On fait une expérience.", "On fait une expérrience."], bonne: 0 }, { matiere: "sciences" }).refus);
  assert.ok(c({ type: "courte", question: "Dans quelle phrase le verbe est-il au futur ?", reponses: ["La 2"] }, { matiere: "francais" }).refus);
  assert.ok(c({ type: "qcm", question: "Dans quelle phrase le verbe est-il au futur ?", choix: ["Je chanterai.", "Je chantais."], bonne: 0 }, { matiere: "francais" }).question);
  assert.ok(c({ type: "courte", question: "Comment appelle-t-on une démarche pour tester une idée ?", reponses: ["une expérience"] }, { matiere: "sciences" }).question);
});

test("questions générées en masse : les défauts relevés sont refusés", () => {
  const q = (question, choix, bonne, ctx) => c({ type: "qcm", question, choix, bonne }, ctx);
  // Le trou ne remplace rien.
  assert.ok(q("Dans la phrase « Les enfants aiment ___ jouer dans le parc. », quel verbe est à l'infinitif ?", ["aiment", "jouer", "le", "dans"], 1, { matiere: "francais" }).refus);
  // Un homophone peut revenir ailleurs dans la phrase.
  assert.ok(q("Il ___ grand et il est fort comme son père depuis toujours.", ["est", "et"], 0, { matiere: "francais" }).question);
  // Graphique ou photo absents.
  assert.ok(c({ type: "vf", question: "Dans le graphique, la barre la plus haute représente 20 élèves.", bonne: true }, { matiere: "maths" }).refus);
  assert.ok(q("Dans quel paysage trouve-t-on des vignes ?", ["Sur la photo du pont", "Sur la photo de Marseille"], 0, { matiere: "geographie", photos: [] }).refus);
  assert.ok(c({ type: "qcm", question: "Sur cette carte, où se trouve la légende ?", image: "ville", choix: ["En haut", "En bas"], bonne: 0 }, { matiere: "geographie", photos: ["ville"] }).refus);
  // Réponse à taper trop longue.
  assert.ok(c({ type: "courte", question: "Pourquoi les villes construisent-elles des parcs ?", reponses: ["Pour que les habitants puissent se reposer et jouer"] }, { matiere: "geographie" }).refus);
  // « mal conjugué » est une recherche de faute.
  assert.ok(c({ type: "courte", question: "Quel est le verbe mal conjugué dans cette phrase ? « Le chat attrapa une souris et il la mangea. »", reponses: ["mangea"] }, { matiere: "francais" }).refus);
});

test("la relecture critique écarte les erreurs et retire les variantes fausses", () => {
  const { accordJuge, promptJuge } = globalThis;
  const qcm = { type: "qcm", question: "Quel calcul donne le même résultat que 9 × 6 ?", choix: ["9 + 6", "6 × 9", "9 × 7 - 3", "9 × 5 + 9"], bonne: 1 };
  assert.equal(accordJuge(qcm, { exacte: true, autreJuste: "9 × 5 + 9", comprehensible: true }).ok, false);
  assert.equal(accordJuge(qcm, { exacte: true, autreJuste: "", comprehensible: true }).ok, true);
  assert.equal(accordJuge(qcm, { exacte: false, comprehensible: true }).ok, false);
  assert.equal(accordJuge(qcm, { exacte: true, comprehensible: false }).ok, false);
  assert.equal(accordJuge(qcm, null), null);
  const courte = { type: "courte", question: "My mother ___ the dinner every Sunday.", reponses: ["cooks", "cook"] };
  assert.deepEqual(accordJuge(courte, { exacte: true, reponsesFausses: ["cook"], comprehensible: true }).reponses, ["cooks"]);
  assert.equal(accordJuge(courte, { exacte: true, reponsesFausses: ["cooks", "cook"], comprehensible: true }).ok, false);
  assert.match(promptJuge(qcm, "Mathématiques"), /6 × 9   ← prévu comme juste/);
});

test("second lot : phrase absente, nom de photo, unité, sont traités", () => {
  assert.ok(c({ type: "qcm", question: "Dans cette phrase, quel mot est un verbe du 1er groupe ?", choix: ["jardin", "mange"], bonne: 1 }, { matiere: "francais" }).refus);
  assert.ok(c({ type: "qcm", question: "Dans cette phrase, quel verbe est à l'imparfait ? « Quand j'étais petit, je ___ souvent avec mon frère dans le jardin. »", choix: ["jouais", "jouerai"], bonne: 0 }, { matiere: "francais" }).question);
  assert.ok(c({ type: "vf", question: "Le paysage de la photo [littoral-calanque] est un paysage de montagne.", bonne: false }, { matiere: "geographie", photos: ["littoral-calanque"] }).refus);
  assert.ok(c({ type: "qcm", question: "Quel élément naturel est présent dans la photo 'littoral-calanque' ?", image: "littoral-calanque", choix: ["Des falaises", "Un désert"], bonne: 0 }, { matiere: "geographie", photos: ["littoral-calanque"] }).refus);
  assert.ok(memeReponse("400", "400 ans"));
  assert.ok(memeReponse("26", "26 eleves"));
  assert.ok(!memeReponse("40", "400 ans"));
  assert.ok(!memeReponse("ans", "400 ans"));
});

test("la phrase écrite après la question compte comme phrase citée", () => {
  const x = { type: "courte", question: "Quel mot est mal écrit dans cette phrase ? Le loup à peur et il se cache derrière le grand arbre.", faute: "à", reponses: ["a"] };
  assert.ok(!c(x, FR).refus, JSON.stringify(c(x, FR)));
  assert.ok(c({ type: "qcm", question: "Dans cette phrase, quel mot est un verbe ?", choix: ["chat", "mange", "le", "vite"], bonne: 1 }, FR).refus);
});

test("phrase à deux trous : une relecture hors des choix ne tranche pas", () => {
  const { accordTrou } = globalThis;
  const x = { type: "qcm", question: "Pendant les vacances, ma cousine ___ appris ___ nager dans le lac.", choix: ["a / à", "à / a", "a / a", "à / à"], bonne: 0 };
  assert.equal(accordTrou(x, { mot: "a / le" }), null);
  assert.equal(accordTrou(x, { mot: "à / a" }), false);
  assert.equal(accordTrou(x, { mot: "a / à" }), true);
  const y = { type: "qcm", question: "Les élèves ___ leurs affaires dans leur cartable.", choix: ["ses", "ces"], bonne: 0 };
  assert.equal(accordTrou(y, { mot: "rangent" }), false);
});

test("« quel mot est mal écrit ? » en qcm avec les mots de la phrase est accepté", () => {
  const x = { type: "qcm", question: "Dans cette phrase, quel mot est mal écrit ? « Pendant les vacances, mon oncle a appris à nagé dans la mer. »", choix: ["a", "appris", "nagé", "mer"], bonne: 2 };
  const r = c(x, FR);
  assert.ok(r.question, JSON.stringify(r));
  assert.equal(r.question.faute, "nagé");
  assert.ok(c({ ...x, choix: ["a", "appris", "nager", "mer"] }, FR).refus);
});

test("la relecture écarte une phrase à plusieurs fautes", () => {
  const { accordFaute } = globalThis;
  const x = { type: "courte", question: "Quel mot est mal écrit dans : Les enfants comencent à preparé leur sac ?", faute: "comencent", reponses: ["commencent", "comencent"] };
  assert.equal(accordFaute(x, { fautes: ["comencent", "preparé"], faute: "comencent" }), false);
  assert.equal(accordFaute(x, { fautes: ["comencent"], faute: "comencent", correction: "commencent" }), true);
  assert.equal(accordFaute(x, { fautes: [] }), false);
  assert.equal(accordFaute(x, { fautes: ["comencent"] }), true);
});

test("une question trop proche d'une précédente est refusée", () => {
  const { tropProche, serieFautes } = globalThis;
  const avant = [{ type: "courte", question: "Quel mot est mal écrit dans cette phrase ? Les enfants sont allé à la fête de l'école.", faute: "allé" }];
  assert.ok(tropProche({ question: "Quel mot est mal écrit dans cette phrase ? Les filles sont allé au cinéma.", faute: "allé" }, avant));
  assert.ok(tropProche({ question: "Quel mot est mal écrit dans cette phrase ? Les enfants sont allés à la fete de l'école.", faute: "fete" }, avant));
  assert.equal(tropProche({ question: "Quel mot est mal écrit dans cette phrase ? Le dragon cracha du feu sur les chevalier du roi.", faute: "chevalier" }, avant), null);
  assert.equal(tropProche({ type: "qcm", question: "Le chat ___ faim.", choix: ["a", "à"], bonne: 0 }, avant), null);
  assert.equal(serieFautes([{ faute: "a" }, { question: "x" }, { faute: "b" }, { faute: "c" }]), 2);
  assert.equal(serieFautes([]), 0);
});

test("une heure d'horloge à midi ou minuit ne se dit ni du matin ni du soir", () => {
  const m = (question, ...r) => c({ type: "courte", question, reponses: r }, { matiere: "maths" });
  assert.ok(m("Écris l'heure du soir en utilisant les unités correctes. La petite aiguille (celle des heures) est sur le 12, la grande aiguille (celle des minutes) est sur le 6.", "12 h 30 min").refus);
  assert.ok(m("La petite aiguille est sur le 12 et la grande sur le 12. Quelle heure est-il le matin ?", "0 h").refus);
  // Une heure du soir qui tombe l'après-midi, ou une heure du matin écrite après midi : la correction se contredit.
  assert.ok(m("Il est 2 h 30 de l'après-midi. Écris l'heure du soir.", "14 h 30").refus);
  assert.ok(m("Le réveil sonne à 7 h du matin. Écris cette heure.", "19 h").refus);
  // Minuit s'écrit 0 h, jamais 12 h.
  assert.ok(m("Écris minuit et demi avec les heures et les minutes.", "12 h 30").refus);
  assert.ok(m("Écris minuit et demi avec les heures et les minutes.", "0 h 30").question);
  assert.ok(m("La petite aiguille est sur le 7 et la grande sur le 6. Écris cette heure du soir.", "19 h 30").question);
  assert.ok(m("La petite aiguille est sur le 12 et la grande sur le 6. Il est midi passé. Écris l'heure.", "12 h 30").question);
});

test("une réponse jugée « juste sur le fond » n'est pas comptée fausse", () => {
  const { jugementCoherent: j } = globalThis;
  assert.equal(j({ correct: false, commentaire: "Ta réponse '00h30' est juste sur le fond car elle montre l'heure." }).ok, true);
  assert.equal(j({ correct: false, commentaire: "Ta réponse est correcte, mais l'orthographe…" }).ok, true);
  assert.equal(j({ correct: false, commentaire: "Tu as bien pensé aux minutes, mais l'heure n'est pas juste sur le fond." }).ok, false);
  assert.equal(j({ correct: false, commentaire: "Tu as trouvé le bon nombre de minutes, mais pas les heures." }).ok, false);
  assert.equal(j({ correct: "true", commentaire: "" }).ok, true);
  assert.equal(j(null).ok, false);
});

test("deux questions qui n'ont en commun que « verbe » et « bien » ne sont pas trop proches", () => {
  const { tropProche } = globalThis;
  const avant = [{ type: "qcm", question: "Dans quelle phrase le verbe est-il bien écrit ?", choix: ["…", "…"], bonne: 0 }];
  assert.equal(tropProche({ question: "Dans « Les enfants joue au ballon », le verbe est bien écrit." }, avant), null);
});

test("une phrase à trou en réponse courte est relue aussi", () => {
  const { aRelireTrou, accordTrou } = globalThis;
  const x = { type: "courte", question: "Le chien ___ (cacher) sa balle sous le canapé.", reponses: ["cache"] };
  assert.ok(aRelireTrou(x));
  assert.equal(accordTrou(x, { mot: "cache" }), true);
  assert.equal(accordTrou(x, { mot: "pousse" }), false);
});

test("une question qui recopie un exemple de la consigne est trop proche", () => {
  const { tropProche } = globalThis;
  const ex = [{ question: "Le chien à faim et il cherche sa gamelle dans le jardin." }];
  assert.ok(tropProche({ question: "Quel mot est mal écrit dans : Le chat à faim et il cherche sa gamelle sur le tapis ?", faute: "à" }, ex));
  assert.equal(tropProche({ question: "Quel mot est mal écrit dans : Le chevalier à perdu son épée dans la forêt ?", faute: "à" }, ex), null);
});
