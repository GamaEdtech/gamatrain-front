<template>
  <!-- Start Loader Skeleton -->
  <v-col
    v-if="isLoading"
    cols="12"
    sm="8"
    md="8"
    class="d-flex flex-column"
  >
    <v-skeleton-loader
      v-for="(item, index) in 4"
      :key="`desktop-${index}`"
      type="paragraph"
    />
  </v-col>
  <!-- End Loader Skeleton -->

  <!-- <div class="d-block" v-if="!isLoading && data.length > 0"> -->
  <v-col
    v-if="!isLoading && data.length > 0"
    cols="12"
    sm="8"
    md="8"
  >
    <!-- Start Resource Section -->
    <v-list
      lines="two"
      class="d-block list-item-resource"
    >
      <template
        v-for="(resource, index) in data"
        :key="`desktop-${index}`"
      >
        <v-list-item
          v-if="
            resource.items
              && resource.items.length > 0
              && resource.title != `Topical`
          "
          class="pa-0"
        >
          <template #prepend>
            <v-icon
              v-if="resource.useCustomIcon"
              color="#ffb600"
              size="24"
              :class="resource.icon"
            />
            <v-icon
              v-else
              color="#ffb600"
              size="24"
            >
              {{ getMaterialIcon(resource.icon) }}
            </v-icon>
          </template>

          <v-list-item-title class="text-h6 text-md-h4 font-weight-bold">
            {{ resource.title }}
          </v-list-item-title>
          <div class="container-links">
            <NuxtLink
              v-for="(item, j) in resource.items"
              :key="j"
              class="font-weight-medium primary-subtitle-500"
              :to="`/paper/${item.id}/${item.title_url}`"
            >
              {{
                item.title.length > 50
                  ? item.title.slice(0, 50) + "..."
                  : item.title
              }}.
            </NuxtLink>
          </div>
          <v-divider class="my-2" />
        </v-list-item>
      </template>
    </v-list>
    <!-- End Resource Section -->

    <!-- Start Topical Section -->
    <v-list
      v-if="topicalData.items.length > 0"
      class="d-inline-flex flex-col flex-md-row align-center flex-wrap list-item-resource"
    >
      <v-list-item
        class="pa-0 d-inline-flex flex-row align-center"
        style="min-height: fit-content"
      >
        <template #prepend>
          <v-icon
            color="#ffb600"
            size="24"
          >
            mdi-book-open-variant
          </v-icon>
        </template>

        <v-list-item-title class="text-h6 text-md-h4 font-weight-bold">
          {{ topicalData.label }}
        </v-list-item-title>
      </v-list-item>
      <div class="container-topical-chip">
        <v-chip-group>
          <v-chip
            v-for="(topical, index) in topicalData.items"
            :key="index"
            class="text-h6 text-white bg-grey-lighten-1"
            small
          >
            <NuxtLink :to="`/paper/${topical.id}/${topical.title_url}`">
              {{
                topical.title.length > 50
                  ? topical.title.slice(0, 50) + "..."
                  : topical.title
              }}
            </NuxtLink>
          </v-chip>
        </v-chip-group>
      </div>
    </v-list>
    <!-- End Topical Section -->
  </v-col>
  <!-- </div> -->
</template>

<script setup>
defineProps({
  data: {
    type: Array,
  },
  topicalData: {
    type: Object,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})

const getMaterialIcon = (iconName) => {
  // Map your current icon names to Material Design icon names
  const iconMap = {
    'ExamHub.svg': 'mdi-notebook-edit-outline',
    'PaperIcon.svg': 'mdi-file-document-outline',
    'QA.svg': 'mdi-forum',
    'Guide.svg': 'mdi-sign-direction',
    'Tutorial.svg': 'mdi-book-open-page-variant-outline',
    // Add more mappings as needed
    // Default icon if not found in mapping
    'default': 'mdi-file-outline',
  }

  return iconMap[iconName] || iconMap.default
}
</script>

<style>
.container-links {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: 4px;
  margin-top: 16px;
}
.primary-subtitle-500 {
  color: #2e90fa !important;
  font-weight: 400 !important;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0%;
  vertical-align: middle;
  line-height: 22px;
}
.list-item-resource .v-list-item__prepend {
  align-self: flex-start;
  margin-right: -16px;
}

/* Custom icon styles */
.icon-q-a,
.icon-exam,
.icon-paper,
.icon-tutorial {
  font-size: 24px;
}

.container-topical-chip {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
}

.container-topical-chip .v-chip-group .v-slide-group__content {
  flex-wrap: wrap !important;
}
.container-topical-chip
  .v-item-group
  > .v-slide-group__wrapper
  > .v-slide-group__content {
  flex-wrap: wrap !important;
}
</style>
