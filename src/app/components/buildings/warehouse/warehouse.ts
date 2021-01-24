import { Game } from '../../../game'
import { ResourceType } from '../../../types'
import { Building } from '../building'

const CAPACITIES = [100, 200, 400, 500, 1000]
const GOLD = 2
const WOOD = 2
const STONE = 1
const DEFAULT_TIME_TO_BUILD = 300
const MAX_LEVEL = 5
const RESOURCES_PROTECTION_PERCENTAGES = [0.05, 0.1, 0.25, 0.4, 0.5]

export class Warehouse extends Building {
  readonly capacity = CAPACITIES[this.level - 1]

  constructor(game: Game) {
    super(
      game,
      [
        {
          type: ResourceType.Gold,
          count: GOLD,
        },
        {
          type: ResourceType.Wood,
          count: WOOD,
        },
        {
          type: ResourceType.Stone,
          count: STONE,
        },
      ],
      DEFAULT_TIME_TO_BUILD,
      MAX_LEVEL
    )
  }

  percentOfProtectedResources() {
    return RESOURCES_PROTECTION_PERCENTAGES[this.level - 1]
  }

  protected handleUpgradeFinish(newLevel: number) {
    this.game.handleWarehouseUpgraded(
      CAPACITIES[newLevel - 1] - CAPACITIES[newLevel - 2]
    )
  }
}
