/* Activar barra de navegacón */
let menu = document.querySelector('#menu-icon'); /*Selecciona el elemento con el ID menu-icon en el HTML.*/

let navlist = document.querySelector('.nav-links'); /* Selecciona el elemento con la clase nav-links en el HTML. */

/* Función al evento onclick del elemento menu ´para desplegar barra de navegación */
menu.onclick = () => {
    navlist.classList.toggle('open');
}

const btnCart = document.querySelector(".container-cart-icon"); /* Ocultar información del carrito de compras*/

const contenidoCarrito = document.querySelector('.cart-content');

btnCart.addEventListener('click', () => {
    contenidoCarrito.classList.toggle('hidden-cart')
})

const cartInfo = document.querySelector('.cart-product')
const rowProduct = document.querySelector('.row-product')

const productsList = document.querySelectorAll('.grid-container .product') // Lista de todos los contenedores de productos

let allProducts = [] //Arreglo para almacenar todos los productos agregados al carrito

const valorTotal = document.querySelector('.total-price')

const countProducts = document.querySelector('#contador-productos')

//Se asigna un evento click a cada botón de "Agregar al carrito"
productsList.forEach(product => {
    const addButton = product.querySelector('.add-product-btn');
    addButton.addEventListener('click', (e) => {
        //Se obtiene y se crea un objeto con la información del producto: cantidad, título y precio.
        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h3').textContent,
            price: product.querySelector('p').textContent
        };

        const exist = allProducts.some(product => product.title === infoProduct.title) //Recorre todos los objetos y verificar ya esta un elelemto

        if (exist) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product
                } else {
                    return product
                }
            })
            allProducts = [...products]
        } else {
            allProducts.push(infoProduct) //Agregar cada producto al array
        }

        showHTML();
    });

    //Eliminar producto del carro de compras
    rowProduct.addEventListener('click', e => {
        if (e.target.classList.contains('close-symbol')) {
            const product = e.target.parentElement;
            const title = product.querySelector('p').textContent;
    
            allProducts = allProducts.filter(product => product.title !== title);
    
            console.log(allProducts);
            showHTML();
        }
    })
});

//Mostrar html 
const showHTML = () => {

    if (!allProducts.length) {
        contenidoCarrito.innerHTML = `
            <p class="cart-empty"> El carrito esta vacio </p>
        `;
    }

    //Limpiar HTML
    rowProduct.innerHTML = ``;

    let total = 0;
    let totalAllProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
        <div class="cart-product">
            <span class="product-quantity">${product.quantity}</span>
            <p class="product-name">${product.title}</p>
            <span class="product-price">${product.price}</span>
            <img class="close-symbol" src="./images/eliminar.svg" alt="">
        </div>
    `
        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalAllProducts = totalAllProducts + product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalAllProducts;
}
