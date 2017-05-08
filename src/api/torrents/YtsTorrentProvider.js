import axios from 'axios'

import {
  encodeUri,
  determineQuality
} from './BaseTorrentProvider'

export default class YtsTorrentProvider {

  static endpoint = 'https://yts.ag'
  static provider = 'YTS'

  /**
   * @param {String} query
   * @return {Promise}
   */
  static fetch(query: String): Promise {
    return axios.get(this.formatApi({
      query_term: query,
      order_by: 'desc',
      sort_by: 'seeds',
      limit: 50
    })).then(res => res.data)
  }

  /**
   * @param {Object} torrent
   * @return {Object}
   */
  static formatTorrent(torrent: Object): Object {
    return {
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
    return axios.get('https://yts.ag/api/v2/list_movies.json')
      .then(res => res.status === 200)
      .catch(() => false)
  }

  /**
   * @param {String} query
   * @param {String} type
   * @return {Promise}
   */
  static provide(query: string, type: string): Promise {
    switch (type) {
      case 'movies':
        return this.fetch(query)
          .then(res => {
            if (!res.data.movie_count) return []
            const torrents = res.data.movies[0].torrents
            return torrents.map(this.formatTorrent)
          })
      default:
        return []
    }
  }

  /**
   * @param {Object} query
   * @return {String}
   */
  static formatApi(query: Object): String {
    return `${this.endpoint}/api/v2/list_movies.json?${encodeUri(query)}`
  }

  /**
   * @param {String} hash
   * @return {String}
   */
  static constructMagnet(hash: String): String {
    return `magnet:?xt=urn:btih:${hash}`
  }

}
