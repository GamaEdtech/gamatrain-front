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

    <template #[`item.id`]>
      <div class="d-flex align-center justify-start">
        <v-skeleton-loader
          width="48"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.downloaderUserId`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="92"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.reason`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="110"
          height="28"
          class="rounded-pill"
        />
      </div>
    </template>

    <template #[`item.source`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="110"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.contentType`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="90"
          height="28"
          class="rounded-pill"
        />
      </div>
    </template>

    <template #[`item.externalContentId`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="70"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.externalFileType`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="80"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.externalExtraId`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="64"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.points`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="60"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.commissionPercent`]>
      <div class="d-flex align-center justify-center">
        <v-skeleton-loader
          width="70"
          height="20"
          class="rounded-lg"
        />
      </div>
    </template>

    <template #[`item.amountUsd`]>
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
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Downloader ID', key: 'downloaderUserId', sortable: false, width: '14vw' },
  { title: 'Reason', key: 'reason', sortable: false, width: '16vw' },
  { title: 'Source', key: 'source', sortable: false, width: '16vw' },
  { title: 'Content Type', key: 'contentType', sortable: false, width: '16vw' },
  { title: 'Content ID', key: 'externalContentId', sortable: false, width: '14vw' },
  { title: 'File Type', key: 'externalFileType', sortable: false, width: '14vw' },
  { title: 'Extra ID', key: 'externalExtraId', sortable: false, width: '12vw' },
  { title: 'Points', key: 'points', sortable: false, width: '10vw' },
  { title: 'Commission', key: 'commissionPercent', sortable: false, width: '14vw' },
  { title: 'Amount USD', key: 'amountUsd', sortable: false, width: '14vw' },
  { title: 'Created At', key: 'creationDate', sortable: false, width: '18vw' },
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
</style>
