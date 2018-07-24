import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ITorrent, TorrentService, MagnetDlTorrentProvider } from '../../../torrent';

@Injectable()
export class HomeResolver implements Resolve<Observable<ITorrent[]>> {
  constructor(
    private readonly torrentAdapter: TorrentService,
  ) {}

  resolve() {
    console.log('[Venobo] - Home Resolver: Initializing...');
    const torrents$ = this.torrentAdapter.search('Rampage 2018', 'movies');
    torrents$.subscribe(torrents => console.log('[Venobo] - Home Resolver: ', torrents));

    return torrents$;
  }
}
