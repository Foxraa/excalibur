/* Pont entre le cartable et le serveur local : remplace window.claude.use('db') et use('sample')
   de claude.ai par des appels au serveur de ce PC (données dans data/cartable.duckdb, IA : Ollama sur ce PC). */
(function () {
  let cache = null, pending = 0;
  const subs = {};
  async function charger() {
    const r = await fetch('/api/db', { cache: 'no-store' });
    if (!r.ok) throw new Error('db ' + r.status);
    cache = await r.json();
  }
  const snap = col => ({ docs: Object.entries((cache && cache[col]) || {}).map(([id, d]) => ({ id, data: () => d })) });
  function prevenir() { Object.entries(subs).forEach(([col, cbs]) => cbs.forEach(cb => cb(snap(col)))); }

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
              } finally { pending--; }
            },
            async delete() {
              pending++;
              try { await fetch(url, { method: 'DELETE' }); if (cache[col]) delete cache[col][id]; }
              finally { pending--; }
            },
          };
        },
      };
    },
  };
  // Si le cartable est ouvert sur deux appareils, on récupère les changements de l'autre.
  setInterval(async () => {
    if (document.hidden || pending || !cache) return;
    try { await charger(); prevenir(); } catch (e) {}
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
      r = await fetch('/api/sample', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt, images, tier: opts.modelTier === 'quick' ? 'quick' : 'default' }) });
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
      if (name === 'db') { try { await charger(); return db; } catch (e) { return null; } }
      if (name === 'sample') {
        const s = await getStatus();
        if (!s.ai) return null;
        sample.limits = async () => ({ images: { maxCount: s.maxImages || 4 } });
        return sample;
      }
      return null;
    },
    status: getStatus,
  };
})();
