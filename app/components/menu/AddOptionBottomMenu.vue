<template>
  <div
    class="custom-overlay d-flex align-end position-fixed w-100"
    @click="clickOnOverlay"
  >
    <div
      class="search-container w-100 bg-white rounded-t-xl d-flex flex-column align-center pa-4"
      @click="clickOnModal"
    >
      <div class="w-100 d-flex justify-end">
        <v-icon
          size="x-large"
          color="grey400"
          @click="close"
        >
          md:close
        </v-icon>
      </div>
      <div class="w-100 d-flex flex-column ga-2 mt-4 pa-3 overflow-y-auto overflow-x-hidden">
        <nuxt-link
          v-for="(item, index) in addOptions"
          :key="index"
          :to="item.path"
          class="w-100 card-option d-flex align-center ga-2"
        >
          <span
            v-if="item.icon"
            class="icon-add text-grey700"
            :class="item.icon"
          />
          <v-icon
            v-if="item.iconMd"
            color="grey700"
            size="24"
          >
            {{ item.iconMd }}
          </v-icon>

          <span class="text-grey700 text-h5 font-weight-bold">{{ item.title }}</span>

          <v-icon
            color="grey700"
            size="20"
          >
            md:chevron_forward
          </v-icon>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const addOptions = [
  {
    path: '/user/paper/create',
    title: 'Past Paper',
    icon: 'icon-paper',
  },
  {
    path: '/user/question/create',
    title: 'Q & A',
    icon: 'icon-q-a',
  },
  {
    path: '/user/multimedia/create',
    title: 'Multimedia',
    icon: 'icon-multimedia',
  },
  {
    path: '/user/blogs/create',
    title: 'Blogs',
    iconMd: 'md:art_track',
  },
  {
    path: '/school/add',
    title: 'Schools',
    icon: 'icon-school',
  },

]

const close = () => {
  emit('close')
}

const clickOnOverlay = () => {
  emit('close')
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}
</script>

<style scoped>
.custom-overlay{
  height: calc(100% - 62px);
  background-color: rgba(0, 0, 0, 0.32);
  z-index: 10000;
}
.search-container{
  height: 70%;
}

.card-option{
  height: 60px;
}
.icon-add{
  font-size: 24px;
}
</style>
