import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const STONE_PRODUCTION: number[] = [4, 8, 12]
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

  handlePassiveIncome(level: number) {
    if (this.passiveIncomeInterval) {
      clearInterval(this.passiveIncomeInterval)
    }
    this.passiveIncomeInterval = setInterval(() => {
      this.game.changeStoneAmount(
        this.game.getStoneAmount() + this.stoneProduction[level - 1]
      )
    }, 30000)
  }

  getTitle() {
    return 'Quarry'
  }

  getDescription() {
    return 'Esse officia eu Lorem excepteur aliqua non. Dolor quis nisi irure eiusmod et magna eiusmod mollit non qui ad laborum nulla.'
  }

  toString = (): string => {
    return `Quarry: [level = ${this.level}]`
  }
}
