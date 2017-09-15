import {
  determineQuality,
  formatSeasonEpisodeToString,
  formatSeasonEpisodeToObject,
  sortTorrentsBySeeders,
  getHealth,
  merge
} from './provider'

export default class TorrentAdapter {

  static allProviders = [
    new (require('./providers/YtsTorrent')),
    new (require('./providers/iDopeTorrent')),
    new (require('./providers/KickassTorrent'))
  ]

  static availableProviders: Array

  static checkProviders() {
    return Promise
      .all(this.allProviders.map(provider => provider.getStatus()))
      .then(providerStatuses => {
        this.availableProviders = this.allProviders
          .map((x, i) => [x, providerStatuses[i]])
          .filter(provider => !!provider[1])
          .map(a => a.shift())
      })
  }

  /*static getStatuses() {
    return Promise
      .all(this.allProviders.map(provider => provider.getStatus()))
      .then(providerStatuses => providerStatuses.map((status, index) => ({
        providerName: this.allProviders[index].provider,
        online: status
      })))
  }*/

  static async search(imdbId: String, type: String, extendedDetails: Object) {
    const torrentPromises = this.availableProviders.map(
      provider => provider.provide(imdbId, type, extendedDetails)
    )

    const providerResults = await Promise.all(torrentPromises)

    switch (type) {
      case 'movies':
        return this.selectTorrents(
          this.appendAttributes(providerResults).map(result => ({
            ...result,
            method: 'movies'
          }))
        )

      case 'shows': {
        const { season, episode } = extendedDetails

        return this.selectTorrents(
          this.appendAttributes(providerResults)
            .filter(show => !!show.metadata)
            .filter(show => this.filterShows(show, season, episode))
            .map(result => ({
              ...result,
              method: 'shows'
            }))
        )
      }
    }
  }

  static appendAttributes(providerResults: Array<any>) {
    const formattedResults = merge(providerResults).map(result => ({
      ...result,
      health: getHealth(result.seeders || 0, result.leechers || 0),
      quality: result.hasOwnProperty('quality')
                  ? result.quality
                  : determineQuality(result.magnet, result.metadata, result)
    }))

    return formattedResults
  }

  static filterShows(show: Object, season: Number, episode: Number) {
    return (
      show.metadata.toLowerCase().includes(
        formatSeasonEpisodeToString(
          season,
          episode
        )
      )
      &&
      show.seeders !== 0
    )
  }

  static filterShowsComplete(show: Object, season: Number) {
    const metadata = show.metadata.toLowerCase()

    return (
      metadata.includes(`${season} complete`) ||
      metadata.includes(`${season} [complete]`) ||
      metadata.includes(`${season} - complete`) ||
      metadata.includes(`season ${season}`) ||
      metadata.includes(`s${formatSeasonEpisodeToObject(season).season}`) &&
      !metadata.includes('e0') &&
      show.seeders !== 0
    )
  }

  static selectTorrents(torrents: Array<any>): Object {
    const sortedTorrents = sortTorrentsBySeeders(
      torrents.filter(
        torrent => (torrent.quality !== 'n/a' && torrent.quality !== '')
      )
    )

    const formattedTorrents = {
      '480p': sortedTorrents.find(torrent => torrent.quality === '480p'),
      '720p': sortedTorrents.find(torrent => torrent.quality === '720p'),
      '1080p': sortedTorrents.find(torrent => torrent.quality === '1080p'),
      '4K': sortedTorrents.find(torrent => torrent.quality === '4k')
    }

    for (let i in formattedTorrents) {
      if (formattedTorrents[i] == null) delete formattedTorrents[i]
    }

    return formattedTorrents
  }

}
