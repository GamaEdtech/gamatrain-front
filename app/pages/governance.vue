<template>
  <div>
    <v-container
      id="governance-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="text-h4 text-sm-h4 font-weight-bold text-white">
                Governance Portal
              </h1>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <div class="py-5">
      <v-container>
        <!-- The child components will now handle their own state -->
        <governance-stats />
        <div>
          <governance-proposals />
        </div>
      </v-container>
      <div>
        <!-- currently commented out -->
        <!-- <governance-overview /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Governance | Community-Driven Decisions & DAO Voting',
  meta: [
    {
      name: 'description',
      content:
        'Shape the future of Gamatrain through decentralized governance. Join our DAO, propose ideas, vote on key decisions, and help build an open-source EdTech ecosystem powered by the community.',
    },
  ],
})
</script>

<style scoped lang="scss">
#governance-page-header {
  height: 12.5rem;
  background: rgb(var(--v-theme-inverseSurfaceStrong));
  position: relative;

  #main-title-holder {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 6.0625rem;
    text-align: center;
  }
}

@media only screen and (min-width: 600px) {
  #governance-page-header {
    height: 16.25rem;

    #main-title-holder {
      top: 7.1875rem;
    }
  }
}
@media only screen and (min-width: 960px) {
  #governance-page-header {
    height: 21.25rem;
    position: relative;

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 9.125rem;
      text-align: center;
    }
  }
}
</style>
