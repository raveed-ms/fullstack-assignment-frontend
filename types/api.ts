// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// API Error Types
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
  path?: string;
}

// Validation Error Types
export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  details: {
    errors: Array<{
      field: string;
      message: string;
      keyword: string;
      params?: Record<string, any>;
    }>;
  };
}

// Authentication Types
export interface LoginRequest {
  strategy: 'local';
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  authentication: {
    strategy: string;
  };
  user: User;
}

// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'mod' | 'admin';
  blacklisted: boolean;
  created_at: string;
  updated_at: string;
}

// User Update Types
export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  role?: 'user' | 'mod' | 'admin';
  blacklisted?: boolean;
  updated_at?: string;
}

// User Query Types
export interface UserQueryParams {
  limit?: number;
  skip?: number;
  searchName?: string;
  searchEmail?: string;
  searchId?: string;
  role?: 'user' | 'mod' | 'admin';
  blacklisted?: boolean;
  sort?: {
    field: 'name' | 'email' | 'role' | 'created_at' | 'updated_at';
    order: 'asc' | 'desc';
  };
}

// User List Response
export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  skip: number;
}

// Registration Types
export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

// Re-export changelog types
export * from './changelog';
