<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      {{ title }}
    </span>
    <v-text-field
      v-model="searchText"
      :disabled="disabled"
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
    <div
      class="container-items bg-white rounded-lg overflow-y-auto w-100 pa-2 mt-3 d-flex flex-column"
      :class="{ 'items-disabled': disabled }"
    >
      <template v-if="loadingGetData || loadingValue">
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
      <div
        v-else-if="!filteredData.length"
        class="empty-state w-100 h-100 d-flex align-center justify-center text-h5 font-weight-medium text-grey500"
      >
        No {{ title }} found.
      </div>
      <template v-else>
        <v-checkbox
          v-for="item in filteredData"
          :key="item.id"
          :value="item.id"
          :disabled="disabled"
          hide-details
          dense
          color="primary"
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
          class="text-h5"
          :model-value="localChoices"
          @update:model-value="updateChoices"
        >
          <template #label>
            <span class="text-h5 font-weight-medium">{{
              item.title
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
interface IMultiChoiceCheckBoxList {
  data: {
    id: string | number
    title: string
  }[]
  title: string
  choices: number[]
  rules?: ((value: number[]) => true | string)[]
  loadingValue?: boolean
  loadingGetData?: boolean
  disabled?: boolean
}

const props = defineProps<IMultiChoiceCheckBoxList>()
const emit = defineEmits(['update:choices'])
const localChoices = ref<number[]>([...props.choices])
const errorMessage = ref('')
const isTouched = ref(false)

watch(
  () => props.choices,
  (val) => {
    localChoices.value = [...val]
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
    const result = rule(localChoices.value)

    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = ''
  return true
}
const updateChoices = (val: number[] | null) => {
  if (props.disabled) return

  localChoices.value = val ?? []
  emit('update:choices', val ?? [])

  validate()
  isTouched.value = true
}

const searchText = ref('')

const filteredData = computed(() => {
  if (!searchText.value) return props.data

  return props.data.filter(item =>
    item.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})
</script>

<style scoped>
.container-items{
  min-height : 150px;
  max-height : 150px;
}

.items-disabled{
  opacity: 0.55;
  pointer-events: none;
}

.empty-state{
  min-height: 100%;
  text-align: center;
}
</style>
