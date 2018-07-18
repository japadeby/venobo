import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ITorrent, TorrentService, YtsTorrentProvider } from '../../modules/torrent';

@Injectable()
export class HomeResolver implements Resolve<Observable<ITorrent[]>> {
  constructor(
    private readonly torrentService: TorrentService,
    private readonly yts: YtsTorrentProvider,
  ) {}

  resolve() {
    return this.yts.provide('Rampage 2018', 'movies');
  }
}
