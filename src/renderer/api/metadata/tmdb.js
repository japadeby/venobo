import HTTP from '../../utils/http'
import config from '../../../config'

export default class TMDbProvider {

  state: Object
  uri: String
  api: String

  constructor(state) {
    this.state = state
    this.uri = `api_key=${config.TMDB.KEY}&language=${state.saved.prefs.iso4}`
    this.api = config.TMDB.API
  }

  formatBackdrop(path: String): String {
    return `${config.TMDB.BACKDROP}${path}`
  }

  formatPoster(path: String): String {
    return `${config.TMDB.POSTER}${path}`
  }

  getMovieRecommendations(tmdbId: Number, callback: Function) {
    const {api, uri} = this

    HTTP.get(`${api}/movie/${tmdbId}/recommendations?${uri}`, (data) => {
      callback(data.results)
    })
  }

  getSimilarMovies(tmdbId: Number, callback: Function) {
    const {api, uri} = this

    HTTP.get(`${api}/movie/${tmdbId}/similar?${uri}`, (data) => {
      callback(data.results)
    })
  }

  getPopularMovies(callback: Function) {
    const {api, uri} = this

    HTTP.get(`${api}/movie/popular?${uri}`, (data) => {
      callback(data.results)
    })
  }

  getTopRatedMovies(callback: Function) {
    const {api, uri} = this

    HTTP.get(`${api}/movie/top_rated?${uri}`, (data) => {
      callback(data.results)
    })
  }

  /**
   * @param {String} tmdbId
   * @return {Promise}
   */
  getMovie(tmdbId: String, callback: Function) {
    const {api, uri} = this

    HTTP.get(`${api}/movie/${tmdbId}?${uri}`, callback)
  }

}
