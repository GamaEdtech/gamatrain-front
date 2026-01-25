<template>
  <div
    v-if="type == `paper`"
    class="mx-1 card-paper position-relative rounded-lg d-flex flex-column justify-space-between"
  >
    <v-img
      :src="picture"
      class="rounded-lg"
      alt="user Profile"
      width="160"
      height="190"
    />
    <div class="circle-container">
      <div
        v-if="score != 'pp'"
        class="text-center"
      >
        <p
          class="text-subtitle-1 font-weight-bold text-white text-no-wrap"
          style="line-height: 1.5"
        >
          {{ score }}
        </p>
        <p
          class="text-subtitle-2 text-white font-weight-regular text-no-wrap"
          style="line-height: 1"
        >
          score
        </p>
      </div>
      <div
        v-else
        class="text-center d-flex align-center justify-center w-100 h-100"
      >
        <v-icon
          v-if="score == 'pp'"
          class="rounded-circle text-white"
          size="18"
        >
          md:file_present
        </v-icon>
        <v-icon
          v-else
          class="text-white"
          size="18"
        >
          md:play_circle_outlined
        </v-icon>
      </div>
    </div>

    <div class="w-100 text--primary relative z-10 bg-white bg-opacity-80">
      <div class="inner-curve">
        <div class="two-line-ellipsis">
          {{ title }}
        </div>
      </div>
    </div>

    <div class="w-100 px-2 box-bottom d-flex align-center justify-start ga-2">
      <img
        width="20"
        height="20"
        class="avatar-img rounded-circle"
        :src="avatar ? avatar : `/images/member/avatar.svg`"
      >
      <span class="text-subtitle-2 font-weight-bold">{{
        firstName + " " + lastName
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IRelatedContentCard {
  title: string
  picture: string
  avatar: string
  firstName: string
  lastName: string
  score?: string
  type: string
}

defineProps<IRelatedContentCard>()
</script>

<style scoped>
.inner-curve {
  --r: 8px; /* control the rounded part */
  --s: 30px; /* control the size of the cut */
  --a: 35deg; /* control the depth of the curvature */
  --p: 50%; /* control the position */
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 52px;
  padding: 8px;
  padding-top: 16px;
  aspect-ratio: 3/2;
  background: #344054e5;
  border: 2px solid #344054;
  border-radius: var(--r) var(--r) 0 0;
  --_m: var(--r), #000 calc(100% - 1px), #0000;
  --_d: (var(--s) + var(--r)) * cos(var(--a));
  mask: radial-gradient(var(--r) at calc(var(--p) + var(--_d)) var(--_m)),
    radial-gradient(var(--r) at calc(var(--p) - var(--_d)) var(--_m)),
    radial-gradient(
        var(--s) at var(--p) calc(-1 * sin(var(--a)) * var(--s)),
        #0000 100%,
        #000 calc(100% + 1px)
      )
      0 calc(var(--r) * (1 - sin(var(--a)))) no-repeat,
    linear-gradient(
      90deg,
      #000 calc(var(--p) - var(--_d)),
      #0000 0 calc(var(--p) + var(--_d)),
      #000 0
    );
}
.circle-container {
  border-radius: 50%;

  background: #344054e5;
  border: 2px solid #344054;
  width: 32px;
  height: 32px;
  left: 62px;
  z-index: 10;
  position: absolute;
  bottom: 68px;
}
.two-line-ellipsis {
  font-size: 10px !important;
  font-weight: 500 !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  text-align: center;
}

.card-paper {
  width: 160px;
  height: 230px;
  border: 2px solid #f2f4f7;
}
.box-bottom {
  height: 30px;
}
.avatar-img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}
</style>
