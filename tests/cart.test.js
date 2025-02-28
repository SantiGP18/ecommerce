const { expect } = require('chai'); // Importamos Chai para realizar las pruebas
const { agregarProducto, eliminarProducto, calcularTotal } = require('./cart'); // Importamos las funciones a probar del archivo cart.js

describe('Funciones del Carrito de Compras', () => { 
    let carrito;

    beforeEach(() => {
        carrito = []; // Reiniciamos el carrito antes de cada prueba para evitar contaminación entre pruebas
    });
    
    it('Debe agregar un producto al carrito', () => {
        const producto = { title: 'Producto 1', price: '$10', quantity: 1 };
        carrito = agregarProducto(carrito, producto);
        
        // Verificamos que el carrito tenga exactamente un producto
        expect(carrito).to.have.lengthOf(1);
        // Verificamos que el producto agregado sea igual al esperado
        expect(carrito[0]).to.deep.equal(producto);
    });

    it('Debe eliminar un producto del carrito', () => {
        const producto1 = { title: 'Producto 1', price: '$10', quantity: 1 };
        const producto2 = { title: 'Producto 2', price: '$20', quantity: 1 };

        carrito = agregarProducto(carrito, producto1);
        carrito = agregarProducto(carrito, producto2);
        carrito = eliminarProducto(carrito, 'Producto 1'); // Eliminamos el primer producto

        // Verificamos que el carrito ahora tenga solo un producto
        expect(carrito).to.have.lengthOf(1);
        // Verificamos que el producto restante sea "Producto 2"
        expect(carrito[0].title).to.equal('Producto 2');
    });

    it('Debe calcular correctamente el total del carrito', () => {
        const producto1 = { title: 'Producto 1', price: '$10', quantity: 2 };
        const producto2 = { title: 'Producto 2', price: '$5', quantity: 3 };

        carrito = agregarProducto(carrito, producto1);
        carrito = agregarProducto(carrito, producto2);

        // Calculamos el total y verificamos que sea correcto
        const total = calcularTotal(carrito);
        expect(total).to.equal(2 * 10 + 3 * 5);
    });
});
