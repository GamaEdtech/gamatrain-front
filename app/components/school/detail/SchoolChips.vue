<template>
  <div class="d-flex">
    <v-sheet class="chips-container">
      <!-- School location chips::start -->
      <v-chip
        v-for="chip in locationChips"
        :key="chip.key"
        :class="chipClass"
        :to="buildSchoolListUrl(chip.key, props.contentData)"
      >
        <div :class="chipContentClass">
          <span class="badge-item">
            <v-icon
              v-show="chip.rank"
              :color="chip.iconColor"
              size="large"
            >
              md:workspace_premium
            </v-icon>
          </span>

          <span v-show="chip.rank">#{{ chip.rank }}</span>
          <span>{{ chip.title }}</span>
        </div>
      </v-chip>
      <!-- School location chips::end -->

      <!-- School filter chips::start -->
      <v-chip
        v-for="chip in filterChips"
        :key="chip.title"
        :to="chip.url"
        :class="chipClass"
      >
        {{ chip.title }}
      </v-chip>
      <!-- School filter chips::end -->
    </v-sheet>
  </div>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})

const chipClass = 'bg-grey100 text-grey600 mr-1 text-h6'
const chipContentClass = 'd-flex ga-1'

const locationChips = computed(() => [
  {
    key: 'country',
    title: props.contentData.countryTitle,
    rank: props.contentData.countryRank,
    iconColor: '#FA0369',
  },
  {
    key: 'state',
    title: props.contentData.stateTitle,
    rank: props.contentData.stateRank,
    iconColor: '#FB6514',
  },
  {
    key: 'city',
    title: props.contentData.cityTitle,
    rank: props.contentData.cityRank,
    iconColor: '#4E5BA6',
  },
].filter(item => item.title))

const filterChips = computed(() => [
  {
    title: props.contentData.schoolType?.name,
  },
  {
    title: props.contentData.school_type_title,
    url: `/school?school_type=${props.contentData.school_type}`,
  },
  {
    title: props.contentData.section_title,
    url: `/school?section=${props.contentData.section}`,
  },
  {
    title: props.contentData.sex_title,
    url: `/school?coed_status=${props.contentData.sex}`,
  },
].filter(item => item.title))

function buildSchoolListUrl(type, data) {
  const query = {}
  if (data.countryId) query.country = data.countryId
  if (type === 'state' || type === 'city') {
    if (data.stateId) query.state = data.stateId
  }
  if (type === 'city') {
    if (data.cityId) query.city = data.cityId
  }
  const params = new URLSearchParams(query).toString()
  return `/school?${params}`
}
</script>

<style scoped>
.chips-container {
  white-space: nowrap;
  overflow-x: auto;
  padding-top: 0.4rem;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: transparent transparent;
  /* Firefox */
}

.badge-item {
  background-color: white;
  z-index: 10;
  border-radius: 10px;
}

/* Webkit (Chrome, Safari) */
.chips-container::-webkit-scrollbar {
  width: 5px;
  /* Adjust width as needed */
}

.chips-container::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.chips-container::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
