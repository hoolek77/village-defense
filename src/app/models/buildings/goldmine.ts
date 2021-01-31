import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD_PRODUCTION: number[] = [0, 3, 5, 7, 10, 12]
const GOLD = 5
const WOOD = 1
const STONE = 4
const DEFAULT_TIME_TO_BUILD = 200 * 1000
const MAX_LEVEL = 5

export class Goldmine extends Building {
  readonly goldProduction = GOLD_PRODUCTION
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
    if (this.passiveIncomeInterval != undefined) {
      return
    }
    this.passiveIncomeInterval = setInterval(() => {
      this.game.handleGoldmineWasBuilt(this)
    }, 30000)
  }

  getProduction() {
    return this.goldProduction[this.level]
  }

  getTitle() {
    return 'Gold Mine'
  }

  getDescription() {
    return 'Esse officia eu Lorem excepteur aliqua non. Dolor quis nisi irure eiusmod et magna eiusmod mollit non qui ad laborum nulla.'
  }

  toString = (): string => {
    return `Gold Mine: [level = ${this.level}]`
  }
}
