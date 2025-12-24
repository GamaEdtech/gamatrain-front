<template>
  <v-navigation-drawer
    v-model="drawerModel"
    mobile-breakpoint="md"
    class="bg-grey50 navigation-height-top"
  >
    <v-list
      v-model:opened="openedGroups"
      density="compact"
      nav
      class="main-list px-0"
    >
      <div
        v-for="unit in units"
        :key="unit.title"
      >
        <v-list-group
          :key="unit.title"
          :value="unit.id"
        >
          <template #activator="{ props: activeMenuItem }">
            <v-list-item
              v-bind="activeMenuItem"
              :class="`rounded-lg mt-3`"
            >
              <v-list-item-title
                class="text-h5 font-weight-bold text-grey700 text-item-height"
              >
                {{ unit.title }}
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="chapter in unit.chapters"
            :key="chapter.id"
            :class="`py-2`"
          >
            <v-list-item-title
              class="text-h5 font-weight-medium text-grey700 text-item-height"
            >
              {{ chapter.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useRoute } from 'vue-router'
import type { UnitLessonDTO } from '~/types/api'

interface LessonTree {
  showDrawer: boolean
  units: UnitLessonDTO[]
}

const props = defineProps<LessonTree>()
const emit = defineEmits(['update:showDrawer'])

const drawerModel = computed({
  get: () => props.showDrawer,
  set: value => emit('update:showDrawer', value),
})

// const route = useRoute()

const openedGroups = ref([])
</script>

<style scoped>
.navigation-height-top {
  top: 0px !important;
  height: 100% !important;
}
@media (min-width: 960px) {
  .navigation-height-top {
    top: 0 !important;
    position: relative !important;
    left: 0 !important;
    border : none !important
  }
}

:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 16px !important;
}
.text-item-height {
  line-height: 26px !important;
}
.custom-list-item {
  background-color: #d0d5dd;
}

.size-custom-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  opacity: 0.8;
}

.main-list {
  min-height: 100%;
}
</style>
