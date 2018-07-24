import { Injectable } from '@angular/core';

import { ConfigService } from '../app/services';
import { Utils } from '../globals';
import {
  ExtendedDetails,
  ITorrent,
  TorrentHealth,
  TorrentVideoQuality
} from './interfaces';

@Injectable()
export abstract class ProviderUtils {

  constructor(private readonly config: ConfigService) {}

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
    return this.config.get('torrent.exclude.hcSubs') &&
      metadata.includes('hc') ||
      metadata.includes('korsub');
  }

  /**
   * Check whether or not torrent was recorded with a camera
   * @param {string} metadata
   * @returns {boolean}
   */
  private isCamRecorded(metadata: string) {
    return this.config.get('torrent.exclude.cam') &&
      Utils.includes(metadata, [
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
    return this.config.get('torrent.exclude.nonEng') &&
      Utils.includes(metadata, [
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
    return this.config.get('torrent.exclude.withSubs') &&
      metadata.includes('sub');
  }

  /*private static hasNonNativeCodec(metadata: string)  {
      return (
          metadata.includes('avi') ||
          metadata.includes('mkv')
      );
  }*/

  public determine3d(metadata: string, magnet: string) {
    return (metadata || magnet).toLowerCase().includes('3d');
  }

  /**
   * Determine video quality of torrent
   * Filters torrent if it doesn't explicitly tell us quality
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

    // Guess the quality 1440p
    if (fileName.includes('1440p')) return '1440p';

    // Guess the quality 4k
    if (Utils.includes(fileName, [
      '4k',
      'uhd',
      'qhd',
    ])) return '4k';

    // Guess the quality 720p
    if (Utils.includes(fileName, [
      '720p',
      // 'rip',
      // 'mp4',
      // 'web',
      'hdtv',
      'eng',
    ])) return '720p';

    // Guess the quality 1080p
    if (Utils.includes(fileName, [
      '1080p',
      'bluray',
      'blu-ray',
      'mkv',
    ])) return '1080p';

    // Guess the quality 480p
    if (Utils.includes(fileName, [
      '480p',
      // 'xvid',
      // 'dvd',
    ])) return '480p';

    if (Utils.includes(fileName, [
      'brrip',
      'webrip',
    ])) return '720p';

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

}
