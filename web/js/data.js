/*
 * Santander AR — contenido de los lugares.
 * Regla editorial: los "datos" son afirmaciones verificadas en las fuentes citadas
 * (campo `fuente`, que remite a FUENTES). El "relato" es una interpretación narrativa
 * del equipo y se muestra rotulado como tal. Fecha de consulta de las fuentes: 2026-10-14.
 */
(function () {
  const FUENTES = {
    'wiki-barichara-es': {
      titulo: 'Barichara — Wikipedia, la enciclopedia libre',
      url: 'https://es.wikipedia.org/wiki/Barichara',
      nota: 'Artículo enciclopédico; cita al SINIC, a la Alcaldía de Barichara y a I. Ardila Díaz, «El pueblo de los Guanes».',
    },
    'wiki-barichara-en': {
      titulo: 'Barichara — Wikipedia (inglés)',
      url: 'https://en.wikipedia.org/wiki/Barichara',
      nota: 'Cita a la Alcaldía de Barichara y a FONTUR, «Guía Red Turística de Pueblos Patrimonio de Colombia» (2020).',
    },
    'radionacional-lengerke': {
      titulo: 'Siguiendo las huellas de Geo von Lengerke por Santander — Radio Nacional de Colombia',
      url: 'https://www.radionacional.co/cultura/siguiendo-las-huellas-de-geo-von-lengerke-por-santander',
      nota: 'Crónica periodística de medio público (RTVC).',
    },
    'colombiatravel-chicamocha': {
      titulo: 'Conoce el Parque Nacional del Chicamocha — Colombia Travel (ProColombia)',
      url: 'https://colombia.travel/es/socorro/conoce-el-parque-nacional-del-chicamocha',
      nota: 'Portal oficial de promoción turística de Colombia.',
    },
    'colombiatravel-sangil': {
      titulo: 'San Gil — Colombia Travel (ProColombia)',
      url: 'https://colombia.travel/es/san-gil',
      nota: 'Portal oficial de promoción turística de Colombia.',
    },
    'wiki-sangil-es': {
      titulo: 'San Gil (Santander) — Wikipedia, la enciclopedia libre',
      url: 'https://es.wikipedia.org/wiki/San_Gil_(Santander)',
      nota: 'Cita al DANE y a la «Guía de Turismo, Provincia de Guanentá» (Cosmoguías, 2012).',
    },
  };

  const LUGARES = [
    {
      id: 'barichara',
      numero: '01',
      codigo: 'BAR-01',
      nombre: 'Barichara',
      subtitulo: 'Centro histórico de piedra',
      provincia: 'Provincia de Guanentá',
      color: '#B4532A',
      resumen: 'Un pueblo de calles, casas y templos de piedra amarilla, con su centro histórico declarado Monumento Nacional.',
      marcador: 'assets/markers/barichara.png',
      miniatura: 'assets/markers/barichara-thumb.jpg',
      target: 'assets/targets/barichara.mind',
      modelo: {
        titulo: 'Templo y plaza de piedra',
        aviso: 'Representación simplificada y educativa. No es una réplica arquitectónica ni está a escala.',
        accion: { etiqueta: 'Ver las 10 columnas', etiquetaActiva: 'Ocultar columnas', clave: 'columnas' },
      },
      datos: [
        { t: 'El centro histórico fue declarado Monumento Nacional el 3 de agosto de 1978.', fuente: ['wiki-barichara-es', 'wiki-barichara-en'] },
        { t: 'Sus calles, casas y templos se construyeron con piedra amarilla.', fuente: ['wiki-barichara-es'] },
        { t: 'La catedral de la Inmaculada Concepción se sostiene sobre 10 columnas monolíticas de unos 5 m de alto y 70 cm de ancho.', fuente: ['wiki-barichara-es', 'wiki-barichara-en'] },
        { t: 'Según el padre Isaías Ardila Díaz, «Barichara» significa «lugar para el descanso» en lengua guane.', fuente: ['wiki-barichara-es'] },
        { t: 'Hace parte de la Red de Pueblos Patrimonio de Colombia.', fuente: ['wiki-barichara-es', 'wiki-barichara-en'] },
        { t: 'La cabecera está a unos 1.300 m s. n. m. y Guane queda a 9 km.', fuente: ['wiki-barichara-es'] },
        { t: 'Un camino de piedra comunica la zona con Guane; la crónica de Radio Nacional lo asocia con los caminos empedrados que abrió Geo von Lengerke en el siglo XIX.', fuente: ['radionacional-lengerke'] },
      ],
      relato: 'Imagine el sonido de los pasos sobre la piedra: en Barichara el material del suelo es el mismo de los muros y del templo. La experiencia de RA pone ese templo sobre la mesa para que pueda girarlo, mirar su fachada de sillares y «abrirlo» para contar sus columnas.',
      puntos: [
        { id: 'piedra', titulo: 'Piedra amarilla', texto: 'Calles, casas y templos de Barichara se construyeron con piedra amarilla. En el modelo, la fachada está hecha de bloques de distinto tono para sugerir ese material.', fuente: ['wiki-barichara-es'] },
        { id: 'columnas', titulo: '10 columnas monolíticas', texto: 'La catedral se sostiene sobre 10 columnas monolíticas de unos 5 m de alto y 70 cm de ancho. Use «Ver las 10 columnas» para hacer translúcidos los muros.', fuente: ['wiki-barichara-es', 'wiki-barichara-en'] },
        { id: 'monumento', titulo: 'Monumento Nacional (1978)', texto: 'El centro histórico fue declarado Monumento Nacional el 3 de agosto de 1978 y el municipio hace parte de la Red de Pueblos Patrimonio de Colombia.', fuente: ['wiki-barichara-es', 'wiki-barichara-en'] },
        { id: 'nombre', titulo: '«Lugar para el descanso»', texto: 'Según el padre Isaías Ardila Díaz, el nombre significa «lugar para el descanso» en lengua guane.', fuente: ['wiki-barichara-es'] },
      ],
    },
    {
      id: 'chicamocha',
      numero: '02',
      codigo: 'CHI-02',
      nombre: 'Parque Nacional del Chicamocha',
      nombreCorto: 'Chicamocha',
      subtitulo: 'Cañón y teleférico',
      provincia: 'Vía Socorro – Bucaramanga',
      color: '#C9822E',
      resumen: 'Un parque temático sobre el cañón del río Chicamocha, cruzado por un teleférico de 6,3 km.',
      marcador: 'assets/markers/chicamocha.png',
      miniatura: 'assets/markers/chicamocha-thumb.jpg',
      target: 'assets/targets/chicamocha.mind',
      modelo: {
        titulo: 'Maqueta del cañón con teleférico',
        aviso: 'Maqueta estilizada. Relieve, profundidad y recorrido del cable no están a escala.',
        accion: { etiqueta: 'Pausar teleférico', etiquetaActiva: 'Mover teleférico', clave: 'pausa' },
      },
      datos: [
        { t: 'El parque está a 54 km de Bucaramanga, en la vía que comunica Socorro con Bucaramanga, a 1.450 m s. n. m.', fuente: ['colombiatravel-chicamocha'] },
        { t: 'Su teleférico cruza el cañón del río Chicamocha y mide 6,3 km.', fuente: ['colombiatravel-chicamocha'] },
        { t: 'Colombia Travel describe el cañón con 227 km de longitud y cerca de 2 km de profundidad.', fuente: ['colombiatravel-chicamocha'] },
        { t: 'El río Chicamocha se une con los ríos Fonce y Suárez para formar el río Sogamoso.', fuente: ['colombiatravel-chicamocha'] },
        { t: 'La temperatura varía entre 11 y 32 °C según la hora del día; la vegetación es escasa por la sequedad.', fuente: ['colombiatravel-chicamocha'] },
        { t: 'Entre sus atracciones están el Monumento a la Santandereanidad, el cable vuelo y el parapente.', fuente: ['colombiatravel-chicamocha'] },
      ],
      relato: 'Desde arriba el río parece un hilo. La maqueta aumentada permite ver el cañón en corte, seguir la cabina que lo atraviesa y entender por qué un teleférico es la forma más directa de cruzarlo.',
      puntos: [
        { id: 'teleferico', titulo: 'Teleférico de 6,3 km', texto: 'El teleférico cruza el cañón del río Chicamocha con un recorrido de 6,3 km. En la maqueta, la cabina roja se desplaza entre las dos mesetas.', fuente: ['colombiatravel-chicamocha'] },
        { id: 'profundidad', titulo: 'Un cañón profundo', texto: 'Colombia Travel describe el cañón con 227 km de longitud y cerca de 2 km de profundidad. La maqueta exagera la forma para mostrar las capas del terreno.', fuente: ['colombiatravel-chicamocha'] },
        { id: 'rio', titulo: 'Río Chicamocha', texto: 'El río recorre el fondo del cañón y se une con los ríos Fonce y Suárez para formar el Sogamoso.', fuente: ['colombiatravel-chicamocha'] },
        { id: 'parque', titulo: 'El parque', texto: 'Está a 54 km de Bucaramanga y a 1.450 m s. n. m. Incluye el Monumento a la Santandereanidad, cable vuelo y parapente.', fuente: ['colombiatravel-chicamocha'] },
      ],
    },
    {
      id: 'sangil',
      numero: '03',
      codigo: 'SGL-03',
      nombre: 'San Gil',
      subtitulo: 'Parque El Gallineral y río Fonce',
      provincia: 'Provincia de Guanentá',
      color: '#2F6B5A',
      resumen: 'Capital turística de Santander, con un centro histórico del siglo XVII y una isla de árboles cubiertos de «barba de viejo».',
      marcador: 'assets/markers/sangil.png',
      miniatura: 'assets/markers/sangil-thumb.jpg',
      target: 'assets/targets/sangil.mind',
      modelo: {
        titulo: 'Isla de El Gallineral',
        aviso: 'Representación simplificada. El número de árboles y la forma de la isla son ilustrativos.',
        accion: { etiqueta: 'Calmar el viento', etiquetaActiva: 'Activar el viento', clave: 'calma' },
      },
      datos: [
        { t: 'El auto de fundación se dictó el 17 de marzo de 1689 y la licencia de la Real Audiencia, del 11 de mayo de 1689, la tituló «Villa de Santa Cruz y San Gil de la Nueva Baeza».', fuente: ['wiki-sangil-es'] },
        { t: 'Su centro histórico, del siglo XVII y a orillas del río Fonce, es Monumento Nacional.', fuente: ['wiki-sangil-es'] },
        { t: 'Desde 2004 fue designada «Capital Turística» de Santander.', fuente: ['wiki-sangil-es'] },
        { t: 'El Parque El Gallineral ocupa una isla formada por dos brazos de la quebrada Curití, antes de su desembocadura en el río Fonce.', fuente: ['colombiatravel-sangil'] },
        { t: 'El parque alberga casi dos mil árboles cubiertos de musgo conocido como «barba de viejo».', fuente: ['colombiatravel-sangil'] },
        { t: 'El río Fonce es el principal escenario del rafting en el municipio, actividad comercial desde 1996.', fuente: ['wiki-sangil-es'] },
      ],
      relato: 'Las «barbas de viejo» se mueven con el aire como cortinas. En la isla aumentada puede activar o calmar ese viento, y ubicar los dos brazos de agua que rodean el parque antes de llegar al Fonce.',
      puntos: [
        { id: 'arboles', titulo: 'Barba de viejo', texto: 'El Gallineral alberga casi dos mil árboles cubiertos de musgo conocido como «barba de viejo». En el modelo, los filamentos grises cuelgan de las copas y se mueven con el viento.', fuente: ['colombiatravel-sangil'] },
        { id: 'isla', titulo: 'Una isla entre brazos de agua', texto: 'El parque está en una isla formada por dos brazos de la quebrada Curití, antes de que desemboque en el río Fonce.', fuente: ['colombiatravel-sangil'] },
        { id: 'fundacion', titulo: 'Fundación (1689)', texto: 'El auto de fundación de San Gil se dictó el 17 de marzo de 1689. Su centro histórico, del siglo XVII, es Monumento Nacional.', fuente: ['wiki-sangil-es'] },
        { id: 'aventura', titulo: 'Capital turística', texto: 'Desde 2004 San Gil fue designada «Capital Turística» de Santander. El río Fonce es el principal escenario del rafting.', fuente: ['wiki-sangil-es'] },
      ],
    },
  ];

  window.SANTANDER_DATA = {
    FUENTES,
    LUGARES,
    FECHA_CONSULTA: '14 de octubre de 2026',
    lugar(id) { return LUGARES.find((l) => l.id === id) || null; },
  };
})();
