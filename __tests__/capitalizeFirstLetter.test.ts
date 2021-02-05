import { capitalizeFirstLetter } from '../src/app/utils'

describe('capitalizeFirstLetter', () => {
  it('capitalize first letter of the text', () => {
    const text = capitalizeFirstLetter('test')

    expect(text).toBe('Test')
  })

  it('return empty string for empty string given', () => {
    const text = capitalizeFirstLetter('')

    expect(text).toBe('')
  })
})
