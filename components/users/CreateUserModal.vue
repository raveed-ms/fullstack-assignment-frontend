<template>
  <v-dialog
    v-model="dialogValue"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-account-plus</v-icon>
        Create New User
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="createUser">
          <v-row>
            <!-- Name Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.name"
                label="Name"
                variant="outlined"
                :rules="[rules.required, rules.name]"
                required
                prepend-inner-icon="mdi-account"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Email Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.email"
                label="Email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                required
                prepend-inner-icon="mdi-email"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Password Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required, rules.password]"
                required
                prepend-inner-icon="mdi-lock"
                clearable
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Footer -->
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="closeModal"
          :disabled="isCreating"
          class="me-3"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="createUser"
          :loading="isCreating"
          :disabled="!hasValidData"
        >
          Create User
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useNotifications } from '~/composables/ui/useNotifications';
import { usersApi } from '~/api/users';

// Props
interface Props {
  modelValue: boolean;
}

// Emits
interface Emits {
  (e: 'update:model-value', value: boolean): void;
  (e: 'user-created', user: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const userStore = useUserStore();
const { showSuccess, showError } = useNotifications();

// Reactive data
const form = ref<any>(null);
const isCreating = ref(false);
const showPassword = ref(false);

// Form data
const newUser = ref({
  name: '',
  email: '',
  password: ''
});

// Validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required',
  name: (value: string) => {
    if (!value) return true;
    if (value.length < 3) return 'Name must be at least 3 characters';
    if (value.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(value)) return 'Name can only contain letters, numbers, underscores, hyphens, and spaces';
    return true;
  },
  email: (value: string) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return true;
  },
  password: (value: string) => {
    if (!value) return true;
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 50) return 'Password must be less than 50 characters';
    return true;
  }
};

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
});

const hasValidData = computed(() => {
  return newUser.value.name.trim() !== '' &&
         newUser.value.email.trim() !== '' &&
         newUser.value.password.trim() !== '';
});

// Watch for modal close to reset form
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    resetForm();
    isCreating.value = false;
  }
});

// Methods
const closeModal = () => {
  dialogValue.value = false;
  resetForm();
  isCreating.value = false;
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
  }
  newUser.value = {
    name: '',
    email: '',
    password: ''
  };
  showPassword.value = false;
};

const createUser = async () => {
  if (!form.value?.validate()) return;
  
  isCreating.value = true;
  
  try {
    const response = await usersApi.createUser({
      name: newUser.value.name.trim(),
      email: newUser.value.email.trim(),
      password: newUser.value.password
    });

    if (response.success && response.data) {
      showSuccess('User created successfully!');
      emit('user-created', response.data);
      closeModal();
    } else {
      const errorMessage = typeof response.error === 'string' ? response.error : 'Failed to create user';
      throw new Error(errorMessage);
    }
    
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle specific error cases
    if (error.message?.includes('username already exists')) {
      showError('Username already exists. Please choose a different username.');
    } else if (error.message?.includes('email already exists')) {
      showError('Email already exists. Please use a different email address.');
    } else if (error.message?.includes('Validation failed')) {
      showError('Please check your input and try again.');
    } else {
      showError('Failed to create user. Please try again.');
    }
  } finally {
    isCreating.value = false;
  }
};
</script>

<style scoped>
.v-divider {
  margin: 16px 0;
}
</style>
