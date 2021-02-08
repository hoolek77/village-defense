import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD = 10
const WOOD = 15
const STONE = 20
const MAX_LEVEL = 3
const REDUCING_CONSTRUCTION_TIME = [0, 0.2, 0.3, 0.5]

export class TownHall extends Building {
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
      game.gameSettings.townhallDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  getTitle() {
    return 'Town Hall'
  }

  getDescription() {
    return 'Each new Town Hall level makes your buildings build faster.'
  }

  reducingConstructionTime() {
    return REDUCING_CONSTRUCTION_TIME[this.level]
  }

  toString = (): string => {
    return `Town Hall: [level = ${this.level}]`
  }
}
