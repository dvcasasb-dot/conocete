# Documentación técnica · CONÓCETE

## 1. Relación con el proyecto de grado
- **Pregunta problema:** ¿Cómo ayudar a los estudiantes de grado Décimo a identificar y reconocer síntomas de depresión adolescente?
- **Objetivo 3:** diseñar una herramienta para detectar síntomas y facilitar su atención oportuna → esta plataforma.
- **Variable independiente:** la aplicación. **Variable dependiente:** nivel de identificación y reconocimiento de síntomas.
- **Marco legal:** Ley 1616 de 2013 (salud mental), Ley 1098 de 2006 (infancia y adolescencia) y protección de datos: la plataforma **no pide nombre ni datos personales**; solo con consentimiento guarda respuestas anónimas.

## 2. Flujo de la aplicación
Inicio → Elección de aspectos → Cuestionario (progresivo) → Procesamiento → Resultado → Recursos / Volver al inicio.

## 3. Arquitectura
| Archivo | Responsabilidad |
|---|---|
| index.html | Estructura semántica de las 5 pantallas (una activa a la vez) |
| styles.css | Estilo, variables de color, rejilla fluida, `prefers-reduced-motion` |
| data.js | Contenido: aspectos, 16 preguntas, textos, consejos |
| logic.js | Función `evaluate()`: puntaje y clasificación |
| app.js | Eventos, barra de progreso, render del resultado |

Separar datos, lógica e interfaz permite cambiar preguntas sin tocar el código de cálculo.

## 4. Lógica de procesamiento
Cada pregunta tiene 3 opciones con puntaje 0, 1 o 2 (frecuencia/intensidad, como en la encuesta diagnóstica aplicada).
1. Por aspecto: `porcentaje = suma / (preguntas × 2)`. Menos de 34 % → *Vas bien*; 34–66 % → *Para observar*; 67 % o más → *Importante atender*.
2. Nivel global: porcentaje total con la misma escala.
3. Ajustes: dos o más aspectos altos → nivel global alto; un aspecto alto → mínimo "observar".
4. **Porcentaje:** se muestra el porcentaje total de señales (0 % = ninguna, 100 % = máximo) y el de cada aspecto. No se pregunta directamente por autolesión (lenguaje adecuado al ambiente escolar); en cambio, un resultado alto muestra siempre un aviso con orientación escolar y la línea 106.

## 5. Decisiones de diseño
- Basado en los bocetos del equipo (portada, bienvenida/preguntas, resultado) con un color por aspecto.
- Lenguaje no diagnóstico: "señales para observar", nunca "tienes depresión".
- Anónimo y con consentimiento explícito; sin servidor propio; funciona en GitHub Pages.
- Accesibilidad: foco visible, botones nativos, `aria-pressed`, `role="progressbar"`, movimiento reducido.

## 6. Limitaciones y trabajo futuro
- No es un instrumento clínico validado (como PHQ-A o BDI): es orientación educativa. Conviene que orientación escolar o psicología revise las preguntas.
- Los puntos de corte son orientativos, no validados estadísticamente.
- Futuro: más aspectos (amigos, redes sociales), validación con la muestra del colegio.

## 7. Pruebas sugeridas
Todo con la opción 1 (resultado verde); todo con la 3 (resultado alto); pregunta de seguridad con "Alguna vez" (debe aparecer el aviso). Probar en celular, tableta y computador.

## 8. Sistematización de datos
- **Individual:** al final, cada estudiante ve "Mi resumen de respuestas" (pregunta y respuesta elegida).
- **Colectiva:** la pantalla "Datos" muestra participantes, puntaje promedio, alertas, distribución por nivel, por aspecto y por pregunta (equivalente a las gráficas de la encuesta diagnóstica), con un análisis automático en texto.
- **Almacenamiento:** si el estudiante acepta, el registro (fecha, aspectos, nivel, porcentaje, alerta y respuestas; sin nombre) se guarda en `localStorage` de ese dispositivo. Para reunir datos de varios dispositivos se usa Google Sheets (ver `RECOLECCION_GOOGLE_SHEETS.md`) y luego se carga el CSV en la pantalla "Datos".
- **Exportar:** botón "Descargar CSV" para analizar en Excel o Sheets.
