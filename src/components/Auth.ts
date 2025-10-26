import { ApiService } from '../services/ApiService';
import { validateEmail, Validators } from '../utils/validators';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { PaymentMethod } from '../types/api';

export class Auth {
  private apiService: ApiService;
  private loader: Loader;
  private errorMessage: ErrorMessage;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.loader = new Loader();
    this.errorMessage = ErrorMessage.getInstance();
  }

  public renderLoginForm(): string {
    return `
      <div class="auth-modal" id="loginModal">
        <div class="auth-content">
          <span class="auth-close">&times;</span>
          <h2>Login</h2>
          <form id="loginForm">
            <div class="form-row">
              <input type="text" id="loginLogin" placeholder="Login" required>
              <div class="validation-message" id="loginLoginError"></div>
            </div>
            <div class="form-row">
              <input type="password" id="loginPassword" placeholder="Password" required>
              <div class="validation-message" id="loginPasswordError"></div>
            </div>
            <button type="submit" id="loginSubmit" disabled>Login</button>
          </form>
          <p>Don't have an account? <a href="#" id="showRegister">Register</a></p>
        </div>
      </div>
    `;
  }

  public renderRegisterForm(): string {
    return `
      <div class="auth-modal" id="registerModal">
        <div class="auth-content">
          <span class="auth-close">&times;</span>
          <h2>Register</h2>
          <form id="registerForm">
            <div class="form-row">
              <input type="text" id="registerLogin" placeholder="Login" required>
              <div class="validation-message" id="registerLoginError"></div>
            </div>
            <div class="form-row">
              <input type="email" id="registerEmail" placeholder="Email" required>
              <div class="validation-message" id="registerEmailError"></div>
            </div>
            <div class="form-row">
              <input type="password" id="registerPassword" placeholder="Password" required>
              <div class="validation-message" id="registerPasswordError"></div>
            </div>
            <div class="form-row">
              <input type="password" id="registerConfirm" placeholder="Confirm Password" required>
              <div class="validation-message" id="registerConfirmError"></div>
            </div>
            <div class="form-row">
              <select id="registerCity">
                <option value="">Select city</option>
                <option value="CityA">CityA</option>
                <option value="CityB">CityB</option>
                <option value="CityC">CityC</option>
              </select>
              <div class="validation-message" id="registerCityError"></div>
            </div>
            <div class="form-row">
              <select id="registerStreet">
                <option value="">Select street</option>
              </select>
              <div class="validation-message" id="registerStreetError"></div>
            </div>
            <div class="form-row">
              <input type="number" id="registerHouse" placeholder="House number" required min="1">
              <div class="validation-message" id="registerHouseError"></div>
            </div>
            <div class="form-row">
              <label><input type="radio" name="payment" value="cash" checked> Cash</label>
              <label><input type="radio" name="payment" value="card"> Card</label>
            </div>
            <button type="submit" id="registerSubmit" disabled>Register</button>
          </form>
          <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
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
        <button id="loginBtn" class="auth-btn">Login</button>
        <button id="registerBtn" class="auth-btn">Register</button>
        <div id="userInfo" class="user-info" style="display: none;">
          <span id="userName"></span>
          <button id="logoutBtn" class="auth-btn">Logout</button>
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

    // Validation delegation for dynamically inserted forms
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.id === 'registerLogin' || target.id === 'registerPassword' || target.id === 'registerConfirm' || target.id === 'registerEmail' || target.id === 'registerHouse' || target.id === 'registerCity')) {
        // clear validation message
        const err = document.getElementById(`${target.id}Error`);
        if (err) err.textContent = '';
      }
    });

    document.addEventListener('blur', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;
      if (target.id === 'registerLogin') {
        const res = Validators.validateLogin(target.value);
        const err = document.getElementById('registerLoginError');
        if (!res.isValid && err) err.textContent = res.message || '';
      }
      if (target.id === 'registerPassword') {
        const res = Validators.validatePassword(target.value);
        const err = document.getElementById('registerPasswordError');
        if (!res.isValid && err) err.textContent = res.message || '';
      }
      if (target.id === 'registerConfirm') {
        const pw = (document.getElementById('registerPassword') as HTMLInputElement).value;
        const res = Validators.validatePasswordMatch(pw, target.value);
        const err = document.getElementById('registerConfirmError');
        if (!res.isValid && err) err.textContent = res.message || '';
      }
      if (target.id === 'registerEmail') {
        const ok = validateEmail(target.value);
        const err = document.getElementById('registerEmailError');
        if (!ok && err) err.textContent = 'Invalid email';
      }
      if (target.id === 'registerHouse') {
        const res = Validators.validateHouseNumber(target.value);
        const err = document.getElementById('registerHouseError');
        if (!res.isValid && err) err.textContent = res.message || '';
      }
      if (target.id === 'registerCity') {
        // populate streets
        const city = (document.getElementById('registerCity') as HTMLSelectElement).value;
        const streetSelect = document.getElementById('registerStreet') as HTMLSelectElement;
        if (streetSelect) {
          streetSelect.innerHTML = '<option value="">Select street</option>';
          const streets = city === 'CityA' ? ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10'] : city === 'CityB' ? ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'] : ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10'];
          streets.forEach(s => {
            const opt = document.createElement('option'); opt.value = s; opt.textContent = s; streetSelect.appendChild(opt);
          });
        }
      }

      // enable/disable submit buttons based on simple form checks
      const registerForm = document.getElementById('registerForm') as HTMLFormElement | null;
      if (registerForm) {
        const login = (document.getElementById('registerLogin') as HTMLInputElement).value;
        const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
        const password = (document.getElementById('registerPassword') as HTMLInputElement).value;
        const confirm = (document.getElementById('registerConfirm') as HTMLInputElement).value;
        const cityVal = (document.getElementById('registerCity') as HTMLSelectElement).value;
        const streetVal = (document.getElementById('registerStreet') as HTMLSelectElement).value;
        const houseVal = (document.getElementById('registerHouse') as HTMLInputElement).value;
        const loginOk = Validators.validateLogin(login).isValid;
        const passOk = Validators.validatePassword(password).isValid;
        const matchOk = Validators.validatePasswordMatch(password, confirm).isValid;
        const emailOk = validateEmail(email);
        const houseOk = Validators.validateHouseNumber(houseVal).isValid;
        const submitBtn = document.getElementById('registerSubmit') as HTMLButtonElement | null;
        if (submitBtn) submitBtn.disabled = !(loginOk && passOk && matchOk && emailOk && cityVal && streetVal && houseOk);
      }

      const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
      if (loginForm) {
        const loginVal = (document.getElementById('loginLogin') as HTMLInputElement).value;
        const pwVal = (document.getElementById('loginPassword') as HTMLInputElement).value;
        const loginOk = Validators.validateLogin(loginVal).isValid;
        const pwOk = Validators.validatePassword(pwVal).isValid;
        const loginBtn = document.getElementById('loginSubmit') as HTMLButtonElement | null;
        if (loginBtn) loginBtn.disabled = !(loginOk && pwOk);
      }
    }, true);

    // react to input events so button state updates live (not only on blur)
    document.addEventListener('input', (e) => {
      this.updateSubmitButtons();
    });
  }

  private showLoginModal(): void {
    // avoid inserting duplicate modal if one already exists
    if (document.getElementById('loginModal')) return;
    document.body.insertAdjacentHTML('beforeend', this.renderLoginForm());
  }

  private showRegisterModal(): void {
    // avoid inserting duplicate modal if one already exists
    if (document.getElementById('registerModal')) return;
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
    const loginInput = document.getElementById('loginLogin') as HTMLInputElement | null;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement | null;
    const loginVal = loginInput?.value ?? '';
    const passwordVal = passwordInput?.value ?? '';

    // clear previous validation
    const loginErr = document.getElementById('loginLoginError');
    const pwErr = document.getElementById('loginPasswordError');
    if (loginErr) loginErr.textContent = '';
    if (pwErr) pwErr.textContent = '';
    if (loginInput) loginInput.classList.remove('invalid');
    if (passwordInput) passwordInput.classList.remove('invalid');

    const loginValidation = Validators.validateLogin(loginVal);
    const pwValidation = Validators.validatePassword(passwordVal);

    if (!loginValidation.isValid || !pwValidation.isValid) {
      if (!loginValidation.isValid && loginErr) {
        loginErr.textContent = loginValidation.message || 'Invalid login';
        (loginErr as HTMLElement).style.color = 'red';
        if (loginInput) loginInput.classList.add('invalid');
        if (loginInput) (loginInput.style as any).borderColor = 'red';
      }
      if (!pwValidation.isValid && pwErr) {
        pwErr.textContent = pwValidation.message || 'Invalid password';
        (pwErr as HTMLElement).style.color = 'red';
        if (passwordInput) passwordInput.classList.add('invalid');
        if (passwordInput) (passwordInput.style as any).borderColor = 'red';
      }
      return;
    }

    // show loader on body while login request is in progress
    this.loader.show(document.body);
    try {
      const response = await this.apiService.login({ login: loginVal, password: passwordVal });
      localStorage.setItem('user', JSON.stringify(response));
      this.updateUserInterface(response.login);
      this.closeModals();
    } catch (error: any) {
      // Map server error to form fields or show global message
      this.mapServerErrorToFields(error, ['loginLogin','loginPassword']);
    } finally {
      this.loader.hide();
    }
  }

  private async handleRegister(): Promise<void> {
    const loginInput = document.getElementById('registerLogin') as HTMLInputElement | null;
    const emailInput = document.getElementById('registerEmail') as HTMLInputElement | null;
    const passwordInput = document.getElementById('registerPassword') as HTMLInputElement | null;
    const confirmInput = document.getElementById('registerConfirm') as HTMLInputElement | null;
    const citySelect = document.getElementById('registerCity') as HTMLSelectElement | null;
    const streetSelect = document.getElementById('registerStreet') as HTMLSelectElement | null;
    const houseInput = document.getElementById('registerHouse') as HTMLInputElement | null;

    const loginVal = loginInput?.value ?? '';
    const emailVal = emailInput?.value ?? '';
    const passwordVal = passwordInput?.value ?? '';
    const confirmVal = confirmInput?.value ?? '';
    const cityVal = citySelect?.value ?? '';
    const streetVal = streetSelect?.value ?? '';
    const houseVal = houseInput?.value ?? '';

    // clear previous validation
    const errIds = ['registerLoginError','registerEmailError','registerPasswordError','registerConfirmError','registerCityError','registerStreetError','registerHouseError'];
    errIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
    [loginInput, emailInput, passwordInput, confirmInput, houseInput].forEach(inp => { if (inp) inp.classList.remove('invalid'); if (inp) (inp.style as any).borderColor = ''; });

    let hasError = false;

    const loginValidation = Validators.validateLogin(loginVal);
    if (!loginValidation.isValid) {
      const el = document.getElementById('registerLoginError'); if (el) { el.textContent = loginValidation.message || 'Invalid login'; (el as HTMLElement).style.color = 'red'; }
      if (loginInput) { loginInput.classList.add('invalid'); (loginInput.style as any).borderColor = 'red'; }
      hasError = true;
    }

    if (!validateEmail(emailVal)) {
      const el = document.getElementById('registerEmailError'); if (el) { el.textContent = 'Invalid email'; (el as HTMLElement).style.color = 'red'; }
      if (emailInput) { emailInput.classList.add('invalid'); (emailInput.style as any).borderColor = 'red'; }
      hasError = true;
    }

    const passValidation = Validators.validatePassword(passwordVal);
    if (!passValidation.isValid) {
      const el = document.getElementById('registerPasswordError'); if (el) { el.textContent = passValidation.message || 'Invalid password'; (el as HTMLElement).style.color = 'red'; }
      if (passwordInput) { passwordInput.classList.add('invalid'); (passwordInput.style as any).borderColor = 'red'; }
      hasError = true;
    }

    const matchValidation = Validators.validatePasswordMatch(passwordVal, confirmVal);
    if (!matchValidation.isValid) {
      const el = document.getElementById('registerConfirmError'); if (el) { el.textContent = matchValidation.message || 'Passwords do not match'; (el as HTMLElement).style.color = 'red'; }
      if (confirmInput) { confirmInput.classList.add('invalid'); (confirmInput.style as any).borderColor = 'red'; }
      hasError = true;
    }

    const houseValidation = Validators.validateHouseNumber(houseVal);
    if (!houseValidation.isValid) {
      const el = document.getElementById('registerHouseError'); if (el) { el.textContent = houseValidation.message || 'Invalid house number'; (el as HTMLElement).style.color = 'red'; }
      if (houseInput) { houseInput.classList.add('invalid'); (houseInput.style as any).borderColor = 'red'; }
      hasError = true;
    }

    if (!cityVal) {
      const el = document.getElementById('registerCityError'); if (el) { el.textContent = 'City is required'; (el as HTMLElement).style.color = 'red'; }
      hasError = true;
    }

    if (!streetVal) {
      const el = document.getElementById('registerStreetError'); if (el) { el.textContent = 'Street is required'; (el as HTMLElement).style.color = 'red'; }
      hasError = true;
    }

    if (hasError) return;

    // show loader on body while registration request is in progress
    this.loader.show(document.body);
    try {
      const registerData = {
        login: loginVal,
        password: passwordVal,
        confirmPassword: confirmVal,
        city: cityVal || 'Default City',
        street: streetVal || 'Default Street',
        house: parseInt(houseVal, 10) || 1,
        paymentMethod: PaymentMethod.CASH
      };
      await this.apiService.register(registerData);
      // Auto-login after successful registration
      try {
        const resp = await this.apiService.login({ login: registerData.login, password: registerData.password });
        localStorage.setItem('user', JSON.stringify(resp));
        this.updateUserInterface(resp.login);
        this.closeModals();
      } catch (loginErr: any) {
        // If auto-login fails, show success message and ask to login
        this.errorMessage.display('Registration successful! Please login.');
        this.switchToLogin();
      }
    } catch (error: any) {
      // Map server error to specific fields when possible
      this.mapServerErrorToFields(error, ['registerLogin','registerEmail','registerPassword','registerConfirm','registerCity','registerStreet','registerHouse']);
    } finally {
      this.loader.hide();
    }
  }

  // Try to map a server error to form field error elements. If mapping not possible, show a global error.
  private mapServerErrorToFields(error: any, candidateFieldIds: string[]): void {
    // normalize error
    try {
      // common structured formats
      if (!error) {
        this.errorMessage.display('Operation failed');
        return;
      }

      // If error contains an `errors` object: { errors: { field: 'msg' } }
      if (error.errors && typeof error.errors === 'object') {
        let firstSet = false;
        for (const key of Object.keys(error.errors)) {
          const id = `${key}Error`;
          const el = document.getElementById(id);
          if (el) {
            el.textContent = error.errors[key] || String(error.errors[key]);
            (el as HTMLElement).style.color = 'red';
            // try to mark input
            const input = document.getElementById(key) as HTMLElement | null;
            if (input) { input.classList.add('invalid'); (input as HTMLElement).style.borderColor = 'red'; if (!firstSet) { (input as HTMLElement).focus?.(); firstSet = true; } }
          }
        }
        if (!firstSet) this.errorMessage.display(error.message || 'Operation failed');
        return;
      }

      // If error has field/message structure
      if (error.field && error.message) {
        const id = `${error.field}Error`;
        const el = document.getElementById(id);
        if (el) {
          el.textContent = error.message;
          (el as HTMLElement).style.color = 'red';
          const input = document.getElementById(error.field) as HTMLElement | null;
          if (input) { input.classList.add('invalid'); (input as HTMLElement).style.borderColor = 'red'; input.focus?.(); }
          return;
        }
      }

      // If error.message contains keywords, map heuristically
      const msg = String(error.message || error || '');
      const lowered = msg.toLowerCase();
      for (const fid of candidateFieldIds) {
        const fieldName = fid.replace(/(register|login)/, '').replace(/^[A-Z]/, (m) => m.toLowerCase());
        // simple heuristics: check if message mentions login/email/password/house/city/street
        if (lowered.includes('login') && (fid.toLowerCase().includes('login') || fid.toLowerCase().includes('email'))) {
          const el = document.getElementById(`${fid}Error`);
          if (el) { el.textContent = msg; (el as HTMLElement).style.color = 'red'; const inp = document.getElementById(fid) as HTMLElement | null; if (inp) { inp.classList.add('invalid'); inp.focus?.(); } return; }
        }
        if (lowered.includes('password') && fid.toLowerCase().includes('password')) {
          const el = document.getElementById(`${fid}Error`);
          if (el) { el.textContent = msg; (el as HTMLElement).style.color = 'red'; const inp = document.getElementById(fid) as HTMLElement | null; if (inp) { inp.classList.add('invalid'); inp.focus?.(); } return; }
        }
        if (lowered.includes('email') && fid.toLowerCase().includes('email')) {
          const el = document.getElementById(`${fid}Error`);
          if (el) { el.textContent = msg; (el as HTMLElement).style.color = 'red'; const inp = document.getElementById(fid) as HTMLElement | null; if (inp) { inp.classList.add('invalid'); inp.focus?.(); } return; }
        }
      }

      // fallback: global message
      this.errorMessage.display(msg || 'Operation failed');
    } catch (e) {
      this.errorMessage.display('Operation failed');
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
      this.updateUserInterface(userData.login);
    }
  }

  // update submit buttons for both forms based on current input values
  private updateSubmitButtons(): void {
    const loginInput = document.getElementById('loginLogin') as HTMLInputElement | null;
    const loginPw = document.getElementById('loginPassword') as HTMLInputElement | null;
    const loginBtn = document.getElementById('loginSubmit') as HTMLButtonElement | null;
    if (loginBtn) {
      const loginOk = loginInput ? Validators.validateLogin(loginInput.value).isValid : false;
      const pwOk = loginPw ? Validators.validatePassword(loginPw.value).isValid : false;
      loginBtn.disabled = !(loginOk && pwOk);
    }

    const registerForm = document.getElementById('registerForm') as HTMLFormElement | null;
    const registerBtn = document.getElementById('registerSubmit') as HTMLButtonElement | null;
    if (registerBtn && registerForm) {
      const loginVal = (document.getElementById('registerLogin') as HTMLInputElement | null)?.value ?? '';
      const emailVal = (document.getElementById('registerEmail') as HTMLInputElement | null)?.value ?? '';
      const passwordVal = (document.getElementById('registerPassword') as HTMLInputElement | null)?.value ?? '';
      const confirmVal = (document.getElementById('registerConfirm') as HTMLInputElement | null)?.value ?? '';
      const cityVal = (document.getElementById('registerCity') as HTMLSelectElement | null)?.value ?? '';
      const streetVal = (document.getElementById('registerStreet') as HTMLSelectElement | null)?.value ?? '';
      const houseVal = (document.getElementById('registerHouse') as HTMLInputElement | null)?.value ?? '';
      const loginOk = Validators.validateLogin(loginVal).isValid;
      const passOk = Validators.validatePassword(passwordVal).isValid;
      const matchOk = Validators.validatePasswordMatch(passwordVal, confirmVal).isValid;
      const emailOk = validateEmail(emailVal);
      const houseOk = Validators.validateHouseNumber(houseVal).isValid;
      registerBtn.disabled = !(loginOk && passOk && matchOk && emailOk && cityVal && streetVal && houseOk);
    }
  }
}