import {APP} from './config'
import {crashReporter} from 'electron'

export default function() {
  crashReporter.start({
    companyName: APP.NAME,
    productName: APP.NAME,
    submitURL: APP.CRASH_REPORTER
  })
}
