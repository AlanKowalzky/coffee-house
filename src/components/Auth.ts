import { ApiService } from '../services/ApiService';
import { validateEmail, validatePassword } from '../utils/validators';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';

export class Auth {
  private apiService: ApiService;
  private loader: Loader;
  private errorMessage: ErrorMessage;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.loader = new Loader();
    this.errorMessage = new ErrorMessage();
  }

  public renderLoginForm(): string {
    return `
      <div class="auth-modal" id="loginModal">
        <div class="auth-content">
          <span class="auth-close">&times;</span>
          <h2>Zaloguj się</h2>
          <form id="loginForm">
            <input type="email" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Hasło" required>
            <button type="submit">Zaloguj</button>
          </form>
          <p>Nie masz konta? <a href="#" id="showRegister">Zarejestruj się</a></p>
        </div>
      </div>
    `;
  }

  public renderRegisterForm(): string {
    return `
      <div class="auth-modal" id="registerModal">
        <div class="auth-content">
          <span class="auth-close">&times;</span>
          <h2>Zarejestruj się</h2>
          <form id="registerForm">
            <input type="text" id="registerName" placeholder="Imię" required>
            <input type="email" id="registerEmail" placeholder="Email" required>
            <input type="password" id="registerPassword" placeholder="Hasło" required>
            <button type="submit">Zarejestruj</button>
          </form>
          <p>Masz już konto? <a href="#" id="showLogin">Zaloguj się</a></p>
        </div>
      </div>
    `;
  }

  public initializeAuth(): void {
    this.addAuthButtons();
    this.bindEvents();
  }

  private addAuthButtons(): void {
    const header = document.querySelector('header .container');
    if (header) {
      const authButtons = document.createElement('div');
      authButtons.className = 'auth-buttons';
      authButtons.innerHTML = `
        <button id="loginBtn" class="auth-btn">Zaloguj</button>
        <button id="registerBtn" class="auth-btn">Zarejestruj</button>
        <div id="userInfo" class="user-info" style="display: none;">
          <span id="userName"></span>
          <button id="logoutBtn" class="auth-btn">Wyloguj</button>
        </div>
      `;
      header.appendChild(authButtons);
    }
  }

  private bindEvents(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.id === 'loginBtn') this.showLoginModal();
      if (target.id === 'registerBtn') this.showRegisterModal();
      if (target.id === 'showRegister') this.switchToRegister();
      if (target.id === 'showLogin') this.switchToLogin();
      if (target.classList.contains('auth-close')) this.closeModals();
      if (target.id === 'logoutBtn') this.logout();
    });

    document.addEventListener('submit', (e) => {
      if ((e.target as HTMLElement).id === 'loginForm') {
        e.preventDefault();
        this.handleLogin();
      }
      if ((e.target as HTMLElement).id === 'registerForm') {
        e.preventDefault();
        this.handleRegister();
      }
    });
  }

  private showLoginModal(): void {
    document.body.insertAdjacentHTML('beforeend', this.renderLoginForm());
  }

  private showRegisterModal(): void {
    document.body.insertAdjacentHTML('beforeend', this.renderRegisterForm());
  }

  private switchToRegister(): void {
    this.closeModals();
    this.showRegisterModal();
  }

  private switchToLogin(): void {
    this.closeModals();
    this.showLoginModal();
  }

  private closeModals(): void {
    document.querySelectorAll('.auth-modal').forEach(modal => modal.remove());
  }

  private async handleLogin(): Promise<void> {
    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    if (!validateEmail(email) || !validatePassword(password)) {
      this.errorMessage.show('Nieprawidłowy email lub hasło');
      return;
    }

    this.loader.show();
    try {
      const response = await this.apiService.login(email, password);
      localStorage.setItem('user', JSON.stringify(response.data));
      this.updateUserInterface(response.data.name);
      this.closeModals();
    } catch (error) {
      this.errorMessage.show('Błąd logowania');
    } finally {
      this.loader.hide();
    }
  }

  private async handleRegister(): Promise<void> {
    const name = (document.getElementById('registerName') as HTMLInputElement).value;
    const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;

    if (!validateEmail(email) || !validatePassword(password) || !name.trim()) {
      this.errorMessage.show('Wypełnij wszystkie pola poprawnie');
      return;
    }

    this.loader.show();
    try {
      await this.apiService.register(name, email, password);
      this.errorMessage.show('Rejestracja udana! Możesz się zalogować', 'success');
      this.switchToLogin();
    } catch (error) {
      this.errorMessage.show('Błąd rejestracji');
    } finally {
      this.loader.hide();
    }
  }

  private logout(): void {
    localStorage.removeItem('user');
    this.updateUserInterface(null);
  }

  private updateUserInterface(userName: string | null): void {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userInfo = document.getElementById('userInfo');
    const userNameSpan = document.getElementById('userName');

    if (userName) {
      loginBtn?.style.setProperty('display', 'none');
      registerBtn?.style.setProperty('display', 'none');
      userInfo?.style.setProperty('display', 'flex');
      if (userNameSpan) userNameSpan.textContent = userName;
    } else {
      loginBtn?.style.setProperty('display', 'block');
      registerBtn?.style.setProperty('display', 'block');
      userInfo?.style.setProperty('display', 'none');
    }
  }

  public checkAuthStatus(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.updateUserInterface(userData.name);
    }
  }
}