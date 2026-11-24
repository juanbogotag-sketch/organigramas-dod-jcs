# Coordinación — Milo y Monaguillo

Archivo compartido y en vivo para coordinar el trabajo de los dos asistentes
(Milo y Monaguillo) sobre este repositorio. **Leerlo fresco desde GitHub
antes de empezar cualquier trabajo y actualizarlo antes y después de publicar.**
Ninguno de los dos puede hablar con el otro: Juan es el puente entre ambos.

## Protocolo (obligatorio para los dos)

1. **Antes de trabajar**: descargar la versión viva fresca de este archivo y
   de cada archivo que se vaya a tocar (desde GitHub Pages o la API).
2. **Reclamar antes de editar**: escribir aquí la tarea, los archivos y el
   estado `EN CURSO` y subir este archivo **antes** de editar nada.
3. **No tocar archivos que el otro tenga `EN CURSO`**, salvo el archivo
   compartido `js/datos_foro.js` (ver regla 4).
4. **Archivo compartido (`js/datos_foro.js`)**: antes de publicar, descargar
   la versión viva fresca y fusionar los cambios propios sobre ella por `id`.
   **Jamás subir una copia vieja completa**: eso borraría lo del otro.
5. **Al publicar**: subir solo los archivos de la tarea propia, verificar en
   vivo (recargando; el service worker puede mostrar una copia vieja) y
   actualizar aquí el estado a `PUBLICADO` con fecha y hora (EST).
6. **Si la subida falla con 422** (el archivo cambió mientras tanto):
   descargar de nuevo, fusionar y reintentar. No forzar.
7. **No subir cambios locales ajenos** sin orden de Juan (ver «Pendiente»).
8. **Mantener actualizada tu sección de «Contexto de cada uno»** cuando
   construyas algo nuevo, tomes una decisión con Juan o cambie un
   pendiente. Así el otro siempre sabe con qué cuentas.
9. **Revisión solo cuando hay una tarea delegada** (para no gastar recursos):
   nadie revisa este archivo por horario. Juan solo le pide cosas a Milo.
   Si Milo tiene mucho trabajo, Juan le puede decir que delegue algo en
   Monaguillo. Milo escribe la tarea delegada aquí con sus características,
   las peticiones exactas, los límites, los archivos y la fecha límite, y
   la marca `DELEGADA`. Juan entra al chat con Monaguillo y le dice que
   revise este archivo: Monaguillo **solo** lo revisa cuando Juan se lo
   indica. Monaguillo reporta la **APERTURA** (empieza) y el **CIERRE**
   (termina: qué publicó, verificado en vivo) aquí y se lo dice a Juan.
   Milo revisa solo mientras la tarea esté abierta y al cierre hace la
   verificación final.
10. **Revisión diaria del repositorio de guías** (`GUIAS.md` y `guias/`):
    una vez al día, en silencio; solo avisar a Juan si hay un error o algo
    por mejorar.
11. **Mantenimiento nocturno**: Milo trabaja de día y Monaguillo de noche.
    Las tareas pendientes, sencillas pero largas, que no requieren la
    atención de Juan ni de Milo, van en el panel de «Mantenimiento
    nocturno» de este archivo. Milo las propone durante el día: cuando Juan
    dice «esto también, pero después» o cuando Milo mismo decide que algo
    no es prioritario. **Milo solo propone; quien asigna el trabajo es
    Juan**: cada tarea del panel solo se ejecuta cuando Juan la marca
    `OK de Juan`. Monaguillo revisa el panel **dos veces al día, cada
    12 horas** (se programa él mismo), trae la lista de lo que Juan haya
    marcado con su OK y lo trabaja de noche siguiendo el protocolo, sin
    pedir permiso por cada tarea (las tareas con OK de Juan ya llevan su
    autorización), y reporta el cierre de cada tarea. Si una tarea
    necesita una decisión de Juan, no la hace y la marca
    `Necesita decisión de Juan`.

## Estado actual — 23 nov 2026, 09:15 EST

| Agente | Tarea | Archivos | Estado |
|---|---|---|---|
| Milo | Incluir fact sheet de SEPTIEMBRE en Informes (orden de Juan 23 nov ~19:53 EST): añadir FS_SEP y FS_SEP_EN (13–30 sep 2026, del docx «13 September – October Fact Sheet v.10.8.26 Borrador» que Juan subió) a js/datos_informes.js, renderSep() en js/informes.js y activar septiembre en informes.html (botón «disponible» + vista). NO tocar nada de octubre: ni FS_OCT, ni FS_OCT_EN, ni renderOct, ni el acumulado. | `js/datos_informes.js`, `js/informes.js`, `informes.html` | EN CURSO 23 nov ~19:53 EST |
| Milo | Botón «Agregar grupo» en el gestor del foro + corrección del Excel (orden de Juan 23 nov 09:04 EST): botón «＋ Agregar grupo» a la derecha del último chip de grupo (Universidades) que abre un diálogo para escribir el nombre; cada grupo nuevo aparece como chip, en el select del formulario y como pestaña propia en el Excel descargable (nombre de pestaña saneado: máx. 31 caracteres, sin : \ / ? * [ ]); grupos guardados en localStorage (prot_americas_grupos_v1) y sincronizados a Firebase (asistencia/hipopotamo/protegiendo-americas/grupos). Además, el Excel llevaba <sheetView> sin workbookViewId, atributo requerido que hacía que Excel de escritorio marcara las 4 hojas con error y ofreciera repararlas; se añadió workbookViewId="0". | `protegiendo-americas.html` | PUBLICADO 23 nov ~09:15 EST, verificado en vivo (commit 41887528, 69885 bytes; node --check OK; simulación con el código real + datos reales: grupo «Prensa» crea su pestaña con su invitado, 5 hojas; workbookViewId="0" en las 5 hojas; parseo estricto, openpyxl y LibreOffice OK; encabezado negro sólido) |
| Milo | Puerta privada para Eventos y Publicaciones en el repositorio (orden de Juan 23 nov, llamada de voz): botón de inicio de sesión con símbolo de persona en el encabezado; al tocarlo pide la contraseña; si acierta se desbloquean Eventos y Publicaciones en ese dispositivo (localStorage todo_privado_v1); la contraseña vive solo como hash SHA-256 en js/repositorio.js, nunca en claro. Esconde los menús de la vista, pero los enlaces directos a eventos.html/publicaciones.html siguen siendo públicos. | `repositorio.html`, `css/repositorio.css`, `js/repositorio.js` | PUBLICADO 23 nov ~08:55 EST, verificado en vivo (repositorio.html commit 806b8e0d73fe, css 274936c0bb96, js 00f1236cd412; css v39, js v44; simulación Node 35/35 OK; carga fresca en vivo con la puerta presente) |
| Milo | Aplicar tanda RSVP del foro + modo «Subir respuestas (RSVP)» en el gestor (orden de Juan 20 nov ~16:27 EST): (A) nuevo modo en protegiendo-americas.html que detecta columnas RSVP por encabezado, cruza cada fila con los 121 por email/nombre normalizado, muestra vista previa con la acción propuesta por fila y casillas, y aplica estados/agregados en Firebase con «Aplicar cambios»; nunca cambia Cancelado/Delegó, solo Pendiente → Confirmado/Cancelado; re-subir el mismo archivo no duplica (muestra «ya aplicado»); los correos no se ven en la lista de check-in. (B) Aplicar ESTA tanda vía REST: 12 confirmados, 1 cancelado (a011 Barros), 6 agregados nuevos, 5 acompañantes con registro propio y nota «Acompañante de X». No tocar js/datos_foro.js, publicaciones.html, js/datos_publicaciones.js ni el panel de mantenimiento nocturno. | `protegiendo-americas.html` | PUBLICADO 20 nov ~17:05 EST, verificado en vivo (protegiendo-americas.html commit b10fcbe6, 63452 bytes; node --check OK del script en línea vivo; simulación Node con el código real + CSV real de las 21 respuestas: 1.ª pasada 29 filas — 12 confirmado, 1 cancelado, 6 agregado, 5 acompañante, 5 ninguna; tras aplicar 23 confirmados, 2 cancelados, 1 delegó, 11 agregados creados; 2.ª pasada 24 «ya», 5 ninguna, 0 para aplicar — idempotente. REST aplicado: PATCH agregados 11 claves, PATCH estados 24 claves, PUT lista 23 entradas, todo 200. Verificación en vivo de Firebase: estados 23 confirmados / 2 cancelados (a011, a021) / 1 delegó (a035) / 6 pendientes explícitos; agregados 18 (7 previos + 11 nuevos RSVP); lista 23 entradas con solo nombre+organización, sin correos; a021 y a035 intactos; js/checkin.js lee esa lista (línea 52), el check-in la ve actualizada. Notas: Stewart quedó «Raegan» (formulario) con nota de la discrepancia con «Reagan» de la delegación de Frost; Castillo Báez con mail «pendiente» (el del formulario es de otra persona); acompañante de Rueda Aldas con «nombre pendiente». Corrección en la simulación: la deduplicación es por correo Y nombre (no solo correo) para no tratar a Stewart/Higgins —que comparten el buzón washington@afp.gov.au— como una sola persona; la vista previa avisa «Revisar el correo» cuando el correo no coincide con el nombre.) |
| Milo | Subir la 2.ª publicación local de Juan (documento llegó 20 nov ~15:41 EST): «Notas del encuentro entre el contralmirante, Carlos Gónima, viceministro de Política Criminal y Justicia Restaurativa, y representantes de centros de pensamiento» (tema Comercio e inversión, fecha 2026-11-20). Archivo local Notas__centros_de_pensamiento_v19.11.26_PM.docx (doble guion bajo) → subir a publicaciones/ con el nombre normalizado Notas_Centros_Pensamiento_v19.11.26_PM.docx y añadir la ficha (id local-1795206704886) a js/datos_publicaciones.js fusionando por id sobre la copia viva fresca. No se toca js/datos_foro.js ni el panel de mantenimiento. | `publicaciones/Notas_Centros_Pensamiento_v19.11.26_PM.docx` (nuevo), `js/datos_publicaciones.js` | PUBLICADO 20 nov ~15:43 EST, verificado en vivo (API SHA coinciden con lo subido: datos 8e68f525, docx e7f741c5, 155841 bytes; node --check OK; 3 entradas en vivo, tema Comercio e inversión en TEMAS_PUBLICACIONES, archivo con nombre normalizado; la descarga en Pages y la tarjeta en la lista tardaron el rebuild de Pages + caché CDN — a las ~15:47 EST la descarga ya es byte-exacta por curl (HTTP 200, 155841 bytes, md5 coincide) y el archivo de datos vivo ya trae la 3.ª ficha; verificación visual con clic real CONFIRMADA 15:48–15:49 EST con direcciones nuevas (sin caché): la lista muestra las 3 tarjetas (la 3.ª con Comercio e inversión, 20 nov 2026, DOCX) y el documento descarga byte-exacto (155841 bytes, md5 coincide); las vistas de 2 tarjetas de 15:43–15:47 eran caché del navegador, no del sitio; la tarjeta no muestra descripción porque el export la traía vacía) |
| Milo | Subir publicación local de Juan (exportada de su celular 20 nov ~15:34 EST): «Notas del encuentro entre Carlos Gónima, viceministro de Política Criminal y Justicia Restaurativa, y personal de los comités de relaciones exteriores del Congreso de Estados Unidos» (tema Seguridad y defensa, fecha 2026-11-20). Subir el docx a publicaciones/ y añadir la ficha (id local-1795206625038) a js/datos_publicaciones.js fusionando por id sobre la copia viva fresca. La 2.ª publicación del export («...contralmirante Carlos Gónima... representantes de centros de pensamiento») NO se sube: no hay documento en el workspace, queda pendiente de que Juan lo mande. No se toca js/datos_foro.js ni el panel de mantenimiento. | `publicaciones/Notas_Gonima_Congreso_v19.11.26_PM.docx` (nuevo), `js/datos_publicaciones.js` | PUBLICADO 20 nov ~15:36 EST, verificado en vivo (API SHA coinciden con lo subido: datos 911eb29f, docx f5f2cf7e, 156336 bytes; node --check OK; 2 entradas en vivo, tema Seguridad y defensa en TEMAS_PUBLICACIONES; la descarga en Pages y la tarjeta en la lista tardan el rebuild de Pages + caché CDN — verificación visual con clic real CONFIRMADA 15:37 EST: la tarjeta aparece en la lista (tema Seguridad y defensa, 20 nov 2026, DOCX) y el documento descarga byte-exacto (156336 bytes, md5 coincide); la tarjeta no muestra descripción porque el export la traía vacía. La 2.ª publicación del export queda pendiente del documento) |
| Milo | Publicación DIRECTA en la web para Publicaciones (orden de Juan 20 nov ~15:32 EST, SOLO publicaciones): al darle a Publicar, la publicación (título, temática, fecha, descripción + archivo base64, máx. 4 MB, pdf/docx/xlsx/pptx) se sube a Firebase Realtime Database, nodo nuevo `publicaciones/` (NO bajo asistencia/hipopotamo/), mismo SDK/config que los gestores y checklists (firebasejs 10.12.2 compat, sin autenticación nueva). La lista mezcla las semillas de js/datos_publicaciones.js + el nodo Firebase + locales; búsqueda y filtro por temática sobre todas. Migración con un toque de las locales («Tienes N publicaciones solo en este dispositivo — Publicarlas ahora»), sin duplicar (por id y por título+archivo; si ya está como semilla, no se vuelve a subir). Se conserva «Exportar datos» como respaldo; la nota ya no dice que quedan en el dispositivo. BLOQUEO VERIFICADO POR PROBE 20 nov ~15:36 EST: las reglas actuales de RTDB niegan lectura y escritura anónimas en `publicaciones/` (401 Permission denied en GET/PUT/DELETE) — publicar directo es imposible sin un cambio de reglas en consola (proyecto asistencia-eventos-cc286); el código se publica listo y con respaldo local, y se reporta el bloque de reglas exacto. Verificado en vivo: gate() en js/inicio.js ya no reporta ingresos en publicaciones.html (corrección 4cae2ffe) — los correos repetidos del panel quedan detenidos; no se toca js/inicio.js. No se toca js/datos_publicaciones.js (las fichas las sube Milo por el repo) ni gestores ni organigrama. | `publicaciones.html`, `js/publicaciones.js`, `css/publicaciones.css` | PUBLICADO 20 nov ~15:44 EST, verificado en vivo (API SHA coinciden con lo subido: publicaciones.html c65e8972, js/publicaciones.js ab334d44, css 4ed7ef4c; cargas frescas tras rebuild: SDK Firebase + banner «Publicarlas ahora» + nota nueva en vivo, nota vieja 0; node --check OK del JS vivo; simulación Node 20/20: mezcla sin duplicar, publicar OK/fallo, migración, respaldo local. BLOQUEO: reglas RTDB niegan lectura/escritura anónimas en `publicaciones/` (401, probe 15:36 EST) — el flujo directo NO funciona hasta aplicar el bloque de reglas en consola, ver Historial. La prueba real de publicar desde el celular la hace Juan tras aplicar las reglas.) |
| Milo | Toggle en botones de estado de los gestores de invitados (orden de Juan 20 nov ~15:20 EST): clic otra vez en el botón del estado actual vuelve a Pendiente (Confirmado→Pendiente, Cancelado→Pendiente, Delegó→Pendiente); clic en un estado diferente cambia como hoy. Aplica a ambos gestores (protegiendo-americas.html e hipopotamo-gestion.html, lógica duplicada en línea). No se toca 'Confirmar todos' (sigue solo Pendientes) ni los datos (js/datos_protegiendo.js, js/datos_hipopotamo_gestion.js). Los archivos del «Pendiente» se tocan por orden expresa de Juan: verificado que el clon local es idéntico a vivo en estos dos archivos (diff vacío + SHA API coinciden), sin cambios sin publicar que pisar | `protegiendo-americas.html`, `hipopotamo-gestion.html` | PUBLICADO 20 nov ~15:29 EST, verificado en vivo (API SHA coinciden con lo subido + cargas frescas con el toggle en ambos archivos + node --check OK + simulación del manejador en Node, 18 casos: mismo estado→Pendiente en los 3, estado diferente cambia como hoy sin pedir delegar de más; 'Confirmar todos' intacto; contadores se actualizan vía renderTodo() en setEstado/clearEstado; la prueba del clic real la hace Juan en su celular) |
| Milo | Temáticas + dropzone + renombre «Perfiles» + barras azules (órdenes de Juan ~15:09–15:14 EST): (1) 5 temáticas nuevas en TEMAS_PUBLICACIONES (Migración y asuntos consulares, Cultura y educación, Derechos humanos, Energía y ambiente, Cooperación y desarrollo; sin «Estados Unidos»); (2) casillero de arrastrar y soltar en el formulario «Subir publicación», además del botón de elegir archivo; (3) el tile «Repositorio de Perfiles» pasa a decir «Perfiles» (solo la etiqueta del tile); (4) barras azules de título en los paneles Eventos (eventos.html: 'Eventos' / 'Embajada de Colombia en Estados Unidos' / 'Crear y gestionar eventos') y Perfiles (#perfilesView en repositorio.html: 'Perfiles' / 'Embajada de Colombia en Estados Unidos' / 'Buscar y gestionar perfiles'), iguales a la de Publicaciones; (5) quitar el emoji de los títulos de Eventos y Perfiles: las barras azules quedan sin ningún emoji; (6) el Organigrama pasa a ser PANEL desplegable con iframe (REVERSA la decisión de 14:59 EST de abrirlo como página completa): el tile 'Organigrama Estados Unidos' ya no navega; al hacer clic se despliega el panel con organigrama.html en iframe, un solo panel abierto a la vez, con su barra azul ('Organigrama Estados Unidos' / 'Embajada de Colombia en Estados Unidos' / 'Estructura del Gobierno de Estados Unidos'). El tile conserva su estilo azul y su posición. Publicaciones no se toca. No se toca js/inicio.js (arreglo 4cae2ffe) ni js/datos_foro.js | `js/datos_publicaciones.js`, `publicaciones.html`, `js/publicaciones.js`, `css/publicaciones.css`, `repositorio.html`, `eventos.html`, `css/repositorio.css`, `js/repositorio.js` | PUBLICADO 20 nov ~15:25 EST, verificado en vivo (API SHA + cargas frescas + clics reales en navegador 15:22–15:23 EST: 5 temáticas, dropzone, tile «Perfiles», barras azules sin emoji, organigrama como panel desplegable) |
| Milo | Menú directo a los tiles (refinamiento 14:40 EST): ELIMINAR toda la interfaz de inicio; el inicio del sitio pasa a ser repositorio.html. inicio.html e index.html (raíz) redirigen a repositorio.html; el organigrama DOD/JCS se mueve a organigrama.html (los perfiles enlazan index.html?tree=, se actualiza a organigrama.html?tree=) y queda enlazado desde el encabezado del repositorio | `inicio.html`, `index.html`, `organigrama.html` (nuevo), `js/repositorio.js`, `repositorio.html`, `sw.js` | PUBLICADO 20 nov ~14:52 EST, verificado en vivo (API SHA + cargas frescas: inicio e index redirigen; repositorio con 3 tiles, sin botones pequeños, JS v41; organigrama en organigrama.html; enlaces ?tree= actualizados 2/2) |
| Milo | Paneles desplegables: Eventos y Publicaciones se despliegan debajo de los tiles (igual que Perfiles); botones «Crear carpeta» solo visibles con el panel de Perfiles abierto; el conteo «Base de datos de perfiles · N personas» pasa dentro del panel de Perfiles; renombres «Todo» y «Organigrama Estados Unidos»; CUARTO TILE (orden de Juan 14:52 EST): se quita el enlace «Organigrama Estados Unidos →» del encabezado y se crea el tile «Organigrama Estados Unidos» (azul sólido, 240 px, icono SVG de organigrama) a la izquierda de Perfiles, que abre organigrama.html (página completa, no panel) | `repositorio.html`, `css/repositorio.css`, `js/repositorio.js`, `organigrama.html`, `js/app.js` | PUBLICADO 20 nov ~14:56 EST, verificado en vivo (API SHA coinciden con lo subido + 3 cargas frescas: 4 tiles en orden Org/Perfiles/Eventos/Publicaciones, sin enlace en el encabezado, 3 paneles en el DOM, CSS v37 con regla a.tile) |
| Milo | BUG panel Publicaciones + unificación «Todo» (órdenes de Juan 14:55 y 15:00 EST): (1) el panel de Publicaciones mostraba repositorio.html en vez de la lista: js/inicio.js redirigía dentro del iframe cuando el visitante estaba registrado; (2) la app pasa a llamarse «Todo»: manifest.webmanifest, index.html, inicio.html, apple-mobile-web-app-title (repositorio.html, publicaciones.html), títulos de eventos.html/publicaciones.html/proyectos.html, enlaces «Volver a Todo» (eventos.html, organigrama.html), h2 de la puerta en publicaciones.html, sw.js (CACHE todo-v1 para forzar caché limpia). No se tocan los nombres de sección (Repositorio de Perfiles, Eventos, Publicaciones, Organigrama Estados Unidos) ni los archivos del «Pendiente» | `js/inicio.js`, `manifest.webmanifest`, `index.html`, `inicio.html`, `repositorio.html`, `publicaciones.html`, `eventos.html`, `organigrama.html`, `proyectos.html`, `sw.js` | PUBLICADO 20 nov ~15:10 EST, verificado en vivo (API SHA coinciden con lo subido + cargas frescas + simulación del gate en Node: panel sin redirección y sin correos de ingreso; la entrada conserva reporte + redirección; manifiesto y redirecciones dicen «Todo»; Hegseth visible en los datos) |
| Milo | Reestructurar menú principal y menú de categorías: inicio solo con 2 botones; en repositorio, categorías agrupadas detrás de un botón cuadrado «Repositorio de Perfiles» y otro cuadrado «Eventos»; Publicaciones queda debajo de Eventos sin cambio de estilo | `repositorio.html`, `css/repositorio.css`, `js/repositorio.js` (`inicio.html` ya tiene solo los 2 botones; no se toca) | PUBLICADO 20 nov ~13:45 EST, verificado en vivo (inicio 2 botones; repositorio con los 2 botones cuadrados; Publicaciones intacta; fotos 11/11 siguen en vivo) |
| Milo | Fotos para los 11 congresistas del Poder Legislativo (solo foto, sin tocar texto) | `js/datos_foro.js` | PUBLICADO 20 nov ~13:00 EST, verificado en vivo (11/11 miembros con foto) |
| Milo | Sección Publicaciones + informe Hegseth | `publicaciones.html`, `js/datos_publicaciones.js`, `js/publicaciones.js`, `css/publicaciones.css`, `inicio.html`, `publicaciones/Informe_Visita_Secretario_de_Guerra_Colombia.docx` | PUBLICADO 20 nov ~12:45 EST, verificado en vivo |
| Monaguillo | Perfiles nuevos: 11 del ZIP (Paul, Merkley, Ricketts, Wicker, Warner, Mast, Frankel, Quigley, Figures, McGovern) + Pocan | `js/datos_foro.js` | PUBLICADO en vivo (verificado 12:59 EST): Pocan y los 10 perfiles nuevos ya están en vivo |
| — | `js/datos_foro.js` en vivo: 165 entradas. Los 11 miembros del Poder Legislativo ya tienen foto (9 puestas por Milo, rogers y pocan por Monaguillo). | — | — |

## Contexto de cada uno (qué tiene cada uno)

Este archivo no es solo un semáforo de tareas: es también el lugar donde
cada uno escribe **qué tiene**, para que el otro sepa con qué cuenta y no
haya que adivinarlo.

Regla: cada uno mantiene actualizada su sección. Antes de empezar un
trabajo, leer la sección del otro. Si necesitas algo que el otro tiene,
pídeselo a Juan: él es el puente.

### Milo

- Presupuesto Washington (hoja viva en Drive), matriz de Embajadores y
  Cónsules (Drive), organigramas DOD/JCS (192 nodos) y Ejecutivo.
- Plataforma/Repositorio: gestores de invitados, checklists, informe de
  asistencia, sección Publicaciones, foro «Protegiendo las Américas»
  (9 dic, 121 invitados) e Hipopótamo (19 nov, informe hecho).
- Guía metodológica de perfiles de Juan (NotebookLM, cuaderno «Perfiles
  muse») y modelo de informes de la Embajada.
- Token de GitHub para subir al repo (vence ~23 nov 2026); clon local
  sincronizado con vivo.
- Pendientes propios: 5 decisiones de tabulación de la matriz esperando a
  Juan; puerta del check-in del foro en 20 días (volver a 5 tras la prueba
  de Juan).

### Monaguillo

- **Repositorio de perfiles** (la base manda): mantengo la base maestra de
  perfiles bilingües y su publicación en `repositorio.html` (356 personas en
  vivo, 20 nov 2026). Perfiles completos en `js/datos_foro.js` (PERFILES_EX,
  83) y fichas básicas (FICHAS_EX). Categorías: Ejecutivo, Legislativo,
  Judicial, Centros de pensamiento, Academia, Embajada de Colombia, Otros.
  Sin categorías nuevas sin orden de Juan; sin tocar la interfaz de
  `congreso.html`.
- **Organigrama interactivo DOD/JCS**: `index.html` + `js/data.js`
  (25 árboles, 192 nodos), `js/photos.js`, `js/app.js`. Se alimenta desde la
  base de perfiles.
- **Perfiles**: los genero en NotebookLM (cuaderno «Perfiles muse») con la
  guía de Juan y el modelo Landau, uno por uno y un idioma por vez,
  verificados dato por dato contra fuentes oficiales (Bioguide en
  congresistas). Fotos oficiales como data URI en el campo `photo`.
- **Publicado hoy (20 nov)**: Pocan y la tanda de 10 congresistas del ZIP,
  todos con foto, más la foto de Rogers (Legislativo 37). Correcciones de
  datos aplicadas a Paul y Wicker contra Bioguide.
- **Otras páginas del repo que mantengo**: `inicio.html` (puerta),
  `embajadores.html`, `eventos.html`, `hipopotamo.html` (asistencia, con
  Firebase), `checkin.html` y la matriz del foro «Protegiendo las Américas»
  (3 dic 2026).
- **Automatización de sugerencias**: revisión cada 3 horas de la etiqueta de
  Gmail «Sugerencias Torio»; valido cada sugerencia y, si encaja en una
  categoría y se verifica, preparo y publico el perfil; si no, lo reporto a
  Juan sin publicar.
- **Decisiones vigentes con Juan**: la fuente de verdad es este repositorio
  (GitHub Pages); antes de publicar, copia fresca + `node --check` +
  conteos, y verificación en vivo después. No entro en las cuentas de Juan
  ni uso credenciales por chat.
- **Pendientes de decisión de Juan**: (a) QR del check-in solo para invitados
  del foro o para todo el Repositorio; (b) discrepancia de consulados en la
  tabulación (122 detalle / 118 titular / 109 suma); (c) perfil de Claudia
  Patricia Cuevas Ortiz, en espera expresa; (d) botón de edición de
  propietario en el Repositorio.
- **Ahora mismo**: sin tareas abiertas en el repo. Reviso este archivo solo
  cuando Juan me lo indica. El panel de mantenimiento lo reviso dos veces al
  día y le reporto la lista a Juan: las tareas las ejecuto con su OK, con
  reporte de apertura y cierre.

## Revisión por delegación (sin revisión por horario)

- **Nadie revisa este archivo por horario**: la revisión cada 15 minutos
  se canceló (eran 96 ejecuciones al día) para no gastar recursos.
- **Juan solo le pide cosas a Milo.** Si Milo tiene mucho trabajo, Juan le
  puede decir que delegue algo en Monaguillo.
- **Delegación**: Juan le dice a Milo que delegue algo → Milo escribe la
  tarea completa aquí (características, peticiones exactas, límites,
  archivos, fecha límite) y la marca `DELEGADA` → Juan entra al chat con
  Monaguillo y le dice que revise este archivo → Monaguillo lee la tarea
  y reporta la **APERTURA** cuando empieza y el **CIERRE** cuando termina
  (qué publicó, verificado en vivo), avisándole a Juan en cada caso.
- **Milo revisa solo mientras la tarea esté abierta**; al cierre hace la
  verificación final.
- **Repositorio de guías** (`GUIAS.md` y `guias/`): se revisa **una vez al
  día** (Monaguillo y Milo). En silencio: a Juan solo se le avisa si hay
  un error o algo por mejorar.
- En silencio en todo: a Juan solo se le avisa si hay un error o algo por
  mejorar.

## Mantenimiento nocturno (panel para Monaguillo)

**Milo trabaja de día y Monaguillo de noche.** Este panel es la lista de
cosas pendientes: tareas **sencillas pero largas**, que no requieren la
atención de Juan ni de Milo. Milo las propone durante el día: cuando Juan
dice «esto también, pero después» o cuando Milo mismo decide que algo no
es prioritario. **Milo solo propone; quien asigna el trabajo es Juan**:
una tarea del panel solo se ejecuta cuando Juan la marca `OK de Juan`
(Juan se lo dice a Milo y Milo lo escribe en el archivo). Lo que no tenga
el OK de Juan es solo una propuesta, no una orden, y no se ejecuta.

Cómo funciona:

- **Monaguillo revisa este panel dos veces al día, cada 12 horas** (se
  programa él mismo las dos revisiones), trae la lista de lo que Juan
  haya marcado con su OK y lo trabaja de noche. No necesita que Juan le
  diga nada más cada vez.
- **Trabaja sin pedir permiso por cada tarea con OK de Juan**: esas
  tareas ya llevan su autorización, dentro de los límites escritos en
  cada una. Lo que no tenga el OK de Juan **no** se ejecuta.
- Toma las tareas en orden, marca cada una `EN CURSO` antes de empezar,
  la hace siguiendo el protocolo, la marca `HECHO` con fecha y hora, y
  verifica en vivo antes de darla por terminada.
- **Si una tarea necesita una decisión de Juan**, no la hace: la marca
  `Necesita decisión de Juan` y sigue con la siguiente.
- No toca archivos que Milo tenga `EN CURSO` ni nada fuera del panel.
- Al día siguiente, Milo revisa lo que se hizo de noche.

| Tarea | Archivos | Límites | OK de Juan | Estado |
|---|---|---|---|---|
| Actualizar la guía metodológica de perfiles en NotebookLM (cuaderno «Perfiles muse»): lenguaje sencillo, sin subtítulos ni frases pesadas tipo «antecedentes formativos y profesionales» en el segundo párrafo (ejemplo: perfil de Lois Frankel). Después, actualizar la copia del repositorio (guias/guia-generacion-perfiles.md) para que quede igual y verificar en vivo. | Guía en NotebookLM; guias/guia-generacion-perfiles.md | Solo la guía; no regenerar ni tocar perfiles ya publicados. | OK de Juan | Pendiente (con OK) |
| Correcciones del organigrama (órdenes de Juan 20 nov ~15:22–15:24 EST): (1) el menú de opciones de la izquierda arriba, al desplegarse, ocupa toda la pantalla — debe desplegarse solo hasta el 25% del ancho, desde la izquierda hacia la derecha (Juan primero dijo tres cuartos y se corrigió a 25%); el árbol debe quedar visible al lado. (2) Búsqueda del organigrama («Buscar por nombre o cargo…»): al hacer clic en un resultado (ej. Daniel Zimmerman) NO debe abrir el panel de perfil (ver/descargar perfil); debe ir al casillero de esa persona dentro del organigrama con la opción de ampliar activada, para que quepa en la pantalla con los vecinos visibles (igual que hacer clic en el nodo). Esto REVERSA la decisión del 10 nov (en escritorio la búsqueda abría el perfil directamente; en móvil solo ampliaba). El perfil se sigue abriendo con el icono del casillero / doble clic. (3) Auto-ajustar al abrir el panel: al abrir el panel del organigrama en repositorio.html el árbol sale en blanco (espacio beige) hasta pulsar «Ajustar»; que se auto-ajuste al abrirse para que los nodos se vean de inmediato. | organigrama.html, js/app.js, repositorio.html, js/repositorio.js, css/repositorio.css (solo lo necesario) | Solo la búsqueda del organigrama: NO cambiar la búsqueda de Perfiles de repositorio.html (esa sigue abriendo perfiles). No tocar el lote anterior (temáticas, dropzone, tile «Perfiles», barras azules, emoji, panel del organigrama) ni js/inicio.js ni los gestores de invitados ni js/datos_foro.js. Verificar en vivo antes de dar por terminado; reportar APERTURA y CIERRE. | OK de Juan (20 nov 15:26 EST, en la llamada) | Pendiente (con OK) |
| Revisión de que todos los casilleros del organigrama tengan foto y perfil (orden de Juan 20 nov ~15:26 EST): auditar los nodos del organigrama DOD/JCS en vivo y listar cuáles no tienen foto o no tienen perfil real (texto ES/EN). Rellenar solo lo que se pueda verificar con fuentes primarias según la guía metodológica (guias/guia-generacion-perfiles.md); lo que no se pueda verificar NO se inventa: se deja reportado en la lista para que Juan decida. | Organigrama DOD/JCS en vivo (js/data.js, fotos); guias/guia-generacion-perfiles.md (consulta) | No inventar perfiles ni fotos. Los tres de WHA (w8 Carpenter, w9 Messinger, w10 Morgan) siguen BLOQUEADOS pendientes de decisión de Juan — no se les inventa perfil. Si algo necesita decisión de Juan, marcar «Necesita decisión de Juan» y seguir con el siguiente. Reportar APERTURA y CIERRE con la lista de huecos. | OK de Juan (20 nov 15:26 EST, en la llamada) | Pendiente (con OK) |

## Repositorio de guías

Índice: `GUIAS.md`. Guías completas y vigentes en `guias/`.

- **Guía para generación de perfiles**: `guias/guia-generacion-perfiles.md`
  (texto completo, última actualización 20 nov 2026).
- Cuando Juan pide un cambio en una metodología, se actualiza la guía
  completa en el repositorio y se verifica en vivo. Antes de hacer un
  perfil, leer la guía completa y vigente.

## Pendiente (no tocar sin orden de Juan)

Cambios locales en el clon (según git), de otras tareas:
`checkin.html`, `hipopotamo-gestion.html`, `hipopotamo.html`,
`js/checkin.js`, `protegiendo-americas.html`.
No subirlos como parte de otra tarea sin orden de Juan.

## Historial

- 20 nov 2026 ~12:25 EST — Milo retiró a Pocan de `js/datos_foro.js` en vivo
  por la cancelación de su propia tanda; ~12:33 EST lo restauró por orden de
  Juan (la publicación era de Monaguillo y no debía tocarse).
- 20 nov 2026 ~12:45 EST — Milo publicó la sección Publicaciones
  (6 archivos, informe Hegseth V.20.11.26 AM), verificado en vivo.
- 20 nov 2026 12:48 EST — Se crea este archivo de coordinación.
- 20 nov 2026 ~13:00 EST — Milo publicó las fotos de los 11 congresistas
  del Poder Legislativo (9 fotos nuevas; rogers y pocan ya las tenían por
  Monaguillo), verificado en vivo. Monaguillo ya tenía publicados en vivo
  los 10 perfiles nuevos + Pocan.
- 20 nov 2026 ~13:00 EST — Se crea el repositorio de guías (`GUIAS.md` +
  `guias/guia-generacion-perfiles.md`) y se programan las revisiones
  (coordinación cada 15 min, guías una vez al día, en silencio salvo error
  o mejora).
- 20 nov 2026 ~13:09 EST — Se cancela la revisión de coordinación cada 15
  min (96 ejecuciones al día, demasiado recurso). Dinámica por apertura y
  cierre: Monaguillo reporta apertura y cierre; Milo revisa solo mientras
  la tarea esté abierta. La revisión diaria de guías se mantiene.
- 20 nov 2026 ~13:10 EST — **Dinámica final por delegación**: Juan solo le
  pide cosas a Milo; si Milo tiene mucho trabajo, Juan le dice que delegue
  algo en Monaguillo. Milo escribe la tarea delegada completa aquí y la
  marca `DELEGADA`; Juan le dice a Monaguillo que revise el archivo.
  Monaguillo solo revisa la coordinación cuando Juan se lo indica.
- 20 nov 2026 ~13:14 EST — Se crea el **panel de mantenimiento nocturno**:
  Milo trabaja de día y Monaguillo de noche; las tareas pendientes,
  sencillas pero largas, van en el panel y Monaguillo las trabaja de noche
  sin pedir permiso por cada tarea, con autorización anticipada de Juan.
- 20 nov 2026 ~13:17 EST — Ajuste del mantenimiento nocturno: Monaguillo
  revisa el panel **dos veces al día (cada 12 horas)** en vez de una sola
  vez por la noche; Milo puede decidir por su cuenta qué va a
  mantenimiento cuando algo no es prioritario (Juan no tiene que
  indicarlo cada vez).
- 20 nov 2026 ~13:26 EST — Se fusiona la regla del OK de Juan en la regla
  11 y el panel (Milo solo propone; sin OK de Juan no se ejecuta nada),
  sin tocar la sección de contexto de Monaguillo. Primera tarea del
  panel: actualizar la guía de perfiles en NotebookLM (lenguaje sencillo,
  sin subtítulos), con OK de Juan, ordenada por Juan en la llamada.
- 20 nov 2026 ~13:24 EST — Monaguillo completó su sección de «Contexto de cada uno». Acuerdo registrado con Juan: la delegación va por tareas DELEGADA con revisión cuando Juan lo indica; el panel de mantenimiento se revisa dos veces al día y Monaguillo le reporta la lista a Juan — las tareas se ejecutan con el OK de Juan, con apertura y cierre reportados.
- 20 nov 2026 ~13:45 EST — Milo reestructura el menú: `inicio.html` ya tenía solo los 2 botones (Repositorio de la Embajada, Embajadas y Consulados), sin cambios; en `repositorio.html` las categorías quedan detrás del botón cuadrado «Repositorio de Perfiles» (icono SVG de tarjeta de identificación) y «Eventos» es otro botón cuadrado que va a `eventos.html`; Publicaciones intacta debajo de Eventos. Corregido además el emoji 📅 que `js/repositorio.js` volvía a poner en el botón Eventos al cargar. Verificado en vivo; las fotos 11/11 siguen en vivo en `js/datos_foro.js`.
- 20 nov 2026 ~14:41 EST — Milo añade el tercer tile cuadrado «Publicaciones» en `repositorio.html` y elimina los botones pequeños «Ver eventos» y «Publicaciones» (quedan exactamente 3 tiles); el contador de eventos pasa al subtítulo del tile grande. Verificado en vivo por API (SHA coinciden con lo subido); lo que Juan veía viejo era caché del CDN/navegador.
- 20 nov 2026 ~14:52 EST — Refinamiento de Juan: se elimina TODA la interfaz de inicio y el inicio pasa a ser `repositorio.html`. `inicio.html` e `index.html` (raíz) redirigen a `repositorio.html`; el organigrama DOD/JCS se mueve a `organigrama.html` (nuevo, copia exacta del viejo `index.html`) y queda enlazado desde el encabezado del repositorio («Organigrama DOD/JCS →»); los enlaces «Ver organigrama» de los perfiles pasan de `index.html?tree=` a `organigrama.html?tree=` (2/2) y `index.html` conserva los `?tree=` viejos redirigiéndolos al organigrama. `sw.js` pasa el organigrama nuevo directo como antes. Verificado en vivo (API SHA + cargas frescas anti-caché). Juan aprobó los 3 tiles ~14:42 EST.
- 20 nov 2026 ~14:47 EST — Renombres de Juan: la página principal (hub de los tres tiles) se llama «Todo» y el organigrama se llama «Organigrama Estados Unidos» (solo nombres visibles; el repo y los archivos conservan sus nombres). El conteo «Base de datos de perfiles · N personas» sale del encabezado y pasa dentro del panel desplegado de Perfiles. En la misma pasada, los tiles de Eventos y Publicaciones se despliegan debajo de los botones (iframes de eventos.html y publicaciones.html) y los botones «Crear carpeta» solo aparecen con el panel de Perfiles abierto.
- 20 nov 2026 ~14:52 EST — Orden de Juan: el enlace «Organigrama Estados Unidos →» se quita del encabezado (ocupaba un lugar demasiado importante) y en su lugar va un CUARTO tile cuadrado (240 px, azul sólido, icono SVG de organigrama) a la izquierda de Repositorio de Perfiles, que abre organigrama.html como página completa (no panel). Orden final: Organigrama Estados Unidos, Repositorio de Perfiles, Eventos, Publicaciones.
- 20 nov 2026 ~15:10 EST — Milo corrige el bug del panel de Publicaciones (js/inicio.js: la puerta solo redirige y solo reporta el ingreso en la página de entrada; en publicaciones.html ya no hay redirección ni correos «Ingreso de visitante» por cada toque — el spam de FormSubmit a juan.bogotag@gmail.com queda detenido) y unifica el nombre de la app a «Todo» (manifiesto, index.html, inicio.html, apple-mobile-web-app-title, títulos de eventos/publicaciones/proyectos, «Volver a Todo», sw.js CACHE todo-v1). Verificado en vivo por API + cargas frescas + simulación (panel abierto 3 veces = 0 correos).
- 20 nov 2026 ~15:25 EST — Milo publica el lote de 6 cambios (5 temáticas nuevas, casillero de arrastrar archivos en Publicaciones, tile «Perfiles», barras azules en Eventos/Perfiles, sin emoji en los títulos, organigrama como panel desplegable con iframe). Verificado en vivo por API + cargas frescas + clics reales en navegador (15:22–15:23 EST): todo confirmado; las barras son azul marino oscuro (#0a1d38), igual que la de Publicaciones; el árbol del panel sale en blanco hasta pulsar «Ajustar» (pasa a la revisión de la noche).
- 20 nov 2026 ~15:26 EST — Milo publica el toggle de estados en los dos gestores de invitados (clic otra vez en el estado actual vuelve a Pendiente; «Confirmar todos» intacto). Verificado en vivo por API + cargas frescas + simulación de 18 casos. Pendiente la prueba con clic real por Juan en su celular.
- 20 nov 2026 ~15:26 EST — Juan delega a Monaguillo para la revisión de la noche: las 3 correcciones del organigrama (menú izquierdo al 25%, búsqueda que amplía el casillero sin abrir el perfil, auto-ajustar al abrir el panel) + la revisión de que todos los casilleros tengan foto y perfil. Quedan en el panel de mantenimiento nocturno con OK de Juan. Milo detuvo a su agente del organigrama antes de que publicara nada.

- 20 nov 2026 ~15:44 EST — Milo publica la publicación DIRECTA en Publicaciones (código listo): publicaciones.html (commit 5437d03b), js/publicaciones.js (97bc9025), css/publicaciones.css (3384d8e1). Verificado en vivo por API (SHAs coinciden) + cargas frescas tras rebuild + node --check OK del JS vivo + simulación Node 20/20 (mezcla sin duplicar, publicar OK/fallo, migración con salto de ya-publicadas, respaldo local). BLOQUEO: las reglas de Realtime Database niegan lectura y escritura anónimas en el nodo `publicaciones/` (401 Permission denied, probe 15:36 EST en GET/PUT/DELETE; también en asistencia/publicaciones/) — el flujo directo NO funciona hasta aplicar en consola (Firebase → proyecto asistencia-eventos-cc286 → Realtime Database → Rules) este bloque, SIN tocar el resto de reglas, añadiéndolo como clave de primer nivel dentro de "rules": {"publicaciones": {".read": true, "$pubId": {".write": "!data.exists() && newData.exists() && newData.child('id').val() === $pubId", ".validate": "newData.hasChildren(['id', 'titulo', 'tema', 'fecha', 'datos']) && newData.child('titulo').isString() && newData.child('tema').isString() && newData.child('fecha').isString() && newData.child('datos').isString() && newData.child('datos').val().length < 7000000"}}}. Con las reglas aplicadas: cualquiera registrado puede CREAR publicaciones (lectura pública, crear solo si no existe, sin borrar ni sobrescribir); la escritura de un archivo de 4 MB en base64 aún no está verificada (el probe de tamaño era imposible con 401) — la primera publicación real desde el celular es la prueba. Las 2 locales de Juan ya están como semillas en el repo (Gónima Congreso + Gónima centros de pensamiento); si Juan toca «Publicarlas ahora», la migración las salta por id sin duplicar y las borra del local.
