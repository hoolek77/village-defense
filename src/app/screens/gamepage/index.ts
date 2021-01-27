import { Game } from '../../game'
export class GamePage {
  private game!: Game

  quitButton: HTMLButtonElement
  startScreen: HTMLElement
  gameScreen: HTMLElement
  middleBox: HTMLDivElement
  theme: string

  constructor(theme: string) {
    this.quitButton = document.querySelector(
      '.quit__game__button'
    ) as HTMLButtonElement
    this.startScreen = document.querySelector('.start__screen') as HTMLElement
    this.gameScreen = document.querySelector('.game__screen') as HTMLElement
    this.middleBox = document.querySelector('.middle-box') as HTMLDivElement
    this.theme = theme
  }

  private setBackgrondImage() {
    switch (this.theme) {
      case 'people':
        this.middleBox.style.backgroundImage = `url('../../../assets/images/villageImages/people-bg.jpg')`
        break
      case 'dwarfs':
        this.middleBox.style.backgroundImage = `url('../../../assets/images/villageImages/dwarf-bg.jpg')`
        break
      case 'elfs':
        this.middleBox.style.backgroundImage = `url('../../../assets/images/villageImages/elf-bg.jpg')`
    }
  }

  private setClosePageEvent() {
    this.quitButton.addEventListener('click', () => {
      this.startScreen.classList.remove('start__screen--opened')
      this.startScreen.classList.add('start__screen--closed')
      this.gameScreen.style.zIndex = '-1'
    })
  }

  runPage() {
    this.setClosePageEvent()

    this.setBackgrondImage()

    this.game = new Game()
    //this.game.start()
  }
}
