<template>
  <div class="admin-page">
    testtt<br>
    testtt<br>
    testtt<br>
    testtt<br>
    testtt<br>
    testtt<br>
    {{ name }}
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { name } = useDisplay()
</script>
