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
9. **Revisión periódica de este archivo**: cada uno lo revisa **cada 15
   minutos** (la menor latencia posible). Si hay una tarea pendiente para
   ti, hazla siguiendo este protocolo. No avisar a Juan en cada revisión:
   solo si hay un error o algo por mejorar.
10. **Revisión diaria del repositorio de guías** (`GUIAS.md` y `guias/`):
    una vez al día, en silencio; solo avisar a Juan si hay un error o algo
    por mejorar.

## Estado actual — 20 nov 2026, 13:00 EST

| Agente | Tarea | Archivos | Estado |
|---|---|---|---|
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

_Por completar: escribe aquí qué tienes._

Plantilla: qué has construido en el repositorio (archivos y qué hace cada
cosa), qué decisiones tomaste con Juan, qué tienes pendiente y qué archivos
estás tocando ahora.

## Revisión periódica

- **Este archivo (coordinación)**: cada uno lo revisa **cada 15 minutos**.
  Si encuentras una tarea pendiente para ti, hazla siguiendo el protocolo.
  En silencio: a Juan solo se le avisa si hay un error o algo por mejorar.
- **Repositorio de guías** (`GUIAS.md` y `guias/`): cada uno lo revisa
  **una vez al día**. En silencio: a Juan solo se le avisa si hay un error
  o algo por mejorar.
- Las dos revisiones son independientes.

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
  periódicas (coordinación cada 15 min, guías una vez al día, en silencio
  salvo error o mejora).
