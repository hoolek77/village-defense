import { App } from '../../app'
import { Audio } from '../../audio'
import { GameOverModal, Battle } from '../../components'
import { Game } from '../../game'
import { Building, GameMessage, MessageType } from '../../models'
import { createElement } from '../../utils'
export class GamePage {
  private app: App
  private game: Game
  private audio: Audio

  private quitButton!: HTMLButtonElement
  private gameScreen!: HTMLElement
  private unitsImg!: HTMLDivElement

  private goldAmountElement!: HTMLElement
  private woodAmountElement!: HTMLElement
  private stoneAmountElement!: HTMLElement
  private populationElement!: HTMLElement
  private defenceElement!: HTMLElement

  private messageList!: HTMLElement

  private progressHeader!: HTMLElement
  private progressBar!: HTMLElement

  private isGameOverModalVisible = false

  constructor(app: App) {
    this.app = app
    this.game = this.app.game
    this.audio = this.app.audio
  }

  show(appContainer: HTMLElement) {
    const template = <HTMLTemplateElement>(
      document.querySelector('#game-screen-template')
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.bindEvents()
      this.setupUI()

      setTimeout(() => {
        this.gameScreen.classList.add('game__screen--opened')
        this.startGame()
      }, 500)
    }
  }

  close(appContainer: HTMLElement) {
    setTimeout(() => {
      appContainer.removeChild(this.gameScreen)
    }, 500)
  }

  private bindUIElements() {
    this.quitButton = document.querySelector(
      '.quit-button'
    ) as HTMLButtonElement
    this.gameScreen = document.querySelector('.game__screen') as HTMLElement
    this.unitsImg = document.querySelector('.units__image') as HTMLDivElement

    this.goldAmountElement = document.querySelector(
      '#goldAmount'
    ) as HTMLElement
    this.woodAmountElement = document.querySelector(
      '#woodAmount'
    ) as HTMLElement
    this.stoneAmountElement = document.querySelector(
      '#stoneAmount'
    ) as HTMLElement

    this.populationElement = document.querySelector(
      '.population__count'
    ) as HTMLElement
    this.defenceElement = document.querySelector(
      '.defence__count'
    ) as HTMLElement

    this.messageList = document.querySelector('.game-messages') as HTMLElement

    this.progressBar = document.querySelector(
      '.next-attack-progress-bar'
    ) as HTMLElement

    this.progressHeader = document.querySelector(
      '.info__heading'
    ) as HTMLElement
  }

  private bindEvents() {
    this.setClosePageEvent()
  }

  private setupUI() {
    this.setBackgrondImage()
    this.setUnitsFractionImage()
    this.renderBuildings()
  }

  private setUnitsFractionImage() {
    const fraction = this.app.gameSettings.fraction
    this.unitsImg.style.backgroundImage = `url('../../../assets/images/homepage/${fraction}.png')`
  }

  private setBackgrondImage() {
    this.gameScreen.style.backgroundImage = `url('../../../assets/images/villageImages/${this.app.gameSettings.fraction}-bg.jpg')`
  }

  private setClosePageEvent() {
    this.quitButton.addEventListener('click', () => {
      this.quitGame()
    })
  }

  private quitGame() {
    this.app.resetGame()
    this.app.showHomePage(true)
    this.game.stop()
  }

  private startGame() {
    this.showBattle()
    this.game.start(this.updateUI.bind(this))
  }

  private updateUI() {
    requestAnimationFrame(() => {
      this.updateGoldAmount()
      this.updateWoodAmount()
      this.updateStoneAmount()
      this.updatePopulation()
      this.updateDefence()
      this.setBackgrondImage()
      this.updateNextAttackProgressBar()
      this.showBattle()
      this.updateBuildings()
      this.renderGameMessages()

      if (this.game.isGameOver()) {
        if (!this.isGameOverModalVisible) {
          this.isGameOverModalVisible = true
          this.showGameOverModal()
        }
      }
    })
  }

  private updateGoldAmount() {
    this.goldAmountElement.textContent = this.game.getGoldAmount().toString()
  }

  private updateWoodAmount() {
    this.woodAmountElement.textContent = this.game.getWoodAmount().toString()
  }

  private updateStoneAmount() {
    this.stoneAmountElement.textContent = this.game.getStoneAmount().toString()
  }

  private updatePopulation() {
    this.populationElement.textContent = this.game.getPopulation().toString()
  }

  private updateDefence() {
    this.defenceElement.textContent = this.game.getVillageDefence().toString()
  }

  private updateNextAttackProgressBar() {
    const totalTime = this.game.getNextAttackTotal()
    const currentTime = this.game.getPeaceTimeDuration()
    const width = 100 - (currentTime / totalTime) * 100

    this.checkPogressBarStatus(width)

    this.progressBar.style.width = `${width.toFixed(2)}%`
  }

  private updateBuildings() {
    this.game.getBuildings().forEach((building) => {
      const buildingName = building.constructor.name

      const progressBar = document.querySelector(
        `.building__progress-bar--${buildingName}`
      ) as HTMLElement

      const upgradeButton = document.querySelector(
        `.building__upgrade-button--${buildingName}`
      ) as HTMLButtonElement

      if (building.isBuilding) {
        const totalTime = building.timeToBuildInMiliseconds
        const remainingTime = building.remainingTimeToBuild
        const width = 100 - (remainingTime / totalTime) * 100

        progressBar.style.width = `${width.toFixed(2)}%`
        upgradeButton.disabled = true
      } else {
        progressBar.style.width = '0%'
        upgradeButton.disabled = false
      }
    })
  }

  private renderGameMessages() {
    const message = this.game.getGameMessages().shift()

    if (message) {
      this.addMessageToList(message)
    }
  }

  private getTypeOfMessage(message: GameMessage) {
    return `game-messages__item--${message.type}`
  }

  private addMessageToList(message: GameMessage) {
    const messageItemElement = createElement({
      type: 'li',
      content: message.message,
      classes: ['game-messages__item', this.getTypeOfMessage(message)],
    })

    this.messageList.appendChild(messageItemElement)
    this.messageList.scrollTop = this.messageList.scrollHeight
  }

  private checkPogressBarStatus(width: number) {
    if (width < 10) {
      this.progressHeader.style.animation =
        'warnCicle 2s ease-in-out 0s alternate infinite none'
      this.progressBar.style.backgroundColor = 'red'

      if (Math.floor(width) === 9) {
        this.game.addGameMessage({
          message: 'Be ready. The enemy is approaching your gates.',
          type: MessageType.WARNING,
        })
      }
    } else if (width >= 99) {
      // 1px margin to prevent from getting less then 100 in the interval
      this.progressHeader.style.animation = 'none'
      this.progressHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
      this.progressHeader.style.color = 'var(--primary-color)'
      this.progressBar.style.backgroundColor = 'var(--primary-dark-color)'
    }
  }

  private renderBuildings() {
    const list = document.querySelector('.buildings__list') as HTMLElement
    this.game.getBuildings().forEach((building) => {
      const buildingItemElement = createElement({
        type: 'li',
        classes: ['buildings__list-item'],
        innerHTML: this.getBuildingContent(building),
      })

      list?.appendChild(buildingItemElement)
    })

    const upgradeButtonElements = list?.querySelectorAll(
      '.building__upgrade-button'
    )

    upgradeButtonElements.forEach((upgradeButtonElement) => {
      upgradeButtonElement.addEventListener('click', (e) => {
        const button = e.currentTarget as HTMLElement
        if (button) {
          const buildingName = button.dataset.building || ''
          const building = this.game.getBuilding(buildingName)

          if (building) {
            building.startBuilding()
          }
        }
      })
    })
  }

  private getBuildingContent(building: Building) {
    const resources = building.getResourcesNeededToBuild()

    return `
      <div class="building">
      <h3 class="building__heading">${building.getTitle()}</h3>
      <p class="building__level building__level--${
        building.constructor.name
      }">Level: ${building.getLevel()}</p>
      <div class="progress building__progress">
        <div
          class="progress-bar building__progress-bar building__progress-bar--${
            building.constructor.name
          }"
          role="progressbar">
        </div>
      </div>
      <button class="building__upgrade-button building__upgrade-button--${
        building.constructor.name
      }" data-building="${building.constructor.name}">
        <i class="fas fa-plus-circle"></i>
      </button>
      <div class="building__details">
        <h3 class="building__details-title">${building.getTitle()}</h3>
        <p class="building__details-description">${building.getDescription()}</p>
        <ul class="building__details-resources">
          ${resources
            .map((resource) => {
              return `<li class="building__price building__price--${resource.type} building__price--${building.constructor.name}">${resource.count} ${resource.type}</li>`
            })
            .join('')}
        </ul>
      </div>
    `
  }

  private showBattle() {
    new Battle(this.audio, this.game).handleBattle()
  }

  private showGameOverModal() {
    new GameOverModal(this.game).show(() => {
      this.isGameOverModalVisible = false
      this.quitGame()
    })
  }
}
