<template>
  <div class="w-100 pa-4 rounded-lg mt-12 box-question position-relative">
    <div class="lable-div position-absolute text-white text-h4 pa-2">
      Time To Test
    </div>
    <div
      v-if="loadingRandomTest"
      class="w-100 h-100 d-flex flex-column align-start justify-start ga-2"
    >
      <v-skeleton-loader
        width="300"
        height="30"
        class="w-100 rounded-pill"
      />

      <v-skeleton-loader
        width="150"
        height="20"
        class="mt-10 rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
    </div>
    <TestDetails
      v-else
      :content-data="randomTestContent"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiResult } from '~/interfaces/api'

interface RandomTestCodeDTO {
  code: string
}

interface IBoxRandomQuestion {
  lesson?: string
}
const props = defineProps<IBoxRandomQuestion>()

const randomTestContent = ref<Record<string, string> | undefined>(undefined)
const loadingRandomTest = ref(true)

const getRandomTestCode = async () => {
  if (props.lesson) {
    try {
      const response = await useApiService.get<ApiResult<RandomTestCodeDTO>>(
        `/api/v1/examTests/random?lesson=${props.lesson}`,
      )
      if (response.data?.code) {
        await getRandomTest(response.data.code)
      }
    }
    catch (error: unknown) {
      console.log('error', error)
    }
    finally {
      loadingRandomTest.value = false
    }
  }
}
const getRandomTest = async (code: string) => {
  try {
    const response = await useApiService.get<ApiResult<Record<string, string>>>(
      `/api/v1/examTests/${code}`,
    )
    if (response.data) {
      randomTestContent.value = response.data
    }
  }
  catch (error: unknown) {
    console.log('error', error)
  }
  finally {
    loadingRandomTest.value = false
  }
}

onMounted(async () => {
  await getRandomTestCode()
})
</script>

<style scoped>
.box-question {
  border: 1px solid #e1e2e3;
  min-height: 250px;
}
.lable-div {
  background-color: #000;
  top: -25px;
  border-radius: 8px 8px 0 0;
}
</style>
