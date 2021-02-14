import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const WOOD_PRODUCTION: number[] = [0, 4, 8, 12]
const GOLD = 1
const WOOD = 1
const STONE = 3
const MAX_LEVEL = 3

export class Sawmill extends Building {
  static get id() {
    return 'sawmill'
  }

  get id() {
    return Sawmill.id
  }

  readonly woodProduction = WOOD_PRODUCTION
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
      game.gameSettings.sawmillDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  handleBuildingWasBuilt() {
    if (this.passiveIncomeInterval) {
      return
    }
    this.passiveIncomeInterval = setInterval(() => {
      this.game.handleSawmillWasBuilt(this)
    }, 30000)
  }

  getProduction() {
    return this.woodProduction[this.level]
  }

  getTitle() {
    return 'Sawmill'
  }

  getDescription() {
    return 'Build a sawmill to produce wood. With each level the production increases.'
  }

  toString = (): string => {
    return `Sawmill: [level = ${this.level}]`
  }
}
