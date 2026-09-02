async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(`Error al cargar ${componentPath}: ${response.status}`);
        }

        const html = await response.text();
        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML = html;

            // Disparar evento personalizado cuando el componente se carga
            const event = new CustomEvent('componentLoaded', {
                detail: { component: componentPath, container: containerId }
            });
            document.dispatchEvent(event);
        } else {
            console.error(`Contenedor ${containerId} no encontrado`);
        }
    } catch (error) {
        console.error('Error cargando componente:', error);
    }
}

async function loadAllComponents() {
    // Cargar HEADER
    await loadComponent('header-container', './public/components/header.html');
    
    // Inicializar menú DESPUÉS de cargar el header
    setTimeout(() => {
        initializeMenuToggle();
    }, 200);
    
    // Cargar resto de componentes
    const components = [
        { container: 'about-container', path: './public/components/about-me.html' },
        { container: 'projects-container', path: './public/components/projects.html' },
        { container: 'contactame-container', path: './public/components/contactame.html' },
        { container: 'footer-container', path: './public/components/footer.html' }
    ];
    
    await Promise.all(components.map(comp =>
        loadComponent(comp.container, comp.path)
    ));
    
    initializeAfterComponents();
}

// ==========================================
// MENÚ HAMBURGUESA - VERSIÓN CORREGIDA
// ==========================================

function initializeMenuToggle() {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
        // Buscar elementos por selector en lugar de ID para mayor robustez
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav');
        const navList = document.querySelector('.nav-list');

        console.log('🔍 Buscando elementos:', { menuToggle, navMenu, navList });

        if (!menuToggle) {
            console.error('❌ No se encontró el botón .menu-toggle');
            return;
        }

        if (!navList) {
            console.error('❌ No se encontró .nav-list');
            return;
        }

        if (!navMenu) {
            console.error('❌ No se encontró .nav');
            return;
        }

        // Evitar duplicar eventos
        if (menuToggle.dataset.menuInitialized === 'true') {
            console.log('⚠️ Menú ya inicializado');
            return;
        }

        menuToggle.dataset.menuInitialized = 'true';
        console.log('✅ Menú inicializado correctamente');

        // Toggle del menú - alternar clase en .nav
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            this.textContent = isOpen ? '✕' : '☰';
            console.log('📱 Menú:', isOpen ? 'ABIERTO' : 'CERRADO');
        });

        // Cerrar al hacer click en un enlace
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.main-header')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

    }, 150); // Delay para asegurar que el DOM esté listo
}

// Asegurar que se ejecute después de cargar el header
function initializeMenuAfterLoad() {
    // Si el header ya está cargado, inicializar
    if (document.querySelector('.menu-toggle')) {
        initializeMenuToggle();
    } else {
        // Si no, esperar el evento de carga
        document.addEventListener('componentLoaded', function(e) {
            if (e.detail.component && e.detail.component.includes('header.html')) {
                initializeMenuToggle();
            }
        });
    }
}

// Función para inicializar después de que los componentes estén cargados
function initializeAfterComponents() {

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Marcar enlace activo según scroll
    updateActiveNavOnScroll();
}

// Marcar el enlace activo mientras se hace scroll
function updateActiveNavOnScroll() {

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    window.addEventListener('scroll', () => {

        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {

            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                current = section.getAttribute('id');
            }

        });

        navLinks.forEach(link => {

            link.classList.remove('active');

            const href = link.getAttribute('href').substring(1);

            if (href === current) {
                link.classList.add('active');
            }

        });

    });
}

// Iniciar carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadAllComponents);
