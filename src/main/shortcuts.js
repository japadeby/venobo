import {globalShortcut} from 'electron'
import {Main} from './windows'

export function enable () {
  globalShortcut.register(
    'MediaPlayPause',
    () => Main.dispatch('playPause')
  )
  globalShortcut.register(
    'MediaNextTrack',
    () => Main.dispatch('nextTrack')
  )
  globalShortcut.register(
    'MediaPreviousTrack',
    () => Main.dispatch('previousTrack')
  )
}

export function disable () {
  // Return the media key to the OS, so other apps can use it.
  globalShortcut.unregister('MediaPlayPause')
  globalShortcut.unregister('MediaNextTrack')
  globalShortcut.unregister('MediaPreviousTrack')
}
