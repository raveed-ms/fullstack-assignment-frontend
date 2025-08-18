import { apiClient } from './client';
import type { ApiResponse } from '~/types/api';

// Events API Types
export interface Event {
  id: number;
  name: string;
  description?: string;
  holes: Hole[];
  numberOfParticipants: number;
  entryFees: number;
  startDate?: string;
  endDate?: string;
  status: EventStatus;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum TeePosition {
  FRONT = 'FRONT',
  MIDDLE = 'MIDDLE',
  BACK = 'BACK'
}

export enum Weather {
  SUNNY = 'SUNNY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  WINDY = 'WINDY',
  FOGGY = 'FOGGY',
  CLEAR = 'CLEAR',
  PARTLY_CLOUDY = 'PARTLY_CLOUDY',
  OVERCAST = 'OVERCAST'
}

export interface Hole {
  courseId: number;
  holeNumber: number;
  windSpeed: number;
  teePosition: TeePosition;
  weather: Weather;
  needleSpeed: number;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
}

export interface EventCreate {
  name: string;
  description?: string;
  holes: Hole[];
  numberOfParticipants: number;
  entryFees: number;
  startDate?: string;
  endDate?: string;
}

export interface EventUpdate {
  name?: string;
  description?: string;
  holes?: Hole[];
  numberOfParticipants?: number;
  entryFees?: number;
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
}

export interface EventQuery {
  status?: EventStatus;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  searchName?: string;
  searchDescription?: string;
  limit?: number;
  skip?: number;
  sort?: {
    field: 'id' | 'name' | 'status' | 'start_date' | 'end_date' | 'number_of_participants' | 'entry_fees' | 'created_at' | 'updated_at';
    order: 'asc' | 'desc';
  };
  select?: string[];
}

export interface EventListResponse {
  data: Event[];
  count: number;
}

// Events API methods
export const eventsApi = {
  // List events with filtering and pagination
  async getEvents(query: EventQuery = {}): Promise<ApiResponse<Event[]>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.status) params.append('status', query.status);
    if (query.startDateFrom) params.append('startDateFrom', query.startDateFrom);
    if (query.startDateTo) params.append('startDateTo', query.startDateTo);
    if (query.endDateFrom) params.append('endDateFrom', query.endDateFrom);
    if (query.endDateTo) params.append('endDateTo', query.endDateTo);
    if (query.searchName) params.append('searchName', query.searchName);
    if (query.searchDescription) params.append('searchDescription', query.searchDescription);
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
    const url = queryString ? `/events?${queryString}` : '/events';
    
    return apiClient.get<Event[]>(url);
  },

  // Get events count
  async getEventsCount(query: EventQuery = {}): Promise<ApiResponse<number>> {
    const params = new URLSearchParams();
    
    // Add query parameters for count
    if (query.status) params.append('status', query.status);
    if (query.startDateFrom) params.append('startDateFrom', query.startDateFrom);
    if (query.startDateTo) params.append('startDateTo', query.startDateTo);
    if (query.endDateFrom) params.append('endDateFrom', query.endDateFrom);
    if (query.endDateTo) params.append('endDateTo', query.endDateTo);
    if (query.searchName) params.append('searchName', query.searchName);
    if (query.searchDescription) params.append('searchDescription', query.searchDescription);
    
    const queryString = params.toString();
    const url = queryString ? `/events/count?${queryString}` : '/events/count';
    
    return apiClient.get<number>(url);
  },

  // Get published events
  async getPublishedEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get<Event[]>('/events/published');
  },

  // Get draft events
  async getDraftEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get<Event[]>('/events/drafts');
  },

  // Get single event by ID
  async getEvent(id: number): Promise<ApiResponse<Event>> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  // Create new event
  async createEvent(eventData: EventCreate): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>('/events', eventData);
  },

  // Update event
  async updateEvent(id: number, updateData: EventUpdate): Promise<ApiResponse<Event>> {
    return apiClient.patch<Event>(`/events/${id}`, updateData);
  },

  // Publish event
  async publishEvent(id: number): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>(`/events/${id}/publish`);
  },

  // Archive event
  async archiveEvent(id: number): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>(`/events/${id}/archive`);
  },

  // Delete event
  async deleteEvent(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/events/${id}`);
  }
};
