import { Game } from '../../game'
import { Resource } from '../types'

export class Building {
  protected level = 0
  protected isBuilding = false

  constructor(
    protected game: Game,
    protected resourcesNeededToBuild: Resource[],
    protected timeToBuildInSeconds: number,
    protected maxLevel: number
  ) {}

  getLevel() {
    return this.level
  }

  getResourcesNeededToBuild() {
    return this.resourcesNeededToBuild
  }

  startBuilding() {
    if (!this.canUpgarde() || this.isBuilding) {
      return
    }

    if (this.game.hasAvailableResources(this.resourcesNeededToBuild)) {
      this.isBuilding = true

      this.game.handleStartingConstructionOfBuilding(this)
    }
  }

  canUpgarde() {
    return this.level + 1 <= this.maxLevel
  }

  update() {
    if (this.isBuilding) {
      console.log(`${this} is building`)
      this.timeToBuildInSeconds--

      if (this.timeToBuildInSeconds <= 0) {
        this.isBuilding = false
        this.level++

        this.game.handleBuildingWasBuilt(this)
      }
    }
  }

  render() {}

  toString = (): string => {
    return `Building: [level = ${this.level}]`
  }
}
