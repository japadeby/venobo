import {dispatch} from '../lib/dispatcher'
import {ipcRenderer} from 'electron'

// Controls the Preferences screen
export default class PreferencesController {

  state: Object
  config: Object

  constructor(state, config) {
    this.state = state
    this.config = config
  }

  // Goes to the Preferences screen
  show() {
    const {state} = this

    state.location.go({
      url: 'preferences',
      setup: function (callback) {
        // initialize preferences
        state.window.title = 'Preferences'
        state.unsaved = Object.assign(state.unsaved || {}, {
          prefs: Object.assign({}, state.saved.prefs)
        })
        ipcRenderer.send('setAllowNav', false)
        callback()
      },
      destroy: () => {
        ipcRenderer.send('setAllowNav', true)
        this.save()
      }
    })
  }

  // Updates a single property in the UNSAVED prefs
  // For example: updatePreferences('foo.bar', 'baz')
  // Call save() to save to config.json
  update(property, value) {
    const path = property.split('.')
    let obj = this.state.unsaved.prefs
    let i
    for (i = 0; i < path.length - 1; i++) {
      if (typeof obj[path[i]] === 'undefined') {
        obj[path[i]] = {}
      }
      obj = obj[path[i]]
    }
    obj[path[i]] = value
  }

  // All unsaved prefs take effect atomically, and are saved to config.json
  save () {
    const {unsaved, saved} = this.state

    if (unsaved.prefs.isFileHandler !== saved.prefs.isFileHandler) {
      ipcRenderer.send('setDefaultFileHandler', unsaved.prefs.isFileHandler)
    }
    if (unsaved.prefs.startup !== saved.prefs.startup) {
      ipcRenderer.send('setStartup', unsaved.prefs.startup)
    }
    saved.prefs = Object.assign(saved.prefs || {}, unsaved.prefs)

    dispatch('stateSaveImmediate')
    dispatch('checkDownloadPath')
  }
}
