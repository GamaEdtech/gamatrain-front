<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="500px"
  >
    <v-card
      class="guide-card"
      color="primary"
    >
      <v-card-title class="guide-title">
        Game Controls Guide
        <v-icon
          class="close-icon"
          @click="closeModal"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="guide-content">
        <div class="control-section">
          <h3 class="section-title">
            <v-icon>mdi-keyboard</v-icon>
            Desktop Controls
          </h3>
          <div class="controls-grid">
            <div class="control-item">
              <div class="key">
                W
              </div>
              <span>Move Forward</span>
            </div>
            <div class="control-item">
              <div class="key">
                S
              </div>
              <span>Move Backward</span>
            </div>
            <div class="control-item">
              <div class="key">
                A
              </div>
              <span>Move Left</span>
            </div>
            <div class="control-item">
              <div class="key">
                D
              </div>
              <span>Move Right</span>
            </div>
            <div class="control-item">
              <div class="key">
                Mouse
              </div>
              <span>Rotate View</span>
            </div>
          </div>
        </div>

        <v-divider
          v-if="isMobileOrTablet"
          class="divider"
        />

        <div
          v-if="isMobileOrTablet"
          class="control-section"
        >
          <h3 class="section-title">
            <v-icon>mdi-cellphone</v-icon>
            Mobile Controls
          </h3>
          <div class="mobile-controls">
            <div class="mobile-control-group">
              <v-btn
                class="control-btn"
                fab
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
            </div>
            <div class="mobile-control-group">
              <v-btn
                class="control-btn"
                fab
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-btn
                class="control-btn"
                fab
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
              <v-btn
                class="control-btn"
                fab
              >
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
            <div class="mobile-control-group">
              <v-btn
                class="rotate-btn"
                fab
              >
                <v-icon>mdi-rotate-3d-variant</v-icon>
              </v-btn>
              <span>Touch and drag to rotate</span>
            </div>
          </div>
        </div>

        <div class="dont-show-container">
          <v-checkbox
            v-model="dontShowAgain"
            label="Don't show this again"
            color="white"
            hide-details
          />
        </div>
      </v-card-text>

      <v-card-actions class="guide-actions">
        <v-btn
          class="start-btn"
          block
          @click="closeModal"
        >
          <span class="btn-text">Got it, let's start!</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showModal = ref(true)
const isMobileOrTablet = ref(window.innerWidth <= 1024)
const dontShowAgain = ref(false)

// Check localStorage for saved preference
const checkSavedPreference = () => {
  const savedPreference = localStorage.getItem('dontShowControlsGuide')
  if (savedPreference === 'true') {
    showModal.value = false
  }
}

const closeModal = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('dontShowControlsGuide', 'true')
  }
  showModal.value = false
}

onMounted(() => {
  checkSavedPreference()
  window.addEventListener('resize', () => {
    isMobileOrTablet.value = window.innerWidth <= 1024
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    isMobileOrTablet.value = window.innerWidth <= 1024
  })
})
</script>

<style scoped>
.guide-card {
    color: white;
    border-radius: 12px;
    overflow: hidden;
}

.guide-title {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 16px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-icon {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
    color: white;
}

.close-icon:hover {
    opacity: 1;
}

.guide-content {
    padding: 20px;
}

.control-section {
    margin-bottom: 16px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    margin-bottom: 16px;
}

.controls-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.control-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.key {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.divider {
    margin: 20px 0;
    border-color: rgba(255, 255, 255, 0.1) !important;
}

.mobile-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.mobile-control-group {
    display: flex;
    gap: 16px;
    align-items: center;
}

.control-btn {
    background-color: rgba(255, 255, 255, 0.1) !important;
    transition: transform 0.2s, background-color 0.2s !important;
}

.control-btn:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.2) !important;
}

.rotate-btn {
    background-color: rgba(255, 255, 255, 0.1) !important;
}

.dont-show-container {
    margin-top: 16px;
    padding: 0 8px;
}

.guide-actions {
    padding: 0 20px 20px 20px;
}

.start-btn {
    background-color: white !important;
    color: var(--v-primary-base) !important;
    font-weight: bold;
    letter-spacing: 0.5px;
    height: 48px;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s !important;
}

.start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-text {
    color: var(--v-primary-base);
}

/* Custom checkbox styling */
:deep(.v-input--checkbox .v-label) {
    color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.v-input--checkbox .v-icon) {
    color: white !important;
}

:deep(.v-selection-control) {
    margin-left: -2.5rem;
}
</style>
