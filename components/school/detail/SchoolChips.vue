<template>
  <div class="d-flex">
    <v-sheet class="chips-container">
      <v-chip
        v-show="localContentData.countryTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
        :to="buildSchoolListUrl('country', localContentData)"
      >
        {{ localContentData.countryTitle }}
      </v-chip>
      <v-chip
        v-show="localContentData.stateTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
        :to="buildSchoolListUrl('state', localContentData)"
      >
        {{ localContentData.stateTitle }}
      </v-chip>
      <v-chip
        v-show="localContentData.cityTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
        :to="buildSchoolListUrl('city', localContentData)"
      >
        {{ localContentData.cityTitle }}
      </v-chip>
      <v-chip
        v-if="localContentData.schoolType && localContentData.schoolType.name"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData?.schoolType?.name }}
      </v-chip>
      <v-chip
        v-if="localContentData.school_type_title"
        :to="`/school?school_type=${localContentData.school_type}`"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.school_type_title }}
      </v-chip>
      <v-chip
        v-if="localContentData.section_title"
        :to="`/school?section=${localContentData.section}`"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.section_title }}
      </v-chip>
      <v-chip
        v-if="localContentData.sex_title"
        :to="`/school?coed_status=${localContentData.sex}`"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.sex_title }}
      </v-chip>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})

const localContentData = ref(props.contentData)

watch(
  () => props.contentData,
  (newContent) => {
    localContentData.value = newContent
  },
  { deep: true },
)

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
  width: 75%;
  padding-top: 0.4rem;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: transparent transparent;
  /* Firefox */
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
