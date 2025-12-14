// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const navbar = document.querySelector('.navbar');

// Get theme from localStorage or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Function to update navbar background based on theme and scroll position
function updateNavbarBackground() {
    const currentScroll = window.pageYOffset;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (currentScroll > 50) {
        if (isDark) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        navbar.style.boxShadow = isDark 
            ? '0 2px 20px rgba(0, 0, 0, 0.3)' 
            : '0 2px 20px rgba(0, 0, 0, 0.05)';
    } else {
        if (isDark) {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        }
        navbar.style.boxShadow = 'none';
    }
}

// Update navbar on theme change
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    // Immediately update navbar background
    updateNavbarBackground();
});

// Navbar background on scroll
let lastScroll = 0;

window.addEventListener('scroll', () => {
    updateNavbarBackground();
    lastScroll = window.pageYOffset;
});

// Set initial navbar background on page load
window.addEventListener('load', updateNavbarBackground);
updateNavbarBackground();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(20px)';
    category.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(category);
});

// Observe contact links
document.querySelectorAll('.contact-link').forEach(link => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px)';
    link.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(link);
});

// Add stagger delay to skill tags
document.querySelectorAll('.skill-category').forEach((category, categoryIndex) => {
    const tags = category.querySelectorAll('.skill-tag');
    tags.forEach((tag, tagIndex) => {
        tag.style.transitionDelay = `${(categoryIndex * 0.1) + (tagIndex * 0.05)}s`;
    });
});

// Active navigation tracking based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

const sectionObserverOptions = {
    threshold: [0.1, 0.3, 0.5],
    rootMargin: '-100px 0px -40% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, sectionObserverOptions);

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Set active state based on scroll position
function setActiveSection() {
    const scrollPosition = window.scrollY + 200;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if we're near the bottom of the page
    const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;
    
    if (isNearBottom) {
        // If near bottom, activate the last section (contact)
        const lastSection = sections[sections.length - 1];
        const lastSectionId = lastSection.getAttribute('id');
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-menu a[href="#${lastSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        return;
    }
    
    // Otherwise, find the section that's currently in view
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const sectionBottom = sectionTop + sectionHeight;
        
        // Check if scroll position is within this section
        if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Set initial active section on page load
window.addEventListener('load', setActiveSection);
window.addEventListener('scroll', setActiveSection);

