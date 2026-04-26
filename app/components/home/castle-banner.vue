<template>
  <div class="gama-body pa-4">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="7"
          md="4"
          lg="4"
          class="d-flex justify-sm-end justify-center order-1 order-sm-2"
        >
          <img
            src="/images/castle-game.webp"
            width="288"
            alt="Gamatrain Castle of Numbers "
          >
        </v-col>

        <v-col
          cols="12"
          sm="6"
          class="order-2 order-sm-1"
        >
          <h2 class="gama-text-h4 text-title">
            Castle of Numbers
          </h2>
          <p class="gama-text-body1 text-body describe mt-8">
            Explore rooms one by one, collect coins, and solve math puzzles to unlock the next room. Every move is a new adventure, and every solved puzzle brings progress and rewards!
          </p>
          <v-btn
            size="large"
            rounded
            class="primary gama-btn mt-8 font-xl"
            to="/game/castle"
          >
            Let's Go!
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
    .gama-body {
        background-color: #24292F;
    }

    .text-title {
        color: white;
    }

    .text-body {
        color: #D0D5DD !important;
        text-align: left;
    }

    .gama-btn {
        font-size: large !important;
        font-weight: 500;
    }
</style>
