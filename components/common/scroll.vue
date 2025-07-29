<template>
  <div class="scroll-to-top">
    <v-btn
      class="scroll"
      @click="scrollToTop()"
    >
      <i class="fa-solid fa-angle-up scroll-icon" />
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Scroll',
  // mounted() {
  //   $(document).scroll(function() {

  //       myID = document.getElementById("hide");

  //       var myScrollFunc = function () {
  //           var y = window.scrollY;
  //           if (y >= 100) {
  //               myID.className = "scroll-to-top show"
  //           } else {
  //               myID.className = "scroll-to-top hide"
  //           }
  //       };

  //       window.addEventListener("scroll", myScrollFunc);
  //   });
  // },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<style>
.scroll-to-top .v-btn:not(.v-btn--round).v-size--default {
  min-width: 5rem;
}

.scroll {
  height: 5rem !important;
  border-radius: 50% !important;
  position: fixed;
  bottom: 5%;
  left: 1%;
  z-index: 20;
  background: #fff;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px rgba(0, 0, 0, 0.12),
    0px 1px 8px rgba(0, 0, 0, 0.2);
}

.scroll-icon {
  font-size: 2rem;
  color: gray;
}
</style>
