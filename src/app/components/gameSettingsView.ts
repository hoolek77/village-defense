import { App } from '../app'
import { Difficulty } from '../models'
import { renderPopup } from './popup'
import { createElement } from '../utils'
import { playAudio } from '../utils'

export class GameSettingsView {
  private app: App
  private settingsBtn: HTMLButtonElement

  constructor(app: App) {
    this.settingsBtn = document.querySelector(
      '#settings-button'
    ) as HTMLButtonElement

    this.app = app

    this.render()
  }

  private getCurrentVolumeValue() {
    const audio = document.querySelector('audio') as HTMLAudioElement
    const volume = audio?.volume
    const value = volume * 100
    const volumeInput = document.querySelector('.volume__input')
    volumeInput?.setAttribute('value', `${value}`)
  }

  private getCurrentGameDifficulty() {
    switch (this.app.gameSettings.difficulty) {
      case Difficulty.Easy:
        const difficultyEasyInput = document.querySelector(
          '#difficulty-easy'
        ) as HTMLInputElement
        difficultyEasyInput.checked = true
        break
      case Difficulty.Medium:
        const difficultyMediumInput = document.querySelector(
          '#difficulty-medium'
        ) as HTMLInputElement
        difficultyMediumInput.checked = true
        break
      case Difficulty.Hard:
        const difficultyHardInput = document.querySelector(
          '#difficulty-hard'
        ) as HTMLInputElement
        difficultyHardInput.checked = true
        break
    }
  }

  private addListeners(): void {
    const volumeInput = document.querySelector(
      '.volume__input'
    ) as HTMLInputElement
    volumeInput?.addEventListener('input', () => {
      const value = +volumeInput.value / 100
      playAudio(value)
    })

    const difficultyEasyInput = document.querySelector(
      '#difficulty-easy'
    ) as HTMLInputElement
    difficultyEasyInput?.addEventListener('change', () => {
      this.app.gameSettings.difficulty = Difficulty.Easy
      console.log(this.app.gameSettings.difficulty)
    })

    const difficultyMediumInput = document.querySelector(
      '#difficulty-medium'
    ) as HTMLInputElement
    difficultyMediumInput?.addEventListener('change', () => {
      this.app.gameSettings.difficulty = Difficulty.Medium
      console.log(this.app.gameSettings.difficulty)
    })

    const difficultyHardInput = document.querySelector(
      '#difficulty-hard'
    ) as HTMLInputElement
    difficultyHardInput?.addEventListener('change', () => {
      this.app.gameSettings.difficulty = Difficulty.Hard
      console.log(this.app.gameSettings.difficulty)
    })
  }

  private createElements(): HTMLElement {
    const wrapper = createElement({
      type: 'div',
      classes: ['settings__wrapper'],
    })
    const settingsHeading = createElement({
      type: 'h1',
      classes: ['settings__heading'],
      content: 'Settings',
    })
    const volumeHeading = createElement({
      type: 'h2',
      classes: ['volume__heading'],
      content: 'Volume',
    })
    const volumeParagraph = createElement({
      type: 'p',
      classes: ['volume__paragraph'],
      content: `
        If you want to listean to background music, you need to enable audio in the site preferences!
      `,
    })
    const volumeInput = createElement({
      type: 'input',
      classes: ['volume__input'],
    })

    volumeInput.setAttribute('type', 'range')
    volumeInput.setAttribute('min', '0')
    volumeInput.setAttribute('max', '100')

    const difficultyHeading = createElement({
      type: 'h2',
      classes: ['difficulty__heading'],
      content: 'Select Game Difficulty',
    })

    const difficultyEasyDiv = createElement({
      type: 'div',
      classes: ['difficulty'],
    })
    const difficultyEasyInput = createElement({
      type: 'input',
      classes: ['difficulty__input'],
      id: 'difficulty-easy',
    })
    difficultyEasyInput.setAttribute('type', 'radio')
    difficultyEasyInput.setAttribute('name', 'difficulty')
    difficultyEasyInput.setAttribute('value', 'easy')
    const difficultyEasyLabel = createElement({
      type: 'label',
      content: 'Easy',
    })
    difficultyEasyLabel.setAttribute('for', 'difficulty-easy')

    const difficultyMediumDiv = createElement({
      type: 'div',
      classes: ['difficulty'],
    })
    const difficultyMediumInput = createElement({
      type: 'input',
      classes: ['difficulty__input'],
      id: 'difficulty-medium',
    })
    difficultyMediumInput.setAttribute('type', 'radio')
    difficultyMediumInput.setAttribute('name', 'difficulty')
    difficultyMediumInput.setAttribute('value', 'medium')
    difficultyMediumInput.setAttribute('checked', 'true')
    const difficultyMediumLabel = createElement({
      type: 'label',
      content: 'Medium',
    })
    difficultyMediumLabel.setAttribute('for', 'difficulty-medium')

    const difficultyHardDiv = createElement({
      type: 'div',
      classes: ['difficulty'],
    })
    const difficultyHardInput = createElement({
      type: 'input',
      classes: ['difficulty__input'],
      id: 'difficulty-hard',
    })
    difficultyHardInput.setAttribute('type', 'radio')
    difficultyHardInput.setAttribute('name', 'difficulty')
    difficultyHardInput.setAttribute('value', 'hard')
    const difficultyHardLabel = createElement({
      type: 'label',
      content: 'Hard',
    })
    difficultyHardLabel.setAttribute('for', 'difficulty-hard')

    difficultyEasyDiv.appendChild(difficultyEasyInput)
    difficultyEasyDiv.appendChild(difficultyEasyLabel)

    difficultyMediumDiv.appendChild(difficultyMediumInput)
    difficultyMediumDiv.appendChild(difficultyMediumLabel)

    difficultyHardDiv.appendChild(difficultyHardInput)
    difficultyHardDiv.appendChild(difficultyHardLabel)

    const saveAndCloseBtn = createElement({
      type: 'div',
      classes: ['save__close-btn'],
      content: 'Save and Close',
    })

    wrapper.append(
      settingsHeading,
      volumeHeading,
      volumeParagraph,
      volumeInput,
      difficultyHeading,
      difficultyEasyDiv,
      difficultyMediumDiv,
      difficultyHardDiv,
      saveAndCloseBtn
    )
    return wrapper
  }

  private render() {
    this.settingsBtn.addEventListener('click', () => {
      renderPopup(this.createElements(), 'X')
      this.addListeners()
      this.getCurrentVolumeValue()
      this.getCurrentGameDifficulty()
    })
  }
}
