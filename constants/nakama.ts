// Nakama Search Options
export const NAKAMA_SEARCH_OPTIONS = [
  { title: 'Username', value: 'username' },
  { title: 'Email', value: 'email' },
  { title: 'User ID', value: 'id' },
  { title: 'Display Name', value: 'display_name' }
]

// Nakama Sort Options - all available fields
export const NAKAMA_SORT_OPTIONS = [
  { title: 'Username', value: 'username' },
  { title: 'Display Name', value: 'display_name' },
  { title: 'Email', value: 'email' },
  { title: 'User ID', value: 'id' },
  { title: 'Language', value: 'lang_tag' },
  { title: 'Location', value: 'location' },
  { title: 'Created Date', value: 'create_time' },
  { title: 'Updated Date', value: 'update_time' },
  { title: 'Chat Role', value: 'chatRole' },
  { title: 'Is Bot User', value: 'isBotUser' },
  { title: 'Stats GIR', value: 'statsGIR' },
  { title: 'Win Ratio', value: 'statsWinRatio' },
  { title: 'Longest Drive', value: 'statsLongestDrive' },
  { title: 'Longest Putt', value: 'statsLongestPutt' },
  { title: 'Longest Chip', value: 'statsLongestChip' },
  { title: 'Hole in One Count', value: 'statsHoleInOneCount' },
  { title: 'Total Attempted', value: 'statsTotalAttempted' },
  { title: 'Speed King Badges', value: 'statsSpeedKing' },
  { title: 'Putt Master Badges', value: 'statsPuttMaster' },
  { title: 'Perfect Round Badges', value: 'statsPerfectRound' },
  { title: 'Sharp Shooter Badges', value: 'statsSharpShooter' },
  { title: 'Recovery Master Badges', value: 'statsRecoveryMaster' },
  { title: 'Earnings Ranking', value: 'earningsRanking' },
  { title: 'Cash Earned', value: 'earningsCashEarned' },
  { title: 'Coins Earned', value: 'earningsCoinsEarned' },
  { title: 'Career XP', value: 'careerXP' },
  { title: 'Career Level', value: 'careerLevel' },
  { title: 'Career League', value: 'careerLeague' },
  { title: 'Avatar Type', value: 'avatarType' },
  { title: 'Avatar Index', value: 'avatarIndex' },
  { title: 'Wallet Coins', value: 'walletCoins' },
  { title: 'Bonus Cash', value: 'walletBonusCash' }
]

// Nakama Sort Order Options
export const NAKAMA_SORT_ORDER_OPTIONS = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
]

// Nakama Chat Role Options
export const NAKAMA_CHAT_ROLE_OPTIONS = [
  { title: 'User', value: 0 },
  { title: 'Moderator', value: 1 },
  { title: 'Admin', value: 2 }
]

// Default filter values
export const NAKAMA_DEFAULT_FILTERS = {
  location: null as string | null,
  chatRole: null as number | null,
  isBotUser: false as boolean,
  statsGIR: [0, 100] as [number, number],
  statsWinRatio: [0, 1] as [number, number],
  statsLongestDrive: [0, 500] as [number, number],
  statsHoleInOneCount: [0, 50] as [number, number],
  careerLevel: [1, 100] as [number, number],
  careerXP: [0, 1000000] as [number, number],
  earningsCashEarned: [0, 100000] as [number, number],
  walletCoins: [0, 100000] as [number, number],
  createTimeFrom: null as string | null,
  createTimeTo: null as string | null,
  updateTimeFrom: null as string | null,
  updateTimeTo: null as string | null
}

// Table headers configuration
export const NAKAMA_TABLE_HEADERS = [
  { title: 'Username', key: 'username', sortable: true },
  { title: 'Display Name', key: 'display_name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Language', key: 'lang_tag', sortable: true },
  { title: 'Location', key: 'location', sortable: true },
  { title: 'Created', key: 'create_time', sortable: true },
  { title: 'Updated', key: 'update_time', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Items per page options
export const NAKAMA_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100, -1] 