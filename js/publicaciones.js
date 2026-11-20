// Publicaciones — lista, filtros y subida en el dispositivo.
//
// Las publicaciones del repositorio viven en js/datos_publicaciones.js y sus
// archivos en la carpeta publicaciones/. Lo que se sube con el formulario
// queda guardado SOLO en este dispositivo (localStorage, en base64) porque
// el sitio no tiene inicio de sesión ni subida compartida verificada:
// se probó una subida anónima a Firebase Storage y el servicio respondió
// «Not Found», y ninguna página del sitio carga el SDK de Storage ni de Auth.
// Para que una publicación subida aquí la vean todos: «Exportar datos»
// descarga su ficha en JSON; el administrador sube el archivo a
// publicaciones/ y añade la ficha a js/datos_publicaciones.js.
(function () {
  var LS_KEY = 'orgs_publicaciones_locales_v1';
  var MAX_BYTES = 4000000; // 4 MB: localStorage tiene ~5 MB por origen.
  var EXT_OK = { pdf: 1, docx: 1, xlsx: 1, pptx: 1 };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

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
  function todas() {
    var all = semillas().concat(leerLocales().map(function (p) {
      var c = {}; for (var k in p) c[k] = p[k]; c.local = true; return c;
    }));
    all.sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
    return all;
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

  function hrefDe(p) { return p.local ? p.datos : p.archivo; }
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
    // Formulario de subida.
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
      var reader = new FileReader();
      reader.onload = function () {
        var entry = {
          id: 'local-' + Date.now(),
          titulo: titulo,
          tema: tema,
          fecha: hoyISO(),
          descripcion: desc,
          nombreArchivo: file.name,
          tipo: tipo,
          datos: reader.result
        };
        var arr = leerLocales();
        arr.push(entry);
        if (!guardarLocales(arr)) {
          setMsg('No se pudo guardar en este dispositivo (espacio lleno). Prueba con un archivo más pequeño.', 'err');
          return;
        }
        form.reset();
        mostrarArchivo(null);
        setMsg('Publicación guardada en este dispositivo. Usa «Exportar datos» para agregarla al repositorio y que la vean todos.', 'ok');
        render();
      };
      reader.onerror = function () { setMsg('No se pudo leer el archivo. Inténtalo de nuevo.', 'err'); };
      reader.readAsDataURL(file);
    });
    // Exportar datos locales en JSON.
    var btnEx = $('#btnExport');
    if (btnEx) btnEx.addEventListener('click', function () {
      var blob = new Blob([exportarJSON()], { type: 'application/json' });
      var a = $('#exportDl');
      var url = URL.createObjectURL(blob);
      if (a) { a.href = url; a.download = 'publicaciones-locales.json'; a.click(); }
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    render();
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
      MAX_BYTES: MAX_BYTES
    };
  }
})();
