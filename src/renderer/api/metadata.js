import async from 'async'

import YtsProvider from './torrents/yts'
import TMDbProvider from './metadata/tmdb'

export default class MetaDataProvider {

  static TMDb: Object
  static state: Object

  static setState(state: Object) {
    this.state = state
    this.TMDb = new TMDbProvider(state)
  }

  static addMetadata(data: Object, type: String): Object {
    const {TMDb, state} = this

    return state.media[type][data.id] = {
      title: data.title,
      original_title: data.original_title,
      poster: TMDb.formatPoster(data.poster_path),
      backdrop: TMDb.formatBackdrop(data.backdrop_path),
      genres: data.genres.map(genre => {
        return genre.name
      }),
      type: (type === 'movies') ? 'movie' : 'show',
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
      torrents: data.torrents
    }
  }

  static addTorrents(data: Object, callback: Function) {
    //const {movies} = this.state.media

    return new Promise((resolve, reject) => {
      async.series([
        function(next) {
          YtsProvider.find(data.imdb_id) // YTS supports IMDb results
            .then(res => next(null, res))
            .catch(next)
        }
      ], (err, res) => {
        if (err) {
          //delete movies[data.id]
          reject(data.id)
        } else {
          data.torrents = res[0]
          resolve(this.addMetadata(data, 'movies'))
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
            this.addTorrents(data)
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      } else {
        resolve(movies[tmdbId])
      }
    })
  }

}
