import { ApiService } from '../services/ApiService';
export declare class Auth {
    private apiService;
    private loader;
    private errorMessage;
    constructor(apiService: ApiService);
    renderLoginForm(): string;
    renderRegisterForm(): string;
    initializeAuth(): void;
    private addAuthButtons;
    private bindEvents;
    private showLoginModal;
    private showRegisterModal;
    private switchToRegister;
    private switchToLogin;
    private closeModals;
    private handleLogin;
    private handleRegister;
    private mapServerErrorToFields;
    private logout;
    private updateUserInterface;
    checkAuthStatus(): void;
    private updateSubmitButtons;
}
//# sourceMappingURL=Auth.d.ts.map