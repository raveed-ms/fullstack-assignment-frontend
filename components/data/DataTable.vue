<template>
  <div class="data-table">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :server-items-length="totalItems"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :search="search"
      :class="tableClass"
      @update:options="handleOptionsUpdate"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
interface DataTableProps {
  headers: any[]
  items: any[]
  loading?: boolean
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  totalItems?: number
  sortBy?: any[]
  sortDesc?: boolean[]
  search?: string
  tableClass?: string
}

const props = withDefaults(defineProps<DataTableProps>(), {
  loading: false,
  itemsPerPage: 10,
  itemsPerPageOptions: () => [5, 10, 25, 50],
  totalItems: 0,
  sortBy: () => [],
  sortDesc: () => [],
  search: '',
  tableClass: ''
})

const emit = defineEmits<{
  'update:options': [options: any]
}>()

const handleOptionsUpdate = (options: any) => {
  emit('update:options', options)
}
</script>

<style scoped>
.data-table {
  width: 100%;
}

.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}
</style> 