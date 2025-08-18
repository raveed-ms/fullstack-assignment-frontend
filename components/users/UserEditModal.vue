<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card v-if="user">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-account-edit</v-icon>
        <span class="text-h5 font-weight-medium">Manage User: {{ user.name }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="user" class="user-details">
          <v-form ref="form" v-model="isFormValid">
            <v-row>


                  <!-- Role Field - Admin Only -->
                  <v-col cols="12" md="6" v-if="userStore.isAdmin">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Role Management</div>
                      <div class="detail-value">
                        <div class="d-flex align-center">
                          <v-icon class="mr-3" color="primary">mdi-shield-account</v-icon>
                          <div class="flex-grow-1">
                            <v-switch
                              v-model="editedUser.role"
                              :true-value="getTargetRole()"
                              :false-value="props.user?.role"
                              :disabled="!canChangeRole"
                              color="primary"
                              hide-details
                            >
                              <template v-slot:label>
                                <span class="text-body-2">
                                  <span class="font-weight-medium">{{ getCurrentRoleDisplay() }}</span>
                                  <v-icon size="small" class="mx-2">mdi-arrow-right</v-icon>
                                  <span class="font-weight-medium">{{ getTargetRoleDisplay() }}</span>
                                </span>
                              </template>
                            </v-switch>
                          </div>
                        </div>
                        <div v-if="!canChangeRole" class="text-caption text-info mt-1 ml-8">
                          <v-icon size="small" class="mr-1">mdi-information</v-icon>
                          Admin roles cannot be changed
                        </div>
                        <div v-else class="text-caption text-info mt-1 ml-8">
                          <v-icon size="small" class="mr-1">mdi-information</v-icon>
                          {{ getRoleChangeDescription() }}
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <!-- Blacklisted Status -->
                  <v-col cols="12" md="6">
                    <div class="detail-item mb-4">
                      <div class="detail-label mb-2">Account Status</div>
                      <div class="detail-value">
                        <v-switch
                          v-model="editedUser.blacklisted"
                          label="Blacklisted"
                          color="error"
                          hide-details
                        ></v-switch>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
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
          class="me-3"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="saveChanges"
          :loading="isSaving"
          :disabled="!isFormValid || !hasChanges"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { User } from '~/types/api';
import { useUserStore } from '~/stores/user';

interface Props {
  modelValue: boolean;
  user: User | null;
}

interface Emits {
  (e: 'update:model-value', value: boolean): void;
  (e: 'user-updated', user: User): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const userStore = useUserStore();
const form = ref();
const isFormValid = ref(false);
const isSaving = ref(false);

// Form data
const editedUser = ref({
  role: 'user' as 'user' | 'mod' | 'admin',
  blacklisted: false
});

// Store original user data for comparison
const originalUser = ref({
  role: 'user' as 'user' | 'mod' | 'admin',
  blacklisted: false
});

// Role options (no longer used with toggle)
// const roleOptions = [
//   { title: 'User', value: 'user' },
//   { title: 'Moderator', value: 'mod' },
//   { title: 'Admin', value: 'admin' }
// ];

// Available role options (no longer used with toggle)
// const availableRoleOptions = computed(() => {
//   // Only admins can change roles
//   if (!userStore.isAdmin) {
//     return [];
//   }
//   
//   if (!props.user) {
//     return [];
//   }
//   
//   // Admin can only promote users to mods or demote mods to users
//   // Cannot promote to admin or demote from admin
//   if (props.user.role === 'user') {
//     // Can promote user to mod (only show the target role)
//     return [
//       { title: 'Moderator', value: 'mod' }
//     ];
//   } else if (props.user.role === 'mod') {
//     // Can demote mod to user (only show the target role)
//     return [
//       { title: 'User', value: 'user' }
//     ];
//   } else if (props.user.role === 'admin') {
//     // Cannot change admin roles
//     return [
//       { title: 'Admin', value: 'admin' }
//     ];
//   }
//   
//   return [];
// });

// Check if current user can change the target user's role
const canChangeRole = computed(() => {
  if (!props.user) return false;
  
  // Only admins can change roles
  if (!userStore.isAdmin) return false;
  
  // Admin can only promote users to mods or demote mods to users
  // Cannot promote to admin or demote from admin
  if (props.user.role === 'user') {
    // Can promote user to mod
    return true;
  } else if (props.user.role === 'mod') {
    // Can demote mod to user
    return true;
  } else if (props.user.role === 'admin') {
    // Cannot change admin roles
    return false;
  }
  
  return false;
});

// Get description of what role change is possible
const getRoleChangeDescription = () => {
  if (!props.user) return '';
  
  if (props.user.role === 'user') {
    return 'Can promote user to moderator';
  } else if (props.user.role === 'mod') {
    return 'Can demote moderator to user';
  } else if (props.user.role === 'admin') {
    return 'Admin roles cannot be changed';
  }
  
  return '';
};

// Get the target role for the toggle
const getTargetRole = () => {
  if (!props.user) return 'user';
  
  if (props.user.role === 'user') {
    return 'mod'; // Can promote user to mod
  } else if (props.user.role === 'mod') {
    return 'user'; // Can demote mod to user
  } else if (props.user.role === 'admin') {
    return 'admin'; // Cannot change admin
  }
  
  return 'user';
};

// Get display name for current role
const getCurrentRoleDisplay = () => {
  if (!props.user) return '';
  
  switch (props.user.role) {
    case 'user': return 'User';
    case 'mod': return 'Moderator';
    case 'admin': return 'Admin';
    default: return '';
  }
};

// Get display name for target role
const getTargetRoleDisplay = () => {
  const targetRole = getTargetRole();
  
  switch (targetRole) {
    case 'user': return 'User';
    case 'mod': return 'Moderator';
    case 'admin': return 'Admin';
    default: return '';
  }
};

// Helper functions for display
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

// Validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required'
};

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
});

const hasChanges = computed(() => {
  if (!props.user) return false;
  
  // For role changes, check if toggle is switched to target role
  const roleChanged = canChangeRole.value && editedUser.value.role === getTargetRole();
  const blacklistedChanged = editedUser.value.blacklisted !== originalUser.value.blacklisted;
  
  return roleChanged || blacklistedChanged;
});

// Watch for user changes to populate form
watch(() => props.user, (newUser) => {
  if (newUser) {
    // Store original user data for comparison
    originalUser.value = {
      role: newUser.role,
      blacklisted: newUser.blacklisted
    };
    
    // Default to original role - toggle will show the change
    editedUser.value = {
      role: newUser.role,
      blacklisted: newUser.blacklisted
    };
    // Reset loading state when opening modal with new user
    isSaving.value = false;
  }
}, { immediate: true });

// Watch for modal close to reset loading state
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    isSaving.value = false;
  }
});

// Methods
const closeModal = () => {
  dialogValue.value = false;
  resetForm();
  isSaving.value = false;
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
  }
  // Default to original role - toggle will show the change
  editedUser.value = {
    role: props.user?.role || 'user',
    blacklisted: props.user?.blacklisted || false
  };
  
  // Reset original user data
  if (props.user) {
    originalUser.value = {
      role: props.user.role,
      blacklisted: props.user.blacklisted
    };
  }
};

const saveChanges = async () => {
  if (!form.value?.validate()) return;
  
  isSaving.value = true;
  
  try {
    // Create the updated user object with only fields the user can edit
    const updatedUser: Partial<User> = {};
    
    // Only include role if toggle is switched to target role
    if (canChangeRole.value && editedUser.value.role === getTargetRole()) {
      updatedUser.role = editedUser.value.role;
    }
    // Blacklisted status can always be changed by users with edit permissions
    updatedUser.blacklisted = editedUser.value.blacklisted;

    // Double-check: Ensure moderators never send role field
    if (userStore.user?.role === 'mod' && !userStore.isAdmin) {
      delete updatedUser.role;
    }

    // Emit the updated user data
    emit('user-updated', updatedUser as User);
    
    // Note: Don't close modal here - let the parent handle it after successful API call
    
  } catch (error) {
    console.error('Error saving user changes:', error);
    // Reset loading state on error
    isSaving.value = false;
  }
};
</script>

<style scoped>
.v-divider {
  margin: 16px 0;
}

/* Custom styling for the password section */
.text-subtitle-1 {
  color: #6c757d;
}

/* Warning text styling */
.text-warning {
  color: #ff9800;
}

/* Info text styling */
.text-info {
  color: #2196f3;
}

/* User details styling */
.user-details {
  padding: 0;
}

.detail-item {
  margin-bottom: 1.5rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  color: #212529;
}

/* Role chip styling */
.role-chip {
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}
</style>
