<template>
  <div :class="`main-list-school-div ${isExpanded ? `` : `closed-list`}`">
    <div
      v-if="pageNumberForLoadPreviousData != 1 && !isInitialLoading"
      class="container-button-load-previous-data"
    >
      <v-btn
        class="text-h5 text-md-h4"
        height="50"
        variant="outlined"
        color="#ffb300"
        rounded="xl"
        @click="loadPreviousPage"
      >
        Load Previous Data
      </v-btn>
    </div>
    <div
      ref="scrollDivRef"
      :class="`container-list-div ${
        pageNumberForLoadPreviousData != 1 ? `adjust-height` : ``
      }`"
    >
      <div class="container-scroll">
        <template v-if="isInitialLoading">
          <CardSchoolSkeleton
            v-for="item in 4"
            :key="item"
          />
        </template>

        <CardSchoolSkeleton v-if="isPaginationPreviousLoading" />

        <template v-if="!isInitialLoading">
          <NuxtLink
            v-for="(school, index) in schoolList"
            :key="index"
            class="card-school"
            :to="`/school/${school.id}/${$slugGenerator(school.name)}`"
          >
            <div
              v-if="school.defaultImageUri"
              class="school-card-bg"
              :style="{ backgroundImage: `url(${school.defaultImageUri})` }"
            >
              <div class="school-card-overlay">
                <div class="school-card-header">
                  <ClientOnly>
                    <div class="school-name">{{ school.name }}</div>
                  </ClientOnly>
                </div>

                <div class="d-flex-col">
                  <div
                    class="d-flex align-center ga-2 flex-wrap my-4 justify-space-start"
                  >
                    <v-chip
                      v-if="school.countryTitle && school.countryTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >
                      {{ school.countryTitle }}
                    </v-chip>
                    <v-chip
                      v-if="school.stateTitle && school.stateTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >{{ school.stateTitle }}</v-chip>
                    <v-chip
                      v-if="school.cityTitle && school.cityTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >United {{ school.cityTitle }}</v-chip>
                  </div>
                  <div class="d-flex align-strach justify-space-between pt-2">
                    <div
                      class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                    >
                      Score:
                      <v-icon color="primary"> mdi-star </v-icon>
                      {{ school.score ? school.score.toFixed(1) : "New" }}
                    </div>
                    <v-divider
                      :thickness="1"
                      class="border-opacity-100 primary-gray-300 w-100"
                      vertical
                    />
                    <div
                      class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                    >
                      <v-icon color="rgba(52, 64, 84, 1)">mdi-update</v-icon>
                      <span class="primary-gray-600">
                        {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="card-school"
            >
              <div class="school-card-overlay">
                <div class="school-card-header">
                  <div class="school-name">{{ school.name }}</div>
                </div>

                <div class="d-flex-col">
                  <div
                    class="d-flex align-center ga-2 flex-wrap my-6 justify-space-start"
                  >
                    <v-chip
                      v-if="school.countryTitle && school.countryTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >
                      {{ school.countryTitle }}
                    </v-chip>
                    <v-chip
                      v-if="school.stateTitle && school.stateTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >{{ school.stateTitle }}</v-chip>
                    <v-chip
                      v-if="school.cityTitle && school.cityTitle.length > 0"
                      class="text-subtitle-1"
                      variant="flat"
                      density="comfortable"
                      color="rgba(52, 64, 84, 1)"
                    >United {{ school.cityTitle }}</v-chip>
                  </div>
                  <div
                    class="w-100 d-flex align-strach justify-space-between pt-2"
                  >
                    <div
                      class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                    >
                      Score:
                      <v-icon color="primary"> mdi-star </v-icon>
                      {{ school.score ? school.score.toFixed(1) : "N/A" }}
                    </div>
                    <v-divider
                      :thickness="1"
                      class="border-opacity-100 primary-gray-300 w-100"
                      vertical
                    />
                    <div
                      class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                    >
                      <v-icon color="rgba(52, 64, 84, 1)">mdi-update</v-icon>
                      <span class="primary-gray-600">
                        {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="line-seperator" />
            <div
              class="w-100 d-flex justify-space-between align-center px-1"
              style="background: rgba(249, 250, 251, 0.7)"
            >
              <div class="d-flex align-center">
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasLocation"
                >
                  <v-icon
                    size="large"
                    color="rgba(52, 64, 84, 1)"
                  >
                    mdi-map-marker
                  </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasPhone"
                >
                  <v-icon
                    size="large"
                    color="rgba(52, 64, 84, 1)"
                  >
                    mdi-phone
                  </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasEmail"
                >
                  <v-icon
                    size="large"
                    color="rgba(52, 64, 84, 1)"
                  >
                    mdi-email
                  </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasWebsite"
                >
                  <v-icon
                    size="large"
                    color="rgba(52, 64, 84, 1)"
                  >
                    mdi-web
                  </v-icon>
                </v-btn>
              </div>
              <div
                class="d-flex align-center px-1 h-100"
                style="color: rgba(52, 64, 84, 1)"
              >
                <div class="font-size-12">Details</div>
                <v-icon
                  color="rgba(52, 64, 84, 1)"
                  style="line-height: unset; margin-inline-start: 4px"
                >
                  mdi-chevron-right
                </v-icon>
              </div>
            </div>
          </NuxtLink>
        </template>

        <div
          ref="lineSpecifierLoadMoreRef"
          class="line-specifier-load-more"
        />

        <CardSchoolSkeleton v-if="isPaginationLoading" />
        <div
          v-if="!isInitialLoading && schoolList.length == 0"
          class="not-found-div"
        >
          Opps! no data found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

import CardSchoolSkeleton from '../CardSchoolSkeleton.vue'

const props = defineProps({
  schoolList: {
    type: Array,
    required: true,
  },
  isInitialLoading: {
    type: Boolean,
    required: true,
  },
  isPaginationLoading: {
    type: Boolean,
    required: true,
  },
  isPaginationPreviousLoading: {
    type: Boolean,
    required: true,
  },
  isAllDataLoaded: {
    type: Boolean,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    required: true,
  },
  pageNumberForLoadPreviousData: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['loadNextPage', 'loadPreviousPage'])

const { $slugGenerator } = useNuxtApp()

const lineSpecifierLoadMoreRef = ref(null)
const scrollDivRef = ref(null)

onMounted(() => {
  setupScrollListener()
})

onUnmounted(() => {
  if (scrollDivRef.value) {
    scrollDivRef.value.removeEventListener('scroll', handleScrollListener)
  }
})

const setupScrollListener = () => {
  scrollDivRef.value.addEventListener('scroll', handleScrollListener)
}

const handleScrollListener = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  const rect = targetDiv.getBoundingClientRect()
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (
    isDivInView
    && !props.isInitialLoading
    && !props.isPaginationLoading
    && !props.isAllDataLoaded
  ) {
    emit('loadNextPage')
  }
}

const loadPreviousPage = () => {
  emit('loadPreviousPage')
}
</script>

<style lang="scss" scoped>
@use "../../../assets/scss//app.scss" as style;

// comment import css-file &  using particular styles for Mobile-Desktop view
/* @import "../../../assets/scss/school/list.scss"; */

.main-list-school-div {
  width: 100%;
  padding: 40px 5px 0 5px;
  transition: all 0.5s;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
  overflow-y: auto;
  @include style.responsive-size(
    background-color,
    #f2f4f7,
    white,
    white,
    white
  );

  .container-list-div {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-width: 1600px;

    .container-scroll {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      row-gap: 20px;
      padding: 0 20px 20px 20px;
      @include style.responsive-size(
        padding,
        0 20px 20px 20px,
        0 20px 20px 20px,
        0 20px 20px 20px,
        0 10px 20px 10px
      );

      .card-school {
        width: 100%;
        min-height: fit-content;
        background-color: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .name-address-image {
          padding: 16px;
          width: 100%;
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          row-gap: 20px;
          min-height: 130px;
          position: relative;
          @include style.responsive-size(
            justify-content,
            space-between,
            space-between,
            space-between,
            center
          );

          .name-div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            row-gap: 20px;
          }

          .img-div {
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            z-index: 0;
          }
        }

        .line-seperator {
          width: 100%;
          height: 1px;
          background-color: rgba(242, 244, 247, 1);
        }
      }

      .line-specifier-load-more {
        width: 100%;
        height: 6px;
        // background-color: red;
      }

      .not-found-div {
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }

  .container-button-load-previous-data {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    z-index: 3;
    @include style.responsive-size(
      background-color,
      #f2f4f7,
      white,
      white,
      white
    );
  }
}

.closed-list {
  width: 550px;
  position: absolute;
  right: 0;
  top: 100px;
  padding: 40px 10px;
  height: calc(100% - 100px);

  .container-list-div {
    height: 100%;

    .container-scroll {
      padding: 0 10px 20px 10px;

      .card-school {
        padding: 10px;
      }
    }
  }
}
.card-school:not(.school-card-bg) {
  outline: 1px solid rgba(252, 241, 241, 0.975);
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}

:deep(.school-card-overlay) {
  outline: 1px solid rgba(252, 241, 241, 0.87);
  outline-style: auto;
}

.school-card-bg {
  position: relative;
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.school-card-overlay {
  width: inherit !important;
  background: rgba(255, 255, 255, 0.87);
  padding: 15px 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
}

.school-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.school-name {
  font-family: Inter;
  font-weight: 600;
  font-style: Semi Bold;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0%;
}
</style>
