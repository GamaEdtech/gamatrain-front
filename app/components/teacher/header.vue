<template>
  <div
    class="main-teacher-header w-100 d-flex flex-column"
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
    <v-container class="w-100 d-flex flex-column">
      <div class="w-100 d-flex justify-space-between">
        <div class="profile-div d-flex ga-1">
          <div class="image-div rounded-circle position-relative d-flex align-center justify-center">
            <img
              src="/images/member/avatar.svg"
              alt="Profile Teacher"
              class="profile-img rounded-circle"
              width="140"
              height="140"
            >
            <div class="status-div rounded-circle position-absolute bg-success" />
            <div class="w-100 d-flex justify-center container-badge position-absolute">
              <div
                v-for="i in 3"
                :key="i"
                class="badge-div rounded-circle bg-white d-flex align-center justify-center"
              >
                {{ i }}
              </div>
            </div>
          </div>
          <span class="text-subtitle-1 text-sm-h6 text-grey700 font-weight-regular">He's coming right now!</span>
        </div>
        <div class="d-flex ga-2">
          <span class="text-subtitle-1 text-grey400 font-weight-regular">
            <v-icon
              color="grey400"
            >md:visibility</v-icon>
            View
          </span>
          <span class="text-h6 text-grey700 font-weight-bold">
            2.5 K
          </span>
        </div>
      </div>
      <div class="w-100 d-flex align-end ga-4 mt-8">
        <span class="text-h4 text-sm-h2 font-weight-bold text-grey900">Alireza ABdi</span>
        <span class="text-h6 text-sm-h5 font-weight-bold text-grey700 mb-1 d-flex ga-1">
          <v-icon
            color="primary"
            size="20"
          >md:star</v-icon>
          2.5</span>
      </div>
      <span class="w-100 text-start text-h5 font-weight-regular text-grey700 mt-6">
        In order to maintain the rights of the GamaTrain website and ensure the comfort of all users, rules have been established that users are required to follow. If a user violates these regulations.
      </span>

      <span class="w-100 text-start text-h6 font-weight-regular text-grey700 mt-4">
        <v-icon
          color="grey400"
          size="16"
          class="mb-1"
        >md:location_on</v-icon>
        14 Elmwood Gardens, Islington, London N1 2AS, United Kingdom
      </span>
      <div class="d-flex align-center justify-start ga-4 mt-6">
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
    </v-container>
  </div>
</template>

<script setup lang="ts">
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
@media (max-width: 960px) {
  .top-section-header {
    min-height: 140px;
  }
  .logo-gamatrain{
    width : 84px;
    height : 20px;
  }
  .image-div{
    width : 120px;
    height : 120px;
    margin-top : -76px;
    border : 2px solid transparent;
  }
  .profile-img{
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
    width : 90px;
    height : 90px;
    margin-top : -61px;
    border : 2px solid transparent;
  }
  .profile-img{
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
