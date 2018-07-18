import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UnknownTorrentProviderApiException } from '../../../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../../../common';
import {
  ExtendedDetails,
  YtsMovieTorrent,
  YtsResponse,
  ITorrent,
} from '../interfaces';

export class YtsTorrentProvider extends BaseTorrentProvider {

  domains = ['yts.am', 'yts.unblocked.vet'];
  provider = 'Yts';

  private createEndpoint = (domain: string) => `https://${domain}/api/v2/list_movies.json`;

  private fetch(query: string): Observable<YtsResponse> {
    if (!this.api) {
      throw new UnknownTorrentProviderApiException(
        YtsTorrentProvider,
      );
    }

    return this.http.get<YtsResponse>(this.api, {
      params: {
        query_term: query,
        order_by: 'desc',
        sort_by: 'seeds',
        limit: String(50),
      },
    });
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
      this.api = await this.createReliableEndpoint(
        this.domains.map(domain => this.createEndpoint(domain))
      );
    });
  }

 provide(search: string, type: string, { imdbId }: ExtendedDetails = {}): Observable<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(<string>imdbId || search)
          .pipe(switchMap(({ data }) => {
            if (data.movie_count === 0) return [];

            return of(Utils.merge<ITorrent>(
              data.movies.map(
                ({ torrents }) => torrents.map(
                  (torrent) => this.formatTorrent(torrent)
                )
              )
            ));
          }));

      default:
          return of([]);
    }
  }

}
