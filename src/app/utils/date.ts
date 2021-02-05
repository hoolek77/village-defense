export function secondsToDate(seconds: number) {
  if (seconds <= 0) {
    return '00:00:00'
  }

  return new Date(seconds * 1000).toISOString().substr(11, 8)
}
