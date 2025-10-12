// Burger Menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
let isMenuOpen = false;

burger.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close burger menu if open
            if (isMenuOpen) {
                isMenuOpen = false;
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
});

// Carousel functionality
class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.progressBars = document.querySelectorAll('.progress-bar');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.currentSlide = 0;
        this.autoScrollInterval = null;
        this.progressInterval = null;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.showSlide(0);
        this.startAutoScroll();
        this.addEventListeners();
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.progressBars.forEach(bar => bar.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.progressBars[index].classList.add('active');
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
        this.resetAutoScroll();
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
        this.resetAutoScroll();
    }
    
    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, 5000);
    }
    
    resetAutoScroll() {
        clearInterval(this.autoScrollInterval);
        this.startAutoScroll();
    }
    
    pauseAutoScroll() {
        this.isPaused = true;
    }
    
    resumeAutoScroll() {
        this.isPaused = false;
    }
    
    addEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoScroll());
            carouselContainer.addEventListener('mouseleave', () => this.resumeAutoScroll());
        }
        
        // Touch events for mobile
        let startX = 0;
        let endX = 0;
        
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            carouselContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// Responsive burger menu
function handleResize() {
    if (window.innerWidth > 768) {
        isMenuOpen = false;
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

window.addEventListener('resize', handleResize);