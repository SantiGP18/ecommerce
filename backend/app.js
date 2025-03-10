require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize, Usuario, Pedido, Producto, DetallePedido } = require('./models');

const app = express();

// Middleware
app.use(express.json()); // Permite manejar JSON en las peticiones
app.use(cors()); // Habilita CORS para el Front-End
app.use(morgan('dev')); // Muestra logs de las peticiones en la terminal


// Probar la conexión con la base de datos
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

//Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/check-associations', (req, res) => {
    try {
        const associations = {};
        
        // Obtener los modelos cargados en Sequelize
        Object.keys(sequelize.models).forEach(modelName => {
            const model = sequelize.models[modelName];
            associations[modelName] = Object.keys(model.associations);
        });

        res.json({ message: "Asociaciones cargadas correctamente", associations });
    } catch (error) {
        console.error("Error al verificar asociaciones:", error);
        res.status(500).json({ error: "Error al verificar asociaciones" });
    }
});

app.get('/test-relations', async (req, res) => {
    try {
        // Crear un usuario
        const usuario = await Usuario.create({ nombre: 'Juan Pérez', password: '1234' });

        // Crear un pedido asociado a ese usuario
        const pedido = await Pedido.create({ usuario_id: usuario.id, total: 150 });

        // Crear un producto
        const producto = await Producto.create({ nombre: 'Laptop', precio: 1200 });

        // Agregar producto al detalle del pedido
        const detalle = await DetallePedido.create({    
            pedido_id: pedido.id, 
            producto_id: producto.id, 
            cantidad_producto: 1 
        });

        res.json({ message: 'Datos creados exitosamente', usuario, pedido, producto, detalle });
    } catch (error) {
        console.error('Error al probar relaciones:', error);
        res.status(500).json({ error: 'Error al probar relaciones', details: error });
    }
});


