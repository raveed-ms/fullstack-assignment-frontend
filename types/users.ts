import type { User } from './index'

// User search state
export interface UserSearchState {
  term: string
  field: 'name' | 'email' | 'id'
}

// User sort state
export interface UserSortState {
  field: string
  order: 'asc' | 'desc'
}

// User pagination state
export interface UserPaginationState {
  page: number
  itemsPerPage: number
  total: number
}

// User table options
export interface UserTableOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
}

// User filters (for future implementation)
export interface UserFilters {
  role: string | null
  blacklisted: boolean | null
  createdFrom: string | null
  createdTo: string | null
  updatedFrom: string | null
  updatedTo: string | null
}

// User filter query (for API)
export interface UserFilterQuery {
  role?: string
  blacklisted?: boolean
  createdFrom?: string
  createdTo?: string
  updatedFrom?: string
  updatedTo?: string
}

// User form data
export interface UserFormData {
  name: string
  email: string
  role: 'user' | 'mod' | 'admin'
  blacklisted: boolean
}

// User update data
export interface UserUpdateData {
  name?: string
  email?: string
  role?: 'user' | 'mod' | 'admin'
  blacklisted?: boolean
} 