export class ErrorMessage {
  private static instance: ErrorMessage;
  private container: HTMLElement;

  private constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  public static getInstance(): ErrorMessage {
    if (!ErrorMessage.instance) {
      ErrorMessage.instance = new ErrorMessage();
    }
    return ErrorMessage.instance;
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'error-notifications';
    return container;
  }

  public display(message: string, duration: number = 5000): void {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <span>${message}</span>
      <button class="error-close">×</button>
    `;

    const closeBtn = notification.querySelector('.error-close');
    closeBtn?.addEventListener('click', () => this.hide(notification));

    this.container.appendChild(notification);

    setTimeout(() => this.hide(notification), duration);
  }

  private hide(notification: HTMLElement): void {
    notification.remove();
  }
}