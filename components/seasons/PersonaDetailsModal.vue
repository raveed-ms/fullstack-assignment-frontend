<template>
  <v-dialog v-model="dialogValue" max-width="1200px" max-height="90vh" persistent>
    <v-card v-if="persona">
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-account</v-icon>
        <span class="text-h5 font-weight-medium">{{ persona.name }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div class="persona-details">

          <!-- Eligible Players Section -->
          <div class="mb-6">
            <div class="mb-3">
              <h3 class="text-h6">Eligible Players</h3>
            </div>
            
            <!-- Player Search Bar -->
            <div class="mb-4">
              <v-text-field
                v-model="searchQuery"
                label="Search by username"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                clearable
                @update:model-value="filterPlayers"
                placeholder="Type to search players..."
              ></v-text-field>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoadingPlayers" class="text-center py-6">
              <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
              <div class="mt-3 text-body-2 text-grey">Loading eligible players...</div>
            </div>
            
            <!-- Players List -->
            <div v-else-if="filteredPlayers.length > 0">
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
                :text="`Found ${filteredPlayers.length} eligible players for this persona`"
              ></v-alert>
              
              <div class="players-list">
                <div
                  v-for="player in paginatedPlayers"
                  :key="player.id"
                  class="player-list-item"
                >
                  <div class="player-info">
                    <div class="player-name">{{ player.display_name || player.username }}</div>
                    <div class="player-id">ID: {{ player.id }}</div>
                  </div>
                  <div class="player-stats">
                    <div class="player-stat">
                      <span class="stat-label">Level:</span>
                      <span class="stat-value">{{ player.careerLevel }}</span>
                    </div>
                    <div class="player-stat">
                      <span class="stat-label">MOU:</span>
                      <span class="stat-value">{{ player.mou }}</span>
                    </div>
                    <div class="player-stat">
                      <span class="stat-label">Cash Deposit:</span>
                      <span class="stat-value">${{ (player.cashDeposit / 100).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No Players Found -->
            <div v-else-if="!isLoadingPlayers && eligiblePlayers.length === 0 && hasSearched">
              <v-alert
                type="warning"
                variant="tonal"
                class="mb-4"
                text="No eligible players found for this persona criteria"
              ></v-alert>
            </div>
            
            <!-- No Results After Search -->
            <div v-else-if="hasSearched && searchQuery && filteredPlayers.length === 0" class="text-center py-6">
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
                text="No players found matching your search."
              ></v-alert>
            </div>
            
            <!-- Pagination -->
            <div v-if="filteredPlayers.length > 0" class="mt-4">
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex align-center justify-space-between">
                <div class="text-body-2 text-grey">
                  Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredPlayers.length }} players
                </div>
                <div class="d-flex align-center gap-2">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="text"
                    size="small"
                    :disabled="currentPage === 1"
                    @click="previousPage"
                  ></v-btn>
                  <span class="text-body-2 mx-2">
                    Page {{ currentPage }} of {{ totalPages }}
                  </span>
                  <v-btn
                    icon="mdi-chevron-right"
                    variant="text"
                    size="small"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                  ></v-btn>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { playersApi } from '~/api/players';
import type { Player, PlayerQuery } from '~/api/players';

interface PersonaRules {
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

interface Persona {
  id: number;
  name: string;
  description?: string;
  priority: number;
  personaRules: PersonaRules;
  eventId?: number;
  eventName?: string;
}

interface Props {
  modelValue: boolean;
  persona: Persona | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State
const eligiblePlayers = ref<Player[]>([]);
const isLoadingPlayers = ref(false);
const hasSearched = ref(false);
const searchQuery = ref('');
const filteredPlayers = ref<Player[]>([]);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const startIndex = ref(0);
const endIndex = ref(0);

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const paginatedPlayers = computed(() => {
  return filteredPlayers.value.slice(startIndex.value, endIndex.value);
});

const closeModal = () => {
  emit('update:modelValue', false);
  // Reset state when closing
  eligiblePlayers.value = [];
  filteredPlayers.value = [];
  hasSearched.value = false;
  searchQuery.value = '';
  currentPage.value = 1;
  updatePagination();
};

const filterPlayers = () => {
  if (!searchQuery.value.trim()) {
    filteredPlayers.value = eligiblePlayers.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredPlayers.value = eligiblePlayers.value.filter(player => 
      (player.display_name && player.display_name.toLowerCase().includes(query)) ||
      (player.username && player.username.toLowerCase().includes(query))
    );
  }
  currentPage.value = 1;
  updatePagination();
};



const updatePagination = () => {
  totalPages.value = Math.ceil(filteredPlayers.value.length / itemsPerPage.value);
  currentPage.value = Math.min(currentPage.value, totalPages.value);
  if (currentPage.value < 1) currentPage.value = 1;
  
  startIndex.value = (currentPage.value - 1) * itemsPerPage.value;
  endIndex.value = Math.min(startIndex.value + itemsPerPage.value, filteredPlayers.value.length);
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePagination();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updatePagination();
  }
};



const loadEligiblePlayers = async () => {
  if (!props.persona) return;
  
  isLoadingPlayers.value = true;
  hasSearched.value = true;
  
  try {
    // Build query based on persona rules
    const query: PlayerQuery = {
      limit: 100, // Limit to 100 players for performance
      sort: { field: 'careerLevel', order: 'desc' } // Sort by level descending
    };
    
    // Parse persona rules and create range queries
    
    // Level rules (careerLevel)
    if (props.persona.personaRules?.level) {
      const levelRules = props.persona.personaRules.level;
      if (levelRules.min !== undefined || levelRules.max !== undefined) {
        query.careerLevel = {};
        if (levelRules.min !== undefined) {
          query.careerLevel.$gte = levelRules.min;
        }
        if (levelRules.max !== undefined) {
          query.careerLevel.$lte = levelRules.max;
        }
      }
    }
    
    // MMR rules (mou)
    if (props.persona.personaRules?.mmr) {
      const mmrRules = props.persona.personaRules.mmr;
      if (mmrRules.min !== undefined || mmrRules.max !== undefined) {
        query.mou = {};
        if (mmrRules.min !== undefined) {
          query.mou.$gte = mmrRules.min;
        }
        if (mmrRules.max !== undefined) {
          query.mou.$lte = mmrRules.max;
        }
      }
    }
    
    // Spending rules (cashDeposit) - convert dollars to cents
    if (props.persona.personaRules?.spending) {
      const spendingRules = props.persona.personaRules.spending;
      if (spendingRules.min !== undefined || spendingRules.max !== undefined) {
        query.cashDeposit = {};
        if (spendingRules.min !== undefined) {
          query.cashDeposit.$gte = spendingRules.min * 100; // Convert dollars to cents
        }
        if (spendingRules.max !== undefined) {
          query.cashDeposit.$lte = spendingRules.max * 100; // Convert dollars to cents
        }
      }
    }
    
    console.log('Loading eligible players with query:', query);
    
    const response = await playersApi.getPlayers(query);
    if (response.success && response.data) {
      eligiblePlayers.value = response.data.players;
      filteredPlayers.value = eligiblePlayers.value; // Set filtered players initially
      console.log(`Found ${eligiblePlayers.value.length} eligible players`);
      updatePagination(); // Update pagination after loading players
    } else {
      eligiblePlayers.value = [];
      filteredPlayers.value = [];
      updatePagination();
      console.error('Failed to load eligible players:', response.error);
    }
  } catch (error) {
    console.error('Error loading eligible players:', error);
    eligiblePlayers.value = [];
    filteredPlayers.value = [];
    updatePagination();
  } finally {
    isLoadingPlayers.value = false;
  }
};

// Auto-load players when modal opens
const watchDialogValue = watch(dialogValue, (newValue) => {
  if (newValue && props.persona && !hasSearched.value) {
    loadEligiblePlayers();
  }
});
</script>

<style scoped>
.persona-details {
  max-height: 70vh;
  overflow-y: auto;
}



/* Players section styles */
.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.player-list-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.04);
}

.player-info {
  flex: 1;
}

.player-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.player-id {
  font-size: 0.875rem;
  color: #6c757d;
}

.player-stats {
  display: flex;
  gap: 24px;
  align-items: center;
}

.player-stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}


</style>
