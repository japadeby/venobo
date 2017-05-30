import async from 'async'

import TMDbProvider from './tmdb'
import TorrentAdapter from '../torrents/adapter'

export default class MetadataAdapter {

  static Cache: Object
  static TMDb: Object
  static state: Object
  static iso: String

  static setState(state: Object) {
    this.iso = state.saved.prefs.iso2
    this.state = state
    this.Cache = state.cache
    this.TMDb = new TMDbProvider(state)
  }

  static formatReleaseYear(date: String): String {
    return date
      ? date.substring(0, 4)
      : 'Unknown'
  }

  static discover(type: String, args: Object) {
    const {TMDb, Cache, state, iso} = this
    const {discover} = state.media.lists.movies

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

  static saveShowMetadata(data: Object, torrents: Object): Object {
    const {state, Cache, iso} = this

    const formattedData = state.media.shows[data.id] = this.formatShowMetadata(data, torrents)

    Cache.writeSync(`show-${data.id}-${iso}`, formattedData)

    return formattedData
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
    const {state, Cache, iso} = this

    const formattedData = state.media.movies[data.id] = this.formatMovieMetadata(data, torrents)

    Cache.writeSync(`movie-${data.id}-${iso}`, formattedData)

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
    const {TMDb, state, Cache, iso} = this
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
    const {TMDb, state, Cache, iso} = this
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

  static getPopularShows(): Promise {
    const {TMDb, state, Cache, iso} = this
    let {popular} = state.media.lists.shows
    const cacheId = `gps-${iso}`

    return new Promise((resolve, reject) => {
      if (popular.length === 0) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            popular = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getPopularShows()
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.checkShow(show.id)
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

  static getTopRatedShows(): Promise {
    const {TMDb, state, Cache, iso} = this
    let {topRated} = state.media.lists.shows
    const cacheId = `gtrs-${iso}`

    return new Promise((resolve, reject) => {
      if (topRated.length === 0) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            topRated = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getTopRatedShows()
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.checkShow(show.id)
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

  static getPopularMovies(): Promise {
    const {TMDb, state, Cache, iso} = this
    let {popular} = state.media.lists.movies
    const cacheId = `gpm-${iso}`

    return new Promise((resolve, reject) => {
      if (!popular.length) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            popular = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getPopularMovies()
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.getMovieById(show.id)
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

  static getTopRatedMovies(): Promise {
    const {TMDb, state, Cache, iso} = this
    let {topRated} = state.media.lists.movies
    const cacheId = `gtrm-${iso}`

    return new Promise((resolve, reject) => {
      if (!topRated.length) {
        Cache.isNotExpiredThenRead(cacheId)
          .then(data => {
            topRated = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getTopRatedMovies()
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.getMovieById(show.id)
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
    const {state, TMDb, Cache, iso} = this
    const {movies} = state.media

    return new Promise((resolve, reject) => {
      if (!movies.hasOwnProperty(tmdbId)) {
        Cache.isNotExpiredThenRead(`movie-${tmdbId}-${iso}`)
          .then(data => {
            movies[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getMovie(tmdbId)
              .then(data => {
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
    const {state, TMDb, Cache} = this
    const cacheId = `cs-${tmdbId}`

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(cacheId)
        .then(resolve)
        .catch(() => {
          TMDb.getShow(tmdbId)
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

  static getMediaById(type: String, tmdbId: Number): Promise {
    type = type.charAt(0).toUpperCase() + type.slice(1)

    console.log(`getBy${type}Id`)

    return this[`getBy${type}Id`].call(this, tmdbId)
  }

  static getShowById(tmdbId: Number): Promise {
    const {state, TMDb, Cache, iso} = this
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

  static quickSearch(query: String, limit: Number = 15): Promise {
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
            if (fetchedQueries.length == 0) {
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
