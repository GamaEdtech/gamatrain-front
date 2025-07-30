<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <div class="w-100 text-h4 primary-gray-500">School Contact</div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Web site
        </div>
        <v-text-field
          v-model="website"
          rounded
          density="compact"
          placeholder="Web site"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[urlRule, requiredRule]"
        ></v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">Email</div>
        <v-text-field
          v-model="email"
          rounded
          density="compact"
          placeholder="Email"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule, emailRule]"
        ></v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">Phone</div>
        <v-text-field
          v-model="phone"
          rounded
          density="compact"
          placeholder="Phone"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule, phoneRule]"
        ></v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Location
        </div>
        <v-text-field
          v-model="location"
          rounded
          density="compact"
          placeholder="Location"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule]"
        ></v-text-field>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-2">
      <v-btn @click="cancel" size="x-small" variant="text" class="text-h5">
        Cancel
      </v-btn>
      <v-btn @click="preStep" icon color="#1D2939" height="40" width="40" flat>
        <v-icon size="x-large">md:arrow_back</v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  schoolInformation: {
    type: Object,
  },
});

const emit = defineEmits(["nextStep", "prevStep"]);

const website = ref("");
const email = ref("");
const phone = ref("");
const location = ref("");

watch(
  () => props.schoolInformation,
  () => {
    console.log("change scholl info", props.schoolInformation);
    if (props.schoolInformation) {
    }
  }
);

const requiredRule = (value) => !!value || "This field is required";
const emailRule = (value) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || "Enter a valid email address";
};
const phoneRule = (value) => {
  const numericPattern = /^[0-9]+$/;
  if (!numericPattern.test(value)) return "Only numbers are allowed";
  if (value.length < 8) return "At least 8 digits required";
  return true;
};
const urlRule = (value) => {
  if (!value) return true;
  const pattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(value) || "Enter a valid URL";
};

const isFormValid = computed(() => {
  return (
    emailRule(email.value) === true &&
    phoneRule(phone.value) === true &&
    requiredRule(location.value) === true &&
    requiredRule(website.value) === true
  );
});
const submitForm = () => {
  if (isFormValid.value) {
    const contactStepInfo = {
      webSite: website.value,
      email: email.value,
      phoneNumber: phone.value,
      address: location.value,
    };
    emit("nextStep", contactStepInfo);
  }
};

const preStep = () => {
  emit("prevStep");
};

const cancel = () => {
  router.push("/school");
};
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}
</style>
