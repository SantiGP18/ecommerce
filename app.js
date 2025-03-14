const apiUrl = "http://localhost:5000"; 

// REGISTRO DE USUARIO
async function registrarUsuario() {
    const nombre = document.getElementById("regNombre").value;
    const password = document.getElementById("regPassword").value;

    const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Registro exitoso, ahora puedes iniciar sesión");
        window.location.href = "index.html";
    } else {
        alert(data.message);
    }
}

// INICIO DE SESIÓN
async function iniciarSesion() {
    const nombre = document.getElementById("loginNombre").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token); // Guarda el token JWT
        alert("Inicio de sesión exitoso");
        window.location.href = "tienda.html";
    } else {
        alert(data.message);
    }
}

// VERIFICAR SESIÓN (protege las páginas internas)
async function verificarSesion() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Acceso denegado, inicia sesión primero");
        window.location.href = "index.html";
    }
}

// Cerrar sesión
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token'); // Elimina el token
            alert('Sesión cerrada correctamente'); // Mensaje opcional
            window.location.href = 'index.html'; // Redirige al login
        });
    }
});

fetch(`${apiUrl}/productos`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
    .then(response => response.json())
    .then(productos => {
        productos.forEach(producto => {
            console.log(`Producto: ${producto.nombre}, Precio: ${producto.precio}`);
            // Aquí puedes agregar la lógica para mostrarlos en el frontend
        });
    })
    .catch(err => console.error('Error al obtener los productos:', err));







