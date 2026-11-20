// Publicaciones del Repositorio — datos semilla.
//
// Cada entrada es una publicación visible para todos los visitantes.
// Campos:
//   id          identificador único (sin espacios)
//   titulo      título que se muestra en la tarjeta
//   tema        una de TEMAS_PUBLICACIONES
//   fecha       ISO 'AAAA-MM-DD'
//   descripcion texto corto (1-2 frases)
//   archivo     ruta del documento dentro del repositorio
//   tipo        pdf | docx | xlsx | pptx
//
// Para publicar un documento para todos:
//   1) sube el archivo a la carpeta publicaciones/ del repositorio,
//   2) añade su entrada a este arreglo y publica el cambio en GitHub Pages.
// Las publicaciones subidas desde el formulario de la página quedan solo en
// el dispositivo de quien las subió hasta que se agreguen aquí.
var PUBLICACIONES = [
  {
    id: 'informe-visita-secretario-guerra-colombia',
    titulo: 'Informe, Colombia–Estados Unidos tras la visita del secretario de Guerra, Pete Hegseth',
    tema: 'Visita del secretario de Guerra a Colombia',
    fecha: '2026-11-20',
    descripcion: 'Informe sobre la visita del secretario de Guerra de EE. UU., Pete Hegseth, a Bogotá (18 nov 2026): posiciones oficiales de ambos gobiernos, cobertura de prensa y pasos a seguir. Versión definitiva V.20.11.26 AM.',
    archivo: 'publicaciones/Informe_Visita_Secretario_de_Guerra_Colombia.docx',
    tipo: 'docx'
  }
];

// Temáticas disponibles en el filtro y en el formulario de subida.
var TEMAS_PUBLICACIONES = [
  'Relación bilateral',
  'Seguridad y defensa',
  'Congreso',
  'Comercio e inversión',
  'Coyuntura',
  'Visita del secretario de Guerra a Colombia',
  'Migración y asuntos consulares',
  'Cultura y educación',
  'Derechos humanos',
  'Energía y ambiente',
  'Cooperación y desarrollo'
];
