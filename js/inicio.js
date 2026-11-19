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

  // Avisa a Juan Pablo por correo (FormSubmit) cuando una persona ya
  // registrada vuelve a entrar. Asunto distinto al del registro, para que
  // el filtro de Gmail lo lleve a la etiqueta «Ingresos». El propietario
  // no se reporta. No bloquea la entrada si falla la red.
  function reportarIngreso(nombre, correo, sitio) {
    try {
      if (localStorage.getItem('orgs_owner_v1') === '1') return;
      fetch('https://formsubmit.co/ajax/juan.bogotag@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: nombre, email: correo, pagina: sitio,
          _subject: 'Ingreso de visitante — ' + sitio,
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
      if (reg && reg.n) { reportarIngreso(reg.n, reg.e, 'Repositorio'); return; }
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

  // ---------- Buscador de categorías (menú principal) ----------
  // Mismo patrón que el buscador de portada de embajadores.html (#hq):
  // mínimo 2 caracteres, sin tildes; cada resultado abre su categoría
  // en repositorio.html con ?cat=<id>.
  (function buscador() {
    const hq = $('#hq'), hsres = $('#hsres');
    if (!hq || !hsres) return;
    const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const CATS = [
      { id: 'ejecutivo', label: 'Poder Ejecutivo', hint: 'Cargos del Gobierno de EE. UU.', kw: 'ejecutivo gobierno ee uu estados unidos dod jcs guerra defensa secretario' },
      { id: 'legislativo', label: 'Poder Legislativo', hint: 'Congreso, comités y staffers', kw: 'legislativo congreso senado camara representantes comites staffers' },
      { id: 'judicial', label: 'Poder Judicial', hint: 'Jueces y tribunales', kw: 'judicial jueces tribunales corte suprema justicia' },
      { id: 'centros', label: 'Centros de pensamiento', hint: 'Think tanks', kw: 'centros pensamiento think tank atlantic council' },
      { id: 'academia', label: 'Academia y universidades', hint: 'Universidades', kw: 'academia universidad universidades profesores' },
      { id: 'embajada', label: 'Embajada de Colombia', hint: 'Agregados de la Embajada en Washington', kw: 'embajada colombia agregados washington defensa militar' },
      { id: 'otros', label: 'Otros', hint: 'Demás perfiles', kw: 'otros demas' }
    ];
    hq.addEventListener('input', () => {
      const t = norm(hq.value.trim());
      if (t.length < 2) { hsres.innerHTML = ''; return; }
      const hits = CATS.filter(c => norm(c.label + ' ' + c.hint + ' ' + c.kw).includes(t));
      hsres.innerHTML = hits.length
        ? hits.map(c => '<button type="button" class="cat" data-cat="' + c.id + '">' +
            '<span class="cl">' + esc(c.label) + '</span>' +
            '<span class="cn">' + esc(c.hint) + ' →</span></button>').join('')
        : '<p class="hslab">Sin resultados para «' + esc(hq.value.trim()) + '».</p>';
      hsres.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => {
        location.href = 'repositorio.html?cat=' + b.dataset.cat;
      }));
    });
  })();
})();
