<template>
  <div class="players-wrapper">
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
                        @click="loadPlayers"
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
                    <!-- Basic Info Filters -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="filters.location"
                        label="Location"
                        clearable
                        density="compact"
                        variant="outlined"
                        class="input-field"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="filters.chatRole"
                        :items="chatRoleOptions"
                        label="Chat Role"
                        clearable
                        density="compact"
                        variant="outlined"
                        class="input-field"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-switch
                        v-model="filters.isBotUser"
                        label="Bot Users Only"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- Game Stats Filters -->
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">GIR (Greens in Regulation) %</label>
                        <v-range-slider
                          v-model="filters.statsGIR"
                          :min="0"
                          :max="100"
                          :step="0.1"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          {{ filters.statsGIR[0] }}% - {{ filters.statsGIR[1] }}%
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">Win Ratio %</label>
                        <v-range-slider
                          v-model="filters.statsWinRatio"
                          :min="0"
                          :max="100"
                          :step="0.1"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          {{ filters.statsWinRatio[0] }}% - {{ filters.statsWinRatio[1] }}%
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- Career Filters -->
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">Career Level</label>
                        <v-range-slider
                          v-model="filters.careerLevel"
                          :min="1"
                          :max="100"
                          :step="1"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          Level {{ filters.careerLevel[0] }} - {{ filters.careerLevel[1] }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">Career XP</label>
                        <v-range-slider
                          v-model="filters.careerXP"
                          :min="0"
                          :max="1000000"
                          :step="1000"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          {{ (filters.careerXP[0] / 1000).toFixed(0) }}k - {{ (filters.careerXP[1] / 1000).toFixed(0) }}k XP
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- MOU Filter -->
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">MOU (Measure of Use)</label>
                        <v-range-slider
                          v-model="filters.mou"
                          :min="-200"
                          :max="200"
                          :step="1"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          MOU {{ filters.mou[0] }} - {{ filters.mou[1] }}
                        </div>
                      </div>
                    </v-col>
                    
                    <!-- Cash Deposit Filter -->
                    <v-col cols="12" md="6">
                      <div class="mb-3">
                        <label class="text-caption">Cash Deposit ($)</label>
                        <v-range-slider
                          v-model="filters.cashDeposit"
                          :min="0"
                          :max="1000"
                          :step="10"
                          thumb-label="always"
                          density="compact"
                        />
                        <div class="text-caption text-center mt-1">
                          ${{ (filters.cashDeposit[0] / 100).toFixed(2) }} - ${{ (filters.cashDeposit[1] / 100).toFixed(2) }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- Date Range Filters -->
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="showDateFromPicker"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="filters.createTimeFrom"
                            label="Created From"
                            readonly
                            v-bind="props"
                            prepend-inner-icon="mdi-calendar"
                            density="compact"
                            variant="outlined"
                            class="input-field"
                            clearable
                          />
                        </template>
                        <v-date-picker
                          v-model="filters.createTimeFrom"
                          @update:model-value="showDateFromPicker = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="showDateToPicker"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="filters.createTimeTo"
                            label="Created To"
                            readonly
                            v-bind="props"
                            prepend-inner-icon="mdi-calendar"
                            density="compact"
                            variant="outlined"
                            class="input-field"
                            clearable
                          />
                        </template>
                        <v-date-picker
                          v-model="filters.createTimeTo"
                          @update:model-value="showDateToPicker = false"
                        />
                      </v-menu>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        size="small"
                        @click="clearAllFilters"
                        :disabled="!hasActiveFilters"
                        class="profile-button me-3"
                      >
                        <v-icon start>mdi-filter-off</v-icon>
                        Clear All Filters
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        size="small"
                        @click="applyFilters"
                        :disabled="!hasActiveFilters"
                        class="profile-button"
                      >
                        <v-icon start>mdi-filter-check</v-icon>
                        Apply Filters
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

    <!-- Players Table -->
    <v-card class="players-table-card">


      <v-card-text class="pa-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <div class="mt-4 text-body-1 text-grey">Loading players...</div>
        </div>

        <!-- Players Table -->
        <div v-else>
          <v-data-table
            :key="`players-table-${currentPage}-${itemsPerPage}`"
            :headers="tableHeaders"
            :items="players"
            :loading="isLoading"
            class="players-table"
            hover
            hide-default-footer
          >
            <!-- ID Column -->
            <template v-slot:item.id="{ item }">
              <span class="font-mono text-caption">{{ item.id }}</span>
            </template>

            <!-- Username Column -->
            <template v-slot:item.username="{ item }">
              <span class="font-weight-medium">{{ item.username || 'No username' }}</span>
            </template>

            <!-- Display Name Column -->
            <template v-slot:item.display_name="{ item }">
              <span>{{ item.display_name || 'No display name' }}</span>
            </template>

            <!-- Email Column -->
            <template v-slot:item.email="{ item }">
              <span>{{ item.email || 'No email' }}</span>
            </template>

            <!-- Player Type Column -->
            <template v-slot:item.player_type="{ item }">
              <v-chip
                :color="item.isBotUser ? 'grey-darken-2' : 'primary'"
                variant="flat"
                size="small"
                :prepend-icon="item.isBotUser ? 'mdi-robot' : 'mdi-account'"
              >
                {{ item.isBotUser ? 'Bot' : 'Human' }}
              </v-chip>
            </template>

            <!-- MOU Column -->
            <template v-slot:item.mou="{ item }">
              <v-chip
                :color="getMouColor(item.mou)"
                variant="flat"
                size="small"
                :prepend-icon="getMouIcon(item.mou)"
              >
                {{ formatMouValue(item.mou) }}
              </v-chip>
            </template>

            <!-- Cash Deposit Column -->
            <template v-slot:item.cashDeposit="{ item }">
              <v-chip
                :color="getCashDepositColor(item.cashDeposit)"
                variant="flat"
                size="small"
                :prepend-icon="getCashDepositIcon(item.cashDeposit)"
              >
                {{ formatCashDepositValue(item.cashDeposit) }}
              </v-chip>
            </template>

            <!-- Create Time Column -->
            <template v-slot:item.create_time="{ item }">
              <span class="text-caption">{{ formatDate(item.create_time) }}</span>
            </template>

            <!-- Update Time Column -->
            <template v-slot:item.update_time="{ item }">
              <span class="text-caption">{{ formatDate(item.update_time) }}</span>
            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  @click="viewPlayer(item)"
                >
                  View
                </v-btn>
                <v-btn
                  color="secondary"
                  variant="text"
                  size="small"
                  @click="editPlayer(item)"
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
  </div>

  <!-- Player Details Modal -->
  <PlayerDetailsModal
    v-model="playerDetailsModalOpen"
    :player="selectedPlayer"
  />
  
  <!-- Edit Player Modal -->
  <EditPlayerModal
    v-model="editPlayerModalOpen"
    :player="selectedPlayer"
    @save="handleEditPlayer"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { playersApi } from '~/api/players';
import { usePlayersErrorHandler } from '~/composables/errors/usePlayersErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Player, PlayerQuery } from '~/api/players';
import PlayerDetailsModal from '~/components/players/PlayerDetailsModal.vue';
import EditPlayerModal from '~/components/players/EditPlayerModal.vue';

// Page meta
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  layout: 'authenticated'
});

// Composables
const userStore = useUserStore();
const { handleError } = usePlayersErrorHandler();
const { showSuccess } = useNotifications();

// Reactive data
const players = ref<Player[]>([]);
const totalPlayers = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoading = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const searchField = ref('username');
const sortField = ref('username');
const sortOrder = ref<'asc' | 'desc'>('asc');
const showFilters = ref(false);
const showDateFromPicker = ref(false);
const showDateToPicker = ref(false);

// Modal state
const playerDetailsModalOpen = ref(false);
const editPlayerModalOpen = ref(false);
const selectedPlayer = ref<Player | null>(null);

// Filter state
const filters = ref({
  location: null as string | null,
  chatRole: null as number | null,
  isBotUser: false as boolean,
  statsGIR: [0, 100] as [number, number],
  statsWinRatio: [0, 100] as [number, number],
  careerLevel: [1, 100] as [number, number],
  careerXP: [0, 1000000] as [number, number],
  mou: [-200, 200] as [number, number],
  cashDeposit: [0, 1000] as [number, number],
  createTimeFrom: null as string | null,
  createTimeTo: null as string | null
});

// Options
const searchFieldOptions = [
  { title: 'Username', value: 'username' },
  { title: 'Display Name', value: 'display_name' },
  { title: 'Email', value: 'email' },
  { title: 'UUID', value: 'id' }
];

const sortOptions = [
  { title: 'Username', value: 'username' },
  { title: 'Display Name', value: 'display_name' },
  { title: 'Email', value: 'email' },
  { title: 'Created', value: 'create_time' },
  { title: 'Updated', value: 'update_time' },
  { title: 'GIR %', value: 'statsGIR' },
  { title: 'Win %', value: 'statsWinRatio' },
  { title: 'Level', value: 'careerLevel' },
  { title: 'XP', value: 'careerXP' },
  { title: 'MOU', value: 'mou' },
  { title: 'Cash Deposit', value: 'cashDeposit' }
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

const chatRoleOptions = [
  { title: 'User', value: 0 },
  { title: 'Moderator', value: 1 },
  { title: 'Admin', value: 2 }
];

// Table headers
const tableHeaders = [
  { title: 'ID', key: 'id', sortable: true, width: '120px' },
  { title: 'Username', key: 'username', sortable: true, width: '150px' },
  { title: 'Display Name', key: 'display_name', sortable: true, width: '180px' },
  { title: 'Email', key: 'email', sortable: true, width: '200px' },
  { title: 'Player Type', key: 'player_type', sortable: false, width: '120px' },
  { title: 'MOU', key: 'mou', sortable: true, width: '120px' },
  { title: 'Cash Deposit', key: 'cashDeposit', sortable: true, width: '140px' },
  { title: 'Create Time', key: 'create_time', sortable: true, width: '150px' },
  { title: 'Update Time', key: 'update_time', sortable: true, width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
];

// Computed
const totalPages = computed(() => {
  const pages = Math.ceil(totalPlayers.value / itemsPerPage.value);
  console.log('Total pages calculation:', totalPlayers.value, '/', itemsPerPage.value, '=', pages);
  return pages;
});

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         filters.value.location !== null ||
         filters.value.chatRole !== null ||
         filters.value.isBotUser !== false ||
         filters.value.statsGIR[0] !== 0 || filters.value.statsGIR[1] !== 100 ||
         filters.value.statsWinRatio[0] !== 0 || filters.value.statsWinRatio[1] !== 100 ||
         filters.value.careerLevel[0] !== 1 || filters.value.careerLevel[1] !== 100 ||
         filters.value.careerXP[0] !== 0 || filters.value.careerXP[1] !== 1000000 ||
         filters.value.mou[0] !== -200 || filters.value.mou[1] !== 200 ||
         filters.value.cashDeposit[0] !== 0 || filters.value.cashDeposit[1] !== 1000 ||
         filters.value.createTimeFrom !== null ||
         filters.value.createTimeTo !== null;
});

const searchFieldLabel = computed(() => {
  const option = searchFieldOptions.find(opt => opt.value === searchField.value);
  return option ? option.title : 'Username';
});

// Methods
const loadPlayers = async () => {
  try {
    isLoading.value = true;
    
    const query: PlayerQuery = {
      limit: itemsPerPage.value,
      skip: (currentPage.value - 1) * itemsPerPage.value,
      sort: { field: sortField.value, order: sortOrder.value }
    };

    // Add filter parameters
    if (filters.value.location) {
      query.location = filters.value.location;
    }
    if (filters.value.chatRole !== null) {
      query.chatRole = filters.value.chatRole;
    }
    if (filters.value.isBotUser) {
      query.isBotUser = filters.value.isBotUser;
    }
    if (filters.value.statsGIR[0] !== 0 || filters.value.statsGIR[1] !== 100) {
      query.statsGIR = {
        $gte: filters.value.statsGIR[0],
        $lte: filters.value.statsGIR[1]
      };
    }
    if (filters.value.statsWinRatio[0] !== 0 || filters.value.statsWinRatio[1] !== 100) {
      query.statsWinRatio = {
        $gte: filters.value.statsWinRatio[0] / 100, // Convert to decimal
        $lte: filters.value.statsWinRatio[1] / 100
      };
    }
    if (filters.value.careerLevel[0] !== 1 || filters.value.careerLevel[1] !== 100) {
      query.careerLevel = {
        $gte: filters.value.careerLevel[0],
        $lte: filters.value.careerLevel[1]
      };
    }
    if (filters.value.careerXP[0] !== 0 || filters.value.careerXP[1] !== 1000000) {
      query.careerXP = {
        $gte: filters.value.careerXP[0],
        $lte: filters.value.careerXP[1]
      };
    }
    if (filters.value.mou[0] !== -200 || filters.value.mou[1] !== 200) {
      query.mou = {
        $gte: filters.value.mou[0],
        $lte: filters.value.mou[1]
      };
    }
    if (filters.value.cashDeposit[0] !== 0 || filters.value.cashDeposit[1] !== 1000) {
      query.cashDeposit = {
        $gte: filters.value.cashDeposit[0] * 100,  // Convert dollars to cents
        $lte: filters.value.cashDeposit[1] * 100   // Convert dollars to cents
      };
    }
    if (filters.value.createTimeFrom) {
      // Convert date to ISO string and set to start of day in UTC
      const fromDate = new Date(filters.value.createTimeFrom);
      fromDate.setHours(0, 0, 0, 0);
      query.createTimeFrom = fromDate.toISOString();
      console.log(`Frontend date conversion - createTimeFrom: ${filters.value.createTimeFrom} -> UTC: ${query.createTimeFrom}`);
    }
    if (filters.value.createTimeTo) {
      // Convert date to ISO string and set to end of day in UTC
      const toDate = new Date(filters.value.createTimeTo);
      toDate.setHours(23, 59, 59, 999);
      query.createTimeTo = toDate.toISOString();
      console.log(`Frontend date conversion - createTimeTo: ${filters.value.createTimeTo} -> UTC: ${query.createTimeTo}`);
    }

    console.log('Loading players with query:', query);
    console.log('Range filters applied:', {
      statsGIR: query.statsGIR,
      statsWinRatio: query.statsWinRatio,
      careerLevel: query.careerLevel,
      careerXP: query.careerXP,
      mou: query.mou,
      cashDeposit: query.cashDeposit
    });
    console.log('Date filters applied:', {
      createTimeFrom: query.createTimeFrom,
      createTimeTo: query.createTimeTo
    });
    console.log('Current itemsPerPage:', itemsPerPage.value);

    if (debouncedSearchQuery.value) {
      // Map search field to the appropriate query parameter
      switch (searchField.value) {
        case 'username':
          query.searchUsername = debouncedSearchQuery.value;
          break;
        case 'display_name':
          query.searchDisplayName = debouncedSearchQuery.value;
          break;
        case 'email':
          query.searchEmail = debouncedSearchQuery.value;
          break;
        case 'id':
          query.searchUuid = debouncedSearchQuery.value;
          break;
      }
    }

    const response = await playersApi.getPlayers(query);
    if (response.data) {
      console.log('Setting players array to:', response.data.players.length, 'players');
      players.value = response.data.players;
      totalPlayers.value = response.data.pagination.total;
      console.log('Players array after setting:', players.value.length);
      console.log('Total players:', totalPlayers.value);
      console.log('Current page:', currentPage.value);
    }
  } catch (err: any) {
    handleError(err, 'Loading Players');
  } finally {
    isLoading.value = false;
  }
};





const handleSortChange = () => {
  currentPage.value = 1;
  loadPlayers();
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  currentPage.value = 1;
  loadPlayers();
};

const handlePageChange = (page: number) => {
  console.log('Page changed to:', page, 'Type:', typeof page);
  console.log('Current page before update:', currentPage.value);
  currentPage.value = page;
  console.log('Current page after update:', currentPage.value);
  loadPlayers();
};



const handlePageSizeChange = () => {
  console.log('Page size changed to:', itemsPerPage.value);
  currentPage.value = 1; // Reset to first page when changing page size
  loadPlayers();
};

const clearFilters = () => {
  searchQuery.value = '';
  // Clear all advanced filters
  filters.value = {
    location: null,
    chatRole: null,
    isBotUser: false,
    statsGIR: [0, 100],
    statsWinRatio: [0, 100],
    careerLevel: [1, 100],
    careerXP: [0, 1000000],
    mou: [-200, 200],
    cashDeposit: [0, 1000],
    createTimeFrom: null,
    createTimeTo: null
  };
  currentPage.value = 1;
  loadPlayers();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearAllFilters = () => {
  filters.value = {
    location: null,
    chatRole: null,
    isBotUser: false,
    statsGIR: [0, 100],
    statsWinRatio: [0, 100],
    careerLevel: [1, 100],
    careerXP: [0, 1000000],
    mou: [-200, 200],
    cashDeposit: [0, 1000],
    createTimeFrom: null,
    createTimeTo: null
  };
  currentPage.value = 1;
  loadPlayers();
};

const applyFilters = () => {
  currentPage.value = 1;
  loadPlayers();
};

const viewPlayer = (player: Player) => {
  selectedPlayer.value = player;
  playerDetailsModalOpen.value = true;
};

const editPlayer = (player: Player) => {
  selectedPlayer.value = player;
  editPlayerModalOpen.value = true;
};

const handleEditPlayer = async (playerData: Partial<Player>) => {
  try {
    if (!selectedPlayer.value) return;
    
    console.log('Saving player changes:', playerData);
    
    // Only send fields that were actually changed from the original player data
    const changedFields: Partial<Player> = {};
    
    Object.entries(playerData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const originalValue = (selectedPlayer.value as any)[key];
        if (value !== originalValue) {
          (changedFields as any)[key] = value;
        }
      }
    });
    
    // Check if there are any actual changes
    if (Object.keys(changedFields).length === 0) {
      console.log('No changes detected');
      return;
    }
    
    console.log('Fields that changed:', changedFields);
    
    // Prepare the update data
    const updateData = {
      data: changedFields,
      reason: 'Player data update'
    };
    
    // Call the API to update the player
    const response = await playersApi.updatePlayer(selectedPlayer.value.id, updateData);
    
    if (response.success) {
      console.log('Player updated successfully:', response.data);
      
      // Refresh the players list to show updated data
      await loadPlayers();
      
      // Close the modal
      editPlayerModalOpen.value = false;
      
      // Show success notification
      showSuccess('Player Updated', 'Player data has been updated successfully');
          } else {
        console.error('Failed to update player:', response.error);
        // Use the error handler to show user-friendly error messages
              if (response.error) {
        console.log('Handling response error:', response.error);
        handleError(response.error, 'Update Player');
      }
      }
    } catch (error) {
      console.error('Error updating player:', error);
      // Handle error using the error handler
      if (error && typeof error === 'object' && 'error' in error && error.error && 
          typeof error.error === 'object' && 'status' in error.error && 'code' in error.error && 'message' in error.error) {
        handleError(error.error as any, 'Update Player');
      } else {
        handleError({ 
          status: 500, 
          code: 'UNKNOWN_ERROR', 
          message: 'An unexpected error occurred'
        }, 'Update Player');
      }
    }
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

// MOU helper functions
const formatMouValue = (mou: number) => {
  if (mou === 0) return '0';
  if (mou > 0) return `+${mou.toFixed(1)}`;
  return mou.toFixed(1);
};

const getMouColor = (mou: number) => {
  if (mou === 0) return 'grey';
  if (mou > 0) return 'success';
  return 'error';
};

const getMouIcon = (mou: number) => {
  if (mou === 0) return 'mdi-minus';
  if (mou > 0) return 'mdi-trending-up';
  return 'mdi-trending-down';
};

// Cash Deposit helper functions
const formatCashDepositValue = (cashDeposit: number) => {
  if (cashDeposit === 0) return '$0';
  // Convert cents to dollars
  const dollars = cashDeposit / 100;
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`;
  }
  return `$${dollars.toFixed(2)}`;
};

const getCashDepositColor = (cashDeposit: number) => {
  if (cashDeposit === 0) return 'grey';
  // Convert cents to dollars for comparison
  const dollars = cashDeposit / 100;
  if (dollars >= 500) return 'success';      // $500+
  if (dollars >= 100) return 'warning';      // $100+
  return 'info';                              // $1-$99
};

const getCashDepositIcon = (cashDeposit: number) => {
  if (cashDeposit === 0) return 'mdi-cash-minus';
  // Convert cents to dollars for comparison
  const dollars = cashDeposit / 100;
  if (dollars >= 500) return 'mdi-cash-plus';    // $500+
  if (dollars >= 100) return 'mdi-cash';         // $100+
  return 'mdi-cash-multiple';                     // $1-$99
};

// Watchers
watch(searchQuery, (newValue) => {
  // Debounce search query changes
  const timeoutId = setTimeout(() => {
    debouncedSearchQuery.value = newValue;
    currentPage.value = 1; // Reset to first page
    loadPlayers();
  }, 500); // 500ms delay

  // Cleanup timeout on component unmount
  return () => clearTimeout(timeoutId);
});

watch(searchField, () => {
  // Reset search query when search field changes
  searchQuery.value = '';
  debouncedSearchQuery.value = '';
  currentPage.value = 1;
  loadPlayers();
});

// Lifecycle
onMounted(() => {
  loadPlayers();
});
</script>

<style scoped>
.players-wrapper {
  min-height: 100vh;
}

.players-table-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}



.gap-3 {
  gap: 12px;
}

/* Custom styles for input fields - same as events page */
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

:deep(.v-messages) {
  font-size: 1.1rem;
  line-height: 1.4;
  min-height: 1.4rem;
}

/* Custom styles for buttons - same as events page */
:deep(.profile-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Players table styling */
:deep(.players-table) {
  font-size: 1.1rem;
}

/* Column width control */
:deep(.players-table .v-data-table__td) {
  font-size: 1.1rem;
  padding: 16px 8px;
  white-space: nowrap;
}

:deep(.players-table .v-data-table__th) {
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
</style>
