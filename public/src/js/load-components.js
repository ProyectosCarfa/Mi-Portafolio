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
    const components = [
        { container: 'header-container', path: '/public/components/header.html' },
        {container: 'about-container', path: '/public/components/about-me.html' },
        {container: 'projects-container', path: '/public/components/projects.html'},
        {container: 'contactame-container', path: '/public/components/contactame.html'},
        {container: 'footer-container', path: '/public/components/footer.html'}
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

// Función para inicializar después de que los componentes estén cargados
function initializeAfterComponents() {
    // Configurar menú móvil (hamburguesa)
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });
    }

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

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

