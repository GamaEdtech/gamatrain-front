import { getDirectorySessionKey } from './directoryPapers.js'

// A page is fetched only on demand. All session views share this cache and queue.
export const createDirectoryPaperLoader = (fetchPage, { makeState = value => value, pageSize = 20, concurrency = 2 } = {}) => {
  const cache = new Map()
  const pending = new Map()
  const queue = []
  let running = 0

  const getState = (query) => {
    const key = getDirectorySessionKey(query)
    if (!cache.has(key)) {
      cache.set(key, makeState({ items: [], page: 0, total: null, loaded: false, hasMore: true, loading: false, error: false }))
    }
    return cache.get(key)
  }

  const pump = () => {
    while (running < concurrency && queue.length) {
      const job = queue.shift()
      running++
      job().finally(() => {
        running--
        pump()
      })
    }
  }

  const appendPage = (state, response) => {
    if (Number(response?.status) !== 1 || !Array.isArray(response?.data?.list)) {
      throw new Error('Invalid directory response')
    }
    const list = response.data.list
    const known = new Set(state.items.map(item => String(item.id)))
    state.items.push(...list.filter(item => !known.has(String(item.id))))
    state.page++
    const total = Number(response.data.num)
    state.total = response.data.num != null && Number.isFinite(total) ? total : null
    state.loaded = true
    state.hasMore = list.length > 0 && (state.total === null
      ? list.length === pageSize
      : state.items.length < state.total)
  }

  const seed = (query, response) => {
    const state = getState(query)
    if (state.loaded) return
    appendPage(state, response)
  }

  const load = (query) => {
    const params = { ...query }
    const key = getDirectorySessionKey(params)
    const state = getState(params)
    if (!state.hasMore) return Promise.resolve('empty')
    if (pending.has(key)) return pending.get(key).promise

    const controller = new AbortController()
    let finish
    const promise = new Promise((resolve) => {
      finish = resolve
    })
    const request = { controller, promise, state }
    pending.set(key, request)
    state.loading = true
    state.error = false

    queue.push(async () => {
      let status = 'cancelled'
      try {
        if (controller.signal.aborted) return
        const response = await fetchPage({
          ...params,
          is_paper: true,
          directory: true,
          page: state.page + 1,
          perpage: pageSize,
        }, controller.signal)
        if (controller.signal.aborted) return
        appendPage(state, response)
        status = state.hasMore ? 'ok' : 'empty'
      }
      catch {
        if (!controller.signal.aborted) {
          state.error = true
          status = 'error'
        }
      }
      finally {
        if (pending.get(key) === request) {
          pending.delete(key)
          state.loading = false
        }
        finish(status)
      }
    })
    pump()
    return promise
  }

  const cancelPending = () => {
    for (const request of pending.values()) {
      request.controller.abort()
      request.state.loading = false
    }
    pending.clear()
  }

  const clear = () => {
    cancelPending()
    cache.clear()
  }

  return { getState, load, seed, cancelPending, clear }
}
