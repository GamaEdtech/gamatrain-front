<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      Category
    </span>
    <v-text-field
      v-model="searchText"
      rounded="xl"
      density="compact"
      placeholder="Search"
      variant="outlined"
      autocomplete="off"
      persistent-clear
      base-color="grey200"
      color="primary"
      active-color="primary"
      bg-color="white"
      class="w-100 mt-2"
    />
    <div class="container-tag-list bg-white rounded-lg overflow-y-auto w-100 pa-2 mt-3 d-flex flex-column">
      <template v-if="loadingGetData">
        <div
          v-for="i in 10"
          :key="i"
          class="w-100 d-flex align-center ga-3 mb-2"
        >
          <v-skeleton-loader
            width="30"
            height="30"
            class="rounded-lg"
          />
          <v-skeleton-loader
            width="70"
            height="10"
            class="rounded-lg"
          />
        </div>
      </template>
      <template v-else>
        <v-checkbox
          v-for="tag in filteredData"
          :key="tag.id"
          :value="tag.id"
          hide-details
          dense
          color="primary"
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
          class="text-h5"
          :model-value="localCategories"
          @update:model-value="updateCategories"
        >
          <template #label>
            <span class="text-h5 font-weight-medium">{{
              tag.name
            }}</span>
          </template>
        </v-checkbox>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ITagList {
  categories: number[]
}

const props = defineProps<ITagList>()
const emit = defineEmits(['update:categories'])
const localCategories = ref<number[]>([...props.categories])

watch(
  () => props.categories,
  (val) => {
    localCategories.value = [...val]
  },
)

const updateCategories = (val: number[] | null) => {
  localCategories.value = val ?? []
  emit('update:categories', val ?? [])
}

const { loadingGetData, data, getData } = useTags()
const searchText = ref('')

onMounted(async () => {
  await getData('Post')
})

const filteredData = computed(() => {
  if (!searchText.value) return data.value

  return data.value.filter(tag =>
    tag.name.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})
</script>

<style scoped>
.container-tag-list{
  min-height : 150px;
  max-height : 150px;
}
</style>
