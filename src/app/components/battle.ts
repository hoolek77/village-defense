import { createElement } from '../utils/createElement'
import { Audio } from '../audio'
import { Game } from '../game'

const main_music = require('../../assets/audio/music.mp3')
const battle_music = require('../../assets/audio/battle.mp3')

export class Battle {
  private audio: Audio
  private game: Game
  private mainArea!: HTMLElement
  private gameMessagesContainer!: HTMLElement
  private nextAttackInfoContainer!: HTMLElement
  private battleContainer!: HTMLElement
  private battleOverlay!: HTMLElement

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
    this.nextAttackInfoContainer = document.querySelector(
      '.next-attack-info'
    ) as HTMLElement

    this.battleContainer = createElement({
      type: 'div',
      classes: ['battle__container'],
    })
    this.battleOverlay = createElement({
      type: 'div',
      classes: ['battle__overlay'],
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

    const swordImagePath = require('../../assets/images/villageImages/sword.png')

    battleEffectsRight.setAttribute('src', swordImagePath.default)

    const battleEffectsLeft = createElement({
      type: 'img',
      classes: ['battle__effects-left'],
    })

    battleEffectsLeft.setAttribute('src', swordImagePath.default)

    battleEffectsContainer.append(battleEffectsLeft, battleEffectsRight)

    this.battleContainer.append(battleHeading, battleEffectsContainer)
  }

  private renderBattle() {
    if (this.mainArea.childElementCount === 2) {
      this.mainArea.style.zIndex = '200'
      this.mainArea.insertBefore(
        this.battleContainer,
        this.nextAttackInfoContainer
      )

      document.querySelector('.game__screen')?.appendChild(this.battleOverlay)
      this.gameMessagesContainer.style.transform = 'translateY(-120%)'
      this.nextAttackInfoContainer.style.opacity = '0'
      this.createBattle()
      this.audio.changeAudioSource(battle_music.default)
    }
  }

  private removeBattle() {
    if (this.nextAttackInfoContainer.style.opacity == '0') {
      const battleContainer = document.querySelector(
        '.battle__container'
      ) as HTMLElement

      const battleOverlay = document.querySelector(
        '.battle__overlay'
      ) as HTMLElement

      this.mainArea.style.zIndex = '0'
      battleContainer.style.animationName = 'battleExit'
      this.audio.changeAudioSource(main_music.default)
      this.nextAttackInfoContainer.style.opacity = '1'
      battleOverlay.remove()

      setTimeout(() => {
        this.gameMessagesContainer.style.transform = 'translateY(0)'
        battleContainer.remove()
      }, 1000)
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
