import { Game } from '../../game'

const quitButton = <HTMLElement>document.querySelector('.quit__game__button')
const startScreen = <HTMLElement>document.querySelector('.start__screen')
const gameScreen = <HTMLElement>document.querySelector('.game__screen')

export class GamePage {
  private game!: Game

  private setClosePageEvent() {
    quitButton.addEventListener('click', () => {
      startScreen.classList.remove('start__screen--opened')
      startScreen.classList.add('start__screen--closed')
      gameScreen.style.zIndex = '-1'
    })
  }

  runPage() {
    this.setClosePageEvent()

    this.game = new Game()
    this.game.start()
  }
}
