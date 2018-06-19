import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import { ProviderUtils } from '../provider-utils';
import { ITorrent, ITorrentProvider } from '../interfaces';

export class KickassTorrentProvider implements ITorrentProvider {

    endpoint = 'https://kickassto.org';
    provider = 'Kickass';
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: this.endpoint,
            timeout: 3000,
        });
    }

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
                _provider: provider
            } as ITorrent;
        }).get();
    }

    getStatus() {
        return this.api.get('')
            .then(() => true)
            .catch(() => false);
    }

    async provide(imdbId, type, { search, season, episode }) {
        switch (type) {
            case 'movies':
                return this.fetch(imdbId || search);

            case 'shows':
                return this.fetch(
                    `${search} ${ProviderUtils.formatSeasonEpisodeToString(season, episode)}`
                );

            default:
                return [];
        }
    }

}
