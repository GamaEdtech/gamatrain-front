<template>
  <div class="w-100 d-flex flex-column">
    <v-row>
      <v-col
        cols="12"
        md="8"
        class="d-flex flex-column"
      >
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            Title
          </div>
          <v-text-field
            v-model="blog.title"
            rounded="lg"
            density="default"
            placeholder="Title"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
          >
            <template #append-inner>
              <v-icon
                color="info"
                size="28"
                class="cursor-pointer"
                @click="showSlugModal = true"
              >
                md:link
              </v-icon>
            </template>
          </v-text-field>
        </div>
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            Abstract
          </div>
          <v-textarea
            v-model="blog.summary"
            rounded="lg"
            density="default"
            placeholder="Enter Here..."
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
            no-resize
            rows="10"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            Main
          </div>
          <common-rich-editor
            v-model="blog.content"
            mode="full"
            :rules="contentRules"
            required
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex flex-column ga-3"
      >
        <div class="extra-data-div bg-grey50 rounded-lg pa-4 d-flex flex-column align-center justify-center ga-3">
          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              State
            </span>
            <common-gombo-box
              v-model="blog.status"
              label=""
              :items="statusItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>

          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              Visibility
            </span>
            <common-gombo-box
              v-model="blog.visibility"
              label=""
              :items="visibilityItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>

          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              Publish time
            </span>
            <common-gombo-box
              v-model="blog.publishTime"
              label=""
              :items="publishTimeItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
          </div>

          <div
            v-if="blog.publishTime == 'Schedule'"
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              Select Date
            </span>
            <v-menu
              v-model="publishDateMenuOpen"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="blog.scheduledDate"
                  readonly
                  v-bind="props"
                  clearable
                  rounded="xl"
                  placeholder="Select Date"
                  density="compact"
                  variant="outlined"
                  autocomplete="off"
                  persistent-clear
                  base-color="grey200"
                  color="primary"
                  active-color="primary"
                  bg-color="white"
                  class="w-100"
                  hide-details
                />
              </template>
              <v-date-picker
                v-model="blog.scheduledDate"
                color="primary"
                @update:model-value="() => (publishDateMenuOpen = false)"
              />
            </v-menu>
          </div>
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-tag-list :categories="blog.categories" />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-keyword-list :keywords="blog.keywords" />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-image-selector :image="blog.image" />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-podcast-selector :podcast="blog.podcast" />
        </div>
      </v-col>
      <v-col
        cols="12"
        class="d-flex justify-center align-center ga-2"
      >
        <v-btn
          color="primary"
          rounded="pill"
          variant="flat"
          class="text-grey900 font-weight-medium text-h5"
          width="150"
        >
          Publish
        </v-btn>
      </v-col>

      <user-blogs-modals-slug
        v-model:show-dialog="showSlugModal"
        @save-slug-successfull="slugSave"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Create blog',
})

const blog = ref({
  title: '',
  content: '',
  summary: '',
  status: 'Drafted',
  visibility: 'General',
  publishTime: 'Immediately',
  categories: [],
  keywords: [],
  image: null,
  scheduledDate: null,
  podcast: null,
})
const publishDateMenuOpen = ref(false)
const showSlugModal = ref(false)

const contentRules = [
  (v: string) => !!v || 'Content is required',
  (v: string) => (v && v.trim() !== '' && v !== '<p></p>') || 'Content cannot be empty',
]
const statusItems = ['Drafted', 'Published', 'Archived']
const visibilityItems = ['General', 'Premium', 'Private']
const publishTimeItems = ['Immediately', 'Schedule']

const slugSave = (slug: string) => {
  console.log(slug)
}
</script>

<style scoped>

</style>
