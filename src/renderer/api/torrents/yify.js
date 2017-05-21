import axios from 'axios'

import HTTP from '../../lib/http'
import {
  encodeUri,
  determineQuality
} from './provider'

export default class YtsTorrentProvider {

  static endpoint: String = 'https://yts.ag/api/v2/list_movies.json'
  static provider: String = 'Yify'

  static fetch(imdbId): Promise {
    return HTTP.fetch(
      this.formatApi({
        query_term: imdbId,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: 50
      })
    ).then(res => res.data)
  }

  static formatTorrent(torrent: Object): Object {
    return {
      size: torrent.size,
      quality: torrent.quality,
      magnet: this.constructMagnet(torrent.hash),
      seeders: parseInt(torrent.seeds, 10),
      leechers: parseInt(torrent.peers, 10),
      metadata: (String(torrent.url) + String(torrent.hash)) || String(torrent.hash),
      _provider: this.provider
    }
  }

  static getStatus(): Promise {
    return axios.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(err => false)
  }

  static provide(imdbId: String, type: String): Promise<Array> {
    switch (type) {
      case 'movies':
        return this.fetch(imdbId)
          .then(res => {
            if (!res.movie_count) return []
            const torrents = res.movies[0].torrents
            return torrents.map(torrent => this.formatTorrent(torrent))
          })

      default:
        return []
    }
  }

  static constructMagnet(hash: String): String {
    return `magnet:?xt=urn:btih:${hash}`
  }

  static formatApi(query: Object): String {
    return `${this.endpoint}?${encodeUri(query)}`
  }

}
