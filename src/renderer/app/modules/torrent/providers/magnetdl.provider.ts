import {AxiosInstance} from 'axios';

import { ExtendedDetails, ITorrent } from '../interfaces';
import { Utils } from '../../../../../common';
import { ProviderUtils } from '../provider-utils';
import { BaseTorrentProvider } from './base-torrent.provider';

export class MagnetDlTorrentProvider extends BaseTorrentProvider {

  endpoints = ['http://www.magnetdl.com', 'https://magnetdl.unblocked.vet'];
  provider = 'MagnetDl';
  api!: AxiosInstance;

  private fetch(query: string) {
    return this.api.get(`${query.substring(0, 1)}/${query}`)
      .then(res => this.cheerio(res.data))
      .catch(() => []);
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
      this.api = await this.createReliableEndpointApi(this.endpoints);
    });
  }

  async provide(search: string, type: string, { season, episode }: ExtendedDetails) {
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
