import { App } from '../../app'
import { Audio } from '../../audio'
import { Fractions } from '../../models'
import {
  capitalizeFirstLetter,
  createElement,
  enumKeys,
  getCSSProperty,
  getFractionForName,
  setCSSProperty,
} from '../../utils'
import { InfoContentProvider, GameSettingsView } from '../../components'

export class HomePage {
  private app: App
  private audio: Audio

  private settingButton!: HTMLElement
  private infoButton!: HTMLElement
  private startButton!: HTMLElement
  private characterButton!: HTMLInputElement
  private startScreen!: HTMLElement
  private startScreenBackground!: HTMLElement
  private startScreenLogo!: HTMLElement
  private characterButtonOptions!: NodeListOf<HTMLInputElement>
  private startScreenLogoBackground!: HTMLElement

  constructor(app: App) {
    this.app = app
    this.audio = new Audio()
  }

  show(appContainer: HTMLElement, startHidden: boolean) {
    const template = <HTMLTemplateElement>(
      document.querySelector('#start-screen-template')
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.bindEvents()

      if (startHidden) {
        this.updateTheme()

        this.startScreen.classList.add('start__screen--hidden')
        this.startScreen.classList.add('start__screen--opened')

        setTimeout(() => {
          this.startScreen.classList.remove('start__screen--hidden')
          this.startScreen.classList.remove('start__screen--opened')
        }, 500)
      }
    }
  }

  close(appContainer: HTMLElement) {
    this.startScreen.classList.add('start__screen--closed')
    setTimeout(() => {
      appContainer.removeChild(this.startScreen)
    }, 500)
  }

  private bindUIElements() {
    this.settingButton = <HTMLElement>document.querySelector('#settings-button')
    this.infoButton = <HTMLElement>document.querySelector('#info-button')
    this.startButton = <HTMLElement>document.querySelector('#start-game-button')
    this.characterButton = <HTMLInputElement>(
      document.querySelector('#character-dropdown')
    )
    this.startScreen = <HTMLElement>document.querySelector('.start__screen')
    this.startScreenBackground = <HTMLElement>(
      document.querySelector('.start__screen--background')
    )
    this.startScreenLogo = <HTMLElement>(
      document.querySelector('.start__screen__logo')
    )
    this.characterButtonOptions = <NodeListOf<HTMLInputElement>>(
      document.querySelectorAll('.start__screen__button--option')
    )
    this.startScreenLogoBackground = <HTMLElement>(
      document.querySelector('.start__screen__logo--background')
    )
  }

  private removeClasses() {
    for (const fractionKey of enumKeys(Fractions)) {
      const fraction = Fractions[fractionKey]
      this.startScreenLogo.classList.remove(`start__screen__logo--${fraction}`)
      this.startScreenLogoBackground.classList.remove(`${fraction}__background`)
      this.startScreenBackground.classList.remove(`start_screen--${fraction}`)
    }
    this.characterButtonOptions.forEach((e) => {
      e.classList.remove('start__screen__button--option--selected')
    })
  }

  private changeButtonTextContent() {
    const buttonText: HTMLElement = <HTMLElement>(
      this.characterButton.children[0]
    )

    buttonText.innerText = capitalizeFirstLetter(this.app.gameSettings.fraction)
  }

  private onFractionDidChange(fractionName: string) {
    this.app.gameSettings.fraction = getFractionForName(fractionName)
    this.updateTheme()

    this.startScreen.style.background = getComputedStyle(
      this.startScreenBackground
    ).background
    this.removeClasses()
    this.changeLogo()
    this.changeBackground()
  }

  private updateTheme() {
    const fraction = this.app.gameSettings.fraction

    setCSSProperty('--primary-color', getCSSProperty(`--${fraction}-color`))

    setCSSProperty(
      '--primary-dark-color',
      getCSSProperty(`--${fraction}-dark-color`)
    )

    setCSSProperty(
      '--quit-button-background-color',
      getCSSProperty(`--${fraction}-quit-button-background-color`)
    )

    setCSSProperty(
      '--quit-button-hover-background-color',
      getCSSProperty(`--${fraction}-quit-button-hover-background-color`)
    )
  }

  private changeLogo() {
    const fraction = this.app.gameSettings.fraction
    this.startScreenLogo.classList.add(`start__screen__logo--${fraction}`)
    this.startScreenLogoBackground.classList.add(`${fraction}__background`)
  }

  private changeBackground() {
    const fraction = this.app.gameSettings.fraction
    this.startScreenBackground.style.display = 'none'
    setTimeout(() => (this.startScreenBackground.style.display = 'block'), 100)
    this.startScreenBackground.classList.add(`start_screen--${fraction}`)
  }

  private handleFracChange(): void {
    this.characterButtonOptions.forEach((element) => {
      element.addEventListener('click', () => {
        const value = element.value
        this.onFractionDidChange(value)
        this.changeButtonTextContent()
        this.triggerOptionButton(element)
      })
    })
  }

  private triggerStartButton(): void {
    this.startButton.addEventListener('click', () => {
      this.app.showSplashPage()
    })
  }

  private triggerOptionButton(element: HTMLElement) {
    element.classList.add('start__screen__button--option--selected')
  }

  private triggerSettingsButton(): void {
    this.settingButton.addEventListener('click', () => {})
  }

  private triggerInfoButton(): void {
    this.infoButton.addEventListener('click', () => {})
  }

  private bindEvents() {
    this.handleFracChange()
    this.triggerInfoButton()
    this.triggerStartButton()
    this.triggerSettingsButton()
    new InfoContentProvider()
    new GameSettingsView(this.app, this.audio)
  }
}
