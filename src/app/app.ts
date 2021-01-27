import infoContentProvider from './components/info'
import { playAudio } from './utils'
import { GamePage, HomePage } from './screens'

export class App {
  start() {
    console.log('Starting application...')
    new infoContentProvider()
    playAudio(0.7)
    const homepage = new HomePage()
    homepage.runPage()
  }
}
