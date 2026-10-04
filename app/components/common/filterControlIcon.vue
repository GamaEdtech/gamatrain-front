<template>
  <v-img
    v-if="showItemIcon && selectedItem?.icon"
    :src="selectedIconSrc"
    :alt="selectedItem.title"
    contain
  >
    <template #error>
      <v-icon
        :icon="fallbackIconName"
        :class="fallbackIconClass"
        :size="fallbackSize"
        color="brandNavy"
      />
    </template>
  </v-img>
  <v-icon
    v-else
    :icon="fallbackIconName"
    :class="fallbackIconClass"
    :size="fallbackSize"
    color="brandNavy"
  />
</template>

<script setup lang="ts">
interface FilterIconItem {
  title?: string
  icon?: string
  contentIcon?: string
}

const props = withDefaults(defineProps<{
  selectedItem?: FilterIconItem | null
  showItemIcon?: boolean
  iconSrc?: ((item: FilterIconItem) => string | undefined) | null
  fallbackIcon?: string
  fallbackIconPadding?: number
  controlIcon?: string
  iconSize?: number | null
}>(), {
  selectedItem: null,
  showItemIcon: false,
  iconSrc: null,
  fallbackIcon: 'md:school',
  fallbackIconPadding: 0,
  controlIcon: '',
  iconSize: null,
})

const selectedIconSrc = computed(() => props.selectedItem
  ? props.iconSrc?.(props.selectedItem) || props.selectedItem.icon
  : undefined)

// Shown when there is no item image, or when it fails to load.
const contentIcon = computed(() => props.showItemIcon ? props.selectedItem?.contentIcon : undefined)

const fallbackIconName = computed(() => contentIcon.value
  ? undefined
  : props.controlIcon || props.fallbackIcon)

const fallbackIconClass = computed(() => contentIcon.value
  ? `${contentIcon.value} search-filter-content-icon`
  : '')

const fallbackSize = computed(() => {
  if (props.iconSize) return props.iconSize
  if (contentIcon.value || props.controlIcon) return 28
  return 28 - (props.fallbackIconPadding * 2)
})
</script>

<style scoped>
.search-filter-content-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  line-height: 1;
}
</style>
