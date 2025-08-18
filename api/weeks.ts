import { apiClient } from './client';
import type { ApiResponse } from '~/types/api';

// Week types matching backend
export interface Week {
  id: number;
  seasonId: number;
  weekNumber: number;
  startDate: string; // ISO format
  endDate: string;   // ISO format
  createdBy: number;
  updatedBy: number;
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

export interface WeekCreate {
  seasonId: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export interface WeekUpdate {
  seasonId?: number;
  weekNumber?: number;
  startDate?: string;
  endDate?: string;
}

export interface WeekQuery {
  limit?: number;
  skip?: number;
  seasonId?: number | string;
  weekNumber?: number | string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface WeekRangeQuery {
  startDate: string;
  endDate: string;
}

export interface WeekListResponse {
  weeks: Week[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Weeks API methods
export const weeksApi = {
  // List weeks with filtering and pagination
  async getWeeks(query: WeekQuery = {}): Promise<ApiResponse<WeekListResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.seasonId) params.append('seasonId', query.seasonId.toString());
    if (query.weekNumber) params.append('weekNumber', query.weekNumber.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.sort) params.append('sort', query.sort);
    
    const queryString = params.toString();
    const url = queryString ? `/weeks?${queryString}` : '/weeks';
    
    return apiClient.get<WeekListResponse>(url);
  },

  // Get weeks count
  async getWeeksCount(query: WeekQuery = {}): Promise<ApiResponse<number>> {
    const params = new URLSearchParams();
    
    // Add query parameters for count
    if (query.seasonId) params.append('seasonId', query.seasonId.toString());
    if (query.weekNumber) params.append('weekNumber', query.weekNumber.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    
    const queryString = params.toString();
    const url = queryString ? `/weeks/count?${queryString}` : '/weeks/count';
    
    return apiClient.get<number>(url);
  },

  // Get weeks within date range
  async getWeeksInRange(startDate: string, endDate: string): Promise<ApiResponse<Week[]>> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    return apiClient.get<Week[]>(`/weeks/range?${params.toString()}`);
  },

  // Get single week by ID
  async getWeek(id: number): Promise<ApiResponse<Week>> {
    return apiClient.get<Week>(`/weeks/${id}`);
  },

  // Create new week
  async createWeek(weekData: WeekCreate): Promise<ApiResponse<Week>> {
    return apiClient.post<Week>('/weeks', weekData);
  },

  // Update week
  async updateWeek(id: number, updateData: WeekUpdate): Promise<ApiResponse<Week>> {
    return apiClient.patch<Week>(`/weeks/${id}`, updateData);
  },

  // Delete week
  async deleteWeek(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/weeks/${id}`);
  },

  // Get weeks by season ID
  async getWeeksBySeason(seasonId: number): Promise<ApiResponse<Week[]>> {
    return apiClient.get<Week[]>(`/seasons/${seasonId}/weeks`);
  },

  // Get week by season ID and week number
  async getWeekBySeasonAndNumber(seasonId: number, weekNumber: number): Promise<ApiResponse<Week>> {
    return apiClient.get<Week>(`/seasons/${seasonId}/weeks/${weekNumber}`);
  }
};
