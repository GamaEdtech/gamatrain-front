<template>
  <v-autocomplete
    v-if="render"
    v-model="selectedItem"
    class="locationField"
    :loading="loading"
    :items="items"
    color="primary"
    hide-details
    theme="light"
    variant="solo"
    item-title="display_name"
    item-value="location"
    :placeholder="props.placeholder"
    prepend-inner-icon="mdi-magnify"
    rounded
    density="comfortable"
    return-object
    @update:search="search = $event"
    @keydown="toggleSearch(true)"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          Type something to start
          <strong> searching </strong>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  label: String,
  solo: String,
  rounded: Boolean,
  placeholder: {
    type: String,
    default: 'Search anything ..',
  },
})
const emit = defineEmits(['locationSelected'])

const search = ref(null)
const selectedItem = ref(null)
const items = ref([])
const loading = ref(false)
const timer = ref(null)
const waitTime = 750
const searchToggle = ref(false)
const render = ref(true)

async function searchLocation(searchVal) {
  loading.value = true
  try {
    const searchLocation = await $fetch(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: {
          q: searchVal,
          format: 'json',
        },
        headers: {
          'Accept-Language': 'en;q=0.3',
        },
      },
    )
    items.value = []
    for (let i = 0; i < searchLocation.length; i++) {
      items.value[i] = {}
      items.value[i]['display_name']
        = searchLocation[i].display_name.substr(0, 38)
          + (searchLocation[i].display_name.length > 38 ? '...' : '')
      items.value[i]['location'] = [
        searchLocation[i].lat,
        searchLocation[i].lon,
      ]
    }
  }
  finally {
    loading.value = false
  }
}

function toggleSearch(val) {
  searchToggle.value = val
}

onMounted(() => {
  timer.value = setTimeout(() => {}, waitTime)
})

watch(search, (val) => {
  if (val && searchToggle.value) {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      if (val !== selectedItem.value) searchLocation(val)
    }, waitTime)
  }
})

watch(selectedItem, (val) => {
  if (val && searchToggle.value) emit('locationSelected', val.location)
})
</script>

<style>
.locationField {
  position: absolute;
  top: 1.6rem;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 200002 !important;
  max-width: 30rem;
}
</style>
