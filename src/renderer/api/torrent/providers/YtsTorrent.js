import HTTP from '../../../lib/http'
import {
  timeout,
  encodeUri,
  determineQuality,
  constructMagnet
} from '../provider'

export default class YtsTorrentProvider {

  endpoint = 'https://yts.ag/api/v2/list_movies.json'
  provider = 'Yify'

  constructor() {
    this.api = new HTTP({ baseURL: this.endpoint })
  }

  fetch(imdbId: String): Promise {
    return this.api.fetchLimit('', {
      query_term: imdbId,
      order_by: 'desc',
      sort_by: 'seeds',
      limit: 50
    }).then(res => res.data)
  }

  formatTorrent = (torrent: Object) => ({
    size: torrent.size,
    quality: torrent.quality,
    magnet: constructMagnet(torrent.hash),
    seeders: parseInt(torrent.seeds, 10),
    leechers: parseInt(torrent.peers, 10),
    metadata: (String(torrent.url) + String(torrent.hash)) || String(torrent.hash),
    verified: true,
    _provider: this.provider
  })

  getStatus(): Promise {
    return this.api.get()
      .then(res => true)
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
