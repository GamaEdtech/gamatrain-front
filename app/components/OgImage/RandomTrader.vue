<template>
  <div class="w-full h-full flex flex-col justify-center bg-[#000000]">
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute right-0 top-0"
    >
      <defs>
        <radialGradient
          id="grad"
          cx="600"
          cy="315"
          r="650"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stop-color="rgb(255,179,0)"
            stop-opacity="0.8"
          />
          <stop
            offset="34%"
            stop-color="rgb(0,0,0)"
            stop-opacity="1"
          />
        </radialGradient>
      </defs>

      <rect
        width="1200"
        height="630"
        fill="url(#grad)"
      />
    </svg>

    <div class="w-full h-full flex flex-col justify-center items-center">
      <h1 class="uppercase text-[34px] text-[#ffffff] mb-4 font-semibold">
        <img
          src="/favicon-32x32-dark.png"
          alt="Gamatrain"
          width="32"
          height="32"
        >
        GamaTrain.com
      </h1>

      <h1 class="text-[24px] text-[#ffffff] font-bold">
        Buy 50K of $GET and
      </h1>

      <h1 class="text-[24px] text-[#ffffff] font-bold">
        Win 10$ of $GET Every Day
      </h1>

      <h1 class="text-[20px] text-[#ffffff] font-bold">
        Winner Wallet Address : {{ walletAddress }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  walletAddress: string
}>()
</script>
