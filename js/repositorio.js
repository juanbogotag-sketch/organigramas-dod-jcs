// Repositorio Juan Pablo — base de datos de perfiles.
// Fuentes: Poder Ejecutivo desde js/data.js + js/photos.js (los mismos datos
// del organigrama); centros de pensamiento desde js/datos_ct.js + js/photos_ct.js.
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

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
    cat: 'ejecutivo', key: 'ej|' + n.t + '|' + n.id,
    name: n.name, title: n.title || '', title_en: n.title || '',
    org: (treeById[n.t] || {}).name || n.t, dep: parentLabel(n),
    es: n.es || '', en: n.en || '',
    photo: (typeof PH !== 'undefined' && PH[n.id]) || '', ord: treeOrder[n.t] || 0
  }));
  (typeof PERFILES_CT !== 'undefined' ? PERFILES_CT : []).forEach(p => PEOPLE.push({
    cat: 'centros', key: 'ct|' + p.id,
    name: p.name, title: p.cargo_es, title_en: p.cargo_en,
    org: p.org, dep: '',
    es: p.es || '', en: p.en || '',
    photo: (typeof PHCT !== 'undefined' && PHCT[p.id]) || '', ord: 0
  }));

  const CATS = [
    { id: 'ejecutivo', label: 'Poder Ejecutivo' },
    { id: 'legislativo', label: 'Poder Legislativo' },
    { id: 'judicial', label: 'Poder Judicial' },
    { id: 'centros', label: 'Centros de pensamiento' },
    { id: 'academia', label: 'Academia y universidades' },
    { id: 'otros', label: 'Otros' }
  ];
  const inCat = id => PEOPLE.filter(p => p.cat === id);
  $('#subtitle').textContent = 'Base de datos de perfiles · ' + PEOPLE.length + ' personas';

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

  // ---------- Portada: categorías ----------
  function renderCats() {
    $('#cats').innerHTML = CATS.map(c => {
      const n = inCat(c.id).length;
      return '<button type="button" class="cat" data-cat="' + c.id + '">' +
        '<span class="cl">' + esc(c.label) + '</span>' +
        '<span class="cn">' + (n ? n + (n === 1 ? ' perfil' : ' perfiles') : 'Todavía sin perfiles') + '</span></button>';
    }).join('');
    document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => openCat(b.dataset.cat)));
  }

  // ---------- Lista por categoría ----------
  let curCat = null;
  function openCat(id) {
    curCat = id;
    $('#home').hidden = true;
    $('#listview').hidden = false;
    $('#catTitle').textContent = (CATS.find(c => c.id === id) || {}).label || id;
    $('#q').value = '';
    renderList('');
    window.scrollTo(0, 0);
  }
  function renderList(q) {
    const all = inCat(curCat);
    const nq = norm(q);
    const list = nq ? all.filter(p => norm(p.name + ' ' + p.title + ' ' + p.org + ' ' + p.dep).includes(nq)) : all;
    const groups = new Map();
    list.forEach(p => { if (!groups.has(p.org)) groups.set(p.org, []); groups.get(p.org).push(p); });
    let html = '';
    groups.forEach((folks, org) => {
      html += '<div class="gname">' + esc(org) + ' (' + folks.length + ')</div>';
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
      empty.textContent = 'Ningún perfil coincide con la búsqueda.';
    } else empty.hidden = true;
    document.querySelectorAll('.ver').forEach(b => b.addEventListener('click', () => openProfile(b.dataset.key)));
  }
  $('#back').addEventListener('click', () => {
    $('#listview').hidden = true;
    $('#home').hidden = false;
    window.scrollTo(0, 0);
  });
  $('#q').addEventListener('input', e => renderList(e.target.value));

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
  }
  document.querySelectorAll('.langrow button').forEach(b => b.addEventListener('click', () => { curLang = b.dataset.l; paintProfile(); }));
  const closeModal = () => { $('#modal').hidden = true; };
  $('#mx').addEventListener('click', closeModal);
  $('#mback').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });

  // ---------- Descarga en Word (mismo formato del organigrama) ----------
  function dl(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  $('#mword').addEventListener('click', async () => {
    if (!cur) return;
    $('#mmsg').textContent = 'Generando el documento…';
    try {
      await wordProfile(cur, curLang);
      $('#mmsg').textContent = 'Documento generado.';
    } catch (e) {
      $('#mmsg').textContent = 'No se pudo generar el documento.';
    }
  });

  async function wordProfile(p, lang) {
    const {
      Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType,
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
    ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [run(ttl, { bold: true })] }));
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
    const buf = await (await Packer.toBlob(new Document({
      styles: { default: { document: { run: { font: 'Arial', size: 24 } } } },
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1134, right: 1418, bottom: 1134, left: 1418 } } },
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
    dl(blob, (lang === 'es' ? 'Perfil_' : 'Profile_') + slug + '_V_' + dt + '_JPGB' + (lang === 'es' ? '' : '_EN') + '.docx');
  }

  renderCats();
})();
