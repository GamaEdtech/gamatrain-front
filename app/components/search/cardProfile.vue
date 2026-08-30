<template>
  <div
    class="w-100 card-search rounded-lg px-2 py-4 d-flex flex-wrap ga-3 align-center justify-start position-relative"
  >
    <Nuxt-link
      :to="createLinkCard(information)"
      :prefetch="false"
    >
      <div class="w-100 h-100 ">
        <div class="d-flex ga-3 align-stretch justify-start">
          <div
            class="img-div rounded-ts-lg rounded-bs-lg d-flex align-center justify-center ga-3 flex-column"
          >
            <!-- <NuxtImg
          v-if="information.lesson_pic"
          :alt="information?.title"
          width="100px"
          :src="information.lesson_pic"
          placeholder
          class="w-100 h-100 rounded-ts-lg rounded-bs-lg"
        /> -->
            <v-img
              v-if="information.avatar"
              :alt="information?.fullName"
              width="100px"
              cover
              :src="information.avatar"
              class="w-100 h-100 rounded-ts-lg rounded-bs-lg"
            />
            <template v-else>
              <p class="text-subtitle-1 font-weight-bold text-center">
                {{ information.fullName && information.fullName.trim() ? information.fullName : 'unkhown' }}
              </p>
              <a
                class="text-subtitle-2 text-center"
                href="https://gamatrain.com"
              >Gamatrain.com</a>
            </template>
          </div>
          <div
            class="content-card d-flex flex-column ga-2 align-start justify-center justify-sm-space-between"
          >
            <h2
              class="text-h5 text-sm-h4 text-black font-weight-medium"
            >
              {{ information.fullName && information.fullName.trim() ? information?.fullName : 'unkhown' }}
            </h2>
            <div
              v-if="information.skills"
              class="d-flex align-center justify-start flex-wrap ga-3"
            >
              <v-chip
                v-for="(skill, index) in information.skills.slice(0, 3)"
                :key="index"
                :prefetch="false"
                variant="flat"
                class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
                color="grey100"
              >
                <span class="text-grey500">{{ skill }}</span>
              </v-chip>
            </div>
            <div
              class="d-none d-sm-flex align-center justify-space-between container-extra-info"
            >
              <span
                v-if="information.userRateLevel"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:user_attributes_outlined</v-icon>
                {{ information.userRateLevel }}
              </span>
              <span
                v-if="information.onlineStatus"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:wifi_outlined</v-icon>
                {{ getOnlineStatusText(information.onlineStatus) }}
              </span>

            </div>
          </div>
        </div>
        <div class="d-flex d-sm-none align-center justify-space-between w-100 mt-2">
          <span
            v-if="information.userRateLevel"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:user_attributes_outlined</v-icon>
            {{ information.userRateLevel }}
          </span>
          <span
            v-if="information.onlineStatus"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:wifi_outlined</v-icon>
            {{ information.onlineStatus }}
          </span>

        </div>
      </div>
    </Nuxt-link>
  </div>
</template>

<script setup>
defineProps({
  information: {
    type: Object,
  },
})

const createLinkCard = (information) => {
  return `/profile/${information.handle}`
}

const getOnlineStatusText = useOnlineStatusText
</script>

<style scoped>
.card-search {
  border: 1px solid rgb(var(--v-theme-grey200));
  min-height: 120px;
  max-width: 1200px;
}
.img-div {
  min-width: 100px;
  max-width: 100px;
  height: 120px;
  background-color: #f9f3f3;
}
.container-extra-info {
  width: 400px;
}
</style>
