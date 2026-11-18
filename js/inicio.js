// Página madre «Repositorio» — puerta de registro compartida con el
// Repositorio y con Embajadores y Cónsules (misma clave local orgs_visitante:
// quien ya se registró en este dispositivo no vuelve a ser preguntado).
(function () {
  const $ = s => document.querySelector(s);

  // ---------- Membrete ----------
  if (typeof LOGO_EMB !== 'undefined') {
    const f = $('#footlogo');
    if (f) f.src = LOGO_EMB;
  }

  // ---------- Puerta de acceso: registro con nombre y correo ----------
  function leerRegistro() {
    try {
      const v = localStorage.getItem('orgs_visitante') || '';
      if (!v) return null;
      if (v.charAt(0) === '{') { const o = JSON.parse(v); return { n: o.n || '', e: o.e || '' }; }
      return { n: v, e: '' };
    } catch (e) { return null; }
  }
  function reportarRegistro(nombre, correo, sitio) {
    try {
      if (localStorage.getItem('orgs_owner_v1') === '1') return;
      fetch('https://formsubmit.co/ajax/juan.bogotag@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: nombre, email: correo, pagina: sitio,
          _subject: 'Registro de visitante — ' + sitio,
          _template: 'table', _captcha: 'false'
        })
      }).catch(() => {});
    } catch (e) {}
  }
  (function gate() {
    const g = $('#gate'), inp = $('#gname'), eml = $('#gemail'), btn = $('#gbtn');
    if (!g || !inp || !btn) return;
    try {
      let reg = leerRegistro();
      if (!reg) {
        const av = JSON.parse(localStorage.getItem('orgs_visitas_v1') || '[]');
        for (let i = av.length - 1; i >= 0; i--) if (av[i] && av[i].nombre) { reg = { n: av[i].nombre, e: av[i].correo || '' }; break; }
        if (reg) localStorage.setItem('orgs_visitante', JSON.stringify(reg));
      }
      if (reg && reg.n) return;
    } catch (e) {}
    g.hidden = false;
    document.body.style.overflow = 'hidden';
    const correoOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const chk = () => { btn.disabled = !(inp.value.trim().length >= 2 && (!eml || correoOk(eml.value.trim()))); };
    inp.addEventListener('input', chk);
    if (eml) eml.addEventListener('input', chk);
    chk();
    const go = () => {
      const nombre = inp.value.trim();
      const correo = eml ? eml.value.trim() : '';
      if (nombre.length < 2 || (eml && !correoOk(correo))) return;
      try { localStorage.setItem('orgs_visitante', JSON.stringify({ n: nombre, e: correo })); } catch (e) {}
      reportarRegistro(nombre, correo, 'Repositorio');
      g.hidden = true;
      document.body.style.overflow = '';
    };
    btn.addEventListener('click', go);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    if (eml) eml.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => { try { inp.focus(); } catch (e) {} }, 60);
  })();
})();
