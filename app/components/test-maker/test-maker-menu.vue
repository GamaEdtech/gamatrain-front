<template>
  <!-- Test maker menu -->
  <div class="test-maker-menu-wrapper">
    <!-- Fixed bottom navigation bar -->
    <v-bottom-navigation
      v-model="active_tab"
      color="teal"
      bg-color="teal"
      class="test-maker-menu"
      height="64"
      active
    >
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        :disabled="item.status"
        :value="index"
        class="mt-1"
        @click="openLink(item)"
      >
        <template #prepend>
          <v-icon
            size="24px"
            color="white"
            class="bg-transparent"
          >
            {{ item.icon }}
          </v-icon>
        </template>
        <template #default>
          <span class="text-white font-weight-bold text-caption mt-1 mb-2">{{ item.title }}</span>
        </template>
      </v-btn>
    </v-bottom-navigation>

    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-list-item
          v-for="sub_item in subList"
          :key="sub_item.title"
          :to="sub_item.link"
          @click="sheet = false"
        >
          <template #prepend>
            <v-icon>{{ sub_item.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-h6">
            {{ sub_item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
  <!-- End dashboard mobile menu -->
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const active_tab = ref(0)
const sheet = ref(false)
const subList = ref([])

const items = [
  {
    title: 'MANAGE',
    icon: 'mdi-format-list-checkbox',
    link: '',
    subMenuList: [
      { title: 'My Exams', link: '/user/exam', icon: 'mdi-clipboard-list-outline', icon_type: 'custom', status: true },
      { title: 'Albums', link: '/test-maker', icon: 'mdi-image-album', icon_type: 'custom', status: true },
      { title: 'Results', link: '/exam/results', icon: 'mdi-list-status', icon_type: 'custom', status: true },
    ],
  },
  {
    title: 'NEW EXAM',
    icon: 'mdi-plus-circle-outline',
    link: '/test-maker/create',
  },
  {
    title: 'TEST LIST',
    icon: 'mdi-list-box-outline',
    link: '/test-maker/create',
    query: { active: 'test_list' },
  },
  {
    title: 'ADD NEW TEST',
    icon: 'mdi-plus-circle-outline',
    link: '/test-maker/create',
    query: { active: 'add_test' },
  },
]

const openLink = (item) => {
  if (!item.subMenuList) {
    // Only navigate if the link is not empty
    if (item.link) {
      router.push({
        path: item.link,
        query: item.query || {},
      })
    }
  }
  else {
    subList.value = item.subMenuList
    sheet.value = true
  }
}
</script>

<style lang="scss">
.test-maker-menu-wrapper {
  position: relative;
  width: 100%;
}

.test-maker-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.v-bottom-navigation__content {
  justify-content: space-evenly !important;
  max-width: 25% !important;
}
.v-btn--selected.v-btn--active {
  background-color: rgba(33,186,69,.1) !important;
  border-bottom: 4px solid #fff !important;
  color: #fff !important;
}
.v-bottom-navigation__content > .v-btn {
  min-width: 100% !important;
  margin-block: 0px !important;
  color: red!important;
}
.v-bottom-navigation__content > .v-btn > .v-btn__prepend {
  margin-top: 10px !important;
}

.text-caption {
  font-size: 10px !important;
  font-weight: 500 !important;
  color: hsl(0, 0%, 100%) !important;
}

.v-btn:not(.v-btn--active) .text-caption{
  color: hsla(0, 0%, 100%, .6) !important;
}
</style>
