import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as cheerio from 'cheerio';

import { UnknownTorrentProviderApiException } from '../../../exceptions';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ITorrent, ExtendedDetails} from '../interfaces';
import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../../../common';

// tslint:disable-next-line
export class iDopeTorrentProvider extends BaseTorrentProvider {

  provider = 'iDope';
  api = 'https://idope.se';

  private fetch(type: string, query: string): Observable<ITorrent[]> {
    if (!this.api) {
      throw new UnknownTorrentProviderApiException(
        iDopeTorrentProvider,
      );
    }

    return this.http.get(
      `${this.api}/torrent-list/${query}/`,
      {
        responseType: 'text',
        params: {
          c: String(type === 'movies' ? 1 : 3),
        },
      }
    ).pipe(
      switchMap(res => this.cheerio(res)),
      catchError(() => of([])),
    );
  }

  create() {
    return Utils.promise.didResolve(() => {
      return this.http.get(this.api, {
        responseType: 'text',
      }).toPromise();
    });
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);
    const { provider } = this;

    // Get the ten first results and create a list
    return $('.resultdiv').slice(0, 10).map(function() {
      // a elements are hidden
      return {
        metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
        size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
        seeders: Number($(this).find('.resultdivbotton .resultdivbottonseed').text()),
        // leechers: null,
        // sadly fetching the magnet this way doesnt work lol
        magnet: ProviderUtils.constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
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
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(extendedDetails)}`
        );

      default:
        return of([]);
    }
  }

}
