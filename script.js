/* Selecciona el ícono del menú y la lista de navegación en el HTML */
let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.nav-links');

/* Agrega un evento al hacer clic en el ícono del menú para mostrar u ocultar la barra de navegación */
menu.onclick = () => {
    navlist.classList.toggle('open');
}

/* Selecciona el botón del carrito y el contenedor del contenido del carrito */
const btnCart = document.querySelector(".container-cart-icon"); 
const contenidoCarrito = document.querySelector('.cart-content');

/* Agrega un evento al hacer clic en el botón del carrito para mostrar u ocultar su contenido */
btnCart.addEventListener('click', () => {
    contenidoCarrito.classList.toggle('hidden-cart');
})

/* Selecciona los elementos donde se mostrarán los productos agregados al carrito */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

/* Obtiene la lista de productos disponibles en la tienda */
const productsList = document.querySelectorAll('.grid-container .product');

/* Array donde se almacenarán los productos agregados al carrito */
let allProducts = [];

/* Selecciona los elementos que mostrarán el total del carrito y el número de productos */
const valorTotal = document.querySelector('.total-price');
const countProducts = document.querySelector('#contador-productos');

/* Asigna un evento click a cada botón de "Agregar al carrito" */
productsList.forEach(product => {
    const addButton = product.querySelector('.add-product-btn');
    addButton.addEventListener('click', (e) => {
        /* Crea un objeto con la información del producto seleccionado */
        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h3').textContent,
            price: product.querySelector('p').textContent
        };

        /* Verifica si el producto ya está en el carrito */
        const exist = allProducts.some(product => product.title === infoProduct.title);

        if (exist) {
            /* Si el producto ya está en el carrito, incrementa la cantidad */  
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product
                } else {
                    return product
                }
            })
            allProducts = [...products];
        } else {
            /* Si el producto no está en el carrito, se agrega al array */
            allProducts.push(infoProduct);
        }
        /* Llama a la función para actualizar la vista del carrito */
        showHTML();
    });

    /* Evento para eliminar un producto del carrito al hacer clic en el ícono de eliminar */
    rowProduct.addEventListener('click', e => {
        if (e.target.classList.contains('close-symbol')) {
            const product = e.target.parentElement;
            const title = product.querySelector('p').textContent;
            
            /* Filtra el array para eliminar el producto seleccionado */
            allProducts = allProducts.filter(product => product.title !== title);

            /* Muestra el carrito actualizado */
            showHTML();
        }
    })
});

/* Función para actualizar la vista del carrito en el HTML */
const showHTML = () => {
    /* Si el carrito está vacío, muestra un mensaje e inicializa valores */
    if (!allProducts.length) {
        rowProduct.innerHTML = '<p class="cart-empty">El carrito está vacío</p>';
        valorTotal.innerText = "$0"; 
        countProducts.innerText = "0";

        // Ocultar el contenedor del total
        document.querySelector('.cart-total-price').style.display = "none";
        return;
    }

    /* Muestra el contenedor del total cuando hay productos en el carrito */
    document.querySelector('.cart-total-price').style.display = "flex";

    /* Limpia el contenido actual del carrito */
    rowProduct.innerHTML = ``;

    let total = 0;
    let totalAllProducts = 0;

    /* Recorre los productos en el carrito y los agrega al HTML */
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

        /* Calcula el total de la compra y la cantidad total de productos */
        total = total + parseInt(product.quantity * product.price.slice(1));
        totalAllProducts = totalAllProducts + product.quantity;
    });

    /* Actualiza el total y el contador de productos en el HTML */
    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalAllProducts;
}

/* Ejecuta la función para mostrar el carrito al cargar la página */    
document.addEventListener("DOMContentLoaded", showHTML);