import './popup.css'

export class Popup {
  popupDivElement: HTMLDivElement
  closeBtnElement: HTMLDivElement
  popupOverlayElement: HTMLDivElement
  popupContentElement: HTMLDivElement

  // in the constructor provide 2 arguments: content of the popup and class of HTML element that should display it after click
  constructor(
    protected popupContentHTML: string,
    protected popupListenerClass: string
  ) {
    this.popupDivElement = document.querySelector('.popup') as HTMLDivElement
    this.closeBtnElement = document.querySelector(
      '.close-btn'
    ) as HTMLDivElement
    this.popupOverlayElement = document.querySelector(
      '.overlay'
    ) as HTMLDivElement
    this.popupContentElement = document.querySelector(
      '.popup-content'
    ) as HTMLDivElement
    this.popupContentHTML = popupContentHTML
    document
      .querySelector(`.${this.popupListenerClass}`)
      ?.addEventListener('click', () => {
        this.insertPopupContent()
        this.popupDivElement.classList.add('active')
      })
    this.closeBtnElement.addEventListener('click', () => {
      this.popupDivElement.classList.remove('active')
    })
    this.popupOverlayElement.addEventListener('click', () => {
      this.popupDivElement.classList.remove('active')
    })
  }

  insertPopupContent(): void {
    this.popupContentElement.innerHTML = `
      <div class="close-btn">&times;</div>
      ${this.popupContentHTML}
    `
  }
}
