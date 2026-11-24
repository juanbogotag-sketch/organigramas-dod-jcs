// Informes en seguridad, defensa y drogas (23 nov 2026, orden de Juan).
// Dos bloques (Cumulative Indicators / Fact Sheets); en Fact Sheets,
// selector por meses (solo meses, sin días de calendario) y, dentro de
// cada mes, subtítulos expandibles con las operaciones, las cifras y
// las fotos del fact sheet. Los datos viven en js/datos_informes.js.
(function () {
  const $ = s => document.querySelector(s);
  const D = window.FS_OCT;
  const PH = window.FS_PHOTOS_OCT || [];

  function esc(s) { return String(s == null ? '' : s); }

  // ---------- Gráficos de barras (HTML/CSS, sin librerías) ----------
  function bars(el, rows, orange) {
    if (!el) return;
    const max = Math.max.apply(null, rows.map(r => r.n)) || 1;
    el.innerHTML = rows.map(r =>
      '<div class="barrow"><span class="bl">' + esc(r.org) + '</span>' +
      '<span class="bartrack"><span class="barfill' + (orange ? ' or' : '') + '" style="width:' + Math.round(r.n / max * 100) + '%"></span></span>' +
      '<span class="bv">' + r.n + '</span></div>').join('');
  }

  // ---------- KPIs ----------
  function kpis(el) {
    if (!el || !D) return;
    el.innerHTML = D.kpis.map(k =>
      '<div class="kpi"><span class="n">' + esc(k.n) + '</span><span class="l">' + esc(k.l) + '</span></div>').join('');
  }
  kpis($('#cumKpis'));
  if (D) {
    bars($('#cumBars'), D.orgChart, false);
    bars($('#cumBars2'), [
      { org: 'Interdicción internacional y marítima', n: 7 },
      { org: 'Puertos, controles e interdicción terrestre', n: 5 },
      { org: 'Laboratorios e incautaciones en tierra', n: 3 }
    ], true);
  }

  // ---------- Tarjetas de operación ----------
  function opCard(op) {
    const img = (op.ph !== null && op.ph !== undefined && PH[op.ph])
      ? '<img src="' + PH[op.ph] + '" alt="" loading="lazy">' : '';
    return '<article class="opcard">' + img + '<div>' +
      '<div class="opmeta"><span class="chip">' + esc(op.f) + '</span>' +
      '<span class="chip loc">' + esc(op.l) + '</span></div>' +
      '<div class="opf">' + esc(op.s) + '</div>' +
      '<div class="opr">' + op.r + '</div></div></article>';
  }

  // ---------- Acordeón ----------
  let accN = 0;
  function accordion(titulo, badge, inner, open) {
    accN++;
    return '<div class="acc' + (open ? ' open' : '') + '">' +
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

  // Al incrustarse como panel en repositorio.html, el padre reajusta la
  // altura del iframe al hacer clic dentro del documento; este aviso
  // extra cubre los cambios de altura por acordeones.
  function notifyResize() {
    try { window.parent && window.parent !== window && document.dispatchEvent(new Event('click')); } catch (e) {}
  }

  // ---------- Vista de octubre ----------
  function renderOct() {
    const host = $('#monthOct');
    if (!host || !D) return;
    let h = '';
    h += '<div class="fshero"><h2>' + esc(D.titulo) + '</h2>' +
      '<p class="fssub">' + esc(D.subtitulo) + '</p>' +
      '<div class="fsmeta"><span>Periodo: <b>' + esc(D.periodo) + '</b></span>' +
      '<span><b>' + esc(D.version) + '</b></span>' +
      '<a href="' + esc(D.pdf) + '" target="_blank" rel="noopener">Ver el documento original (PDF) →</a></div></div>';
    h += '<div class="kpis">' + D.kpis.map(k =>
      '<div class="kpi"><span class="n">' + esc(k.n) + '</span><span class="l">' + esc(k.l) + '</span></div>').join('') + '</div>';

    // Sección A3C
    const a3cInner = '<p class="accintro">' + esc(D.a3c.intro) + '</p><div class="a3cgrid">' +
      D.a3c.items.map(it => '<div class="a3c"><span class="k">' + esc(it.k) + '</span><span class="v">' + esc(it.v) + '</span></div>').join('') + '</div>';
    h += '<p class="accsec">Coalición multinacional</p>' +
      accordion('Americas Counter Cartel Coalition (A3C)', '19 países', a3cInner, true);

    // Grupos de operaciones, agrupados por la sección del documento
    let lastSec = '';
    D.grupos.forEach(g => {
      if (g.seccion !== lastSec) { h += '<p class="accsec">' + esc(g.seccion) + '</p>'; lastSec = g.seccion; }
      const inner = (g.nota ? '<p class="accnote">' + esc(g.nota) + '</p>' : '') +
        '<div class="opgrid">' + g.ops.map(opCard).join('') + '</div>';
      h += accordion(g.titulo, g.badge, inner, false);
    });

    h += '<p class="accnote" style="margin-top:16px">Síntesis en español del October 2026 Fact Sheet de la Embajada de Colombia (documento original en inglés, enlazado arriba). Las fotografías son las del propio documento.</p>';
    host.innerHTML = h;
    bindAccordions(host);
  }
  renderOct();

  // ---------- Tabs principales ----------
  const tabCum = $('#tabCum'), tabFs = $('#tabFs');
  const viewCum = $('#viewCum'), viewFs = $('#viewFs');
  function showTab(which) {
    const cum = which === 'cum';
    viewCum.hidden = !cum;
    viewFs.hidden = cum;
    tabCum.classList.toggle('on', cum);
    tabFs.classList.toggle('on', !cum);
    tabCum.setAttribute('aria-selected', cum ? 'true' : 'false');
    tabFs.setAttribute('aria-selected', cum ? 'false' : 'true');
    notifyResize();
  }
  tabCum.addEventListener('click', () => showTab('cum'));
  tabFs.addEventListener('click', () => showTab('fs'));

  // ---------- Selector de meses (solo meses) ----------
  const views = { sep: $('#monthSep'), oct: $('#monthOct'), nov: $('#monthNov') };
  document.querySelectorAll('.month').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.month').forEach(b => b.classList.toggle('on', b === btn));
      Object.keys(views).forEach(k => { if (views[k]) views[k].hidden = (k !== btn.dataset.m); });
      notifyResize();
    });
  });
})();
