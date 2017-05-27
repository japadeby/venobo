import {ipcRenderer} from 'electron'
import React from 'react'

import {dispatch} from '../../lib/dispatcher'

import {ContentSection} from '../../components/items'
import PreferencesPage from '../preferences'

// Controls the Preferences page
export default class PreferencesController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMounted: false
    }
  }

  componentDidMount() {
    const {props} = this

    // initialize preferences
    //props.state.window.title = 'Preferences'
    props.state.unsaved = Object.assign(props.state.unsaved || {}, {
      prefs: Object.assign({}, props.state.saved.prefs)
    })
    ipcRenderer.send('setAllowNav', false)

    dispatch('setTitle', 'Preferences')

    this.setState({
      isMounted: true
    })
  }

  componentWillUnmount() {
    ipcRenderer.send('setAllowNav', true)
    this.save()
  }

  render() {
    return (
      <ContentSection>
        <PreferencesPage {...this.props} />
      </ContentSection>
    )
  }

  // Updates a single property in the UNSAVED prefs
  // For example: updatePreferences('foo.bar', 'baz')
  // Call save() to save to config.json
  update(property, value) {
    const path = property.split('.')
    let obj = this.props.state.unsaved.prefs
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof obj[path[i]] === 'undefined') {
        obj[path[i]] = {}
      }
      obj = obj[path[i]]
    }
    obj[path[i]] = value
  }

  // All unsaved prefs take effect atomically, and are saved to config.json
  save() {
    const {unsaved, saved} = this.props.state

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
