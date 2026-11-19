/* Check-in «Protegiendo las Américas» — herramienta del personal.
 *
 * SEGURIDAD (léase antes de tocar este archivo): la verificación del token
 * es SOLO en el cliente. El token en texto claro NO está en este archivo:
 * solo se guarda su hash SHA-256, y el token lo conoce Juan Pablo, que lo
 * comparte solo con personas de su confianza. Es una barrera práctica
 * contra el auto-marcado (el invitado que escanea su QR no conoce el token
 * y el QR no lo contiene), NO seguridad bancaria. No ponga aquí nada más
 * sensible que ese hash.
 *
 * Flujo: QR -> checkin.html?g=<id> -> se ven solo el nombre, la fecha
 * y el lugar del evento y el acceso del personal -> con el token se muestra
 * el perfil, el contador, la lista de asistencia y la descarga ->
 * «Marcar asistencia» guarda check + hora en este
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
  // Hash SHA-256 del token de personal. El token en texto claro lo conoce
// Juan Pablo y lo comparte solo con personas de su confianza. NO aparece
// en el QR ni en la URL ni en este archivo.
var STAFF_TOKEN_HASH = "99992f32c48973f7c8d20273a0907da1c96249bfe8a8517a48d84fca7f1fee16";

  var STORE_KEY = "orgs_checkin_v1";
  var SESSION_KEY = "orgs_checkin_staff_v1";
  var FORMSUBMIT_URL = "https://formsubmit.co/ajax/juan.bogotag@gmail.com";

  // Invitados de la matriz definitiva del evento (60): 59 personas
  // nombradas de la base de Drive
  // «Base_de_datos_Evento_Protecting_the_Americas_Forum._V05.11.26_actualizada.xlsx»
  // + Juan Pablo González Bogotá (anfitrión, no está en la base).
  // 7 filas de la base quedan fuera por no tener persona asignada
  // (1 POR CONTACTAR + ODNI, CIA, CISA, DOE, USTDA, DFC).
  // photo: URL o data URI cuando exista; null = iniciales.
  var GUESTS = {
    "ev|gonzalez-bogota": {
      name: "Juan Pablo González Bogotá",
      title: "Pasante",
      org: "Embajada de Colombia en Washington",
      email: "jgonzalez@colombiaemb.org",
      photo: null
    },
    "ev|o-brien-daniel": {
      name: "Daniel O'Brien",
      title: "Acting Assistant US Trade Representative for the Western Hemisphere",
      org: "Office of the US Trade Representative (USTR)",
      email: "daniel.c.obrien@ustr.eop.gov",
      photo: null
    },
    "ev|silva-raquel": {
      name: "Raquel Silva",
      title: "Director for Colombia & Chile",
      org: "Office of the US Trade Representative (USTR)",
      email: "Raquel.R.Silva@ustr.eop.gov",
      photo: null
    },
    "ev|peterson-julia": {
      name: "Julia Peterson",
      title: "Supervisory International Trade Specialist",
      org: "US Customs and Border Protection (USCBP)",
      email: "JULIA.PETERSON@cbp.dhs.gov",
      photo: null
    },
    "ev|madigan-keith": {
      name: "Keith Madigan",
      title: "International Trade Analyst",
      org: "US Customs and Border Protection (USCBP)",
      email: "keith.madigan@cbp.dhs.gov",
      photo: null
    },
    "ev|klepek-james": {
      name: "James Klepek",
      title: "Lead Trade Policy Officer for Colombia",
      org: "US Department of Agriculture (USDA)",
      email: "james.klepek@usda.gov",
      photo: null
    },
    "ev|hubler-tyler": {
      name: "Tyler Hubler",
      title: "Lead Trade Policy Officer for the Western Hemisphere Division",
      org: "US Department of Agriculture (USDA)",
      email: "Tyler.Hubler@usda.gov",
      photo: null
    },
    "ev|hieskill-sarah": {
      name: "Sarah Hieskill",
      title: "Trade Director, Andean Region",
      org: "US Department of Agriculture (USDA)",
      email: "sarah.r.hieskill@usda.gov",
      photo: null
    },
    "ev|godley-michael": {
      name: "Michael Godley",
      title: "Desk Officer for Colombia and Ecuador",
      org: "US Department of Commerce (DOC)",
      email: "Michael.Godley@trade.gov",
      photo: null
    },
    "ev|stetson-richard": {
      name: "Richard Stetson",
      title: "International Trade Specialist",
      org: "US Department of Commerce (DOC)",
      email: "richard.stetson@trade.gov",
      photo: null
    },
    "ev|arboleda-nelson": {
      name: "Nelson Arboleda",
      title: "Director of the Office of the Americas",
      org: "US Department of Health and Human Services",
      email: "nelson.arboleda@hhs.gov",
      photo: null
    },
    "ev|klein-mackenzie": {
      name: "Mackenzie Klein",
      title: "Public Health Program Specialist",
      org: "US Department of Health and Human Services",
      email: "Mackenzie.Klein@hhs.gov",
      photo: null
    },
    "ev|dewindt-katrin": {
      name: "Katrin DeWindt",
      title: "Academic Exchange Specialist",
      org: "US Department of State (DOS)",
      email: "DeWindtKA@state.gov",
      photo: null
    },
    "ev|mickelson-daniel": {
      name: "Daniel Mickelson",
      title: "Chief of Sports Diplomacy",
      org: "US Department of State (DOS)",
      email: "mickelsonde@state.gov",
      photo: null
    },
    "ev|abraham-july": {
      name: "July Abraham",
      title: "Executive Director",
      org: "US Department of Transportation",
      email: "Julie.Abraham@dot.gov",
      photo: null
    },
    "ev|madell-mary-lisa": {
      name: "Mary Lisa Madell",
      title: "Deputy Director",
      org: "US Department of Transportation",
      email: "MaryLisa.Madell@dot.gov",
      photo: null
    },
    "ev|frazier-bearden-lori": {
      name: "Lori Frazier Bearden",
      title: "Deputy Undersecretary",
      org: "US Department of Labor",
      email: "Contact-ILAB@dol.gov",
      photo: null
    },
    "ev|laco-marek": {
      name: "Marek Laco",
      title: "Acting Assistant Secretary",
      org: "US Department of Labor",
      email: "ETAPagemaster@dol.gov",
      photo: null
    },
    "ev|cummings-tim": {
      name: "Tim Cummings",
      title: "Acting Assistant Secretary / Deputy Assistant Secretary",
      org: "US Department of Labor",
      email: "OCIACongressionalNotification@dol.gov",
      photo: null
    },
    "ev|keeling-david-l": {
      name: "David L. Keeling",
      title: "Assistant Secretary of Labor for Occupational Safety and Health",
      org: "US Department of Labor",
      email: "info@osha.gov",
      photo: null
    },
    "ev|demarzo-benjamin": {
      name: "Benjamin DeMarzo",
      title: "Assistant Secretary for Congressional and Intergovernmental Relations",
      org: "US Department of Housing and Urban Development (HUD)",
      email: "",
      photo: null
    },
    "ev|kurtz-ronald": {
      name: "Ronald Kurtz",
      title: "Assistant Secretary for Community Planning and Development",
      org: "US Department of Housing and Urban Development (HUD)",
      email: "",
      photo: null
    },
    "ev|fernandez-claudette": {
      name: "Claudette Fernandez",
      title: "General Deputy Assistant Secretary for Community Planning and Development",
      org: "US Department of Housing and Urban Development (HUD)",
      email: "",
      photo: null
    },
    "ev|richardson-todd": {
      name: "Todd Richardson",
      title: "General Deputy Assistant Secretary for Policy Development and Research",
      org: "US Department of Housing and Urban Development (HUD)",
      email: "",
      photo: null
    },
    "ev|ormsby-jesse": {
      name: "Jesse Ormsby",
      title: "Associate Director for South America",
      org: "US Department of Justice",
      email: "Jesse.Ormsby@usdoj.gov",
      photo: null
    },
    "ev|barbulescu-sandra": {
      name: "Sandra Barbulescu",
      title: "Trial Attorney",
      org: "US Department of Justice",
      email: "Ruxandra.Barbulescu@usdoj.gov",
      photo: null
    },
    "ev|kocheulov-vladimir": {
      name: "Vladimir Kocheulov",
      title: "Trial Attorney",
      org: "US Department of Justice",
      email: "Vladimir.Kocheulov@usdoj.gov",
      photo: null
    },
    "ev|york-aaron": {
      name: "Aaron York",
      title: "Trial Attorney",
      org: "US Department of Justice",
      email: "Aaron.E.York@usdoj.gov",
      photo: null
    },
    "ev|lee-courtney": {
      name: "Courtney Lee",
      title: "Trial Attorney",
      org: "US Department of Justice",
      email: "Courtney.Lee2@usdoj.gov",
      photo: null
    },
    "ev|hui-dennis": {
      name: "Dennis Hui",
      title: "Trial Attorney",
      org: "US Department of Justice",
      email: "Dennis.Hui2@usdoj.gov",
      photo: null
    },
    "ev|beasley-john": {
      name: "John Beasley",
      title: "Senior Trial Attorney",
      org: "US Department of Justice",
      email: "John.A.Beasley@usdoj.gov",
      photo: null
    },
    "ev|bodner-amy": {
      name: "Amy Bodner",
      title: "International Affairs Specialist",
      org: "US Department of Justice",
      email: "Amy.Bodner@usdoj.gov",
      photo: null
    },
    "ev|fuse-marisa": {
      name: "Marisa Fuse",
      title: "International Affairs Specialist",
      org: "US Department of Justice",
      email: "Marisa.Fuse@usdoj.gov",
      photo: null
    },
    "ev|thomas-estelle": {
      name: "Estelle Thomas",
      title: "International Affairs Specialist",
      org: "US Department of Justice",
      email: "Clotilde.Alexandra-Estelle.Thomas@usdoj.gov",
      photo: null
    },
    "ev|zegar-allison": {
      name: "Allison Zegar",
      title: "International Affairs Specialist",
      org: "US Department of Justice",
      email: "Allison.Zegar@usdoj.gov",
      photo: null
    },
    "ev|hollinshead-samantha": {
      name: "Samantha Hollinshead",
      title: "International Affairs Specialist",
      org: "US Department of Justice",
      email: "Samantha.Hollinshead@usdoj.gov",
      photo: null
    },
    "ev|burgos-isabella": {
      name: "Isabella Burgos",
      title: "Student Intern",
      org: "US Department of Justice",
      email: "Isabella.Burgos@usdoj.gov",
      photo: null
    },
    "ev|stackhouse-timothy": {
      name: "Timothy Stackhouse",
      title: "Extradition Specialist",
      org: "US Department of State (DOS)",
      email: "StackhouseT@state.gov",
      photo: null
    },
    "ev|boone-chase-logan": {
      name: "Chase Logan Boone",
      title: "Colombia Country Director",
      org: "Department of War",
      email: "chase.l.boone.civ@mail.mil",
      photo: null
    },
    "ev|kit-ellen": {
      name: "Ellen Kit",
      title: "Western Hemisphere /Colombia",
      org: "Department of War",
      email: "ellen.e.kitt.civ@mail.mil",
      photo: null
    },
    "ev|besosa-miguel": {
      name: "Miguel Besosa",
      title: "Western Hemisphere /Colombia",
      org: "Department of War",
      email: "miguel.a.besosa.ctr@mail.mil",
      photo: null
    },
    "ev|bello-mauricio": {
      name: "Mauricio Bello",
      title: "Western Hemisphere /Colombia",
      org: "Department of War",
      email: "mauricio.bello@dodiis.mil",
      photo: null
    },
    "ev|wilson-joshua-b": {
      name: "Joshua B. Wilson",
      title: "Director",
      org: "Department of War",
      email: "joshua.b.wilson.mil@us.navy.mil",
      photo: null
    },
    "ev|spalding-luc-p": {
      name: "Luc P. Spalding.",
      title: "Attaché Liaison Officer for the Western Hemispher",
      org: "Department of War",
      email: "luc.p.spalding.mil@us.navy.mil",
      photo: null
    },
    "ev|grady-dana-w": {
      name: "Dana W Grady",
      title: "Regional Advisor for Latin America",
      org: "Department of Homeland Security (DHS)",
      email: "Dana.W.Grady@uscg.mil",
      photo: null
    },
    "ev|norkiewicz-collin": {
      name: "Collin Norkiewicz",
      title: "Country Director",
      org: "Air Force",
      email: "Collin.norkiewicz@us.af.mil",
      photo: null
    },
    "ev|jacquez-alissa-m": {
      name: "Alissa M. Jacquez",
      title: "Foreign Military Support Specialist",
      org: "Army",
      email: "Alissa.m.jacquez.civ@army.mil",
      photo: null
    },
    "ev|ortiz-michael": {
      name: "Michael Ortiz",
      title: "Deputy Director for Colombia",
      org: "Department of Justice - DEA",
      email: "michael.c.ortiz@dea.gov",
      photo: null
    },
    "ev|cannavo-nicole": {
      name: "Nicole Cannavo",
      title: "Colombian Liaison",
      org: "Federal Bureau of Investigation (FBI)",
      email: "nmcannavo@fbi.gov",
      photo: null
    },
    "ev|roncone-nita-l": {
      name: "Nita L Roncone",
      title: "Senior Policy Advisor",
      org: "Office of National Drug Control Policy (ONDCP)",
      email: "Nita_V_Lalla@ondcp.eop.gov",
      photo: null
    },
    "ev|kroger-kaleb": {
      name: "Kaleb Kroger",
      title: "Colombia Team Lead",
      org: "Department of State",
      email: "KrogerKB@state.gov",
      photo: null
    },
    "ev|de-jesus-blasini-patricia": {
      name: "Patricia De Jesus Blasini",
      title: "Colombia Team",
      org: "Department of State",
      email: "DeJesusP@state.gov",
      photo: null
    },
    "ev|fishman-kyle": {
      name: "Kyle Fishman",
      title: "Colombia Team",
      org: "Department of State",
      email: "FishmanKA@state.gov",
      photo: null
    },
    "ev|carrera-madalen": {
      name: "Madalen Carrera",
      title: "Colombia Program Officer",
      org: "Department of State",
      email: "CarreraM2@state.gov",
      photo: null
    },
    "ev|varela-juan": {
      name: "Juan Varela",
      title: "",
      org: "",
      email: "",
      photo: null
    },
    "ev|meade-kathia-l": {
      name: "Kathia L. Meade",
      title: "Unit Chief",
      org: "Federal Bureau of Investigation (FBI)",
      email: "klmeade@fbi.gov",
      photo: null
    },
    "ev|velasco-simon": {
      name: "Simon Velasco",
      title: "Program Analyst",
      org: "Department of Homeland Security (DHS)",
      email: "simon.velasco@hq.dhs.gov",
      photo: null
    },
    "ev|polga-hecimovich-john": {
      name: "John Polga-Hecimovich",
      title: "Assistant Professor",
      org: "U.S. Naval Academy",
      email: "polgahec@usna.edu",
      photo: null
    },
    "ev|arnold-jessica": {
      name: "Jessica Arnold",
      title: "Foreign Affairs Officer",
      org: "Department of State",
      email: "ArnoldJM@state.gov",
      photo: null
    },
    "ev|underwood-james": {
      name: "James Underwood",
      title: "Supervisory Special Agent",
      org: "Federal Bureau of Investigation (FBI)",
      email: "jtunderwood@fbi.gov",
      photo: null
    },
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
    // Solo después del token: contador, lista de asistencia y descarga.
    // Antes del token solo se ven el nombre, la fecha y el lugar del evento
    // y el acceso del personal; esa información es solo del personal.
    $("staffCard").hidden = false;
    updateCounter();
    renderList();
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

  function tokenOk(val) {
    try {
      if (!window.crypto || !crypto.subtle || !window.TextEncoder) return Promise.resolve(false);
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(val)).then(function (buf) {
        var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ("0" + b.toString(16)).slice(-2);
        }).join("");
        return hex === STAFF_TOKEN_HASH;
      }).catch(function () { return false; });
    } catch (e) { return Promise.resolve(false); }
  }

  function init() {
    var gid = getGuestId();
    if (sessionStorage.getItem(SESSION_KEY) === "ok") {
      showGuest(gid);
    } else {
      $("gateForm").addEventListener("submit", function (ev) {
        ev.preventDefault();
        tokenOk($("tokenInput").value.trim()).then(function (ok) {
          if (ok) {
            sessionStorage.setItem(SESSION_KEY, "ok");
            $("gateError").hidden = true;
            showGuest(gid);
          } else {
            $("gateError").hidden = false;
            $("tokenInput").select();
          }
        });
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
