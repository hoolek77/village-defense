import { GAME_LOOP_DELAY_IN_MILISECONDS } from '../../constants'
import { Game } from '../../game'
import { MessageType, ResourceType } from '../types'

export class Unit {
  readonly strength: number = 0
  readonly defence: number = 0
  readonly capacity: number = 0 // how many things can this unit hold
  readonly goldNeededToRecruit: number = 0

  private isUnitRecruited = false
  private isRecruiting = false

  remainingTimeToRecruit = this.timeToRecruitInMiliseconds

  constructor(
    protected game: Game,
    public timeToRecruitInMiliseconds: number = 0
  ) {}

  isRecruited() {
    return this.isUnitRecruited
  }

  startRecruiting() {
    this.isRecruiting = true
  }

  getTitle() {
    return ''
  }

  update() {
    if (this.isRecruiting) {
      console.log('is recruiting unit')
      this.remainingTimeToRecruit -= GAME_LOOP_DELAY_IN_MILISECONDS

      if (this.remainingTimeToRecruit <= 0) {
        this.isRecruiting = false
        this.isUnitRecruited = true
        this.remainingTimeToRecruit = this.timeToRecruitInMiliseconds

        this.game.addGameMessage({
          message: `The ${this.getTitle()} was recruited.`,
          type: MessageType.INFO,
        })
      }
    }
  }

  render() {}
}
