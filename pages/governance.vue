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
              <h1 class="gama-text-h3 font-weight-bold">
                Governance Portal
              </h1>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <div class="governance-top py-5">
      <div class="governance-stats mx-4">
        <div class="stats-flex">
          <div class="governance-stat-item">
            <v-card
              class="stat-card tl"
              elevation="0"
            >
              <div class="governance-stat-value primary-gray-700 text-h6">
                2.1M
                <span class="unit primary-gray-500 text-subtitle-1">$GET</span>
              </div>
              <div
                class="governance-stat-label primary-gray-500 text-subtitle-2"
              >
                Treasury Balance
              </div>
            </v-card>
          </div>
          <div class="governance-stat-item">
            <v-card
              class="stat-card tr"
              elevation="0"
            >
              <div class="governance-stat-value primary-gray-700 text-h6">
                98.5%
              </div>
              <div
                class="governance-stat-label primary-gray-500 text-subtitle-2"
              >
                $GET Staked
              </div>
            </v-card>
          </div>
          <div class="governance-stat-item">
            <v-card
              class="stat-card bl"
              elevation="0"
            >
              <div class="governance-stat-value primary-gray-700 text-h6">
                8,948
              </div>
              <div
                class="governance-stat-label primary-gray-500 text-subtitle-2"
              >
                Total Participants
              </div>
            </v-card>
          </div>
          <div class="governance-stat-item">
            <v-card
              class="stat-card br"
              elevation="0"
            >
              <div class="governance-stat-value primary-gray-700 text-h6">
                98.5%
              </div>
              <div
                class="governance-stat-label primary-gray-500 text-subtitle-2"
              >
                Active Voters
              </div>
            </v-card>
          </div>
          <div class="governance-stat-item">
            <v-card
              class="stat-card last"
              elevation="0"
            >
              <div class="governance-stat-value primary-gray-700 text-h6">
                98.5%
              </div>
              <div
                class="governance-stat-label primary-gray-500 text-subtitle-2"
              >
                Proposals Passed
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
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
.governance-stats {
  margin-top: -3.5rem;
  margin-bottom: 2rem;
}

.stats-flex {
  display: flex;
  width: 100%;
}

.governance-stat-item {
  flex: 1;
  min-width: 0;
}

.stat-card {
  background: linear-gradient(113.59deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid rgba(22, 44, 45, 0.06);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  padding: 15px 24px;
  text-align: center;
  height: 100%;
}

.stat-card .governance-stat-value {
  color: #0f172a;
  font-weight: 800;
  font-size: 44px;
  line-height: 1.2;
}

.stat-card .unit {
  font-weight: 700;
  font-size: 18px;
}

.stat-card .governance-stat-label {
  margin-top: 6px;
}

.stat-card.tl {
  border-radius: 34px 0 0 0;
}
.stat-card.tr {
  border-radius: 0 34px 0 0;
}
.stat-card.bl {
  border-radius: 0 0 0 34px;
}
.stat-card.br {
  border-radius: 0 0 34px 0;
}
.stat-card.last {
  border-radius: 34px;
  width: 50%;
  margin: 0 auto;
}

.bottom-center {
  border-radius: 34px;
  width: 360px;
  max-width: 100%;
  margin-top: 16px;
}

@media only screen and (max-width: 599px) {
  .stats-flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    width: 100%;
  }

  .governance-stat-item:last-child {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
  }

  .stat-card {
    padding: 10px 16px;
  }

  .stat-card .governance-stat-value {
    font-size: 32px;
  }
}

@media only screen and (min-width: 600px) {
  .stat-card.tl {
    border-radius: 44px 0 0 44px;
  }
  .stat-card.tr,
  .stat-card.bl,
  .stat-card.br {
    border-radius: 0;
  }
  .stat-card.last {
    border-radius: 0 44px 44px 0;
    width: 100%;
    margin: auto;
  }
}

@media only screen and (min-width: 960px) {
  .stat-card {
    padding: 40px 32px;
  }
  .stat-card .governance-stat-value {
    font-size: 30px;
  }
  .stat-card.tl {
    border-radius: 44px 0 0 44px;
  }
  .stat-card.tr,
  .stat-card.bl,
  .stat-card.br {
    border-radius: 0;
  }
  .stat-card.last {
    border-radius: 0 44px 44px 0;
  }
}
</style>
