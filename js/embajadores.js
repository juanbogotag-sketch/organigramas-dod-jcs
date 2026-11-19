// Embajadores y Cónsules — representación diplomática y consular de Colombia.
// Misma base de diseño y código del Repositorio; contenido: la matriz de
// embajadores y cónsules del gobierno de Abelardo de la Espriella
// (js/datos_embajadores.js).
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // ---------- Membrete ----------
  if (typeof LOGO_EMB !== 'undefined') {
    $('#footlogo').src = LOGO_EMB;
    const wm = $('#wm');
    if (wm) { wm.src = (typeof LOGO_WM !== 'undefined' && LOGO_WM) ? LOGO_WM : LOGO_EMB; }
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
      if (reg && reg.n) { reportarIngreso(reg.n, reg.e, 'Embajadores y Cónsules'); return; }
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
      reportarRegistro(nombre, correo, 'Embajadores y Cónsules');
      g.hidden = true;
      document.body.style.overflow = '';
    };
    btn.addEventListener('click', go);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    if (eml) eml.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => { try { inp.focus(); } catch (e) {} }, 60);
  })();

  // ---------- Preparar los datos ----------
  const MIN = { de: 1, del: 1, la: 1, el: 1, los: 1, las: 1, y: 1, en: 1, e: 1 };
  function titleCase(s) {
    s = String(s || '').trim();
    if (s !== s.toUpperCase()) return s;
    return s.toLowerCase().split(/\s+/).map((w, i) =>
      (i > 0 && MIN[w]) ? w : (w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
  }
  function tipoCorto(t) {
    const x = norm(t);
    if (/encarg/.test(x)) return 'En encargo';
    if (/provisionalidad/.test(x)) return 'Provisionalidad';
    if (/carrera/.test(x)) return 'Carrera Diplomática';
    if (/libre/.test(x)) return 'Libre nombramiento';
    return 'Otro';
  }
  const initials = name => String(name || '').replace(/\(.*?\)/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const PEOPLE = [];
  EMBAJADAS.forEach((r, i) => PEOPLE.push(Object.assign({}, r, {
    key: 'e' + i, cat: 'embajadas',
    lugar: titleCase(r.estado),
    cargoLinea: 'Embajada de Colombia en ' + titleCase(r.estado),
    tipoCorto: tipoCorto(r.nombramiento)
  })));
  CONSULADOS.forEach((r, i) => PEOPLE.push(Object.assign({}, r, {
    key: 'c' + i, cat: 'consulados',
    lugar: titleCase(r.estado),
    cargoLinea: 'Consulado de Colombia en ' + r.ciudad + ', ' + titleCase(r.estado),
    tipoCorto: tipoCorto(r.nombramiento)
  })));
  const byKey = {};
  PEOPLE.forEach(p => { byKey[p.key] = p; });

  function hay(p) {
    return norm([p.nombre, p.estado, p.ciudad || '', p.profesion, p.universidad, p.datos].join(' '));
  }
  function cardHTML(p) {
    const fp = p.datos ? p.datos.slice(0, 190) + (p.datos.length > 190 ? '…' : '') : '';
    return '<div class="row" data-key="' + p.key + '">' +
      '<div class="phx">' + esc(initials(p.nombre)) + '</div>' +
      '<div class="info"><div class="nm">' + esc(p.nombre) + '</div>' +
      '<div class="ti">' + esc(p.cargoLinea) + '</div>' +
      '<div class="og">' + esc(p.profesion || '') + (p.fecha ? ' · Nombramiento: ' + esc(p.fecha) : '') + '</div>' +
      (fp ? '<p class="fp">' + esc(fp) + '</p>' : '') +
      '<button type="button" class="ver" data-key="' + p.key + '">Ver ficha completa</button></div></div>';
  }

  // ---------- Portada ----------
  const CATS = [
    { id: 'embajadas', label: 'Embajadas', col: 'colL' },
    { id: 'consulados', label: 'Consulados', col: 'colR' },
    { id: 'tabulacion', label: 'Tabulación', col: 'colB' }
  ];
  function renderHome() {
    CATS.forEach(c => {
      let n, sub;
      if (c.id === 'tabulacion') { n = TAB_EMB.length + TAB_CON.length; sub = 'Tablas comparativas de la matriz'; }
      else { n = PEOPLE.filter(p => p.cat === c.id).length; sub = n + (c.id === 'embajadas' ? ' embajadas' : ' consulados'); }
      document.getElementById(c.col).innerHTML =
        '<button type="button" class="cat" data-cat="' + c.id + '">' +
        '<span class="cl">' + c.label + '</span>' +
        '<span class="cn">' + esc(sub) + '</span></button>';
    });
    document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.cat === 'tabulacion') openTab();
      else openCat(b.dataset.cat);
    }));
  }

  // Buscador de la portada, sin filtros
  const hq = $('#hq'), hsres = $('#hsres');
  hq.addEventListener('input', () => {
    const t = norm(hq.value.trim());
    if (t.length < 2) { hsres.innerHTML = ''; return; }
    const hits = PEOPLE.filter(p => hay(p).includes(t)).slice(0, 30);
    hsres.innerHTML = hits.length
      ? hits.map(p => cardHTML(p)).join('')
      : '<p class="hslab">Sin resultados para «' + esc(hq.value.trim()) + '».</p>';
    wireCards(hsres);
  });

  function wireCards(root) {
    root.querySelectorAll('.ver').forEach(b => b.addEventListener('click', ev => {
      ev.stopPropagation(); openPerson(b.dataset.key);
    }));
    root.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => openPerson(r.dataset.key)));
  }

  // ---------- Vista de categoría ----------
  let curCat = null;
  function show(view) {
    $('#home').hidden = view !== 'home';
    $('#listview').hidden = view !== 'list';
    $('#tabview').hidden = view !== 'tab';
    window.scrollTo(0, 0);
  }
  function openCat(cat) {
    curCat = cat;
    $('#catTitle').textContent = cat === 'embajadas' ? 'Embajadas de Colombia' : 'Consulados de Colombia';
    const sel = $('#fsub');
    if (cat === 'embajadas') {
      const tipos = [...new Set(PEOPLE.filter(p => p.cat === cat).map(p => p.tipoCorto))].sort();
      sel.innerHTML = '<option value="">Todos los tipos de nombramiento</option>' +
        tipos.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('');
    } else {
      const paises = [...new Set(PEOPLE.filter(p => p.cat === cat).map(p => p.lugar))].sort((a, b) => a.localeCompare(b, 'es'));
      sel.innerHTML = '<option value="">Todos los países</option>' +
        paises.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('');
    }
    $('#q').value = '';
    show('list');
    renderList();
  }
  function renderList() {
    const t = norm($('#q').value.trim());
    const f = $('#fsub').value;
    let folks = PEOPLE.filter(p => p.cat === curCat);
    if (f) folks = folks.filter(p => curCat === 'embajadas' ? p.tipoCorto === f : p.lugar === f);
    if (t) folks = folks.filter(p => hay(p).includes(t));
    let html = '';
    if (curCat === 'embajadas') {
      folks.sort((a, b) => a.lugar.localeCompare(b.lugar, 'es'));
      if (folks.length) html = '<div class="gname"><span>Embajadas (' + folks.length + ')</span></div>' + folks.map(cardHTML).join('');
    } else {
      const groups = {};
      folks.forEach(p => { (groups[p.lugar] = groups[p.lugar] || []).push(p); });
      Object.keys(groups).sort((a, b) => a.localeCompare(b, 'es')).forEach(g => {
        const arr = groups[g].sort((a, b) => String(a.ciudad).localeCompare(String(b.ciudad), 'es'));
        html += '<div class="gname"><span>' + esc(g) + ' (' + arr.length + ')</span></div>' + arr.map(cardHTML).join('');
      });
    }
    $('#groups').innerHTML = html;
    const em = $('#empty');
    em.hidden = folks.length > 0;
    em.textContent = 'Sin resultados con ese criterio.';
    wireCards($('#groups'));
  }
  $('#q').addEventListener('input', renderList);
  $('#fsub').addEventListener('change', renderList);
  $('#back').addEventListener('click', () => show('home'));
  $('#back2').addEventListener('click', () => show('home'));

  // ---------- Tabulación ----------
  function tableHTML(block) {
    if (!block.rows.length) return '';
    let h = '';
    if (block.title) h += '<div class="tabtitle">' + esc(block.title) + '</div>';
    h += '<table class="tab"><thead><tr>' + block.rows[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>';
    block.rows.slice(1).forEach(r => { h += '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>'; });
    return h + '</tbody></table>';
  }
  function openTab() {
    $('#tabs').innerHTML =
      '<div class="tabsec">Embajadas</div>' + TAB_EMB.map(tableHTML).join('') +
      '<div class="tabsec">Consulados</div>' + TAB_CON.map(tableHTML).join('');
    show('tab');
  }

  // ---------- Ficha (modal) ----------
  function linkify(s) {
    return esc(s).replace(/(https?:\/\/[^\s|]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function fld(label, value, links) {
    if (!value || !String(value).trim() || String(value).trim() === '-') return '';
    return '<div class="fld"><b>' + esc(label) + '</b><p>' + (links ? linkify(value) : esc(value)) + '</p></div>';
  }
  function openPerson(key) {
    const p = byKey[key];
    if (!p) return;
    $('#mava').textContent = initials(p.nombre);
    $('#mname').textContent = p.nombre;
    $('#mtitle').textContent = p.cargoLinea;
    $('#morg').textContent = p.tipoCorto + (p.partido && p.partido !== '-' ? ' · ' + p.partido : '');
    let h = '';
    if (p.cat === 'embajadas') {
      h += fld('Concurrencias y otros estados que abarca', p.abarca);
    } else {
      h += fld('Ciudad o circunscripción', p.ciudad);
      h += fld('Otros territorios que abarca', p.abarca);
    }
    h += fld('Profesión', p.profesion);
    h += fld('Procedencia universitaria', p.universidad);
    if (p.cat === 'embajadas') {
      h += fld('Estudios de posgrado y otros cursos', p.posgrados);
      h += fld('Procedencia universitaria (posgrado)', p.univ_posgrado);
    } else {
      h += fld('¿Está en el escalafón de la Carrera Diplomática?', p.escalafon);
    }
    h += fld('Fecha de nombramiento', p.fecha);
    h += fld('Tipo de nombramiento', p.nombramiento);
    h += fld('Partido político', p.partido);
    const rel = (p.relacion_si && p.relacion_si !== '-' ? p.relacion_si : '') +
      (p.relacion && p.relacion !== '-' ? (p.relacion_si && p.relacion_si !== '-' ? ' — ' : '') + p.relacion : '');
    h += fld('Relación con el gobierno actual', rel);
    h += fld('Datos adicionales', p.datos);
    h += fld('Fuentes', p.fuentes, true);
    $('#mfields').innerHTML = h;
    $('#modal').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; }
  $('#mx').addEventListener('click', closeModal);
  $('#mback').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });

  renderHome();
  show('home');
})();
