<template>
  <div class="users-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="bg-grey-lighten-4 pa-0 ma-0">
          <v-row class="ma-0">
            <v-col cols="12">
              


              <!-- Search and Filters -->
              <v-card class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <v-row class="align-center">
                    <!-- Search -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="searchQuery"
                        :label="`Search by ${searchFieldLabel}`"
                        :placeholder="`Enter ${searchFieldLabel.toLowerCase()}...`"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="compact"
                        clearable
                        class="input-field"
                      ></v-text-field>
                    </v-col>
                    
                    <!-- Search Field Selector -->
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="searchField"
                        label="Search By"
                        :items="searchFieldOptions"
                        variant="outlined"
                        density="compact"
                        class="input-field"
                      ></v-select>
                    </v-col>

                    <!-- Create User Button - Only visible to admins -->
                    <v-col cols="12" md="5" class="d-flex justify-end">
                      <v-btn
                        v-if="userStore.isAdmin"
                        color="primary"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        @click="showCreateModal = true"
                        class="profile-button"
                        size="large"
                      >
                        Create User
                      </v-btn>
                    </v-col>
                  </v-row>
                  
                  <!-- Filter Actions -->
                  <v-row class="mt-2">
                    <v-col cols="12" class="d-flex gap-2">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        size="small"
                        @click="clearFilters"
                        :disabled="!hasActiveFilters"
                        class="profile-button me-4"
                      >
                        Clear Filters
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        size="small"
                        @click="loadUsers"
                        :loading="isLoading"
                        class="profile-button"
                      >
                        Refresh
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Sorting and Pagination Options -->
              <v-card class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="sortField"
                        label="Sort By"
                        :items="sortOptions"
                        variant="outlined"
                        density="compact"
                        @update:model-value="handleSortChange"
                        class="input-field"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="sortOrder"
                        label="Sort Order"
                        :items="sortOrderOptions"
                        variant="outlined"
                        density="compact"
                        @update:model-value="handleSortChange"
                        class="input-field"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex justify-end">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        size="small"
                        @click="toggleFilters"
                        class="profile-button"
                      >
                        <v-icon start>mdi-filter</v-icon>
                        {{ showFilters ? 'Hide' : 'Show' }} Filters
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Advanced Filters -->
              <v-card v-if="showFilters" class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <v-icon class="mr-2">mdi-filter</v-icon>
                    <span class="text-subtitle-2">Advanced Filters</span>
                  </div>
                  
                  <v-row>
                    <!-- Role Filter -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="filters.role"
                        :items="roleOptions"
                        label="Role"
                        clearable
                        density="compact"
                        variant="outlined"
                        class="input-field"
                        @update:model-value="() => { currentPage = 1; loadUsers(); }"
                      />
                    </v-col>
                    <!-- Blacklist Filter -->
                    <v-col cols="12" md="4">
                      <v-switch
                        v-model="filters.blacklisted"
                        label="Blacklisted Users Only"
                        density="compact"
                        hide-details
                        @update:model-value="() => { currentPage = 1; loadUsers(); }"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Users Table -->
              <v-card class="users-table-card" elevation="1">
                <v-card-text class="pa-0">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="text-center py-12">
                    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
                    <div class="mt-4 text-body-1 text-grey">Loading users...</div>
                  </div>

                  <!-- Users Table -->
                  <div v-else>
                    <v-data-table
                      :key="`users-table-${currentPage}-${itemsPerPage}`"
                      :headers="tableHeaders"
                      :items="users"
                      :loading="isLoading"
                      class="users-table"
                      hover
                      hide-default-footer
                    >
                      <!-- ID Column -->
                      <template v-slot:item.id="{ item }">
                        <span class="font-mono text-caption">{{ item.id }}</span>
                      </template>

                      <!-- Name Column -->
                      <template v-slot:item.name="{ item }">
                        <span class="font-weight-medium">{{ item.name || 'No name' }}</span>
                      </template>

                      <!-- Email Column -->
                      <template v-slot:item.email="{ item }">
                        <span>{{ item.email || 'No email' }}</span>
                      </template>

                      <!-- Role Column -->
                      <template v-slot:item.role="{ item }">
                        <v-chip
                          :color="getRoleColor(item.role)"
                          variant="flat"
                          size="small"
                          class="role-chip"
                        >
                          {{ item.role.toUpperCase() }}
                        </v-chip>
                      </template>

                      <!-- Status Column -->
                      <template v-slot:item.status="{ item }">
                        <v-chip
                          :color="item.blacklisted ? 'error' : 'success'"
                          variant="flat"
                          size="small"
                          :prepend-icon="item.blacklisted ? 'mdi-account-lock' : 'mdi-account-check'"
                        >
                          {{ item.blacklisted ? 'Blacklisted' : 'Active' }}
                        </v-chip>
                      </template>

                      <!-- Created At Column -->
                      <template v-slot:item.created_at="{ item }">
                        <span class="text-caption">{{ formatDate(item.created_at) }}</span>
                      </template>

                      <!-- Updated At Column -->
                      <template v-slot:item.updated_at="{ item }">
                        <span class="text-caption">{{ formatDate(item.updated_at) }}</span>
                      </template>

                      <!-- Actions Column -->
                      <template v-slot:item.actions="{ item }">
                        <div class="d-flex gap-2">
                          <v-btn
                            color="primary"
                            variant="text"
                            size="small"
                            @click="viewUser(item)"
                          >
                            View
                          </v-btn>
                          <v-btn
                            v-if="canEditUser(item)"
                            :color="item.id === userStore.user?.id ? 'grey' : 'secondary'"
                            variant="text"
                            size="small"
                            :disabled="item.id === userStore.user?.id"
                            :title="getEditButtonTooltip(item)"
                            @click="item.id !== userStore.user?.id ? editUser(item) : null"
                          >
                            Edit
                          </v-btn>
                        </div>
                      </template>
                    </v-data-table>

                    <!-- Custom Pagination -->
                    <div class="custom-pagination pa-6">
                      <div class="d-flex justify-space-between align-center">
                        <!-- Page Size Selector -->
                        <div class="d-flex align-center page-size-section">
                          <v-select
                            v-model="itemsPerPage"
                            :items="pageSizeOptions"
                            variant="outlined"
                            density="compact"
                            class="page-size-select"
                            style="width: 140px"
                            @update:model-value="handlePageSizeChange"
                          ></v-select>
                        </div>

                        <!-- Page Info -->
                        <div class="page-info text-body-1 font-weight-medium">
                          Page <span class="text-primary font-weight-bold">{{ currentPage }}</span> of <span class="text-primary font-weight-bold">{{ totalPages }}</span>
                        </div>

                        <!-- Navigation Controls -->
                        <div class="d-flex align-center gap-3">
                          <v-btn
                            :disabled="currentPage === 1"
                            variant="outlined"
                            size="default"
                            color="primary"
                            class="pagination-btn"
                            @click="() => handlePageChange(currentPage - 1)"
                            title="Previous Page"
                          >
                            <v-icon start>mdi-chevron-left</v-icon>
                            Previous
                          </v-btn>
                          
                          <v-btn
                            :disabled="currentPage >= totalPages"
                            variant="outlined"
                            size="default"
                            color="primary"
                            class="pagination-btn"
                            @click="() => handlePageChange(currentPage + 1)"
                            title="Next Page"
                          >
                            Next
                            <v-icon end>mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

            </v-col>
          </v-row>
        </v-container>
      </template>
    </ClientOnly>

    <!-- User View Modal -->
    <UserViewModal
      v-model="showUserModal"
      :user="selectedUser"
    />

    <!-- User Edit Modal -->
    <UserEditModal
      v-model="showEditModal"
      :user="editingUser"
      @user-updated="handleUserUpdated"
    />

    <!-- Create User Modal -->
    <CreateUserModal
      v-model="showCreateModal"
      @user-created="handleUserCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useUsersErrorHandler } from '~/composables/errors/useUsersErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import { usersApi } from '~/api/users';
import UserViewModal from '~/components/users/UserViewModal.vue';
import UserEditModal from '~/components/users/UserEditModal.vue';
import CreateUserModal from '~/components/users/CreateUserModal.vue';

// Page meta
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

// Composables
const userStore = useUserStore();
const { handleError } = useUsersErrorHandler();
const { showSuccess } = useNotifications();

// Reactive data
const users = ref<any[]>([]);
const totalUsers = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(20);
const isLoading = ref(false);

// Modal state
const showUserModal = ref(false);
const selectedUser = ref<any>(null);
const showEditModal = ref(false);
const editingUser = ref<any>(null);
const showCreateModal = ref(false);

// Search and filter state
const searchQuery = ref('');
const searchField = ref('name');
const showFilters = ref(false);

// Filters
const filters = ref({
  role: null as string | null,
  blacklisted: false
});

// Sorting state
const sortField = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Options
const searchFieldOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'ID', value: 'id' }
];

const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role' },
  { title: 'Created', value: 'created_at' },
  { title: 'Updated', value: 'updated_at' }
];

const sortOrderOptions = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
];

const pageSizeOptions = [
  { title: '10 per page', value: 10 },
  { title: '20 per page', value: 20 },
  { title: '50 per page', value: 50 },
  { title: '100 per page', value: 100 }
];

const roleOptions = [
  { title: 'User', value: 'user' },
  { title: 'Moderator', value: 'mod' },
  { title: 'Admin', value: 'admin' }
];

// Table headers
const tableHeaders = [
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Name', key: 'name', sortable: true, width: '150px' },
  { title: 'Email', key: 'email', sortable: true, width: '200px' },
  { title: 'Role', key: 'role', sortable: true, width: '120px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Created', key: 'created_at', sortable: true, width: '150px' },
  { title: 'Updated', key: 'updated_at', sortable: true, width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
];

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / itemsPerPage.value);
});

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         filters.value.role !== null ||
         filters.value.blacklisted !== false;
});

const searchFieldLabel = computed(() => {
  const option = searchFieldOptions.find(opt => opt.value === searchField.value);
  return option ? option.title : 'Name';
});

// Methods
const loadUsers = async () => {
  try {
    isLoading.value = true;
    
    const query: any = {
      limit: itemsPerPage.value,
      skip: (currentPage.value - 1) * itemsPerPage.value,
      sort: { field: sortField.value, order: sortOrder.value }
    };

    // Add search parameters
    if (searchQuery.value) {
      if (searchField.value === 'name') {
        query.searchName = searchQuery.value;
      } else if (searchField.value === 'email') {
        query.searchEmail = searchQuery.value;
      } else if (searchField.value === 'id') {
        query.searchId = searchQuery.value;
      }
    }

    // Add filter parameters
    if (filters.value.role) {
      query.role = filters.value.role;
    }
    if (filters.value.blacklisted === true) {
      query.blacklisted = true;
    }

    console.log('Loading users with query:', query);
    console.log('Filters state:', filters.value);
    console.log('Search query:', searchQuery.value);

    const response = await usersApi.getUsers(query);
    
    if (response.data) {
      users.value = response.data.users || response.data;
      totalUsers.value = response.data.total || 0;
    }
  } catch (err: any) {
    console.error('Error loading users:', err);
    handleError(err, 'Loading Users');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadUsers();
};

const handlePageSizeChange = () => {
  currentPage.value = 1;
  loadUsers();
};

const handleSortChange = () => {
  currentPage.value = 1;
  loadUsers();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  searchQuery.value = '';
  filters.value = {
    role: null,
    blacklisted: false
  };
  currentPage.value = 1;
  loadUsers();
};

const viewUser = (user: any) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const editUser = (user: any) => {
  editingUser.value = user;
  showEditModal.value = true;
};

const handleUserUpdated = async (updatedUser: any) => {
  try {
    if (!editingUser.value?.id) {
      console.error('No user ID available for update');
      return;
    }

    // Show loading state
    isLoading.value = true;

    // Make API call to update user
    const response = await usersApi.updateUser(editingUser.value.id, updatedUser);
    
    // Check if the request was successful
    if (response.success && response.data) {
      // Show success message
      showSuccess('User updated successfully');
      console.log('User updated successfully:', response.data);
      
      // Refresh the users list to show updated data
      await loadUsers();
      
      // Close the edit modal
      showEditModal.value = false;
      editingUser.value = null;
    } else if (response.error) {
      // Handle API error
      console.error('API Error:', response.error);
      throw response.error; // Re-throw to be caught by catch block
    } else {
      // Handle unexpected response format
      throw new Error('Unexpected response format from API');
    }
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    // Debug: Log the error structure
    console.log('Error structure:', {
      hasError: !!error.error,
      errorCode: error.error?.code || error.code,
      errorMessage: error.error?.message || error.message,
      fullError: error
    });
    
    // Handle error using the error handler
    if (error.error) {
      handleError(error.error, 'Update User');
    } else {
      handleError(error, 'Update User');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleUserCreated = async (newUser: any) => {
  try {
    // Show success message
    showSuccess('User created successfully!');
    
    // Refresh the users list to show the new user
    await loadUsers();
    
    // Close the create modal
    showCreateModal.value = false;
    
  } catch (error: any) {
    console.error('Error handling user creation:', error);
    // Error handling is already done in the modal
  }
};

// Check if current user can edit the target user
const canEditUser = (targetUser: any) => {
  // Cannot edit yourself
  if (targetUser.id === userStore.user?.id) return false;
  
  // Admin can edit both users and mods
  if (userStore.isAdmin) return true;
  
  // Mod can only edit regular users
  if (userStore.user?.role === 'mod') {
    return targetUser.role === 'user';
  }
  
  // Regular users cannot edit anyone
  return false;
};

// Get tooltip text for edit button
const getEditButtonTooltip = (targetUser: any) => {
  if (targetUser.id === userStore.user?.id) {
    return 'Cannot edit your own account';
  }
  
  if (userStore.isAdmin) {
    return `Edit ${targetUser.role === 'admin' ? 'admin' : targetUser.role === 'mod' ? 'moderator' : 'user'}`;
  }
  
  if (userStore.user?.role === 'mod' && targetUser.role === 'user') {
    return 'Edit user';
  }
  
  return 'Cannot edit this user';
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'accent';
    case 'mod':
      return 'secondary';
    default:
      return 'primary';
  }
};



// Watch for search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
  loadUsers();
});

// Watch for filter changes
watch(filters, () => {
  currentPage.value = 1;
  loadUsers();
}, { deep: true });

// Load initial data
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users-wrapper {
  min-height: 100vh;
}

.users-table-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Custom styles for input fields */
:deep(.input-field) {
  font-size: 2rem;
}

:deep(.input-field .v-field__input) {
  padding: 12px 16px;
  min-height: 56px;
  font-size: 1.4rem !important;
}

:deep(.input-field .v-field__prepend-inner) {
  padding-left: 12px;
}

:deep(.input-field .v-field__append-inner) {
  padding-right: 12px;
}

:deep(.input-field .v-label) {
  font-size: 1.2rem;
  opacity: 0.8;
}

/* Custom styles for buttons */
:deep(.profile-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Users table styling */
:deep(.users-table) {
  font-size: 1.1rem;
}

/* Column width control */
:deep(.users-table .v-data-table__td) {
  font-size: 1.1rem;
  padding: 16px 8px;
  white-space: nowrap;
}

:deep(.users-table .v-data-table__th) {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 8px;
  white-space: nowrap;
}

/* Custom pagination styling */
.custom-pagination {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 16px;
}

.page-size-section {
  min-width: 140px;
  display: flex;
  align-items: center;
}

.page-size-select {
  min-width: 140px;
}

/* Hide the messages area below the select to fix alignment */
:deep(.page-size-select .v-input__details) {
  display: none;
}

.page-info {
  min-width: 200px;
  text-align: center;
}

.pagination-btn {
  min-width: 120px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* Role chip styling to match app bar */
.role-chip {
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

/* Custom styling for role chips */
:deep(.role-chip.v-chip--color-accent) {
  background-color: #166088 !important;
  color: white !important;
}

:deep(.role-chip.v-chip--color-secondary) {
  background-color: #6b8cae !important;
  color: white !important;
}

:deep(.role-chip.v-chip--color-primary) {
  background-color: #4a6fa5 !important;
  color: white !important;
}
</style>
