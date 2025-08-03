<template>
  <v-card
    outlined
    :class="'grade-card grade-card' + (itm_index + 1)"
  >
    <p
      v-show="stat.showMore"
      class="total-content"
    >
      <nuxt-link
        v-for="(item, index) in stat.lessons"
        :key="item.id || index"
        :to="`/search?type=test&section=${stat.section}&base=${stat.base}&lesson=${stat.lesson}&sortby=best`"
        class="content grade-list-lessons"
      >
        <span class="font-size-14">
          {{ item.title }}
        </span>
      </nuxt-link>
      <v-btn
        plain
        :class="
          'mt-5 font-size-14  text-lowercase showmore-btn' + (itm_index + 1)
        "
        @click="lessonExpand(itm_index)"
      >
        Return
      </v-btn>
    </p>
    <div v-show="!stat.showMore">
      <v-card-title class="d-block pa-0 pb-2">
        <div class="d-flex justify-space-between align-item">
          <nuxt-link
            :to="`/search?type=test&section=${stat.section}&base=${stat.base}`"
            :class="'grade-title grade-title' + (itm_index + 1)"
            class="mb-2"
          >
            <span :class="'label-tag label-tag' + (itm_index + 1)">
              {{ itm_index + 1 }}
            </span>
            {{ stat.base_title }}
          </nuxt-link>
          <div class="d-flex align-center res-update d-sm-none">
            <i class="fa-solid fa-calendar-days mx-3" />
            <p>{{ $dayjs(stat.last_update).format("MMM DD") }}</p>
          </div>
        </div>
        <v-card
          flat
          min-height="40"
          color="transparent"
          class="d-inline-block"
        >
          <nuxt-link
            v-for="(item, index) in stat.lessons.slice(0, 3)"
            :key="item.id || index"
            :to="`/search?type=test&section=${stat.section}&base=${stat.base}&lesson=${stat.lesson}&sortby=best`"
            class="content grade-list-lessons"
          >
            <span class="font-size-14">
              {{ item.title }}
            </span>
            <span
              v-show="index < 2"
              class="font-size-14"
            > , </span>
          </nuxt-link>
          <span
            v-show="stat.lessons.length > 3"
            class="btn-transparent more-content pointer font-size-14"
            @click="lessonExpand(itm_index)"
          >... more</span>
        </v-card>
      </v-card-title>
      <v-divider class="mb-2" />

      <v-card-text class="pa-0 grade-items mb-3">
        <nuxt-link
          :to="`/search?type=test&section=${stat.section}&base=${stat.base}&sortby=best`"
          class="d-flex align-center justify-space-between pa-0 pb-0 grade__item"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="mr-4 icon icong-test" />
            <p
              class="text-center type my-2 grade-item__text"
              v-text="'Paper'"
            />
          </div>
          <div class="py-1 left">
            <p
              class="text-left stat"
              v-text="stat.tests"
            />
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=learnfiles&section=${stat.section}&base=${stat.base}&sortby=best`"
          class="d-flex align-center justify-space-between pa-0 pb-0 grade__item"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="mr-4 icon icong-learnfiles" />
            <p
              class="text-center type my-2 grade-item__text"
              v-text="'Multimedia'"
            />
          </div>
          <div class="py-1 left">
            <p
              class="text-left stat"
              v-text="stat.files"
            />
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=azmoon&section=${stat.section}&base=${stat.base}&sortby=best`"
          class="d-flex align-center justify-space-between pa-0 pb-0 grade__item"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="mr-4 icon icong-azmoon" />
            <p
              class="text-center type my-2 grade-item__text"
              v-text="'Exam'"
            />
          </div>
          <div class="py-1 left">
            <p
              class="text-left stat"
              v-text="stat.exams"
            />
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=question&section=${stat.section}&base=${stat.base}&sortby=best`"
          class="d-flex align-center justify-space-between pa-0 pb-0 grade__item"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="mr-4 icon icong-qa" />
            <p
              class="text-center type my-2 grade-item__text"
              v-text="'Q & A'"
            />
          </div>
          <div class="py-1 left">
            <p
              class="text-left stat"
              v-text="stat.questions"
            />
          </div>
        </nuxt-link>
      </v-card-text>
      <v-divider class="grade-divider" />
      <v-card-text
        class="pt-3 px-0 grade-card__update d-sm-flex d-none justify-end"
      >
        <div
          class="d-flex align-center footer-card card-footer justify-end mt-2 x"
        >
          <span
            class="fa-solid fa-calendar-days footer-card-calendar ml-2"
          />
          <span class="ml-1 last-update font-size-14">Last update:&nbsp;</span>
          <span class="last-update font-size-14">{{
            $dayjs(stat.last_update).format("MMM DD")
          }}</span>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'DesktopStatsCardComponent',
  props: {
    itmIndex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  emits: ['lessonExpand'],
  data() {
    return {}
  },
  methods: {
    lessonExpand(index) {
      this.$emit('lessonExpand', index)
    },
  },
}
</script>

<style scoped></style>
