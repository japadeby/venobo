import Cast from '../lib/cast'
import {ipcRenderer} from 'electron'

export default class PlaybackController {

  state: Object
  config: Object
  mediaTag: Object
  initialized: Boolean = false

  constructor(state, config) {
    this.state = state
    this.config = config
  }

  // Set the current media tag
  setMediaTag(mediaTag) {
    this.mediaTag = mediaTag
  }

  // Play a file in a torrent.
  // * Start torrenting, if necessary
  // * Stream, if not already fully downloaded
  // * If no file index is provided, restore the most recently viewed file or autoplay the first
  playFile(infoHash, index) {
    const {state} = this

    this.pauseActiveTorrents(infoHash)

    const torrentSummary = TorrentSummary.getByKey(state, infoHash)

    if (index === undefined || this.initialized) index = torrentSummary.mostRecentFileIndex
    if (index === undefined) index = torrentSummary.files.findIndex(TorrentPlayer.isPlayable)
    if (index === undefined) return dispatch('error', 'Unplayable torrent')

    this.initialized = true

    this.openPlayer(infoHash, index, (err) => {
      if (!err) this.play()
      else dispatch('error', 'Cannot open player')
    })
  }

  // Play next file in list (if any)
  nextTrack() {
    const {state} = this

    if (Playlist.hasNext(state) && state.playing.location !== 'external') {
      this.updatePlayer(
        state.playing.infoHash, PlayList.getNextIndex(state), false, (err) => {
          if (err) dispatch('error', err)
          else this.play()
        }
      )
    }
  }

  // Play previous track (if any)
  previousTrack() {
    const {state} = this

    if (Playlist.hasPrevious(state) && state.playing.location !== 'external') {
      this.updatePlayer(
        state.playing.infoHash, Playlist.getPreviousIndex(state), false, (err) => {
          if (err) dispatch('error', err)
          else this.play()
        }
      )
    }
  }

  pauseActiveTorrents(infoHash) {
    // Playback Priority: pause all active torrents if needed.
    if (!this.state.saved.prefs.highestPlaybackPriority) return

    // Do not pause active torrents if playing a fully downloaded torrent.
    const torrentSummary = TorrentSummary.getByKey(this.state, infoHash)
    if (torrentSummary.status === 'seeding') return

    dispatch('prioritizeTorrent', infoHash)
  }

  openPlayer(infoHash, index, callback) {
    const {state} = this
    const torrentSummary = TorrentSummary.getByKey(state, infoHash)

    state.playing.infoHash = torrentSummary.infoHash
    state.playing.isReady = false

    // update UI to show pending playback
    sound('PLAY')

    this.startServer(torrentSummary)
    ipcRenderer.send('onPlayerOpen')
    this.updatePlayer(infoHash, index, true, callback)
  }

  // Called each time the current file changes
  updatePlayer (infoHash, index, resume, cb) {
    const {state} = this

    const torrentSummary = TorrentSummary.getByKey(state, infoHash)
    const fileSummary = torrentSummary.files[index]

    if (!TorrentPlayer.isPlayable(fileSummary)) {
      torrentSummary.mostRecentFileIndex = undefined
      return callback('error')
    }

    torrentSummary.mostRecentFileIndex = index

    // update state
    state.playing.infoHash = infoHash
    state.playing.fileIndex = index

    // pick up where we left off
    let jumpToTime = 0
    if (resume && fileSummary.currentTime) {
      const fraction = fileSummary.currentTime / fileSummary.duration
      const secondsLeft = fileSummary.duration - fileSummary.currentTime
      if (fraction < 0.9 && secondsLeft > 10) {
        jumpToTime = fileSummary.currentTime
      }
    }
    state.playing.jumpToTime = jumpToTime

    // if it's audio, parse out the metadata (artist, title, etc)
    if (torrentSummary.status === 'paused') {
      ipcRenderer.once(`wt-ready-${torrentSummary.infoHash}`, getAudioMetadata)
    }

    // if it's video, check for subtitles files that are done downloading
    dispatch('checkForSubtitles')

    // enable previously selected subtitle track
    if (fileSummary.selectedSubtitle) {
      dispatch('addSubtitles', [fileSummary.selectedSubtitle], true)
    }

    state.window.title = fileSummary.name

    // play in VLC if set as default player (Preferences / Playback / Play in VLC)
    if (state.saved.prefs.openExternalPlayer) {
      dispatch('openExternalPlayer')
      this.update()
      return callback()
    }

    // otherwise, play the video
    //this.update()

    ipcRenderer.send('onPlayerUpdate', Playlist.hasNext(state), Playlist.hasPrevious(state))
    callback()
  }

  // Toggle (play or pause) the currently playing media

  playPause() {
    const {state, mediaTag} = this

    if (state.window.isVisible && mediaTag) {
      if (state.playing.isPaused) mediaTag.play()
      else mediaTag.pause()
    }

    if (state.playing.isPaused) this.play()
    else this.pause()
  }

  // Play (unpause) the current media
  play() {
    const {state} = this

    if (!state.playing.isPaused) return
    state.playing.isPaused = false

    if (isCasting(state)) Cast.play()
    ipcRenderer.send('onPlayerPlay')
  }

  // Pause the currently playing media
  pause() {
    const {state} = this

    if (state.playing.isPaused) return
    state.playing.isPaused = true

    if (isCasting(state)) Cast.pause()
    ipcRenderer.send('onPlayerPause')
  }

  skip(time) {
    this.skipTo(this.state.playing.currentTime + time)
  }

  skipTo(time) {
    if (!Number.isFinite(time)) {
      console.error('Tried to skip to a non-finite time ' + time)
      return console.trace()
    }

    if (isCasting(this.state)) {
      Cast.seek(time)
    } else {
      this.state.playing.currentTime = time
      this.mediaTag.currentTime = time
    }
  }

  changePlaybackRate(direction) {
    const {state} = this
    let rate = state.playing.playbackRate

    if (direction > 0 && rate < 2) {
      rate += 0.25
    } else if (direction < 0 && rate > 0.25 && rate <= 2) {
      rate -= 0.25
    } else if (direction > 0 && rate >= 1 && rate < 16) {
      rate *= 2
    } else if (direction < 0 && rate > 1 && rate <= 16) {
      rate /= 2
    }

    state.playing.playbackRate = rate
    if (isCasting(state) && !Cast.setRate(rate)) {
      state.playing.playbackRate = 1
    }
    // Wait a bit before we hide the controls and header again
    state.playing.mouseStationarySince = new Date().getTime()
  }

  // Change the volume, in range [0, 1], by some amount
  // For example, volume muted (0), changeVolume (0.3) increases to 30% volume
  changeVolume(delta) {
    // change volume with delta value
    this.setVolume(this.state.playing.volume + delta)
  }

  setVolume(volume) {
    const {state} = this
    // check if its in [0.0 - 1.0] range
    volume = Math.max(0, Math.min(1, volume))

    if (isCasting(state)) Cast.setVolume(volume)
    else state.playing.setVolume = volume
  }

  // Hide player controls while playing video, if the mouse stays still for a while
  // Never hide the controls when:
  // * The mouse is over the controls or we're scrubbing (see CSS)
  // * The video is paused
  // * The video is playing remotely on Chromecast or Airplay
  showOrHidePlayerControls() {
    const {state} = this
    const hideControls = state.shouldHidePlayerControls()

    if (hideControls !== state.playing.hideControls) {
      state.playing.hideControls = hideControls
      return true
    }
    return false
  }

  // Starts WebTorrent server for media streaming
  startServer(torrentSummary) {
    const {state} = this

    if (torrentSummary.status === 'paused') {
      dispatch('startTorrentingSummary', torrentSummary.torrentKey)
      ipcRenderer.once(`wt-ready-${torrentSummary.infoHash}`, onTorrentReady)
    } else {
      onTorrentReady()
    }

    function onTorrentReady () {
      ipcRenderer.send('wt-start-server', torrentSummary.infoHash)
      ipcRenderer.once('wt-server-running', () => { state.playing.isReady = true })
    }
  }

  closePlayer() {
    const {state} = this
    console.log('closePlayer')

    // Quit any external players, like Chromecast/Airplay/etc or VLC
    if (isCasting(state)) Cast.stop()

    if (state.playing.location === 'external') {
      ipcRenderer.send('quitExternalPlayer')
    }

    // Save volume (this session only, not in state.saved)
    state.previousVolume = state.playing.volume

    //if (!state.playing.isReady) telemetry.logPlayAttempt('abandoned') // user gave up waiting

    // Reset the window contents back to the home screen
    state.playing = State.getDefaultPlayState()
    state.server = null

    // Reset the window size and location back to where it was
    if (state.window.isFullScreen) {
      dispatch('toggleFullScreen', false)
    }

    // Tell the WebTorrent process to kill the torrent-to-HTTP server
    ipcRenderer.send('wt-stop-server')

    ipcRenderer.send('onPlayerClose')
  }

}

// Checks whether we are connected and already casting
// Returns false if we not casting (state.playing.location === 'local')
// or if we're trying to connect but haven't yet ('chromecast-pending', etc)
function isCasting (state) {
  return state.playing.location === 'chromecast' ||
    state.playing.location === 'airplay' ||
    state.playing.location === 'dlna'
}
