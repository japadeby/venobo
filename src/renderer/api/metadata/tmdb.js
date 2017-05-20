import axios from 'axios'

import HTTP from '../../lib/http'
import config from '../../../config'

export default class TMDbProvider {

  uri: String
  api: String

  constructor(state) {
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

  getShow(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/tv/${tmdbId}?${uri}`)
  }

  getShowSeason(tmdbId: Number, season: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/tv/${tmdbId}/season/${season}?${uri}`)
  }

  getShowSeasonEpisode(tmdbId: Number, season: Number, episode: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.get(`${api}/tv/${tmdbId}/season/${season}/episode/${episode}?${uri}`)
  }

  getShowExternalIds(tmdbId: Number) {
    const {api, uri} = this

    return HTTP.get(`${api}/tv/${tmdbId}/external_ids?${uri}`)
  }

  searchAll(query: String) {
    const {api, uri} = this

    return HTTP.get(`${api}/search/multi?${uri}&page=1&include_adult=false&query=${query}`)
  }

}
