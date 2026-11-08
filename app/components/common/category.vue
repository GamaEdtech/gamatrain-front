<template>
  <div
    id="main-category "
    class="mt-md-16"
  >
    <!--   Start: category  main-container Desktop -->
    <v-container id="main-category-container">
      <v-row>
        <v-col cols="12">
          <v-sheet class="category-sheet mx-auto">
            <v-slide-group
              multiple
              show-arrows
            >
              <v-slide-group-item
                v-for="(item, category) in items"
                :key="category"
              >
                <div class="category-itm-content">
                  <v-btn
                    class="category-btn"
                    :to="item.link"
                    :color="item.color"
                    depressed
                    :aria-label="item.text"
                  >
                    <span
                      :class="item.icon"
                      class="icon text-white"
                    />
                  </v-btn>
                  <div
                    :style="`color:${item.color}`"
                    class="category-text"
                  >
                    {{ item.text }}
                  </div>
                </div>
              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!--   End: category    -->
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedItem: 1,
    showMore: false,
    items: [
      {
        class: 'test',
        color: '#01579b',
        text: 'Past Papers',
        icon: 'icon-paper',
        link: '/search?type=paper',
      },
      {
        class: 'content',
        color: '#2e7d32',
        text: 'Multimedia',
        icon: 'icon-multimedia',
        link: '/search?type=multimedia',
      },
      {
        class: 'faq',
        color: '#bf360c',
        text: 'Forum',
        icon: 'icon-q-a',
        link: '/search?type=forum',
      },
      {
        class: 'exam',
        color: '#5600e8',
        text: 'QuizHub',
        icon: 'icon-exam',
        link: '/search?type=quizhub',
      },
      {
        class: 'textbook',
        color: '#bd081c',
        text: 'Tutorial',
        icon: 'icon-tutorial',
        link: '/search?type=tutorial',
      },
      {
        class: 'school',
        color: '#a5673f',
        text: 'School',
        icon: 'icon-school',
        link: '/school',
        status: 'disabled',
      },
      // {
      //   class: "tutor",
      //   color:"#8e24aa",
      //   text: "Tutor",
      //   icon: "icon-teacher",
      //   link: "/search?type=tutor",
      //   status: "disabled",
      // },
    ],
  }),
}
</script>

<style>
#main-category-container {
  margin-top: 3.75rem;
  width: 25rem;
  margin-left: auto;
  margin-right: auto;

  .category-sheet {
    max-width: 100%;
  }

  .category-itm-content {
    margin-left: 0.625rem;
    margin-right: 0.625rem;
    text-align: center;
  }

  .category-btn {
    border-radius: 15%;
    height: 2.5rem;
    min-width: 2.5rem !important;
    width: 2.5rem !important;
  }

  .category-text {
    font-size: 0.75rem;
    font-weight: 400;
    margin-top: 0.3125rem;
  }

  .icon {
    font-size: 1.5625rem !important;
  }
}

#main-category .icon {
  color: #ffffff !important;
}

@media (min-width: 600px) {
  #main-category-container {
    width: 34.375rem;

    .category-itm-content {
      margin-left: 0.9375rem;
      margin-right: 0.9375rem;
      text-align: center;
    }

    .category-btn {
      border-radius: 15%;
      height: 3.125rem !important;
      width: 3.125rem !important;
    }

    .category-text {
      font-size: 0.9375rem;
      font-weight: 600;
      margin-top: 0.625rem;
    }

    .icon {
      font-size: 2.1875rem !important;
    }
  }
}

@media (min-width: 960px) {
  #main-category-container {
    margin-top: 5rem;
    width: 50rem;

    .category-sheet {
      max-width: 90%;
    }

    .category-itm-content {
      margin-left: 1.25rem;
      margin-right: 1.25rem;
      text-align: center;
    }

    .category-btn {
      border-radius: 15%;
      height: 3.75rem !important;
      width: 3.75rem !important;
    }

    .category-text {
      font-size: 0.9375rem;
      font-weight: 600;
      margin-top: 0.625rem;
    }

    .icon {
      font-size: 2.1875rem !important;
    }
  }
}
@media (min-width: 1264px) {
  #main-category-container {
    margin-top: 1.25rem;
    max-width: 50rem;
    width: 50rem;

    .category-itm-content {
      margin-left: 1.25rem;
      margin-right: 1.25rem;
      text-align: center;
    }

    .category-btn {
      border-radius: 15%;
      height: 3.75rem;
      width: 3.75rem;
    }

    .category-text {
      font-size: 0.9375rem;
      font-weight: 600;
      margin-top: 0.625rem;
    }

    .icon {
      font-size: 2.1875rem !important;
    }
  }
}
</style>
