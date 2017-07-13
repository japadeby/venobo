/**
 * On Windows, add a "thumbnail toolbar" with a play/pause button in the taskbar.
 * This provides users a way to access play/pause functionality without restoring
 * or activating the window.
 */

import path from 'path'
import config from '../config'
import Main from './window'

const STATIC = config.PATH.STATIC
const PREV_ICON = path.join(STATIC, 'PreviousTrackThumbnailBarButton.png')
const PLAY_ICON = path.join(STATIC, 'PlayThumbnailBarButton.png')
const PAUSE_ICON = path.join(STATIC, 'PauseThumbnailBarButton.png')
const NEXT_ICON = path.join(STATIC, 'NextTrackThumbnailBarButton.png')

// Array indices for each button
const PREV = 0
const PLAY_PAUSE = 1
const NEXT = 2

let buttons = []
/**
 * Show the Windows thumbnail toolbar buttons.
 */
export function enable () {
  buttons = [
    {
      tooltip: 'Previous Track',
      icon: PREV_ICON,
      click: () => Main.dispatch('previousTrack')
    },
    {
      tooltip: 'Pause',
      icon: PAUSE_ICON,
      click: () => Main.dispatch('playPause')
    },
    {
      tooltip: 'Next Track',
      icon: NEXT_ICON,
      click: () => Main.dispatch('nextTrack')
    }
  ]
  update()
}

/**
 * Hide the Windows thumbnail toolbar buttons.
 */
export function disable () {
  buttons = []
  update()
}

export function onPlayerPause () {
  if (!isEnabled()) return
  buttons[PLAY_PAUSE].tooltip = 'Play'
  buttons[PLAY_PAUSE].icon = PLAY_ICON
  update()
}

export function onPlayerPlay () {
  if (!isEnabled()) return
  buttons[PLAY_PAUSE].tooltip = 'Pause'
  buttons[PLAY_PAUSE].icon = PAUSE_ICON
  update()
}

export function isEnabled () {
  return buttons.length > 0
}

export function update () {
  Main.win.setThumbarButtons(buttons)
}
