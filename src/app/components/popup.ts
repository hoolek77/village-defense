export function renderPopup(popupContentHTML: string, closeBtnContent: string) {
  const popup = document.createElement('div') as HTMLDivElement
  popup.classList.add('popup-container')
  popup.innerHTML = `
    <div class="overlay"></div>
    <div class="popup-content">
      ${popupContentHTML}
      <button class="close__btn--popup">${closeBtnContent}</button>
    </div>
    </div>
  `

  document.body.appendChild(popup)

  setTimeout(() => {
    popup.classList.add('popup-active')

    const popupOverlayElement = document.querySelector(
      '.overlay'
    ) as HTMLDivElement

    const closeBtn = document.querySelector(
      '.close__btn--popup'
    ) as HTMLButtonElement

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('popup-active')
      setTimeout(() => {
        removePopup()
      }, 200)
    })

    popupOverlayElement.addEventListener('click', () => {
      popup.classList.remove('popup-active')
      setTimeout(() => {
        removePopup()
      }, 200)
    })
  }, 10)
}

export function removePopup() {
  const popupDivElement = document.querySelector(
    '.popup-container'
  ) as HTMLDivElement
  document.body.removeChild(popupDivElement)
}

export class Popup {
  constructor(
    protected popupContentHTML: string,
    protected closeBtnContent: string
  ) {
    this.popupContentHTML = popupContentHTML
    this.closeBtnContent = closeBtnContent
  }

  renderPopUpContent(): void {
    const popup = document.createElement('div') as HTMLDivElement
    popup.classList.add('popup-container')
    popup.innerHTML = `
      <div class="overlay"></div>
        <div class="popup-content">
          ${this.popupContentHTML}
          <button class="close__btn--popup">${this.closeBtnContent}</button>
        </div>
      </div>
    `
    document.body.appendChild(popup)

    popup.classList.add('popup-active')

    const popupOverlayElement = document.querySelector(
      '.overlay'
    ) as HTMLDivElement

    const closeBtn = document.querySelector(
      '.close__btn--popup'
    ) as HTMLButtonElement

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('popup-active')
      setTimeout(() => {
        this.removePopup()
      }, 200)
    })

    popupOverlayElement.addEventListener('click', () => {
      popup.classList.remove('popup-active')
      setTimeout(() => {
        this.removePopup()
      }, 200)
    })
  }

  removePopup(): void {
    const popupDivElement = document.querySelector(
      '.popup-container'
    ) as HTMLDivElement
    document.body.removeChild(popupDivElement)
  }
}
