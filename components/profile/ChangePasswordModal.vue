<template>
  <v-dialog v-model="dialogValue" max-width="500px" persistent>
    <v-card>
      <v-card-text class="pa-4">
        <v-form ref="passwordFormRef" v-model="passwordFormValid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.currentPassword"
                label="Current Password"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="toggleCurrentPasswordVisibility"
                class="input-field"
                required
                :disabled="isLoading"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.newPassword"
                label="New Password"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required, rules.minLength]"
                prepend-inner-icon="mdi-lock-plus"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="toggleNewPasswordVisibility"
                class="input-field"
                required
                :disabled="isLoading"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.confirmPassword"
                label="Confirm New Password"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required, rules.passwordMatch]"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="toggleConfirmPasswordVisibility"
                class="input-field"
                required
                :disabled="isLoading"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="closeModal"
          :disabled="isLoading"
          class="modal-button"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="changePassword"
          :loading="isLoading"
          :disabled="!passwordFormValid"
          class="modal-button"
        >
          Change Password
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePasswordChange } from '~/composables/usePasswordChange';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const {
  passwordFormValid,
  isLoading,
  passwordFormRef,
  passwordForm,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  rules,
  toggleCurrentPasswordVisibility,
  toggleNewPasswordVisibility,
  toggleConfirmPasswordVisibility,
  changePassword: changePasswordAction
} = usePasswordChange();

// Computed property for v-model binding
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Close modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Change password and close modal
const changePassword = async () => {
  try {
    const result = await changePasswordAction();
    
    if (result.success) {
      closeModal();
    } else {
      // Error is already shown via notification system
      // Don't close modal on error, let user fix the issue
    }
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Failed to change password:', error.message);
    // Don't close modal on error, let user fix the issue
  }
  };
</script>

<style scoped>
/* Custom styles for input fields - same as login form */
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

:deep(.modal-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
