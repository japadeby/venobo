import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { TorrentService } from '../modules/torrent';

@Injectable()
export class AppResolver implements Resolve<Promise<void>> {
  constructor(private readonly torrentService: TorrentService) {}

  async resolve() {
    if (this.torrentService.availableProviders) return;

    return this.torrentService.create();
  }
}
