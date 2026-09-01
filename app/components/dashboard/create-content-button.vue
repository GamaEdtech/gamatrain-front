<template>
  <!-- Content type -->
  <v-row>
    <v-col
      v-for="(item, index) in button_list"
      :key="index"
      cols="12"
      sm="6"
    >
      <v-card
        flat
        class="dashboard-card pa-4 d-flex align-center justify-space-between ga-4"
        :class="{ 'opacity-55': isLocked(item) }"
      >
        <div class="d-flex align-center ga-3">
          <v-avatar
            :color="item.color"
            variant="tonal"
            rounded="lg"
            size="44"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-avatar>
          <div>
            <p class="gama-text-body1 font-weight-bold text-grey900 mb-0">
              {{ item.title }}
            </p>
            <p class="gama-text-caption text-grey500 mb-0">
              <template v-if="isLocked(item)">
                Unlocks for teachers
              </template>
              <template v-else>
                {{ item.count }} {{ item.countLabel }}
              </template>
            </p>
          </div>
        </div>

        <v-btn
          v-if="!isLocked(item)"
          class="dashboard-btn"
          :color="item.color"
          variant="flat"
          rounded="pill"
          size="small"
          :to="item.link"
        >
          + {{ item.actionLabel }}
        </v-btn>
        <v-icon
          v-else
          color="grey400"
        >
          mdi-lock-outline
        </v-icon>
      </v-card>
    </v-col>
  </v-row>
  <!-- End content type -->
</template>

<script setup>
const { user } = useUser()

const props = defineProps({
  statistics: {
    type: Object,
    default: () => ({}),
  },
})

const isLocked = item => user.value && user.value.group === 6 && item.class !== 'question_answer'

const button_list = reactive([
  {
    class: 'sample_exam',
    title: 'Past Papers',
    count: 0,
    countLabel: 'published',
    link: '/user/paper/create',
    manage_link: '/user/paper',
    icon: 'mdi-file-document-outline',
    color: 'primary',
    actionLabel: 'New Past Paper',
  },
  {
    class: 'training_content',
    title: 'Multimedia',
    count: 0,
    countLabel: 'published',
    link: '/user/multimedia/create',
    manage_link: '/user/multimedia',
    icon: 'mdi-play-circle-outline',
    color: 'info',
    actionLabel: 'Add Multimedia',
  },
  {
    class: 'question_answer',
    title: 'Forum',
    count: 0,
    countLabel: 'questions',
    link: '/user/question/create',
    manage_link: '/user/question',
    icon: 'mdi-forum-outline',
    color: 'secondary',
    actionLabel: 'Ask a Question',
  },
  {
    class: 'online_exam',
    title: 'QuizHub',
    count: 0,
    countLabel: 'published',
    link: '/test-maker/create',
    manage_link: '/test-maker',
    icon: 'mdi-clipboard-check-outline',
    color: 'warning',
    actionLabel: 'New Quiz',
  },
])

const updateButtonCount = (className, count) => {
  const index = button_list.findIndex(x => x.class === className)
  if (index !== -1) {
    button_list[index].count = count
  }
}

watch(
  () => props.statistics,
  (newStats) => {
    if (newStats) {
      updateButtonCount('sample_exam', newStats?.test?.total || 0)
      updateButtonCount('training_content', newStats?.file?.total || 0)
      updateButtonCount('question_answer', newStats?.question?.total || 0)
      updateButtonCount('online_exam', newStats?.test?.total || 0)
    }
  },
  { immediate: true, deep: true },
)

defineExpose({
  button_list,
})
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}

/* Vuetify 3's button size scale is tuned for a 16px root; this project
   forces html { font-size: 10px }. */
.dashboard-btn {
  font-size: 1.4rem !important;
}
</style>
