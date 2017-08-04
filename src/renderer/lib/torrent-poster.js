import captureFrame from 'capture-frame'
import path from 'path'

export default function (torrent, callback) {
  // First, try to use a poster image if available
  const posterFile = torrent.files.filter(file => {
    return /^poster\.(jpg|png|gif)$/.test(file.name)
  })[0]
  if (posterFile) return torrentPosterFromImage(posterFile, torrent, callback)

  // Second, try to use the largest video file
  // Filter out file formats that the <video> tag definitely can't play
  const videoFile = getLargestFileByExtension(torrent, ['.mp4', '.m4v', '.webm', '.mov', '.mkv', '.avi'])
  if (videoFile) return torrentPosterFromVideo(videoFile, torrent, callback)

  // Third, try to use the largest image file
  const imgFile = getLargestFileByExtension(torrent, ['.gif', '.jpg', '.jpeg', '.png'])
  if (imgFile) return torrentPosterFromImage(imgFile, torrent, callback)

  // TODO: generate a waveform from the largest sound file
  // Finally, admit defeat
  return callback(new Error('Cannot generate a poster from any files in the torrent'))
}

function getLargestFileByExtension (torrent, extensions) {
  const files = torrent.files.filter(file => {
    const extname = path.extname(file.name).toLowerCase()
    return extensions.indexOf(extname) !== -1
  })

  if (files.length === 0) return undefined
  return files.reduce((a, b) => (a.length > b.length ? a : b))
}

function torrentPosterFromVideo (file, torrent, callback) {
  const index = torrent.files.indexOf(file)

  const server = torrent.createServer(0)
  server.listen(0, () => {
    const port = server.address().port
    const url = `http://localhost/${port}/${index}`
    const video = document.createElement('video')

    video.addEventListener('canplay', onCanPlay)

    video.volume = 0
    video.src = url
    video.play()

    function onCanPlay() {
      video.removeEventListener('canplay', this)
      video.addEventListener('seeked', onSeeked)

      video.currentTime = Math.min((video.duration || 600) * 0.03, 60)
    }

    function onSeeked () {
      video.removeEventListener('seeked', this)

      const buffer = captureFrame(video)

      // unload video element
      video.pause()
      video.src = ''
      video.load()

      server.destroy()

      if (buffer.length === 0) return callback(new Error('Generated poster contains no data'))
      callback(null, buffer, '.jpg')
    }
  })
}

function torrentPosterFromImage (file, torrent, callback) {
  const extname = path.extname(file.name)
  file.getBuffer((err, buf) => callback(err, buf, extname))
}
