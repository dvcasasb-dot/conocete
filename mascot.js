/* Mascota "Cony": ilustración SVG propia (sin imágenes externas) con 3 estados de ánimo. */
function mascot(mood){
  const col = {happy:"#7be0b0", calm:"#ffd93d", care:"#ffb26b"}[mood] || "#a98bff";
  const mouth = {happy:"M41 66q11 12 22 0", calm:"M44 70h16", care:"M42 72q10-9 20 0"}[mood] || "M44 70h16";
  const extra = mood === "care" ? '<path d="M52 2c-4-6-14 0-8 7l8 8 8-8c6-7-4-13-8-7z" fill="#ff6fae" stroke="#2b2a33" stroke-width="3" transform="translate(0 -2) scale(.8) translate(13 0)"/>' : mood === "happy" ? '<path d="M14 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM92 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffd93d" stroke="#2b2a33" stroke-width="2"/>' : "";
  return `<svg viewBox="0 0 104 124" class="mascot-svg" aria-hidden="true">
  <ellipse cx="52" cy="116" rx="30" ry="5" fill="#2b2a3322"/>
  <path d="M14 78q-12 2-10 18M90 78q12 2 10 18" fill="none" stroke="#2b2a33" stroke-width="4" stroke-linecap="round"/>
  <path d="M52 14C26 14 14 34 16 62c2 32 8 50 36 50s34-18 36-50C90 34 78 14 52 14z" fill="${col}" stroke="#2b2a33" stroke-width="4"/>
  <path d="M30 30q8-8 18-9" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <circle cx="39" cy="50" r="5.5" fill="#2b2a33"/><circle cx="65" cy="50" r="5.5" fill="#2b2a33"/>
  <circle cx="41" cy="48" r="1.8" fill="#fff"/><circle cx="67" cy="48" r="1.8" fill="#fff"/>
  <circle cx="30" cy="62" r="6" fill="#ff6fae" opacity=".55"/><circle cx="74" cy="62" r="6" fill="#ff6fae" opacity=".55"/>
  <path d="${mouth}" fill="none" stroke="#2b2a33" stroke-width="4" stroke-linecap="round"/>${extra}</svg>`;
}
