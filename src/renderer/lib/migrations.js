import fs from 'fs'
import path from 'path'
import semver from 'semver'
import config from '../../config'
import cpFile from 'cp-file'
import TorrentSummary from './torrent-summary'
import rimraf from 'rimraf'

// Change `state.saved` (which will be saved back to config.json on exit) as
// needed, for example to deal with config.json format changes across versions
export default function (state) {
  let {version} = state.saved
  let {saved} = state
  // Replace '{ version: 1 }' with app version (semver)
  if (!semver.valid(version)) {
    version = '0.0.0' // Pre-0.7.0 version, so run all migrations
  }

  if (semver.lt(version, '0.7.0')) migrate_0_7_0(saved)
  if (semver.lt(version, '0.12.0')) migrate_0_12_0(saved)
  if (semver.lt(version, '0.14.0')) migrate_0_14_0(saved)
  if (semver.lt(version, '0.17.0')) migrate_0_17_0(saved)

  // Config is now on the new version
  version = config.APP.VERSION
}

function migrate_0_7_0 (saved) {
  saved.torrents.forEach(function (ts) {
    const infoHash = ts.infoHash

    // Replace torrentPath with torrentFileName
    // There are a number of cases to handle here:
    // * Originally we used absolute paths
    // * Then, relative paths for the default torrents, eg '../static/sintel.torrent'
    // * Then, paths computed at runtime for default torrents, eg 'sintel.torrent'
    // * Finally, now we're getting rid of torrentPath altogether
    let src, dst
    if (ts.torrentPath) {
      if (path.isAbsolute(ts.torrentPath) || ts.torrentPath.startsWith('..')) {
        src = ts.torrentPath
      } else {
        src = path.join(config.PATH.STATIC, ts.torrentPath)
      }
      dst = path.join(config.PATH.TORRENT, `${infohash}.torrent`)
      // Synchronous FS calls aren't ideal, but probably OK in a migration
      // that only runs once
      if (src !== dst) cpFile.sync(src, dst)

      delete ts.torrentPath
      ts.torrentFileName = `${infohash}.torrent`
    }

    // Replace posterURL with posterFileName
    if (ts.posterURL) {
      const extension = path.extname(ts.posterURL)
      src = path.isAbsolute(ts.posterURL)
        ? ts.posterURL
        : path.join(config.PATH.STATIC, ts.posterURL)
      dst = path.join(config.PATH.POSTER, infoHash + extension)
      // Synchronous FS calls aren't ideal, but probably OK in a migration
      // that only runs once
      if (src !== dst) cpFile.sync(src, dst)

      delete ts.posterURL
      ts.posterFileName = infoHash + extension
    }

    // Fix exception caused by incorrect file ordering.
    // https://github.com/webtorrent/webtorrent-desktop/pull/604#issuecomment-222805214
    delete ts.defaultPlayFileIndex
    delete ts.files
    delete ts.selections
    delete ts.fileModtimes
  })
}

function migrate_0_12_0 (saved) {
  if (saved.prefs.openExternalPlayer == null && saved.prefs.playInVlc != null) {
    saved.prefs.openExternalPlayer = saved.prefs.playInVlc
  }
  delete saved.prefs.playInVlc

  // Undo a terrible bug where clicking Play on a default torrent on a fresh
  // install results in a "path missing" error
  // See https://github.com/webtorrent/webtorrent-desktop/pull/806
  const defaultTorrentFiles = [
    '6a9759bffd5c0af65319979fb7832189f4f3c35d.torrent',
    '88594aaacbde40ef3e2510c47374ec0aa396c08e.torrent',
    '6a02592d2bbc069628cd5ed8a54f88ee06ac0ba5.torrent',
    '02767050e0be2fd4db9a2ad6c12416ac806ed6ed.torrent',
    '3ba219a8634bf7bae3d848192b2da75ae995589d.torrent'
  ]
  saved.torrents.forEach(function (torrentSummary) {
    if (!defaultTorrentFiles.includes(torrentSummary.torrentFileName)) return
    const fileOrFolder = TorrentSummary.getFileOrFolder(torrentSummary)
    if (!fileOrFolder) return
    try {
      fs.statSync(fileOrFolder)
    } catch (err) {
      // Default torrent with "missing path" error. Clear path.
      delete torrentSummary.path
    }
  })
}

function migrate_0_14_0 (saved) {
  saved.torrents.forEach(function (ts) {
    delete ts.defaultPlayFileIndex
  })
}

function migrate_0_17_0 (saved) {
  // Fix a sad, sad bug that resulted in 100MB+ config.json files
  saved.torrents.forEach(function (ts) {
    if (!ts.files) return
    ts.files.forEach(function (file) {
      if (!file.audioInfo || !file.audioInfo.picture) return
      // This contained a Buffer, which 30x'd in size when serialized to JSON
      delete file.audioInfo.picture
    })
  })
}
