import { BaseMetadataProvider } from './base-metadata.provider';
import { TMDbMovieResponse, TMDbResponse, TMDbShowResponse } from '../interfaces';

export class TMDbProvider extends BaseMetadataProvider {

  private fetch(url: string, params = {}) {
    return this.http.get<TMDbResponse>(`${this.config.api}/${url}`, {
      params: {
        api_key: this.config.key,
        // language: this.config.user.prefs.ietf,
        append_to_response: this.config.appendToResponse,
        ...params,
      },
    });
  }

  public formatEpisodePoster(path: string) {
    return this.config.still + path;
  }

  public formatBackdrop(path: string) {
    return this.config.backdrop + path;
  }

  public formatPoster(path: string) {
    return this.config.poster + path;
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
