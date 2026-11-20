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

## Estado actual — 20 nov 2026, 13:54 EST

| Agente | Tarea | Archivos | Estado |
|---|---|---|---|
| Milo | Menú directo a los tiles (refinamiento 14:40 EST): ELIMINAR toda la interfaz de inicio; el inicio del sitio pasa a ser repositorio.html. inicio.html e index.html (raíz) redirigen a repositorio.html; el organigrama DOD/JCS se mueve a organigrama.html (los perfiles enlazan index.html?tree=, se actualiza a organigrama.html?tree=) y queda enlazado desde el encabezado del repositorio | `inicio.html`, `index.html`, `organigrama.html` (nuevo), `js/repositorio.js`, `repositorio.html`, `sw.js` | PUBLICADO 20 nov ~14:52 EST, verificado en vivo (API SHA + cargas frescas: inicio e index redirigen; repositorio con 3 tiles, sin botones pequeños, JS v41; organigrama en organigrama.html; enlaces ?tree= actualizados 2/2) |
| Milo | Paneles desplegables: Eventos y Publicaciones se despliegan debajo de los tiles (igual que Perfiles); botones «Crear carpeta» solo visibles con el panel de Perfiles abierto; el conteo «Base de datos de perfiles · N personas» pasa dentro del panel de Perfiles; renombres «Todo» y «Organigrama Estados Unidos»; CUARTO TILE (orden de Juan 14:52 EST): se quita el enlace «Organigrama Estados Unidos →» del encabezado y se crea el tile «Organigrama Estados Unidos» (azul sólido, 240 px, icono SVG de organigrama) a la izquierda de Perfiles, que abre organigrama.html (página completa, no panel) | `repositorio.html`, `css/repositorio.css`, `js/repositorio.js`, `organigrama.html`, `js/app.js` | PUBLICADO 20 nov ~14:56 EST, verificado en vivo (API SHA coinciden con lo subido + 3 cargas frescas: 4 tiles en orden Org/Perfiles/Eventos/Publicaciones, sin enlace en el encabezado, 3 paneles en el DOM, CSS v37 con regla a.tile) |
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
