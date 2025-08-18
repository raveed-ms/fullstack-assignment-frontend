<template>
  <div>
    <ClientOnly>
      <v-app>
        <v-main>
          <slot />
        </v-main>
      </v-app>
      
      <template #fallback>
        <div class="loading-fallback">
          <p>Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.loading-fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
}
</style>
