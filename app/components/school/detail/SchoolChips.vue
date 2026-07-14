<template>
  <div class="d-flex">
    <v-sheet class="chips-container">
      <v-chip
        v-show="localContentData.countryTitle"
        :class="chipClass"
        :to="buildSchoolListUrl('country', localContentData)"
      >
        <div :class="chipContentClass">
          <v-icon
            v-show="localContentData.countryRank"
            color="#FA0369"
          >
            md:workspace_premium
          </v-icon>
          <span v-show="localContentData.countryRank">#{{ localContentData.countryRank }}</span>
          <span>{{ localContentData.countryTitle }}</span>
        </div>
      </v-chip>

      <v-chip
        v-show="localContentData.stateTitle"
        :class="chipClass"
        :to="buildSchoolListUrl('state', localContentData)"
      >
        <div :class="chipContentClass">
          <v-icon
            v-show="localContentData.stateRank"
            color="#FB6514"
          >
            md:workspace_premium
          </v-icon>
          <span v-show="localContentData.stateRank">#{{ localContentData.stateRank }}</span>
          <span>{{ localContentData.stateTitle }}</span>
        </div>
      </v-chip>

      <v-chip
        v-show="localContentData.cityTitle"
        :class="chipClass"
        :to="buildSchoolListUrl('city', localContentData)"
      >
        <div :class="chipContentClass">
          <v-icon
            v-show="localContentData.cityRank"
            color="#4E5BA6"
          >
            md:workspace_premium
          </v-icon>
          <span v-show="localContentData.cityRank">#{{ localContentData.cityRank }}</span>
          <span>{{ localContentData.cityTitle }}</span>
        </div>
      </v-chip>
      <v-chip
        v-if="localContentData.schoolType && localContentData.schoolType.name"
        :class="chipClass"
      >
        {{ localContentData?.schoolType?.name }}
      </v-chip>
      <v-chip
        v-if="localContentData.school_type_title"
        :to="`/school?school_type=${localContentData.school_type}`"
        :class="chipClass"
      >
        {{ localContentData.school_type_title }}
      </v-chip>
      <v-chip
        v-if="localContentData.section_title"
        :to="`/school?section=${localContentData.section}`"
        :class="chipClass"
      >
        {{ localContentData.section_title }}
      </v-chip>
      <v-chip
        v-if="localContentData.sex_title"
        :to="`/school?coed_status=${localContentData.sex}`"
        :class="chipClass"
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

const chipClass = 'bg-grey100 text-grey600 mr-1 text-h6'
const chipContentClass = 'd-flex ga-1'

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
  /* width: 75%; */
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
