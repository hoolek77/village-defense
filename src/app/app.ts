import { Audio } from './audio'
import { Game } from './game'
import { GamePage, HomePage, SplashPage } from './screens'
import { GameSettings } from './gameSettings'
import { Fractions } from './models'

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

    this.game = new Game(
      this.gameSettings.fraction,
      this.gameSettings.difficulty
    )

    this.homePage = new HomePage(this)

    this.showHomePage(false)
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
      this.gamePage = new GamePage(this, this.game)
    }

    this.splashPage?.close(this.appMainContainer)
    this.gamePage?.show(this.appMainContainer)
    this.toggleBodyScroll(true)
  }

  resetGame() {
    this.gameSettings.fraction = Fractions.Elves
  }

  private toggleBodyScroll(isGamePage: boolean) {
    document.body.style.overflow =  isGamePage ? "auto" : "hidden"
  }
}
