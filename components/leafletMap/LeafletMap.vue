<template>
  <div>
    <LocationSearch
      label="Location"
      class="mapSearch"
      :solo="true"
      @location-selected="goToSearchLocation"
    />

    <div id="map-wrap">
      <client-only>
        <l-map
          ref="map"
          :zoom="map.zoom"
          :center="map.center"
        >
          <l-tile-layer :url="map.url" />
          <l-marker :lat-lng="map.markerLocation" />
        </l-map>
      </client-only>
    </div>
  </div>
</template>

<script>
import LocationSearch from '@/components/form/LocationSearch'

export default {
  name: 'LeafletMap',
  components: { LocationSearch },
  emits: ['locationSelected'],
  data() {
    return {
      map: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 8,
        center: [55.9464418, 8.1277591],
        markerLocation: [55.9464418, 8.1277591],
        object: null,
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map.object = this.$refs.map.mapObject
      this.map.object.on('drag', (_e) => {
        const center = this.map.object.getCenter()
        this.map.markerLocation = [center.lat, center.lng]
      })
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    })
  },
  methods: {
    async selectLocation() {
      const nameSearchResult = await this.$fetch.post('/api/reverse_location', {
        lat: this.map.markerLocation[0],
        lng: this.map.markerLocation[1],
      })

      if (nameSearchResult.status == 200) {
        let locationName
          = (nameSearchResult.data.country
            ? nameSearchResult.data.country + ','
            : '') // country
            + (nameSearchResult.data.state
              ? nameSearchResult.data.state + ','
              : '') // state
              + (nameSearchResult.data.province
                ? nameSearchResult.data.province + ','
                : '') // province
                + (nameSearchResult.data.region
                  ? nameSearchResult.data.region + ','
                  : '') // region
                  + (nameSearchResult.data.subdistrict
                    ? nameSearchResult.data.subdistrict + ','
                    : '') // subdistrict
                    + (nameSearchResult.data.county
                      ? nameSearchResult.data.county + ','
                      : '') // county
                      + (nameSearchResult.data.city ? nameSearchResult.data.city + ',' : '') // city
                      + (nameSearchResult.data.suburb
                        ? nameSearchResult.data.suburb + ','
                        : '') // suburb
                        + (nameSearchResult.data.town ? nameSearchResult.data.town + ',' : '') // town
                        + (nameSearchResult.data.road ? nameSearchResult.data.road + ',' : '') // road
                        + (nameSearchResult.data.district
                          ? nameSearchResult.data.district + ','
                          : '') // district
                          + (nameSearchResult.data.village
                            ? nameSearchResult.data.village + ','
                            : '') // village
                            + (nameSearchResult.data.postcode
                              ? nameSearchResult.data.postcode
                              : '') // postcode
        locationName
          = locationName[locationName.length - 1] === ','
            ? locationName.substr(0, locationName.length - 1)
            : locationName

        const state = () => {
          if (nameSearchResult.data.state) {
            return nameSearchResult.data.state
          }
          if (nameSearchResult.data.province) {
            return nameSearchResult.data.province
          }
          return ''
        }

        // return data
        this.$emit('locationSelected', {
          lat: this.map.markerLocation[0],
          lng: this.map.markerLocation[1],
          locationName: locationName,
          country_code: nameSearchResult.data.country_code,
          country: nameSearchResult.data.country,
          state: state(),
          city: nameSearchResult.data.city,
        })
      }
    },
    goToSearchLocation(event) {
      this.map.center = [event[0], event[1]]
      this.map.markerLocation = [event[0], event[1]]
      this.refreshMap()
    },
    refreshMap() {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    },
  },
}
</script>

<style scoped>
#map-wrap {
  height: 91vh;
}

.mapSearch {
  margin-top: 12px !important;
  margin-left: 50px;
  z-index: 1005 !important;
  position: absolute !important;
  width: 320px !important;
  max-width: 320px;
}
</style>
