<template>
  <v-form
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 position-relative">
        <div class="text-h6 text-grey700 font-weight-medium ml-2">
          School
        </div>

        <v-text-field
          v-model="textSearchSchool"
          rounded="pill"
          height="48"
          placeholder="Enter..."
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          @click="showBoxSearchSchool = false"
          @update:model-value="handleSearch"
        />

        <div
          v-if="showBoxSearchSchool && (
            loadingSchool
            || isStartTyping
            || schoolItems.length > 0)"
          class="w-100 d-flex flex-column align-start jusyify-start pa-4 rounded-lg bg-grey50 border-solid border-sm border-grey300 overflow-y-auto position-absolute left-0 container-search-result"
          @scroll="handleScroll"
        >
          <template
            v-if="(loadingSchool || isStartTyping) && !isFetchingMore"
          >
            <div
              v-for="i in 10"
              :key="i"
              class="w-100 d-flex align-center ga-3 py-4 cursor-pointer"
            >
              <v-skeleton-loader
                width="20"
                height="20"
                class="rounded-circle"
              />
              <v-skeleton-loader
                width="160"
                height="10"
                class="rounded-lg"
              />
            </div>
          </template>

          <template v-else>
            <div
              v-for="(school, index) in schoolItems"
              :key="index"
              class="d-flex align-center ga-3 py-4 cursor-pointer"
              @click="openSchoolConfirmModal(school)"
            >
              <v-icon
                size="20"
                color="grey400"
              >
                md:school
              </v-icon>
              <span class="text-h5 font-weight-bold text-grey700">
                {{ school.name }} - {{ school.countryTitle }}
              </span>
            </div>
          </template>

          <div
            v-if="currentPage < pageCount"
            class="w-100 d-flex align-center ga-3 py-4 cursor-pointer"
          >
            <v-skeleton-loader
              width="20"
              height="20"
              class="rounded-circle"
            />
            <v-skeleton-loader
              width="160"
              height="10"
              class="rounded-lg"
            />
          </div>
        </div>

        <div
          v-if="
            !selectedSchool
              && !loadingSchool
              && !isStartTyping
              && textSearchSchool.trim()
              && schoolItems.length === 0
          "
          class="mt-1"
        >
          <span class="text-h6 text-grey700">
            No school found with this name.
          </span>

          <router-link
            to="/school/add"
            class="text-h6 text-primary font-weight-bold cursor-pointer ml-1"
          >
            Click here to register a new school
          </router-link>
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-4 mt-10">
        <span class="text-h5 text-grey500 font-weight-regular">Start date</span>
        <div class="w-100 d-flex align-center ga-4">
          <div class="w-50 d-flex flex-column align-start justify-start ga-1">
            <common-gombo-box
              v-model="monthStart"
              label="Month"
              :items="months.map((item) => {
                return {
                  id: item,
                  title: item,
                }
              })"
              rounded="pill"
              height="48"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>

          <div class="w-50 d-flex flex-column align-start justify-start ga-1">
            <common-gombo-box
              v-model="yearStart"
              label="Year"
              :items="years.map((item) => {
                return {
                  id: item.toString(),
                  title: item.toString(),
                }
              })"
              rounded="pill"
              height="48"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-4 mt-4">
        <span class="text-h5 text-grey500 font-weight-regular">End date</span>
        <div class="w-100 d-flex align-center ga-4">
          <div class="w-50 d-flex flex-column align-start justify-start ga-1">
            <common-gombo-box
              v-model="monthEnd"
              label="Month"
              :items="months.map((item) => {
                return {
                  id: item,
                  title: item,
                }
              })"
              rounded="pill"
              height="48"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>

          <div class="w-50 d-flex flex-column align-start justify-start ga-1">
            <common-gombo-box
              v-model="yearEnd"
              label="Year"
              :items="years.map((item) => {
                return {
                  id: item.toString(),
                  title: item.toString(),
                }
              })"
              rounded="pill"
              height="48"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-8">
        <span class="text-h5 text-grey500 font-weight-regular">Description</span>
        <v-text-field
          v-model="inputText"
          rounded="pill"
          height="48"
          placeholder="Enter"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
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
          class="d-flex flex-wrap ga-1 mt-3"
        >
          <v-chip
            v-for="item in localDescription"
            :key="item"
            variant="flat"
            color="primary50"
            closable
            @click:close="removeKeyword(item)"
          >
            <span class="text-h5 font-weight-medium text-primary">{{ item }}</span>
            <template #close>
              <v-icon
                color="#0000008A"
                size="18"
              >
                md:cancel
              </v-icon>
            </template>
          </v-chip>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex justify-center align-center ga-2 mt-16">
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        :disabled="!isFormValid"
        :loading="loadingEditItem || loadingAddItem"
        @click="save"
      >
        Submit
      </v-btn>
    </div>

    <lazy-common-modal-base
      v-model:show-dialog="showSchoolConfirmModal"
      title="School"
    >
      <lazy-profile-modal-school-confirm
        v-if="schoolForConfirm"
        :school="schoolForConfirm"
        @confirm="confirmSchool"
      />
    </lazy-common-modal-base>
  </v-form>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ExperienceDTO, SchoolListDTO } from '@/types'

interface IModalExperience {
  experience?: ExperienceDTO
}

const propsData = defineProps<IModalExperience>()
const emit = defineEmits(['close', 'success', 'edit-success'])

const {
  addItem,
  loadingAddItem,
  editItem,
  loadingEditItem,
} = useExperiences()
const {
  getData,
  loadingGetData: loadingSchool,
  pageCount,
  data,
} = useSchool()

const textSearchSchool = ref('')
const showBoxSearchSchool = ref(false)
const selectedSchool = ref<SchoolListDTO | null>(null)
const schoolForConfirm = ref<SchoolListDTO | null>(null)
const showSchoolConfirmModal = ref(false)
const schoolItems = ref<SchoolListDTO[]>([])
const currentPage = ref(1)
const isFetchingMore = ref(false)
const isStartTyping = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const pageSize = 20

const years = Array.from(
  { length: 2026 - 1980 + 1 },
  (_, index) => 1980 + index,
)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const monthStart = ref('')
const yearStart = ref('')
const monthEnd = ref('')
const yearEnd = ref('')
const localDescription = ref<string[]>([])
const inputText = ref('')

onMounted(() => {
  if (!propsData.experience)
    return

  const {
    schoolId,
    schoolTitle,
    startDate,
    endDate,
    description,
  } = propsData.experience

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  monthStart.value = months[start.month()] as string
  yearStart.value = start.year().toString()

  monthEnd.value = months[end.month()] as string
  yearEnd.value = end.year().toString()

  localDescription.value = description
    ? description
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    : []

  textSearchSchool.value = schoolTitle

  selectedSchool.value = {
    id: schoolId,
    name: schoolTitle,
    slug: '',

    cityTitle: '',
    stateTitle: '',
    countryTitle: '',

    defaultImageUri: '',

    distance: 0,

    hasEmail: false,
    hasPhone: false,
    hasWebsite: false,
    hasLocation: false,

    lat: 0,
    long: 0,

    lastModifyDate: '',

    rating: 0,
    countryRank: 0,
    stateRank: 0,
    cityRank: 0,
  }
})

const addKeywords = () => {
  if (!inputText.value.trim()) return
  const newKeywords = inputText.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)

  const uniqueKeywords = newKeywords.filter(
    k => !localDescription.value.includes(k),
  )

  if (uniqueKeywords.length) {
    localDescription.value = [
      ...localDescription.value,
      ...uniqueKeywords,
    ]
  }

  inputText.value = ''
}

const removeKeyword = (keyword: string) => {
  localDescription.value = localDescription.value.filter(k => k !== keyword)
}

const fetchSchools = async (
  search: string,
  page = 1,
  append = false,
) => {
  const response = await getData({
    page,
    pageSize,
    name: search,
  })
  if (response?.succeeded) {
    if (append) {
      schoolItems.value = [
        ...schoolItems.value,
        ...data.value,
      ]
    }
    else {
      schoolItems.value = [...data.value]
    }
  }
}

const handleSearch = (
  value: string,
) => {
  selectedSchool.value = null
  showBoxSearchSchool.value = true
  isStartTyping.value = true
  currentPage.value = 1

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (!value?.trim()) {
    showBoxSearchSchool.value = false
    schoolItems.value = []
    return
  }

  searchTimeout.value = setTimeout(async () => {
    await fetchSchools(value, 1)
    isStartTyping.value = false
  }, 500)
}

const handleScroll = async (
  event: Event,
) => {
  const target = event.target as HTMLElement
  const isBottomReached
    = target.scrollTop + target.clientHeight
      >= target.scrollHeight - 20

  if (
    !isBottomReached
    || isFetchingMore.value
    || currentPage.value >= pageCount.value
  ) {
    return
  }

  isFetchingMore.value = true
  currentPage.value += 1

  await fetchSchools(
    textSearchSchool.value,
    currentPage.value,
    true,
  )

  isFetchingMore.value = false
}

const selectSchool = (school: SchoolListDTO) => {
  selectedSchool.value = school
  textSearchSchool.value = school.name + '-' + school.countryTitle
  showBoxSearchSchool.value = false
}

const openSchoolConfirmModal = (school: SchoolListDTO) => {
  schoolForConfirm.value = school
  showSchoolConfirmModal.value = true
  showBoxSearchSchool.value = false
}

const confirmSchool = () => {
  if (!schoolForConfirm.value)
    return

  selectSchool(schoolForConfirm.value)
  showSchoolConfirmModal.value = false
  schoolForConfirm.value = null
}

const isFormValid = computed(() => {
  return !!(
    selectedSchool.value
    && monthStart.value
    && yearStart.value
    && monthEnd.value
    && yearEnd.value
  )
})

const formatDate = (
  month: string,
  year: string,
) => {
  const monthIndex = months.findIndex(
    item => item === month,
  )

  return dayjs()
    .year(Number(year))
    .month(monthIndex)
    .date(1)
    .format('YYYY-MM-DD')
}

const save = async () => {
  if (!selectedSchool.value)
    return

  const payload = {
    schoolId: selectedSchool.value.id,
    startDate: formatDate(
      monthStart.value,
      yearStart.value,
    ),
    endDate: formatDate(
      monthEnd.value,
      yearEnd.value,
    ),
    description: localDescription.value.join(', '),
  }

  if (propsData.experience) {
    const response = await editItem(
      payload,
      propsData.experience.id.toString(),
    )

    if (response?.succeeded) {
      emit('edit-success', {
        ...payload,
        id: propsData.experience.id,
        schoolTitle: selectedSchool.value.name,
      })

      emit('close')
    }

    return
  }

  const response = await addItem(payload)
  if (response?.succeeded) {
    emit('success', {
      ...payload,
      id: response.data?.id,
      schoolTitle: selectedSchool.value.name,
    })

    emit('close')
  }
}
</script>

<style>
.container-search-result{
  height : 300px;
  z-index : 3;
  top: 84px;
}
</style>
