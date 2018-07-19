import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { mergeAll, mergeMap, switchMap } from 'rxjs/operators';

import { TORRENT_PROVIDERS } from './tokens';
import { ExtendedDetails, ITorrent } from './interfaces';
import { PromiseUtils } from '../../services';
import { BaseTorrentProvider } from './providers';
import { ProviderUtils } from './provider.utils.service';

@Injectable()
export class TorrentService {

  public availableProviders: BaseTorrentProvider[];

  constructor(
    @Inject(TORRENT_PROVIDERS)
    private readonly allProviders: BaseTorrentProvider[],
    private readonly promiseUtils: PromiseUtils,
    private readonly providerUtils: ProviderUtils,
    // private readonly observableUtils: PromiseUtils,
  ) {}

  async create() {
    const providerStatuses = this.allProviders
      .map(provider => provider.create());

    const resolvedProviderStatuses = await Promise.all(providerStatuses);

    this.availableProviders = this.promiseUtils.filterResolved<BaseTorrentProvider>(
      this.allProviders,
      resolvedProviderStatuses
    );
  }

  private selectTorrents(torrents: ITorrent[]) {
    return this.providerUtils.sortTorrentsBySeeders(
      torrents.filter(
        torrent => !!torrent.quality// && torrent.quality !== 'n/a'
      )
    );
  }

  private appendAttributes(providerResults: ITorrent[], method: 'movies' | 'shows') {
    return providerResults.map(result => ({
      ...result,
      method,
      cached: Date.now(),
      health: this.providerUtils.getHealth(result.seeders || 0, result.leechers || 0),
      quality: !!result.quality
        ? result.quality
        : this.providerUtils.determineQuality(result.metadata, result.magnet),
    }));
  }

  private filterShows(show: ITorrent, extendedDetails: ExtendedDetails) {
    return (
      show.metadata.toLowerCase().includes(
        this.providerUtils.formatSeasonEpisodeToString(extendedDetails)
      ) && show.seeders > 0
    );
  }

  public search(query: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]> {
    if (!this.availableProviders) throw new Error('You need to call TorrentService.create() first');

    return from(this.availableProviders).pipe(
      mergeMap(provider =>
        provider.provide(query, type, extendedDetails),
      ),
      // mergeAll(),
      switchMap((results: ITorrent[]) => {
        switch (type) {
          case 'movies':
            return of(this.selectTorrents(
              this.appendAttributes(results, type)
            ));

          case 'shows':
            return of(this.selectTorrents(
              this.appendAttributes(results, type)
                .filter(show => !!show.metadata)
                .filter(show => this.filterShows(show, extendedDetails))
            ));

          default:
            return of([]);
        }
      }),
      // mergeAll(),
    );
  }

}
