import { apiClient } from './client';
import type { ApiResponse } from '~/types/api';

// Season types matching backend
export type SeasonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Season {
  id: number;
  title: string;
  startDate: string; // UTC ISO string
  endDate: string;   // UTC ISO string (auto-generated, read-only)
  status: SeasonStatus;
  reward: { cash: number };
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeasonCreate {
  title: string;
  startDate: string; // Only start date required, end date auto-generated
  reward: { cash: number };
}

export interface SeasonUpdate {
  title?: string;
  startDate?: string; // If provided, end date will be auto-recalculated
  status?: SeasonStatus;
  reward?: { cash: number };
}

export interface SeasonQuery {
  status?: SeasonStatus;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sort?: {
    field: 'id' | 'title' | 'status' | 'start_date' | 'end_date' | 'created_at' | 'updated_at';
    order: 'asc' | 'desc';
  };
  select?: string[];
}

export interface SeasonListResponse {
  data: Season[];
  count: number;
}

export interface Week {
  id: number;
  seasonId: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  buckets?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeasonPublishValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Seasons API methods
export const seasonsApi = {
  // List seasons with filtering and pagination
  async getSeasons(query: SeasonQuery = {}): Promise<ApiResponse<Season[]>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.status) params.append('status', query.status);
    if (query.startDateFrom) params.append('startDateFrom', query.startDateFrom);
    if (query.startDateTo) params.append('startDateTo', query.startDateTo);
    if (query.endDateFrom) params.append('endDateFrom', query.endDateFrom);
    if (query.endDateTo) params.append('endDateTo', query.endDateTo);
    if (query.search) params.append('search', query.search);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.sort) {
      params.append('sort[field]', query.sort.field);
      params.append('sort[order]', query.sort.order);
    }
    if (query.select) {
      query.select.forEach(field => params.append('select', field));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/seasons?${queryString}` : '/seasons';
    
    return apiClient.get<Season[]>(url);
  },

  // Get seasons count
  async getSeasonsCount(query: SeasonQuery = {}): Promise<ApiResponse<number>> {
    const params = new URLSearchParams();
    
    // Add query parameters for count
    if (query.status) params.append('status', query.status);
    if (query.startDateFrom) params.append('startDateFrom', query.startDateFrom);
    if (query.startDateTo) params.append('startDateTo', query.startDateTo);
    if (query.endDateFrom) params.append('endDateFrom', query.endDateFrom);
    if (query.endDateTo) params.append('endDateTo', query.endDateTo);
    if (query.search) params.append('search', query.search);
    
    const queryString = params.toString();
    const url = queryString ? `/seasons/count?${queryString}` : '/seasons/count';
    
    return apiClient.get<number>(url);
  },

  // Get active (published) seasons
  async getActiveSeasons(): Promise<ApiResponse<Season[]>> {
    return apiClient.get<Season[]>('/seasons/active');
  },

  // Get draft seasons
  async getDraftSeasons(): Promise<ApiResponse<Season[]>> {
    return apiClient.get<Season[]>('/seasons/draft');
  },

  // Get seasons within date range
  async getSeasonsInRange(startDate: string, endDate: string): Promise<ApiResponse<Season[]>> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    return apiClient.get<Season[]>(`/seasons/range?${params.toString()}`);
  },

  // Get single season by ID
  async getSeason(id: number): Promise<ApiResponse<Season>> {
    return apiClient.get<Season>(`/seasons/${id}`);
  },

  // Create new season
  async createSeason(seasonData: SeasonCreate): Promise<ApiResponse<Season>> {
    return apiClient.post<Season>('/seasons', seasonData);
  },

  // Update season
  async updateSeason(id: number, updateData: SeasonUpdate): Promise<ApiResponse<Season>> {
    return apiClient.patch<Season>(`/seasons/${id}`, updateData);
  },

  // Validate season for publishing
  async validateSeasonPublish(id: number): Promise<ApiResponse<SeasonPublishValidation>> {
    return apiClient.get<SeasonPublishValidation>(`/seasons/${id}/validate-publish`);
  },

  // Publish season
  async publishSeason(id: number): Promise<ApiResponse<Season>> {
    return apiClient.post<Season>(`/seasons/${id}/publish`);
  },

  // Delete season
  async deleteSeason(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/seasons/${id}`);
  },

  // Get weeks by season
  async getWeeksBySeason(seasonId: number): Promise<ApiResponse<Week[]>> {
    return apiClient.get<Week[]>(`/seasons/${seasonId}/weeks`);
  }
};
