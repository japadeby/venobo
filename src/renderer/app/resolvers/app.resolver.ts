import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { TorrentService } from '../modules/torrent/index';

@Injectable()
export class AppResolver implements Resolve<Promise<void>> {
  constructor(private readonly torrentService: TorrentService) {}

  async resolve() {
    if (this.torrentService.availableProviders) return;

    await this.torrentService.create();
    console.error('AppResolver');
    console.log(this.torrentService.availableProviders);
  }
}
