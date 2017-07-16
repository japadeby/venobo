/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

const pckg = require('../package.json')
const path = require('path')
const electron = require('electron')
const arch = require('arch')
const fs = require('fs')
const LocalStorage = require('local-storage-es6')
const appConfig = require('application-config')(pckg.productName)

const APP_TEAM = pckg.productName + ' Dev'
const STATIC_PATH = path.join(__dirname, '..', 'static')
const IS_DEV = isDev()
const PORTABLE_PATH = IS_DEV
        ? path.join(process.platform === 'win32' ? 'C:\\Windows\\Temp' : '/tmp', pckg.productName)
        : path.join(path.dirname(process.execPath), pckg.productName)
const IS_PRODUCTION = isProduction()
const IS_PORTABLE = isPortable()
const CONFIG_PATH = getConfigPath()
const CACHE_PATH = path.join(CONFIG_PATH, 'Cache')
const APP_SECRET = '56dc6f8e86f739bbce37281a8ad47641'

module.exports = {
  OS_SYSARCH: arch() === 'x64' ? 'x64' : 'ia32',
  APP: {
    COPYRIGHT: 'Copyright © 2017 ' + APP_TEAM,
    ICON: path.join(STATIC_PATH, 'img', pckg.productName),
    NAME: pckg.productName,
    TEAM: APP_TEAM,
    VERSION: pckg.version,
    SECRET_KEY: APP_SECRET,
    DESC: pckg.description,
    API: 'https://venobo.herokuapp.com/api',
    URL: 'http://localhost:3001',
    ANNOUNCEMENT: 'http://localhost:3001/desktop/announcement',
    CRASH_REPORTER: 'https://electron-crash-reporter.appspot.com/5674134847619072/create/',
    LARGE_LOGO: path.join(STATIC_PATH, 'img', 'header-logo.png')
  },
  PATH: {
    TRANSLATIONS: path.join(STATIC_PATH, 'translations'),
    ROOT: path.join(__dirname, '..'),
    STATIC: STATIC_PATH,
    CACHE: CACHE_PATH,
    DOWNLOAD: getDefaultDownloadPath(),
    CONFIG: CONFIG_PATH,
    PORTABLE: PORTABLE_PATH,
    TEMP: path.join(getPath('temp'), pckg.productName)
  },
  TMDB: {
    API: 'https://api.themoviedb.org',
    KEY: '56dc6f8e86f739bbce37281a8ad47641',
    POSTER: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    BACKDROP: 'https://image.tmdb.org/t/p/original',
    STILL: 'https://image.tmdb.org/t/p/w227_and_h127_bestv2',
    GENRES: {
      MOVIES: {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
      },
      SHOWS: {
        10759: 'Action & Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        10762: 'Kids',
        9648: 'Mystery',
        10763: 'News',
        10764: 'Reality',
        10765: 'Sci-Fi & Fantasy',
        10766: 'Soap',
        10767: 'Talk',
        10768: 'War & Politics',
        37: 'Western'
      }
    },
    SORT_BY: [
      'popularity.desc',
      'release_date.desc',
      'vote_count.desc',
      'original_title.desc'
    ]
  },
  GITHUB: {
    URL: 'https://github.com/venobo/app',
    ISSUES: 'https://github.com/venobo/app/issues'
  },
  WINDOW: {
    INDEX: path.join(`file://${STATIC_PATH}`, 'index.html'),
    MIN: {
      WIDTH: 1075,
      HEIGHT: 600
    },
    FRAME: true,
    TOOLBAR: true,
    DEVTOOLS: true
  },
  IS: {
    DEV: IS_DEV,
    PRODUCTION: IS_PRODUCTION,
    PORTABLE: IS_PORTABLE
  },
  DELAYED_INIT: 3000, // 3 seconds
  TOOLTIP_DELAY: 400,
  CACHE_DURATION: 3 * 60, // 3 hours cache duration,
  AXIOS_TIMEOUT: 5000, // in ms
  SAVE_DEBOUNCE_INTERVAL: 1000,
  CACHE: new LocalStorage({
    path: CACHE_PATH,
    key: APP_SECRET,
    mkdir: true,
    encryptFileName: true,
    encryptFileContent: false
  })
}

function getConfigPath () {
  if (IS_PORTABLE) {
    return PORTABLE_PATH
  } else {
    return path.dirname(appConfig.filePath)
  }
}

function getPath (key) {
  if (!process.versions.electron) {
    // Node.js process
    return ''
  } else if (process.type === 'renderer') {
    // Electron renderer process
    return electron.remote.app.getPath(key)
  } else {
    // Electron main process
    return electron.app.getPath(key)
  }
}

function getDefaultDownloadPath () {
  if (IS_PORTABLE) {
    return path.join(CONFIG_PATH, 'Downloads')
  } else {
    return getPath('downloads')
  }
}

function isDev () {
  return process.env.NODE_ENV === 'development'
}

function isPortable () {
  if (IS_DEV) return true
  // Fast path: Non-Windows platforms should not check for path on disk
  if (process.platform !== 'win32' || !IS_PRODUCTION) {
    return false
  }

  try {
    // This line throws if the "Venobo" folder does not exist, and does
    // nothing otherwise.
    fs.accessSync(PORTABLE_PATH, fs.constants.R_OK | fs.constants.W_OK)
    return true
  } catch (err) {
    return false
  }
}

function isProduction () {
  // Node.js process
  if (!process.versions.electron) { return false }
  if (process.platform === 'darwin') { return !/\/Electron\.app\//.test(process.execPath) }
  if (process.platform === 'win32') { return !/\\electron\.exe$/.test(process.execPath) }
  if (process.platform === 'linux') { return !/\/electron$/.test(process.execPath) }
}
