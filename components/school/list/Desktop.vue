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
            v-for="(item, index) in 4"
            :key="index"
          />
        </template>

        <CardSchoolSkeleton v-if="isPaginationPreviousLoading" />

        <template v-if="!isInitialLoading">
          <NuxtLink
            v-for="(school, index) in schoolList"
            :key="school.id || index"
            class="card-school"
            :to="`/school/${school.id}/${$slugGenerator(school.name)}`"
          >
            <div class="name-address-image">
              <div class="name-div">
                <span class="name gtext-t4 font-weight-semibold">{{
                  school.name
                }}</span>
                <div class="d-flex align-center justify-start flex-wrap ga-3">
                  <v-chip
                    v-if="school.countryTitle && school.countryTitle.length > 0"
                    class="text-subtitle-1"
                    variant="elevated"
                    color="#546e7a"
                  >
                    {{ school.countryTitle }}
                  </v-chip>
                  <v-chip
                    v-if="school.stateTitle && school.stateTitle.length > 0"
                    class="text-subtitle-1"
                    variant="elevated"
                    color="#546e7a"
                  >{{ school.stateTitle }}</v-chip>
                  <v-chip
                    v-if="school.cityTitle && school.cityTitle.length > 0"
                    class="text-subtitle-1"
                    variant="elevated"
                    color="#546e7a"
                  >United {{ school.cityTitle }}</v-chip>
                </div>
              </div>
              <div
                v-if="school.defaultImageUri && isExpanded"
                class="img-div d-none d-md-block"
              >
                <NuxtImg
                  v-show="school.defaultImageUri"
                  alt="school.name"
                  width="180px"
                  :src="school.defaultImageUri?.replace(/^http:\/\//, 'https://')"
                  placeholder
                  class="h-100"
                />
              </div>
            </div>
            <div class="line-seperator" />
            <div
              class="w-100 d-flex align-center justify-space-between mt-3 flex-wrap ga-5"
            >
              <div class="d-flex align-center">
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasLocation"
                >
                  <v-icon size="x-large"> mdi-map-marker </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasPhon"
                >
                  <v-icon size="x-large"> mdi-phone </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasEmail"
                >
                  <v-icon size="x-large"> mdi-email </v-icon>
                </v-btn>
                <v-btn
                  variant="text"
                  icon
                  :disabled="!school.hasWebsite"
                >
                  <v-icon size="x-large"> mdi-web </v-icon>
                </v-btn>
              </div>
              <div class="d-flex align-center ga-2">
                <div
                  class="d-flex align-center ga-2 gtext-t6 font-weight-semibold"
                >
                  <v-icon
                    size="x-large"
                    color="primary"
                  > mdi-star </v-icon>
                  {{ school.score ? school.score.toFixed(1) : "New" }}
                </div>
                <div class="d-flex align-center ga-2 gtext-t6 primary-gray-300">
                  <v-icon size="x-large">mdi-update</v-icon>
                  <span class="primary-gray-600">
                    {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                  </span>
                </div>
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
    padding: 40px 20px 0 20px;
    transition: all 0.5s;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 auto;
    overflow-y: auto;
    @include style.responsive-size(background-color, #f2f4f7, white, white, white);

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
                min-height: 232px;
                background-color: white;
                border-radius: 4px;
                box-shadow:
                    0 3px 1px -2px rgba(0, 0, 0, 0.2),
                    0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                padding: 16px;
                .name-address-image {
                    width: 100%;
                    display: flex;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    row-gap: 20px;
                    min-height: 130px;
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
                        min-width: 180px;
                        height: 130px;
                    }
                }
                .line-seperator {
                    width: 100%;
                    height: 2px;
                    background-color: #e4e6e9;
                    margin-top: 10px;
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
        @include style.responsive-size(background-color, #f2f4f7, white, white, white);
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
</style>
