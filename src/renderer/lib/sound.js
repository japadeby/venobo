import {PATH} from '../../config'
import path from 'path'

const VOLUME = 0.25

/* Cache of Audio elements, for instant playback */
const cache = {}

const soundPath = path.join(PATH.STATIC, 'sound')

const sounds = {
  ADD: {
    url: `file://${path.join(soundPath, 'add.wav')}`,
    volume: VOLUME
  },
  DELETE: {
    url: `file://${path.join(soundPath, 'delete.wav')}`,
    volume: VOLUME * 0.5
  },
  DISABLE: {
    url: `file://${path.join(soundPath, 'disable.wav')}`,
    volume: VOLUME * 0.5
  },
  DONE: {
    url: `file://${path.join(soundPath, 'done.wav')}`,
    volume: VOLUME
  },
  ENABLE: {
    url: `file://${path.join(soundPath, 'enable.wav')}`,
    volume: VOLUME * 0.5
  },
  ERROR: {
    url: `file://${path.join(soundPath, 'error.wav')}`,
    volume: VOLUME
  },
  PLAY: {
    url: `file://${path.join(soundPath, 'play.wav')}`,
    volume: VOLUME
  },
  STARTUP: {
    url: `file://${path.join(soundPath, 'startup.wav')}`,
    volume: VOLUME
  }
}

export default function (name) {
  let audio = cache[name]
  if (!audio) {
    const sound = sounds[name]
    if (!sound) {
      throw new Error(`Invalid sound name: ${name}`)
    }
    audio = cache[name] = new window.Audio()
    audio.volume = sound.volume
    audio.src = sound.url
  }
  audio.currentTime = 0
  audio.play()
}
