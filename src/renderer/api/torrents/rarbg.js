import {
  mergeProviderPromises,
  constructSearchQueries,
  formatSeasonEpisodeToString,
  timeout
} from './provider'

import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'

export default class RarbgTorrentProvider {

  static endpoint = 'https://rarbgproxy.com' // use proxy
  static provider = 'Rarbg'

  static fetchShows(query: String): Promise {
    return HTTP.get(`${this.endpoint}/torrents.php?category=18;41;49&search=${encodeURIComponent(query)}&order=seeders&by=DESC`)
      .then(res => this.cheerio(res))
  }

  static fetchMovies(query: String): Promise {
    return HTTP.get(`${this.endpoint}/torrents.php?category=48;17;44;45;47;42;46&search=${encodeURIComponent(query)}&order=seeders&by=DESC`)
      .then(res => this.cheerio(res))
  }

  static cheerio(html): Object {
    let $ = cheerio.load(html)

    const torrents = $('table.lista2t tr.lista2').map(function() {
      var $this = $(this).find('.lista')
      var magnet = $this.eq(1).find('a').text()

      return {
        leechers: parseInt($this.eq(5).text(), 10),
        magnet,
        metadata: magnet,
        seeders: parseInt($this.eq(4).text(), 10),
        size: $this.eq(3).text(),
        uploader: $this.eq(7).text()
      }
    }).get()

    return torrents
  }

  static getStatus(): Boolean {
    return axios.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(() => false)
  }

  // Rarbg doesn't support imdbId search
  static provide(imdbId: String, type: String, extendedDetails: Object): Promise<Array> {
    const { searchQuery } = extendedDetails

    switch (type) {
      case 'movies': {
        return mergeProviderPromises(
          constructSearchQueries(searchQuery, imdbId).map(query => this.fetchMovies(query))
        )
      }
      case 'shows': {
        const { season, episode } = extendedDetails

        return mergeProviderPromises(
          constructSearchQueries(searchQuery, imdbId).map(
            query => this.fetchShows(`${query} ${formatSeasonEpisodeToString(season, episode)}`)
          )
        )
      }

      case 'season_complete':
        return []

      default:
        return []

    }
  }

}
