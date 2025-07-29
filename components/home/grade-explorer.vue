<template>
  <v-container id="content-stats-container">
    <div>
      <div
        v-show="showBoardHint"
        class="board-hint-row"
      >
        <div class="board-hint">
          <div class="hint-container">
            <div class="hint">
              <div class="pt-14">
                <div class="px-5">
                  Select your Board!
                </div>
                <div class="arrow pt-3">
                  <img
                    src="/images/select-board-arrow.svg"
                    alt=""
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ex-selector">
        <div class="ex-board-select">
          <v-select
            v-model="selectedBoard"
            color="#4C4AFF"
            base-color="#4C4AFF"
            bg-color="#4C4AFF"
            :items="boardList"
            density="compact"
            item-title="title"
            item-value="id"
            hide-details
            return-object
            @update:model-value="fetchGradeList"
            @update:focused="handleBoardFocused"
          >
            <template #selection>
              <div class="d-flex align-center ex-select-board-label pr-5">
                <div>
                  <v-avatar size="small">
                    <v-img :src="selectedBoard?.img" />
                  </v-avatar>
                </div>
                <div class="pl-2 ex-select-board-label">
                  <span class="ex-select-board-title">
                    {{ selectedBoard?.title }}
                  </span>
                </div>
              </div>
            </template>
          </v-select>
        </div>
        <div class="ex-grade-select">
          <v-select
            v-model="selectedGrade"
            :disabled="gradeLoader"
            color="#4C4AFF"
            base-color="#4C4AFF"
            bg-color="#4C4AFF"
            :items="gradeList"
            density="compact"
            item-title="title"
            item-value="id"
            hide-details
          />
        </div>
      </div>
      <div class="mt-10">
        <v-row justify="center">
          <v-col
            v-for="category in categories"
            :key="category.key"
            cols="12"
            sm="4"
            md="3"
            lg="2"
          >
            <nuxt-link
              :to="`/search?type=${category.type}&section=${selectedBoard?.id}&base=${selectedGrade}`"
            >
              <div class="ex-category__card">
                <div class="d-flex align-center">
                  <div class="ex-category__card--title mb-sm-4 pr-6 pr-md-0">
                    {{ category.stat }}
                  </div>
                  <span class="d-sm-none">
                    <v-icon
                      size="x-large"
                      color="#D0D5DD"
                    >mdi-chevron-right</v-icon>
                  </span>
                </div>

                <div class="d-flex align-center order-first order-sm-last">
                  <div class="ex-category__card--icon">
                    <span
                      class="stat-icon"
                      :class="category.icon"
                    />
                  </div>
                  <div class="d-flex align-center pl-1">
                    <span class="ex-category__card--subtitle">
                      {{ category.title }}
                    </span>
                    <span class="pl-1 d-none d-sm-block">
                      <v-icon
                        size="x-large"
                        color="#D0D5DD"
                      >mdi-chevron-right</v-icon>
                    </span>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import cieIcon from '~/assets/images/boards/CIE.svg'
import edexcelIcon from '~/assets/images/boards/Edexcel.svg'
import AQAIcon from '~/assets/images/boards/AQA.svg'
import OCRIcon from '~/assets/images/boards/OCR.svg'
import GamaIcon from '~/assets/images/boards/Gama.svg'
import ScientificIcon from '~/assets/images/boards/Scientific Competition.svg'
import { ref, watch, onMounted } from 'vue'

const categories = ref([
  {
    type: 'learnfiles',
    key: 'files',
    stat: '220',
    title: 'Multimedia',
    icon: 'icon-multimedia',
  },
  {
    type: 'azmoon',
    key: 'exams',
    stat: '410',
    title: 'QuizHub',
    icon: 'icon-exam',
  },
  {
    type: 'test',
    key: 'tests',
    stat: '34,519',
    title: 'Past Paper',
    icon: 'icon-paper',
  },
  {
    type: 'question',
    key: 'questions',
    stat: '+1,000',
    title: 'Forum',
    icon: 'icon-q-a',
  },
  {
    type: 'dars',
    key: 'tutorial',
    stat: '50',
    title: 'Tutorial',
    icon: 'icon-tutorial',
  },
])
const _selectLoader = ref(true)
const boardList = ref([])
const gradeList = ref([])
const gradeLoader = ref(false)
const selectedBoard = ref(null)
const selectedGrade = ref(null)
const boardImgs = ref([
  cieIcon,
  edexcelIcon,
  AQAIcon,
  OCRIcon,
  GamaIcon,
  ScientificIcon,
])
const showBoardHint = ref(false)

const fetchInitialData = async () => {
  const params = { type: 'section' }
  const response = await $fetch(`/api/v1/types/list`, { params })
  boardList.value = response.data.map((item, index) => ({
    ...item,
    img: boardImgs.value[index % boardImgs.value.length],
  }))

  // Try to restore selectedBoard from localStorage
  let storedBoard = null
  try {
    storedBoard = JSON.parse(localStorage.getItem('selectedBoard'))
  }
  catch {
    // Ignore parse errors - use default board
  }
  if (storedBoard && storedBoard.id) {
    // Find the matching board in the new boardList by id
    const match = boardList.value.find(b => b.id === storedBoard.id)
    selectedBoard.value = match || boardList.value[0]
  }
  else {
    selectedBoard.value = boardList.value[0]
  }
  fetchGradeList()
}
const fetchGradeList = async () => {
  try {
    if (!selectedBoard.value) {
      return
    }

    gradeLoader.value = true
    const params = { type: 'base' }
    params.section_id = selectedBoard.value.id
    const response = await $fetch(`/api/v1/types/list`, { params })
    gradeList.value = response.data
    selectedGrade.value = response.data[0].id
  }
  catch (error) {
    console.error('Error fetching grade list:', error)
  }
  finally {
    gradeLoader.value = false
  }
}
const fetchCategoryCounts = async () => {
  try {
    if (!selectedBoard.value || !selectedGrade.value) {
      return
    }

    const params = new URLSearchParams()
    params.append('type', 'test')
    params.append('page', '1')
    params.append('section', selectedBoard.value.id)
    params.append('base', selectedGrade.value)
    const requestUrl = `/api/v1/search?${params.toString()}`
    const response = await $fetch(requestUrl)
    if (
      response
      && response.status === 1
      && response.data
      && response.data.types_stats
    ) {
      categories.value.find((cat, _i) => cat.key == 'tests').stat
        = parseInt(response.data.types_stats.test) || 0

      categories.value.find((cat, _i) => cat.key == 'files').stat
        = parseInt(response.data.types_stats.learnfiles) || 0

      categories.value.find((cat, _i) => cat.key == 'exams').stat
        = parseInt(response.data.types_stats.azmoon) || 0

      categories.value.find((cat, _i) => cat.key == 'questions').stat
        = parseInt(response.data.types_stats.question) || 0

      categories.value.find((cat, _i) => cat.key == 'tutorial').stat
        = parseInt(response.data.types_stats.tutorial) || 0
    }
  }
  catch (error) {
    console.error('Error fetching category counts:', error)
  }
}
const handleBoardFocused = () => {
  if (selectedBoard.value && showBoardHint.value) {
    localStorage.setItem('boardHintShown', 'true')
    showBoardHint.value = false
  }
}
watch(
  () => selectedGrade.value,
  (_val) => {
    fetchCategoryCounts()
  },
  {
    immediate: true,
  },
)

watch(
  () => selectedBoard.value,
  (_val) => {
    localStorage.setItem('selectedBoard', JSON.stringify(selectedBoard.value))
  },
)

onMounted(() => {
  fetchInitialData()
  if (localStorage.getItem('boardHintShown') === 'true') {
    showBoardHint.value = false
  }
  else {
    showBoardHint.value = true
  }
})
</script>

<style scoped>
.board-hint {
  position: absolute;
  left: 0;
  z-index: 2;
  left: 5%;
  bottom: 0;
}
.hint-container {
  position: relative;
  width: 242px;
  /* height: 119px; */
  opacity: 0;
  background: rgba(18, 183, 106, 0.5);
  display: flex;
  justify-content: center;
  border-radius: 120px 120px 0 0;
  animation: hintGrowIn 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s 1 both,
    waveHeightOnly 2.5s ease-in-out 0.7s infinite alternate;
}

@keyframes hintGrowIn {
  0% {
    height: 0;
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    height: 119px;
    opacity: 1;
  }
}

@keyframes waveHeightOnly {
  0% {
    height: 119px;
  }
  50% {
    height: 126px;
  }
  100% {
    height: 119px;
  }
}

.hint {
  position: absolute;
  width: 208px;
  height: 101px;
  background-color: #00c171;
  border-radius: 120px 120px 0 0;
  bottom: 0;
  width: 85%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.hint-overlay {
  position: absolute;
  width: 140px; /* Slightly smaller */
  height: 70px; /* Slightly smaller */
  top: 5px; /* Centered inside */
  left: 5px;
  background-color: #ffffff; /* Inner white layer */
  border-radius: 70px 70px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00c171; /* Text color matching outer border */
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.stat-icon {
  font-size: 2.3rem;
}
.icon-multimedia {
  color: #02b719;
}
.icon-paper {
  color: #2e90fa;
}
.icon-exam {
  color: #7c4dff;
}
.icon-q-a {
  color: #fdb022;
}
.icon-tutorial {
  color: #2e90fa;
}
.ex-category__card--title {
  color: #344054;
  font-size: 20px;
  font-weight: 700;
}
.ex-category__card--subtitle {
  color: #667085;
  font-size: 16px;
  font-weight: 500;
}
.ex-category__card {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(249, 250, 251, 1)
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(242, 244, 247, 1);
  padding: 2rem 1.5rem;
  border-radius: 24px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s,
    background 0.2s;
}
.ex-category__card:hover {
  box-shadow: 0 8px 24px 0 rgba(76, 74, 255, 0.1),
    0 1.5px 6px 0 rgba(0, 0, 0, 0.04);
  transform: translateY(-6px) scale(1.03);
  border-color: #ffb600;
  background: #f8faff;
  cursor: pointer;
}
.ex-select-board-label {
  display: inline-flex;
  align-items: center;
  letter-spacing: inherit;
  line-height: inherit;
  max-width: 100%;
}
.ex-select-board-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.board-hint-row {
  max-width: 556px;
  position: relative;
  height: 10px;
  width: 100%;
  margin: 0 auto;
}
.ex-selector {
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #4c4aff;
  max-width: 556px;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 1rem 0.5rem;
  border-radius: 16px;
}
.ex-board-select {
  width: 120px;
  min-width: 130px;
  position: relative;
}
.ex-board-select::after {
  content: "";
  width: 1px;
  height: 32px;
  background-color: #9ea5d1;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translate(-50%, -50%);
}
.ex-grade-select {
  padding-left: 10px;
  max-width: 450px;
  flex-grow: 1;
}

@media (min-width: 600px) {
  .ex-category__card {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(249, 250, 251, 1)
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(242, 244, 247, 1);
    padding: 3rem 1rem;
    border-radius: 24px;
  }
  .ex-board-select {
    width: 200px;
    position: relative;
  }
  .ex-board-select::after {
    content: "";
    width: 1px;
    height: 32px;
    background-color: #9ea5d1;
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .ex-grade-select {
    padding-left: 30px;
    width: 450px;
  }
}
@media (min-width: 960px) {
  .ex-category__card--title {
    font-size: 30px;
    font-weight: 700;
  }
  .ex-category__card--subtitle {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
