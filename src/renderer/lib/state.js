import path from 'path'
import EventEmitter from 'event-emitter-es6'
import { createMemoryHistory } from 'history'
import cpFile from 'cp-file'
import fs from 'fs'
import debounce from 'debounce'
import os from 'os'

import config from '../../config'

const appConfig = require('application-config')(config.APP.NAME)
appConfig.filePath = path.join(config.PATH.CONFIG, 'config.json')

class State extends EventEmitter {

  constructor() {
    super()
  }

  getDefaultPlayState() {
    return {
      title: null, /* the title of the media we're playing */
      infoHash: null, /* the info hash of the torrent we're playing */
      fileIndex: null, /* the zero-based indsex within the torrent */
      location: 'local', /* 'local', 'chromecast', 'airplay' */
      //type: null, /* 'audio' or 'video', could be 'other' if ever support eg streaming to VLC */
      currentTime: 0, /* seconds */
      duration: 120, /* seconds */
      isReady: false,
      isPaused: true,
      isStalled: false,
      playbackRate: 1,
      volume: 1,
      lastVolume: 1,
      subtitles: {
        tracks: [], /* subtitle tracks, each {label, language, ...} */
        selectedIndex: -1 /* current subtitle track */
      },
      aspectRatio: 0, /* aspect ratio of the video */
      /*seekerPos: undefined,
      seekerFraction: undefined*/
    }
  }

  // state.save() calls are rate-limited. Use state.saveImmediate() to skip limit.
  save() {
    // After first State.save() invokation, future calls go straight to the
    // debounced function
    this.save = debounce(this.saveImmediate, config.SAVE_DEBOUNCE_INTERVAL)
    this.save(...arguments)
  }

  getDefaultState() {
    return {
      /*
       * Temporary state disappears once the program exits.
       * It can contain complex objects like open connections, etc.
       */
      client: null, /* the WebTorrent client */
      server: null, /* local WebTorrent-to-HTTP server */
      prev: { /* used for state diffing in updateElectron() */
        title: null,
        progress: -1,
        badge: null
      },
      window: {
        bounds: null, /* {x, y, width, height } */
        isFocused: true,
        isFullScreen: false,
        title: config.APP_WINDOW_TITLE
      },
      selectedInfoHash: null, /* the torrent we've selected to view details. see state.torrents */
      playing: this.getDefaultPlayState(), /* the media (audio or video) that we're currently playing */
      devices: {}, /* playback devices like Chromecast and AppleTV */
      dock: {
        badge: 0,
        progress: 0
      },
      starredAction: undefined,
      search: {
        mount: undefined,
        enabled: false,
        toggle: undefined
      },
      tooltip: {
        delay: config.TOOLTIP_DELAY
      },
      media: {
        lists: {
          discover: {},
          movies: {
            recommendations: {},
            similar: {},
            popular: [],
            topRated: []
          },
          shows: {
            recommendations: {},
            similar: {},
            popular: [],
            topRated: []
          }
        },
        movies: [],
        shows: []
      }, // cache module
      modal: null, /* modal popover */
      errors: [], /* user-facing errors */
      nextTorrentKey: 1, /* identify torrents for IPC between the main and webtorrent windows */

      /*
       * Saved state is read from and written to a file every time the app runs.
       * It should be simple and minimal and must be JSON.
       * It must never contain absolute paths since we have a portable app.
       *
       * Config path:
       *
       * Mac                  ~/Library/Application Support/WebTorrent/config.json
       * Linux (XDG)          $XDG_CONFIG_HOME/WebTorrent/config.json
       * Linux (Legacy)       ~/.config/WebTorrent/config.json
       * Windows (> Vista)    %LOCALAPPDATA%/WebTorrent/config.json
       * Windows (XP, 2000)   %USERPROFILE%/Local Settings/Application Data/WebTorrent/config.json
       *
       * Also accessible via `require('application-config')('WebTorrent').filePath`
       */
      saved: {}
    }
  }

  setupStateSaved(callback) {
    const saved = {
      prefs: {
        downloadPath: config.PATH.DOWNLOAD,
        openExternalPlayer: false,
        externalPlayerPath: null,
        startup: false,
        iso2: 'EN',
        iso4: 'en-US',
        defaultQuality: '1080p',
        shouldSaveHistory: true
      },
      history: null,
      starred: {
        movies: [],
        shows: []
      },
      watched: {
        movies: {},
        shows: {}
      },
      username: os.hostname(),
      torrents: [],
      torrentsToResume: [],
      version: config.APP.VERSION /* make sure we can upgrade gracefully later */
    }

    callback(null, saved)
  }

  load(callback) {
    appConfig.read((err, saved) => {
      if (err || !saved.version) {
        console.log('Missing config file: Creating new one')
        this.setupStateSaved(onSavedState)
      } else {
        onSavedState(null, saved)
      }
    })

    const onSavedState = (err, saved) => {
      if (err) return callback(err)
      const state = this.getDefaultState()
      state.saved = saved

      this.save(state)
      callback(null, state)
    }
  }

  saveImmediate(state, callback) {
    console.log(`Saving state to ${appConfig.filePath}`)
    // Clean up, so that we're not saving any pending state
    const copy = Object.assign({}, state.saved)

    appConfig.write(copy, (err) => {
      if (err) console.error(err)
      else this.emit('stateSaved')
    })
  }

}

export default new State
