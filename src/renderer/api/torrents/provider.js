/**
 * Handle a promise and set a timeout
 */
export function timeout(promise, time: Number = 2500) {
  return new Promise((resolve, reject) => {
    promise.then(resolve).catch(console.log)

    setTimeout(() => {
      reject(new Error('Timeout exceeded'))
    }, process.env.CONFIG_API_TIMEOUT
        ? parseInt(process.env.CONFIG_API_TIMEOUT, 10)
        : time
    )
  })
}

/**
 * @param {String} metadata
 * @return {Boolean}
 */
export function hasHardcodedSubtitles(metadata: String): Boolean {
  return metadata.includes('hc') || metadata.includes('korsub')
}

/**
 * @param {String} metadata
 * @return {Boolean}
 */
export function isCamRecorded(metadata: String): Boolean {
  return (
      metadata.includes('cam') ||
      metadata.includes('tc') ||
      metadata.includes('dvdscr') ||
      metadata.includes('ts') ||
      metadata.includes('blurred')
  )
}

/**
 * @param {String} magnet
 * @param {String} metadata
 * @return {String}
 */
export function determineQuality(magnet: String, metadata: String): String {
  const lowerCaseMetadata = (metadata || magnet).toLowerCase()

  // Filter videos recorded with a camera
  if (isCamRecorded(lowerCaseMetadata)) return ''

  // Filter non-english languages
  if (hasNonEnglishLanguage(lowerCaseMetadata)) return ''

  // Filter videos with hardcoded subtitles
  if (hasHardcodedSubtitles(lowerCaseMetadata)) return ''

  // Filter videos with 'rendered' subtitles
  if (hasSubtitles(lowerCaseMetadata)) return ''

  // Most accurate categorization
  if (lowerCaseMetadata.includes('1080')) return '1080p'
  if (lowerCaseMetadata.includes('720')) return '720p'
  if (lowerCaseMetadata.includes('480')) return '480p'
  if (lowerCaseMetadata.includes('3d')) return '3D'
  if (lowerCaseMetadata.includes('4k')) return '4K'
  if (lowerCaseMetadata.includes('uhd')) return '4K'

  // Guess the quality 1080p
  if (lowerCaseMetadata.includes('bluray')) return '1080p'
  if (lowerCaseMetadata.includes('blu-ray')) return '1080p'
  if (lowerCaseMetadata.includes('mkv')) return '1080p'

  // Guess the quality 720p, prefer english
  if (lowerCaseMetadata.includes('dvd')) return '720p'
  if (lowerCaseMetadata.includes('rip')) return '720p'
  if (lowerCaseMetadata.includes('mp4')) return '720p'
  if (lowerCaseMetadata.includes('web')) return '720p'
  if (lowerCaseMetadata.includes('hdtv')) return '720p'
  if (lowerCaseMetadata.includes('eng')) return '720p'
  if (lowerCaseMetadata.includes('xvid')) return '720p'

  if (process.env.NODE_ENV === 'development') {
    console.warn(`${metadata}, could not be verified`)
  }

  return ''
}

/**
 * @param {Number} season
 * @param {Number} episode
 * @return {String}
 */
export function formatSeasonEpisodeToString(season: Number, episode: Number): String {
  return (
    ('s' + (String(season).length === 1 ? '0' + String(season) : String(season))) +
    ('e' + (String(episode).length === 1 ? '0' + String(episode) : String(episode)))
  )
}

/**
 * @param {Number} season
 * @param {Number} episode
 * @return {Object}
 */
export function formatSeasonEpisodeToObject(season: Number, episode: Number): Object {
  return {
    season: (String(season).length === 1 ? '0' + String(season) : String(season)),
    episode: (String(episode).length === 1 ? '0' + String(episode) : String(episode))
  }
}

/**
 * @param {String} title
 * @param {Number} season
 * @param {Number} episode
 * @return {Boolean}
 */
export function isExactEpisode(title: String, season: Number, episode: Number): Boolean {
  return title.toLowerCase().includes(formatSeasonEpisodeToString(season, episode))
}

/**
 * @param {Number} seeders
 * @param {Number} leechers
 * @return {String}
 */
export function getHealth(seeders: Number, leechers: Number = 0): String {
  const ratio = (seeders && !!leechers) ? (seeders / leechers) : seeders

  if (seeders < 50) {
    return 'poor'
  }

  if (ratio > 1 && seeders >= 50 && seeders < 100) {
    return 'decent'
  }

  if (ratio > 1 && seeders >= 100) {
    return 'healthy'
  }

  return 'poor'
}

export function hasNonEnglishLanguage(metadata: string): boolean {
  if (metadata.includes('french')) return true
  if (metadata.includes('german')) return true
  if (metadata.includes('greek')) return true
  if (metadata.includes('dutch')) return true
  if (metadata.includes('hindi')) return true
  if (metadata.includes('português')) return true
  if (metadata.includes('portugues')) return true
  if (metadata.includes('spanish')) return true
  if (metadata.includes('español')) return true
  if (metadata.includes('espanol')) return true
  if (metadata.includes('latino')) return true
  if (metadata.includes('russian')) return true
  if (metadata.includes('subtitulado')) return true

  return false
}

export function hasSubtitles(metadata: String): Boolean {
  return metadata.includes('sub')
}

export function hasNonNativeCodec(metadata: String) {
  return (
    metadata.includes('avi') ||
    metadata.includes('mkv')
  )
}

export function sortTorrentsBySeeders(torrents: Array<any>) {
  return torrents.sort((prev: Object, next: Object) => {
    if (prev.seeders === next.seeders) {
      return 0
    }

    return prev.seeders > next.seeders ? -1 : 1
  })
}

export function constructSearchQueries(title: String, imdbId: String): Array<string> {
  const queries = [
    title, // default
    imdbId
  ]

  return title.includes("'")
          ? [...queries, title.replace(/'/g,'')] // eslint-disable-line
          : queries
}

export function combineAllQueries(queries: Array<Promise>) {
  return Promise.all(
    queries.map(query => this.fetch(query))
  )
    // Flatten array of arrays to an array with no empty arrays
    .then(
      res => merge(res).filter(array => array.length !== 0)
    )
}

export function constructSeasonQueries(title: String, season: Number): Array<string> {
  const formattedSeasonNumber = `s${formatSeasonEpisodeToObject(season, 1).season}`

  return [
    `${title} season ${season}`,
    `${title} season ${season} complete`,
    `${title} season ${formattedSeasonNumber} complete`
  ]
}

/**
 * @param {Array} results | A two-dimentional array containing arrays of results
 */
export function merge(results: Array<any>) {
  return results.reduce((previous, current) => [...previous, ...current])
}

export function getIdealTorrent(torrents: Array<any>) {
  const idealTorrent = torrents
    .filter(torrent => !!torrent)
    .filter(
      (torrent: Object) => typeof torrent.seeders === 'number'
    )

  return idealTorrent
    ? idealTorrent.sort((prev: Object, next: Object) => {
        if (prev.seeders === next.seeders) {
          return 0
        }

        return (prev.seeders > next.seeders) ? -1 : 1
      })[0]
    : idealTorrent
}

export function mergeProviderPromises(promises): Promise {
  return timeout(
    Promise.all(promises)
  )
    .then(
      res => merge(res).filter(array => array.length !== 0)
    )
    .catch(err => [])
}

export function mergeProviderPromise(promise: Promise): Promise {
  return timeout(promise)
    .then(
      res => merge(res).filter(array => array.length !== 0)
    )
    .catch(err => [])
}

/**
 * @param {Object} args
 * @return {String}
 */
export function encodeUri(args: Object): String {
  let str = ''
  for (let key in args) {
    if (str !== '') str += '&'
    str += `${key}=${encodeURIComponent(args[key])}`
  }
  return str
}
