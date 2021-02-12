import { Game } from '../../game'
import { ResourceType } from '../types'
import { Building } from './building'

const GOLD = 1
const WOOD = 1
const STONE = 3
const MAX_LEVEL = 3
const DEFENCE: number[] = [0, 10, 15, 20]

export class Wall extends Building {
  get id() {
    return 'wall'
  }

  private defence = DEFENCE

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
      game.gameSettings.wallDefaultTimeToBuildInMiliseconds,
      MAX_LEVEL
    )
  }

  getDefence() {
    return this.defence[this.level]
  }

  getTitle() {
    return 'Wall'
  }

  getDescription() {
    return 'Build defensive walls to increase the defense of your village.'
  }

  toString = (): string => {
    return `Wall: [level = ${this.level}]`
  }
}
