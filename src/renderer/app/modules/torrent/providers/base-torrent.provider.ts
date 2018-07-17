import axios, { AxiosInstance } from 'axios';

import { Utils } from '../../../../../common';
import {
  ITorrent,
  ExtendedDetails,
} from '../interfaces';

export abstract class BaseTorrentProvider {

  /**
   * Endpoint domains for torrent provider
   */
  readonly domains?: string[];

  /**
   * Endpoint for torrent domain
   */
  readonly endpoint?: string;
  /**
   * Torrent provider
   */
  readonly provider: string;
  /**
   * HTTP module
   */
  abstract api: AxiosInstance;

  // fetch?(query: string): Promise<ITorrent[]>;

  /**
   * Fetch all torrent movies related to query
   * @param {string} query
   * @returns {Promise<ITorrent[]>}
   */
  // fetchMovies?(query: string): Promise<ITorrent[]>;

  /**
   * Fetch all torrent shows related to query
   * @param {string} query
   * @returns {Promise<ITorrent[]>}
   */
  // fetchShows?(query: string): Promise<ITorrent[]>;

  /**
   * Get status of torrent endpoint
   * @returns {Promise<boolean>}
   */
  abstract create(): Promise<boolean>;

  /**
   * Fetch movies / shows depending on IMDb ID
   * @param {string} search
   * @param {string} type
   * @param {ExtendedDetails} extendedDetails
   * @returns {Promise<ITorrent[]>}
   */
  abstract async provide(search: string, type: string, extendedDetails: ExtendedDetails): Promise<ITorrent[]>;

  /**
   * Transform html into a torrent list
   * @param {string} html
   * @returns {ITorrent[]}
   */
  cheerio?(html: string): any[]; // ITorrent[];

  private createApi(baseURL: string) {
    return axios.create({
      timeout: 5000,
      baseURL,
    });
  }

  protected async createReliableEndpointApi(endpoints: string[], timeout: number = 3000) {
    const requests = endpoints.map(async (endpoint) => {
      await axios.get(endpoint, { timeout });

      return endpoint;
    });

    const endpoint = await Utils.promise.raceResolve<string>(requests);

    return this.createApi(endpoint);
  }

}
