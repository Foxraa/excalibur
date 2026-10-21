// Schémas des leçons : dans le Markdown de programme_cm1, un bloc
//   ```schema <type>
//   ...
//   ```
// devient un dessin SVG. Les couleurs viennent des classes k-<couleur> définies dans index.html,
// ce qui garde les schémas lisibles en mode clair comme en mode sombre.
// Types : barre, droite, bonds, numeration, operation, horloge, frise, chaine, arbre, phrase, barres, dessin.

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tw = (s, size = 14, bold = false) => [...String(s)].length * size * (bold ? 0.6 : 0.55);
const r1 = n => Math.round(n * 10) / 10;
const PALETTE = ["bleu", "vert", "orange", "violet", "rouge", "jaune", "gris"];
const COULEURS = new Set(PALETTE);
const OPTS = new Set(["legende", "min", "max", "pas", "graduations", "etiquettes", "depart", "total", "nombre", "calcul",
  "debut", "fin", "regulier", "annees", "sens", "boucle", "couleur", "largeur", "taille", "unite", "colle", "minutes"]);

function lire(corps) {
  const opts = {}, items = [];
  for (const brut of corps.split("\n")) {
    const l = brut.replace(/\s+$/, "");
    if (!l.trim()) continue;
    const m = l.match(/^\s*([a-z]+)\s*:\s*(.*)$/i);
    if (m && OPTS.has(m[1].toLowerCase())) (opts[m[1].toLowerCase()] ??= []).push(m[2].trim());
    else items.push(l);
  }
  return { opts, o: k => opts[k]?.[0], items };
}

// « texte | couleur » → { txt, c }
function teinte(l, defaut) {
  const m = l.match(/^(.*?)\s*\|\s*([a-z]+)\s*$/i);
  if (m && COULEURS.has(m[2].toLowerCase())) return { txt: m[1].trim(), c: m[2].toLowerCase() };
  return { txt: l.trim(), c: defaut };
}
// « gauche : droite » → [gauche, droite] (seulement le premier « : » entouré d'espaces ou suivi d'un espace)
function deux(l) {
  const i = l.search(/\s:\s|\s:$|^[^:]*?:\s/);
  if (i < 0) return [l.trim(), ""];
  const j = l.indexOf(":", i);
  return [l.slice(0, j).trim(), l.slice(j + 1).trim()];
}
const num = s => {
  s = String(s).replace(/[\s\u202f\u00a0]/g, "").replace(",", ".");
  const f = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  return f ? Number(f[1]) / Number(f[2]) : Number(s);
};
function fmt(n) {
  const neg = n < 0; n = Math.abs(Math.round(n * 1e6) / 1e6);
  let [e, d] = String(n).split(".");
  e = e.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "−" : "") + e + (d ? "," + d : "");
}
const lignes = (s, max = 0) => {
  const parts = String(s).split(/\s+\/\s+/);
  if (!max) return parts;
  const out = [];
  for (const p of parts) {
    let cur = "";
    for (const w of p.split(" ")) {
      if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    }
    out.push(cur);
  }
  return out;
};
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

function T(x, y, s, { size = 14, anchor = "middle", cls = "", bold = false } = {}) {
  return `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}" text-anchor="${anchor}"${cls ? ` class="${cls}"` : ""}${bold ? ' font-weight="700"' : ""}>${esc(s)}</text>`;
}
// Plusieurs lignes centrées verticalement autour de cy.
function TL(x, cy, ls, o = {}) {
  const size = o.size || 14, lh = size * 1.25, y0 = cy - (ls.length - 1) * lh / 2 + size * 0.35;
  return ls.map((s, i) => T(x, y0 + i * lh, s, o)).join("");
}
function tete(x2, y2, ang, k = 9) {
  const a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return `<polygon class="p" points="${r1(x2)},${r1(y2)} ${r1(x2 + k * Math.cos(a1))},${r1(y2 + k * Math.sin(a1))} ${r1(x2 + k * Math.cos(a2))},${r1(y2 + k * Math.sin(a2))}"/>`;
}
function fleche(x1, y1, x2, y2, w = 2) {
  const a = Math.atan2(y2 - y1, x2 - x1), xe = x2 - 6 * Math.cos(a), ye = y2 - 6 * Math.sin(a);
  return `<line class="l" x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(xe)}" y2="${r1(ye)}" stroke-width="${w}"/>` + tete(x2, y2, a);
}
function courbe(x1, y1, cx, cy, x2, y2, w = 2) {
  const a = Math.atan2(y2 - cy, x2 - cx);
  return `<path class="l" fill="none" d="M${r1(x1)} ${r1(y1)} Q${r1(cx)} ${r1(cy)} ${r1(x2 - 5 * Math.cos(a))} ${r1(y2 - 5 * Math.sin(a))}" stroke-width="${w}"/>` + tete(x2, y2, a);
}
const boite = (x, y, w, h, c, rx = 8) => `<rect class="f${c ? "" : " neutre"}" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}"/>`;
const g = (c, inner) => `<g class="k-${COULEURS.has(c) ? c : "encre"}">${inner}</g>`;
// Point où le segment centre→(dx,dy) sort d'un rectangle w×h.
function bord(cx, cy, w, h, dx, dy) {
  const t = Math.min(Math.abs(dx) > 1e-9 ? (w / 2) / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-9 ? (h / 2) / Math.abs(dy) : Infinity);
  return [cx + dx * t, cy + dy * t];
}

function fig(W, H, inner, legende, x0 = 0, y0 = 0) {
  // Petite marge tout autour : un texte qui dépasse de quelques pixels n'est pas coupé.
  const M = 8; W = Math.ceil(W) + 2 * M; H = Math.ceil(H) + 2 * M; x0 -= M; y0 -= M;
  const cap = legende ? `<figcaption>${inline(legende)}</figcaption>` : "";
  return `<figure class="sch"><div class="sch-scroll"><svg viewBox="${r1(x0)} ${r1(y0)} ${W} ${H}" width="${W}" style="min-width:${Math.round(Math.min(W, Math.max(280, W * 0.55)))}px" role="img" aria-label="${esc((legende || "Schéma").replace(/\*/g, ""))}" xmlns="http://www.w3.org/2000/svg">${inner}</svg></div>${cap}</figure>`;
}

/* ---------- barre : fractions ---------- */
function barre({ o, items }) {
  const rows = items.map(l => {
    const { txt, c } = teinte(l, o("couleur") || "bleu");
    const [f, lab] = deux(txt);
    const m = f.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!m) throw new Error(`fraction illisible : ${f}`);
    return { n: +m[1], d: +m[2], lab, c, units: Math.max(1, Math.ceil(+m[1] / +m[2])) };
  });
  const maxU = Math.max(...rows.map(r => r.units));
  const U = Number(o("largeur")) || (maxU > 2 ? Math.max(120, 480 / maxU) : maxU === 2 ? 180 : 260);
  const x0 = 64, rh = 40, gap = 16, ug = 12;
  const labW = Math.max(0, ...rows.map(r => tw(r.lab, 14)));
  const W = x0 + maxU * (U + ug) + (labW ? labW + 16 : 0) + 10;
  let s = "";
  rows.forEach((r, i) => {
    const y = 10 + i * (rh + gap), cy = y + rh / 2;
    s += T(32, cy - 4, String(r.n), { size: 17, bold: true, cls: "t" }) + `<line class="l" x1="20" x2="44" y1="${cy + 1}" y2="${cy + 1}" stroke-width="2"/>` + T(32, cy + 19, String(r.d), { size: 17, bold: true, cls: "t" });
    let parts = "";
    for (let k = 0; k < r.units * r.d; k++) {
      const u = Math.floor(k / r.d), px = x0 + u * (U + ug) + (k % r.d) * U / r.d;
      parts += `<rect class="${k < r.n ? "plein" : "vide"}" x="${r1(px)}" y="${y}" width="${r1(U / r.d)}" height="${rh}"/>`;
    }
    for (let u = 0; u < r.units; u++) parts += `<rect class="l" fill="none" x="${x0 + u * (U + ug)}" y="${y}" width="${U}" height="${rh}" stroke-width="2.5"/>`;
    s += g(r.c, parts);
    if (r.lab) s += T(x0 + r.units * (U + ug) + 4, cy + 5, r.lab, { anchor: "start" });
  });
  return fig(W, 10 + rows.length * (rh + gap) - gap + 18, s, o("legende"));
}

/* ---------- droite graduée ---------- */
function droite({ o, items }) {
  const min = num(o("min") ?? 0), max = num(o("max") ?? 1);
  const step = o("pas") ? num(o("pas")) : 1 / (Number(o("graduations")) || 1);
  const ticks = Math.round((max - min) / step);
  const sp = Math.max(14, Math.min(64, 580 / ticks));
  const X = v => 34 + (v - min) / step * sp;
  const W = ticks * sp + 68;
  let labStep;
  const e = o("etiquettes");
  if (e === "toutes") labStep = step;
  else if (e) labStep = num(e);
  else if (step < 1) labStep = 1;
  else labStep = step * (ticks <= 12 ? 1 : ticks <= 30 ? 5 : 10);
  const isLab = v => Math.abs(v / labStep - Math.round(v / labStep)) < 1e-6;
  const pts = [], zones = [];
  for (const l of items) {
    const { txt, c } = teinte(l, "rouge");
    const z = txt.match(/^entre\s+(\S+)\s+et\s+(\S+)\s*(?::\s*(.*))?$/i);
    if (z) { zones.push({ a: num(z[1]), b: num(z[2]), lab: z[3] || "", c: c === "rouge" ? "vert" : c }); continue; }
    const [v, lab] = deux(txt);
    pts.push({ v: num(v), lab: lab || v, c });
  }
  // Étiquettes des points au-dessus, sur plusieurs étages si elles se chevauchent.
  const ends = [];
  pts.sort((a, b) => a.v - b.v).forEach(p => {
    const w = tw(p.lab, 14, true) + 8, x = X(p.v);
    let lv = 0; while (ends[lv] !== undefined && ends[lv] > x - w / 2) lv++;
    ends[lv] = x + w / 2; p.lv = lv;
  });
  const top = 18 + (ends.length) * 22 + 12, ay = top + 10;
  let s = "";
  for (const z of zones) s += g(z.c, `<rect class="f" x="${r1(X(z.a))}" y="${ay - 9}" width="${r1(X(z.b) - X(z.a))}" height="18" rx="4" opacity=".8"/>` + (z.lab ? T((X(z.a) + X(z.b)) / 2, ay + 46, z.lab, { size: 13, cls: "t", bold: true }) : ""));
  s += `<line class="axe" x1="20" x2="${W - 14}" y1="${ay}" y2="${ay}" stroke-width="2"/>` + `<polygon class="axe-p" points="${W - 6},${ay} ${W - 16},${ay - 5} ${W - 16},${ay + 5}"/>`;
  for (let i = 0; i <= ticks; i++) {
    const v = min + i * step, x = X(v), big = isLab(v);
    s += `<line class="axe" x1="${r1(x)}" x2="${r1(x)}" y1="${ay - (big ? 9 : 5)}" y2="${ay + (big ? 9 : 5)}" stroke-width="${big ? 2 : 1.3}"/>`;
    if (big) s += T(x, ay + 26, fmt(v), { size: 14, bold: true });
  }
  for (const p of pts) {
    const x = X(p.v), ly = top - 6 - p.lv * 22;
    s += g(p.c, `<line class="l" x1="${r1(x)}" x2="${r1(x)}" y1="${ly + 4}" y2="${ay - 6}" stroke-width="1.5" stroke-dasharray="3 3"/>` + `<circle class="p" cx="${r1(x)}" cy="${ay}" r="5"/>` + T(x, ly, p.lab, { cls: "t", bold: true }));
  }
  return fig(W, ay + 36 + (zones.some(z => z.lab) ? 20 : 0), s, o("legende"));
}

/* ---------- bonds : sauts sur une ligne (durées, calcul mental) ---------- */
function bonds({ o, items }) {
  const c = o("couleur") || "orange";
  const pts = [{ lab: o("depart") || "" }];
  for (const l of items) {
    const m = l.match(/^\s*(.+?)\s*>\s*(.+)$/);
    if (!m) throw new Error(`bond illisible : ${l}`);
    pts.push({ saut: m[1].trim(), lab: m[2].trim() });
  }
  const segs = pts.slice(1).map((p, i) => Math.max(96, tw(p.saut, 14, true) + 24, (tw(p.lab, 14, true) + tw(pts[i].lab, 14, true)) / 2 + 20));
  const xs = [40]; segs.forEach(w => xs.push(xs[xs.length - 1] + w));
  const W = xs[xs.length - 1] + 40, ay = 76;
  let s = `<line class="axe" x1="16" x2="${W - 16}" y1="${ay}" y2="${ay}" stroke-width="2"/>`;
  let arcs = "";
  pts.forEach((p, i) => {
    s += `<line class="axe" x1="${xs[i]}" x2="${xs[i]}" y1="${ay - 7}" y2="${ay + 7}" stroke-width="2"/>` + T(xs[i], ay + 26, p.lab, { bold: true });
    if (i) {
      const a = xs[i - 1], b = xs[i], h = 46;
      arcs += courbe(a + 3, ay - 8, (a + b) / 2, ay - h - 8, b - 3, ay - 8) + T((a + b) / 2, ay - h / 2 - 22, p.saut, { cls: "t", bold: true });
    }
  });
  s += g(c, arcs);
  let H = ay + 40;
  const tot = o("total");
  if (tot) {
    const y = ay + 44;
    s += g("vert", `<path class="l" fill="none" stroke-width="2" d="M${xs[0]} ${y - 6} V${y} H${xs[xs.length - 1]} V${y - 6}"/>` + T((xs[0] + xs[xs.length - 1]) / 2, y + 20, tot, { cls: "t", bold: true }));
    H = y + 30;
  }
  return fig(W, H, s, o("legende"));
}

/* ---------- tableau de numération ---------- */
function numeration({ o, opts }) {
  const nombres = (opts.nombre || []).map(s => {
    const t = s.replace(/[\s\u202f\u00a0]/g, ""), [e, d = ""] = t.split(",");
    if (!/^\d+$/.test(e) || !/^\d*$/.test(d)) throw new Error(`nombre illisible : ${s}`);
    return { e, d, brut: s };
  });
  if (!nombres.length) throw new Error("il faut au moins une ligne « nombre: »");
  const nbCl = Math.max(1, ...nombres.map(n => Math.ceil(n.e.length / 3)));
  const nbDec = Math.max(0, ...nombres.map(n => n.d.length));
  const NOMS = ["unités simples", "milliers", "millions", "milliards"], KC = ["bleu", "vert", "orange", "violet"];
  const DEC = ["dixièmes", "centièmes", "millièmes"];
  const cw = 38, dw = 70, vw = 16, x0 = 10;
  const cols = [];
  for (let k = nbCl - 1; k >= 0; k--) for (const r of ["c", "d", "u"]) cols.push({ cl: k, rang: r, w: cw });
  if (nbDec) { cols.push({ virgule: true, w: vw }); for (let i = 0; i < nbDec; i++) cols.push({ dec: i, w: dw }); }
  let x = x0; cols.forEach(c => { c.x = x; x += c.w; });
  const W = x + x0, h1 = 26, h2 = 24, hr = 38, y1 = 6, y2 = y1 + h1, y3 = y2 + h2;
  let s = "";
  for (let k = nbCl - 1; k >= 0; k--) {
    const cs = cols.filter(c => c.cl === k), xa = cs[0].x, wa = 3 * cw;
    s += g(KC[k], boite(xa, y1, wa, h1, KC[k], 0) + T(xa + wa / 2, y1 + 18, NOMS[k], { size: 12.5, bold: true, cls: "t" }));
    for (const c of cs) s += g(KC[k], `<rect class="f" x="${c.x}" y="${y2}" width="${cw}" height="${h2}" opacity=".7"/>` + T(c.x + cw / 2, y2 + 17, c.rang, { size: 13, bold: true, cls: "t" }));
  }
  if (nbDec) {
    const cs = cols.filter(c => c.dec !== undefined), xa = cs[0].x;
    s += g("rouge", boite(xa, y1, nbDec * dw, h1, "rouge", 0) + T(xa + nbDec * dw / 2, y1 + 18, "partie décimale", { size: 12.5, bold: true, cls: "t" }));
    for (const c of cs) s += g("rouge", `<rect class="f" x="${c.x}" y="${y2}" width="${dw}" height="${h2}" opacity=".7"/>` + T(c.x + dw / 2, y2 + 17, DEC[c.dec], { size: 12, bold: true, cls: "t" }));
  }
  nombres.forEach((n, i) => {
    const y = y3 + i * hr;
    const ent = cols.filter(c => c.cl !== undefined), pad = ent.length - n.e.length;
    ent.forEach((c, j) => {
      const ch = j >= pad ? n.e[j - pad] : "";
      s += `<rect class="cellule" x="${c.x}" y="${y}" width="${c.w}" height="${hr}"/>`;
      if (ch) s += g(KC[c.cl], T(c.x + c.w / 2, y + 26, ch, { size: 21, bold: true, cls: "t" }));
    });
    cols.filter(c => c.virgule).forEach(c => { s += `<rect class="cellule" x="${c.x}" y="${y}" width="${c.w}" height="${hr}"/>` + (n.d ? T(c.x + c.w / 2, y + 28, ",", { size: 24, bold: true }) : ""); });
    cols.filter(c => c.dec !== undefined).forEach(c => {
      const ch = n.d[c.dec] || "";
      s += `<rect class="cellule" x="${c.x}" y="${y}" width="${c.w}" height="${hr}"/>` + (ch ? g("rouge", T(c.x + c.w / 2, y + 26, ch, { size: 21, bold: true, cls: "t" })) : "");
    });
  });
  return fig(W, y3 + nombres.length * hr + 8, s, o("legende"));
}

/* ---------- opérations posées ---------- */
function operation({ o, opts }) {
  return (opts.calcul || []).map((c, i) => poser(c, i === opts.calcul.length - 1 ? o("legende") : "")).join("");
}
function poser(calc, legende) {
  const t = calc.replace(/[\s\u202f\u00a0]/g, "").replace(/×|\*/g, "x").replace(/÷/g, ":").replace(/−/g, "-");
  if (t.includes(":")) return diviser(t, legende);
  const op = t.includes("x") ? "x" : t.includes("-") ? "-" : "+";
  const nums = t.split(op);
  if (nums.some(n => !/^\d+(,\d+)?$/.test(n))) throw new Error(`calcul illisible : ${calc}`);
  if (op === "x") return multiplier(nums, legende);
  const D = Math.max(...nums.map(n => (n.split(",")[1] || "").length));
  const ints = nums.map(n => BigInt(n.replace(",", "") + "0".repeat(D - (n.split(",")[1] || "").length)));
  let res;
  if (op === "+") res = ints.reduce((a, b) => a + b, 0n);
  else { if (nums.length !== 2) throw new Error("soustraction : deux nombres"); res = ints[0] - ints[1]; if (res < 0n) throw new Error("le premier nombre doit être le plus grand"); }
  const digits = v => String(v).padStart(D + 1, "0");
  const strs = [...ints.map(digits), digits(res)];
  const L = Math.max(...strs.map(s => s.length));
  const cols = strs.map(s => s.padStart(L, " "));
  // Zéros de tête et zéros ajoutés après la virgule : en gris.
  const realInt = nums.map(n => n.split(",")[0].length), realDec = nums.map(n => (n.split(",")[1] || "").length);
  const cw = 30, x0 = 44, rh = 38;
  const xCol = j => x0 + j * cw + (D && j >= L - D ? 12 : 0);
  const W = xCol(L - 1) + cw + 20;
  const top = 26;
  let s = "", marks = "";
  const ligne = (row, str, yy, info) => {
    for (let j = 0; j < L; j++) {
      const ch = str[j]; if (ch === " ") continue;
      const fromRight = L - 1 - j, intPos = fromRight - D; // >=0 : partie entière
      let cls = "";
      if (info) {
        if (intPos >= info.int) cls = "absent";
        else if (intPos < 0 && -intPos > info.dec) cls = "mute";
      }
      if (cls === "absent") continue;
      s += T(xCol(j) + cw / 2, yy, ch, { size: 22, bold: row === "res", cls: row === "res" ? "res" : cls });
    }
    if (D) s += T(xCol(L - D) - 6, yy, ",", { size: 22, bold: true });
  };
  let y = top + rh;
  if (op === "+") {
    // retenues
    let r = 0;
    const aligned = ints.map(v => String(v).padStart(L, "0"));
    for (let j = L - 1; j > 0; j--) {
      let sum = r; for (const a of aligned) sum += +a[j];
      r = Math.floor(sum / 10);
      if (r) marks += T(xCol(j - 1) + cw / 2, top + 6, String(r), { size: 13, bold: true, cls: "t" });
    }
    nums.forEach((n, i) => { ligne("op", cols[i], y, { int: realInt[i], dec: realDec[i] }); y += rh; });
    s += T(x0 - 18, y - rh, "+", { size: 22, bold: true });
  } else {
    const a = String(ints[0]).padStart(L, "0"), b = String(ints[1]).padStart(L, "0");
    let r = 0;
    for (let j = L - 1; j >= 0; j--) {
      const bot = +b[j] + r;
      if (+a[j] < bot) {
        marks += T(xCol(j) + 9, y - 7, "1", { size: 13, bold: true, cls: "t", anchor: "end" });
        if (j > 0) marks += T(xCol(j - 1) + 9, y + rh - 3, "+1", { size: 12, bold: true, cls: "t", anchor: "end" });
        r = 1;
      } else r = 0;
    }
    ligne("op", cols[0], y, { int: realInt[0], dec: realDec[0] }); y += rh;
    ligne("op", cols[1], y, { int: realInt[1], dec: realDec[1] }); y += rh;
    s += T(x0 - 18, y - rh, "−", { size: 22, bold: true });
  }
  s += `<line class="axe" x1="${x0 - 30}" x2="${W - 10}" y1="${y - rh + 12}" y2="${y - rh + 12}" stroke-width="2.5"/>`;
  // résultat : sans zéros de tête
  let rs = cols[cols.length - 1];
  const firstSig = rs.search(/[1-9]/), keep = Math.min(firstSig < 0 ? L - 1 : firstSig, L - D - 1);
  rs = " ".repeat(keep) + rs.slice(keep);
  ligne("res", rs, y + 4, null);
  return fig(W, y + 18, s + g("orange", marks), legende);
}
function multiplier(nums, legende) {
  if (nums.length !== 2 || nums.some(n => n.includes(","))) throw new Error("multiplication : deux nombres entiers");
  const [a, b] = nums.map(BigInt), A = String(a), B = String(b), P = String(a * b);
  const parts = [];
  [...B].reverse().forEach((d, k) => { if (d !== "0" || B.length === 1) parts.push({ v: a * BigInt(d), k, d }); });
  const L = Math.max(P.length, A.length, B.length + 1, ...parts.map(p => String(p.v).length + p.k)) ;
  const cw = 26, x0 = 44, rh = 36, top = 26;
  const xr = j => x0 + j * cw + cw / 2; // colonne j, de gauche à droite sur L colonnes
  const rowTxt = (str, y, cls = "", zeros = 0) => {
    let s = ""; const full = str + "0".repeat(zeros), off = L - full.length;
    [...full].forEach((ch, i) => { s += T(xr(off + i), y, ch, { size: 22, cls: i >= str.length ? "zero" : cls, bold: cls === "res" }); });
    return s;
  };
  let s = "", marks = "", y = top + rh;
  if (B.length === 1) {
    let r = 0; const d = +B;
    for (let i = A.length - 1; i > 0; i--) { const p = +A[i] * d + r; r = Math.floor(p / 10); if (r) marks += T(xr(L - A.length + i - 1), top + 6, String(r), { size: 13, bold: true, cls: "t" }); }
  }
  s += rowTxt(A, y); y += rh;
  s += rowTxt(B, y) + T(x0 - 18, y, "×", { size: 22, bold: true }); y += rh;
  const W = x0 + L * cw + (parts.length > 1 ? 150 : 20);
  s += `<line class="axe" x1="${x0 - 30}" x2="${x0 + L * cw + 6}" y1="${y - rh + 12}" y2="${y - rh + 12}" stroke-width="2.5"/>`;
  if (parts.length > 1) {
    parts.forEach((p, i) => {
      s += rowTxt(String(p.v), y, "", p.k);
      s += T(x0 + L * cw + 16, y - 4, `← ${A} × ${p.d}${"0".repeat(p.k)}`, { size: 13, anchor: "start", cls: "mute" });
      if (i === parts.length - 1 && parts.length > 1) s += T(x0 - 18, y, "+", { size: 22, bold: true });
      y += rh;
    });
    s += `<line class="axe" x1="${x0 - 30}" x2="${x0 + L * cw + 6}" y1="${y - rh + 12}" y2="${y - rh + 12}" stroke-width="2.5"/>`;
  }
  s += rowTxt(P, y + 4, "res");
  return fig(W, y + 18, s + g("orange", marks), legende);
}
function diviser(t, legende) {
  const [A, B] = t.split(":");
  if (!/^\d+$/.test(A) || !/^\d+$/.test(B) || +B === 0) throw new Error(`division illisible : ${t}`);
  const b = +B, cw = 26, x0 = 30, rh = 34, top = 34;
  let pos = 0, part = +A[0];
  while (part < b && pos < A.length - 1) { pos++; part = part * 10 + +A[pos]; }
  const rows = [{ txt: A, end: A.length - 1, kind: "div" }], q = [];
  let lowered = [];
  for (;;) {
    const qq = Math.floor(part / b), prod = qq * b, r = part - prod;
    q.push(qq);
    rows.push({ txt: String(prod), end: pos, kind: "moins" });
    if (pos + 1 < A.length) {
      pos++; let txt = String(r) + A[pos]; part = r * 10 + +A[pos];
      lowered.push({ row: rows.length, col: pos });
      while (part < b && pos + 1 < A.length) { q.push(0); pos++; txt += A[pos]; part = part * 10 + +A[pos]; lowered.push({ row: rows.length, col: pos }); }
      if (part < b) { q.push(0); rows.push({ txt, end: pos, kind: "reste" }); break; }
      rows.push({ txt, end: pos, kind: "part" });
    } else { rows.push({ txt: String(r), end: pos, kind: "reste" }); break; }
  }
  const Q = String(Number(q.join("")));
  const xc = j => x0 + 22 + j * cw + cw / 2;
  const xBar = x0 + 22 + A.length * cw + 12;
  let s = "", y = top;
  rows.forEach((r, i) => {
    const start = r.end - r.txt.length + 1;
    [...r.txt].forEach((ch, k) => {
      const col = start + k, low = lowered.some(l => l.row === i && l.col === col);
      s += T(xc(col), y, ch, { size: 22, bold: r.kind === "reste", cls: r.kind === "reste" ? "reste" : low ? "baisse" : "" });
      if (low) s += g("violet", fleche(xc(col), top + 6, xc(col), y - 20, 1.2).replace('class="l"', 'class="l" stroke-dasharray="3 3"'));
    });
    if (r.kind === "moins") {
      s += T(xc(start) - 20, y, "−", { size: 20, bold: true });
      s += `<line class="axe" x1="${xc(start) - 26}" x2="${xc(r.end) + 12}" y1="${y + 10}" y2="${y + 10}" stroke-width="2"/>`;
    }
    if (r.kind === "reste") s += g("rouge", T(xc(r.end) + 20, y, "← reste", { size: 13, anchor: "start", cls: "t", bold: true }));
    y += rh;
  });
  const wq = Math.max(B.length, Q.length) * cw + 24;
  s += `<line class="axe" x1="${xBar}" x2="${xBar}" y1="${top - 24}" y2="${top + rh * 2}" stroke-width="2.5"/><line class="axe" x1="${xBar}" x2="${xBar + wq}" y1="${top + 10}" y2="${top + 10}" stroke-width="2.5"/>`;
  s += T(xBar + 12, top, B, { size: 22, anchor: "start" }) + g("vert", T(xBar + 12, top + rh, Q, { size: 22, anchor: "start", bold: true, cls: "t" }) + T(xBar + 12, top + rh + 22, "quotient", { size: 12, anchor: "start", cls: "t" }));
  s += T(xBar + 12 + tw(B, 22) + 8, top - 2, "← diviseur", { size: 12, anchor: "start", cls: "mute" });
  const W = xBar + wq + 90;
  return fig(W, y - rh + 14, s, legende);
}

/* ---------- horloges ---------- */
function horloge({ o, items }) {
  const R = 74, step = 2 * R + 64, avecMin = o("minutes") !== "non";
  let s = "";
  items.forEach((l, i) => {
    const [hm, lab] = deux(l), m = hm.match(/^(\d{1,2})\s*[:h]\s*(\d{2})$/);
    if (!m) throw new Error(`heure illisible : ${hm}`);
    const H = +m[1], M = +m[2], cx = 32 + R + i * step, cy = 32 + R;
    s += `<circle class="cadran" cx="${cx}" cy="${cy}" r="${R}" stroke-width="3"/>`;
    for (let k = 0; k < 60; k++) {
      const a = k * Math.PI / 30, big = k % 5 === 0, r0 = R - (big ? 9 : 5);
      s += `<line class="axe" x1="${r1(cx + r0 * Math.sin(a))}" y1="${r1(cy - r0 * Math.cos(a))}" x2="${r1(cx + R * Math.sin(a))}" y2="${r1(cy - R * Math.cos(a))}" stroke-width="${big ? 2 : 1}"/>`;
      if (big) {
        const hh = k / 5 || 12, rn = R - 21;
        s += T(cx + rn * Math.sin(a), cy - rn * Math.cos(a) + 5.5, String(hh), { size: 15, bold: true });
        if (avecMin) { const rm = R + 13; s += T(cx + rm * Math.sin(a), cy - rm * Math.cos(a) + 4, String(k).padStart(2, "0"), { size: 10, cls: "mute" }); }
      }
    }
    const ah = ((H % 12) + M / 60) * Math.PI / 6, am = M * Math.PI / 30;
    s += g("bleu", `<line class="l" x1="${cx}" y1="${cy}" x2="${r1(cx + (R - 12) * Math.sin(am))}" y2="${r1(cy - (R - 12) * Math.cos(am))}" stroke-width="4" stroke-linecap="round"/>`);
    s += g("rouge", `<line class="l" x1="${cx}" y1="${cy}" x2="${r1(cx + (R - 34) * Math.sin(ah))}" y2="${r1(cy - (R - 34) * Math.cos(ah))}" stroke-width="7" stroke-linecap="round"/>`);
    s += `<circle class="axe-p" cx="${cx}" cy="${cy}" r="5"/>`;
    s += T(cx, cy + R + 36, `${H} h ${String(M).padStart(2, "0")}`, { size: 17, bold: true });
    if (lab) s += T(cx, cy + R + 56, lab, { size: 13, cls: "mute" });
  });
  const anyLab = items.some(l => deux(l)[1]);
  return fig(items.length * step, 32 + 2 * R + 46 + (anyLab ? 20 : 0), s, o("legende") || "La **petite aiguille** (rouge) montre les heures, la **grande aiguille** (bleue) montre les minutes.");
}

/* ---------- frise chronologique ---------- */
function frise({ o, items }) {
  const evs = [], pers = [];
  let ci = 0;
  for (const l of items) {
    const [a, lab] = deux(l);
    const p = a.match(/^(-?\d+)\s*(?:à|–|-)\s*(-?\d+)$/);
    if (p) { const t = teinte(lab, PALETTE[ci++ % 5]); pers.push({ a: +p[1], b: +p[2], lab: t.txt, c: t.c }); continue; }
    if (!/^-?\d+$/.test(a)) throw new Error(`date illisible : ${a}`);
    const t = teinte(lab, "rouge");
    evs.push({ y: +a, lab: t.txt, c: t.c });
  }
  const W = Number(o("largeur")) || 660, m = 46;
  const regulier = o("regulier") === "oui";
  let X;
  if (regulier) {
    const bs = [...new Set(pers.flatMap(p => [p.a, p.b]))].sort((a, b) => a - b), seg = (W - 2 * m) / (bs.length - 1);
    X = y => { let i = 0; while (i < bs.length - 2 && y > bs[i + 1]) i++; return m + (i + (y - bs[i]) / (bs[i + 1] - bs[i])) * seg; };
    X.bornes = bs;
  } else {
    const all = [...evs.map(e => e.y), ...pers.flatMap(p => [p.a, p.b])];
    const d = num(o("debut") ?? Math.min(...all)), f = num(o("fin") ?? Math.max(...all));
    X = y => m + (y - d) / (f - d) * (W - 2 * m);
    X.d = d; X.f = f;
  }
  const an = y => y < 0 ? `${-y >= 10000 ? fmt(-y) : -y} av. J.-C.` : String(y);
  // Périodes : bandes au-dessus de l'axe.
  const pl = [];
  pers.forEach(p => { let lv = 0; while ((pl[lv] ?? -Infinity) > X(p.a) + 1) lv++; pl[lv] = X(p.b); p.lv = lv; });
  const bh = 30, ay = 12 + Math.max(1, pl.length) * (bh + 6) + 8;
  let s = "";
  pers.forEach(p => {
    const x1 = X(p.a), x2 = X(p.b), y = ay - 8 - (p.lv + 1) * (bh + 6) + 6, ls = lignes(p.lab), w = x2 - x1;
    const un = ls.join(" "), size1 = Math.min(13, (w - 8) / [...un].length / 0.6);
    const [txt, size] = size1 >= 10 ? [[un], size1] : [ls, Math.min(12, Math.max(9, (w - 8) / Math.max(...ls.map(t => [...t].length)) / 0.6))];
    s += g(p.c, `<rect class="f" x="${r1(x1)}" y="${r1(y)}" width="${r1(w)}" height="${bh}" rx="5"/>` + TL((x1 + x2) / 2, y + bh / 2, txt, { size, bold: true, cls: "t" }));
  });
  s += `<line class="axe" x1="14" x2="${W - 12}" y1="${ay}" y2="${ay}" stroke-width="3"/><polygon class="axe-p" points="${W - 4},${ay} ${W - 15},${ay - 6} ${W - 15},${ay + 6}"/>`;
  // Graduations.
  let tickY = [];
  if (regulier) tickY = X.bornes;
  else if (o("pas")) { const p = num(o("pas")); for (let y = Math.ceil(X.d / p) * p; y <= X.f + 1e-9; y += p) tickY.push(y); }
  let finEtiq = -Infinity;
  for (const y of tickY) {
    const x = X(y), w = tw(an(y), 11.5, true) / 2;
    const [tx, anchor] = x - w < 2 ? [2, "start"] : x + w > W - 2 ? [W - 2, "end"] : [x, "middle"];
    const g0 = anchor === "start" ? tx : anchor === "end" ? tx - 2 * w : tx - w;
    s += `<line class="axe" x1="${r1(x)}" x2="${r1(x)}" y1="${ay - 6}" y2="${ay + 6}" stroke-width="2"/>`;
    // Une graduation sur deux reste sans nombre si les nombres se chevauchent.
    if (g0 > finEtiq + 6) { s += T(tx, ay + 20, an(y), { size: 11.5, cls: "mute", bold: true, anchor }); finEtiq = g0 + 2 * w; }
  }
  // Événements : sous l'axe, en escalier si besoin.
  const ends = [], base = ay + (tickY.length ? 34 : 18);
  const lvH = [];
  evs.sort((a, b) => a.y - b.y).forEach(e => {
    e.ls = o("annees") === "non" ? lignes(e.lab, 22) : [an(e.y), ...lignes(e.lab, 22)];
    const w = Math.max(...e.ls.map((t, i) => tw(t, 13, i === 0))) + 12;
    let x = X(e.y); const xc = Math.min(Math.max(x, w / 2 + 2), W - w / 2 - 2);
    let lv = 0; while ((ends[lv] ?? -Infinity) > xc - w / 2) lv++;
    ends[lv] = xc + w / 2; e.lv = lv; e.xc = xc; e.x = x;
    lvH[lv] = Math.max(lvH[lv] || 0, e.ls.length);
  });
  const lvY = []; let acc = base; lvH.forEach((h, i) => { lvY[i] = acc; acc += h * 16 + 14; });
  evs.forEach(e => {
    const y = lvY[e.lv];
    s += g(e.c, `<line class="l" x1="${r1(e.x)}" x2="${r1(e.x)}" y1="${ay}" y2="${y - 2}" stroke-width="1.5" stroke-dasharray="3 3"/><circle class="p" cx="${r1(e.x)}" cy="${ay}" r="6"/>` +
      e.ls.map((t, i) => T(e.xc, y + 12 + i * 16, t, { size: 13, bold: i === 0, cls: i === 0 ? "t" : "" })).join(""));
  });
  return fig(W, Math.max(acc, ay + 30), s, o("legende"));
}

/* ---------- chaîne / cycle de boîtes ---------- */
function noeud(txt, c) {
  const ls = lignes(txt, 18), w = Math.max(84, ...ls.map(t => tw(t, 14, true) + 26)), h = ls.length * 18 + 18;
  return { ls, w, h, c };
}
function chaine({ o, items }) {
  const nodes = [], labs = [];
  for (const l of items) {
    const m = l.match(/^\s*(?:->|→|>)\s*(.*)$/);
    if (m) labs[nodes.length - 1] = m[1].trim();
    else { const t = teinte(l, null); nodes.push(noeud(t.txt, t.c)); }
  }
  const def = o("couleur") || "bleu";
  nodes.forEach((n, i) => { n.c = n.c || (o("couleur") ? def : PALETTE[i % 6]); });
  const boucle = o("boucle") === "oui";
  let s = "", minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const tient = (x, y) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); };
  const dessineNoeud = n => { s += g(n.c, boite(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, n.c, 10) + TL(n.x, n.y, n.ls, { bold: true, cls: "t" })); tient(n.x - n.w / 2, n.y - n.h / 2); tient(n.x + n.w / 2, n.y + n.h / 2); };
  const labTxt = (x, y, t, anchor = "middle") => { if (!t) return; const ls = lignes(t, 20); s += TL(x, y, ls, { size: 12.5, anchor, cls: "mute", bold: true }); const w = Math.max(...ls.map(z => tw(z, 12.5, true))); const x1 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2; tient(x1, y - ls.length * 9); tient(x1 + w, y + ls.length * 9); };
  if (boucle) {
    const n = nodes.length, R = Math.max(100, n * 30), rx = R * 1.45, ry = R;
    nodes.forEach((nd, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; nd.x = rx * Math.cos(a); nd.y = ry * Math.sin(a); });
    nodes.forEach((a, i) => {
      const b = nodes[(i + 1) % n], dx = b.x - a.x, dy = b.y - a.y;
      const [x1, y1] = bord(a.x, a.y, a.w + 8, a.h + 8, dx, dy), [x2, y2] = bord(b.x, b.y, b.w + 8, b.h + 8, -dx, -dy);
      // Courbe bombée vers l'extérieur du cercle (normale à droite du sens de parcours).
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(dx, dy) || 1, nx = dy / L, ny = -dx / L;
      const cx = mx + nx * 30, cy = my + ny * 30;
      s += g("encre", courbe(x1, y1, cx, cy, x2, y2));
      labTxt(cx + nx * 22, cy + ny * 16, labs[i], Math.abs(nx) > 0.7 ? (nx > 0 ? "start" : "end") : "middle");
    });
    nodes.forEach(dessineNoeud);
  } else {
    const gapH = i => Math.max(60, labs[i] ? Math.min(150, Math.max(...lignes(labs[i], 14).map(t => tw(t, 12.5, true))) + 22) : 0);
    let total = nodes.reduce((a, n) => a + n.w, 0) + nodes.slice(0, -1).reduce((a, _, i) => a + gapH(i), 0);
    const sens = o("sens") || (total <= 660 ? "horizontal" : "vertical");
    if (sens === "horizontal") {
      const H = Math.max(...nodes.map(n => n.h));
      let x = 0; nodes.forEach((n, i) => { n.x = x + n.w / 2; n.y = H / 2; x += n.w + gapH(i); });
      nodes.forEach((a, i) => { const b = nodes[i + 1]; if (!b) return; s += g("encre", fleche(a.x + a.w / 2 + 4, a.y, b.x - b.w / 2 - 4, b.y)); if (labs[i]) { const ls = lignes(labs[i], 14); s += TL((a.x + a.w / 2 + b.x - b.w / 2) / 2, a.y - 10 - (ls.length - 1) * 8, ls, { size: 12.5, cls: "mute", bold: true }); tient(a.x, a.y - 20 - ls.length * 16); } });
    } else {
      let y = 0; nodes.forEach(n => { n.x = 0; n.y = y + n.h / 2; y += n.h + 46; });
      nodes.forEach((a, i) => { const b = nodes[i + 1]; if (!b) return; s += g("encre", fleche(0, a.y + a.h / 2 + 3, 0, b.y - b.h / 2 - 3)); labTxt(12, (a.y + a.h / 2 + b.y - b.h / 2) / 2, labs[i], "start"); });
    }
    nodes.forEach(dessineNoeud);
  }
  const p = 12;
  return fig(maxX - minX + 2 * p, maxY - minY + 2 * p, s, o("legende"), minX - p, minY - p);
}

/* ---------- arbre (classement) ---------- */
function arbre({ o, items }) {
  const roots = [], pile = [];
  for (const l of items) {
    const m = l.match(/^(\s*)[-*]\s+(.*)$/);
    if (!m) throw new Error(`ligne d'arbre sans tiret : ${l}`);
    const d = Math.floor(m[1].replace(/\t/g, "  ").length / 2), t = teinte(m[2], null);
    const n = { ...noeud(t.txt, t.c), d, kids: [] };
    n.ls = lignes(t.txt, 22); n.w = Math.max(70, ...n.ls.map(z => tw(z, 13.5, true) + 22)); n.h = n.ls.length * 17 + 14;
    pile.length = d;
    if (d === 0) roots.push(n); else (pile[d - 1] || roots[roots.length - 1]).kids.push(n);
    pile[d] = n;
  }
  const colW = [];
  const walk = (n, f) => { f(n); n.kids.forEach(k => walk(k, f)); };
  roots.forEach(r => walk(r, n => { colW[n.d] = Math.max(colW[n.d] || 0, n.w); }));
  const gapX = 34, colX = [10]; colW.forEach((w, i) => colX.push(colX[i] + w + gapX));
  let y = 8;
  const place = (n, c) => {
    if (!n.c) n.c = c;
    n.x = colX[n.d];
    if (!n.kids.length) { n.y = y + n.h / 2; y += n.h + 10; return; }
    const y0 = y;
    n.kids.forEach((k, i) => place(k, n.d === 0 ? PALETTE[i % 6] : n.c));
    n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2;
    // Un parent plus haut que ses enfants : on descend le sous-arbre pour qu'il ne chevauche pas le voisin du dessus.
    const trop = y0 - (n.y - n.h / 2);
    if (trop > 0) { walk(n, m => { m.y += trop; }); y += trop; }
    y = Math.max(y, n.y + n.h / 2 + 10);
  };
  roots.forEach(r => place(r, "gris"));
  let s = "";
  roots.forEach(r => walk(r, n => {
    n.kids.forEach(k => {
      const x1 = n.x + n.w, xm = colX[k.d] - gapX / 2;
      s += `<path class="lien" fill="none" stroke-width="2" d="M${r1(x1)} ${r1(n.y)} H${r1(xm)} V${r1(k.y)} H${r1(k.x)}"/>`;
    });
  }));
  roots.forEach(r => walk(r, n => { s += g(n.c, boite(n.x, n.y - n.h / 2, n.w, n.h, n.c, 8) + TL(n.x + n.w / 2, n.y, n.ls, { size: 13.5, bold: true, cls: "t" })); }));
  return fig(colX[colW.length] - gapX + 10, y, s, o("legende"));
}

/* ---------- phrase : groupes colorés et étiquetés ---------- */
function role(r) {
  const x = r.toLowerCase();
  if (/attribut/.test(x)) return "violet";
  if (/de phrase|^cc|circonst|^cp/.test(x)) return "orange";
  if (/du verbe|cod|coi|objet|^cv/.test(x)) return "vert";
  if (/verbe|^v$|terminaison|^term/.test(x)) return "rouge";
  if (/sujet|^s$/.test(x)) return "bleu";
  if (/nom|noyau/.test(x)) return "bleu";
  if (/adj/.test(x)) return "vert";
  if (/d[ée]t/.test(x)) return "orange";
  if (/pronom|pr[ée]fixe|n[ée]gation/.test(x)) return "violet";
  if (/suffixe|adverbe/.test(x)) return "jaune";
  return "gris";
}
function phrase({ o, items }) {
  const maxW = Number(o("largeur")) || 640, gap = o("colle") === "oui" ? 3 : 10;
  const phrases = [];
  for (const l of items) {
    const f = l.match(/^\s*\^\s*(\d+)\s*>\s*(\d+)\s*(?::\s*(.*))?$/);
    if (f) { phrases[phrases.length - 1]?.fl.push({ a: +f[1], b: +f[2], lab: f[3] || "" }); continue; }
    const toks = [];
    for (const m of l.matchAll(/\[([^\]]+)\]|([^\[]+)/g)) {
      if (m[1]) { const [txt, r = "", c] = m[1].split("|").map(z => z.trim()); toks.push({ txt, r, c: COULEURS.has(c) ? c : r ? role(r) : "gris", grp: true }); }
      else { const txt = m[2].trim(); if (txt) toks.push({ txt, grp: false }); }
    }
    phrases.push({ toks, fl: [] });
  }
  let s = "", y = 6, W = 0;
  for (const p of phrases) {
    const arcs = p.fl.length ? 40 : 0;
    // mise en ligne
    let x = 8, row = 0; const rows = [[]];
    for (const t of p.toks) {
      const gw = tw(t.txt, 17, true) + (t.grp ? 18 : 4), lw = t.r ? tw(t.r, 12, true) + 4 : 0, w = Math.max(gw, lw);
      if (x + w > maxW && rows[row].length) { row++; rows[row] = []; x = 8; }
      const prev = rows[row][rows[row].length - 1];
      if (!t.grp && /^[.,!?;:…»)]+$/.test(t.txt) && prev) {
        // La ponctuation se colle au mot (ou au groupe) qui la précède.
        const fin = prev.x + prev.w / 2 + prev.gw / 2 + 2;
        Object.assign(t, { x: fin, w: gw, gw, row }); rows[row].push(t); x = Math.max(x, fin + gw + gap); W = Math.max(W, x); continue;
      }
      Object.assign(t, { x, w, gw, row }); rows[row].push(t); x += w + gap; W = Math.max(W, x);
    }
    const rh = 70 + arcs;
    const grps = p.toks.filter(t => t.grp);
    for (const t of p.toks) {
      const yy = y + arcs + t.row * rh, cx = t.x + t.w / 2;
      if (t.grp) s += g(t.c, boite(cx - t.gw / 2, yy, t.gw, 34, t.c, 7) + T(cx, yy + 23, t.txt, { size: 17, bold: true, cls: "t" }) + (t.r ? T(cx, yy + 52, t.r, { size: 12, bold: true, cls: "t" }) : ""));
      else s += T(cx, yy + 23, t.txt, { size: 17, cls: "mute" });
      t.cx = cx; t.yy = yy;
    }
    for (const f of p.fl) {
      const a = grps[f.a - 1], b = grps[f.b - 1]; if (!a || !b) continue;
      const peak = Math.min(a.yy, b.yy) - 30;
      s += g("encre", courbe(a.cx, a.yy - 2, (a.cx + b.cx) / 2, peak, b.cx, b.yy - 2, 1.8) + (f.lab ? T((a.cx + b.cx) / 2, peak + 6, f.lab, { size: 12, bold: true, cls: "mute" }) : ""));
    }
    y += rows.length * rh + 4;
  }
  return fig(Math.min(Math.max(W, 120), maxW + 20), y - 4, s, o("legende"));
}

/* ---------- barres : diagramme en bâtons ---------- */
function barres({ o, items }) {
  const data = items.map((l, i) => { const t = teinte(l, o("couleur") || PALETTE[i % 6]); const [lab, v] = deux(t.txt); return { lab, v: num(v), c: t.c }; });
  const vmax = num(o("max") ?? Math.max(...data.map(d => d.v)));
  let pas = 1;
  for (const m of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000]) { pas = m; if (vmax / m <= 6) break; }
  const top = Math.ceil(vmax / pas) * pas, plotH = 170, bw = 46, gap = 26, x0 = 52, y0 = 30, nl = Math.round(top / pas);
  const W = x0 + data.length * (bw + gap) + 10;
  let s = "";
  for (let k = 0; k <= nl; k++) {
    const v = pas * k, y = y0 + plotH - plotH * k / nl;
    s += `<line class="grille" x1="${x0 - 4}" x2="${W - 6}" y1="${r1(y)}" y2="${r1(y)}"/>` + T(x0 - 8, y + 4, fmt(v), { size: 11.5, anchor: "end", cls: "mute" });
  }
  let maxL = 1;
  data.forEach((d, i) => {
    const h = plotH * d.v / top, x = x0 + gap / 2 + i * (bw + gap), ls = lignes(d.lab, 10); maxL = Math.max(maxL, ls.length);
    s += g(d.c, `<rect class="f" x="${r1(x)}" y="${r1(y0 + plotH - h)}" width="${bw}" height="${r1(h)}" rx="3"/>` + T(x + bw / 2, y0 + plotH - h - 6, fmt(d.v), { size: 13, bold: true, cls: "t" }));
    s += ls.map((t, j) => T(x + bw / 2, y0 + plotH + 18 + j * 15, t, { size: 12.5 })).join("");
  });
  s += `<line class="axe" x1="${x0 - 4}" x2="${W - 6}" y1="${y0 + plotH}" y2="${y0 + plotH}" stroke-width="2"/>`;
  if (o("unite")) s += T(x0 - 8, y0 - 16, o("unite"), { size: 11.5, anchor: "end", cls: "mute", bold: true });
  return fig(W, y0 + plotH + 12 + maxL * 15 + 6, s, o("legende"));
}

/* ---------- dessin : SVG écrit à la main ---------- */
function dessin({ o, items }) {
  const [w, h] = (o("taille") || "400x240").split("x").map(Number);
  return fig(w, h, items.join(""), o("legende"));
}

const TYPES = { barre, droite, bonds, numeration, operation, horloge, frise, chaine, arbre, phrase, barres, dessin };

export function schema(type, corps) {
  const f = TYPES[type];
  try {
    if (!f) throw new Error(`type de schéma inconnu : ${type}`);
    return f(lire(corps));
  } catch (e) {
    return `<pre class="sch-err">Schéma « ${esc(type)} » : ${esc(e.message)}</pre>`;
  }
}

// Remplace les blocs ```schema du Markdown par leur dessin.
export const avecSchemas = md => md.replace(/^```schema[ \t]+(\w+)[^\n]*\n([\s\S]*?)^```[ \t]*$/gm, (m, type, corps) => `\n\n${schema(type, corps)}\n\n`);
