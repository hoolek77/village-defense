import { App } from '../../app'
import { Audio } from '../../audio'
import { GameOverModal, Battle, QuitModal } from '../../components'
import { Game } from '../../game'
import { Building, GameMessage, MessageType, Warrior } from '../../models'
import { createElement } from '../../utils'

const gameScreenTemplateSelector = '#game-screen-template'
const gameScreenSelector = '.game__screen'
const gameScreenOpenedClass = 'game__screen--opened'
const quitButtonSelector = '.quit-button'
const fractionImageSelector = '.fraction__image'
const goldAmountSelector = '#goldAmount'
const woodAmountSelector = '#woodAmount'
const stoneAmountSelector = '#stoneAmount'
const populationCountSelector = '.population__count'
const defenceCountSelector = '.defence__count'
const unitsCountSelector = '.units__count'
const addUnitsButtonSelector = '.units__add-button'
const gameMessagesSelector = '.game-messages'
const nextAttackProgressBarSelector = '.next-attack-progress-bar'
const nextAttackHeaderSelector = '.info__heading'
const buildingProgressBarClass = 'building__progress-bar'
const buildingUpgradeButtonClass = 'building__upgrade-button'
const gameMessagesItemClass = 'game-messages__item'
const buildingClass = 'building'
const buildingHeadingClass = 'building__heading'
const buildingListSelector = '.buildings__list'
const buildingListItemClass = 'buildings__list-item'
const buildingLevelClass = 'building__level'
const buildingPriceClass = 'building__price'
const buildingProgressClass = 'building__progress'
const buildingDetailsClass = 'building__details'
const buildingDetailsTitleClass = 'building__details-title'
const buildingDetailsDescriptionClass = 'building__details-description'
const buildingDetailsResourcesClass = 'building__details-resources'

export class GamePage {
  private app: App
  private game: Game
  private audio: Audio

  private quitButton!: HTMLButtonElement
  private quitModal: QuitModal
  private gameScreen!: HTMLElement
  private fractionImg!: HTMLDivElement

  private goldAmountElement!: HTMLElement
  private woodAmountElement!: HTMLElement
  private stoneAmountElement!: HTMLElement
  private populationElement!: HTMLElement
  private defenceElement!: HTMLElement
  private unitsElement!: HTMLElement
  private addUnitButtonElement!: HTMLButtonElement

  private messageList!: HTMLElement

  private progressHeader!: HTMLElement
  private progressBar!: HTMLElement

  private isGameOverModalVisible = false
  private attackWarningMessageAdded = false

  constructor(app: App) {
    this.app = app
    this.game = this.app.game
    this.audio = this.app.audio
    this.quitModal = new QuitModal(this, this.game)
  }

  show(appContainer: HTMLElement) {
    const template = <HTMLTemplateElement>(
      document.querySelector(gameScreenTemplateSelector)
    )
    const pageScreen = template?.content.firstElementChild?.cloneNode(true)

    if (pageScreen) {
      appContainer.appendChild(pageScreen)

      this.bindUIElements()
      this.bindEvents()
      this.setupUI()

      setTimeout(() => {
        this.gameScreen.classList.add(gameScreenOpenedClass)
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
      quitButtonSelector
    ) as HTMLButtonElement
    this.gameScreen = document.querySelector(gameScreenSelector) as HTMLElement
    this.fractionImg = document.querySelector(
      fractionImageSelector
    ) as HTMLDivElement

    this.goldAmountElement = document.querySelector(
      goldAmountSelector
    ) as HTMLElement
    this.woodAmountElement = document.querySelector(
      woodAmountSelector
    ) as HTMLElement
    this.stoneAmountElement = document.querySelector(
      stoneAmountSelector
    ) as HTMLElement

    this.populationElement = document.querySelector(
      populationCountSelector
    ) as HTMLElement
    this.defenceElement = document.querySelector(
      defenceCountSelector
    ) as HTMLElement

    this.unitsElement = document.querySelector(
      unitsCountSelector
    ) as HTMLElement
    this.addUnitButtonElement = document.querySelector(
      addUnitsButtonSelector
    ) as HTMLButtonElement

    this.messageList = document.querySelector(
      gameMessagesSelector
    ) as HTMLElement

    this.progressBar = document.querySelector(
      nextAttackProgressBarSelector
    ) as HTMLElement

    this.progressHeader = document.querySelector(
      nextAttackHeaderSelector
    ) as HTMLElement
  }

  private bindEvents() {
    this.setClosePageEvent()
    this.bindEventsForAddUnitButton()
  }

  private setupUI() {
    this.setBackgrondImage()
    this.setFractionImage()
  }

  private setFractionImage() {
    const fraction = this.app.gameSettings.fraction
    const imagePath = require(`../../../assets/images/homepage/${fraction}.png`)
    this.fractionImg.style.backgroundImage = `url(${imagePath.default})`
  }

  private setBackgrondImage() {
    const imagePath = require(`../../../assets/images/villageImages/${this.app.gameSettings.fraction}-bg.jpg`)
    this.gameScreen.style.backgroundImage = `url(${imagePath.default})`
  }

  private setClosePageEvent() {
    this.quitButton.addEventListener('click', () => {
      this.quitModal.render()
    })
  }

  private bindEventsForAddUnitButton() {
    this.addUnitButtonElement.addEventListener('click', () => {
      this.game.startRecruitingUnit(new Warrior(this.game))
    })
  }

  quitGame() {
    this.app.resetGame()
    this.app.showHomePage(true)
    this.game.stop()
  }

  private startGame() {
    this.showBattle()
    this.game.start(this.updateUI.bind(this))
    this.renderBuildings()
  }

  private updateUI() {
    requestAnimationFrame(() => {
      this.updateGoldAmount()
      this.updateWoodAmount()
      this.updateStoneAmount()
      this.updatePopulation()
      this.updateDefence()
      this.updateUnits()
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

  private updateUnits() {
    this.unitsElement.textContent = this.game.getRecruitedUnits().toString()
  }

  private updateNextAttackProgressBar() {
    const totalTime = this.game.getNextAttackTotal()
    const currentTime = this.game.getPeaceTimeDuration()
    const width = 100 - (currentTime / totalTime) * 100

    this.checkProgressBarStatus(width)

    this.progressBar.style.width = `${width.toFixed(2)}%`
  }

  private updateBuildings() {
    this.game.getBuildings().forEach((building) => {
      const buildingId = building.id

      const progressBar = document.querySelector(
        `.${buildingProgressBarClass}--${buildingId}`
      ) as HTMLElement

      const upgradeButton = document.querySelector(
        `.${buildingUpgradeButtonClass}--${buildingId}`
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

        this.updateBuildingContainer(building)
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
    return `${gameMessagesItemClass}--${message.type}`
  }

  private addMessageToList(message: GameMessage) {
    const messageItemElement = createElement({
      type: 'li',
      content: message.message,
      classes: [gameMessagesItemClass, this.getTypeOfMessage(message)],
    })

    this.messageList.appendChild(messageItemElement)
    this.messageList.scrollTop = this.messageList.scrollHeight
  }

  private checkProgressBarStatus(width: number) {
    if (width < 10) {
      this.progressHeader.style.animation =
        'warnCicle 2s ease-in-out 0s alternate infinite none'
      this.progressBar.style.backgroundColor = 'red'

      if (!this.attackWarningMessageAdded) {
        this.attackWarningMessageAdded = true

        this.game.addGameMessage({
          message: 'Be ready. The enemy is approaching your gates.',
          type: MessageType.WARNING,
        })
      }
    } else if (width >= 95) {
      // 1px margin to prevent from getting less then 100 in the interval
      this.attackWarningMessageAdded = false
      this.progressHeader.style.animation = 'none'
      this.progressHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
      this.progressHeader.style.color = 'var(--primary-color)'
      this.progressBar.style.backgroundColor = 'var(--primary-dark-color)'
    }
  }

  private renderBuildings() {
    const list = document.querySelector(buildingListSelector) as HTMLElement
    this.game.getBuildings().forEach((building) => {
      const buildingItemElement = createElement({
        type: 'li',
        classes: [buildingListItemClass],
        innerHTML: this.getBuildingContent(building),
      })

      list?.appendChild(buildingItemElement)
    })

    const upgradeButtonElements = list?.querySelectorAll(
      `.${buildingUpgradeButtonClass}`
    )

    upgradeButtonElements.forEach((upgradeButtonElement) => {
      upgradeButtonElement.addEventListener('click', (e) => {
        const button = e.currentTarget as HTMLElement
        if (button) {
          const buildingId = button.dataset.building || ''
          const building = this.game.getBuilding(buildingId)

          if (building) {
            building.startBuilding()
          }
        }
      })
    })
  }

  private getBuildingLevelContainer(building: Building) {
    const levelContainer = document.querySelector(
      `.${buildingLevelClass}--${building.id}`
    ) as HTMLElement

    return levelContainer
  }

  private getBuildingPriceContainer(building: Building) {
    const container = document.querySelectorAll(
      `.${buildingPriceClass}--${building.id}`
    )

    return container
  }

  private updateBuildingContainer(building: Building) {
    let i = 0

    this.getBuildingLevelContainer(
      building
    ).textContent = `Level: ${building.getLevel()}`

    this.getBuildingPriceContainer(building).forEach((element) => {
      element.textContent = `${building.getResourcesNeededToBuild()[i].count} ${
        building.getResourcesNeededToBuild()[i].type
      }`
      i++
    })
  }

  private getBuildingContent(building: Building) {
    const resources = building.getResourcesNeededToBuild()

    return `
      <div class="${buildingClass}">
      <h3 class="${buildingHeadingClass}">${building.getTitle()}</h3>
      <p class="${buildingLevelClass} ${buildingLevelClass}--${
      building.id
    }">Level: ${building.getLevel()}</p>
      <div class="progress ${buildingProgressClass}">
        <div
          class="progress-bar ${buildingProgressBarClass} ${buildingProgressBarClass}--${
      building.id
    }"
          role="progressbar">
        </div>
      </div>
      <button class="${buildingUpgradeButtonClass} ${buildingUpgradeButtonClass}--${
      building.id
    }" data-building="${building.id}">
        <i class="fas fa-plus-circle"></i>
      </button>
      <div class="${buildingDetailsClass}">
        <h3 class="${buildingDetailsTitleClass}">${building.getTitle()}</h3>
        <p class="${buildingDetailsDescriptionClass}">${building.getDescription()}</p>
        <ul class="${buildingDetailsResourcesClass}">
          ${resources
            .map((resource) => {
              return `<li class="${buildingPriceClass} ${buildingPriceClass}--${resource.type} ${buildingPriceClass}--${building.id}">${resource.count} ${resource.type}</li>`
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
