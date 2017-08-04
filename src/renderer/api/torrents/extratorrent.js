import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  formatSeasonEpisodeToString,
  constructSeasonQueries,
  constructSearchQueries,
  timeout,
  encodeUri
} from './provider'

export default class ExtraTorrentProvider {

  static endpoint = 'https://extratorrent.ag'
  static provider = 'ExtraTorrent'

  static fetch(query: String): Promise {
    return HTTP.fetchCache(`${this.endpoint}/search/?search=${query}&new=1&x=0&y=0`)
      .then(res => this.cheerio(res))
      .catch(res => [])
  }

  static cheerio(html: String): Promise {
    let $ = cheerio.load(html)
    const provider = this.provider

    console.log($('table.tl tr').not(':eq(0)'))

    const torrents = $('table.tl tr').not(':eq(0)').map(function() {
      const $td = $(this).find('td')
      const leechers = $td.eq(6).text()
      const seeders = $td.eq(5).text()

      return {
        leechers: leechers == '---' ? 0 : parseInt(leechers, 10),
        magnet: $td.eq(0).find('a').attr('href'),
        metadata: $td.eq(2).find('a').text(),
        seeders: seeders == '---' ? 0 : parseInt(leechers, 10),
        size: $td.eq(4).text(),
        _provider: provider
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
      case 'movies':
        return timeout(
          this.fetch(search)
        )

      case 'shows': {
        const {season, episode} = extendedDetails

        return timeout(this.fetch(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        ))
      }

      case 'season_complete': {
        const {season} = extendedDetails
        const queries = constructSeasonQueries(search, season)

        return Promise.all(
          queries.map(query => this.fetch(query))
        ).then(
          res => res.reduce((previous, current) => (
            previous.length && current.length
              ? [...previous, ...current]
              : previous.length && !current.length
                  ? previous
                  : current
          ))
        )
      }
      default:
        return []
    }
  }
}
