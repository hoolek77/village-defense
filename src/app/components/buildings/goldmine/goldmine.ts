import { Game } from '../../../game'
import { ResourceType } from '../../../types'
import { Building } from '../building'

const GOLD_PRODUCTION = 10
const GOLD = 5
const WOOD = 1
const STONE = 4
const DEFAULT_TIME_TO_BUILD = 200
const MAX_LEVEL = 5

export class Goldmine extends Building {
  readonly goldProduction = GOLD_PRODUCTION

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
}
