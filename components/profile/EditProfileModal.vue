<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card>
      <v-card-text class="pa-4">
        <v-form ref="editFormRef" v-model="editFormValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.name"
                label="Full Name"
                variant="outlined"
                :rules="[rules.minLength]"
                prepend-inner-icon="mdi-account"
                placeholder="Leave empty to keep current name"
                class="input-field"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.email"
                label="Email Address"
                variant="outlined"
                :rules="[rules.email]"
                prepend-inner-icon="mdi-email"
                placeholder="Leave empty to keep current email"
                class="input-field"
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
          @click="saveProfile"
          :loading="isLoading"
          class="modal-button"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfileEdit } from '~/composables/useProfileEdit';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const {
  editFormValid,
  isLoading,
  editFormRef,
  editForm,
  rules,
  saveProfile: saveProfileAction
} = useProfileEdit();

// Computed property for v-model binding
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Close modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Save profile and close modal
const saveProfile = async () => {
  try {
    const result = await saveProfileAction();
    
    if (result.success) {
      closeModal();
    } else {
      // Error is already shown via notification system
      // Don't close modal on error, let user fix the issue
    }
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Failed to save profile:', error.message);
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
