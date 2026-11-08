/* Pont entre le cartable et le serveur local : remplace window.claude.use('db') et use('sample')
   de claude.ai par des appels au serveur de ce PC (données dans data/cartable.duckdb, IA choisie dans l'espace parents). */
(function () {
  let cache = null, pending = 0, ecritures = 0;
  const subs = {};
  async function lire() {
    const r = await fetch('/api/db', { cache: 'no-store' });
    if (!r.ok) throw new Error('db ' + r.status);
    return r.json();
  }
  const snap = col => ({ docs: Object.entries((cache && cache[col]) || {}).map(([id, d]) => ({ id, data: () => d })) });
  const pareil = (a = {}, b = {}) => {
    const ids = Object.keys(a);
    return ids.length === Object.keys(b).length && ids.every(id => id in b && JSON.stringify(a[id]) === JSON.stringify(b[id]));
  };

  const db = {
    collection(col) {
      return {
        onSnapshot(cb) { (subs[col] = subs[col] || []).push(cb); cb(snap(col)); return () => {}; },
        doc(id) {
          const url = `/api/db/${col}/${encodeURIComponent(id)}`;
          return {
            async set(data) {
              pending++;
              try {
                const r = await fetch(url, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
                if (!r.ok) throw { code: r.status === 413 ? 'quota_exceeded' : 'save_failed' };
                (cache[col] = cache[col] || {})[id] = data;
              } finally { pending--; ecritures++; }
            },
            async delete() {
              pending++;
              try { await fetch(url, { method: 'DELETE' }); if (cache[col]) delete cache[col][id]; }
              finally { pending--; ecritures++; }
            },
          };
        },
      };
    },
  };
  // Si le cartable est ouvert sur deux appareils, on récupère les changements de l'autre.
  // La page n'est redessinée que si une collection a vraiment changé : sinon elle ne bouge pas.
  // Une lecture croisée par un enregistrement est jetée : elle pourrait dater d'avant celui-ci.
  setInterval(async () => {
    if (document.hidden || pending || !cache) return;
    const debut = ecritures;
    try {
      const neuf = await lire();
      if (pending || ecritures !== debut) return;
      const avant = cache;
      cache = neuf;
      Object.entries(subs).forEach(([col, cbs]) => {
        if (!pareil(avant[col], neuf[col])) cbs.forEach(cb => cb(snap(col)));
      });
    } catch (e) {}
  }, 30000);

  let status = null;
  const getStatus = () => status || (status = fetch('/api/status').then(r => r.json()).catch(() => ({ ai: false })));

  const b64 = blob => new Promise((ok, ko) => {
    const fr = new FileReader();
    fr.onload = () => ok({ media_type: blob.type || 'image/jpeg', data: String(fr.result).split(',')[1] });
    fr.onerror = ko; fr.readAsDataURL(blob);
  });

  async function sample(prompt, opts = {}) {
    const images = await Promise.all((opts.images || []).map(b64));
    let r;
    try {
      r = await fetch('/api/sample', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt, images, tier: ['quick', 'light'].includes(opts.modelTier) ? opts.modelTier : 'default' }) });
    } catch (e) { throw { code: 'network' }; }
    if (!r.ok) { let code = r.status === 413 ? 'prompt_too_large' : 'api_error'; try { code = (await r.json()).code || code; } catch (e) {} throw { code }; }
    const reader = r.body.getReader(), dec = new TextDecoder();
    let buf = '', text = '', fin = null;
    for (;;) {
      const { value, done } = await reader.read();
      if (value) buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        if (!line.trim()) continue;
        const ev = JSON.parse(line);
        if (ev.t === 'text') { text += ev.text; if (opts.onText) opts.onText({ text }); }
        else fin = ev;
      }
      if (done) break;
    }
    if (!fin) throw { code: 'network' };
    if (fin.t === 'error') throw { code: fin.code };
    if (!text) throw { code: 'empty_completion' };
    return { text, truncated: !!fin.truncated };
  }

  window.claude = {
    async use(name) {
      if (name === 'db') { try { cache = await lire(); return db; } catch (e) { return null; } }
      if (name === 'sample') {
        const s = await getStatus();
        if (!s.ai) return null;
        sample.limits = async () => ({ images: { maxCount: s.maxImages || 4 } });
        return sample;
      }
      return null;
    },
    status: getStatus,
    rafraichir() { status = null; return getStatus(); },
  };
})();
