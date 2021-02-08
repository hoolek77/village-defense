import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD_PRODUCTION: number[] = [0, 3, 5, 7, 10, 12]
const GOLD = 5
const WOOD = 1
const STONE = 4
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
      game.gameSettings.goldmineDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  handleBuildingWasBuilt() {
    if (this.passiveIncomeInterval) {
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
    return 'Build gold mines to mine gold. With each level you are able to mine more gold.'
  }

  toString = (): string => {
    return `Gold Mine: [level = ${this.level}]`
  }
}
