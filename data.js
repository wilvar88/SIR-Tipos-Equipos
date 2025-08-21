// data.js — versión limpia

/* ===== HOTSPOTS (puedes editar/añadir los tuyos) ===== */
window.HOTSPOTS = [
  { x: 55.6, y: 45.2, n: 2,  title: "Acciones submódulo tipo equipos:",      text: "Se encuentra un campo de búsqueda el cual filtra según los parámetros insertados, se tiene el botón de exportar el cual permite descargar el listado de los tipos de equipos en diferentes formatos, se tiene el botón para crear un nuevo tipo de equipos en este formulario se solicita el nombre y las características de este tipo de equipo." },
  { x: 80.0, y: 59.2, n: 3,  title: "Acciones tipo de equipos:",     text: "Estas acciones permiten gestionar un tipo de equipo seleccionado, se tiene el botón para editar el tipo de equipo y eliminarlo." },
  { x: 40.0, y: 28.2, n: 1,  title: "Tipos Equipos",     text: "El submódulo de tipos de equipos permite crear los diferentes tipos de equipos con los que va a contar el sistema." },
];

/* ===== BOTONES flotantes =====
   IMPORTANTE: El último objeto NO lleva coma al final.
*/
window.BUTTONS = [
  { x: 95, y: 95, label: "Manual",        href: "manuales/MANUAL SIR EQUIPOS.pdf", target: "blank", variant: "ghost" },

  {
    x: 85.9, y: 95, // Menu SIR
    label: "Equipos",
    href: "https://wilvar88.github.io/SIR-Gesti-n-de-Equipos/",
    target: "self",
    // Si quieres totalmente transparente, puedes usar la variante 'transparent'
    // (ojo: pone background transparente con !important)
    variant: "transparent",
    style: {
      // Como usamos la variante 'transparent', NO pongas bg aquí.
      bg: "#9d9d9ddf",
      bgOpacity: 9.1,
      textColor: "#222121ff",
      width: 90,
      height: 28,
      fontSize: 12,
      fontWeight: 600,
      radius: 200,
      shadow: false,           // sin sombra
      borderColor: "transparent"
    }
  },
  
];
