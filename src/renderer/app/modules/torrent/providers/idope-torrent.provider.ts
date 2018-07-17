import * as cheerio from 'cheerio';
import axios from 'axios';

import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../../../common';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ITorrent, ExtendedDetails} from '../interfaces';

// tslint:disable-next-line
export class iDopeTorrentProvider extends BaseTorrentProvider {

  endpoint = 'https://idope.se';
  provider = 'iDope';
  api = axios.create({
    baseURL: this.endpoint,
    timeout: 2000,
  });

  private fetchMovies(query: string) {
    return this.api.get(`torrent-list/${query}/`, {
      params: {
        c: 1,
      },
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  private fetchShows(query: string) {
    return this.api.get(`torrent-list/${query}/`, {
      params: {
        c: 3,
      },
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  create() {
    return Utils.promise.didResolve(async () => this.api.get(''));
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
      } as ITorrent;
    }).get() as any[];
  }

  async provide(search: string, type: string, { season, episode }: ExtendedDetails) {
    switch (type) {
      case 'movies':
        return this.fetchMovies(search);

      case 'shows':
        return this.fetchShows(
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(season, episode)}`
        );

      default:
        return [];
    }
  }

}
