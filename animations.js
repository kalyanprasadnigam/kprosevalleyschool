// K.P. Rose Valley School - Advanced Animations JavaScript
// Animation effects for smooth scrolling, parallax, and interactive elements

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    handleScrollAnimations();
    addParallaxEffect();
    enableSmoothScroll();
    animateCounters();
});

// 1. Intersection Observer for Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards, images, and sections
    document.querySelectorAll('.program-card, .stat-item, .value-card, .highlight-card, .faq-card, .info-card, .detail-card, .admission-panel, .mission-card, .gallery-item, .testimonial-item').forEach(el => {
        el.classList.add('fade-scroll');
        observer.observe(el);
    });
}

// 2. Scroll Animation Styles
function handleScrollAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Staggered animations */
        .program-card { animation-delay: 0.1s; }
        .program-card:nth-child(2) { animation-delay: 0.2s; }
        .program-card:nth-child(3) { animation-delay: 0.3s; }
        .program-card:nth-child(4) { animation-delay: 0.4s; }
        
        .stat-item { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
}

// 3. Parallax Scroll Effect
function addParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero, .about-image, .admission-image');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = el.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            if (distance < window.innerHeight && distance > -el.offsetHeight) {
                el.style.backgroundPosition = `center ${distance * 0.5}px`;
            }
        });
    }, { passive: true });
}

// 4. Smooth Scroll Behavior
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Smooth scroll on page load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

// 5. Animated Counter for Statistics
function animateCounters() {
    const counterElements = document.querySelectorAll('.stat-item h3');
    let hasAnimated = false;

    const animateCounter = (el) => {
        const targetText = el.textContent;
        const numMatch = targetText.match(/\d+/);
        if (!numMatch) return;

        const target = parseInt(numMatch[0]);
        const suffix = targetText.replace(/\d+/g, '').trim();
        let current = 0;
        const increment = target / 30;
        const duration = 30;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            el.textContent = Math.floor(current) + suffix;
        }, duration);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counterElements.forEach(el => animateCounter(el));
                observer.disconnect();
            }
        });
    });

    const statsSection = document.querySelector('.stat-grid')?.parentElement;
    if (statsSection) observer.observe(statsSection);
}

// 6. Button Ripple Effect
document.querySelectorAll('.btn-primary, .admission-btn, .download-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// 7. Ripple Effect Styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 8. Nav Link Active State
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// 9. Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    display: none;
    background: linear-gradient(135deg, #003366 0%, #004080 100%);
    color: #FFD700;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 20px;
    z-index: 1150;
    transition: all 0.3s ease;
    box-shadow: 0 12px 28px rgba(0, 51, 102, 0.3);
`;

scrollToTopBtn.addEventListener('mouseover', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px)';
    scrollToTopBtn.style.boxShadow = '0 16px 36px rgba(0, 51, 102, 0.5)';
});

scrollToTopBtn.addEventListener('mouseout', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = '0 12px 28px rgba(0, 51, 102, 0.3)';
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.body.appendChild(scrollToTopBtn);

// Show/Hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
        scrollToTopBtn.style.alignItems = 'center';
        scrollToTopBtn.style.justifyContent = 'center';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
}, { passive: true });

// 10. Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('fully-loaded');
});

// 11. Form Input Animation
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
        this.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        this.style.transform = 'scale(1)';
    });
});

console.log('✨ K.P. Rose Valley School - Animations Loaded Successfully!');
