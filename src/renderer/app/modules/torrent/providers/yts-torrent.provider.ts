import { AxiosInstance } from 'axios';

import { Utils } from '../../../../../common';
import { ProviderUtils } from '../provider-utils';
import { BaseTorrentProvider } from './base-torrent.provider';
import {
  ExtendedDetails,
  YtsMovieTorrent,
  YtsResponse,
  ITorrent,
} from '../interfaces';

export class YtsTorrentProvider extends BaseTorrentProvider {

  domains = ['yts.am', 'yts.unblocked.vet'];
  provider = 'Yts';
  api!: AxiosInstance;

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  private async fetch(query: string): Promise<YtsResponse> {
    const { data } = await this.api.get('', {
      params: {
        query_term: query,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: 50,
      }
    });

    return data;
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
      this.api = await this.createReliableEndpointApi(
        this.domains.map(domain => this.createEndpoint(domain))
      );
    });
  }

  async provide(search: string, type: string, { imdbId }: ExtendedDetails): Promise<ITorrent[]> {
    switch (type) {
      case 'movies':
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
