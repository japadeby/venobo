import { Type } from '@angular/core';

import { BaseTorrentProvider } from '../modules/torrent/providers';

export class UnknownTorrentProviderApiException extends Error {

  public name = UnknownTorrentProviderApiException.name;

  constructor(torrentProvider: Type<BaseTorrentProvider>) {
    super(`Missing API in ${torrentProvider.name}`);
  }

}
