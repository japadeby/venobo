import { Injectable } from '@angular/core';

import { Utils } from '../../services';
import {
  ExtendedDetails,
  ITorrent,
  TorrentHealth,
  TorrentVideoQuality
} from './interfaces';

@Injectable()
export class ProviderUtils {

  constructor(private readonly utils: Utils) {}

  /**
   * Construct magnet link from torrent hash
   * @param {string} hash
   * @returns {string}
   */
  public constructMagnet = (hash: string) => `magnet:?xt=urn:btih:${hash}`;

  /**
   * Check if torrent file name includes hardcoded subs
   * @param {string} metadata
   * @returns {boolean}
   */
  private hasHardcodedSubtitles(metadata: string) {
    return metadata.includes('hc') || metadata.includes('korsub');
  }

  /**
   * Check whether or not torrent was recorded with a camera
   * @param {string} metadata
   * @returns {boolean}
   */
  private isCamRecorded(metadata: string) {
    return this.utils.includes(metadata, [
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
  private hasNonEnglishLanguage(metadata: string) {
    return this.utils.includes(metadata, [
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
  private hasSubtitles(metadata: string) {
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
  public determineQuality(metadata: string, magnet: string): TorrentVideoQuality {
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
    if (this.utils.includes(fileName, [
      '4k',
      'uhd',
      'qhd',
    ])) return '4k';

    // Guess the quality 720p
    if (this.utils.includes(fileName, [
      '720',
      'rip',
      'mp4',
      'web',
      'hdtv',
      'eng',
    ])) return '720p';

    // Guess the quality 1080p
    if (this.utils.includes(fileName, [
      '1080',
      'bluray',
      'blu-ray',
      'mkv',
    ])) return '1080p';

    // Guess the quality 480p
    if (this.utils.includes(fileName, [
      '480',
      'xvid',
      'dvd',
    ])) return '480p';

    return null;
  }

  public sortTorrentsBySeeders(torrents: ITorrent[]) {
    return torrents.sort((prev, next) => {
      if (prev.seeders === next.seeders) return 0;

      return prev.seeders > next.seeders
        ? -1
        : 1;
    });
  }

  public formatSeasonEpisodeToString({ season, episode }: ExtendedDetails) {
    return (
      ('s' + (String(season).length === 1 ? '0' + season : season)) +
      ('e' + (String(episode).length === 1 ? '0' + episode : episode))
    );
  }

  public getHealth(seeders: number, leechers: number = 0): TorrentHealth {
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

}
