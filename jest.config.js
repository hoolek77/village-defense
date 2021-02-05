module.exports = {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'jsdom',
  testRegex: '/__tests__/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
