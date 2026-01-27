<template>
  <div class="w-100 d-flex flex-wrap pa-4">
    <!-- Name -->
    <div class="detail-item">
      <span class="label">Name :</span>
      <span class="value">Oxford School</span>
    </div>

    <!-- Local Name -->
    <div class="detail-item">
      <span class="label">Local Name :</span>
      <span class="value">scccholl</span>
    </div>

    <!-- School Type -->
    <div class="detail-item">
      <span class="label">Type :</span>
      <span class="value">Public</span>
    </div>

    <!-- State -->
    <div class="detail-item">
      <span class="label">State ID :</span>
      <span class="value">12</span>
    </div>

    <!-- Zip Code -->
    <div class="detail-item">
      <span class="label">Zip Code :</span>
      <span class="value">45879</span>
    </div>

    <!-- City -->
    <div class="detail-item">
      <span class="label">City ID :</span>
      <span class="value">3</span>
    </div>

    <!-- Country -->
    <div class="detail-item">
      <span class="label">Country ID :</span>
      <span class="value">1</span>
    </div>

    <!-- Quarter -->
    <div class="detail-item">
      <span class="label">Quarter :</span>
      <span class="value">Downtown</span>
    </div>

    <!-- Phone -->
    <div class="detail-item">
      <span class="label">Phone :</span>
      <span class="value">+1 212 555 1234</span>
    </div>

    <!-- Fax -->
    <div class="detail-item">
      <span class="label">Fax :</span>
      <span class="value">+1 212 555 9999</span>
    </div>

    <!-- Email -->
    <div class="detail-item w-100">
      <span class="label">Email :</span>
      <span class="value">info@oxfordschool.com</span>
    </div>

    <!-- Website -->
    <div class="detail-item w-100">
      <span class="label">Website :</span>
      <span class="value">https://oxfordschool.com</span>
    </div>

    <!-- Address -->
    <div class="detail-item w-100">
      <span class="label">Address :</span>
      <span class="value">
        221B Baker Street, London, United Kingdom
      </span>
    </div>

    <!-- Local Address -->
    <div class="detail-item w-100">
      <span class="label">Local Address :</span>
      <span class="value">
        221B Baker Street, London, United Kingdom
      </span>
    </div>

    <!-- Tuition -->
    <div class="detail-item">
      <span class="label">Tuition :</span>
      <span class="value">$4,500</span>
    </div>

    <!-- Tags -->
    <div class="detail-item w-100">
      <span class="label">Tags :</span>
      <span class="value">Science, International, Private</span>
    </div>

    <!-- Boards -->
    <div class="detail-item w-100">
      <span class="label">Boards :</span>
      <span class="value">IB, Cambridge</span>
    </div>

    <!-- Description -->
    <div class="detail-item w-100">
      <span class="label">Description :</span>
      <span class="value description">
        Oxford School is one of the leading international schools offering
        modern education standards with highly qualified teachers and advanced facilities.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.detail-item {
  width: 50%;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .detail-item {
    width: 100% !important;
  }
}

.label {
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
  font-weight: 700;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
  font-weight: 700;
  word-break: break-word;
}

.description {
  font-weight: 500;
  line-height: 1.7;
}
</style>
