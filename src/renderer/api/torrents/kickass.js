import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  formatSeasonEpisodeToString,
  constructSeasonQueries,
  constructSearchQueries
} from './provider'

export default class KatTorrentProvider {

  static endpoint = 'https://kickassto.org'
  static provider = 'Kickass'

  static fetch(query: String): Promise {
    return HTTP.get(`${this.endpoint}/usearch/${encodeURIComponent(query)}/?field=seeders&sorder=desc`)
      .then(res => this.cheerio(res))
      .catch(err => [])
  }

  static cheerio(html: String): Promise {
    let $ = cheerio.load(html)
    const provider = this.provider

    const torrents = $("table.data tr:not('.firstr')").map(function() {
      return {
        leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
        magnet: $(this).find('[title="Torrent magnet link"]').attr('href'),
        metadata: $(this).find('a.cellMainLink').text(),
        seeders: parseInt($(this).find('.green.center').text(), 10),
        //verified: !!$(this).find('[title="Verified Torrent"]').length,
        size: $(this).find('.nobr.center').text(),
        _provider: provider
      }
    }).get()

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
        return this.fetch(imdbId || search)

      case 'shows': {
        const {season, episode} = extendedDetails

        return this.fetch(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        )
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
