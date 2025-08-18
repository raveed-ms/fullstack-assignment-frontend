import { apiClient } from './client';
import type { ApiResponse } from '~/types/api';

// Player Types based on backend FlattenedPlayer interface
export interface Player {
  // Standard database fields
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  lang_tag: string;
  location: string;
  timezone: string;
  email: string;
  password: string;
  edge_count: number;
  create_time: string;
  update_time: string;
  verify_time: string;
  disable_time: string;
  
  // Social/Platform IDs
  facebook_id: string;
  google_id: string;
  gamecenter_id: string;
  steam_id: string;
  custom_id: string;
  facebook_instant_game_id: string;
  apple_id: string;
  
  // Wallet fields (from JSON)
  walletCoins: number;
  walletBonusCash: number;
  
  // Flattened metadata fields
  chatRole: number;           // 0 = User, 1 = Mod, 2 = Admin
  chatBanned: boolean;        // Chat ban status
  isBotUser: boolean;         // Bot vs human users
  
  // Stats
  statsGIR: number;           // Greens in Regulation
  statsWinRatio: number;      // Win percentage
  statsLongestDrive: number;  // Longest drive distance
  statsLongestPutt: number;   // Longest putt distance
  statsLongestChip: number;   // Longest chip distance
  statsHoleInOneCount: number; // Number of hole-in-ones
  statsTotalAttempted: number; // Total games played
  
  // Badges
  statsSpeedKing: number;     // Speed King badge count
  statsPuttMaster: number;    // Putt Master badge count
  statsPerfectRound: number;  // Perfect Round badge count
  statsSharpShooter: number;  // Sharp Shooter badge count
  statsRecoveryMaster: number; // Recovery Master badge count
  
  // Earnings
  earningsRanking: number;    // Player ranking
  earningsCashEarned: number; // Total cash earned
  earningsCoinsEarned: number; // Total coins earned
  isPayingUser: boolean;      // Has made payments
  
  // Career
  careerXP: number;           // Experience points
  careerLevel: number;        // Player level
  careerLeague: number;       // Current league
  
  // Player Rating Data
  mou: number;                // MOU (Measure of Use) from storage table
  
  // Cash Deposit Data
  cashDeposit: number;        // Cash Deposit from storage table
  
  // Avatar
  avatarType: number;         // Avatar type
  avatarIndex: number;        // Avatar selection
}

// Player Update Types
export interface PlayerUpdateData {
  // Basic player fields
  username?: string;
  display_name?: string;
  avatar_url?: string;
  lang_tag?: string;
  location?: string;
  timezone?: string;
  email?: string;
  
  // Social/Platform IDs
  facebook_id?: string;
  google_id?: string;
  gamecenter_id?: string;
  steam_id?: string;
  custom_id?: string;
  facebook_instant_game_id?: string;
  apple_id?: string;
  
  // Wallet fields
  walletCoins?: number;
  walletBonusCash?: number;
  
  // Chat and user status
  chatRole?: number;
  chatBanned?: boolean;
  isBotUser?: boolean;
  
  // Stats fields
  statsGIR?: number;
  statsWinRatio?: number;
  statsLongestDrive?: number;
  statsLongestPutt?: number;
  statsLongestChip?: number;
  statsHoleInOneCount?: number;
  statsTotalAttempted?: number;
  
  // Badge counts
  statsSpeedKing?: number;
  statsPuttMaster?: number;
  statsPerfectRound?: number;
  statsSharpShooter?: number;
  statsRecoveryMaster?: number;
  
  // Earnings
  earningsRanking?: number;
  earningsCashEarned?: number;
  earningsCoinsEarned?: number;
  isPayingUser?: boolean;
  
  // Career progression
  careerXP?: number;
  careerLevel?: number;
  careerLeague?: number;
  
  // Avatar
  avatarType?: number;
  avatarIndex?: number;
}

export interface PlayerUpdate {
  data: PlayerUpdateData;
  reason: string;
}

// Player Query Types
export interface PlayerQuery {
  limit?: number;
  skip?: number;
  
  // Field-specific search parameters
  searchUsername?: string;
  searchDisplayName?: string;
  searchUuid?: string;
  searchEmail?: string;
  
  // Direct database columns
  username?: string;
  email?: string;
  lang_tag?: string;
  location?: string;
  
  // Metadata filters
  chatRole?: number;
  chatBanned?: boolean;
  isBotUser?: boolean;
  isPayingUser?: boolean;
  
  // Stats filters
  statsGIR?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  statsWinRatio?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  statsLongestDrive?: number;
  statsLongestPutt?: number;
  statsLongestChip?: number;
  statsHoleInOneCount?: number;
  statsTotalAttempted?: number;
  
  // Badge filters
  statsSpeedKing?: number;
  statsPuttMaster?: number;
  statsPerfectRound?: number;
  statsSharpShooter?: number;
  statsRecoveryMaster?: number;
  
  // Earnings filters
  earningsRanking?: number;
  earningsCashEarned?: number;
  earningsCoinsEarned?: number;
  
  // Career filters
  careerXP?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  careerLevel?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  careerLeague?: number;
  
  // Player Rating Data filters
  mou?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  
  // Cash Deposit filters
  cashDeposit?: number | { $gte?: number; $lte?: number; $gt?: number; $lt?: number };
  
  // Avatar filters
  avatarType?: number;
  avatarIndex?: number;
  
  // Wallet filters
  walletCoins?: number;
  walletBonusCash?: number;
  
  // Date range filters
  createTimeFrom?: string;
  createTimeTo?: string;
  updateTimeFrom?: string;
  updateTimeTo?: string;
  
  // Sorting
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

// Changelog Types
export interface FieldChange {
  from: any;
  to: any;
}

export interface ChangesSummary {
  added: Record<string, any>;
  removed: Record<string, any>;
  modified: Record<string, FieldChange>;
}

export interface PlayerChangelog {
  id: string;
  player_id: string;
  cms_user_id: number;
  modified_at: Date;
  previous_state: any;
  new_state: any;
  change_reason: string;
  changes_summary: ChangesSummary;
}

export interface ChangelogQuery {
  limit?: number;
  skip?: number;
  from_date?: string;
  to_date?: string;
  sort?: {
    field: 'modified_at';
    order: 'asc' | 'desc';
  };
}

// API Response Types
export interface PlayerListResponse {
  players: Player[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PlayerResponse {
  success: boolean;
  data: Player;
}

export interface PlayerUpdateResponse {
  success: boolean;
  data: Player;
  message: string;
}

export interface PlayerCountResponse {
  success: boolean;
  data: { total: number };
}

export interface ChangelogResponse {
  changes: PlayerChangelog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Player API Client
export class PlayersApi {
  private apiClient: typeof apiClient;

  constructor() {
    this.apiClient = apiClient;
  }

  /**
   * Get list of players with filtering, search, and pagination
   */
  async getPlayers(query: PlayerQuery = {}): Promise<ApiResponse<PlayerListResponse>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    
    // Search parameters
    if (query.searchUsername) params.append('searchUsername', query.searchUsername);
    if (query.searchDisplayName) params.append('searchDisplayName', query.searchDisplayName);
    if (query.searchUuid) params.append('searchUuid', query.searchUuid);
    if (query.searchEmail) params.append('searchEmail', query.searchEmail);
    
    // Direct database columns
    if (query.username) params.append('username', query.username);
    if (query.email) params.append('email', query.email);
    if (query.lang_tag) params.append('lang_tag', query.lang_tag);
    if (query.location) params.append('location', query.location);
    
    // Metadata filters
    if (query.chatRole !== undefined) params.append('chatRole', query.chatRole.toString());
    if (query.chatBanned !== undefined) params.append('chatBanned', query.chatBanned.toString());
    if (query.isBotUser !== undefined) params.append('isBotUser', query.isBotUser.toString());
    if (query.isPayingUser !== undefined) params.append('isPayingUser', query.isPayingUser.toString());
    
    // Stats filters - handle both numbers and range objects
    if (query.statsGIR !== undefined) {
      if (typeof query.statsGIR === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('statsGIR', query.statsGIR.toString());
      }
    }
    if (query.statsWinRatio !== undefined) {
      if (typeof query.statsWinRatio === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('statsWinRatio', query.statsWinRatio.toString());
      }
    }
    if (query.statsLongestDrive !== undefined) params.append('statsLongestDrive', query.statsLongestDrive.toString());
    if (query.statsLongestPutt !== undefined) params.append('statsLongestPutt', query.statsLongestPutt.toString());
    if (query.statsLongestChip !== undefined) params.append('statsLongestChip', query.statsLongestChip.toString());
    if (query.statsHoleInOneCount !== undefined) params.append('statsHoleInOneCount', query.statsHoleInOneCount.toString());
    if (query.statsTotalAttempted !== undefined) params.append('statsTotalAttempted', query.statsTotalAttempted.toString());
    
    // Badge filters
    if (query.statsSpeedKing !== undefined) params.append('statsSpeedKing', query.statsSpeedKing.toString());
    if (query.statsPuttMaster !== undefined) params.append('statsPuttMaster', query.statsPuttMaster.toString());
    if (query.statsPerfectRound !== undefined) params.append('statsPerfectRound', query.statsPerfectRound.toString());
    if (query.statsSharpShooter !== undefined) params.append('statsSharpShooter', query.statsSharpShooter.toString());
    if (query.statsRecoveryMaster !== undefined) params.append('statsRecoveryMaster', query.statsRecoveryMaster.toString());
    
    // Earnings filters
    if (query.earningsRanking !== undefined) params.append('earningsRanking', query.earningsRanking.toString());
    if (query.earningsCashEarned !== undefined) params.append('earningsCashEarned', query.earningsCashEarned.toString());
    if (query.earningsCoinsEarned !== undefined) params.append('earningsCoinsEarned', query.earningsCoinsEarned.toString());
    
    // Career filters - handle both numbers and range objects
    if (query.careerXP !== undefined) {
      if (typeof query.careerXP === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('careerXP', query.careerXP.toString());
      }
    }
    if (query.careerLevel !== undefined) {
      if (typeof query.careerLevel === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('careerLevel', query.careerLevel.toString());
      }
    }
    if (query.careerLeague !== undefined) params.append('careerLeague', query.careerLeague.toString());
    
    // MOU filter - handle both numbers and range objects
    if (query.mou !== undefined) {
      if (typeof query.mou === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('mou', query.mou.toString());
      }
    }
    
    // Cash Deposit filter - handle both numbers and range objects
    if (query.cashDeposit !== undefined) {
      if (typeof query.cashDeposit === 'object') {
        // Range object - will be added manually to query string
      } else {
        params.append('cashDeposit', query.cashDeposit.toString());
      }
    }
    
    // Avatar filters
    if (query.avatarType !== undefined) params.append('avatarType', query.avatarType.toString());
    if (query.avatarIndex !== undefined) params.append('avatarIndex', query.avatarIndex.toString());
    
    // Wallet filters
    if (query.walletCoins !== undefined) params.append('walletCoins', query.walletCoins.toString());
    if (query.walletBonusCash !== undefined) params.append('walletBonusCash', query.walletBonusCash.toString());
    
    // Date range filters
    if (query.createTimeFrom) params.append('createTimeFrom', query.createTimeFrom);
    if (query.createTimeTo) params.append('createTimeTo', query.createTimeTo);
    if (query.updateTimeFrom) params.append('updateTimeFrom', query.updateTimeFrom);
    if (query.updateTimeTo) params.append('updateTimeTo', query.updateTimeTo);
    
    // Sorting
    if (query.sort) {
      const sortParam = JSON.stringify({ field: query.sort.field, order: query.sort.order });
      // Don't use URLSearchParams.append() as it automatically encodes
      // We'll build the query string manually to preserve raw JSON
    }
    
    // Build query string manually to preserve raw JSON for sort parameter and range objects
    let queryString = params.toString();
    
    // Add range objects as raw JSON if they exist
    if (query.statsGIR && typeof query.statsGIR === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}statsGIR=${JSON.stringify(query.statsGIR)}`;
    }
    if (query.statsWinRatio && typeof query.statsWinRatio === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}statsWinRatio=${JSON.stringify(query.statsWinRatio)}`;
    }
    if (query.careerXP && typeof query.careerXP === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}careerXP=${JSON.stringify(query.careerXP)}`;
    }
    if (query.careerLevel && typeof query.careerLevel === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}careerLevel=${JSON.stringify(query.careerLevel)}`;
    }
    if (query.mou && typeof query.mou === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}mou=${JSON.stringify(query.mou)}`;
    }
    if (query.cashDeposit && typeof query.cashDeposit === 'object') {
      const separator = queryString ? '&' : '';
      queryString += `${separator}cashDeposit=${JSON.stringify(query.cashDeposit)}`;
    }
    
    // Add sort parameter as raw JSON if it exists
    if (query.sort) {
      const sortParam = JSON.stringify({ field: query.sort.field, order: query.sort.order });
      const separator = queryString ? '&' : '';
      queryString += `${separator}sort=${sortParam}`;
    }
    
    const url = queryString ? `/players?${queryString}` : '/players';
    
    return this.apiClient.get<PlayerListResponse>(url);
  }

  /**
   * Get a single player by ID
   */
  async getPlayer(id: string): Promise<ApiResponse<PlayerResponse>> {
    return this.apiClient.get<PlayerResponse>(`/players/${id}`);
  }

  /**
   * Update a player
   */
  async updatePlayer(id: string, update: PlayerUpdate): Promise<ApiResponse<PlayerUpdateResponse>> {
    return this.apiClient.patch<PlayerUpdateResponse>(`/players/${id}`, update);
  }

  /**
   * Get total count of players
   */
  async getPlayerCount(): Promise<ApiResponse<PlayerCountResponse>> {
    return this.apiClient.get<PlayerCountResponse>('/players/count');
  }

  /**
   * Get player changelog history
   */
  async getPlayerHistory(id: string, query: ChangelogQuery = {}): Promise<ApiResponse<ChangelogResponse>> {
    const params = new URLSearchParams();
    
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.from_date) params.append('from_date', query.from_date);
    if (query.to_date) params.append('to_date', query.to_date);
    if (query.sort) {
      params.append('sort', JSON.stringify(query.sort));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/players/${id}/history?${queryString}` : `/players/${id}/history`;
    
    return this.apiClient.get<ChangelogResponse>(url);
  }

  /**
   * Get all changelog entries
   */
  async getChangelogs(query: ChangelogQuery = {}): Promise<ApiResponse<ChangelogResponse>> {
    const params = new URLSearchParams();
    
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.from_date) params.append('from_date', query.from_date);
    if (query.to_date) params.append('to_date', query.to_date);
    if (query.sort) {
      params.append('sort', JSON.stringify(query.sort));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/player-changelogs?${queryString}` : '/player-changelogs';
    
    return this.apiClient.get<ChangelogResponse>(url);
  }

  /**
   * Get changes made by a specific CMS user
   */
  async getCmsUserChanges(cmsUserId: number, query: ChangelogQuery = {}): Promise<ApiResponse<ChangelogResponse>> {
    const params = new URLSearchParams();
    
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.skip) params.append('skip', query.skip.toString());
    if (query.from_date) params.append('from_date', query.from_date);
    if (query.to_date) params.append('to_date', query.to_date);
    if (query.sort) {
      params.append('sort', JSON.stringify(query.sort));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/cms-users/${cmsUserId}/changes?${queryString}` : `/cms-users/${cmsUserId}/changes`;
    
    return this.apiClient.get<ChangelogResponse>(url);
  }
}

// Export singleton instance
export const playersApi = new PlayersApi();
