import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProviderUtils } from '../provider.utils.service';
import { PromiseUtils } from '../../globals';
import {
  ITorrent,
  ExtendedDetails,
} from '../interfaces';

export interface EndpointOptions {
  timeout?: number;
  responseType: any;
}

@Injectable()
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
   * Torrent providerty
   */
  protected abstract readonly provider: string;

  /**
   * API endpoint
   */
  // protected api!: string;

  constructor(
    protected readonly http: HttpClient,
    protected readonly providerUtils: ProviderUtils,
  ) {}

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
  abstract provide(search: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]>;

  /**
   * Create endpoint url by requesting the different domains and picking
   * the first one that is succesfully resolved
   * @param {string[]} endpoints
   * @param {3000} timeout
   * @param {"json"} responseType
   * @returns {Promise<string>}
   */
  protected async createReliableEndpoint(
    endpoints: string[],
    { timeout,
      responseType,
    }: EndpointOptions = {
      timeout: 3000,
      responseType: 'text',
    },
  ): Promise<string> {
    const requests = endpoints.map(async (endpoint) => {
      await (this.http.get(endpoint, {
        responseType,
      }).timeout(timeout)).toPromise();

      return endpoint;
    });

    return await PromiseUtils.raceResolve<string>(requests);
  }

}
