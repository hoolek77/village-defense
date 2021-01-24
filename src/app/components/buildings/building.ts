import { Game } from '../../game'
import { ONE_SECOND, Resource } from '../../types'

enum Action {
  building,
  upgrading,
}

export class Building {
  private intervalId?: number

  protected level = 1
  protected isBuilt = false

  constructor(
    protected game: Game,
    protected resourcesNeededToBuild: Resource[],
    protected timeToBuildInSeconds: number,
    protected maxLevel: number
  ) {}

  startBuilding() {
    this.startTimer(Action.building)
  }

  canUpgarde() {
    return this.level + 1 <= this.maxLevel
  }

  startUpgrading() {
    if (!this.canUpgarde()) {
      return
    }

    this.isBuilt = false

    this.startTimer(Action.upgrading)
  }

  render() {}

  protected handleBuildFinish() {}

  protected handleUpgradeFinish(newLevel: number) {}

  private startTimer(action: Action) {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId!)
    }

    this.intervalId = window.setInterval(() => {
      this.timeToBuildInSeconds--

      if (this.timeToBuildInSeconds <= 0) {
        this.isBuilt = true
        window.clearInterval(this.intervalId!)

        if (action === Action.building) {
          this.game.handleBuildingWasBuilt(this)
          this.handleBuildFinish()
        } else if (action === Action.upgrading) {
          this.level++
          this.game.handleBuildingWasUpgraded(this)
          this.handleUpgradeFinish(this.level)
        }
      }
    }, ONE_SECOND)
  }
}
