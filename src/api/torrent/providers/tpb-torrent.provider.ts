import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../utils';
import { MOVIES, SHOWS } from '../../../constants';
import { ITorrent, ITorrentProvider } from '../interfaces/index';

export class ThePirateBayTorrentProvider implements ITorrentProvider {

  endpoints = ['https://thepiratebay.org', 'https://tpbship.org'];
  api: AxiosInstance;
  provider = 'ThePirateBay';

  private fetch(query) {
    return this.api.get(`search/${query}/0/99/200`)
      .then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  cheerio(html) {
      const $ = cheerio.load(html);
      const { provider } = this;

      return $('#main-content #searchResult tbody tr').slice(0, 10).map(function(this: any) {
         const $td = $(this).find('td');

         return {
             metadata: $td.eq(1).find('.detName .detLink').text(),
             magnet: $td.eq(1).find('[title="Download this torrent using magnet"]').attr('href'),
             size: $td.eq(1).find('.detDesc').text().split(',')[1].substring(6).replace('iB', 'B'), // GiB -> GB
             seeders: parseInt($td.eq(2).text(), 10),
             leechers: parseInt($td.eq(3).text(), 10),
             verified: !!$td.eq(1).find('img[src="https://tpbship.org/static/img/vip.gif"]').length,
             provider: provider,
         } as ITorrent;
      }).get();
  }

  getStatus() {
    return Utils.promise.didResolve(async () => {
      this.api = await ProviderUtils.createReliableEndpointApi(this.endpoints);
    });
  }

  async provide(search, type, { season, episode }) {
    switch (type) {
      case MOVIES:
        return this.fetch(search);

      case SHOWS:
        return this.fetch(
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(season, episode)}`
        );

      default:
        return [];
    }
  }

}
