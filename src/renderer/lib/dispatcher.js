<<<<<<< HEAD
const dispatchers = {}
let _dispatch = function () {}

export function setDispatch (dispatch) {
  _dispatch = dispatch
}

export function dispatch (...args) {
  _dispatch(...args)
}

// Most DOM event handlers are trivial functions like `() => dispatch(<args>)`.
// For these, `dispatcher(<args>)` is preferred because it memoizes the handler
// function. This prevents React from updating the listener functions on
// each update().
export function dispatcher (...args) {
  const str = JSON.stringify(args)
  let handler = dispatchers[str]
  if (!handler) {
    handler = dispatchers[str] = function (e) {
      // Do not propagate click to elements below the button
      e.stopPropagation()

      if (e.currentTarget.classList.contains('disabled')) {
        // Ignore clicks on disabled elements
        return
      }

      dispatch(...args)
    }
  }
  return handler
=======
import { ipcRenderer as ipc } from 'electron'
import fs from 'fs'

import sound from './sound'
//import * as console from './logger'
import State from './state'

import { searchToggle}  from '../components/Search/redux/actions'
import { dismissTooltip } from '../components/Tooltip/redux/actions'

let state: Object
let store: Object
let stateHistory: Object
let savedHistory: Object
let shouldSaveHistory: Boolean

const handlers = {
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

export function setupDispatchHandlers(_state, _store) {
  state = _state
  store = _store
  stateHistory = state.history
  savedHistory = state.saved.history
  shouldSaveHistory = state.saved.prefs.shouldSaveHistory
}

function exitSearchMount() {
  if (store.getState().search.active) {
    store.dispatch(searchToggle(false))
  }
}

function hideTooltip() {
  if (store.getState().tooltip.enabled) {
    store.dispatch(dismissTooltip())
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
  /*if (action instanceof Object) {
    Object.keys(action).map(
      name => handleDispatch(name, action[name])
    )
  } else if (action instanceof Array) {
    action.map(name => handleDispatch(name))
  } else {
    handleDispatch(action, ...args)
  }

  const handleDispatch = (action, ...args) => {*/
    // Log dispatch calls, for debugging, but don't spam
    console.log('dispatch: %s %o', action, args)

    console.log(store)

    const handler = handlers[action]
    if (handler instanceof Function) {
      handler(...args)
    } else {
      console.error(`Missing dispatch handler: ${action}`)
    }
  //}
>>>>>>> redux-dev
}
