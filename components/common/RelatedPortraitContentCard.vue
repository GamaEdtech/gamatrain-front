<template>
  <v-card
    class="mx-1 relative overflow-hidden"
    width="160"
    :style="{ height: `${CardHeight}`, borderRadius: '8px' }"
  >
    <v-img
      class="text-white align-end"
      :height="CardHeight"
      :src="cardPicture"
    />
    <div class="circle-container">
      <div
        v-if="showScoreLabel"
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
        class="text-center"
        style="margin-top: 3px"
      >
        <v-icon
          v-if="score == 'pp'"
          class="rounded-circle gtext-t2"
          style="color: #d24625; background-color: white"
        >
          mdi-microsoft-powerpoint
        </v-icon>
        <v-icon
          v-else
          class="text-white"
        >
          mdi-play-circle-outline
        </v-icon>
      </div>
    </div>

    <v-card-text class="text--primary relative z-10 bg-white bg-opacity-80">
      <div class="inner-curve">
        <div class="two-line-ellipsis">
          {{ cardTitle }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  cardPicture: String,
  cardTitle: String,
  score: [String, Number],
  showScoreLabel: Boolean,
})

const CardHeight = computed(() => {
  return props.showScoreLabel ? '230px' : '107px'
})
</script>

<style scoped>
.inner-curve {
  --r: 8px; /* control the rounded part */
  --s: 30px; /* control the size of the cut */
  --a: 35deg; /* control the depth of the curvature */
  --p: 50%; /* control the position */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 52px;
  padding: 8px;
  padding-top: 16px;
  aspect-ratio: 3/2;
  background: #344054cc;
  border: 1px solid #e4e7ec;
  border-radius: var(--r);
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
  border: 1px solid #e4e7ec;
  background: #344054cc;
  width: 32px;
  height: 32px;
  left: 63px;
  z-index: 10;
  position: relative;
  bottom: 70px;
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
.v-img__img--contain {
  object-fit: fill !important;
}
</style>
