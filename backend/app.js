// Importaciones necesarias
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const xssClean = require('xss-clean');
const helmet = require('helmet');

const { sequelize, Usuario, Pedido, Producto, DetallePedido } = require('./models');

const app = express();

// Middleware básico
app.use(express.json()); // Permite manejar JSON en las peticiones
app.use(cors()); // Permite solicitudes desde el frontend
app.use(morgan('dev')); // Muestra logs de las peticiones en la terminal
app.use(xssClean()); // Limpia los inputs
app.use(helmet()); // Configura headers seguros automáticamente
    
// Probar la conexión con la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Productos iniciales
const productosIniciales = [
    { nombre: 'Pantalon beige', precio: 5 },
    { nombre: 'Pantalon blanco', precio: 5 },
    { nombre: 'Pantalon negro', precio: 5 },
    { nombre: 'Pantalon de drill', precio: 5 },
    { nombre: 'Pantalon verde', precio: 5 },
    { nombre: 'Camiseta azul marino', precio: 5 },
    { nombre: 'Camiseta azul roja', precio: 5 },
    { nombre: 'Camiseta veranera', precio: 5 },
    { nombre: 'Camiseta verde', precio: 5 },
    { nombre: 'Camiseta azul claro', precio: 5 },
    { nombre: 'Abrigo acolchado azul', precio: 5 },
    { nombre: 'Abrigo oscuro en lana', precio: 5 },
    { nombre: 'Abrigo gris en lana', precio: 5 },
    { nombre: 'Abrigo acolchado negro', precio: 5 },
    { nombre: 'Abrigo deportivo negro', precio: 5 }
];

// Función para cargar los productos iniciales si no existen
const cargarProductosIniciales = async () => {
    try {
        for (const producto of productosIniciales) {
            const productoExistente = await Producto.findOne({ where: { nombre: producto.nombre } });
            if (!productoExistente) {
                await Producto.create(producto);
                console.log(`Producto agregado: ${producto.nombre}`);
            } else {
                console.log(`El producto "${producto.nombre}" ya existe`);
            }
        }
    } catch (error) {
        console.error('Error al cargar productos iniciales:', error);
    }
};

// Cargar productos iniciales al arrancar el servidor
cargarProductosIniciales();

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

// Ruta para agregar productos
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio } = req.body;

        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
        }

        const nuevoProducto = await Producto.create({ nombre, precio });
        res.status(201).json({ message: 'Producto agregado', id: nuevoProducto.id });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta para obtener productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/usuario', verificarToken, (req, res) => {
    res.set('Cache-Control', 'no-store'); // Evita caché
    res.json({ nombre: req.user.nombre });
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

app.post('/finalizarPedido', verificarToken, async (req, res) => {
    const { carrito } = req.body; // Recibimos el carrito desde el frontend
    const usuarioId = req.user.id;

    try {
        // Calcular el total del pedido
        let total = 0;
        for (const item of carrito) {
            const producto = await Producto.findByPk(item.producto_id);
            if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
            total += producto.precio * item.cantidad_producto;
        }

        // Crear el pedido
        const nuevoPedido = await Pedido.create({
            usuario_id: usuarioId,
            total,
        });

        // Crear los detalles del pedido
        for (const item of carrito) {
            await DetallePedido.create({
                pedido_id: nuevoPedido.id,
                producto_id: item.producto_id,
                cantidad_producto: item.cantidad_producto,
            });
        }

        res.status(201).json({ message: 'Pedido guardado exitosamente' });

    } catch (error) {
        console.error('Error al finalizar el pedido:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
