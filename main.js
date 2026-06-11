document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    const counterText = document.getElementById('counter');
    const counterFill = document.getElementById('counter-fill');
    const pBar = document.getElementById('preloader-bar');
    let count = 0;
    let preloaderInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count >= 100) {
            count = 100;
            clearInterval(preloaderInterval);
            if (counterText) counterText.innerText = count;
            if (counterFill) { counterFill.innerText = count; counterFill.style.height = '100%'; }
            if (pBar) pBar.style.width = '100%';
            setTimeout(() => { if (preloader) preloader.classList.add('loaded'); }, 500);
        } else {
            if (counterText) counterText.innerText = count;
            if (counterFill) { counterFill.innerText = count; counterFill.style.height = count + '%'; }
            if (pBar) pBar.style.width = count + '%';
        }
    }, 40);

    // --- MANIFESTO SLIDER ---
    const slides = document.querySelectorAll('.stat-slide');
    const sliderProgress = document.getElementById('manifesto-progress');
    let currentSlide = 0;

    function triggerSliderProgress() {
        if (!sliderProgress) return;
        sliderProgress.style.transition = 'none';
        sliderProgress.style.width = '0%';
        setTimeout(() => {
            sliderProgress.style.transition = 'width 3s linear';
            sliderProgress.style.width = '100%';
        }, 50);
    }

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        triggerSliderProgress();
    }
    triggerSliderProgress();
    setInterval(nextSlide, 3000);

    // --- ADVANCED PHYSICS CURSOR LOGIC ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let currentScroll = window.scrollY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('scroll', () => {
        let newScroll = window.scrollY;
        let delta = newScroll - currentScroll;
        currentScroll = newScroll;

        // Glitch effect tied to scroll velocity
        let glitchIntensity = Math.min(Math.abs(delta) * 0.5, 20);
        document.body.style.setProperty('--glitch-offset', `${glitchIntensity}px`);

        clearTimeout(window.glitchTimer);
        window.glitchTimer = setTimeout(() => {
            document.body.style.setProperty('--glitch-offset', `0px`);
        }, 100);

        // Timeline logic
        const timelineContainer = document.getElementById('timeline-container');
        const scrollLine = document.getElementById('scroll-line');
        const processItems = document.querySelectorAll('.process-item');

        if (timelineContainer && scrollLine) {
            const trackRect = timelineContainer.getBoundingClientRect();
            let fillAmount = (window.innerHeight * 0.6) - trackRect.top;
            fillAmount = Math.max(0, Math.min(trackRect.height, fillAmount));
            scrollLine.style.height = `${fillAmount}px`;
            const lineBottomAbsolute = trackRect.top + fillAmount;

            processItems.forEach(item => {
                const numRect = item.querySelector('.process-num').getBoundingClientRect();
                if (lineBottomAbsolute >= numRect.top + (numRect.height / 2)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });

    function renderLoop() {
        // 1. Dot moves instantly
        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }

        // 2. Ring Lerp (0.15 = slight delay catching the dot)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if (cursorRing) {
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }

        // Manifesto Diagonal Reveal
        const manifestoText = document.querySelector('.manifesto-wide');
        if (manifestoText) {
            const rect = document.getElementById('manifesto').getBoundingClientRect();
            const windowHeight = window.innerHeight;
            let mScrollPercent = (windowHeight - rect.top) / (rect.height + windowHeight);
            let bgPos = 100 - (mScrollPercent * 100);
            bgPos = Math.max(0, Math.min(100, bgPos));
            manifestoText.style.backgroundPosition = `${bgPos}% ${bgPos}%`;
        }

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // --- CURSOR HOVER STATES ---
    const hoverTargets = document.querySelectorAll('.hover-target, .card, .btn');
    const contactBtnNav = document.querySelector('.contact-btn-nav');
    const contactBtnFooter = document.querySelector('.footer-simple-btn');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Contact Me custom hover state 
    if (contactBtnNav) {
        contactBtnNav.addEventListener('mouseenter', () => document.body.classList.add('cursor-btn-nav-hover'));
        contactBtnNav.addEventListener('mouseleave', () => document.body.classList.remove('cursor-btn-nav-hover'));
    }
    if (contactBtnFooter) {
        contactBtnFooter.addEventListener('mouseenter', () => document.body.classList.add('cursor-btn-footer-hover'));
        contactBtnFooter.addEventListener('mouseleave', () => document.body.classList.remove('cursor-btn-footer-hover'));
    }

    // --- STATIC IMAGE HOVER REVEAL ---
    const hoverReveal = document.getElementById('hover-reveal');
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const imgUrl = card.getAttribute('data-img');
            if (imgUrl && hoverReveal) {
                hoverReveal.style.backgroundImage = `url(${imgUrl})`;
                hoverReveal.classList.add('active');
            }
        });
        card.addEventListener('mousemove', (e) => {
            if (hoverReveal && hoverReveal.classList.contains('active')) {
                hoverReveal.style.left = `${e.clientX + 80}px`;
                hoverReveal.style.top = `${e.clientY + 50}px`;
            }
        });
        card.addEventListener('mouseleave', () => {
            if (hoverReveal) hoverReveal.classList.remove('active');
        });
    });

    // --- MAGNETIC BUTTONS ---
    document.querySelectorAll('.magnet-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const multiplier = 0.3;
            const x = (e.clientX - rect.left - rect.width / 2) * multiplier;
            const y = (e.clientY - rect.top - rect.height / 2) * multiplier;
            btn.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = `translate(0,0) scale(1)`; });
    });

    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    // Staggered Bento Grid Entry
    gsap.utils.toArray('.bento-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.card'), {
            scrollTrigger: {
                trigger: grid,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    });

    // General Reveals (Headers, Text)
    gsap.utils.toArray('.gsap-reveal').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Animate Section Labels (Trigger the background fill)
    gsap.utils.toArray('.section-label').forEach(label => {
        ScrollTrigger.create({
            trigger: label,
            start: "top 85%",
            onEnter: () => label.classList.add("active")
        });
    });

    // Animate Glassmorphism Capsule
    gsap.utils.toArray('.capsule-wrapper').forEach(capsule => {
        ScrollTrigger.create({
            trigger: capsule,
            start: "top 85%",
            onEnter: () => capsule.classList.add("active")
        });
    });

    // --- Q&A HOVER ---
    const qaItems = document.querySelectorAll('.faq-item');
    const stickyQa = document.querySelector('.sticky-qa');
    qaItems.forEach(item => {
        item.addEventListener('mouseenter', () => { if (stickyQa) stickyQa.style.color = 'var(--color-primary)'; });
        item.addEventListener('mouseleave', () => { if (stickyQa) stickyQa.style.color = 'var(--border-color)'; });
    });

});