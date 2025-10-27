export declare function validateEmail(email: string): boolean;
export declare function validatePassword(password: string): boolean;
export declare class Validators {
    static validateLogin(login: string): {
        isValid: boolean;
        message?: string;
    };
    static validatePassword(password: string): {
        isValid: boolean;
        message?: string;
    };
    static validatePasswordMatch(password: string, confirmPassword: string): {
        isValid: boolean;
        message?: string;
    };
    static validateHouseNumber(house: string): {
        isValid: boolean;
        message?: string;
    };
    static validateRequired(value: string, fieldName: string): {
        isValid: boolean;
        message?: string;
    };
}
//# sourceMappingURL=validators.d.ts.map