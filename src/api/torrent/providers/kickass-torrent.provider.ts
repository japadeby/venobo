import {AxiosInstance} from 'axios';
import * as cheerio from 'cheerio';

import { ProviderUtils } from '../provider-utils';
import { MOVIES, SHOWS } from '../../../constants';
import { ITorrent, ITorrentProvider } from '../interfaces/index';
import {Utils} from '../../../utils';

export class KickassTorrentProvider implements ITorrentProvider {

  endpoints = ['https://kickassto.org', 'https://kat.unblocked.vet/'];
  provider = 'Kickass';
  api: AxiosInstance;

  private fetch(query: string) {//encodeURIComponent(query)
    return this.api.get(`usearch/${query}/`, {
      params: {
          field: 'seeders',
          sorder: 'desc',
      }
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  cheerio(html): any[] {
    const $ = cheerio.load(html);
    const { provider } = this;

    return $("table.data tr:not('.firstr')").slice(0, 10).map(function(this: any) {
      return {
        metadata: $(this).find('a.cellMainLink').text(),
        magnet: $(this).find('[title="Torrent magnet link"]').attr('href'),
        size: $(this).find('.nobr.center').text(),
        seeders: parseInt($(this).find('.green.center').text(), 10),
        leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
        verified: !!$(this).find('[title="Verified Torrent"]').length,
        provider: provider
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
