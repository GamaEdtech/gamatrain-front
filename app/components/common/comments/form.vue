<template>
  <v-text-field
    variant="solo"
    hide-details
    placeholder="Got something to say?"
  >
    <template #prepend-inner>
      <img
        width="32"
        height="32"
        class="rounded-circle"
        :src="user?.avatar ? user?.avatar : `/images/member/avatar.svg`"
      >
    </template>

    <template #append-inner>
      <v-btn
        flat
        icon
        width="32"
        height="32"
        color="greenLight500"
      >
        <v-icon color="white">
          md:send
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
const { user } = useUser()
</script>

<style scoped></style>
