import { apiClient } from './client';
import type { ApiResponse } from '~/types/api';

// Bucket types matching backend
export interface PersonaRules {
  level?: {
    min?: number;
    max?: number;
  };
  mmr?: {
    min?: number;
    max?: number;
  };
  spending?: {
    min?: number;
    max?: number;
  };
}

export interface Bucket {
  id: number;
  seasonId: number;
  weekId: number;
  name: string;
  description?: string;
  personaRules: PersonaRules;
  priority: number;
  eventId?: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface BucketCreate {
  seasonId: number;
  weekId: number;
  name: string;
  description?: string;
  personaRules: PersonaRules;
  priority: number;
  eventId?: number;
}

export interface BucketUpdate {
  seasonId?: number;
  weekId?: number;
  name?: string;
  description?: string;
  personaRules?: PersonaRules;
  priority?: number;
  eventId?: number;
}

export interface BucketQuery {
  seasonId?: number;
  weekId?: number;
  eventId?: number;
  priority?: number;
  searchName?: string;
  searchDescription?: string;
  limit?: number;
  skip?: number;
  sort?: Record<string, 'asc' | 'desc'>;
  select?: string[];
}

export interface BucketValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  bucketCount: number;
  bucketsWithoutEvents: number;
  bucketsWithEmptyRules: number;
  priorityGaps: number[];
}

export interface BucketListResponse {
  data: Bucket[];
  count: number;
}

// Buckets API methods
export const bucketsApi = {
  // List buckets with filtering and pagination
  async getBuckets(query: BucketQuery = {}): Promise<ApiResponse<Bucket[]>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.seasonId) params.append('seasonId', query.seasonId.toString());
    if (query.weekId) params.append('weekId', query.weekId.toString());
    if (query.eventId) params.append('eventId', query.eventId.toString());
    if (query.priority) params.append('priority', query.priority.toString());
    if (query.searchName) params.append('searchName', query.searchName);
    if (query.searchDescription) params.append('searchDescription', query.searchDescription);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.sort) {
      Object.entries(query.sort).forEach(([key, value]) => {
        params.append(`sort[${key}]`, value);
      });
    }
    if (query.select) {
      query.select.forEach(field => params.append('select', field));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/buckets?${queryString}` : '/buckets';
    
    return apiClient.get<Bucket[]>(url);
  },

  // Get buckets count
  async getBucketsCount(query: BucketQuery = {}): Promise<ApiResponse<number>> {
    const params = new URLSearchParams();
    
    // Add query parameters for count
    if (query.seasonId) params.append('seasonId', query.seasonId.toString());
    if (query.weekId) params.append('weekId', query.weekId.toString());
    if (query.eventId) params.append('eventId', query.eventId.toString());
    if (query.priority) params.append('priority', query.priority.toString());
    if (query.searchName) params.append('searchName', query.searchName);
    if (query.searchDescription) params.append('searchDescription', query.searchDescription);
    
    const queryString = params.toString();
    const url = queryString ? `/buckets/count?${queryString}` : '/buckets/count';
    
    return apiClient.get<number>(url);
  },

  // Get buckets by season
  async getBucketsBySeason(seasonId: number): Promise<ApiResponse<Bucket[]>> {
    return apiClient.get<Bucket[]>(`/buckets/season/${seasonId}`);
  },

  // Get buckets by week
  async getBucketsByWeek(weekId: number): Promise<ApiResponse<Bucket[]>> {
    return apiClient.get<Bucket[]>(`/buckets/week/${weekId}`);
  },

  // Get buckets by season and week
  async getBucketsBySeasonAndWeek(seasonId: number, weekId: number): Promise<ApiResponse<Bucket[]>> {
    return apiClient.get<Bucket[]>(`/buckets/season/${seasonId}/week/${weekId}`);
  },

  // Get single bucket by ID
  async getBucket(id: number): Promise<ApiResponse<Bucket>> {
    return apiClient.get<Bucket>(`/buckets/${id}`);
  },

  // Create new bucket
  async createBucket(bucketData: BucketCreate): Promise<ApiResponse<Bucket>> {
    return apiClient.post<Bucket>('/buckets', bucketData);
  },

  // Update bucket
  async updateBucket(id: number, updateData: BucketUpdate): Promise<ApiResponse<Bucket>> {
    return apiClient.patch<Bucket>(`/buckets/${id}`, updateData);
  },

  // Delete bucket
  async deleteBucket(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/buckets/${id}`);
  },

  // Validate buckets for publishing
  async validateBucketsOnPublish(seasonId: number, weekId: number): Promise<ApiResponse<BucketValidationResult>> {
    // This would call the bucket service validation method
    // For now, we'll simulate it by getting buckets and validating locally
    const bucketsResponse = await this.getBucketsBySeasonAndWeek(seasonId, weekId);
    
    if (!bucketsResponse.success || !bucketsResponse.data) {
      return {
        success: false,
        data: {
          isValid: false,
          errors: ['Failed to fetch buckets for validation'],
          warnings: [],
          bucketCount: 0,
          bucketsWithoutEvents: 0,
          bucketsWithEmptyRules: 0,
          priorityGaps: []
        },
        message: 'Validation failed'
      };
    }

    const buckets = bucketsResponse.data;
    const errors: string[] = [];
    const warnings: string[] = [];
    let bucketsWithoutEvents = 0;
    let bucketsWithEmptyRules = 0;
    const priorities = buckets.map(b => b.priority).sort((a, b) => a - b);
    const priorityGaps: number[] = [];

    // Check each bucket
    for (const bucket of buckets) {
      // Check if bucket has an event attached
      if (!bucket.eventId) {
        bucketsWithoutEvents++;
        errors.push(`Bucket "${bucket.name}" has no event attached`);
      }

      // Check if bucket has meaningful persona rules
      if (!this.hasValidPersonaRules(bucket.personaRules)) {
        bucketsWithEmptyRules++;
        errors.push(`Bucket "${bucket.name}" has no valid persona rules defined`);
      }
    }

    // Check for priority gaps
    const expectedPriorities = Array.from({ length: buckets.length }, (_, i) => i + 1);
    for (const expected of expectedPriorities) {
      if (!priorities.includes(expected)) {
        priorityGaps.push(expected);
        warnings.push(`Priority ${expected} is missing`);
      }
    }

    // Check for duplicate priorities
    const uniquePriorities = new Set(priorities);
    if (uniquePriorities.size !== priorities.length) {
      errors.push('Duplicate priorities found - each bucket must have a unique priority');
    }

    const isValid = errors.length === 0;

    return {
      success: true,
      data: {
        isValid,
        errors,
        warnings,
        bucketCount: buckets.length,
        bucketsWithoutEvents,
        bucketsWithEmptyRules,
        priorityGaps
      },
      message: 'Validation completed'
    };
  },

  // Helper method to check if persona rules are valid
  hasValidPersonaRules(personaRules: PersonaRules): boolean {
    if (!personaRules || typeof personaRules !== 'object') {
      return false;
    }

    const hasLevelRules = personaRules.level && (
      personaRules.level.min !== undefined || 
      personaRules.level.max !== undefined
    );
    
    const hasMmrRules = personaRules.mmr && (
      personaRules.mmr.min !== undefined || 
      personaRules.mmr.max !== undefined
    );
    
    const hasSpendingRules = personaRules.spending && (
      personaRules.spending.min !== undefined || 
      personaRules.spending.max !== undefined
    );

    return Boolean(hasLevelRules || hasMmrRules || hasSpendingRules);
  }
};
