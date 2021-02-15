import { App } from '../../app'
import { DOMElements } from '../../constants'

export class SplashPage {
  private app: App
  private loadingDurationInMiliseconds = 3 * 1000
  private elapsedTimeInMilliseconds = 0
  private startTime = 0

  private splashScreen!: HTMLElement
  private progressBarElement!: HTMLElement
  private percentElement!: HTMLElement

  private intervalId?: number

  constructor(app: App) {
    this.app = app
  }

  show(appContainer: HTMLElement) {
    const template = <HTMLTemplateElement>(
      document.querySelector(`#${DOMElements.splashScreenID}`)
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.startLoading()
    }
  }

  close(appContainer: HTMLElement) {
    this.splashScreen.classList.add(DOMElements.splashScreenClosedClass)

    setTimeout(() => {
      appContainer.removeChild(this.splashScreen)
    }, 500)
  }

  private bindUIElements() {
    this.splashScreen = <HTMLElement>(
      document.querySelector(`.${DOMElements.splashScreenClass}`)
    )
    this.progressBarElement = <HTMLElement>(
      document.querySelector(`.${DOMElements.splashScreenLoadingBar}`)
    )

    this.percentElement = <HTMLElement>(
      document.querySelector(`.${DOMElements.splashScreenLoadingPercentCLass}`)
    )
  }

  private startLoading() {
    this.startTime = Date.now()

    this.intervalId = window.setInterval(() => {
      this.elapsedTimeInMilliseconds = Date.now() - this.startTime

      this.updateProgressBar()

      if (this.elapsedTimeInMilliseconds >= this.loadingDurationInMiliseconds) {
        this.elapsedTimeInMilliseconds = 0
        window.clearInterval(this.intervalId)
        this.intervalId = undefined

        this.showGame()
      }
    }, 10)
  }

  private updateProgressBar() {
    const progressInPercent =
      (this.elapsedTimeInMilliseconds / this.loadingDurationInMiliseconds) *
      100.0

    this.progressBarElement.style.width = `${progressInPercent}%`
    this.percentElement.textContent = `${progressInPercent.toFixed()}%`
  }

  private showGame() {
    this.app.showGamePage()
  }
}
