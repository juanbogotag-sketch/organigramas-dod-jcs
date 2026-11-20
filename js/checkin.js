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

  // Puerta de 5 días (regla general de los checklists): el registro de
  // asistencia se habilita 5 días antes del evento. Antes de esa fecha el
  // personal puede ver el perfil del invitado con el token, pero no marcar.
  // Para un evento futuro, cambiar solo EVENTO_FECHA.
  var EVENTO_FECHA = "2026-12-09";
  // PRUEBA 2026-11-20: 20 días para poder probar el check-in antes del evento.
  // Después de la prueba, volver a 5 (la puerta general abre el 4 de diciembre).
  var PUERTA_DIAS = 20;
  var FB_CONFIG = {
    apiKey: "AIzaSyD9fVRwR4VbNWxz_uRYFV00DsOt0K6m-Cc",
    authDomain: "asistencia-eventos-cc286.firebaseapp.com",
    databaseURL: "https://asistencia-eventos-cc286-default-rtdb.firebaseio.com",
    projectId: "asistencia-eventos-cc286",
    storageBucket: "asistencia-eventos-cc286.firebasestorage.app",
    messagingSenderId: "1078332084015",
    appId: "1:1078332084015:web:9297f883eb4ed7a767dbda"
  };
  var LISTA_URL = "asistencia/hipopotamo/protegiendo-americas/lista";
  // Lista viva de confirmados del gestor (solo lectura) y su estado de carga.
  // La insignia del invitado dice si está confirmado en la gestión.
  var liveLista = {};
  var liveListaLoaded = false;
  var currentGid = "";
  function renderLiveBadge(gid) {
    var badge = $("liveBadge");
    if (!badge) return;
    if (!liveListaLoaded) { badge.hidden = true; return; }
    var sids = GUESTS_LIVE_IDS[gid] || [];
    var conf = sids.some(function (id) { return !!liveLista[id]; });
    badge.hidden = false;
    badge.textContent = conf
      ? "✓ Confirmado en la gestión de invitados"
      : "Sin confirmar en la gestión de invitados";
  }
  function puertaAbierta() {
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var abre = new Date(EVENTO_FECHA + "T00:00:00-05:00");
    abre.setDate(abre.getDate() - PUERTA_DIAS);
    abre.setHours(0, 0, 0, 0);
    return hoy.getTime() >= abre.getTime();
  }
  function fechaPuerta() {
    var abre = new Date(EVENTO_FECHA + "T00:00:00-05:00");
    abre.setDate(abre.getDate() - PUERTA_DIAS);
    try {
      return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/New_York",
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }).format(abre);
    } catch (e) { return abre.toLocaleDateString(); }
  }

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

// Invitados del gestor «Protegiendo las Américas» (121 filas) que NO estaban
// en la matriz definitiva de 60: se añaden aquí con el MISMO esquema de id
// (ev|apellido-nombre) que usan los QR, para que el check-in los resuelva.
// Generado automáticamente desde js/datos_protegiendo.js — regenerar si cambia el gestor.
// NO renombrar ningún ev| existente: rompería los QR ya generados.
var GUESTS_LIVE = {
    "ev|peterson-julia": {
      "name": "Ms. Julia Peterson",
      "title": "Supervisory International Trade Specialist",
      "org": "US Customs and Border Protection (USCBP)",
      "email": "JULIA.PETERSON@cbp.dhs.gov",
      "photo": null
    },
    "ev|madigan-keith": {
      "name": "Mr. Keith Madigan",
      "title": "International Trade Analyst",
      "org": "US Customs and Border Protection (USCBP)",
      "email": "keith.madigan@cbp.dhs.gov",
      "photo": null
    },
    "ev|ormsby-jesse": {
      "name": "Mr. Jesse Ormsby",
      "title": "Associate Director for South America",
      "org": "US Department of Justice",
      "email": "Jesse.Ormsby@usdoj.gov",
      "photo": null
    },
    "ev|barbulescu-sandra": {
      "name": "Ms. Sandra Barbulescu",
      "title": "Trial Attorney",
      "org": "US Department of Justice",
      "email": "Ruxandra.Barbulescu@usdoj.gov",
      "photo": null
    },
    "ev|kocheulov-vladimir": {
      "name": "Mr. Vladimir Kocheulov",
      "title": "Trial Attorney",
      "org": "US Department of Justice",
      "email": "Vladimir.Kocheulov@usdoj.gov",
      "photo": null
    },
    "ev|york-aaron": {
      "name": "Mr. Aaron York",
      "title": "Trial Attorney",
      "org": "US Department of Justice",
      "email": "Aaron.E.York@usdoj.gov",
      "photo": null
    },
    "ev|lee-courtney": {
      "name": "Ms. Courtney Lee",
      "title": "Trial Attorney",
      "org": "US Department of Justice",
      "email": "Courtney.Lee2@usdoj.gov",
      "photo": null
    },
    "ev|hui-dennis": {
      "name": "Mr. Dennis Hui",
      "title": "Trial Attorney",
      "org": "US Department of Justice",
      "email": "Dennis.Hui2@usdoj.gov",
      "photo": null
    },
    "ev|beasley-john": {
      "name": "Mr. John Beasley",
      "title": "Senior Trial Attorney",
      "org": "US Department of Justice",
      "email": "John.A.Beasley@usdoj.gov",
      "photo": null
    },
    "ev|bodner-amy": {
      "name": "Ms. Amy Bodner",
      "title": "International Affairs Specialist",
      "org": "US Department of Justice",
      "email": "Amy.Bodner@usdoj.gov",
      "photo": null
    },
    "ev|fuse-marisa": {
      "name": "Ms. Marisa Fuse",
      "title": "International Affairs Specialist",
      "org": "US Department of Justice",
      "email": "Marisa.Fuse@usdoj.gov",
      "photo": null
    },
    "ev|thomas-estelle": {
      "name": "Ms. Estelle Thomas",
      "title": "International Affairs Specialist",
      "org": "US Department of Justice",
      "email": "Clotilde.Alexandra-Estelle.Thomas@usdoj.gov",
      "photo": null
    },
    "ev|zegar-allison": {
      "name": "Ms. Allison Zegar",
      "title": "International Affairs Specialist",
      "org": "US Department of Justice",
      "email": "Allison.Zegar@usdoj.gov",
      "photo": null
    },
    "ev|hollinshead-samantha": {
      "name": "Ms. Samantha Hollinshead",
      "title": "International Affairs Specialist",
      "org": "US Department of Justice",
      "email": "Samantha.Hollinshead@usdoj.gov",
      "photo": null
    },
    "ev|burgos-isabella": {
      "name": "Ms. Isabella Burgos",
      "title": "Student Intern",
      "org": "US Department of Justice",
      "email": "Isabella.Burgos@usdoj.gov",
      "photo": null
    },
    "ev|stackhouse-timothy": {
      "name": "Mr. Timothy Stackhouse",
      "title": "Extradition Specialist",
      "org": "US Department of State (DOS)",
      "email": "StackhouseT@state.gov",
      "photo": null
    },
    "ev|boone-chase-logan": {
      "name": "Mr Chase Logan Boone",
      "title": "Colombia Country Director",
      "org": "Department of  War",
      "email": "chase.l.boone.civ@mail.mil",
      "photo": null
    },
    "ev|kit-ellen": {
      "name": "Ms Ellen Kit",
      "title": "Western Hemisphere /Colombia",
      "org": "Department of  War",
      "email": "ellen.e.kitt.civ@mail.mil",
      "photo": null
    },
    "ev|besosa-miguel": {
      "name": "Mr Miguel Besosa",
      "title": "Western Hemisphere /Colombia",
      "org": "Department of  War",
      "email": "miguel.a.besosa.ctr@mail.mil",
      "photo": null
    },
    "ev|bello-mauricio": {
      "name": "Mr Mauricio Bello",
      "title": "Western Hemisphere /Colombia",
      "org": "Department of  War",
      "email": "mauricio.bello@dodiis.mil",
      "photo": null
    },
    "ev|wilson-joshua-b": {
      "name": "Captain Joshua B. Wilson",
      "title": "Director",
      "org": "Department of  War",
      "email": "joshua.b.wilson.mil@us.navy.mil",
      "photo": null
    },
    "ev|spalding-luc-p": {
      "name": "Lieutenant Luc P. Spalding.",
      "title": "Attaché Liaison Officer for the Western Hemispher",
      "org": "Department of  War",
      "email": "luc.p.spalding.mil@us.navy.mil",
      "photo": null
    },
    "ev|grady-dana-w": {
      "name": "Lieutenant Commander Dana W Grady",
      "title": "Regional Advisor for Latin America",
      "org": "Department of Homeland Security (DHS)",
      "email": "Dana.W.Grady@uscg.mil",
      "photo": null
    },
    "ev|norkiewicz-collin": {
      "name": "Mr Collin Norkiewicz",
      "title": "Country Director",
      "org": "Air Force",
      "email": "Collin.norkiewicz@us.af.mil",
      "photo": null
    },
    "ev|jacquez-alissa-m": {
      "name": "Ms Alissa M. Jacquez",
      "title": "Foreign Military Support Specialist",
      "org": "Army",
      "email": "Alissa.m.jacquez.civ@army.mil",
      "photo": null
    },
    "ev|ortiz-michael": {
      "name": "Mr. Michael Ortiz",
      "title": "Deputy Director for Colombia",
      "org": "Department of Justice - DEA",
      "email": "michael.c.ortiz@dea.gov",
      "photo": null
    },
    "ev|cannavo-nicole": {
      "name": "MS Nicole Cannavo",
      "title": "Colombian Liaison",
      "org": "Federal Bureau of Investigation (FBI)",
      "email": "nmcannavo@fbi.gov",
      "photo": null
    },
    "ev|roncone-nita-l": {
      "name": "Ms Nita L Roncone",
      "title": "Senior Policy Advisor",
      "org": "Office of National Drug Control Policy (ONDCP)",
      "email": "Nita_V_Lalla@ondcp.eop.gov",
      "photo": null
    },
    "ev|kroger-kaleb": {
      "name": "Mr. Kaleb Kroger",
      "title": "Colombia Team Lead",
      "org": "Department of State",
      "email": "KrogerKB@state.gov",
      "photo": null
    },
    "ev|de-jesus-blasini-patricia": {
      "name": "Ms. Patricia De Jesus Blasini",
      "title": "Colombia Team",
      "org": "Department of State",
      "email": "DeJesusP@state.gov",
      "photo": null
    },
    "ev|fishman-kyle": {
      "name": "Mr. Kyle Fishman",
      "title": "Colombia Team",
      "org": "Department of State",
      "email": "FishmanKA@state.gov",
      "photo": null
    },
    "ev|carrera-madalen": {
      "name": "Ms. Madalen Carrera",
      "title": "Colombia Program Officer",
      "org": "Department of State",
      "email": "CarreraM2@state.gov",
      "photo": null
    },
    "ev|hooker-allison": {
      "name": "Ms. Allison Hooker",
      "title": "Under Secretary for Political Affairs",
      "org": "US Department of State",
      "email": "Pendiente",
      "photo": null
    },
    "ev|logerfo-gregory-d": {
      "name": "Amb. Gregory D. LoGerfo",
      "title": "Coordinator for Counterterrorism and Ambassador-at-Large",
      "org": "US Department of State",
      "email": "Pendiente",
      "photo": null
    },
    "ev|fleming-mark": {
      "name": "Mr. Mark Fleming",
      "title": "Acting Deputy Coordinator",
      "org": "US Department of State",
      "email": "Pendiente",
      "photo": null
    },
    "ev|ager-jacobsen-monica": {
      "name": "Ms. Monica Ager Jacobsen",
      "title": "Acting Principal Deputy Coordinator and Deputy Coordinator for Homeland Security, Screening, and Terrorist Designations",
      "org": "US Department of State",
      "email": "Pendiente",
      "photo": null
    },
    "ev|borkert-joel": {
      "name": "Mr. Joel Borkert",
      "title": "Deputy Coordinator for Programs and Military Coordination",
      "org": "US Department of State",
      "email": "Pendiente",
      "photo": null
    },
    "ev|white-fleet": {
      "name": "Mr. Fleet White",
      "title": "Assistant Secretary for Political-Military Affairs",
      "org": "US Department of State",
      "email": "PM-CPA@state.gov · T_Outreach_PM@State.gov",
      "photo": null
    },
    "ev|schiller-rachel": {
      "name": "Dr. Rachel Schiller",
      "title": "Deputy Assistant Secretary for Programs and Operations",
      "org": "US Department of State",
      "email": "PM-CPA@state.gov · T_Outreach_PM@State.gov",
      "photo": null
    },
    "ev|vaccaro-michael-j": {
      "name": "Mr. Michael J. Vaccaro",
      "title": "Acting Principal Deputy Assistant Secretary for Political-Military Affairs and Deputy Assistant Secretary for Defense Trade Controls",
      "org": "US Department of State",
      "email": "PM-CPA@state.gov · DDTCResponseTeam@state.gov",
      "photo": null
    },
    "ev|green-r-william": {
      "name": "Mr. R. William Green",
      "title": "Deputy Assistant Secretary for Regional Security",
      "org": "US Department of State",
      "email": "PM-CPA@state.gov · T_Outreach_PM@State.gov",
      "photo": null
    },
    "ev|dinanno-thomas": {
      "name": "Mr. Thomas DiNanno",
      "title": "Under Secretary for Arms Control and International Security",
      "org": "US Department of State",
      "email": "DiNannoT@state.gov",
      "photo": null
    },
    "ev|auger-vanessa": {
      "name": "Ms. Vanessa Auger",
      "title": "OMS Staff Assistant",
      "org": "US Department of State",
      "email": "AugerVE@state.gov",
      "photo": null
    },
    "ev|polga-hecimovich-john": {
      "name": "Mr. John Polga-Hecimovich",
      "title": "Assistant Professor",
      "org": "U.S. Naval Academy",
      "email": "polgahec@usna.edu",
      "photo": null
    },
    "ev|arnold-jessica": {
      "name": "Ms. Jessica Arnold",
      "title": "Foreign Affairs Officer",
      "org": "Department of State",
      "email": "ArnoldJM@state.gov",
      "photo": null
    },
    "ev|meade-kathia-l": {
      "name": "Ms. Kathia L. Meade",
      "title": "Unit Chief, Americas Unit",
      "org": "Federal Bureau of Investigation (FBI)",
      "email": "klmeade@fbi.gov",
      "photo": null
    },
    "ev|underwood-james": {
      "name": "Mr. James Underwood",
      "title": "Supervisory Special Agent",
      "org": "Federal Bureau of Investigation (FBI)",
      "email": "jtunderwood@fbi.gov",
      "photo": null
    },
    "ev|velasco-simon": {
      "name": "Mr. Simon Velasco",
      "title": "Program Analyst",
      "org": "Department of Homeland Security (DHS)",
      "email": "simon.velasco@hq.dhs.gov",
      "photo": null
    },
    "ev|liang-christine-jingqi": {
      "name": "Christine (Jingqi) Liang",
      "title": "Special Assistant",
      "org": "U.S. Air Force",
      "email": "Jingqi.Liang.Civ@mail.smil.mil",
      "photo": null
    },
    "ev|brantley-courtney-p": {
      "name": "Courtney P. Brantley",
      "title": "Regional Affairs Specialist (Andes)",
      "org": "U.S. Department of Homeland Security",
      "email": "courtney.brantley@hq.dhs.gov",
      "photo": null
    },
    "ev|liberatori-alejandro": {
      "name": "Major General Alejandro Liberatori",
      "title": "Defense Attaché",
      "org": "Embassy of Argentina",
      "email": "argattache@amilusa.com;ararmy.assistante@gmail.com",
      "photo": null
    },
    "ev|cassinelli-gorigoitia-gianfranco": {
      "name": "Major General Gianfranco Cassinelli Gorigoitía",
      "title": "Defense Attaché",
      "org": "Embassy of Chile",
      "email": "agremil@mmchusa.org; paula@mmchusa.org",
      "photo": null
    },
    "ev|cardozo-santamaria-luis-emilio": {
      "name": "General Luis Emilio Cardozo Santamaria",
      "title": "Defense Attaché",
      "org": "Embassy of Colombia",
      "email": "oattache@colombiaemb.org; luicard@gmail.com",
      "photo": null
    },
    "ev|castillo-correa-efren": {
      "name": "Colonel Efrén Castillo Correa",
      "title": "Defense Attaché",
      "org": "Embassy of Ecuador",
      "email": "agremilusa@yahoo.com; epcastilloc@ejercito.mil.ec",
      "photo": null
    },
    "ev|skeete-julius": {
      "name": "Colonel Julius Skeete",
      "title": "Defense Attaché",
      "org": "Embassy of Guyana",
      "email": "jskeete@minfor.gov.gy",
      "photo": null
    },
    "ev|ifran-diaz-cesar": {
      "name": "Major General Cesar Ifrán Diaz",
      "title": "Defense Attaché",
      "org": "Embassy of Uruguay",
      "email": "misionmilitaruy@gmail.com",
      "photo": null
    },
    "ev|chini-osvaldo": {
      "name": "Rear Admiral Osvaldo Chiñi",
      "title": "Naval Attaché",
      "org": "Embassy of Argentina",
      "email": "osva_chini@hotmail.com",
      "photo": null
    },
    "ev|camillo-de-barros-neyder": {
      "name": "Rear Admiral Neyder Camillo de Barros",
      "title": "Naval Attaché",
      "org": "Embassy of Brazil",
      "email": "adneuc@gmail.com",
      "photo": null
    },
    "ev|acevedo-patricio": {
      "name": "Captain Patricio Acevedo",
      "title": "Naval Attaché",
      "org": "Embassy of Chile",
      "email": "jefe@chilenavy.us",
      "photo": null
    },
    "ev|frias-duarte-franklin": {
      "name": "Rear Admiral Franklin Frías Duarte",
      "title": "Defense Attaché",
      "org": "Embassy of the Dominican Republic",
      "email": "friasduartefranklinodalis@gmail.com",
      "photo": null
    },
    "ev|rueda-fabricio": {
      "name": "Captain Fabricio Rueda",
      "title": "Naval Attaché",
      "org": "Embassy of Ecuador",
      "email": "fabriciorueda@armada.mil.ec",
      "photo": null
    },
    "ev|gavarrete-franklin-bladimir": {
      "name": "Colonel Franklin Bladimir Gavarrete",
      "title": "Defense Attaché",
      "org": "Embassy of El Salvador",
      "email": "agredef.esa025@gmail.com",
      "photo": null
    },
    "ev|chichilla-archila-edy-santiago": {
      "name": "Vice Admiral Edy Santiago Chichilla Archila",
      "title": "Defense Attaché",
      "org": "Embassy of Guatemala",
      "email": "agremil.gt@gmail.com",
      "photo": null
    },
    "ev|guevara-mejia-jesus-maria": {
      "name": "Colonel Jesús María Guevara Mejía",
      "title": "Defense Attaché",
      "org": "Embassy of Honduras",
      "email": "def.honduras.dc@ffaa.mil.hn",
      "photo": null
    },
    "ev|ortiz-espinoza-nelson-augusto": {
      "name": "Brigadier General Nelson Augusto Ortiz Espinoza",
      "title": "Defense Attaché",
      "org": "Embassy of Paraguay",
      "email": "defensausa@mre.gov.py",
      "photo": null
    },
    "ev|oliva-angulo-oscar": {
      "name": "Rear Admiral Óscar Oliva Angulo",
      "title": "Defense Attaché",
      "org": "Embassy of Peru",
      "email": "oscar.oliva@marina.pe",
      "photo": null
    },
    "ev|bourne-jessen-kele-ann": {
      "name": "Commander Kele-Ann Bourne Jessen",
      "title": "Defense Attaché",
      "org": "Embassy of Trinidad & Tobago",
      "email": "jessenbak@foreign.gov.tt",
      "photo": null
    },
    "ev|ruiz-tocci-victor-francisco": {
      "name": "Captain Víctor Francisco Ruíz Tocci",
      "title": "Naval Attaché",
      "org": "Embassy of Uruguay",
      "email": "ruizvictor1974@gmail.com",
      "photo": null
    },
    "ev|looman-erik": {
      "name": "Captain Erik Looman",
      "title": "Naval Attaché",
      "org": "Embassy of the Netherlands",
      "email": "erikjan.looman@minbuza.nl",
      "photo": null
    },
    "ev|gonzalez-woolrich-cuauhtemoc": {
      "name": "Rear Admiral Cuauhtemoc González Woolrich",
      "title": "Naval Attaché",
      "org": "Embassy of Mexico",
      "email": "agrenavusa@semar.gob.mx",
      "photo": null
    },
    "ev|charpentier-christophe": {
      "name": "Captain Christophe Charpentier",
      "title": "Naval Attaché",
      "org": "Embassy of France",
      "email": "christophe.charpentier@diplomatie.gouv.fr",
      "photo": null
    },
    "ev|gore-timothy": {
      "name": "Captain Timothy Gore",
      "title": "Naval Attaché",
      "org": "Embassy of New Zealand",
      "email": "NavalAttacheUSA@nzdf.mil.nz",
      "photo": null
    },
    "ev|tremblay-luc": {
      "name": "Captain Luc Tremblay",
      "title": "Naval Attaché",
      "org": "Embassy of Canada",
      "email": "luc.Tremblay6@forces.gc.ca",
      "photo": null
    },
    "ev|mugica-carlos": {
      "name": "Captain Carlos Mugica",
      "title": "Naval Attaché",
      "org": "Embassy of Spain",
      "email": "cmugicaruiz@fn.mde.es",
      "photo": null
    },
    "ev|ledridge-matthew": {
      "name": "Captain Matthew Ledridge",
      "title": "Branch Head",
      "org": "United States Navy",
      "email": "matthew.j.ledridge.mil@us.navy.mil",
      "photo": null
    },
    "ev|griffin-lydia": {
      "name": "Lieutenant Lydia Griffin",
      "title": "Western Hemisphere and Europe Desk Officer",
      "org": "United States Navy",
      "email": "lydia.a.griffin.mil@us.navy.mil",
      "photo": null
    },
    "ev|gilbert-brian": {
      "name": "Lieutenant Colonel Brian Gilbert",
      "title": "Director",
      "org": "United States Marine Corps",
      "email": "FLO_HQMC@usmc.mil",
      "photo": null
    },
    "ev|croker-brian": {
      "name": "Mr. Brian Croker",
      "title": "Deputy",
      "org": "United States Marine Corps",
      "email": "brian.croker.civ@usmc.mil",
      "photo": null
    },
    "ev|chapman-brian": {
      "name": "Captain Brian Chapman",
      "title": "Chief",
      "org": "United States Coast Guard",
      "email": "brian.m.chapman@uscg.mil",
      "photo": null
    },
    "ev|bodner-chris": {
      "name": "Lieutenant Commander Chris Bodner",
      "title": "Latin American Regional Advisor",
      "org": "United States Coast Guard",
      "email": "christopher.p.bodner@uscg.mil",
      "photo": null
    },
    "ev|varona-david-c": {
      "name": "Captain David C. Varona",
      "title": "Director",
      "org": "United States Navy",
      "email": "david.c.varona.mil@us.navy.mil",
      "photo": null
    },
    "ev|frost-david": {
      "name": "Commodore David Frost",
      "title": "Naval Attaché",
      "org": "Embassy of Australia",
      "email": "david.frost3@defence.gov.au",
      "photo": null
    },
    "ev|ambrogi-ariel": {
      "name": "Brigadier General Ariel Ambrogi",
      "title": "Air Attaché",
      "org": "Embassy of Argentina",
      "email": "airattacheassistant.ar@gmail.com",
      "photo": null
    },
    "ev|santana-jorge": {
      "name": "Colonel Jorge Santana",
      "title": "Air Attaché",
      "org": "Embassy of Chile",
      "email": "jsantanasom@gmail.com",
      "photo": null
    },
    "ev|lopez-guido": {
      "name": "Major General Guido Lopez",
      "title": "Air Attaché",
      "org": "Embassy of Peru",
      "email": "agrefap.usa@outlook.com",
      "photo": null
    },
    "ev|camara-raul": {
      "name": "Major General Raul Camara",
      "title": "Defense Attaché",
      "org": "Embassy of Brazil",
      "email": "attache.adeua@fab.mil.br; secretaria.adeua@fab.mil.br",
      "photo": null
    },
    "ev|vaca-santiago": {
      "name": "Colonel Santiago Vaca",
      "title": "Air Attaché",
      "org": "Embassy of Ecuador",
      "email": "eafattache@yahoo.com",
      "photo": null
    },
    "ev|marczak-jason": {
      "name": "Mr. Jason Marczak",
      "title": "vice president and senior director",
      "org": "Atlantic Council's Adrienne Arsht Latin America Center",
      "email": "IPalacios@ATLANTICCOUNCIL.org",
      "photo": null
    },
    "ev|ford-maldonado-melissa": {
      "name": "Ms Melissa Ford Maldonado",
      "title": "Director of the Western Hemisphere Initiative at the America First Policy Institute",
      "org": "America First Policy Institute AFPI",
      "email": "mford@americafirstpolicy.com",
      "photo": null
    },
    "ev|de-osma-rafael": {
      "name": "Mr Rafael De Osma",
      "title": "",
      "org": "Americas Society / Council of the Americas",
      "email": "rdeosma@as-coa.org",
      "photo": null
    },
    "ev|hernandez-roy-christopher": {
      "name": "Mr. Christopher Hernandez-Roy",
      "title": "Senior Fellow and Acting Director, Americas Program Center for Strategic and International Studies",
      "org": "Center for Strategic and International Studies – CSIS",
      "email": "ChernandezRoy@csis.org",
      "photo": null
    },
    "ev|martinez-fernandez-andres": {
      "name": "Mr. Andrés Martínez Fernández",
      "title": "Senior Policy Analyst for Latin America",
      "org": "Heritage Foundation",
      "email": "andres.martinezfernandez@heritage.org",
      "photo": null
    },
    "ev|scharifker-diego": {
      "name": "Mr. Diego Scharifker",
      "title": "Senior Director Center for Corporate Diplomacy",
      "org": "Meridian International Center",
      "email": "DScharifker@meridian.org",
      "photo": null
    },
    "ev|feith-david": {
      "name": "Mr. David Feith",
      "title": "Adjunct Senior Fellow",
      "org": "Center for a New American Security - CNAS",
      "email": "davidjfeith@gmail.com",
      "photo": null
    },
    "ev|fontaine-richard": {
      "name": "Mr. Richard Fontaine",
      "title": "Chief Executive Officer",
      "org": "Center for a New American Security - CNAS",
      "email": "kkoett@cnas.org",
      "photo": null
    },
    "ev|restrepo-dan": {
      "name": "Mr. Dan Restrepo",
      "title": "Advisor",
      "org": "Center For American Progress",
      "email": "dan.restrepo@gmail.com",
      "photo": null
    },
    "ev|billingslea-marshall": {
      "name": "Mr. Marshall Billingslea",
      "title": "Senior Fellow",
      "org": "Hudson Institute",
      "email": "mbillingslea@hudson.org",
      "photo": null
    },
    "ev|chertoff-michael": {
      "name": "Mr. Michael Chertoff",
      "title": "Co-Founder and Executive Chairman",
      "org": "The Chertoff Group",
      "email": "michael.chertoff@chertoffgroup.com / meggie.trusty@chertoffgroup.com",
      "photo": null
    },
    "ev|mckinley-p-michael": {
      "name": "Mr. P. Michael Mckinley",
      "title": "U.S. Ambassador (Ret.) - Senior Counselor",
      "org": "The Cohen Group",
      "email": "pmmckinley@cohengroup.net",
      "photo": null
    },
    "ev|dippell-matt": {
      "name": "Mr. Matt Dippell",
      "title": "Deputy Regional Director for Latin America and the Caribbean Programs",
      "org": "National Democratic Institute (NDI)",
      "email": "mdippell@ndi.org",
      "photo": null
    },
    "ev|boston-scott": {
      "name": "Mr. Scott Boston",
      "title": "Senior Defense Analyst",
      "org": "RAND Corporation",
      "email": "Scott_Boston@rand.org",
      "photo": null
    },
    "ev|pernin-christopher-g": {
      "name": "Mr. Christopher G Pernin",
      "title": "Vice President, RAND Army Research Division; Director, RAND Arroyo Center; Senior Physical Scientist, RAND; Professor of Policy Analysis, RAND School of Public Policy",
      "org": "RAND Corporation",
      "email": "Christopher_Pernin@rand.org",
      "photo": null
    },
    "ev|chorev-matan": {
      "name": "Mr. Matan Chorev",
      "title": "Vice President and Director, RAND Global and Emerging Risks; Senior Policy Researcher",
      "org": "RAND Corporation",
      "email": "mchorev@rand.org",
      "photo": null
    },
    "ev|garrastazu-antonio": {
      "name": "Mr. Antonio Garrastazu",
      "title": "Senior Director, Latin America and the Caribbean",
      "org": "International Republican Institute (IRI)",
      "email": "info@iri.org",
      "photo": null
    },
    "ev|medina-maria": {
      "name": "Ms. Maria Medina",
      "title": "",
      "org": "Georgetown University",
      "email": "mm5496@georgetown.edu",
      "photo": null
    },
    "ev|hiope-tonija": {
      "name": "Ms Tonija Hiope",
      "title": "Assit. Provost",
      "org": "Howard University",
      "email": "tonija.navas@Howard.edu",
      "photo": null
    },
    "ev|marckwardt-jim": {
      "name": "Mr. Jim Marckwardt",
      "title": "Director",
      "org": "Johns Hopkins",
      "email": "amarckw1@jhu.edu",
      "photo": null
    },
    "ev|riveros-angelo": {
      "name": "Mr. Angelo Riveros",
      "title": "Director",
      "org": "Georgetown University",
      "email": "ar93@georgetown.edu",
      "photo": null
    },
    "ev|hazbum-isidoro": {
      "name": "Mr. Isidoro Hazbum",
      "title": "Investigador",
      "org": "Virginia Tech",
      "email": "isidorohazbun@vt.edu",
      "photo": null
    },
    "ev|vargas-carlos": {
      "name": "Mr Carlos Vargas",
      "title": "",
      "org": "Department of State",
      "email": "vargasce@state.gov",
      "photo": null
    },
    "ev|guitiy-julio": {
      "name": "Mr Julio Guitiy",
      "title": "",
      "org": "SUDECC/UN Permanent Forum on People of African Descent",
      "email": "julio.guity@sudecc.com",
      "photo": null
    },
    "ev|castiblanco-daniela": {
      "name": "Ms Daniela Castiblanco",
      "title": "",
      "org": "Johns Hopkins",
      "email": "dcastib1@jh.edu",
      "photo": null
    },
    "ev|arboleda-nelson": {
      "name": "Mr Nelson Arboleda",
      "title": "",
      "org": "HHS",
      "email": "nelson.arboleda@hhs.gov",
      "photo": null
    }
  };

// Mapeo ev| -> ids del gestor (s001/a001/…): un ev| puede tener dos filas
// (duplicados Sec y Def / Agregadurías). Confirmado si ALGUNO está en la lista viva.
var GUESTS_LIVE_IDS = {
    "ev|peterson-julia": [
      "s001"
    ],
    "ev|madigan-keith": [
      "s002"
    ],
    "ev|ormsby-jesse": [
      "s003"
    ],
    "ev|barbulescu-sandra": [
      "s004"
    ],
    "ev|kocheulov-vladimir": [
      "s005"
    ],
    "ev|york-aaron": [
      "s006"
    ],
    "ev|lee-courtney": [
      "s007"
    ],
    "ev|hui-dennis": [
      "s008"
    ],
    "ev|beasley-john": [
      "s009"
    ],
    "ev|bodner-amy": [
      "s010"
    ],
    "ev|fuse-marisa": [
      "s011"
    ],
    "ev|thomas-estelle": [
      "s012"
    ],
    "ev|zegar-allison": [
      "s013"
    ],
    "ev|hollinshead-samantha": [
      "s014"
    ],
    "ev|burgos-isabella": [
      "s015"
    ],
    "ev|stackhouse-timothy": [
      "s016"
    ],
    "ev|boone-chase-logan": [
      "s018"
    ],
    "ev|kit-ellen": [
      "s019"
    ],
    "ev|besosa-miguel": [
      "s020"
    ],
    "ev|bello-mauricio": [
      "s021"
    ],
    "ev|wilson-joshua-b": [
      "s022",
      "a007"
    ],
    "ev|spalding-luc-p": [
      "s023",
      "a008"
    ],
    "ev|grady-dana-w": [
      "s024",
      "a009"
    ],
    "ev|norkiewicz-collin": [
      "s025",
      "s054"
    ],
    "ev|jacquez-alissa-m": [
      "s026"
    ],
    "ev|ortiz-michael": [
      "s027"
    ],
    "ev|cannavo-nicole": [
      "s028"
    ],
    "ev|roncone-nita-l": [
      "s029"
    ],
    "ev|kroger-kaleb": [
      "s030"
    ],
    "ev|de-jesus-blasini-patricia": [
      "s031"
    ],
    "ev|fishman-kyle": [
      "s032"
    ],
    "ev|carrera-madalen": [
      "s033"
    ],
    "ev|hooker-allison": [
      "s034"
    ],
    "ev|logerfo-gregory-d": [
      "s035"
    ],
    "ev|fleming-mark": [
      "s036"
    ],
    "ev|ager-jacobsen-monica": [
      "s037"
    ],
    "ev|borkert-joel": [
      "s038"
    ],
    "ev|white-fleet": [
      "s039"
    ],
    "ev|schiller-rachel": [
      "s040"
    ],
    "ev|vaccaro-michael-j": [
      "s041"
    ],
    "ev|green-r-william": [
      "s042"
    ],
    "ev|dinanno-thomas": [
      "s043"
    ],
    "ev|auger-vanessa": [
      "s047"
    ],
    "ev|polga-hecimovich-john": [
      "s048"
    ],
    "ev|arnold-jessica": [
      "s049"
    ],
    "ev|meade-kathia-l": [
      "s050"
    ],
    "ev|underwood-james": [
      "s051"
    ],
    "ev|velasco-simon": [
      "s052"
    ],
    "ev|liang-christine-jingqi": [
      "s053"
    ],
    "ev|brantley-courtney-p": [
      "s055"
    ],
    "ev|liberatori-alejandro": [
      "a001"
    ],
    "ev|cassinelli-gorigoitia-gianfranco": [
      "a002"
    ],
    "ev|cardozo-santamaria-luis-emilio": [
      "a003"
    ],
    "ev|castillo-correa-efren": [
      "a004"
    ],
    "ev|skeete-julius": [
      "a005"
    ],
    "ev|ifran-diaz-cesar": [
      "a006"
    ],
    "ev|chini-osvaldo": [
      "a010"
    ],
    "ev|camillo-de-barros-neyder": [
      "a011"
    ],
    "ev|acevedo-patricio": [
      "a012"
    ],
    "ev|frias-duarte-franklin": [
      "a013"
    ],
    "ev|rueda-fabricio": [
      "a014"
    ],
    "ev|gavarrete-franklin-bladimir": [
      "a015"
    ],
    "ev|chichilla-archila-edy-santiago": [
      "a016"
    ],
    "ev|guevara-mejia-jesus-maria": [
      "a017"
    ],
    "ev|ortiz-espinoza-nelson-augusto": [
      "a018"
    ],
    "ev|oliva-angulo-oscar": [
      "a019"
    ],
    "ev|bourne-jessen-kele-ann": [
      "a020"
    ],
    "ev|ruiz-tocci-victor-francisco": [
      "a021"
    ],
    "ev|looman-erik": [
      "a022"
    ],
    "ev|gonzalez-woolrich-cuauhtemoc": [
      "a023"
    ],
    "ev|charpentier-christophe": [
      "a024"
    ],
    "ev|gore-timothy": [
      "a025"
    ],
    "ev|tremblay-luc": [
      "a026"
    ],
    "ev|mugica-carlos": [
      "a027"
    ],
    "ev|ledridge-matthew": [
      "a028"
    ],
    "ev|griffin-lydia": [
      "a029"
    ],
    "ev|gilbert-brian": [
      "a030"
    ],
    "ev|croker-brian": [
      "a031"
    ],
    "ev|chapman-brian": [
      "a032"
    ],
    "ev|bodner-chris": [
      "a033"
    ],
    "ev|varona-david-c": [
      "a034"
    ],
    "ev|frost-david": [
      "a035"
    ],
    "ev|ambrogi-ariel": [
      "a036"
    ],
    "ev|santana-jorge": [
      "a037"
    ],
    "ev|lopez-guido": [
      "a038"
    ],
    "ev|camara-raul": [
      "a039"
    ],
    "ev|vaca-santiago": [
      "a040"
    ],
    "ev|marczak-jason": [
      "t001"
    ],
    "ev|ford-maldonado-melissa": [
      "t002"
    ],
    "ev|de-osma-rafael": [
      "t003"
    ],
    "ev|hernandez-roy-christopher": [
      "t004"
    ],
    "ev|martinez-fernandez-andres": [
      "t005"
    ],
    "ev|scharifker-diego": [
      "t006"
    ],
    "ev|feith-david": [
      "t007"
    ],
    "ev|fontaine-richard": [
      "t008"
    ],
    "ev|restrepo-dan": [
      "t009"
    ],
    "ev|billingslea-marshall": [
      "t010"
    ],
    "ev|chertoff-michael": [
      "t011"
    ],
    "ev|mckinley-p-michael": [
      "t012"
    ],
    "ev|dippell-matt": [
      "t013"
    ],
    "ev|boston-scott": [
      "t014"
    ],
    "ev|pernin-christopher-g": [
      "t015"
    ],
    "ev|chorev-matan": [
      "t016"
    ],
    "ev|garrastazu-antonio": [
      "t017"
    ],
    "ev|medina-maria": [
      "u001"
    ],
    "ev|hiope-tonija": [
      "u002"
    ],
    "ev|marckwardt-jim": [
      "u003"
    ],
    "ev|riveros-angelo": [
      "u004"
    ],
    "ev|hazbum-isidoro": [
      "u005"
    ],
    "ev|vargas-carlos": [
      "u006"
    ],
    "ev|guitiy-julio": [
      "u007"
    ],
    "ev|castiblanco-daniela": [
      "u008"
    ],
    "ev|arboleda-nelson": [
      "u009"
    ]
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
    // Total con QR: los 60 de la matriz + los del gestor que no estaban ahí.
    var total = Object.keys(GUESTS).length;
    Object.keys(GUESTS_LIVE).forEach(function (k) { if (!GUESTS[k]) total++; });
    $("countTotal").textContent = total;
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
    var note = $("markNote");
    if (!puertaAbierta()) {
      note.textContent = "El registro de asistencia se habilita el " + fechaPuerta() + ".";
      return;
    }
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
    // La checklist es la del gestor: primero los 60 de la matriz definitiva
    // y, si no está ahí, los del gestor (GUESTS_LIVE). Los QR viejos siguen
    // resolviendo igual; los nuevos invitados del gestor también tienen QR.
    var guest = GUESTS[gid] || GUESTS_LIVE[gid];
    currentGid = gid;
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
    renderLiveBadge(gid);
    if (!puertaAbierta()) {
      $("btnYes").disabled = true;
      $("btnNo").disabled = true;
      $("markNote").textContent = "El registro de asistencia se habilita el " + fechaPuerta() + ".";
    }
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
    // Aviso de la puerta de 5 días: visible antes de entrar con el token.
    if (!puertaAbierta()) { var gp = $("gatePuerta"); if (gp) gp.hidden = false; }
    // Conteo en vivo de confirmados desde la gestión (solo lectura): un
    // cambio en el gestor aparece aquí sin pulsar ningún botón.
    if (window.firebase) {
      try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(FB_CONFIG);
        firebase.database().ref(LISTA_URL).on("value", function (s) {
          var v = s.val() || {};
          liveLista = v;
          liveListaLoaded = true;
          var el = $("countConfirmados");
          if (el) el.textContent = Object.keys(v).length;
          if (currentGid && !$("guestCard").hidden) renderLiveBadge(currentGid);
        });
      } catch (e) {}
    }
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
