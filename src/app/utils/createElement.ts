import { ElementConfig } from '../interfaces/elementConfig'

export function createElement({
  type,
  content,
  id,
  classes,
  handleEvent,
  properties,
  innerHTML,
}: ElementConfig) {
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
  if (handleEvent?.type) {
    element.addEventListener(handleEvent.type, () => handleEvent.callback())
  }
  if (innerHTML) {
    element.innerHTML = innerHTML
  }
  return element
}
