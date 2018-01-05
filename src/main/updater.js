import { autoUpdater } from 'electron'
import axios from 'axios'

import config from '../config'
import { log, error } from './log'
import Main from './window'

const AUTO_UPDATE_URL = config.APP.URL +
  '/' + config.APP.VERSION +
  '/' + process.platform +
  '/' + config.OS_SYSARCH

export default function () {
  if (process.platform === 'linux') {
    initLinux()
  } else {
    initDarwinWin32()
  }
}

// The Electron auto-updater does not support Linux yet, so manually check for
// updates and show the user a modal notification.
function initLinux () {
  axios.get(AUTO_UPDATE_URL)
    .then(onResponse)
    .catch(error)
}

function onResponse (res) {
  Main.dispatch('updateAvailable', res.data.version)
}

function initDarwinWin32 () {
  autoUpdater.on(
    'error',
    (err) => error(`Update error: ${err.message}`)
  )

  autoUpdater.on(
    'checking-for-update',
    () => log('Checking for update')
  )

  autoUpdater.on(
    'update-available',
    () => log('Update available')
  )

  autoUpdater.on(
    'update-not-available',
    () => log('No update available')
  )

  autoUpdater.on(
    'update-downloaded',
    (e, notes, name, date, url) => log(`Update downloaded: ${name}: ${url}`)
  )

  autoUpdater.setFeedURL(AUTO_UPDATE_URL)
  autoUpdater.checkForUpdates()
}
