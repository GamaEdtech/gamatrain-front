<template>
  <div class="bg-grey-lighten-4 pa-4">
    <v-container>
      <v-row>
        <!-- ستون تصویر -->
        <v-col
          cols="12"
          sm="6"
          class="d-flex justify-center order-1 order-sm-2"
        >
          <img
            src="/images/car-racing-banner.webp"
            alt=""
          >
        </v-col>

        <!-- ستون متن -->
        <v-col
          cols="12"
          sm="6"
          class="order-2 order-sm-1"
        >
          <h2 class="gama-text-h4">
            Ready to Race?
          </h2>
          <p class="gama-text-body1 describe mt-8">
            Learning has never been this exciting! Get behind the wheel, think fast, choose the right path,
            and speed ahead. Play, learn, and become a champion!
          </p>
          <v-btn
            size="large"
            rounded
            class="primary gama-btn mt-8 font-xl"
            to="/game/car-racing"
          >
            Let's
            Go!
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.gama-text-body1 {
    color: #6e7781;
    text-align: left;
}

.gama-btn {
    font-size: large !important;
    font-weight: 500;
}
</style>
