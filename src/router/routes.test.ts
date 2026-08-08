import { describe, expect, it } from 'vitest'
import { routes } from './routes'

describe('routes config', () => {
  it('does not contain duplicate paths or names', () => {
    const paths = routes.map((route) => route.path).filter(Boolean)
    const names = routes.map((route) => route.name).filter(Boolean)

    expect(new Set(paths).size).toBe(paths.length)
    expect(new Set(names).size).toBe(names.length)
  })
})
