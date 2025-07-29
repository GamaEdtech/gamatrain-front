<template>
  <v-card
    outlined
    :class="' grade-card grade-card' + (itm_index + 1)"
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
        {{ item.title }}
      </nuxt-link>
      <v-btn
        plain
        :class="'mt-5  text-lowercase showmore-btn' + (itm_index + 1)"
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
            <span :class="'label-tag label-tag' + (itm_index + 1)">{{
              itm_index + 1
            }}</span>
            {{ stat.base_title }}
          </nuxt-link>
          <div class="d-flex align-center res-update d-sm-none">
            <i class="fa-solid fa-calendar-days mx-3" />
            <p>{{ $dayjs(stat.last_update).format("MMM DD") }}</p>
          </div>
        </div>
        <p class="d-inline-block">
          <nuxt-link
            v-for="(item, index) in stat.lessons.slice(0, 3)"
            :key="item.id || index"
            :to="`/search?type=test&section=${stat.section}&base=${stat.base}&lesson=${stat.lesson}&sortby=best`"
            class="content grade-list-lessons"
          >
            {{ item.title }}
            <span v-show="index < 2"> , </span>
          </nuxt-link>
          <span
            v-show="stat.lessons.length > 3"
            class="btn-transparent more-content pointer"
            @click="lessonExpand(itm_index)"
          >... more</span>
        </p>
        <p
          v-if="stat.showMore"
          class="total-content"
        >
          <nuxt-link
            v-for="item in stat.lessons"
            :key="item.id"
            :to="`/search?type=test&section=${stat.section}&base=${stat.base}&lesson=${stat.lesson}&sortby=best`"
            class="content"
          >
            {{ item.title }}
            <span v-show="itm_index < 2"> , </span>
          </nuxt-link>
        </p>
      </v-card-title>
      <v-divider class="my-5" />

      <v-card-text class="pa-0 grade-items mb-3">
        <nuxt-link
          :to="`/search?type=test&section=${stat.section}&base=${stat.base}&sortby=best`"
          :class="'d-flex align-center justify-space-between pa-0 pb-0 grade__item grade__item1'"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="ml-1 icon icong-test" />
            <span class="text-center type my-2 grade-item__text"> Paper </span>
          </div>
          <div class="py-1 left">
            <div class="text-left stat">
              {{ stat.tests }}
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=learnfiles&section=${stat.section}&base=${stat.base}&sortby=best`"
          :class="'d-flex align-center justify-space-between pa-0 pb-0 grade__item grade__item2'"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="ml-1 icon icong-learnfiles" />
            <span class="text-center type my-2 grade-item__text">
              Multimedia
            </span>
          </div>
          <div class="py-1 left">
            <div class="text-left stat">
              {{ stat.files }}
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=azmoon&section=${stat.section}&base=${stat.base}&sortby=best`"
          :class="'d-flex align-center justify-space-between pa-0 pb-0 grade__item grade__item4'"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="ml-1 icon icong-azmoon" />
            <span class="text-center type my-2 grade-item__text"> Exam </span>
          </div>
          <div class="py-1 left">
            <div class="text-left stat">
              {{ stat.exams }}
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/search?type=question&section=${stat.section}&base=${stat.base}&sortby=best`"
          :class="'d-flex align-center justify-space-between pa-0 pb-0 grade__item grade__item3'"
        >
          <div class="py-0 d-flex align-center right grade__item-title">
            <v-icon class="ml-1 icon icong-qa" />
            <span class="text-center type my-2 grade-item__text"> Q & A </span>
          </div>
          <div class="py-1 left">
            <div class="text-left stat">
              {{ stat.questions }}
            </div>
          </div>
        </nuxt-link>
      </v-card-text>
      <v-divider class="grade-divider" />
      <v-card-text
        class="pt-3 pb-2 px-0 grade-card__update d-sm-flex d-none justify-end"
      >
        <div
          class="d-flex align-center footer-card card-footer justify-end mt-2 x"
        >
          <span class="fa-solid fa-calendar-days ml-2" />
          <span class="ml-1">Last update:&nbsp;</span>
          <span>{{ $dayjs(stat.last_update).format("MMM DD") }}</span>
        </div>
      </v-card-text>

      <!-- </v-card> -->
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'MobileStatsCardComponent',
  props: {
    itmIndex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  emits: ['lessonExpand'],
  methods: {
    lessonExpand(index) {
      this.$emit('lessonExpand', index)
    },
  },
}
</script>

<style scoped></style>
