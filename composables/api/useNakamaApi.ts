import type { FlattenedNakamaUser, NakamaUsersResponse } from '~/types'
import type { NakamaQueryParams } from '~/services/api/nakama.service'
import { nakamaService } from '~/services/api'

export function useNakamaApi() {
  const setToken = (token: string | null) => {
    nakamaService.setToken(token)
  }

  const getAllUsers = async (params?: NakamaQueryParams): Promise<NakamaUsersResponse> => {
    return nakamaService.getAllUsers(params)
  }

  const getUserById = async (id: string): Promise<FlattenedNakamaUser> => {
    return nakamaService.getUserById(id)
  }

  const updateUser = async (id: string, updates: Partial<FlattenedNakamaUser>): Promise<FlattenedNakamaUser> => {
    return nakamaService.updateUser(id, updates)
  }

  const searchUsers = async (params: NakamaQueryParams): Promise<NakamaUsersResponse> => {
    return nakamaService.searchUsers(params)
  }

  const getUsersWithPagination = async (page: number, limit: number, params?: NakamaQueryParams): Promise<NakamaUsersResponse> => {
    return nakamaService.getUsersWithPagination(page, limit, params)
  }

  const getUsersWithSort = async (sortBy: string, sortOrder: 'asc' | 'desc', params?: NakamaQueryParams): Promise<NakamaUsersResponse> => {
    return nakamaService.getUsersWithSort(sortBy, sortOrder, params)
  }

  const getUsersWithFilters = async (filters: NakamaQueryParams): Promise<NakamaUsersResponse> => {
    return nakamaService.getUsersWithFilters(filters)
  }

  return {
    setToken,
    getAllUsers,
    getUserById,
    updateUser,
    searchUsers,
    getUsersWithPagination,
    getUsersWithSort,
    getUsersWithFilters
  }
} 