console.time('init')

import crypto from 'crypto'
import deepEqual from 'deep-equal'
import {announceList} from 'create-torrent'
import {ipcRenderer as ipc} from 'electron'
import fs from 'fs'
import networkAddress from 'network-address'
import path from 'path'
import WebTorrent from 'webtorrent'
import zeroFill from 'zero-fill'

import crashReporter from '../crash-reporter'
import config from '../config'

global.WEBTORRENT_ANNOUNCEMENT = announceList
  .map(arr => arr[0])
  .filter(url => url.includes('wss://') || url.includes('ws://'))

export default class WebTorrentClient {

  client = null
  server = null
  progress = null
  prevProgress = null

  constructor() {
    // Start crash reporter
    crashReporter()

    const VERSION_STR = config.APP.VERSION.match(/([0-9]+)/g)
      .slice(0, 2)
      .map(v => zeroFill(2, v))
      .join('')
    const PEER_ID = Buffer.from(`-WD${VERSION_STR}-`
      + crypto.randomBytes(9).toString('base64'))

    this.client = new WebTorrent({ peerId: PEER_ID })

    this.setupIpc()
  }

  setupIpc() {
    this.listenToClientEvents()

    ipc.on('wt-start-torrenting', (e, ...args) =>
      this.startTorrenting(...args))
    ipc.on('wt-stop-torrenting', (e, infoHash) =>
      this.stopTorrenting(infoHash))
    ipc.on('wt-start-server', (e, infoHash) =>
      this.startServer(infoHash))
    ipc.on('ws-stop-server', (e) =>
      this.stopServer())
    ipc.on('wt-select-files', (e, ...args) =>
      this.selectFiles(...args))

    ipc.send('ipcReadyWebTorrent')

    window.addEventListener('error', (e) =>
      ipc.send('wt-uncaught-error', {message: e.error.message, stack: e.error.stack}),
      true)

    //setInterval(() => this.updateTorrentProgress(), 1000)

    console.timeEnd('init')
  }

  listenToClientEvents() {
    this.client.on('warning', (err) =>
      ipc.send('wt-warning', null, err.message))
    this.client.on('error', (err) =>
      ipc.send('wt-error', null, err.message))
  }

  // Starts a given TorrentID from a magnet URI
  // Returns a WebTorrent object. See https://git.io/vik9M
  startTorrenting(torrentKey, torrentID, path, fileModTimes, selections) {
    console.log('starting torrent %s: %s', torrentKey, torrentId)

    const torrent = this.client.add(torrentID, {
      path: path,
      fileModTimes: fileModTimes
    })
    torrent.key = torrentKey

    // Listen for ready event, progress notifications, etc
    this.addTorrentEvents(torrent)

    torrent.once('ready', () => this.selectFiles(torrent, selections))
  }

  stopTorrenting(infoHash) {
    console.log('--- STOP TORRENTING: ', infoHash)

    const torrent = this.client.get(infoHash)
    if (torrent) torrent.destroy()
  }

  addTorrentEvents(torrent) {
    torrent.on('warning', (err) =>
      ipc.send('wt-warning', torrent.key, err.message))
    torrent.on('error', (err) =>
      ipc.send('wt-error', torrent.key, err.message))
    torrent.on('infoHash', () =>
      ipc.send('wt-infohash', torrent.key, torrent.infoHash))
    torrent.on('metadata', () => this.torrentMetadata(torrent))
    torrent.on('ready', () => this.torrentReady(torrent))
    torrent.on('done', () => this.torrentDone(torrent))
  }

  torrentMetadata(torrent) {
    const info = this.getTorrentInfo(torrent)
    ipc.send('wt-metadata', torrent.key, info)

    this.updateTorrentProgress()
  }

  torrentReady(torrent) {
    const info = this.getTorrentInfo(torrent)
    ipc.send('wt-ready', torrent.key, info)
    ipc.send(`wt-ready-${torrent.infoHash}`, torrent.key, torrent.infoHash)

    this.updateTorrentProgress()
  }

  torrentDone(torrent) {
    const info = getTorrentInfo(torrent)
    ipc.send('wt-done', torrent.key, info)

    this.updateTorrentProgress()

    torrent.getFileModtimes((err, fileModtimes) => {
      if (err) return console.log(err)
      ipc.send('wt-file-modtimes', torrent.key, fileModtimes)
    })
  }

  getTorrentInfo(torrent) {
    return {
      infoHash: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      name: torrent.name,
      path: torrent.path,
      files: torrent.files.map(this.getTorrentFileInfo),
      bytesReceived: torrent.received
    }
  }

  getTorrentFileInfo(file) {
    return {
      name: file.name,
      length: file.length,
      path: file.path
    }
  }

  selectFiles(torrentOrInfoHash, selections) {
    // Get the torrent object
    let torrent = (typeof torrentOrInfoHash === 'string')
      ? this.client.get(torrentOrInfoHash)
      : torrentOrInfoHash

    if (!torrent) {
      throw new Error('selectFiles: missing torrent ' + torrentOrInfoHash)
    }

    // Selections not specified?
    // Load all files. We still need to replace the default whole-torrent
    // selection with individual selections for each file, so we can
    // select/deselect files later on
    if (!selections) {
      selections = torrent.files.map(x => true)
    }

    if (selections.length !== torrent.files.length) {
      throw new Error(`got ${selections.length} file selections, ` +
        `but the torrent contains ${torrent.files.length} files`)
    }

    // Remove default selection (whole torrent)
    torrent.deselect(0, torrent.pieces.length - 1, false)

    // Add selections (individual files)
    for (let i = 0; i < selections.length; i++) {
      const file = torrent.files[i]
      if (selections[i]) {
        file.select()
      } else {
        console.log(`deselecting file ${i} of torrent ${torrent.name}`)
        file.deselect()
      }
    }
  }

  /*saveTorrentFile(torrentKey) {
    const torrent = this.getTorrent(torrentKey)
    const torrent
  }*/

  updateTorrentProgress() {
    let {prevProgress} = this
    const progress = this.getTorrentProgress()

    if (prevProgress && deepEqual(progress, prevProgress, {strict: true})) {
      return /* don't send heavy object if it hasn't changed */
    }

    ipc.send('wt-progress', progress)
    prevProgress = progress
  }

  getTorrentProgress() {
    const {client} = this
    const {progress} = client

    const hasActiveTorrents = client.torrents.some(torrent => {
      return torrent.progress !== 1
    })

    // Track progress for every file in each torrent
    const torrentProg = client.torrents.map(torrent => {
      const fileProg = torrent.files && torrent.files.map((file, index) => {
        const numPieces = file._endPiece - file._startPiece + 1
        let numPiecesPresent = 0

        for (let piece = file._startPiece; piece <= file._endPiece; piece++) {
          if (torrent.bitfield.get(piece)) numPiecesPresent++
        }

        return {
          startPiece: file._startPiece,
          endPiece: file._endPiece,
          numPieces,
          numPiecesPresent
        }
      })

      return {
        torrentKey: torrent.key,
        ready: torrent.ready,
        progress: torrent.progress,
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        numPeers: torrent.numPeers,
        length: torrent.length,
        bitfield: torrent.bitfield,
        files: fileProg
      }
    })

    return {
      torrents: torrentProg,
      progress,
      hasActiveTorrents
    }
  }

  getTorrent(torrentKey) {
    const ret = this.client.torrents.find(x => x.key === torrentKey)
    if (!ret) throw new Error(torrentKey)

    return ret
  }

  stopServer() {
    let {server} = this

    if (!server) return
    if (this.progress) clearInterval(this.progress)
    server.destroy()
    server = null
  }

  startServer(infoHash) {
    const torrent = this.client.get(infoHash)
    if (torrent.ready) {
      this.startServerFromReadyTorrent(torrent)
    } else {
      torrent.once('ready', () =>
        this.startServerFromReadyTorrent(torrent))
    }

    // Start updating torrent progress
    this.progress = setInterval(() =>
      this.updateTorrentProgress(), 1000)
  }

  startServerFromReadyTorrent(torrent) {
    let {server} = this

    // start streaming torrent-to-http server
    server = torrent.createServer()
    server.listen(0, () => {
      const port = server.address().port
      const urlSuffix = ':' + port

      const info = {
        torrentKey: torrent.key,
        localURL: 'http://localhost' + urlSuffix,
        networkURL: 'http://' + networkAddress() + urlSuffix
      }

      ipc.send('wt-server-running', info)
      ipc.send(`wt-server-${torrent.infoHash}`, info)
    })
  }

}
