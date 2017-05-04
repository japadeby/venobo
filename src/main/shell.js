import {shell} from 'electron'
import {log} from './log'

/**
 * Open the given external protocol URL in the desktop’s default manner.
 */
export function openExternal (url) {
  log(`openExternal: ${url}`)
  shell.openExternal(url)
}

/**
 * Open the given file in the desktop’s default manner.
 */
export function openItem (e, path) {
  log(`openItem: ${path}`)
  shell.openItem(path)
}

/**
 * Show the given file in a file manager. If possible, select the file.
 */
export function showItemInFolder (e, path) {
  log(`showItemInFolder: ${path}`)
  shell.showItemInFolder(path)
}

/**
 * Move the given file or folder to trash and returns a boolean status for the operation.
 */
export function moveItemToTrash (e, path) {
  log(`moveItemToTrash: ${path}`)
  shell.moveItemToTrash(path)
}
