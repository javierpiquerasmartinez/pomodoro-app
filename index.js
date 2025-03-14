const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para registrar solicitudes
app.use((req, res, next) => {
  console.log(`Usuario ha accedido a: ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

// Servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname)));

// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  console.log(`Usuario ha accedido a: ${req.url} - ${new Date().toLocaleString()}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta comodín para manejar rutas no definidas y devolver 404
app.get('*', (req, res) => {
  res.status(404).send('404 - Not found');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});