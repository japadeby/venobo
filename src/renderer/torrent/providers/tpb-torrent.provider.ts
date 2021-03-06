import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { PromiseUtils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ExtendedDetails, ITorrent } from '../interfaces';

export class ThePirateBayTorrentProvider extends BaseTorrentProvider {

  provider = 'ThePirateBay';
  domains = [
    'https://thepiratebay.org',
    'https://tpbship.org',
  ];

  private fetch(query: string): Observable<ITorrent[]> {
    if (!this.endpoint) {
      throw new UnknownTorrentProviderApiException(
        ThePirateBayTorrentProvider
      );
    }

    return this.timeoutError(
      this.http.get(`${this.endpoint}/search/${query}/0/99/200`, {
        responseType: 'text',
      })
    ).pipe(
      map(res => this.cheerio(res)),
    );
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);

    return $('#main-content #searchResult tbody tr').map(function() {
     const $td = $(this).find('td');

     return {
       metadata: $td.eq(1).find('.detName .detLink').text(),
       magnet: $td.eq(1).find('[title="Download this torrent using magnet"]').attr('href'),
       size: $td.eq(1).find('.detDesc').text().split(',')[1].substring(6).replace('iB', 'B'), // GiB -> GB
       seeders: parseInt($td.eq(2).text(), 10),
       leechers: parseInt($td.eq(3).text(), 10),
       verified: !!$td.eq(1).find('img[src="https://tpbship.org/static/img/vip.gif"]').length,
       provider: ThePirateBayTorrentProvider.provider,
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
