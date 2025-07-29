<template>
  <section class="token-purchase-bg">
    <div class="token-purchase-container">
      <div class="token-purchase-content">
        <h2 class="main-heading">
          Join the Movement
        </h2>
        <h3 class="sub-heading">
          Buy <span class="head-yellow">$GET</span> Today
        </h3>
        <p class="token-purchase__description">
          Empower education. Power the Gama ecosystem.
        </p>
        <div class="d-flex justify-center align-center flex-column mt-8">
          <div class="token-purchase__title mb-1">
            Buy now on
          </div>
          <a
            target="_blank"
            href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
            rel="noopener noreferrer"
            class="token-purchase__btn"
          >
            <img
              src="/images/token/CTA/jupiter.png"
              alt="Jupiter exchange logo"
              class="jupiter-logo"
            >
            <div class="pl-3">Jupiter</div>
          </a>
        </div>
      </div>
      <figure>
        <img
          src="/images/token/CTA/CTA_People_Mobile.svg"
          alt="People holding Gama tokens illustration"
          class="token-purchase__illustration d-none d-md-block"
        >
        <img
          src="/images/token/CTA/CTA_People_Tablet.svg"
          alt="People holding Gama tokens illustration for tablet"
          class="token-purchase__illustration d-none d-sm-block d-md-none"
        >
        <img
          src="/images/token/CTA/CTA_People_Mobile.svg"
          alt="People holding Gama tokens illustration for mobile"
          class="token-purchase__illustration d-sm-none"
        >
      </figure>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
/* === MOBILE (default) === */
.token-purchase-bg { background: linear-gradient(to bottom, #999999, #f2f2f2); position: relative; overflow: hidden; padding-bottom: 3rem; }
.token-purchase-container { display: flex; flex-direction: column; justify-content: center; align-items: center; padding-top: 7rem; max-width: 1200px; margin: 0 auto; width: 100%; position: relative; }
.token-purchase-content { position: relative; z-index: 3; max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 2rem; margin-bottom: 0; }
.token-purchase__illustration { position: static !important; display: block; margin: 2.5rem auto 0 auto; left: unset !important; right: unset !important; bottom: unset !important; transform: none !important; width: 90%; max-width: 800px; z-index: 1; }
.token-purchase__title { color: #000000; font-size: 18px; font-weight: 700; }
.main-heading { font-size: 34px; font-weight: 700; color: #fff; text-align: center; }
.sub-heading { font-size: 34px; font-weight: 700; color: #4e545b; text-align: center; }
.sub-heading .head-yellow { color: #fecd1c; }
.token-purchase__description { color: #6e7781; font-size: 14px; font-weight: 500; text-align: center; }
.token-purchase__btn { background: #000000; display: flex; align-items: center; justify-content: center; height: 48px; width: 160px; border-radius: 6px; font-size: 24px; font-weight: 600; color: #ffffff; }
.token-purchase__btn img { width: 27px; height: 27px; }

/* === TABLET (min-width: 600px and max-width: 1199px) === */
@media (min-width: 600px) and (max-width: 1199px) {
  .token-purchase-bg { padding-bottom: 4rem; }
  .token-purchase-content { margin-bottom: 0; }
  .token-purchase__illustration { max-width: 900px; margin-top: 3rem; }
  .token-purchase__title { color: #161716; font-size: 24px; font-weight: 500; }
  .token-purchase__description { font-size: 20px; padding-top: 2rem; }
  .main-heading { font-size: 56px; font-weight: 700; }
  .sub-heading { font-size: 56px; font-weight: 700; }
}

/* === DESKTOP (min-width: 1200px) === */
@media (min-width: 1200px) {
  .token-purchase-bg { padding-bottom: 5rem; }
  .token-purchase-content { margin-bottom: 0; }
  .token-purchase__illustration { width: 900px; max-width: 100%; margin-top: 1rem; }
  .token-purchase__title { color: #313231; font-size: 24px; font-weight: 600; }
  .main-heading { font-size: 76px; font-weight: 700; margin-bottom: 2rem; }
  .sub-heading { font-size: 64px; font-weight: 700; margin-bottom: 1.5rem; }
  .token-purchase__description { color: #24292f; font-size: 24px; font-weight: 400; text-align: center; margin-bottom: 2rem; }
  .token-purchase__btn { height: 68px; width: 215px; font-size: 32px; font-weight: 600; margin-bottom: 1rem; }
  .token-purchase__btn img { width: 40px; height: 40px; }
}

/* === XL Illustration (min-width: 1100px) === */
@media (min-width: 1100px) {
  .token-purchase__illustration {
    width: 900px;
    max-width: 100%;
  }
}
</style>
