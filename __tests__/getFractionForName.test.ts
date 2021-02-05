import { Fractions } from '../src/app/models'
import { getFractionForName } from '../src/app/utils'

describe('getFractionForName', () => {
  it('returns Elves Fraction enum for elves name', () => {
    const fraction = getFractionForName('elves')

    expect(fraction).toBe(Fractions.Elves)
  })

  it('returns undefined for not existing fraction name', () => {
    const fraction = getFractionForName('notExistingFraction')

    expect(fraction).toBeUndefined()
  })
})
