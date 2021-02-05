import { secondsToDate } from '../src/app/utils'

describe('secondsToDate', () => {
  it('return 00:00:00 for 0 seconds', () => {
    const date = secondsToDate(0)

    expect(date).toBe('00:00:00')
  })

  it('return 00:00:20 for 20 seconds', () => {
    const date = secondsToDate(20)

    expect(date).toBe('00:00:20')
  })

  it('return 00:02:00 for 120 seconds', () => {
    const date = secondsToDate(120)

    expect(date).toBe('00:02:00')
  })

  it('return 01:45:45 for 6325 seconds', () => {
    const date = secondsToDate(6325)

    expect(date).toBe('01:45:25')
  })

  it('return 00:00:00 for -5 seconds', () => {
    const date = secondsToDate(-5)

    expect(date).toBe('00:00:00')
  })
})
