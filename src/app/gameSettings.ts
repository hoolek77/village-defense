import { Audio } from './audio'
import { Difficulty, Fractions } from './models'

export class GameSettings {
  audio!: Audio
  difficulty: Difficulty = Difficulty.Medium
  fraction: Fractions = Fractions.Elves
  backgroundMusicTurnedOn = true
  backgroundMusicVolume = 0.7

  constructor(audio: Audio) {
    this.audio = audio
  }
}
