// Importaciones necesarias
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const { sequelize, Usuario, Pedido, Producto, DetallePedido } = require('./models');

const app = express();

// Middleware básico
app.use(express.json()); // Permite manejar JSON en las peticiones
app.use(cors()); // Habilita CORS para el Front-End
app.use(morgan('dev')); // Muestra logs de las peticiones en la terminal

// Probar la conexión con la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Registro de usuario
app.post('/register', async (req, res) => {
    const {nombre, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { nombre } });
        if (usuarioExistente) return res.status(400).json({ message: 'El usuario ya existe' });

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({ nombre, password: passwordHash });
        res.status(201).json({ message: 'Usuario registrado correctamente', usuario: nuevoUsuario });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { nombre, password } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { nombre } });
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Comparar contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return res.status(401).json({ message: 'Contraseña incorrecta' });

        // Crear token JWT
        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta protegida de ejemplo
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

app.get('/perfil', verificarToken, (req, res) => {
    res.json({ message: 'Bienvenido al perfil protegido', user: req.user });
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