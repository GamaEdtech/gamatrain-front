<template>
  <div class="filter-modal">
    <!-- Filter modal content will go here -->
  </div>
</template>

<script>
export default {
  name: 'FilterModal',
  data() {
    return {
      scroll: 0,
      widgets: false,
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.testScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.testScroll)
  },
  methods: {
  },
}
</script>
