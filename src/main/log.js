import {app} from 'electron'
import {Main} from './windows'

let win = Main.win

export function log (...args) {
  if (app.ipcReady) {
    win.send('log', ...args)
  } else {
    app.once('ipcReady', () => win.send('log', ...args))
  }
}

export function error (...args) {
  if (app.ipcReady) {
    win.send('error', ...args)
  } else {
    app.once('ipcReady', () => win.send('error', ...args))
  }
}
