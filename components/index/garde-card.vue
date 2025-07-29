<template>
  <v-card
    :class="'grade-card' + index"
    class="mx-auto grade-card"
  >
    <v-card-title class="d-block">
      <h2 :class="'grade-title' + index">
        {{ grade.title }}
        <span :class="'label-tag label-tag' + index">{{ index }}</span>
      </h2>

      <p class="">
        {{ grade.description }}
      </p>
    </v-card-title>
    <v-divider class="mx-4 grade-divider" />
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="item in grade.cat"
          :key="item.title"
          class="pa-0"
        >
          <v-icon> mdi-clipboard-edit-outline </v-icon>
          <v-list-item-content class="py-1 right">
            <v-list-item-title
              class="text-right type"
            >
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-content class="py-1 left">
            <v-list-item-title
              class="text-left stat"
            >
              {{ item.stat }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider class="grade-divider" />
    <v-card-text class="grade-update">
      <div class="footer-card card-footer">
        <span>Last update: </span>
        <span>{{ grade.update }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    grade: Object,
    index: Number,
  },
}
</script>
