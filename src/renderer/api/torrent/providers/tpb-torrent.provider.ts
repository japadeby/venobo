import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

import { ProviderUtils } from '../provider-utils';
import { ITorrent, ITorrentProvider } from './torrent-provider.interface';

export class ThePirateBayTorrentProvider implements ITorrentProvider {

    endpoint = 'https://tpbship.org';
    provider = 'ThePirateBay';
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: this.endpoint,
            timeout: 2000,
        });
    }

    private fetch(query) {
        return this.api.get(`search/${query}/0/99/200`)
            .then(res => this.cheerio(res.data))
            .catch(() => []);
    }

    cheerio(html): any[] {
        const $ = cheerio.load(html);
        const { provider } = this;

        return $('#main-content #searchResult tbody tr').slice(0, 10).map(function(this: any) {
           const $td = $(this).find('td');

           return {
               metadata: $td.eq(1).find('.detName .detLink').text(),
               magnet: $td.eq(1).find('[title="Download this torrent using magnet"]').attr('href'),
               seeders: parseInt($td.eq(2).text(), 10),
               leechers: parseInt($td.eq(3).text(), 10),
               verified: !!$td.eq(1).find('img[src="https://tpbship.org/static/img/vip.gif"]').length,
               _provider: provider,
               size: '',
               //size: $td.eq(1).find('.detDesc').text(), //Uploaded 06-14 18:38, Size 1.38 GiB, ULed by xxxlavalxxx
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
