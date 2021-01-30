import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD = 1
const WOOD = 1
const STONE = 3
const DEFAULT_TIME_TO_BUILD = 200
const MAX_LEVEL = 3

export class Barracks extends Building {
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
    return 'Barracks'
  }

  getDescription() {
    return 'It helps to create units faster.'
  }

  toString = (): string => {
    return `Barracks: [level = ${this.level}]`
  }
}
