/* =========================================================
   RCARU · La red (mapa y números)
   ---------------------------------------------------------
   Solo instituciones y ciudades. A propósito NO se publica
   cuántos miembros hay en cada lugar, para no exponer datos
   que permitan identificar a personas.

   IMPORTANTE: por ahora son DATOS DE EJEMPLO. Mientras
   "ejemplo" sea true, la página muestra la aclaración
   "Datos de ejemplo".

   Cuando tengan los datos reales:
   1. Reemplazá la lista (nombre, ciudad, lat, lon).
      Las coordenadas se sacan de Google Maps: clic derecho
      sobre el lugar y se copian los dos números.
   2. Cambiá ejemplo a false.

   Instituciones y ciudades se cuentan solas a partir de la lista.
   ========================================================= */

window.RCARU_RED = {
  ejemplo: true,

  instituciones: [
    { nombre: "University of Cambridge", ciudad: "Cambridge", lat: 52.2043, lon: 0.1149 },
    { nombre: "MRC Laboratory of Molecular Biology", ciudad: "Cambridge", lat: 52.1755, lon: 0.1405 },
    { nombre: "Wellcome Sanger Institute", ciudad: "Hinxton", lat: 52.0794, lon: 0.1861 },
    { nombre: "University of Oxford", ciudad: "Oxford", lat: 51.7548, lon: -1.2544 },
    { nombre: "Imperial College London", ciudad: "Londres", lat: 51.4988, lon: -0.1749 },
    { nombre: "University College London", ciudad: "Londres", lat: 51.5246, lon: -0.134 },
    { nombre: "King's College London", ciudad: "Londres", lat: 51.5115, lon: -0.116 },
    { nombre: "The Francis Crick Institute", ciudad: "Londres", lat: 51.5315, lon: -0.1287 },
    { nombre: "University of Manchester", ciudad: "Manchester", lat: 53.4668, lon: -2.2339 },
    { nombre: "University of Edinburgh", ciudad: "Edimburgo", lat: 55.9445, lon: -3.1892 },
    { nombre: "University of Glasgow", ciudad: "Glasgow", lat: 55.8721, lon: -4.2882 },
    { nombre: "University of Bristol", ciudad: "Bristol", lat: 51.4584, lon: -2.603 },
    { nombre: "University of Birmingham", ciudad: "Birmingham", lat: 52.4508, lon: -1.9305 },
    { nombre: "University of Leeds", ciudad: "Leeds", lat: 53.8067, lon: -1.555 },
    { nombre: "University of Sheffield", ciudad: "Sheffield", lat: 53.3811, lon: -1.4882 },
    { nombre: "Newcastle University", ciudad: "Newcastle", lat: 54.9799, lon: -1.6146 },
    { nombre: "Cardiff University", ciudad: "Cardiff", lat: 51.4877, lon: -3.1791 },
    { nombre: "Queen's University Belfast", ciudad: "Belfast", lat: 54.5844, lon: -5.9342 },
    { nombre: "University of Nottingham", ciudad: "Nottingham", lat: 52.9388, lon: -1.1954 },
    { nombre: "University of Southampton", ciudad: "Southampton", lat: 50.935, lon: -1.3963 },
    { nombre: "Rothamsted Research", ciudad: "Harpenden", lat: 51.8094, lon: -0.356 },
    { nombre: "John Innes Centre", ciudad: "Norwich", lat: 52.6219, lon: 1.2181 },
    { nombre: "University of Aberdeen", ciudad: "Aberdeen", lat: 57.1648, lon: -2.1015 },
    { nombre: "University of St Andrews", ciudad: "St Andrews", lat: 56.3398, lon: -2.7967 },
    { nombre: "University of Dundee", ciudad: "Dundee", lat: 56.4582, lon: -2.9821 },
    { nombre: "University of Exeter", ciudad: "Exeter", lat: 50.7365, lon: -3.5344 },
    { nombre: "University of York", ciudad: "York", lat: 53.9461, lon: -1.0518 },
    { nombre: "Swansea University", ciudad: "Swansea", lat: 51.6096, lon: -3.98 }
  ]
};
