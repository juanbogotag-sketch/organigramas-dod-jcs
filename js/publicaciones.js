// Publicaciones — lista, filtros y publicación directa en la web.
//
// Las publicaciones del repositorio viven en js/datos_publicaciones.js y sus
// archivos en la carpeta publicaciones/. Desde el 20 nov 2026 (orden de Juan),
// el formulario publica DIRECTO en la web: la publicación (título, temática,
// fecha, descripción + archivo en base64, máx. 4 MB) se guarda en Firebase
// Realtime Database, nodo `publicaciones/` (proyecto asistencia-eventos-cc286,
// mismo SDK y configuración que los gestores y checklists: firebasejs 10.12.2
// compat, sin autenticación nueva), y la lista la muestra junto a las semillas
// del repositorio. Si la publicación no se puede enviar (sin conexión, o las
// reglas de Firebase aún no permiten escrituras públicas en ese nodo), queda
// guardada en este dispositivo (localStorage) y la acción «Publicarlas ahora»
// la sube cuando sea posible, sin duplicarla.
// «Exportar datos» se conserva como respaldo (descarga las locales en JSON).
// Nota histórica: se probó una subida anónima a Firebase Storage y el servicio
// respondió «Not Found» (ninguna página carga el SDK de Storage ni de Auth);
// por eso el archivo va como base64 data URL en Realtime Database, igual que
// se guardaba en localStorage.
(function () {
  var LS_KEY = 'orgs_publicaciones_locales_v1';
  var MAX_BYTES = 4000000; // 4 MB: localStorage tiene ~5 MB por origen.
  var EXT_OK = { pdf: 1, docx: 1, xlsx: 1, pptx: 1 };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // Firebase — MISMA configuración que checkin.js / hipopotamo.html
  // (proyecto asistencia-eventos-cc286). Sin autenticación nueva: las páginas
  // de asistencia escriben sin iniciar sesión y aquí se hace igual.
var FB_CONFIG = {
    apiKey: "AIzaSyD9fVRwR4VbNWxz_uRYFV00DsOt0K6m-Cc",
    authDomain: "asistencia-eventos-cc286.firebaseapp.com",
    databaseURL: "https://asistencia-eventos-cc286-default-rtdb.firebaseio.com",
    projectId: "asistencia-eventos-cc286",
    storageBucket: "asistencia-eventos-cc286.firebasestorage.app",
    messagingSenderId: "1078332084015",
    appId: "1:1078332084015:web:9297f883eb4ed7a767dbda"
  };
  var FB_PUB_NODE = 'publicaciones';
  var FB_DATOS_MAX = 7000000; // tope del data URL en base64 (~4 MB de archivo).

  function $(s) { return document.querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function hoyISO() {
    var d = new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function fmtFecha(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3 || !MESES[+p[1] - 1]) return String(iso || '');
    return (+p[2]) + ' ' + MESES[+p[1] - 1] + ' ' + p[0];
  }
  function tipoDe(nombre) {
    var m = /\.([a-z0-9]+)$/i.exec(String(nombre || ''));
    return m ? m[1].toLowerCase() : '';
  }
  function leerLocales() {
    try {
      var v = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function guardarLocales(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); return true; }
    catch (e) { return false; }
  }
  function semillas() {
    var s = (typeof PUBLICACIONES !== 'undefined' && Array.isArray(PUBLICACIONES)) ? PUBLICACIONES : [];
    return s.map(function (p) {
      var c = {}; for (var k in p) c[k] = p[k]; c.local = false; return c;
    });
  }

  // --- Firebase: publicaciones en la web (nube) ---
  var nubePubs = []; // entradas del nodo Firebase, ya normalizadas
  function fbDb() {
    try {
      if (typeof firebase === 'undefined' || !firebase || !firebase.database) return null;
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(FB_CONFIG);
      return firebase.database();
    } catch (e) { return null; }
  }
  function fbRef() {
    var db = fbDb();
    return db ? db.ref(FB_PUB_NODE) : null;
  }
  function normalizarNube(obj) {
    var out = [];
    if (!obj || typeof obj !== 'object') return out;
    Object.keys(obj).forEach(function (k) {
      var p = obj[k];
      if (!p || typeof p !== 'object') return;
      if (!p.titulo || !(p.datos || p.archivo)) return;
      var c = {};
      for (var key in p) c[key] = p[key];
      c.id = p.id || k;
      c.local = false; c.nube = true;
      out.push(c);
    });
    return out;
  }
  function clavePub(p) {
    var t = String(p.titulo || '').trim().toLowerCase();
    var a = String(p.nombreArchivo || (p.archivo || '').split('/').pop() || '').trim().toLowerCase();
    return t + '|' + a;
  }
  function yaPublicada(p, semillasArr, nubeArr) {
    var id = p.id, clave = clavePub(p);
    var i;
    for (i = 0; i < semillasArr.length; i++) {
      if (semillasArr[i].id === id || clavePub(semillasArr[i]) === clave) return true;
    }
    for (i = 0; i < nubeArr.length; i++) {
      if (nubeArr[i].id === id || clavePub(nubeArr[i]) === clave) return true;
    }
    return false;
  }
  // Mezcla semillas + nube + locales sin duplicar: una publicación que ya está
  // en la web (semilla o nube) no se muestra dos veces aunque siga en localStorage.
  function mezclar(semillasArr, nubeArr, localesArr) {
    var all = [], vistosId = {}, vistosClave = {};
    function meter(p, local, nube) {
      if (!p) return;
      var clave = clavePub(p);
      if ((p.id && vistosId[p.id]) || vistosClave[clave]) return;
      if (p.id) vistosId[p.id] = true;
      vistosClave[clave] = true;
      var c = {}; for (var k in p) c[k] = p[k];
      c.local = !!local; c.nube = !!nube;
      all.push(c);
    }
    semillasArr.forEach(function (p) { meter(p, false, false); });
    nubeArr.forEach(function (p) { meter(p, false, true); });
    localesArr.forEach(function (p) { meter(p, true, false); });
    all.sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
    return all;
  }
  function todas() {
    return mezclar(semillas(), nubePubs, leerLocales());
  }
  // Limpia del localStorage las publicaciones que ya están en la web
  // (por ejemplo, una ficha que Milo añadió al repositorio, o una migración
  // que se completó pero no borró el local). No toca las demás.
  function limpiarLocalesPublicadas() {
    var locales = leerLocales();
    if (!locales.length) return;
    var sem = semillas();
    var resto = locales.filter(function (p) { return !yaPublicada(p, sem, nubePubs); });
    if (resto.length !== locales.length) guardarLocales(resto);
  }
  function cargarNube() {
    var ref;
    try { ref = fbRef(); } catch (e) { ref = null; }
    if (!ref) return;
    try {
      ref.on('value', function (snap) {
        nubePubs = normalizarNube(snap.val());
        limpiarLocalesPublicadas();
        render();
      }, function () { /* sin lectura (sin conexión o sin permiso): semillas + locales */ });
    } catch (e) {}
  }
  // Sube UNA publicación a Firebase (crear por id: nunca sobrescribe otra).
  // done(true) si quedó en la web, done(false) si no se pudo.
  function publicarWeb(entry, done) {
    var ref;
    try { ref = fbRef(); } catch (e) { ref = null; }
    if (!ref) { done(false); return; }
    if (entry.datos && String(entry.datos).length > FB_DATOS_MAX) { done(false); return; }
    try {
      var r = ref.child(entry.id).set(entry);
      if (r && typeof r.then === 'function') {
        r.then(function () { done(true); }, function () { done(false); });
      } else { done(true); }
    } catch (e) { done(false); }
  }

  function filtrar(lista, tema, texto) {
    var t = String(texto || '').trim().toLowerCase();
    return lista.filter(function (p) {
      if (tema && tema !== 'Todos' && p.tema !== tema) return false;
      if (!t) return true;
      return (String(p.titulo || '') + ' ' + String(p.descripcion || '')).toLowerCase().indexOf(t) !== -1;
    });
  }
  function temas() {
    var t = (typeof TEMAS_PUBLICACIONES !== 'undefined' && Array.isArray(TEMAS_PUBLICACIONES))
      ? TEMAS_PUBLICACIONES : [];
    return t;
  }

  var filtroTema = 'Todos';
  var textoBusq = '';

  function hrefDe(p) { return p.datos ? p.datos : p.archivo; }
  function etiquetaTipo(p) { return (p.tipo || tipoDe(p.nombreArchivo || p.archivo || '') || 'doc').toUpperCase(); }

  function tarjeta(p) {
    var href = hrefDe(p);
    var esPdf = (p.tipo || '').toLowerCase() === 'pdf';
    var accion = esPdf
      ? '<a class="ver" href="' + esc(href) + '" target="_blank" rel="noopener">Ver / Descargar</a>'
      : '<a class="ver" href="' + esc(href) + '" download="' + esc(p.nombreArchivo || (p.archivo || '').split('/').pop() || 'documento') + '">Ver / Descargar</a>';
    var del = p.local
      ? '<button type="button" class="del" data-del="' + esc(p.id) + '">Eliminar</button>' : '';
    var badgeLocal = p.local ? '<span class="badge local">En este dispositivo</span>' : '';
    return '<article class="pubcard">' +
      '<div class="pubtop"><span class="badge">' + esc(p.tema || 'Sin tema') + '</span>' +
      '<span class="badge tipo">' + esc(etiquetaTipo(p)) + '</span>' + badgeLocal + '</div>' +
      '<h3>' + esc(p.titulo) + '</h3>' +
      '<div class="pubfecha">' + esc(fmtFecha(p.fecha)) + '</div>' +
      '<p class="pubdesc">' + esc(p.descripcion || '') + '</p>' +
      '<div class="pubactions">' + accion + del + '</div>' +
      '</article>';
  }

  function render() {
    var list = $('#pubList'), empty = $('#pubEmpty');
    if (!list) return;
    var items = filtrar(todas(), filtroTema, textoBusq);
    list.innerHTML = items.map(tarjeta).join('');
    if (empty) empty.hidden = items.length !== 0;
    renderChips();
    actualizarMigra();
  }

  function renderChips() {
    var box = $('#chips');
    if (!box) return;
    var opts = ['Todos'].concat(temas());
    box.innerHTML = opts.map(function (t) {
      return '<button type="button" class="chip' + (t === filtroTema ? ' on' : '') +
        '" data-tema="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('');
  }

  function setMsg(texto, clase) {
    var m = $('#upMsg');
    if (!m) return;
    m.textContent = texto;
    m.className = clase || '';
  }
  function setMigraMsg(texto, clase) {
    var m = $('#pubMigraMsg');
    if (!m) return;
    m.textContent = texto;
    m.className = clase || '';
  }

  // Aviso de migración: cuántas publicaciones hay solo en este dispositivo.
  function actualizarMigra() {
    var box = $('#pubMigra'), txt = $('#pubMigraTexto'), btn = $('#btnMigra');
    if (!box) return;
    var pendientes = leerLocales().filter(function (p) { return !yaPublicada(p, semillas(), nubePubs); });
    if (!pendientes.length) { box.hidden = true; return; }
    box.hidden = false;
    if (txt) txt.textContent = 'Tienes ' + pendientes.length +
      (pendientes.length === 1 ? ' publicación solo en este dispositivo.' : ' publicaciones solo en este dispositivo.');
    if (btn && !migrando) btn.disabled = false;
  }

  var migrando = false;
  function migrarLocales() {
    if (migrando) return;
    var btn = $('#btnMigra');
    var locales = leerLocales();
    var sem = semillas();
    var pendientes = locales.filter(function (p) { return !yaPublicada(p, sem, nubePubs); });
    var ya = locales.length - pendientes.length;
    if (!pendientes.length) {
      if (ya) { guardarLocales([]); render(); }
      setMigraMsg(ya ? 'Ya estaban publicadas para todos.' : 'No hay publicaciones pendientes.', 'ok');
      return;
    }
    if (!fbRef()) {
      setMigraMsg('No se pudo conectar con la web ahora. Inténtalo de nuevo más tarde.', 'err');
      return;
    }
    migrando = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Publicando…'; }
    var ok = 0, fail = 0, i = 0, subidas = [];
    function siguiente() {
      if (i >= pendientes.length) { terminar(); return; }
      var entry = pendientes[i++];
      publicarWeb(entry, function (bien) {
        if (bien) { ok++; subidas.push(entry.id); } else { fail++; }
        siguiente();
      });
    }
    function terminar() {
      migrando = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Publicarlas ahora'; }
      var resto = leerLocales().filter(function (p) {
        return subidas.indexOf(p.id) === -1 && !yaPublicada(p, semillas(), nubePubs);
      });
      guardarLocales(resto);
      if (ok && !fail) {
        var msg = ok === 1 ? 'Publicada para todos.' : ok + ' publicadas para todos.';
        if (ya) msg += ' ' + ya + ' ya lo estaban.';
        setMigraMsg(msg, 'ok');
      } else if (ok) {
        setMigraMsg(ok + ' de ' + pendientes.length + ' publicadas para todos. Las demás quedaron en este dispositivo.', 'err');
      } else {
        setMigraMsg('No se pudo publicar en la web ahora. Quedaron en este dispositivo.', 'err');
      }
      render();
    }
    siguiente();
  }

  function exportarJSON() {
    var locales = leerLocales().map(function (p) {
      return {
        id: p.id,
        titulo: p.titulo,
        tema: p.tema,
        fecha: p.fecha,
        descripcion: p.descripcion || '',
        archivo: 'publicaciones/' + (p.nombreArchivo || ''),
        tipo: p.tipo || tipoDe(p.nombreArchivo || '')
      };
    });
    return JSON.stringify({
      exportado: hoyISO(),
      nota: 'Para publicarlas para todos: sube cada archivo a la carpeta publicaciones/ del repositorio y añade su ficha a js/datos_publicaciones.js.',
      publicaciones: locales
    }, null, 2);
  }

  function init() {
    // Llenar el select de temáticas del formulario.
    var sel = $('#upTema');
    if (sel) {
      temas().forEach(function (t) {
        var o = document.createElement('option');
        o.value = t; o.textContent = t; sel.appendChild(o);
      });
    }
    // Filtro por chip (delegación).
    var chips = $('#chips');
    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-tema]') : null;
      if (!b) return;
      filtroTema = b.getAttribute('data-tema');
      render();
    });
    // Buscador.
    var q = $('#pq');
    if (q) q.addEventListener('input', function () { textoBusq = q.value; render(); });
    // Eliminar una publicación local (delegación).
    var list = $('#pubList');
    if (list) list.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-del]') : null;
      if (!b) return;
      var id = b.getAttribute('data-del');
      guardarLocales(leerLocales().filter(function (p) { return p.id !== id; }));
      render();
    });
    // Migración de locales a la web.
    var btnMigra = $('#btnMigra');
    if (btnMigra) btnMigra.addEventListener('click', migrarLocales);
    // Casillero para arrastrar y soltar (dropzone) del formulario
    // (20 nov 2026, orden de Juan): además del botón de elegir archivo.
    // Soltar un archivo lo pone en el mismo input (#upFile), así que pasa
    // por la misma validación y el mismo envío del formulario.
    var dzInput = $('#upFile');
    var dz = $('#upDrop');
    function mostrarArchivo(f) {
      if (!dz) return;
      var t = dz.querySelector('.dztext');
      if (t) t.textContent = f ? ('Archivo elegido: ' + f.name) : 'Arrastra archivos aquí o haz clic para elegir';
    }
    if (dz && dzInput) {
      dz.addEventListener('click', function () { dzInput.click(); });
      dz.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dzInput.click(); }
      });
      ['dragenter', 'dragover'].forEach(function (ev) {
        dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('over'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('over'); });
      });
      dz.addEventListener('drop', function (e) {
        var files = e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
        if (!files || !files.length) return;
        try { dzInput.files = files; }
        catch (err) {
          try {
            var dt = new DataTransfer();
            dt.items.add(files[0]);
            dzInput.files = dt.files;
          } catch (err2) {}
        }
        mostrarArchivo(files[0]);
      });
      dzInput.addEventListener('change', function () {
        mostrarArchivo(dzInput.files && dzInput.files[0] ? dzInput.files[0] : null);
      });
    }
    // Formulario de subida: publica DIRECTO en la web (Firebase); si no se
    // puede, guarda en este dispositivo y se publica luego con «Publicarlas ahora».
    var form = $('#upForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg('', '');
      var titulo = ($('#upTitulo') || {}).value ? $('#upTitulo').value.trim() : '';
      var tema = ($('#upTema') || {}).value || '';
      var desc = ($('#upDesc') || {}).value ? $('#upDesc').value.trim() : '';
      var fileInput = $('#upFile');
      var file = fileInput && fileInput.files ? fileInput.files[0] : null;
      if (!titulo) { setMsg('Escribe un título para la publicación.', 'err'); return; }
      if (!tema) { setMsg('Elige una temática.', 'err'); return; }
      if (!file) { setMsg('Elige un archivo para subir.', 'err'); return; }
      var tipo = tipoDe(file.name);
      if (!EXT_OK[tipo]) { setMsg('Formato no admitido. Usa .pdf, .docx, .xlsx o .pptx.', 'err'); return; }
      if (file.size > MAX_BYTES) {
        setMsg('El archivo supera los 4 MB. Súbelo directamente al repositorio para publicarlo para todos.', 'err');
        return;
      }
      var btnSubmit = form.querySelector('button[type="submit"]');
      var reader = new FileReader();
      reader.onload = function () {
        var entry = {
          id: 'local-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
          titulo: titulo,
          tema: tema,
          fecha: hoyISO(),
          descripcion: desc,
          nombreArchivo: file.name,
          tipo: tipo,
          datos: reader.result
        };
        if (btnSubmit) btnSubmit.disabled = true;
        publicarWeb(entry, function (bien) {
          if (btnSubmit) btnSubmit.disabled = false;
          if (bien) {
            // Ya está en la web: no pasa por localStorage. Se añade al caché
            // local de la nube para verla de inmediato (el listener la trae
            // también; la mezcla quita duplicados por id).
            nubePubs = nubePubs.filter(function (p) { return p.id !== entry.id; });
            var copia = {}; for (var k in entry) copia[k] = entry[k];
            copia.nube = true; copia.local = false;
            nubePubs.push(copia);
            limpiarLocalesPublicadas();
            form.reset();
            mostrarArchivo(null);
            setMsg('Publicada para todos.', 'ok');
            render();
            return;
          }
          // Sin web (sin conexión o sin permiso): queda en este dispositivo.
          var arr = leerLocales();
          arr.push(entry);
          if (!guardarLocales(arr)) {
            setMsg('No se pudo guardar en este dispositivo (espacio lleno). Prueba con un archivo más pequeño.', 'err');
            return;
          }
          form.reset();
          mostrarArchivo(null);
          setMsg('Guardada en este dispositivo. Publícala en la web con «Publicarlas ahora».', 'ok');
          render();
        });
      };
      reader.onerror = function () { setMsg('No se pudo leer el archivo. Inténtalo de nuevo.', 'err'); };
      reader.readAsDataURL(file);
    });
    // Exportar datos locales en JSON (respaldo).
    var btnEx = $('#btnExport');
    if (btnEx) btnEx.addEventListener('click', function () {
      var blob = new Blob([exportarJSON()], { type: 'application/json' });
      var a = $('#exportDl');
      var url = URL.createObjectURL(blob);
      if (a) { a.href = url; a.download = 'publicaciones-locales.json'; a.click(); }
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    render();
    cargarNube();
  }

  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API expuesta para pruebas automatizadas.
  if (typeof window !== 'undefined') {
    window.__pubTest = {
      fmtFecha: fmtFecha, tipoDe: tipoDe, filtrar: filtrar,
      todas: todas, leerLocales: leerLocales, exportarJSON: exportarJSON,
      mezclar: mezclar, normalizarNube: normalizarNube, clavePub: clavePub,
      publicarWeb: publicarWeb, migrarLocales: migrarLocales,
      nubePubs: function () { return nubePubs; },
      MAX_BYTES: MAX_BYTES
    };
  }
})();
