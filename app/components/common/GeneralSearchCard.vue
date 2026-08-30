<template>
  <NuxtLink
    :to="createLink()"
    class="w-100 d-flex flex-wrap align-start justify-start ga-2 px-4 py-8"
  >
    <div class="w-100 d-flex align-center align-md-start justify-start ga-2">
      <div
        class="icon-div rounded-circle d-flex align-center justify-center"
        :style="{ backgroundColor: category.backgroundColor }"
      >
        <span :class="`icon-span ${category.iconName}`" />
      </div>
      <div class="d-flex flex-column align-start justify-center ga-4">
        <span class="text-h5 text-sm-h4 font-weight-bold">{{
          information.title || information.name || information.fullName
        }}</span>
        <span
          v-if="information.summary"
          class="d-none d-sm-flex text-h5 primary-gray-500"
        >{{ information.summary }}</span>
        <div class="d-flex align-center ga-2">
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
        <div class="d-none d-sm-flex flex-wrap align-center ga-2">
          <v-chip
            v-if="information.section_title"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
            color="#F2F4F7"
            :to="`/search?type=${
              category.typePaper ? category.typePaper : `paper`
            }&section=${information.section}`"
          >
            {{ information?.section_title }}
          </v-chip>
          <v-chip
            v-if="information.base_title"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
            color="#F2F4F7"
            :to="`/search?type=${
              category.typePaper ? category.typePaper : `paper`
            }&section=${information.section}&base=${information.base}`"
          >
            {{ information?.base_title }}
          </v-chip>
          <v-chip
            v-if="information.lesson_title"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
            color="#F2F4F7"
            :to="`/search?type=${
              category.typePaper ? category.typePaper : `paper`
            }&section=${information.section}&base=${information.base}&lesson=${
              information.lesson
            }`"
          >
            {{ information.lesson_title }}
          </v-chip>

          <v-chip
            v-if="information.countryTitle"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
            color="#F2F4F7"
          >
            {{ information?.countryTitle }}
          </v-chip>
          <v-chip
            v-if="information.stateTitle"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
            color="#F2F4F7"
          >
            {{ information?.stateTitle }}
          </v-chip>
          <v-chip
            v-if="information.cityTitle"
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
            color="#F2F4F7"
          >
            {{ information.cityTitle }}
          </v-chip>

          <template v-if="information.skills && information.skills.length > 0">
            <v-chip
              v-for="skill in information.skills.slice(0, 3)"
              :key="skill"
              variant="flat"
              class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
              color="#F2F4F7"
            >
              {{ skill }}
            </v-chip>
          </template>

        </div>
      </div>
    </div>

    <div class="d-flex d-sm-none w-100 flex-wrap align-center ga-2">
      <span
        v-if="information.summary"
        class="text-h5 primary-gray-500"
      >{{
        information.summary
      }}</span>
      <v-chip
        v-if="information.section_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
        color="#F2F4F7"
        :to="`/search?type=${
          category.typePaper ? category.typePaper : `paper`
        }&section=${information.section}`"
      >
        {{ information?.section_title }}
      </v-chip>
      <v-chip
        v-if="information.base_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
        color="#F2F4F7"
        :to="`/search?type=${
          category.typePaper ? category.typePaper : `paper`
        }&section=${information.section}&base=${information.base}`"
      >
        {{ information?.base_title }}
      </v-chip>
      <v-chip
        v-if="information.lesson_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
        color="#F2F4F7"
        :to="`/search?type=${
          category.typePaper ? category.typePaper : `paper`
        }&section=${information.section}&base=${information.base}&lesson=${
          information.lesson
        }`"
      >
        {{ information.lesson_title }}
      </v-chip>

      <v-chip
        v-if="information.countryTitle"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
        color="#F2F4F7"
      >
        {{ information?.countryTitle }}
      </v-chip>
      <v-chip
        v-if="information.stateTitle"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
        color="#F2F4F7"
      >
        {{ information?.stateTitle }}
      </v-chip>
      <v-chip
        v-if="information.cityTitle"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
        color="#F2F4F7"
      >
        {{ information.cityTitle }}
      </v-chip>
      <template v-if="information.skills && information.skills.length > 0">
        <v-chip
          v-for="skill in information.skills.slice(0, 3)"
          :key="skill"
          variant="flat"
          class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
          color="#F2F4F7"
        >
          {{ skill }}
        </v-chip>
      </template>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  information: {
    type: Object,
    default: () => {},
  },
  category: {
    type: Object,
    default: () => {},
  },
})

const getOnlineStatusText = useOnlineStatusText

const createLink = () => {
  let link = ''
  if (props.category.type == 'paper') {
    link = `/${props.category.typePaper}/${props.information.id}/${props.information.title_url}`
  }
  else if (props.category.type == 'school') {
    link = `/school/${props.information.id}/${props.information.slug}`
  }
  else if (props.category.type == 'blog') {
    link = `/blog/${props.information.id}/${props.information.slug}`
  }
  else if (props.category.type == 'teacher') {
    link = `/profile/${props.information.handle}`
  }
  return link
}
</script>

<style scoped>
.icon-div {
  min-width: 60px;
  min-height: 60px;
}
.icon-span {
  font-size: 36px;
  color: #ffffff;
}

@media only screen and (max-width: 600px) {
  .icon-div {
    min-width: 40px;
    min-height: 40px;
  }
  .icon-span {
    font-size: 26px;
  }
}
</style>
