import cp from 'child_process'
import { app } from 'electron'
import fs from 'fs'
import os from 'os'
import path from 'path'

import config from '../config'
import handlers from './handlers'

const EXE_NAME = path.basename(process.execPath)
const UPDATE_EXE = path.join(process.execPath, '..', '..', 'Update.exe')

export default function (cmd) {
  if (cmd === '--squirrel-install') {
    // App was installed. Install desktop/start menu shortcuts.
    createShortcuts(() => setTimeout(app.quit, 3000))
      // Ensure user sees install splash screen so they realize that Setup.exe actually
      // installed an application and isn't the application itself.

    // })
    return true
  }

  if (cmd === '--squirrel-updated') {
    // App was updated. (Called on new version of app)
    updateShortcuts(app.quit)
    return true
  }

  if (cmd === '--squirrel-uninstall') {
    // App was just uninstalled. Undo anything we did in the --squirrel-install and
    // --squirrel-updated handlers

    // Uninstall .torrent file and magnet link handlers
    handlers.uninstall()

    // Remove desktop/start menu shortcuts.
    // HACK: add a callback to handlers.uninstall() so we can remove this setTimeout
    setTimeout(() => removeShortcuts(app.quit), 1000)

    return true
  }

  if (cmd === '--squirrel-obsolete') {
    // App will be updated. (Called on outgoing version of app)
    app.quit()
    return true
  }

  if (cmd === '--squirrel-firstrun') {
    // App is running for the first time. Do not quit, allow startup to continue.
    return false
  }

  return false
}

/**
 * Spawn a command and invoke the callback when it completes with an error and
 * the output from standard out.
 */
function spawn (command, args, callback) {
  let stdout = ''
  let error = null
  let child = null

  try {
    child = cp.spawn(command, args)
  } catch (err) {
    // Spawn can throw an error
    process.nextTick(() => callback(error, stdout))
    return
  }

  child.stdout.on('data', (data) => {
    stdout += data
  })
  child.on('error', (processError) => {
    error = processError
  })
  child.on('close', (code, signal) => {
    if (code !== 0 && !error) error = new Error('Command failed: #{signal || code}')
    if (error) error.stdout = stdout
    callback(error, stdout)
  })
}

/**
 * Spawn the Squirrel `Update.exe` command with the given arguments and invoke
 * the callback when the command completes.
 */
function spawnUpdate (args, callback) {
  spawn(UPDATE_EXE, args, callback)
}

/**
 * Create desktop and start menu shortcuts using the Squirrel `Update.exe`
 * command.
 */
function createShortcuts (callback) {
  spawnUpdate(['--createShortcut', EXE_NAME], callback)
}

/**
 * Update desktop and start menu shortcuts using the Squirrel `Update.exe`
 * command.
 */
function updateShortcuts (callback) {
  const homeDir = os.homedir()
  if (homeDir) {
    const desktopShortcutPath = path.join(homeDir, 'Desktop', `${config.APP.NAME}.lnk`)
    // If the desktop shortcut was deleted by the user, then keep it deleted.
    fs.access(desktopShortcutPath, (err) => {
      const desktopShortcutExists = !err
      createShortcuts(() => {
        if (desktopShortcutExists) {
          callback()
        } else {
          // Remove the unwanted desktop shortcut that was recreated
          fs.unlink(desktopShortcutPath, callback)
        }
      })
    })
  } else {
    createShortcuts(callback)
  }
}

/**
 * Remove desktop and start menu shortcuts using the Squirrel `Update.exe`
 * command.
 */
function removeShortcuts (callback) {
  spawnUpdate(['--removeShortcut', EXE_NAME], callback)
}
