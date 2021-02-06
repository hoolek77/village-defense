import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const STONE_PRODUCTION: number[] = [0, 4, 8, 12]
const GOLD = 1
const WOOD = 1
const STONE = 3
const DEFAULT_TIME_TO_BUILD = 100 * 1000
const MAX_LEVEL = 3

export class Quarry extends Building {
  readonly stoneProduction = STONE_PRODUCTION
  private passiveIncomeInterval: any

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

  handleBuildingWasBuilt() {
    if (this.passiveIncomeInterval) {
      return
    }
    this.passiveIncomeInterval = setInterval(() => {
      this.game.handleQuarryWasBuilt(this)
    }, 30000)
  }

  getProduction() {
    return this.stoneProduction[this.level]
  }

  getTitle() {
    return 'Quarry'
  }

  getDescription() {
    return 'Build a quarry to extract stones. With each level the output increases.'
  }

  toString = (): string => {
    return `Quarry: [level = ${this.level}]`
  }
}
