import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Utils, ObservableUtils, PromiseUtils } from '../../../services';
import { ProviderUtils } from '../provider.utils.service';
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
  // protected abstract readonly provider: string;

  // protected api!: string;

  protected readonly observableUtils: ObservableUtils;

  constructor(
    protected readonly providerUtils: ProviderUtils,
    protected readonly promiseUtils: PromiseUtils,
    protected readonly http: HttpClient,
    protected readonly utils: Utils,
    injector: Injector,
  ) {
    this.observableUtils = injector.get<ObservableUtils>(ObservableUtils);
  }

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

    return await this.promiseUtils.raceResolve<string>(requests);
  }

  /**
   * Create endpoint url by requesting the different domains and picking
   * the first one that is succesfully resolved
   * @param {string[]} endpoints
   * @param {3000} timeout
   * @param {"json"} responseType
   * @returns {Promise<string>}
   */
  /*protected async getReliableEndpoint(
    endpoints: Observable<string>,
    { timeout = 3000,
      responseType = 'json',
    }?: EndpointOptions,
  ): Observable<string> {
    const requests = endpoints.pipe(
      mergeMap(endpoint =>
        this.http.get(endpoint, {
          responseType,
        }).pipe(
          timeoutPipe(timeout),
          mapTo(endpoint),
          // catchError(() => empty()),
        ),
      ),
      filter(endpoint => !!endpoint),
    );

    race(requests).subscribe(endpoint => console.log(endpoint));
  }*/

}
