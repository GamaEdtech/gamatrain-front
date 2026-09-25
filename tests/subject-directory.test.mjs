import assert from 'node:assert/strict'
import test from 'node:test'
import { getDirectoryVariantOptions } from '../app/utils/directoryFilterOptions.js'
import { createDirectoryPaperLoader } from '../app/utils/directoryPaperLoader.js'
import { createDirectorySessionAvailability } from '../app/utils/directorySessionAvailability.js'
import {
  getDirectoryDownloadParams, getDirectoryExamIds, getDirectoryPaperCode,
  getDirectoryPaperDownloads, getDirectoryPaperLink, getDirectoryPaperTitle,
} from '../app/utils/directoryPapers.js'

const query = { lesson: '2194', edu_year: 2026, edu_month: 6, test_type: '6320', variant: '7814' }
const result = (ids, total = ids.length) => ({ status: 1, data: { num: String(total), list: ids.map(id => ({ id })) } })
const deferred = () => {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test('shows only directory variants 1 through 3 in numeric order', () => {
  const variants = [
    { id: '4', title: '4' },
    { id: 'nv', title: 'nv' },
    { id: '3', title: '3' },
    { id: '1', title: ' 1 ' },
    { id: '2', title: 2 },
  ]

  const options = getDirectoryVariantOptions(variants)
  assert.deepEqual(options.map(item => item.id), ['1', '2', '3'])
  assert.deepEqual(options.map(item => item.title), ['1', '2', '3'])
})

test('requests one filtered page at a time, stops at num and reuses cached results', async () => {
  const calls = []
  const loader = createDirectoryPaperLoader(async (params) => {
    calls.push(params)
    return params.page === 1 ? result(['1', '2'], 3) : result(['3'], 3)
  }, { pageSize: 2 })
  assert.equal(calls.length, 0)
  assert.equal(await loader.load(query), 'ok')
  assert.deepEqual(calls[0], { ...query, is_paper: true, directory: true, page: 1, perpage: 2 })
  assert.equal(loader.getState(query).items.length, 2)
  assert.equal(await loader.load(query), 'empty')
  assert.equal(calls[1].page, 2)
  assert.equal(loader.getState(query).items.length, 3)
  await loader.load(query)
  assert.equal(calls.length, 2)
})

test('remembers an empty response without probing other years or months', async () => {
  let calls = 0
  const loader = createDirectoryPaperLoader(async () => {
    calls++
    return result([])
  })
  assert.equal(await loader.load(query), 'empty')
  assert.equal(loader.getState(query).loaded, true)
  assert.equal(loader.getState(query).error, false)
  await loader.load(query)
  assert.equal(calls, 1)
})

test('hydrates the first server-rendered batch without refetching page one', async () => {
  const calls = []
  const loader = createDirectoryPaperLoader(async (params) => {
    calls.push(params)
    return result(['3'], 3)
  }, { pageSize: 2 })
  loader.seed(query, result(['1', '2'], 3))
  assert.equal(loader.getState(query).page, 1)
  assert.equal(calls.length, 0)
  await loader.load(query)
  assert.equal(calls[0].page, 2)
  assert.deepEqual(loader.getState(query).items.map(item => item.id), ['1', '2', '3'])
})

test('checks only one paper to determine session availability and caches the count', async () => {
  const calls = []
  const availability = createDirectorySessionAvailability(async (params) => {
    calls.push(params)
    return result(['1'], 12)
  })
  assert.equal(await availability.check(query), 'available')
  assert.deepEqual(calls[0], { ...query, is_paper: true, directory: true, page: 1, perpage: 1 })
  assert.equal(availability.getState(query).status, 'available')
  await availability.check(query)
  assert.equal(calls.length, 1)
})

test('hides zero-count sessions while failed checks remain visible and retryable', async () => {
  let calls = 0
  const availability = createDirectorySessionAvailability(async () => {
    calls++
    if (calls === 1) return result([])
    if (calls === 2) throw new Error('offline')
    return result(['1'])
  })
  const emptyQuery = { ...query, edu_month: 3 }
  const retryQuery = { ...query, edu_month: 11 }
  assert.equal(await availability.check(emptyQuery), 'empty')
  assert.equal(availability.getState(emptyQuery).status, 'empty')
  assert.equal(await availability.check(retryQuery), 'error')
  assert.equal(availability.getState(retryQuery).status, 'error')
  assert.equal(await availability.check(retryQuery), 'available')
})

test('coalesces duplicate loading events and limits simultaneous requests', async () => {
  const gates = [deferred(), deferred(), deferred()]
  let calls = 0
  const loader = createDirectoryPaperLoader(() => gates[calls++].promise)
  const first = loader.load(query)
  assert.equal(loader.load(query), first)
  const second = loader.load({ ...query, edu_year: 2025 })
  const third = loader.load({ ...query, edu_year: 2024 })
  assert.equal(calls, 2)
  gates[0].resolve(result(['1']))
  await first
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(calls, 3)
  gates[1].resolve(result(['2']))
  gates[2].resolve(result(['3']))
  await Promise.all([second, third])
})

test('ignores obsolete responses even if transport finishes after cancellation', async () => {
  const gate = deferred()
  let calls = 0
  const loader = createDirectoryPaperLoader(async () => ++calls === 1 ? gate.promise : result(['new']))
  const oldRequest = loader.load(query)
  loader.cancelPending()
  await loader.load({ ...query, test_type: '6321' })
  gate.resolve(result(['old']))
  assert.equal(await oldRequest, 'cancelled')
  assert.deepEqual(loader.getState(query).items, [])
  assert.equal(loader.getState({ ...query, test_type: '6321' }).items[0].id, 'new')
})

test('failed pages remain retryable and are not cached as empty', async () => {
  let calls = 0
  const loader = createDirectoryPaperLoader(async () => {
    if (++calls === 1) throw new Error('offline')
    return result(['1'])
  })
  assert.equal(await loader.load(query), 'error')
  assert.equal(loader.getState(query).page, 0)
  assert.equal(loader.getState(query).loaded, false)
  assert.equal(await loader.load(query), 'empty')
  assert.equal(loader.getState(query).error, false)
})

test('deduplicates records across pages without requesting past the total', async () => {
  const loader = createDirectoryPaperLoader(async ({ page }) => page === 1 ? result(['1', '2'], 3) : result(['2', '3'], 3))
  await loader.load(query)
  await loader.load(query)
  assert.deepEqual(loader.getState(query).items.map(item => item.id), ['1', '2', '3'])
  assert.equal(loader.getState(query).hasMore, false)
})

test('renders only available files with usable IDs, in Figma order', () => {
  const paper = { sf_file: true, sf_file_id: '5', in_file: true, in_file_id: false, a_file: true, q_file: true }
  assert.deepEqual(getDirectoryPaperDownloads(paper).map(file => file.type), ['sf_file', 'answer', 'pdf'])
  assert.deepEqual(getDirectoryDownloadParams('sf_file', paper), { type: 'extra', extraId: '5' })
  assert.deepEqual(getDirectoryDownloadParams('pdf', paper), { type: 'pdf' })
  assert.equal(getDirectoryPaperDownloads({ q_file: 'false', a_file: '0' }).length, 0)
  assert.equal(getDirectoryPaperDownloads({ solved_paper: true }).length, 0)
})

test('preserves paper labels, detail links and connected exam IDs', () => {
  const paper = { id: '123', test_type_title: 'Paper 1', variant: '7814', variant_title: '1', title_url: 'mathematics' }
  assert.equal(getDirectoryPaperTitle(paper), 'Paper 11')
  assert.equal(getDirectoryPaperCode(paper, 'Mathematics (0580)'), '0580/11')
  assert.equal(getDirectoryPaperCode(paper, 'Biology'), '')
  assert.equal(getDirectoryPaperTitle({ ...paper, variant_title: 'nv' }), 'Paper 1')
  assert.equal(getDirectoryPaperLink(paper), '/paper/123/mathematics')
  assert.deepEqual(getDirectoryExamIds('["12", "12", "15", null, "0"]'), ['12', '15'])
  assert.deepEqual(getDirectoryExamIds('invalid'), [])
})
