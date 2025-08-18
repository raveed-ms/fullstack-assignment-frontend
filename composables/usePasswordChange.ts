import { ref, reactive } from 'vue';
import { useUserStore } from '~/stores/user';
import { usersApi } from '~/api/users';
import { useProfileErrorHandler } from '~/composables/errors/useProfileErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { UserUpdateRequest } from '~/types/api';

export function usePasswordChange() {
  const userStore = useUserStore();
  const { handleProfileUpdateError, clearError } = useProfileErrorHandler();
  const { showSuccess, showError } = useNotifications();
  
  // Password change modal state
  const passwordModalOpen = ref(false);
  const passwordFormValid = ref(false);
  const isLoading = ref(false);
  const passwordFormRef = ref();
  
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password visibility states
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);

  // Form validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    minLength: (value: string) => value.length >= 6 || 'Minimum 6 characters required',
    passwordMatch: (value: string) => {
      if (!value) return 'Please confirm your password';
      return value === passwordForm.newPassword || 'Passwords do not match';
    }
  };

  // Open password change modal
  const openPasswordModal = () => {
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    clearError(); // Clear any previous errors
    passwordModalOpen.value = true;
  };

  // Close password change modal
  const closePasswordModal = () => {
    passwordModalOpen.value = false;
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    showCurrentPassword.value = false;
    showNewPassword.value = false;
    showConfirmPassword.value = false;
    clearError(); // Clear errors when closing modal
  };

  // Toggle password visibility functions
  const toggleCurrentPasswordVisibility = () => {
    showCurrentPassword.value = !showCurrentPassword.value;
  };

  const toggleNewPasswordVisibility = () => {
    showNewPassword.value = !showNewPassword.value;
  };

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  // Change password
  const changePassword = async (): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    
    try {
      // Validate form
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        return { 
          success: false, 
          error: 'All fields are required' 
        };
      }

      if (passwordForm.newPassword.length < 6) {
        return { 
          success: false, 
          error: 'New password must be at least 6 characters long' 
        };
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        return { 
          success: false, 
          error: 'New passwords do not match' 
        };
      }

      // Prepare update data
      const updateData: UserUpdateRequest = {
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.newPassword
      };
      
      // Use the proper API layer
      const response = await usersApi.updateUser(userStore.user!.id, updateData);
      
      if (response.success && response.data) {
        // Show success notification
        showSuccess('Password Changed', 'Your password has been updated successfully');
        
        // Close modal
        closePasswordModal();
        return { success: true };
      } else {
        // Return error result like auth store does
        const errorMessage = handleProfileUpdateError(response.error);
        
        // Show error notification
        showError('Password Change Failed', errorMessage);
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    passwordModalOpen,
    passwordFormValid,
    isLoading,
    passwordFormRef,
    passwordForm,
    
    // Password visibility
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    
    // Validation
    rules,
    
    // Actions
    openPasswordModal,
    closePasswordModal,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    changePassword
  };
}
