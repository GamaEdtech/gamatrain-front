<template>
  <section
    class="economy-section d-flex flex-column align-center justify-center"
  >
    <v-container class="d-flex flex-column align-center justify-center py-12">
      <div class="economy-title-box mb-4">
        <h2 class="economy-title">
          Ready to Join the $GET Economy?
        </h2>
      </div>
      <div class="economy-desc-box mb-3">
        <p class="economy-desc">
          Start your journey with $GET today and be part of the decentralized
          future.
        </p>
      </div>
      <v-btn
        class="economy-btn"
        color="white"
        size="large"
        elevation="0"
        target="_blank"
        href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
      >
        Get Started Now
      </v-btn>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
.economy-section {
  background: #000;
  width: 100%;
  margin-top: 8rem;
}
.economy-title-box {
  border: 2px solid #fff;
  padding: 0.5rem 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.economy-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
}
.economy-desc-box {
  border: 1px solid #fff;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.economy-desc {
  color: #fff;
  font-size: 0.7rem;
  margin: 0;
  text-align: center;
}
.economy-btn {
  color: #000 !important;
  font-weight: 800 !important;
  margin-top: 2rem;
  text-transform: none !important;
}
@media (min-width: 600px) {
  .economy-desc {
    font-size: 1.1rem;
  }
  .economy-title {
    font-size: 2.2rem;
  }
}
</style>
