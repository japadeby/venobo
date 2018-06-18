import * as cheerio from 'cheerio';
import axios, { AxiosInstance } from 'axios';

import { ITorrentProvider, ITorrent } from './torrent-provider.interface';
import { ProviderUtils } from '../provider-utils';

export class iDopeTorrentProvider implements ITorrentProvider {

    endpoint = 'https://idope.se';
    provider = 'iDope';
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: this.endpoint,
            timeout: 2000,
        });
    }

  fetchMovies(query) {
    return this.api.get(`torrent-list/${query}/`, {
      params: {
        c: 1,
      },
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

  fetchShows(query) {
    return this.api.get(`torrent-list/${query}/`, {
      params: {
        c: 3,
      },
    }).then(res => this.cheerio(res.data))
      .catch(() => []);
  }

    getStatus() {
        return this.api.get('')
            .then(() => true)
            .catch(() => false);
    }

    cheerio(html): any[] {
        const $ = cheerio.load(html);
        const { provider } = this;

        // Get the ten first results and create a list
        return $('.resultdiv').slice(0, 10).map(function() {
            // a elements are hidden
            return {
                metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
                size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
                seeders: Number($(this).find('.resultdivbotton .resultdivbottonseed').text()),
                //leechers: null,
                // sadly fetching the magnet this way doesnt work lol
                magnet: ProviderUtils.constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
                _provider: provider,
            } as ITorrent;
        }).get();
    }

    async provide(imdbId, type, { search, season, episode }) {
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
