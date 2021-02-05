import {
  DEFAULT_GOLD,
  DEFAULT_STONE,
  DEFAULT_STORAGE_CAPACITY,
  DEFAULT_WOOD,
  EASY_ATTACK_COUNTDOWN_IN_MILISECONDS,
  GAME_LOOP_DELAY_IN_MILISECONDS,
  HARD_ATTACK_COUNTDOWN_IN_MILISECONDS,
  MEDIUM_ATTACK_COUNTDOWN_IN_MILISECONDS,
  START_POPULATION,
} from './constants'
import {
  Building,
  Unit,
  House,
  Wall,
  Warehouse,
  Goblin,
  Knight,
  Goldmine,
  Difficulty,
  ResourceType,
  Resource,
  Fractions,
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
      count: DEFAULT_GOLD,
    },
    {
      type: ResourceType.Wood,
      count: DEFAULT_WOOD,
    },
    {
      type: ResourceType.Stone,
      count: DEFAULT_STONE,
    },
  ]

  private storageCapacity = DEFAULT_STORAGE_CAPACITY // max amount of resources we can store
  private villageDefence = 0 // some buildings, e.g. wall, can increase defence

  private buildings: Building[] = []
  private villageUnits: Unit[] = []

  private population = START_POPULATION

  private elapsedTimeInMilliseconds = 0
  private startTime = 0

  private peaceTime = 0
  private peaceTimeDuration = 0

  private attackDurationInMiliseconds = 5 * 1000
  private attackDuration = 0
  private attackStartTime = 0
  private attackInProgress = false
  private nextAttackTotalInMiliseconds = this.calculateNextAttack()

  private attackSurvived = 0

  private gameMessages: GameMessage[] = []

  private intervalId?: number

  private onGameUpdate?: () => void

  constructor(
    private fraction: Fractions = Fractions.Humans,
    private difficulty: Difficulty = Difficulty.Medium
  ) {
    this.addBuildings()
  }

  start(onGameUpdate: () => void) {
    this.onGameUpdate = onGameUpdate

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
    this.addBuildings()
  }

  addVillageUnit(unit: Unit) {
    this.villageUnits.push(unit)
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

  getNextAttackTotal() {
    return this.nextAttackTotalInMiliseconds
  }

  getPeaceTimeDuration() {
    return this.peaceTimeDuration
  }

  getBuilding(buildingName: string) {
    return this.buildings.find(
      (building) => building.constructor.name === buildingName
    )
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

  private update() {
    this.updateBuildings()
    this.renderBuildings()
    this.renderUnits()
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

  private stopGameLoop() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId!)
    }
  }

  private resetGame() {
    this.storageCapacity = DEFAULT_STORAGE_CAPACITY
    this.villageDefence = 0

    this.buildings = []
    this.villageUnits = []

    this.population = START_POPULATION

    this.startTime = 0
    this.elapsedTimeInMilliseconds = 0
    this.peaceTime = 0
    this.peaceTimeDuration = 0

    this.attackDuration = 0
    this.attackStartTime = 0
    this.attackInProgress = false
    this.nextAttackTotalInMiliseconds = this.calculateNextAttack()

    this.attackSurvived = 0

    this.changeGoldAmount(DEFAULT_GOLD)
    this.changeWoodAmount(DEFAULT_WOOD)
    this.changeStoneAmount(DEFAULT_STONE)
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
    const randomInt = Math.floor(Math.random() * 100)

    if (randomInt < 30) {
      this.handleRandomEvent()
    }
  }

  private handleRandomEvent() {
    const randomInt = Math.floor(Math.random() * 5)

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
    const randomBuilding = this.buildings[
      Math.floor(Math.random() * this.buildings.length - 1)
    ]

    if (!this.getBuilding(`${randomBuilding}`)) return

    randomBuilding.setLevel(randomBuilding.getLevel() - 1)
    this.addGameMessage({
      message: `Watch out, there was a storm and lighting has hit your ${randomBuilding.getTitle()}. It's level got decreased by one.`,
      type: MessageType.ERROR,
    })
  }

  private handleMurderEvent() {
    this.population = this.getPopulation() - 1
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
    if (!this.getBuilding('Sawmill')) return

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
        )} more wood that expected`,
        type: MessageType.SUCCESS,
      })
    }
  }

  private getWarehouse(): Warehouse | undefined {
    return this.buildings.find(
      (building) => building instanceof Warehouse
    ) as Warehouse
  }

  private getWall(): Wall | undefined {
    return this.buildings.find((building) => building instanceof Wall) as Wall
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

  private renderBuildings() {
    this.buildings.forEach((building) => building.render())
  }

  private updateBuildings() {
    this.buildings.forEach((building) => building.update())
  }

  private renderUnits() {
    this.villageUnits.forEach((unit) => unit.render())
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
    const percent = townHall?.reducingAmountResources()
    const buildings = this.getBuildings()
    buildings.forEach((building) => {
      if (percent) {
        const timetoreduce = percent * building.timeToBuildInMiliseconds
        return (building.timeToBuildInMiliseconds =
          building.timeToBuildInMiliseconds - timetoreduce)
      }
    })
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
    console.log('percent of protected resources', percent)
    console.log('enemies capacity', enemiesCapacity)

    if (enemiesCapacity < numberOfResourcesToSteal) {
      numberOfResourcesToSteal = enemiesCapacity
    }
    console.log('resources to steal', numberOfResourcesToSteal)
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

    switch (this.difficulty) {
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
    console.log('enemies', numberOfEnemies)
    return [...Array(numberOfEnemies)].map(() => new Goblin())
  }

  private isVillageDefended(enemies: Unit[]) {
    const villageDefence = this.getVillageDefence()
    const enemiesAttack = this.getUnitsAttack(enemies)
    console.log('village defence', villageDefence)
    console.log('enemies attack', enemiesAttack)
    console.log('village defended', (villageDefence - enemiesAttack) / 10 > 0)
    return (villageDefence - enemiesAttack) / 10 > 0
  }

  private getUnitsDefence(units: Unit[]) {
    return units.reduce((defence, unit) => {
      return defence + unit.defence
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

    const FIRST_GAME_TIME_THRESHOLD = 2 * 60 * 1000 // TODO: change to 10 after testing
    const SECOND_GAME_TIME_THRESHOLD = 15 * 60 * 1000
    const THIRD_GAME_TIME_THRESHOLD = 20 * 60 * 1000

    switch (this.difficulty) {
      case Difficulty.Easy:
        interval = EASY_ATTACK_COUNTDOWN_IN_MILISECONDS

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
        interval = MEDIUM_ATTACK_COUNTDOWN_IN_MILISECONDS

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
        interval = HARD_ATTACK_COUNTDOWN_IN_MILISECONDS

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
