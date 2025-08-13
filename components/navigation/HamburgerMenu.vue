<template>
  <div class="hamburger-menu">
    <!-- Hamburger Button (Always visible) -->
    <v-btn
      icon
      variant="text"
      size="large"
      class="hamburger-button"
      @click="toggleMenu"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      :model-value="isOpen"
      @update:model-value="handleDrawerUpdate"
      location="start"
      :temporary="true"
      :rail="false"
      :width="drawerWidth"
      class="nav-drawer"
    >
      <!-- Drawer Content Container -->
      <div class="drawer-content">
        <v-list class="nav-list">
          <NavItem
            v-for="item in filteredNavigationItems"
            :key="item.route"
            :label="item.label"
            :icon="item.icon"
            :route="item.route"
            :is-active="isRouteActive(item.route)"
            @click="() => handleNavClick(item)"
          />
        </v-list>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { useNavigation, type NavigationItem } from '~/composables/ui/useNavigation'
import NavItem from './NavItem.vue'

interface HamburgerMenuProps {
  isOpen: boolean
  drawerWidth?: number
}

const props = withDefaults(defineProps<HamburgerMenuProps>(), {
  isOpen: false,
  drawerWidth: 280
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'nav-click': [item: NavigationItem]
}>()

const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const { getFilteredNavigationItems, isRouteActive, updateCurrentRoute } = useNavigation()

// Computed properties
const filteredNavigationItems = computed(() => {
  return getFilteredNavigationItems(isAuthenticated.value, authStore.user?.role)
})

// Methods
const toggleMenu = () => {
  emit('update:isOpen', !props.isOpen)
}

const closeMenu = () => {
  emit('update:isOpen', false)
}

const handleDrawerUpdate = (value: boolean) => {
  emit('update:isOpen', value)
}

const handleNavClick = (item: NavigationItem) => {
  emit('nav-click', item)
  closeMenu()
}

// Watch for route changes to update current route
watch(() => route.fullPath, updateCurrentRoute, { immediate: true })
</script>

<style scoped>
.hamburger-menu {
  position: relative;
}

.hamburger-button {
  display: block;
  color: white !important;
}

.hamburger-button:hover {
  color: white !important;
}

.hamburger-button:active {
  color: white !important;
}

.nav-drawer {
  height: 100vh !important;
  min-height: 100vh !important;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
}

.nav-list {
  padding: 8px;
  flex: 1;
}
</style>
