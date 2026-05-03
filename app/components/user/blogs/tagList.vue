<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      <v-badge
        floating
        location="top right"
        color="transparent"
        overlap
      >
        <template #badge>
          <v-icon
            size="large"
            color="error"
          >
            md:star
          </v-icon>
        </template>
        <span>Category</span>
      </v-badge>
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
    <div
      v-if="errorMessage"
      class="text-error text-subtitle-1 mt-1"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface ITagList {
  categories: number[]
  rules?: ((value: number[]) => true | string)[]
}

const props = defineProps<ITagList>()
const emit = defineEmits(['update:categories'])
const localCategories = ref<number[]>([...props.categories])
const errorMessage = ref('')
const isTouched = ref(false)

watch(
  () => props.categories,
  (val) => {
    localCategories.value = [...val]
  },
)

const validate = (force = false) => {
  if (!isTouched.value && !force) {
    errorMessage.value = ''
    return true
  }

  if (!props.rules?.length) {
    errorMessage.value = ''
    return true
  }

  for (const rule of props.rules) {
    const result = rule(localCategories.value)

    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = ''
  return true
}
const updateCategories = (val: number[] | null) => {
  localCategories.value = val ?? []
  emit('update:categories', val ?? [])

  validate()
  isTouched.value = true
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
