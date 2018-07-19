import { Observable } from 'rxjs';

import { BaseMetadataProvider } from './base-metadata.provider';
import { AppConfig } from '../../../../environments';
import { TMDbMovieResponse, TMDbResponse, TMDbShowResponse } from '../interfaces';

export class TMDbProvider extends BaseMetadataProvider {

  /*constructor() {
    super();

    this.api = axios.create();

    // Move config to constructor when <https://github.com/axios/axios/issues/1616> is fixed
    this.api.interceptors.request.use(_config => ({
      ..._config,
      baseURL: AppConfig.tmdb.api,
      params: {
        api_key: AppConfig.tmdb.key,
        // language: this.config.user.prefs.ietf,
        append_to_response: AppConfig.tmdb.appendToResponse,
      },
    }));
  }*/

  private fetch<R extends TMDbResponse>(url: string, params = {}) {
    return this.http.get<R>(`${AppConfig.tmdb.api}/${url}`, {
      params: {
        api_key: AppConfig.tmdb.key,
        // language: this.config.user.prefs.ietf,
        append_to_response: AppConfig.tmdb.appendToResponse,
        ...params,
      },
    });
  }

  public formatEpisodePoster(path: string) {
    return AppConfig.tmdb.still + path;
  }

  public formatBackdrop(path: string) {
    return AppConfig.tmdb.backdrop + path;
  }

  public formatPoster(path: string) {
    return AppConfig.tmdb.poster + path;
  }

  public getSimilar(type: string, tmdbId: number) {
    return this.fetch(`${this.convertType(type)}/${tmdbId}/similar`);
  }

  public getRecommendations(type: string, tmdbId: number) {
    return this.fetch(`${this.convertType(type)}/${tmdbId}/recommendations`);
  }

  public getPopular(type: string, page: number = 1) {
    return this.fetch(`${this.convertType(type)}/popular`, { page });
  }

  public getTopRated(type: string, page: number = 1) {
    return this.fetch(`${this.convertType(type)}/top_rated`, { page });
  }

  public get(type: string, tmdbId: number)  {
    return this.fetch(`${this.convertType(type)}/${tmdbId}`);
  }

  public getShowSeason(tmdbId: number, season: number) {
    return this.fetch(`tv/${tmdbId}/season/${season}`);
  }

  public getShowSeasonEpisode(tmdbId: number, season: number, episode: number) {
    return this.fetch(`tv/${tmdbId}/season/${season}/episode/${episode}`);
  }

  public discover(type: string, params?: any) {
    return this.fetch(`discover/${this.convertType(type)}`, params);
  }

  public searchAll(query: string, page: number = 1) {
    return this.fetch('search/multi', {
      include_adult: true,
      page,
      query,
    });
  }

}
