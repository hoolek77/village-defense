import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const WOOD_PRODUCTION = 10
const GOLD = 1
const WOOD = 1
const STONE = 3
const DEFAULT_TIME_TO_BUILD = 100
const MAX_LEVEL = 3

export class Sawmill extends Building {
  readonly woodProduction = WOOD_PRODUCTION

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
    return 'Sawmill'
  }

  getDescription() {
    return 'Esse officia eu Lorem excepteur aliqua non. Dolor quis nisi irure eiusmod et magna eiusmod mollit non qui ad laborum nulla.'
  }

  toString = (): string => {
    return `Sawmill: [level = ${this.level}]`
  }
}
