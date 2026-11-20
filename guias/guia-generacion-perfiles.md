# Guía para generación de perfiles

_Guía completa y vigente. Última actualización: 20 nov 2026. Cuando Juan pide un cambio en esta metodología, se actualiza la guía completa aquí y se verifica en vivo. Índice del repositorio de guías: `GUIAS.md`._

# Resumen metodológico: cómo se hacen los perfiles de Juan Pablo

Guía operativa para cualquier asistente que reciba de Juan Pablo el encargo de hacer un perfil. Todo se comunica en español.

## 1. Antes de empezar

- **Buscar primero en su Google Drive**, carpeta «2. Perfiles y organigramas»: puede que ya exista material de la persona.
- **Verificar que la persona no esté ya publicada** en el Repositorio (base maestra y sitio en vivo); si ya está, no se duplica.
- **Fuente obligatoria: una biografía confiable**, preferiblemente la oficial (para congresistas de Estados Unidos: su página en house.gov o senate.gov, contrastada con el Biographical Directory del Congreso para fecha de nacimiento, educación y cargos previos).
- **Si no hay biografía confiable, el perfil no se hace.** Nunca se inventa un dato: ni fechas, ni cargos, ni familia.

## 2. Generación en NotebookLM

- Los perfiles se generan en el cuaderno **«Perfiles muse»** de NotebookLM: https://notebook.google.com/notebook/8b3748e2-0274-4eca-ae6c-d5517d3034d8 — allí están la **guía estructural** y el perfil **MODELO de Christopher Landau**.
- Se sube la biografía de la persona como fuente y se genera **una persona por vez y un idioma por vez**: primero el español y después el inglés, cada uno con una petición separada y específica (la persona y su fuente). Al pedir, se seleccionan solo las fuentes pertinentes: la guía, el modelo y esa biografía.
- El acceso a NotebookLM se hace en el navegador con la sesión de Juan Pablo; **nunca se le pide la contraseña ni códigos en el chat**.

## 3. Estructura y reglas del texto

Orden obligatorio de cada perfil:

1. **Lo presente primero**: cargo actual, año de nacimiento entre paréntesis, desde cuándo lo ejerce y su contexto oficial actual (comités, roles, responsabilidades).
2. **Idoneidad**: antecedentes en orden cronológico, lo más antiguo primero.
3. **Plano humano al final**: familia, intereses, rasgos personales, solo si la fuente los trae.

Reglas de estilo:

- Prosa limpia, **sin subtítulos ni listas**.
- **Máximo 350 palabras.** No hay mínimo, pero un perfil «de solo cargo» NO cuenta como terminado si existen fuentes confiables más amplias: hay que desarrollar lo que la fuente permita.
- **Fechas entre paréntesis solo con el año final** y con sentido común: prohibido «fundado en (2001)», años duplicados o colgando.
- **En español**: instituciones escritas completas, sin siglas, salvo organismos públicos muy conocidos (FBI, CIA, INL, IMF, USAID, ICE, OAS, ICC, ICJ). **Nunca** siglas para universidades, centros de pensamiento ni ONG.
- **En inglés**: nombre completo de la institución y la sigla entre paréntesis la primera vez.
- Lenguaje sencillo y **pocos gerundios**.

## 4. Verificación (antes de guardar o publicar)

- Contrastar **cada dato** contra la biografía fuente; lo que no se pueda verificar en una fuente directa se elimina, aunque suene plausible.
- Revisar: orden de la estructura, extensión, paréntesis de años, siglas según el idioma, que no haya subtítulos.
- Si algo falla, **se regenera** el perfil y se vuelve a verificar el nuevo texto.

## 5. Guardado en NotebookLM — regla de seguridad crítica

- ⚠️ **NUNCA usar la opción «Guardar el mensaje en una nota»**: esa acción sobrescribió y destruyó dos notas de Juan Pablo.
- Cada nota se crea **manualmente en Studio**, con el título exacto **«Perfil ES — Nombre Apellido»** o **«Profile EN — Name Lastname»**, y se pega el texto ya verificado. Se confirma que la nota nueva aparece con su título y que ninguna nota anterior cambió.

## 6. Entrega en Word (cuando Juan Pablo la pide)

Formato fijo, todo en **Arial**:

- **Membrete de la Embajada de Colombia** en el encabezado, centrado.
- **Encabezado de la persona**: nombre y cargo, **negrita 12 pt, CENTRADO**.
  - Para **congresistas**: el nombre lleva siempre el paréntesis con partido y estado, y el cargo va **genérico, sin el distrito**: «Mark Pocan (D-WI), U.S. Representative» / «Mark Pocan (D-WI), representante de los Estados Unidos». El distrito se menciona solo en el cuerpo. Modelo aprobado: los documentos de Pocan editados por Juan Pablo (20 nov 2026).
- **Línea de versión**: 8 pt, a la **DERECHA**, entre el encabezado y el primer párrafo, con puntos: español «V.20.11.26 PM» (día.mes.año), inglés «V.11.20.26 PM» (mes.día.año).
- **Cuerpo**: 12 pt, **JUSTIFICADO**, párrafos de **máximo 100 palabras**, con espacio entre párrafos, y el documento completo en **una sola página**. Si no cabe, se recorta o comprime el texto: **nunca se cambia el tamaño ni el tipo de letra**.
- **Foto oficial** (si existe): anclada a la izquierda, rectangular, **5 cm × 6,45 cm**.
- Nombre de archivo: español «Perfil._<Nombre>_V_<fecha>._Borrador__1_JPGB.docx»; inglés «Profile_<Name>_V_<date>_Draft_1_JPGB_EN.docx».

## 7. Publicación en el Repositorio (cuando Juan Pablo la pide)

- La fuente de verdad es el repositorio de GitHub Pages **organigramas-dod-jcs**: https://juanbogotag-sketch.github.io/organigramas-dod-jcs/repositorio.html — primero se alimenta la base de datos de perfiles y desde ahí el organigrama.
- El perfil completo va en **PERFILES_EX** de `js/datos_foro.js`, en su categoría (Ejecutivo, Legislativo, Judicial, Centros de pensamiento, Academia, Embajada de Colombia, Otros), y se agrega también a la **base maestra**. Las fichas sin texto completo van en FICHAS_EX.
- En el Repositorio, el título de un congresista lleva el partido y el estado: «U.S. Representative (D-WI)», «U.S. Senator (R-MS)».
- **No se crean categorías nuevas** sin orden expresa de Juan Pablo, y **no se toca la interfaz de congreso.html**.
- Antes de publicar: partir siempre de una **copia fresca del repositorio**, ejecutar `node --check` sobre cada archivo JS editado y verificar los conteos de personas por categoría. Después de publicar: **verificar en vivo** en la URL pública, recargando (el service worker puede mostrar una copia vieja en la primera carga).

## 8. Forma de trabajar

- Juan Pablo ordenó **resolver las discrepancias por cuenta propia** (investigando o con sentido común), sin consultarle perfil por perfil ni pedirle permiso paso a paso. Se le reporta cuando algo está **terminado y verificado**, o cuando falta un dato que solo él puede dar.
- Verificar antes de afirmar: si él detecta un error con una captura, se reconoce sin rodeos y se corrige en todos los lugares afectados.
