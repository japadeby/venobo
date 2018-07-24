import { Type } from '@angular/core';

import { TorrentService } from './torrent.service';

export function createSourceInstances(...instances: Type<any>[]) {
  return instances;
}

export function createTorrentFactory(torrentService: TorrentService) {
  return () => torrentService.create();
}
