<template>
  <!-- Root -->
  <div>
    <v-text-field
      v-model="locationInput"
      dense
      prepend-inner-icon="mdi-map-marker"
      :loading="location_loading"
      :label="label ? label : 'Business location'"
      :background-color="locationInput ? 'green lighten-4' : ''"
      outlined
      @focus="zoomOnLocation($event, [currentLat, currentLng])"
    />

    <!--    Location Map Dialog       -->
    <v-dialog
      v-model="locationDialog"
      transition="dialog-bottom-transition"
      fullscreen
      style="z-index: 20001"
      hide-overlay
      eager
    >
      <v-card>
        <v-toolbar
          class="dialogToolbar"
          color="teal"
          outlined
          dark
        >
          <v-toolbar-title class="text-h4">
            {{ "Select " + label }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              class="blink"
              text
              color="white"
              :loading="loading"
              @click="emitLocation"
            >
              Select
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <LeafletMap
          ref="locationMap"
          @location-selected="selectLocation"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LocationField',
  components: {
    // LeafletMap component removed as it was unused
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    defaultLocation: {
      type: String,
      default: '',
    },
  },
  emits: ['locationSelected'],
  data() {
    return {
      locationDialog: false,
      loading: false,
      locationInput: '',
      location_loading: false,
      currentLat: 32,
      currentLng: 50,
    }
  },
  watch: {},
  mounted() {
    if (
      !(
        this.defaultLocation
        || this.defaultLocation === null
        || this.defaultLocation === undefined
      )
    )
      this.getLocationByIp()
    else this.locationInput = `Selected: ${this.defaultLocation}`
  },
  methods: {
    zoomOnLocation(e, location) {
      this.$refs.locationMap.goToSearchLocation(location)
      e.target.blur()
      this.locationDialog = true
    },
    selectLocation(location) {
      this.loading = false
      this.locationDialog = false
      this.locationInput = `Selected: ${location.country}`
      this.$emit('locationSelected', {
        lat: location.lat,
        lng: location.lng,
        country_code: location.country_code,
        country: location.country,
        state: location.state,
        city: location.city,
      })
    },
    emitLocation() {
      // this.loading = true;
      // Tmp
      this.locationDialog = false
      // Emd tmp

      // this.$refs.locationMap.selectLocation();
    },
    async getLocationByIp() {
      this.location_loading = true
      await this.$fetch
        .$get('https://api.ipregistry.co', {
          params: {
            key: process.env.GEO_BY_IP_KEY,
          },
        })
        .then((response) => {
          if (response.location && response.location.latitude);
          console.log(response)
          // this.reverseLocation(response.location.latitude, response.location.longitude)
        })
        .finally((_msg) => {
          this.location_loading = false
        })
    },
    async reverseLocation(lat, lng) {
      await this.$fetch
        .$post('/api/reverse_location', {
          lat: lat,
          lng: lng,
        })
        .then((location) => {
          this.locationInput = `Current location: ${location.country}`
          this.currentLat = lat
          this.currentLng = lng
          this.$emit('locationSelected', {
            lat: lat,
            lng: lng,
            country_code: location.country_code,
            country: location.country,
            state: location.state,
            city: location.city,
          })
        })
    },
  },
}
</script>

<style scoped>
.blink {
  animation: blinker 4s linear infinite;
}

@keyframes blinker {
  60% {
    background: orangered;
  }
}
</style>
