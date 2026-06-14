<template>
  <div class="d-flex align-center justify-center position-relative">
    <v-icon
      :size="size"
      :color="color"
      class="location-icon"
    >
      md:location_searching
    </v-icon>

    <div class="inner-wrap position-absolute">
      <div class="circle-wrap position-absolute d-flex align-center justify-center">
        <v-icon
          :size="size"
          :color="color"
          class="circle-icon"
        >
          md:circle
        </v-icon>
      </div>

      <div class="line-wrap position-absolute d-flex align-center justify-center">
        <v-icon
          :size="size"
          :color="color"
          class="line-icon"
        >
          md:check_indeterminate_small
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ILocationIcon {
  color?: string
  size?: string
}

withDefaults(
  defineProps<ILocationIcon>(),
  {
    color: 'currentColor',
    size: 'large',
  },
)
</script>

<style scoped>
.inner-wrap {
    inset: 0;
}

.circle-icon {
    transform: scale(0.3);
    transform-origin: center;
}

.line-icon {
    transform: scale(0.6);
    transform-origin: center;
}

.location-icon {
    animation: iconCycle 2.3s infinite ease-in-out;
}

.circle-wrap {
    animation: circleCycle 2.3s infinite ease-in-out;
}

.line-wrap {
    animation: lineCycle 2.3s infinite ease-in-out;
}

@keyframes iconCycle {
    0% {
        transform: scale(0.80);
    }

    8% {
        transform: scale(0.86);
    }

    16% {
        transform: scale(0.85);
    }

    25%,
    45% {
        transform: scale(0.85);
    }

    50% {
        transform: scale(0.80);
    }

    58% {
        transform: scale(0.86);
    }

    66% {
        transform: scale(0.85);
    }

    75%,
    100% {
        transform: scale(0.85);
    }
}

@keyframes circleCycle {

    0%,
    45% {
        opacity: 0;
        transform: scale(0.85);
    }

    8%,
    35% {
        opacity: 1;
        transform: scale(1.05);
    }

    50%,
    100% {
        opacity: 0;
        transform: scale(0.85);
    }
}

@keyframes lineCycle {

    0%,
    45% {
        opacity: 1;
        transform: scale(0.85);
    }

    8%,
    35% {
        opacity: 0;
        transform: scale(0.85);
    }

    50%,
    100% {
        opacity: 1;
        transform: scale(0.85);
    }
}
</style>
