import { createElement } from '../utils/createElement'
import { Audio } from '../audio'
import { Game } from '../game'

export class Battle {
  private audio: Audio
  private game: Game
  private mainArea: HTMLElement = document.querySelector(
    '.main-area'
  ) as HTMLElement
  private infoHeading: HTMLElement = document.querySelector(
    '.info__heading'
  ) as HTMLElement
  private progress: HTMLElement = document.querySelector(
    '.progress'
  ) as HTMLElement
  private battleContainer: HTMLElement = createElement({
    type: 'div',
    classes: ['battle__container'],
  })

  constructor(audio: Audio, game: Game) {
    this.audio = audio
    this.game = game
  }

  private createBattle() {
    const battleEffects = createElement({
      type: 'iframe',
    })

    battleEffects.setAttribute('src', '../../assets/gif/battle.gif')
    battleEffects.setAttribute('frameborder', '0')
    battleEffects.setAttribute('width', '500')
    battleEffects.setAttribute('height', '300')

    this.battleContainer.appendChild(battleEffects)
  }

  renderBattle() {
    if (this.mainArea.childElementCount === 2) {
      this.mainArea.appendChild(this.battleContainer)
      this.infoHeading.style.opacity = '0'
      this.progress.style.opacity = '0'
      this.createBattle()
      this.audio.changeAudioSource('../../assets/audio/battle.mp3')
    }
  }

  removeBattle() {
    if (this.infoHeading.style.opacity === '0') {
      console.log('removing')
      const battleContainer = document.querySelector(
        '.battle__container'
      ) as HTMLElement
      battleContainer.remove()
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
