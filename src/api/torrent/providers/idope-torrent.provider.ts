import * as cheerio from 'cheerio';
import axios from 'axios';

import { ProviderUtils } from '../provider-utils';
import { Utils } from '../../../utils';
import { MOVIES, SHOWS } from '../../../constants';
import { ITorrentProvider, ITorrent } from '../interfaces';

export class iDopeTorrentProvider implements ITorrentProvider {

  endpoint = 'https://idope.se';
  provider = 'iDope';
  api = axios.create({
    baseURL: this.endpoint,
    timeout: 2000,
  });

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

  getStatus = () => Utils.promise.didResolve(() => this.api.get(''));

  cheerio(html) {
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
        provider: provider,
      } as ITorrent;
    }).get();
  }

  async provide(search, type, { season, episode }) {
    switch (type) {
      case MOVIES:
        return this.fetchMovies(search);

      case SHOWS:
        return this.fetchShows(
          `${search} ${ProviderUtils.formatSeasonEpisodeToString(season, episode)}`
        );

      default:
        return [];
    }
  }

}
