import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  constructSearchQueries,
  formatSeasonEpisodeToString,
  timeout
} from './provider'

export default class MagnetDlTorrentProvider {

  static endpoint = 'https://magnetdl.unblocked.gold' // proxy
  static provider = 'MagnetDL'

  static fetch(query: String) {
    query = query.replace(/[^a-zA-Z0-9]/, '-').toLowerCase()
    return HTTP.fetchCache(
      `${this.endpoint}/${query.substring(0, 1)}/${query.split(' ').join('-')}/`
    ).then(res => this.cheerio(res))
  }

  static cheerio(html: String) {
    let $ = cheerio.load(html)

    const torrents = $("table.download tr:not('.header')").map(function() {
      const $td = $(this).find('td')
      const providerName = this.provider

      return {
        magnet: $td.eq(0).find('a').attr('href'),
        metadata: $td.eq(1).find('a').text(),
        size: $td.eq(5).text(),
        seeders: $td.eq(6).text(),
        leechers: $td.eq(7).text(),
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
    const {search} = extendedDetails

    switch (type) {
      case 'movies':
        return timeout(this.fetch(search))

      case 'shows': {
        const {season, episode} = extendedDetails

        return this.fetch(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        )
      }

      case 'season_complete': {
        const {season} = extendedDetails
        const queries = constructSeasonQueries(search, season)

        Promise.all(
          queries.map(query => this.fetchShows(query))
        ).then(
          res => res.reduce((previous, current) => (
            previous.length && current.length
              ? [...previous, ...current]
              : previous.length && !current.length
                  ? previous
                  : current
          ))
        ).catch(err => [])
      }

      default:
        return []
    }
  }

}
