export function setCSSProperty(property: string, value: string) {
  const root = document.documentElement

  root.style.setProperty(property, value)
}

export function getCSSProperty(property: string) {
  const root = document.documentElement

  return getComputedStyle(root).getPropertyValue(property)
}
