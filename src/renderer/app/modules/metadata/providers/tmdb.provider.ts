import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
// import { ConfigState } from '../../../renderer/stores/config.store';

// import tmdb from '../../../../config/tmdb.config.json';
import { AppConfig } from '../../../../environments';
import { BaseMetadataProvider } from './base-metadata.provider';
import { TMDbMovieResponse, TMDbResponse, TMDbShowResponse } from '../interfaces';

@Injectable()
export class TMDbProvider extends BaseMetadataProvider {

  private readonly api: AxiosInstance;

  constructor(/*private readonly config: ConfigState*/) {
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
  }

  private convertType(type: string) {
    return type === 'shows' ? 'tv' : 'movie';
  }

  private async getData<R extends TMDbResponse>(url: string, params?: any): Promise<R> {
    const { data } = await this.api.get(url, { params });

    return data;
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
    return this.getData(`${this.convertType(type)}/${tmdbId}/similar`);
  }

  public getRecommendations(type: string, tmdbId: number) {
    return this.getData(`${this.convertType(type)}/${tmdbId}/recommendations`);
  }

  public getPopular(type: string, page: number = 1) {
    return this.getData(`${this.convertType(type)}/popular`, { page });
  }

  public getTopRated(type: string, page: number = 1) {
    return this.getData(`${this.convertType(type)}/top_rated`, { page });
  }

  public get(type: string, tmdbId: number)  {
    return this.getData/*<TMDbMovieResponse & TMDbShowResponse>*/(`${this.convertType(type)}/${tmdbId}`);
  }

  public getShowSeason(tmdbId: number, season: number) {
    return this.getData(`tv/${tmdbId}/season/${season}`);
  }

  public getShowSeasonEpisode(tmdbId: number, season: number, episode: number) {
    return this.getData(`tv/${tmdbId}/season/${season}/episode/${episode}`);
  }

  public searchAll(query: string, page: number = 1) {
    return this.getData('search/multi', {
      include_adult: true,
      page,
      query,
    });
  }

  public discover(type: string, params?: any) {
    return this.getData(`discover/${this.convertType(type)}`, params);
  }

}
