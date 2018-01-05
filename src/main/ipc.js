import { app, ipcMain as ipc } from 'electron'

import { log } from './log'
import Menu from './Menu'
import Main from './window'
// import dialog from './dialog'
// import dock from './dock'
import PowerSaveBlocker from './PowerSaveBlocker'
import Tray from './Tray'
import * as thumbar from './thumbar'
import * as shell from './shell'
import * as externalPlayer from './external-player'

// Messages from the main process, to be sent once the WebTorrent process starts
let messageQueueMainToWebTorrent = []

export default function () {

  ipc.once('ipcReady', (e) => {
    app.ipcReady = true
    app.emit('ipcReady')
  })

  /**
   * Dock
   */
  // ipc.on('setBadge', dock.setBadge)
  // ipc.on('downloadFinished', dock.downloadFinished)

  /**
   * Events
   */
  ipc.on('appQuit', () => app.quit())

  ipc.on('onPlayerOpen', () => {
    Menu.togglePlaybackControls(true)
    PowerSaveBlocker.enable()
    thumbar.enable()
  })

  ipc.on('onPlayerUpdate', (e, ...args) => {
    Menu.onPlayerUpdate(...args)
    thumbar.onPlayerUpdate(...args)
  })

  ipc.on('onPlayerClose', () => {
    Menu.togglePlaybackControls(false)
    PowerSaveBlocker.disable()
    thumbar.disable()
  })

  ipc.on('onPlayerPlay', () => {
    PowerSaveBlocker.enable()
    thumbar.onPlayerPlay()
  })

  ipc.on('onPlayerPause', () => {
    PowerSaveBlocker.disable()
    thumbar.onPlayerPause()
  })

  /**
   * Shell
   */
  ipc.on('openExternal', (e, ...args) => shell.openExternal(...args))
  ipc.on('openItem', (e, ...args) => shell.openItem(...args))
  ipc.on('showItemInFolder', (e, ...args) => shell.showItemInFolder(...args))
  ipc.on('moveItemToTrash', (e, ...args) => shell.moveItemToTrash(...args))

  /**
   * Windows: Main
   */
  ipc.on('setAspectRatio', (e, ...args) => Main.setAspectRatio(...args))
  ipc.on('setProgress', (e, ...args) => Main.setProgress(...args))
  ipc.on('setTitle', (e, ...args) => Main.setTitle(...args))
  ipc.on('toggleFullScreen', (e, ...args) => Main.toggleFullScreen(...args))
  ipc.on('setAllowNav', (e, ...args) => Menu.setAllowNav(...args))
  ipc.on('show', () => Main.show())
  ipc.on('setupTray', () => Tray.init())

  /**
   * External Media Player
   */
  ipc.on('checkForExternalPlayer', (e, path) => {
    externalPlayer.checkInstall(path, (err) => {
      Main.win.send('checkForExternalPlayer', !err)
    })
  })

  ipc.on('openExternalPlayer', (e, ...args) => {
    Menu.togglePlaybackControls(false)
    thumbar.disable()
    externalPlayer.spawn(...args)
  })

  ipc.on('quitExternalPlayer', () => externalPlayer.kill())
}
