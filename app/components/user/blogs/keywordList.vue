<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      Keyword
    </span>
    <v-text-field
      v-model="inputText"
      rounded="xl"
      density="compact"
      placeholder="Keyword"
      variant="outlined"
      autocomplete="off"
      persistent-clear
      base-color="grey200"
      color="primary"
      active-color="primary"
      bg-color="white"
      class="w-100 mt-2"
      @keydown.enter.prevent="addKeywords"
    >
      <template #append-inner>
        <v-btn
          icon
          color="primary"
          size="x-small"
          flat
          rounded="circle"
          @click="addKeywords"
        >
          <v-icon
            size="x-large"
            icon="md:subdirectory_arrow_left"
            color="grey800"
          />
        </v-btn>
      </template>
    </v-text-field>
    <span class="text-h5 font-weight-medium text-grey400 mt-1">You can also use commas</span>
    <div
      v-if="loading"
      class="d-flex flex-wrap ga-1 mt-3"
    >
      <v-skeleton-loader
        v-for="i in 5"
        :key="i"
        width="80"
        height="32"
        class="rounded-pill"
      />
    </div>
    <div
      v-else
      class="d-flex flex-wrap ga-1 mt-3"
    >
      <v-chip
        v-for="keyword in localKeywords"
        :key="keyword"
        variant="flat"
        class="text-h5 pl-3 pr-3"
        color="grey800"
        closable
        @click:close="removeKeyword(keyword)"
      >
        <span class="text-grey25">{{ keyword }}</span>
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IKeywordList {
  keywords: string[]
  loading?: boolean
}

const props = withDefaults(defineProps<IKeywordList>(), {
  loading: false,
})
const emit = defineEmits(['update:keywords'])
const localKeywords = ref<string[]>([...props.keywords])

watch(
  () => props.keywords,
  (val) => {
    localKeywords.value = [...val]
  },
)

const inputText = ref('')

const addKeywords = () => {
  if (!inputText.value.trim()) return

  const newKeywords = inputText.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)

  const uniqueKeywords = newKeywords.filter(
    k => !localKeywords.value.includes(k),
  )

  if (uniqueKeywords.length) {
    localKeywords.value = [
      ...localKeywords.value,
      ...uniqueKeywords,
    ]

    emit('update:keywords', localKeywords.value)
  }

  inputText.value = ''
}

const removeKeyword = (keyword: string) => {
  localKeywords.value = localKeywords.value.filter(k => k !== keyword)
  emit('update:keywords', localKeywords.value)
}
</script>

<style scoped>
</style>
