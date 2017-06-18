import path from 'path'
import {ipcRenderer} from 'electron'
import Promise from 'bluebird'
import torrentWorker from 'torrent-worker'
import getPort from 'get-port'

import config from '../../config'
//import TorrentSummary from '../lib/torrent-summary'
import sound from '../lib/sound'
import {dispatch} from '../lib/dispatcher'

export default class TorrentController {

  state: Object
  streams: Object

  constructor(state) {
    this.state = state
  }

  add(torrent) { // magnet URI
    return new Promise((resolve, reject) => {
      Promise.all([this.read(torrent.trim()), getPort()])
        .spread((torrentInfo, port) => {
          const opts = {
            tracker: true,
            port,
            tmp: config.PATH.TEMP,
            buffer: (1.5 * 1024 * 1024).toString(),
            //connections: maxPeers
            withResume: true,
            torFile: torrent,
            path: this.state.saved.prefs.downloadPath
          }

          const worker = new torrentWorker()
          const engine = worker.process(torrentInfo, opts)

          engine.on('listening', () => {
            sound('ADD')
            this.streams[engine.infoHash]['stream-port'] = engine.server.address().port
          })

          engine.on('ready', () => {
            this.streams[engine.infoHash] = engine
            resolve(engine)
          })
        })
    })
  }

  read(torrent) {
    return new Promise((resolve, reject) => {
      readTorrent(torrent, (err, parsedTorrent) =>
        (err || parsedTorrent) ? reject(err) : resolve(parsedTorrent))
    })
  }

  destroy(infoHash) {
    const stream = this.streams[infoHash]

    if (stream) {
      if (stream.server._handle) stream.server.close()
      stream.destroy()
    }
  }

  setPulse(infoHash, pulse) {
    this.streams[infoHash].setPulse(pulse)
  }

  flood(infoHash) {
    this.streams[infoHash].flood()
  }

  /*pauseTorrent(torrentSummary, playSound) {
    torrentSummary.status = 'paused'
    ipcRenderer.send('wt-stop-torrenting', torrentSummary.infohash)
  }

  deleteTorrent(infoHash: String, deleteData: Boolean = true) {
    ipcRenderer.send('wt-stop-torrenting', infoHash)

    const index = this.state.saved.torrents.find(x => x.infoHash === infoHash)

    if (index > -1) {
      const summary = this.state.saved.torrents[index]

      // remote torrent and poster file
      this.deleteFile(TorrentSummary.getTorrentPath(summary))
      this.deleteFile(TorrentSummary.getPosterPath(summary))

      if (deleteData) this.moveItemToTrash(summary)

      this.state.saved.torrents.splice(index, 1)
      dispatch('stateSave')
    }

    sound('DELETE')
  }

  deleteFile(path) {
    if (!path) return
    fs.unlink(path, function (err) {
      if (err) dispatch('error', err)
    })
  }

  // Delete all files in a torrent
  moveItemToTrash(torrentSummary) {
    const filePath = TorrentSummary.getFileOrFolder(torrentSummary)
    if (filePath) ipcRenderer.send('moveItemToTrash', filePath)
  }

  showItemInFolder(torrentSummary) {
    ipcRenderer.send('showItemInFolder', TorrentSummary.getFileOrFolder(torrentSummary))
  }

  torrentInfoHash(torrentKey, infoHash) {
    var torrentSummary = this.getTorrentSummary(torrentKey)
    console.log('got infohash for %s torrent %s', torrentSummary ? 'existing' : 'new', torrentKey)

    if (!torrentSummary) {
      const torrents = this.state.saved.torrents

      if (torrents.find(t => t.infoHash === infoHash)) {
        ipcRenderer.send('wt-stop-torrenting', infoHash)
        return dispatch('error', 'Cannot add duplicate torrent')
      }

      torrentSummary = {
        torrentKey: torrentKey,
        status: 'new'
      }

      torrents.unshift(torrentSummary)
      sound('ADD')
    }

    torrentSummary.infoHash = infoHash
  }

  torrentWarning(torrentKey, message) {
    console.log('warning for torrent %s: %s', torrentKey, message)
  }

  torrentError(torrentKey, message) {
    dispatch('error', message)

    const torrentSummary = this.getTorrentSummary(torrentKey)
    if (torrentSummary) {
      console.log('Pausing torrent %s due to error: %s', torrentSummary.infoHash, message)
      torrentSummary.status = 'paused'
    }
  }

  torrentMetadata (torrentKey, torrentInfo) {
    console.log(arguments)
    // Summarize torrent
    const torrentSummary = this.getTorrentSummary(torrentKey)
    torrentSummary.status = 'downloading'
    torrentSummary.name = torrentSummary.displayName || torrentInfo.name
    torrentSummary.path = torrentInfo.path
    torrentSummary.magnetURI = torrentInfo.magnetURI
    // TODO: make torrentInfo immutable, save separately as torrentSummary.info
    // For now, check whether torrentSummary.files has already been set:
    const hasDetailedFileInfo = torrentSummary.files && torrentSummary.files[0].path
    if (!hasDetailedFileInfo) {
      torrentSummary.files = torrentInfo.files
    }
    if (!torrentSummary.selections) {
      torrentSummary.selections = torrentSummary.files.map((x) => true)
    }

    // Auto-generate a poster image, if it hasn't been generated already
    if (!torrentSummary.posterFileName) ipcRenderer.send('wt-generate-torrent-poster', torrentKey)
  }

  torrentDone(torrentKey, torrentInfo) {
    // Update the torrent summary
    const torrentSummary = this.getTorrentSummary(torrentKey)
    torrentSummary.status = 'seeding'

    // Notify the user that a torrent finished, but only if we actually DL'd at least part of it.
    // Don't notify if we merely finished verifying data files that were already on disk.
    if (torrentInfo.bytesReceived > 0) {
      if (!this.state.window.isFocused) {
        this.state.dock.badge += 1
      }
      this.showDoneNotification(torrentSummary)
      ipcRenderer.send('downloadFinished', this.getTorrentPath(torrentSummary))
    }
  }

  torrentProgress (progressInfo) {
    console.log(progressInfo)
    // Overall progress across all active torrents, 0 to 1, or -1 to hide the progress bar
    // Hide progress bar when client has no torrents, or progress is 100%
    const progress = (!progressInfo.hasActiveTorrents || progressInfo.progress === 1)
      ? -1
      : progressInfo.progress

    // Show progress bar under the WebTorrent taskbar icon, on OSX
    this.state.dock.progress = progress

    // Update progress for each individual torrent
    progressInfo.torrents.forEach((p) => {
      const torrentSummary = this.getTorrentSummary(p.torrentKey)
      if (!torrentSummary) {
        console.log('warning: got progress for missing torrent %s', p.torrentKey)
        return
      }
      torrentSummary.progress = p
    })

    // TODO: Find an efficient way to re-enable this line, which allows subtitle
    //       files which are completed after a video starts to play to be added
    //       dynamically to the list of subtitles.
    // checkForSubtitles()
  }

  torrentFileModtimes (torrentKey, fileModtimes) {
    const torrentSummary = this.getTorrentSummary(torrentKey)
    if (!torrentSummary) throw new Error('Not saving modtimes for deleted torrent ' + torrentKey)
    torrentSummary.fileModtimes = fileModtimes
    dispatch('stateSave')
  }

  torrentPosterSaved (torrentKey, posterFileName) {
    const torrentSummary = this.getTorrentSummary(torrentKey)
    torrentSummary.posterFileName = posterFileName
    state.playing.posterFileName = posterFileName

    dispatch('stateSave')
  }

  torrentServerRunning (serverInfo) {
    this.state.server = serverInfo
  }

  getTorrentSummary (torrentKey) {
    return TorrentSummary.getByKey(this.state, torrentKey)
  }




  getTorrentPath(torrentSummary) {
    let itemPath = TorrentSummary.getFileOrFolder(torrentSummary)
    if (torrentSummary.files.length > 1) {
      itemPath = path.dirname(itemPath)
    }
    return itemPath
  }

  showDoneNotification(torrent) {
    const notif = new window.Notification('Download Complete', {
      body: torrent.name,
      silent: true
    })

    notif.onclick = function () {
      ipcRenderer.send('show')
    }

    // Only play notification sound if player is inactive
    if (this.state.playing.isPaused) sound('DONE')
  }*/

}
