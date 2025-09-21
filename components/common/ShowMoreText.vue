<template>
  <div class="show-more-text">
    <div
      ref="textRef"
      class="text-content"
      :class="{
        'text-collapsed': shouldCollapse && isCollapsed,
        'text-full': !shouldCollapse || !isCollapsed,
        [textClass]: textClass,
      }"
      v-html="formattedContent"
    />
    <div
      v-if="shouldCollapse"
      class="button-container"
    >
      <v-btn
        variant="text"
        color="blue-grey-lighten-3"
        size="small"
        class="show-more-btn"
        @click="toggleCollapsed"
      >
        <div class="button-content">
          <span class="button-text">{{
            isCollapsed ? "See More" : "See Less"
          }}</span>
          <v-icon
            class="button-icon"
            size="x-large"
            :icon="isCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up'"
          />
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  maxHeight: {
    type: String,
    default: '120px',
  },
  textClass: {
    type: String,
    default: '',
  },
  preserveLineBreaks: {
    type: Boolean,
    default: true,
  },
})

const textRef = ref(null)
const isCollapsed = ref(true)
const shouldCollapse = ref(false)

onMounted(() => {
  nextTick(() => {
    checkContentHeight()
  })
})

watch(
  () => props.content,
  () => {
    nextTick(() => {
      checkContentHeight()
    })
  },
)

const checkContentHeight = () => {
  if (!textRef.value) return

  const element = textRef.value
  const elementHeight = element.scrollHeight
  const maxHeightPx = parseInt(props.maxHeight)

  shouldCollapse.value = elementHeight > maxHeightPx
  isCollapsed.value = elementHeight > maxHeightPx
}

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

const formattedContent = computed(() => {
  if (!props.content) return ''

  if (props.preserveLineBreaks) {
    return props.content.replace(/\n/g, '<br />')
  }

  return props.content
})
</script>

<style scoped>
.show-more-text {
  position: relative;
}

.text-content {
  word-break: break-word;
}

.text-collapsed {
  max-height: v-bind(maxHeight);
  overflow: hidden;
  position: relative;
}

.text-collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.8), white);
  pointer-events: none;
  box-shadow: inset 0 -20px 20px -20px rgba(255, 255, 255, 0.9);
}

.text-full {
  max-height: none;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
}

.show-more-btn {
  display: inline-block;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 2px;
}

.button-text {
  font-size: 14px;
  line-height: 1;
}

.button-icon {
  font-size: 20px;
}
</style>
