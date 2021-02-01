import { Game } from '../game'
import { createElement, secondsToDate } from '../utils'
import { renderPopup } from './popup'

export class GameOverModal {
  private game: Game

  constructor(game: Game) {
    this.game = game
  }

  show(onCloseCallback: () => void) {
    renderPopup({
      headerText: 'Game Over',
      popupContentHTML: this.createModalContent(),
      closeBtnText: 'Return to Main Screen',
      isOverlayClickable: false,
    })

    this.bindEvents(onCloseCallback)
  }

  private bindEvents(onCloseCallback: () => void) {
    const closeButtonElement = document.querySelector(
      '.popup__close-btn'
    ) as HTMLButtonElement

    closeButtonElement.addEventListener('click', () => {
      onCloseCallback()
    })
  }

  private createModalContent() {
    const survivedAttacks = this.game.getSurvivedAttacks()

    const content = `
    <h2 class="game-over__heading">Your game is over!</h2>
    <div class="game-over__statistics">
        <p>Your statistics:</p>
        <ul>
            <li>
                <span>Game time: ${this.getGameTime()}</span>
            </li>
            <li>
                <span>You have survived ${survivedAttacks} ${
      survivedAttacks == 1 ? 'attack' : 'attacks'
    }</span>
            </li>
        </ul>
    </div>
`

    const wrapper = createElement({
      type: 'div',
      classes: ['game-over__content'],
      innerHTML: content,
    })

    return wrapper
  }

  private getGameTime() {
    return secondsToDate(this.game.getGameElapsedTimeInSeconds())
  }
}
