import async from 'async'

import TMDbProvider from './tmdb'
import TorrentAdapter from '../torrents/adapter'

import { CACHE as Cache } from '../../../config'

export default class MetadataAdapter {

  static TMDb: Object
  static state: Object
  static iso: String

  static setup(state: Object) {
    this.iso = state.saved.prefs.iso2
    this.state = state
    this.TMDb = new TMDbProvider(state)
  }

  static formatReleaseYear(date: String): String {
    return date
      ? date.substring(0, 4)
      : 'Unknown'
  }

  static discover(type: String, args: Object) {
    const {TMDb, state, iso} = this
    const {discover} = state.media.lists

    const key = JSON.stringify({type, args})
    const cacheId = `discover-${key}-${iso}`

    const method = type === 'shows'
      ? 'checkShow'
      : 'getMovieById'

    return new Promise((resolve, reject) => {
      if (!discover.hasOwnProperty(key)) {
        discover[key] = []
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            discover[key] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.discover(type, args)
              .then(data => {
                async.each(data.results, (tmdb, next) => {
                  this[method].call(this, tmdb.id)
                    .then(data => {
                      discover[key].push(data)
                      next()
                    })
                    .catch(() => next())
                }, function(err) {
                  Cache.write(cacheId, discover[key], resolve)
                })
              })
              .catch(reject)
          })
      } else {
        resolve(discover[key])
      }
    })
  }

  static formatShowEpisodeMetadata(data: Object, torrents: Object): Object {
    const {TMDb} = this

    return {
      title: data.name,
      episode: data.episode_number,
      poster: TMDb.formatEpisodePoster(data.still_path),
      summary: data.overview,
      votes: data.vote_count,
      voted: data.vote_average,
      air_date: data.air_date,
      torrents
    }
  }

  static formatShowMetadata(data: Object, torrents: Object = {}): Object {
    const {TMDb} = this

    return {
      title: data.name,
      original_title: data.original_name,
      poster: TMDb.formatPoster(data.poster_path),
      backdrop: TMDb.formatBackdrop(data.backdrop_path),
      genres: data.genres.map(genre => {
        return genre.name
      }),
      type: 'show',
      summary: data.overview,
      popularity: data.popularity,
      tmdb: data.id,
      //imdb: data.imdb_id,
      year: this.formatReleaseYear(data.first_air_date),
      release_date: data.first_air_date,
      voted: data.vote_average,
      votes: data.vote_count,
      season_episodes: torrents,
      episodes_count: data.episodeCount,
      seasons_count: data.number_of_seasons
    }
  }

  static saveMovieMetadata(data: Object, torrents: Object): Object {
    const {state, iso} = this

    const formattedData = state.media.movies[data.id] = this.formatMovieMetadata(data, torrents)

    Cache.writeSync(`movie-${data.id}-${iso}`, formattedData)

    return formattedData
  }

  static saveShowMetadata(data: Object, torrents: Object): Object {
    const {state, iso} = this

    const formattedData = state.media.shows[data.id] = this.formatShowMetadata(data, torrents)

    Cache.writeSync(`show-${data.id}-${iso}`, formattedData)

    return formattedData
  }

  static formatMovieMetadata(data: Object, torrents: Object = {}): Object {
    const {TMDb} = this

    return {
      title: data.title,
      original_title: data.original_title,
      poster: TMDb.formatPoster(data.poster_path),
      backdrop: TMDb.formatBackdrop(data.backdrop_path),
      genres: data.genres.map(genre => {
        return genre.name
      }),
      type: 'movie',
      summary: data.overview,
      popularity: data.popularity,
      tmdb: data.id,
      imdb: data.imdb_id,
      year: this.formatReleaseYear(data.release_date),
      release_date: data.release_date,
      voted: data.vote_average,
      votes: data.vote_count,
      runtime: (data.runtime) ? `${data.runtime}min` : 'N/A',
      released: (data.status === "Released"),
      torrents: torrents
    }
  }

  static addShowTorrents(data: Object, ...args): Promise {
    return new Promise((resolve, reject) => {
      TorrentAdapter(data.imdb_id, 'shows', {
        search: data.original_title,
        ...args
      })
        .then(torrents => {
          if (!torrents) {
            reject()
          } else {
            resolve(this.saveShowMetadata(data, torrents))
          }
        })
    })
  }

  static addMovieTorrents(data: Object): Promise {
    return new Promise((resolve, reject) => {
      TorrentAdapter(data.imdb_id, 'movies', {
        search: data.original_title
      })
        .then(torrents => {
          if (!torrents) {
            reject()
          } else {
            resolve(this.saveMovieMetadata(data, torrents))
          }
        })
    })
  }

  static getSimilar(type: String, tmdbId: Number): Promise<Array> {
    const {TMDb, state, iso} = this
    const {similar} = state.media.lists[`${type}s`]
    const cacheId = `gs${type}-${tmdbId}-${iso}`

    const method = type === 'show'
      ? 'checkShow'
      : 'getMovieById'

    return new Promise((resolve, reject) => {
      if (!similar.hasOwnProperty(tmdbId)) {
        similar[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            similar[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getSimilar(type, tmdbId)
              .then(media => {
                async.each(media, (tmdb, next) => {
                  this[method].call(this, tmdb.id)
                    .then(data => {
                      similar[tmdbId].push(data)
                      next()
                    })
                    .catch(() => next())
                }, function(err) {
                  if (err) {
                    reject(err)
                  } else {
                    Cache.write(cacheId, similar[tmdbId], resolve)
                  }
                })
              })
              .catch(reject)
          })
      } else {
        resolve(similar[tmdbId])
      }
    })
  }

  static getRecommendations(type: String, tmdbId: Number): Promise<Array> {
    const {TMDb, state, iso} = this
    const {recommendations} = state.media.lists[`${type}s`]
    const cacheId = `g${type}r-${tmdbId}-${iso}`

    const method = type === 'show'
      ? 'checkShow'
      : 'getMovieById'

    return new Promise((resolve, reject) => {
      if (!recommendations.hasOwnProperty(tmdbId)) {
        recommendations[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            recommendations[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getRecommendations(type, tmdbId)
              .then(data => {
                async.each(data, (tmdb, next) => {
                  this[method].call(this, tmdb.id)
                    .then(data => {
                      recommendations[tmdbId].push(data)
                      next()
                    })
                    .catch(() => next())
                }, (err) => {
                  if (err) {
                    reject(err)
                  } else {
                    Cache.write(cacheId, recommendations[tmdbId], resolve)
                  }
                })
              })
              .catch(reject)
          })
      } else {
        resolve(recommendations[tmdbId])
      }
    })
  }

  static getPopular(type: String): Promise {
    const {TMDb, state, iso} = this
    let {popular} = state.media.lists[type]
    const cacheId = `gp-${type}-${iso}`

    const method = type === 'shows'
      ? 'checkShow'
      : 'getMovieById'

    return new Promise((resolve, reject) => {
      if (popular.length === 0) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            popular = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getPopular(type)
              .then(medias => {
                async.each(medias, (media, next) => {
                  this[method].call(this, media.id)
                    .then(data => {
                      popular.push(data)
                      next()
                    })
                    .catch(() => next())
                }, (err) => {
                  if (err) {
                    reject(err)
                  } else {
                    Cache.write(cacheId, popular, resolve)
                  }
                })
              })
              .catch(reject)
          })
      } else {
        resolve(popular)
      }
    })
  }

  static getTopRated(type: String): Promise {
    const {TMDb, state, iso} = this
    let {topRated} = state.media.lists[type]
    const cacheId = `gtr-${type}-${iso}`

    const method = type === 'shows'
      ? 'checkShow'
      : 'getMovieById'

    return new Promise((resolve, reject) => {
      if (topRated.length === 0) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            topRated = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getTopRated('shows')
              .then(medias => {
                async.each(medias, (media, next) => {
                  this[method].call(this, media.id)
                    .then(data => {
                      topRated.push(data)
                      next()
                    })
                    .catch(() => next())
                }, (err) => {
                  if (err) {
                    reject(err)
                  } else {
                    Cache.write(cacheId, topRated, resolve)
                  }
                })
              })
              .catch(reject)
          })
      } else {
        resolve(topRated)
      }
    })
  }

  /**
   * @param {Number} tmdbId
   * @return {Promise}
   */
  static getMovieById(tmdbId: Number): Promise {
    const {state, TMDb, iso} = this
    const {movies} = state.media

    return new Promise((resolve, reject) => {
      if (!movies.hasOwnProperty(tmdbId)) {
        Cache.isNotExpiredThenRead(`movie-${tmdbId}-${iso}`)
          .then(data => {
            movies[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.get('movie', tmdbId)
              .then(data => {
                if (data.status !== "Released") return reject()

                this.addMovieTorrents(data)
                  .then(resolve)
                  .catch(reject)
              })
              .catch(reject)
          })
      } else {
        resolve(movies[tmdbId])
      }
    })
  }

  static checkShow(tmdbId: Object): Promise {
    const {state, TMDb} = this
    const cacheId = `cs-${tmdbId}`

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(cacheId)
        .then(resolve)
        .catch(() => {
          TMDb.get('show', tmdbId)
            .then(show => {
              TorrentAdapter(undefined, 'shows', {
                search: show.original_name,
                season: 1,
                episode: 1
              })
                .then(torrents => {
                  if (torrents) {
                    Cache.write(cacheId, this.formatShowMetadata(show, torrents), resolve)
                  } else {
                    reject()
                  }
                })
            })
            .catch(reject)
        })
    })
  }

  static getShowById(tmdbId: Number): Promise {
    const {state, TMDb, iso} = this
    const {shows} = state.media

    return new Promise((resolve, reject) => {
      if (!shows.hasOwnProperty(tmdbId)) {
        Cache.existsThenRead(`show-${tmdbId}-${iso}`)
          .then(data => {
            shows[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getShow(tmdbId)
              .then(show => {
                let seasons = {}
                show.episodeCount = 0

                async.forEachOf(show.seasons, (value, index, nextSeason) => {
                  const season = value.season_number
                  if (season === 0) return nextSeason(null)
                  seasons[season] = {}

                  async.times(value.episode_count, (index, nextEpisode) => {
                    const episode = index + 1

                    TMDb.getShowSeasonEpisode(tmdbId, season, episode)
                      .then(data => {
                        TorrentAdapter(undefined, 'shows', {
                          search: show.original_name,
                          season,
                          episode
                        })
                          .then(torrents => {
                            if (torrents) {
                              show.episodeCount++
                              seasons[season][episode] = this.formatShowEpisodeMetadata(data, torrents)
                            }
                            nextEpisode(null, torrents)
                          })
                      })
                      .catch(nextEpisode)
                  }, function(err, data) {
                    nextSeason(err, data)
                  })
                }, (err) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(this.saveShowMetadata(show, seasons))
                  }
                })
              })
              .catch(reject)
          })
      } else {
        resolve(shows[tmdbId])
      }
    })
  }

  static quickSearch(query: String, limit: Number = 100): Promise {
    const {state, TMDb} = this
    const {shows, movies} = state.media

    return new Promise((resolve, reject) => {
      TMDb.searchAll(query)
        .then(data => {
          const searchResults = data.slice(0, limit)
          let fetchedQueries = []

          async.each(searchResults, (res, next) => {
            const method = res.media_type === 'tv'
              ? 'checkShow'
              : 'getMovieById'

            this[method].call(this, res.id)
              .then(data => {
                fetchedQueries.push(data)
                next()
              })
              .catch(() => next())
          }, function(err) {
            if (fetchedQueries.length === 0) {
              reject(err)
            } else {
              resolve(fetchedQueries)
            }
          })
        })
        .catch(reject)
    })
  }

}
