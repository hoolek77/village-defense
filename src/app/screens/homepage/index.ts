export class HomePage {
  settingButton: HTMLElement
  infoButton: HTMLElement
  startButton: HTMLElement
  characterButton: HTMLInputElement
  startScreen: HTMLElement
  gameScreen: HTMLElement
  startScreenLogo: HTMLElement

  constructor() {
    this.settingButton = <HTMLElement>document.querySelector('#settings-button')
    this.infoButton = <HTMLElement>document.querySelector('#info-button')
    this.startButton = <HTMLElement>document.querySelector('#start-game-button')
    this.characterButton = <HTMLInputElement>(
      document.querySelector('#character-dropdown')
    )
    this.startScreen = <HTMLElement>document.querySelector('.start__screen')
    this.gameScreen = <HTMLElement>document.querySelector('.game__screen')
    this.startScreenLogo = <HTMLElement>(
      document.querySelector('.start__screen__logo')
    )
  }
  private removeLogoClasses() {
    this.startScreenLogo.classList.remove('.start__screen__logo--elfs')
    this.startScreenLogo.classList.remove('start__screen__logo--people')
    this.startScreenLogo.classList.remove('start__screen__logo--dwarfs')
  }
  private triggerStartButton(): void {
    this.startButton.addEventListener('click', () => {
      this.startScreen.classList.add('start__screen--opened')
      this.startScreen.classList.remove('start__screen--closed')
      setTimeout(() => {
        this.gameScreen.style.zIndex = '0'
      }, 500)
    })
  }

  private changeLogo(value: string) {
    this.startScreenLogo.classList.add(`start__screen__logo--${value}`)
  }

  private handleLogoChange(): void {
    this.characterButton.addEventListener('change', () => {
      const value = this.characterButton.value
      this.removeLogoClasses()
      this.changeLogo(value)
    })
  }

  private triggerSettingsButton(): void {
    this.settingButton.addEventListener('click', () => {})
  }

  private triggerInfoButton(): void {
    this.infoButton.addEventListener('click', () => {})
  }

  runPage() {
    this.handleLogoChange()
    this.triggerInfoButton()
    this.triggerStartButton()
    this.triggerSettingsButton()
  }
}
