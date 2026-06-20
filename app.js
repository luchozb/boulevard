// =========================================
// CARRITO DE COMPRAS - BOULEVARD
// =========================================

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// =========================================
// ACTUALIZAR CONTADOR DEL CARRITO
// =========================================
function actualizarContadorCarrito() {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('carritoCount');
    if (contador) {
        contador.textContent = total;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// =========================================
// VERIFICAR SI EL CARRITO ESTÁ VACÍO
// =========================================
function verificarCarritoVacio() {
    if (carrito.length === 0) {
        return true;
    }
    return false;
}

// =========================================
// MANEJAR CLICS EN BOTONES
// =========================================
document.addEventListener('click', function(e) {
    
    // Botón suma (+)
    if (e.target.classList.contains('btn-suma')) {
        const input = e.target.parentElement.querySelector('.cantidad');
        let valor = parseInt(input.value);
        valor++;
        input.value = valor;
    }
    
    // Botón resta (-)
    if (e.target.classList.contains('btn-resta')) {
        const input = e.target.parentElement.querySelector('.cantidad');
        let valor = parseInt(input.value);
        if (valor > 1) {
            valor--;
            input.value = valor;
        }
    }
    
    // Botón Agregar al carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const btn = e.target;
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        const cantidad = parseInt(btn.closest('.card-body').querySelector('.cantidad').value);
        
        // Verificar si el producto ya está en el carrito
        const itemExistente = carrito.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({ id, nombre, precio, cantidad });
        }
        
        // Actualizar contador
        actualizarContadorCarrito();
        
        // Feedback visual
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Agregado';
        btn.classList.replace('btn-warning', 'btn-success');
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-cart-plus"></i> Agregar';
            btn.classList.replace('btn-success', 'btn-warning');
        }, 1000);
    }
});

// =========================================
// BOTÓN "IR A PAGAR" - VERIFICA CARRITO VACÍO
// =========================================
document.getElementById('verCarritoBtn')?.addEventListener('click', function(e) {
    if (verificarCarritoVacio()) {
        e.preventDefault();
        alert('🛒 Tu carrito está vacío. Agrega productos antes de ir a pagar.');
    }
});

// =========================================
// CARGAR PRODUCTOS EN CHECKOUT (checkout-paso1.html)
// =========================================
function cargarProductosCheckout() {
    const contenedorProductos = document.getElementById('listaProductosCheckout');
    
    if (!contenedorProductos) return;
    
    if (carrito.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <p class="text-muted mt-2">No hay productos en el carrito</p>
                <a href="catalogo.html" class="btn btn-warning btn-sm rounded-pill">
                    <i class="bi bi-bag-plus me-1"></i> Ir al catálogo
                </a>
            </div>
        `;
        return;
    }
    
    let subtotal = 0;
    
    carrito.forEach((item, index) => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;
        
        contenedorProductos.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                    <p class="mb-1 fw-bold text-dark">${item.nombre}</p>
                    <div class="input-group input-group-sm" style="width: 110px;">
                        <button class="btn btn-outline-dark btn-sm" type="button" onclick="cambiarCantidadCheckout(${index}, -1)">-</button>
                        <input type="text" class="form-control form-control-sm text-center bg-light text-dark fw-bold" value="${item.cantidad}" readonly>
                        <button class="btn btn-outline-dark btn-sm" type="button" onclick="cambiarCantidadCheckout(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="text-end">
                    <p class="mb-1 text-warning fw-bold fs-5">$${totalItem.toFixed(2)}</p>
                    <a href="#" class="text-danger small text-decoration-none" onclick="eliminarProductoCheckout(${index}); return false;">
                        <i class="bi bi-trash-fill"></i> Quitar
                    </a>
                </div>
            </div>
        `;
    });
    
    const delivery = 5.00;
    const total = subtotal + delivery;
    
    const subtotalElemento = document.getElementById('subtotalCheckout');
    const totalElemento = document.getElementById('totalCheckout');
    
    if (subtotalElemento) subtotalElemento.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElemento) totalElemento.textContent = `$${total.toFixed(2)}`;
}

// =========================================
// CAMBIAR CANTIDAD EN CHECKOUT
// =========================================
function cambiarCantidadCheckout(index, cambio) {
    if (carrito[index].cantidad + cambio > 0) {
        carrito[index].cantidad += cambio;
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
}

// =========================================
// ELIMINAR PRODUCTO EN CHECKOUT
// =========================================
function eliminarProductoCheckout(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        location.reload();
    }
}

// =========================================
// INICIAR SESIÓN / REGISTRO
// =========================================

// Cambiar entre Login y Registro
function mostrarRegistro() {
    const formularioLogin = document.getElementById('formularioLogin');
    const formularioRegistro = document.getElementById('formularioRegistro');
    if (formularioLogin && formularioRegistro) {
        formularioLogin.style.display = 'none';
        formularioRegistro.style.display = 'block';
    }
}

function mostrarLogin() {
    const formularioLogin = document.getElementById('formularioLogin');
    const formularioRegistro = document.getElementById('formularioRegistro');
    if (formularioLogin && formularioRegistro) {
        formularioLogin.style.display = 'block';
        formularioRegistro.style.display = 'none';
    }
}

// Guardar sesión de usuario
function guardarSesion(nombre, email) {
    const usuario = {
        nombre: nombre,
        email: email,
        fecha: new Date().toISOString()
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    window.location.href = 'checkout-paso1.html';
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario');
    alert('Has cerrado sesión correctamente.');
    window.location.href = 'index.html';
}

// =========================================
// VERIFICAR SESIÓN AL CARGAR PÁGINA
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Cargar productos en checkout si estamos en esa página
    cargarProductosCheckout();
    
    // Verificar si hay sesión iniciada
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const btnSesion = document.querySelector('a[href="login.html"]');
    
    if (usuario && btnSesion) {
        btnSesion.innerHTML = `<i class="bi bi-person-check-fill me-2"></i> ${usuario.nombre.split(' ')[0]}`;
        btnSesion.href = '#';
        btnSesion.onclick = function(e) {
            e.preventDefault();
            if (confirm('¿Deseas cerrar sesión?')) {
                cerrarSesion();
            }
        };
    }
});

// =========================================
// INICIALIZAR AL CARGAR
// =========================================
actualizarContadorCarrito();