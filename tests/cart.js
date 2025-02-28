// Función para agregar un producto al carrito
const agregarProducto = (carrito, producto) => {
    // Verifica si el producto ya está en el carrito usando .some() y devuelve true si al menos un elemento del array cumple la condición
    const exist = carrito.some(item => item.title === producto.title);

    if (exist) {
        // Si el producto ya existe, usamos .map() para recorrer el array y actualizar la cantidad
        // .map() crea un nuevo array con los cambios sin modificar el original
        return carrito.map(item => {
            if (item.title === producto.title) {
                item.quantity++;
            }
            return item;
        });
    } else {
        // Si el producto no existe, lo agregamos al carrito creando un nuevo array con [...]
        return [...carrito, producto];
    }
};

// Función para eliminar un producto del carrito
const eliminarProducto = (carrito, titulo) => {
    // .filter() devuelve un nuevo array con todos los elementos que cumplan la condición
    // En este caso, excluimos el producto cuyo título coincida con el parámetro "titulo"
    return carrito.filter(item => item.title !== titulo);
};

// Función para calcular el total del carrito
const calcularTotal = (carrito) => {
    // .reduce() recorre el array y acumula un valor (en este caso, el total del precio)
    // .slice(1) elimina el primer carácter del precio (asumiendo que es el símbolo de moneda)
    return carrito.reduce((total, item) => total + (item.quantity * parseFloat(item.price.slice(1))), 0);
};

// Exportamos las funciones para usarlas en pruebas unitarias
module.exports = { agregarProducto, eliminarProducto, calcularTotal };
