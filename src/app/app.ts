import { Audio } from './audio'
import { Game } from './game'
import { GamePage, HomePage, SplashPage } from './screens'
import { GameSettings } from './gameSettings'
import { Fractions } from './models'
import { TestModal } from './components/testModal'

const konamiCodePattern = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

let currentKonamiCodeIndex = 0

export class App {
  private splashPage?: SplashPage
  private homePage!: HomePage
  private gamePage?: GamePage

  private appMainContainer!: HTMLElement

  game!: Game
  audio!: Audio
  gameSettings!: GameSettings

  start() {
    this.appMainContainer = <HTMLElement>document.querySelector('#app')

    this.audio = new Audio()
    this.gameSettings = new GameSettings()

    this.game = new Game(this.gameSettings)

    this.homePage = new HomePage(this)

    this.showHomePage(false)

    this.bindKeyEvents()
  }

  showHomePage(startHidden: boolean) {
    this.gamePage?.close(this.appMainContainer)
    this.homePage.show(this.appMainContainer, startHidden)
    this.toggleBodyScroll(false)
  }

  showSplashPage() {
    if (!this.splashPage) {
      this.splashPage = new SplashPage(this)
    }
    this.homePage.close(this.appMainContainer)
    this.splashPage.show(this.appMainContainer)
  }

  showGamePage() {
    if (!this.gamePage) {
      this.gamePage = new GamePage(this)
    }

    this.splashPage?.close(this.appMainContainer)
    this.gamePage?.show(this.appMainContainer)
    this.toggleBodyScroll(true)
  }

  resetGame() {
    this.gameSettings.fraction = Fractions.Elves
  }

  private toggleBodyScroll(isGamePage: boolean) {
    document.body.style.overflow = isGamePage ? 'auto' : 'hidden'
  }

  private bindKeyEvents() {
    document.addEventListener('keydown', this.keyHandler.bind(this), false)
  }

  private keyHandler(e: KeyboardEvent) {
    if (
      konamiCodePattern.indexOf(e.key) < 0 ||
      e.key !== konamiCodePattern[currentKonamiCodeIndex]
    ) {
      currentKonamiCodeIndex = 0
      return
    }

    currentKonamiCodeIndex++

    if (konamiCodePattern.length === currentKonamiCodeIndex) {
      currentKonamiCodeIndex = 0
      this.showTestModal()
    }
  }

  private showTestModal() {
    new TestModal(this.gameSettings).show()
  }
}
