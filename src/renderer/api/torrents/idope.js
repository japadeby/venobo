import axios from 'axios'
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

  static endpoint = 'https://idope.se'
  static provider = 'iDope'

  static fetchMovies(query: String) {
    return HTTP.fetchCache(`${this.endpoint}/torrent-list/${query}/?&c=1`)
      .then(res => this.cheerio(res))
  }

  static fetchShows(query: String) {
    return HTTP.fetchCache(`${this.endpoint}/torrent-list/${query}/?c=3`)
      .then(res => this.cheerio(res))
  }

  static cheerio(html: String): Promise {
    let $ = cheerio.load(html)
    const provider = this.provider

    let i = -1
    const torrents = $('div#div2child .resultdiv').slice(0, 5).map(function() {
      i++
      return {
        metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
        size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
        seeds: $(this).find('.resultdivbotton .resultdivbottonseed').text(),
        leechers: undefined,
        magnet: constructMagnet($(this).find(`.resultdivbotton #hideinfohash${i}`).text()),
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

  static provide(imdbId: String, type: String, extendedDetails: Object): Promise {
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
