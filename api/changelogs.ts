import { apiClient } from './client';
import type { 
  ApiResponse, 
  Changelog, 
  ChangelogQuery,
  EntityHistoryQuery,
  UserHistoryQuery,
  DateRangeQuery,
  ChangelogListResponse,
  EntityHistoryResponse,
  UserHistoryResponse,
  DateRangeResponse,
  ChangelogCountResponse,
  EntityType
} from '~/types/api';

// Changelogs API methods
export const changelogsApi = {
  // List all changelogs with filtering and pagination
  async getChangelogs(query: ChangelogQuery = {}): Promise<ApiResponse<ChangelogListResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.entityId) params.append('entityId', query.entityId.toString());
    if (query.entityType) params.append('entityType', query.entityType);
    if (query.modifiedBy) params.append('modifiedBy', query.modifiedBy.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.order) params.append('order', query.order);
    
    const queryString = params.toString();
    const url = queryString ? `/changelogs?${queryString}` : '/changelogs';
    return apiClient.get<ChangelogListResponse>(url);
  },





  // Get changelog history for a specific entity
  async getEntityHistory(
    entityId: number, 
    entityType: EntityType, 
    query: EntityHistoryQuery = {}
  ): Promise<ApiResponse<EntityHistoryResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.order) params.append('order', query.order);
    
    const queryString = params.toString();
    const url = queryString 
      ? `/entities/${entityId}/${entityType}/history?${queryString}` 
      : `/entities/${entityId}/${entityType}/history`;
    return apiClient.get<EntityHistoryResponse>(url);
  },

  // Get changelog history for a specific user
  async getUserHistory(
    userId: number, 
    query: UserHistoryQuery = {}
  ): Promise<ApiResponse<UserHistoryResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.order) params.append('order', query.order);
    
    const queryString = params.toString();
    const url = queryString 
      ? `/users/${userId}/changelog-history?${queryString}` 
      : `/users/${userId}/changelog-history`;
    return apiClient.get<UserHistoryResponse>(url);
  },

  // Get changelogs within a date range
  async getChangelogsByDateRange(
    startDate: string, 
    endDate: string, 
    query: Omit<DateRangeQuery, 'startDate' | 'endDate'> = {}
  ): Promise<ApiResponse<DateRangeResponse>> {
    const params = new URLSearchParams();
    
    // Add required date parameters
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    // Add optional query parameters
    if (query.entityType) params.append('entityType', query.entityType);
    if (query.modifiedBy) params.append('modifiedBy', query.modifiedBy.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.order) params.append('order', query.order);
    
    const queryString = params.toString();
    const url = `/changelogs/date-range?${queryString}`;
    return apiClient.get<DateRangeResponse>(url);
  },

  // Count total changelogs
  async countChangelogs(query: ChangelogQuery = {}): Promise<ApiResponse<ChangelogCountResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.entityId) params.append('entityId', query.entityId.toString());
    if (query.entityType) params.append('entityType', query.entityType);
    if (query.modifiedBy) params.append('modifiedBy', query.modifiedBy.toString());
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.order) params.append('order', query.order);
    
    const queryString = params.toString();
    const url = queryString ? `/changelogs/count?${queryString}` : '/changelogs/count';
    return apiClient.get<ChangelogCountResponse>(url);
  }
};
