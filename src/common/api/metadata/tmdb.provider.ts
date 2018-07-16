import axios, { AxiosInstance } from 'axios';
import { ConfigState } from '../../../renderer/stores/config.store';

import tmdb from '../../../../config/tmdb.config.json';
import { TMDbMovieResponse, TMDbResponse, TMDbShowResponse } from './interfaces';

export class TMDbProvider {

  public readonly api: AxiosInstance;

  constructor(private readonly config: ConfigState) {
    this.api = axios.create();

    // Move config to constructor when <https://github.com/axios/axios/issues/1616> is fixed
    this.api.interceptors.request.use(_config => ({
      ..._config,
      baseURL: tmdb.api,
      params: {
        api_key: tmdb.key,
        language: this.config.user.prefs.ietf,
        append_to_response: tmdb.append_to_response,
      },
    }));
  }

  private convertType(type: string) {
    return type === 'shows' ? 'tv' : 'movie';
  }

  private getData(url: string, params?: any) {
    return this.api.get(url, { params })
      .then(res => res.data);
  }

  public formatEpisodePoster(path: string) {
    return tmdb.still + path;
  }

  public formatBackdrop(path: string) {
    return tmdb.backdrop + path;
  }

  public formatPoster(path: string) {
    return tmdb.poster + path;
  }

  public getSimilar(type: string, tmdbId: number): Promise<TMDbResponse> {
    return this.getData(`${this.convertType(type)}/${tmdbId}/similar`);
  }

  public getRecommendations(type: string, tmdbId: number): Promise<TMDbResponse> {
    return this.getData(`${this.convertType(type)}/${tmdbId}/recommendations`);
  }

  public getPopular(type: string, page: number = 1): Promise<TMDbResponse> {
    return this.getData(`${this.convertType(type)}/popular`, { page });
  }

  public getTopRated(type: string, page: number = 1): Promise<TMDbResponse> {
    return this.getData(`${this.convertType(type)}/top_rated`, { page });
  }

  public get(type: string, tmdbId: number): Promise<TMDbMovieResponse & TMDbShowResponse>  {
    return this.getData(`${this.convertType(type)}/${tmdbId}`);
  }

  public getShowSeason(tmdbId: number, season: number) {
    return this.getData(`tv/${tmdbId}/season/${season}`);
  }

  public getShowSeasonEpisode(tmdbId: number, season: number, episode: number) {
    return this.getData(`tv/${tmdbId}/season/${season}/episode/${episode}`);
  }

  public searchAll(query: string, page: number = 1): Promise<TMDbResponse> {
    return this.getData('search/multi', {
      include_adult: true,
      page,
      query,
    });
  }

  public discover(type: string, params?: any): Promise<TMDbResponse> {
    return this.getData(`discover/${this.convertType(type)}`, params);
  }

}
