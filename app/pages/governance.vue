<template>
  <div>
    <v-container id="governance-page-header" fluid>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h3 font-weight-bold">Governance Portal</h1>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <div class="governance-top py-5">
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
// This parent component is now clean and only serves as a layout container.
// All logic is correctly encapsulated in the child components.

// Wallet button component
const AsyncWalletMultiButton = defineAsyncComponent(async () => {
  const mod = await import("solana-wallets-vue");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).WalletMultiButton;
});

// SEO Meta data
useHead({
  title: "Governance | Community-Driven Decisions & DAO Voting",
  meta: [
    {
      name: "description",
      content:
        "Shape the future of Gamatrain through decentralized governance. Join our DAO, propose ideas, vote on key decisions, and help build an open-source EdTech ecosystem powered by the community.",
    },
  ],
});
</script>

<style scoped lang="scss">
#governance-page-header {
  height: 20rem;
  background: #24292f;
  position: relative;

  #main-title-holder {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 9.7rem;
    text-align: center;

    .gama-text-h3 {
      color: #ffffff;
      margin-bottom: 0.8rem;
    }

    .gama-text-subtitle2 {
      color: #ffffff !important;
    }
  }
}

@media only screen and (min-width: 600px) {
  #governance-page-header {
    height: 26rem;

    #main-title-holder {
      top: 11.5rem;

      .gama-text-h3 {
        margin-bottom: 0.8rem;
      }
    }
  }
}
@media only screen and (min-width: 960px) {
  #governance-page-header {
    height: 34rem;
    background: #24292f;
    position: relative;

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 14.6rem;
      text-align: center;

      .gama-text-h3 {
        color: #ffffff;
        margin-bottom: 1.6rem;
      }

      .gama-text-subtitle2 {
        color: #ffffff !important;
      }
    }
  }
}
.governance-top {
  background: #fbfbfb;
}
</style>
