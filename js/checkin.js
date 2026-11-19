/* Check-in «Protegiendo las Américas» — herramienta del personal.
 *
 * SEGURIDAD (léase antes de tocar este archivo): la verificación del token
 * es SOLO en el cliente: el token está escrito en este JS, que cualquiera
 * puede leer si abre el código fuente de la página. Es una barrera
 * práctica contra el auto-marcado (el invitado que escanea su QR no conoce
 * el token y el QR no lo contiene), NO seguridad bancaria. No ponga aquí
 * nada más sensible que el token de personal.
 *
 * Flujo: QR -> checkin.html?g=<id> -> pide token de personal ->
 * muestra el perfil -> «Marcar asistencia» guarda check + hora en este
 * dispositivo (localStorage orgs_checkin_v1) y envía un ping silencioso
 * por FormSubmit (asunto «Asistencia — Protegiendo las Américas») para el
 * registro central por correo. El contador cuenta los marcados en ESTE
 * dispositivo; el total central se lleva con los correos + la pestaña
 * «Asistencia» de la matriz del evento.
 */
(function () {
  "use strict";

  // Token de personal. Lo conoce Juan Pablo y lo comparte solo con personas
  // de su confianza. NO aparece en el QR ni en la URL.
  var STAFF_TOKEN = "americas-5620";

  var STORE_KEY = "orgs_checkin_v1";
  var SESSION_KEY = "orgs_checkin_staff_v1";
  var FORMSUBMIT_URL = "https://formsubmit.co/ajax/juan.bogotag@gmail.com";

  // Invitados de la matriz de prueba (4). Datos verificados en el repo:
  // PERFILES_EX en js/datos_foro.js (Brown, Fishman, Ormsby) y fila de
  // prueba de Juan Pablo (no es perfil del Repositorio: id ev|...).
  // photo: URL o data URI cuando exista; null = iniciales.
  var GUESTS = {
    "ev|gonzalez-bogota": {
      name: "Juan Pablo González Bogotá",
      title: "Pasante",
      org: "Embajada de Colombia en Washington",
      email: "juan.bogotag@gmail.com",
      photo: null
    },
    "ex|brown": {
      name: "Stanley L. Brown",
      title: "U.S. Ambassador to the Republic of Equatorial Guinea",
      org: "Department of State",
      email: "",
      photo: null
    },
    "ex|fishman": {
      name: "Kyle Fishman",
      title: "Colombia Team",
      org: "Bureau of International Narcotics and Law Enforcement Affairs (INL)",
      email: "",
      photo: null
    },
    "ex|ormsby": {
      name: "Jesse Ormsby",
      title: "Associate Director for South America",
      org: "Department of Justice (DOJ)",
      email: "",
      photo: null
    }
  };

  var $ = function (id) { return document.getElementById(id); };

  function getGuestId() {
    var q = new URLSearchParams(window.location.search).get("g");
    return q ? q.trim() : "";
  }

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function fmtTime(iso) {
    try {
      return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/New_York",
        hour: "numeric", minute: "2-digit"
      }).format(new Date(iso));
    } catch (e) { return new Date(iso).toLocaleTimeString(); }
  }
  function fmtDateTime(iso) {
    try {
      return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/New_York",
        day: "numeric", month: "short",
        hour: "numeric", minute: "2-digit"
      }).format(new Date(iso));
    } catch (e) { return iso; }
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function updateCounter() {
    var store = loadStore();
    var arrived = Object.keys(store).filter(function (k) {
      return store[k].status === "si";
    }).length;
    $("countArrived").textContent = arrived;
    $("countTotal").textContent = Object.keys(GUESTS).length;
  }

  function renderStatus(gid) {
    var rec = loadStore()[gid];
    var box = $("statusBox");
    if (!rec) { box.hidden = true; box.textContent = ""; return; }
    box.hidden = false;
    if (rec.status === "si") {
      box.className = "ck-status ck-ok";
      box.textContent = "✓ Asistió — " + fmtTime(rec.time) + " (hora de Washington)";
      $("btnYes").textContent = "✓ Asistió — " + fmtTime(rec.time);
    } else {
      box.className = "ck-status ck-no";
      box.textContent = "Marcado como «No asistió» — " + fmtTime(rec.time);
      $("btnYes").textContent = "✓ Marcar asistencia";
    }
  }

  function renderList() {
    var store = loadStore();
    var ids = Object.keys(store).sort(function (a, b) {
      return (store[a].time || "") < (store[b].time || "") ? -1 : 1;
    });
    var body = $("listBody");
    body.innerHTML = "";
    $("listEmpty").hidden = ids.length > 0;
    ids.forEach(function (id) {
      var r = store[id];
      var tr = document.createElement("tr");
      var td1 = document.createElement("td"); td1.textContent = r.name;
      var td2 = document.createElement("td");
      td2.textContent = r.status === "si" ? "Sí" : "No";
      var td3 = document.createElement("td");
      td3.textContent = r.status === "si" ? fmtDateTime(r.time) : "—";
      tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
      body.appendChild(tr);
    });
  }

  function downloadCsv() {
    var store = loadStore();
    var ids = Object.keys(store).sort(function (a, b) {
      return (store[a].time || "") < (store[b].time || "") ? -1 : 1;
    });
    var lines = ["Nombre,Asistencia,ID,Hora de llegada (Washington)"];
    ids.forEach(function (id) {
      var r = store[id];
      var q = function (s) { return '"' + String(s || "").replace(/"/g, '""') + '"'; };
      lines.push([q(r.name), q(r.status === "si" ? "Sí" : "No"), q(id),
                  q(r.status === "si" ? fmtDateTime(r.time) : "")].join(","));
    });
    var blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "asistencia-protegiendo-las-americas.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function sendPing(gid, guest, status, iso) {
    // Ping silencioso para el registro central por correo. Si falla la red,
    // el marcado local ya quedó guardado; no se bloquea al personal.
    return fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: "Asistencia — Protegiendo las Américas",
        id: gid,
        nombre: guest.name,
        asistencia: status === "si" ? "Sí asistió" : "No asistió",
        hora: iso
      })
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function mark(gid, guest, status) {
    var store = loadStore();
    var prev = store[gid];
    if (prev && prev.status === status) {
      if (!window.confirm("Este invitado ya está marcado como «" +
          (status === "si" ? "Sí asistió" : "No asistió") +
          "». ¿Marcar de nuevo y actualizar la hora?")) return;
    }
    var iso = new Date().toISOString();
    var btn = status === "si" ? $("btnYes") : $("btnNo");
    btn.disabled = true;
    var note = $("markNote");
    note.textContent = "Registrando…";
    sendPing(gid, guest, status, iso).then(function (ok) {
      store[gid] = { name: guest.name, status: status, time: iso };
      saveStore(store);
      renderStatus(gid);
      updateCounter();
      renderList();
      note.textContent = ok
        ? "Registrado a las " + fmtTime(iso) + " (hora de Washington). Quedó guardado en este dispositivo y enviado por correo al registro central."
        : "Registrado a las " + fmtTime(iso) + " en este dispositivo. El correo al registro central no se pudo enviar (sin conexión); la marca local sí quedó guardada.";
    }).finally(function () { btn.disabled = false; });
  }

  function showGuest(gid) {
    var guest = GUESTS[gid];
    $("gateCard").hidden = true;
    if (!guest) {
      $("unknownId").textContent = gid || "(sin ID en la dirección)";
      $("unknownCard").hidden = false;
      return;
    }
    $("guestName").textContent = guest.name;
    $("guestTitle").textContent = guest.title;
    $("guestOrg").textContent = guest.org;
    $("guestId").textContent = gid;
    if (guest.photo) {
      $("guestPhoto").src = guest.photo;
      $("guestPhoto").hidden = false;
      $("guestInitials").hidden = true;
    } else {
      $("guestPhoto").hidden = true;
      $("guestInitials").hidden = false;
      $("guestInitials").textContent = initials(guest.name);
    }
    $("guestCard").hidden = false;
    renderStatus(gid);
    $("btnYes").onclick = function () { mark(gid, guest, "si"); };
    $("btnNo").onclick = function () { mark(gid, guest, "no"); };
  }

  function init() {
    updateCounter();
    renderList();
    var gid = getGuestId();
    if (sessionStorage.getItem(SESSION_KEY) === "ok") {
      showGuest(gid);
    } else {
      $("gateForm").addEventListener("submit", function (ev) {
        ev.preventDefault();
        if ($("tokenInput").value.trim() === STAFF_TOKEN) {
          sessionStorage.setItem(SESSION_KEY, "ok");
          $("gateError").hidden = true;
          showGuest(gid);
        } else {
          $("gateError").hidden = false;
          $("tokenInput").select();
        }
      });
    }
    $("btnList").addEventListener("click", function () {
      var box = $("listBox");
      box.hidden = !box.hidden;
      if (!box.hidden) renderList();
      $("btnList").textContent = box.hidden
        ? "Ver lista de asistencia" : "Ocultar lista de asistencia";
    });
    $("btnCsv").addEventListener("click", downloadCsv);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
