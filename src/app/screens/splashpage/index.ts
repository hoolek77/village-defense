import { App } from '../../app'

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
      document.querySelector('#splash-screen-template')
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.startLoading()
    }
  }

  close(appContainer: HTMLElement) {
    this.splashScreen.classList.add('splash__screen--closed')

    setTimeout(() => {
      appContainer.removeChild(this.splashScreen)
    }, 500)
  }

  private bindUIElements() {
    this.splashScreen = <HTMLElement>document.querySelector('.splash__screen')
    this.progressBarElement = <HTMLElement>(
      document.querySelector('.splash__loading-bar')
    )

    this.percentElement = <HTMLElement>(
      document.querySelector('.splash__loading-percent')
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
