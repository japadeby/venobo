import electron, { app, Menu } from 'electron'
import cp from 'child_process'

import config from '../config'
import Main from './window'

export default class Tray {

  static tray: Object

  static init () {
    if (process.platform === 'linux') {
      this.checkLinuxTraySupport(err => {
        if (!err) this.createTray()
      })
    } else if (process.platform === 'win32') {
      // Just create the tray icon
      this.createTray()
    }
    // Mac apps generally do not have menu bar icons
  }

  static hasTray () {
    return !!this.tray
  }

  static setWindowFocus (flag) {
    if (!this.tray) return
    this.updateTrayMenu()
  }

  /**
   * Check for libappindicator1 support before creating tray icon
   */
  static checkLinuxTraySupport (callback) {
    // Check that we're on Ubuntu (or another debian system) and that we have
    // libappindicator1. If Venobo was installed from the deb file, we should
    // always have it. If it was installed from the zip file, we might not.
    cp.exec('dpkg --get-selections libappindicator1', (err, stdout) => {
      if (err) return callback(err)

      if (stdout.endsWith('\tinstall\n')) {
        callback(null)
      } else {
        callback(new Error('debian package not installed'))
      }
    })
  }

  static createTray () {
    this.tray = new electron.Tray(this.getIconPath())
    // On Windows, left click opens the app, right click opens the context menu.
    // On Linux, any click (left or right) opens the context menu.
    this.tray.on('click', Main.win.show)
    // Show the tray context menu, and keep the available commands up to date
    this.updateTrayMenu()
  }

  static updateTrayMenu () {
    const contextMenu = Menu.buildFromTemplate(this.getMenuTemplate())
    this.tray.setContextMenu(contextMenu)
  }

  static getMenuTemplate () {
    return [
      this.getToggleItem(),
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]
  }

  static getToggleItem () {
    if (Main.win.isVisible()) {
      return {
        label: 'Hide to tray',
        click: () => Main.hide()
      }
    } else {
      return {
        label: `Show ${config.APP.NAME}`,
        click: () => Main.win.show()
      }
    }
  }

  static getIconPath () {
    return process.platform === 'win32'
      ? config.APP.ICON + '.ico'
      : config.APP.ICON + '.png'
  }
}
