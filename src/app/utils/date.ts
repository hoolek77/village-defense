export function secondsToDate(seconds: number) {
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}
