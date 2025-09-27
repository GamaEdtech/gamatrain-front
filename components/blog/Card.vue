<template>
  <v-col
    cols="12"
    class="mobile-item d-block d-sm-none"
  >
    <v-card
      class="card-blog"
      flat
      :to="`/blog/${blog.id}/${blog.slug}`"
    >
      <div class="ma-1 image-blog-div">
        <!-- <NuxtImg
                  width="180px"
                  height="135px"
                  :src="blog.pic"
                  placeholder
                  class="nuxt-image"
                /> -->
        <v-img
          width="180px"
          height="160px"
          cover
          :alt="blog.title"
          :src="blog.imageUri.replace(/^http:\/\//, 'https://')"
          class="nuxt-image"
        />
        <v-card-title>
          <span class="gama-text-button">
            {{ blog.title }}
          </span>
        </v-card-title>
      </div>
      <div class="gama-text-subtitle2">
        <span v-html="truncateBody(blog.summary, 32)" />
        <span class="read-more">Read more</span>
      </div>
    </v-card>
  </v-col>
  <v-col
    cols="12"
    sm="10"
    class="d-none d-sm-block"
  >
    <div class="d-flex">
      <nuxt-link :to="`/blog/${blog.id}/${blog.slug}`">
        <v-img
          width="180px"
          height="135px"
          cover
          :alt="blog.title"
          :src="blog.imageUri.replace(/^http:\/\//, 'https://')"
          class="nuxt-image rounded-lg"
        />
      </nuxt-link>

      <nuxt-link
        class="item-text d-flex flex-column justify-center ga-4 px-2 w-100"
        :to="`/blog/${blog.id}/${blog.slug}`"
      >
        <h2 class="text-h4 font-weight-bold">{{ blog.title }}</h2>
        <div class="d-flex">
          <span
            class="summary-blog"
            v-html="truncateBody(blog.summary, 142)"
          />
          <span class="read-more font-weight-bold">Read more</span>
        </div>
      </nuxt-link>
    </div>
  </v-col>
</template>

<script setup>
defineProps({
  blog: {
    type: Object,
    default: () => {},
  },
})

const truncateBody = (text, fixedLength = null) => {
  let cutLength = fixedLength ?? 200
  if (!fixedLength) {
    if (sm.value) cutLength = 142
    else if (xs.value) cutLength = 38
  }
  return text.length > cutLength
    ? text.slice(0, cutLength) + '...'
    : text + '...'
}
</script>

<style>
.nuxt-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.summary-blog {
  color: #6e7781;
}
.read-more {
  color: #ffb600;
}

/* .mobile-item {
  .slide-loading {
    .v-skeleton-loader__image {
      min-width: 24rem;
      height: 18rem;
      position: relative;
      border-radius: 0.6rem;
    }
  }
}

.card-blog {
  width: 24rem;
  height: 18rem;
  margin: auto auto;
  position: relative;
  border-radius: 0.6rem;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  overflow: unset;

  .image-blog-div {
    width: 24rem;
    height: 18rem;

    .v-card-title {
      border-radius: 0px 0px 6px 6px;
      background: rgba(36, 41, 47, 0.7);
      backdrop-filter: blur(7.5px);
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      font-family: "Inter";
      margin: 0 auto;
      color: #fff;
      padding-top: 0.6rem !important;
      padding-bottom: 0.6rem;
      height: 4.9rem;
      max-height: 4.9rem;
      white-space: wrap;
      display: flex;
      align-items: center;

      .gama-text-button {
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .nuxt-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
    }

    .v-img {
      min-width: 24rem;
      height: 18rem;
    }
  }
}

.gama-text-subtitle2 {
  margin: auto auto;
  max-width: 18.2rem;
  text-align: left;
  color: #6e7781;

  & > a {
    color: #ffb600;
  }
  .read-more {
    color: #ffb600;
  }
} */
</style>
