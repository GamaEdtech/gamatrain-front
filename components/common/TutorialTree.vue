<!-- components/TutorialTree.vue -->
<template>
  <ul class="ml-4">
    <li
      v-for="item in items"
      :key="item.id"
      class="mb-2"
    >
      <div
        class="d-flex align-center"
        :class="{
          'bg-teal text-white': isSubOpen(item.id) && !isRootLevel }"
        style="cursor: pointer"
        @click="menuClicked(item.id)"
      >
        <v-icon
          v-if="isRootLevel"
          color="teal"
          size="small"
          class="mr-2"
        >
          {{ isOpen(item.id) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
        </v-icon>
        <v-icon
          :color="isSubOpen(item.id) && !isRootLevel ? 'white' : 'teal'"
          size="small"
          class="mr-2"
          :class="{
            'text-white': isSubOpen(item.id) && !isRootLevel, // Change icon color to white if open
          }"
        >
          {{ item.chapters ? 'mdi-folder' : 'mdi-file-document-outline' }}
        </v-icon>
        <div>
          <NuxtLink
            v-if="item.tutorials && item.tutorials.length==1 && !isRootLevel"
            :to="`/tutorial/${item.tutorials[0].id}/${$slugGenerator(item.title)}`"
            @click="subTreeClicked(item.id)"
          >
            {{ item.title }}
          </NuxtLink>
          <span
            v-else
            class="font-weight-medium"
          >
            {{ item.title }}
          </span>
        </div>
      </div>

      <transition name="fade">
        <TutorialTree
          v-if="item.chapters && item.chapters.length > 0 && isOpen(item.id)"
          :items="item.chapters"
          :is-root-level="false"
        />
      </transition>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  items: Array,
  isRootLevel: Boolean,
})

const route = useRoute()

const activeMenu = ref(null) // Track the currently MainMenuBtn

const activeSubMenu = ref(null) // Track the currently SubMenuBtn

// Check if the item is open (for button)
const isOpen = id => activeMenu.value === id
const isSubOpen = id => activeSubMenu.value === id

onMounted(() => {
  if (props.isRootLevel === true)
    initOpenMenu()
  else
    initOpenSubMenu()
})

// function to set opened mainMenuBtn after <nuxlink>
const initOpenMenu = () => {
  for (const index in props.items) {
    for (const i in props.items[index].chapters) {
      if (props.items[index].chapters[i]
        && props.items[index].chapters[i].tutorials[0]
        && props.items[index].chapters[i].tutorials[0].id == route.params.id) {
        activeMenu.value = props.items[index].id
        activeSubMenu.value = props.items[index].chapters[i].id
        break
      }
    }
  }
}

// function to set opened subMenuBtn after <nuxlink>
const initOpenSubMenu = () => {
  for (const index in props.items) {
    if (
      props.items[index].tutorials[0]
      && props.items[index].tutorials[0].id == route.params.id) {
      activeMenu.value = props.items[0].id - 1
      activeSubMenu.value = props.items[index].id
      break
    }
  }
}
// open and close mainmenu items
const menuClicked = (item) => {
  if (activeMenu.value == item)
    activeMenu.value = null
  else
    activeMenu.value = item
}
// open and close submenu items
const subTreeClicked = (item) => {
  activeSubMenu.value = item
}
</script>

  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }
  ul{
    list-style: none;
  }

.text-white {
  fill: white;
}

.bg-teal {
  background-color: teal;
  border-radius: 4px;
}
  </style>
