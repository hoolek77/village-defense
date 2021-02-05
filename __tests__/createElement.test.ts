import { createElement } from '../src/app/utils'

describe('createElement', () => {
  it('return div element', () => {
    const divElement = createElement({
      type: 'div',
    })

    expect(divElement).toBeDefined()
    expect(divElement).toBeInstanceOf(HTMLDivElement)
  })

  it('sets id', () => {
    const element = createElement({
      type: 'div',
      id: 'testDiv',
    })

    expect(element.id).toBe('testDiv')
  })

  it('sets text content', () => {
    const element = createElement({
      type: 'div',
      content: 'content',
    })

    expect(element.textContent).toBe('content')
  })

  it('sets classes on the element', () => {
    const element = createElement({
      type: 'div',
      classes: ['class1', 'class2'],
    })

    expect(element.classList).toContain('class1')
    expect(element.classList).toContain('class2')
  })

  it('sets innerHTML on the element', () => {
    const element = createElement({
      type: 'div',
      innerHTML: '<p>test</p>',
    })

    expect(element.innerHTML).toBe('<p>test</p>')
  })

  it('sets styles on the element', () => {
    const element = createElement({
      type: 'div',
      styles: {
        'background-color': 'red',
        width: '100%',
      },
    })

    expect(element.style.backgroundColor).toBe('red')
    expect(element.style.width).toBe('100%')
  })
})
