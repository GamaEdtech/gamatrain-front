<template>
  <!-- Hidden while empty; it's asked for in the "Fill in the gaps" card, which opens the editor here. -->
  <section
    :class="['detail-section', { 'd-none': !selected.length }]"
    aria-labelledby="facilities-title"
  >
    <div class="section-head">
      <h2
        id="facilities-title"
        class="section-title"
      >
        Facilities
      </h2>
      <v-btn
        variant="text"
        color="info"
        size="small"
        class="text-none gtext-t5 px-2 section-action"
        @click="openModal"
      >
        Edit
      </v-btn>
    </div>
    <div
      class="d-flex flex-wrap ga-2"
    >
      <v-chip
        v-for="facility in selected"
        :key="facility.id"
        :prepend-icon="`mdfull:${facility.icon}`"
        color="secondary"
        variant="flat"
        label
        size="large"
        class="bg-grey50 font-weight-medium gtext-t5"
      >
        {{ facility.name }}
      </v-chip>
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
          <div class="d-flex align-center">
            <div class="text-h3 font-weight-bold">
              Which facilities does this school have?
            </div>
            <v-spacer />
            <v-btn
              variant="text"
              icon
              aria-label="Close"
              @click="closeModal"
            >
              <v-icon
                size="26"
                color="grey600"
              >
                md:close
              </v-icon>
            </v-btn>
          </div>
          <div
            v-if="catalogLoading"
            class="d-flex flex-wrap ga-2 mt-6"
          >
            <v-skeleton-loader
              v-for="index in 8"
              :key="index"
              height="56"
              width="200"
            />
          </div>
          <v-row
            v-else
            class="mt-6"
          >
            <v-col
              v-for="tag in modalTags"
              :key="tag.id"
              cols="12"
              md="6"
            >
              <v-btn
                block
                height="56"
                :variant="tag.selected ? 'flat' : 'tonal'"
                :color="tag.selected ? 'secondary' : 'grey500'"
                :prepend-icon="tag.selected ? 'mdi-check' : `mdfull:${tag.icon}`"
                :aria-pressed="tag.selected"
                class="justify-start text-none font-weight-medium gtext-t4"
                @click="tag.selected = !tag.selected"
              >
                {{ tag.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-6 mt-4">
          <v-btn
            class="text-none gtext-t4 font-weight-medium"
            rounded
            color="primary"
            width="100%"
            max-width="300"
            size="x-large"
            variant="flat"
            :loading="loader"
            :disabled="catalogLoading"
            @click="saveFacilities"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/composables/display'

const props = defineProps({
  facilities: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['facilities-updated'])

const route = useRoute()
const nuxtApp = useNuxtApp()
const display = useDisplay()
const { requireSignIn } = useContributeGate()

// What the school has comes with the school itself (id, name, icon), so it renders on the server.
const selected = ref([...(props.facilities || [])])
const catalog = ref([])
const modalTags = ref([])
const catalogLoading = ref(false)
const facilitiesDialog = ref(false)
const loader = ref(false)

watch(() => props.facilities, (val) => {
  selected.value = [...(val || [])]
})

async function loadCatalog() {
  if (catalog.value.length) return true
  catalogLoading.value = true
  try {
    const res = await useApiService.get('/api/v2/tags/School', undefined, { public: true })
    catalog.value = res.data || []
    return true
  }
  catch (err) {
    console.error('Error fetching school tags:', err)
    nuxtApp.$toast?.error('Failed to load facilities')
    return false
  }
  finally {
    catalogLoading.value = false
  }
}

async function openModal() {
  if (!requireSignIn()) return
  facilitiesDialog.value = true
  if (!(await loadCatalog())) {
    facilitiesDialog.value = false
    return
  }
  const selectedIds = new Set(selected.value.map(item => item.id))
  modalTags.value = catalog.value.map(tag => ({ ...tag, selected: selectedIds.has(tag.id) }))
}

function closeModal() {
  facilitiesDialog.value = false
}

async function saveFacilities() {
  const chosen = modalTags.value.filter(tag => tag.selected)
  loader.value = true
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/contributions`,
      { tags: chosen.map(tag => tag.id) },
    )
    if (response.succeeded) {
      selected.value = chosen
      nuxtApp.$toast?.success('Thank you! Your contribution has been submitted and is pending review.')
      facilitiesDialog.value = false
      emit('facilities-updated')
    }
    else {
      nuxtApp.$toast?.error(response?.errors?.[0]?.message || 'Failed to update facilities')
    }
  }
  catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
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

defineExpose({ openModal })
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>
