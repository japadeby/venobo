import cheerio from 'cheerio'

import HTTP from '../../../lib/http'
import {
  mergeProviderPromises,
  formatSeasonEpisodeToString,
  constructSeasonQueries,
  constructSearchQueries,
  timeout
} from '../provider'

export default class KickassTorrentProvider {

  endpoint = 'https://kickassto.org'
  provider = 'Kickass'
  api: Object

  constructor() {
    this.api = new HTTP({ baseURL: this.endpoint })
  }

  fetch(query: String): Promise {
    return this.api.fetchLimit(`usearch/${encodeURIComponent(query)}`, { field: 'seeders', sorder: 'desc' })
      .then(res => this.cheerio(res))
      .catch(err => [])
  }

  cheerio(html: String): Promise {
    let $ = cheerio.load(html)
    const provider = this.provider

    const torrents = $("table.data tr:not('.firstr')").slice(0, 10).map(function() {
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

  getStatus(): Promise {
    return this.api.get()
      .then(res => true)
      .catch(err => false)
  }

  provide(imdbId: String, type: String, extendedDetails: Object): Promise<Array> {
    const { search } = extendedDetails

    switch (type) {
      case 'movies':
        return this.fetch(imdbId || search)

      case 'shows': {
        const { season, episode } = extendedDetails

        return this.fetch(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        )
      }

      case 'season_complete': {
        const { season } = extendedDetails
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
