import path from 'path'
import {ipcRenderer} from 'electron'

//import TorrentSummary from '../lib/torrent-summary'
import sound from '../lib/sound'
import {dispatch} from '../lib/dispatcher'

export default class TorrentController {

  state: Object

  constructor(state) {
    this.state = state
  }

  addTorrent(torrentMagnet) { // magnet URI
    const torrentKey = this.state.nextTorrentKey++
    const path = this.state.saved.prefs.downloadPath

    ipcRenderer.send('wt-start-torrenting', torrentKey, torrentMagnet.trim(), path)
  }

  pauseTorrent(torrentSummary, playSound) {
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

}
