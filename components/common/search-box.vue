<template>
  <!--  Start:  Search and logo in header  -->
  <v-text-field
    class="grade-search"
    filled
    height="40"
    disabled
    outlined
    dense
    label="Search..."
  >
    <template #prepend-inner>
      <v-btn icon>
        <v-icon class="search-icon pb-2">
          mdi-magnify
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
  <!--  End:  Search and logo in header  -->
</template>

<script>
export default {
  name: 'SearchBox',
}
</script>

<style>
.grade-search .v-text-field__details{
  display: none!important;
}
</style>
