<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card v-if="user">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-account-circle</v-icon>
        <span class="text-h5 font-weight-medium">{{ user.name || 'User Details' }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="user" class="user-details">
          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" class="mb-6">
            <v-tab value="basic">
              <v-icon start>mdi-information</v-icon>
              Basic Info
            </v-tab>
            <v-tab value="additional">
              <v-icon start>mdi-account-cog</v-icon>
              Additional Details
            </v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <v-window v-model="activeTab">
            <!-- Basic Info Tab -->
            <v-window-item value="basic">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">User ID</div>
                    <div class="detail-value font-mono">{{ user.id }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Name</div>
                    <div class="detail-value">{{ user.name || 'No name' }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Email</div>
                    <div class="detail-value">{{ user.email || 'No email' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Role</div>
                    <div class="detail-value">
                      <v-chip
                        :color="getRoleColor(user.role)"
                        variant="flat"
                        size="small"
                        class="role-chip"
                      >
                        {{ user.role.toUpperCase() }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Status</div>
                    <div class="detail-value">
                      <v-chip
                        :color="user.blacklisted ? 'error' : 'success'"
                        variant="flat"
                        size="small"
                      >
                        {{ user.blacklisted ? 'Blacklisted' : 'Active' }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Created</div>
                    <div class="detail-value">{{ formatDate(user.created_at) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Additional Details Tab -->
            <v-window-item value="additional">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Last Updated</div>
                    <div class="detail-value">{{ formatDate(user.updated_at) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Account Age</div>
                    <div class="detail-value">{{ getAccountAge(user.created_at) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
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
import type { User } from '~/types/api';

interface Props {
  modelValue: boolean;
  user: User | null;
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



const getAccountAge = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
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


</script>

<style scoped>
.user-details {
  min-height: 400px;
}

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
