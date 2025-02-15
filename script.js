/* Activar barra de navegacón */

/*Selecciona el elemento con el ID menu-icon en el HTML.*/
let menu = document.querySelector('#menu-icon');

/* Selecciona el elemento con la clase nav-links en el HTML. */
let navlist = document.querySelector('.nav-links');

/* Función al evento onclick del elemento menu ´para desplegar barra de navegación */
menu.onclick = () => {
    navlist.classList.toggle('open');
}

/* Ocultar información del carrito de compras*/
const btnCart = document.querySelector(".container-cart-icon");

const contenidoCarrito = document.querySelector('.cart-content');

btnCart.addEventListener('click', () => {
    contenidoCarrito.classList.toggle('hidden-cart')
})

/* Funcionalidades para el carrito de compra*/
const cartInfo = document.querySelector('.cart-product') 
const rowProduct = document.querySelector('.row-product')

// Lista de todos los contenedores
const productsList = document.querySelector('.grid-container .product')

//Arreglo de todos los productos
let allProducts = []

// Verificar si se pulsa el botón de agregar al carrito
productsList.addEventListener('click', e  => {
    if ((e.target.classList.contains('add-product-btn'))) {
        const product = e.target.parentElement //Almacenar el producto  seleccionado

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h3').textContent,
            price: product.querySelector('p').textContent,
        }
        console.log(infoProduct)
    }
})