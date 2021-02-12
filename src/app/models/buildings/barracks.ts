import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const CAPACITY = 30
const GOLD = 1
const WOOD = 1
const STONE = 3
const MAX_LEVEL = 3

export class Barracks extends Building {
  get id() {
    return 'barracks'
  }

  private capacity = CAPACITY

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
      game.gameSettings.barracksDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  getTitle() {
    return 'Barracks'
  }

  getDescription() {
    return 'It allows to recruit units to protect the village.'
  }

  getCapacity() {
    return this.capacity * this.level
  }

  toString = (): string => {
    return `Barracks: [level = ${this.level}]`
  }
}
