import cheerio from 'cheerio'

import HTTP from '../../lib/http'
import {
  mergeProviderPromises,
  formatSeasonEpisodeToString,
  constructSeasonQueries,
  constructSearchQueries,
  timeout,
  constructMagnet
} from './provider'

export default class iDopeTorrentProvider {

  endpoint: String = 'https://idope.se'
  provider: String = 'iDope'
  api: Object

  constructor() {
    this.api = new HTTP({ baseURL: this.endpoint })
  }

  fetchMovies(query: String) {
    return this.api.get(`torrent-list/${query}/`, { c: 1 })
      .then(res => this.cheerio(res))
  }

  fetchShows(query: String) {
    return this.api.get(`torrent-list/${query}/`, { c: 3 })
      .then(res => this.cheerio(res))
  }

  cheerio(html: String): Promise {
    const $ = cheerio.load(html)
    const provider = this.provider

    const torrents = $('div#div2child .resultdiv').slice(0, 10).map(function() {
      return {
        metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
        size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
        seeds: $(this).find('.resultdivbotton .resultdivbottonseed').text(),
        leechers: undefined,
        magnet: constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
        _provider: provider
      }
    }).get()

    return torrents
  }

  getStatus(): Boolean {
    return HTTP.get(this.endpoint)
      .then(res => res.status === 200)
      .catch(() => false)
  }

  provide(imdbId: String, type: String, extendedDetails: Object): Promise {
    const {search} = extendedDetails

    switch (type) {
      case 'movies':
        return timeout(
          this.fetchMovies(search)
        ).catch(err => [])

      case 'shows': {
        const {season, episode} = extendedDetails

        return timeout(this.fetchShows(
          `${search} ${formatSeasonEpisodeToString(season, episode)}`
        )).catch(err =>  [])
      }

      default:
        return []
    }
  }

}
