export class Menu {
  private burger: HTMLElement | null = null;
  private nav: HTMLElement | null = null;
  private isMenuOpen: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.burger = document.querySelector('.burger');
    this.nav = document.querySelector('.nav');
    
    if (!this.burger || !this.nav) {
      console.error('Burger menu elements not found');
      return;
    }

    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.burger && this.nav) {
      this.burger.addEventListener('click', () => {
        this.toggleMenu();
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close burger menu if open
            if (this.isMenuOpen) {
              this.closeMenu();
            }
          }
        }
      });
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.burger && this.nav) {
      this.burger.classList.toggle('active');
      this.nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
  }

  private closeMenu(): void {
    this.isMenuOpen = false;
    
    if (this.burger && this.nav) {
      this.burger.classList.remove('active');
      this.nav.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }
}