export class Loader {
  private element: HTMLElement;

  constructor() {
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading...</p>
    `;
    return loader;
  }

  show(container?: HTMLElement): void {
    const target = container || document.body;
    target.appendChild(this.element);
  }

  hide(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  static showInContainer(container: HTMLElement): Loader {
    const loader = new Loader();
    loader.show(container);
    return loader;
  }
}