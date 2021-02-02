import './core/bootstrap'

import { App } from './app'

const app = new App()
document.addEventListener('DOMContentLoaded', () => new App().start())
