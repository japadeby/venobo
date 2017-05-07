console.time('init')

import createGetter from 'fn-getter'
import debounce from 'debounce'
import {clipboard, remote, ipcRenderer} from 'electron'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom'

import crashReporter from '../crash-reporter'
import State from './lib/state'
import App from './pages/app'
import sound from './lib/sound'
import config from '../config'
//import TorrentPlayer from './lib/torrent-player'
import {setDispatch} from './lib/dispatcher'
import HTTP from './utils/http'
//import Telemetry from './lib/telemetry'

// Controllers
import PreferencesController from './controllers/preferences'
import HomeController from './controllers/home'
import TorrentController from './controllers/torrent'
//import StarredController from './controllers'

export default class Main {

  controllers: Object
  cast: Object
  state: Object
  app: Object

  constructor() {
    // Initialize crash reporter
    crashReporter()
    // Load state
    State.load((err, _state) => {
      if (err) return this.onError(err)
      this.onState(_state)
    })
    // Setup dispatcher
    setDispatch((...args) => {
      this.dispatch(...args)
    })
    // Setup HTTP
    HTTP.setup()
  }

  onState(_state) {
    // Make available for easier debugging
    const state = this.state = _state

    //const _telemetry = this.telemetry = new Telemetry(state)

    // Log uncaught JS errors
    /*window.addEventListener(
      'error', (e) => _telemetry.logUncaughtError('window', e), true
    )*/

    // Create controllers and lazyload them
    this.controllers = {
      home: createGetter(() => {
        return new HomeController(state, config)
      }),
      preferences: createGetter(() => {
        return new PreferencesController(state, config)
      }),
      /*watched: createGetter(() => {
        return new WatchedController(state, config)
      }),
      starred: createGetter(() => {
        return new StarredController(state, config)
      }),*/
      update: createGetter(() => {
        return new UpdateController(state, config)
      }),
      media: createGetter(() => {
        return require('./controllers/media')(state)
      }),
      torrent: createGetter(() => {
        return new TorrentController(state)
      }),
      /*playback: createGetter(() => {
        return require('./controllers/playback')(state, config, () => this.update())
      }),*/
      subtitles: createGetter(() => {
        return require('./controllers/subtitles')(state)
      }),
      /*movies: createGetter(() => {
        return require('./controllers/movies')(state, config)
      }),
      series: createGetter(() => {
        return require('./controllers/series')(state, config)
      })*/
    }

    // Add last page to location history
    state.location.go({
      url: state.saved.lastLocation,
      setup: (callback) => {
        state.window.title = `Welcome back to ${config.APP.NAME}`
        callback(null)
      }
    })

    // Restart everything we were torrenting last time the app ran
    //this.resumeTorrents()

    // Initialize ReactDOM
    this.renderMain()

    // Calling update() updates the UI given the current state
    // Do this at least once a second to give every file in every torrentSummary
    // a progress bar and to keep the cursor in sync when playing a video
    //setInterval(self.update, 1000)

    // Listen for messages from the main process
    this.setupIpc()

    const debouncedFullscreenToggle = debounce(function () {
      dispatch('toggleFullScreen')
    }, 1000, true)

    // ...focus and blur. Needed to show correct dock icon text ('badge') in OSX
    //window.addEventListener('focus', (e) => this.onFocus(e))
    //window.addEventListener('blur', (e) => this.onBlur(e))

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
    this.checkDownloadPath()

    // ...window visibility state.
    document.addEventListener('webkitvisibilitychange', () => this.onVisibilityChange())
    this.onVisibilityChange()

    this.lazyLoadCast()
  }

  lazyLoadCast() {
    let {cast, update, state} = this
    if (!cast) {
      cast = require('./lib/cast')
      cast.init(state, () => update())
    }
    return cast
  }

  // React loop:
  // 1. update() - recompute the virtual DOM, diff, apply to the real DOM
  // 2. event - might be a click or other DOM event, or something external
  // 3. dispatch - the event handler calls dispatch(), main.js sends it to a controller
  // 4. controller - the controller handles the event, changing the state object
  update() {
    //this.controllers.playback().showOrHidePlayerControls()
    this.app.setState(this.state)
    this.updateElectron()
  }

  // Some state changes can't be reflected in the DOM, instead we have to
  // tell the main process to update the window or OS integrations
  updateElectron() {
    const {state} = this

    if (state.window.title !== state.prev.title) {
      state.prev.title = state.window.title
      ipcRenderer.send('setTitle', state.window.title)
    }
    if (state.dock.progress.toFixed(2) !== state.prev.progress.toFixed(2)) {
      state.prev.progress = state.dock.progress
      ipcRenderer.send('setProgress', state.dock.progress)
    }
    if (state.dock.badge !== state.prev.badge) {
      state.prev.badge = state.dock.badge
      ipcRenderer.send('setBadge', state.dock.badge || 0)
    }
  }

  // Setup dispatch handlers
  dispatchHandlers(action) {
    const {state, controllers} = this

    const dispatchHandlers = {
      //ddTorrent: (id) => controllers.

      // Subtitles
      selectSubtitle: (i) => controllers.subtitles().selectSubtitle(i),

      // Preferences
      updatePreferences: (key, value) => controllers.preferences().update(key, value),
      checkDownloadPath: () => this.checkDownloadPath(),
      setIso: (iso2, iso4) => this.renderMain(iso2, iso4),

      // Updates
      updateAvailable: (version) => controllers.update().updateAvailable(version),
      skipVersion: (version) => controllers.update().skipVersion(version),

      // State locations
      back: () => state.location.back(),
      forward: () => state.location.forward(),
      cancel: () => state.location.cancel(),

      // Controlling the window
      setDimensions: this.setDimensions,
      toggleFullScreen: (setTo) => ipcRenderer.send('toggleFullScreen', setTo),
      setTitle: (title) => { state.window.title = title },

      // Pages
      preferences: () => controllers.preferences().show(),
      home: () => controllers.home().show(),
      //starred: () => controllers.starred().show(),

      // Everything else
      //uncaughtError: (proc, err) => telemetry.logUncaughtError(proc, err),
      error: this.onError,
      stateSave: () => State.save(state),
      stateSaveImmediate: () => State.saveImmediate(state),
      stateSetLastLocation: () => {
        state.saved.lastLocation = state.location.url()
      },
      update: () => {} // No-op, just trigger an update
    }

    return dispatchHandlers[action]
  }

  dispatch(action, ...args) {
    // Log dispatch calls, for debugging, but don't spam
    if (!['mediaMouseMoved', 'mediaTimeUpdate', 'update'].includes(action)) {
      console.log('dispatch: %s %o', action, args)
    }

    const handler = this.dispatchHandlers(action)
    if (handler) {
      handler(...args)
    } else {
      console.error(`Missing dispatch handler: ${action}`)
    }

    // Update the virtual DOM, unless it's just a mouse move event
    if (action !== 'mediaMouseMoved' /*|| this.controllers.playback().showOrHidePlayerControls()*/) {
      this.update()
    }
  }

  renderMain(iso2, iso4) {
    const {state} = this
    const {prefs} = state.saved

    if (typeof iso2 !== 'undefined' && typeof iso4 !== 'undefined') {
      prefs.iso2 = iso2
      prefs.iso4 = iso4

      State.save(state)
    }

    const locale = iso2 || prefs.iso2

    HTTP.get(`${config.APP.API}/translation/${locale}`, (translation) => {
      this.app = ReactDOM.render(
        <App state={state} translation={translation} locale={locale} />,
        document.querySelector('#content-wrapper')
      )
    })
  }

  setupIpc() {
    const {controllers, telemetry, state} = this

    const ipc = ipcRenderer

    ipc.on('log', (e, ...args) => console.log(...args))
    ipc.on('error', (e, ...args) => console.error(...args))

    ipc.on('dispatch', (e, ...args) => this.dispatch(...args))

    //ipc.on('fullscreenChanged', (e, ...args) => this.onFullscreenChanged(e, ...args))
    //ipc.on('windowBoundsChanged', (e, ...args) => this.onWindowBoundsChanged(e, ...args))

    const tc = controllers.torrent()
    ipc.on('wt-infohash', (e, ...args) => tc.torrentInfoHash(...args))
    ipc.on('wt-metadata', (e, ...args) => tc.torrentMetadata(...args))
    ipc.on('wt-done', (e, ...args) => tc.torrentDone(...args))
    ipc.on('wt-done', () => controllers.torrentList().resumePausedTorrents())
    ipc.on('wt-warning', (e, ...args) => tc.torrentWarning(...args))
    ipc.on('wt-error', (e, ...args) => tc.torrentError(...args))

    ipc.on('wt-progress', (e, ...args) => tc.torrentProgress(...args))
    ipc.on('wt-file-modtimes', (e, ...args) => tc.torrentFileModtimes(...args))
    ipc.on('wt-file-saved', (e, ...args) => tc.torrentFileSaved(...args))
    ipc.on('wt-poster', (e, ...args) => tc.torrentPosterSaved(...args))
    ipc.on('wt-audio-metadata', (e, ...args) => tc.torrentAudioMetadata(...args))
    ipc.on('wt-server-running', (e, ...args) => tc.torrentServerRunning(...args))

    //ipc.on('wt-uncaught-error', (e, err) => telemetry.logUncaughtError('webtorrent', err))

    ipc.send('ipcReady')

    State.on('stateSaved', () => ipc.send('stateSaved'))
  }

  // Quits modals, full screen, or goes back. Happens when the user hits ESC
  escapeBack () {
    const {dispatch, state} = this

    if (state.modal) {
      dispatch('exitModal')
    } else if (state.window.isFullScreen) {
      dispatch('toggleFullScreen')
    } else {
      dispatch('back')
    }
  }

  // Starts all torrents that aren't paused on program startup
  resumeTorrents () {
    const {state, controllers} = this

    state.saved.torrents
      .map(torrentSummary => {
        // Torrent keys are ephemeral, reassigned each time the app runs.
        // On startup, give all torrents a key, even the ones that are paused.
        torrentSummary.torrentKey = state.nextTorrentKey++
        return torrentSummary
      })
      .filter(s => s.status !== 'paused')
      .forEach(s => controllers.torrentList().startTorrentingSummary(s.torrentKey))
  }

  onError(err) {
    const {update, state} = this

    console.error(err.stack || err)
    sound('ERROR')
    state.errors.push({
      time: new Date().getTime(),
      message: err.message || err
    })

    update()
  }

  onFocus(e) {
    const {state, update} = this

    state.window.isFocused = true
    state.dock.badge = 0
    update()
  }

  onBlur() {
    const {state, update} = this

    state.window.isFocused = false
    update()
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

    this.update()
  }

  onWindowBoundsChanged(e, newBounds) {
    const {state, dispatch} = this

    if (state.location.url() !== 'player') {
      state.saved.bounds = newBounds
      dispatch('stateSave')
    }
  }

  checkDownloadPath() {
    const {state} = this

    fs.stat(state.saved.prefs.downloadPath, (err, stat) => {
      if (err) {
        state.downloadPathStatus = 'missing'
        return console.error(err)
      }

      if (stat.isDirectory()) {
        state.downloadPathStatus = 'ok'
      } else {
        state.downloadPathStatus = 'missing'
      }
    })
  }

}
