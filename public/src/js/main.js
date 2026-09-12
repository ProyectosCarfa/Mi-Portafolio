// main.js - VERSIÓN COMPLETA FUNCIONAL

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===== HEADER FUTURISTA =====
function initHeader() {
    const menuToggle = document.getElementById('menuToogle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== TABS PARA ABOUT-ME =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const targetPanel = document.getElementById(`panel-${target}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

// ===== FILTROS DE PROYECTOS =====
function initProjectsFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
            });
        });
    });
}



// ===== NAVEGACIÓN PRINCIPAL (OCULTAR/MOSTRAR) =====
function initNavigation() {
    const aboutContainer = document.querySelector('#about-container');
    const projectsContainer = document.querySelector('#projects-container');
    const contactContainer = document.querySelector('#contactame-container');
    
    if (!aboutContainer) {
        setTimeout(initNavigation, 200);
        return;
    }
    
    // Ocultar todos al inicio
    aboutContainer.style.display = 'block';
    if (projectsContainer) projectsContainer.style.display = 'none';
    if (contactContainer) contactContainer.style.display = 'none';
    
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Ocultar todos
            aboutContainer.style.display = 'none';
            if (projectsContainer) projectsContainer.style.display = 'none';
            if (contactContainer) contactContainer.style.display = 'none';
            
            // Mostrar seleccionado
            if (href === '#about-me') {
                aboutContainer.style.display = 'block';
            } else if (href === '#projects') {
                if (projectsContainer) projectsContainer.style.display = 'block';
            } else if (href === '#contact') {
                if (contactContainer) contactContainer.style.display = 'block';
            }
            
            // Cerrar menú móvil
            const nav = document.querySelector('.nav');
            const menuToggle = document.getElementById('menuToogle');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (menuToggle) menuToggle.textContent = '☰';
            }
        });
    });
    
    console.log('Navegación iniciada');
}

// ===== INICIALIZAR TODO =====
function initializeAll() {
    initHeader();
    initNavigation();
    initTabs();
    initProjectsFilters();
    // initContactForm();
}

// ===== EVENTOS =====
document.addEventListener('componentLoaded', (e) => {
    console.log(`Componente cargado: ${e.detail.component}`);
    
    if (e.detail.component === './public/components/header.html') {
        initHeader();
        initNavigation();
    }
    if (e.detail.component === './public/components/about-me.html') {
        setTimeout(initTabs, 100);
    }
    if (e.detail.component === './public/components/projects.html') {
        setTimeout(initProjectsFilters, 100);
    }
    // if (e.detail.component === './public/components/contactame.html') {
    //     setTimeout(initContactForm, 100);
    // }
});

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAll, 500);
});

// ===== FORMULARIO DE CONTACTO: CORREO + WHATSAPP (VERSIÓN MEJORADA) =====
function initContactFormConWhatsApp() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.warn('⚠️ Formulario de contacto no encontrado');
        return;
    }

    if (contactForm.dataset.initialized === 'true') return;
    contactForm.dataset.initialized = 'true';

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkjnadrp';
    const NUMERO_WHATSAPP = '51958661658';

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnSpan = submitBtn.querySelector('span');
        const textoOriginal = btnSpan.textContent;

        // Estado: enviando
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';
        btnSpan.textContent = 'Enviando...';

        const formData = new FormData(contactForm);
        const nombre  = formData.get('nombre')  || 'No especificado';
        const email   = formData.get('email')   || 'No especificado';
        const asunto  = formData.get('asunto')  || 'Sin asunto';
        const mensaje = formData.get('mensaje') || 'Sin mensaje';

        const textoWhatsApp =
            `¡Hola Carlos! Te escribo desde tu portafolio.\n\n` +
            `*Nombre:* ${nombre}\n` +
            `*Correo:* ${email}\n` +
            `*Asunto:* ${asunto}\n\n` +
            `*Mensaje:*\n${mensaje}`;

        const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(textoWhatsApp)}`;

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // ✅ Éxito: mostrar notificación personalizada
                mostrarNotificacion(
                    '✅ ¡Mensaje enviado!',
                    'Se abrirá WhatsApp para que confirmes el envío.',
                    'exito'
                );

                contactForm.reset();

                // ⏱️ Esperar 1.5 segundos antes de abrir WhatsApp
                setTimeout(() => {
                    window.open(urlWhatsApp, '_blank');
                }, 1500);

            } else {
                const data = await response.json();
                const errorMsg = data.errors
                    ? data.errors.map(err => err.message).join(', ')
                    : 'Error desconocido al enviar.';

                mostrarNotificacion(
                    '❌ Error al enviar',
                    errorMsg,
                    'error'
                );
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            mostrarNotificacion(
                '⚠️ Error de conexión',
                'Por favor, inténtalo de nuevo en unos momentos.',
                'error'
            );
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            btnSpan.textContent = textoOriginal;
        }
    });

    console.log('✅ Formulario de contacto inicializado con Formspree + WhatsApp');
}

// ===== SISTEMA DE NOTIFICACIONES PERSONALIZADAS =====
function mostrarNotificacion(titulo, mensaje, tipo = 'exito') {
    // Eliminar notificaciones previas
    const previas = document.querySelectorAll('.notificacion-portafolio');
    previas.forEach(n => n.remove());

    // Crear la notificación
    const notif = document.createElement('div');
    notif.className = `notificacion-portafolio notif-${tipo}`;

    const icono = tipo === 'exito' ? '✅' : '⚠️';

    notif.innerHTML = `
        <div class="notif-icono">${icono}</div>
        <div class="notif-contenido">
            <h4>${titulo}</h4>
            <p>${mensaje}</p>
        </div>
        <button class="notif-cerrar" aria-label="Cerrar">✕</button>
        <div class="notif-progreso"></div>
    `;

    document.body.appendChild(notif);

    // Animación de entrada
    requestAnimationFrame(() => {
        notif.classList.add('notif-visible');
    });

    // Botón cerrar
    const btnCerrar = notif.querySelector('.notif-cerrar');
    btnCerrar.addEventListener('click', () => cerrarNotificacion(notif));

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => cerrarNotificacion(notif), 5000);

    // Guardar timer por si se cierra manualmente
    notif._timer = timer;
}

function cerrarNotificacion(notif) {
    if (notif._timer) clearTimeout(notif._timer);
    notif.classList.remove('notif-visible');
    setTimeout(() => notif.remove(), 400);
}

// Enganchar al evento componentLoaded
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.component && e.detail.component.includes('contactame.html')) {
        setTimeout(initContactFormConWhatsApp, 150);
    }
});
