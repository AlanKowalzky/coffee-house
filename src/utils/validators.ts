export class Validators {
  static validateLogin(login: string): { isValid: boolean; message?: string } {
    if (login.length < 3) {
      return { isValid: false, message: 'Login must be at least 3 characters long' };
    }
    
    if (!/^[a-zA-Z]/.test(login)) {
      return { isValid: false, message: 'Login must start with a letter' };
    }
    
    if (!/^[a-zA-Z]+$/.test(login)) {
      return { isValid: false, message: 'Login can only contain English letters' };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least 1 special character' };
    }
    
    return { isValid: true };
  }

  static validatePasswordMatch(password: string, confirmPassword: string): { isValid: boolean; message?: string } {
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match' };
    }
    
    return { isValid: true };
  }

  static validateHouseNumber(house: string): { isValid: boolean; message?: string } {
    const houseNum = parseInt(house, 10);
    
    if (isNaN(houseNum) || houseNum < 1) {
      return { isValid: false, message: 'House number must be greater than 0' };
    }
    
    return { isValid: true };
  }

  static validateRequired(value: string, fieldName: string): { isValid: boolean; message?: string } {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    
    return { isValid: true };
  }
}