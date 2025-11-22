<template>
  <div class="w-100">
    <v-dialog
      v-model="dialogModel"
      :persistent="false"
      max-width="600"
    >
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h4">
            Subject
          </v-card-title>
          <v-card-subtitle
            class="ma-0 pa-4 ga-3 d-flex align-center justify-space-between"
          >
            <div class="text-h6">
              Search result
            </div>
            <div class="search-count">
              {{ filteredItems.length }}
            </div>
          </v-card-subtitle>
        </div>
        <v-card-text>
          <div class="mb-4 d-flex align-center">
            <v-text-field
              ref="searchField"
              v-model="searchTerm"
              label="Search Subject"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              hide-details
              :loading="isLoading"
              color="#ffb600"
              clearable
            />
            <v-btn
              class="ml-2"
              base-color="#ffb600"
              rounded
              :loading="isLoading"
            >
              Search
            </v-btn>
          </div>

          <v-alert
            v-if="searchTerm && filteredItems.length === 0 && !isLoading"
            type="info"
            density="compact"
            class="mb-4"
          >
            No subjects found matching "{{ searchTerm }}". Try a different
            search term.
          </v-alert>
          <div class="item-list-container">
            <v-list v-if="filteredItems.length > 0">
              <v-list-item
                v-for="item in filteredItems"
                :key="item.id"
                class="item-list"
                :value="item.id"
                @click="selectItem(item)"
              >
                <template #prepend>
                  <v-avatar
                    color="#F2F4F7"
                    size="40"
                  >
                    <span class="grade-circle-text">{{
                      getItemInitialWordTitle(item)
                    }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title
                  v-if="!searchTerm"
                  class="text-h6"
                >
                  {{
                    item.title
                  }}
                </v-list-item-title>
                <div
                  v-else
                  class="v-list-item-title text-h6"
                  v-html="highlightMatch(item.title)"
                />
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:showDialog', 'changeSelectedItem'])

const searchTerm = ref('')
const selectedItem = ref(null)

const filteredItems = computed(() => {
  if (!searchTerm.value) return props.items
  const searchLower = searchTerm.value.toLowerCase()
  return props.items.filter((item) => {
    const itemName = (item.title || '').toLowerCase()
    return itemName.includes(searchLower)
  })
})
const isLoading = ref(false)

const highlightMatch = (text) => {
  if (!searchTerm.value || !text) return text
  const escapedSearchTerm = searchTerm.value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')
  return text.replace(regex, '<span class="highlighted-text">$1</span>')
}

const selectItem = (item) => {
  const itemId = item.id !== undefined ? String(item.id) : ''
  const itemTitle = item.title || `Grade ${itemId}`
  selectedItem.value = {
    id: itemId,
    title: itemTitle,
  }
  emit('update:showDialog', false)
  emit('changeSelectedItem', selectedItem.value)
}
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const getItemInitialWordTitle = (item) => {
  const title = item.title || ''
  if (!title) return 'S'

  const match = title.match(/[A-Za-z0-9]/)
  return match ? match[0].toUpperCase() : 'S'
}
</script>

<style scoped>
.search-count {
  color: #57b947;
  font-weight: 600;
  font-size: 18px;
}
.item-list-container {
  max-height: 400px;
  overflow-y: auto;
  margin-right: -16px;
  padding-right: 16px;
}

.item-list {
  transition: background-color 0.2s ease;
  border-radius: 4px;
  margin-bottom: 30px;
}

.item-list:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.grade-circle-text {
  font-size: 16px;
  font-weight: 600;
  color: #344054;
}
/* Highlighted text styling */
:deep(.highlighted-text) {
  background-color: rgba(255, 179, 0, 0.3);
  font-weight: bold;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
