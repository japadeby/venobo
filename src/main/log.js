import { app } from 'electron'

import Main from './window'
import config from '../config'

export function log (...args) {
  if (config.IS.DEV) {
    if (app.ipcReady) {
      Main.win.send('log', ...args)
    } else {
      app.once('ipcReady', () => Main.win.send('log', ...args))
    }
  }
}

export function error (...args) {
  if (config.IS.DEV) {
    if (app.ipcReady) {
      Main.win.send('error', ...args)
    } else {
      app.once('ipcReady', () => Main.win.send('error', ...args))
    }
  }
}
