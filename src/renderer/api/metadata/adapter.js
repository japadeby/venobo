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

  static getMovieRecommendations(tmdbId: Number): Promise {
    const {TMDb, state} = this
    const {recommendations} = state.media.lists.movies

    return new Promise((resolve, reject) => {
      if (!recommendations.hasOwnProperty(tmdbId)) {
        recommendations[tmdbId] = []
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
                resolve(recommendations[tmdbId])
              }
            })
          })
          .catch(reject)
      } else {
        resolve(recommendations[tmdbId])
      }
    })
  }

  static getSimilarMovies(tmdbId: Number): Promise {
    const {TMDb, state} = this
    const {similar} = state.media.lists.movies

    return new Promise((resolve, reject) => {
      if (!similar.hasOwnProperty(tmdbId)) {
        similar[tmdbId] = []
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
                resolve(similar[tmdbId])
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

    return new Promise((resolve, reject) => {
      if (!popular.length) {
        Cache.isNotExpiredThenRead('getPopularShows')
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
                    Cache.writeSync('getPopularShows', popular)
                    resolve(popular)
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

    return new Promise((resolve, reject) => {
      if (!topRated.length) {
        Cache.isNotExpiredThenRead('getTopRatedShows')
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
                    Cache.writeSync('getTopRatedShows', topRated)
                    resolve(topRated)
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

    return new Promise((resolve, reject) => {
      if (!popular.length) {
        Cache.isNotExpiredThenRead('getPopularMovies')
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
                    Cache.writeSync('getPopularMovies', popular)
                    resolve(popular)
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

    return new Promise((resolve, reject) => {
      if (!topRated.length) {
        Cache.isNotExpiredThenRead('getTopRatedMovies')
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
                    Cache.writeSync('getTopRatedMovies', topRated)
                    resolve(topRated)
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
              console.log(torrents)
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

    console.log(tmdbId)

    return new Promise((resolve, reject) => {
      if (!shows.hasOwnProperty(tmdbId)) {
        Cache.isNotExpiredThenRead(`show-${tmdbId}`)
          .then(data => {
            shows[tmdbId] = data
            resolve(data)
          })
          .catch(() => {
            TMDb.getShow(tmdbId)
              .then(show => {
                let seasons = {}
                show.episodeCount = 0

                async.forEachOf(show.seasons, function(value, index, nextSeason) {
                  const season = value.season_number
                  if (season === 0) return nextSeason(null)
                  seasons[season] = {}

                  async.times(value.episode_count, function(index, nextEpisode) {
                    const episode = index + 1
                    seasons[season][episode] = {}

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
                              seasons[season][episode] = torrents
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
