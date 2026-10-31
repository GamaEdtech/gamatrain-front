// Map items through an async loader with at most `limit` calls in flight,
// keeping results in input order. Rejects with the first failure.
export const mapWithLimit = async <T, R>(items: T[], limit: number, load: (item: T) => Promise<R>): Promise<R[]> => {
  const results = new Array<R>(items.length)
  let nextIndex = 0
  const workers = await Promise.allSettled(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await load(items[index]!)
    }
  }))
  const failure = workers.find(worker => worker.status === 'rejected')
  if (failure?.status === 'rejected') throw failure.reason
  return results
}
