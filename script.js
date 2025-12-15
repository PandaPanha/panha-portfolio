import { translations } from './translations.js';
import { loadData, renderExperience, renderSkills, renderLanguages, renderPersonalInfo, renderEducation, renderContact } from './data-loader.js';

let currentLang = localStorage.getItem('language') || 'en';

const flagMap = {
    'en': 'https://flagcdn.com/gb.svg',
    'km': 'https://flagcdn.com/kh.svg'
};

function translatePage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    const langFlag = document.querySelector('.lang-toggle .lang-flag');
    if (langFlag) {
        langFlag.src = flagMap[lang];
        langFlag.alt = lang === 'en' ? 'English' : 'Khmer';
    }
    
    document.querySelectorAll('.lang-option').forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (key === 'about.description') {
                const text = translations[lang][key];
                element.innerHTML = text.replace(/Frontend Developer/g, '<code class="inline-code">Frontend Developer</code>');
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

translatePage(currentLang);

const langSelector = document.querySelector('.lang-selector');
const langToggle = document.querySelector('.lang-toggle');
const langOptions = document.querySelectorAll('.lang-option');

langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelector.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('active');
    }
});

langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');
        translatePage(selectedLang);
        langSelector.classList.remove('active');
    });
});

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarClose = document.querySelector('.sidebar-close');

sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.add('open');
});

sidebarClose?.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
        }
    });
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const printToggle = document.querySelector('.print-toggle');
printToggle?.addEventListener('click', () => {
    window.open('print.html', '_blank');
});

const sections = document.querySelectorAll('.doc-section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

let isManualNavigation = false;
let manualNavigationTimeout = null;

navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) {
            return;
        }
        
        if (!href.startsWith('#')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            isManualNavigation = true;
            
            if (manualNavigationTimeout) {
                clearTimeout(manualNavigationTimeout);
            }
            
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            manualNavigationTimeout = setTimeout(() => {
                isManualNavigation = false;
            }, 1500);
        }
    });
});

const sectionObserverOptions = {
    threshold: [0.2, 0.5, 0.8],
    rootMargin: '-80px 0px -60% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    if (isManualNavigation) return;
    
    let maxRatio = 0;
    let activeSectionId = null;
    
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeSectionId = entry.target.getAttribute('id');
        }
    });
    
    if (activeSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
        const activeLink = document.querySelector(`.nav-link[href="#${activeSectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
}, sectionObserverOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

function setActiveSection() {
    if (isManualNavigation) return;
    
    const scrollPosition = window.scrollY + 100;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const isNearBottom = scrollPosition + windowHeight >= documentHeight - 150;
    
    if (isNearBottom) {
        const lastSection = sections[sections.length - 1];
        const lastSectionId = lastSection.getAttribute('id');
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${lastSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        return;
    }
    
    let closestSection = null;
    let minDistance = Infinity;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        const distance = Math.abs(sectionTop - scrollPosition);
        
        if (sectionTop <= scrollPosition + 150 && distance < minDistance) {
            minDistance = distance;
            closestSection = sectionId;
        }
    });
    
    if (closestSection) {
            navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${closestSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
}

window.addEventListener('load', setActiveSection);
window.addEventListener('scroll', setActiveSection);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        }
    }, 250);
});

loadData().then(data => {
    const personalContainer = document.querySelector('.intro-block');
    if (personalContainer) {
        renderPersonalInfo(data, personalContainer);
    }
    
    const ageElement = document.querySelector('.meta-block .meta-value');
    if (ageElement) ageElement.textContent = data.personal.age;
    
    const experienceContainer = document.getElementById('experience-list');
    if (experienceContainer) renderExperience(data, experienceContainer);
    
    const skillsContainer = document.getElementById('skills-grid');
    if (skillsContainer) renderSkills(data, skillsContainer);
    
    const educationContainer = document.getElementById('education-container');
    if (educationContainer) renderEducation(data, educationContainer);
    
    const languagesContainer = document.getElementById('languages-list');
    if (languagesContainer) renderLanguages(data, languagesContainer);
    
    const contactContainer = document.getElementById('contact-links');
    if (contactContainer) renderContact(data, contactContainer);
    
    setTimeout(() => {
        translatePage(currentLang);
    }, 100);
});
