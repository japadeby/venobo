import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../../app/services';
import { USE_METADATA_CONFIG } from '../tokens';
import { MetadataConfig } from '../interfaces';

@Injectable()
export abstract class BaseMetadataProvider {

  constructor(
    @Inject(USE_METADATA_CONFIG)
    protected readonly config: MetadataConfig,
    protected readonly configService: ConfigService,
    protected readonly http: HttpClient
  ) {}

  public abstract getSimilar(type: string, tmdbId: number): Observable<Object>;

  public abstract getRecommendations(type: string, tmdbId: number): Observable<Object>;

  public abstract getPopular(type: string, page: number = 1): Observable<Object>;

  public abstract getTopRated(type: string, page: number = 1): Observable<Object>;

  public abstract get(type: string, tmdbId: number): Observable<Object>;

  public abstract getShowSeason(tmdbId: number, season: number): Observable<Object>;

  public abstract getShowSeasonEpisode(tmdbId: number, season: number, episode: number): Observable<Object>;

  public abstract discover(type: string, params?: any): Observable<Object>;

  public abstract searchAll(query: string, page: number = 1): Observable<Object>;

  public abstract formatEpisodePoster(path: string): string;

  public abstract formatBackdrop(path: string): string;

  public abstract formatPoster(path: string): string;

  protected convertType(type: string) {
    return type === 'shows' ? 'tv' : 'movie';
  }

}
