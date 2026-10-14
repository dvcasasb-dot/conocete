# Reunir las respuestas de todos los estudiantes (gratis, con Google Sheets)

GitHub Pages no tiene base de datos, así que cada celular o computador guarda solo sus datos. Para juntarlos todos en un solo lugar:

1. Crea una hoja nueva en Google Sheets (cuenta del proyecto o del colegio).
2. En la fila 1 escribe estos encabezados, uno por celda:
   `fecha, aspectos, nivel, porcentaje, alerta, animo_0, animo_1, animo_2, animo_3, energia_0, energia_1, energia_2, sueno_0, sueno_1, sueno_2, familia_0, familia_1, familia_2, colegio_0, colegio_1, colegio_2`
3. Menú **Extensiones → Apps Script**, borra lo que haya y pega:
```js
function doPost(e) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sh.appendRow(JSON.parse(e.postData.contents));
  return ContentService.createTextOutput("ok");
}
```
4. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: *Yo*. Quién tiene acceso: *Cualquier persona*. Autoriza los permisos y copia la URL que termina en `/exec`.
5. En `js/stats.js` pega esa URL en `const COLLECT_URL = "…";` y vuelve a subir el archivo a GitHub.
6. Para analizar: en la hoja, **Archivo → Descargar → CSV**; en CONÓCETE abre **Datos → Cargar CSV**.

Notas: solo se envían respuestas de quienes marcaron el consentimiento y no se envía nombre. La URL queda visible en el código público: cualquiera que la conozca podría enviar filas falsas, así que revisen los datos antes de analizarlos.
