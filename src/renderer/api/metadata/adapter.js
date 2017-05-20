import async from 'async'

import TMDbProvider from './tmdb'
import TorrentAdapter from '../torrents/adapter'

export default class MetadataAdapter {

  static TMDb: Object
  static state: Object

  static setState(state: Object) {
    this.state = state
    this.TMDb = new TMDbProvider(state)
  }

  static formatShowMetadata(data: Object, torrents: Object): Object {
    const {TMDb, state} = this

    return state.media.shows[data.id] = {
      title: data.name,
      original_title: data.original_name,
      poster: TMDb.formatPoster(data.poster_path),
      backdrop: TMDb.formatBackdrop(data.backdrop_path),
      genres: data.genres.map(genre => {
        return genre.name
      }),
      type: 'show',
      smmary: data.overview,
      popularity: data.popularity,
      tmdb: data.id,
      imdb: data.imdb_id,
      year: data.first_air_date.substring(0, 4),
      release_date: data.first_air_date,
      voted: data.vote_average,
      votes: data.vote_count,
      runtime: (data.runtime) ? `${data.runtime}min` : 'N/A',
      released: (data.status === "Released"),
      torrents: torrents,
      episodes_count: data.number_of_episodes,
      seasons_count: data.number_of_seasons
    }
  }

  static formatMovieMetadata(data: Object, torrents: Object): Object {
    const {TMDb, state} = this

    return state.media.movies[data.id] = {
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

  static addTorrents(data: Object, type: String): Promise {
    return new Promise((resolve, reject) => {
      TorrentAdapter(data.imdb_id, 'movies', {
        search: data.original_title
      })
        .then(torrents => {
          if (!torrents) {
            reject()
          } else if (type === 'movie') {
            resolve(this.formatMovieMetadata(data, torrents))
          } else if (type === 'show') {
            resolve(this.formatShowMetadata(data, torrents))
          } else {
            throw new Error('Invalid media type')
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

  static getPopularMovies(): Promise {
    const {TMDb} = this
    let popularMovies = []

    return new Promise((resolve, reject) => {
      TMDb.getPopularMovies()
        .then(movies => {
          async.each(movies, (movie, next) => {
            this.getMovieById(movie.id)
              .then(data => {
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
    const {state, TMDb} = this
    const {movies} = state.media

    return new Promise((resolve, reject) => {
      if (!movies.hasOwnProperty(tmdbId)) {
        TMDb.getMovie(tmdbId)
          .then(data => {
            this.addTorrents(data, 'movie')
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      } else {
        resolve(movies[tmdbId])
      }
    })
  }

  static getShowById(tmdbId: Number): Promise {
    const {state, TMDb} = this
    const {shows} = state.media

    return new Promise((resolve, reject) => {
      if (!shows.hasOwnProperty(tmdbId)) {
        TMDb.getShow(tmdbId)
          .then(data => {
            TMDb.getShowExternalIds(tmdbId)
              .then(external => {
                data.imdb_id = external.imdb_id
                this.addTorrents(data, 'show')
                  .then(resolve)
                  .catch(reject)
              })
          })
          .catch(reject)
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
