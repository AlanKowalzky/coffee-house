export class ErrorMessage {
  private element: HTMLElement | null = null;

  constructor() {
    // Empty constructor
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

  show(message: string, type: string = 'error'): void {
    this.hide(); // Remove any existing error message
    
    this.element = this.createElement(message);
    document.body.appendChild(this.element);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }

  static showInContainer(container: HTMLElement, message?: string): ErrorMessage {
    const error = new ErrorMessage();
    if (message) {
      error.show(message);
    }
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