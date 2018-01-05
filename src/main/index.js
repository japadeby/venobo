console.time('init')

import { ipcMain, app } from 'electron'
import async from 'async'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import config from '../config'
import crashReporter from '../crashReporter'
import { log } from './log'

import Menu from './Menu'
import State from '../renderer/lib/state'
import Main from './window'
import announcement from './announcement'
import updater from './updater'
import ipc from './ipc'
import render from './render'

export default class MainProcess {

  shouldQuit: Boolean = false
  isReady: Boolean = false // app ready, windows can be created

  constructor() {
    if (config.IS.PRODUCTION) {
      // When Electron is running in production mode (packaged app), then run React
      // in production mode too.
      process.env.NODE_ENV = 'production'
    }

    if (!this.shouldQuit && !config.IS.PORTABLE) {
      // Prevent multiple instances of app from running at same time. New instances
      // signal this instance and quit. Note: This feature creates a lock file in
      // %APPDATA%\Roaming\WebTorrent so we do not do it for the Portable App since
      // we want to be "silent" as well as "portable".
      this.shouldQuit = app.makeSingleInstance(this.onAppOpen)
      if (this.shouldQuit) app.quit()
    }

    if (!this.shouldQuit) this.init()
  }

  init() {
    if (config.IS.PORTABLE) {
      // Put all user data into the "Venobo" folder
      app.setPath('userData', config.PATH.PORTABLE)
      // Put Electron crash files, etc. into the "Venobo\Temp" folder
      app.setPath('temp', path.join(config.PATH.PORTABLE, 'Temp'))
    }

    app.ipcReady = false // main window has finished loading and IPC is ready
    app.isQuitting = false

    async.parallel({
      appReady: (done) => app.on('ready', () => done(null)),
      state: (done) => State.load(done)
    }, this.onReady.bind(this))
  }

  onReady(err, res) {
    if (err) throw err

    this.isReady = true

    render(res.state, () => {
      // Initialize the menu before Main Window
      Menu.init()
      Main.init(res.state)
    })
    //WebTorrent.init()

    // To keep app startup fast, some code is delayed.
    setTimeout(this.delayedInit, config.DELAYED_INIT)

    // Report uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(err)
      const error = { message: err.message, stack: err.stack }
      Main.dispatch('uncaughtError', 'main', error)
    })

    ipc()

    app.once('will-finish-launching', crashReporter)
    app.once('ipcReady', () => console.timeEnd('init'))
    app.on('before-quit', (e) => {
      if (app.isQuitting) return

      app.isQuitting = true
      e.preventDefault()

      Main.dispatch('stateSaveImmediate') // try to save state on exit
      ipcMain.once('stateSaved', () => app.quit())

      setTimeout(() => {
        console.error('Saving state took too long. Quitting.')
        app.quit()
      }, 4000) // quit after 4 secs, at most
    })

    app.on('activate', () => {
      if (this.isReady) Main.show()
    })
  }

  delayedInit() {
    if (app.isQuitting) return

    announcement()
    updater()
  }

  onAppOpen(newArgv) {
    if (app.ipcReady) {
      log('Second app instance opened, but was prevented:', newArgv)
      Main.show()
    }
  }

}