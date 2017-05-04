import {app} from 'electron'
import path from 'path'

import config from '../config'

export function install () {
  if (process.platform === 'win32') { installWin32() }
  if (process.platform === 'linux') { installLinux() }
}

export function uninstall () {
  if (process.platform === 'win32') { uninstallWin32() }
  if (process.platform === 'linux') { uninstallLinux() }
}

const EXEC_COMMAND = [process.execPath]

if (!config.IS_PRODUCTION) {
  EXEC_COMMAND.push(config.ROOT_PATH)
}

function commandToArgs (command) {
  return command.map((arg) => `"${arg}"`).join(' ')
}

function installLinux () {
  const fs = require('fs')
  const os = require('os')
  const path = require('path')

  const config = require('../config')
  const log = require('./log')

  // Do not install in user dir if running on system
  if (/^\/opt/.test(process.execPath)) return

  installDesktopFile()
  installIconFile()

  function installDesktopFile () {
    const templatePath = path.join(
      config.STATIC_PATH, 'linux', 'venobo.desktop'
    )
    fs.readFile(templatePath, 'utf8', writeDesktopFile)
  }

  function writeDesktopFile (err, desktopFile) {
    if (err) return log.error(err.message)

    const appPath = config.IS_PRODUCTION
      ? path.dirname(process.execPath)
      : config.ROOT_PATH

    desktopFile = desktopFile.replace(/\$APP_NAME/g, config.APP_NAME)
    desktopFile = desktopFile.replace(/\$APP_PATH/g, appPath)
    desktopFile = desktopFile.replace(/\$EXEC_PATH/g, EXEC_COMMAND.join(' '))
    desktopFile = desktopFile.replace(/\$TRY_EXEC_PATH/g, process.execPath)

    const desktopFilePath = path.join(
      os.homedir(),
      '.local',
      'share',
      'applications',
      'venobo.desktop'
    )
    fs.mkdirp(path.dirname(desktopFilePath))
    fs.writeFile(desktopFilePath, desktopFile, function (err) {
      if (err) return log.error(err.message)
    })
  }

  function installIconFile () {
    const iconStaticPath = path.join(config.STATIC_PATH, 'WebTorrent.png')
    fs.readFile(iconStaticPath, writeIconFile)
  }

  function writeIconFile (err, iconFile) {
    if (err) return log.error(err.message)

    const mkdirp = require('mkdirp')

    const iconFilePath = path.join(
      os.homedir(),
      '.local',
      'share',
      'icons',
      'venobo.png'
    )
    mkdirp(path.dirname(iconFilePath), (err) => {
      if (err) return log.error(err.message)
      fs.writeFile(iconFilePath, iconFile, (err) => {
        if (err) log.error(err.message)
      })
    })
  }
}

function uninstallLinux () {
  const os = require('os')
  const path = require('path')
  const rimraf = require('rimraf')

  const desktopFilePath = path.join(
    os.homedir(),
    '.local',
    'share',
    'applications',
    'venobo.desktop'
  )
  rimraf(desktopFilePath)

  const iconFilePath = path.join(
    os.homedir(),
    '.local',
    'share',
    'icons',
    'venobo.png'
  )
  rimraf(iconFilePath)
}
