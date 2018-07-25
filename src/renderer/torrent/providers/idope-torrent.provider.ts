import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { PromiseUtils } from '../../globals';
import { UnknownTorrentProviderApiException } from '../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ITorrent, ExtendedDetails} from '../interfaces';

// tslint:disable-next-line
export class iDopeTorrentProvider extends BaseTorrentProvider {

  static provider = 'iDope';
  endpoint = 'https://idope.se';

  private fetch(type: string, query: string): Observable<ITorrent[]> {
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
    return PromiseUtils.didObservableResolve(
      this.http.get(this.api, {
        responseType: 'text',
      }).timeout(3000),
    );
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);

    // Get the ten first results and create a list
    return $('.resultdiv')/*.slice(0, 10)*/.map(function() {
      // a elements are hidden
      return {
        metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
        size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
        seeders: Number($(this).find('.resultdivbotton .resultdivbottonseed').text()),
        // leechers: null,
        // sadly fetching the magnet this way doesnt work lol
        magnet: this.providerUtils.constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
        provider: iDopeTorrentProvider.provider,
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
