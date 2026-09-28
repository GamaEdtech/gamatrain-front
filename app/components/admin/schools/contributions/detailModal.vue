<template>
  <div class="w-100 d-flex flex-wrap pa-4">
    <span class="w-100 text-h4 font-weight-bold text-grey700 mb-4">{{ oldDataFormated && oldDataFormated.length > 0 ? `New Value`:`New School` }}</span>

    <template v-if="loading">
      <div
        v-for="i in 10"
        :key="i"
        class="detail-item"
      >
        <v-skeleton-loader
          width="80"
          height="16"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="60"
          height="16"
          class="rounded-pill"
        />
      </div>
    </template>

    <template v-else>
      <div
        v-for="field in newDataFormated"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>

        <span
          v-if="!field.type"
          class="value"
        >
          {{ field.value }}
        </span>

        <div
          v-else-if="field.type === 'tags'"
          class="d-flex flex-wrap ga-2 w-100"
        >
          <div
            v-for="(tag, index) in field.value"
            :key="index"
            class="bg-primary-gray-800 text-white rounded-lg pa-3 d-flex align-center justify-center"
          >
            <v-icon
              size="20"
              color="white"
            >
              md:{{ tag.icon }}
            </v-icon>
          </div>
        </div>

        <div
          v-else-if="field.type === 'boards'"
          class="d-flex flex-wrap ga-2 w-100"
        >
          <v-btn
            v-for="(board, index) in field.value"
            :key="index"
            flat
            color="grey700"
            height="38"
            rounded="lg"
          >
            <span class="font-weight-bold text-h5 text-grey300">{{
              board.title
            }}</span>
          </v-btn>
        </div>
      </div>

      <div
        v-if="schoolDetailData.newValues && schoolDetailData.newValues.latitude != null && schoolDetailData.newValues.longitude != null"
        class="detail-item"
      >
        <a
          class="text-h6 text-info font-weight-bold"
          :href="`https://www.google.com/maps?q=${schoolDetailData.newValues.latitude},${schoolDetailData.newValues.longitude}`"
          target="blank"
        >📍 View on Google Maps</a>
      </div>
    </template>

    <span
      v-if="!loading && oldDataFormated.length > 0"
      class="w-100 text-h4 font-weight-bold text-grey700 my-4"
    >Old Value</span>

    <template v-if="loading">
      <div
        v-for="i in 10"
        :key="i"
        class="detail-item"
      >
        <v-skeleton-loader
          width="80"
          height="16"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="60"
          height="16"
          class="rounded-pill"
        />
      </div>
    </template>

    <div
      v-if="loading"
      class="d-flex flex-column ga-2"
    >
      <v-skeleton-loader
        width="80"
        height="16"
        class="rounded-pill"
      />
      <div class="d-flex ga-2">
        <v-skeleton-loader
          v-for="index in 5"
          :key="index"
          height="36"
          width="36"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="d-flex flex-column ga-2 mt-2"
    >
      <v-skeleton-loader
        width="80"
        height="16"
        class="rounded-pill"
      />
      <div class="d-flex ga-2 flex-wrap w-100">
        <v-skeleton-loader
          v-for="index in 5"
          :key="index"
          height="30"
          width="80"
          class="rounded-lg"
        />
      </div>
    </div>

    <template v-else>
      <div
        v-for="field in oldDataFormated"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full, 'flex-column': field.type }"
      >
        <span class="label">{{ field.label }}</span>

        <span
          v-if="!field.type"
          class="value"
        >
          {{ field.value }}
        </span>

        <div
          v-else-if="field.type === 'tags'"
          class="d-flex flex-wrap ga-2 w-100"
        >
          <div
            v-for="(tag, index) in field.value"
            :key="index"
            class="bg-primary-gray-800 text-white rounded-lg pa-3 d-flex align-center justify-center"
          >
            <v-icon
              size="20"
              color="white"
            >
              md:{{ tag.icon }}
            </v-icon>
          </div>
        </div>

        <div
          v-else-if="field.type === 'boards'"
          class="d-flex flex-wrap ga-2 w-100"
        >
          <v-btn
            v-for="(board, index) in field.value"
            :key="index"
            flat
            color="grey700"
            height="38"
            rounded="lg"
          >
            <span class="font-weight-bold text-h5 text-grey300">{{
              board.title
            }}</span>
          </v-btn>
        </div>

        <div
          v-else-if="field.type === 'image'"
          class="d-flex w-100"
        >
          <img
            :src="field.value"
            width="100"
            height="80"
            class="rounded-lg"
            alt="School Image"
          >
        </div>
      </div>

      <div
        v-if="schoolDetailData.oldValues && schoolDetailData.oldValues.latitude != null && schoolDetailData.oldValues.longitude != null"
        class="detail-item"
      >
        <a
          class="text-h6 text-info font-weight-bold"
          :href="`https://www.google.com/maps?q=${schoolDetailData.oldValues.latitude},${schoolDetailData.oldValues.longitude}`"
          target="blank"
        >📍 View on Google Maps</a>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          You can write a message to reject.
        </div>
        <v-text-field
          v-model="commentReject"
          rounded="lg"
          density="compact"
          placeholder="Comment"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
        />
        <v-btn
          color="primary"
          variant="outlined"
          flat
          class="text-h5 font-weight-bold"
          :loading="loadingPolishComment"
          :disabled="!commentReject.trim() || loadingPolishComment"
          @click="polishRejectCommentWithAi"
        >
          Polish with AI
          <v-icon
            color="primary"
            class="ml-1"
          >
            md:cleaning_services
          </v-icon>
        </v-btn>
      </div>
    </template>

    <div class="w-100 d-flex align-center ga-2 mt-8">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 w-50"
        :disabled="loading || !!commentReject.trim()"
        :loading="loadingChangeStatus"
        flat
        @click="approve"
      >
        Approve
      </v-btn>
      <v-btn
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 w-50"
        :disabled="loading"
        :loading="loadingChangeStatus"
        flat
        @click="reject"
      >
        Reject
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, AppError, AdminSchoolContributionDTO, AdminSchoolContributionNewDataDTO, AdminSchoolContributionOldDataDTO, BoardDTO } from '@/types'

interface IDetailModal {
  contributionId?: number
  identifierId?: number
}
type FieldConfig<T> = {
  key: keyof T
  label: string
  full?: boolean
  type?: 'text' | 'tags' | 'boards' | 'image'
  formatter?: (val: T[keyof T]) => string | BoardDTO[]
}

const { $toast } = useNuxtApp()
const props = defineProps<IDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { data: boardsData, getData: getBoardsData } = useBoard()

const loading = ref(true)
const schoolDetailData = ref()
const newDataFormated = ref()
const oldDataFormated = ref()
const loadingChangeStatus = ref(false)
const loadingPolishComment = ref(false)
const commentReject = ref('')

const newDataFields: FieldConfig<AdminSchoolContributionNewDataDTO>[] = [
  { key: 'name', label: 'Name :', full: true },
  { key: 'localName', label: 'Local Name :', full: true },
  { key: 'schoolType', label: 'Type :' },
  { key: 'stateId', label: 'State ID :' },
  { key: 'zipCode', label: 'Zip Code :' },
  { key: 'cityId', label: 'City ID :' },
  { key: 'countryId', label: 'Country ID :' },
  { key: 'quarter', label: 'Quarter :' },
  { key: 'phoneNumber', label: 'Phone :' },
  { key: 'faxNumber', label: 'Fax :' },
  { key: 'email', label: 'Email :', full: true },
  { key: 'webSite', label: 'Website :', full: true },
  { key: 'address', label: 'Address :', full: true },
  { key: 'localAddress', label: 'Local Address :', full: true },
  { key: 'latitude', label: 'latitude :', full: true },
  { key: 'longitude', label: 'longitude :', full: true },
  {
    key: 'tuition',
    label: 'Tuition :',
    formatter: v => `$${v}`,
  },
  {
    key: 'tags',
    label: 'Facilities :',
    full: true,
    type: 'tags',
  },
  {
    key: 'boards',
    label: 'Boards :',
    full: true,
    type: 'boards',
    formatter: v => (v as number[])
      .map(id => boardsData.value.find(board => board.id === id))
      .filter((board): board is BoardDTO => board !== undefined),
  },
  { key: 'description', label: 'Description :', full: true },
]

const oldDataFields: FieldConfig<AdminSchoolContributionOldDataDTO>[] = [
  { key: 'id', label: 'ID :' },
  { key: 'name', label: 'Name :', full: true },
  { key: 'localName', label: 'Local Name :', full: true },
  { key: 'schoolType', label: 'Type :' },
  { key: 'stateId', label: 'State ID :' },
  { key: 'stateTitle', label: 'State Title :' },
  { key: 'zipCode', label: 'Zip Code :' },
  { key: 'cityId', label: 'City ID :' },
  { key: 'cityTitle', label: 'City Title :' },
  { key: 'countryId', label: 'Country ID :' },
  { key: 'countryTitle', label: 'Country Title :' },
  { key: 'quarter', label: 'Quarter :' },
  { key: 'phoneNumber', label: 'Phone :' },
  { key: 'faxNumber', label: 'Fax :' },
  { key: 'slug', label: 'Slug :' },
  { key: 'osmId', label: 'OSM ID :' },
  { key: 'viewCount', label: 'View Count :' },
  { key: 'email', label: 'Email :', full: true },
  { key: 'webSite', label: 'Website :', full: true },
  { key: 'address', label: 'Address :', full: true },
  { key: 'localAddress', label: 'Local Address :', full: true },
  { key: 'latitude', label: 'latitude :', full: true },
  { key: 'longitude', label: 'longitude :', full: true },
  {
    key: 'tuition',
    label: 'Tuition :',
    formatter: v => `$${v}`,
  },
  { key: 'description', label: 'Description :', full: true },
  {
    key: 'tags',
    label: 'Facilities :',
    full: true,
    type: 'tags',
  },
  {
    key: 'boards',
    label: 'Boards :',
    full: true,
    type: 'boards',
  },
  {
    key: 'defaultImageUri',
    label: 'default Image :',
    full: true,
    type: 'image',
  },
]

const getData = async () => {
  try {
    loading.value = true
    const [response] = await Promise.all([
      useApiService.get<
        ApiResult<AdminSchoolContributionDTO>
      >(`/api/v2/admin/schools/contributions/${props.contributionId}`),
      // Needed to resolve the new-value board IDs into titles below, matching how old-value
      // boards already arrive from the API as full {title, icon} objects.
      boardsData.value.length === 0 ? getBoardsData() : Promise.resolve(),
    ])
    if (response.succeeded) {
      schoolDetailData.value = response.data
      newDataFormated.value = createFormatedData(schoolDetailData.value.newValues, newDataFields)
      oldDataFormated.value = createFormatedData(schoolDetailData.value.oldValues, oldDataFields)
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loading.value = false
  }
}

const createFormatedData = <T extends object>(data: T, fields: FieldConfig<T>[]) => {
  if (!data) return []

  return fields
    .map((field) => {
      const rawValue = data[field.key]

      if (
        rawValue === null
        || rawValue === undefined
        || rawValue === ''
        || (Array.isArray(rawValue) && rawValue.length === 0)
      ) {
        return null
      }

      return {
        ...field,
        value: field.formatter
          ? field.formatter(rawValue as T[keyof T])
          : rawValue,
      }
    })
    .filter(Boolean)
}

const approve = async () => {
  try {
    loadingChangeStatus.value = true
    const params = props.identifierId
      ? {
          schoolId: props.identifierId,
        }
      : {}
    const response = await useApiService.patch<
      ApiResult<unknown>
    >(`/api/v2/admin/schools/contributions/${props.contributionId}/confirm`, params)
    if (response.succeeded) {
      emit('changeStatusSuccessfull')
    }
    else {
      $toast.error('The operation approve data failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loadingChangeStatus.value = false
  }
}

const buildPolishRejectCommentPrompt = () => {
  return [
    'You are a professional English writing editor for a school contribution rejection comment.',
    'Polish the admin comment below.',
    'Improve grammar, spelling, word choice, clarity, and professional tone.',
    'Preserve the original meaning and intent exactly.',
    'Do not add new facts, promises, links, timelines, policies, or technical details.',
    'Remove or soften any rude, offensive, aggressive, or unprofessional wording while keeping the message clear.',
    'Return plain text only.',
    'Do not use Markdown.',
    'Do not wrap the response in a fenced code block.',
    '',
    'Admin comment:',
    commentReject.value.trim(),
  ].join('\n')
}

const normalizeAiPlainTextResponse = (text: string) => {
  return text
    .trim()
    .replace(/^```(?:text|txt)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

const polishRejectCommentWithAi = async () => {
  if (!commentReject.value.trim())
    return

  try {
    loadingPolishComment.value = true
    const response = await useApiService.post<{
      response?: string
    }>(
      '/api/chatgpt',
      {
        userComment: buildPolishRejectCommentPrompt(),
      },
    )

    if (response.response) {
      commentReject.value = normalizeAiPlainTextResponse(response.response)
      $toast.success('Comment polished successfully!')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    $toast.error(
      error.response?.data?.message
      || error.message
      || 'The operation failed. Please try again later.',
    )
  }
  finally {
    loadingPolishComment.value = false
  }
}

const reject = async () => {
  if (commentReject.value && commentReject.value.length > 0) {
    try {
      loadingChangeStatus.value = true
      const params = {
        comment: commentReject.value,
      }
      const response = await useApiService.patch<
        ApiResult<unknown>
      >(`/api/v2/admin/schools/contributions/${props.contributionId}/reject`, params)
      if (response.succeeded) {
        emit('changeStatusSuccessfull')
      }
      else {
        $toast.error('The operation reject data failed. Please try again later.')
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingChangeStatus.value = false
    }
  }
  else {
    $toast.error('Please write the reason for rejection.')
  }
}

onMounted(async () => {
  await getData()
})
</script>

<style scoped>
.detail-item {
  width: 50%;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .detail-item {
    width: 100% !important;
  }
}

.label {
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
  font-weight: 700;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
  font-weight: 700;
  word-break: break-word;
}

.description {
  font-weight: 500;
  line-height: 1.7;
}
</style>
