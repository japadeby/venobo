import axios from 'axios'
import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  constructSearchQueries,
  formatSeasonEpisodeToString,
  timeout
} from './provider'

export default class PirateBayTorrentProvider {

  static endpoint = 'https://pirateproxy.cc' // https://pirateproxy.cc || https://thehiddenbay.world
  static provider = 'The Pirate Bay'

  static fetchMovies(query: String, page: Number = 0) {
    return HTTP.fetchLimitCache(`${this.endpoint}/search/${query}/0/99/207`)
      .then(res => this.cheerio(res))
  }

  static fetchShows(query: String, page: Number = 0) {
    return HTTP.fetchLimitCache(`${this.endpoint}/search/${query}/0/99/208`)
      .then(res => this.cheerio(res))
  }

  static cheerio(html): Object {
    let $ = cheerio.load(html)
    const providerName = this.provider

    const torrents = $("table#searchResult tr:not('.header')").slice(0, 10).map(function() {
      const $td = $(this).find('td')
      return {
        leechers: parseInt($td.eq(3).text(), 10),
        seeders: parseInt($td.eq(2).text(), 10),
        magnet: $td.eq(1).find('[title="Download this torrent using magnet"]').attr('href'),
        metadata: $td.find('.detName .detLink').text(),
        size: undefined,
        uploader: $td.eq(1).find('.detDesc .detDesc').text(),
        _provider: providerName
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
    const {search} = extendedDetails

    switch (type) {
      case 'movies': {
        return timeout(
          this.fetchMovies(imdbId || search)
        ).catch(err => [])
      }

      case 'shows': {
        const {season, episode} = extendedDetails

        return this.fetchShows(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        ).catch(err => [])
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
