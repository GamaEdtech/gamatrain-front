<template>
  <div>
    <div class="d-flex">
      <div class="gtext-h5 primary-gray-600">
        <div class="mb-4">
          Facilities
        </div>
        <div v-if="!initialLoading">
          <v-btn
            v-for="(facility, index) in tags"
            :key="index"
            :class="[
              'mr-2 mb-1',
              facility.selected
                ? 'bg-primary-gray-800 text-white'
                : 'bg-primary-gray-200 text-gray',
            ]"
            height="56"
            width="56"
            flat
          >
            <v-icon
              size="28"
              :color="facility.selected ? `white` : `#98A2B3`"
            >
              md:{{ facility?.icon }}
            </v-icon>
          </v-btn>
        </div>
        <div
          v-else
          class="d-flex flex-wrap ga-2"
        >
          <v-skeleton-loader
            v-for="index in 5"
            :key="index"
            height="56"
            width="56"
          />
        </div>
      </div>
      <v-spacer />
      <div
        class="gtext-t4 primary-blue-500 align-self-center pointer"
        @click="openModal"
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
      <v-card class="rounded-lg">
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="text-h3 font-weight-bold priamry-gray-700">
              Facilities
            </div>
            <v-spacer />
            <v-btn
              variant="text"
              icon
              @click="closeModal"
            >
              <v-icon
                size="26"
                color="#475467"
              >
                md:close
              </v-icon>
            </v-btn>
          </div>
          <v-row class="mt-6">
            <v-col
              v-for="(tag, index) in modalTags"
              :key="index"
              cols="12"
              md="6"
            >
              <v-btn
                :class="[
                  tag.selected
                    ? 'bg-primary-gray-800 text-white'
                    : 'bg-primary-gray-200 text-gray',
                ]"
                height="56"
                width="56"
                flat
                @click="toggleTag(tag)"
              >
                <v-icon
                  size="28"
                  :color="tag.selected ? `white` : `#98A2B3`"
                >
                  md:{{ tag?.icon }}
                </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">{{
                tag?.name
              }}</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-6 mt-10">
          <v-btn
            class="black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            color="primary"
            width="100%"
            max-width="300"
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
const modalTags = ref([])
const loader = ref(false)
const initialLoading = ref(true)
const route = useRoute()
const nuxtApp = useNuxtApp()
const display = useDisplay()

async function getTags() {
  initialLoading.value = true
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
  finally {
    initialLoading.value = false
  }
}

const openModal = () => {
  modalTags.value = tags.value.map(tag => ({ ...tag }))
  facilitiesDialog.value = true
}

const closeModal = () => {
  facilitiesDialog.value = false
  modalTags.value = []
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
      tags.value = modalTags.value
      modalTags.value = []
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
