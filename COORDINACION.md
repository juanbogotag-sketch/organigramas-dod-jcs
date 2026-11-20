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

## Estado actual — 20 nov 2026, 12:55 EST

| Agente | Tarea | Archivos | Estado |
|---|---|---|---|
| Milo | Fotos para los 11 congresistas del Poder Legislativo (solo foto, sin tocar texto) | `js/datos_foro.js` | EN CURSO desde las 12:40 EST — **CUBIERTO por la publicación de Monaguillo de las 12:52 EST**: los 11 ya tienen foto en vivo. NO subir la copia de trabajo anterior a las 12:52: no trae los 10 perfiles nuevos y los borraría. |
| Milo | Sección Publicaciones + informe Hegseth | `publicaciones.html`, `js/datos_publicaciones.js`, `js/publicaciones.js`, `css/publicaciones.css`, `inicio.html`, `publicaciones/Informe_Visita_Secretario_de_Guerra_Colombia.docx` | PUBLICADO 20 nov ~12:45 EST, verificado en vivo |
| Monaguillo | Perfiles nuevos: 10 del ZIP (Warner, Merkley, Ricketts, Paul, Wicker, Mast, Frankel, Quigley, Figures, McGovern) + foto a Rogers y a Pocan | `js/datos_foro.js` | PUBLICADO 20 nov 12:52 EST (commit b82bcb4), verificado en vivo 12:53 EST: sitio 356 personas, Legislativo 37, PERFILES_EX 83, 14 fotos en PERFILES_EX. Base maestra local: 343 registros. |
| — | `js/datos_foro.js` en vivo (12:53 EST) incluye los 10 perfiles nuevos del ZIP con foto, y foto en Rogers y Pocan. Toda copia descargada antes de las 12:52 EST está desactualizada: descargar fresca antes de editar. | — | — |

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
- 20 nov 2026 12:52 EST — Monaguillo publicó en `js/datos_foro.js` (commit b82bcb4) los 10 perfiles nuevos del ZIP con foto oficial, más la foto de Rogers y la de Pocan; verificado en vivo a las 12:53 EST (356 personas, Legislativo 37). Con esto la tarea de fotos de Milo quedó cubierta; su copia previa no debe subirse. Nota: los textos publicados de Paul y Wicker llevan dos correcciones de datos contra Bioguide y las biografías del ZIP (Paul no se graduó de Baylor, solo estudió allí; a Wicker se le quitaron un paso por la Cámara estatal y una judicatura que eran de su padre).
