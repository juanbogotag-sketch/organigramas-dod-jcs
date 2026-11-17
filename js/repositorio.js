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

  // ---------- Puerta de acceso: nombre completo (como en el organigrama) ----------
  (function gate() {
    const g = $('#gate'), inp = $('#gname'), btn = $('#gbtn');
    if (!g || !inp || !btn) return;
    // A quien ya se registró en este navegador no se le vuelve a pedir el
    // nombre; en modo incógnito no queda registro y la puerta sí aparece.
    try {
      let conocido = localStorage.getItem('orgs_visitante') || '';
      if (!conocido) {
        const av = JSON.parse(localStorage.getItem('orgs_visitas_v1') || '[]');
        for (let i = av.length - 1; i >= 0; i--) if (av[i] && av[i].nombre) { conocido = av[i].nombre; break; }
        if (conocido) localStorage.setItem('orgs_visitante', conocido);
      }
      if (conocido) return;
    } catch (e) {}
    g.hidden = false;
    document.body.style.overflow = 'hidden';
    const chk = () => { btn.disabled = inp.value.trim().length < 2; };
    inp.addEventListener('input', chk);
    chk();
    const go = () => {
      const nombre = inp.value.trim();
      if (nombre.length < 2) return;
      try { localStorage.setItem('orgs_visitante', nombre); } catch (e) {}
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
          dispositivo: tipo + ' · ' + os, navegador: br, nombre: nombre, sitio: 'Torio'
        });
        if (a.length > 500) a = a.slice(-500);
        localStorage.setItem('orgs_visitas_v1', JSON.stringify(a));
      } catch (e) {}
      g.hidden = true;
      document.body.style.overflow = '';
    };
    btn.addEventListener('click', go);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
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
    return '<button type="button" class="cat" data-cat="' + c.id + '">' +
      '<span class="cl">' + esc(c.label) + '</span>' +
      '<span class="cn">' + (n ? n + (n === 1 ? ' perfil' : ' perfiles') : 'Todavía sin perfiles') + '</span></button>';
  }
  function renderCats() {
    const left = ['ejecutivo', 'legislativo', 'judicial'];
    const byId = {}; CATS.forEach(c => { byId[c.id] = c; });
    $('#colL').innerHTML = left.map(id => catCard(byId[id])).join('');
    $('#colR').innerHTML = CATS.filter(c => !left.includes(c.id)).map(catCard).join('');
    document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => openCat(b.dataset.cat)));
  }

  // ---------- Lista por categoría ----------
  let curCat = null;
  function openCat(id) {
    curCat = id;
    $('#home').hidden = true;
    $('#listview').hidden = false;
    $('#wm').hidden = false;
    $('#catTitle').textContent = (CATS.find(c => c.id === id) || {}).label || id;
    const co = $('#catOrg');
    const dest = id === 'ejecutivo' ? 'index.html' : (id === 'legislativo' ? 'congreso.html' : '');
    if (co) { co.hidden = !dest; if (dest) co.href = dest; }
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
        html += '<div class="row">' +
          (p.photo ? '<img class="ph" src="' + p.photo + '" alt="">' : '<div class="phx">' + esc(initials(p.name)) + '</div>') +
          '<div class="info"><div class="nm">' + esc(p.name) + '</div>' +
          (p.title ? '<div class="ti">' + esc(p.title) + '</div>' : '') +
          '<div class="og">' + esc(p.org) + (p.dep ? ' · Depende de: ' + esc(p.dep) : '') + '</div>' +
          (p.es ? '<p class="fp">' + esc(firstPara(p.es)) + '</p>' : '<p class="fp"><em>Sin perfil todavía.</em></p>') +
          '</div>' +
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
        body: JSON.stringify({ _subject: 'Sugerencia de perfiles — Torio', sugerencia: txt })
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
    c1: CT_OF, c2: CT_OF, c3: CT_OF, c4: CT_OF,
    m1: PM_OF, m3: PM_OF, m5: PM_OF,
    m4: PM_OF.concat([
      { k: 'Correo de su dirección (DDTC)', v: 'DDTCResponseTeam@state.gov' },
      { k: 'Teléfono DDTC', v: '(202) 663-1282' }
    ])
  };
  function contactOf(p) {
    if (!p || p.cat !== 'ejecutivo') return null;
    return CONTACTOS[p.key.split('|')[2]] || null;
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
  $('#cartGen').addEventListener('click', () => {
    const o = $('#cartOpts');
    o.hidden = !o.hidden;
  });
  $('#cartXlsx').addEventListener('click', async () => {
    const items = cart.map(x => PEOPLE.find(q => q.key === x.key)).filter(Boolean);
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
  const TYPE_BY_CAT = { ejecutivo: 'U.S. Government', legislativo: 'Congress', judicial: 'U.S. Government', centros: 'Think Tank', academia: 'Academia', otros: '' };
  const PREFIJO_CONOCIDO = { s3: 'Ms.', c1: 'Amb.', c2: 'Mr.', c3: 'Ms.', c4: 'Mr.', m1: 'Mr.', m3: 'Dr.', m4: 'Mr.', m5: 'Mr.', d20: 'Mr.', po20: 'Mr.' };
  const HON_RE = /^(Dr|Amb|Gen|Lt|Maj|Col|Capt|Cpt|Adm|VAdm|RAdm|Sgt|CMSgt|SMSgt|MSgt|Brig|Hon)\.$/;

  function splitName(p) {
    let name = String(p.name || '').trim();
    let prefix = '';
    if (p.cat === 'ejecutivo') prefix = PREFIJO_CONOCIDO[p.key.split('|')[2]] || '';
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
