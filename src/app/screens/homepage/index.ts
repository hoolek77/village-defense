import { GamePage } from '../gamepage'
import {InfoContentProvider} from '../../components'

export class HomePage {
  settingButton: HTMLElement
  infoButton: HTMLElement
  startButton: HTMLElement
  characterButton: HTMLInputElement
  startScreen: HTMLElement
  gameScreen: HTMLElement
  startScreenLogo: HTMLElement
  theme: string

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
    this.theme = 'elfs'
  }
  private removeLogoClasses() {
    this.startScreenLogo.classList.remove('.start__screen__logo--elfs')
    this.startScreenLogo.classList.remove('start__screen__logo--people')
    this.startScreenLogo.classList.remove('start__screen__logo--dwarfs')
  }

  private changeTheme(theme: string) {
    this.theme = theme
    this.removeLogoClasses()
    this.changeLogo()
  }

  private changeLogo() {
    this.startScreenLogo.classList.add(`start__screen__logo--${this.theme}`)
  }

  private handleFracChange(): void {
    this.characterButton.addEventListener('change', () => {
      const value = this.characterButton.value
      this.changeTheme(value)
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
    new InfoContentProvider()
  }
}
