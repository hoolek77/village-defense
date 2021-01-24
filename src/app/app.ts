import { Game } from './game'

export class App {
  private game!: Game

  start() {
    console.log('Starting application...')
    this.game = new Game()
    this.game.start()
  }
}
