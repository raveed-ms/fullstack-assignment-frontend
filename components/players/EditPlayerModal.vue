<template>
  <v-dialog v-model="dialogValue" max-width="900px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-account-edit</v-icon>
        <span class="text-h5 font-weight-medium">Edit Player: {{ player?.display_name || player?.username || 'Unknown' }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="player" class="edit-player-form">
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
                  <v-text-field
                    v-model="editData.username"
                    label="Username"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    :rules="[v => !!v || 'Username is required']"
                  />
                  
                  <v-text-field
                    v-model="editData.display_name"
                    label="Display Name"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                  
                  <v-text-field
                    v-model="editData.email"
                    label="Email"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="email"
                    clearable
                  />
                  
                  <v-text-field
                    v-model="editData.location"
                    label="Location"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editData.lang_tag"
                    label="Language"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                  
                  <v-text-field
                    v-model="editData.timezone"
                    label="Timezone"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                  
                  <v-text-field
                    v-model="editData.avatar_url"
                    label="Avatar URL"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                  
                  <v-switch
                    v-model="editData.isBotUser"
                    label="Bot User"
                    density="compact"
                    hide-details
                    class="mb-4"
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Game Statistics Tab -->
            <v-window-item value="stats">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.statsGIR"
                    label="GIR %"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    max="100"
                    suffix="%"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.statsWinRatio"
                    label="Win Ratio"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    hint="Enter as decimal (e.g., 0.75 for 75%)"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.careerLevel"
                    label="Career Level"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="1"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.careerXP"
                    label="Career XP"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.statsLongestDrive"
                    label="Longest Drive"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    suffix="yards"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="editData.statsLongestPutt"
                    label="Longest Putt"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    suffix="feet"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Additional Info Tab -->
            <v-window-item value="additional">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editData.chatRole"
                    :items="chatRoleOptions"
                    label="Chat Role"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    clearable
                  />
                  
                  <v-switch
                    v-model="editData.chatBanned"
                    label="Chat Banned"
                    density="compact"
                    hide-details
                    class="mb-4"
                  />
                  
                  <v-switch
                    v-model="editData.isPayingUser"
                    label="Paying User"
                    density="compact"
                    hide-details
                    class="mb-4"
                  />
                  
                  <v-text-field
                    v-model.number="editData.walletCoins"
                    label="Wallet Coins"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editData.walletBonusCash"
                    label="Bonus Cash"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    clearable
                  />
                  
                  <v-text-field
                    v-model.number="editData.earningsRanking"
                    label="Earnings Ranking"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="-1"
                    clearable
                  />
                  
                  <v-text-field
                    v-model.number="editData.avatarType"
                    label="Avatar Type"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    clearable
                  />
                  
                  <v-text-field
                    v-model.number="editData.avatarIndex"
                    label="Avatar Index"
                    variant="outlined"
                    density="compact"
                    class="mb-4"
                    type="number"
                    min="0"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <!-- Footer Actions -->
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="closeModal"
          class="me-3"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="saveChanges"
          :loading="isSaving"
          :disabled="!hasChanges"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Player } from '~/api/players';

interface Props {
  modelValue: boolean;
  player: Player | null;
}

interface Emits {
  (e: 'update:model-value', value: boolean): void;
  (e: 'save', playerData: Partial<Player>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTab = ref('basic');
const isSaving = ref(false);

// Chat role options
const chatRoleOptions = [
  { title: 'User', value: 0 },
  { title: 'Moderator', value: 1 },
  { title: 'Admin', value: 2 }
];

// Edit data - will be populated from player data
const editData = ref<Partial<Player>>({});

// Watch for player changes and populate edit data
watch(() => props.player, (newPlayer) => {
  if (newPlayer) {
    // Create a copy of the player data for editing
    editData.value = {
      username: newPlayer.username,
      display_name: newPlayer.display_name,
      avatar_url: newPlayer.avatar_url,
      lang_tag: newPlayer.lang_tag,
      location: newPlayer.location,
      timezone: newPlayer.timezone,
      email: newPlayer.email,
      chatRole: newPlayer.chatRole,
      chatBanned: newPlayer.chatBanned,
      isBotUser: newPlayer.isBotUser,
      isPayingUser: newPlayer.isPayingUser,
      statsGIR: newPlayer.statsGIR,
      statsWinRatio: newPlayer.statsWinRatio,
      statsLongestDrive: newPlayer.statsLongestDrive,
      statsLongestPutt: newPlayer.statsLongestPutt,
      statsLongestChip: newPlayer.statsLongestChip,
      statsHoleInOneCount: newPlayer.statsHoleInOneCount,
      statsTotalAttempted: newPlayer.statsTotalAttempted,
      statsSpeedKing: newPlayer.statsSpeedKing,
      statsPuttMaster: newPlayer.statsPuttMaster,
      statsPerfectRound: newPlayer.statsPerfectRound,
      statsSharpShooter: newPlayer.statsSharpShooter,
      statsRecoveryMaster: newPlayer.statsRecoveryMaster,
      earningsRanking: newPlayer.earningsRanking,
      earningsCashEarned: newPlayer.earningsCashEarned,
      earningsCoinsEarned: newPlayer.earningsCoinsEarned,
      careerXP: newPlayer.careerXP,
      careerLevel: newPlayer.careerLevel,
      careerLeague: newPlayer.careerLeague,
      avatarType: newPlayer.avatarType,
      avatarIndex: newPlayer.avatarIndex,
      walletCoins: newPlayer.walletCoins,
      walletBonusCash: newPlayer.walletBonusCash
    };
  }
}, { immediate: true });

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
});

// Check if there are any changes
const hasChanges = computed(() => {
  if (!props.player) return false;
  
  // Compare edit data with original player data
  const original = props.player;
  const edited = editData.value;
  
  return (
    edited.username !== original.username ||
    edited.display_name !== original.display_name ||
    edited.avatar_url !== original.avatar_url ||
    edited.lang_tag !== original.lang_tag ||
    edited.location !== original.location ||
    edited.timezone !== original.timezone ||
    edited.email !== original.email ||
    edited.chatRole !== original.chatRole ||
    edited.chatBanned !== original.chatBanned ||
    edited.isBotUser !== original.isBotUser ||
    edited.isPayingUser !== original.isPayingUser ||
    edited.statsGIR !== original.statsGIR ||
    edited.statsWinRatio !== original.statsWinRatio ||
    edited.statsLongestDrive !== original.statsLongestDrive ||
    edited.statsLongestPutt !== original.statsLongestPutt ||
    edited.statsLongestChip !== original.statsLongestChip ||
    edited.statsHoleInOneCount !== original.statsHoleInOneCount ||
    edited.statsTotalAttempted !== original.statsTotalAttempted ||
    edited.statsSpeedKing !== original.statsSpeedKing ||
    edited.statsPuttMaster !== original.statsPuttMaster ||
    edited.statsPerfectRound !== original.statsPerfectRound ||
    edited.statsSharpShooter !== original.statsSharpShooter ||
    edited.statsRecoveryMaster !== original.statsRecoveryMaster ||
    edited.earningsRanking !== original.earningsRanking ||
    edited.earningsCashEarned !== original.earningsCashEarned ||
    edited.earningsCoinsEarned !== original.earningsCoinsEarned ||
    edited.careerXP !== original.careerXP ||
    edited.careerLevel !== original.careerLevel ||
    edited.careerLeague !== original.careerLeague ||
    edited.avatarType !== original.avatarType ||
    edited.avatarIndex !== original.avatarIndex ||
    edited.walletCoins !== original.walletCoins ||
    edited.walletBonusCash !== original.walletBonusCash
  );
});

const closeModal = () => {
  dialogValue.value = false;
};

const saveChanges = () => {
  if (hasChanges.value) {
    emit('save', editData.value);
  }
};
</script>

<style scoped>
.edit-player-form {
  max-height: 70vh;
  overflow-y: auto;
}

.v-window-item {
  padding: 16px 0;
}
</style>
