export function renderPopup(popupContentHTML: HTMLElement, closeBtnContent: string) {
  const popup = document.createElement('div') as HTMLDivElement
  popup.classList.add('popup')
  popup.innerHTML = `
    <div class="popup__overlay"></div>
    <div class="popup__content">
      <button class="popup__close-btn">${closeBtnContent}</button>
    </div>
    </div>
  `

  document.body.appendChild(popup)
  document.querySelector('.popup__content')?.appendChild(popupContentHTML)

  setTimeout(() => {
    popup.classList.add('popup--active')

    const popupOverlayElement = document.querySelector(
      '.popup__overlay'
    ) as HTMLDivElement

    const closeBtn = document.querySelector(
      '.popup__close-btn'
    ) as HTMLButtonElement

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('popup--active')
      removePopup()
    })

    popupOverlayElement.addEventListener('click', () => {
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
