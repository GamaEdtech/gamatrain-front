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
              <h1 class="text-h3 text-sm-h2 font-weight-bold text-white">
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
  height: 20rem;
  background: rgb(var(--v-theme-grey900));
  position: relative;

  #main-title-holder {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 9.7rem;
    text-align: center;
  }
}

@media only screen and (min-width: 600px) {
  #governance-page-header {
    height: 26rem;

    #main-title-holder {
      top: 11.5rem;
    }
  }
}
@media only screen and (min-width: 960px) {
  #governance-page-header {
    height: 34rem;
    position: relative;

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 14.6rem;
      text-align: center;
    }
  }
}
</style>
