<template>
  <v-dialog
    v-model="dialogModel"
    max-width="400"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row>
        <v-col cols="6">
          <span class="text-h3 text-grey700">{{ titleModal }}</span>
        </v-col>
        <v-col
          cols="6"
          class="d-flex align-center justify-end ga-2"
        >
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
          <v-icon
            class="ml-4"
            size="x-large"
            color="grey300"
            @click="closeModal"
          >
            md:cancel
          </v-icon>
        </v-col>
      </v-row>
      <v-row
        v-if="hasSearch"
        class="pl-2 pr-2 mt-6"
      >
        <v-text-field
          v-model="searchText"
          :label="`Search ${titleModal}`"
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
      </v-row>
      <v-list
        v-if="!isLoading"
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
              v-if="item.img"
              size="34"
            >
              <v-img :src="item.img" />
            </v-avatar>
            <span
              v-if="item.icon"
              :class="`${item.icon} size-icon`"
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
        v-if="isLoading"
        class="text-center pt-8"
      >
        <v-progress-circular
          indeterminate
          :width="3"
          color="primary"
        />
      </div>

      <v-alert
        v-if="searchText && filteredItems.length === 0 && !isLoading"
        type="info"
        color="primary"
        density="compact"
        class="mb-4"
        variant="tonal"
      >
        No {{ titleModal }} found matching "{{ searchText }}". Try a different
        search term.
      </v-alert>
      <v-alert
        v-if="
          searchText.length == 0 && filteredItems.length === 0 && !isLoading
        "
        type="info"
        color="primary"
        density="compact"
        class="mb-4"
        variant="tonal"
      >
        No {{ titleModal }} found.
      </v-alert>
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed, defineComponent, h } from 'vue'

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

const { mdAndUp } = useDisplay()

const props = defineProps({
  titleModal: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  showDialog: {
    type: Boolean,
    default: false,
  },
  selectedItem: {
    type: Object,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:showDialog', 'changeSelectedItem'])

// Start Section Search Item In List
const searchText = ref('')
const filteredItems = computed(() => {
  if (!searchText.value) return props.items
  return props.items.filter(item =>
    item.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})
const _highlightSearchText = (text) => {
  if (!searchText.value) return text
  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
// End Section Search Item In List

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}
// End Section Handle Status Modal

const changeSelectedItem = (item) => {
  emit('changeSelectedItem', item)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event) => {
  event.stopPropagation()
}
</script>

<style scoped>
.size-icon {
  font-size: 24px;
  margin-right: 12px;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
