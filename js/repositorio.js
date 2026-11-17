// Repositorio — base de datos de perfiles (Embajada de Colombia en Estados Unidos).
// Fuentes: Poder Ejecutivo desde js/data.js + js/photos.js (los mismos datos
// del organigrama); centros de pensamiento desde js/datos_ct.js + js/photos_ct.js.
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // ---------- Membrete de la Embajada ----------
  if (typeof LOGO_EMB !== 'undefined') {
    $('#footlogo').src = LOGO_EMB;
    $('#wm').src = (typeof LOGO_WM !== 'undefined' && LOGO_WM) ? LOGO_WM : LOGO_EMB;
  }

  // ---------- Puerta de acceso: registro con nombre y correo ----------
  // ---------- Registro de visitantes (nombre y correo) ----------
  function leerRegistro() {
    try {
      const v = localStorage.getItem('orgs_visitante') || '';
      if (!v) return null;
      if (v.charAt(0) === '{') { const o = JSON.parse(v); return { n: o.n || '', e: o.e || '' }; }
      return { n: v, e: '' };
    } catch (e) { return null; }
  }
  // Avisa a Juan Pablo por correo (FormSubmit) cuando alguien se registra
  // por primera vez en un dispositivo. El propietario no se reporta.
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
    // A quien ya se registró en este navegador no se le vuelve a pedir el
    // registro; en modo incógnito no queda registro y la puerta sí aparece.
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
      try {
        const ua = navigator.userAgent || '';
        const br = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Otro navegador';
        const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Otro sistema';
        const tipo = /iPad|Tablet/.test(ua) ? 'Tableta' : /Mobi|Android|iPhone|iPod/.test(ua) ? 'Celular' : 'Computador';
        let a = [];
        try { a = JSON.parse(localStorage.getItem('orgs_visitas_v1')) || []; } catch (e) { a = []; }
        const now = new Date(), p = n => String(n).padStart(2, '0');
        a.push({
          dia: now.getFullYear() + '-' + p(now.getMonth() + 1) + '-' + p(now.getDate()),
          hora: p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds()),
          dispositivo: tipo + ' · ' + os, navegador: br, nombre: nombre, correo: correo, sitio: 'Torio'
        });
        if (a.length > 500) a = a.slice(-500);
        localStorage.setItem('orgs_visitas_v1', JSON.stringify(a));
      } catch (e) {}
      reportarRegistro(nombre, correo, 'Torio');
      g.hidden = true;
      document.body.style.overflow = '';
    };
    btn.addEventListener('click', go);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    if (eml) eml.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => { try { inp.focus(); } catch (e) {} }, 60);
  })();

  // ---------- Armar la base de personas ----------
  const SD = seed();
  const nodeByKey = {}, nodeById = {}, treeById = {};
  SD.nodes.forEach(n => { nodeByKey[n.t + '|' + n.id] = n; if (!nodeById[n.id]) nodeById[n.id] = n; });
  SD.trees.forEach(t => { treeById[t.id] = t; });
  const treeOrder = {}; SD.trees.forEach((t, i) => { treeOrder[t.id] = i; });

  function parentLabel(n) {
    let p = null;
    if (n.p) p = nodeByKey[n.t + '|' + n.p] || nodeById[n.p];
    if (!p) {
      const lk = (treeById[n.t] || {}).link;
      if (lk) p = nodeById[lk];
    }
    return p ? (p.name + (p.title ? ' — ' + p.title : '')) : '';
  }

  const PEOPLE = [];
  SD.nodes.forEach(n => PEOPLE.push({
    cat: 'ejecutivo', key: 'ej|' + n.t + '|' + n.id, orgId: n.t,
    name: n.name, title: n.title || '', title_en: n.title || '',
    org: (treeById[n.t] || {}).name || n.t, dep: parentLabel(n),
    es: n.es || '', en: n.en || '',
    photo: (typeof PH !== 'undefined' && PH[n.id]) || '', ord: treeOrder[n.t] || 0,
    // Visible si tiene nombre de persona, foto o perfil; los cargos sin titular
    // (nombre vacío, sin foto y sin perfil) no se muestran, pero el dato se conserva.
    visible: !!(n.name || n.es || n.en || (typeof PH !== 'undefined' && PH[n.id]))
  }));
  (typeof PERFILES_CT !== 'undefined' ? PERFILES_CT : []).forEach(p => PEOPLE.push({
    cat: 'centros', key: 'ct|' + p.id, orgId: p.org,
    name: p.name, title: p.cargo_es, title_en: p.cargo_en,
    org: p.org, dep: '',
    es: p.es || '', en: p.en || '',
    photo: (typeof PHCT !== 'undefined' && PHCT[p.id]) || '', ord: 0, visible: true
  }));
  (typeof PERFILES_EX !== 'undefined' ? PERFILES_EX : []).forEach(p => PEOPLE.push({
    cat: p.cat || 'ejecutivo', key: 'ex|' + p.id, orgId: p.orgId,
    name: p.name, title: p.title, title_en: p.title,
    org: p.org, dep: p.dep || '',
    es: p.es || '', en: p.en || '',
    photo: '', ord: treeOrder[p.orgId] || 0, visible: true,
    fn: p.fn || '', ln: p.ln || ''
  }));
  (typeof FICHAS_EX !== 'undefined' ? FICHAS_EX : []).forEach(p => PEOPLE.push({
    cat: p.cat, key: 'ex|' + p.id, orgId: p.orgId,
    name: p.name, title: p.title || '', title_en: p.title_en || p.title || '',
    org: p.org, dep: p.dep || '',
    es: '', en: '', photo: '', ord: treeOrder[p.orgId] || 0, visible: true,
    fn: p.fn || '', ln: p.ln || ''
  }));

  // Subgrupos de segundo nivel: árboles que cuelgan de un nodo de otro árbol
  // (p. ej., Department of Defense/War -> Army, Air Force, Navy, JCS, DIA, Policy)
  const CHILDREN = {};
  SD.trees.forEach(t => {
    if (t.link) {
      const parent = nodeById[t.link];
      if (parent) (CHILDREN[parent.t] = CHILDREN[parent.t] || []).push(t.id);
    }
  });

  const CATS = [
    { id: 'ejecutivo', label: 'Poder Ejecutivo' },
    { id: 'legislativo', label: 'Poder Legislativo' },
    { id: 'judicial', label: 'Poder Judicial' },
    { id: 'centros', label: 'Centros de pensamiento' },
    { id: 'academia', label: 'Academia y universidades' },
    { id: 'embajada', label: 'Embajada de Colombia' },
    { id: 'otros', label: 'Otros' }
  ];
  const inCat = id => PEOPLE.filter(p => p.cat === id && p.visible);
  $('#subtitle').textContent = 'Base de datos de perfiles · ' + PEOPLE.filter(p => p.visible).length + ' personas';

  // ---------- Utilidades de texto ----------
  function firstPara(text) {
    if (!text) return '';
    const blocks = text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    let p = blocks[0] || text.trim();
    const w = p.split(/\s+/);
    if (w.length > 60) p = w.slice(0, 60).join(' ') + '…';
    return p;
  }
  function paras(text, max) {
    max = max || 100;
    if (!text) return [];
    const out = [];
    text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).forEach(block => {
      const sentences = block.match(/[^.!?…]+[.!?…]+["»”']?|\S[^.!?…]*$/g) || [block];
      let cur = '';
      sentences.forEach(s => {
        s = s.trim(); if (!s) return;
        const cand = cur ? cur + ' ' + s : s;
        if (cur && cand.split(/\s+/).length > max) { out.push(cur); cur = s; }
        else cur = cand;
      });
      if (cur) out.push(cur);
    });
    return out;
  }
  const initials = name => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // ---------- Portada: categorías en dos columnas ----------
  function catCard(c) {
    const n = inCat(c.id).length;
    // Poder Legislativo: la tarjeta de la portada lleva directo a la página
    // del Congreso (decisión de Juan Pablo, 17 nov 2026); no abre una lista.
    const sub = c.id === 'legislativo' ? 'Ir a la página del Congreso'
      : (n ? n + (n === 1 ? ' perfil' : ' perfiles') : 'Todavía sin perfiles');
    return '<button type="button" class="cat" data-cat="' + c.id + '">' +
      '<span class="cl">' + esc(c.label) + '</span>' +
      '<span class="cn">' + sub + '</span></button>';
  }
  function renderCats() {
    const left = ['ejecutivo', 'legislativo', 'judicial'];
    const right = ['centros', 'academia', 'embajada'];
    const byId = {}; CATS.forEach(c => { byId[c.id] = c; });
    $('#colL').innerHTML = left.map(id => catCard(byId[id])).join('');
    $('#colR').innerHTML = right.map(id => catCard(byId[id])).join('');
    $('#colB').innerHTML = catCard(byId['otros']);
    document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.cat === 'legislativo') { window.location.href = 'congreso.html'; return; }
      openCat(b.dataset.cat);
    }));
  }

  // ---------- Lista por categoría ----------
  let curCat = null;
  function openCat(id) {
    curCat = id;
    $('#home').hidden = true;
    $('#listview').hidden = false;
    $('#wm').hidden = false;
    $('#catTitle').textContent = (CATS.find(c => c.id === id) || {}).label || id;
    $('#q').value = '';
    const sel = $('#fsub');
    const orgs = [];
    inCat(id).forEach(p => { if (!orgs.includes(p.org)) orgs.push(p.org); });
    // Orden pedido por Juan Pablo: primero los subgrupos que tienen más
    // subgrupos propios; de últimos, los que no tienen ninguno.
    const cntOf = {}, ordOf = {};
    inCat(id).forEach(p => {
      const c = (p.orgId && CHILDREN[p.orgId]) ? CHILDREN[p.orgId].length : 0;
      if (cntOf[p.org] === undefined || c > cntOf[p.org]) cntOf[p.org] = c;
      if (ordOf[p.org] === undefined || p.ord < ordOf[p.org]) ordOf[p.org] = p.ord;
    });
    orgs.sort((a, b) => (cntOf[b] - cntOf[a]) || (ordOf[a] - ordOf[b]));
    sel.innerHTML = '<option value="">Todos los subgrupos</option>' +
      orgs.map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>').join('');
    sel.value = '';
    $('#fsub2').value = '';
    $('#frow2').hidden = true;
    renderList();
    window.scrollTo(0, 0);
  }
  function onSubChange() {
    const orgName = $('#fsub').value;
    const f2 = $('#fsub2'), row2 = $('#frow2');
    let kids = [];
    if (orgName) {
      const person = PEOPLE.find(p => p.cat === curCat && p.org === orgName);
      const oid = person ? person.orgId : null;
      if (oid && CHILDREN[oid]) kids = CHILDREN[oid].slice()
        .sort((a, b) => ((CHILDREN[b] || []).length - (CHILDREN[a] || []).length))
        .map(id => (treeById[id] || {}).name).filter(Boolean);
    }
    if (kids.length) {
      f2.innerHTML = '<option value="">Todos</option>' +
        kids.map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>').join('');
      f2.value = '';
      row2.hidden = false;
    } else {
      f2.value = '';
      row2.hidden = true;
    }
    renderList();
  }
  function renderList() {
    const all = inCat(curCat);
    const nq = norm($('#q').value);
    const sub = $('#fsub').value;
    const sub2 = $('#frow2').hidden ? '' : $('#fsub2').value;
    let list = all;
    if (sub2) list = all.filter(p => p.org === sub2);
    else if (sub) list = all.filter(p => p.org === sub);
    if (nq) list = list.filter(p => norm(p.name + ' ' + p.title + ' ' + p.org + ' ' + p.dep).includes(nq));
    const groups = new Map();
    list.forEach(p => { if (!groups.has(p.org)) groups.set(p.org, []); groups.get(p.org).push(p); });
    let html = '';
    groups.forEach((folks, org) => {
      const tid = (curCat === 'ejecutivo' && folks[0]) ? folks[0].orgId : '';
      html += '<div class="gname"><span>' + esc(org) + ' (' + folks.length + ')</span>' +
        (tid ? '<a class="vorg" href="index.html?tree=' + encodeURIComponent(tid) + '">Ver organigrama</a>' : '') + '</div>';
      folks.forEach(p => {
        html += '<div class="row" data-key="' + esc(p.key) + '">' +
          (p.photo ? '<img class="ph" src="' + p.photo + '" alt="">' : '<div class="phx">' + esc(initials(p.name)) + '</div>') +
          '<div class="info"><div class="nm">' + esc(p.name) + '</div>' +
          (p.title ? '<div class="ti">' + esc(p.title) + '</div>' : '') +
          '<div class="og">' + esc(p.org) + (p.dep ? ' · Depende de: ' + esc(p.dep) : '') + '</div>' +
          (p.es ? '<p class="fp">' + esc(firstPara(p.es)) + '</p>' : '<p class="fp"><em>Sin perfil todavía.</em></p>') +
          '</div>' +
          '<div class="selbar"><button type="button" data-l="es">ES</button><button type="button" data-l="en">EN</button><button type="button" data-l="both">BOTH</button></div>' +
          '<button type="button" class="ver" data-key="' + esc(p.key) + '">Ver o descargar</button></div>';
      });
    });
    $('#groups').innerHTML = html;
    const empty = $('#empty');
    if (!all.length) {
      empty.hidden = false;
      empty.textContent = 'Todavía no hay perfiles en esta categoría. Se irán agregando a medida que se elaboren.';
    } else if (!list.length) {
      empty.hidden = false;
      empty.textContent = 'Ningún perfil coincide con la búsqueda o el filtro.';
    } else empty.hidden = true;
    document.querySelectorAll('.ver').forEach(b => b.addEventListener('click', () => openProfile(b.dataset.key)));
    paintSelRows();
  }
  $('#back').addEventListener('click', () => {
    $('#listview').hidden = true;
    $('#wm').hidden = true;
    $('#home').hidden = false;
    window.scrollTo(0, 0);
  });
  $('#q').addEventListener('input', () => renderList());
  $('#fsub').addEventListener('change', onSubChange);
  $('#fsub2').addEventListener('change', () => renderList());

  // ---------- Sugerencias (el envío llega al Gmail de Juan Pablo vía FormSubmit) ----------
  const sug = $('#sug');
  $('#btnSug').addEventListener('click', () => {
    $('#sugStep1').hidden = false;
    $('#sugForm').hidden = true;
    $('#sugMsg').textContent = '';
    sug.hidden = false;
  });
  $('#sugx').addEventListener('click', () => { sug.hidden = true; });
  sug.addEventListener('click', e => { if (e.target === sug) sug.hidden = true; });
  $('#sugOpt').addEventListener('click', () => {
    $('#sugStep1').hidden = true;
    $('#sugForm').hidden = false;
    $('#sugText').focus();
  });
  $('#sugBack').addEventListener('click', () => {
    $('#sugForm').hidden = true;
    $('#sugStep1').hidden = false;
  });
  $('#sugText').addEventListener('input', e => { $('#sugSend').disabled = !e.target.value.trim(); });
  $('#sugForm').addEventListener('submit', async e => {
    e.preventDefault();
    const txt = $('#sugText').value.trim();
    if (!txt) return;
    const btn = $('#sugSend');
    btn.disabled = true;
    $('#sugMsg').textContent = 'Enviando…';
    try {
      const r = await fetch('https://formsubmit.co/ajax/juan.bogotag@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify((() => {
          const reg = leerRegistro();
          const d = { _subject: 'Sugerencia de perfiles — Torio', sugerencia: txt, name: (reg && reg.n) || 'Sin registro' };
          if (reg && reg.e) d.email = reg.e;
          return d;
        })())
      });
      if (!r.ok) throw new Error('envío rechazado');
      $('#sugMsg').textContent = '¡Gracias! Tu sugerencia fue enviada.';
      $('#sugText').value = '';
    } catch (err) {
      $('#sugMsg').innerHTML = 'No se pudo enviar desde aquí. Puedes escribir directamente a <a href="mailto:juan.bogotag@gmail.com">juan.bogotag@gmail.com</a>.';
      btn.disabled = false;
    }
  });

  // ---------- Vista previa del perfil ----------
  let cur = null, curLang = 'es';
  function openProfile(key) {
    cur = PEOPLE.find(p => p.key === key);
    if (!cur) return;
    curLang = 'es';
    const img = $('#mph');
    if (cur.photo) { img.src = cur.photo; img.style.display = ''; } else img.style.display = 'none';
    $('#mname').textContent = cur.name;
    $('#morg').textContent = cur.org;
    $('#mdep').textContent = cur.dep ? 'Depende de: ' + cur.dep : '';
    $('#mmsg').textContent = '';
    const lk3 = $('#mdl'); if (lk3) lk3.hidden = true;
    const sh3 = $('#mshare'); if (sh3) sh3.hidden = true;
    const ctd = contactOf(cur);
    const cb = $('#mcontact'); if (cb) cb.hidden = !ctd;
    const cp = $('#mcontacto');
    if (cp) { cp.hidden = true; cp.innerHTML = ctd ? ctd.map(contactRow).join('') : ''; }
    paintCartBtn();
    paintProfile();
    $('#modal').hidden = false;
  }
  function paintProfile() {
    document.querySelectorAll('.langrow button').forEach(b => b.classList.toggle('on', b.dataset.l === curLang));
    $('#mtitle').textContent = curLang === 'es' ? cur.title : (cur.title_en || cur.title);
    const text = cur[curLang] || '';
    $('#mtext').innerHTML = text
      ? paras(text).map(t => '<p>' + esc(t) + '</p>').join('')
      : '<p><em>Este perfil aún no tiene texto en este idioma. Está pendiente de elaboración.</em></p>';
    $('#mword').disabled = !text;
    const lk2 = $('#mdl'); if (lk2) lk2.hidden = true;
    const sh2 = $('#mshare'); if (sh2) sh2.hidden = true;
  }
  document.querySelectorAll('.langrow button').forEach(b => b.addEventListener('click', () => { curLang = b.dataset.l; paintProfile(); }));
  const closeModal = () => { $('#modal').hidden = true; };
  $('#mx').addEventListener('click', closeModal);
  $('#mback').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });

  // ---------- Descarga en Word (mismo formato del organigrama) ----------
  // En el celular (Safari) un clic programado tras generar el archivo se ignora:
  // por eso el documento generado queda como un enlace real (#mdl) que el
  // usuario toca para descargarlo. En escritorio/Android se dispara solo.
  let dlURL = null, dlFile = null;
  $('#mword').addEventListener('click', async () => {
    if (!cur) return;
    $('#mmsg').textContent = 'Generando el documento…';
    const lk = $('#mdl'); if (lk) lk.hidden = true;
    const sh0 = $('#mshare'); if (sh0) sh0.hidden = true;
    try {
      const r = await wordProfile(cur, curLang);
      if (dlURL) URL.revokeObjectURL(dlURL);
      dlURL = URL.createObjectURL(r.blob);
      dlFile = new File([r.blob], r.name, { type: r.blob.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const a = $('#mdl');
      a.href = dlURL;
      a.setAttribute('download', r.name);
      a.textContent = '⬇ Descargar: ' + r.name;
      const sh = $('#mshare');
      const canShare = !!(sh && navigator.canShare && navigator.canShare({ files: [dlFile] }));
      // La descarga queda SIEMPRE disponible: en el computador es la vía que
      // funciona. «Compartir / Guardar» se suma cuando el equipo lo permite.
      a.hidden = false;
      if (sh) sh.hidden = !canShare;
      $('#mmsg').textContent = canShare
        ? 'Documento generado. En el celular puedes usar «Compartir / Guardar»; en el computador, «Descargar».'
        : 'Documento generado. Si no se descarga solo, toca el botón azul de descarga.';
      if (!/iPhone|iPad|iPod/.test(navigator.userAgent || '')) a.click();
    } catch (e) {
      $('#mmsg').textContent = 'No se pudo generar el documento.';
    }
  });
  $('#mshare').addEventListener('click', async () => {
    if (!dlFile) return;
    try { await navigator.share({ files: [dlFile] }); } catch (e) {}
  });

  async function wordProfile(p, lang) {
    const {
      Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Header,
      HorizontalPositionRelativeFrom: HR, HorizontalPositionAlign: HA,
      VerticalPositionRelativeFrom: VR, TextWrappingType: TW, TextWrappingSide: TS, LineRuleType
    } = docx;
    const now = new Date(), p2 = n => String(n).padStart(2, '0'), yy = p2(now.getFullYear() % 100);
    const dt = lang === 'es' ? p2(now.getDate()) + '.' + p2(now.getMonth() + 1) + '.' + yy
                             : p2(now.getMonth() + 1) + '.' + p2(now.getDate()) + '.' + yy;
    const run = (t, o) => new TextRun({ text: t, font: 'Arial', size: 24, ...(o || {}) });
    const ch = [];
    let ttl = p.name + (p.title ? ', ' + (lang === 'es' ? p.title : (p.title_en || p.title)) : '');
    if (p.org && ttl.indexOf(p.org) < 0) ttl += ', ' + p.org;
    ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 160 }, children: [run(ttl, { bold: true })] }));
    ch.push(new Paragraph({
      alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 160 },
      children: [new TextRun({ text: 'V.' + dt + ' ' + (now.getHours() < 12 ? 'AM' : 'PM'), font: 'Arial', size: 16 })]
    }));
    let img = null;
    if (p.photo) {
      const im = await new Promise(r => { const x = new Image(); x.onload = () => r(x); x.onerror = () => r(null); x.src = p.photo; });
      if (im) {
        const b = atob(p.photo.split(',')[1]), u = new Uint8Array(b.length);
        for (let j = 0; j < b.length; j++) u[j] = b.charCodeAt(j);
        img = new ImageRun({
          type: p.photo.indexOf('data:image/png') === 0 ? 'png' : 'jpg',
          data: u,
          transformation: { width: 189, height: Math.round(189 * im.height / im.width) },
          floating: {
            horizontalPosition: { relative: HR.MARGIN, align: HA.LEFT },
            verticalPosition: { relative: VR.PARAGRAPH, offset: 13970 },
            allowOverlap: true, behindDocument: false,
            wrap: { type: TW.TIGHT, side: TS.BOTH_SIDES },
            margins: { left: 114300, right: 114300 }
          }
        });
      }
    }
    paras(p[lang] || '').forEach((t, i) => ch.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 160, line: 360, lineRule: LineRuleType.AT_LEAST },
      children: (i === 0 && img ? [img] : []).concat([run(t)])
    })));
    // Encabezado de página: membrete de la Embajada, centrado, 2,91 cm de ancho (110 px)
    const db = s => {
      const b = atob(s.split(',')[1]), u = new Uint8Array(b.length);
      for (let j = 0; j < b.length; j++) u[j] = b.charCodeAt(j);
      return u;
    };
    let hdr = null;
    if (typeof LOGO_EMB !== 'undefined' && LOGO_EMB) {
      hdr = new Header({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new ImageRun({ type: 'png', data: db(LOGO_EMB), transformation: { width: 110, height: 49 } })]
        })]
      });
    }
    const buf = await (await Packer.toBlob(new Document({
      styles: { default: { document: { run: { font: 'Arial', size: 24 } } } },
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1134, right: 1418, bottom: 1134, left: 1418, header: 720 } } },
        ...(hdr ? { headers: { default: hdr } } : {}),
        children: ch
      }]
    }))).arrayBuffer();
    const z = await JSZip.loadAsync(buf);
    let x = await z.file('word/document.xml').async('string');
    const fixR = s => s.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (m, g) => {
      const f = g.match(/<w:rFonts[^>]*\/>/);
      return f ? '<w:rPr>' + f[0] + g.replace(f[0], '') + '</w:rPr>' : m;
    });
    x = x.replace(/<wp:wrapTight\/>/g, '<wp:wrapTight wrapText="bothSides"><wp:wrapPolygon edited="0"><wp:start x="0" y="0"/><wp:lineTo x="0" y="21600"/><wp:lineTo x="21600" y="21600"/><wp:lineTo x="21600" y="0"/><wp:lineTo x="0" y="0"/></wp:wrapPolygon></wp:wrapTight>');
    x = fixR(x);
    z.file('word/document.xml', x);
    for (const nm of Object.keys(z.files)) if (/^word\/(styles|header\d*|footer\d*)\.xml$/.test(nm)) z.file(nm, fixR(await z.file(nm).async('string')));
    const blob = await z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const slug = p.name.replace(/[^\wáéíóúñ]+/gi, '_').replace(/^_+|_+$/g, '');
    return { blob, name: (lang === 'es' ? 'Perfil_' : 'Profile_') + slug + '_V_' + dt + '_JPGB' + (lang === 'es' ? '' : '_EN') + '.docx' };
  }

  // ---------- Contactos verificados ----------
  // Correo oficial de Boone (consta en la base del evento de la Embajada) y
  // contactos de oficina verificados de PM, CT, P y DDTC. Clave: id del nodo.
  const PM_OF = [
    { k: 'Correo de oficina (PM-CPA)', v: 'PM-CPA@state.gov' },
    { k: 'Correo de oficina (Outreach PM)', v: 'T_Outreach_PM@State.gov' },
    { k: 'Teléfono del front office (PM)', v: '(202) 647-9022' }
  ];
  const CT_OF = [{ k: 'Teléfono de la oficina del Coordinador (CT)', v: '(202) 647-9892' }];
  const CONTACTOS = {
    d20: [{ k: 'Correo oficial', v: 'chase.l.boone.civ@mail.mil' }],
    po20: [{ k: 'Correo oficial', v: 'chase.l.boone.civ@mail.mil' }],
    s3: [{ k: 'Teléfono de su oficina (P)', v: '(202) 647-2471' }],
    s4: [{ k: 'Correo oficial', v: 'DiNannoT@state.gov' }],
    c1: CT_OF, c2: CT_OF, c3: CT_OF, c4: CT_OF,
    m1: PM_OF, m3: PM_OF, m5: PM_OF,
    m4: PM_OF.concat([
      { k: 'Correo de su dirección (DDTC)', v: 'DDTCResponseTeam@state.gov' },
      { k: 'Teléfono DDTC', v: '(202) 663-1282' }
    ])
  };
  // Correos de la base del evento de la Embajada (V17.11.26): personas del
  // foro que viven en Torio sin ser nodos del organigrama (clave «ex|<id>»).
  const CONTACTOS_EX = {
    beasley: [{ k: 'Correo oficial', v: 'John.A.Beasley@usdoj.gov' }],
    barbulescu: [{ k: 'Correo oficial', v: 'Ruxandra.Barbulescu@usdoj.gov' }],
    kocheulov: [{ k: 'Correo oficial', v: 'Vladimir.Kocheulov@usdoj.gov' }],
    lee: [{ k: 'Correo oficial', v: 'Courtney.Lee2@usdoj.gov' }],
    ormsby: [{ k: 'Correo oficial', v: 'Jesse.Ormsby@usdoj.gov' }],
    york: [{ k: 'Correo oficial', v: 'Aaron.E.York@usdoj.gov' }],
    fishman: [{ k: 'Correo oficial', v: 'FishmanKA@state.gov' }],
    "algarra": [{"k": "Correo oficial", "v": "defenseattache@colombiaemb.org"}],
    "vargas-cano": [{"k": "Correo oficial", "v": "militaryattache@colombiaemb.org"}],
    "villa": [{"k": "Correo oficial", "v": "oattache@colombiaemb.org"}],
    "diaz-irreno": [{"k": "Correo oficial", "v": "adjuntomil1@colombiaemb.org"}],
    "cabrera": [{"k": "Correo oficial", "v": "navalattache@colombiaemb.org"}],
    "arias": [{"k": "Correo oficial", "v": "navofsec@colombiaemb.org"}],
    "lopez-duque": [{"k": "Correo oficial", "v": "airattache@colombiaemb.org"}],
    "urrea": [{"k": "Correo oficial", "v": "john.urrea@correo.policia.gov.co"}, {"k": "Correo alterno", "v": "policeattache@colombiaemb.org"}],
    "martinez-ossa": [{"k": "Correo oficial", "v": "misionmilitaroea@cgfm.mil.co"}, {"k": "Correo alterno", "v": "juan.martinez@fac.mil.co"}],
    "velasco": [{"k": "Correo oficial", "v": "misionmilitaroea@cgfm.mil.co"}],
    "parra": [{"k": "Correo oficial", "v": "Agrepol.eeuu@policia.gov.co"}],
    "peterson": [{"k": "Correo oficial", "v": "JULIA.PETERSON@cbp.dhs.gov"}],
    "madigan": [{"k": "Correo oficial", "v": "keith.madigan@cbp.dhs.gov"}],
    "hui": [{"k": "Correo oficial", "v": "Dennis.Hui2@usdoj.gov"}],
    "bodner": [{"k": "Correo oficial", "v": "Amy.Bodner@usdoj.gov"}],
    "fuse": [{"k": "Correo oficial", "v": "Marisa.Fuse@usdoj.gov"}],
    "thomas": [{"k": "Correo oficial", "v": "Clotilde.Alexandra-Estelle.Thomas@usdoj.gov"}],
    "zegar": [{"k": "Correo oficial", "v": "Allison.Zegar@usdoj.gov"}],
    "burgos": [{"k": "Correo oficial", "v": "Isabella.Burgos@usdoj.gov"}],
    "stackhouse": [{"k": "Correo oficial", "v": "StackhouseT@state.gov"}],
    "kitt": [{"k": "Correo oficial", "v": "ellen.e.kitt.civ@mail.mil"}],
    "besosa": [{"k": "Correo oficial", "v": "miguel.a.besosa.ctr@mail.mil"}],
    "bello": [{"k": "Correo oficial", "v": "mauricio.bello@dodiis.mil"}],
    "wilson": [{"k": "Correo oficial", "v": "joshua.b.wilson.mil@us.navy.mil"}],
    "spalding": [{"k": "Correo oficial", "v": "luc.p.spalding.mil@us.navy.mil"}],
    "norkiewicz": [{"k": "Correo oficial", "v": "Collin.norkiewicz@us.af.mil"}],
    "jacquez": [{"k": "Correo oficial", "v": "Alissa.m.jacquez.civ@army.mil"}],
    "ortiz": [{"k": "Correo oficial", "v": "michael.c.ortiz@dea.gov"}],
    "cannavo": [{"k": "Correo oficial", "v": "nmcannavo@fbi.gov"}],
    "kroger": [{"k": "Correo oficial", "v": "KrogerKB@state.gov"}],
    "blasini": [{"k": "Correo oficial", "v": "DeJesusP@state.gov"}],
    "carrera": [{"k": "Correo oficial", "v": "CarreraM2@state.gov"}],
    "auger": [{"k": "Correo oficial", "v": "AugerVE@state.gov"}],
    "polga-hecimovich": [{"k": "Correo oficial", "v": "polgahec@usna.edu"}],
    "arnold": [{"k": "Correo oficial", "v": "ArnoldJM@state.gov"}],
    "meade": [{"k": "Correo oficial", "v": "klmeade@fbi.gov"}],
    "underwood": [{"k": "Correo oficial", "v": "jtunderwood@fbi.gov"}],
    "velasco": [{"k": "Correo oficial", "v": "simon.velasco@hq.dhs.gov"}],
    "liang": [{"k": "Correo oficial", "v": "Jingqi.Liang.Civ@mail.smil.mil"}],
    "brantley": [{"k": "Correo oficial", "v": "courtney.brantley@hq.dhs.gov"}],
    "liberatori": [{"k": "Correo", "v": "argattache@amilusa.com"}, {"k": "Correo alterno", "v": "ararmy.assistante@gmail.com"}],
    "gorigoitia": [{"k": "Correo", "v": "agremil@mmchusa.org"}, {"k": "Correo alterno", "v": "paula@mmchusa.org"}],
    "santamaria": [{"k": "Correo oficial", "v": "defenseattache@colombiaemb.org"}, {"k": "Correo", "v": "oattache@colombiaemb.org"}, {"k": "Correo alterno", "v": "luicard@gmail.com"}],
    "correa": [{"k": "Correo", "v": "agremilusa@yahoo.com"}, {"k": "Correo alterno", "v": "epcastilloc@ejercito.mil.ec"}],
    "skeete": [{"k": "Correo", "v": "jskeete@minfor.gov.gy"}],
    "diaz": [{"k": "Correo", "v": "misionmilitaruy@gmail.com"}],
    "chini": [{"k": "Correo", "v": "osva_chini@hotmail.com"}],
    "barros": [{"k": "Correo", "v": "adneuc@gmail.com"}],
    "acevedo": [{"k": "Correo", "v": "jefe@chilenavy.us"}],
    "duarte": [{"k": "Correo", "v": "friasduartefranklinodalis@gmail.com"}],
    "rueda": [{"k": "Correo", "v": "fabriciorueda@armada.mil.ec"}],
    "gavarrete": [{"k": "Correo", "v": "agredef.esa025@gmail.com"}],
    "archila": [{"k": "Correo", "v": "agremil.gt@gmail.com"}],
    "mejia": [{"k": "Correo", "v": "def.honduras.dc@ffaa.mil.hn"}],
    "espinoza": [{"k": "Correo", "v": "defensausa@mre.gov.py"}],
    "angulo": [{"k": "Correo", "v": "oscar.oliva@marina.pe"}],
    "jessen": [{"k": "Correo", "v": "jessenbak@foreign.gov.tt"}],
    "tocci": [{"k": "Correo", "v": "ruizvictor1974@gmail.com"}],
    "looman": [{"k": "Correo", "v": "erikjan.looman@minbuza.nl"}],
    "woolrich": [{"k": "Correo", "v": "agrenavusa@semar.gob.mx"}],
    "charpentier": [{"k": "Correo", "v": "christophe.charpentier@diplomatie.gouv.fr"}],
    "gore": [{"k": "Correo", "v": "NavalAttacheUSA@nzdf.mil.nz"}],
    "tremblay": [{"k": "Correo", "v": "luc.Tremblay6@forces.gc.ca"}],
    "mugica": [{"k": "Correo", "v": "cmugicaruiz@fn.mde.es"}],
    "ledridge": [{"k": "Correo", "v": "matthew.j.ledridge.mil@us.navy.mil"}],
    "griffin": [{"k": "Correo", "v": "lydia.a.griffin.mil@us.navy.mil"}],
    "gilbert": [{"k": "Correo", "v": "FLO_HQMC@usmc.mil"}],
    "croker": [{"k": "Correo", "v": "brian.croker.civ@usmc.mil"}],
    "chapman": [{"k": "Correo", "v": "brian.m.chapman@uscg.mil"}],
    "cbodner": [{"k": "Correo", "v": "christopher.p.bodner@uscg.mil"}],
    "varona": [{"k": "Correo", "v": "david.c.varona.mil@us.navy.mil"}],
    "frost": [{"k": "Correo", "v": "david.frost3@defence.gov.au"}],
    "ambrogi": [{"k": "Correo", "v": "airattacheassistant.ar@gmail.com"}],
    "santana": [{"k": "Correo", "v": "jsantanasom@gmail.com"}],
    "lopez": [{"k": "Correo", "v": "agrefap.usa@outlook.com"}],
    "camara": [{"k": "Correo", "v": "attache.adeua@fab.mil.br"}, {"k": "Correo alterno", "v": "secretaria.adeua@fab.mil.br"}],
    "vaca": [{"k": "Correo", "v": "eafattache@yahoo.com"}],
    "grady": [{"k": "Correo oficial", "v": "Dana.W.Grady@uscg.mil"}],
    "roncone": [{"k": "Correo oficial", "v": "Nita_V_Lalla@ondcp.eop.gov"}]
  };
  // Correos de la misma base para centros de pensamiento (clave «ct|<id>»).
  // OJO: el correo que la base trae para Marczak es el de Isabella Palacios;
  // no se usa para no publicar un dato errado.
  const CONTACTOS_CT = {
    'ford-maldonado': [{ k: 'Correo oficial', v: 'mford@americafirstpolicy.com' }],
    'sinfoto-rafael-de-osma': [{ k: 'Correo oficial', v: 'rdeosma@as-coa.org' }],
    'hernandez-roy': [{ k: 'Correo oficial', v: 'ChernandezRoy@csis.org' }],
    'martinez-fernandez': [{ k: 'Correo oficial', v: 'andres.martinezfernandez@heritage.org' }],
    'scharifker': [{ k: 'Correo oficial', v: 'DScharifker@meridian.org' }],
    'dippell': [{ k: 'Correo oficial', v: 'mdippell@ndi.org' }],
    'garrastazu': [{ k: 'Correo de la oficina (IRI)', v: 'info@iri.org' }]
  };
  function contactOf(p) {
    if (!p) return null;
    if (p.key.indexOf('ex|') === 0) return CONTACTOS_EX[p.key.split('|')[1]] || null;
    if (p.cat === 'ejecutivo') return CONTACTOS[p.key.split('|')[2]] || null;
    if (p.cat === 'centros') return CONTACTOS_CT[p.key.split('|')[1]] || null;
    return null;
  }
  function contactRow(r) {
    const v = esc(r.v);
    const link = /@/.test(r.v)
      ? '<a href="mailto:' + v + '">' + v + '</a>'
      : (/^[\d(]/.test(r.v) ? '<a href="tel:' + r.v.replace(/[^+\d]/g, '') + '">' + v + '</a>' : v);
    return '<div class="crow"><span class="ck">' + esc(r.k) + ': </span>' + link + '</div>';
  }
  $('#mcontact').addEventListener('click', () => {
    const cp = $('#mcontacto');
    if (cp) cp.hidden = !cp.hidden;
  });

  // ---------- Foto ampliable ----------
  $('#mph').addEventListener('click', () => {
    if (!cur || !cur.photo) return;
    $('#zoomImg').src = cur.photo;
    $('#zoom').hidden = false;
  });
  $('#zoom').addEventListener('click', () => { $('#zoom').hidden = true; });

  // ---------- Carpeta de perfiles (como un carrito) ----------
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('torio_carpeta_v1') || '[]'); } catch (e) { cart = []; }
  cart = cart.filter(x => x && PEOPLE.some(p => p.key === x.key));
  const saveCart = () => { try { localStorage.setItem('torio_carpeta_v1', JSON.stringify(cart)); } catch (e) {} };
  const inCart = key => cart.some(x => x.key === key);
  function paintCartBtn() {
    const b = $('#madd');
    if (!b || !cur) return;
    b.textContent = inCart(cur.key) ? '📁 Quitar de la carpeta' : '📁 Agregar a la carpeta';
  }
  function renderCart() {
    const badge = $('#cartN');
    badge.hidden = !cart.length;
    badge.textContent = cart.length;
    const list = $('#cartList');
    if (!cart.length) {
      list.innerHTML = '<p class="cempty">La carpeta está vacía. Abre un perfil y toca «Agregar a la carpeta».</p>';
    } else {
      list.innerHTML = cart.map((x, i) => {
        const p = PEOPLE.find(q => q.key === x.key);
        if (!p) return '';
        return '<div class="citem">' +
          (p.photo ? '<img src="' + p.photo + '" alt="">' : '<div class="cphx">' + esc(initials(p.name)) + '</div>') +
          '<div class="cinfo"><b>' + esc(p.name) + '</b><small>' + (x.lang === 'en' ? 'Perfil en inglés' : 'Perfil en español') + '</small></div>' +
          '<button type="button" class="crm" data-i="' + i + '" aria-label="Quitar de la carpeta">✕</button></div>';
      }).join('');
      list.querySelectorAll('.crm').forEach(b => b.addEventListener('click', () => {
        cart.splice(+b.dataset.i, 1);
        saveCart(); renderCart(); paintCartBtn();
      }));
    }
    $('#cartGen').disabled = !cart.length;
    $('#cartZip').disabled = cart.length < 2;
    if (!cart.length) $('#cartOpts').hidden = true;
    const dl = $('#cartDl'); if (dl) dl.hidden = true;
    const cs = $('#cartShare'); if (cs) cs.hidden = true;
  }
  $('#madd').addEventListener('click', () => {
    if (!cur) return;
    if (inCart(cur.key)) cart = cart.filter(x => x.key !== cur.key);
    else cart.push({ key: cur.key, lang: curLang });
    saveCart(); renderCart(); paintCartBtn();
  });
  $('#cartFab').addEventListener('click', () => {
    const p = $('#cartPanel');
    p.hidden = !p.hidden;
    if (!p.hidden) renderCart();
  });
  $('#cartX').addEventListener('click', () => { $('#cartPanel').hidden = true; });
  $('#cartClear').addEventListener('click', () => {
    cart = []; saveCart(); renderCart(); paintCartBtn();
    $('#cartMsg').textContent = '';
  });
  let genURL = null, genFile = null;
  function offerFile(blob, name) {
    if (genURL) URL.revokeObjectURL(genURL);
    genURL = URL.createObjectURL(blob);
    genFile = new File([blob], name, { type: blob.type || 'application/octet-stream' });
    const a = $('#cartDl');
    a.href = genURL;
    a.setAttribute('download', name);
    a.textContent = '⬇ Descargar: ' + name;
    a.hidden = false;
    const cs = $('#cartShare');
    if (cs && navigator.canShare && navigator.canShare({ files: [genFile] })) cs.hidden = false;
    if (!/iPhone|iPad|iPod/.test(navigator.userAgent || '')) a.click();
  }
  $('#cartZip').addEventListener('click', async () => {
    const items = cart.map(x => ({ p: PEOPLE.find(q => q.key === x.key), lang: x.lang })).filter(x => x.p);
    if (items.length < 2) return;
    $('#cartMsg').textContent = 'Generando ' + items.length + ' documentos…';
    try {
      const z = new JSZip();
      const used = {};
      for (const it of items) {
        const r = await wordProfile(it.p, it.lang);
        let nm = r.name;
        if (used[nm]) nm = nm.replace(/\.docx$/, '_' + (used[nm] + 1) + '.docx');
        used[r.name] = (used[r.name] || 0) + 1;
        z.file(nm, r.blob);
      }
      const blob = await z.generateAsync({ type: 'blob' });
      const now = new Date(), p2 = n => String(n).padStart(2, '0');
      const zn = 'Carpeta_Torio_' + now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + '.zip';
      offerFile(blob, zn);
      $('#cartMsg').textContent = 'Carpeta lista: ' + items.length + ' perfiles en un solo ZIP.';
    } catch (e) {
      $('#cartMsg').textContent = 'No se pudo generar la carpeta.';
    }
  });
  $('#cartShare').addEventListener('click', async () => {
    if (!genFile) return;
    try { await navigator.share({ files: [genFile] }); } catch (e) {}
  });
  // Selección rápida: con el modo activo, tocar una tarjeta la agrega o la
  // quita de la carpeta sin abrir la ficha.
  let selMode = false;
  function inCartLang(key, lang) { return cart.some(x => x.key === key && x.lang === lang); }
  function paintSelRows() {
    document.querySelectorAll('#groups .row').forEach(r => {
      const k = r.dataset.key;
      r.classList.toggle('sel', !!k && inCart(k));
      r.querySelectorAll('.selbar button').forEach(b => {
        const l = b.dataset.l;
        b.classList.toggle('on', !!k && (l === 'both'
          ? (inCartLang(k, 'es') && inCartLang(k, 'en'))
          : inCartLang(k, l)));
      });
    });
  }
  $('#selFab').addEventListener('click', () => {
    selMode = !selMode;
    $('#selFab').classList.toggle('on', selMode);
    document.body.classList.toggle('selmode', selMode);
    paintSelRows();
  });
  $('#groups').addEventListener('click', e => {
    if (!selMode) return;
    const btn = e.target.closest('.selbar button');
    if (!btn) return;
    const row = e.target.closest('.row');
    if (!row || !row.dataset.key) return;
    const key = row.dataset.key, l = btn.dataset.l;
    if (l === 'both') {
      if (inCartLang(key, 'es') && inCartLang(key, 'en')) cart = cart.filter(x => x.key !== key);
      else {
        if (!inCartLang(key, 'es')) cart.push({ key, lang: 'es' });
        if (!inCartLang(key, 'en')) cart.push({ key, lang: 'en' });
      }
    } else if (inCartLang(key, l)) {
      cart = cart.filter(x => !(x.key === key && x.lang === l));
    } else {
      cart.push({ key, lang: l });
    }
    saveCart(); renderCart(); paintSelRows(); paintCartBtn();
  });
  $('#cartGen').addEventListener('click', () => {
    const o = $('#cartOpts');
    o.hidden = !o.hidden;
  });
  $('#cartXlsx').addEventListener('click', async () => {
    const seenM = new Set();
    const items = cart.map(x => PEOPLE.find(q => q.key === x.key))
      .filter(p => p && !seenM.has(p.key) && seenM.add(p.key));
    if (!items.length) return;
    $('#cartMsg').textContent = 'Generando la matriz…';
    try {
      const blob = await buildXlsx(items.map(matrixRow));
      const now = new Date(), p2 = n => String(n).padStart(2, '0');
      offerFile(blob, 'Matriz_Torio_' + now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + '.xlsx');
      $('#cartMsg').textContent = 'Matriz lista: ' + items.length + ' personas.';
    } catch (e) {
      $('#cartMsg').textContent = 'No se pudo generar la matriz.';
    }
  });

  // ---------- Matriz en Excel de las personas de la carpeta ----------
  // Siempre en inglés, con las 9 columnas del formato de Juan Pablo:
  // Prefix | Name | Last Name | Job Title | Office | Organization |
  // Organization Type | E-mail | Other Contact
  const ORG_BY_TREE = {
    dod: 'Department of War', pol: 'Department of War', jcs: 'Department of War',
    dia: 'Department of War', army: 'Department of War', af: 'Department of War', navy: 'Department of War',
    state: 'Department of State', wha: 'Department of State', pm: 'Department of State', ct: 'Department of State',
    ds: 'Department of State', isn: 'Department of State', ads: 'Department of State', aukus: 'Department of State', inl: 'Department of State',
    odni: 'Office of the Director of National Intelligence', wh: 'The White House',
    ondcp: 'Office of National Drug Control Policy', cia: 'Central Intelligence Agency',
    doj: 'Department of Justice', fbi: 'Department of Justice', dea: 'Department of Justice',
    dhs: 'Department of Homeland Security', ice: 'Department of Homeland Security'
  };
  const TYPE_BY_CAT = { ejecutivo: 'U.S. Government', legislativo: 'Congress', judicial: 'U.S. Government', centros: 'Think Tank', academia: 'Academia', embajada: 'Diplomatic Missions', otros: '' };
  const PREFIJO_CONOCIDO = { s3: 'Ms.', s4: 'Mr.', c1: 'Amb.', c2: 'Mr.', c3: 'Ms.', c4: 'Mr.', m1: 'Mr.', m3: 'Dr.', m4: 'Mr.', m5: 'Mr.', d20: 'Mr.', po20: 'Mr.' };
  const PREFIJO_EX = { beasley: 'Mr.', barbulescu: 'Ms.', kocheulov: 'Mr.', lee: 'Ms.', ormsby: 'Mr.', york: 'Mr.', fishman: 'Mr.', "algarra": 'Coronel', "vargas-cano": 'Coronel', "villa": 'Sargento Mayor de Comando', "diaz-irreno": 'Coronel', "cabrera": 'Capitán de Navío', "arias": 'Sargento Mayor de Comando', "lopez-duque": 'Coronel', "urrea": 'Coronel', "martinez-ossa": 'Mayor General', "morales": 'Coronel', "rincon": 'Coronel', "velasco": 'Sargento Mayor de Comando', "iregui": 'Capitán de Navío', "parra": 'Comisario', "peterson": 'Ms.', "madigan": 'Mr.', "hui": 'Mr.', "bodner": 'Ms.', "fuse": 'Ms.', "thomas": 'Ms.', "zegar": 'Ms.', "burgos": 'Ms.', "stackhouse": 'Mr.', "kitt": 'Ms.', "besosa": 'Mr.', "bello": 'Mr.', "wilson": 'Captain', "spalding": 'Lieutenant', "norkiewicz": 'Mr.', "jacquez": 'Ms.', "ortiz": 'Mr.', "cannavo": 'MS', "kroger": 'Mr.', "blasini": 'Ms.', "carrera": 'Ms.', "varela": 'Mr.', "auger": 'Ms.', "polga-hecimovich": 'Mr.', "arnold": 'Ms.', "meade": 'Ms.', "underwood": 'Mr.', "velasco": 'Mr.', "liberatori": 'Major General', "gorigoitia": 'Major General', "santamaria": 'General', "correa": 'Colonel', "skeete": 'Colonel', "diaz": 'Major General', "chini": 'Rear Admiral', "barros": 'Rear Admiral', "acevedo": 'Captain', "duarte": 'Rear Admiral', "rueda": 'Captain', "gavarrete": 'Colonel', "archila": 'Vice Admiral', "mejia": 'Colonel', "espinoza": 'Brigadier General', "angulo": 'Rear Admiral', "jessen": 'Commander', "tocci": 'Captain', "looman": 'Captain', "woolrich": 'Rear Admiral', "charpentier": 'Captain', "gore": 'Captain', "tremblay": 'Captain', "mugica": 'Captain', "ledridge": 'Captain', "griffin": 'Lieutenant', "gilbert": 'Lieutenant Colonel', "croker": 'Mr.', "chapman": 'Captain', "cbodner": 'Lieutenant Commander', "varona": 'Captain', "frost": 'Commodore', "ambrogi": 'Brigadier General', "santana": 'Colonel', "lopez": 'Major General', "camara": 'Major General', "vaca": 'Colonel', "grady": 'Lieutenant Commander', "roncone": 'Ms.' };
  const HON_RE = /^(Dr|Amb|Gen|Lt|Maj|Col|Capt|Cpt|Adm|VAdm|RAdm|Sgt|CMSgt|SMSgt|MSgt|Brig|Hon)\.$/;

  function splitName(p) {
    let name = String(p.name || '').trim();
    let prefix = '';
    if (p.key.indexOf('ex|') === 0) prefix = PREFIJO_EX[p.key.split('|')[1]] || '';
    else if (p.cat === 'ejecutivo') prefix = PREFIJO_CONOCIDO[p.key.split('|')[2]] || '';
    if (p.key.indexOf('ex|') === 0 && (p.fn || p.ln)) return { prefix, first: p.fn || '', last: p.ln || '' };
    const toks = name.split(/\s+/);
    const hon = [];
    while (toks.length > 1 && HON_RE.test(toks[0])) hon.push(toks.shift());
    if (hon.length) { name = toks.join(' '); if (!prefix) prefix = hon.join(' '); }
    if (!prefix && /ambassador/i.test(p.title_en || p.title || '')) prefix = 'Amb.';
    const parts = name.split(/\s+/).filter(Boolean);
    const last = parts.length > 1 ? parts.pop() : '';
    return { prefix, first: parts.join(' '), last };
  }

  function matrixRow(p) {
    const s = splitName(p);
    let office = '', org = '';
    const type = TYPE_BY_CAT[p.cat] || '';
    if (p.cat === 'ejecutivo') { office = p.org || ''; org = ORG_BY_TREE[p.orgId] || ''; }
    else if (p.cat === 'centros') { org = p.org || ''; }
    else { office = p.org || ''; org = p.org || ''; }
    let email = '';
    const other = [];
    const ct = contactOf(p);
    if (ct) ct.forEach(r => {
      if (/@/.test(r.v) && /correo oficial/i.test(r.k)) email = r.v;
      else other.push(r.v);
    });
    return [s.prefix, s.first, s.last, p.title_en || p.title || '', office, org, type, email, other.join(' · ')];
  }

  async function buildXlsx(rows, outType) {
    const xesc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const colL = i => String.fromCharCode(65 + i);
    const rowXml = (cells, r) => '<row r="' + r + '">' + cells.map((c, i) => '<c r="' + colL(i) + r + '" t="inlineStr"><is><t xml:space="preserve">' + xesc(c) + '</t></is></c>').join('') + '</row>';
    const head = ['Prefix', 'Name', 'Last Name', 'Job Title', 'Office', 'Organization', 'Organization Type', 'E-mail', 'Other Contact'];
    const sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' +
      rowXml(head, 1) + rows.map((r, i) => rowXml(r, i + 2)).join('') + '</sheetData></worksheet>';
    const z = new JSZip();
    z.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
    z.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    z.file('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Matriz" sheetId="1" r:id="rId1"/></sheets></workbook>');
    z.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
    z.file('xl/worksheets/sheet1.xml', sheet);
    return await z.generateAsync({ type: outType || 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  renderCart();

  renderCats();
})();
