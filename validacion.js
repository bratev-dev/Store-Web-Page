/**
 * @fileoverview Script para la interactividad y validación de la Tienda Don Teo.
 * CORREGIDO: Se ajusta la lógica de validación para el nombre del producto.
 */

// --- EVENTOS DE INTERACTIVIDAD GENERAL (se ejecutan cuando el DOM está listo) ---
document.addEventListener('DOMContentLoaded', function () {

    // --- MANEJO DE BOTONES "AGREGAR" Y CATEGORÍAS ---
    const botonesAgregar = document.querySelectorAll('.card .btn-primary');
    const categorias = document.querySelectorAll('.list-group-item');

    categorias.forEach(categoria => {
        categoria.addEventListener('click', function () {
            categorias.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function () {
            botonesAgregar.forEach(b => {
                if (b.classList.contains('agregado')) {
                    b.classList.remove('agregado');
                    b.innerHTML = 'Agregar';
                }
            });
            this.classList.add('agregado');
            this.innerHTML = '<i class="fas fa-check"></i> Agregado';
            setTimeout(() => {
                if (this.classList.contains('agregado')) {
                    this.classList.remove('agregado');
                    this.innerHTML = 'Agregar';
                }
            }, 2000);
        });
    });

    // --- EFECTO DE SCROLL PARA LA BARRA DE NAVEGACIÓN ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- EFECTO DE SCROLL PARA EL LOGO EN LA NAVBAR ---
    const header = document.querySelector('header');
    const logoNavbar = document.getElementById('logo-navbar');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function () {
        if (window.scrollY > headerHeight) {
            logoNavbar.classList.add('visible');
        } else {
            logoNavbar.classList.remove('visible');
        }
    });

    // --- CONFIGURACIÓN DE LA VALIDACIÓN EN VIVO (AL CAMBIAR DE FOCO) ---
    validarCamposAlCambiarFoco();
});


// --- FUNCIONES DE VALIDACIÓN REUTILIZABLES ---

function validarCampoObligatorio(campo, errorElement, mensaje) {
    if (campo.value.trim() === '') {
        errorElement.textContent = mensaje;
        return false;
    }
    // No borra el mensaje de error si hay uno de longitud
    if (errorElement.textContent === mensaje) {
        errorElement.textContent = '';
    }
    return true;
}

function validarLongitud(campo, errorElement, min, max, mensaje) {
    if (campo.value.length > max || campo.value.length < min) {
        errorElement.textContent = mensaje;
        return false;
    }
    if (errorElement.textContent === mensaje) {
        errorElement.textContent = '';
    }
    return true;
}

function validarOrigen(origenRadios, errorElement, mensaje) {
    let seleccionado = false;
    for (const radio of origenRadios) {
        if (radio.checked) {
            seleccionado = true;
            break;
        }
    }

    if (!seleccionado) {
        errorElement.textContent = mensaje;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function mostrarMensajeExito() {
    Toastify({
        text: "¡Registro exitoso!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "rgba(0, 128, 0, 0.8)",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            padding: "12px 20px"
        },
        stopOnFocus: true,
    }).showToast();
}

/**
 * Función principal llamada por el atributo onsubmit del formulario.
 */
function validarFormulario() {
    const tipoProducto = document.getElementById('tipoProducto');
    const nombreProducto = document.getElementById('nombreProducto');
    const origenRadios = document.getElementsByName('origen');

    const errorTipoProducto = document.getElementById('errorTipoProducto');
    const errorNombres = document.getElementById('errorNombres');
    const errorOrigen = document.getElementById('errorOrigen');

    // Valida cada campo y guarda el resultado
    const tipoValido = validarCampoObligatorio(tipoProducto, errorTipoProducto, "El tipo de producto es obligatorio.");

    // Primero validamos que el campo no esté vacío.
    let nombreValido = validarCampoObligatorio(nombreProducto, errorNombres, "El nombre del producto es obligatorio.");
    // Si no está vacío (si es válido), entonces validamos la longitud.
    if (nombreValido) {
        nombreValido = validarLongitud(nombreProducto, errorNombres, 1, 30, "El nombre debe tener entre 1 y 30 caracteres.");
    }

    const origenValido = validarOrigen(origenRadios, errorOrigen, "Seleccione el tipo de origen.");

    // Si todas las validaciones pasan...
    if (tipoValido && nombreValido && origenValido) {
        mostrarMensajeExito();
        document.getElementById('formularioRegistro').reset();
        // Limpia manualmente los mensajes de error residuales.
        errorTipoProducto.textContent = '';
        errorNombres.textContent = '';
        errorOrigen.textContent = '';
    }

    // Siempre devuelve false para prevenir que la página se recargue.
    return false;
}

/**
 * Configura los listeners para la validación en vivo (evento 'blur' o 'change').
 */
function validarCamposAlCambiarFoco() {
    const tipoProducto = document.getElementById('tipoProducto');
    const nombreProducto = document.getElementById('nombreProducto');
    const origenRadios = document.getElementsByName('origen');

    const errorTipoProducto = document.getElementById('errorTipoProducto');
    const errorNombres = document.getElementById('errorNombres');
    const errorOrigen = document.getElementById('errorOrigen');

    tipoProducto.addEventListener('blur', () => {
        validarCampoObligatorio(tipoProducto, errorTipoProducto, "El tipo de producto es obligatorio.");
    });

    nombreProducto.addEventListener('blur', () => {
        // Aplica la misma lógica corregida al evento 'blur'
        let esValido = validarCampoObligatorio(nombreProducto, errorNombres, "El nombre del producto es obligatorio.");
        if (esValido) {
            validarLongitud(nombreProducto, errorNombres, 1, 30, "El nombre debe tener entre 1 y 30 caracteres.");
        }
    });

    Array.from(origenRadios).forEach(input => {
        input.addEventListener('change', () => {
            validarOrigen(origenRadios, errorOrigen, "Seleccione el tipo de origen.");
        });
    });
}