document.addEventListener('DOMContentLoaded', () => {

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
