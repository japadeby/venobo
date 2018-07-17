import axios, { AxiosInstance } from 'axios';

import { Utils } from '../../../../../common';
import {
  ITorrent,
  TorrentHealth,
  TorrentVideoQuality,
  ExtendedDetails,
} from '../interfaces';

export class BaseTorrentProvider {

  /**
   * Endpoint domains for torrent provider
   */
  abstract readonly domains?: string[];

  /**
   * Endpoint for torrent domain
   */
  abstract readonly endpoint?: string;
  /**
   * Torrent provider
   */
  abstract readonly provider: string;
  /**
   * HTTP module
   */
  abstract api: AxiosInstance;

  // fetch?(query: string): Promise<ITorrent[]>;

  /**
   * Fetch all torrent movies related to query
   * @param {string} query
   * @returns {Promise<ITorrent[]>}
   */
  // fetchMovies?(query: string): Promise<ITorrent[]>;

  /**
   * Fetch all torrent shows related to query
   * @param {string} query
   * @returns {Promise<ITorrent[]>}
   */
  // fetchShows?(query: string): Promise<ITorrent[]>;

  /**
   * Get status of torrent endpoint
   * @returns {Promise<boolean>}
   */
  abstract create(): Promise<boolean>;

  /**
   * Fetch movies / shows depending on IMDb ID
   * @param {string} search
   * @param {string} type
   * @param {ExtendedDetails} extendedDetails
   * @returns {Promise<ITorrent[]>}
   */
  async provide(search: string, type: string, extendedDetails: ExtendedDetails): ITorrent[] | Promise<ITorrent[]>;

  /**
   * Transform html into a torrent list
   * @param {string} html
   * @returns {ITorrent[]}
   */
  abstract cheerio?(html: string): any[]; // ITorrent[];

  /**
   * Construct magnet link from torrent hash
   * @param {string} hash
   * @returns {string}
   */
  protected constructMagnet = (hash: string) => `magnet:?xt=urn:btih:${hash}`;

  /**
   * Check if torrent file name includes hardcoded subs
   * @param {string} metadata
   * @returns {boolean}
   */
  protected hasHardcodedSubtitles(metadata: string) {
    return metadata.includes('hc') || metadata.includes('korsub');
  }

  /**
   * Check whether or not torrent was recorded with a camera
   * @param {string} metadata
   * @returns {boolean}
   */
  protected isCamRecorded(metadata: string) {
    return Utils.includes(metadata, [
      'cam',
      'tc',
      'dvdscr',
      'ts',
      'blurred',
    ]);
  }

  /**
   * Check if metadata includes non english language
   * @param {string} metadata
   * @returns {boolean}
   */
  protected hasNonEnglishLanguage(metadata: string) {
    return Utils.includes(metadata, [
      'french',
      'german',
      'greek',
      'dutch',
      'hindi',
      'português',
      'portugues',
      'spanish',
      'español',
      'espanol',
      'latino',
      'russian',
      'subtitulado',
    ]);
  }

  /**
   * Check if torrent has subtitles
   * @param {string} metadata
   * @returns {boolean}
   */
  protected hasSubtitles(metadata: string) {
    return metadata.includes('sub');
  }

  /*private static hasNonNativeCodec(metadata: string)  {
      return (
          metadata.includes('avi') ||
          metadata.includes('mkv')
      );
  }*/

  /**
   * Determine video quality of torrent
   * @param {string} metadata
   * @param {string} magnet
   * @returns {null}
   */
  protected determineQuality(metadata: string, magnet: string): TorrentVideoQuality {
    const fileName = (metadata || magnet).toLowerCase();

    // Filter videos recorded with a camera
    if (this.isCamRecorded(fileName)) return null;

    // Filter non-english languages
    if (this.hasNonEnglishLanguage(fileName)) return null;

    // Filter videos with hardcoded subtitles
    if (this.hasHardcodedSubtitles(fileName)) return null;

    // Filter videos with 'rendered' subtitles
    if (this.hasSubtitles(fileName)) return null;

    // Guess the quality 4k
    if (Utils.includes(fileName, [
      '4k',
      'uhd',
      'qhd',
    ])) return '4k';

    // Guess the quality 720p
    if (Utils.includes(fileName, [
      '720',
      'rip',
      'mp4',
      'web',
      'hdtv',
      'eng',
    ])) return '720p';

    // Guess the quality 1080p
    if (Utils.includes(fileName, [
      '1080',
      'bluray',
      'blu-ray',
      'mkv',
    ])) return '1080p';

    // Guess the quality 480p
    if (Utils.includes(fileName, [
      '480',
      'xvid',
      'dvd',
    ])) return '480p';

    return null;
  }

  protected sortTorrentsBySeeders(torrents: ITorrent[]) {
    return torrents.sort((prev, next) => {
      if (prev.seeders === next.seeders) return 0;

      return prev.seeders > next.seeders
        ? -1
        : 1;
    });
  }

  protected formatSeasonEpisodeToString(season?: number | string, episode?: number | string) {
    return (
      ('s' + (String(season).length === 1 ? '0' + season : season)) +
      ('e' + (String(episode).length === 1 ? '0' + episode : episode))
    );
  }

  protected getHealth(seeders: number, leechers: number = 0): TorrentHealth {
    const ratio = (seeders && !!leechers)
      ? (seeders / leechers)
      : seeders;

    if (seeders < 50) return 'poor';
    if (ratio > 1 && seeders >= 50 && seeders < 100) return 'decent';
    if (ratio > 1 && seeders >= 100) return 'healthy';

    return 'poor';
  }

  /*public static mergeProviderPromises(promises: Promise<any>[]): Promise<any> {
    return Promise.all(promises)
      .then(res => {
        return Utils.merge(res).filter(
          (arr) => arr.length !== 0
        );
      }).catch(() => []);
  }*/

  private createApi(baseURL: string) {
    return axios.create({
      timeout: 5000,
      baseURL,
    });
  }

  protected async createReliableEndpointApi(endpoints: string[]) {
    const requests = endpoints.map(async (endpoint) => {
      await axios.get(endpoint, {
        timeout: 1000
      });

      return endpoint;
    });

    const endpoint = await Utils.promise.raceResolve<string>(requests);

    return this.createApi(endpoint);
  }

}
