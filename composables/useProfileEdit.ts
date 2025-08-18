import { ref, reactive } from 'vue';
import { useUserStore } from '~/stores/user';
import { usersApi } from '~/api/users';
import { useProfileErrorHandler } from '~/composables/errors/useProfileErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { UserUpdateRequest } from '~/types/api';

export function useProfileEdit() {
  const userStore = useUserStore();
  const { handleProfileUpdateError, clearError } = useProfileErrorHandler();
  const { showSuccess, showError } = useNotifications();
  
  // Edit modal state
  const editModalOpen = ref(false);
  const editFormValid = ref(false);
  const isLoading = ref(false);
  const editFormRef = ref();
  
  const editForm = reactive({
    name: '',
    email: ''
  });

  // Form validation rules
  const rules = {
    minLength: (value: string) => !value || value.length >= 2 || 'Minimum 2 characters required',
    email: (value: string) => {
      if (!value) return true; // Allow empty email
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'Please enter a valid email address';
    }
  };

  // Open edit modal
  const openEditModal = () => {
    editForm.name = userStore.user?.name || '';
    editForm.email = userStore.user?.email || '';
    clearError(); // Clear any previous errors
    editModalOpen.value = true;
  };

  // Close edit modal
  const closeEditModal = () => {
    editModalOpen.value = false;
    editForm.name = '';
    editForm.email = '';
    clearError(); // Clear errors when closing modal
  };

  // Save profile changes
  const saveProfile = async (): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    
    try {
      // Only include fields that have been changed
      const updateData: UserUpdateRequest = {};
      
      if (editForm.name && editForm.name !== userStore.user?.name) {
        updateData.name = editForm.name;
      }
      
      if (editForm.email && editForm.email !== userStore.user?.email) {
        updateData.email = editForm.email;
      }
      
      // If no changes, just close the modal
      if (Object.keys(updateData).length === 0) {
        closeEditModal();
        return { success: true };
      }
      
      // Use the proper API layer
      const response = await usersApi.updateUser(userStore.user!.id, updateData);
      
      if (response.success && response.data) {
        // Update user store with new data
        if (userStore.user) {
          if (updateData.name) userStore.user.name = updateData.name;
          if (updateData.email) userStore.user.email = updateData.email;
          // Update the timestamp from the API response
          if (response.data.updated_at) {
            userStore.user.updated_at = response.data.updated_at;
          }
        }
        
        // Show success notification
        showSuccess('Profile Updated', 'Your profile has been updated successfully');
        
        // Close modal
        closeEditModal();
        return { success: true };
      } else {
        // Return error result like auth store does
        const errorMessage = handleProfileUpdateError(response.error);
        
        // Show error notification
        showError('Profile Update Failed', errorMessage);
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    editModalOpen,
    editFormValid,
    isLoading,
    editFormRef,
    editForm,
    
    // Validation
    rules,
    
    // Actions
    openEditModal,
    closeEditModal,
    saveProfile
  };
}
