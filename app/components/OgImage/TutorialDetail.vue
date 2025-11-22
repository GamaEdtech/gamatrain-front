<template>
  <div class="w-full h-full flex flex-col justify-center bg-[#020420]">
    <svg
      class="absolute right-0 top-0"
      width="629"
      height="593"
      viewBox="0 0 629 593"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_199_94966)">
        <path
          d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z"
          fill="#ffb600"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_199_94966"
          x="0.873535"
          y="-659"
          width="1255.25"
          height="1251.52"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            flood-opacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.5"
            result="effect1_foregroundBlur_199_94966"
          />
        </filter>
      </defs>
    </svg>

    <div class="w-[600px] pl-[100px]">
      <p class="uppercase text-[24px] text-[#ffb600] mb-4 font-semibold">
        GamaTrain
      </p>
      <h1
        v-if="title"
        class="w-[600px] m-0 text-[50px] font-semibold mb-4 text-white"
        style="display: block; line-clamp: 2; text-overflow: ellipsis"
      >
        {{ title }}
      </h1>
      <div class="flex items-center gap-2 mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white"
          viewBox="0 -960 960 960"
          fill="white"
        >
          <path
            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Z"
          />
        </svg>
        <span class="text-[#E4E4E7] text-[20px]">Last update: {{ up_date.split(" ")[0] }}</span>
      </div>
      <div class="flex items-center gap-2 mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white"
          viewBox="0 -960 960 960"
          fill="white"
        >
          <path
            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Z"
          />
        </svg>
        <span class="text-[#E4E4E7] text-[20px]">Viewed: {{ views }}</span>
      </div>
    </div>

    <div class="absolute top-[260px] right-[140px]">
      <img
        src="/images/gamatrain-logo.svg"
        alt="Gamatrain"
        class="h-10"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  views: string
  up_date: string
}>()
</script>
