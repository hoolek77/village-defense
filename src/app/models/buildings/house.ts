import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const POPULATION = 10
const GOLD = 1
const WOOD = 3
const STONE = 1
const DEFAULT_TIME_TO_BUILD = 100
const MAX_LEVEL = 3

export class House extends Building {
  readonly population = POPULATION

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

  getTitle() {
    return 'House'
  }

  getDescription() {
    return 'Esse officia eu Lorem excepteur aliqua non. Dolor quis nisi irure eiusmod et magna eiusmod mollit non qui ad laborum nulla.'
  }

  toString = (): string => {
    return `House: [level = ${this.level}]`
  }
}
