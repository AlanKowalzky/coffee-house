export class Carousel {
  private slides: NodeListOf<Element>;
  private progressBars: NodeListOf<Element>;
  private prevBtn: HTMLElement | null;
  private nextBtn: HTMLElement | null;
  private currentSlide: number = 0;
  private autoScrollInterval: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;

  constructor() {
    this.slides = document.querySelectorAll('.carousel-slide');
    this.progressBars = document.querySelectorAll('.progress-bar');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    
    this.init();
  }

  private init(): void {
    if (this.slides.length === 0) return;
    
    this.showSlide(0);
    this.startAutoScroll();
    this.addEventListeners();
  }

  private showSlide(index: number): void {
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.progressBars.forEach(bar => bar.classList.remove('active'));
    
    this.slides[index].classList.add('active');
    this.progressBars[index].classList.add('active');
    this.currentSlide = index;
  }

  private nextSlide(): void {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
    this.resetAutoScroll();
  }

  private prevSlide(): void {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
    this.resetAutoScroll();
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000);
  }

  private resetAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    this.startAutoScroll();
  }

  private pauseAutoScroll(): void {
    this.isPaused = true;
  }

  private resumeAutoScroll(): void {
    this.isPaused = false;
  }

  private addEventListeners(): void {
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
      carouselContainer.addEventListener('touchstart', (e: Event) => {
        const touchEvent = e as TouchEvent;
        startX = touchEvent.touches[0].clientX;
      });
      
      carouselContainer.addEventListener('touchend', (e: Event) => {
        const touchEvent = e as TouchEvent;
        endX = touchEvent.changedTouches[0].clientX;
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