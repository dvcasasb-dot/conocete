/* INTERFAZ: navegación, preguntas progresivas y resultado. */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const st = {sel:new Set(), list:[], i:0, ans:[]};
const aspect = id => ASPECTS.find(a => a.id === id);

function go(id){
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top:0}); if (id === "stats") renderStats();
  const h = $("#" + id + " [tabindex='-1']"); if (h) h.focus({preventScroll:true});
}
function reset(){ st.sel.clear(); st.list = []; st.ans = []; st.i = 0; $$(".aspect").forEach(b => b.setAttribute("aria-pressed","false")); $("#start").disabled = true; }

/* Elegir aspectos */
$("#aspects").innerHTML = ASPECTS.map(a =>
  `<button class="aspect" style="--c:${a.color}" aria-pressed="false" data-id="${a.id}"><span class="ic">${a.icon}</span>${a.name}</button>`).join("");
$("#aspects").addEventListener("click", e => {
  const b = e.target.closest(".aspect"); if (!b) return;
  const on = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", on); on ? st.sel.add(b.dataset.id) : st.sel.delete(b.dataset.id);
  $("#start").disabled = st.sel.size === 0;
});
$("#start").addEventListener("click", () => {
  st.list = ASPECTS.filter(a => st.sel.has(a.id)).flatMap(a => QUESTIONS[a.id].map((q, i) => ({...q, a:a.id, i})));
  st.i = 0; st.ans = []; renderQ(); go("quiz");
});

/* Preguntas */
function renderQ(){
  const q = st.list[st.i], n = st.list.length, a = aspect(q.a);
  $("#bar").style.width = (st.i / n * 100) + "%";
  $(".bar").setAttribute("aria-valuenow", Math.round(st.i / n * 100));
  $("#count").textContent = `Pregunta ${st.i + 1} de ${n}`;
  const chip = $("#qaspect"); chip.textContent = a.icon + " " + a.name; chip.style.setProperty("--c", a.color);
  $("#qtext").textContent = q.t;
  $("#opts").innerHTML = q.o.map((t, k) =>
    `<button class="opt${st.ans[st.i] === k ? " sel" : ""}" data-v="${k}"><span class="em">${FACES[k]}</span>${t}</button>`).join("");
}
$("#opts").addEventListener("click", e => {
  const b = e.target.closest(".opt"); if (!b) return;
  st.ans[st.i] = +b.dataset.v; $$(".opt").forEach(o => o.classList.toggle("sel", o === b));
  setTimeout(() => {
    if (st.i < st.list.length - 1){ st.i++; renderQ(); $("#qtext").focus({preventScroll:true}); }
    else showResult();
  }, 280);
});
$("#prev").addEventListener("click", () => { if (st.i > 0){ st.i--; renderQ(); } else go("pick"); });

/* Resultado */
function showResult(){
  const r = evaluate(st.list.map((q, k) => ({a:q.a, v:st.ans[k], alert:!!q.alert})));
  const R = RESULTS[r.level];
  const rec = {f:new Date().toISOString().slice(0, 10), asp:[...st.sel], n:r.level, p:r.pct, al:r.alert ? 1 : 0, r:{}};
  st.list.forEach((q, k) => { rec.r[q.a + "_" + q.i] = st.ans[k]; });
  const saved = $("#consent").checked; if (saved) saveRecord(rec);
  const mine = `<details class="box blue"><summary><b>📋 Mi resumen de respuestas</b></summary><table class="tbl"><tr><th>Pregunta</th><th>Mi respuesta</th></tr>${st.list.map((q, k) => `<tr><td>${q.t}</td><td>${FACES[st.ans[k]]} ${q.o[st.ans[k]]}</td></tr>`).join("")}</table></details>`;
  const crisis = r.alert ? `<div class="alert"><b>No estás solo/a.</b> Si lo que sientes pesa mucho, habla hoy con un adulto de confianza o con orientación escolar. Puedes llamar gratis a la línea <a href="tel:106">106</a> (Bogotá, 24 h).</div>` : "";
  const cards = r.cats.map(c => { const a = aspect(c.id);
    return `<div class="card" style="--c:${a.color}"><header><span>${a.icon} ${a.name}</span><span>${LEVEL_LABEL[c.level]} · ${Math.round(c.pct * 100)}%</span></header>
    <div class="meter"><i style="width:${Math.max(6, Math.round(c.pct*100))}%"></i></div>${c.level > 0 ? `<p>${TIPS[c.id]}</p>` : ""}</div>`; }).join("");
  $("#resultBox").innerHTML = `<p class="only-print"><b>Informe personal · CONÓCETE</b> · ${new Date().toLocaleDateString("es-CO")}</p>${crisis}
  <div class="res-head"><div class="mascot big">${mascot(["happy","calm","care"][r.level])}</div><h2 tabindex="-1">${R.title}</h2><div class="gauge" style="--p:${r.pct};--c:${LV[r.level]}"><b>${r.pct}%</b><small>nivel de señales</small></div><p>${R.text}</p><p class="note">Entre más alto el porcentaje, más señales conviene observar (0 % = ninguna; 100 % = todas al máximo).</p></div>
  <div class="cards">${cards}</div>${mine}
  <div class="box purple"><h3>¿Qué puedes hacer?</h3><ul><li>Hablar con alguien de confianza.</li><li>Cuidar tus hábitos: dormir, comer bien y moverte.</li><li>Recordar que no estás solo/a.</li></ul></div>
  <h3>Puedes hablar con</h3><div class="who"><span>Profesor/a</span><span>Amigo/a</span><span>Familia</span><span>Profesional de la salud</span></div>
  <p class="bubble">Pedir ayuda también es una forma de valentía.</p>
  <p class="note">Este resultado es una orientación educativa, no un diagnóstico. ${saved ? "✅ Tus respuestas se guardaron de forma anónima." : "Tus respuestas no se guardaron."}</p>
  <div class="row"><button class="btn" onclick="window.print()">🖨️ Guardar mi informe (PDF)</button><button class="btn green" data-go="resources">Ver recursos de ayuda</button><button class="btn ghost" data-go="home">Volver al inicio</button></div>`;
  go("result");
}

/* Navegación global */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if (!b) return;
  if (b.dataset.go === "home") reset();
  go(b.dataset.go);
});

/* Decoración inicial: mascota y título con letras de colores */
$$(".mascot[data-mood]").forEach(m => m.innerHTML = mascot(m.dataset.mood));
const h1 = $("#home h1"), pal = ["--p","--b","--o","--g","--v","--p","--b","--o"];
h1.innerHTML = [...h1.textContent].map((c, i) => `<span style="color:var(${pal[i % pal.length]});animation-delay:${i*.08}s">${c}</span>`).join("");

/* Sistematización: consentimiento, exportar, cargar y borrar */
$("#consent").checked = CONSENT_DEFAULT;
$("#dlCsv").addEventListener("click", () => { const d = viewData || getLocal(); if (!d.length) return alert("No hay datos para descargar.");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + toCSV(d)], {type:"text/csv"})); a.download = "conocete_datos.csv"; a.click(); });
$("#loadCsv").addEventListener("change", e => { const f = e.target.files[0]; if (!f) return;
  f.text().then(t => { viewData = parseCSV(t); renderStats(); }); e.target.value = ""; });
$("#clearData").addEventListener("click", () => { if (confirm("¿Borrar los datos guardados en este dispositivo?")){ try { localStorage.removeItem(STORE); } catch(e){} viewData = null; renderStats(); } });

/* Al imprimir, abrir los resúmenes desplegables */
window.addEventListener("beforeprint", () => $$("details").forEach(x => x.open = true));
