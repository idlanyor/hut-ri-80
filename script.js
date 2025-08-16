// ===== MAIN JAVASCRIPT FOR HUT RI 80 WEBSITE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeHeroAnimations();
    initializeScrollAnimations();
    initializeCounterAnimations();
    initializeFilterSystems();
    initializeTabSystems();
    initializeGalleryModal();
    initializeDanceVideoModal();
    initializeAudioPlayer();
    initializeParticleSystem();
    initializeBackToTop();
    initializeAOS();
    initializeClothingFilter();
});

// ===== NAVIGATION SYSTEM =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle scroll effect on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Handle smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Update active link
                updateActiveNavLink(this);
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.removeAttribute('aria-current');
    });
    activeLink.setAttribute('aria-current', 'page');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${current}`) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

// ===== HERO ANIMATIONS =====
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCTA = document.querySelector('.hero-cta');
    const heroFlag = document.querySelector('.flag-img');

    // Animate hero elements on load
    // Note: animateTextReveal disabled to prevent HTML tag display issues
    // if (heroTitle) {
    //     animateTextReveal(heroTitle);
    // }

    // Add floating animation to flag
    if (heroFlag) {
        setInterval(() => {
            heroFlag.style.transform = `translateY(${Math.sin(Date.now() * 0.001) * 10}px) rotate(${Math.sin(Date.now() * 0.0008) * 2}deg)`;
        }, 16);
    }
}

function animateTextReveal(element) {
    const text = element.innerHTML;
    element.innerHTML = '';
    
    const spans = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'all 0.5s ease';
        return span;
    });
    
    spans.forEach(span => element.appendChild(span));
    
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation if element has counter
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.about-card, .nature-card, .clothing-card, .dance-card, .gallery-item, .timeline-item, .philosophy-content'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATIONS =====
function initializeCounterAnimations() {
    // Counter animation will be triggered by scroll observer
}

function animateCounter(counter) {
    if (counter.classList.contains('counted')) return;
    
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            counter.classList.add('counted');
        }
        counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== FILTER SYSTEMS =====
function initializeFilterSystems() {
    // Initialize clothing filter
    initializeFilter('.clothing-filter', '.clothing-card', 'data-category');
    
    // Initialize gallery filter
    initializeFilter('.gallery-filter', '.gallery-item', 'data-category');
}

function initializeFilter(filterSelector, itemSelector, dataAttribute) {
    const filterContainer = document.querySelector(filterSelector);
    const items = document.querySelectorAll(itemSelector);
    
    if (!filterContainer || items.length === 0) return;
    
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            items.forEach(item => {
                const category = item.getAttribute(dataAttribute);
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== TAB SYSTEMS =====
function initializeTabSystems() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active panel
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${targetTab}-panel`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ===== GALLERY MODAL =====
function initializeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    
    if (!modal) return;
    
    // Open modal
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const galleryItem = this.closest('.gallery-item');
            const img = galleryItem.querySelector('.gallery-img');
            const title = galleryItem.querySelector('h4').textContent;
            const description = galleryItem.querySelector('p').textContent;
            
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            modalClose.focus();
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            closeModal();
        }
    });
}

// ===== DANCE VIDEO MODAL SYSTEM =====
function initializeDanceVideoModal() {
    const danceCards = document.querySelectorAll('.dance-card');
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const closeBtn = document.querySelector('.video-modal-close');

    if (!videoModal || !videoFrame || !videoTitle || !videoDescription) {
        console.warn('Dance video modal elements not found');
        return;
    }

    // Add click event to each dance card
    danceCards.forEach(card => {
        const thumbnail = card.querySelector('.dance-thumbnail');
        if (thumbnail) {
            thumbnail.addEventListener('click', function(e) {
                e.preventDefault();
                
                const videoUrl = card.getAttribute('data-video');
                const title = card.querySelector('h4').textContent;
                const description = card.querySelector('.dance-description').textContent;
                
                if (videoUrl) {
                    // Set video source
                    videoFrame.src = videoUrl + '?autoplay=1&rel=0';
                    videoTitle.textContent = title;
                    videoDescription.textContent = description;
                    
                    // Show modal
                    videoModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    
                    // Announce to screen readers
                    announcePageChange(`Video ${title} sedang diputar`);
                }
            });
        }
    });

    // Close modal function
    function closeVideoModal() {
        videoModal.classList.remove('show');
        videoFrame.src = ''; // Stop video
        document.body.style.overflow = '';
        announcePageChange('Video ditutup');
    }

    // Close button event
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }

    // Close on background click
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('show')) {
            closeVideoModal();
        }
    });

    console.log('Dance video modal system initialized');
}

// ===== AUDIO PLAYER SYSTEM =====
function initializeAudioPlayer() {
    const lyricsToggle = document.getElementById('lyrics-toggle');
    const lyricsContent = document.getElementById('lyrics-content');
    const audioPlayer = document.querySelector('.audio-player');
    
    if (lyricsToggle && lyricsContent) {
        lyricsToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            lyricsContent.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
            
            this.querySelector('span').textContent = isExpanded ? 'Lihat Lirik' : 'Sembunyikan Lirik';
        });
    }
    
    // Audio player enhancements
    if (audioPlayer) {
        audioPlayer.addEventListener('loadstart', function() {
            console.log('Audio loading started');
        });
        
        audioPlayer.addEventListener('canplay', function() {
            console.log('Audio ready to play');
        });
        
        audioPlayer.addEventListener('error', function() {
            console.log('Audio loading error');
            // You could show a fallback message here
        });
    }
}

// ===== PARTICLE SYSTEM =====
function initializeParticleSystem() {
    const particleContainer = document.getElementById('hero-particles');
    
    if (!particleContainer) return;
    
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 215, 0, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        particles.push({
            element: particle,
            x: x,
            y: y,
            speedX: speedX,
            speedY: speedY
        });
        
        particleContainer.appendChild(particle);
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
}

// Initialize Clothing Filter
function initializeClothingFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clothingCards = document.querySelectorAll('.clothing-card');

    if (filterButtons.length === 0 || clothingCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            clothingCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add CSS animation keyframes if not already present
    if (!document.querySelector('#clothing-animations')) {
        const style = document.createElement('style');
        style.id = 'clothing-animations';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate element with CSS classes
function animateElement(element, animationClass, delay = 0) {
    setTimeout(() => {
        element.classList.add(animationClass);
    }, delay);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/logo-hut-80.png',
        'assets/logo-hut-80-large.png',
        'assets/bendera-indonesia-wave.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could implement error reporting here
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation for custom elements
document.addEventListener('keydown', function(e) {
    // Handle Enter key as click for custom buttons
    if (e.key === 'Enter' && e.target.classList.contains('custom-button')) {
        e.target.click();
    }
    
    // Handle Escape key for modals and menus
    if (e.key === 'Escape') {
        // Close any open modals
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close mobile menu
        const activeMenu = document.querySelector('.nav-menu.active');
        if (activeMenu) {
            activeMenu.classList.remove('active');
            document.querySelector('.nav-toggle').classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== RESPONSIVE BEHAVIOR =====
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate particle positions
        if (window.innerWidth < 768) {
            // Mobile optimizations
            const particles = document.querySelectorAll('#hero-particles > div');
            particles.forEach(particle => {
                particle.style.display = 'none';
            });
        } else {
            // Desktop optimizations
            const particles = document.querySelectorAll('#hero-particles > div');
            particles.forEach(particle => {
                particle.style.display = 'block';
            });
        }
        
        // Refresh AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// ===== INITIALIZATION COMPLETE =====
console.log('HUT RI 80 Website JavaScript initialized successfully!');

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeHeroAnimations,
        initializeScrollAnimations,
        debounce,
        throttle,
        isInViewport
    };
}

