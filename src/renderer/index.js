console.time('init')

import debounce from 'debounce'
import {clipboard, remote, ipcRenderer} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'

//import {error, log} from './lib/logger'
import MetadataAdapter from './api/metadata/adapter'
import dispatch, {setupDispatchHandlers} from './lib/dispatcher'
import crashReporter from '../crashReporter'
import State from './lib/state'
import createApp from './app'
import createStore from './redux/store'
import sound from './lib/sound'
import config from '../config'
import HTTP from './lib/http'

class Renderer {

  store: Object
  cast: Object
  state: Object
  api: Object
  dispatchHandlers: Object

  constructor() {
    // Initialize crash reporter
    crashReporter()
    // Load state
    State.load((err, state) => {
      if (err) throw new Error(err)
      this.onState(state)
    })
  }

  onState(state) {
    // Make available for easier debugging
    this.state = state

    //const _telemetry = this.telemetry = new Telemetry(state)

    // Log uncaught JS errors
    /*window.addEventListener(
      'error', (e) => _telemetry.logUncaughtError('window', e), true
    )*/

    // Create Redux store
    this.store = createStore(state)

    // Setup dispatch handlers
    setupDispatchHandlers(state, this.store)

    // Setup MetadataAdapter
    MetadataAdapter.setup(state)

    // Setup API HTTP
    this.api = new HTTP({ baseURL: config.APP.API })

    // Setup App
    this.setupApp()

    // Listen for messages from the main process
    this.setupIpc()

    // ...focus and blur. Needed to show correct dock icon text ('badge') in OSX
    window.addEventListener('focus', (e) => this.onFocus(e))
    window.addEventListener('blur', (e) => this.onBlur(e))

    if (remote.getCurrentWindow().isVisible()) {
      sound('STARTUP')
    }

    // To keep app startup fast, some code is delayed.
    window.setTimeout(() => this.delayedInit(), config.DELAYED_INIT)

    // Done! Ideally we want to get here < 700ms after the user clicks the app
    console.timeEnd('init')
  }

  // Runs a few seconds after the app loads, to avoid slowing down startup time
  delayedInit() {
    //const {telemetry} = this

    //telemetry.send(this.state)

    // Send Telemetry data every 6 hours, for users who keep the app running
    // for extended periods of time
    //setInterval(() => telemetry.send(state), 6 * 3600 * 1000)

    // Warn if the download dir is gone, eg b/c an external drive is unplugged
    dispatch('checkDownloadPath')

    // ...window visibility state.
    document.addEventListener('webkitvisibilitychange', () => this.onVisibilityChange())
    this.onVisibilityChange()

    this.lazyLoadCast()
  }

  lazyLoadCast() {
    let {cast, update, state} = this
    if (!cast) {
      cast = require('./lib/cast')
      cast.init(state)
    }
    return cast
  }

  // Some state changes can't be reflected in the DOM, instead we have to
  // tell the main process to update the window or OS integrations
  /*updateElectron() {
    const {window, prev, dock} = this.state

    if (window.title !== prev.title && window.title !== null) {
      prev.title = window.title
      ipcRenderer.send('setTitle', window.title)
    }
    if (dock.progress.toFixed(2) !== prev.progress.toFixed(2)) {
      prev.progress = dock.progress
      ipcRenderer.send('setProgress', dock.progress)
    }
    if (dock.badge !== prev.badge) {
      prev.badge = dock.badge
      ipcRenderer.send('setBadge', dock.badge || 0)
    }
  }*/

  setupApp() {
    const { state, store, api } = this
    const { iso2 } = state.saved.prefs

    api.fetchCache(`translation/${iso2}`)
      .then(translation => createApp(store, state, translation))
      .catch(err => {
        dispatch('error', err)
        const path = require('path')
        const fs = require('fs')

        let translation
        try {
          let translationFile = fs.readFileSync(path.join(config.PATH.TRANSLATIONS, `${iso2}.json`), 'utf-8')
          translation = JSON.parse(translationFile)
        } catch(e) {
          throw e
        }

        createApp(store, state, translation)
      })
  }

  setupIpc() {
    const ipc = ipcRenderer

    ipc.on('log', (e, ...args) => console.log(...args))
    ipc.on('error', (e, ...args) => console.error(...args))

    ipc.on('dispatch', (e, ...args) => dispatch(...args))

    ipc.on('fullscreenChanged', (e, ...args) => this.onFullscreenChanged(e, ...args))
    ipc.on('windowBoundsChanged', (e, ...args) => this.onWindowBoundsChanged(e, ...args))

    ipc.send('ipcReady')

    State.on('stateSaved', () => ipc.send('stateSaved'))
  }

  onFocus(e) {
    const {state} = this

    state.window.isFocused = true
    state.dock.badge = 0
    //this.update()
  }

  onBlur() {
    this.state.window.isFocused = false
    //this.update()
  }

  onVisibilityChange() {
    this.state.window.isVisible = !document.webkitHidden
  }

  onFullscreenChanged(e, isFullScreen) {
    const {state} = this

    state.window.isFullScreen = isFullScreen
    if (!isFullScreen) {
      // Aspect ratio gets reset in fullscreen mode, so restore it (Mac)
      ipcRenderer.send('setAspectRatio', state.playing.aspectRatio)
    }

    //this.update()
  }

  onWindowBoundsChanged(e, newBounds) {
    const {state, dispatch} = this

    if (state.location.pathname !== '/player') {
      state.saved.bounds = newBounds
      dispatch('stateSave')
    }
  }

}

export default new Renderer
