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
      removePopup()
    })

    popupOverlayElement.addEventListener('click', () => {
      popup.classList.remove('popup-active')
      removePopup()
    })
  }, 10)
}

export function removePopup() {
  const popupDivElement = document.querySelector(
    '.popup-container'
  ) as HTMLDivElement
  setTimeout(() => {
    document.body.removeChild(popupDivElement)
  }, 200)
}
