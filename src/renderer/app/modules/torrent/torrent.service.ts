import { Injectable, OnInit, Inject } from '@angular/core';

import { USE_TORRENT_PROVIDERS } from './tokens';
import { ITorrentProvider, ExtendedDetails } from './interfaces';
import { BaseTorrentProvider } from './providers/base-torrent.provider';
import { Utils } from '../../../../common';

@Injectable()
export class TorrentService implements OnInit {

  private baseTorrentProvider = new BaseTorrentProvider();

  private availableProviders!: ITorrentProvider[];

  constructor(
    @Inject(USE_TORRENT_PROVIDERS)
    private readonly allProviders: ITorrentProvider[],
  ) {}

  protected async ngOnInit() {
    const providerStatuses = this.allProviders
      .map(provider => provider.create());

    const resolvedProviderStatuses = await Promise.all(providerStatuses);

    this.availableProviders = Utils.promise.filterResolved<ITorrentProvider>(
      this.allProviders,
      resolvedProviderStatuses
    );
  }

  private async selectTorrents(torrents: ITorrent[]) {
    return ProviderUtils.sortTorrentsBySeeders(
      torrents.filter(
        torrent => !!torrent.quality// && torrent.quality !== 'n/a'
      )
    );
  }

  private appendAttributes(providerResults: ITorrent[][], method: 'movies' | 'shows') {
    return Utils.merge(providerResults).map(result => ({
      ...result,
      method,
      cached: Date.now(),
      health: ProviderUtils.getHealth(result.seeders || 0, result.leechers || 0),
      quality: !!result.quality
        ? result.quality
        : ProviderUtils.determineQuality(result.metadata, result.magnet),
    }));
  }

  private filterShows(show: ITorrent, { season, episode }: ExtendedDetails) {
    return (
      show.metadata.toLowerCase().includes(
        ProviderUtils.formatSeasonEpisodeToString(
          <string>season,
          <string>episode,
        )
      ) && show.seeders !== 0
    );
  }

  public async search(query: string, type: string, extendedDetails: ExtendedDetails = {}) {
    if (!this.availableProviders) throw new Error('You must wait for TorrentService.ngOnOnit()');

    const torrentPromises = this.availableProviders.map(
      provider => provider.provide(query, type, extendedDetails)
    );

    const providerResults = await Promise.all(torrentPromises);

    switch (type) {
      case 'movies':
        return this.selectTorrents(
          this.appendAttributes(providerResults, type)
        );

      case 'shows':
        return this.selectTorrents(
          this.appendAttributes(providerResults, type)
            .filter(show => !!show.metadata)
            .filter(show => this.filterShows(show, extendedDetails))
        );

      default:
        return [];
    }
  }

}
