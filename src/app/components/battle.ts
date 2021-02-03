import { createElement } from '../utils/createElement'
import { Audio } from '../audio'
import { Game } from '../game'

export class Battle {
  private audio: Audio
  private game: Game
  private mainArea!: HTMLElement
  private gameMessagesContainer!: HTMLElement
  private infoHeading!: HTMLElement
  private progress!: HTMLElement
  private battleContainer!: HTMLElement

  constructor(audio: Audio, game: Game) {
    this.audio = audio
    this.game = game
    this.getUIElements()
  }

  private getUIElements() {
    this.mainArea = document.querySelector('.main-area') as HTMLElement
    this.gameMessagesContainer = document.querySelector(
      '.game-messages-container'
    ) as HTMLElement
    this.infoHeading = document.querySelector('.info__heading') as HTMLElement
    this.progress = document.querySelector('.progress') as HTMLElement
    this.battleContainer = createElement({
      type: 'div',
      classes: ['battle__container'],
    })
  }

  private createBattle() {
    const battleHeading = createElement({
      type: 'h1',
      classes: ['battle__heading'],
      content: 'Your village is under attack!!',
    })
    const battleEffectsContainer = createElement({
      type: 'div',
      classes: ['battle__effects-container'],
    })
    const battleEffectsRight = createElement({
      type: 'img',
      classes: ['battle__effects-right'],
    })

    battleEffectsRight.setAttribute(
      'src',
      '../../assets/images/villageImages/sword.png'
    )

    const battleEffectsLeft = createElement({
      type: 'img',
      classes: ['battle__effects-left'],
    })

    battleEffectsLeft.setAttribute(
      'src',
      '../../assets/images/villageImages/sword.png'
    )

    battleEffectsContainer.append(battleEffectsLeft, battleEffectsRight)

    this.battleContainer.append(battleHeading, battleEffectsContainer)
  }

  private renderBattle() {
    if (this.mainArea.childElementCount === 2) {
      this.mainArea.appendChild(this.battleContainer)
      this.gameMessagesContainer.style.transform = 'scale(0)'
      this.gameMessagesContainer.style.height = '0'
      this.infoHeading.style.opacity = '0'
      this.progress.style.opacity = '0'
      this.createBattle()
      this.audio.changeAudioSource('../../assets/audio/battle.mp3')
    }
  }

  private removeBattle() {
    if (this.infoHeading.style.opacity == '0') {
      console.log('removing')
      const battleContainer = document.querySelector(
        '.battle__container'
      ) as HTMLElement
      battleContainer.style.animation = 'battleExit'
      battleContainer.remove()
      this.gameMessagesContainer.style.transform = 'scale(1)'
      this.gameMessagesContainer.style.height = '400px'
      this.infoHeading.style.opacity = '1'
      this.progress.style.opacity = '1'
      this.audio.changeAudioSource('../../assets/audio/music.mp3')
    }
  }

  handleBattle() {
    if (this.game.isAttackInProgress()) {
      this.renderBattle()
    } else {
      this.removeBattle()
    }
  }
}
