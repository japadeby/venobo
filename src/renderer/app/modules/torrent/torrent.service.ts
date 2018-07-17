import { Injectable, OnInit, Inject } from '@angular/core';

import { USE_TORRENT_PROVIDERS } from './tokens';
import { ITorrentProvider } from './interfaces';
import { Utils } from '../../../../common';

@Injectable()
export class TorrentService implements OnInit {

  private availableProviders!: ITorrentProvider[];

  constructor(
    @Inject(USE_TORRENT_PROVIDERS)
    private readonly allProviders: ITorrentProvider[],
  ) {}

  async ngOnInit() {
    const providerStatuses = this.allProviders
      .map(provider => provider.create());

    const resolvedProviderStatuses = await Promise.all(providerStatuses);

    this.availableProviders = Utils.promise.filterResolved<ITorrentProvider>(
      this.allProviders,
      resolvedProviderStatuses
    );
  }

}
