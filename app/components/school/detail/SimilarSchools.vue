<template>
  <v-row
    v-show="similarSchools && similarSchools.length"
    id="similar-schools"
  >
    <v-col cols="12">
      <h3 class="gtext-h5 primary-gray-600">
        Similar schools
      </h3>
    </v-col>
    <v-col cols="12">
      <v-slide-group
        class="slider py-sm-4"
        :show-arrows="true"
      >
        <v-slide-group-item
          v-for="(item, idx) in similarSchools"
          :key="idx"
        >
          <v-card
            rounded
            class="list-item"
            :to="`/school/${item.id}`"
          >
            <v-card-text>
              <div class="item-info">
                <div class="main-data">
                  <div class="float-left">
                    <h2 class="gtext-t4 font-weight-semibold mb-4">
                      {{ item.name }}
                    </h2>
                    <v-chip
                      class="list-chip gtext-t5 font-weight-medium"
                      small
                    >
                      {{ item.schoolTypeTitle || "Pre-K" }}
                    </v-chip>
                  </div>
                  <div class="item-img float-right">
                    <img :src="item.pic || '/images/default-school.png'">
                  </div>
                </div>
                <v-divider class="mb-3" />
                <div class="item-footer">
                  <div class="float-left">
                    <v-btn icon>
                      <v-icon> mdi-map-marker </v-icon>
                    </v-btn>
                  </div>
                  <div class="float-right d-flex mt-1">
                    <div
                      class="rate-section gtext-t6 font-weight-semibold mr-1"
                    >
                      {{ item.score || 4 }}
                      <v-icon color="primary">
                        mdi-star
                      </v-icon>
                    </div>
                    <div class="gtext-t6 primary-gray-300">
                      Update:
                      <span class="primary-gray-600">
                        {{ item.up_date }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  similarSchools: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.list-item {
  height: 15rem;
  margin-bottom: 2rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
}
.item-info .main-data {
  height: 8rem;
}
.item-img img {
  width: 10.7rem;
  height: 8.1rem;
  flex-shrink: 0;
  border-radius: 0.4rem;
}

.list-chip {
  background: var(--primary-warning-50, #fffaeb) !important;
  color: var(--primary-yellow-gama-500, #ffb600) !important;
}
</style>
