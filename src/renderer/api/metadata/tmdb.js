import axios from 'axios'

import HTTP from '../../lib/http'
import config from '../../../config'
import {encodeUri} from '../torrents/provider'

export default class TMDbProvider {

  uri: String
  api: String

  constructor(state) {
    this.uri = `api_key=${config.TMDB.KEY}&language=${state.saved.prefs.iso4}`
    this.api = `${config.TMDB.API}/3`
    this.api4 = `${config.TMDB.API}/4`
  }

  formatEpisodePoster(path: String): String {
    return `${config.TMDB.STILL}${path}`
  }

  formatBackdrop(path: String): String {
    return `${config.TMDB.BACKDROP}${path}`
  }

  formatPoster(path: String): String {
    return `${config.TMDB.POSTER}${path}`
  }

  getSimilar(type: String, tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    type = type === 'shows' ? 'tv' : 'movie'

    return HTTP.fetchLimit(`${api}/${type}/${tmdbId}/similar?${uri}`)
      .then(data => data.results)
  }

  getRecommendations(type: String, tmdbId: Number): Promise<Array> {
    const {api, uri} = this

    type = type === 'show' ? 'tv' : 'movie'

    return HTTP.fetchLimit(`${api}/${type}/${tmdbId}/recommendations?${uri}`)
      .then(data => data.results)
  }

  getPopularMovies(): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimitCache(`${api}/movie/popular?${uri}`)
      .then(data => data.results)
  }

  getTopRatedMovies(): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimitCache(`${api}/movie/top_rated?${uri}`)
      .then(data => data.results)
  }

  getMovie(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimit(`${api}/movie/${tmdbId}?${uri}`)
  }

  getPopularShows(): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimitCache(`${api}/tv/popular?${uri}`)
      .then(data => data.results)
  }

  getTopRatedShows(): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimitCache(`${api}/tv/top_rated?${uri}`)
      .then(data => data.results)
  }

  getShow(tmdbId: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimit(`${api}/tv/${tmdbId}?${uri}`)
  }

  getShowSeason(tmdbId: Number, season: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimit(`${api}/tv/${tmdbId}/season/${season}?${uri}`)
  }

  getShowSeasonEpisode(tmdbId: Number, season: Number, episode: Number): Promise<Object> {
    const {api, uri} = this

    return HTTP.fetchLimit(`${api}/tv/${tmdbId}/season/${season}/episode/${episode}?${uri}`)
  }

  searchAll(query: String, page: Number = 1) {
    const {api, uri} = this

    return HTTP.fetchLimit(`${api}/search/multi?${uri}&page=${page}&query=${query}`)
      .then(data => data.results)
  }

  discover(type: String, args: Object): Promise<Object> {
    const {api, uri} = this

    type = type === 'shows' ? 'tv' : 'movie'

    return HTTP.fetchLimitCache(`${api}/discover/${type}?${uri}&${encodeUri(args)}`)
  }

}
