import { ApiService } from './services/ApiService.js';
import { Loader } from './components/Loader.js';
import { ErrorMessage } from './components/ErrorMessage.js';

// Import existing styles
import '../styles/style.css';

class App {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Coffee House TypeScript App initialized');
      
      // Test API connection
      this.testApiConnection();
    });
  }

  private async testApiConnection(): Promise<void> {
    try {
      console.log('Testing API connection...');
      // This will be replaced with actual API calls in next stages
    } catch (error) {
      console.error('API connection failed:', error);
    }
  }
}

// Initialize the application
new App();