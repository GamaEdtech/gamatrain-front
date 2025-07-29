<template>
  <div class="text-center training-pagination">
    <v-pagination
      v-model="page"
      :length="2700"
      :total-visible="6"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
    }
  },
}
</script>
