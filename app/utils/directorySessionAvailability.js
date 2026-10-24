import { getDirectorySessionKey } from './directoryPapers.js'

// Checks session counts with a one-item payload and caches the result per
// subject, year, session, paper and variant combination.
export const createDirectorySessionAvailability = (
  fetchCount,
  { makeState = value => value, concurrency = 2 } = {},
) => {
  const cache = new Map()
  const pending = new Map()
  const queue = []
  let running = 0

  const getState = (query) => {
    const key = getDirectorySessionKey(query)
    if (!cache.has(key)) cache.set(key, makeState({ status: 'idle' }))
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

  const seed = (query, available) => {
    getState(query).status = available ? 'available' : 'empty'
  }

  const check = (query) => {
    const params = { ...query }
    const key = getDirectorySessionKey(params)
    const state = getState(params)
    if (['available', 'empty'].includes(state.status)) return Promise.resolve(state.status)
    if (pending.has(key)) return pending.get(key).promise

    const controller = new AbortController()
    let finish
    const promise = new Promise((resolve) => {
      finish = resolve
    })
    const request = { controller, promise, state }
    pending.set(key, request)
    state.status = 'loading'

    queue.push(async () => {
      let status = 'cancelled'
      try {
        if (controller.signal.aborted) return
        const response = await fetchCount({
          ...params,
          is_paper: true,
          directory: true,
          page: 1,
          perpage: 1,
        }, controller.signal)
        if (controller.signal.aborted) return
        const total = Number(response?.data?.num)
        if (Number(response?.status) !== 1 || !Number.isFinite(total)) {
          throw new Error('Invalid session count response')
        }
        status = total > 0 ? 'available' : 'empty'
        state.status = status
      }
      catch {
        if (!controller.signal.aborted) {
          state.status = 'error'
          status = 'error'
        }
      }
      finally {
        if (pending.get(key) === request) pending.delete(key)
        if (controller.signal.aborted && state.status === 'loading') state.status = 'idle'
        finish(status)
      }
    })
    pump()
    return promise
  }

  const cancelPending = () => {
    for (const request of pending.values()) {
      request.controller.abort()
      if (request.state.status === 'loading') request.state.status = 'idle'
    }
    pending.clear()
  }

  const clear = () => {
    cancelPending()
    cache.clear()
  }

  return { getState, check, seed, cancelPending, clear }
}
