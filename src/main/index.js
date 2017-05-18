import {ipcMain, app} from 'electron'
import async from 'async'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import config from '../config'
import crashReporter from '../crash-reporter'
import {log} from './log'

import Menu from './menu'
import State from '../renderer/lib/state'
import {Main, WebTorrent} from './windows'
import squirrelWin32 from './squirrel-win32'
import announcement from './announcement'
// import dock from './dock'
import updater from './updater'
import Tray from './tray'
import ipc from './ipc'
// import dialog from './dialog'

console.time('init')

let shouldQuit = false
let argv = sliceArgv(process.argv)

// Start the app without showing the main window when auto launching on login
// (On Windows and Linux, we get a flag. On MacOS, we get special API.)
const hidden = argv.includes('--hidden') ||
  (process.platform === 'darwin' && app.getLoginItemSettings().wasOpenedAsHidden)

if (config.IS.PRODUCTION) {
  // When Electron is running in production mode (packaged app), then run React
  // in production mode too.
  process.env.NODE_ENV = 'production'
}

if (process.platform === 'win32') {
  shouldQuit = squirrelWin32(argv[0])
  argv = argv.filter(arg => !arg.includes('--squirrel'))
}

if (!shouldQuit && !config.IS.PORTABLE) {
  // Prevent multiple instances of app from running at same time. New instances
  // signal this instance and quit. Note: This feature creates a lock file in
  // %APPDATA%\Roaming\WebTorrent so we do not do it for the Portable App since
  // we want to be "silent" as well as "portable".
  shouldQuit = app.makeSingleInstance(onAppOpen)
  if (shouldQuit) app.quit()
}

if (!shouldQuit) init()

function init () {
  if (config.IS.PORTABLE) {
    // Put all user data into the "Venobo" folder
    app.setPath('userData', config.PATH.PORTABLE)
    // Put Electron crash files, etc. into the "Venobo\Temp" folder
    app.setPath('temp', path.join(config.PATH.PORTABLE, 'Temp'))
  }

  let isReady = false // app ready, windows can be created
  app.ipcReady = false // main window has finished loading and IPC is ready
  app.isQuitting = false

  async.parallel({
    appReady: (done) => app.on('ready', () => done(null)),
    state: (done) => State.load(done)
  }, onReady)

  function onReady (err, res) {
    if (err) throw err

    isReady = true

    // Initialize the menu before Main Window
    Menu.init()
    Main.init(res.state, {hidden: hidden})
    WebTorrent.init()

    // To keep app startup fast, some code is delayed.
    setTimeout(delayedInit, config.DELAYED_INIT)

    // Report uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(err)
      const error = {message: err.message, stack: err.stack}
      Main.dispatch('uncaughtError', 'main', error)
    })
  }

  ipc()

  app.once('will-finish-launching', crashReporter)

  app.once('ipcReady', () => {
    log('Command line args:', argv)
    processArgv(argv)
    console.timeEnd('init')
  })

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
    if (isReady) Main.show()
  })
}

function delayedInit () {
  if (app.isQuitting) return

  announcement()
  // dock.init()
  updater()

  if (process.platform !== 'darwin') {
    Tray.init()
  }
}

function onAppOpen (newArgv) {
  newArgv = sliceArgv(newArgv)

  if (app.ipcReady) {
    log('Second app instance opened, but was prevented:', newArgv)
    Main.show()

    processArgv(newArgv)
  } else {
    argv.push(...newArgv)
  }
}

// Remove leading args.
// Production: 1 arg, eg: /Applications/Venobo.app/Contents/MacOS/Venobo
// Development: 2 args, eg: electron .
// Test: 4 args, eg: electron -r .../mocks.js .
function sliceArgv (argv) {
  return argv.slice(config.IS.PRODUCTION ? 1
    : config.IS.DEV ? 4
    : 2)
}

function processArgv (argv) {
  let torrentIds = []
  argv.forEach(arg => {
    if (arg === '-n' || arg === '-o' || arg === '-u') {
      // Critical path: Only load the 'dialog' package if it is needed
      /* if(arg === '-n') {
        dialog.openSeedDirectory()
      } else if(arg === '-o') {
        dialog.openTorrentFile()
      } else if(arg === '-u') {
        dialog.openTorrentAddress()
      } */
    } else if (arg === '--hidden') {
      // Ignore hidden argument, already being handled
    } else if (arg.startsWith('-psn')) {
      // Ignore Mac launchd "process serial number" argument
      // Issue: https://github.com/feross/webtorrent-desktop/issues/214
    } else if (arg.startsWith('--')) {
      // Ignore Spectron flags
    } else if (arg === 'data:,') {
      // Ignore weird Spectron argument
    } else if (arg !== '.') {
      // Ignore '.' argument, which gets misinterpreted as a torrent id, when a
      // development copy of WebTorrent is started while a production version is
      // running.
      torrentIds.push(arg)
    }
  })
  if (torrentIds.length > 0) {
    Main.dispatch('onOpen', torrentIds)
  }
}
