import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
   * Torrent providerty
   */
  protected abstract readonly provider: string;

  /**
   * Endpoint domains for torrent provider
   */
  protected readonly domains?: string[];

  /**
   * Endpoint for torrent domain
   */
  protected abstract endpoint!: string;

  constructor(
    protected readonly providerUtils: ProviderUtils,
    protected readonly http: HttpClient,
  ) {}

  /**
   * Get status of torrent endpoint
   * @returns {Promise<boolean>}
   */
  protected abstract create(): Promise<boolean>;

  /**
   * Fetch movies / shows depending on IMDb ID
   * @param {string} search
   * @param {string} type
   * @param {ExtendedDetails} extendedDetails
   * @returns {Promise<ITorrent[]>}
   */
  protected abstract provide(search: string, type: string, extendedDetails: ExtendedDetails = {}): Observable<ITorrent[]>;

  /**
   * Timeout endpoint call
   * @param {Observable<T>} source$
   * @param {number} timeout
   * @returns {Observable<any>}
   */
  protected timeoutError<T>(source$: Observable<T>, timeout: number = 3000): Observable<T> {
    return source$.timeout(timeout).pipe(
      catchError(() => of([])),
    );
  }

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
