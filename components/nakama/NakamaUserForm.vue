<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <!-- Basic Information -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-account</v-icon>
            Basic Information
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.username"
                  label="Username"
                  :rules="[v => !!v || 'Username is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.display_name"
                  label="Display Name"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.email"
                  label="Email"
                  type="email"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedUser.lang_tag"
                  label="Language Tag"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedUser.location"
                  label="Location"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.avatar_url"
                  label="Avatar URL"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Chat & Status -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-chat</v-icon>
            Chat & Status
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="editedUser.chatRole"
                  :items="chatRoleOptions"
                  label="Chat Role"
                  item-title="text"
                  item-value="value"
                />
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="editedUser.chatBanned"
                  label="Chat Banned"
                  color="error"
                />
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="editedUser.isBotUser"
                  label="Bot User"
                  color="orange"
                />
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="editedUser.isPayingUser"
                  label="Paying User"
                  color="success"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Game Statistics -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Game Statistics
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsGIR"
                  label="GIR %"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsWinRatio"
                  label="Win Ratio"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsLongestDrive"
                  label="Longest Drive (yards)"
                  type="number"
                  step="0.1"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsLongestPutt"
                  label="Longest Putt (feet)"
                  type="number"
                  step="0.1"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsLongestChip"
                  label="Longest Chip (feet)"
                  type="number"
                  step="0.1"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsHoleInOneCount"
                  label="Hole-in-Ones"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="editedUser.statsTotalAttempted"
                  label="Total Games Played"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Badges -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-medal</v-icon>
            Badges
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsSpeedKing"
                  label="Speed King"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsPuttMaster"
                  label="Putt Master"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsPerfectRound"
                  label="Perfect Round"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsSharpShooter"
                  label="Sharp Shooter"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.statsRecoveryMaster"
                  label="Recovery Master"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Earnings & Career -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-trophy</v-icon>
            Earnings & Career
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.earningsRanking"
                  label="Ranking"
                  type="number"
                  min="-1"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.careerLevel"
                  label="Level"
                  type="number"
                  min="1"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.careerXP"
                  label="Experience Points"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.careerLeague"
                  label="League"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.earningsCashEarned"
                  label="Cash Earned"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.earningsCoinsEarned"
                  label="Coins Earned"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Wallet -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-wallet</v-icon>
            Wallet
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.walletCoins"
                  label="Coins"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.walletBonusCash"
                  label="Bonus Cash"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Avatar Settings -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-account-circle</v-icon>
            Avatar Settings
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.avatarType"
                  label="Avatar Type"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedUser.avatarIndex"
                  label="Avatar Index"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-card class="mt-4">
      <v-card-actions class="justify-end pa-4">
        <v-btn
          color="secondary"
          variant="outlined"
          @click="$emit('reset')"
          :disabled="saving"
        >
          Reset
        </v-btn>
        <v-btn
          color="primary"
          @click="$emit('save')"
          :loading="saving"
          :disabled="!isFormValid"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import type { FlattenedNakamaUser } from '~/types'
import { NAKAMA_CHAT_ROLE_OPTIONS } from '~/constants/nakama'

// Props
interface Props {
  user: FlattenedNakamaUser
  editedUser: FlattenedNakamaUser
  saving: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:editedUser': [user: FlattenedNakamaUser]
  'reset': []
  'save': []
}>()

// Form validation
const isFormValid = ref(true)
const form = ref()

// Computed property for two-way binding
const editedUser = computed({
  get: () => props.editedUser,
  set: (value) => emit('update:editedUser', value)
})

// Chat role options
const chatRoleOptions = NAKAMA_CHAT_ROLE_OPTIONS
</script> 