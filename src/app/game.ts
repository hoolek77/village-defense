import { GAME_LOOP_DELAY_IN_MILISECONDS } from './constants'
import { GameSettings } from './gameSettings'
import {
  Building,
  Unit,
  House,
  Wall,
  Warehouse,
  Goblin,
  Goldmine,
  Difficulty,
  ResourceType,
  Resource,
  TownHall,
  Barracks,
  Quarry,
  Sawmill,
  GameMessage,
  MessageType,
} from './models'

import { randomBetween } from './utils'

export class Game {
  private resources: Resource[] = [
    {
      type: ResourceType.Gold,
      count: 0,
    },
    {
      type: ResourceType.Wood,
      count: 0,
    },
    {
      type: ResourceType.Stone,
      count: 0,
    },
  ]

  private storageCapacity = 0 // max amount of resources we can store
  private villageDefence = 0 // some buildings, e.g. wall, can increase defence

  private buildings: Building[] = []
  private villageUnits: Unit[] = []

  private population = 0

  private elapsedTimeInMilliseconds = 0
  private startTime = 0

  private peaceTime = 0
  private peaceTimeDuration = 0

  private attackDurationInMiliseconds = 5 * 1000
  private attackDuration = 0
  private attackStartTime = 0
  private attackInProgress = false
  private nextAttackTotalInMiliseconds = 0

  private attackSurvived = 0

  private gameMessages: GameMessage[] = []

  private intervalId?: number

  private isGamePaused: boolean = false
  private pauseStartTime = 0
  private pauseTimeInMiliseconds = 0

  private onGameUpdate?: () => void

  constructor(public gameSettings: GameSettings) {}

  start(onGameUpdate: () => void) {
    this.onGameUpdate = onGameUpdate

    this.addBuildings()
    this.initData()

    this.startTime = Date.now()
    this.peaceTime = Date.now()

    this.intervalId = window.setInterval(
      () => this.update(),
      GAME_LOOP_DELAY_IN_MILISECONDS
    )

    this.addGameMessage({
      message:
        'Welcome! Start managing your village and protect it from nasty goblins.',
      type: MessageType.INFO,
    })
  }

  stop() {
    this.stopGameLoop()
    this.resetGame()
  }

  startRecruitingUnit(unit: Unit) {
    if (this.canRecruitUnit(unit)) {
      if (this.hasBarrackEnoghCapacity()) {
        unit.startRecruiting()

        this.changeGoldAmount(this.getGoldAmount() - unit.goldNeededToRecruit)

        this.villageUnits.push(unit)

        this.addGameMessage({
          message: `You have started recruiting the ${unit.getTitle()}.`,
          type: MessageType.INFO,
        })
      } else {
        this.addGameMessage({
          message: `There is no room in the barracks for your units. Please upgrade it if you want to recruit a new unit.`,
          type: MessageType.WARNING,
        })
      }
    } else {
      this.addGameMessage({
        message: `You cannot recruit the ${unit.getTitle()}`,
        type: MessageType.WARNING,
      })
    }
  }

  hasAvailableResources(resources: Resource[]) {
    let hasEnoughResources = true

    resources.forEach((res) => {
      const villageResource = this.getResourceForType(res.type)

      if (villageResource) {
        if (villageResource.count < res.count) {
          hasEnoughResources = false
        }
      } else {
        hasEnoughResources = false
      }
    })

    return hasEnoughResources
  }

  handleStartingConstructionOfBuilding(building: Building) {
    this.updateResources(building.getResourcesNeededToBuild())
  }

  handleBuildingWasBuilt(building: Building) {
    if (building instanceof House) {
      this.handleHouseWasBuilt(building as House)
    } else if (building instanceof Wall) {
      this.handlewWallWasBuilt(building as Wall)
    } else if (building instanceof Warehouse) {
      this.handleWarehouseWasBuilt(building as Warehouse)
    } else if (building instanceof TownHall) {
      this.reduceTimeBuilding()
    }
  }

  getBuildings() {
    return this.buildings
  }

  getGoldAmount() {
    return this.getResourceForType(ResourceType.Gold)?.count || 0
  }

  getWoodAmount() {
    return this.getResourceForType(ResourceType.Wood)?.count || 0
  }

  getStoneAmount() {
    return this.getResourceForType(ResourceType.Stone)?.count || 0
  }

  getPopulation() {
    return this.population
  }

  getVillageDefence() {
    return this.getUnitsDefence(this.villageUnits) + this.villageDefence
  }

  getRecruitedUnits() {
    return this.villageUnits.filter((unit) => unit.isRecruited()).length
  }

  getNextAttackTotal() {
    return this.nextAttackTotalInMiliseconds
  }

  getPeaceTimeDuration() {
    return this.peaceTimeDuration
  }

  getBuilding(buildingId: string) {
    return this.buildings.find((building) => building.id === buildingId)
  }

  getGameElapsedTimeInSeconds() {
    return this.elapsedTimeInMilliseconds / 1000
  }

  getSurvivedAttacks() {
    return this.attackSurvived
  }

  isGameOver() {
    return this.population <= 0
  }

  isAttackInProgress() {
    return this.attackInProgress
  }

  getGameMessages() {
    return this.gameMessages
  }

  addGameMessage(message: GameMessage) {
    this.gameMessages.push(message)
  }

  getTotalResourceCount() {
    return this.getGoldAmount() + this.getWoodAmount() + this.getStoneAmount()
  }

  handleGoldmineWasBuilt(goldmine: Goldmine) {
    const gold = goldmine.getProduction()

    if (this.getTotalResourceCount() + gold > this.storageCapacity) {
      this.changeGoldAmount(
        this.storageCapacity - (this.getStoneAmount() + this.getWoodAmount())
      )
      this.addGameMessage({
        message: `Watch out! Storage is filled to the brim. There is no more room for your precious gold. Upgrade Warehouse to increase storage capacity.`,
        type: MessageType.WARNING,
      })
    } else {
      this.changeGoldAmount(this.getGoldAmount() + gold)
      this.addGameMessage({
        message: `The miners did their best. You have got ${gold} gold ${
          gold === 1 ? 'bar' : 'bars'
        }.`,
        type: MessageType.INFO,
      })
    }
  }

  handleQuarryWasBuilt(quarry: Quarry) {
    const stone = quarry.getProduction()

    if (this.getTotalResourceCount() + stone > this.storageCapacity) {
      this.changeStoneAmount(
        this.storageCapacity - (this.getWoodAmount() + this.getGoldAmount())
      )
      this.addGameMessage({
        message: `Ahh, your storage is full. Upgrade Warehouse, so you can find room for your stone.`,
        type: MessageType.WARNING,
      })
    } else {
      this.changeStoneAmount(this.getStoneAmount() + stone)
      this.addGameMessage({
        message: `Good day. You have got ${stone} ${
          stone === 1 ? 'stone' : 'stones'
        }.`,
        type: MessageType.INFO,
      })
    }
  }

  handleSawmillWasBuilt(sawmill: Sawmill) {
    const wood = sawmill.getProduction()

    if (this.getTotalResourceCount() + wood > this.storageCapacity) {
      this.changeWoodAmount(
        this.storageCapacity - (this.getStoneAmount() + this.getGoldAmount())
      )
      this.addGameMessage({
        message: `Oh no, there is no more room for your wood. Upgrade Warehouse to increase your storage capacity.`,
        type: MessageType.WARNING,
      })
    } else {
      this.addGameMessage({
        message: `The sawmill is going strong. You have got ${wood}  ${
          wood === 1 ? 'log' : 'logs'
        } of wood.`,
        type: MessageType.INFO,
      })
      this.changeWoodAmount(this.getWoodAmount() + wood)
    }
  }

  unpauseGame() {
    this.startTime += this.pauseTimeInMiliseconds
    this.elapsedTimeInMilliseconds += this.pauseTimeInMiliseconds
    this.peaceTimeDuration += this.pauseTimeInMiliseconds
    this.nextAttackTotalInMiliseconds += this.pauseTimeInMiliseconds
    this.isGamePaused = false
  }

  pauseGame() {
    this.pauseStartTime = Date.now()
    this.pauseTimeInMiliseconds = 0
    this.isGamePaused = true
  }

  stopGameLoop() {
    window.clearInterval(this.intervalId)
  }

  private update() {
    if (this.isGamePaused) {
      this.pauseTimeInMiliseconds = Date.now() - this.pauseStartTime
      return
    }

    this.updateBuildings()
    this.updateUnits()
    this.checkIfRandomEvent()

    if (this.onGameUpdate) {
      this.onGameUpdate()
    }

    if (this.isGameOver()) {
      this.stopGameLoop()
      return
    }

    this.elapsedTimeInMilliseconds = Date.now() - this.startTime

    if (!this.attackInProgress) {
      this.peaceTimeDuration = Date.now() - this.peaceTime
    }

    if (
      this.attackInProgress ||
      this.peaceTimeDuration >= this.nextAttackTotalInMiliseconds
    ) {
      // start attack simulation
      if (!this.attackInProgress) {
        this.attackInProgress = true
        this.attackStartTime = Date.now()
      }

      this.attackDuration = Date.now() - this.attackStartTime

      // to update progress bar before attack ends (it needs time to render to 100%)
      if (this.attackDuration + 1000 >= this.attackDurationInMiliseconds) {
        this.peaceTimeDuration = 0
        this.nextAttackTotalInMiliseconds = this.calculateNextAttack()

        if (!this.isGameOver() && this.onGameUpdate) {
          this.onGameUpdate()
        }
      }

      // attack was finished
      if (this.attackDuration >= this.attackDurationInMiliseconds) {
        this.attackInProgress = false
        this.attackStartTime = 0
        this.attackDuration = 0
      }

      if (!this.attackInProgress) {
        this.peaceTimeDuration = 0
        this.peaceTime = Date.now()

        this.nextAttackTotalInMiliseconds = this.calculateNextAttack()

        this.handleAttack()
      }
    }
  }

  private initData() {
    this.storageCapacity = this.gameSettings.initialStorageCapacity
    this.population = this.gameSettings.initialPopulation
    this.changeGoldAmount(this.gameSettings.initialGoldAmount)
    this.changeWoodAmount(this.gameSettings.initialWoodAmount)
    this.changeStoneAmount(this.gameSettings.initialStoneAmount)
    this.nextAttackTotalInMiliseconds = this.calculateNextAttack()
  }

  private resetGame() {
    this.villageDefence = 0

    this.buildings = []
    this.villageUnits = []

    this.startTime = 0
    this.elapsedTimeInMilliseconds = 0
    this.peaceTime = 0
    this.peaceTimeDuration = 0

    this.attackDuration = 0
    this.attackStartTime = 0
    this.attackInProgress = false
    this.nextAttackTotalInMiliseconds = this.calculateNextAttack()

    this.attackSurvived = 0

    this.isGamePaused = false
    this.pauseStartTime = 0
    this.pauseTimeInMiliseconds = 0

    this.initData()
  }

  private addBuildings() {
    this.addBuilding(new TownHall(this))
    this.addBuilding(new Barracks(this))
    this.addBuilding(new Warehouse(this))
    this.addBuilding(new House(this))
    this.addBuilding(new Wall(this))
    this.addBuilding(new Goldmine(this))
    this.addBuilding(new Quarry(this))
    this.addBuilding(new Sawmill(this))
  }

  private addBuilding(building: Building) {
    this.buildings.push(building)
  }

  private getResourceForType(resourceType: ResourceType) {
    return this.resources.find((res) => res.type === resourceType)
  }

  private updateResources(resources: Resource[]) {
    resources.forEach((res) => {
      const villageResource = this.getResourceForType(res.type)

      if (villageResource) {
        villageResource.count -= res.count
      }
    })
  }

  private canRecruitUnit(unit: Unit) {
    return (
      this.hasAvailableResources([
        {
          type: ResourceType.Gold,
          count: unit.goldNeededToRecruit,
        },
      ]) && this.villageUnits.length < this.population
    )
  }

  private hasBarrackEnoghCapacity() {
    const barracks = this.getBarracks()

    if (!barracks) {
      return false
    }

    return this.villageUnits.length < barracks.getCapacity()
  }

  private changeGoldAmount(goldAmount: number) {
    const gold = this.getResourceForType(ResourceType.Gold)

    if (gold) {
      gold.count = goldAmount
    }
  }

  private changeWoodAmount(woodAmount: number) {
    const wood = this.getResourceForType(ResourceType.Wood)

    if (wood) {
      wood.count = woodAmount
    }
  }
  private changeStoneAmount(stoneAmount: number) {
    const stone = this.getResourceForType(ResourceType.Stone)

    if (stone) {
      stone.count = stoneAmount
    }
  }

  private handleHouseWasBuilt(house: House) {
    this.addGameMessage({
      message: `Your village is growing. ${house.population} new residents have arrived.`,
      type: MessageType.INFO,
    })

    this.population += house.population
  }

  private handlewWallWasBuilt(wall: Wall) {
    this.addGameMessage({
      message: `The new wall added ${wall.getDefence()} points to your defence.`,
      type: MessageType.INFO,
    })

    this.villageDefence += wall.getDefence()
  }

  private handleWarehouseWasBuilt(warehouse: Warehouse) {
    this.addGameMessage({
      message: `The capacity of the resource locker has increased. You can now store ${this.storageCapacity} resources.`,
      type: MessageType.INFO,
    })

    this.storageCapacity += parseInt((warehouse.capacity * 1.5).toFixed(0))
  }

  private checkIfRandomEvent() {
    const randomInt = Math.floor(Math.random() * 10000)

    if (randomInt < 30) {
      this.handleRandomEvent()
    }
  }

  private handleRandomEvent() {
    const randomInt = Math.floor(Math.random() * 8)

    switch (randomInt) {
      case 0:
        this.handleRandomGoldStealEvent()
        break
      case 1:
        this.handleRandomBuilidngLevelDecreaseEvent()
        break
      case 2:
        this.handleRandomWoodIncreaseEvent()
        break
      case 3:
        this.handleMurderEvent()
        break
      case 4:
        this.handleBornEvent()
        break
      case 5:
        this.handleRandomTradeEvent()
        break
      case 6:
        this.handleRandomStoneIncreaseEvent()
        break
      case 7:
        this.handleRandomDefenceIncreaseEvent()
        break
      default:
        break
    }
  }

  private handleRandomGoldStealEvent() {
    if (this.getGoldAmount() === 0) return

    const goldTaken = Math.floor(0.05 * this.getGoldAmount())
    if (goldTaken < 1) return

    const gold = Math.floor(0.95 * this.getGoldAmount())
    this.changeGoldAmount(gold)
    this.addGameMessage({
      message: `Oh no, thieves have stolen ${goldTaken} gold from your storage`,
      type: MessageType.ERROR,
    })
  }

  private handleRandomBuilidngLevelDecreaseEvent() {
    const randomBuilding: Building = this.buildings[
      Math.floor(Math.random() * this.buildings.length - 1)
    ]

    if (randomBuilding) {
      randomBuilding.destroyBuildingLevel()
    }
  }

  private handleMurderEvent() {
    this.population--
    this.addGameMessage({
      message:
        'There was a murder in your village and population decreased by 1',
      type: MessageType.ERROR,
    })
  }

  private handleBornEvent() {
    this.population++
    this.addGameMessage({
      message:
        'New child was born in your village and your population increased by 1',
      type: MessageType.SUCCESS,
    })
  }

  private handleRandomWoodIncreaseEvent() {
    const sawmill = this.getBuilding(Sawmill.id)
    if (!sawmill || sawmill.getLevel() < 1) return

    const wood = Math.floor(1.05 * this.getWoodAmount())
    if (wood < 1) return

    if (
      this.getTotalResourceCount() - this.getWoodAmount() + wood >
      this.storageCapacity
    ) {
      return
    } else {
      this.changeWoodAmount(wood)
      this.addGameMessage({
        message: `Your loggers did awesome job and produced ${Math.floor(
          0.05 * this.getWoodAmount()
        )} more wood than expected`,
        type: MessageType.SUCCESS,
      })
    }
  }

  private handleRandomStoneIncreaseEvent() {
    const quarry = this.getBuilding(Quarry.id)
    if (!quarry || quarry.getLevel() < 1) return

    const stone = Math.floor(1.05 * this.getStoneAmount())
    if (stone < 1) return

    if (
      this.getTotalResourceCount() - this.getStoneAmount() + stone >
      this.storageCapacity
    ) {
      return
    } else {
      this.changeStoneAmount(stone)
      this.addGameMessage({
        message: `Your miners did stunishing job today and produced ${Math.floor(
          0.05 * this.getStoneAmount()
        )} more Stone than expected`,
        type: MessageType.SUCCESS,
      })
    }
  }

  private handleRandomTradeEvent() {
    const wood = Math.floor(Math.random() * 10) + 1
    const stone = Math.floor(Math.random() * 10) + 1
    const gold = Math.floor(Math.random() * 10) + 1

    if (
      !this.getGoldAmount() ||
      !this.getWoodAmount() ||
      !this.getStoneAmount()
    )
      return

    this.changeGoldAmount(this.getGoldAmount() + gold)
    this.changeWoodAmount(this.getWoodAmount() + wood)
    this.changeStoneAmount(this.getStoneAmount() + stone)

    this.addGameMessage({
      message: `Your villagers did awesome trade with local tradesman. You earned ${gold} gold, ${stone} stone, ${wood} wood.`,
      type: MessageType.SUCCESS,
    })
  }

  private handleRandomDefenceIncreaseEvent() {
    const barracks = this.getBuilding(Barracks.id)

    if (!barracks || barracks.getLevel() < 1 || this.villageUnits.length < 1)
      return

    const defence = Math.floor(Math.random() * 5) + 1
    this.villageDefence += defence
    this.addGameMessage({
      message: `One of your warriors became extraordinary knight. Your village defence increased by ${defence}`,
      type: MessageType.SUCCESS,
    })
  }

  private getWarehouse(): Warehouse | undefined {
    return this.buildings.find(
      (building) => building instanceof Warehouse
    ) as Warehouse
  }

  private getWall(): Wall | undefined {
    return this.buildings.find((building) => building instanceof Wall) as Wall
  }

  private getBarracks(): Barracks | undefined {
    return this.buildings.find(
      (building) => building instanceof Barracks
    ) as Barracks
  }

  private getTownHall(): TownHall | undefined {
    return this.buildings.find(
      (building) => building instanceof TownHall
    ) as TownHall
  }

  private getAllResourcesCount() {
    return this.resources.reduce((prev, resource) => {
      return prev + resource.count
    }, 0)
  }

  private getListOfAvailableResources() {
    return this.resources.filter((resource) => resource.count > 0)
  }

  private updateBuildings() {
    this.buildings.forEach((building) => building.update())
  }

  private updateUnits() {
    this.villageUnits.forEach((unit) => unit.update())
  }

  private handleAttack() {
    const enemies = this.getEnemies()

    if (!this.isVillageDefended(enemies)) {
      this.addGameMessage({
        message: `You lost the battle.`,
        type: MessageType.ERROR,
      })

      this.reducePopulation(enemies)
      this.stealResources(enemies)
    } else {
      this.attackSurvived++

      this.addGameMessage({
        message: 'Congratulations! You have repulsed the attack.',
        type: MessageType.SUCCESS,
      })
    }

    this.destroyUnits(enemies)
  }

  private reducePopulation(enemies: Unit[]) {
    const reducedPopulation = Math.round(enemies.length * 0.8)
    this.population -= reducedPopulation

    this.addGameMessage({
      message: `The population of your residents has decreased by ${reducedPopulation} ${
        reducedPopulation === 1 ? 'person' : 'people'
      }.`,
      type: MessageType.ERROR,
    })

    if (this.population < 0) {
      this.population = 0
    }
  }

  private reduceTimeBuilding() {
    const townHall = this.getTownHall()
    const percent = townHall?.reducingConstructionTime()
    const buildings = this.getBuildings()
    buildings.forEach((building) => {
      if (percent) {
        const timetoreduce = percent * building.timeToBuildInMiliseconds
        return (building.timeToBuildInMiliseconds =
          building.timeToBuildInMiliseconds - timetoreduce)
      }
    })
  }

  private destroyUnits(enemies: Unit[]) {
    const villageUnitsDefence = this.getUnitsDefence(this.villageUnits)
    const enemiesAttack = this.getUnitsAttack(enemies)
    let unitsToDestroy = 0

    if (villageUnitsDefence < enemiesAttack) {
      unitsToDestroy = Math.ceil((enemiesAttack - villageUnitsDefence) / 10)
    } else {
      const unitsSurvived = Math.ceil(
        (villageUnitsDefence - enemiesAttack) / 10
      )

      unitsToDestroy = this.villageUnits.length - unitsSurvived
    }

    if (unitsToDestroy > 0 && unitsToDestroy <= this.villageUnits.length) {
      this.villageUnits.splice(0, unitsToDestroy)

      this.addGameMessage({
        message: `You have lost ${unitsToDestroy} units.`,
        type: MessageType.ERROR,
      })
    }
  }

  private stealResources(enemies: Unit[]) {
    const warehouse = this.getWarehouse()
    const percent =
      warehouse !== undefined ? warehouse.percentOfProtectedResources() : 0
    const allResourcesCount = this.getAllResourcesCount()
    const enemiesCapacity = this.getUnitsCapacity(enemies) // how many resources can enemies carry
    let numberOfResourcesToSteal = Math.round(
      allResourcesCount - percent * allResourcesCount
    )

    if (enemiesCapacity < numberOfResourcesToSteal) {
      numberOfResourcesToSteal = enemiesCapacity
    }

    const availableResources = this.getListOfAvailableResources()

    if (numberOfResourcesToSteal > 0) {
      this.addGameMessage({
        message: `You have lost ${numberOfResourcesToSteal} of your resources.`,
        type: MessageType.ERROR,
      })
    }

    while (numberOfResourcesToSteal > 0) {
      availableResources.forEach((resource) => {
        if (resource.count > 0 && numberOfResourcesToSteal > 0) {
          resource.count--
          numberOfResourcesToSteal--
        }
      })
    }
  }

  private getEnemies(): Unit[] {
    const wall = this.getWall()
    let maxEnemiesCount = this.villageUnits.length

    if (maxEnemiesCount === 0) {
      // there is no village units, so add some enemies
      maxEnemiesCount = 3
    }

    if (wall) {
      maxEnemiesCount += Math.round(this.villageDefence / 10)
    }

    switch (this.gameSettings.difficulty) {
      case Difficulty.Easy:
        maxEnemiesCount += Math.round(maxEnemiesCount * 1.1)

        break
      case Difficulty.Medium:
        maxEnemiesCount += Math.round(maxEnemiesCount * 1.3)

        break
      case Difficulty.Hard:
        maxEnemiesCount += Math.round(maxEnemiesCount * 1.5)

        break
    }

    const numberOfEnemies = randomBetween(1, maxEnemiesCount)

    return [...Array(numberOfEnemies)].map(() => new Goblin(this))
  }

  private isVillageDefended(enemies: Unit[]) {
    const villageDefence = this.getVillageDefence()
    const enemiesAttack = this.getUnitsAttack(enemies)

    return (villageDefence - enemiesAttack) / 10 > 0
  }

  private getUnitsDefence(units: Unit[]) {
    return units.reduce((defence, unit) => {
      if (unit.isRecruited()) {
        return defence + unit.defence
      } else {
        return defence
      }
    }, 0)
  }

  private getUnitsAttack(units: Unit[]) {
    return units.reduce((attack, unit) => {
      return attack + unit.strength
    }, 0)
  }

  private getUnitsCapacity(units: Unit[]) {
    return units.reduce((capacity, unit) => {
      return capacity + unit.capacity
    }, 0)
  }

  private calculateNextAttack() {
    let interval = 0

    const FIRST_GAME_TIME_THRESHOLD = 10 * 60 * 1000
    const SECOND_GAME_TIME_THRESHOLD = 15 * 60 * 1000
    const THIRD_GAME_TIME_THRESHOLD = 20 * 60 * 1000

    switch (this.gameSettings.difficulty) {
      case Difficulty.Easy:
        interval = this.gameSettings.easyDifficultyAttackCountdownInMiliseconds

        if (this.elapsedTimeInMilliseconds >= THIRD_GAME_TIME_THRESHOLD) {
          interval *= 0.4
        } else if (
          this.elapsedTimeInMilliseconds >= SECOND_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.6
        } else if (
          this.elapsedTimeInMilliseconds >= FIRST_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.8
        }

        break
      case Difficulty.Medium:
        interval = this.gameSettings
          .mediumDifficultyAttackCountdownInMiliseconds

        if (this.elapsedTimeInMilliseconds >= THIRD_GAME_TIME_THRESHOLD) {
          interval *= 0.3
        } else if (
          this.elapsedTimeInMilliseconds >= SECOND_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.5
        } else if (
          this.elapsedTimeInMilliseconds >= FIRST_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.8
        }

        break
      case Difficulty.Hard:
        interval = this.gameSettings.hardDifficultyAttackCountdownInMiliseconds

        if (this.elapsedTimeInMilliseconds >= THIRD_GAME_TIME_THRESHOLD) {
          interval *= 0.2
        } else if (
          this.elapsedTimeInMilliseconds >= SECOND_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.4
        } else if (
          this.elapsedTimeInMilliseconds >= FIRST_GAME_TIME_THRESHOLD
        ) {
          interval *= 0.8
        }

        break
    }

    return interval
  }
}
