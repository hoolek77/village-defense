import { Fractions } from '../src/app/models'
import { enumKeys } from '../src/app/utils'

describe('enumKeys', () => {
  it('returns keys for Fractions enum', () => {
    const keys = enumKeys(Fractions)

    expect(keys.length).toBe(3)
    expect(keys).toContain('Humans')
    expect(keys).toContain('Elves')
    expect(keys).toContain('Dwarves')
  })
})
