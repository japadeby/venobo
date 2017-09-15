import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  constructSearchQueries,
  formatSeasonEpisodeToString,
  timeout,
  encodeUri
} from './provider'

export default class RarbgTorrentProvider {

  static endpoint = 'https://rarbgproxy.com' // use proxy
  static provider = 'Rarbg'

  static formatApi(query: Object): String {
    return `${this.endpoint}/torrents.php?${encodeUri(query)}`
  }

  static fetchShows(query: String): Promise {
    return HTTP.fetchCache(
      this.formatApi({
        category: '18;41;49',
        search: query,
        order: 'seeders',
        by: 'DESC'
      })
    ).then(res => this.cheerio(res))
  }

  static fetchMovies(query: String): Promise {
    return HTTP.fetchCache(
      this.formatApi({
        category: '48;17;44;45;47;42;46',
        search: query,
        order:'seeders',
        by: 'DESC'
      })
    ).then(res => this.cheerio(res))
  }

  static cheerio(html): Object {
    let $ = cheerio.load(html)
    let providerName = this.provider

    console.log(html)

    const torrents = $('table.lista2t tr.lista2').map(function() {
      const $td = $(this).find('.lista')
      const magnet = $(this).eq(1).find('a').text()

      return {
        leechers: parseInt($td.eq(5).text(), 10),
        magnet,
        metadata: magnet,
        seeders: parseInt($td.eq(4).text(), 10),
        size: $td.eq(3).text(),
        uploader: $td.eq(7).text(),
        _provider: providerName
      }
    }).get()

    console.log(torrents)

    return torrents
  }

  static getStatus(): Boolean {
    return axios.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(() => false)
  }

  static provide(imdbId: String, type: String, extendedDetails: Object): Promise<Array> {
    const { search } = extendedDetails

    switch (type) {
      case 'movies': {
        return timeout(
          this.fetchMovies(imdbId || search)
        ).catch(err => [])
      }
      case 'shows': {
        const { season, episode } = extendedDetails

        return mergeProviderPromises(
          constructSearchQueries(search, imdbId).map(
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
