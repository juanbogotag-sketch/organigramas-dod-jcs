// Informes en seguridad, defensa y drogas (23 nov 2026, orden de Juan).
// Dos bloques (Cumulative Indicators / Fact Sheets) que se despliegan y
// se pliegan al repetir el clic, igual que el mes seleccionado en Fact
// Sheets. Botón de idioma: cambia TODA la sección entre español e
// inglés (datos ES en FS_OCT, EN en FS_OCT_EN, js/datos_informes.js).
(function () {
  const $ = s => document.querySelector(s);
  const PH = window.FS_PHOTOS_OCT || [];

  // ---------- Idioma ----------
  let lang = 'es';
  try {
    const saved = localStorage.getItem('todo_lang') || localStorage.getItem('informes_lang');
    lang = saved === 'en' ? 'en' : 'es';
  } catch (e) {}
  const L = () => lang === 'en' ? window.FS_OCT_EN : window.FS_OCT;
  const LS = () => lang === 'en' ? window.FS_SEP_EN : window.FS_SEP;
  const T = {
    pgTitle: { es: 'Informes en seguridad, defensa y drogas', en: 'Reports on Security, Defense and Drugs' },
    pgEmb: { es: 'Embajada de Colombia en Estados Unidos', en: 'Embassy of Colombia in the United States' },
    subtitle: { es: 'Seguridad · Defensa · Drogas', en: 'Security · Defense · Drugs' },
    homeBtn: { es: '← Menú principal', en: '← Main menu' },
    tabCumS: { es: 'Indicadores acumulados de la cooperación contra los cárteles · Deshabilitado temporalmente', en: 'Cumulative indicators of counter-cartel cooperation · Temporarily disabled' },
    tabFsS: { es: 'Síntesis mensual interactiva, mes a mes', en: 'Interactive monthly synthesis, month by month' },
    cumIntro: {
      es: 'Indicadores acumulados a partir de los fact sheets mensuales de la Embajada. Por ahora incluyen <b>octubre de 2026</b>, el primer fact sheet cargado; septiembre y noviembre se sumarán en cuanto se carguen sus documentos, y el acumulado se actualizará solo.',
      en: 'Cumulative indicators drawn from the Embassy\u2019s monthly fact sheets. For now they cover <b>October 2026</b>, the first fact sheet uploaded; September and November will be added as soon as their documents are uploaded, and the cumulative totals will update automatically.'
    },
    cumH1: { es: 'Operaciones contra organizaciones criminales, por organización', en: 'Operations against criminal organizations, by organization' },
    cumS1: { es: 'Tabla resumen del fact sheet de octubre · Total: 44 operaciones', en: 'Summary table of the October fact sheet · Total: 44 operations' },
    cumH2: { es: 'Interdicción e incautación, por tipo de operación', en: 'Interdiction and seizures, by type of operation' },
    cumS2: { es: 'Detalle sintetizado del fact sheet de octubre', en: 'Synthesized detail from the October fact sheet' },
    cumNote: {
      es: 'La operación destacada del periodo es <b>JOTAM</b> (7 oct): acción multinacional en los principales aeropuertos del país con España, Estados Unidos, Canadá y Panamá — 103 casos detectados, 32 arrestos, 4,9 t de cocaína y 96,7 kg de marihuana incautados.',
      en: 'The highlight operation of the period is <b>JOTAM</b> (Oct 7): a multinational action at the country\u2019s main airports with Spain, the United States, Canada and Panama — 103 cases detected, 32 arrests, 4.9 t of cocaine and 96.7 kg of marijuana seized.'
    },
    fsIntro: {
      es: 'Elige un mes para desplegar la síntesis interactiva de su fact sheet: cada subtítulo se expande con las operaciones, las cifras y las fotografías del documento.',
      en: 'Choose a month to open the interactive synthesis of its fact sheet: each heading expands with the operations, figures and photographs from the document.'
    },
    mSep: { es: 'Septiembre', en: 'September' },
    mOct: { es: 'Octubre', en: 'October' },
    mNov: { es: 'Noviembre', en: 'November' },
    mSepS: { es: 'Fact sheet disponible · V: 10.8.26', en: 'Fact sheet available · V: 10.8.26' },
    mOctS: { es: 'Fact sheet disponible · V: 11.2.26', en: 'Fact sheet available · V: 11.2.26' },
    mNovS: { es: 'Fact sheet pendiente de carga', en: 'Fact sheet pending upload' },
    sepH: { es: 'Septiembre de 2026', en: 'September 2026' },
    sepP: {
      es: 'El fact sheet de septiembre aún no ha sido cargado en esta sección. En cuanto se reciba el documento, aquí se desplegará su síntesis interactiva con el mismo formato de octubre.',
      en: 'The September fact sheet has not been uploaded to this section yet. Once the document is received, its interactive synthesis will appear here in the same format as October.'
    },
    novH: { es: 'Noviembre de 2026', en: 'November 2026' },
    novP: {
      es: 'El fact sheet de noviembre aún no ha sido cargado en esta sección. Se publicará al cierre del mes, con el mismo formato interactivo de octubre.',
      en: 'The November fact sheet has not been uploaded to this section yet. It will be published at the end of the month, in the same interactive format as October.'
    }
  };
  const TXT = {
    periodo: { es: 'Periodo', en: 'Reporting period' },
    verPdf: { es: 'Ver el documento original (PDF) →', en: 'See the original document (PDF) →' },
    a3cSec: { es: 'Coalición multinacional', en: 'Multinational Coalition' },
    a3cBadge: { es: '19 países', en: '19 countries' },
    cierre: {
      es: 'Síntesis en español del October 2026 Fact Sheet de la Embajada de Colombia (documento original en inglés, enlazado arriba). Las fotografías son las del propio documento.',
      en: 'English synthesis of the Embassy of Colombia\u2019s October 2026 Fact Sheet (original document linked above). The photographs are from the document itself.'
    },
    cierreSep: {
      es: 'Síntesis en español del September 2026 Fact Sheet de la Embajada de Colombia (documento original en inglés, enlazado arriba).',
      en: 'English synthesis of the Embassy of Colombia\u2019s September 2026 Fact Sheet (original document linked above).'
    },
    bars2: {
      es: [
        { org: 'Interdicción internacional y marítima', n: 7 },
        { org: 'Puertos, controles e interdicción terrestre', n: 5 },
        { org: 'Laboratorios e incautaciones en tierra', n: 3 }
      ],
      en: [
        { org: 'International and maritime interdiction', n: 7 },
        { org: 'Ports, checkpoints and inland interdiction', n: 5 },
        { org: 'Laboratories and land seizures', n: 3 }
      ]
    }
  };

  function esc(s) { return String(s == null ? '' : s); }
  function notifyResize() {
    try { window.parent && window.parent !== window && document.dispatchEvent(new Event('click')); } catch (e) {}
  }

  // ---------- Gráficos de barras ----------
  function bars(el, rows, orange) {
    if (!el) return;
    const max = Math.max.apply(null, rows.map(r => r.n)) || 1;
    el.innerHTML = rows.map(r =>
      '<div class="barrow"><span class="bl">' + esc(r.org) + '</span>' +
      '<span class="bartrack"><span class="barfill' + (orange ? ' or' : '') + '" style="width:' + Math.round(r.n / max * 100) + '%"></span></span>' +
      '<span class="bv">' + r.n + '</span></div>').join('');
  }
  function kpisHTML(x) {
    const arr = Array.isArray(x) ? x : x.kpis;
    return arr.map(k => '<div class="kpi"><span class="n">' + esc(k.n) + '</span><span class="l">' + esc(k.l) + '</span></div>').join('');
  }
  function renderCum() {
    const D = L(); if (!D) return;
    const kc = $('#cumKpis'); if (kc) kc.innerHTML = kpisHTML(D);
    bars($('#cumBars'), D.orgChart, false);
    bars($('#cumBars2'), TXT.bars2[lang], true);
  }

  // ---------- Tarjetas de operación (foto desde los datos ES, por posición) ----------
  function opCard(op, ph, photos) {
    const arr = photos || PH;
    const img = (ph !== null && ph !== undefined && arr[ph])
      ? '<img src="' + arr[ph] + '" alt="" loading="lazy">' : '';
    return '<article class="opcard">' + img + '<div>' +
      '<div class="opmeta"><span class="chip">' + esc(op.f) + '</span>' +
      '<span class="chip loc">' + esc(op.l) + '</span></div>' +
      '<div class="opf">' + esc(op.s) + '</div>' +
      '<div class="opr">' + op.r + '</div></div></article>';
  }

  // ---------- Acordeón ----------
  function accordion(titulo, badge, inner, open, cls) {
    return '<div class="acc' + (cls ? ' ' + cls : '') + (open ? ' open' : '') + '">' +
      '<button type="button" class="accbtn" aria-expanded="' + (open ? 'true' : 'false') + '">' +
      '<span class="acct">' + esc(titulo) + '</span>' +
      (badge ? '<span class="accb">' + esc(badge) + '</span>' : '') +
      '<span class="accx" aria-hidden="true">+</span></button>' +
      '<div class="accbody"' + (open ? '' : ' hidden') + '>' + inner + '</div></div>';
  }
  function bindAccordions(root) {
    root.querySelectorAll('.accbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const acc = btn.closest('.acc');
        const body = acc.querySelector('.accbody');
        const open = acc.classList.toggle('open');
        body.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        notifyResize();
      });
    });
  }

  // ---------- Vista de octubre ----------
  function renderOct() {
    const host = $('#monthOct');
    const D = L(), ES = window.FS_OCT;
    if (!host || !D || !ES) return;
    let h = '';
    h += '<div class="fshero"><h2>' + esc(D.titulo) + '</h2>' +
      '<p class="fssub">' + esc(D.subtitulo) + '</p>' +
      '<div class="fsmeta"><span>' + TXT.periodo[lang] + ': <b>' + esc(D.periodo) + '</b></span>' +
      '<span><b>' + esc(D.version) + '</b></span>' +
      '<a href="' + esc(ES.pdf) + '" target="_blank" rel="noopener">' + TXT.verPdf[lang] + '</a></div></div>';
    h += '<div class="kpis kpis2">' + kpisHTML(D.kpisFS || D.kpis.slice(0, 2)) + '</div>';

    const a3cInner = '<p class="accintro">' + esc(D.a3c.intro) + '</p><div class="a3cgrid">' +
      D.a3c.items.map(it => '<div class="a3c"><span class="k">' + esc(it.k) + '</span><span class="v">' + esc(it.v) + '</span></div>').join('') + '</div>';
    h += '<p class="accsec">' + TXT.a3cSec[lang] + '</p>' +
      accordion('Americas Counter Cartel Coalition (A3C)', TXT.a3cBadge[lang], a3cInner, true, 'acc-a3c');

    let lastSec = '';
    D.grupos.forEach((g, gi) => {
      if (g.seccion !== lastSec) { h += '<p class="accsec">' + esc(g.seccion) + '</p>'; lastSec = g.seccion; }
      const inner = (g.nota ? '<p class="accnote">' + esc(g.nota) + '</p>' : '') +
        '<div class="opgrid">' + g.ops.map((op, oi) => opCard(op, ES.grupos[gi].ops[oi].ph)).join('') + '</div>';
      h += accordion(g.titulo, g.badge, inner, false);
    });

    h += '<p class="accnote" style="margin-top:16px">' + TXT.cierre[lang] + '</p>';
    host.innerHTML = h;
    bindAccordions(host);
  }


  // ---------- Vista de septiembre (no toca octubre) ----------
  function renderSep() {
    const host = $('#monthSep');
    const D = LS(), ES = window.FS_SEP;
    const PH_SEP = window.FS_PHOTOS_SEP || [];
    if (!host || !D || !ES) return;
    let h = '';
    h += '<div class="fshero"><h2>' + esc(D.titulo) + '</h2>' +
      '<p class="fssub">' + esc(D.subtitulo) + '</p>' +
      '<div class="fsmeta"><span>' + TXT.periodo[lang] + ': <b>' + esc(D.periodo) + '</b></span>' +
      '<span><b>' + esc(D.version) + '</b></span>' +
      '<a href="' + esc(ES.pdf) + '" target="_blank" rel="noopener">' + TXT.verPdf[lang] + '</a></div></div>';
    h += '<div class="kpis kpis2">' + kpisHTML(D.kpisFS || D.kpis.slice(0, 2)) + '</div>';

    let lastSec = '';
    D.grupos.forEach((g, gi) => {
      if (g.seccion !== lastSec) { h += '<p class="accsec">' + esc(g.seccion) + '</p>'; lastSec = g.seccion; }
      const inner = (g.nota ? '<p class="accnote">' + esc(g.nota) + '</p>' : '') +
        '<div class="opgrid">' + g.ops.map((op, oi) => opCard(op, ES.grupos[gi].ops[oi].ph, PH_SEP)).join('') + '</div>';
      h += accordion(g.titulo, g.badge, inner, false);
    });

    h += '<p class="accnote" style="margin-top:16px">' + TXT.cierreSep[lang] + '</p>';
    host.innerHTML = h;
    bindAccordions(host);
  }

  // ---------- Aplicar idioma a todo ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = lang === 'es'
      ? 'Informes en seguridad, defensa y drogas · Todo · Embajada de Colombia en Estados Unidos'
      : 'Reports on Security, Defense and Drugs · Todo · Embassy of Colombia in the United States';
    const fl = $('#footlogo');
    if (fl) fl.alt = T.pgEmb[lang];
    Object.keys(T).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = T[id][lang];
    });
    const btn = $('#btnLang');
    if (btn) { btn.classList.toggle('en', lang === 'en'); btn.setAttribute('aria-checked', lang === 'en' ? 'true' : 'false'); }
    renderCum();
    renderOct();
    renderSep();
    notifyResize();
  }
  const btnLang = $('#btnLang');
  if (btnLang) btnLang.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('informes_lang', lang); localStorage.setItem('todo_lang', lang); } catch (e) {}
    applyLang();
  });

  // ---------- Bloques principales: desplegar / plegar al repetir clic ----------
  const tabCum = $('#tabCum'), tabFs = $('#tabFs');
  const viewCum = $('#viewCum'), viewFs = $('#viewFs');
  let openBlock = 'fs';
  function paintBlocks() {
    viewCum.hidden = openBlock !== 'cum';
    viewFs.hidden = openBlock !== 'fs';
    tabCum.classList.toggle('on', openBlock === 'cum');
    tabFs.classList.toggle('on', openBlock === 'fs');
    tabCum.setAttribute('aria-selected', openBlock === 'cum' ? 'true' : 'false');
    tabFs.setAttribute('aria-selected', openBlock === 'fs' ? 'true' : 'false');
  }
  function toggleBlock(which) {
    if (which === 'cum') return; // CI deshabilitado temporalmente (24 nov 2026, orden de Juan)
    openBlock = (openBlock === which) ? null : which;
    paintBlocks();
    notifyResize();
  }
  tabCum.addEventListener('click', () => toggleBlock('cum'));
  tabFs.addEventListener('click', () => toggleBlock('fs'));
  paintBlocks();

  // ---------- Meses: desplegar / plegar al repetir clic ----------
  const views = { sep: $('#monthSep'), oct: $('#monthOct'), nov: $('#monthNov') };
  let openMonth = 'oct';
  function paintMonths() {
    Object.keys(views).forEach(k => { if (views[k]) views[k].hidden = (k !== openMonth); });
    document.querySelectorAll('.month').forEach(b => b.classList.toggle('on', b.dataset.m === openMonth));
  }
  document.querySelectorAll('.month').forEach(btn => {
    btn.addEventListener('click', () => {
      openMonth = (openMonth === btn.dataset.m) ? null : btn.dataset.m;
      paintMonths();
      notifyResize();
    });
  });
  paintMonths();

  applyLang();
})();
