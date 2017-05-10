import axios from 'axios'
import async from 'async'

import {
  encodeUri,
  determineQuality
} from './base-provider'

export default class YtsTorrentProvider {

  static endpoint = 'https://yts.ag/api/v2/list_movies.json'
  static provider = 'YTS'

  /**
   * @param {String} query
   * @return {Promise}
   */
  static fetch(query: String, args: Object = {}): Promise {
    return axios.get(this.formatApi({
      query_term: query,
      args
    })).then(res => res.data)
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
   * @param {String} query
   * @param {String} type
   * @return {Promise}
   */
  static provideMultiple(movies: Array): Promise {
    return new Promise((resolve, reject) => {
      async.each(movies, (movie, callback) => {
        this.fetch(movie.title)
          .then(res => {
            if (!res.data.movie_count) {
              movies.splice(movies.indexOf(movie), 1)
              return callback()
            }

            movie.torrents.push(res.data.movies[0].torrents.map(torrent => this.formatTorrent(torrent)))
            callback()
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
