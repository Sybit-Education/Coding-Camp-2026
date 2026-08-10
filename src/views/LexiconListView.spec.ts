import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import LexiconListItem from '@/features/lexicon/LexiconListItem.vue'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import LexiconListView from '@/views/LexiconListView.vue'

const entries: LexiconListEntry[] = [
  {
    id: 'highlight-bird',
    name: 'Highlight Vogel',
    description: 'Ein besonderer Vogel.',
    label: 'Vögel',
    isProtected: true,
  },
  {
    id: 'highlight-plant',
    name: 'Highlight Pflanze',
    description: 'Eine besondere Pflanze.',
    label: 'Pflanzen',
    isProtected: true,
  },
  {
    id: 'normal-bird',
    name: 'Normaler Vogel',
    description: 'Ein gewöhnlicher Vogel.',
    label: 'Vögel',
  },
]

vi.mock('@/stores/labels.store', () => ({
  useLabelsStore: () => ({
    getLabels: [
      { id: 'v', name: 'Vögel' },
      { id: 'p', name: 'Pflanzen' },
    ],
  }),
}))

vi.mock('@/stores/toxicity.store', () => ({
  useToxicityStore: () => ({
    getAllToxicityLevels: [],
  }),
}))

const lexiconService = {
  getLexiconEntriesList: vi.fn<() => Promise<LexiconListEntry[]>>(),
  filterLexiconEntries: vi.fn<(list: LexiconListEntry[], _searchTerm: string) => LexiconListEntry[]>(
    (list) => list,
  ),
}

function mountView(service = lexiconService) {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(LexiconListView, {
    global: {
      plugins: [pinia],
      provide: { lexiconService: service },
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

function findChip(wrapper: ReturnType<typeof mountView>) {
  const chip = wrapper
    .findAll('button')
    .find((button) => button.text().includes('Mettnau-Highlights'))
  if (!chip) throw new Error('Mettnau-Highlights chip not found')
  return chip
}

async function waitForHeadingCount(wrapper: ReturnType<typeof mountView>, expected: number) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (wrapper.findAll('h2').length === expected) return
    await flushPromises()
    await nextTick()
  }
}

describe('LexiconListView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    lexiconService.getLexiconEntriesList.mockResolvedValue(entries)
    lexiconService.filterLexiconEntries.mockImplementation((list) => list)
  })

  it('shows skeleton cards while lexicon entries are loading', async () => {
    let resolveEntries!: (entries: LexiconListEntry[]) => void
    const entriesPromise = new Promise<LexiconListEntry[]>((resolve) => {
      resolveEntries = resolve
    })

    const loadingLexiconService = {
      getLexiconEntriesList: vi.fn<() => Promise<LexiconListEntry[]>>(() => entriesPromise),
      filterLexiconEntries: vi.fn<
        (entries: LexiconListEntry[], _searchTerm: string) => LexiconListEntry[]
      >((entries) => entries),
    }

    const wrapper = mountView(loadingLexiconService)
    await nextTick()

    expect(wrapper.get('[aria-label="Lexikoneinträge"]').attributes('aria-busy')).toBe('true')
    expect(wrapper.findAll('[data-testid="lexicon-skeleton-card"]')).toHaveLength(4)
    expect(wrapper.get('[role="status"]').text()).toContain('Lexikoneinträge werden geladen')

    resolveEntries([
      {
        id: '1',
        name: 'Amsel',
        description: 'Eine häufige Vogelart.',
        label: 'Vögel',
      },
    ])

    await flushPromises()
    await nextTick()

    expect(wrapper.get('[aria-label="Lexikoneinträge"]').attributes('aria-busy')).toBe('false')
    expect(wrapper.findAll('[data-testid="lexicon-skeleton-card"]')).toHaveLength(0)
    expect(wrapper.findAllComponents(LexiconListItem)).toHaveLength(1)
  })

  it('filters the list to Mettnau highlights when the chip is active', async () => {
    const wrapper = mountView()
    await flushPromises()
    await nextTick()
    await waitForHeadingCount(wrapper, 3)

    await findChip(wrapper).trigger('click')
    await nextTick()
    await waitForHeadingCount(wrapper, 2)

    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Highlight Vogel',
      'Highlight Pflanze',
    ])
  })

  it('combines the highlight chip with the label filter', async () => {
    const wrapper = mountView()
    await flushPromises()
    await nextTick()
    await waitForHeadingCount(wrapper, 3)

    const dropdownButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Alle'))!
    await dropdownButton.trigger('click')
    await nextTick()

    const labelButton = wrapper.findAll('button').find((button) => button.text() === 'Vögel')!
    await labelButton.trigger('click')
    await nextTick()

    await findChip(wrapper).trigger('click')
    await nextTick()
    await waitForHeadingCount(wrapper, 1)

    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual(['Highlight Vogel'])
  })

  it('shows an empty-state message when no entries match', async () => {
    lexiconService.getLexiconEntriesList.mockResolvedValue([
      {
        id: 'plain-plant',
        name: 'Gewöhnliche Pflanze',
        description: 'Nichts Besonderes.',
        label: 'Pflanzen',
      },
    ])
    const wrapper = mountView()
    await flushPromises()
    await nextTick()
    await waitForHeadingCount(wrapper, 1)

    await findChip(wrapper).trigger('click')
    await nextTick()

    expect(wrapper.findAll('h2')).toHaveLength(0)
    expect(wrapper.text()).toContain('Keine Einträge gefunden.')
  })
})
