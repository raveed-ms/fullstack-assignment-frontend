<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-account</v-icon>
        <span class="text-h5 font-weight-medium">{{ player?.display_name || player?.username || 'Player Details' }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="player" class="player-details">
          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" class="mb-6">
            <v-tab value="basic">
              <v-icon start>mdi-information</v-icon>
              Basic Info
            </v-tab>
            <v-tab value="stats">
              <v-icon start>mdi-gamepad-variant</v-icon>
              Game Statistics
            </v-tab>
            <v-tab value="additional">
              <v-icon start>mdi-wallet</v-icon>
              Additional Info
            </v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <v-window v-model="activeTab">
            <!-- Basic Info Tab -->
            <v-window-item value="basic">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Username</div>
                    <div class="detail-value">{{ player.username || 'No username' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Display Name</div>
                    <div class="detail-value">{{ player.display_name || 'No display name' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Email</div>
                    <div class="detail-value">{{ player.email || 'No email' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Location</div>
                    <div class="detail-value">{{ player.location || 'No location' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Language</div>
                    <div class="detail-value">{{ player.lang_tag || 'No language' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Timezone</div>
                    <div class="detail-value">{{ player.timezone || 'No timezone' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Created</div>
                    <div class="detail-value">{{ formatDate(player.create_time) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Updated</div>
                    <div class="detail-value">{{ formatDate(player.update_time) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Game Statistics Tab -->
            <v-window-item value="stats">
              <v-row>
                <v-col cols="12" md="3">
                  <div class="stats-card">
                    <div class="stats-label">GIR %</div>
                    <div class="stats-value">{{ player.statsGIR?.toFixed(1) || '0' }}%</div>
                  </div>
                </v-col>
                
                <v-col cols="12" md="3">
                  <div class="stats-card">
                    <div class="stats-label">Win Ratio</div>
                    <div class="stats-value">{{ ((player.statsWinRatio || 0) * 100).toFixed(1) }}%</div>
                  </div>
                </v-col>
                
                <v-col cols="12" md="3">
                  <div class="stats-card">
                    <div class="stats-label">Level</div>
                    <div class="stats-value">{{ player.careerLevel || '1' }}</div>
                  </div>
                </v-col>
                
                <v-col cols="12" md="3">
                  <div class="stats-card">
                    <div class="stats-label">XP</div>
                    <div class="stats-value">{{ (player.careerXP || 0).toLocaleString() }}</div>
                  </div>
                </v-col>
              </v-row>

              <v-row class="mt-6">
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Longest Drive</div>
                    <div class="detail-value">{{ Math.round(player.statsLongestDrive || 0) }} yards</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Hole in One Count</div>
                    <div class="detail-value">{{ Math.round(player.statsHoleInOneCount || 0) }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Total Games</div>
                    <div class="detail-value">{{ Math.round(player.statsTotalAttempted || 0) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Career League</div>
                    <div class="detail-value">{{ Math.round(player.careerLeague || 0) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Additional Info Tab -->
            <v-window-item value="additional">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Chat Role</div>
                    <div class="detail-value">{{ getChatRoleLabel(player.chatRole) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Player Type</div>
                    <div class="detail-value">{{ player.isBotUser ? 'Bot' : 'Human' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Avatar Type</div>
                    <div class="detail-value">{{ player.avatarType || '0' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Wallet Coins</div>
                    <div class="detail-value">{{ (player.walletCoins || 0).toLocaleString() }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Cash Earned</div>
                    <div class="detail-value">${{ ((player.earningsCashEarned || 0) / 100).toFixed(2) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Bonus Cash</div>
                    <div class="detail-value">${{ ((player.walletBonusCash || 0) / 100).toFixed(2) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="outlined"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Player } from '~/api/players';

interface Props {
  modelValue: boolean;
  player: Player | null;
}

interface Emits {
  (e: 'update:model-value', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTab = ref('basic');

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
});

const closeModal = () => {
  dialogValue.value = false;
};

const formatDate = (dateString: string | null | undefined) => {
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

const getChatRoleColor = (role: number | null | undefined) => {
  switch (role) {
    case 0: return 'blue';
    case 1: return 'orange';
    case 2: return 'red';
    default: return 'grey';
  }
};

const getChatRoleLabel = (role: number | null | undefined) => {
  switch (role) {
    case 0: return 'User';
    case 1: return 'Moderator';
    case 2: return 'Admin';
    default: return 'Unknown';
  }
};
</script>

<style scoped>
.detail-item {
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.stats-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.stats-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 8px;
}

.stats-value {
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 700;
}
</style>
