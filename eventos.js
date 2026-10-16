/* =========================================================
   RCARU · Eventos
   ---------------------------------------------------------
   Para agregar un evento, copiá un bloque { ... } y cambiá
   los datos. El orden no importa: la página los ordena sola.

   - Los eventos con fecha de hoy o futura aparecen como
     "Próximo encuentro". Cuando la fecha pasa, el evento
     se mueve solo al archivo de encuentros anteriores.
   - fecha: "AAAA-MM-DD"
   - hora:  "14:00–18:00" (opcional, dejar "" si no se sabe)
   - foto:  ruta a una imagen en img/eventos/ (opcional)
   - enlace / programa: opcionales, dejar "" si no hay
   ========================================================= */

window.RCARU_EVENTOS = [
  {
    fecha: "2026-11-06",
    hora: "",
    titulo: {
      es: "Jornada científica anual 2026",
      en: "Annual science day 2026"
    },
    lugar: {
      es: "49 Belgrave Square, Londres SW1X 8QZ",
      en: "49 Belgrave Square, London SW1X 8QZ"
    },
    mapa: "https://www.google.com/maps/search/?api=1&query=49+Belgrave+Square+London+SW1X+8QZ",
    resumen: {
      es: "Una tarde de ciencia, innovación y vinculación entre colegas del Reino Unido y Argentina. Se puede asistir en persona o seguirla en forma virtual.",
      en: "An afternoon of science, innovation and connection between colleagues from the UK and Argentina. Attend in person or join online."
    },
    nota: {
      es: "Inscripción gratuita. Es necesario registrarse porque el espacio es limitado.",
      en: "Free to attend. Registration is required as space is limited."
    },
    enlace: "https://luma.com/0qqw8fd8",
    programa: "",          // p. ej. "docs/programa-jornada-2026.pdf"
    foto: ""               // p. ej. "img/eventos/jornada-2026.jpg"
  }

  // Encuentros anteriores: agregalos acá, por ejemplo:
  // ,{
  //   fecha: "2025-11-07",
  //   hora: "",
  //   titulo: { es: "Jornada científica anual 2025", en: "Annual science day 2025" },
  //   lugar:  { es: "Londres", en: "London" },
  //   mapa: "",
  //   resumen: { es: "Una línea sobre qué pasó.", en: "One line on what happened." },
  //   nota: { es: "", en: "" },
  //   enlace: "", programa: "",
  //   foto: "img/eventos/jornada-2025.jpg"
  // }
];
