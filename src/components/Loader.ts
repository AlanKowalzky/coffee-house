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
      <p>Loading...</p>
    `;
    return loader;
  }

  public show(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  public hide(): void {
    this.element.remove();
  }

  public static showError(container: HTMLElement, message: string = 'Something went wrong. Please, refresh the page'): void {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    container.appendChild(error);
  }
}