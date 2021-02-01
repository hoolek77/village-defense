import { customHtmlElementModel } from '../models'

export function createElement({
  type,
  content,
  id,
  classes,
  handleEvent,
  properties,
  innerHTML,
  styles,
}: customHtmlElementModel) {
  const element = document.createElement(type)
  if (content) {
    element.textContent = content
  }
  if (id) {
    element.id = id
  }
  if (classes) {
    classes.forEach((className) => {
      element.classList.add(className)
    })
  }
  if (handleEvent) {
    for (const [key, value] of Object.entries(handleEvent)) {
      element.addEventListener(key, value)
    }
  }
  if (innerHTML) {
    element.innerHTML = innerHTML
  }
  if (styles) {
    for (const [key, value] of Object.entries(styles)) {
      element.style[<any>key] = value
    }
  }
  return element
}
