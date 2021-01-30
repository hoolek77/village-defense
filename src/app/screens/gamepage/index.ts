import { App } from '../../app'
import { Game } from '../../game'
export class GamePage {
  private app: App
  private game: Game

  private quitButton!: HTMLButtonElement
  private gameScreen!: HTMLElement
  private unitsImg!: HTMLDivElement
  private progressBar!: HTMLElement

  constructor(app: App, game: Game) {
    this.app = app
    this.game = game
  }

  show(appContainer: HTMLElement) {
    const template = <HTMLTemplateElement>(
      document.querySelector('#game-screen-template')
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.bindEvents()
      this.setupUI()

      setTimeout(() => {
        this.gameScreen.classList.add('game__screen--opened')
        this.startGame()
      }, 500)
    }
  }

  close(appContainer: HTMLElement) {
    setTimeout(() => {
      appContainer.removeChild(this.gameScreen)
    }, 500)
  }

  private bindUIElements() {
    this.quitButton = document.querySelector(
      '.quit-button'
    ) as HTMLButtonElement
    this.gameScreen = document.querySelector('.game__screen') as HTMLElement
    this.unitsImg = document.querySelector('.units__image') as HTMLDivElement
    this.progressBar = document.querySelector(".progress-bar") as HTMLElement
  }

  private bindEvents() {
    this.setClosePageEvent()
  }

  private setupUI() {
    this.setBackgrondImage()
    this.setUnitsFractionImage()
  }

  private setUnitsFractionImage() {
    const fraction = this.app.gameSettings.fraction
    this.unitsImg.style.backgroundImage = `url('../../../assets/images/homepage/${fraction}.png')`
  }

  private setBackgrondImage() {
    this.gameScreen.style.backgroundImage = `url('../../../assets/images/villageImages/${this.app.gameSettings.fraction}-bg.jpg')`
  }

  private setClosePageEvent() {
    this.quitButton.addEventListener('click', () => {
      this.app.resetGame()
      this.app.showHomePage(true)
      this.game.stop()
    })
  }

  private handleProgressBarChange() {
    setInterval(() => {
      const timeToNextWave = this.game.getNextAttack();
      const width = timeToNextWave * 100 / 30;
      this.progressBar.style.width = `${width}%`;
      
    }, 1000)
  }

  private startGame() {
    this.game.start()
    this.handleProgressBarChange()
  }
}
