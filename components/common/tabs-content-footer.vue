<template>
  <div class="d-flex justify-space-between w-100 card-footer">
    <div class="d-flex">
      <div class="item-content-user d-flex align-center mr-2">
        <img
          :src="require('@/assets/images/' + footerCard.userImg)"
          alt=""
        >
        <p class="mx-2">
          {{ footerCard.user }}
        </p>
      </div>
      <div class="item-content-file-answers">
        <i class="fa-solid fa-arrow-rotate-left" />
        <p class="mx-2">
          <span class="answers">Answers:</span> {{ footerCard.answers }}
        </p>
      </div>
      <div class="item-content-file-type mx-auto">
        <i class="fa-solid fa-folder" />
        <p class="mx-2">
          <span class="file-type">file type:</span> {{ footerCard.type }}
        </p>
      </div>
      <div class="item-content-test-type mx-auto">
        <i class="fa-solid fa-folder" />
        <p class="mx-2">
          <span class="test-type">test type:</span> {{ footerCard.type }}
        </p>
      </div>
      <div class="item-content-view mx-auto">
        <i class="fa-solid fa-eye" />
        <p class="mx-2">
          <span class="view">view:</span> {{ footerCard.view }}
        </p>
      </div>
      <div class="item-content-last-update mx-auto">
        <i class="fa-solid fa-calendar-days" />
        <p class="mx-2">
          <span class="last-update">last update:</span> {{ footerCard.update }}
        </p>
      </div>
    </div>
    <div class="item-content-footer-icon d-flex flex-column">
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mb-2"
      >
        <path
          d="M10 0L0 2V16L10 18V0ZM12 2V4H18V6H12V8H18V10H12V12H18V14H12V16H19C19.552 16 20 15.552 20 15V3C20 2.448 19.552 2 19 2H12ZM1.29492 5.29492H2.83008L3.32227 8.77344C3.35727 8.98244 3.38458 9.26714 3.39258 9.61914H3.41797C3.42597 9.36214 3.46244 9.06891 3.52344 8.75391L4.1543 5.29492H6.02344L6.60742 8.74219C6.64242 8.92319 6.66736 9.1892 6.69336 9.5332H6.71289C6.72089 9.2662 6.74725 8.98913 6.78125 8.70312L7.25977 5.29492H8.70312L7.32031 12.7051H6.00586L5.12695 8.74414C5.08295 8.49714 5.05883 8.21906 5.04883 7.91406H5.03125C5.01325 8.24706 4.97855 8.52414 4.93555 8.74414L4.03906 12.7051H2.67188L1.29492 5.29492Z"
          fill="#616161"
        />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 7.5C9.5 8.33 8.83 9 8 9H7V11H5.5V5H8C8.83 5 9.5 5.67 9.5 6.5V7.5ZM14.5 9.5C14.5 10.33 13.83 11 13 11H10.5V5H13C13.83 5 14.5 5.67 14.5 6.5V9.5ZM18.5 6.5H17V7.5H18.5V9H17V11H15.5V5H18.5V6.5ZM7 7.5H8V6.5H7V7.5ZM2 4H0V18C0 19.1 0.9 20 2 20H16V18H2V4ZM12 9.5H13V6.5H12V9.5Z"
          fill="#616161"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footerCard: {
      type: Object,
      required: true,
    },
  },
}
</script>
