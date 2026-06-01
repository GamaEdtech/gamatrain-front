<template>
    <v-btn v-if="props.isMapMode" icon class="near-me-button position-absolute"
        :loading="isLoading || props.dataLoading" :disabled="isLoading" @click="emit('fetch-user-location')">
        <ClientOnly>
            <DotLottieVue class="lottie-animation" src="/images/near-me-gps-dark.json" autoplay loop />
        </ClientOnly>
    </v-btn>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

/**
 * Floating "Near Me" button displayed in map mode.
 *
 * @param isMapMode Controls button visibility.
 * @param dataLoading Controls button loading state.
 * @emits fetch-user-location Requests the parent to fetch the user's location.
 */
interface Props {
    isMapMode?: boolean;
    dataLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isMapMode: false,
    dataLoading: false
})

const emit = defineEmits<{
    'fetch-user-location': []
}>()

const { isLoading } = useCurrentLocation()
</script>

<style scoped lang="scss">
@import '../../../assets/scss/mixin.scss';

.near-me-button {
    z-index: 401;
    right: 20px;
    bottom: 150px;

    @include main-size-xl {
        right: 40px;
        bottom: 50px;
    }

    .lottie-animation {
        display: flex;
        align-items: center;
        justify-items: start;
    }
}
</style>