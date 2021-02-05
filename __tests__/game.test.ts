import { START_POPULATION } from '../src/app/constants'
import { Game } from '../src/app/game'
import {
  Goldmine,
  Quarry,
  ResourceType,
  Sawmill,
  Wall,
} from '../src/app/models'

const createSut = (): [Game, jest.Mock<any, any>] => {
  const game = new Game()
  const callback = jest.fn()
  game.start(callback)

  return [game, callback]
}

describe('game', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('is created with list of buildings', () => {
    const game = new Game()

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

      expect(game.getPopulation()).not.toBe(START_POPULATION)

      game.stop()

      expect(game.getPopulation()).toBe(START_POPULATION)
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

      const wall = game.getBuilding(Wall.name)

      expect(wall).not.toBeUndefined()
      expect(game.getVillageDefence()).toBe(0)

      wall!.startBuilding()

      jest.runTimersToTime(5 * 60 * 1000)

      expect(game.getVillageDefence()).toBeGreaterThan(0)
    })
  })

  it('increase gold if gold mine was built', () => {
    const [game, _] = createSut()

    const goldMine = game.getBuilding(Goldmine.name)
    const currentGold = game.getGoldAmount()

    expect(goldMine).not.toBeUndefined()

    goldMine!.startBuilding()

    jest.runTimersToTime(5 * 60 * 1000)

    expect(game.getGoldAmount()).toBeGreaterThan(currentGold)
  })

  it('increase wood if sawmill was built', () => {
    const [game, _] = createSut()

    const sawmill = game.getBuilding(Sawmill.name)
    const currentWood = game.getWoodAmount()

    expect(sawmill).not.toBeUndefined()

    sawmill!.startBuilding()

    jest.runTimersToTime(5 * 60 * 1000)

    expect(game.getWoodAmount()).toBeGreaterThan(currentWood)
  })

  it('increase stone if quarry was built', () => {
    const [game, _] = createSut()

    const quarry = game.getBuilding(Quarry.name)
    const currentStone = game.getStoneAmount()

    expect(quarry).not.toBeUndefined()

    quarry!.startBuilding()

    jest.runTimersToTime(5 * 60 * 1000)

    expect(game.getStoneAmount()).toBeGreaterThan(currentStone)
  })
})
