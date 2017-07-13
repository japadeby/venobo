import {ipcRenderer as ipc} from 'electron'
import fs from 'fs'

import sound from './sound'
import * as console from './logger'
import State from './state'

import {searchToggle} from '../components/Search/redux/actions'
import {toggleTooltip} from '../components/Tooltip/redux/actions'

let handlers: Object
let state: Object
let store: Object
let stateHistory: Object
let savedHistory: Object
let shouldSaveHistory: Boolean

export function setupDispatchHandlers(_state, _store) {
  state = _state
  store = _store
  stateHistory = state.history
  savedHistory = state.saved.history
  shouldSaveHistory = state.saved.prefs.shouldSaveHistory

  handlers = {
    openUrl: (url) => ipc.send('openExternal', url),
    appQuit: () => ipc.send('appQuit'),
    exitSearchMount,
    hideTooltip,
    escapeBack,
    checkDownloadPath,
    toggleFullScreen: (setTo) => ipc.send('toggleFullScreen', setTo),
    setTitle: (title) => ipc.send('setTitle', title),
    setHistory,
    addStarred,
    delStarred,
    error: (err) => onError(err),
    stateSave: () => State.save(state),
    stateSaveImmediate: () => State.saveImmediate(state)
  }
}

const exitSearchMount = () => {
  if (!store.getState().search.enabled) {
    store.dispatch(searchToggle(false))
  }
}
const hideTooltip = () => {
  if (!store.getState().tooltip.enabled) {
    store.dispatch(toggleTooltip(false))
  }
}

function onError(err) {
  console.error(err.stack || err)
  sound('ERROR')
  state.errors.push({
    time: new Date().getTime(),
    message: err.message || err
  })
}

function addStarred(type, tmdbId) {
  const list = state.saved.starred[type]

  if (!list.includes(tmdbId)) {
    list.push(tmdbId)

    State.save(state)
  }
}

function delStarred(type, tmdbId) {
  const list = state.saved.starred[type]

  if (list.includes(tmdbId)) {
    list.splice(list.indexOf(tmdbId), 1)

    State.save(state)
  }
}

function setHistory(history) {
  if (shouldSaveHistory) {
    state.saved.history = Object.assign(history, savedHistory)
  } else {
    state.history = Object.assign(history, stateHistory)
  }
}

function back() {
  exitSearchMount()
  hideTooltip()

  if (shouldSaveHistory) {
    savedHistory.goBack()
  } else {
    stateHistory.goBack()
  }
}

function forward() {
  exitSearchMount()
  hideTooltip()

  if (shouldSaveHistory) {
    savedHistory.goForward()
  } else {
    stateHistory.goForward()
  }
}

// Quits modals, full screen, search mount, or goes back. Happens when the user hits ESC
function escapeBack () {
  if (state.modal) {
    dispatch('exitModal')
  } else if (state.search.enabled) {
    dispatch('exitSearchMount')
  } else if (state.window.isFullScreen) {
    dispatch('toggleFullScreen')
  } else if (!state.location.includes('player')) {
    dispatch('back')
  }
}

function checkDownloadPath() {
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

export default function dispatch(action, ...args) {
  if (action instanceof Object) {
    Object.keys(action).map(name => handleDispatch(name, action[name]))
  } else if (action instanceof Array) {
    action.map(name => handleDispatch(name))
  } else {
    handleDispatch(action, ...args)
  }

  const handleDispatch = (action, ...args) => {
    // Log dispatch calls, for debugging, but don't spam
    console.log('dispatch: %s %o', action, args)

    const handler = handlers[action]
    if (handler instanceof Function) {
      handler(...args)
    } else {
      console.error(`Missing dispatch handler: ${action}`)
    }
  }
}
