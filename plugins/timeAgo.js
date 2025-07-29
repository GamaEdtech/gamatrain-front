import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$filters = {
    timeAgo: {
      calc(date) {
        if (!date) return '-'

        var timestamp = Date.parse(date) / 1000
        var strTime = ['second', 'min', 'hour', 'day', 'month', 'year']
        var length = ['60', '60', '24', '30', '12', '10']

        const currentDate = new Date()
        var currentTime = currentDate.getTime() / 1000

        if (currentTime >= timestamp) {
          var diff = currentTime - timestamp
          for (var i = 0; diff >= length[i] && i < length.length - 1; i++) {
            diff = diff / length[i]
          }

          diff = Math.round(diff)
          return `${diff} ${strTime[i]}${diff > 1 ? '\'s' : ''} ago`
        }

        return '-'
      },
    },
  }
})
