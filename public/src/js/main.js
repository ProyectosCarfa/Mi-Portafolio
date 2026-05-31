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

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Te contactaré pronto.');
        form.reset();
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
    initContactForm();
}

// ===== EVENTOS =====
document.addEventListener('componentLoaded', (e) => {
    console.log(`Componente cargado: ${e.detail.component}`);
    
    if (e.detail.component === '/public/components/header.html') {
        initHeader();
        initNavigation();
    }
    if (e.detail.component === '/public/components/about-me.html') {
        setTimeout(initTabs, 100);
    }
    if (e.detail.component === '/public/components/projects.html') {
        setTimeout(initProjectsFilters, 100);
    }
    if (e.detail.component === '/public/components/contactame.html') {
        setTimeout(initContactForm, 100);
    }
});

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAll, 500);
});