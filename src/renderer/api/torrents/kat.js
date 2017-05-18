import {
  mergeProviderPromises,
  formatSeasonEpisodeToString,
  constructSeasonQueries,
  constructSearchQueries
} from './provider'

import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'

export default class KatTorrentProvider {

  static endpoint = 'https://kickass.cd'
  static provider = 'Kat'

  static search(query: String): Promise {
    return HTTP.get(`${this.endpoint}/usearch/${encodeURIComponent(query)}/?field=seeders&sorder=desc`)
      .then(html => {
        let $ = cheerio.load(html)

        const torrents = $("table.data tr:not('.firstr')").map(function() {
          const magnet = $(this).find('[title="Torrent magnet link"]').attr('href')
          return {
            leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
            magnet,
            metadata: magnet,
            seeders: parseInt($(this).find('.green.center').text(), 10),
            title: $(this).find('a.cellMainLink').text(),
            verified: !!$(this).find('[title="Verified Torrent"]').length,
            size: $(this).find('.nobr.center').text()
          }
        }).get()

        return torrents
      })
  }

  static fetch(query: String): Promise {
    return this.search(query)
      .then(torrents => torrents.map(
        torrent => this.formatTorrent(torrent)
      ))
      .catch(err => [])
  }

  static formatTorrent(torrent: Object): Object {
    return {
      size: torrent.size,
      magnet: torrent.magnet,
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      metadata: String(torrent.title + torrent.magnet) || String(torrent.magnet),
      _provider: this.provider
    }
  }

  static getStatus(): Boolean {
    return axios.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(() => false)
  }

  static provide(imdbId: String, type: String, extendedDetails: Object): Promise<Array> {
    const { searchQuery } = extendedDetails

    switch (type) {
      case 'movies': {
        return mergeProviderPromises(
          constructSearchQueries(searchQuery, imdbId).map(query => this.fetch(query))
        )
      }

      case 'shows': {
        const { season, episode } = extendedDetails

        return this.fetch(
          `${searchQuery} ${formatSeasonEpisodeToString(season, episode)}`
        ).catch(err => [])
      }

      case 'season_complete': {
        const { season } = extendedDetails
        const queries = constructSeasonQueries(searchQuery, season)

        Promise.all(
          queries.map(query => this.fetch(query))
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
