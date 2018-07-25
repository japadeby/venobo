import { Observable, of, from } from 'rxjs';
import { map, mergeMap, combineAll } from 'rxjs/operators';

import { ObservableUtils, PromiseUtils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import {
  ExtendedDetails,
  YtsMovieTorrent,
  YtsResponse,
  ITorrent,
} from '../interfaces';

export class YtsTorrentProvider extends BaseTorrentProvider {

  static provider = 'Yify Torrents';

  domains = ['yts.am', 'yts.unblocked.vet'];
  api!: string;

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  private fetch(query: string): Observable<YtsResponse> {
    if (!this.api) {
      throw new UnknownTorrentProviderApiException(
        YtsTorrentProvider,
      );
    }

    return this.timeoutError(
      this.http.get<YtsResponse>(this.api, {
        params: {
          query_term: query,
          order_by: 'desc',
          sort_by: 'seeds',
          limit: String(50),
        },
      }),
    );
  }

  private formatTorrent = (torrent: YtsMovieTorrent): ITorrent => ({
    metadata: String((torrent.url + torrent.hash) || torrent.hash),
    magnet: this.providerUtils.constructMagnet(torrent.hash),
    provider: YtsTorrentProvider.provider,
    size: torrent.size,
    quality: torrent.quality,
    seeders: torrent.seeds,
    leechers: torrent.peers,
    verified: true,
  });

  create() {
    return PromiseUtils.didResolve(async () => {
      this.api = await this.createReliableEndpoint(
        this.domains.map(
          domain => this.createEndpoint(domain)
        ),
      );
    });
  }

 provide(search: string, type: string, { imdbId }: ExtendedDetails = {}): Observable<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(<string>imdbId || search)
          .pipe(mergeMap(({ data }) => {
            if (data.movie_count === 0) return [];

            return from(data.movies)
              .pipe(
                mergeMap(({ torrents }) => torrents.map(
                  (torrent) => this.formatTorrent(torrent)
                )),
              );
          }));

      default:
          return of([]);
    }
  }

}
