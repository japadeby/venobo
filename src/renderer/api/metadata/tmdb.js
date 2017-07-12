import axios from 'axios'

import HTTP from '../../lib/http'
import config from '../../../config'

export default class TMDbProvider {

  http: Object

  constructor(state) {
    this.http = HTTP.create({
      baseURL: `${config.TMDB.API}/3`,
      params: {
        api_key: config.TMDB.KEY,
        language: state.saved.prefs.iso4,
        append_to_response: 'external_ids,videos'
      }
    })
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
    type = type === 'shows' ? 'tv' : 'movie'

    return this.http.fetchLimit(`${type}/${tmdbId}/similar`)
  }

  getRecommendations(type: String, tmdbId: Number): Promise<Array> {
    type = type === 'show' ? 'tv' : 'movie'

    return this.http.fetchLimit(`${type}/${tmdbId}/recommendations`)
      .then(data => data.results)
  }

  getPopular(type: String, page: Number = 1): Promise<Object> {
    type = type === 'shows' ? 'tv' : 'movie'

    return this.http.fetchLimitCache(`${type}/popular`, { page })
      .then(data => data.results)
  }

  getTopRated(type: String, page: Number = 1): Promise<Object> {
    type = type === 'shows' ? 'tv' : 'movie'

    return this.http.fetchLimitCache(`${type}/top_rated`, { page })
      .then(data => data.results)
  }

  get(type: String, tmdbId: Number): Promise<Object> {
    type = type === 'shows' ? 'tv' : 'movie'

    return this.http.fetchLimit(`${type}/${tmdbId}`)
  }

  getShowSeason(tmdbId: Number, season: Number): Promise<Object> {
    return this.http.fetchLimit(`tv/${tmdbId}/season/${season}`)
  }

  getShowSeasonEpisode(tmdbId: Number, season: Number, episode: Number): Promise<Object> {
    return this.http.fetchLimit(`tv/${tmdbId}/season/${season}/episode/${episode}`)
  }

  searchAll(query: String, page: Number = 1) {
    return this.http.fetchLimit('search/multi', { include_adult: true, page, query })
      .then(data => data.results)
  }

  discover(type: String, params: Object): Promise<Object> {
    type = type === 'shows' ? 'tv' : 'movie'

    return this.http.fetchLimitCache(`discover/${type}`, params)
  }

}
