export class ErrorMessage {
  private element: HTMLElement;

  constructor(message: string = 'Something went wrong. Please, refresh the page') {
    this.element = this.createElement(message);
  }

  private createElement(message: string): HTMLElement {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p class="error-text">${message}</p>
      </div>
    `;
    return errorDiv;
  }

  show(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  hide(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  static showInContainer(container: HTMLElement, message?: string): ErrorMessage {
    const error = new ErrorMessage(message);
    error.show(container);
    return error;
  }

  static showNotification(message: string = 'Something went wrong. Please, try again'): void {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">⚠️</span>
        <span class="notification-text">${message}</span>
        <button class="notification-close">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(notification);
    });

    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 5000);
  }
}