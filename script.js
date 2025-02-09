/*Selecciona el elemento con el ID menu-icon en el HTML.*/
let menu = document.querySelector('#menu-icon');

/* Selecciona el elemento con la clase nav-links en el HTML. */
let navlist = document.querySelector('.nav-links');

/* Función al evento onclick del elemento menu ´para desplegar barra de navegación */
menu.onclick = () => {
    navlist.classList.toggle('open');
}