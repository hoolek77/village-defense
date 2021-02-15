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
import { InfoModal, GameSettingsModal } from '../../components'
import DOMElements from './DOMElements'

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
    this.audio = this.app.audio
  }

  show(appContainer: HTMLElement, startHidden: boolean) {
    const template = <HTMLTemplateElement>(
      document.querySelector(`#${DOMElements.startScreenTemplateID}`)
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.bindEvents()

      if (startHidden) {
        this.updateTheme()

        this.startScreen.classList.add(DOMElements.startScreenHiddenClass)
        this.startScreen.classList.add(DOMElements.startScreenOpenedClass)

        setTimeout(() => {
          this.startScreen.classList.remove(DOMElements.startScreenHiddenClass)
          this.startScreen.classList.remove(DOMElements.startScreenOpenedClass)
        }, 500)
      }
    }
  }

  close(appContainer: HTMLElement) {
    this.startScreen.classList.add(DOMElements.startScreenClosedClass)
    setTimeout(() => {
      appContainer.removeChild(this.startScreen)
    }, 500)
  }

  private bindUIElements() {
    this.settingButton = <HTMLElement>(
      document.querySelector(DOMElements.startGameBtnID)
    )
    this.infoButton = <HTMLElement>(
      document.querySelector(`.${DOMElements.infoBtnID}`)
    )
    this.startButton = <HTMLElement>(
      document.querySelector(`#${DOMElements.startGameBtnID}`)
    )
    this.characterButton = <HTMLInputElement>(
      document.querySelector(`#${DOMElements.characterDropdownID}`)
    )
    this.startScreen = <HTMLElement>(
      document.querySelector(`.${DOMElements.startScreenClass}`)
    )
    this.startScreenBackground = <HTMLElement>(
      document.querySelector(`.${DOMElements.startScreenBgClass}`)
    )
    this.startScreenLogo = <HTMLElement>(
      document.querySelector(`.${DOMElements.startScreenLogoClass}`)
    )
    this.characterButtonOptions = <NodeListOf<HTMLInputElement>>(
      document.querySelectorAll(`.${DOMElements.startScreenBtnOption}`)
    )
    this.startScreenLogoBackground = <HTMLElement>(
      document.querySelector(`.${DOMElements.startScreenLogoBgClass}`)
    )
  }

  private removeClasses() {
    for (const fractionKey of enumKeys(Fractions)) {
      const fraction = Fractions[fractionKey]
      this.startScreenLogo.classList.remove(
        `${DOMElements.startScreenLogoClass}--${fraction}`
      )
      this.startScreenLogoBackground.classList.remove(`${fraction}__background`)
      this.startScreenBackground.classList.remove(
        `${DOMElements.startScreenClass}--${fraction}`
      )
    }
    this.characterButtonOptions.forEach((e) => {
      e.classList.remove(DOMElements.startScreenBtnOptionSelected)
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

    this.startScreen.style.background = getComputedStyle(
      this.startScreenBackground
    ).background
    this.removeClasses()
    this.changeLogo()
    this.changeBackground()
    this.updateTheme()
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
    this.startScreenLogo.classList.add(
      `${DOMElements.startScreenLogoClass}--${fraction}`
    )
    this.startScreenLogoBackground.classList.add(`${fraction}__background`)
    this.startScreenLogoBackground.classList.add(
      DOMElements.backgroundAnimation
    )
    const randomAnimation = Math.floor(Math.random() * 2)
    const className =
      randomAnimation === 1
        ? DOMElements.logoAnimationOneClass
        : DOMElements.logoAnimationTwoClass

    this.startScreenLogo.classList.add(className)
    setTimeout(() => {
      this.startScreenLogo.classList.remove(className)
    }, 700)

    setTimeout(() => {
      this.startScreenLogoBackground.classList.remove(
        DOMElements.backgroundAnimation
      )
    }, 700)
  }

  private changeBackground() {
    const fraction = this.app.gameSettings.fraction
    this.startScreenBackground.style.display = 'none'
    setTimeout(() => (this.startScreenBackground.style.display = 'block'), 100)
    this.startScreenBackground.classList.add(
      `${DOMElements.startScreenClass}--${fraction}`
    )
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
    element.classList.add(`${DOMElements.startScreenBtnOptionSelected}`)
  }

  private bindEvents() {
    this.handleFracChange()
    this.triggerStartButton()
    new InfoModal()
    new GameSettingsModal(this.app, this.audio)
  }
}
