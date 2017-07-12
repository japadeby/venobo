import {app} from 'electron'

import Main from './window'
import {IS} from '../config'

export function log (...args) {
  if (IS.DEV) {
    if (app.ipcReady) {
      Main.win.send('log', ...args)
    } else {
      app.once('ipcReady', () => Main.win.send('log', ...args))
    }
  }
}

export function error (...args) {
  if (IS.DEV) {
    if (app.ipcReady) {
      Main.win.send('error', ...args)
    } else {
      app.once('ipcReady', () => Main.win.send('error', ...args))
    }
  }
}
