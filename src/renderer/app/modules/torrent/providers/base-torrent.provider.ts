import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Utils } from '../../../../../common';
import {
  ITorrent,
  ExtendedDetails,
} from '../interfaces';

export abstract class BaseTorrentProvider {

  /**
   * Endpoint domains for torrent provider
   */
  protected readonly domains?: string[];

  /**
   * Endpoint for torrent domain
   */
  protected readonly endpoint?: string;
  /**
   * Torrent provider
   */
  protected readonly provider: string;

  protected api!: string;

  constructor(protected readonly http: HttpClient) {}

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
  abstract provide(search: string, type: string, extendedDetails: ExtendedDetails): Observable<ITorrent[]>;

  /**
   * Transform html into a torrent list
   * @param {string} html
   * @returns {ITorrent[]}
   */
  cheerio?(html: string): any[]; // ITorrent[];

  /*private createApi(baseURL: string) {
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
  }*/

  protected async createReliableEndpoint(endpoints: string[], timeout: number = 3000): Promise<string> {
    const requests = endpoints.map(async (endpoint) => {
      await this.http.get(endpoint).toPromise();

      return endpoint;
    });

    return await Utils.promise.raceResolve<string>(requests);
  }

}
