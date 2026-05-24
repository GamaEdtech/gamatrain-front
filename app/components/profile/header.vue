<template>
  <div
    class="main-teacher-header w-100 d-flex flex-column mt-n4"
  >
    <div class="top-section-header w-100 d-flex bg-grey900 position-relative d-flex align-center justify-center">
      <img
        src="/images/gamatrain-logo.svg"
        alt="GamaTrain"
        class="logo-gamatrain"
        width="150"
        height="36"
      >
      <img
        src="/images/teacher-header-vector.svg"
        alt="Header Vector"
        class="h-100 position-absolute right-0 top-0"
      >
    </div>
    <div class="w-100 d-flex justify-space-between pa-4">
      <div class="profile-div d-flex ga-1">
        <div class="image-div rounded-circle position-relative d-flex align-center justify-center">
          <img
            :src="data.avatar ? data.avatar : `/images/default-user.svg`"
            alt="Profile Avatar"
            class="profile-img rounded-circle"
            width="140"
            height="140"
          >
          <div :class="`status-div rounded-circle position-absolute bg-${userOnlineStatus[data.onlineStatus].nameColor}`" />
          <div
            v-if="data.currentStatusSentence"
            class="bio-div bg-white position-absolute text-caption text-sm-h6 font-weight-medium text-grey700 rounded-lg border-solid border-sm border-grey100 pa-1"
          >
            {{ data.currentStatusSentence }}
          </div>
          <!-- <div class="w-100 d-flex justify-center container-badge position-absolute">
            <div
              v-for="i in 3"
              :key="i"
              class="badge-div rounded-circle bg-white d-flex align-center justify-center"
            >
              {{ i }}
            </div>
          </div> -->
        </div>
        <span class="text-subtitle-1 text-sm-h6 text-grey700 font-weight-regular">{{ userOnlineStatus[data.onlineStatus].text }}</span>
      </div>
      <div class="d-flex ga-2">
        <span class="text-subtitle-1 text-grey400 font-weight-regular">
          <v-icon
            color="grey400"
          >md:visibility</v-icon>
          View
        </span>
        <span class="text-h6 text-grey700 font-weight-bold">
          {{ data.profileView > 1000 ? (data.profileView / 1000) + " K" : data.profileView }}
        </span>
      </div>
    </div>
    <div class="w-100 d-flex align-center justify-space-between ga-4 mt-8 px-4">
      <span class="text-h4 text-sm-h2 font-weight-bold text-grey900">{{ data.firstName + " " + data.lastName }}</span>
      <div
        v-if="isEditable"
        class="d-flex align-center ga-2"
      >
        <v-btn
          v-if="visibility == 'Private'"
          flat
          color="blue50"
          height="30"
          class="rounded-lg"
          @click="emit('editPrivacy')"
        >
          <v-icon
            color="info"
            size="14"
          >
            md:lock
          </v-icon>
          <span class="text-info text-h6 font-weight-medium ml-1">Private</span>
        </v-btn>
        <v-btn
          v-if="visibility == 'Public'"
          flat
          color="greenLight25"
          height="30"
          class="rounded-lg"
          @click="emit('editPrivacy')"
        >
          <v-icon
            color="greenLight700"
            size="14"
          >
            md:lock_open_right
          </v-icon>
          <span class="text-greenLight700 text-h6 font-weight-medium ml-1">Public</span>
        </v-btn>
        <v-btn
          v-if="visibility == 'ConnectionsOnly'"
          flat
          color="primary50"
          height="30"
          class="rounded-lg"
          @click="emit('editPrivacy')"
        >
          <v-icon
            color="primary"
            size="14"
          >
            md:lock_person
          </v-icon>
          <span class="text-primary text-h6 font-weight-medium ml-1">Connection</span>
        </v-btn>

        <v-btn
          flat
          color="grey100"
          size="28"
        >
          <v-icon
            color="grey500"
            size="20"
          >
            md:edit
          </v-icon>
        </v-btn>
      </div>

      <!-- <span class="text-h6 text-sm-h5 font-weight-bold text-grey700 mb-1 d-flex ga-1">
        <v-icon
          color="primary"
          size="20"
        >md:star</v-icon>
        2.5</span> -->
    </div>
    <span class="w-100 text-start text-h5 font-weight-regular text-grey700 mt-6 px-4">
      {{ data.biography ? data.biography : defaultBio }}

      <span
        v-if="isEditable"
        class="text-info text-decoration-underline cursor-pointer"
        @click="emit('editBio')"
      >Edit Bio</span>
    </span>

    <!-- <span class="w-100 text-start text-h6 font-weight-regular text-grey700 mt-4 px-4">
      <v-icon
        color="grey400"
        size="16"
        class="mb-1"
      >md:location_on</v-icon>
      14 Elmwood Gardens, Islington, London N1 2AS, United Kingdom
    </span> -->
    <div class="d-flex align-center justify-start ga-4 mt-6 px-4 pb-4">
      <v-btn
        flat
        rounded="pill"
        color="grey100"
        width="130"
        class="text-grey500 font-weight-medium text-h5"
      >
        <v-icon
          color="primary"
          size="14"
          class="mr-1"
        >
          md:forum
        </v-icon>
        Message
      </v-btn>
      <v-btn
        flat
        rounded="pill"
        color="grey100"
        width="130"
        class="text-grey500 font-weight-medium text-h5"
      >
        <v-icon
          color="primary"
          size="14"
          class="mr-1"
        >
          md:notifications_active
        </v-icon>
        Subscribe
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileDTO, ProfileVisibility } from '@/types'
import { useTheme } from 'vuetify'

interface IProfileHeader {
  data: ProfileDTO
  isEditable: boolean
  visibility?: ProfileVisibility
  defaultBio: string
}

defineProps<IProfileHeader>()
const emit = defineEmits(['editBio', 'editPrivacy'])

const theme = useTheme()
const userOnlineStatus = {
  NewUser: {
    text: 'New here',
    nameColor: 'primary',
    color: theme.current.value.colors.primary,
  },
  ActiveLongTimeAgo: {
    text: 'Long time no see',
    nameColor: 'grey300',
    color: theme.current.value.colors.grey300,
  },
  ActiveThisMonth: {
    text: 'Missing for days',
    nameColor: 'blueGrey300',
    color: theme.current.value.colors.blueGrey300,
  },
  ActiveThisWeek: {
    text: 'Was here this week',
    nameColor: 'warning300',
    color: theme.current.value.colors.warning300,
  },
  OnlineToday: {
    text: 'Was here today',
    nameColor: 'warning500',
    color: theme.current.value.colors.warning500,
  },
  ActiveRecently: {
    text: 'Be right back',
    nameColor: 'success300',
    color: theme.current.value.colors.success300,
  },
  Online: {
    text: 'Online',
    nameColor: 'success500',
    color: theme.current.value.colors.success500,
  },
}
</script>

<style scoped>
.main-teacher-header{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
.top-section-header{
    min-height : 300px
}
.logo-gamatrain{
  width : 150px;
  height : 36px;
}
.image-div{
  width : 160px;
  height : 160px;
  margin-top : -96px;
  border : 4px solid transparent;
  background : linear-gradient(180deg,rgb(var(--v-theme-grey900)) 50%, rgb(var(--v-theme-white)) 50%) padding-box,
  linear-gradient(to right, rgb(var(--v-theme-grey700)) ,rgb(var(--v-theme-primary))) border-box
}
.profile-img{
  min-width : 140px;
  min-height : 140px;
  width : 140px;
  height : 140px;
}
.status-div{
  width : 16px;
  height : 16px;
  right: 16px;
  top: 20px;
}
.container-badge{
  bottom : -20px
}
.badge-div{
  width : 32px;
  height : 32px;
  border : 1px solid rgb(var(--v-theme-grey100));
  margin-right: -12px;
}
.bio-div{
  left: -10px;
  max-width : 160px;
  bottom : 105%
}
@media (max-width: 960px) {
  .top-section-header {
    min-height: 140px;
  }
  .logo-gamatrain{
    width : 84px;
    height : 20px;
  }
  .image-div{
    min-width : 120px;
    min-height : 120px;
    width : 120px;
    height : 120px;
    margin-top : -76px;
    border : 2px solid transparent;
  }
  .profile-img{
    min-width : 104px;
    min-height : 104px;
    width : 104px;
    height : 104px;
  }
}

@media (max-width: 600px) {
  .top-section-header {
    min-height: 100px;
  }
  .logo-gamatrain{
    width : 50px;
    height : 12px;
  }
  .image-div{
    min-width : 90px;
    min-height : 90px;
    width : 90px;
    height : 90px;
    margin-top : -61px;
    border : 2px solid transparent;
  }
  .profile-img{
    min-width : 78px;
    min-height : 78px;
    width : 78px;
    height : 78px;
  }
  .status-div{
    width : 12px;
    height : 12px;
    right: 8px;
    top: 10px;
  }
  .container-badge{
    bottom : -10px
  }
  .badge-div{
    width : 20px;
    height : 20px;
    margin-right: -8px;
  }
}
</style>
