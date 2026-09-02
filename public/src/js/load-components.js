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

    // ==========================================
    // CARGAR HEADER PRIMERO
    // ==========================================

    await loadComponent(
        'header-container',
        './public/components/header.html'
    );

    // ==========================================
    // INICIALIZAR MENÚ INMEDIATAMENTE
    // ==========================================

    initializeMenuToggle();


    // ==========================================
    // CARGAR RESTO DE COMPONENTES
    // ==========================================

    const components = [
        { container: 'about-container', path: './public/components/about-me.html' },
        { container: 'projects-container', path: './public/components/projects.html' },
        { container: 'contactame-container', path: './public/components/contactame.html' },
        { container: 'footer-container', path: './public/components/footer.html' }
        // Agrega más componentes aquí si los tienes
        // { container: 'footer-container', path: 'footer.html' }
    ];

    // Cargar todos los componentes en paralelo
    await Promise.all(components.map(comp =>
        loadComponent(comp.container, comp.path)
    ));

    // Inicializar funcionalidades después de cargar los componentes
    initializeAfterComponents();
}


// ==========================================
// MENÚ HAMBURGUESA
// ==========================================

function initializeMenuToggle() {

    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');

    if (!menuToggle || !navList) {
        console.error('No se encontró el menú hamburguesa o la navegación');
        return;
    }

    // Evitar agregar el evento más de una vez
    if (menuToggle.dataset.menuInitialized === 'true') {
        return;
    }

    menuToggle.dataset.menuInitialized = 'true';

    menuToggle.addEventListener('click', function () {

        navList.classList.toggle('active');

        const menuAbierto = navList.classList.contains('active');

        menuToggle.textContent = menuAbierto ? '✕' : '☰';

    });

    // Cerrar menú cuando se pulsa un enlace
    navList.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', function () {

            navList.classList.remove('active');

            menuToggle.textContent = '☰';

        });

    });
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
