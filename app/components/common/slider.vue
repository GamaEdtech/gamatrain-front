<template>
  <div
    ref="slider"
    class="px-0 pb-0"
  >
    <v-card
      outlined
      flat
      class="py-8"
      color="rgba(0,0,0,1)"
    >
      <v-container class="text-white">
        <p class="text-left text-md-h4 text-h5 font-weight-bold">
          Stats and Achievements (GAMA Experience in Iran’s EdTech Market)
        </p>
        <v-row class="stat-sec mx-auto">
          <v-col
            v-for="(item, index) in statList"
            :key="index"
            cols="2"
            class="d-flex justify-center align-center stat-holder mt-5"
          >
            <div
              class="d-flex flex-column justify-center align-center stat-item"
            >
              <span class="stat-icon d-flex align-center justify-center">
                <i :class="' icon-g icon icong-' + item.icon" />
              </span>
              <span class="stat-label text-white">{{ item.label }}</span>
              <span
                :id="'stat' + index + 1"
                class="stat-value"
              >{{ $numberFormat(item.counter) }} +</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    statList: [
      { label: 'School', value: 130000, counter: 130000, icon: 'school' },
      { label: 'Tutor', value: 500000, counter: 500000, icon: 'teacher' },
      { label: 'Student', value: 3000000, counter: 3000000, icon: 'student' },
      { label: 'Paper', value: 60000, counter: 60000, icon: 'test' },
      { label: 'Multimedia', value: 37000, counter: 37000, icon: 'learnfiles' },
      { label: 'Exam', value: 7000, counter: 7000, icon: 'azmoon' },
    ],
    countsInterval: null,
    countsIntervalCompleted: 0,
    bottomOfElement: false,
  }),
  watch: {
    bottomOfElement: function (_val) {
      this.countsInterval = setInterval(this.updated)
    },
  },
  mounted() {
    this.scroll()
  },
  methods: {
    updated() {
      for (const i in this.statList) {
        const item = this.statList[i]
        if (item.value >= item.counter) {
          item.counter = item.counter + 1000
          item.counter = item.counter > item.value ? item.value : item.counter
        }
        else {
          this.countsIntervalCompleted++
        }
      }

      if (this.countsIntervalCompleted === this.statList.length) {
        clearInterval(this.countsInterval)
      }
    },
    getOffsetOfElement(el) {
      let _x = 0
      let _y = 0
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft
        _y += el.offsetTop - el.scrollTop
        el = el.offsetParent
      }
      return { top: _y, left: _x }
    },
    scroll() {
      window.onscroll = () => {
        const offset = this.getOffsetOfElement(this.$refs.slider)
        const spaceSize = 0
        const bottomOfElement
          = window.innerHeight + window.scrollY
            >= offset.top + this.$refs.slider.clientHeight - spaceSize

        if (bottomOfElement) {
          this.bottomOfElement = true
        }
      }
    },
  },
}
</script>
