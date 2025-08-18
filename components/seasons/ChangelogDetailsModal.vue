<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card v-if="changelog">
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-history</v-icon>
        <span class="text-h5 font-weight-medium">Change Details</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="changelog" class="changelog-details">
          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" class="mb-6">
            <v-tab value="changes">
              <v-icon start>mdi-history</v-icon>
              Changes
            </v-tab>
            <v-tab value="modifier">
              <v-icon start>mdi-account</v-icon>
              Modifier Details
            </v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <v-window v-model="activeTab">
            <!-- Changes Tab -->
            <v-window-item value="changes">
              <!-- Basic Info -->
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Basic Information</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Entity ID</div>
                      <div class="detail-value font-mono">{{ changelog.entityId }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Entity Type</div>
                      <div class="detail-value">{{ changelog.entityType }}</div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Modified At</div>
                      <div class="detail-value">{{ formatDate(changelog.modifiedAt) }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Change Reason</div>
                      <div class="detail-value">{{ changelog.changeReason || 'N/A' }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- Changes Summary -->
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Changes Summary</h3>
                

                
                <!-- Added Fields -->
                <div v-if="parsedChangeSummary?.added && Object.keys(parsedChangeSummary.added).length > 0" class="mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon start size="small" class="mr-2">mdi-plus-circle</v-icon>
                    Added Fields ({{ Object.keys(changelog.changeSummary.added).length }})
                  </h4>
                  <div class="changes-grid">
                    <div v-for="(value, field) in parsedChangeSummary.added" :key="`added-${field}`" class="change-item">
                      <div class="change-field-name">{{ field }}</div>
                      <div class="change-field-value">{{ formatFieldValue(value) }}</div>
                    </div>
                  </div>
                </div>

                <!-- Modified Fields -->
                <div v-if="parsedChangeSummary?.modified && Object.keys(parsedChangeSummary.modified).length > 0" class="mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon start size="small" class="mr-2">mdi-pencil</v-icon>
                    Modified Fields ({{ Object.keys(parsedChangeSummary.modified).length }})
                  </h4>
                  <div class="changes-grid">
                    <div v-for="(change, field) in parsedChangeSummary.modified" :key="`modified-${field}`" class="change-item">
                      <div class="change-field-name">{{ field }}</div>
                      <div class="change-field-change">
                        <span class="old-value">{{ formatFieldValue(change.from) }}</span>
                        <div class="arrow-container">
                          <v-icon size="small" color="grey">mdi-arrow-down</v-icon>
                        </div>
                        <span class="new-value">{{ formatFieldValue(change.to) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Removed Fields -->
                <div v-if="parsedChangeSummary?.removed && Object.keys(parsedChangeSummary.removed).length > 0" class="mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon start size="small" class="mr-2">mdi-minus-circle</v-icon>
                    Removed Fields ({{ Object.keys(parsedChangeSummary.removed).length }})
                  </h4>
                  <div class="changes-grid">
                    <div v-for="(value, field) in parsedChangeSummary.removed" :key="`removed-${field}`" class="change-item">
                      <div class="change-field-name">{{ field }}</div>
                      <div class="change-field-value">{{ formatFieldValue(value) }}</div>
                    </div>
                  </div>
                </div>

                <!-- No Changes -->
                <div v-if="!parsedChangeSummary?.added || Object.keys(parsedChangeSummary.added).length === 0">
                  <div v-if="!parsedChangeSummary?.modified || Object.keys(parsedChangeSummary.modified).length === 0">
                    <div v-if="!parsedChangeSummary?.removed || Object.keys(parsedChangeSummary.removed).length === 0">
                      <v-alert type="info" variant="tonal" class="mt-3">
                        No changes detected in this entry.
                      </v-alert>
                    </div>
                  </div>
                </div>
              </div>


            </v-window-item>

            <!-- Modifier Details Tab -->
            <v-window-item value="modifier">
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Modifier Information</h3>
                
                <!-- Loading State -->
                <div v-if="isLoadingModifier" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                  <div class="mt-3 text-body-2 text-grey">Loading modifier details...</div>
                </div>

                <!-- Modifier Details -->
                <div v-else-if="modifierDetails" class="modifier-details">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">User ID</div>
                        <div class="detail-value font-mono">{{ modifierDetails.id }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">Name</div>
                        <div class="detail-value">{{ modifierDetails.name }}</div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">Email</div>
                        <div class="detail-value">{{ modifierDetails.email }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">Role</div>
                        <div class="detail-value">
                          <v-chip
                            :color="getRoleColor(modifierDetails.role)"
                            variant="flat"
                            size="small"
                          >
                            {{ modifierDetails.role.toUpperCase() }}
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">Status</div>
                        <div class="detail-value">
                          {{ modifierDetails.blacklisted ? 'Blacklisted' : 'Active' }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="detail-item mb-4">
                        <div class="detail-label mb-2">Created</div>
                        <div class="detail-value">{{ formatDate(modifierDetails.created_at) }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Error State -->
                <div v-else-if="modifierError" class="text-center py-8">
                  <v-alert type="error" variant="tonal" class="mb-3">
                    {{ modifierError }}
                  </v-alert>
                  <v-btn color="primary" variant="outlined" size="small" @click="loadModifierDetails">
                    Retry
                  </v-btn>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="outlined" @click="closeModal">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { usersApi } from '~/api/users';
import type { Changelog } from '~/types/api';

interface Props {
  modelValue: boolean;
  changelog: Changelog | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Reactive data
const activeTab = ref('changes');
const isLoadingModifier = ref(false);
const modifierDetails = ref<any>(null);
const modifierError = ref<string | null>(null);

// Parse changeSummary if it's a string
const parsedChangeSummary = computed(() => {
  if (!props.changelog?.changeSummary) return null;
  
  if (typeof props.changelog.changeSummary === 'string') {
    try {
      return JSON.parse(props.changelog.changeSummary);
    } catch (error) {
      console.error('Error parsing changeSummary:', error);
      return null;
    }
  }
  
  return props.changelog.changeSummary;
});

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const closeModal = () => {
  dialogValue.value = false;
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

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};



// Role helper functions - consistent with project styling
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

// Load modifier details
const loadModifierDetails = async () => {
  if (!props.changelog?.modifiedBy) return;
  
  try {
    isLoadingModifier.value = true;
    modifierError.value = null;
    
    // Fetch user details from the users API
    const response = await usersApi.getUser(props.changelog.modifiedBy);
    
    if (response.success && response.data) {
      modifierDetails.value = response.data;
    } else {
      throw new Error(response.error?.message || 'Failed to fetch modifier details');
    }
  } catch (error: any) {
    modifierError.value = error.message || 'Failed to load modifier details';
    modifierDetails.value = null;
  } finally {
    isLoadingModifier.value = false;
  }
};

// Watch for changelog changes to load modifier details
watch(() => props.changelog, (newChangelog) => {
  if (newChangelog && activeTab.value === 'modifier') {
    loadModifierDetails();
  }
}, { immediate: true });

// Watch for tab changes to load modifier details when needed
watch(activeTab, (newTab) => {
  if (newTab === 'modifier' && props.changelog && !modifierDetails.value && !isLoadingModifier.value) {
    loadModifierDetails();
  }
});
</script>

<style scoped>
/* Consistent styling with other modals */
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

/* Changes grid styling */
.changes-grid {
  display: grid;
  gap: 16px;
}

.change-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  min-height: fit-content;
}

.change-field-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  word-break: break-word;
}

.change-field-value {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 100%;
}

.change-field-change {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.change-field-change .arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.old-value {
  color: #dc3545;
  font-size: 0.9rem;
  text-decoration: line-through;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  padding: 8px 12px;
  background: rgba(220, 53, 69, 0.05);
  border-radius: 4px;
  border-left: 3px solid #dc3545;
}

.new-value {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  padding: 8px 12px;
  background: rgba(40, 167, 69, 0.05);
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .change-item {
    padding: 16px;
    gap: 10px;
  }
  
  .change-field-name {
    font-size: 0.9rem;
    padding-bottom: 6px;
  }
  
  .change-field-value,
  .old-value,
  .new-value {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
  
  .changes-grid {
    gap: 12px;
  }
}
</style>
