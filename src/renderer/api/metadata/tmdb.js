import HTTP from '../../lib/http'
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

  getMovieRecommendations(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/movie/${tmdbId}/recommendations?${uri}`)
      .then(data => data.results)
  }

  getSimilarMovies(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/movie/${tmdbId}/similar?${uri}`)
      .then(data => data.results)
  }

  getPopularMovies(): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/movie/popular?${uri}`)
      .then(data => data.results)
  }

  getTopRatedMovies(): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/movie/top_rated?${uri}`)
      .then(data => data.results)
  }

  getMovie(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/movie/${tmdbId}?${uri}`)
  }

}
