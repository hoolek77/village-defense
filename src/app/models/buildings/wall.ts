import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD = 1
const WOOD = 1
const STONE = 3
const DEFAULT_TIME_TO_BUILD = 150 * 1000 // TODO: change after testing
const MAX_LEVEL = 3
const DEFENSE_PER_LEVEL: number[] = [0, 10, 15, 20]

export class Wall extends Building {
  readonly defensePerLevel = DEFENSE_PER_LEVEL

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
    return 'Wall'
  }

  getDescription() {
    return 'Esse officia eu Lorem excepteur aliqua non. Dolor quis nisi irure eiusmod et magna eiusmod mollit non qui ad laborum nulla.'
  }

  toString = (): string => {
    return `Wall: [level = ${this.level}]`
  }
}
