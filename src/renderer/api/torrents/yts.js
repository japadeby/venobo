import axios from 'axios'
import async from 'async'

import HTTP from '../../utils/http'
import {
  encodeUri,
  determineQuality
} from './base-provider'

export default class YtsProvider {

  static endpoint: String = 'https://yts.ag/api/v2/list_movies.json'
  static provider: String = 'YTS'

  /**
   * @param {String} query
   * @return {Promise}
   */
  static fetch(args: Object = {}, callback): Promise {
    HTTP.get(this.formatApi(args), callback)
  }

  /**
   * @param {Object} torrent
   * @return {Object}
   */
  static formatTorrent(torrent: Object): Object {
    return {
      size: torrent.size,
      quality: determineQuality(torrent.quality),
      magnet: this.constructMagnet(torrent.hash),
      seeders: parseInt(torrent.seeds, 10),
      leechers: parseInt(torrent.peers, 10),
      metadata: (String(torrent.url) + String(torrent.hash)) || String(torrent.hash),
      _provider: this.provider
    }
  }

  /**
   * @return {Promise}
   */
  static getStatus(): Promise {
    return axios.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(() => false)
  }

  /**
   * @param {String} title
   * @return {Promise}
   */
  static find(title: String): Promise {
    return new Promise((resolve, reject) => {
      this.fetch({query_term: title}, (res) => {
        if (res.data.movie_count === 0) {
          reject(true)
        } else {
          resolve(res.data.movies[0].torrents.map(torrent => this.formatTorrent(torrent)))
        }
      })
    })
  }

  /**
   * @param {String} query
   * @param {String} type
   * @return {Promise}
   */
  static findAll(movies: Array): Promise<Array> {
    return new Promise((resolve, reject) => {
      async.each(movies, (movie, next) => {
        movie.torrents = [] // assign empty array to the object
        this.fetch({query_term: movie.title}, (res) => {
          if (!res.data.movie_count) {
            movies.splice(movies.indexOf(movie), 1)
          } else {
            movie.torrents.push(res.data.movies[0].torrents.map(torrent => this.formatTorrent(torrent)))
          }
          next()
        })
      }, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve(movies)
        }
      })
    })
  }

  /**
   * @param {Object} query
   * @return {String}
   */
  static formatApi(query: Object): String {
    return `${this.endpoint}?${encodeUri(query)}`
  }

  /**
   * @param {String} hash
   * @return {String}
   */
  static constructMagnet(hash: String): String {
    return `magnet:?xt=urn:btih:${hash}`
  }

}
