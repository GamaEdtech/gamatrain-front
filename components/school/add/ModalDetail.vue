<template>
  <v-dialog
    v-model="dialogModel"
    max-width="400"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex align-center flex-wrap flex-column bg-white pa-2 pa-sm-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <div class="w-100 d-none d-md-flex align-center justify-end">
        <v-icon class="ml-4" size="x-large" color="#D0D5DD" @click="closeModal">
          mdi-close-circle
        </v-icon>
      </div>
      <div class="w-100 d-flex justify-center align-center mt-4 pa-2 pa-md-4">
        <NuxtLink
          :to="`/school/${schoolInformation.id}/${$slugGenerator(
            schoolInformation.name,
          )}`"
          class="w-100 d-flex flex-column justify-end position-relative rounded-lg card-detail-school"
        >
          <v-icon
            color="#344054"
            size="small"
            class="position-absolute position-bookmark"
            >mdi-bookmark</v-icon
          >
          <NuxtImg
            v-if="schoolInformation?.defaultImageUri"
            :alt="schoolInformation?.name"
            width="320px"
            height="320px"
            :src="
              schoolInformation?.defaultImageUri?.replace(
                /^http:\/\//,
                'https://',
              )
            "
            placeholder
            class="w-100 h-100 rounded-lg position-absolute"
          />
          <div
            class="w-100 d-flex flex-column justify-space-between align-center rounded-t-lg pa-4 info-top-section"
          >
            <span
              class="w-100 text-h5 font-weight-bold primary-gray-700 ga-2 mb-2"
            >
              <!-- <v-btn
                size="x-small"
                color="#12B76A"
                flat
                icon="mdi-cloud-upload"
                width="20"
                height="20"
              ></v-btn> -->
              {{ schoolInformation?.name }}
            </span>

            <span
              class="w-100 text-h6 font-weight-medium primary-gray-500"
              v-if="schoolInformation?.address"
            >
              {{ schoolInformation?.address }}
            </span>

            <div class="w-100 d-flex justify-space-between flex-wrap mt-2">
              <div class="d-flex ga-2">
                <span
                  v-if="schoolInformation?.review"
                  class="text-h6 font-weight-medium primary-gray-500 mt-1"
                  >Reviews</span
                >
                <span
                  v-if="schoolInformation?.review"
                  class="text-h6 font-weight-bold primary-gray-800 mt-1"
                >
                  {{ schoolInformation?.review }}</span
                >
                <v-rating
                  :model-value="
                    schoolInformation.score
                      ? Math.floor(schoolInformation.score)
                      : 0
                  "
                  length="5"
                  readonly
                  color="primary"
                  active-color="primary"
                  size="16"
                />
              </div>
              <div
                class="d-flex align-end ga-2"
                v-if="schoolInformation?.tuition"
              >
                <span class="text-h6 font-weight-medium primary-gray-500 mt-1"
                  >Tuition</span
                >
                <v-chip
                  class="font-weight-bold text-h6"
                  color="red"
                  size="x-small"
                  variant="flat"
                  >${{ schoolInformation?.tuition }}</v-chip
                >
              </div>
            </div>

            <div class="w-100 d-flex justify-space-between mt-2">
              <div
                class="d-flex align-end ga-2"
                v-if="schoolInformation?.teacher"
              >
                <span class="text-h6 font-weight-medium primary-gray-500 mt-1"
                  >Teachers</span
                >
                <span class="text-h6 font-weight-bold primary-gray-800 mt-1">{{
                  schoolInformation?.teacher
                }}</span>
              </div>

              <v-divider
                v-if="schoolInformation?.teacher"
                :thickness="2"
                class="border-opacity-100"
                color="#E4E7EC"
                vertical
              ></v-divider>
              <div
                class="d-flex align-end ga-2"
                v-if="schoolInformation?.student"
              >
                <span class="text-h6 font-weight-medium primary-gray-500 mt-1"
                  >Students</span
                >
                <span class="text-h6 font-weight-bold primary-gray-800 mt-1">{{
                  schoolInformation?.student
                }}</span>
              </div>
              <v-divider
                v-if="schoolInformation?.student"
                :thickness="2"
                class="border-opacity-100"
                color="#E4E7EC"
                vertical
              ></v-divider>
              <div
                class="d-flex align-end ga-2"
                v-if="schoolInformation?.ratio"
              >
                <span class="text-h6 font-weight-medium primary-gray-500 mt-1"
                  >Ratio</span
                >
                <span class="text-h6 font-weight-bold primary-gray-800 mt-1">{{
                  schoolInformation?.ratio
                }}</span>
              </div>
            </div>
          </div>
          <div
            class="w-100 d-flex rounded-b-lg align-center justify-space-between info-bottom-section pr-2 pl-2"
          >
            <div class="d-flex align-center">
              <v-btn
                variant="text"
                icon
                width="30"
                height="30"
                :disabled="!schoolInformation.hasLocation"
              >
                <v-icon color="#344054"> mdi-map-marker </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                width="30"
                height="30"
                :disabled="!schoolInformation.hasPhone"
              >
                <v-icon color="#344054"> mdi-phone </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                width="30"
                height="30"
                :disabled="!schoolInformation.hasEmail"
              >
                <v-icon color="#344054"> mdi-email </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                width="30"
                height="30"
                :disabled="!schoolInformation.hasWebsite"
              >
                <v-icon color="#344054"> mdi-web </v-icon>
              </v-btn>
            </div>
            <div class="d-flex align-center">
              <span class="text-h6 font-weight-normal primary-gray-700"
                >Details</span
              >
              <v-icon size="small" color="#344054">mdi-chevron-right</v-icon>
            </div>
          </div>
        </NuxtLink>
      </div>

      <v-divider
        :thickness="2"
        class="w-100 mt-4 mb-6 border-opacity-100 max-width-contianer-modal"
        color="#E4E7EC"
      >
      </v-divider>

      <span
        class="w-100 text-h5 font-weight-bold primary-gray-700 max-width-contianer-modal"
        >A matching school was found!</span
      >

      <div class="w-100 d-flex justify-center align-center ga-2 mt-4">
        <v-btn
          color="#E4E7EC"
          variant="outlined"
          flat
          rounded="xl"
          height="40"
          max-width="180"
          class="w-50 text-h5"
          @click="newSchool"
        >
          <span class="primary-gray-700">New School</span>
        </v-btn>
        <v-btn
          color="#ffb600"
          flat
          rounded="xl"
          height="40"
          max-width="180"
          class="w-50 text-h5"
          @click="editSchool"
        >
          Edit School
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { $slugGenerator } = useNuxtApp();
const { mdAndUp } = useDisplay();

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  schoolInformation: {
    type: Object,
  },
});

const emit = defineEmits(["update:showDialog", "editSchool", "newSchool"]);

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialog,
  set: (value) => emit("update:showDialog", value),
});

const closeModal = () => {
  emit("update:showDialog", false);
};
// End Section Handle Status Modal

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit("update:showDialog", false);
  }
};

const clickOnModal = (event) => {
  event.stopPropagation();
};

const newSchool = () => {
  emit("newSchool");
};

const editSchool = () => {
  emit("editSchool");
};
</script>

<style scoped>
.card-detail-school {
  min-height: 320px;
  max-width: 360px;
  background-color: #f2f4f7;
  text-decoration: none;
}
.info-top-section {
  background-color: #fffffff2;
  z-index: 2;
}
.info-bottom-section {
  min-height: 40px;
  background-color: #f2f4f7;
  z-index: 2;
}
.position-bookmark {
  top: 10px;
  right: 10px;
}
.max-width-contianer-modal {
  max-width: 360px;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
