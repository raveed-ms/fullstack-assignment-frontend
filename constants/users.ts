// User search options
export const USER_SEARCH_OPTIONS = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'ID', value: 'id' }
] as const

// User sort options
export const USER_SORT_OPTIONS = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role' },
  { title: 'Status', value: 'blacklisted' },
  { title: 'Created', value: 'created_at' },
  { title: 'Updated', value: 'updated_at' }
] as const

// User sort order options
export const USER_SORT_ORDER_OPTIONS = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
] as const

// User role options
export const USER_ROLE_OPTIONS = [
  { title: 'User', value: 'user' },
  { title: 'Moderator', value: 'mod' },
  { title: 'Admin', value: 'admin' }
] as const

// User status options
export const USER_STATUS_OPTIONS = [
  { title: 'Active', value: false },
  { title: 'Blacklisted', value: true }
] as const

// User table headers
export const USER_TABLE_HEADERS = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'blacklisted', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Updated', key: 'updated_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
] as const

// User items per page options
export const USER_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const

// User default filters (for future implementation)
export const USER_DEFAULT_FILTERS = {
  role: null as string | null,
  blacklisted: null as boolean | null,
  createdFrom: null as string | null,
  createdTo: null as string | null,
  updatedFrom: null as string | null,
  updatedTo: null as string | null
} as const 