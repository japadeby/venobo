console.time('init')

import createGetter from 'fn-getter'
import debounce from 'debounce'
import {clipboard, remote, ipcRenderer} from 'electron'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom'

import crashReporter from '../crash-reporter'
import State from './lib/state'
import createApp from './app'
import createStore from './redux/create'
import sound from './lib/sound'
import config from '../config'
import HTTP from './lib/http'

export default class Main {

  store: Object
  cast: Object
  state: Object
  dispatchHandlers: Object

  constructor() {
    // Initialize crash reporter
    crashReporter()
    // Load state
    State.load((err, state) => {
      if (err) return this.onError(err)
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
    this.setupDispatchHandlers()

    // Set HTTP state
    HTTP.setup(state)

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
      cast.init(state)
    }
    return cast
  }

  // Some state changes can't be reflected in the DOM, instead we have to
  // tell the main process to update the window or OS integrations
  updateElectron() {
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
  }

  // Setup dispatch handlers
  setupDispatchHandlers() {
    const { state, controllers } = this
    const stateHistory = state.history
    const savedHistory = state.saved.history
    const { shouldSaveHistory } = state.saved.prefs

    this.dispatchHandlers = {
      //torrents
      /*stopTorrenting: () => {
        ipcRenderer.send('wt-stop-server')
        ipcRenderer.send('wt-stop-torrenting', state.playing.infoHash)
      },
      addTorrent: (magnet) => controllers.torrent().addTorrent(magnet),
      pauseAllTorrents: () => controllers.torrent().pauseAllTorrents(),
      resumeAllTorrents: () => controllers.torrent().resumeAllTorrents(),
      resumePausedTorrents: () => controllers.torrent().resumePausedTorrents(),

      // playback
      closePlayer: () => controllers.playback().closePlayer(),
      setMediaTag: (mediaTag) => controllers.playback().setMediaTag(mediaTag),
      playFile: (infoHash, index) => controllers.playback().playFile(infoHash, index),
      playPause: () => controllers.playback().playPause(),
      nextTrack: () => controllers.playback().nextTrack(),
      previousTrack: () => controllers.playback().previousTrack(),
      skip: (time) => controllers.playback().skip(time),
      skipTo: (time) => controllers.playback().skipTo(time),
      changePlaybackRate: (dir) => controllers.playback().changePlaybackRate(dir),
      changeVolume: (delta) => controllers.playback().changeVolume(delta),
      setVolume: (vol) => controllers.playback().setVolume(vol),*/

      appQuit: () => ipcRenderer.send('appQuit'),
      //ddTorrent: (id) => controllers.

      // Subtitles
      /*selectSubtitle: (i) => controllers.subtitles().selectSubtitle(i),

      // Preferences
      updatePreferences: (key, value) => controllers.preferences().update(key, value),*/
      checkDownloadPath: () => this.checkDownloadPath(),

      // Updates
      /*updateAvailable: (version) => controllers.update().updateAvailable(version),
      skipVersion: (version) => controllers.update().skipVersion(version),*/

      // State locations
      exitSearchMount: () => this.exitSearchMount(),
      hideTooltip: () => this.hideTooltip(),
      escapeBack: () => this.escapeBack(),
      back: () => {
        this.exitSearchMount()
        this.hideTooltip()

        if (shouldSaveHistory) {
          savedHistory.goBack()
        } else {
          stateHistory.goBack()
        }
      },
      forward: () => {
        this.exitSearchMount()
        this.hideTooltip()

        if (shouldSaveHistory) {
          savedHistory.goForward()
        } else {
          stateHistory.goForward()
        }
      },
      openUrl: (url) => ipcRenderer.send('openExternal', url),

      // Controlling the window
      //setDimensions: this.setDimensions,
      toggleFullScreen: (setTo) => ipcRenderer.send('toggleFullScreen', setTo),
      setTitle: (title) => { state.window.title = title },
      setHistory : (history) => {
        if (shouldSaveHistory) {
          state.saved.history = Object.assign(history, savedHistory)
        } else {
          state.history = Object.assign(history, stateHistory)
        }
      },
      setLocation: (location) => { state.location = location },
      addStarred: (type, tmdbId) => {
        const list = state.saved.starred[type]

        if (!list.includes(tmdbId)) {
          list.push(tmdbId)

          State.save(state)
        }
      },
      delStarred: (type, tmdbId) => {
        const list = state.saved.starred[type]

        if (list.includes(tmdbId)) {
          list.splice(list.indexOf(tmdbId), 1)

          State.save(state)
        }
      },

      // Everything else
      //uncaughtError: (proc, err) => telemetry.logUncaughtError(proc, err),
      error: (err) => this.onError(err),
      stateSave: () => State.save(state),
      stateSaveImmediate: () => State.saveImmediate(state)
    }
  }

  dispatch(action, ...args) {
    // Log dispatch calls, for debugging, but don't spam
    console.log('dispatch: %s %o', action, args)

    const handler = this.dispatchHandlers[action]
    if (handler instanceof Function) {
      handler(...args)
    } else {
      console.error(`Missing dispatch handler: ${action}`)
    }
  }

  setupApp() {
    const { iso2 } = this.state.saved.prefs

    HTTP.fetchCache(`${config.APP.API}/translation/${iso2}`)
      .then(translation => createApp(this.store, translation))
      .catch(err => this.dispatch('error', err))
  }

  setupIpc() {
    const {controllers, telemetry, state} = this

    const ipc = ipcRenderer

    ipc.on('log', (e, ...args) => console.log(...args))
    ipc.on('error', (e, ...args) => console.error(...args))

    ipc.on('dispatch', (e, ...args) => this.dispatch(...args))

    ipc.on('fullscreenChanged', (e, ...args) => this.onFullscreenChanged(e, ...args))
    ipc.on('windowBoundsChanged', (e, ...args) => this.onWindowBoundsChanged(e, ...args))

    ipc.send('ipcReady')

    State.on('stateSaved', () => ipc.send('stateSaved'))
  }

  hideTooltip() {
    const {state} = this

    if (!state.tooltip.enabled) return
    state.tooltip.toggle()
  }

  exitSearchMount() {
    const {state} = this

    if (!state.search.enabled) return
    state.search.toggle()
  }

  // Quits modals, full screen, or goes back. Happens when the user hits ESC
  escapeBack () {
    const {state} = this

    if (state.modal) {
      this.dispatch('exitModal')
    } else if (state.search.enabled) {
      this.dispatch('exitSearchMount')
    } else if (state.window.isFullScreen) {
      this.dispatch('toggleFullScreen')
    } else if (!state.location.includes('player')) {
      this.dispatch('back')
    }
  }

  onError(err) {
    const {state} = this

    console.error(err.stack || err)
    sound('ERROR')
    state.errors.push({
      time: new Date().getTime(),
      message: err.message || err
    })

    //this.update()
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
