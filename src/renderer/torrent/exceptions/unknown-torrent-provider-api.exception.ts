import { BaseTorrentProvider } from '../providers';

export class UnknownTorrentProviderApiException extends Error {

  public name = UnknownTorrentProviderApiException.name;

  constructor(torrentProvider: typeof BaseTorrentProvider) {
    super(`Missing API in ${torrentProvider.name}`);
  }

}
