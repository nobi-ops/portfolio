document.addEventListener('DOMContentLoaded', () => {
    const AGE_STORAGE_KEY = 'mp_isAdult';
    let currentView = window.location.pathname.split('/').pop();
    if (!currentView) {
        currentView = 'index.html';
    }
    const localeMap = {
        'index_ja.html': 'ja',
        'index_en.html': 'en'
    };
    const isAgeGatePage = currentView === 'age-verification.html';
    const isLanguageSelectionPage = currentView === 'index.html';

    const redirectToAgeGate = (langCode) => {
        window.location.href = `age-verification.html?lang=${langCode}`;
    };

    if (isLanguageSelectionPage) {
        const languageLinks = document.querySelectorAll('a[href="index_ja.html"], a[href="index_en.html"]');
        languageLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const langCode = link.getAttribute('href').includes('_en') ? 'en' : 'ja';
                redirectToAgeGate(langCode);
            });
        });
    }

    if (!isAgeGatePage) {
        const langForPage = localeMap[currentView];
        if (langForPage && localStorage.getItem(AGE_STORAGE_KEY) !== 'true') {
            redirectToAgeGate(langForPage);
            return;
        }
    }

    // ===== Navbar Scroll & Style Effect =====
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    if (navbar) { // Ensure navbar exists
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (lastScrollY < window.scrollY && window.scrollY > 100) {
                navbar.classList.add('scroll-down');
                navbar.classList.remove('scroll-up');
            } else {
                navbar.classList.add('scroll-up');
                navbar.classList.remove('scroll-down');
            }
            lastScrollY = window.scrollY <= 0 ? 0 : window.scrollY;
        });
    } else {
        console.warn("Navbar element (.navbar) not found.");
    }

    // ===== Burger Menu Toggle =====
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.classList.remove('active');
                }
            });
        });
    } else {
        console.warn("Burger menu (.burger-menu) or nav links (.nav-links) not found.");
    }

    // ===== Portfolio Swiper Initialization (TEMPORARILY COMMENTED OUT) =====
    /*
    const portfolioSwiperContainer = document.querySelector('.portfolio-swiper-container');
    if (portfolioSwiperContainer) {
        try {
            const portfolioSwiper = new Swiper(portfolioSwiperContainer, {
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination-portfolio',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    init: function() {
                        console.log('Portfolio Swiper initialized. Slides:', this.slides.length);
                    }
                }
            });
            console.log('Portfolio Swiper instance:', portfolioSwiper);
        } catch (e) {
            console.error('Portfolio Swiper: Error during initialization:', e);
        }
    } else {
        // console.warn("Portfolio Swiper container (.portfolio-swiper-container) not found. Portfolio slider will not work.");
    }
    */

    // ===== Hero Swiper Initialization (REMOVED as hero section is now static) =====
    /*
    const heroSwiperContainer = document.querySelector('.hero-swiper-container');
    if (heroSwiperContainer) {
        // ... (original Swiper initialization code) ...
    } else {
        // console.error('Hero Swiper: CRITICAL - .hero-swiper-container element NOT FOUND in the DOM!');
    }
    */

    // ===== Scroll-triggered Fade-in Animation for Sections =====
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // console.warn("Scroll-triggered animations: No <section> elements found.");
    }
});
