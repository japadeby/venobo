import { dialog } from 'electron'
import axios from 'axios'

import config from '../config'
import { error } from './log'

const ANNOUNCEMENT_URL = `${config.APP.ANNOUNCEMENT}/${config.APP.VERSION}/${process.platform}`

/**
 * In certain situations, the Venobo team may need to show an announcement to
 * all Venobo Desktop users. For example: a security notice, or an update
 * notification (if the auto-updater stops working).
 */
export default function () {
  axios.get(ANNOUNCEMENT_URL)
    .then(onResponse)
    .catch(error)
}

function onResponse (res) {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['OK'],
    title: 'Venobo Announcement',
    message: '123',
    detail: '123'
  }, noop)
}

function noop () {}
