import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const POPULATION = 10
const GOLD = 1
const WOOD = 3
const STONE = 1
const MAX_LEVEL = 100

export class House extends Building {
  population: number = POPULATION

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
      game.gameSettings.houseDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  getTitle() {
    return 'House'
  }

  getDescription() {
    return 'With each new house level, the population of your village increases.'
  }

  handleBuildingWasBuilt() {
    this.population = Math.round(this.population * 1.1)
  }

  toString = (): string => {
    return `House: [level = ${this.level}]`
  }
}
