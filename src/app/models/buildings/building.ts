import { GAME_LOOP_DELAY_IN_MILISECONDS } from '../../constants'
import { Game } from '../../game'
import { MessageType, Resource } from '../types'

export class Building {
  protected level = 0

  isBuilding = false
  remainingTimeToBuild = this.timeToBuildInMiliseconds

  constructor(
    protected game: Game,
    public resourcesNeededToBuild: Resource[],
    public timeToBuildInMiliseconds: number,
    protected maxLevel: number
  ) {}

  getLevel() {
    return this.level
  }

  getResourcesNeededToBuild() {
    return this.resourcesNeededToBuild
  }

  getTitle() {
    return ''
  }

  getDescription() {
    return ''
  }

  startBuilding() {
    if (!this.canUpgarde() || this.isBuilding) {
      return
    }

    if (this.game.hasAvailableResources(this.resourcesNeededToBuild)) {
      this.isBuilding = true

      this.game.handleStartingConstructionOfBuilding(this)
      this.game.addGameMessage({
        message: `You have started to upgrading the ${this.getTitle()}.`,
        type: MessageType.INFO,
      })
    } else {
      this.game.addGameMessage({
        message: `You don't have enough resources to buy the ${this.getTitle()}`,
        type: MessageType.WARNING,
      })
    }
  }

  canUpgarde() {
    return this.level + 1 <= this.maxLevel
  }

  getLevelContainer() {
    const levelContainer = document.querySelector(
      `.building__level--${this.constructor.name}`
    ) as HTMLElement
    return levelContainer
  }

  getBuildingPriceContainer() {
    const container = document.querySelectorAll(
      `.building__price--${this.constructor.name}`
    )
    return container
  }

  updateBuildingContainer() {
    let i = 0
    this.getLevelContainer().textContent = `Level: ${this.level}`
    this.getBuildingPriceContainer().forEach((element) => {
      element.textContent = `${this.resourcesNeededToBuild[i].count} ${this.resourcesNeededToBuild[i].type}`
      i++
    })
  }

  update() {
    if (this.isBuilding) {
      console.log(`${this} is building`)
      this.remainingTimeToBuild -= GAME_LOOP_DELAY_IN_MILISECONDS
      console.log(this.remainingTimeToBuild)
      if (this.remainingTimeToBuild <= 0) {
        this.isBuilding = false
        this.handleBuildingContent()
        this.handleBuildingWasBuilt()
        this.game.handleBuildingWasBuilt(this)

        this.game.addGameMessage({
          message: `The ${this.getTitle()} was upgraded to the level ${this.getLevel()}.`,
          type: MessageType.SUCCESS,
        })
      }
    }
  }

  protected handleBuildingWasBuilt() {}

  private handleBuildingContent() {
    this.level++
    this.updateBuildingContainer()
    this.remainingTimeToBuild = this.timeToBuildInMiliseconds
  }

  render() {}

  toString = (): string => {
    return `Building: [level = ${this.level}]`
  }
}
