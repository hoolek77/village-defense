import { GamePage } from '../gamepage'

export class HomePage {
  settingButton: HTMLElement
  infoButton: HTMLElement
  startButton: HTMLElement
  characterButton: HTMLInputElement
  startScreen: HTMLElement
  startScreenBackground: HTMLElement
  gameScreen: HTMLElement
  startScreenLogo: HTMLElement
  characterButtonOptions: NodeListOf<HTMLInputElement>
  startScreenLogoBackground: HTMLElement
  theme: string

  constructor() {
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
    this.gameScreen = <HTMLElement>document.querySelector('.game__screen')
    this.startScreenLogo = <HTMLElement>(
      document.querySelector('.start__screen__logo')
    )
    this.characterButtonOptions = <NodeListOf<HTMLInputElement>>(
      document.querySelectorAll('.start__screen__button--option')
    )
    this.startScreenLogoBackground = <HTMLElement>(
      document.querySelector('.start__screen__logo--background')
    )
    this.theme = 'elfs'
  }
  private removeClasses() {
    const categories = ['elfs', 'dwarfs', 'people']
    for (let category of categories) {
      this.startScreenLogo.classList.remove(`start__screen__logo--${category}`)
      this.startScreenLogoBackground.classList.remove(`${category}__background`)
      this.startScreenBackground.classList.remove(`start_screen--${category}`)
    }
    this.characterButtonOptions.forEach((e) => {
      e.classList.remove('start__screen__button--option--selected')
    })
  }

  private changeButtonTextContent() {
    const buttonText: HTMLElement = <HTMLElement>(
      this.characterButton.children[0]
    )
    buttonText.innerText = this.theme.charAt(0).toLocaleUpperCase() + this.theme.slice(1)
  }

  private changeTheme(theme: string) {
    this.theme = theme
    this.removeClasses()
    this.changeLogo()
    this.startScreen.style.background = getComputedStyle(
      this.startScreenBackground
    ).background
    this.changeBackground()
  }

  private changeLogo() {
    this.startScreenLogo.classList.add(`start__screen__logo--${this.theme}`)
    this.startScreenLogoBackground.classList.add(`${this.theme}__background`)
  }
  
  private changeBackground() {
    this.startScreenBackground.style.display = 'none'
    setTimeout(() => (this.startScreenBackground.style.display = 'block'), 100)
    this.startScreenBackground.classList.add(`start_screen--${this.theme}`)
  }

  private handleFracChange(): void {
    this.characterButtonOptions.forEach((element) => {
      element.addEventListener('click', () => {
        const value = element.value
        this.changeTheme(value)
        this.changeButtonTextContent()
        this.triggerOptionButton(element)
      })
    })
  }

  private triggerStartButton(): void {
    this.startButton.addEventListener('click', () => {
      this.startScreen.classList.add('start__screen--opened')
      this.startScreen.classList.remove('start__screen--closed')

      const gamepage = new GamePage(this.theme)
      gamepage.runPage()

      setTimeout(() => {
        this.gameScreen.style.zIndex = '0'
      }, 500)
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

  runPage() {
    this.handleFracChange()
    this.triggerInfoButton()
    this.triggerStartButton()
    this.triggerSettingsButton()
  }
}
