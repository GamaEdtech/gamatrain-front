<template>
  <div class="w-100 d-flex d-md-none align-start justify-space-between position-sticky bottom-0 mt-2 px-3 pt-3 bottom-nav-menu bg-white">
    <nuxt-link
      v-slot="{ isActive }"
      class="each-menu d-flex align-center justify-start flex-column"
      to="/"
    >
      <v-icon
        size="24"
        color="grey600"
        :class="`rounded-circle pa-4 ${isActive ? `bg-primary50`:``}`"
      >
        {{ isActive ? `md:home`:`md:home_outlined` }}
      </v-icon>
      <span
        v-if="isActive"
        class="text-grey500 text-subtitle-1"
      >Home</span>
    </nuxt-link>

    <div class="each-menu d-flex align-center justify-start flex-column">
      <v-icon
        size="24"
        color="grey600"
        :class="`rounded-circle pa-4 ${isSearchOptionOpen ? `bg-primary50`:``}`"
        @click="changeModalSearchOption"
      >
        {{ isSearchOptionOpen ? `md:grid_view` :`md:grid_view_outlined` }}
      </v-icon>
      <span
        v-if="isSearchOptionOpen"
        class="text-grey500 text-subtitle-1"
      >Category</span>
    </div>

    <div class="each-menu d-flex align-center justify-start flex-column">
      <v-icon
        size="24"
        color="grey600"
        :class="`rounded-circle pa-4 ${isAddOptionOpen ? `bg-primary50`:``}`"
        @click="changeModalAddOption"
      >
        md:add
      </v-icon>
      <span
        v-if="isAddOptionOpen"
        class="text-grey500 text-subtitle-1"
      >Add</span>
    </div>

    <nuxt-link
      v-slot="{ isActive }"
      class="each-menu d-flex align-center justify-start flex-column"
      to="/blog"
    >
      <v-icon
        size="24"
        color="grey600"
        :class="`rounded-circle pa-4 ${isActive ? `bg-primary50`:``}`"
      >
        md:explore_outlined
      </v-icon>
      <span
        v-if="isActive"
        class="text-grey500 text-subtitle-1"
      >blogs</span>
    </nuxt-link>

    <div class="each-menu d-flex align-start flex-column">
      <nuxt-link
        v-if="isAuthenticated"
        to="/user"
        class="pa-1"
      >
        <img
          v-if="user.user.value?.avatarUri"
          width="24"
          height="24"
          class="rounded-circle"
          :src="user.user.value?.avatarUri"
          alt="User Profile"
        >
        <v-icon
          v-else
          size="24"
          color="grey600"
        >
          md:account_circle
        </v-icon>
      </nuxt-link>
      <template
        v-else
      >
        <v-icon
          size="24"
          color="grey600"
          class="pa-4"
          @click="openLoginModal"
        >
          md:account_circle
        </v-icon>
      </template>
    </div>
  </div>
  <menu-search-option-bottom-menu
    v-if="isSearchOptionOpen"
    @close="isSearchOptionOpen = false"
  />

  <lazy-common-modal-base
    v-model:show-dialog="isAddOptionOpen"
    title="What would you like to publish?"
    subtitle="Choose a type. We will prepare the right form for you."
    :max-width="560"
  >
    <menu-add-option-bottom-menu
      @close="isAddOptionOpen = false"
    />
  </lazy-common-modal-base>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { isAuthenticated } = useAuth()
const user = useUser()

const openLoginModal = () => {
  router.push({ query: { auth_form: 'login' } })
}

const isSearchOptionOpen = ref(false)

const isAddOptionOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    isSearchOptionOpen.value = false
    isAddOptionOpen.value = false
  },
)

const changeModalSearchOption = () => {
  isAddOptionOpen.value = false
  isSearchOptionOpen.value = !isSearchOptionOpen.value
}

const changeModalAddOption = () => {
  if (isAuthenticated.value) {
    isSearchOptionOpen.value = false
    isAddOptionOpen.value = !isAddOptionOpen.value
  }
  else {
    router.push({ query: { auth_form: 'login' } })
  }
}
</script>

<style scoped>
.bottom-nav-menu{
  height: 62px;
  z-index: 10;
  box-shadow: -9px -7px 20px 0px #1018282b;;

}
</style>
