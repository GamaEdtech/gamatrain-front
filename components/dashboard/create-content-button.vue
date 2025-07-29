<template>
  <!-- Content type -->
  <v-row class="create_content_section">
    <v-col
      v-for="(item, index) in button_list"
      :key="index"
      cols="6"
      md="3"
      class="px-2"
      :class="`${item.class}`"
    >
      <v-card
        outlined
        class="px-2"
        :disabled="
          user.group_id == 6 && button_list[index].class !== 'question_answer'
        "
      >
        <v-card-text class="px-0 px-md-4">
          <v-row>
            <v-col
              cols="6"
              class="text-left"
            >
              <v-btn
                class="icon_btn"
                rounded="circle"
                size="56"
                fab
                :to="`${item.manage_link}`"
              >
                <span :class="`icon icon-${item.icon} group-icon`" />
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              class="text-right counter"
            >
              <dashboard-question-statistics
                v-if="button_list[index].class === 'question_answer'"
                ref="questionStatisticsRef"
                :statistics="statistics"
              />
              <span v-else>
                {{ item.count }}
              </span>
            </v-col>
            <v-col
              cols="12"
              class="title py-0"
            >
              {{ item.title }}
            </v-col>
            <v-col cols="12">
              <v-btn
                class="icon_link"
                block
                :to="`${item.link}`"
              >
                <i class="fa-solid fa-plus-circle px-1 icon fa-xl" /> New
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
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

const questionStatisticsRef = ref(null)

const updateButtonCount = (className, count) => {
  const index = button_list.findIndex(x => x.class === className)
  if (index !== -1) {
    button_list[index].count = count
  }
}

const button_list = reactive([
  {
    class: 'sample_exam',
    title: 'Past Papers',
    count: 0,
    link: '/user/paper/create',
    manage_link: '/user/paper',
    icon: 'paper',
  },
  {
    class: 'training_content',
    title: 'Multimedia',
    count: 0,
    link: '/user/multimedia/create',
    manage_link: '/user/multimedia',
    icon: 'multimedia',
  },
  {
    class: 'question_answer',
    title: 'Forum',
    count: 0,
    link: '/user/question/create',
    manage_link: '/user/question',
    icon: 'q-a',
  },
  {
    class: 'online_exam',
    title: 'QuizHub',
    count: 0,
    link: '/test-maker/create',
    manage_link: '/test-maker',
    icon: 'exam',
  },
])

watch(
  () => props.statistics,
  (newStats) => {
    if (newStats) {
      // Update button counts based on statistics
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

<style scoped></style>
