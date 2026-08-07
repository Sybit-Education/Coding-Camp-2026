import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import LexiconListItem from '@/features/lexicon/LexiconListItem.vue'
import LexiconListView from './LexiconListView.vue'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'

describe('LexiconListView', () => {
  it('shows skeleton cards while lexicon entries are loading', async () => {
    setActivePinia(createPinia())

    let resolveEntries!: (entries: LexiconListEntry[]) => void
    const entriesPromise = new Promise<LexiconListEntry[]>((resolve) => {
      resolveEntries = resolve
    })

    const lexiconService = {
      getLexiconEntriesList: vi.fn<() => Promise<LexiconListEntry[]>>(() => entriesPromise),
      filterLexiconEntries: vi.fn<(entries: LexiconListEntry[]) => LexiconListEntry[]>(
        (entries) => entries,
      ),
    }

    const wrapper = mount(LexiconListView, {
      global: {
        provide: {
          lexiconService,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

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
})
