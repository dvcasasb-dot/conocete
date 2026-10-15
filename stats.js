/* SISTEMATIZACIÓN DE DATOS: guarda respuestas anónimas (con consentimiento), las resume y exporta. */
const COLLECT_URL = "https://script.google.com/macros/s/AKfycbxs4rOv4uHBOKDJk35J9xFP_20w2vY5qCL8OFjcrpdg7yiJnNdYuuAE1UNKoSmVNtcf/exec";        // Opcional: URL de Google Apps Script para reunir datos de todos los estudiantes (ver docs/RECOLECCION_GOOGLE_SHEETS.md)
const CONSENT_DEFAULT = false; // true = casilla de consentimiento marcada de inicio (úsenlo solo si el colegio ya tiene autorización de acudientes)
const KEYS = Object.keys(QUESTIONS).flatMap(a => QUESTIONS[a].map((_, i) => a + "_" + i));
const HEAD = ["fecha","aspectos","nivel","porcentaje","alerta", ...KEYS];
const STORE = "conocete_datos_v1", LV = ["var(--g)","var(--y)","var(--o)"];
let viewData = null;           // datos cargados desde un CSV (no se guardan)

function getLocal(){ try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch(e){ return []; } }
function toRow(x){ return [x.f, x.asp.join("|"), x.n, x.p, x.al, ...KEYS.map(k => x.r[k] ?? "")]; }
function fromRow(c){ const r = {}; KEYS.forEach((k, i) => { const v = c[5 + i]; if (v !== undefined && v !== "") r[k] = +v; });
  return {f:c[0], asp:(c[1] || "").split("|").filter(Boolean), n:+c[2], p:+c[3], al:+c[4], r}; }
function toCSV(d){ return [HEAD, ...d.map(toRow)].map(r => r.join(",")).join("\n"); }
function parseCSV(t){ return t.trim().split(/\r?\n/).slice(1).map(l => fromRow(l.split(",").map(s => s.replace(/^"|"$/g, "")))).filter(x => !isNaN(x.n)); }

function saveRecord(rec){
  try { const d = getLocal(); d.push(rec); localStorage.setItem(STORE, JSON.stringify(d)); } catch(e){}
  if (COLLECT_URL) fetch(COLLECT_URL, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body:JSON.stringify(toRow(rec))}).catch(() => {});
}

function renderStats(){
  const d = viewData || getLocal(), box = $("#statsBox");
  if (!d.length){ box.innerHTML = '<div class="box blue"><p>Aún no hay datos. Aparecerán cuando los estudiantes respondan y acepten guardar sus respuestas anónimas, o cuando cargues un archivo CSV.</p></div>'; return; }
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0, n = d.length;
  const lv = [0,0,0]; d.forEach(x => lv[x.n]++);
  const avg = Math.round(d.reduce((s, x) => s + x.p, 0) / n), al = d.filter(x => x.al).length;
  const stack = a => `<div class="stack">${a.map((v, i) => `<i style="width:${v}%;background:${LV[i]}">${v >= 12 ? v + "%" : ""}</i>`).join("")}</div>`;
  const rows = ASPECTS.map(a => {
    const ks = KEYS.filter(k => k.startsWith(a.id + "_")), l = [0,0,0]; let c = 0, sp = 0;
    d.forEach(x => { const v = ks.filter(k => k in x.r).map(k => x.r[k]); if (!v.length) return; c++; const p = v.reduce((s, y) => s + y, 0) / (2 * v.length); sp += p; l[levelOf(p)]++; });
    return {a, c, l, avg:c ? Math.round(sp / c * 100) : 0, att:pct(l[1] + l[2], c)};
  }).filter(r => r.c);
  const top = rows.slice().sort((x, y) => y.att - x.att)[0];
  const qs = KEYS.map(k => { const [aid, i] = k.split("_"), q = QUESTIONS[aid][i], c = [0,0,0]; let t = 0;
    d.forEach(x => { if (k in x.r){ c[x.r[k]]++; t++; } }); if (!t) return "";
    return `<div class="qcard"><b>${aspect(aid).icon} ${q.t}</b> <small>(n=${t})</small>${q.o.map((o, j) =>
      `<div class="qbar"><span>${o}</span><div><i style="width:${pct(c[j], t)}%;background:${LV[j]}"></i></div><em>${pct(c[j], t)}%</em></div>`).join("")}</div>`; }).join("");
  box.innerHTML = `
  <div class="kpis"><div class="kpi"><b>${n}</b>participantes</div><div class="kpi"><b>${avg}%</b>puntaje promedio</div><div class="kpi"><b>${al}</b>con nivel alto</div></div>
  <p class="legend"><span style="--c:var(--g)">Vas bien</span><span style="--c:var(--y)">Para observar</span><span style="--c:var(--o)">Importante atender</span></p>
  <h3>Nivel general</h3>${stack(lv.map(v => pct(v, n)))}
  <h3>Por aspecto</h3>${rows.map(r => `<div class="arow"><span>${r.a.icon} ${r.a.name} <small>(n=${r.c} · promedio ${r.avg}%)</small></span>${stack(r.l.map(v => pct(v, r.c)))}</div>`).join("")}
  <div class="box purple"><h3>🔎 Análisis</h3><p>De ${n} participantes, el ${pct(lv[1] + lv[2], n)}% quedó en nivel "para observar" o "importante atender".${top ? ` El aspecto con más señales es <b>${top.a.name}</b> (${top.att}% de quienes lo respondieron). ` : ""}${al ? `${al} participante(s) (${pct(al, n)}%) quedaron en nivel alto: son los casos que orientación escolar debería priorizar.` : "Ningún participante quedó en nivel alto."}</p></div>
  <h3>Por pregunta</h3>${qs}`;
}
