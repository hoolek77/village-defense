import { GameSettings } from '../gameSettings'
import { createElement } from '../utils'
import { renderPopup } from './popup'

export class TestModal {
  private gameSettings: GameSettings

  constructor(gameSettings: GameSettings) {
    this.gameSettings = gameSettings
  }

  show() {
    renderPopup({
      headerText: 'Test',
      popupContentHTML: this.createModalContent(),
      closeBtnText: 'Save',
    })

    this.bindEvents()
  }

  private bindEvents() {
    const goldInputElement = document.querySelector('#gold') as HTMLInputElement
    const woodInputElement = document.querySelector('#wood') as HTMLInputElement
    const stoneInputElement = document.querySelector(
      '#stone'
    ) as HTMLInputElement
    const populationInputElement = document.querySelector(
      '#population'
    ) as HTMLInputElement
    const storageCapacityInputElement = document.querySelector(
      '#storageCapacity'
    ) as HTMLInputElement
    const easyCountdownInputElement = document.querySelector(
      '#easyCountdown'
    ) as HTMLInputElement
    const mediumCountdownInputElement = document.querySelector(
      '#mediumCountdown'
    ) as HTMLInputElement
    const hardCountdownInputElement = document.querySelector(
      '#hardCountdown'
    ) as HTMLInputElement
    const barracksBuildTimeInputElement = document.querySelector(
      '#barracksBuildTime'
    ) as HTMLInputElement
    const goldmineBuildTimeInputElement = document.querySelector(
      '#goldmineBuildTime'
    ) as HTMLInputElement
    const houseBuildTimeInputElement = document.querySelector(
      '#houseBuildTime'
    ) as HTMLInputElement
    const quarryBuildTimeInputElement = document.querySelector(
      '#quarryBuildTime'
    ) as HTMLInputElement
    const sawmillBuildTimeInputElement = document.querySelector(
      '#sawmillBuildTime'
    ) as HTMLInputElement
    const townHallBuildTimeInputElement = document.querySelector(
      '#townHallBuildTime'
    ) as HTMLInputElement
    const wallBuildTimeInputElement = document.querySelector(
      '#wallBuildTime'
    ) as HTMLInputElement
    const warehouseBuildTimeInputElement = document.querySelector(
      '#warehouseBuildTime'
    ) as HTMLInputElement

    const closeButtonElement = document.querySelector(
      '.popup__close-btn'
    ) as HTMLButtonElement

    closeButtonElement.addEventListener('click', () => {
      this.gameSettings.initialGoldAmount = parseInt(goldInputElement.value)
      this.gameSettings.initialWoodAmount = parseInt(woodInputElement.value)
      this.gameSettings.initialStoneAmount = parseInt(stoneInputElement.value)
      this.gameSettings.initialPopulation = parseInt(
        populationInputElement.value
      )
      this.gameSettings.initialStorageCapacity = parseInt(
        storageCapacityInputElement.value
      )
      this.gameSettings.easyDifficultyAttackCountdownInMiliseconds =
        parseInt(easyCountdownInputElement.value) * 1000
      this.gameSettings.mediumDifficultyAttackCountdownInMiliseconds =
        parseInt(mediumCountdownInputElement.value) * 1000
      this.gameSettings.hardDifficultyAttackCountdownInMiliseconds =
        parseInt(hardCountdownInputElement.value) * 1000

      this.gameSettings.barracksDefaultTimeToBuildInMiliseconds =
        parseInt(barracksBuildTimeInputElement.value) * 1000
      this.gameSettings.goldmineDefaultTimeToBuildInMiliseconds =
        parseInt(goldmineBuildTimeInputElement.value) * 1000
      this.gameSettings.houseDefaultTimeToBuildInMiliseconds =
        parseInt(houseBuildTimeInputElement.value) * 1000
      this.gameSettings.quarryDefaultTimeToBuildInMiliseconds =
        parseInt(quarryBuildTimeInputElement.value) * 1000
      this.gameSettings.sawmillDefaultTimeToBuildInMiliseconds =
        parseInt(sawmillBuildTimeInputElement.value) * 1000
      this.gameSettings.townhallDefaultTimeToBuildInMiliseconds =
        parseInt(townHallBuildTimeInputElement.value) * 1000
      this.gameSettings.wallDefaultTimeToBuildInMiliseconds =
        parseInt(wallBuildTimeInputElement.value) * 1000
      this.gameSettings.warehouseDefaultTimeToBuildInMiliseconds =
        parseInt(warehouseBuildTimeInputElement.value) * 1000
    })
  }

  private createModalContent() {
    const content = `
    <h2 class="test-modal__heading">Change the settings of the game!</h2>
    <div class="test-modal__settings">
        <label for="gold" class="test-modal__label">Initial Gold Amount</label>
        <input type="number" name="gold" id="gold" value="${
          this.gameSettings.initialGoldAmount
        }" />

        <label for="wood" class="test-modal__label">Initial Wood Amount</label>
        <input type="number" name="wood" id="wood" value="${
          this.gameSettings.initialWoodAmount
        }" />

        <label for="stone" class="test-modal__label">Initial Stone Amount</label>
        <input type="number" name="stone" id="stone" value="${
          this.gameSettings.initialStoneAmount
        }" />

        <label for="population" class="test-modal__label">Initial Population</label>
        <input type="number" name="population" id="population" value="${
          this.gameSettings.initialPopulation
        }" />

        <label for="storageCapacity" class="test-modal__label">Initial Storage Capacity</label>
        <input type="number" name="storageCapacity" id="storageCapacity" value="${
          this.gameSettings.initialStorageCapacity
        }" />

        <label for="easyCountdown" class="test-modal__label">Easy Difficulty Attack Countdown (in seconds)</label>
        <input type="number" name="easyCountdown" id="easyCountdown" value="${
          this.gameSettings.easyDifficultyAttackCountdownInMiliseconds / 1000
        }" />

        <label for="mediumCountdown" class="test-modal__label">Medium Difficulty Attack Countdown (in seconds)</label>
        <input type="number" name="mediumCountdown" id="mediumCountdown" value="${
          this.gameSettings.mediumDifficultyAttackCountdownInMiliseconds / 1000
        }" />

        <label for="hardCountdown" class="test-modal__label">Hard Difficulty Attack Countdown (in seconds)</label>
        <input type="number" name="hardCountdown" id="hardCountdown" value="${
          this.gameSettings.hardDifficultyAttackCountdownInMiliseconds / 1000
        }" />

        <label for="barracksBuildTime" class="test-modal__label">Barracks Build Time (in seconds)</label>
        <input type="number" name="barracksBuildTime" id="barracksBuildTime" value="${
          this.gameSettings.barracksDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="goldmineBuildTime" class="test-modal__label">Gold Mine Build Time (in seconds)</label>
        <input type="number" name="goldmineBuildTime" id="goldmineBuildTime" value="${
          this.gameSettings.goldmineDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="houseBuildTime" class="test-modal__label">House Build Time (in seconds)</label>
        <input type="number" name="houseBuildTime" id="houseBuildTime" value="${
          this.gameSettings.houseDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="quarryBuildTime" class="test-modal__label">Quarry Build Time (in seconds)</label>
        <input type="number" name="quarryBuildTime" id="quarryBuildTime" value="${
          this.gameSettings.quarryDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="sawmillBuildTime" class="test-modal__label">Sawmill Build Time (in seconds)</label>
        <input type="number" name="sawmillBuildTime" id="sawmillBuildTime" value="${
          this.gameSettings.sawmillDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="townHallBuildTime" class="test-modal__label">Town Hall Build Time (in seconds)</label>
        <input type="number" name="townHallBuildTime" id="townHallBuildTime" value="${
          this.gameSettings.townhallDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="wallBuildTime" class="test-modal__label">Wall Build Time (in seconds)</label>
        <input type="number" name="wallBuildTime" id="wallBuildTime" value="${
          this.gameSettings.wallDefaultTimeToBuildInMiliseconds / 1000
        }" />

        <label for="warehouseBuildTime" class="test-modal__label">Warehouse Build Time (in seconds)</label>
        <input type="number" name="warehouseBuildTime" id="warehouseBuildTime" value="${
          this.gameSettings.warehouseDefaultTimeToBuildInMiliseconds / 1000
        }" />
    </div>
`

    const wrapper = createElement({
      type: 'div',
      classes: ['test-modal__content'],
      innerHTML: content,
    })

    return wrapper
  }
}
