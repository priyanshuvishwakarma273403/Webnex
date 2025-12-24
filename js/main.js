// Main JS for UI interactions with GSAP animations

console.log('Webnex UI Script Initializing...');

// ===================================
// SMOOTH SCROLL (LENIS)
// ===================================
let lenis;
function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.update();
        }
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    console.log('Lenis Smooth Scroll Initialized');
}

// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinks) {
        const toggleMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on clicking outside (on the overlay background)
        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===================================
// GSAP ANIMATIONS & COUNTERS
// ===================================
function initGSAP() {
    if (typeof gsap === 'undefined') return;

    // Smooth scrolling
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        return;
    }

    // 1. Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        counters.forEach(counter => {
            const targetAttr = counter.getAttribute('data-target');
            if (!targetAttr) return;

            const target = parseInt(targetAttr);

            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                onEnter: () => {
                    let count = { val: 0 };
                    gsap.to(count, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            counter.textContent = Math.floor(count.val);
                        }
                    });
                }
            });
        });
    }

    // 2. Section Titles Entrance
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) {
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    }

    // 3. Glass Card Cascade
    const cardGrids = document.querySelectorAll('.card-grid');
    cardGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.glass-card');
        if (cards.length > 0) {
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                },
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        }
    });

    // 4. Hero Content Entrance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const tl = gsap.timeline({ delay: 0.5 });

        // Target elements specifically to avoid warnings
        const sub = heroContent.querySelector('.hero-subtitle');
        const h1 = heroContent.querySelector('h1');
        const p = heroContent.querySelector('p');
        const btns = heroContent.querySelector('.hero-btns');

        if (sub) tl.from(sub, { x: -20, opacity: 0, duration: 0.8 });
        if (h1) tl.from(h1, { y: 30, opacity: 0, duration: 1 }, "-=0.4");
        if (p) tl.from(p, { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
        if (btns) tl.from(btns, { y: 20, opacity: 0, duration: 0.8 }, "-=0.4");
    }

    // 5. Tech Stack Marquee
    const marquee = document.querySelector('.tech-marquee');
    if (marquee) {
        gsap.to(marquee, {
            xPercent: -50,
            repeat: -1,
            duration: 25,
            ease: "none"
        });
    }

    // 6. Project Hover (Desktop)
    if (window.innerWidth > 1024) {
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
            const video = project.querySelector('.hover-video');
            if (video) {
                project.addEventListener('mouseenter', () => {
                    gsap.to(video, { scale: 1.05, duration: 0.5 });
                });
                project.addEventListener('mouseleave', () => {
                    gsap.to(video, { scale: 1, duration: 0.5 });
                });
            }
        });
    }

    // 7. Hero Mouse Parallax
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            gsap.to(heroCanvas, {
                x: x,
                y: y,
                duration: 1.2,
                ease: "power2.out"
            });
        });
    }
    // 8. Gallery Item Reveal (Staggered)
    // 8. Gallery Item Reveal (Staggered for Masonry)
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                },
                y: 100,
                opacity: 0,
                scale: 0.8,
                duration: 1.2,
                ease: "power4.out",
                rotationX: -15,
                transformOrigin: "center center"
            });
        });
    }
}

// ===================================
// INITIALIZE
// ===================================
window.addEventListener('load', () => {
    initLenis();
    initNavigation();
    initGSAP();
});
