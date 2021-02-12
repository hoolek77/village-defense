import { Difficulty, Fractions } from './models'

export class GameSettings {
  difficulty: Difficulty = Difficulty.Medium
  fraction: Fractions = Fractions.Elves
  backgroundMusicTurnedOn = true
  backgroundMusicVolume = 0.7

  initialGoldAmount = 100
  initialWoodAmount = 100
  initialStoneAmount = 100
  initialStorageCapacity = 600
  initialPopulation = 100

  easyDifficultyAttackCountdownInMiliseconds = 10 * 60 * 1000
  mediumDifficultyAttackCountdownInMiliseconds = 8 * 60 * 1000
  hardDifficultyAttackCountdownInMiliseconds = 5 * 60 * 1000

  barracksDefaultTimeToBuildInMiliseconds = 180 * 1000
  goldmineDefaultTimeToBuildInMiliseconds = 100 * 1000
  houseDefaultTimeToBuildInMiliseconds = 120 * 1000
  quarryDefaultTimeToBuildInMiliseconds = 100 * 1000
  sawmillDefaultTimeToBuildInMiliseconds = 100 * 1000
  townhallDefaultTimeToBuildInMiliseconds = 300 * 1000
  wallDefaultTimeToBuildInMiliseconds = 200 * 1000
  warehouseDefaultTimeToBuildInMiliseconds = 300 * 1000

  warriorDefaultTimeToRecruitInMiliseconds = 120 * 1000
}
