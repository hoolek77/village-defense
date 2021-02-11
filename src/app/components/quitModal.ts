import { renderPopup, removePopup } from './popup'
import { createElement } from '../utils'
import { GamePage } from '../screens'
import { Game } from '../game'

export class QuitModal {
  private quitContainer: HTMLElement
  private quitYesBtn: HTMLButtonElement

  constructor(private gamePage: GamePage, private game: Game) {
    this.gamePage = gamePage
    this.game = game

    this.quitContainer = createElement({
      type: 'div',
      classes: ['quit__container'],
    })

    this.quitYesBtn = createElement({
      type: 'button',
      classes: ['popup__close-btn', 'quit__yes-btn'],
      content: 'Yes, I am aware of that',
    }) as HTMLButtonElement
    this.createElements()
  }

  private createElements() {
    const quitHeading = createElement({
      type: 'h2',
      classes: ['quit__heading'],
      innerHTML: 'You would not be able to get back!',
    })

    this.quitYesBtn.addEventListener('click', () => {
      removePopup()
      this.gamePage.quitGame()
    })

    this.quitContainer.append(quitHeading)
  }

  render() {
    renderPopup({
      headerText: 'Do you really want to quit the game?',
      popupContentHTML: this.quitContainer,
      closeBtnText: 'Cancel',
      isOverlayClickable: true,
    })

    this.game.pauseGame()

    const popupOverlay = document.querySelector(
      '.popup__overlay'
    ) as HTMLElement
    popupOverlay.addEventListener('click', () => {
      this.game.unpauseGame()
    })

    const popupBtn = document.querySelector(
      '.popup__close-btn'
    ) as HTMLButtonElement
    popupBtn.addEventListener('click', () => {
      this.game.unpauseGame()
    })

    const popupFooter = document.querySelector(
      '.popup__footer'
    ) as HTMLDivElement

    popupFooter.appendChild(this.quitYesBtn)
  }
}
