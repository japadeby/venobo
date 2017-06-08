import concat from 'simple-concat'
import srtToVtt from 'srt-to-vtt'

export default class SubtitlesController {

  state: Object
  config: Object
  OS: Object

  constructor(state: Object, config: Object) {
    this.state = state
    this.config = config
    this.OS = new OpenSubtitles('OSTestUserAgent')
  }

  selectSubtitle(ix: Number) {
    this.state.playing.subtitles.selectedIndex = ix
  }

  findSubtitles(tmdbId: Number, type: String, options: Object) {
    const {watched} = this.state.saved

    const defaultOptions = {
      extensions: ['srt', 'vtt'],
      gzip: true
    }

    const assignedOptions = Object.assign(defaultOptions, options)

    this.OS.search(assignedOptions)
      .then(subtitles => {
        if (type === 'shows') {
          watched.shows[tmdbId][options.season][options.episode].subtitles = {
            ...subtitles,
            unzipped: false
          }
        } else {
          watched.movies[tmdbId].subtitles = {
            ...subtitles,
            unzipped: false
          }
        }
      })
  }

  loadSubtitle(gzip, callback) {
    const vttStream = fs.createReadStream(filePath).pipe(srtToVtt())

    concat(vttStream, (err, buf) => {
      if (err) return dispatch('error', 'Can\'t parse subtitles file.')

      //buffer: 'data:text/vtt;base64,' + buf.toString('base64')
    })
  }

}
