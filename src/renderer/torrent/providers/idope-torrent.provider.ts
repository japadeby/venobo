import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { PromiseUtils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ITorrent, ExtendedDetails} from '../interfaces';

// tslint:disable-next-line
export class iDopeTorrentProvider extends BaseTorrentProvider {

  provider = 'iDope';
  domains = [
    'https://idope.se',
    'https://idope.unblocked.vet',
  ];

  private fetch(type: string, query: string): Observable<ITorrent[]> {
    if (!this.endpoint) {
      throw new UnknownTorrentProviderApiException(
        iDopeTorrentProvider,
      );
    }

    return this.timeoutError(this.http.get(
      `${this.endpoint}/torrent-list/${query}/`,
      {
        responseType: 'text',
        params: {
          c: String(type === 'movies' ? 1 : 3),
        },
      }
    )).pipe(
      map(res => this.cheerio(res)),
    );
  }

  create() {
    return PromiseUtils.didResolve(async () => {
      this.endpoint = await this.createReliableEndpoint(this.domains);
    });
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);
    const { provider, providerUtils } = this;

    return $('.resultdiv').map(function() {
      // a elements are hidden
      return {
        metadata: $(this).find('.resultdivtop .resultdivtopname').text().trim(),
        size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
        seeders: Number($(this).find('.resultdivbotton .resultdivbottonseed').text()),
        leechers: null,
        // sadly fetching the magnet this way doesnt work lol
        magnet: providerUtils.constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
        provider,
      };
    }).get() as any[];
  }

  provide(search: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(type, search);

      case 'shows':
        return this.fetch(type,
          `${search} ${this.providerUtils.formatSeasonEpisodeToString(extendedDetails)}`
        );

      default:
        return of([]);
    }
  }

}
