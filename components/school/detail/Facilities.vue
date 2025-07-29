<template>
  <div>
    <div class="d-flex">
      <div class="gtext-h5 primary-gray-600">
        <div class="mb-4">
          Facilities
        </div>
        <div>
          <v-btn
            v-for="(facility, index) in displayFacilities"
            :key="index"
            :class="[
              'mr-2 mb-1',
              facility.selected
                ? 'bg-primary-gray-800 text-white'
                : 'bg-primary-gray-300 text-gray',
            ]"
            height="56"
            width="56"
          >
            <v-icon size="24">
              mdi-{{ facility?.icon }}
            </v-icon>
          </v-btn>
        </div>
      </div>
      <v-spacer />
      <div
        class="gtext-t4 primary-blue-500 align-self-center pointer"
        @click="facilitiesDialog = true"
      >
        Contribute
      </div>
    </div>

    <v-dialog
      v-model="facilitiesDialog"
      transition="dialog-bottom-transition"
      :fullscreen="display.xs.value"
      max-width="720"
      style="z-index: 20001"
    >
      <v-card>
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">
              Facilities
            </div>
            <v-spacer />
            <v-btn
              variant="text"
              icon
              @click="facilitiesDialog = false"
            >
              <v-icon size="20">
                mdi-close
              </v-icon>
            </v-btn>
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col
              v-for="(tag, index) in tags"
              :key="index"
              cols="12"
              md="6"
            >
              <v-btn
                :class="[
                  tag.selected
                    ? 'bg-primary-gray-800 text-white'
                    : 'bg-blue-grey-lighten-4 text-gray',
                ]"
                height="56"
                width="56"
                @click="toggleTag(tag)"
              >
                <v-icon size="24">
                  mdi-{{ tag?.icon }}
                </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">{{
                tag?.name
              }}</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn
            class="black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            color="primary"
            width="100%"
            max-width="400"
            size="x-large"
            variant="flat"
            :loading="loader"
            @click="saveFacilities"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app'
import { useDisplay } from 'vuetify/lib/composables/display'

const props = defineProps({
  facilities: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['facilities-updated', 'open-auth-dialog'])

const tags = ref([])
const facilitiesDialog = ref(false)
const selectedTags = ref([])
const loader = ref(false)
const route = useRoute()
const nuxtApp = useNuxtApp()
const display = useDisplay()

const displayFacilities = computed(() =>
  tags.value.filter(tag => tag.selected),
)

async function getTags() {
  try {
    const res = await useApiService.get('/api/v2/tags/School')
    tags.value = res.data.map((tag) => {
      const isSelected
        = props.facilities
          && props.facilities.some(facility => facility.id === tag.id)
      return {
        ...tag,
        selected: isSelected,
      }
    })
    selectedTags.value = tags.value
      .filter(tag => tag.selected)
      .map(tag => tag.id)
  }
  catch (err) {
    console.error('Error fetching school tags:', err)
    nuxtApp.$toast?.error('Failed to load facilities')
  }
}

function toggleTag(tag) {
  tag.selected = !tag.selected
  if (tag.selected) {
    selectedTags.value.push(tag.id)
  }
  else {
    selectedTags.value = selectedTags.value.filter(id => id !== tag.id)
  }
}

async function saveFacilities() {
  loader.value = true
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/contributions`,
      { tags: selectedTags.value },
    )
    if (response.succeeded) {
      nuxtApp.$toast?.success(
        'Your contribution has been successfully submitted',
      )
      facilitiesDialog.value = false
      emit('facilities-updated')
    }
    else {
      nuxtApp.$toast?.error(
        response?.errors?.[0]?.message || 'Failed to update facilities',
      )
    }
  }
  catch (err) {
    if (
      err.response
      && (err.response.status === 401 || err.response.status === 403)
    ) {
      nuxtApp.$toast?.error('Please login to update facilities')
    }
    else {
      nuxtApp.$toast?.error('Failed to update facilities')
    }
  }
  finally {
    loader.value = false
  }
}

onMounted(getTags)
</script>
