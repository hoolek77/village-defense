import { createElement } from "../utils"

interface popup {
  headerText: string, 
  popupContentHTML: HTMLElement, 
  closeBtnText: string,
  isOverlayClickable?: boolean,
  additionalBtn?:string,
  additionalBtnClasses?:string[],
  additionalBtnHandleEvent?: object
}

export function renderPopup({ headerText, popupContentHTML, closeBtnText, isOverlayClickable = true, additionalBtn,  additionalBtnClasses, additionalBtnHandleEvent}: popup) {
  const popup = createElement({
    type: 'div',
    classes: ['popup'],
    innerHTML: `
      <div class="popup__overlay"></div>
        <div class="popup__content">
          <div class="popup__header">
            <h1>${headerText}</h1>
          </div>
          <div class="popup__body">
            <div class="popup__body-content">
            </div>
          </div>
          <div class="popup__footer">
            <button class="popup__close-btn">${closeBtnText}</button>
          </div>
        </div>
      </div>
    `
  })

  document.body.appendChild(popup)
  document.querySelector('.popup__body-content')?.appendChild(popupContentHTML)
  if(additionalBtn){
    const secondBtn = createElement({type: 'button', content:additionalBtn, classes:additionalBtnClasses})
    if(additionalBtnHandleEvent){
      for (const [key, value] of Object.entries(additionalBtnHandleEvent)) {
        secondBtn.addEventListener(key, value)
      }
    }
    document.querySelector('.popup__footer')?.appendChild(secondBtn)
  }


  setTimeout(() => {
    popup.classList.add('popup--active')

    if(isOverlayClickable) {
      const popupOverlayElement = document.querySelector(
        '.popup__overlay'
      ) as HTMLDivElement

      popupOverlayElement.addEventListener('click', () => {
        popup.classList.remove('popup--active')
        removePopup()
      })
    }

    const closeBtn = document.querySelector(
      '.popup__close-btn'
    ) as HTMLButtonElement

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('popup--active')
      removePopup()
    })
  }, 10)
}

export function removePopup() {
  const popupDivElement = document.querySelector('.popup') as HTMLDivElement
  setTimeout(() => {
    document.body.removeChild(popupDivElement)
  }, 200)
}
