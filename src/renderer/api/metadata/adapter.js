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

  static formatShowMetadata(data: Object, torrents: Object): Object {
    const {TMDb, state, Cache} = this

    const metadata = state.media.shows[data.id] = {
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
      episodes_count: data.number_of_episodes,
      seasons_count: data.number_of_seasons
    }

    Cache.writeSync(`show-${data.id}`, metadata)

    return metadata
  }

  static formatMovieMetadata(data: Object, torrents: Object): Object {
    const {TMDb, state, Cache} = this

    const metadata = state.media.movies[data.id] = {
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

    Cache.writeSync(`movie-${data.id}`, metadata)

    return metadata
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
            resolve(this.formatShowMetadata(data, torrents))
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
            resolve(this.formatMovieMetadata(data, torrents))
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
    const {TMDb} = this
    let popularShows = []

    return new Promise((resolve, reject) => {
      TMDb.getPopularShows()
        .then(shows => {
          async.each(shows, (show, next) => {
            this.getShowById(show.id)
              .then(data => next(null, data))
              .catch(() => next())
          }, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(popularShows)
            }
          })
        })
    })
  }

  static getPopularMovies(): Promise {
    const {TMDb} = this
    let popularMovies = []

    return new Promise((resolve, reject) => {
      TMDb.getPopularMovies()
        .then(movies => {
          console.log(movies)
          async.each(movies, (movie, next) => {
            this.getMovieById(movie.id)
              .then(data => {
                console.log(data)
                popularMovies.push(data)
                next()
              })
              .catch(() => next())
          }, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(popularMovies)
            }
          })
        })
        .catch(reject)
    })
  }

  static getTopRatedMovies(): Promise {
    const {TMDb} = this
    let topRatedMovies = []

    return new Promise((resolve, reject) => {
      TMDb.getTopRatedMovies()
        .then(movies => {
          async.each(movies, (movie, next) => {
            this.getMovieById(movie.id)
              .then(data => {
                topRatedMovies.push(data)
                next()
              })
              .catch(() => next())
          }, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(topRatedMovies)
            }
          })
        })
        .catch(reject)
    })
  }

  /**
   * @param {Object} data
   * @return {Promise}
   */
  static getMovieByData(data: Object): Promise {
    const {state, TMDb} = this
    const {movies} = state.media

    return new Promise((resolve, reject) => {
      if (!movies.hasOwnProperty(data.id)) {
        this.addTorrents(data)
          .then(resolve)
          .catch(reject)
      } else {
        resolve(movies[data.id])
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

  static getEpisodeDetails(tmdbId: Number, season: Number, episode: Number) {
    return TMDb.getShowEpisode(tmdbId, season, episode)
  }

  static async getShowById(tmdbId: Number): Promise {
    const {state, TMDb, Cache} = this
    const {shows} = state.media

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

                async.forEachOf(show.seasons, function(value, key, nextSeason) {
                  const season = key + 1
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
                            seasons[season][episode] = torrents
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
                    resolve(this.formatShowMetadata(show, seasons))
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
