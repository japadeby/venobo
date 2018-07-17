import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import { BaseTorrentProvider } from './base-torrent.provider';
import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../../../common';
import { ExtendedDetails, ITorrent } from '../interfaces/index';

export class ThePirateBayTorrentProvider extends BaseTorrentProvider {

  endpoints = ['https://thepiratebay.org', 'https://tpbship.org'];
  api!: AxiosInstance;
  provider = 'ThePirateBay';

  private fetch(query: string) {
    return <Promise<ITorrent[]>>
      this.api.get(`search/${query}/0/99/200`)
        .then(res => this.cheerio(res.data))
        .catch(() => []);
  }

  cheerio(html: string) {
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
    }).get() as any[];
  }

  create() {
    return Utils.promise.didResolve(async () => {
      this.api = await this.createReliableEndpointApi(this.endpoints);
    });
  }

  async provide(search: string, type: string, { season, episode }: ExtendedDetails): Promise<ITorrent[]> {
    switch (type) {
      case 'movies':
        return this.fetch(search);

      case 'shows':
        return this.fetch(
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(season, episode)}`
        );

      default:
        return [];
    }
  }

}
