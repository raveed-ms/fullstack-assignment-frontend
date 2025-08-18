import { apiClient } from './client';
import type { ApiResponse, LoginRequest, LoginResponse, User } from '~/types/api';

/**
 * Authentication API module
 * Handles login, logout, and session management
 */
export const authApi = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const loginData: LoginRequest = {
      strategy: 'local',
      email,
      password
    };
    
    return apiClient.post<LoginResponse>('/authentication', loginData);
  },
  
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/authentication');
  },
  
  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    apiClient.setAuthToken(token);
    
    // Store token in localStorage if in browser environment
    if (process.client && token) {
      localStorage.setItem('auth_token', token);
    } else if (process.client) {
      localStorage.removeItem('auth_token');
    }
  },
  
  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    // Try to get token from API client first
    let token = apiClient.getAuthToken();
    
    // If not found and in browser, try localStorage
    if (!token && process.client) {
      token = localStorage.getItem('auth_token');
      
      // If found in localStorage, update the API client
      if (token) {
        apiClient.setAuthToken(token);
      }
    }
    
    return token;
  },
  
  /**
   * Clear authentication (logout)
   */
  logout(): void {
    this.setToken(null);
  }
};
