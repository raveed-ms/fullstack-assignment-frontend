import { apiClient } from './client';
import type { 
  ApiResponse, 
  User, 
  UserUpdateRequest, 
  UserQueryParams, 
  UserListResponse,
  ValidationError 
} from '~/types/api';

/**
 * Users API module
 * Handles user management operations
 */
export const usersApi = {
  /**
   * Get a list of users with optional filtering and pagination
   * Admin role required
   */
  async getUsers(params?: UserQueryParams): Promise<ApiResponse<UserListResponse>> {
    // Handle complex parameters like sort that need JSON.stringify
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof UserQueryParams];
        if (value !== undefined && value !== null) {
          if (key === 'sort' && typeof value === 'object') {
            // Handle sort parameter with JSON.stringify
            queryParams.append(key, JSON.stringify(value));
          } else {
            // Handle other parameters normally
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    
    return apiClient.get<UserListResponse>(url);
  },

  /**
   * Get a specific user by ID
   * Admin role required
   */
  async getUser(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Update user information
   * Users can only update their own profile (name, email, password)
   * Admin role required for updating other users or role/blacklist fields
   */
  async updateUser(id: number, updateData: UserUpdateRequest): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, updateData);
  },

  /**
   * Delete a user
   * Admin role required
   */
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  },

  /**
   * Create a new user
   * First user creation doesn't require authentication
   * Subsequent user creations require admin role
   * Role defaults to 'user' on the backend
   */
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', userData);
  }
};


