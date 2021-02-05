import { randomBetween } from '../src/app/utils'

describe('randomBetween', () => {
  it('return number between 0 and 10', () => {
    const number = randomBetween(0, 10)

    expect(number).toBeGreaterThanOrEqual(0)
    expect(number).toBeLessThanOrEqual(10)
  })

  it('return 0 when min and max are set to 0', () => {
    const number = randomBetween(0, 0)

    expect(number).toBeGreaterThanOrEqual(0)
    expect(number).toBeLessThanOrEqual(10)
  })

  it('return 5 when min and max are set to 5', () => {
    const number = randomBetween(5, 5)

    expect(number).toBeGreaterThanOrEqual(0)
    expect(number).toBeLessThanOrEqual(10)
  })

  it('return number between 2 and 5 when min is set to 5 and max is set to 2', () => {
    const number = randomBetween(5, 2)

    expect(number).toBeGreaterThanOrEqual(2)
    expect(number).toBeLessThanOrEqual(5)
  })

  it('return number between -3 and 0 when min is set to -3 and max is set to 0', () => {
    const number = randomBetween(-3, 0)

    expect(number).toBeGreaterThanOrEqual(-3)
    expect(number).toBeLessThanOrEqual(0)
  })
})
