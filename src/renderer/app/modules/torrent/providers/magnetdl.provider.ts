import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { ExtendedDetails, ITorrent } from '../interfaces';
import { Utils } from '../../../../../common';
import { ProviderUtils } from '../provider-utils';
import { BaseTorrentProvider } from './base-torrent.provider';

@Injectable()
export class MagnetDlTorrentProvider extends BaseTorrentProvider {

  endpoints = ['http://www.magnetdl.com', 'https://magnetdl.unblocked.vet'];
  provider = 'MagnetDl';

  private fetch(query: string): Observable<ITorrent[]> {
    return this.http.get(`${this.api}/${query.substring(0, 1)}/${query}`)
      .pipe(
        switchMap(res => this.cheerio(res)),
        catchError(() => of([])),
      );
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);
    const { provider } = this;

    return $('.download tbody tr:nth-child(2n+1)').slice(0, 10).map(function() {
      const $td = $(this).find('td');

      return {
        metadata: $td.eq(1).find('a').text(),
        magnet: $td.eq(0).find('a').attr('href'),
        size: $td.eq(5).text(),
        seeders: parseInt($td.eq(6).text(), 10),
        leechers: parseInt($td.eq(7).text(), 10),
        provider,
      } as ITorrent;
    }).get() as any[];
  }

  create() {
    return Utils.promise.didResolve(async () => {
      this.api = await this.createReliableEndpoint(this.endpoints);
    });
  }

  provide(search: string, type: string, extendedDetails: ExtendedDetails): Observable<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(search);

      case 'shows':
        return this.fetch(
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(extendedDetails)}`
        );

      default:
        return of([]);
    }
  }

}
