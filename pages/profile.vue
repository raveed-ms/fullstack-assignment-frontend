<template>
  <div class="profile-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="fill-height bg-grey-lighten-4 pa-6 ma-0" style="min-height: 100vh;">
          <v-row class="ma-0">
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-card class="pa-6" elevation="4">
                <v-card-text>
                  <!-- Profile Header -->
                  <div class="profile-header mb-6">
                    <div class="d-flex align-center mb-4">
                      <v-avatar color="primary" size="80" class="me-4">
                        <v-icon color="white" size="x-large">mdi-account-circle</v-icon>
                      </v-avatar>
                      <div>
                        <h2 class="text-h5 mb-2">{{ userStore.user?.name || 'Guest User' }}</h2>
                        <v-chip
                          v-if="userStore.user"
                          :color="getRoleColor(userStore.user.role)"
                          size="small"
                          variant="flat"
                        >
                          {{ userStore.user.role.toUpperCase() }}
                        </v-chip>
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-6"></v-divider>

                  <!-- Profile Information -->
                  <div class="profile-info">
                    <h3 class="text-h6 mb-4">Account Information</h3>
                    
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Full Name"
                          :model-value="userStore.user?.name || ''"
                          variant="outlined"
                          readonly
                          prepend-inner-icon="mdi-account"
                          class="mb-4 input-field"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Email Address"
                          :model-value="userStore.user?.email || ''"
                          variant="outlined"
                          readonly
                          prepend-inner-icon="mdi-email"
                          class="mb-4 input-field"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="User Role"
                          :model-value="userStore.user?.role ? userStore.user.role.toUpperCase() : ''"
                          variant="outlined"
                          readonly
                          class="mb-4 input-field"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Member Since"
                          :model-value="formatDate(userStore.user?.created_at)"
                          variant="outlined"
                          readonly
                          prepend-inner-icon="mdi-calendar"
                          class="mb-4 input-field"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Last Updated"
                          :model-value="formatDate(userStore.user?.updated_at)"
                          variant="outlined"
                          readonly
                          prepend-inner-icon="mdi-update"
                          class="mb-4 input-field"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>

                  <v-divider class="my-6"></v-divider>

                  <!-- Actions -->
                  <div class="profile-actions">
                    <h3 class="text-h6 mb-4">Actions</h3>
                    
                    <div class="d-flex flex-column">
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-edit"
                        size="large"
                        variant="elevated"
                        block
                        class="mb-4 profile-button"
                        @click="openEditModal"
                      >
                        Edit Profile
                      </v-btn>
                      
                      <v-btn
                        color="secondary"
                        prepend-icon="mdi-key"
                        size="large"
                        variant="outlined"
                        block
                        class="profile-button"
                        @click="openPasswordModal"
                      >
                        Change Password
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="profile-fallback">
          <p>Loading profile...</p>
        </div>
      </template>
    </ClientOnly>

    <!-- Edit Profile Modal -->
    <EditProfileModal v-model="editModalOpen" />
    
    <!-- Change Password Modal -->
    <ChangePasswordModal v-model="passwordModalOpen" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useProfileEdit } from '~/composables/useProfileEdit';
import { usePasswordChange } from '~/composables/usePasswordChange';
import { useUserRole } from '~/composables/useUserRole';
import { useDateFormat } from '~/composables/useDateFormat';
import EditProfileModal from '~/components/profile/EditProfileModal.vue';
import ChangePasswordModal from '~/components/profile/ChangePasswordModal.vue';

// Define page meta for auth layout and middleware
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

const userStore = useUserStore();
const { editModalOpen, openEditModal } = useProfileEdit();
const { passwordModalOpen, openPasswordModal } = usePasswordChange();
const { getRoleColor } = useUserRole();
const { formatDate } = useDateFormat();
</script>

<style scoped>
.profile-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.profile-header {
  text-align: center;
}

.profile-info {
  margin-bottom: 2rem;
}

.profile-actions {
  margin-top: 2rem;
}

.profile-fallback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}

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

/* Custom styles for profile buttons */
:deep(.profile-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-actions .d-flex {
    flex-direction: column;
  }
  
  .profile-actions .v-btn {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
