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

  public abstract getSimilar<R>(type: string, tmdbId: number): Observable<R>;

  public abstract getRecommendations<R>(type: string, tmdbId: number): Observable<R>;

  public abstract getPopular<R>(type: string, page: number): Observable<R>;

  public abstract getTopRated<R>(type: string, page: number = 1): Observable<R>;

  public abstract get<R>(type: string, tmdbId: number): Observable<R>;

  public abstract getShowSeason<R>(tmdbId: number, season: number): Observable<R>;

  public abstract getShowSeasonEpisode<R>(tmdbId: number, season: number, episode: number): Observable<R>;

  public abstract discover<R>(type: string, params?: any): Observable<R>;

  public abstract searchAll<R>(query: string, page: number = 1): Observable<R>;

  public abstract formatEpisodePoster(path: string): string;

  public abstract formatBackdrop(path: string): string;

  public abstract formatPoster(path: string): string;

  protected convertType(type: string) {
    return type === 'shows' ? 'tv' : 'movie';
  }

}
