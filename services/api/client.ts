import type { ApiError } from '~/types'

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiClient {
  private baseURL: string
  private token: string | null = null
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.baseURL}${endpoint}`
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
      url += `?${searchParams.toString()}`
    }
    
    return url
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    
    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }
    
    return headers
  }

  private handleError(error: any): never {
    console.error('API Error:', error)
    
    // Extract meaningful error message
    let errorMessage = 'An unexpected error occurred'
    let statusCode = 500
    
    if (error.response) {
      statusCode = error.response.status
      const responseData = error.response._data || error.response.data
      
      if (responseData) {
        if (typeof responseData === 'string') {
          errorMessage = responseData
        } else if (responseData.message) {
          errorMessage = responseData.message
        } else if (responseData.error) {
          errorMessage = responseData.error
        }
      }
    } else if (error.data) {
      const data = error.data
      if (data.message) {
        errorMessage = data.message
      } else if (data.error) {
        errorMessage = data.error
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // Handle specific HTTP status codes
    switch (statusCode) {
      case 401:
        errorMessage = 'Authentication required. Please log in again.'
        break
      case 403:
        errorMessage = 'You do not have permission to perform this action.'
        break
      case 404:
        errorMessage = 'The requested resource was not found.'
        break
      case 422:
        errorMessage = 'Validation failed. Please check your input.'
        break
      case 500:
        errorMessage = 'Server error. Please try again later.'
        break
    }
    
    const apiError: ApiError = {
      message: errorMessage,
      code: statusCode,
      name: error.name || 'ApiError',
      className: error.className,
      data: error.data
    }
    
    throw apiError
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildURL(endpoint, options.params)
    const headers = this.buildHeaders(options.headers)
    
    const fetchOptions: any = {
      method: options.method || 'GET',
      headers
    }
    
    if (options.body && options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body)
    }
    
    try {
      const response = await $fetch<T>(url, fetchOptions)
      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, params })
  }

  async put<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, params })
  }

  async patch<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, params })
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params })
  }
}

// Create default API client instances
export const createAuthClient = () => new ApiClient('http://localhost:3030')
export const createNakamaClient = () => new ApiClient('http://localhost:3032') 