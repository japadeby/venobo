import HTTP from '../../lib/http'
import {
  encodeUri,
  determineQuality,
  constructMagnet
} from './provider'

export default class YtsTorrentProvider {

  endpoint = 'https://yts.ag/api/v2/list_movies.json'
  provider = 'Yify'

  fetch(imdbId: String): Promise {
    return HTTP.get(this.endpoint, {
      query_term: imdbId,
      order_by: 'desc',
      sort_by: 'seeds',
      limit: 50
    }).then(res => res.data)
  }

  formatTorrent(torrent: Object): Object {
    return {
      size: torrent.size,
      quality: torrent.quality,
      magnet: constructMagnet(torrent.hash),
      seeders: parseInt(torrent.seeds, 10),
      leechers: parseInt(torrent.peers, 10),
      metadata: (String(torrent.url) + String(torrent.hash)) || String(torrent.hash),
      _provider: this.provider
    }
  }

  getStatus(): Promise {
    return HTTP.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(err => false)
  }

  provide(imdbId: String, type: String): Promise<Array> {
    switch (type) {
      case 'movies':
        return this.fetch(imdbId)
          .then(res => {
            if (res.movie_count === 0) return []
            const torrents = res.movies[0].torrents
            return torrents.map(torrent => this.formatTorrent(torrent))
          })

      default:
        return []
    }
  }

}
