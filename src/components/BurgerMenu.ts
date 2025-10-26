export class BurgerMenu {
  private burger: HTMLElement | null;
  private nav: HTMLElement | null;
  private isMenuOpen: boolean = false;

  constructor() {
    this.burger = document.querySelector('.burger');
    this.nav = document.querySelector('.nav');
    this.init();
  }

  private init(): void {
    if (!this.burger || !this.nav) return;
    
    this.burger.addEventListener('click', () => this.toggleMenu());
    this.addSmoothScrolling();
    window.addEventListener('resize', () => this.handleResize());
  }

  private toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.burger?.classList.toggle('active');
    this.nav?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  private closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.burger?.classList.remove('active');
      this.nav?.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }

  private addSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (href?.startsWith('#')) {
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth' });
          this.closeMenu();
        }
      });
    });
  }

  private handleResize(): void {
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }
}