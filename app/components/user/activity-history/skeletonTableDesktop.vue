<template>
  <v-data-table
    :headers="headers"
    :items="skeletonItems"
    items-per-page="10"
    class="elevation-1 set-height-table"
    fixed-header
    hide-default-footer
  >
    <template #headers="{ columns }">
      <tr>
        <th
          v-for="(column, index) in columns"
          :key="index"
          :class="`bg-grey100 text-grey700 text-h5 font-weight-medium pa-2 text-center
               ${index == 0 ? `text-start` : `th-min-width`}`"
        >
          {{ column.title }}
        </th>
      </tr>
    </template>

    <template #[`item.description`]>
      <div class="d-flex align-center justify-start">
        <v-skeleton-loader
          width="150"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.points`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="100"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>
    <template #[`item.isDebit`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="80"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.creationDate`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="120"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
const headers = [
  { title: 'Description', key: 'description', sortable: false, width: '35vw' },
  { title: 'Amount', key: 'points', sortable: false, width: '20vw' },
  {
    title: 'State',
    key: 'isDebit',
    sortable: false,
    width: '10vw',
  },
  { title: 'Date', key: 'creationDate', sortable: false, width: '35vw' },
]
const skeletonItems = Array.from({ length: 10 }).map((_, i) => ({ id: i }))
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
</style>
