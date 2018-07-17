import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import { Utils } from '../../../../../common';
import { BaseTorrentProvider } from './base-torrent.provider';
import { ExtendedDetails, ITorrent } from '../interfaces';

export class KickassTorrentProvider extends BaseTorrentProvider {

  endpoints = ['https://kickassto.org', 'https://kat.unblocked.vet/'];
  provider = 'Kickass';
  api!: AxiosInstance;

  private fetch(query: string) {
    return this.api.get(`usearch/${query}/`, {
      params: {
        field: 'seeders',
        sorder: 'desc',
      }
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  cheerio(html: string) {
    const $ = cheerio.load(html);
    const { provider } = this;

    // tslint:disable-next-line
    return $("table.data tr:not('.firstr')").slice(0, 10).map(function() {
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
    return Utils.promise.didResolve(async () => {
      this.api = await this.createReliableEndpointApi(this.endpoints);
    });
  }

  async provide(search: string, type: string, { season, episode }: ExtendedDetails) {
    switch (type) {
      case MOVIES:
        return this.fetch(search);

      case SHOWS:
        return this.fetch(
          `${search} ${this.formatSeasonEpisodeToString(season, episode)}`
        );

      default:
        return [];
    }
  }

}
