import { AxiosInstance } from 'axios';

import { ProviderUtils } from '../provider-utils';
import { MOVIES } from '../../../constants';
import { Utils } from '../../../utils';
import { ITorrent, ITorrentProvider } from '../interfaces/index';

export class YtsTorrentProvider implements ITorrentProvider {

  domains = ['yts.am', 'yts.unblocked.vet'];
  api: AxiosInstance;
  provider = 'Yts';

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  public fetch(query) {
    return this.api.get('', {
      params: {
        query_term: query,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: 50,
      }
    });
  }

  public formatTorrent = (torrent: any): ITorrent => ({
    metadata: String((torrent.url + torrent.hash) || torrent.hash),
    magnet: ProviderUtils.constructMagnet(torrent.hash),
    size: torrent.size,
    quality: torrent.quality,
    seeders: parseInt(torrent.seeds, 10),
    leechers: parseInt(torrent.peers, 10),
    verified: true,
    provider: this.provider,
  })

  getStatus() {
    return Utils.promise.didResolve(async () => {
      this.api = await ProviderUtils.createReliableEndpointApi(
        this.domains.map(domain => this.createEndpoint(domain))
      );
    });
  }

  public async provide(search, type, { imdbId }) {
    switch (type) {
      case MOVIES:
        return this.fetch(imdbId || search)
          .then(({ data: { data } }) => {
            if (data.movie_count === 0) return [];

            return Utils.merge(
              data.movies.map(
                ({ torrents }) => torrents.map(
                  (torrent) => this.formatTorrent(torrent)
                )
              )
            );
          });

      default:
          return [];
    }
  }

}
