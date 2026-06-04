export const partidos = [
{
  seccion: "Grupo A - México",
  juegos: [
    {
      fecha: "Jueves 11 junio 2026",
      hora: "15:00",
      grupo: "Grupo A",
      estadio: "Estadio Ciudad de México",
      equipos: [
        { nombre: "México", codigo: "mx" },
        { nombre: "Sudáfrica", codigo: "za" },
      ],
    },
    {
      fecha: "Jueves 11 junio 2026",
      hora: "22:00",
      grupo: "Grupo A",
      estadio: "Estadio Guadalajara",
      equipos: [
        { nombre: "República de Corea", codigo: "kr" },
        { nombre: "República Checa", codigo: "cz" },
      ],
    },
    {
      fecha: "Jueves 18 junio 2026",
      hora: "21:00",
      grupo: "Grupo A",
      estadio: "Estadio Guadalajara",
      equipos: [
        { nombre: "México", codigo: "mx" },
        { nombre: "República de Corea", codigo: "kr" },
      ],
    },
    {
      fecha: "Domingo 21 junio 2026",
      hora: "18:00",
      grupo: "Grupo A",
      estadio: "Estadio Guadalajara",
      equipos: [
        { nombre: "Sudáfrica", codigo: "za" },
        { nombre: "República de Corea", codigo: "kr" },
      ],
    },
    {
      fecha: "Miércoles 24 junio 2026",
      hora: "21:00",
      grupo: "Grupo A",
      estadio: "Estadio Ciudad de México",
      equipos: [
        { nombre: "República Checa", codigo: "cz" },
        { nombre: "México", codigo: "mx" },
      ],
    },
  ],
},
  {
    seccion: "Partidos Estrella",
    juegos: [
      {
        fecha: "Sábado 13 junio 2026",
        hora: "18:00",
        grupo: "Grupo C",
        estadio: "Estadio Nueva York Nueva Jersey",
        equipos: [
          { nombre: "Brasil", codigo: "br" },
          { nombre: "Marruecos", codigo: "ma" },
        ],
      },
      {
        fecha: "Domingo 14 junio 2026",
        hora: "16:00",
        grupo: "Grupo F",
        estadio: "Estadio Dallas",
        equipos: [
          { nombre: "Países Bajos", codigo: "nl" },
          { nombre: "Japón", codigo: "jp" },
        ],
      },
      {
        fecha: "Martes 16 junio 2026",
        hora: "15:00",
        grupo: "Grupo I",
        estadio: "Estadio Nueva York Nueva Jersey",
        equipos: [
          { nombre: "Francia", codigo: "fr" },
          { nombre: "Senegal", codigo: "sn" },
        ],
      },
      {
        fecha: "Martes 16 junio 2026",
        hora: "21:00",
        grupo: "Grupo J",
        estadio: "Estadio Kansas City",
        equipos: [
          { nombre: "Argentina", codigo: "ar" },
          { nombre: "Argelia", codigo: "dz" },
        ],
      },
      {
        fecha: "Miércoles 17 junio 2026",
        hora: "16:00",
        grupo: "Grupo L",
        estadio: "Estadio Dallas",
        equipos: [
          { nombre: "Inglaterra", codigo: "gb-eng" },
          { nombre: "Croacia", codigo: "hr" },
        ],
      },
    ],
  },
  {
    seccion: "Favoritos al Título",
    juegos: [
      {
        fecha: "Lunes 15 junio 2026",
        hora: "12:00",
        grupo: "Grupo H",
        estadio: "Estadio Atlanta",
        equipos: [
          { nombre: "España", codigo: "es" },
          { nombre: "Cabo Verde", codigo: "cv" },
        ],
      },
      {
        fecha: "Domingo 14 junio 2026",
        hora: "13:00",
        grupo: "Grupo E",
        estadio: "Estadio Houston",
        equipos: [
          { nombre: "Alemania", codigo: "de" },
          { nombre: "Curazao", codigo: "cw" },
        ],
      },
      {
        fecha: "Lunes 15 junio 2026",
        hora: "15:00",
        grupo: "Grupo G",
        estadio: "Estadio Seattle",
        equipos: [
          { nombre: "Bélgica", codigo: "be" },
          { nombre: "Egipto", codigo: "eg" },
        ],
      },
      {
        fecha: "Miércoles 17 junio 2026",
        hora: "13:00",
        grupo: "Grupo K",
        estadio: "Estadio Houston",
        equipos: [
          { nombre: "Portugal", codigo: "pt" },
          { nombre: "RD Congo", codigo: "cd" },
        ],
      },
      {
        fecha: "Sábado 27 junio 2026",
        hora: "19:30",
        grupo: "Grupo K",
        estadio: "Estadio Miami",
        equipos: [
          { nombre: "Colombia", codigo: "co" },
          { nombre: "Portugal", codigo: "pt" },
        ],
      },
    ],
  },
  {
    seccion: "Anfitriones y Cierres Fuertes",
    juegos: [
      {
        fecha: "Viernes 12 junio 2026",
        hora: "15:00",
        grupo: "Grupo B",
        estadio: "Estadio Toronto",
        equipos: [
          { nombre: "Canadá", codigo: "ca" },
          { nombre: "Bosnia y Herzegovina", codigo: "ba" },
        ],
      },
      {
        fecha: "Viernes 12 junio 2026",
        hora: "21:00",
        grupo: "Grupo D",
        estadio: "Estadio Los Ángeles",
        equipos: [
          { nombre: "Estados Unidos", codigo: "us" },
          { nombre: "Paraguay", codigo: "py" },
        ],
      },
      {
        fecha: "Miércoles 24 junio 2026",
        hora: "18:00",
        grupo: "Grupo C",
        estadio: "Estadio Miami",
        equipos: [
          { nombre: "Escocia", codigo: "gb-sct" },
          { nombre: "Brasil", codigo: "br" },
        ],
      },
      {
        fecha: "Viernes 26 junio 2026",
        hora: "20:00",
        grupo: "Grupo H",
        estadio: "Estadio Guadalajara",
        equipos: [
          { nombre: "Uruguay", codigo: "uy" },
          { nombre: "España", codigo: "es" },
        ],
      },
      {
        fecha: "Sábado 27 junio 2026",
        hora: "22:00",
        grupo: "Grupo J",
        estadio: "Estadio Dallas",
        equipos: [
          { nombre: "Jordania", codigo: "jo" },
          { nombre: "Argentina", codigo: "ar" },
        ],
      },
    ],
  },
]

export const partidosPlanos = partidos.flatMap((grupo) =>
  grupo.juegos.map((juego) => juego.equipos)
)

export const equipos = [
  ...new Set(
    partidosPlanos.flatMap(([local, visitante]) => [
      local.nombre,
      visitante.nombre,
    ])
  ),
]

export const sistemaPuntos = [
  { concepto: "Marcador exacto", puntos: "+5 pts" },
  { concepto: "Ganador correcto", puntos: "+3 pts" },
  { concepto: "Gol local correcto", puntos: "+1 pt" },
  { concepto: "Gol visitante correcto", puntos: "+1 pt" },
  { concepto: "Finalista correcto", puntos: "+10 pts" },
  { concepto: "Campeón correcto", puntos: "+30 pts" },
]