<template>
  <div class="skeleton-card-school">
    <div class="w-100 d-flex justify-space-between align-start flex-wrap">
      <div class="d-flex flex-column align-start justify-start ga-5">
        <v-skeleton-loader
          class="w-100"
          max-width="250"
          type="heading"
        />
        <div class="d-flex align-center justify-start flex-wrap">
          <v-skeleton-loader
            width="100"
            type="chip"
          />
          <v-skeleton-loader
            width="100"
            type="chip"
          />
          <v-skeleton-loader
            width="100"
            type="chip"
          />
        </div>
      </div>
      <v-skeleton-loader
        min-width="120"
        height="110"
        type="image"
      />
    </div>
    <div class="line-seperator" />
    <div class="w-100 d-flex justify-space-between align-center flex-wrap ga-3">
      <div class="d-flex align-center flex-wrap">
        <v-skeleton-loader type="avatar" />
        <v-skeleton-loader type="avatar" />
        <v-skeleton-loader type="avatar" />
      </div>
      <v-skeleton-loader
        width="220"
        type="heading"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.skeleton-card-school {
  width: 100%;
  min-height: 232px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
}
.line-seperator {
  width: 100%;
  height: 2px;
  background-color: #e4e6e9;
  margin-top: 10px;
}
</style>
