import { AxiosInstance } from 'axios';

import { ProviderUtils } from '../provider-utils';
import {ExtendedDetails, ITorrent, ITorrentProvider} from '../interfaces';
import { MOVIES } from '../../../constants';
import { Utils } from '../../../utils';

export class YtsTorrentProvider implements ITorrentProvider {

  domains = ['yts.am', 'yts.unblocked.vet'];
  provider = 'Yts';
  api!: AxiosInstance;

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  private fetch(query: string) {
    return this.api.get('', {
      params: {
        query_term: query,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: 50,
      }
    });
  }

  private formatTorrent = (torrent: any): ITorrent => ({
    metadata: String((torrent.url + torrent.hash) || torrent.hash),
    magnet: ProviderUtils.constructMagnet(torrent.hash),
    size: torrent.size,
    quality: torrent.quality,
    seeders: parseInt(torrent.seeds, 10),
    leechers: parseInt(torrent.peers, 10),
    verified: true,
    provider: this.provider,
  });

  create() {
    return Utils.promise.didResolve(async () => {
      this.api = await ProviderUtils.createReliableEndpointApi(
        this.domains.map(domain => this.createEndpoint(domain))
      );
    });
  }

  async provide(search: string, type: string, { imdbId }: ExtendedDetails): Promise<ITorrent[]> {
    switch (type) {
      case MOVIES:
        return this.fetch(<string>imdbId || search)
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
