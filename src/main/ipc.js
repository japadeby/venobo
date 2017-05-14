import {app, ipcMain as ipc} from 'electron'

import {log} from './log'
import Menu from './menu'
import {Main, WebTorrent} from './windows'
// import dialog from './dialog'
// import dock from './dock'
import powerSaveBlocker from './power-save-blocker'
import * as shortcuts from './shortcuts'
import * as thumbar from './thumbar'
import * as shell from './shell'
import * as startup from './startup'
import * as externalPlayer from './external-player'

// Messages from the main process, to be sent once the WebTorrent process starts
var messageQueueMainToWebTorrent = []

export default function () {
  ipc.once('ipcReady', (e) => {
    app.ipcReady = true
    app.emit('ipcReady')
  })

  ipc.once('ipcReadyWebTorrent', (e) => {
    app.ipcReadyWebTorrent = true
    log('sending %d queued messages from the main win to the webtorrent window',
      messageQueueMainToWebTorrent.length)
    messageQueueMainToWebTorrent.forEach(message => {
      WebTorrent.win.send(message.name, ...message.args)
      log('webtorrent: sent queued %s', message.name)
    })
  })

  /**
   * Dock
   */
  // ipc.on('setBadge', dock.setBadge)
  // ipc.on('downloadFinished', dock.downloadFinished)

  /**
   * Events
   */
  ipc.on('onPlayerOpen', () => {
    Menu.togglePlaybackControls(true)
    powerSaveBlocker.enable()
    shortcuts.enable()
    thumbar.enable()
  })

  ipc.on('onPlayerUpdate', (e, ...args) => {
    Menu.onPlayerUpdate(...args)
    thumbar.onPlayerUpdate(...args)
  })

  ipc.on('onPlayerClose', () => {
    Menu.togglePlaybackControls(false)
    powerSaveBlocker.disable()
    shortcuts.disable()
    thumbar.disable()
  })

  ipc.on('onPlayerPlay', () => {
    powerSaveBlocker.enable()
    thumbar.onPlayerPlay()
  })

  ipc.on('onPlayerPause', () => {
    powerSaveBlocker.disable()
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
   * Auto start on login
   */
  ipc.on('setStartup', (e, flag) => {
    if (flag) startup.install()
    else startup.uninstall()
  })

  /**
   * Windows: Main
   */
  ipc.on('setAspectRatio', (e, ...args) => Main.setAspectRatio(...args))
  ipc.on('setProgress', (e, ...args) => Main.setProgress(...args))
  ipc.on('setTitle', (e, ...args) => Main.setTitle(...args))
  ipc.on('toggleFullScreen', (e, ...args) => Main.toggleFullScreen(...args))
  ipc.on('setAllowNav', (e, ...args) => Menu.setAllowNav(...args))
  ipc.on('show', (e, ...args) => Main.show())

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

  /**
   * Message passing
   */
  const oldEmit = ipc.emit
  ipc.emit = (name, e, ...args) => {
    // Relay messages between the main window and the WebTorrent hidden window
    if (name.startsWith('wt-') && !app.isQuitting) {
      if (e.sender.browserWindowOptions.title === 'webtorrent-hidden-window') {
        // Send message to main window
        Main.win.send(name, ...args)
        log('webtorrent: got %s', name)
      } else if (app.ipcReadyWebTorrent) {
        // Send message to webtorrent window
        WebTorrent.win.send(name, ...args)
        log('webtorrent: sent %s', name)
      } else {
        // Queue message for webtorrent window, it hasn't finished loading yet
        messageQueueMainToWebTorrent.push({
          name: name,
          args: args
        })
        log('webtorrent: queueing %s', name)
      }
      return
    }

    // Emit all other events normally
    oldEmit.call(ipc, name, e, ...args)
  }
}
