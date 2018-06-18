import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import {ITorrent, ITorrentProvider} from './torrent-provider.interface';
import {ProviderUtils} from '../provider-utils';

export class KickassTorrentProvider implements ITorrentProvider {

    endpoint = 'https://kickassto.org';
    provider = 'Kickass';
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: this.endpoint,
            timeout: 2000,
        });
    }

    private fetch(query: string) {//encodeURIComponent(query)
        return this.api.get(`usearch/${query}/`, {
            params: {
                field: 'seeders',
                sorder: 'desc',
            }
        }).then(({ data }) => this.cheerio(data))
            .catch(() => []);
    }

    cheerio(html) {
        const $ = cheerio.load(html);
        const { provider } = this;

        return $("table.data tr:not('.firstr')").slice(0, 10).map(function() {
            return {
                leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
                magnet: $(this).find('[title="Torrent magnet link"]').attr('href'),
                metadata: $(this).find('a.cellMainLink').text(),
                seeders: parseInt($(this).find('.green.center').text(), 10),
                verified: !!$(this).find('[title="Verified Torrent"]').length,
                size: $(this).find('.nobr.center').text(),
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