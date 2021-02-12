import { Game } from '../../game'
import { Unit } from './unit'

const DEFAULT_GOLD_COST = 2

export class Warrior extends Unit {
  defence = 10
  goldNeededToRecruit = DEFAULT_GOLD_COST

  constructor(game: Game) {
    super(game, game.gameSettings.warriorDefaultTimeToRecruitInMiliseconds)
  }

  getTitle() {
    return 'Warrior'
  }
}
