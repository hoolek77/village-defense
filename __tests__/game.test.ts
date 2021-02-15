import { Game } from '../src/app/game'
import { GameSettings } from '../src/app/gameSettings'
import {
  Goldmine,
  Quarry,
  Resource,
  ResourceType,
  Sawmill,
  Wall,
} from '../src/app/models'

const getResourceForType = (
  resourceType: ResourceType,
  resources: Resource[]
) => {
  return resources.find((res) => res.type === resourceType)
}

const createSut = (): [Game, jest.Mock<any, any>] => {
  const gameSettings = new GameSettings()
  gameSettings.goldmineDefaultTimeToBuildInMiliseconds = 1000
  gameSettings.sawmillDefaultTimeToBuildInMiliseconds = 1000
  gameSettings.quarryDefaultTimeToBuildInMiliseconds = 1000
  gameSettings.wallDefaultTimeToBuildInMiliseconds = 1000

  const game = new Game(gameSettings)
  const callback = jest.fn()
  game.start(callback)

  return [game, callback]
}

describe('game', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('is created with list of buildings', () => {
    const [game, _] = createSut()

    expect(game.getBuildings().length).toBeGreaterThan(0)
  })

  describe('start', () => {
    it('calls callback function from game loop', () => {
      const [_, callback] = createSut()

      expect(callback).not.toBeCalled()

      jest.runOnlyPendingTimers()

      expect(setInterval).toBeCalled()
      expect(callback).toBeCalled()
    })

    it('adds welcome game message', () => {
      const [game, _] = createSut()

      expect(
        game
          .getGameMessages()
          .filter(
            (message) =>
              message.message ===
              'Welcome! Start managing your village and protect it from nasty goblins.'
          )
      ).toHaveLength(1)
    })
  })

  describe('stop', () => {
    it('stops game loop', () => {
      const [game, _] = createSut()

      expect(setInterval).toBeCalled()

      game.stop()

      expect(clearInterval).toBeCalled()
    })

    it('resets game', () => {
      const [game, _] = createSut()

      const buildings = game.getBuildings()

      buildings.forEach((building) => {
        game.handleBuildingWasBuilt(building)
      })

      expect(game.getPopulation()).not.toBe(game.gameSettings.initialPopulation)

      game.stop()

      expect(game.getPopulation()).toBe(game.gameSettings.initialPopulation)
    })
  })

  describe('hasAvailableResources', () => {
    it('returns true if there are available resources', () => {
      const [game, _] = createSut()
      const resources = [
        {
          type: ResourceType.Gold,
          count: 1,
        },
        {
          type: ResourceType.Wood,
          count: 1,
        },
        {
          type: ResourceType.Stone,
          count: 1,
        },
      ]

      const hasEnough = game.hasAvailableResources(resources)

      expect(hasEnough).toBeTruthy()
    })

    it('returns false if there are no available resources', () => {
      const [game, _] = createSut()
      const resources = [
        {
          type: ResourceType.Gold,
          count: 9999,
        },
        {
          type: ResourceType.Wood,
          count: 1,
        },
        {
          type: ResourceType.Stone,
          count: 1,
        },
      ]

      const hasEnough = game.hasAvailableResources(resources)

      expect(hasEnough).toBeFalsy()
    })
  })

  describe('upgrading a building', () => {
    it('increase defence if wall was built', () => {
      const [game, _] = createSut()

      const wall = game.getBuilding(Wall.id)

      expect(wall).not.toBeUndefined()
      expect(game.getVillageDefence()).toBe(0)

      wall!.startBuilding()

      jest.runTimersToTime(1000)

      expect(game.getVillageDefence()).toBeGreaterThan(0)
    })
  })

  it('increase gold if gold mine was built', () => {
    const [game, _] = createSut()

    const goldMine = game.getBuilding(Goldmine.id)

    expect(goldMine).not.toBeUndefined()

    const resources = goldMine!.getResourcesNeededToBuild()
    const cost = getResourceForType(ResourceType.Gold, resources)

    expect(cost).not.toBeUndefined()

    const currentGold = game.getGoldAmount() - cost!.count

    goldMine!.startBuilding()

    jest.runTimersToTime(60 * 1000)

    expect(game.getGoldAmount()).toBeGreaterThan(currentGold)
  })

  it('increase wood if sawmill was built', () => {
    const [game, _] = createSut()

    const sawmill = game.getBuilding(Sawmill.id)

    expect(sawmill).not.toBeUndefined()

    const resources = sawmill!.getResourcesNeededToBuild()
    const cost = getResourceForType(ResourceType.Wood, resources)

    expect(cost).not.toBeUndefined()

    const currentWood = game.getWoodAmount() - cost!.count

    sawmill!.startBuilding()

    jest.runTimersToTime(60 * 1000)

    expect(game.getWoodAmount()).toBeGreaterThan(currentWood)
  })

  it('increase stone if quarry was built', () => {
    const [game, _] = createSut()

    const quarry = game.getBuilding(Quarry.id)

    expect(quarry).not.toBeUndefined()

    const resources = quarry!.getResourcesNeededToBuild()
    const cost = getResourceForType(ResourceType.Stone, resources)

    expect(cost).not.toBeUndefined()

    const currentStone = game.getStoneAmount() - cost!.count

    quarry!.startBuilding()

    jest.runTimersToTime(60 * 1000)

    expect(game.getStoneAmount()).toBeGreaterThan(currentStone)
  })
})
