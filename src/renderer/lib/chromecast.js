import Chromecast from 'chromecasts'

import config from '../../config'

export default class ChromecastPlayer {

  cast: Object
  update: Function
  state: Object
  device = null

  constructor(state, callback) {
    this.state = state
    this.update = callback
    this.cast = new Chromecast()

    this.setup(state)
  }

  setup(state) {
    state.devices.chromecast = this

    // TODO: how do we tell if there are *no longer* any Chromecasts available?
    // From looking at the code, chromecasts.players only grows, never shrinks
    this.cast.on('update', (device) => this.addDevice(device))
  }

  addDevice(device) {
    const {state} = this

    device.on('error', (err) => {
      if (device !== this.device) return

      state.playing.location = 'local'
      /*state.errors.push({
        time: new Date().getTime(),
        message: `Could not connect to Chromecast: ${err.message}`
      })
      this.update()*/
    })

    device.on('disconnect', () => {
      if (device !== this.device) return

      state.playing.location = 'local'
    })
  }

  open() {
    const {server, playing} = this.state

    this.device.play(`${server.networkURL}/${playing.fileIndex}`, {
      type: 'video/mp4',
      title: playing.title
    }, (err) => {
      if (err) {
        playing.location = 'local'
        // some errors
      } else {
        playing.location = 'chromecast'
      }
    })
  }

  play(callback) {
    this.device.play(null, null, callback)
  }

  pause(callback) {
    this.device.pause(callback)
  }

  stop(callback) {
    this.device.stop(callback)
  }

  status() {
    this.device.status(this.handleStatus)
  }

  seek(time, callback) {
    this.device.seek(time, callback)
  }

  volume(volume, callback) {
    this.device.volume(volume, callback)
  }

}
