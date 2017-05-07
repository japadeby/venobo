import path from 'path'
import config from '../../config'

export default class TorrentSummary {

  // Expects a torrentSummary
  // Returns an absolute path to the torrent file, or null if unavailable
  static getTorrentPath(torrentSummary) {
    const {torrent} = torrentSummary

    if (!torrentSummary || !torrentFileName) return null
    return path.join(config.PATH.TORRENT, torrentFileName)
  }

  // Expects a torrentSummary
  // Returns a torrentID: filename, magnet URI, or infohash
  static getTorrentId(torrentSummary) {
    const s = torrentSummary
    if (s.torrentFileName) { // Load torrent file from disk
      return this.getTorrentPath(s)
    } else { // Load torrent from DHT
      return s.magnetURI || s.infoHash
    }
  }

  // Expects a torrentKey or infoHash
  // Returns the corresponding torrentSummary, or undefined
  static getByKey(state, torrentKey) {
    if (!torrentKey) return undefined
    return state.saved.torrents.find((x) =>
      x.torrentKey === torrentKey || x.infoHash === torrentKey)
  }

  // Returns the path to either the file (in a single-file torrent) or the root
  // folder (in  multi-file torrent)
  // WARNING: assumes that multi-file torrents consist of a SINGLE folder.
  // TODO: make this assumption explicit, enforce it in the `create-torrent`
  // module. Store root folder explicitly to avoid hacky path processing below.
  static getFileOrFolder(torrentSummary) {
    const ts = torrentSummary
    if (!ts.path || !ts.files || ts.files.length === 0) return null
    const dirname = ts.files[0].path.split(path.sep)[0]
    return path.join(ts.path, dirname)
  }

}
