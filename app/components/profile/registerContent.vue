<template>
  <div
    class="w-100 d-flex flex-column pa-6 ga-4 bg-white"
  >
    <span class="text-h4 text-sm-h3 font-weight-bold text-grey700">Registered content</span>
    <div class="btn-filter-container d-flex align-start justify-start ga-1 bg-grey50 pa-2 rounded-pill overflow-x-auto">
      <v-btn
        v-for="type in typeList"
        :key="type"
        rounded="pill"
        :color="type == typeSelect ? `primary`:`transparent`"
        flat
        height="40"
        @click="changeFilterType(type)"
      >
        <span :class="`${type == typeSelect ? `text-grey900 font-weight-bold`:`text-grey500 font-weight-regular`} text-h6 text-sm-h5`">{{ type }}</span>
      </v-btn>
    </div>
    <div class="w-100 d-flex">
      <v-slide-group>
        <v-slide-group-item
          v-for="item in 10"
          :key="item"
        >
          <lazy-common-detail-related-content-card-skeleton type="paper" />
        </v-slide-group-item>
      </v-slide-group>
      <!-- <v-slide-group
        v-else
        show-arrows
        class="related-content position-relative"
        :style="{ height: `${CardHeight}` }"
      >
        <template #prev>
          <v-btn
            icon
            size="sm"
          >
            <v-icon color="#000000">
              md:chevron_backward
            </v-icon>
          </v-btn>
        </template>

        <template #next>
          <v-btn
            icon
            size="sm"
          >
            <v-icon color="#000000">
              md:chevron_forward
            </v-icon>
          </v-btn>
        </template>

        <v-slide-group-item
          v-for="item in pastpaper"
          :key="item.id"
        >
          <nuxt-link :to="`/paper/${item.id}/${item.title_url}`">
            <lazy-common-detail-related-content-card
              :picture="item.thumb_pic || fallbackImage"
              :title="item.title"
              :score="item.referee_score || item.type_title"
              :avatar="item.avatar"
              :first-name="item.first_name"
              :last-name="item.last_name"
              type="paper"
            />
          </nuxt-link>
        </v-slide-group-item>
      </v-slide-group> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const typeSelect = ref('Past Paper')
const typeList = ['Past Paper', 'Multimedia', 'Online Exam', 'Forum']

const changeFilterType = async (type: string) => {
  if (type == '') {
    typeSelect.value = 'Past Paper'
  }
  else {
    typeSelect.value = type
  }
}

// const CardHeight = computed(() => {
//   // if (props.type === "paper") {
//   //   return "243px";
//   // }
//   // else if (props.type === "multimedia") {
//   //   return "120px";
//   // }
//   return 'auto'
// })
</script>

<style scoped>
.btn-filter-container{
  width : fit-content
}
:deep(.related-content:hover > .v-slide-group__prev),
:deep(.related-content:hover > .v-slide-group__next) {
  opacity: 1;
  visibility: visible;
  position: absolute;
}

:deep(.related-content > .v-slide-group__wrapper) {
  order: 1;
  width: 100%;
  align-items: center;
}

:deep(.related-content > .v-slide-group__prev),
:deep(.related-content > .v-slide-group__next) {
  order: 2;
  margin-top: 12px;
  background-color: #344054cc;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border: 1px solid #e4e7ec;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease, visibility 300ms ease;
}

:deep(.related-content > .v-slide-group__prev > i),
:deep(.related-content > .v-slide-group__next > i) {
  color: white !important;
}

:deep(
    .related-content
      > .v-slide-group__prev
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ),
:deep(
    .related-content
      > .v-slide-group__next
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ) {
  color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.related-content > .v-slide-group__prev > .v-slide-group__prev--disabled),
:deep(.v-slide-group__prev--disabled),
:deep(.related-content > .v-slide-group__next > .v-slide-group__next--disabled),
:deep(.v-slide-group__next--disabled) {
  pointer-events: unset !important;
  opacity: 0.6 !important;
  transition: opacity 300ms ease, visibility 300ms ease;
}

:deep(.related-content > .v-slide-group__prev) {
  position: absolute;
  margin-top: 90px;
  left: 20px;
  z-index: 10;
}

:deep(.related-content > .v-slide-group__next) {
  position: absolute;
  margin-top: 90px;
  right: 20px;
  z-index: 10;
}
@media (max-width: 600px) {
 .btn-filter-container{
   width : 100%
 }
}
</style>
