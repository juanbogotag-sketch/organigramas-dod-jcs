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
    nocturno» de este archivo. Milo las agrega durante el día cuando Juan
    dice «esto también, pero después». Monaguillo revisa el panel una vez
    por la noche (se programa él mismo) y las trabaja sin pedir permiso
    por cada tarea: Juan lo autoriza de antemano para las tareas del panel,
    dentro de sus límites. Si una tarea necesita una decisión de Juan, no
    la hace y la marca `Necesita decisión de Juan`.

## Estado actual — 20 nov 2026, 13:14 EST

| Agente | Tarea | Archivos | Estado |
|---|---|---|---|
| Milo | Fotos para los 11 congresistas del Poder Legislativo (solo foto, sin tocar texto) | `js/datos_foro.js` | PUBLICADO 20 nov ~13:00 EST, verificado en vivo (11/11 miembros con foto) |
| Milo | Sección Publicaciones + informe Hegseth | `publicaciones.html`, `js/datos_publicaciones.js`, `js/publicaciones.js`, `css/publicaciones.css`, `inicio.html`, `publicaciones/Informe_Visita_Secretario_de_Guerra_Colombia.docx` | PUBLICADO 20 nov ~12:45 EST, verificado en vivo |
| Monaguillo | Perfiles nuevos: 11 del ZIP (Paul, Merkley, Ricketts, Wicker, Warner, Mast, Frankel, Quigley, Figures, McGovern) + Pocan | `js/datos_foro.js` | PUBLICADO en vivo (verificado 12:59 EST): Pocan y los 10 perfiles nuevos ya están en vivo |
| — | `js/datos_foro.js` en vivo: 165 entradas. Los 11 miembros del Poder Legislativo ya tienen foto (9 puestas por Milo, rogers y pocan por Monaguillo). | — | — |
| — | No hay tareas abiertas ni delegadas en este momento. | — | — |

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

_Por completar: escribe aquí qué tienes._

Plantilla: qué has construido en el repositorio (archivos y qué hace cada
cosa), qué decisiones tomaste con Juan, qué tienes pendiente y qué archivos
estás tocando ahora.

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
atención de Juan ni de Milo. Milo las agrega durante el día cuando Juan
dice «esto también, pero después».

Cómo funciona:

- **Monaguillo revisa este panel una vez por la noche** (se programa él
  mismo una revisión nocturna). No necesita que Juan le diga nada cada vez.
- **Trabaja sin pedir permiso por cada tarea**: Juan lo autoriza de
  antemano para las tareas de este panel, dentro de los límites escritos
  en cada una.
- Toma las tareas en orden, marca cada una `EN CURSO` antes de empezar,
  la hace siguiendo el protocolo, la marca `HECHO` con fecha y hora, y
  verifica en vivo antes de darla por terminada.
- **Si una tarea necesita una decisión de Juan**, no la hace: la marca
  `Necesita decisión de Juan` y sigue con la siguiente.
- No toca archivos que Milo tenga `EN CURSO` ni nada fuera del panel.
- Al día siguiente, Milo revisa lo que se hizo de noche.

| Tarea | Archivos | Límites | Estado |
|---|---|---|---|
| _Sin tareas pendientes por ahora. Milo agrega aquí durante el día las que vayan quedando para después._ | — | — | — |

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
