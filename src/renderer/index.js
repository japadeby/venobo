console.time('init')

import { clipboard, remote, ipcRenderer } from 'electron'

//import {error, log} from './lib/logger'
//import dispatch, { setupDispatchHandlers } from './lib/dispatcher'
import MetadataAdapter from './api/metadata/adapter'
import TorrentAdapter from './api/torrent/adapter'
import crashReporter from '../crashReporter'
import createStore from './redux/create'
//import State from './lib/state'
import config from '../config'
import { Http, sound } from './lib'
import createApp from './app'

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

    this.onState(window.__data)
    //State.load(this.onState)
  }

  async onState(state) {
    //if (err) throw new Error(err)
    // Make available for easier debugging
    this.state = state

    //const _telemetry = this.telemetry = new Telemetry(state)

    // Log uncaught JS errors
    /*window.addEventListener(
      'error', (e) => _telemetry.logUncaughtError('window', e), true
    )*/

    // Setup dispatch handlers
    //setupDispatchHandlers(state, store)

    // ...focus and blur. Needed to show correct dock icon text ('badge') in OSX
    window.addEventListener('focus', (e) => this.onFocus(e))
    window.addEventListener('blur', (e) => this.onBlur(e))

    if (remote.getCurrentWindow().isVisible()) {
      sound('STARTUP')
    }

    // To keep app startup fast, some code is delayed.
    window.setTimeout(() => this.delayedInit(), config.DELAYED_INIT)

    await TorrentAdapter.checkProviders()
    MetadataAdapter.setup(state)

    // Create Redux store
    const store = createStore({ data: state, history: state.saved.history })

    // Setup API HTTP
    this.api = new Http({ baseURL: config.APP.API })

    // Listen for messages from the main process
    this.setupIpc(store)

    this.setupApp(history, state, store)

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

  setupApp = (history, state, store) => {
    const { iso2 } = state.saved.prefs
    const data = { state, store, history }

    this.api.fetchCache(`translation/${iso2}`)
      .then(translations => createApp({ ...data, translations }))
      .catch(err => {
        dispatch('error', err)
        const path = require('path')

        const translations = require(path.join(config.PATH.TRANSLATIONS, iso2))

        createApp({ ...data, translations })
      })
  }

  setupIpc(store) {
    const ipc = ipcRenderer

    ipc.on('log', (e, ...args) => console.log(...args))
    ipc.on('error', (e, ...args) => console.error(...args))

    ipc.on('dispatch', (e, method, ...args) => store.dispatch({ type: '@@electron/IPC', method, args }))

    //ipc.on('fullscreenChanged', (e, ...args) => this.onFullscreenChanged(e, ...args))
    //ipc.on('windowBoundsChanged', (e, ...args) => this.onWindowBoundsChanged(e, ...args))

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
