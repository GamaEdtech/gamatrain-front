<template>
  <v-row class="w-100 ma-0 align-stretch">
    <v-col
      cols="9"
      sm="10"
    >
      <v-card
        flat
        color="transparent"
        class="skeleton-card h-100 rounded-lg ma-auto"
      >
        <div class="d-flex flex-column flex-sm-row ga-4">
          <div class="position-relative flex-shrink-0">
            <v-skeleton-loader class="skeleton-image rounded-lg" />

            <div class="d-flex d-sm-none w-100 position-absolute bottom-0 pa-2">
              <v-skeleton-loader
                width="180"
                height="20"
                class="rounded"
              />
            </div>
          </div>

          <div class="d-none d-sm-flex w-100 flex-column ga-3 pa-2">
            <v-skeleton-loader
              width="65%"
              height="28"
              class="rounded"
            />
            <div class="d-flex w-100 flex-column ga-2">
              <v-skeleton-loader
                width="100%"
                height="16"
                class="rounded"
              />
              <v-skeleton-loader
                width="90%"
                height="16"
                class="rounded"
              />
              <v-skeleton-loader
                width="55%"
                height="16"
                class="rounded"
              />
            </div>
          </div>

          <div class="d-flex d-sm-none w-100 flex-column ga-2">
            <v-skeleton-loader
              width="100%"
              height="14"
              class="rounded"
            />
            <v-skeleton-loader
              width="85%"
              height="14"
              class="rounded"
            />
            <v-skeleton-loader
              width="55%"
              height="14"
              class="rounded"
            />
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col
      cols="3"
      sm="2"
      class="d-flex flex-column align-center ga-2 position-relative"
    >
      <v-divider
        :thickness="2"
        color="grey100"
        vertical
        class="border-opacity-100 h-100 position-absolute divider-position"
      />
      <v-skeleton-loader
        width="42"
        height="18"
        class="rounded skeleton-content"
      />
      <v-skeleton-loader class="skeleton-date rounded-lg skeleton-content" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

// Same sizes as PostListItem, so the list doesn't move when posts arrive.
.skeleton-card {
  width: 100%;
}

.skeleton-image {
  width: 180px;
  height: 135px;
}

.skeleton-date {
  width: 62px;
  height: 62px;
}

.skeleton-content {
  z-index: 2;
}

.divider-position {
  right: 50%;
}

@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .skeleton-card {
    width: 240px;
  }

  .skeleton-image {
    width: 240px;
    height: 160px;
  }

  .skeleton-date {
    width: 52px;
    height: 52px;
  }
}
</style>
