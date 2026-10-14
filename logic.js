/* LÓGICA: procesamiento de respuestas (sin acceso al DOM, fácil de explicar y probar). */
function levelOf(p){ return p < 0.34 ? 0 : p < 0.67 ? 1 : 2; }

/* resp: [{a:"animo", v:0|1|2, alert:bool}] → {cats, level, alert, pct} */
function evaluate(resp){
  const by = {}; let tot = 0, max = 0;
  resp.forEach(r => {
    const c = by[r.a] || (by[r.a] = {id:r.a, sum:0, max:0});
    c.sum += r.v; c.max += 2; tot += r.v; max += 2;
  });
  const cats = Object.values(by).map(c => ({...c, pct:c.sum/c.max, level:levelOf(c.sum/c.max)}));
  let level = levelOf(tot / max);                 // 1) nivel global por porcentaje
  const high = cats.filter(c => c.level === 2).length;
  if (high >= 2) level = 2;                       // 2) varias áreas altas → alto
  else if (high === 1) level = Math.max(level, 1);// 3) un área alta → mínimo "observar"
  return {cats, level, alert:level === 2, pct:Math.round(tot / max * 100)};
}
