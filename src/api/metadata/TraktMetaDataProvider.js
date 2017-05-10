import axios from 'axios'
import Trakt from 'trakt.tv'
import OpenSubtitles from 'opensubtitles-api'

export default class TraktMetaDataProvider {

  extended = 'full,images,metadata'

  constructor() {
    this.trakt = new Trakt({
      client_id: '647c69e4ed1ad13393bf6edd9d8f9fb6fe9faf405b44320a6b71ab960b4540a2',
      client_secret: 'f55b0a53c63af683588b47f6de94226b7572a6f83f40bd44c58a7c83fe1f2cb1'
    })
  }

  getPopularMovies(page: Number = 1, limit: Number = 50): Promise<Object> {
    return this.trakt.movies.popular({
      paginate: true,
      page,
      limit,
      extended: this.extended
    }).then(movies => {
      movies.map(movie => formatMetadata(movie, 'movies'))
    })
  }

  getMovie(tmdbId: String): Object {
    return this.trakt.movies.summary({
      id: tmdbId,
      extended: this.extended
    }).then(movie => {
      formatMetadata(movie, 'movies')
    })
  }

  getPopularShows(page: Number = 1, limit: Number = 50): Promise<Object> {
    return this.trakt.shows.popular({
      paginate: true,
      page,
      limit,
      extended: this.extended
    }).then(shows => {
      shows.map(show => formatMetadata(show, 'shows'))
    })
  }

  getShow(tmdbId: String): Object {
    return this.trakt.show.summary({
      id: tmdbId,
      extended: this.extended
    }).then(show => {
      formatMetadata(show, 'shows')
    })
  }

  getSeasons(tmdbId: String): Array<Object> {
    return this.trakt.seasons.summary({
      id: tmdbId,
      extended: this.extended
    })
    .then(res => res.filter(season => season.aired_episodes !== 0).map(season => ({
        season: season.number + 1,
        overview: season.overview,
        id: season.ids.tmdb,
        images: {
          full: season.images.poster.full,
          medium: season.images.poster.medium,
          thumb: season.images.poster.thumb
        }
    })))
  }

  getSeason(tmdbId: String, season: Number): Object {
    return this.trakt.seasons.season({
      id: tmdbId,
      season,
      extended: this.extended
    }).then(episodes => {
      episodes.map(episode => formatSeason(episode))
    })
  }

  getEpisode(tmdbId: String, season: Number, episode: Number): Object {
    return this.trakt.episodes.summary({
      id: tmdbId,
      season,
      episode,
      extended: this.extended
    })
    .then(res => formatSeason(res))
  }

  search(query: String, page: Number = 1): Array<Object> {
    if (!query) {
      throw Error('Query parameter required')
    }

    return axios.get('')
      .then(res => res.data)
  }

  getS

}
