import { Difficulty, Fractions } from './models'

export class GameSettings {
  difficulty: Difficulty = Difficulty.Medium
  fraction: Fractions = Fractions.Elves
  backgroundMusicTurnedOn = true
  backgroundMusicVolume = 0.7
}
