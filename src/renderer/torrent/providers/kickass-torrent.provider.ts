import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { PromiseUtils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ExtendedDetails, ITorrent } from '../interfaces';

export class KickassTorrentProvider extends BaseTorrentProvider {

  endpoints = ['https://kickassto.org', 'https://kat.unblocked.vet/'];
  provider = 'Kickass';
  api!: string;

  private fetch(query: string): Observable<ITorrent[]> {
    if (!this.api) {
      throw new UnknownTorrentProviderApiException(
        KickassTorrentProvider,
      );
    }

    return this.http.get(`${this.api}/usearch/${query}/`, {
      responseType: 'text',
      params: {
        field: 'seeders',
        sorder: 'desc',
      },
    }).pipe(
      map(res => this.cheerio(res)),
      catchError(() => of([])),
    );
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);
    const { provider } = this;

    // tslint:disable-next-line
    return $("table.data tr:not('.firstr')")/*.slice(0, 10)*/.map(function() {
      return {
        metadata: $(this).find('a.cellMainLink').text(),
        magnet: $(this).find('[title="Torrent magnet link"]').attr('href'),
        size: $(this).find('.nobr.center').text(),
        seeders: parseInt($(this).find('.green.center').text(), 10),
        leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
        verified: !!$(this).find('[title="Verified Torrent"]').length,
        provider: provider
      } as ITorrent;
    }).get() as any[];
  }

  create() {
    return PromiseUtils.didResolve(async () => {
      this.api = await this.createReliableEndpoint(this.endpoints);
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
