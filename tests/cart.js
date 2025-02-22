// Función para agregar un producto al carrito
const agregarProducto = (carrito, producto) => {
    const exist = carrito.some(item => item.title === producto.title);

    if (exist) {
        return carrito.map(item => {
            if (item.title === producto.title) {
                item.quantity++;
            }
            return item;
        });
    } else {
        return [...carrito, producto];
    }
};

// Función para eliminar un producto del carrito
const eliminarProducto = (carrito, titulo) => {
    return carrito.filter(item => item.title !== titulo);
};

// Función para calcular el total del carrito
const calcularTotal = (carrito) => {
    return carrito.reduce((total, item) => total + (item.quantity * parseFloat(item.price.slice(1))), 0);
};

// Exportamos las funciones para usarlas en los tests
module.exports = { agregarProducto, eliminarProducto, calcularTotal };
