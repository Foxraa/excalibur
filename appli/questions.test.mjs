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
  assert.ok(c({ type: "qcm", question: FAUTE, choix: ["chien", "à", "faim"], bonne: 1 }, FR).refus);
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
