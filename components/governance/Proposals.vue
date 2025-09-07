<template>
  <div class="mt-10">
    <h1
      class="text-h4 text-md-h3 mb-md-4 font-weight-bold primary-gray-700 text-center"
    >
      Active Proposals
    </h1>

    <div class="mt-6 mt-sm-1">
      <div class="d-none d-sm-block">
        <v-slide-group
          v-model="selected"
          class="center-slide-group"
          :show-arrows="false"
          center-active
        >
          <v-slide-group-item
            v-for="n in 3"
            :key="n"
          >
            <div
              elevation="0"
              class="my-5 mx-1 proposal-slide__card"
            >
              <governance-proposal-card @select="handleProposalClick" />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </div>

      <div class="d-block d-sm-none">
        <div
          v-for="(item, index) in 3"
          :key="index"
          class="mb-4"
        >
          <governance-proposal-card
            :item="item"
            @select="handleProposalClick"
          />
        </div>
      </div>
    </div>

    <div class="mt-10 d-flex justify-center">
      <v-btn
        :size="display.mdAndUp.value ? 'large' : 'default'"
        color="#344054"
        variant="text"
        rounded
      >
        See more
      </v-btn>
      <v-btn
        :size="display.mdAndUp.value ? 'large' : 'default'"
        color="#1D2939"
        variant="flat"
        rounded
        class="ml-3"
        @click="visibleCreateProposal = true"
      >
        Create Proposal
      </v-btn>
    </div>
    <governance-creat-proposal v-model="visibleCreateProposal" />
    <governance-proposal-detail v-model="visibleProposalDetail" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/composables/display'

const display = useDisplay()
const selected = ref(null)
const visibleCreateProposal = ref(false)
const visibleProposalDetail = ref(false)

const handleProposalClick = () => {
  visibleProposalDetail.value = true
}
</script>

<style scoped>
.proposal-slide__card {
  width: 310px;
}
</style>
