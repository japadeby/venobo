import { AxiosInstance } from 'axios';

import { ProviderUtils } from '../provider-utils';
import { MOVIES } from '../../../constants';
import { Utils } from '../../../utils';
import {
  ExtendedDetails,
  ITorrentProvider,
  YtsMovieTorrent,
  YtsResponse,
  ITorrent,
} from '../interfaces';

export class YtsTorrentProvider implements ITorrentProvider {

  domains = ['yts.am', 'yts.unblocked.vet'];
  provider = 'Yts';
  api!: AxiosInstance;

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  private fetch(query: string): Promise<YtsResponse> {
    return this.api.get('', {
      params: {
        query_term: query,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: 50,
      }
    }).then(res => res.data);
  }

  private formatTorrent = (torrent: YtsMovieTorrent): ITorrent => ({
    metadata: String((torrent.url + torrent.hash) || torrent.hash),
    magnet: ProviderUtils.constructMagnet(torrent.hash),
    size: torrent.size,
    quality: torrent.quality,
    seeders: torrent.seeds,
    leechers: torrent.peers,
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
          .then(({ data }) => {
            if (data.movie_count === 0) return [];

            return Utils.merge<ITorrent>(
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
