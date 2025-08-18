export enum EntityType {
  EVENT = 'EVENT',
  SEASON = 'SEASON',
  BUCKET = 'BUCKET',
}

export interface ChangesSummary {
  added: Record<string, any>;
  removed: Record<string, any>;
  modified: Record<string, FieldChange>;
}

export interface FieldChange {
  from: any;
  to: any;
}

export interface Changelog {
  id: number;
  entityId: number;
  entityType: EntityType;
  modifiedBy: number;
  modifiedAt: string;
  changeReason: string;
  previousState: any;
  newState: any;
  changeSummary: ChangesSummary;
  createdAt: string;
  updatedAt: string;
}



export interface ChangelogQuery {
  entityId?: number;
  entityType?: EntityType;
  modifiedBy?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}

export interface EntityHistoryQuery {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}

export interface UserHistoryQuery {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}

export interface DateRangeQuery {
  startDate: string;
  endDate: string;
  entityType?: EntityType;
  modifiedBy?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}

export interface ChangelogListResponse {
  changelogs: Changelog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export interface EntityHistoryResponse {
  changelogs: Changelog[];
  entityId: number;
  entityType: EntityType;
  total: number;
}

export interface UserHistoryResponse {
  changelogs: Changelog[];
  userId: number;
  total: number;
}

export interface DateRangeResponse {
  changelogs: Changelog[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  total: number;
}

export interface ChangelogCountResponse {
  total: number;
}
