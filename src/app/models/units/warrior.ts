import { Game } from '../../game'
import { Unit } from './unit'

const DEFAULT_GOLD_COST = 2
const DEFAULT_TIME_TO_RECRUIT = 10 * 1000

export class Warrior extends Unit {
  defence = 10
  goldNeededToRecruit = DEFAULT_GOLD_COST

  constructor(game: Game) {
    super(game, DEFAULT_TIME_TO_RECRUIT)
  }

  getTitle() {
    return 'Warrior'
  }
}
