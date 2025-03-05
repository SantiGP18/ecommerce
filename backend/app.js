require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json()); // Permite manejar JSON en las peticiones
app.use(cors()); // Habilita CORS para el Front-End
app.use(morgan('dev')); // Muestra logs de las peticiones en la terminal

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});