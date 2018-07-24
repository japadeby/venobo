import { Injectable, Inject } from '@angular/core';
import { Observable, from, zip } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { TORRENT_PROVIDERS } from './tokens';
import { ExtendedDetails, ITorrent } from './interfaces';
import { PromiseUtils, Utils } from '../globals';
import { BaseTorrentProvider } from './providers';
import { ProviderUtils } from './provider.utils.service';

@Injectable()
export class TorrentService {

  public availableProviders: BaseTorrentProvider[];

  constructor(
    @Inject(TORRENT_PROVIDERS)
    private readonly allProviders: BaseTorrentProvider[],
    private readonly providerUtils: ProviderUtils,
    // private readonly promiseUtils: PromiseUtils,
    // private readonly observableUtils: PromiseUtils,
  ) {}

  async create() {
    const providerStatuses = this.allProviders
      .map(provider => provider.create());

    const resolvedProviderStatuses = await Promise.all(providerStatuses);

    this.availableProviders = PromiseUtils.filterResolved<BaseTorrentProvider>(
      this.allProviders,
      resolvedProviderStatuses
    );

    console.log('[Venobo] - Available Torrent Providers: ', this.availableProviders);
  }

  private selectTorrents(torrents: ITorrent[]) {
    return this.providerUtils.sortTorrentsBySeeders(
      torrents.filter(
        torrent => !!torrent.quality// && torrent.quality !== 'n/a'
      )
    );
  }

  private appendAttributes(providerResults: ITorrent[], method: 'movies' | 'shows'): ITorrent[] {
    return providerResults // Utils.merge(providerResults)
      .filter(result => !!result.metadata)
      .map(result => ({
        ...result,
        method,
        cached: Date.now(),
        health: this.providerUtils.getHealth(result.seeders || 0, result.leechers || 0),
        // '3d': this.providerUtils.determine3d(result.metadata, result.magnet),
        quality: !result.quality
          ? this.providerUtils.determineQuality(result.metadata, result.magnet)
          : result.quality,
    }));
  }

  private filterShows(show: ITorrent, extendedDetails: ExtendedDetails) {
    return (
      show.metadata.toLowerCase().includes(
        this.providerUtils.formatSeasonEpisodeToString(extendedDetails)
      ) && show.seeders > 0
    );
  }

  /**
   * @TODO: Clean this up
   * @param {string} query
   * @param {string} type
   * @param {ExtendedDetails} extendedDetails
   * @returns {Observable<ITorrent[]>}
   */
  public search(query: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]> {
    if (!this.availableProviders) throw new Error('You need to call TorrentService.create() first');

    return zip(
      ...this.availableProviders.map(provider =>
        provider.provide(query, type, extendedDetails)
      ),
    ).pipe(
      map((results: ITorrent[]) => {
        switch (type) {
          case 'movies':
            return this.selectTorrents(
              this.appendAttributes(results, type)
            );

          case 'shows':
            return this.selectTorrents(
              this.appendAttributes(results, type)
                .filter(show => !!show.metadata)
                .filter(show => this.filterShows(show, extendedDetails))
            );

          default:
            return [];
        }
      }),
    );
  }

}
