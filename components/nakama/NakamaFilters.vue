<template>
  <div>
    <div class="d-flex align-center mb-2">
      <v-icon class="mr-2">mdi-filter</v-icon>
      <span class="text-subtitle-2">Filters</span>
      <v-spacer />
      <v-btn
        v-if="hasActiveFilters"
        size="small"
        variant="text"
        @click="$emit('clear-all-filters')"
        color="error"
      >
        Clear All Filters
      </v-btn>
    </div>
    
    <!-- Filter Categories -->
    <v-expansion-panels variant="accordion" class="mb-3">
      <!-- Basic Info Filters -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-account</v-icon>
          Basic Information
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.location"
                label="Location"
                clearable
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="filters.chatRole"
                :items="chatRoleOptions"
                label="Chat Role"
                clearable
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="filters.isBotUser"
                label="Bot Users Only"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Game Stats Filters -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-gamepad-variant</v-icon>
          Game Statistics
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">GIR (Greens in Regulation)</label>
                <v-range-slider
                  v-model="filters.statsGIR"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">Win Ratio (%)</label>
                <v-range-slider
                  v-model="filters.statsWinRatio"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">Longest Drive (yards)</label>
                <v-range-slider
                  v-model="filters.statsLongestDrive"
                  :min="0"
                  :max="500"
                  :step="1"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">Hole in One Count</label>
                <v-range-slider
                  v-model="filters.statsHoleInOneCount"
                  :min="0"
                  :max="50"
                  :step="1"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Career & Earnings Filters -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-trophy</v-icon>
          Career & Earnings
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
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
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">Cash Earned ($)</label>
                <v-range-slider
                  v-model="filters.earningsCashEarned"
                  :min="0"
                  :max="100000"
                  :step="100"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <label class="text-caption">Wallet Coins</label>
                <v-range-slider
                  v-model="filters.walletCoins"
                  :min="0"
                  :max="100000"
                  :step="100"
                  thumb-label="always"
                  density="compact"
                />
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Date Range Filters -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-calendar</v-icon>
          Date Range
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.createTimeFrom"
                label="Created From"
                type="date"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.createTimeTo"
                label="Created To"
                type="date"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.updateTimeFrom"
                label="Updated From"
                type="date"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.updateTimeTo"
                label="Updated To"
                type="date"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Apply Filters Button -->
    <div class="d-flex justify-end">
      <v-btn
        color="primary"
        prepend-icon="mdi-filter-check"
        @click="$emit('apply-filters')"
        :loading="loading"
        :disabled="!hasActiveFilters"
      >
        Apply Filters
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAKAMA_CHAT_ROLE_OPTIONS } from '~/constants/nakama'
import type { NakamaFilters } from '~/types/nakama'

// Props
interface Props {
  filters: NakamaFilters
  loading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:filters': [filters: NakamaFilters]
  'apply-filters': []
  'clear-all-filters': []
}>()

// Computed properties for two-way binding
const filters = computed({
  get: () => props.filters,
  set: (value) => emit('update:filters', value)
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  const f = filters.value
  return (
    f.location !== null ||
    f.chatRole !== null ||
    f.isBotUser !== false ||
    f.statsGIR[0] !== 0 || f.statsGIR[1] !== 100 ||
    f.statsWinRatio[0] !== 0 || f.statsWinRatio[1] !== 1 ||
    f.statsLongestDrive[0] !== 0 || f.statsLongestDrive[1] !== 500 ||
    f.statsHoleInOneCount[0] !== 0 || f.statsHoleInOneCount[1] !== 50 ||
    f.careerLevel[0] !== 1 || f.careerLevel[1] !== 100 ||
    f.careerXP[0] !== 0 || f.careerXP[1] !== 1000000 ||
    f.earningsCashEarned[0] !== 0 || f.earningsCashEarned[1] !== 100000 ||
    f.walletCoins[0] !== 0 || f.walletCoins[1] !== 100000 ||
    f.createTimeFrom !== null ||
    f.createTimeTo !== null ||
    f.updateTimeFrom !== null ||
    f.updateTimeTo !== null
  )
})

// Options from constants
const chatRoleOptions = NAKAMA_CHAT_ROLE_OPTIONS
</script> 