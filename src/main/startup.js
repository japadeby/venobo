import config from '../config'
import AutoLaunch from 'auto-launch'
import { app } from 'electron'

// On Mac, work around a bug in auto-launch where it opens a Terminal window
// See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
const appPath = process.platform === 'darwin'
  ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
  : undefined // Use the default

const appLauncher = new AutoLaunch({
  name: config.APP.NAME,
  path: appPath,
  isHidden: true
})

export function install () {
  return appLauncher
    .isEnabled()
    .then(enabled => {
      if (!enabled) return appLauncher.enable()
    })
}

export function uninstall () {
  return appLauncher
    .isEnabled()
    .then(enabled => {
      if (enabled) return appLauncher.disable()
    })
}
