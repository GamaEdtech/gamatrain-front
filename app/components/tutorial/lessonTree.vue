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
        v-for="unit in filteredUnits"
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

          <template
            v-for="chapter in unit.chapters"
            :key="chapter.id"
          >
            <v-list-item
              v-if="chapter.tutorials && chapter.tutorials.length > 0"
              :class="`py-2 ${chapter.tutorials[0]?.id == route.params.id ? `bg-white`:``}`"
              :to="`/tutorial/${chapter.tutorials[0]?.id}/${$slugGenerator(
                chapter.tutorials[0]?.title || '')}`"
            >
              <div
                v-show="chapter.tutorials[0]?.id == route.params.id"
                class="active-line h-100 position-absolute left-0 top-0 bg-primary"
              />
              <v-list-item-title
                class="text-h5 font-weight-regular text-grey700 text-item-height"
              >
                {{ chapter.title }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { UnitLessonDTO } from '@/types'

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

const route = useRoute()

const openedGroups = ref<string[]>([])
const filteredUnits = computed(() => {
  return props.units.filter(unit =>
    unit.chapters?.some(chapter => chapter.tutorials && chapter.tutorials.length > 0),
  )
})

const setOpenedGroup = () => {
  const activeUnit = props.units.find(unit =>
    unit.chapters?.some(
      chapter =>
        chapter.tutorials
        && chapter.tutorials.length > 0
        && chapter.tutorials[0]?.id == route.params.id,
    ),
  )

  if (activeUnit) {
    openedGroups.value = [activeUnit.id]
  }
}

onMounted(() => {
  setOpenedGroup()
})
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

.main-list {
  min-height: 100%;
}
.active-line{
  width: 8px;
}
</style>
