const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname)));

// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});