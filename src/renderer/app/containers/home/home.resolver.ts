import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { MetadataService } from '../../../metadata';
import { ITorrent, TorrentService } from '../../../torrent';

@Injectable()
export class HomeResolver implements Resolve<Observable<ITorrent[]>> {
  constructor(
    private readonly metadata: MetadataService,
  ) {}

  resolve() {
    return this.metadata.getTopRated('movies');
  }
}
