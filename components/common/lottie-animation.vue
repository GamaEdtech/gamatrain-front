<template>
  <div
    ref="lottieContainer"
    class="lottie-container"
  />
</template>

<script>
// import lottie from 'lottie-web';

export default {
  name: 'LottieAnimation',
  // props: {
  //     animationData: Object, // Pass the animation data directly as a prop
  //     loopStatus: { // Pass a prop to enable/disable the animation loop
  //         type: Boolean,
  //         default: true
  //     },
  //     endTime: {// Pass the end time in seconds as a prop
  //         type: Number,
  //         default: 0
  //     }
  // },
  // mounted() {
  //     this.initLottieAnimation();
  // },
  // methods: {
  //     initLottieAnimation() {
  //         const container = this.$refs.lottieContainer;
  //         this.animationInstance = lottie.loadAnimation({
  //             container,
  //             renderer: 'svg', // Use 'svg' or 'canvas' based on your preference
  //             loop: this.loopStatus,
  //             autoplay: true,
  //             animationData: this.animationData,
  //         });
  //         this.animationInstance.setSpeed(1); // Set the speed factor (0.5 is 50% of the original speed)
  //         // Set the end time for the animation

  //         if (this.endTime != 0)
  //             this.animationInstance.playSegments([0, this.endTime], true); // Adjust the multiplier as needed

  //     },

  // },
  // beforeDestroy() {
  //     if (this.animationInstance) {
  //         this.animationInstance.destroy();
  //     }
  // },
}
</script>

<style>
.lottie-container {
    width: 100%;
    height: 100%;
}
</style>
