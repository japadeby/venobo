import {app, BrowserWindow} from 'electron'
import config from '../../config'

export default class WebTorrent {

  static win: Object

  static init() {
    let win = this.win = new BrowserWindow({
      backgroundColor: '#1E1E1E',
      backgroundThrottling: false, // do not throttle animations/timers when page is background
      center: true,
      fullscreen: false,
      fullscreenable: false,
      height: 150,
      maximizable: false,
      minimizable: false,
      resizable: false,
      show: false,
      skipTaskbar: true,
      title: 'webtorrent-hidden-window',
      useContentSize: true,
      width: 150
    })

    win.loadURL(config.WINDOW.INDEX.WEBTORRENT)
  }

  static toggleDevTools() {
    const win = this.win
    if(!win) return
    if(win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools()
      win.hide()
    } else {
      win.webContents.openDevTools({ detach: true })
    }
  }

}
