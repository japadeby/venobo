import {dispatch} from '../lib/dispatcher'
import {ipcRenderer} from 'electron'

// Controls the Preferences screen
export default class HomeController {

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
      url: 'home',
      setup: function (callback) {
        // initialize preferences
        state.window.title = 'Home'
        /*state.unsaved = Object.assign(state.unsaved || {}, {
          prefs: Object.assign({}, state.saved.prefs)
        })*/
        ipcRenderer.send('setAllowNav', false)
        callback()
      },
      destroy: () => {
        ipcRenderer.send('setAllowNav', true)
        //this.save()
      }
    })
  }
}
