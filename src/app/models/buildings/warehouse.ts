import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const CAPACITY = 100
const GOLD = 2
const WOOD = 2
const STONE = 1
const MAX_LEVEL = 5
const RESOURCES_PROTECTION_PERCENTAGES = [0, 0.05, 0.1, 0.25, 0.4, 0.5]

export class Warehouse extends Building {
  readonly capacity = CAPACITY

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
      game.gameSettings.warehouseDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  getTitle() {
    return 'Warehouse'
  }

  getDescription() {
    return 'Upgrade warehouse to increase its capacity.'
  }

  percentOfProtectedResources() {
    return RESOURCES_PROTECTION_PERCENTAGES[this.level]
  }

  toString = (): string => {
    return `Warehouse: [level = ${this.level}]`
  }
}
