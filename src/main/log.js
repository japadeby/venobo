import {app} from 'electron'
import {Main} from './windows'

export function log (...args) {
  if (app.ipcReady) {
    Main.win.send('log', ...args)
  } else {
    app.once('ipcReady', () => Main.win.send('log', ...args))
  }
}

export function error (...args) {
  if (app.ipcReady) {
    Main.win.send('error', ...args)
  } else {
    app.once('ipcReady', () => Main.win.send('error', ...args))
  }
}
