import type { ApiResponse, ApiError } from '~/types/api';

// Default API configuration
const API_TIMEOUT = 30000; // 30 seconds

/**
 * API client for making HTTP requests
 * Handles authentication, errors, and response formatting
 */
export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(
    baseUrl: string = '',
    timeout: number = API_TIMEOUT
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Get authentication token from headers
   */
  getAuthToken(): string | null {
    const authHeader = this.headers['Authorization'];
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    return parts.length === 2 ? parts[1] : null;
  }
  
  /**
   * Update the base URL
   * Used by the plugin to set the URL from runtime config
   */
  updateBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    
    // Add query parameters if provided
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }
    
    return this.request<T>('GET', url.toString());
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', `${this.baseUrl}${path}`, data);
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', `${this.baseUrl}${path}`, data);
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', `${this.baseUrl}${path}`, data);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', `${this.baseUrl}${path}`);
  }

  /**
   * Base request method
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const options: RequestInit = {
        method,
        headers: this.headers,
        signal: controller.signal,
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      
      // Parse response based on content type
      let responseData: any;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      clearTimeout(timeoutId);

      // Handle API error responses
      if (!response.ok) {
        const error: ApiError = responseData;
        return {
          success: false,
          error
        };
      }

      // Handle successful responses
      return {
        success: true,
        data: responseData.data,
        message: responseData.message
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle network errors
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: {
            status: 408,
            code: 'REQUEST_TIMEOUT',
            message: 'Request timed out'
          }
        };
      }
      
      return {
        success: false,
        error: {
          status: 0,
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error'
        }
      };
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export a factory function for creating new instances (useful for testing)
export const createApiClient = (baseUrl?: string, timeout?: number) => {
  return new ApiClient(baseUrl, timeout);
};
