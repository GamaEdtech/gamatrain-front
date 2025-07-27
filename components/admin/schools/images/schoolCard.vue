<script setup>

defineProps({
    imageSrc: String,
    creationUser: String,
    creationDate: String,
    status: String
})

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

function statusColor(status) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'green'
    case 'pending':
      return 'orange'
    case 'inactive':
      return 'red'
    default:
      return 'grey'
  }
}
</script>
<template>
    <v-card elevation="3" width="300" height="300" class="rounded-lg pa-4 d-flex flex-column justify-space-between">
        <v-img
        :src="imageSrc"
        height="200"
        width="300"
        cover
        class="rounded-t"
        ></v-img>

        <div class="d-flex justify-space-between">
            <v-card-text class="pa-0 d-flex flex-column justify-end">
            <div class="text-subtitle-1 font-weight-medium mb-1">
                {{ creationUser }}
            </div>
            <div class="text-caption text-grey">
                {{ formatDate(creationDate) }}
            </div>
            </v-card-text>
    
            <v-card-actions class="pa-0 d-flex flex-column justify-end">
            <v-chip
                :color="statusColor(status)"
                variant="flat"
                size="small"
                class="text-white"
            >
                {{ status }}
            </v-chip>
            </v-card-actions>

        </div>
    </v-card>
</template>