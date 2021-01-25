import infoContentProvider from "./components/info"

export class App {
  start() {
    console.log('Starting application...')
    new infoContentProvider();
  }
}
