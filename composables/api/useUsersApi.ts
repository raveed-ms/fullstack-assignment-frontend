import type { User } from '~/types'
import type { UsersQueryParams } from '~/services/api/users.service'
import { usersService } from '~/services/api'

export function useUsersApi() {
  const setToken = (token: string | null) => {
    usersService.setToken(token)
  }

  const getAllUsers = async (params?: UsersQueryParams): Promise<User[]> => {
    return usersService.getAllUsers(params)
  }

  const getUserById = async (id: number): Promise<User> => {
    return usersService.getUserById(id)
  }

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    return usersService.createUser(userData)
  }

  const updateUser = async (id: number, updates: Partial<User>): Promise<User> => {
    return usersService.updateUser(id, updates)
  }

  const deleteUser = async (id: number): Promise<void> => {
    return usersService.deleteUser(id)
  }

  const toggleBlacklist = async (id: number, blacklisted: boolean): Promise<User> => {
    return usersService.toggleBlacklist(id, blacklisted)
  }

  const changeUserRole = async (id: number, role: 'user' | 'mod' | 'admin'): Promise<User> => {
    return usersService.changeUserRole(id, role)
  }

  const searchUsers = async (query: string, field?: 'name' | 'email' | 'id'): Promise<User[]> => {
    return usersService.searchUsers(query, field)
  }

  return {
    setToken,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleBlacklist,
    changeUserRole,
    searchUsers
  }
} 