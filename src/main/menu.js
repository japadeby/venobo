import electron, {app, Menu as appMenu} from 'electron'

import config from '../config'
import {Main, WebTorrent} from './windows'
import {openExternal} from './shell'

export default class Menu {

  static menu: Object

  static init() {
    let menu = this.menu = appMenu.buildFromTemplate(this.getMenuTemplate())
    appMenu.setApplicationMenu(menu)
  }

  static togglePlaybackControls(flag) {
    this.getMenuItem('Play/Pause').enabled = flag
    this.getMenuItem('Skip Next').enabled = flag
    this.getMenuItem('Skip Previous').enabled = flag
    this.getMenuItem('Increase Volume').enabled = flag
    this.getMenuItem('Decrease Volume').enabled = flag
    this.getMenuItem('Step Forward').enabled = flag
    this.getMenuItem('Step Backward').enabled = flag
    this.getMenuItem('Increase Speed').enabled = flag
    this.getMenuItem('Decrease Speed').enabled = flag
    this.getMenuItem('Add Subtitles File...').enabled = flag

    if(flag === false) {
      this.getMenuItem('Skip Next').enabled = false
      this.getMenuItem('Skip Previous').enabled = false
    }
  }

  static onPlayerUpdate(hasNext, hasPrevious) {
    this.getMenuItem('Skip Next').enabled = hasNext
    this.getMenuItem('Skip Previous').enabled = hasPrevious
  }

  static setWindowFocus(flag) {
    this.getMenuItem('Full Screen').enabled = flag
    this.getMenuItem('Float on Top').enabled = flag
  }

  // Disallow opening more screens on top of the current one.
  static setAllowNav(flag) {
    this.getMenuItem('Preferences').enabled = flag
  }

  static onToggleAlwaysOnTop(flag) {
    this.getMenuItem('Float on Top').checked = flag
  }

  static onToggleFullScreen(flag) {
    this.getMenuItem('Full Screen').checked = flag
  }

  static getMenuItem(label) {
    for(let i = 0; i < this.menu.items.length; i++) {
      const menuItem = this.menu.items[i].submenu.items.find(item => {
        return item.label === label
      })
      if(menuItem) return menuItem
    }
  }

  static getMenuTemplate() {
    const template = [
      {
        label: 'View',
        submenu: [
          {
            label: 'Full Screen',
            type: 'checkbox',
            accelerator: process.platform === 'darwin'
              ? 'Ctrl+Command+F'
              : 'F11',
            click: () => Main.toggleFullScreen()
          },
          {
            label: 'Float on Top',
            type: 'checkbox',
            click: () => Main.toggleAlwaysOnTop()
          },
          {
            type: 'separator'
          },
          {
            label: 'Go Back',
            accelerator: 'Esc',
            click: () => Main.dispatch('escapeBack')
          },
          {
            label: 'Go Forward',
            accelerator: 'Alt+Esc',
            click: () => Main.dispatch('forward')
          },
          {
            type: 'separator'
          },
          {
            label: 'Developer',
            submenu: [
              {
                label: 'Developer Tools',
                accelerator: process.platform === 'darwin'
                  ? 'Alt+Command+I'
                  : 'Ctrl+Shift+I',
                click: () => Main.toggleDevTools()
              },
              {
                label: 'Show WebTorrent Process',
                accelerator: process.platform === 'darwin'
                  ? 'Alt+Command+P'
                  : 'Ctrl+Shift+P',
                click: () => WebTorrent.toggleDevTools()
              }
            ]
          }
        ]
      },
      {
        label: 'Playback',
        submenu: [
          {
            label: 'Play/Pause',
            accelerator: 'Space',
            click: () => Main.dispatch('playPause'),
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Skip Next',
            accelerator: 'N',
            click: () => Main.dispatch('nextTrack'),
            enabled: false
          },
          {
            label: 'Skip Previous',
            accelerator: 'P',
            click: () => Main.dispatch('previousTrack'),
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Increase Volume',
            accelerator: 'CmdOrCtrl+Up',
            click: () => Main.dispatch('changeVolume', 0.1),
            enabled: false
          },
          {
            label: 'Decrease Volume',
            accelerator: 'CmdOrCtrl+Down',
            click: () => Main.dispatch('changeVolume', -0.1),
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Step Forward',
            accelerator: process.platform === 'darwin'
              ? 'CmdOrCtrl+Alt+Right'
              : 'Alt+Right',
            click: () => Main.dispatch('skip', 10),
            enabled: false
          },
          {
            label: 'Step Backward',
            accelerator: process.platform === 'darwin'
              ? 'CmdOrCtrl+Alt+Left'
              : 'Alt+Left',
            click: () => Main.dispatch('skip', -10),
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Increase Speed',
            accelerator: 'CmdOrCtrl+=',
            click: () => Main.dispatch('changePlaybackRate', 1),
            enabled: false
          },
          {
            label: 'Decrease Speed',
            accelerator: 'CmdOrCtrl+-',
            click: () => Main.dispatch('changePlaybackRate', -1),
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Add Subtitles File...',
            click: () => Main.dispatch('openSubtitles'),
            enabled: false
          }
        ]
      },
      {
        label: 'Transfers',
        submenu: [
          {
            label: 'Pause All',
            click: () => Main.dispatch('pauseAllTorrents')
          },
          {
            label: 'Resume All',
            click: () => Main.dispatch('resumeAllTorrents')
          }
        ]
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: `Learn more about ${config.APP.NAME}`,
            click: () => openExternal(config.APP.URL)
          },
          {
            label: 'Contribute on GitHub',
            click: () => openExternal(config.GITHUB.URL)
          },
          {
            type: 'separator'
          },
          {
            label: 'Report an Issue...',
            click: () => openExternal(config.GITHUB.ISSUES)
          }
        ]
      }
    ]

    if(process.platform === 'darwin') {
      // WebTorrent menu (Mac)
      template.unshift({
        label: config.APP.NAME,
        submenu: [
          {
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            label: 'Preferences',
            accelerator: 'Cmd+,',
            click: () => Main.dispatch('preferences')
          },
          {
            type: 'separator'
          },
          {
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            role: 'hide'
          },
          {
            role: 'hideothers'
          },
          {
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      })

      // Edit menu (Mac)
      template[2].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking'
            },
            {
              role: 'stopspeaking'
            }
          ]
        }
      )

      // Window menu (Mac)
      template.splice(6, 0, {
        role: 'window',
        submenu: [
          {
            role: 'minimize'
          },
          {
            type: 'separator'
          },
          {
            role: 'front'
          }
        ]
      })
    }

    // On Windows and Linux, open dialogs do not support selecting both files and
    // folders and files, so add an extra menu item so there is one for each type.
    if(process.platform === 'linux' || process.platform === 'win32') {
      // Edit menu (Windows, Linux)
      template[1].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => Main.dispatch('preferences')
        })

      // Help menu (Windows, Linux)
      /*template[5].submenu.push(
        {
          type: 'separator'
        },
        {
          label: `About ${config.APP.NAME}`,
          click: () => windows.about.init()
        }
      )*/
    }
    // Add "File > Quit" menu item so Linux distros where the system tray icon is
    // missing will have a way to quit the app.
    if(process.platform === 'linux') {
      // File menu (Linux)
      template[0].submenu.push({
        label: 'Quit',
        click: () => app.quit()
      })
    }

    return template
  }

}
