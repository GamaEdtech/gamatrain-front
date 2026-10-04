<template>
  <nav
    class="w-100 d-flex d-md-none align-center position-sticky bottom-0 px-1 bottom-nav-menu bg-grey700 rounded-t-xl"
    :class="{ 'bottom-nav-menu--raised': isSearchOptionOpen }"
    aria-label="Main navigation"
  >
    <nuxt-link
      v-slot="{ isActive }"
      class="nav-item flex-1-1-0 h-100 d-flex align-center justify-center flex-column"
      to="/"
    >
      <v-icon
        :size="ICON_SIZE"
        :color="isActive ? `primary`:`white`"
      >
        md:home_outlined
      </v-icon>
      <span :class="`text-subtitle-1 ${isActive ? `text-primary`:`text-grey400`}`">Home</span>
    </nuxt-link>

    <div
      class="nav-item flex-1-1-0 h-100 d-flex align-center justify-center flex-column cursor-pointer"
      role="button"
      :aria-expanded="isSearchOptionOpen"
      @click="changeModalSearchOption"
    >
      <v-icon
        :size="ICON_SIZE"
        :color="isSearchOptionOpen ? `primary`:`white`"
      >
        md:grid_view_outlined
      </v-icon>
      <span :class="`text-subtitle-1 ${isSearchOptionOpen ? `text-primary`:`text-grey400`}`">Explore</span>
    </div>

    <div class="flex-1-1-0 h-100 d-flex justify-center">
      <div
        class="d-flex align-center justify-center mt-n2 container-add rounded-circle bg-primary"
        role="button"
        aria-label="Add"
        @click="changeModalAddOption"
      >
        <v-icon
          size="28"
          color="grey700"
        >
          md:add
        </v-icon>
      </div>
    </div>

    <nuxt-link
      v-slot="{ isActive }"
      class="nav-item flex-1-1-0 h-100 d-flex align-center justify-center flex-column"
      to="/post"
    >
      <v-icon
        :size="ICON_SIZE"
        :color="isActive ? `primary`:`white`"
      >
        md:explore_outlined
      </v-icon>
      <span :class="`text-subtitle-1 ${isActive ? `text-primary`:`text-grey400`}`">Discover</span>
    </nuxt-link>

    <nuxt-link
      v-if="isAuthenticated"
      v-slot="{ isActive }"
      to="/user"
      class="nav-item flex-1-1-0 h-100 d-flex align-center justify-center flex-column"
    >
      <img
        v-if="user.user.value?.avatarUri"
        :width="ICON_SIZE"
        :height="ICON_SIZE"
        :class="`rounded-circle ${isActive ? `active-border`:`deactive-border`}`"
        :src="user.user.value?.avatarUri"
        alt="User Profile"
      >
      <v-icon
        v-else
        :size="ICON_SIZE"
        :color="isActive ? `primary`:`white`"
      >
        md:account_circle
      </v-icon>
      <span :class="`text-subtitle-1 ${isActive ? `text-primary`:`text-grey400`}`">Profile</span>
    </nuxt-link>
    <div
      v-else
      class="nav-item flex-1-1-0 h-100 d-flex align-center justify-center flex-column cursor-pointer"
      role="button"
      @click="openLoginModal"
    >
      <v-icon
        :size="ICON_SIZE"
        color="white"
      >
        md:account_circle
      </v-icon>
      <span class="text-subtitle-1 text-grey400">Profile</span>
    </div>
  </nav>
  <menu-search-option-bottom-menu
    v-if="isSearchOptionOpen"
    @close="isSearchOptionOpen = false"
  />

  <lazy-common-modal-base
    v-model:show-dialog="isAddOptionOpen"
    title="What would you like to publish?"
    subtitle="Choose a type. We will prepare the right form for you."
    :max-width="744"
    variant="publish"
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

const ICON_SIZE = 26

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
  /* Room for the iPhone home indicator when the page extends under it (viewport-fit=cover). */
  height: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 999;
  overflow: visible;
}
/* Sit above the Explore overlay (1007) and the fixed header while it is open. */
.bottom-nav-menu--raised {
  z-index: 1008;
}

.bottom-nav-menu::before {
  content: "";
  position: absolute;
  top: -22px;
  left: 50%;
  width: 96px;
  height: 24px;
  transform: translateX(-50%);
  background: inherit;
  clip-path: path("M0 24 C7 24 12 22 16 19 C20 16 23 12 27 9 C31 5 37 3 43 2 C45 2 47 2 48 2 C49 2 51 2 53 2 C59 3 65 5 69 9 C73 12 76 16 80 19 C84 22 89 24 96 24 Z");
  pointer-events: none;
}
.nav-item {
  gap: 2px;
  min-width: 48px;
  -webkit-tap-highlight-color: transparent;
}
.active-border {
  border : 2px solid rgb(var(--v-theme-primary))
}
.deactive-border {
    border : 2px solid rgb(var(--v-theme-grey400))
}
.container-add{
  width: 52px;
  height: 52px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  box-shadow:
    0 0 18px rgba(var(--v-theme-primary), 0.55),
    0 8px 22px rgba(var(--v-theme-primary), 0.35);
}

.container-add::before {
  content: "";
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.28);
  filter: blur(200px);
  pointer-events: none;
  z-index: -1;
}
</style>
