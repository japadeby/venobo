import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { PromiseUtils, Utils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ExtendedDetails, ITorrent } from '../interfaces';

export class MagnetDlTorrentProvider extends BaseTorrentProvider {

  static provider = 'MagnetDl';

  domains = ['http://www.magnetdl.com', 'https://magnetdl.unblocked.vet'];

  private fetch(query: string): Observable<ITorrent[]> {
    query = Utils.slugify(query.toLowerCase());

    if (!this.api) {
      throw new UnknownTorrentProviderApiException(
        MagnetDlTorrentProvider,
      );
    }

    return this.timeoutError(
      this.http.get(`${this.endpoint}/${query.substring(0, 1)}/${query}`, {
        responseType: 'text',
      })
    ).pipe(
      map(res => this.cheerio(res)),
    );
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);

    return $('.download tbody tr:nth-child(2n+1)')/*.slice(0, 10)*/.map(function() {
      const $td = $(this).find('td');

      return {
        metadata: $td.eq(1).find('a').text(),
        magnet: $td.eq(0).find('a').attr('href'),
        size: $td.eq(5).text(),
        seeders: parseInt($td.eq(6).text(), 10),
        leechers: parseInt($td.eq(7).text(), 10),
        provider: MagnetDlTorrentProvider.provider,
      } as ITorrent;
    }).get() as any[];
  }

  create() {
    return PromiseUtils.didResolve(async () => {
      this.endpoint = await this.createReliableEndpoint(this.domains);
    });
  }

  provide(search: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(search);

      case 'shows':
        return this.fetch(
          `${search} ${this.providerUtils.formatSeasonEpisodeToString(extendedDetails)}`
        );

      default:
        return of([]);
    }
  }

}
