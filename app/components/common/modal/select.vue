<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-6"
  >
    <div class="w-100 d-flex align-center justify-end">
      <span
        v-if="hasSearch"
        class="text-h5 text-grey400"
      >result</span>
      <span
        v-if="hasSearch"
        class="text-h4 text-green font-weight-bold"
      >{{
        filteredItems.length
      }}</span>
    </div>
    <div
      v-if="hasSearch"
      class="w-100 pl-2 pr-2 mt-6"
    >
      <v-text-field
        v-model="searchText"
        :label="`Search ${title}`"
        prepend-inner-icon="md:search"
        glow
        variant="outlined"
        color="primary"
        icon-color="primary"
        density="compact"
        rounded="xl"
      >
        <template #append-inner>
          <v-btn
            class="mr-n3"
            color="primary"
            width="70"
            height="30"
            rounded="xl"
          >
            Search
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <v-list
      v-if="!loadingItems && !loadingValue"
      max-height="320"
    >
      <v-list-item
        v-for="item in filteredItems"
        :key="item.title"
        :value="item.title"
        :active="item.id == selectedItem?.id"
        color="primary"
        @click="changeSelectedItem(item)"
      >
        <template #prepend>
          <v-avatar
            v-if="item.icon"
            size="34"
          >
            <v-img :src="`/images/boards/${item.icon}.svg`" />
          </v-avatar>
          <span
            v-else-if="item.contentIcon"
            :class="`${item.contentIcon} size-icon`"
            :style="{ color: item.color }"
          />
        </template>
        <v-list-item-title class="text-h5">
          <HighlightedText
            :text="item.title"
            :search-text="searchText"
          />
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <div
      v-if="loadingItems || loadingValue"
      class="text-center pt-8"
    >
      <v-progress-circular
        indeterminate
        :width="3"
        color="primary"
      />
    </div>

    <v-alert
      v-if="searchText && filteredItems.length === 0 && !loadingItems && !loadingValue"
      type="info"
      color="primary"
      density="compact"
      class="mb-4"
      variant="tonal"
    >
      No {{ title }} found matching "{{ searchText }}". Try a different
      search term.
    </v-alert>
    <v-alert
      v-if="
        searchText.length == 0 && filteredItems.length === 0 && !loadingItems && !loadingValue
      "
      type="info"
      color="primary"
      density="compact"
      class="mb-4"
      variant="tonal"
    >
      No {{ title }} found.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'

interface IItemModalSelect {
  id: string
  title: string
  icon?: string
  contentIcon?: string
  color?: string
}

interface IModalSelect {
  title: string
  items: IItemModalSelect[]
  selectedItem: IItemModalSelect
  loadingItems: boolean
  loadingValue: boolean
  hasSearch: boolean
}

// HighlightedText component for safe text highlighting
const HighlightedText = defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    searchText: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const parts = computed(() => {
      if (!props.searchText) return [{ text: props.text, highlight: false }]

      const regex = new RegExp(`(${props.searchText})`, 'gi')
      const segments = props.text.split(regex)

      return segments.map(segment => ({
        text: segment,
        highlight: segment.toLowerCase() === props.searchText.toLowerCase(),
      }))
    })

    return () =>
      h(
        'span',
        parts.value.map(part =>
          h(
            'span',
            {
              style: part.highlight
                ? 'background-color: #FFB600; color: white;'
                : '',
            },
            part.text,
          ),
        ),
      )
  },
})

const props = defineProps<IModalSelect>()

const emit = defineEmits(['changeSelectedItem'])

// Start Section Search Item In List
const searchText = ref('')
const filteredItems = computed(() => {
  if (!searchText.value) return props.items
  return props.items.filter(item =>
    item.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})
const _highlightSearchText = (text: string) => {
  if (!searchText.value) return text
  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
// End Section Search Item In List

const changeSelectedItem = (item: IItemModalSelect) => {
  emit('changeSelectedItem', item)
}
</script>

<style scoped>
.size-icon {
  font-size: 24px;
  margin-right: 12px;
}
</style>
