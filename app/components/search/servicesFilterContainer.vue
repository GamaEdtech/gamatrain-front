<template>
  <section
    id="search-service-filters"
    class="services-filter-container"
    aria-label="Filters for the selected service"
  >
    <slot />
  </section>
</template>

<style scoped>
.services-filter-container {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-width: 0;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20px 16px;
  border: 0;
  background: transparent;
}

.services-filter-container :deep(.search-filter-selected) {
  background-color: rgb(var(--v-theme-surfaceTertiary)) !important;
}
</style>
