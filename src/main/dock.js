import {app, Menu} from 'electron'

// import dialog from './dialog'
import {log} from './log'

/**
 * Add a right-click menu to the dock icon. (Mac)
 */
export default function () {
  if (!app.dock) return
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  app.dock.setMenu(menu)
}

/**
 * Bounce the Downloads stack if `path` is inside the Downloads folder. (Mac)
 */
export function downloadFinished (e, path) {
  if (!app.dock) return
  log(`downloadFinished: ${path}`)
  app.dock.downloadFinished(path)
}

/**
 * Display a counter badge for the app. (Mac, Linux)
 */
export function setBadge (e, count) {
  if (process.platform === 'darwin' ||
      (process.platform === 'linux' && app.isUnityRunning())) {
    log(`setBadge: ${count}`)
    app.setBadgeCount(Number(count))
  }
}
