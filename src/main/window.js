import { app, BrowserWindow } from 'electron'
import debounce from 'debounce'

import { WINDOW, APP, IS } from '../config'
import { log } from './log'
import Menu from './menu'
import Tray from './tray'

export default class Main {

  static win: Object

  static init(state, options) {
    if (this.win) return this.win.show()

    const win = this.win = new BrowserWindow({
      backgroundThrottling: false, // do not throttle animations/timers when page is background
      icon: this.getIconPath(), // Window icon (Windows, Linux)
      minHeight: WINDOW.MIN.HEIGHT,
      minWidth: WINDOW.MIN.WIDTH,
      show: false,
      title: APP.NAME,
      titleBarStyle: 'hidden-inset', // Hide title bar (Mac)
      useContentSize: true, // Specify web page size without OS chrome
    })

    win.loadURL(WINDOW.INDEX)

    win.once('ready-to-show', win.show)

    win.webContents.on('dom-ready', () => {
      Menu.onToggleFullScreen(win.isFullScreen())
    })

    /*win.webContents.on('will-navigate', (e, url) => {
      // Prevent drag-and-drop from navigating the Electron window, which can happen
      // before our drag-and-drop handlers have been initialized.
      e.preventDefault()
    })*/

    win.on('blur', this.onWindowBlur)
    win.on('focus', this.onWindowFocus)

    win.on('hide', this.onWindowBlur)
    win.on('show', this.onWindowFocus)

    win.on('enter-full-screen', function () {
      Menu.onToggleFullScreen(true)
      win.send('fullscreenChanged', true)
      win.setMenuBarVisibility(false)
    })

    win.on('leave-full-screen', () => {
      Menu.onToggleFullScreen(false)
      win.send('fullscreenChanged', false)
      win.setMenuBarVisibility(true)
    })

    /*win.on('move', debounce(e => {
      win.send('windowBoundsChanged', e.sender.getBounds())
    }, 1000))*/

    /*win.on('resize', debounce(e => {
      win.send('windowBoundsChanged', e.sender.getBounds())
    }, 1000))*/

    win.on('close', (e) => {
      if (!Tray.hasTray()) {
        app.quit()
        return
      }

      if(!app.isQuitting) {
        e.preventDefault()
        this.hide()
      }
    })
  }

  static setProgress(progress) {
    if (!this.win) return
    this.win.setProgressBar(progress)
  }

  static setTitle(title) {
    if (!this.win || title == null) return
    this.win.setTitle(title)
  }

  static show() {
    if (!this.win) return
    this.win.show()
  }

  static dispatch(...args) {
    this.win.send('dispatch', ...args)
  }

  static hide() {
    if(!this.win) return
    this.dispatch('backToList')
    this.win.hide()
  }

  static toggleDevTools() {
    let win = this.win
    if (!win) return

    log('toggleDevTools')
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools()
    } else {
      win.webContents.openDevTools({ detach: true })
    }
  }

  static toggleFullScreen(flag) {
    const win = this.win
    if (!win || !win.isVisible()) return

    if (flag == null) flag = !win.isFullScreen()

    log(`toggleFullScreen ${flag}`)

    // Fullscreen and aspect ratio do not play well together. (Mac)
    if (flag) win.setAspectRatio(0)

    win.setFullScreen(flag)
  }

  static setAspectRatio(aspectRatio) {
    if (!this.win) return
    this.win.setAspectRatio(aspectRatio)
  }

  static onWindowBlur() {
    Menu.setWindowFocus(false)

    if (Tray.hasTray())
      Tray.setWindowFocus(false)
  }

  static onWindowFocus() {
    Menu.setWindowFocus(true)

    if (Tray.hasTray())
      Tray.setWindowFocus(true)
  }

  static getIconPath() {
    return process.platform === 'win32'
      ? APP.ICON + '.ico'
      : APP.ICON + '.png'
  }

  static toggleAlwaysOnTop(flag) {
    if (!this.win) return
    if (flag === null)
      flag = !this.win.isAlwaysOnTop()
    log(`toggleAlwaysOnTop ${flag}`)
    this.win.setAlwaysOnTop(flag)
    Menu.onToggleAlwaysOnTop(flag)
  }

}
