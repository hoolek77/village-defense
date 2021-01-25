
import {playAudio} from './utils'
export class App {
  start() {
    console.log('Starting application...');
    playAudio(0.7);

import { GamePage, HomePage } from './screens'

export class App {
  start() {
    console.log('Starting application...')
    const homepage = new HomePage()
    const gamepage = new GamePage()
    homepage.runPage()
    gamepage.runPage()

  }
}
