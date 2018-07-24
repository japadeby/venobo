import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as xmlJs from 'xml-js';

import { ConfigService } from '../app/services';
import { ITorrent } from './interfaces';

export interface JacketSettings {
  host: string;
  key: string;
}

@Injectable()
export class JackettService {

  private readonly settings: JacketSettings;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpClient,
  ) {
    this.settings = this.config.get('jacket');
  }

  /*private convertType(type: 'movies' | 'shows') {
    return type === 'movies' ? 2000 : 5000;
  }

  private getIndexers() {
    const url = `${this.settings.host}/api/v2.0/indexers/all/results/torznab/api`;

    return this.http.get(url, {
      responseType: 'text',
      params: {
        apikey: this.settings.key,
        configured: 'true',
        t: 'indexers',
      },
    }).pipe(
      map(response => {
        const indexers = xmlJs.xml2js(response) as any;

        if (indexers && indexers.elements && indexers.elements[0] && indexers.elements[0].elements) {
          return indexers.elements[0].elements.map(indexer => indexer.attributes.id);
        }

        return [];
      }),
      catchError(() => of([])),
    );
  }

  public search(query: string, type: 'movies' | 'shows') {
    return this.getIndexers().pipe(
      mergeMap(indexer =>
        this.http.get(`${this.settings.host}/api/v2.0/indexers/${indexer}/results/torznab/api`, {
          responseType: 'text',
          params: {
            cat: this.convertType(type),
            apikey: this.settings.key,
            t: 'search',
            q: query,
          },
        }).pipe(
          map(response => {
            const torrents = xmlJs.xml2js(response) as any;
            const elements = torrents.elements[0].elements[0].elements;

            return elements.map(elem => {
              const attrs = elem.elements.map(subElem => {

              });
            });
          }),
        )
      )
    );
  }*/

}
