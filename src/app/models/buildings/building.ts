import { GAME_LOOP_DELAY_IN_MILISECONDS } from '../../constants'
import { Game } from '../../game'
import { MessageType, Resource } from '../types'

export class Building {
  get id() {
    return 'building'
  }

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

  destroyBuildingLevel() {
    if (this.level >= 1) {
      this.level--
      this.game.addGameMessage({
        message: `Watch out, there was a storm and lighting has hit your ${this.getTitle()}. It's level got decreased by one.`,
        type: MessageType.ERROR,
      })
    }
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
        message: `You have started upgrading the ${this.getTitle()}.`,
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
    return this.level < this.maxLevel
  }

  update() {
    if (this.isBuilding) {
      this.remainingTimeToBuild -= GAME_LOOP_DELAY_IN_MILISECONDS

      if (this.remainingTimeToBuild <= 0) {
        this.isBuilding = false
        this.level++
        this.remainingTimeToBuild = this.timeToBuildInMiliseconds

        this.handleBuildingWasBuilt()
        this.increaseResourcesNeededToBuild()
        this.game.handleBuildingWasBuilt(this)

        this.game.addGameMessage({
          message: `The ${this.getTitle()} was upgraded to the level ${this.getLevel()}.`,
          type: MessageType.INFO,
        })
      }
    }
  }

  protected handleBuildingWasBuilt() {}

  private increaseResourcesNeededToBuild() {
    this.resourcesNeededToBuild.forEach((res) => {
      res.count = parseInt((res.count * 1.5).toFixed(0))
    })
  }

  toString = (): string => {
    return `Building: [level = ${this.level}]`
  }
}
