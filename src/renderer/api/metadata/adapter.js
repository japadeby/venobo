import async from 'async'

import TMDbProvider from './tmdb'
import TorrentAdapter from '../torrents/adapter'

export default class MetadataAdapter {

  static Cache: Object
  static TMDb: Object
  static state: Object

  static setState(state: Object) {
    this.state = state
    this.Cache = state.cache
    this.TMDb = new TMDbProvider(state)
  }

  static saveShowMetadata(data: Object, torrents: Object): Object {
    const {state, Cache} = this

    const formattedData = state.media.shows[data.id] = this.formatShowMetadata(data, torrents)

    Cache.writeSync(`show-${data.id}`, formattedData)

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
      year: data.first_air_date.substring(0, 4),
      release_date: data.first_air_date,
      voted: data.vote_average,
      votes: data.vote_count,
      season_episodes: torrents,
      episodes_count: data.episodeCount,
      seasons_count: data.number_of_seasons
    }
  }

  static saveMovieMetadata(data: Object, torrents: Object): Object {
    const {state, Cache} = this

    const formattedData = state.media.movies[data.id] = this.formatMovieMetadata(data, torrents)

    Cache.writeSync(`movie-${data.id}`, formattedData)

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
        console.log(genre)
        return genre.name
      }),
      type: 'movie',
      summary: data.overview,
      popularity: data.popularity,
      tmdb: data.id,
      imdb: data.imdb_id,
      year: data.release_date.substring(0, 4),
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

  static getSimilarShows(tmdbId: Number): Promise {
    const {TMDb, state, Cache} = this
    const {similar} = state.media.lists.shows
    const cacheId = `gss-${tmdbId}`

    return new Promise((resolve, reject) => {
      if (!similar.hasOwnProperty(tmdbId)) {
        similar[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            console.log('exists')
            similar[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getSimilarShows(tmdbId)
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.checkShow(show.id)
                    .then(data => {
                      similar[tmdbId].push(data)
                      next()
                    })
                    .catch(() => next())
                }, (err) => {
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

  static getShowRecommendations(tmdbId: Number): Promise {
    const {TMDb, state, Cache} = this
    const {recommendations} = state.media.lists.shows
    const cacheId = `gsr-${tmdbId}`

    return new Promise((resolve, reject) => {
      if (!recommendations.hasOwnProperty(tmdbId)) {
        recommendations[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            recommendations[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getShowRecommendations(tmdbId)
              .then(shows => {
                async.each(shows, (show, next) => {
                  this.checkShow(show.id)
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

  static getMovieRecommendations(tmdbId: Number): Promise {
    const {TMDb, state, Cache} = this
    const {recommendations} = state.media.lists.movies
    const cacheId = `gmr-${tmdbId}`

    return new Promise((resolve, reject) => {
      if (!recommendations.hasOwnProperty(tmdbId)) {
        recommendations[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            recommendations[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getMovieRecommendations(tmdbId)
              .then(movies => {
                async.each(movies, (movie, next) => {
                  this.getMovieById(movie.id)
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

  static getSimilarMovies(tmdbId: Number): Promise {
    const {TMDb, state, Cache} = this
    const {similar} = state.media.lists.movies
    const cacheId = `gsm-${tmdbId}`

    return new Promise((resolve, reject) => {
      if (!similar.hasOwnProperty(tmdbId)) {
        similar[tmdbId] = []
        Cache.existsThenRead(cacheId)
          .then(data => {
            similar[tmdbId] = data
          })
        TMDb.getSimilarMovies(tmdbId)
          .then(movies => {
            async.each(movies, (movie, next) => {
              this.getMovieById(movie.id)
                .then(data => {
                  similar[tmdbId].push(data)
                  next()
                })
                .catch(() => next())
            }, (err) => {
              if (err) {
                reject(err)
              } else {
                Cache.write(cacheId, similar[tmdbId], resolve)
              }
            })
          })
          .catch(reject)
      } else {
        resolve(similar[tmdbId])
      }
    })
  }

  static getPopularShows(): Promise {
    const {TMDb, state, Cache} = this
    let {popular} = state.media.lists.shows
    const cacheId = 'getPopularShows'

    return new Promise((resolve, reject) => {
      if (!popular.length) {
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
    const {TMDb, state, Cache} = this
    let {topRated} = state.media.lists.shows
    const cacheId = 'getTopRatedShows'

    return new Promise((resolve, reject) => {
      if (!topRated.length) {
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
    const {TMDb, state, Cache} = this
    let {popular} = state.media.lists.movies
    const cacheId = 'getPopularMovies'

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
    const {TMDb, state, Cache} = this
    let {topRated} = state.media.lists.movies
    const cacheId = 'getTopRatedMovies'

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
    const {state, TMDb, Cache} = this
    const {movies} = state.media

    return new Promise((resolve, reject) => {
      if (!movies.hasOwnProperty(tmdbId)) {
        Cache.isNotExpiredThenRead(`movie-${tmdbId}`)
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

    return new Promise((resolve, reject) => {
      TMDb.getShow(tmdbId)
        .then(show => {
          TorrentAdapter(undefined, 'shows', {
            search: show.original_name,
            season: 1,
            episode: 1
          })
            .then(torrents => {
              if (torrents) {
                resolve(this.formatShowMetadata(show))
              } else {
                reject()
              }
            })
        })
        .catch(reject)
    })
  }

  static getShowById(tmdbId: Number): Promise {
    const {state, TMDb, Cache} = this
    const {shows} = state.media

    return new Promise((resolve, reject) => {
      if (!shows.hasOwnProperty(tmdbId)) {
        Cache.existsThenRead(`show-${tmdbId}`)
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
                        console.log(data)
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
                    nextSeason(err)
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

    let fetchedQueries = []

    return new Promise((resolve, reject) => {
      TMDb.searchAll(encodeURIComponent(query))
        .then(data => {
          let searchResults = data.results.slice(0, limit)

          async.each(searchResults, (res, next) => {
            if (res.media_type === 'movie') {
              this.getMovieById(movie.id)
                .then(data => {
                  fetchedQueries.push(data)
                  next()
                })
                .catch(() => next())
            } else if(res.media_type === 'tv') {
              this.getShowById(res.id)
                .then(data => {
                  fetchedQueries.push(data)
                  next()
                })
                .catch(() => next())
            } else {
              throw new Error('Wrong media_type')
            }
          }, function(err) {
            resolve(fetchedQueries)
          })
        })
        .catch(reject)
    })
  }

}