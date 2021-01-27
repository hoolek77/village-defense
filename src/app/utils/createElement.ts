import { elementConfig } from '../interfaces/elementConfig'

export function createElement({
  type,
  content,
  id,
  classes,
  handleEvent,
  properties,
  innerHTML,
  styles,
}: elementConfig) {
  const element = document.createElement(type)
  if (content) {
    element.textContent = content
  }
  if (id) {
    element.id = id
  }
  if (classes) {
    classes.forEach((className) => {
      element.className += `${className} `
    })
  }
  if (handleEvent?.type) {
    element.addEventListener(handleEvent.type, () => handleEvent.callback())
  }
  if (innerHTML) {
    element.innerHTML = innerHTML
  }
  return element
}
